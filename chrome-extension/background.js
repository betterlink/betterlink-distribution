/**
 * Allows our extension to get around the Content Security Policy (CSP) of certain
 * sites (ex:github.com). We intercept the HTTP request headers and inject the
 * Betterlink domain as an accepted domain.
 *
 * Derived from:
 * https://www.planbox.com/blog/development/coding/bypassing-githubs-content-security-policy-chrome-extension.html
 */
chrome.webRequest.onHeadersReceived.addListener(function(details) {
  for (i = 0; i < details.responseHeaders.length; i++) {

    if (isCSPHeader(details.responseHeaders[i].name.toUpperCase())) {
      var csp = details.responseHeaders[i].value;

      // append "//code.betterlink.io" to the authorized sites
      csp = csp.replace('script-src', 'script-src https://code.betterlink.io http://code.betterlink.io');
      csp = csp.replace('style-src', 'style-src https://code.betterlink.io http://code.betterlink.io');

      details.responseHeaders[i].value = csp;
    }
  }

  return { responseHeaders: details.responseHeaders };
}, {
  urls: ["<all_urls>"],
  types: ["main_frame"]
}, ["blocking", "responseHeaders"]);


function isCSPHeader(headerName) {
  return (headerName == 'CONTENT-SECURITY-POLICY') || (headerName == 'X-WEBKIT-CSP');
}
