document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("sendBtn");
  const textarea = document.getElementById("chatInput");

  if (!button || !textarea) {
    console.error("Button or textarea not found in sidepanel.html");
    return;
  }

  button.addEventListener("click", async () => {
    const query = textarea.value.trim();
    if (!query) return;

    let tabs = await chrome.tabs.query({});
    let targetTab = tabs.find(tab => tab.url && tab.url.includes("claude.ai"));

    // If Claude.ai is NOT open, open a new tab
    if (!targetTab) {
      console.log("Claude tab not found, opening a new tab...");
      targetTab = await chrome.tabs.create({ url: "https://claude.ai", active: true });

      // Wait a little bit to allow Claude page to load
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      // If already open, focus on it
      await chrome.tabs.update(targetTab.id, { active: true });
    }

    setTimeout(() => {
      chrome.scripting.executeScript({
        target: { tabId: targetTab.id },
        args: [query, targetTab.url],
        func: async (userInput, tabUrl) => {
          if (tabUrl.includes("claude.ai")) {
            const editorWrapper = document.querySelector('div[aria-label="Write your prompt to Claude"] div.ProseMirror[contenteditable="true"]');
            if (!editorWrapper) {
              console.error("❌ Claude input editor not found");
              return;
            }

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
              console.log("✅ Claude: Message sent from sidepanel!");
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
