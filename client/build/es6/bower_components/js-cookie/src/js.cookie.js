(function(a){var b=!1;if('function'===typeof define&&define.amd&&(define(a),b=!0),'object'===typeof exports&&(module.exports=a(),b=!0),!b){var c=window.Cookies,d=window.Cookies=a();d.noConflict=function(){return window.Cookies=c,d}}})(function(){function a(){for(var a=0,b={};a<arguments.length;a++){var c=arguments[a];for(var d in c)b[d]=c[d]}return b}function b(c){function d(b,e,f){var g;if('undefined'!==typeof document){if(1<arguments.length){if(f=a({path:'/'},d.defaults,f),'number'===typeof f.expires){var h=new Date;h.setMilliseconds(h.getMilliseconds()+864e+5*f.expires),f.expires=h}f.expires=f.expires?f.expires.toUTCString():'';try{g=JSON.stringify(e),/^[\{\[]/.test(g)&&(e=g)}catch(a){}e=c.write?c.write(e,b):encodeURIComponent(e+'').replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),b=encodeURIComponent(b+''),b=b.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent),b=b.replace(/[\(\)]/g,escape);var j='';for(var k in f)f[k]&&(j+='; '+k,!0!==f[k])&&(j+='='+f[k]);return document.cookie=b+'='+e+j}b||(g={});for(var l=document.cookie?document.cookie.split('; '):[],m=/(%[0-9A-Z]{2})+/g,n=0;n<l.length;n++){var i=l[n].split('='),o=i.slice(1).join('=');this.json||'"'!==o.charAt(0)||(o=o.slice(1,-1));try{var p=i[0].replace(m,decodeURIComponent);if(o=c.read?c.read(o,p):c(o,p)||o.replace(m,decodeURIComponent),this.json)try{o=JSON.parse(o)}catch(a){}if(b===p){g=o;break}b||(g[p]=o)}catch(a){}}return g}}return d.set=d,d.get=function(a){return d.call(d,a)},d.getJSON=function(){return d.apply({json:!0},[].slice.call(arguments))},d.defaults={},d.remove=function(b,c){d(b,'',a(c,{expires:-1}))},d.withConverter=b,d}return b(function(){})});