document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("sendBtn");
    const textarea = document.getElementById("chatInput");
  
    if (!button || !textarea) {
      console.error("Button or textarea not found in popup.html");
      return;
    }
  
    button.addEventListener("click", async () => {
      const query = textarea.value.trim();
      if (!query) return;
  
      const tabs = await chrome.tabs.query({});
      const targetTab = tabs.find(tab => tab.url && tab.url.includes("claude.ai"));
  
      if (!targetTab) {
        alert("Please open Claude in a tab first");
        return;
      }
  
      await chrome.tabs.update(targetTab.id, { active: true });
  
      setTimeout(() => {
        chrome.scripting.executeScript({
          target: { tabId: targetTab.id },
          args: [query, targetTab.url],
          func: async (userInput, tabUrl) => {
            if (tabUrl.includes("claude.ai")) {
              const editorWrapper = document.querySelector('div[aria-label="Write your prompt to Claude"] div.ProseMirror[contenteditable="true"]');
              if (!editorWrapper) return console.error("❌ Claude input editor not found");
  
              editorWrapper.focus();
  
              function setEditorContent(element, text) {
                const range = document.createRange();
                const sel = window.getSelection();
                element.innerHTML = '';
                const p = document.createElement("p");
                p.textContent = text;
                element.appendChild(p);
                range.selectNodeContents(p);
                sel.removeAllRanges();
                sel.addRange(range);
  
                element.dispatchEvent(new Event("input", { bubbles: true }));
                element.dispatchEvent(new Event("keydown", { bubbles: true }));
                element.dispatchEvent(new Event("keyup", { bubbles: true }));
              }
  
              setEditorContent(editorWrapper, userInput);
              await new Promise(r => setTimeout(r, 300));
  
              const sendBtn = [...document.querySelectorAll('button[aria-label="Send message"]')]
                .find(btn => !btn.disabled && btn.offsetParent !== null);
  
              if (sendBtn) {
                sendBtn.click();
                console.log("✅ Claude: Message sent.");
                // document.getElementById("chatInput").value = "";


              } else {
                console.error("❌ Claude send button not found or disabled");
              }
            }
          }
        });
        // Clear the textarea after sending
        textarea.value = "";
      }, 300);
    });
  });
  