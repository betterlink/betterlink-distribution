/**
 * Allows our extension to get around the Content Security Policy (CSP) of certain
 * sites (ex:github.com). We intercept the HTTP request headers and inject the
 * Betterlink domain as an accepted domain.
 *
 * Derived from:
 * https://www.planbox.com/blog/development/coding/bypassing-githubs-content-security-policy-chrome-extension.html
 */
var styleSrcRegex = /\bstyle-src\b/;
var unsafeInlineRegex = /style-src[^;]*'unsafe-inline'/;
var nonceRegex = /style-src[^;]*'nonce-([^']*)'/;

chrome.webRequest.onHeadersReceived.addListener(function(details) {
  for (i = 0; i < details.responseHeaders.length; i++) {

    if (isCSPHeader(details.responseHeaders[i].name.toUpperCase())) {
      var csp = details.responseHeaders[i].value;

      // append "//code.betterlink.io" to the authorized sites
      csp = csp.replace('script-src', 'script-src code.betterlink.io');
      csp = csp.replace('style-src', 'style-src code.betterlink.io');
      csp = csp.replace('img-src', 'img-src code.betterlink.io');
      csp = handleStyleSrcNonce(csp, details.url);

      details.responseHeaders[i].value = csp;
    }
  }

  return { responseHeaders: details.responseHeaders };
}, {
  urls: ["<all_urls>"],
  types: ["main_frame"]
}, ["blocking", "responseHeaders"]);

// Respond to messages from Content Scripts asking if a
// nonce was provided in the Content Security Policy
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.checkNonce) {
      chrome.storage.local.get(sender.tab.url, function(items) {
        if(items && items[sender.tab.url]) {
          // clean up the nonce value that was stored so it's
          // not accidentally referenced by a future call to
          // this URL (ex: if the page no longer has CSP).
          var nonceValue = items[sender.tab.url];
          chrome.storage.local.remove(sender.tab.url);

          sendResponse({nonce: nonceValue});
        }
        else {
          sendResponse({nonce: ''});
        }
      });

      // keep addListener connection open for callback
      return true;
    }
  }
);

function isCSPHeader(headerName) {
  return (headerName == 'CONTENT-SECURITY-POLICY') || (headerName == 'X-WEBKIT-CSP');
}

// If the 'style-src' directive is supplied, then check if a nonce
// is provided as well. If so, use it. If not and there is no 'unsafe-
// inline', then create a new nonce.
//
// This is needed to allow us to create inline styles via Betterlink.
// http://www.w3.org/TR/CSP2/#script-src-nonce-usage
function handleStyleSrcNonce(csp, url) {
  if(styleSrcRegex.test(csp)) {
    var match = nonceRegex.exec(csp);
    var storage = {};
    if(match) {
      storage[url] = match[1];
      chrome.storage.local.set(storage);
    }
    else if(!unsafeInlineRegex.test(csp)) {
      var random = generateRandom();
      csp = csp.replace("style-src", "style-src 'nonce-" + random + "'");
      storage[url] = random;
      chrome.storage.local.set(storage);
    }
  }

  return csp;
}

// Randomly generates a unique identifier
function generateRandom() {
  var out = '';
  for(var i = 0, count = 8; i < count; i++) {
    out += (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  }
  return out;
}
