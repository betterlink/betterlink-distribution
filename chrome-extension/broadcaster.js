/**
 * Allows clients to send messages to the Extension, checking to see
 * if it is available.
 */
chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    if (request && request.ping) {
      sendResponse({pong: 200});
    }
    return true;
  }
);
