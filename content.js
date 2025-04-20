// State to track if sidebar is initialized and visible
let sidebarInitialized = false;
let sidebarVisible = false;

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggle_sidebar") {
    if (!sidebarInitialized) {
      initSidebar();
    } else {
      toggleSidebar();
    }
  }

  if (message.action === "show_notification") {
    alert("Claude Assistant Sidebar only works on Claude.ai");
  }
});

// Initialize the sidebar
function initSidebar() {
  const sidebarContainer = document.createElement('div');
  sidebarContainer.id = 'claude-sidebar-container';
  sidebarContainer.className = 'claude-sidebar';

  sidebarContainer.innerHTML = `
    <div class="claude-sidebar-header">
      <h3>Ask Claude a question</h3>
      <button id="claude-sidebar-close">&times;</button>
    </div>
    <div class="claude-sidebar-content">
      <textarea id="claude-question-input" placeholder="Type your question here..."></textarea>
      <button id="claude-submit-question" class="claude-submit-btn">Get Answer</button>
    </div>
  `;

  document.body.appendChild(sidebarContainer);

  document.getElementById('claude-sidebar-close').addEventListener('click', toggleSidebar);
  document.getElementById('claude-submit-question').addEventListener('click', submitQuestion);

  sidebarInitialized = true;
  sidebarVisible = true;
  sidebarContainer.classList.add('sidebar-visible');
}

// Toggle sidebar visibility
function toggleSidebar() {
  const sidebar = document.getElementById('claude-sidebar-container');
  if (sidebar) {
    sidebarVisible = !sidebarVisible;
    if (sidebarVisible) {
      sidebar.classList.add('sidebar-visible');
    } else {
      sidebar.classList.remove('sidebar-visible');
    }
  }
}

// Set value in React-controlled textarea
function setReactTextareaValue(element, value) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
  nativeInputValueSetter.call(element, value);

  const inputEvent = new Event('input', { bubbles: true });
  element.dispatchEvent(inputEvent);

  element.focus();
}

// Click helper with retries
async function clickWhenEnabled(button, maxAttempts = 5) {
  let attempts = 0;

  const attemptClick = async () => {
    attempts++;

    const isDisabled = button.disabled ||
      button.getAttribute('aria-disabled') === 'true' ||
      button.classList.contains('disabled');

    if (!isDisabled) {
      try {
        button.click();
        console.log("Button clicked successfully");
        return true;
      } catch (e) {
        console.error("Error clicking button:", e);
        try {
          button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
          button.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
          button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          console.log("Alternative click method used");
          return true;
        } catch (e2) {
          console.error("Alternative click also failed:", e2);
        }
      }
    } else {
      console.log(`Button is still disabled (attempt ${attempts}/${maxAttempts})`);
    }

    if (attempts >= maxAttempts) {
      console.error("Max attempts reached, giving up on clicking button");
      return false;
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    return attemptClick();
  };

  return attemptClick();
}

// Submit question to Claude
async function submitQuestion() {
  const questionText = document.getElementById('claude-question-input').value.trim();

  if (!questionText) {
    alert("Please enter a question before submitting.");
    return;
  }

  console.log("Attempting to submit question to Claude:", questionText);

  // Claude textarea selector
  const claudeInputField = document.querySelector('textarea[aria-label="Write your prompt to Claude"]');

  if (!claudeInputField) {
    alert("Could not find Claude's input field. Please make sure you're on Claude.ai and that the interface hasn't changed.");
    console.error("Claude input field not found using aria-label.");
    return;
  }

  // Set the value
  console.log("Setting value in Claude's input field");
  setReactTextareaValue(claudeInputField, questionText);

  // Claude submit button selector
  let submitButton = document.querySelector('button[aria-label="Send message"]');

  if (!submitButton) {
    alert("Could not find Claude's submit button. Please make sure you're on Claude.ai and that the interface hasn't changed.");
    console.error("Claude submit button not found using aria-label.");
    return;
  }

  // Click the submit button
  console.log("Attempting to click Claude's submit button");
  const clickSuccess = await clickWhenEnabled(submitButton);

  if (clickSuccess) {
    document.getElementById('claude-question-input').value = '';
    console.log("Question submitted successfully to Claude.");
  } else {
    alert("Could not submit the question to Claude. The submit button might be disabled or not responding.");
  }
}

// Auto-detect Claude.ai
if (window.location.href.includes("claude.ai")) {
  console.log("Claude Assistant Sidebar: On Claude.ai, ready to initialize");
  window.addEventListener('load', () => {
    // Uncomment below if you want the sidebar to auto-open on load
    // initSidebar();
  });
}
 