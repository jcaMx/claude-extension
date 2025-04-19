chrome.action.onClicked.addListener((tab) => {
    // Only enable the extension on Claude.ai
    if (tab.url.includes("claude.ai")) {
      chrome.tabs.sendMessage(tab.id, { action: "toggle_sidebar" });
    } else {
     
    }
  });