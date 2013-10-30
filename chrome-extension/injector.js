var betterlink;
if(!betterlink){
  (function(d,s,id){
    var js,fjs = d.getElementsByTagName(s)[0];
    if(!d.getElementById(id)){
    js=d.createElement(s); js.id = id; js.defer = true;
    js.src="//code.betterlink.co/betterlink.js";
    js.setAttribute('data-script-source','chrome extension');
    fjs.parentNode.insertBefore(js,fjs);}
  }(document,'script','betterlink-js'));
}