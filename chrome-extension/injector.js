var betterlink;
if(!betterlink){
  (function(d,s,id){
    var js,scripts = d.getElementsByTagName(s),fjs = scripts[0];
    if(!d.getElementById(id) && !scriptsInDomWithBetterlinkSource(scripts)){
    js=d.createElement(s); js.id = id; js.defer = true;
    js.setAttribute('data-script-source','chrome extension');
    js.src="//code.betterlink.io/betterlink.js";
    fjs.parentNode.insertBefore(js,fjs);}
  }(document,'script','betterlink-js'));

  // Chrome Extensions run in an 'isolated world' and cannot
  // interact with JavaScript variables or functions created
  // by the page.
  // http://developer.chrome.com/extensions/content_scripts.html
  // Instead, we can check against the source files for Betterlink
  function scriptsInDomWithBetterlinkSource(scripts) {
    var foundScripts = false;
    // match against a Betterlink script (ex: /betterlink-bespoke.js),
    // excluding poorly-named scripts on the Betterlink homepage
    var scriptInSource = /\/betterlink(?!-site)[^\/]*\.js/;
    for(var i = 0, len = scripts.length; i < len; i++) {
      if(scriptInSource.test(scripts[i].src)) {
        foundScripts = true;
        break;
      }
    }
    return foundScripts;
  }
}
