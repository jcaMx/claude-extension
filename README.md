# Claude Assistant Chrome Extension

This Chrome Extension integrates with Claude.ai by providing a **sidebar interface** to ask questions directly through Claude's UI. If the Claude tab is not already open, the extension will automatically open Claude.ai in a new tab.

## Features

- **Sidebar Integration**: A persistent sidebar that allows users to interact with Claude.ai directly from the extension.
- **Automatic Claude Tab Opening**: If Claude.ai is not open, the extension will automatically open a new tab with `https://claude.ai`.
- **Message Sending**: Send queries to Claude.ai directly from the sidebar.
- **Textarea Clearing**: Clears the text input area after sending the question.
- **Automatic Focus on Input**: Focuses on Claude’s text input area and simulates entering text.
- **Error Handling**: Displays relevant error messages if the Claude input editor or send button is not found.

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to chrome://extensions/
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. Visit Claude.ai and click the extension icon to toggle the sidebar

## Usage

1. Click the extension icon while on Claude.ai
2. If the Claude sidebar extension icon is not clickable, click the three buttons in the right and click "Open side panel"
2. Type your question in the sidebar
3. Click "Get Answer" to submit your question to Claude
4. Continue the conversation in the main Claude interface


## Claude Selectors (as of April 27, 2025)

To interact with Claude.ai, the following selectors are used:

- **Send Button**:
  ```js
  const sendBtn = [...document.querySelectorAll('button[aria-label="Send message"]')]

- **Editor Input Area**:
  ```js
    const editorWrapper = document.querySelector('div[aria-label="Write your prompt to Claude"] div.ProseMirror[contenteditable="true"]');



## Privacy

This extension does not store or share any personal data. All interactions are between the user and Claude.ai directly. The extension only operates within your browser and does not transmit any personal information or interaction data to third parties.

The extension does not collect:

- Any personal user data

- Your questions or inputs to Claude.ai

- Your browsing history (other than opening Claude.ai tabs)

The extension simply automates interactions with the Claude interface and ensures that you can easily send queries and get answers without navigating manually.

For questions or concerns, please reach out to the extension's developers.



