(function(){
var f=!0,k=null,l=!1;Array.prototype.indexOf||(Array.prototype.indexOf=function(a,b){var d=this.length,c=Number(b)||0,c=0>c?Math.ceil(c):Math.floor(c);for(0>c&&(c+=d);c<d;c+=1)if(c in this&&this[c]===a)return c;return-1});var m=/BackCompat/i.test(window.document.compatMode)?window.document.body:window.document.documentElement;
function n(){var a={v:0,exist:l,done:l,tag_template:'<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0"width="{$sWidth}" height="{$sHeight}" style="border:none;padding:0;margin:0"><param name="movie" value="{$sSrc}"><param name="flashvars" value="{$flashVars}"><param name="allowScriptAccess" value="always"><param name="quality" value="autohigh"><param name="bgcolor" value="#fff"><param name="wmode" value="opaque"><embed src="{$sSrc}"flashvars="{$flashVars}"quality="autohigh"allowscriptaccess="always"swliveconnect="FALSE"width="{$sWidth}"height="{$sHeight}"wmode="opaque"type="application/x-shockwave-flash"pluginspage="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash"></object>'},b=
k;this.p=function(){if(b!==k)return b();if(-1!==window.navigator.userAgent.toLowerCase().indexOf("msie"))try{if("undefined"!==typeof new ActiveXObject("ShockwaveFlash.ShockwaveFlash")){var d=(new ActiveXObject("ShockwaveFlash.ShockwaveFlash")).GetVariable("$version");a.v=parseInt(d.match(/([0-9]+)/)[0],10);a.exist=f}}catch(c){}else"undefined"!==typeof navigator.plugins["Shockwave Flash"]&&(a.v=parseInt(navigator.plugins["Shockwave Flash"].description.match(/\d+\.\d+/),10),a.exist=0!==a.v?f:l);a.done=
f;b=function(){return a};return b()}}
n.prototype={offsetY:function(){var a=k;a===k&&(a="undefined"!==typeof window.scrollY?function(){return Math.max(0,window.scrollY)}:"undefined"!==typeof window.pageYOffset?function(){return Math.max(0,window.pageYOffset)}:function(){return Math.max(0,m.scrollTop)});return a()},offsetX:function(){var a=k;a===k&&(a="undefined"!==typeof window.scrollX?function(){return Math.max(0,window.scrollX)}:"undefined"!==typeof window.pageXOffset?function(){return Math.max(0,window.pageXOffset)}:function(){return Math.max(0,
m.scrollLeft)});return a()}};function q(a,b,d){"undefined"!==typeof a.addEventListener?a.addEventListener(b,d,f):"undefined"!==typeof a.attachEvent&&a.attachEvent("on"+b,d)}function r(a,b){return"undefined"===typeof a[b]?k:a[b]}function s(a,b){a.style.opacity=b;a.style.filter="alpha(opacity="+100*b+")"}function t(a){switch(a){case 1:return"_blank";case 2:return"_top";default:return"_top"}}
function u(a){a=a.match(/\\u[0-9a-fA-F]{4}/g);var b="";if(a===k)return"";for(var d=0;d<a.length;d+=1)b+=String.fromCharCode(a[d].replace("\\u","0x"));return b}function v(a,b){return"script"===b.nodeName.toLowerCase()?b:v(a,b.lastChild)}function w(a){return window.document.getElementById(a)}function x(a){return window.document.createElement(a)}
function y(a){var b=window.document.createElement("img");b.setAttribute("src",a);b.setAttribute("style","display:none;position:absolute;border:none;padding:0;margin:0;");b.setAttribute("width",0);b.setAttribute("height",0);b.setAttribute("border",0);return b}function z(){var a=k;a===k&&(a=function(){return Math.max(m.clientWidth,m.scrollWidth)});return a()}
function A(){var a=k;a===k&&(a="undefined"!==typeof window.innerWidth?function(){return window.innerWidth}:function(){return m.clientWidth});return a()}function B(){var a=k;a===k&&(a="undefined"!==typeof window.innerHeight?function(){return window.innerHeight}:function(){return m.clientHeight});return a()}function C(){}
C.logly=function(){var a="",b=window.document.referrer;try{a=window.parent.document.referrer}catch(d){}try{b=window.parent.document.URL}catch(c){}return y(("https:"===window.document.location.protocol?"https://":"http://")+"dsp.logly.co.jp/sg.gif?"+("sid=1&aid=$luid&url="+escape(b)+"&rurl="+escape(a)))};C.scaleout=function(){return y("http://bid.socdm.com/rtb/sync?proto=adingo&sspid=adingo&tp="+encodeURIComponent(window.document.location.href)+"&pp="+encodeURIComponent(window.document.referrer)+"&t=.gif")};
C.fout=function(){return y("http://sync.fout.jp/sync?xid=fluct")};C.t=function(a,b,d){for(var c in d)"logly"===c?b.parentNode.insertBefore(C[c](a,d[c]),b):b.parentNode.insertBefore(C[c](a),b)};
if("undefined"===typeof window.adingoFluct){var D=function(){this.c=new n;this.data={};this.g=[];this.h=[];this.b=k;this.d=l;this.e=k;this.w=l;this.a={};this.f=k;this.n=l;this.r={};this.l=l};D.prototype={m:function(a){var b={};b.tag=v(this.c,a);a=b.tag.src;if(!(0>a.indexOf("?"))){a=a.substring(a.indexOf("?")+1);for(var d=a.split("&"),c=d.length,e=0;e<c;e+=1){var g=d[e].split("=");b[g[0]]=g[1]}b.requestQuery=a}this.data[b.G]=b;this.data[b.G].load_status=0},o:function(a){if("success"===a.status){var b=
w("fluctAdLoader_"+a.G);b.parentNode.removeChild(b);b=this.data[a.G];b.load_status=2;b.json=a;b=this.g.slice(0);this.g=[];if(0<b.length){if(this.n===l){var d=b.shift();C.t(this.c,w("adingoFluctUnit_"+d),a.syncs);this.j(d);this.n=f}for(;0<b.length;)a=b.shift(),a!==k&&this.j(a)}}var b=a=0,c;for(c in this.data)a+=1,2===this.data[c].load_status&&(b+=1);a===b&&(this.h=[])},s:function(a,b){var d=r(this.data[a],"rate");if(d===k||0>=parseInt(d,10))d=60;this.f=setTimeout(function(){window.adingoFluct.reload(a,
b)},1E3*d)},reload:function(a,b){this.f!==k&&(clearTimeout(this.f),this.f=k);this.data[a].load_status=D.NONE;this.g.push(b);this.load(a)},load:function(a){var b=k,d=this.data[a],b="undefined"!==typeof d.url?d.url:"http://y-nomura.sh.adingo.jp.dev.fluct.me/api/json/v1/?";d.load_status=1;var c=b=b+d.requestQuery+"&cb=adingoFluct.callback&ttl="+Math.random(),b=x("script");b.setAttribute("id","fluctAdLoader_"+a);b.src=c;a=d.tag;a.parentNode.insertBefore(b,a.nextSibling)},j:function(a){var b=k;if(-1===
this.h.indexOf(a)){var d=w("adingoFluctUnit_"+a);if(d===k){d=x("div");d.setAttribute("id","adingoFluctUnit_"+a);var c=v(this.c,window.document);c.parentNode.insertBefore(d,c.nextSibling)}for(var e in this.data)if(d=this.data[e],"undefined"!==typeof d.load_status&&2===d.load_status)for(c=0;c<d.json.num;c+=1){var g=d.json.ads[c];if(String(g.unit_id)===a){b=[e,g];break}}else-1===this.h.indexOf(a)&&this.g.push(a),0===d.load_status&&this.load(e);b!==k&&(this.h.push(a),this.q(b))}},q:function(a){var b=
a.shift();a=a.shift();var d="adingoFluctUnit_"+a.unit_id,c=a.unit_id,e=w("adingoFluctUnit_"+c),c=w("adingoFluctOverlay_"+c);if(c===k)for(;e.firstChild;)e.removeChild(e.firstChild);else for(;c.firstChild;)c.removeChild(c.firstChild);var g=k;if(1===a.overlay){var e=w("adingoFluctUnit_"+a.unit_id),c=x("div"),h=a.height+"px",p=a.width+"px";c.setAttribute("id","adingoFluctOverlay_"+a.unit_id);c.setAttribute("class","adingoFluctOverlay");c.setAttribute("style","width:"+p+";height:"+h+";bottom:0px;left:0px;position:absolute;z-index:9993;display:none;font-size:18px;line-height:1.5em;visibility:visible;opacity:0;verticalAlign:middle;padding:0px;margin:0px;border:none;overflow: hidden;");
e.appendChild(c);e="adingoFluctOverlay_"+a.unit_id}else e=d;g=e;switch(a.creative_type){case "html":var e=w(g),c="adingoFluctIframe_"+a.unit_id,h=a.width+"px",p=a.height+"px",j=x("iframe"),E="0px";1===r(a,"overlay")&&(E="-4px");j.setAttribute("id",c);j.setAttribute("style","width:"+h+";height:"+p+";border:none;padding:0;margin:0;margin-bottom:"+E+";pointer-events:auto;");j.setAttribute("marginwidth",0);j.setAttribute("marginheight",0);j.setAttribute("allowtransparency","false");j.setAttribute("vspace",
0);j.setAttribute("hspace",0);j.setAttribute("frameborder",0);j.setAttribute("scrolling","no");e.appendChild(j);e=j.contentWindow.document;e.open();e.write('<html><head></head><body style="padding:0px;margin:0px;border:none;">'+a.html+"</body></html>");e.close();break;case "flash":e=g;c=this.c.p();e=w(e);c.exist&&5<c.v?(h="clickTAG="+escape(a.landing_url)+"&targetTAG="+t(a.open),c=c.tag_template.replace(/\{\$sWidth\}/g,a.width),c=c.replace(/\{\$sHeight\}/g,a.height),c=c.replace(/\{\$sSrc\}/g,a.creative_url),
c=c.replace(/\{\$flashVars\}/g,h),e.innerHTML=c):a.alt_mage!==k&&""!==a.alt_mage&&(c=x("img"),c.setAttribute("src",a.alt_image),c.setAttribute("width",a.width),c.setAttribute("height",a.height),c.setAttribute("border",0),c.setAttribute("style","border:none;padding:0;margin:0;"),0<a.alt.length&&c.setAttribute("alt",u(a.alt)),h=x("a"),h.setAttribute("href",a.landing_url),h.setAttribute("target",t(a.open)),e.appendChild(h),h.appendChild(c));break;case "image":e=w(g),c=x("img"),c.setAttribute("src",a.creative_url),
c.setAttribute("width",a.width),c.setAttribute("height",a.height),c.setAttribute("border",0),c.setAttribute("style","border:none;padding:0;margin:0;"),0<a.alt.length&&c.setAttribute("alt",u(a.alt)),h=x("a"),h.setAttribute("href",a.landing_url),h.setAttribute("target",t(a.open)),e.appendChild(h),h.appendChild(c)}1===a.overlay&&(this.i(g,500),this.l===l&&(q(window.document,"touchstart",function(a){window.adingoFluct.k(a)}),q(window,"resize",function(a){window.adingoFluct.k(a)}),this.e=setTimeout(function(){window.adingoFluct.move(g)},
100),this.l=f));d=w(d);e=y(a.beacon);d.appendChild(e);1===r(a,"reload")&&(this.r[b]=a,this.s(b,a.unit_id))},k:function(a){if(a.srcElement.offsetParent===k||"undefined"===typeof a.srcElement.offsetParent||"undefined"===typeof a.srcElement.offsetParent.className||"adingoFluctOverlay"!==a.srcElement.offsetParent.className){this.b!==k&&(this.d===l?(clearTimeout(this.b),this.b=k):(clearTimeout(this.b),this.b=k,this.d=l));for(var b in this.a)this.i(b,1E3)}},u:function(){for(var a in this.a)this.i(a,1E3)},
i:function(a,b){this.a[a]={};this.a[a].winPosX=this.c.offsetX();this.a[a].winPosY=this.c.offsetY();this.a[a].winH=B();if(!this.d&&!(B()<A())){this.d=f;var d=w(a);d.style.display="block";var c,e=this.c,g=parseInt(d.style.width,10),h=parseInt(d.style.height,10);c=""!==m.style.zoom?g*m.style.zoom:A()>z()?A()>=g?z()/A():z()/g:A()===z()?1:A()>=g?1:A()/g;var p=""===m.style.zoom?1:m.style.zoom,j=Math.max(0,e.offsetY()),e=e.offsetX(),g=(A()-g*p*c)/p/c/2+e/p/c,h=(j+B()-h*p*c)/p/c,p=j/p/c;if(e=0<j)j+=B(),e=
k,e===k&&(e=function(){return Math.max(m.clientHeight,m.scrollHeight)}),e=e(),e=j>=e-4;e&&(h=p);c={x:g,y:h,zoom:c};j=Math.max(0,c.x)+"px";g=c.y+"px";d.style.zoom=c.zoom;s(d,0);d.style.top=g;d.style.left=j;d=k;this.b=setTimeout(function(){window.adingoFluct.show(a,0)},b)}},show:function(a,b){clearTimeout(this.b);this.b=k;var d=w(a);b+=0.09;s(d,b);d=k;1>=b?this.b=setTimeout(function(){window.adingoFluct.show(a,b)},24):this.d=l},move:function(a){var b=l;if(r(this.a,a)!==k){var d=this.a[a].winPosY,c=
this.a[a].winH;if(this.a[a].winPosX!==this.c.offsetX()||d!==this.c.offsetY()||c!==B())b=f;B()<A()?s(w(a),0):b&&(s(w(a),0),this.a[a].winPosX=this.c.offsetX(),this.a[a].winPosY=this.c.offsetY(),this.a[a].winH=B(),this.b!==k&&(clearTimeout(this.b),this.b=k,this.d!==l&&(this.d=l)),this.i(a,500))}clearTimeout(this.e);this.e=k;this.e=setTimeout(function(){window.adingoFluct.move(a)},100)}};D.prototype.showAd=D.prototype.j;D.prototype.callback=D.prototype.o;D.prototype.setGroup=D.prototype.m;D.prototype.touchHandler=
D.prototype.k;D.prototype.resizeHandler=D.prototype.u;window.adingoFluct=new D}window.adingoFluct.m(window.document);
}());
