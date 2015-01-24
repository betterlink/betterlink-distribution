/**
 * Allows our extension to get around the Content Security Policy (CSP) of certain
 * sites (ex:github.com). We intercept the HTTP request headers and inject the
 * Betterlink domain as an accepted domain.
 *
 * Derived from:
 * https://www.planbox.com/blog/development/coding/bypassing-githubs-content-security-policy-chrome-extension.html
 */
var styleSrcRegex = /\bstyle-src\b/;
var nonceRegex = /style-src[^;]*'nonce-([^']*)'/;
var nonceValues = {};

chrome.webRequest.onHeadersReceived.addListener(function(details) {
  for (i = 0; i < details.responseHeaders.length; i++) {

    if (isCSPHeader(details.responseHeaders[i].name.toUpperCase())) {
      var csp = details.responseHeaders[i].value;

      // append "//code.betterlink.io" to the authorized sites
      csp = csp.replace('script-src', 'script-src https://code.betterlink.io http://code.betterlink.io');
      csp = csp.replace('style-src', 'style-src https://code.betterlink.io http://code.betterlink.io');
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
      sendResponse({nonce: nonceValues[sender.tab.url]});
    }
  }
);

function isCSPHeader(headerName) {
  return (headerName == 'CONTENT-SECURITY-POLICY') || (headerName == 'X-WEBKIT-CSP');
}

// If the 'style-src' directive is supplied, then check if a nonce
// is provided as well. If so, use it. If not, create one.
//
// This is needed to allow us to create inline styles via Betterlink.
// http://www.w3.org/TR/CSP2/#script-src-nonce-usage
function handleStyleSrcNonce(csp, url) {
  if(styleSrcRegex.test(csp)) {
    var match = nonceRegex.exec(csp);
    if(match) {
      nonceValues[url] = match[1];
    }
    else {
      var random = generateRandom();
      csp = csp.replace("style-src", "style-src 'nonce-" + random + "'");
      nonceValues[url] = random;
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
