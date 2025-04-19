document.addEventListener('DOMContentLoaded', function() {
  const questionInput = document.getElementById('claude-question-input');
  const submitButton = document.getElementById('claude-submit-question');
  
  submitButton.addEventListener('click', function() {
    const question = questionInput.value.trim();
    
    if (question) {
      // Send message to content script
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "submit_question",
          question: question
        });
      });
      
      // Clear the input field
      questionInput.value = '';
    }
  });
});