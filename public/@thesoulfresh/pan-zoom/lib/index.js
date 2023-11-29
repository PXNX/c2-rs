!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var n=t();for(var r in n)("object"==typeof exports?exports:e)[r]=n[r]}}(window,(function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=9)}([function(e,t,n){"use strict";var r=n(7);e.exports=r&&function(){var e=!1;try{var t=Object.defineProperty({},"passive",{get:function(){e=!0}});window.addEventListener("test",null,t),window.removeEventListener("test",null,t)}catch(t){e=!1}return e}()},function(e,t,n){"use strict";var r,o="object"==typeof Reflect?Reflect:null,i=o&&"function"==typeof o.apply?o.apply:function(e,t,n){return Function.prototype.apply.call(e,t,n)};r=o&&"function"==typeof o.ownKeys?o.ownKeys:Object.getOwnPropertySymbols?function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:function(e){return Object.getOwnPropertyNames(e)};var u=Number.isNaN||function(e){return e!=e};function s(){s.init.call(this)}e.exports=s,e.exports.once=function(e,t){return new Promise((function(n,r){function o(){void 0!==i&&e.removeListener("error",i),n([].slice.call(arguments))}var i;"error"!==t&&(i=function(n){e.removeListener(t,o),r(n)},e.once("error",i)),e.once(t,o)}))},s.EventEmitter=s,s.prototype._events=void 0,s.prototype._eventsCount=0,s.prototype._maxListeners=void 0;var c=10;function f(e){if("function"!=typeof e)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof e)}function a(e){return void 0===e._maxListeners?s.defaultMaxListeners:e._maxListeners}function l(e,t,n,r){var o,i,u,s;if(f(n),void 0===(i=e._events)?(i=e._events=Object.create(null),e._eventsCount=0):(void 0!==i.newListener&&(e.emit("newListener",t,n.listener?n.listener:n),i=e._events),u=i[t]),void 0===u)u=i[t]=n,++e._eventsCount;else if("function"==typeof u?u=i[t]=r?[n,u]:[u,n]:r?u.unshift(n):u.push(n),(o=a(e))>0&&u.length>o&&!u.warned){u.warned=!0;var c=new Error("Possible EventEmitter memory leak detected. "+u.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");c.name="MaxListenersExceededWarning",c.emitter=e,c.type=t,c.count=u.length,s=c,console&&console.warn&&console.warn(s)}return e}function v(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function d(e,t,n){var r={fired:!1,wrapFn:void 0,target:e,type:t,listener:n},o=v.bind(r);return o.listener=n,r.wrapFn=o,o}function p(e,t,n){var r=e._events;if(void 0===r)return[];var o=r[t];return void 0===o?[]:"function"==typeof o?n?[o.listener||o]:[o]:n?function(e){for(var t=new Array(e.length),n=0;n<t.length;++n)t[n]=e[n].listener||e[n];return t}(o):h(o,o.length)}function y(e){var t=this._events;if(void 0!==t){var n=t[e];if("function"==typeof n)return 1;if(void 0!==n)return n.length}return 0}function h(e,t){for(var n=new Array(t),r=0;r<t;++r)n[r]=e[r];return n}Object.defineProperty(s,"defaultMaxListeners",{enumerable:!0,get:function(){return c},set:function(e){if("number"!=typeof e||e<0||u(e))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");c=e}}),s.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},s.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||u(e))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+e+".");return this._maxListeners=e,this},s.prototype.getMaxListeners=function(){return a(this)},s.prototype.emit=function(e){for(var t=[],n=1;n<arguments.length;n++)t.push(arguments[n]);var r="error"===e,o=this._events;if(void 0!==o)r=r&&void 0===o.error;else if(!r)return!1;if(r){var u;if(t.length>0&&(u=t[0]),u instanceof Error)throw u;var s=new Error("Unhandled error."+(u?" ("+u.message+")":""));throw s.context=u,s}var c=o[e];if(void 0===c)return!1;if("function"==typeof c)i(c,this,t);else{var f=c.length,a=h(c,f);for(n=0;n<f;++n)i(a[n],this,t)}return!0},s.prototype.addListener=function(e,t){return l(this,e,t,!1)},s.prototype.on=s.prototype.addListener,s.prototype.prependListener=function(e,t){return l(this,e,t,!0)},s.prototype.once=function(e,t){return f(t),this.on(e,d(this,e,t)),this},s.prototype.prependOnceListener=function(e,t){return f(t),this.prependListener(e,d(this,e,t)),this},s.prototype.removeListener=function(e,t){var n,r,o,i,u;if(f(t),void 0===(r=this._events))return this;if(void 0===(n=r[e]))return this;if(n===t||n.listener===t)0==--this._eventsCount?this._events=Object.create(null):(delete r[e],r.removeListener&&this.emit("removeListener",e,n.listener||t));else if("function"!=typeof n){for(o=-1,i=n.length-1;i>=0;i--)if(n[i]===t||n[i].listener===t){u=n[i].listener,o=i;break}if(o<0)return this;0===o?n.shift():function(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}(n,o),1===n.length&&(r[e]=n[0]),void 0!==r.removeListener&&this.emit("removeListener",e,u||t)}return this},s.prototype.off=s.prototype.removeListener,s.prototype.removeAllListeners=function(e){var t,n,r;if(void 0===(n=this._events))return this;if(void 0===n.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==n[e]&&(0==--this._eventsCount?this._events=Object.create(null):delete n[e]),this;if(0===arguments.length){var o,i=Object.keys(n);for(r=0;r<i.length;++r)"removeListener"!==(o=i[r])&&this.removeAllListeners(o);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(t=n[e]))this.removeListener(e,t);else if(void 0!==t)for(r=t.length-1;r>=0;r--)this.removeListener(e,t[r]);return this},s.prototype.listeners=function(e){return p(this,e,!0)},s.prototype.rawListeners=function(e){return p(this,e,!1)},s.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):y.call(e,t)},s.prototype.listenerCount=y,s.prototype.eventNames=function(){return this._eventsCount>0?r(this._events):[]}},function(e,t){var n={left:0,top:0};e.exports=function(e,t,r){t=t||e.currentTarget||e.srcElement,Array.isArray(r)||(r=[0,0]);var o=e.clientX||0,i=e.clientY||0,u=(s=t,s===window||s===document||s===document.body?n:s.getBoundingClientRect());var s;return r[0]=o-u.left,r[1]=i-u.top,r}},function(e,t){e.exports=function(e,t){return{configurable:!0,enumerable:!0,get:e,set:t}}},function(e,t){e.exports=function(e,t){var n=t[0]-e[0],r=t[1]-e[1];return Math.sqrt(n*n+r*r)}},function(e,t,n){var r=n(2),o=n(1).EventEmitter;function i(e){var t=(e=e||{}).element||window,n=new o,i=e.position||[0,0];return!1!==e.touchstart&&(t.addEventListener("mousedown",s,!1),t.addEventListener("touchstart",u,!1)),t.addEventListener("mousemove",s,!1),t.addEventListener("touchmove",u,!1),n.position=i,n.dispose=function(){t.removeEventListener("mousemove",s,!1),t.removeEventListener("mousedown",s,!1),t.removeEventListener("touchmove",u,!1),t.removeEventListener("touchstart",u,!1)},n;function u(e){s(e.targetTouches[0])}function s(e){r(e,t,i),n.emit("move",e)}}e.exports=function(e){return i(e).position},e.exports.emitter=function(e){return i(e)}},function(e,t,n){(function(t){var n=/^\s+|\s+$/g,r=/^[-+]0x[0-9a-f]+$/i,o=/^0b[01]+$/i,i=/^0o[0-7]+$/i,u=parseInt,s="object"==typeof t&&t&&t.Object===Object&&t,c="object"==typeof self&&self&&self.Object===Object&&self,f=s||c||Function("return this")(),a=Object.prototype.toString,l=Math.max,v=Math.min,d=function(){return f.Date.now()};function p(e){var t=typeof e;return!!e&&("object"==t||"function"==t)}function y(e){if("number"==typeof e)return e;if(function(e){return"symbol"==typeof e||function(e){return!!e&&"object"==typeof e}(e)&&"[object Symbol]"==a.call(e)}(e))return NaN;if(p(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=p(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(n,"");var s=o.test(e);return s||i.test(e)?u(e.slice(2),s?2:8):r.test(e)?NaN:+e}e.exports=function(e,t,n){var r,o,i,u,s,c,f=0,a=!1,h=!1,m=!0;if("function"!=typeof e)throw new TypeError("Expected a function");function x(t){var n=r,i=o;return r=o=void 0,f=t,u=e.apply(i,n)}function g(e){return f=e,s=setTimeout(w,t),a?x(e):u}function b(e){var n=e-c;return void 0===c||n>=t||n<0||h&&e-f>=i}function w(){var e=d();if(b(e))return E(e);s=setTimeout(w,function(e){var n=t-(e-c);return h?v(n,i-(e-f)):n}(e))}function E(e){return s=void 0,m&&r?x(e):(r=o=void 0,u)}function L(){var e=d(),n=b(e);if(r=arguments,o=this,c=e,n){if(void 0===s)return g(c);if(h)return s=setTimeout(w,t),x(c)}return void 0===s&&(s=setTimeout(w,t)),u}return t=y(t)||0,p(n)&&(a=!!n.leading,i=(h="maxWait"in n)?l(y(n.maxWait)||0,t):i,m="trailing"in n?!!n.trailing:m),L.cancel=function(){void 0!==s&&clearTimeout(s),f=0,r=c=o=s=void 0},L.flush=function(){return void 0===s?u:E(d())},L}}).call(this,n(8))},function(e,t){e.exports=!0},function(e,t){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){"use strict";n.r(t);var r=n(1),o=n(0),i=n.n(o);function u(e){return(u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function s(e,t){return(s=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function c(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=l(e);if(t){var o=l(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return f(this,n)}}function f(e,t){return!t||"object"!==u(t)&&"function"!=typeof t?a(e):t}function a(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function l(e){return(l=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var v=!!i.a&&{capture:!1,passive:!0},d=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)};window.addEventListener("touchmove",(function(){}));var p=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&s(e,t)}(n,e);var t=c(n);function n(e){var r,o,u,s,c,f,l,p,y,h,m,x,g=e.source,b=void 0===g?document:g,w=e.update,E=e.multiplier,L=void 0===E?1:E,_=e.friction,O=void 0===_?.92:_,j=e.initialValues,T=e.boundX,P=e.boundY,R=e.bounce,S=void 0===R||R;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,n),r=t.call(this);var C=0,M=0,B=.3*L,z=!1,F=!1,A=!1,N=!1,Y=[],D=null;!function(){if(!(b="string"==typeof b?document.querySelector(b):b))throw new Error("IMPETUS: source not found.");if(!w)throw new Error("IMPETUS: update function not defined.");j&&(j[0]&&(C=j[0]),j[1]&&(M=j[1]),k()),T&&(o=T[0],u=T[1]),P&&(s=P[0],c=P[1]),b.addEventListener("touchstart",U,v),b.addEventListener("mousedown",U,v)}();var X=r.emit.bind(a(r));function q(){document.removeEventListener("touchmove",$,!!i.a&&{passive:!1}),document.removeEventListener("touchend",W,v),document.removeEventListener("touchcancel",K,v),document.removeEventListener("mousemove",$,!!i.a&&{passive:!1}),document.removeEventListener("mouseup",W,v)}function k(){w.call(b,C,M,D)}function I(e){if("touchmove"===e.type||"touchstart"===e.type||"touchend"===e.type){var t=e.targetTouches[0]||e.changedTouches[0];return{x:t.clientX,y:t.clientY,id:t.identifier}}return{x:e.clientX,y:e.clientY,id:null}}function U(e){D=e;var t=I(e);F||A||(F=!0,N=!1,h=t.id,f=p=t.x,l=y=t.y,Y=[],V(f,l),q(),document.addEventListener("touchmove",$,!!i.a&&{passive:!1}),document.addEventListener("touchend",W,v),document.addEventListener("touchcancel",K,v),document.addEventListener("mousemove",$,!!i.a&&{passive:!1}),document.addEventListener("mouseup",W,v),X("start",{x:p,y:y,event:D}))}function $(e){e.preventDefault(),D=e;var t=I(e);F&&t.id===h&&(p=t.x,y=t.y,V(f,l),function(){z||d(Z);z=!0}())}function W(e){D=e;var t=I(e);F&&t.id===h&&K()}function K(){F=!1,V(f,l),function(){var e=Y[0],t=Y[Y.length-1],n=t.x-e.x,r=t.y-e.y,o=(t.time-e.time)/15/L;m=n/o||0,x=r/o||0;var i=H();Math.abs(m)>1||Math.abs(x)>1||!i.inBounds?(N=!0,d(J)):X("end",{x:C,y:M,event:D})}(),q()}function V(e,t){for(var n=Date.now();Y.length>0&&!(n-Y[0].time<=100);)Y.shift();Y.push({x:e,y:t,time:n})}function Z(){var e=p-f,t=y-l;if(C+=e*L,M+=t*L,S){var n=H();0!==n.x&&(C-=e*G(n.x)*L),0!==n.y&&(M-=t*G(n.y)*L)}else H(!0);k(),f=p,l=y,z=!1}function G(e){return 5e-6*Math.pow(e,2)+1e-4*e+.55}function H(e){var t=0,n=0;return void 0!==o&&C<o?t=o-C:void 0!==u&&C>u&&(t=u-C),void 0!==s&&M<s?n=s-M:void 0!==c&&M>c&&(n=c-M),e&&(0!==t&&(C=t>0?o:u),0!==n&&(M=n>0?s:c)),{x:t,y:n,inBounds:0===t&&0===n}}function J(){if(N){C+=m*=O,M+=x*=O;var e=H();if(Math.abs(m)>B||Math.abs(x)>B||!e.inBounds){if(S){if(0!==e.x)if(e.x*m<=0)m+=.04*e.x;else{var t=e.x>0?2.5:-2.5;m=.11*(e.x+t)}if(0!==e.y)if(e.y*x<=0)x+=.04*e.y;else{var n=e.y>0?2.5:-2.5;x=.11*(e.y+n)}}else 0!==e.x&&(C=e.x>0?o:u,m=0),0!==e.y&&(M=e.y>0?s:c,x=0);k(),d(J)}else N=!1,X("end",{x:C,y:M,event:D})}}return r.destroy=function(){return b.removeEventListener("touchstart",U),b.removeEventListener("mousedown",U),q(),null},r.pause=function(){q(),F=!1,A=!0},r.resume=function(){A=!1},r.setValues=function(e,t){"number"==typeof e&&(C=e),"number"==typeof t&&(M=t)},r.setMultiplier=function(e){B=.3*(L=e)},r.setBoundX=function(e){o=e[0],u=e[1]},r.setBoundY=function(e){s=e[0],c=e[1]},r}return n}(r.EventEmitter),y=n(4),h=n.n(y),m=n(3),x=n.n(m),g=n(2),b=n.n(g),w=!!i.a&&{capture:!1,passive:!0};function E(){this.position=[0,0],this.touch=null}var L=function(e){e=e||window;var t=new r.EventEmitter,n=[null,null],o=0,i=0,u=!1,s=!1;return Object.defineProperties(t,{pinching:x()((function(){return 2===o})),fingers:x()((function(){return n}))}),f(),t.enable=f,t.disable=function(){if(!s)return;s=!1,o=0,n[0]=null,n[1]=null,i=0,u=!1,e.removeEventListener("touchstart",a,w),e.removeEventListener("touchmove",l,w),e.removeEventListener("touchend",v,w),e.removeEventListener("touchcancel",v,w)},t.indexOfTouch=c,t;function c(e){for(var t=e.identifier,r=0;r<n.length;r++)if(n[r]&&n[r].touch&&n[r].touch.identifier===t)return r;return-1}function f(){s||(s=!0,e.addEventListener("touchstart",a,w),e.addEventListener("touchmove",l,w),e.addEventListener("touchend",v,w),e.addEventListener("touchcancel",v,w))}function a(r){for(var s=0;s<r.changedTouches.length;s++){var f=r.changedTouches[s];if(-1===c(f.identifier)&&o<2){var a=0===o,l=n[0]?1:0,v=n[0]?0:1,p=new E;n[l]=p,o++,p.touch=f,b()(f,e,p.position);var y=n[v]?n[v].touch:void 0;if(t.emit("place",f,y),!a){var h=d();u=!1,t.emit("start",h,r),i=h}}}}function l(r){for(var u=!1,s=0;s<r.changedTouches.length;s++){var f=r.changedTouches[s],a=c(f);-1!==a&&(u=!0,n[a].touch=f,b()(f,e,n[a].position))}if(2===o&&u){var l=d();t.emit("change",l,i,r),i=l}}function v(e){for(var r=0;r<e.changedTouches.length;r++){var s=e.changedTouches[r],f=c(s);if(-1!==f){n[f]=null,o--;var a=0===f?1:0,l=n[a]?n[a].touch:void 0;t.emit("lift",s,l,e)}}u||2===o||(u=!0,t.emit("end",i,e))}function d(){return o<2?0:h()(n[0].position,n[1].position)}},_=n(5),O=n.n(_),j=n(6),T=n.n(j);t.default=function(e,t,n){function r(e){n.onStart&&n.onStart(e)}function o(e){n.onEnd&&requestAnimationFrame((function(){n.onEnd(e)}))}e instanceof Function&&(t=e,e=document.documentElement||document.body),n||(n={});var i=null,u=null,s=null;"string"==typeof e&&(e=document.querySelector(e));var c,f,a=O.a.emitter();function l(t){return t||(t=e.getBoundingClientRect()),{x:a.position[0]-t.x,y:a.position[1]-t.y}}var v={x:0,y:0,px:0,py:0},d=0,y=0;(c=new p({source:e,update:function(n,r,o){var i=l(e.getBoundingClientRect()),u={srcElement:f,event:o,target:e,type:"mouse",dx:n-d,dy:r-y,dz:0,x:i.x,y:i.y,x0:v.x,y0:v.y,px0:v.px,py0:v.py};d=n,y=r,t(u)},multiplier:n.friction||1,friction:n.multiplier||.75,boundX:n.boundX,boundY:n.boundY,bounce:n.bounce})).on("start",(function(t){var n=t.event,o=e.getBoundingClientRect(),i=l(o);v={x:i.x,y:i.y,px:i.x/o.width,py:i.y/o.height},r({srcElement:f=n.srcElement,event:n,target:e,type:"mouse",dx:0,dy:0,dz:0,x:i.x,y:i.y,x0:v.x,y0:v.y,px0:v.px,py0:v.py})})),c.on("end",(function(t){var n=t.event,r=l();o({srcElement:f,event:n,target:e,type:"mouse",dx:0,dy:0,dz:0,x:r.x,y:r.y,x0:v.x,y0:v.y,px0:v.px,py0:v.py})})),[window,document,document.documentElement,document.body].indexOf(e);var h=null;function m(){if(h)return h;var c=function(c){n.passive||c.preventDefault();var f=e.getBoundingClientRect(),a=c.clientX-f.x,v=c.clientY-f.y,d=function(t){t||(t={});var n=e.getBoundingClientRect(),c=l(n),f=u||{},a=s||{},v=null!=t.x?t.x:c.x,d=null!=t.y?t.y:c.y,p=null!=a.x?a.x:v,y=null!=a.y?a.y:d,h=null!=t.dx?t.dx:v-p,m=null!=t.dy?t.dy:d-y,x=null!=t.dz?t.dz:0,g=null!=f.x0?f.x0:null!=t.x0?t.x0:c.x,b=null!=f.y0?f.y0:null!=t.y0?t.y0:c.y,w=null!=f.px0?f.px0:g/n.width,E=null!=f.py0?f.py0:b/n.height,L={type:t.type||"mouse",srcElement:t.srcElement||e,target:e,event:t.event,x:v,y:d,dx:h,dy:m,dz:x,x0:g,y0:b,px0:w,py0:E},_=!1;i||(_=!0,u=s=L,r(L),i=T()((function(e){o(e),i=null,u=null,s=null}),60)),i(L);var O={isStart:_,init:u,last:s,event:L};return s=O.event,O}({dx:0,dy:0,dz:.5*c.deltaY,x:a,y:v,x0:a,y0:v,srcElement:c.srcElement,event:c,type:"mouse"});t(d.event)};return e.addEventListener("wheel",c,{passive:!!n.passive}),c}function x(){h&&(h=e.removeEventListener("wheel",h,{passive:!0}))}h=m();var g,b=L();function w(){return function(e){var t,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:window,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o=r.threshold||500,i=function(n){t?(t=clearTimeout(t),e&&e(n)):t=setTimeout((function(){t=null}),o)};return n.addEventListener("click",i,{passive:!0}),function(){return n.removeEventListener("click",i,{passive:!0}),null}}((function(){var t,r=e.getBoundingClientRect(),o=l(r);t={srcElement:e,target:e,type:"mouse",dx:0,dy:0,dz:0,x:o.x,y:o.x,x0:o.x,y0:o.x,px0:o.x/r.width,py0:o.y/r.height},n.onDoubleTap&&n.onDoubleTap(t)}),e)}b.on("start",(function(t,n){var o,i,u=(o=b.fingers[0],[.5*(i=b.fingers[1]).position[0]+.5*o.position[0],.5*i.position[1]+.5*o.position[1]]),s=e.getBoundingClientRect(),f=u[0],a=u[1];(function(t,n,r){return r||(r=e.getBoundingClientRect()),t>=r.x&&t<=r.x+r.width&&n>=r.y&&n<=r.y+r.height})(f,a,s)&&(f-=s.x,a-=s.y,g={x:f,y:a,px0:f/s.width,py0:a/s.height},c&&c.pause(),r({srcElement:n.srcElement,event:n,target:e,type:"touch",dx:0,dy:0,dz:0,x:g.x,y:g.y,x0:g.x,y0:g.y,px0:g.px0,py0:g.py0}))})),b.on("end",(function(t,n){g&&(c&&c.resume(),o({srcElement:n.srcElement,event:n,target:e,type:"touch",dx:0,dy:0,dz:0,x:g.x,y:g.y,x0:g.x,y0:g.y,px0:g.px0,py0:g.py0}),g=null)})),b.on("change",(function(n,r,o){b.pinching&&g&&t({srcElement:e,event:o,target:e,type:"touch",dx:0,dy:0,dz:1.3*-(n-r),x:g.x,y:g.x,x0:g.x,y0:g.x,px0:g.px0,py0:g.py0})}));var E=w(),_=function(){a.dispose(),c.destroy(),x(),E&&(E=E()),b.disable()};return _.disablePan=function(){c&&c.pause()},_.enablePan=function(){c&&c.resume()},_.disableZoom=function(){b&&b.disable(),x(),E&&(E=E())},_.enableZoom=function(){b&&b.enable(),h=m(),E=w()},_}}])}));