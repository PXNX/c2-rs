(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Demo"] = factory();
	else
		root["Demo"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@thesoulfresh/pan-zoom/lib/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@thesoulfresh/pan-zoom/lib/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function(e,t){if(true)module.exports=t();else { var r, n; }}(window,(function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=9)}([function(e,t,n){"use strict";var r=n(7);e.exports=r&&function(){var e=!1;try{var t=Object.defineProperty({},"passive",{get:function(){e=!0}});window.addEventListener("test",null,t),window.removeEventListener("test",null,t)}catch(t){e=!1}return e}()},function(e,t,n){"use strict";var r,o="object"==typeof Reflect?Reflect:null,i=o&&"function"==typeof o.apply?o.apply:function(e,t,n){return Function.prototype.apply.call(e,t,n)};r=o&&"function"==typeof o.ownKeys?o.ownKeys:Object.getOwnPropertySymbols?function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:function(e){return Object.getOwnPropertyNames(e)};var u=Number.isNaN||function(e){return e!=e};function s(){s.init.call(this)}e.exports=s,e.exports.once=function(e,t){return new Promise((function(n,r){function o(){void 0!==i&&e.removeListener("error",i),n([].slice.call(arguments))}var i;"error"!==t&&(i=function(n){e.removeListener(t,o),r(n)},e.once("error",i)),e.once(t,o)}))},s.EventEmitter=s,s.prototype._events=void 0,s.prototype._eventsCount=0,s.prototype._maxListeners=void 0;var c=10;function f(e){if("function"!=typeof e)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof e)}function a(e){return void 0===e._maxListeners?s.defaultMaxListeners:e._maxListeners}function l(e,t,n,r){var o,i,u,s;if(f(n),void 0===(i=e._events)?(i=e._events=Object.create(null),e._eventsCount=0):(void 0!==i.newListener&&(e.emit("newListener",t,n.listener?n.listener:n),i=e._events),u=i[t]),void 0===u)u=i[t]=n,++e._eventsCount;else if("function"==typeof u?u=i[t]=r?[n,u]:[u,n]:r?u.unshift(n):u.push(n),(o=a(e))>0&&u.length>o&&!u.warned){u.warned=!0;var c=new Error("Possible EventEmitter memory leak detected. "+u.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");c.name="MaxListenersExceededWarning",c.emitter=e,c.type=t,c.count=u.length,s=c,console&&console.warn&&console.warn(s)}return e}function v(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function d(e,t,n){var r={fired:!1,wrapFn:void 0,target:e,type:t,listener:n},o=v.bind(r);return o.listener=n,r.wrapFn=o,o}function p(e,t,n){var r=e._events;if(void 0===r)return[];var o=r[t];return void 0===o?[]:"function"==typeof o?n?[o.listener||o]:[o]:n?function(e){for(var t=new Array(e.length),n=0;n<t.length;++n)t[n]=e[n].listener||e[n];return t}(o):h(o,o.length)}function y(e){var t=this._events;if(void 0!==t){var n=t[e];if("function"==typeof n)return 1;if(void 0!==n)return n.length}return 0}function h(e,t){for(var n=new Array(t),r=0;r<t;++r)n[r]=e[r];return n}Object.defineProperty(s,"defaultMaxListeners",{enumerable:!0,get:function(){return c},set:function(e){if("number"!=typeof e||e<0||u(e))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");c=e}}),s.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},s.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||u(e))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+e+".");return this._maxListeners=e,this},s.prototype.getMaxListeners=function(){return a(this)},s.prototype.emit=function(e){for(var t=[],n=1;n<arguments.length;n++)t.push(arguments[n]);var r="error"===e,o=this._events;if(void 0!==o)r=r&&void 0===o.error;else if(!r)return!1;if(r){var u;if(t.length>0&&(u=t[0]),u instanceof Error)throw u;var s=new Error("Unhandled error."+(u?" ("+u.message+")":""));throw s.context=u,s}var c=o[e];if(void 0===c)return!1;if("function"==typeof c)i(c,this,t);else{var f=c.length,a=h(c,f);for(n=0;n<f;++n)i(a[n],this,t)}return!0},s.prototype.addListener=function(e,t){return l(this,e,t,!1)},s.prototype.on=s.prototype.addListener,s.prototype.prependListener=function(e,t){return l(this,e,t,!0)},s.prototype.once=function(e,t){return f(t),this.on(e,d(this,e,t)),this},s.prototype.prependOnceListener=function(e,t){return f(t),this.prependListener(e,d(this,e,t)),this},s.prototype.removeListener=function(e,t){var n,r,o,i,u;if(f(t),void 0===(r=this._events))return this;if(void 0===(n=r[e]))return this;if(n===t||n.listener===t)0==--this._eventsCount?this._events=Object.create(null):(delete r[e],r.removeListener&&this.emit("removeListener",e,n.listener||t));else if("function"!=typeof n){for(o=-1,i=n.length-1;i>=0;i--)if(n[i]===t||n[i].listener===t){u=n[i].listener,o=i;break}if(o<0)return this;0===o?n.shift():function(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}(n,o),1===n.length&&(r[e]=n[0]),void 0!==r.removeListener&&this.emit("removeListener",e,u||t)}return this},s.prototype.off=s.prototype.removeListener,s.prototype.removeAllListeners=function(e){var t,n,r;if(void 0===(n=this._events))return this;if(void 0===n.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==n[e]&&(0==--this._eventsCount?this._events=Object.create(null):delete n[e]),this;if(0===arguments.length){var o,i=Object.keys(n);for(r=0;r<i.length;++r)"removeListener"!==(o=i[r])&&this.removeAllListeners(o);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(t=n[e]))this.removeListener(e,t);else if(void 0!==t)for(r=t.length-1;r>=0;r--)this.removeListener(e,t[r]);return this},s.prototype.listeners=function(e){return p(this,e,!0)},s.prototype.rawListeners=function(e){return p(this,e,!1)},s.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):y.call(e,t)},s.prototype.listenerCount=y,s.prototype.eventNames=function(){return this._eventsCount>0?r(this._events):[]}},function(e,t){var n={left:0,top:0};e.exports=function(e,t,r){t=t||e.currentTarget||e.srcElement,Array.isArray(r)||(r=[0,0]);var o=e.clientX||0,i=e.clientY||0,u=(s=t,s===window||s===document||s===document.body?n:s.getBoundingClientRect());var s;return r[0]=o-u.left,r[1]=i-u.top,r}},function(e,t){e.exports=function(e,t){return{configurable:!0,enumerable:!0,get:e,set:t}}},function(e,t){e.exports=function(e,t){var n=t[0]-e[0],r=t[1]-e[1];return Math.sqrt(n*n+r*r)}},function(e,t,n){var r=n(2),o=n(1).EventEmitter;function i(e){var t=(e=e||{}).element||window,n=new o,i=e.position||[0,0];return!1!==e.touchstart&&(t.addEventListener("mousedown",s,!1),t.addEventListener("touchstart",u,!1)),t.addEventListener("mousemove",s,!1),t.addEventListener("touchmove",u,!1),n.position=i,n.dispose=function(){t.removeEventListener("mousemove",s,!1),t.removeEventListener("mousedown",s,!1),t.removeEventListener("touchmove",u,!1),t.removeEventListener("touchstart",u,!1)},n;function u(e){s(e.targetTouches[0])}function s(e){r(e,t,i),n.emit("move",e)}}e.exports=function(e){return i(e).position},e.exports.emitter=function(e){return i(e)}},function(e,t,n){(function(t){var n=/^\s+|\s+$/g,r=/^[-+]0x[0-9a-f]+$/i,o=/^0b[01]+$/i,i=/^0o[0-7]+$/i,u=parseInt,s="object"==typeof t&&t&&t.Object===Object&&t,c="object"==typeof self&&self&&self.Object===Object&&self,f=s||c||Function("return this")(),a=Object.prototype.toString,l=Math.max,v=Math.min,d=function(){return f.Date.now()};function p(e){var t=typeof e;return!!e&&("object"==t||"function"==t)}function y(e){if("number"==typeof e)return e;if(function(e){return"symbol"==typeof e||function(e){return!!e&&"object"==typeof e}(e)&&"[object Symbol]"==a.call(e)}(e))return NaN;if(p(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=p(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(n,"");var s=o.test(e);return s||i.test(e)?u(e.slice(2),s?2:8):r.test(e)?NaN:+e}e.exports=function(e,t,n){var r,o,i,u,s,c,f=0,a=!1,h=!1,m=!0;if("function"!=typeof e)throw new TypeError("Expected a function");function x(t){var n=r,i=o;return r=o=void 0,f=t,u=e.apply(i,n)}function g(e){return f=e,s=setTimeout(w,t),a?x(e):u}function b(e){var n=e-c;return void 0===c||n>=t||n<0||h&&e-f>=i}function w(){var e=d();if(b(e))return E(e);s=setTimeout(w,function(e){var n=t-(e-c);return h?v(n,i-(e-f)):n}(e))}function E(e){return s=void 0,m&&r?x(e):(r=o=void 0,u)}function L(){var e=d(),n=b(e);if(r=arguments,o=this,c=e,n){if(void 0===s)return g(c);if(h)return s=setTimeout(w,t),x(c)}return void 0===s&&(s=setTimeout(w,t)),u}return t=y(t)||0,p(n)&&(a=!!n.leading,i=(h="maxWait"in n)?l(y(n.maxWait)||0,t):i,m="trailing"in n?!!n.trailing:m),L.cancel=function(){void 0!==s&&clearTimeout(s),f=0,r=c=o=s=void 0},L.flush=function(){return void 0===s?u:E(d())},L}}).call(this,n(8))},function(e,t){e.exports=!0},function(e,t){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){"use strict";n.r(t);var r=n(1),o=n(0),i=n.n(o);function u(e){return(u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function s(e,t){return(s=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function c(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=l(e);if(t){var o=l(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return f(this,n)}}function f(e,t){return!t||"object"!==u(t)&&"function"!=typeof t?a(e):t}function a(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function l(e){return(l=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var v=!!i.a&&{capture:!1,passive:!0},d=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)};window.addEventListener("touchmove",(function(){}));var p=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&s(e,t)}(n,e);var t=c(n);function n(e){var r,o,u,s,c,f,l,p,y,h,m,x,g=e.source,b=void 0===g?document:g,w=e.update,E=e.multiplier,L=void 0===E?1:E,_=e.friction,O=void 0===_?.92:_,j=e.initialValues,T=e.boundX,P=e.boundY,R=e.bounce,S=void 0===R||R;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,n),r=t.call(this);var C=0,M=0,B=.3*L,z=!1,F=!1,A=!1,N=!1,Y=[],D=null;!function(){if(!(b="string"==typeof b?document.querySelector(b):b))throw new Error("IMPETUS: source not found.");if(!w)throw new Error("IMPETUS: update function not defined.");j&&(j[0]&&(C=j[0]),j[1]&&(M=j[1]),k()),T&&(o=T[0],u=T[1]),P&&(s=P[0],c=P[1]),b.addEventListener("touchstart",U,v),b.addEventListener("mousedown",U,v)}();var X=r.emit.bind(a(r));function q(){document.removeEventListener("touchmove",$,!!i.a&&{passive:!1}),document.removeEventListener("touchend",W,v),document.removeEventListener("touchcancel",K,v),document.removeEventListener("mousemove",$,!!i.a&&{passive:!1}),document.removeEventListener("mouseup",W,v)}function k(){w.call(b,C,M,D)}function I(e){if("touchmove"===e.type||"touchstart"===e.type||"touchend"===e.type){var t=e.targetTouches[0]||e.changedTouches[0];return{x:t.clientX,y:t.clientY,id:t.identifier}}return{x:e.clientX,y:e.clientY,id:null}}function U(e){D=e;var t=I(e);F||A||(F=!0,N=!1,h=t.id,f=p=t.x,l=y=t.y,Y=[],V(f,l),q(),document.addEventListener("touchmove",$,!!i.a&&{passive:!1}),document.addEventListener("touchend",W,v),document.addEventListener("touchcancel",K,v),document.addEventListener("mousemove",$,!!i.a&&{passive:!1}),document.addEventListener("mouseup",W,v),X("start",{x:p,y:y,event:D}))}function $(e){e.preventDefault(),D=e;var t=I(e);F&&t.id===h&&(p=t.x,y=t.y,V(f,l),function(){z||d(Z);z=!0}())}function W(e){D=e;var t=I(e);F&&t.id===h&&K()}function K(){F=!1,V(f,l),function(){var e=Y[0],t=Y[Y.length-1],n=t.x-e.x,r=t.y-e.y,o=(t.time-e.time)/15/L;m=n/o||0,x=r/o||0;var i=H();Math.abs(m)>1||Math.abs(x)>1||!i.inBounds?(N=!0,d(J)):X("end",{x:C,y:M,event:D})}(),q()}function V(e,t){for(var n=Date.now();Y.length>0&&!(n-Y[0].time<=100);)Y.shift();Y.push({x:e,y:t,time:n})}function Z(){var e=p-f,t=y-l;if(C+=e*L,M+=t*L,S){var n=H();0!==n.x&&(C-=e*G(n.x)*L),0!==n.y&&(M-=t*G(n.y)*L)}else H(!0);k(),f=p,l=y,z=!1}function G(e){return 5e-6*Math.pow(e,2)+1e-4*e+.55}function H(e){var t=0,n=0;return void 0!==o&&C<o?t=o-C:void 0!==u&&C>u&&(t=u-C),void 0!==s&&M<s?n=s-M:void 0!==c&&M>c&&(n=c-M),e&&(0!==t&&(C=t>0?o:u),0!==n&&(M=n>0?s:c)),{x:t,y:n,inBounds:0===t&&0===n}}function J(){if(N){C+=m*=O,M+=x*=O;var e=H();if(Math.abs(m)>B||Math.abs(x)>B||!e.inBounds){if(S){if(0!==e.x)if(e.x*m<=0)m+=.04*e.x;else{var t=e.x>0?2.5:-2.5;m=.11*(e.x+t)}if(0!==e.y)if(e.y*x<=0)x+=.04*e.y;else{var n=e.y>0?2.5:-2.5;x=.11*(e.y+n)}}else 0!==e.x&&(C=e.x>0?o:u,m=0),0!==e.y&&(M=e.y>0?s:c,x=0);k(),d(J)}else N=!1,X("end",{x:C,y:M,event:D})}}return r.destroy=function(){return b.removeEventListener("touchstart",U),b.removeEventListener("mousedown",U),q(),null},r.pause=function(){q(),F=!1,A=!0},r.resume=function(){A=!1},r.setValues=function(e,t){"number"==typeof e&&(C=e),"number"==typeof t&&(M=t)},r.setMultiplier=function(e){B=.3*(L=e)},r.setBoundX=function(e){o=e[0],u=e[1]},r.setBoundY=function(e){s=e[0],c=e[1]},r}return n}(r.EventEmitter),y=n(4),h=n.n(y),m=n(3),x=n.n(m),g=n(2),b=n.n(g),w=!!i.a&&{capture:!1,passive:!0};function E(){this.position=[0,0],this.touch=null}var L=function(e){e=e||window;var t=new r.EventEmitter,n=[null,null],o=0,i=0,u=!1,s=!1;return Object.defineProperties(t,{pinching:x()((function(){return 2===o})),fingers:x()((function(){return n}))}),f(),t.enable=f,t.disable=function(){if(!s)return;s=!1,o=0,n[0]=null,n[1]=null,i=0,u=!1,e.removeEventListener("touchstart",a,w),e.removeEventListener("touchmove",l,w),e.removeEventListener("touchend",v,w),e.removeEventListener("touchcancel",v,w)},t.indexOfTouch=c,t;function c(e){for(var t=e.identifier,r=0;r<n.length;r++)if(n[r]&&n[r].touch&&n[r].touch.identifier===t)return r;return-1}function f(){s||(s=!0,e.addEventListener("touchstart",a,w),e.addEventListener("touchmove",l,w),e.addEventListener("touchend",v,w),e.addEventListener("touchcancel",v,w))}function a(r){for(var s=0;s<r.changedTouches.length;s++){var f=r.changedTouches[s];if(-1===c(f.identifier)&&o<2){var a=0===o,l=n[0]?1:0,v=n[0]?0:1,p=new E;n[l]=p,o++,p.touch=f,b()(f,e,p.position);var y=n[v]?n[v].touch:void 0;if(t.emit("place",f,y),!a){var h=d();u=!1,t.emit("start",h,r),i=h}}}}function l(r){for(var u=!1,s=0;s<r.changedTouches.length;s++){var f=r.changedTouches[s],a=c(f);-1!==a&&(u=!0,n[a].touch=f,b()(f,e,n[a].position))}if(2===o&&u){var l=d();t.emit("change",l,i,r),i=l}}function v(e){for(var r=0;r<e.changedTouches.length;r++){var s=e.changedTouches[r],f=c(s);if(-1!==f){n[f]=null,o--;var a=0===f?1:0,l=n[a]?n[a].touch:void 0;t.emit("lift",s,l,e)}}u||2===o||(u=!0,t.emit("end",i,e))}function d(){return o<2?0:h()(n[0].position,n[1].position)}},_=n(5),O=n.n(_),j=n(6),T=n.n(j);t.default=function(e,t,n){function r(e){n.onStart&&n.onStart(e)}function o(e){n.onEnd&&requestAnimationFrame((function(){n.onEnd(e)}))}e instanceof Function&&(t=e,e=document.documentElement||document.body),n||(n={});var i=null,u=null,s=null;"string"==typeof e&&(e=document.querySelector(e));var c,f,a=O.a.emitter();function l(t){return t||(t=e.getBoundingClientRect()),{x:a.position[0]-t.x,y:a.position[1]-t.y}}var v={x:0,y:0,px:0,py:0},d=0,y=0;(c=new p({source:e,update:function(n,r,o){var i=l(e.getBoundingClientRect()),u={srcElement:f,event:o,target:e,type:"mouse",dx:n-d,dy:r-y,dz:0,x:i.x,y:i.y,x0:v.x,y0:v.y,px0:v.px,py0:v.py};d=n,y=r,t(u)},multiplier:n.friction||1,friction:n.multiplier||.75,boundX:n.boundX,boundY:n.boundY,bounce:n.bounce})).on("start",(function(t){var n=t.event,o=e.getBoundingClientRect(),i=l(o);v={x:i.x,y:i.y,px:i.x/o.width,py:i.y/o.height},r({srcElement:f=n.srcElement,event:n,target:e,type:"mouse",dx:0,dy:0,dz:0,x:i.x,y:i.y,x0:v.x,y0:v.y,px0:v.px,py0:v.py})})),c.on("end",(function(t){var n=t.event,r=l();o({srcElement:f,event:n,target:e,type:"mouse",dx:0,dy:0,dz:0,x:r.x,y:r.y,x0:v.x,y0:v.y,px0:v.px,py0:v.py})})),[window,document,document.documentElement,document.body].indexOf(e);var h=null;function m(){if(h)return h;var c=function(c){n.passive||c.preventDefault();var f=e.getBoundingClientRect(),a=c.clientX-f.x,v=c.clientY-f.y,d=function(t){t||(t={});var n=e.getBoundingClientRect(),c=l(n),f=u||{},a=s||{},v=null!=t.x?t.x:c.x,d=null!=t.y?t.y:c.y,p=null!=a.x?a.x:v,y=null!=a.y?a.y:d,h=null!=t.dx?t.dx:v-p,m=null!=t.dy?t.dy:d-y,x=null!=t.dz?t.dz:0,g=null!=f.x0?f.x0:null!=t.x0?t.x0:c.x,b=null!=f.y0?f.y0:null!=t.y0?t.y0:c.y,w=null!=f.px0?f.px0:g/n.width,E=null!=f.py0?f.py0:b/n.height,L={type:t.type||"mouse",srcElement:t.srcElement||e,target:e,event:t.event,x:v,y:d,dx:h,dy:m,dz:x,x0:g,y0:b,px0:w,py0:E},_=!1;i||(_=!0,u=s=L,r(L),i=T()((function(e){o(e),i=null,u=null,s=null}),60)),i(L);var O={isStart:_,init:u,last:s,event:L};return s=O.event,O}({dx:0,dy:0,dz:.5*c.deltaY,x:a,y:v,x0:a,y0:v,srcElement:c.srcElement,event:c,type:"mouse"});t(d.event)};return e.addEventListener("wheel",c,{passive:!!n.passive}),c}function x(){h&&(h=e.removeEventListener("wheel",h,{passive:!0}))}h=m();var g,b=L();function w(){return function(e){var t,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:window,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o=r.threshold||500,i=function(n){t?(t=clearTimeout(t),e&&e(n)):t=setTimeout((function(){t=null}),o)};return n.addEventListener("click",i,{passive:!0}),function(){return n.removeEventListener("click",i,{passive:!0}),null}}((function(){var t,r=e.getBoundingClientRect(),o=l(r);t={srcElement:e,target:e,type:"mouse",dx:0,dy:0,dz:0,x:o.x,y:o.x,x0:o.x,y0:o.x,px0:o.x/r.width,py0:o.y/r.height},n.onDoubleTap&&n.onDoubleTap(t)}),e)}b.on("start",(function(t,n){var o,i,u=(o=b.fingers[0],[.5*(i=b.fingers[1]).position[0]+.5*o.position[0],.5*i.position[1]+.5*o.position[1]]),s=e.getBoundingClientRect(),f=u[0],a=u[1];(function(t,n,r){return r||(r=e.getBoundingClientRect()),t>=r.x&&t<=r.x+r.width&&n>=r.y&&n<=r.y+r.height})(f,a,s)&&(f-=s.x,a-=s.y,g={x:f,y:a,px0:f/s.width,py0:a/s.height},c&&c.pause(),r({srcElement:n.srcElement,event:n,target:e,type:"touch",dx:0,dy:0,dz:0,x:g.x,y:g.y,x0:g.x,y0:g.y,px0:g.px0,py0:g.py0}))})),b.on("end",(function(t,n){g&&(c&&c.resume(),o({srcElement:n.srcElement,event:n,target:e,type:"touch",dx:0,dy:0,dz:0,x:g.x,y:g.y,x0:g.x,y0:g.y,px0:g.px0,py0:g.py0}),g=null)})),b.on("change",(function(n,r,o){b.pinching&&g&&t({srcElement:e,event:o,target:e,type:"touch",dx:0,dy:0,dz:1.3*-(n-r),x:g.x,y:g.x,x0:g.x,y0:g.x,px0:g.px0,py0:g.py0})}));var E=w(),_=function(){a.dispose(),c.destroy(),x(),E&&(E=E()),b.disable()};return _.disablePan=function(){c&&c.pause()},_.enablePan=function(){c&&c.resume()},_.disableZoom=function(){b&&b.disable(),x(),E&&(E=E())},_.enableZoom=function(){b&&b.enable(),h=m(),E=w()},_}}])}));

/***/ }),

/***/ "./node_modules/eventemitter3/index.js":
/*!*********************************************!*\
  !*** ./node_modules/eventemitter3/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @assets
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @assets
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @assets
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @assets
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @assets
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @assets
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @assets
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @assets
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @assets
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ }),

/***/ "./node_modules/lodash.debounce/index.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash.debounce/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = debounce;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/object-fit-math/dist/fitter.js":
/*!*****************************************************!*\
  !*** ./node_modules/object-fit-math/dist/fitter.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.fit = (parent, child, fitMode = 'fill') => {
    if (fitMode === 'scale-down') {
        if (child.width <= parent.width && child.height <= parent.height) {
            fitMode = 'none';
        }
        else {
            fitMode = 'contain';
        }
    }
    if (fitMode === 'cover' || fitMode === 'contain') {
        const wr = parent.width / child.width;
        const hr = parent.height / child.height;
        const ratio = fitMode === 'cover' ? Math.max(wr, hr) : Math.min(wr, hr);
        const width = child.width * ratio;
        const height = child.height * ratio;
        const size = { width, height };
        return size;
    }
    if (fitMode === 'none')
        return child;
    // default case, fitMode === 'fill'
    return parent;
};
exports.position = (parent, child, left = '50%', top = '50%') => {
    const x = lengthToPixels(left, parent.width, child.width);
    const y = lengthToPixels(top, parent.height, child.height);
    const point = { x, y };
    return point;
};
exports.fitAndPosition = (parent, child, fitMode = 'fill', left = '50%', top = '50%') => {
    const fitted = exports.fit(parent, child, fitMode);
    const { x, y } = exports.position(parent, fitted, left, top);
    const { width, height } = fitted;
    const rect = { x, y, width, height };
    return rect;
};
const lengthToPixels = (length, parent, child) => length.endsWith('%') ?
    (parent - child) * (parseFloat(length) / 100) :
    parseFloat(length);
//# sourceMappingURL=fitter.js.map

/***/ }),

/***/ "./node_modules/object-fit-math/dist/index.js":
/*!****************************************************!*\
  !*** ./node_modules/object-fit-math/dist/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fitter_1 = __webpack_require__(/*! ./fitter */ "./node_modules/object-fit-math/dist/fitter.js");
exports.fit = fitter_1.fit;
exports.position = fitter_1.position;
exports.fitAndPosition = fitter_1.fitAndPosition;
var transform_fitted_point_1 = __webpack_require__(/*! ./transform-fitted-point */ "./node_modules/object-fit-math/dist/transform-fitted-point.js");
exports.transformFittedPoint = transform_fitted_point_1.transformFittedPoint;
var predicates_1 = __webpack_require__(/*! ./predicates */ "./node_modules/object-fit-math/dist/predicates.js");
exports.isFit = predicates_1.isFit;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/object-fit-math/dist/predicates.js":
/*!*********************************************************!*\
  !*** ./node_modules/object-fit-math/dist/predicates.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fitModes = {
    contain: true,
    cover: true,
    fill: true,
    none: true,
    'scale-down': true
};
exports.isFit = (value) => value in fitModes;
//# sourceMappingURL=predicates.js.map

/***/ }),

/***/ "./node_modules/object-fit-math/dist/transform-fitted-point.js":
/*!*********************************************************************!*\
  !*** ./node_modules/object-fit-math/dist/transform-fitted-point.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fitter_1 = __webpack_require__(/*! ./fitter */ "./node_modules/object-fit-math/dist/fitter.js");
exports.transformFittedPoint = (fittedPoint, parent, child, fitMode = 'fill', left = '50%', top = '50%') => {
    const { x: positionedX, y: positionedY, width: fittedWidth, height: fittedHeight } = fitter_1.fitAndPosition(parent, child, fitMode, left, top);
    const wRatio = child.width / fittedWidth;
    const hRatio = child.height / fittedHeight;
    const x = (fittedPoint.x - positionedX) * wRatio;
    const y = (fittedPoint.y - positionedY) * hRatio;
    const childPoint = { x, y };
    return childPoint;
};
//# sourceMappingURL=transform-fitted-point.js.map

/***/ }),

/***/ "./node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js":
/*!*************************************************************************!*\
  !*** ./node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/**
 * A collection of shims that provide minimal functionality of the ES6 collections.
 *
 * These implementations are not meant to be used outside of the ResizeObserver
 * modules as they cover only a limited range of use cases.
 */
/* eslint-disable require-jsdoc, valid-jsdoc */
var MapShim = (function () {
    if (typeof Map !== 'undefined') {
        return Map;
    }
    /**
     * Returns index in provided array that matches the specified key.
     *
     * @param {Array<Array>} arr
     * @param {*} key
     * @returns {number}
     */
    function getIndex(arr, key) {
        var result = -1;
        arr.some(function (entry, index) {
            if (entry[0] === key) {
                result = index;
                return true;
            }
            return false;
        });
        return result;
    }
    return /** @class */ (function () {
        function class_1() {
            this.__entries__ = [];
        }
        Object.defineProperty(class_1.prototype, "size", {
            /**
             * @returns {boolean}
             */
            get: function () {
                return this.__entries__.length;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {*} key
         * @returns {*}
         */
        class_1.prototype.get = function (key) {
            var index = getIndex(this.__entries__, key);
            var entry = this.__entries__[index];
            return entry && entry[1];
        };
        /**
         * @param {*} key
         * @param {*} value
         * @returns {void}
         */
        class_1.prototype.set = function (key, value) {
            var index = getIndex(this.__entries__, key);
            if (~index) {
                this.__entries__[index][1] = value;
            }
            else {
                this.__entries__.push([key, value]);
            }
        };
        /**
         * @param {*} key
         * @returns {void}
         */
        class_1.prototype.delete = function (key) {
            var entries = this.__entries__;
            var index = getIndex(entries, key);
            if (~index) {
                entries.splice(index, 1);
            }
        };
        /**
         * @param {*} key
         * @returns {void}
         */
        class_1.prototype.has = function (key) {
            return !!~getIndex(this.__entries__, key);
        };
        /**
         * @returns {void}
         */
        class_1.prototype.clear = function () {
            this.__entries__.splice(0);
        };
        /**
         * @param {Function} callback
         * @param {*} [ctx=null]
         * @returns {void}
         */
        class_1.prototype.forEach = function (callback, ctx) {
            if (ctx === void 0) { ctx = null; }
            for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
                var entry = _a[_i];
                callback.call(ctx, entry[1], entry[0]);
            }
        };
        return class_1;
    }());
})();

/**
 * Detects whether window and document objects are available in current environment.
 */
var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document;

// Returns global object of a current environment.
var global$1 = (function () {
    if (typeof global !== 'undefined' && global.Math === Math) {
        return global;
    }
    if (typeof self !== 'undefined' && self.Math === Math) {
        return self;
    }
    if (typeof window !== 'undefined' && window.Math === Math) {
        return window;
    }
    // eslint-disable-next-line no-new-func
    return Function('return this')();
})();

/**
 * A shim for the requestAnimationFrame which falls back to the setTimeout if
 * first one is not supported.
 *
 * @returns {number} Requests' identifier.
 */
var requestAnimationFrame$1 = (function () {
    if (typeof requestAnimationFrame === 'function') {
        // It's required to use a bounded function because IE sometimes throws
        // an "Invalid calling object" error if rAF is invoked without the global
        // object on the left hand side.
        return requestAnimationFrame.bind(global$1);
    }
    return function (callback) { return setTimeout(function () { return callback(Date.now()); }, 1000 / 60); };
})();

// Defines minimum timeout before adding a trailing call.
var trailingTimeout = 2;
/**
 * Creates a wrapper function which ensures that provided callback will be
 * invoked only once during the specified delay period.
 *
 * @param {Function} callback - Function to be invoked after the delay period.
 * @param {number} delay - Delay after which to invoke callback.
 * @returns {Function}
 */
function throttle (callback, delay) {
    var leadingCall = false, trailingCall = false, lastCallTime = 0;
    /**
     * Invokes the original callback function and schedules new invocation if
     * the "proxy" was called during current request.
     *
     * @returns {void}
     */
    function resolvePending() {
        if (leadingCall) {
            leadingCall = false;
            callback();
        }
        if (trailingCall) {
            proxy();
        }
    }
    /**
     * Callback invoked after the specified delay. It will further postpone
     * invocation of the original function delegating it to the
     * requestAnimationFrame.
     *
     * @returns {void}
     */
    function timeoutCallback() {
        requestAnimationFrame$1(resolvePending);
    }
    /**
     * Schedules invocation of the original function.
     *
     * @returns {void}
     */
    function proxy() {
        var timeStamp = Date.now();
        if (leadingCall) {
            // Reject immediately following calls.
            if (timeStamp - lastCallTime < trailingTimeout) {
                return;
            }
            // Schedule new call to be in invoked when the pending one is resolved.
            // This is important for "transitions" which never actually start
            // immediately so there is a chance that we might miss one if change
            // happens amids the pending invocation.
            trailingCall = true;
        }
        else {
            leadingCall = true;
            trailingCall = false;
            setTimeout(timeoutCallback, delay);
        }
        lastCallTime = timeStamp;
    }
    return proxy;
}

// Minimum delay before invoking the update of observers.
var REFRESH_DELAY = 20;
// A list of substrings of CSS properties used to find transition events that
// might affect dimensions of observed elements.
var transitionKeys = ['top', 'right', 'bottom', 'left', 'width', 'height', 'size', 'weight'];
// Check if MutationObserver is available.
var mutationObserverSupported = typeof MutationObserver !== 'undefined';
/**
 * Singleton controller class which handles updates of ResizeObserver instances.
 */
var ResizeObserverController = /** @class */ (function () {
    /**
     * Creates a new instance of ResizeObserverController.
     *
     * @private
     */
    function ResizeObserverController() {
        /**
         * Indicates whether DOM listeners have been added.
         *
         * @private {boolean}
         */
        this.connected_ = false;
        /**
         * Tells that controller has subscribed for Mutation Events.
         *
         * @private {boolean}
         */
        this.mutationEventsAdded_ = false;
        /**
         * Keeps reference to the instance of MutationObserver.
         *
         * @private {MutationObserver}
         */
        this.mutationsObserver_ = null;
        /**
         * A list of connected observers.
         *
         * @private {Array<ResizeObserverSPI>}
         */
        this.observers_ = [];
        this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
        this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
    }
    /**
     * Adds observer to observers list.
     *
     * @param {ResizeObserverSPI} observer - Observer to be added.
     * @returns {void}
     */
    ResizeObserverController.prototype.addObserver = function (observer) {
        if (!~this.observers_.indexOf(observer)) {
            this.observers_.push(observer);
        }
        // Add listeners if they haven't been added yet.
        if (!this.connected_) {
            this.connect_();
        }
    };
    /**
     * Removes observer from observers list.
     *
     * @param {ResizeObserverSPI} observer - Observer to be removed.
     * @returns {void}
     */
    ResizeObserverController.prototype.removeObserver = function (observer) {
        var observers = this.observers_;
        var index = observers.indexOf(observer);
        // Remove observer if it's present in registry.
        if (~index) {
            observers.splice(index, 1);
        }
        // Remove listeners if controller has no connected observers.
        if (!observers.length && this.connected_) {
            this.disconnect_();
        }
    };
    /**
     * Invokes the update of observers. It will continue running updates insofar
     * it detects changes.
     *
     * @returns {void}
     */
    ResizeObserverController.prototype.refresh = function () {
        var changesDetected = this.updateObservers_();
        // Continue running updates if changes have been detected as there might
        // be future ones caused by CSS transitions.
        if (changesDetected) {
            this.refresh();
        }
    };
    /**
     * Updates every observer from observers list and notifies them of queued
     * entries.
     *
     * @private
     * @returns {boolean} Returns "true" if any observer has detected changes in
     *      dimensions of it's elements.
     */
    ResizeObserverController.prototype.updateObservers_ = function () {
        // Collect observers that have active observations.
        var activeObservers = this.observers_.filter(function (observer) {
            return observer.gatherActive(), observer.hasActive();
        });
        // Deliver notifications in a separate cycle in order to avoid any
        // collisions between observers, e.g. when multiple instances of
        // ResizeObserver are tracking the same element and the callback of one
        // of them changes content dimensions of the observed target. Sometimes
        // this may result in notifications being blocked for the rest of observers.
        activeObservers.forEach(function (observer) { return observer.broadcastActive(); });
        return activeObservers.length > 0;
    };
    /**
     * Initializes DOM listeners.
     *
     * @private
     * @returns {void}
     */
    ResizeObserverController.prototype.connect_ = function () {
        // Do nothing if running in a non-browser environment or if listeners
        // have been already added.
        if (!isBrowser || this.connected_) {
            return;
        }
        // Subscription to the "Transitionend" event is used as a workaround for
        // delayed transitions. This way it's possible to capture at least the
        // final state of an element.
        document.addEventListener('transitionend', this.onTransitionEnd_);
        window.addEventListener('resize', this.refresh);
        if (mutationObserverSupported) {
            this.mutationsObserver_ = new MutationObserver(this.refresh);
            this.mutationsObserver_.observe(document, {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true
            });
        }
        else {
            document.addEventListener('DOMSubtreeModified', this.refresh);
            this.mutationEventsAdded_ = true;
        }
        this.connected_ = true;
    };
    /**
     * Removes DOM listeners.
     *
     * @private
     * @returns {void}
     */
    ResizeObserverController.prototype.disconnect_ = function () {
        // Do nothing if running in a non-browser environment or if listeners
        // have been already removed.
        if (!isBrowser || !this.connected_) {
            return;
        }
        document.removeEventListener('transitionend', this.onTransitionEnd_);
        window.removeEventListener('resize', this.refresh);
        if (this.mutationsObserver_) {
            this.mutationsObserver_.disconnect();
        }
        if (this.mutationEventsAdded_) {
            document.removeEventListener('DOMSubtreeModified', this.refresh);
        }
        this.mutationsObserver_ = null;
        this.mutationEventsAdded_ = false;
        this.connected_ = false;
    };
    /**
     * "Transitionend" event handler.
     *
     * @private
     * @param {TransitionEvent} event
     * @returns {void}
     */
    ResizeObserverController.prototype.onTransitionEnd_ = function (_a) {
        var _b = _a.propertyName, propertyName = _b === void 0 ? '' : _b;
        // Detect whether transition may affect dimensions of an element.
        var isReflowProperty = transitionKeys.some(function (key) {
            return !!~propertyName.indexOf(key);
        });
        if (isReflowProperty) {
            this.refresh();
        }
    };
    /**
     * Returns instance of the ResizeObserverController.
     *
     * @returns {ResizeObserverController}
     */
    ResizeObserverController.getInstance = function () {
        if (!this.instance_) {
            this.instance_ = new ResizeObserverController();
        }
        return this.instance_;
    };
    /**
     * Holds reference to the controller's instance.
     *
     * @private {ResizeObserverController}
     */
    ResizeObserverController.instance_ = null;
    return ResizeObserverController;
}());

/**
 * Defines non-writable/enumerable properties of the provided target object.
 *
 * @param {Object} target - Object for which to define properties.
 * @param {Object} props - Properties to be defined.
 * @returns {Object} Target object.
 */
var defineConfigurable = (function (target, props) {
    for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
        var key = _a[_i];
        Object.defineProperty(target, key, {
            value: props[key],
            enumerable: false,
            writable: false,
            configurable: true
        });
    }
    return target;
});

/**
 * Returns the global object associated with provided element.
 *
 * @param {Object} target
 * @returns {Object}
 */
var getWindowOf = (function (target) {
    // Assume that the element is an instance of Node, which means that it
    // has the "ownerDocument" property from which we can retrieve a
    // corresponding global object.
    var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;
    // Return the local global object if it's not possible extract one from
    // provided element.
    return ownerGlobal || global$1;
});

// Placeholder of an empty content rectangle.
var emptyRect = createRectInit(0, 0, 0, 0);
/**
 * Converts provided string to a number.
 *
 * @param {number|string} value
 * @returns {number}
 */
function toFloat(value) {
    return parseFloat(value) || 0;
}
/**
 * Extracts borders size from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @param {...string} positions - Borders positions (top, right, ...)
 * @returns {number}
 */
function getBordersSize(styles) {
    var positions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        positions[_i - 1] = arguments[_i];
    }
    return positions.reduce(function (size, position) {
        var value = styles['border-' + position + '-width'];
        return size + toFloat(value);
    }, 0);
}
/**
 * Extracts paddings sizes from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @returns {Object} Paddings box.
 */
function getPaddings(styles) {
    var positions = ['top', 'right', 'bottom', 'left'];
    var paddings = {};
    for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
        var position = positions_1[_i];
        var value = styles['padding-' + position];
        paddings[position] = toFloat(value);
    }
    return paddings;
}
/**
 * Calculates content rectangle of provided SVG element.
 *
 * @param {SVGGraphicsElement} target - Element content rectangle of which needs
 *      to be calculated.
 * @returns {DOMRectInit}
 */
function getSVGContentRect(target) {
    var bbox = target.getBBox();
    return createRectInit(0, 0, bbox.width, bbox.height);
}
/**
 * Calculates content rectangle of provided HTMLElement.
 *
 * @param {HTMLElement} target - Element for which to calculate the content rectangle.
 * @returns {DOMRectInit}
 */
function getHTMLElementContentRect(target) {
    // Client width & height properties can't be
    // used exclusively as they provide rounded values.
    var clientWidth = target.clientWidth, clientHeight = target.clientHeight;
    // By this condition we can catch all non-replaced inline, hidden and
    // detached elements. Though elements with width & height properties less
    // than 0.5 will be discarded as well.
    //
    // Without it we would need to implement separate methods for each of
    // those cases and it's not possible to perform a precise and performance
    // effective test for hidden elements. E.g. even jQuery's ':visible' filter
    // gives wrong results for elements with width & height less than 0.5.
    if (!clientWidth && !clientHeight) {
        return emptyRect;
    }
    var styles = getWindowOf(target).getComputedStyle(target);
    var paddings = getPaddings(styles);
    var horizPad = paddings.left + paddings.right;
    var vertPad = paddings.top + paddings.bottom;
    // Computed styles of width & height are being used because they are the
    // only dimensions available to JS that contain non-rounded values. It could
    // be possible to utilize the getBoundingClientRect if only it's data wasn't
    // affected by CSS transformations let alone paddings, borders and scroll bars.
    var width = toFloat(styles.width), height = toFloat(styles.height);
    // Width & height include paddings and borders when the 'border-box' box
    // model is applied (except for IE).
    if (styles.boxSizing === 'border-box') {
        // Following conditions are required to handle Internet Explorer which
        // doesn't include paddings and borders to computed CSS dimensions.
        //
        // We can say that if CSS dimensions + paddings are equal to the "client"
        // properties then it's either IE, and thus we don't need to subtract
        // anything, or an element merely doesn't have paddings/borders styles.
        if (Math.round(width + horizPad) !== clientWidth) {
            width -= getBordersSize(styles, 'left', 'right') + horizPad;
        }
        if (Math.round(height + vertPad) !== clientHeight) {
            height -= getBordersSize(styles, 'top', 'bottom') + vertPad;
        }
    }
    // Following steps can't be applied to the document's root element as its
    // client[Width/Height] properties represent viewport area of the window.
    // Besides, it's as well not necessary as the <html> itself neither has
    // rendered scroll bars nor it can be clipped.
    if (!isDocumentElement(target)) {
        // In some browsers (only in Firefox, actually) CSS width & height
        // include scroll bars size which can be removed at this step as scroll
        // bars are the only difference between rounded dimensions + paddings
        // and "client" properties, though that is not always true in Chrome.
        var vertScrollbar = Math.round(width + horizPad) - clientWidth;
        var horizScrollbar = Math.round(height + vertPad) - clientHeight;
        // Chrome has a rather weird rounding of "client" properties.
        // E.g. for an element with content width of 314.2px it sometimes gives
        // the client width of 315px and for the width of 314.7px it may give
        // 314px. And it doesn't happen all the time. So just ignore this delta
        // as a non-relevant.
        if (Math.abs(vertScrollbar) !== 1) {
            width -= vertScrollbar;
        }
        if (Math.abs(horizScrollbar) !== 1) {
            height -= horizScrollbar;
        }
    }
    return createRectInit(paddings.left, paddings.top, width, height);
}
/**
 * Checks whether provided element is an instance of the SVGGraphicsElement.
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */
var isSVGGraphicsElement = (function () {
    // Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
    // interface.
    if (typeof SVGGraphicsElement !== 'undefined') {
        return function (target) { return target instanceof getWindowOf(target).SVGGraphicsElement; };
    }
    // If it's so, then check that element is at least an instance of the
    // SVGElement and that it has the "getBBox" method.
    // eslint-disable-next-line no-extra-parens
    return function (target) { return (target instanceof getWindowOf(target).SVGElement &&
        typeof target.getBBox === 'function'); };
})();
/**
 * Checks whether provided element is a document element (<html>).
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */
function isDocumentElement(target) {
    return target === getWindowOf(target).document.documentElement;
}
/**
 * Calculates an appropriate content rectangle for provided html or svg element.
 *
 * @param {Element} target - Element content rectangle of which needs to be calculated.
 * @returns {DOMRectInit}
 */
function getContentRect(target) {
    if (!isBrowser) {
        return emptyRect;
    }
    if (isSVGGraphicsElement(target)) {
        return getSVGContentRect(target);
    }
    return getHTMLElementContentRect(target);
}
/**
 * Creates rectangle with an interface of the DOMRectReadOnly.
 * Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
 *
 * @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
 * @returns {DOMRectReadOnly}
 */
function createReadOnlyRect(_a) {
    var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
    // If DOMRectReadOnly is available use it as a prototype for the rectangle.
    var Constr = typeof DOMRectReadOnly !== 'undefined' ? DOMRectReadOnly : Object;
    var rect = Object.create(Constr.prototype);
    // Rectangle's properties are not writable and non-enumerable.
    defineConfigurable(rect, {
        x: x, y: y, width: width, height: height,
        top: y,
        right: x + width,
        bottom: height + y,
        left: x
    });
    return rect;
}
/**
 * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
 * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
 *
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @param {number} width - Rectangle's width.
 * @param {number} height - Rectangle's height.
 * @returns {DOMRectInit}
 */
function createRectInit(x, y, width, height) {
    return { x: x, y: y, width: width, height: height };
}

/**
 * Class that is responsible for computations of the content rectangle of
 * provided DOM element and for keeping track of it's changes.
 */
var ResizeObservation = /** @class */ (function () {
    /**
     * Creates an instance of ResizeObservation.
     *
     * @param {Element} target - Element to be observed.
     */
    function ResizeObservation(target) {
        /**
         * Broadcasted width of content rectangle.
         *
         * @type {number}
         */
        this.broadcastWidth = 0;
        /**
         * Broadcasted height of content rectangle.
         *
         * @type {number}
         */
        this.broadcastHeight = 0;
        /**
         * Reference to the last observed content rectangle.
         *
         * @private {DOMRectInit}
         */
        this.contentRect_ = createRectInit(0, 0, 0, 0);
        this.target = target;
    }
    /**
     * Updates content rectangle and tells whether it's width or height properties
     * have changed since the last broadcast.
     *
     * @returns {boolean}
     */
    ResizeObservation.prototype.isActive = function () {
        var rect = getContentRect(this.target);
        this.contentRect_ = rect;
        return (rect.width !== this.broadcastWidth ||
            rect.height !== this.broadcastHeight);
    };
    /**
     * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
     * from the corresponding properties of the last observed content rectangle.
     *
     * @returns {DOMRectInit} Last observed content rectangle.
     */
    ResizeObservation.prototype.broadcastRect = function () {
        var rect = this.contentRect_;
        this.broadcastWidth = rect.width;
        this.broadcastHeight = rect.height;
        return rect;
    };
    return ResizeObservation;
}());

var ResizeObserverEntry = /** @class */ (function () {
    /**
     * Creates an instance of ResizeObserverEntry.
     *
     * @param {Element} target - Element that is being observed.
     * @param {DOMRectInit} rectInit - Data of the element's content rectangle.
     */
    function ResizeObserverEntry(target, rectInit) {
        var contentRect = createReadOnlyRect(rectInit);
        // According to the specification following properties are not writable
        // and are also not enumerable in the native implementation.
        //
        // Property accessors are not being used as they'd require to define a
        // private WeakMap storage which may cause memory leaks in browsers that
        // don't support this type of collections.
        defineConfigurable(this, { target: target, contentRect: contentRect });
    }
    return ResizeObserverEntry;
}());

var ResizeObserverSPI = /** @class */ (function () {
    /**
     * Creates a new instance of ResizeObserver.
     *
     * @param {ResizeObserverCallback} callback - Callback function that is invoked
     *      when one of the observed elements changes it's content dimensions.
     * @param {ResizeObserverController} controller - Controller instance which
     *      is responsible for the updates of observer.
     * @param {ResizeObserver} callbackCtx - Reference to the assets
     *      ResizeObserver instance which will be passed to callback function.
     */
    function ResizeObserverSPI(callback, controller, callbackCtx) {
        /**
         * Collection of resize observations that have detected changes in dimensions
         * of elements.
         *
         * @private {Array<ResizeObservation>}
         */
        this.activeObservations_ = [];
        /**
         * Registry of the ResizeObservation instances.
         *
         * @private {Map<Element, ResizeObservation>}
         */
        this.observations_ = new MapShim();
        if (typeof callback !== 'function') {
            throw new TypeError('The callback provided as parameter 1 is not a function.');
        }
        this.callback_ = callback;
        this.controller_ = controller;
        this.callbackCtx_ = callbackCtx;
    }
    /**
     * Starts observing provided element.
     *
     * @param {Element} target - Element to be observed.
     * @returns {void}
     */
    ResizeObserverSPI.prototype.observe = function (target) {
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }
        // Do nothing if current environment doesn't have the Element interface.
        if (typeof Element === 'undefined' || !(Element instanceof Object)) {
            return;
        }
        if (!(target instanceof getWindowOf(target).Element)) {
            throw new TypeError('parameter 1 is not of type "Element".');
        }
        var observations = this.observations_;
        // Do nothing if element is already being observed.
        if (observations.has(target)) {
            return;
        }
        observations.set(target, new ResizeObservation(target));
        this.controller_.addObserver(this);
        // Force the update of observations.
        this.controller_.refresh();
    };
    /**
     * Stops observing provided element.
     *
     * @param {Element} target - Element to stop observing.
     * @returns {void}
     */
    ResizeObserverSPI.prototype.unobserve = function (target) {
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }
        // Do nothing if current environment doesn't have the Element interface.
        if (typeof Element === 'undefined' || !(Element instanceof Object)) {
            return;
        }
        if (!(target instanceof getWindowOf(target).Element)) {
            throw new TypeError('parameter 1 is not of type "Element".');
        }
        var observations = this.observations_;
        // Do nothing if element is not being observed.
        if (!observations.has(target)) {
            return;
        }
        observations.delete(target);
        if (!observations.size) {
            this.controller_.removeObserver(this);
        }
    };
    /**
     * Stops observing all elements.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.disconnect = function () {
        this.clearActive();
        this.observations_.clear();
        this.controller_.removeObserver(this);
    };
    /**
     * Collects observation instances the associated element of which has changed
     * it's content rectangle.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.gatherActive = function () {
        var _this = this;
        this.clearActive();
        this.observations_.forEach(function (observation) {
            if (observation.isActive()) {
                _this.activeObservations_.push(observation);
            }
        });
    };
    /**
     * Invokes initial callback function with a list of ResizeObserverEntry
     * instances collected from active resize observations.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.broadcastActive = function () {
        // Do nothing if observer doesn't have active observations.
        if (!this.hasActive()) {
            return;
        }
        var ctx = this.callbackCtx_;
        // Create ResizeObserverEntry instance for every active observation.
        var entries = this.activeObservations_.map(function (observation) {
            return new ResizeObserverEntry(observation.target, observation.broadcastRect());
        });
        this.callback_.call(ctx, entries, ctx);
        this.clearActive();
    };
    /**
     * Clears the collection of active observations.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.clearActive = function () {
        this.activeObservations_.splice(0);
    };
    /**
     * Tells whether observer has active observations.
     *
     * @returns {boolean}
     */
    ResizeObserverSPI.prototype.hasActive = function () {
        return this.activeObservations_.length > 0;
    };
    return ResizeObserverSPI;
}());

// Registry of internal observers. If WeakMap is not available use current shim
// for the Map collection as it has all required methods and because WeakMap
// can't be fully polyfilled anyway.
var observers = typeof WeakMap !== 'undefined' ? new WeakMap() : new MapShim();
/**
 * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
 * exposing only those methods and properties that are defined in the spec.
 */
var ResizeObserver = /** @class */ (function () {
    /**
     * Creates a new instance of ResizeObserver.
     *
     * @param {ResizeObserverCallback} callback - Callback that is invoked when
     *      dimensions of the observed elements change.
     */
    function ResizeObserver(callback) {
        if (!(this instanceof ResizeObserver)) {
            throw new TypeError('Cannot call a class as a function.');
        }
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }
        var controller = ResizeObserverController.getInstance();
        var observer = new ResizeObserverSPI(callback, controller, this);
        observers.set(this, observer);
    }
    return ResizeObserver;
}());
// Expose assets methods of ResizeObserver.
[
    'observe',
    'unobserve',
    'disconnect'
].forEach(function (method) {
    ResizeObserver.prototype[method] = function () {
        var _a;
        return (_a = observers.get(this))[method].apply(_a, arguments);
    };
});

var index = (function () {
    // Export existing implementation if available.
    if (typeof global$1.ResizeObserver !== 'undefined') {
        return global$1.ResizeObserver;
    }
    return ResizeObserver;
})();

/* harmony default export */ __webpack_exports__["default"] = (index);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/PanZ.js":
/*!*********************!*\
  !*** ./src/PanZ.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function () {
  "use strict";

  (function (global, factory) {
    if (true) {
      !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! @thesoulfresh/pan-zoom */ "./node_modules/@thesoulfresh/pan-zoom/lib/index.js"), __webpack_require__(/*! eventemitter3 */ "./node_modules/eventemitter3/index.js"), __webpack_require__(/*! lodash.debounce */ "./node_modules/lodash.debounce/index.js"), __webpack_require__(/*! object-fit-math */ "./node_modules/object-fit-math/dist/index.js"), __webpack_require__(/*! resize-observer-polyfill */ "./node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else { var mod; }
  })(void 0, function (exports, _panZoom, _eventemitter, _lodash, _objectFitMath, _resizeObserverPolyfill) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = undefined;

    var _panZoom2 = _interopRequireDefault(_panZoom);

    var _eventemitter2 = _interopRequireDefault(_eventemitter);

    var _lodash2 = _interopRequireDefault(_lodash);

    var _resizeObserverPolyfill2 = _interopRequireDefault(_resizeObserverPolyfill);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);

      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
        keys.push.apply(keys, symbols);
      }

      return keys;
    }

    function _objectSpread(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};

        if (i % 2) {
          ownKeys(Object(source), true).forEach(function (key) {
            _defineProperty(target, key, source[key]);
          });
        } else if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
          ownKeys(Object(source)).forEach(function (key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
        }
      }

      return target;
    }

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }

    function _typeof(obj) {
      "@babel/helpers - typeof";

      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof(obj) {
          return typeof obj;
        };
      } else {
        _typeof = function _typeof(obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
      }

      return _typeof(obj);
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
      }

      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          writable: true,
          configurable: true
        }
      });
      if (superClass) _setPrototypeOf(subClass, superClass);
    }

    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };

      return _setPrototypeOf(o, p);
    }

    function _createSuper(Derived) {
      var hasNativeReflectConstruct = _isNativeReflectConstruct();

      return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived),
            result;

        if (hasNativeReflectConstruct) {
          var NewTarget = _getPrototypeOf(this).constructor;

          result = Reflect.construct(Super, arguments, NewTarget);
        } else {
          result = Super.apply(this, arguments);
        }

        return _possibleConstructorReturn(this, result);
      };
    }

    function _possibleConstructorReturn(self, call) {
      if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
      }

      return _assertThisInitialized(self);
    }

    function _assertThisInitialized(self) {
      if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return self;
    }

    function _isNativeReflectConstruct() {
      if (typeof Reflect === "undefined" || !Reflect.construct) return false;
      if (Reflect.construct.sham) return false;
      if (typeof Proxy === "function") return true;

      try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
        return true;
      } catch (e) {
        return false;
      }
    }

    function _getPrototypeOf(o) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _getPrototypeOf(o);
    }

    var Base = function (_EventEmitter) {
      _inherits(Base, _EventEmitter);

      var _super = _createSuper(Base);

      function Base() {
        var _this;

        var debug = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        _classCallCheck(this, Base);

        _this = _super.call(this); // Setup configurable logging.

        var bound = function bound(level) {
          return console[level].bind(window.console, '[PanZ]');
        };

        var noop = function noop() {};

        ['debug', 'log', 'info'].forEach(function (level) {
          _this[level] = debug ? bound(level) : noop;
        }); // Always log the following...

        _this.error = bound('error');
        _this.warn = bound('warn');
        return _this;
      }

      return Base;
    }(_eventemitter2.default);

    var PanZ = function (_Base) {
      _inherits(PanZ, _Base);

      var _super2 = _createSuper(PanZ);

      function PanZ() {
        var _this2;

        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$minZoom = _ref.minZoom,
            minZoom = _ref$minZoom === void 0 ? 0.3 : _ref$minZoom,
            _ref$maxZoom = _ref.maxZoom,
            maxZoom = _ref$maxZoom === void 0 ? 4 : _ref$maxZoom,
            _ref$zoomSpeed = _ref.zoomSpeed,
            zoomSpeed = _ref$zoomSpeed === void 0 ? 1 : _ref$zoomSpeed,
            _ref$zoomEnabled = _ref.zoomEnabled,
            zoomEnabled = _ref$zoomEnabled === void 0 ? true : _ref$zoomEnabled,
            _ref$panEnabled = _ref.panEnabled,
            panEnabled = _ref$panEnabled === void 0 ? true : _ref$panEnabled,
            _ref$bounds = _ref.bounds,
            bounds = _ref$bounds === void 0 ? 0.8 : _ref$bounds,
            boundingElement = _ref.boundingElement,
            _ref$gestureTimeout = _ref.gestureTimeout,
            gestureTimeout = _ref$gestureTimeout === void 0 ? 60 : _ref$gestureTimeout,
            _ref$initialFit = _ref.initialFit,
            initialFit = _ref$initialFit === void 0 ? null : _ref$initialFit;

        var element = arguments.length > 1 ? arguments[1] : undefined;
        var verbose = arguments.length > 2 ? arguments[2] : undefined;

        _classCallCheck(this, PanZ);

        _this2 = _super2.call(this, verbose);

        _this2.log('created with', arguments);

        _this2._x = 0;
        _this2._y = 0; // Element scale value.

        _this2._z = 1; // The focus point of movement.

        _this2._cx = 0;
        _this2._cy = 0;
        _this2.boundingType = 0;
        _this2._moving = false;
        _this2.onResize = (0, _lodash2.default)(_this2.onResize.bind(_assertThisInitialized(_this2)), 300);
        _this2.onGestureStart = _this2.onGestureStart.bind(_assertThisInitialized(_this2));
        _this2.onGestureChange = _this2.onGestureChange.bind(_assertThisInitialized(_this2));
        _this2.onGestureEnd = _this2.onGestureEnd.bind(_assertThisInitialized(_this2));
        _this2.onDoubleClick = _this2.onDoubleClick.bind(_assertThisInitialized(_this2));
        _this2.bounds = bounds;
        _this2.boundingElement = boundingElement;
        _this2._zoomEnabled = panEnabled;
        _this2._panEnabled = zoomEnabled;
        _this2._zoomSpeed = zoomSpeed / 100;
        _this2.minZoom = minZoom;
        _this2.maxZoom = maxZoom;
        _this2.initialFit = initialFit;
        _this2.gestureTimeout = gestureTimeout;
        if (element) _this2.init(element, {});
        return _this2;
      }

      _createClass(PanZ, [{
        key: "init",
        value: function init(element, options) {
          this.destroy();
          this.element = element; // Apply any options the user wants to update.

          if (options) {
            for (var key in options) {
              this[key] = options[key];
            }
          } // Initialize the pan zoom tracker.


          this._initPanZoom(); // Setup the necessary transform settings and warn the
          // user if we are going to change their settings.


          this._setTransformOrigin();

          this._setSelectionProperties();

          this._testTransform(); // If a bounding element wasn't set, the use the element itself.


          if (!this.boundingElement) this.boundingElement = element;
          this._resizeObserver = new _resizeObserverPolyfill2.default(this.onResize);

          this._resizeObserver.observe(this.boundingElement);

          this.info('initialized with', arguments);
          this.debug('settings:', this);
          if (this.initialFit === 'center') this.center(false, true);else if (this.initialFit === 'contain') this.contain(false, true);else if (this.initialFit === 'cover') this.cover(false, true);
          this._initialized = true;
        }
      }, {
        key: "destroy",
        value: function destroy() {
          if (this.element) {
            // Cancel debounced functions.
            if (this.onResize.cancel) this.onResize.cancel(); // Destroy pan/zoom functionality.

            this._destroyPanZoom(); // Remove resize observer.


            this._resizeObserver.disconnect(); // Remove listeners to this object.


            this.removeAllListeners(); // Clean up DOM references

            this.element = null;
            this.boundingElement = null;
            this._initialized = false;
            this.info('destroyed');
          }
        }
      }, {
        key: "_initPanZoom",
        value: function _initPanZoom() {
          if (!this.unpz && this.element && this.enabled) {
            // TODO Configure pan friction and clamp animation to match zoomSpeed
            this.unpz = new _panZoom2.default(this.element, this.onGestureChange, {
              onStart: this.onGestureStart,
              onEnd: this.onGestureEnd,
              onDoubleTap: this.onDoubleClick
            });
            this._moving = false; // TODO Verify this

            if (!this._panEnabled) this.disablePan();
            if (!this._zoomEnabled) this.disableZoom();
          }
        }
      }, {
        key: "_destroyPanZoom",
        value: function _destroyPanZoom() {
          if (this.unpz) {
            this.unpz();
            this.unpz = null;
            this._moving = false;
          }
        }
      }, {
        key: "enable",
        value: function enable() {
          this.enablePan();
          this.enableZoom();

          this._initPanZoom();
        }
      }, {
        key: "disable",
        value: function disable() {
          this.disablePan();
          this.disableZoom();

          this._destroyPanZoom();
        }
      }, {
        key: "enablePan",
        value: function enablePan() {
          this._panEnabled = true;
          this.unpz.enablePan();
          this.info('pan enabled');
        }
      }, {
        key: "disablePan",
        value: function disablePan() {
          this._panEnabled = false;
          this.unpz.disablePan(); // Disabling pan-zoom will stop all events an we will
          // nolonger recieve the gesture end event, so we need
          // to clean up the moving state here.

          this._moving = false;
          this.info('pan disabled');
        }
      }, {
        key: "enableZoom",
        value: function enableZoom() {
          this._zoomEnabled = true;
          this.unpz.enableZoom();
          this.info('zoom enabled');
        }
      }, {
        key: "disableZoom",
        value: function disableZoom() {
          this._zoomEnabled = false;
          this.unpz.disableZoom(); // Disabling pan-zoom will stop all events an we will
          // nolonger recieve the gesture end event, so we need
          // to clean up the moving state here.

          this._moving = false;
          this.info('zoom disabled');
        }
      }, {
        key: "reset",
        value: function reset(clamp, animated) {
          this._emitState('start');

          this._setState(0, 0, 1, clamp, animated);
        }
      }, {
        key: "center",
        value: function center(animated, immediate) {
          this._emitState('start');

          var t = this._percentToTranslation(0.5, 0.5);

          this._setState(t.x, t.y, this._z, false, animated, immediate);
        }
      }, {
        key: "contain",
        value: function contain(animated, immediate) {
          this._fitToBounds('contain', false, animated, immediate);
        }
      }, {
        key: "cover",
        value: function cover(animated, immediate) {
          this._fitToBounds('cover', false, animated, immediate);
        }
      }, {
        key: "scaleDown",
        value: function scaleDown(animated, immediate) {
          this._fitToBounds('scale-down', false, animated, immediate);
        }
      }, {
        key: "panTo",
        value: function panTo(px, py, clamp, animated) {
          this._emitState('start');

          var t = this._percentToTranslation(px, py);

          this._setState(t.x, t.y, this._z, clamp, animated);
        }
      }, {
        key: "zoomTo",
        value: function zoomTo() {
          var z = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
          var cpx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;
          var cpy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;
          var clamp = arguments.length > 3 ? arguments[3] : undefined;
          var animated = arguments.length > 4 ? arguments[4] : undefined;

          this._emitState('start');

          var nz = this._scaleToScaleDelta(z); // TODO Use _setState instead?


          this.zoomBy(nz, cpx, cpy, clamp, animated);
        }
      }, {
        key: "centerOn",
        value: function centerOn() {
          var px = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;
          var py = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;
          var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this._z;
          var clamp = arguments.length > 3 ? arguments[3] : undefined;
          var animated = arguments.length > 4 ? arguments[4] : undefined;

          this._emitState('start');

          var t = this._percentToTranslation(px, py); // const dz = this._scaleToScaleDelta(z);


          var dz = z - this._z;

          var p = this._getPositionAdjustedForScale(dz, px, py);

          var x = t.x + p.x;
          var y = t.y + p.y;

          this._setState(x, y, z, clamp, animated);
        }
      }, {
        key: "zoomToArea",
        value: function zoomToArea()
        /*top, left, bottom, right, clamp = !!this.bounds*/
        {// this._emitState('start');
          // parameters should be a percentage?
        }
      }, {
        key: "_scaleToScaleDelta",
        value: function _scaleToScaleDelta(z) {
          return (this._z - z) / this._zoomSpeed;
        }
      }, {
        key: "_percentToTranslation",
        value: function _percentToTranslation(px, py) {
          var bw = this.boundingWidth; //this.boundingElement.offsetWidth;

          var bh = this.boundingHeight; //this.boundingElement.offsetHeight;

          var rect = this.element.getBoundingClientRect();
          return {
            x: bw / 2 - rect.width * px,
            y: bh / 2 - rect.height * py
          };
        }
      }, {
        key: "getContainSize",
        value: function getContainSize() {
          var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.element;
          var bounds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.boundingElement;
          var parent = bounds.getBoundingClientRect();
          var child = element.getBoundingClientRect();
          var fit = (0, _objectFitMath.fitAndPosition)(parent, child, 'contain', '50%', '50%');
          return _objectSpread(_objectSpread({}, fit), {}, {
            scale: fit.width / child.width
          });
        }
      }, {
        key: "getCoverSize",
        value: function getCoverSize() {
          var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.element;
          var bounds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.boundingElement;
          var parent = bounds.getBoundingClientRect();
          var child = element.getBoundingClientRect();
          var fit = (0, _objectFitMath.fitAndPosition)(parent, child, 'cover', '50%', '50%');
          return _objectSpread(_objectSpread({}, fit), {}, {
            scale: fit.width / child.width
          });
        }
      }, {
        key: "getScaleDownSize",
        value: function getScaleDownSize() {
          var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.element;
          var bounds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.boundingElement;
          var parent = bounds.getBoundingClientRect();
          var child = element.getBoundingClientRect();
          var fit = (0, _objectFitMath.fitAndPosition)(parent, child, 'scale-down', '50%', '50%');
          return _objectSpread(_objectSpread({}, fit), {}, {
            scale: fit.width / child.width
          });
        }
      }, {
        key: "_fitToBounds",
        value: function _fitToBounds() {
          var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'contain';
          var clamp = arguments.length > 1 ? arguments[1] : undefined;
          var animated = arguments.length > 2 ? arguments[2] : undefined;
          var immediate = arguments.length > 3 ? arguments[3] : undefined;
          var parent = this.boundingElement.getBoundingClientRect();
          var child = this.element.getBoundingClientRect();

          var _fitAndPosition = (0, _objectFitMath.fitAndPosition)(parent, child, type, '50%', '50%'),
              x = _fitAndPosition.x,
              y = _fitAndPosition.y,
              width = _fitAndPosition.width;

          var z = width / child.width * this._z; // this.debug('FIT TO BOUNDS',
          //   'x', x,
          //   'y', y,
          //   'z', z,
          //   'width', width,
          //   'height', height,
          //   'element', this.element,
          //   'bounding element', this.boundingElement,
          // );

          this._emitState('start');

          this._setState(x, y, z, clamp, animated, immediate);
        }
      }, {
        key: "onGestureStart",
        value: function onGestureStart() {
          this._moving = true; // These events will contain the values before any changes.

          this._emitState('start');

          this._emitState('gesturestart');
        }
      }, {
        key: "onGestureEnd",
        value: function onGestureEnd() {
          this._moving = false;

          this._clampStateAfterTransition();

          this._emitState('end');

          this._emitState('gestureend');
        }
      }, {
        key: "onGestureChange",
        value: function onGestureChange(_ref2) {
          var _ref2$dx = _ref2.dx,
              dx = _ref2$dx === void 0 ? 0 : _ref2$dx,
              _ref2$dy = _ref2.dy,
              dy = _ref2$dy === void 0 ? 0 : _ref2$dy,
              _ref2$dz = _ref2.dz,
              dz = _ref2$dz === void 0 ? 0 : _ref2$dz,
              px0 = _ref2.px0,
              py0 = _ref2.py0,
              event = _ref2.event;

          if (this.enabled) {
            event.preventDefault(); // this.debug(
            //   'CHANGE',
            //   'dx', dx,
            //   'dy', dy,
            //   'dz', dz,
            //   'px0', px0,
            //   'py0', py0,
            // );
            // New values

            var nx = this._x;
            var ny = this._y;
            var nz = this._z; // Update the pan position.

            if (this._panEnabled) {
              nx += dx;
              ny += dy;
            }

            if (this._zoomEnabled) {
              var p = this._calculatePositionForZoom(this._z, dz, px0, py0); // this.log(
              //   'SCALE ADJUSTED POSITION',
              //   '_z', this._z,
              //   'dz', dz,
              //   'nx', nx,
              //   'ny', ny,
              //   'nz', nz,
              //   'p', p
              // );
              // Adjust to keep the focus centered around the mouse.


              nx += p.x;
              ny += p.y; // Update the zoom value.

              nz = p.z;
            }

            this._gestureUpdate(nx, ny, nz, px0, py0);
          }
        }
      }, {
        key: "panBy",
        value: function panBy(dx, dy, clamp, animated) {
          // New values
          var x = this._x + dx;
          var y = this._y + dy;

          this._setState(x, y, this._z, clamp, animated);
        }
      }, {
        key: "zoomBy",
        value: function zoomBy(dz, cpx, cpy, clamp, animated) {
          // New values
          var nx = this._x;
          var ny = this._y;
          var nz = this._z;

          var p = this._calculatePositionForZoom(this._z, dz, cpx, cpy); // Adjust to keep the focus centered around the mouse.


          nx += p.x;
          ny += p.y; // Update the zoom value.

          nz = p.z;

          this._setState(nx, ny, nz, clamp, animated);
        }
      }, {
        key: "onDoubleClick",
        value: function onDoubleClick(_ref3) {
          var px0 = _ref3.px0,
              py0 = _ref3.py0;

          if (this._zoomEnabled) {
            var max = this.maxZoom;
            var min = this.minZoom;

            if (this.initialFit) {
              if (this.initialFit === 'contain') min = this.getContainSize().scale;else if (this.initialFit === 'cover') min = this.getCoverSize().scale;else if (this.initialFit === 'scale-down') min = this.getScaleDownSize().scale;
            }

            var mid = min + (max - min) / 2;
            var z = this._z > mid ? min : max;
            var dz = (this._z - z) / this._zoomSpeed;
            this.log('DOUBLE CLICK', 'this._z', this._z, 'mid', mid, 'z', z, 'dz', dz);
            this.zoomBy(dz, px0, py0, true);
          }
        }
      }, {
        key: "onResize",
        value: function onResize() {
          this._clampStateAfterTransition();

          this.info('resize end');
        }
      }, {
        key: "_setState",
        value: function _setState(x, y, z, clamp) {
          var animated = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
          var immediate = arguments.length > 5 ? arguments[5] : undefined;

          if (animated) {
            this._transitionTo(x, y, z, clamp);
          } else {
            this.update(x, y, z, clamp, immediate);
          }
        }
      }, {
        key: "_transitionTo",
        value: function _transitionTo() {
          var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
          var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
          var clamp = arguments.length > 3 ? arguments[3] : undefined;

          if (this._x !== x || this._y !== y || this._z !== z) {
            this.log('TRANSITION TO', 'x', x, 'y', y, 'z', z);
            this._x = x;
            this._y = y;
            this._z = z;

            this._transitionToState(clamp);
          }
        }
      }, {
        key: "_cancelRAF",
        value: function _cancelRAF() {
          if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
          }
        }
      }, {
        key: "update",
        value: function update(x, y, z) {
          var _this3 = this;

          var clamp = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
          var immediate = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
          // If not in immediate mode, ensure moving is set
          // until the requestAnimationFrame is called.
          if (!immediate) this._moving = true;

          if (clamp) {
            var result = this._clampPanZoom(x, y, z);

            this._x = result.x;
            this._y = result.y;
            this._z = result.z;
          } else {
            this._x = x;
            this._y = y;
            this._z = z;
          } // Cancel any existing raf or transitions


          this._cancelRAF();

          this._cancelTransitions(); // immediate mode is only used during initialFit to ensure
          // that the target element doesn't jump on screen. This will
          // also bypass event emission because it should be transparent
          // to users of this library.


          if (immediate) {
            this._setTransform(this._x, this._y, this._z);
          } else {
            // Schedule a new update
            this.rafId = requestAnimationFrame(function () {
              _this3._setTransform(_this3._x, _this3._y, _this3._z);

              _this3.rafId = null;
              _this3._moving = false;

              _this3._emitState('update');
            });
          }
        }
      }, {
        key: "_gestureUpdate",
        value: function _gestureUpdate(x, y, z, cx, cy) {
          var _this4 = this;

          // Update the saved position.
          this._x = x;
          this._y = y;
          this._z = z; // TODO Do we really need to store these?

          this._cx = cx;
          this._cy = cy; // Cancel any existing raf or transitions

          this._cancelRAF();

          this._cancelTransitions(); // Schedule a new update


          this.rafId = requestAnimationFrame(function () {
            _this4._setTransform(_this4._x, _this4._y, _this4._z);

            _this4.rafId = null;

            _this4._emitState('update');
          });
        }
      }, {
        key: "_calculatePositionForZoom",
        value: function _calculatePositionForZoom(z, dz, cpx, cpy) {
          // If there's no change in z, return early.
          if (dz === 0) return {
            x: 0,
            y: 0,
            z: z
          };
          var nz = z; // TODO Scaling should happen outside of this method
          // Scaled Delta Z

          var sdz = dz * -1 * this._zoomSpeed; // Delta of the scale value.

          var zoomClampType = 0; // No overscroll past the min/max zoom.

          if (zoomClampType === 0) {
            nz = Math.min(Math.max(z + sdz, this.minZoom), this.maxZoom);
          } // Allow a little bit of overscroll past the min/max zoom.
          // This has some weirdness but keeping the code for now.
          else if (zoomClampType === 1) {
              var absMin = this.minZoom - this.minZoom * 0.5;
              var absMax = this.maxZoom + this.maxZoom * 0.5;
              nz = Math.min(Math.max(z + sdz, absMin), absMax);
            } // Allow full overscroll past the min/max zoom.
            // This feels a little strange when the mouse wheel moves
            // really far. The ideal solution would be to use the
            // mouse wheel to determine a velocity of scroll but
            // then to use our own velocity tracker (similar to
            // impetus) that would allow us to control the friction
            // of the movement.
            else {
                nz = Math.max(z + sdz, 0);
              } // If the zoom level has changed at all, shift the x/y position
          // in order to center the zoom around the touch/mouse center point.


          var diff = nz - z;
          var pos = diff ? this._getPositionAdjustedForScale(diff, cpx, cpy) : {
            x: 0,
            y: 0
          }; // Return the new position.

          return _objectSpread(_objectSpread({}, pos), {}, {
            z: nz
          });
        }
      }, {
        key: "_getPositionAdjustedForScale",
        value: function _getPositionAdjustedForScale(ds) {
          var px = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
          var py = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
          // Unscaled width and height.
          var w = this.elementWidth;
          var h = this.elementHeight; // Change in w/h since last zoom.

          var cw = w * ds;
          var ch = h * ds; // Change in x/y needed to offset scaling around the mouse/touch position.

          var cx = cw * px;
          var cy = ch * py; // this.debug(
          //   'POSITION ADJUSTED FOR SCALE',
          //   'ds', ds,
          //   'w',  w,
          //   'px', px,
          //   'cw', cw,
          //   'cx', cx,
          // );

          return {
            x: -cx,
            y: -cy
          };
        }
      }, {
        key: "_clampZoom",
        value: function _clampZoom(z) {
          var cpx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;
          var cpy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;
          var min = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.minZoom;
          var max = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : this.maxZoom;
          var x = 0;
          var y = 0;
          var cz = z; // If min or max are null, don't clamp in that direction.

          if (min != null) cz = Math.max(cz, min);
          if (max != null) cz = Math.min(cz, max);

          if (z !== cz) {
            var dz = cz - z;

            var adjusted = this._getPositionAdjustedForScale(dz, cpx, cpy);

            x += adjusted.x;
            y += adjusted.y;
            this.info('CLAMP SCALE:', 'unclamped scale', z, 'clamped scale', cz, 'dz', dz, 'x', x, 'y', y);
          }

          return {
            x: x,
            y: y,
            z: cz
          };
        }
      }, {
        key: "_clampPan",
        value: function _clampPan(x, y) {
          var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.bounds;
          var cx = x;
          var cy = y; // If be is 0 or falsy, then clamping is off.

          if (b) {
            var wb = this.boundingWidth;
            var hb = this.boundingHeight;
            var w0 = this.elementWidth;
            var h0 = this.elementHeight;
            var w = Math.ceil(w0 * this._z);
            var h = Math.ceil(h0 * this._z);
            var xMin, yMin, xMax, yMax; // Define the bounds as a percentage of the dimensions of the bounding box.

            if (this.boundingType === 0) {
              // Min values are based on the scaled dimensions of the element.
              xMin = wb * (1 - b) - w;
              yMin = hb * (1 - b) - h; // Max values are based on the dimensions of the bounding element.

              xMax = wb * b;
              yMax = hb * b;
            } // Define the bounds as a percentage of the dimensions of the element.
            else if (this.boundingType === 1) {
                // The number of pixels of the element to be clamped.
                var px = w * b;
                var py = h * b;
                xMin = -px;
                yMin = -py;
                xMax = wb - (w - px);
                yMax = hb - (h - py);
              } // Convert the bounds into a pixel value.
              else {
                  var _px = Math.round(b * 100);

                  xMin = -w + _px;
                  yMin = -h + _px;
                  xMax = wb - _px;
                  yMax = hb - _px;
                }

            cx = Math.min(Math.max(x, xMin), xMax);
            cy = Math.min(Math.max(y, yMin), yMax); // Log the clamp

            if (cx !== x || cy !== y) {
              this.log('CLAMP X/Y:', 'x', x, 'clamped x', cx, 'xMin', xMin, 'xMax', xMax, 'y', y, 'clamped y', cy, 'yMin', yMin, 'yMax', yMax);
            }
          }

          return {
            x: cx,
            y: cy
          };
        }
      }, {
        key: "_clampPanZoom",
        value: function _clampPanZoom() {
          var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._x;
          var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._y;
          var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this._z;
          var clamped = false; // Clamp Zooming

          var clampedZoom = this._clampZoom(z);

          if (clampedZoom.z !== z) {
            clamped = true;
            z = clampedZoom.z;
            x = clampedZoom.x;
            y = clampedZoom.y;
          } // Clamp Panning


          var clampedPan = this._clampPan(x, y);

          if (x !== clampedPan.x || y !== clampedPan.y) {
            clamped = true;
            x = clampedPan.x;
            y = clampedPan.y;
          }

          return {
            clamped: clamped,
            x: x,
            y: y,
            z: z
          };
        }
      }, {
        key: "_clampStateAfterTransition",
        value: function _clampStateAfterTransition() {
          var result = this._clampPanZoom();

          if (result.clamped) {
            this._x = result.x;
            this._y = result.y;
            this._z = result.z;

            this._transitionToState();
          }
        }
      }, {
        key: "_transitionToState",
        value: function _transitionToState(clamp) {
          var _this5 = this;

          this._setTransition(clamp);

          requestAnimationFrame(function () {
            _this5._setTransform(_this5._x, _this5._y, _this5._z);

            _this5._emitState('update');
          });
        }
      }, {
        key: "_cancelTransitions",
        value: function _cancelTransitions() {
          if (this._cancelTransitionEndListener) this._cancelTransitionEndListener();
        }
      }, {
        key: "_setTransition",
        value: function _setTransition() {
          var _this6 = this;

          var clamp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
          var originalTransition = this.element.style.transition; // If the element doesn't have a transform transition, then add our own.
          // TODO This will never emit a transition end

          if (!/transform /.test(originalTransition)) {
            // Handle the transition end event.
            var onTransitionEnd = function onTransitionEnd() {
              _this6._cancelTransitions();

              _this6._emitState('update'); // Always set moving to false here because clamping may not
              // produce another transition. If it does, it will just set
              // moving back to true and then false again after the transition.


              _this6._moving = false;

              if (clamp) {
                _this6._clampStateAfterTransition();
              } else {
                _this6._emitState('end');
              }
            }; // A function that can be called to cancel the current transition.


            this._cancelTransitionEndListener = function () {
              _this6.element.style.transition = originalTransition;

              _this6.element.removeEventListener('transitionend', onTransitionEnd);

              _this6._cancelTransitionEndListener = null;
            };

            this._moving = true;
            this.element.addEventListener('transitionend', onTransitionEnd);
            this.element.style.transition = 'transform 300ms cubic-bezier(0.785, 0.135, 0.150, 0.860)';
          }
        }
      }, {
        key: "_setSelectionProperties",
        value: function _setSelectionProperties() {
          if (this.element.style.touchAction && this.element.style.touchAction !== 'none') {
            this.warn('element already has a "touch-action" style set. ' + 'PanZ will reset the "touch-action" to "none" for propery gesture handling.');
          } // Turning the touch action off ensures that pinch gestures
          // don't zoom the page.


          this.element.style.touchAction = 'none'; // Turning off user selection makes the gesture interactions a little
          // nicer by avoiding selections of items while panning.
          // this.element.style.userSelect = 'none';

          this.element.style.userSelect = 'none';
        }
      }, {
        key: "_setTransformOrigin",
        value: function _setTransformOrigin() {
          if (this.element.style.transformOrigin) {
            this.warn('element already has a "transform-origin" style set. ' + 'PanZ will reset the "transform-origin" to "0 0" for proper pan/zoom functionality.');
          }

          this.element.style.transformOrigin = '0 0'; // TODO Figure out how to prevent flicker of element transition if
          // the scale is > 0
          // this.element.style.webkitBackfaceVisibility = 'hidden';
          // this.element.style.webkitTransformStyle = 'preserve-3d';
          // this.element.style.webkitTransform = 'translateZ(0)';
          // this.element.parentNode.style.webkitTransform = 'translate3d(0,0,0)';
        }
      }, {
        key: "_setTransform",
        value: function _setTransform(x, y, z) {
          this.element.style.transform = "translate(".concat(x, "px, ").concat(y, "px) scale(").concat(z, ")"); // this.element.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${z})`;
        }
      }, {
        key: "_testTransform",
        value: function _testTransform() {
          if (this.element.style.transform) {
            this.warn('element already has a "transform" style set. ' + 'Be aware that PanZ will modify the "transform" ' + 'style during pan/zoom gestures, overriding your custom transform.');
          }
        }
      }, {
        key: "_emitState",
        value: function _emitState(name) {
          var w0 = this.elementWidth;
          var h0 = this.elementHeight;
          var data = {
            x: this._x,
            y: this._y,
            scale: this._z,
            width: Math.ceil(w0 * this._z),
            height: Math.ceil(h0 * this._z),
            unscaledWidth: w0,
            unscaledHeight: h0
          };
          var level = name === 'update' ? 'debug' : 'log';
          this[level](name.toUpperCase(), 'x', data.x.toFixed(0), 'y', data.y.toFixed(0), 'scale', data.scale.toFixed(4), 'width', data.width.toFixed(0), 'height', data.height.toFixed(0), 'originalWidth', data.unscaledWidth, 'originalHeight', data.unscaledHeight);
          this.emit(name, data);
        }
      }, {
        key: "scale",
        get: function get() {
          return this._z;
        }
      }, {
        key: "x",
        get: function get() {
          return this._x;
        }
      }, {
        key: "y",
        get: function get() {
          return this._y;
        }
      }, {
        key: "moving",
        get: function get() {
          return this._moving;
        }
      }, {
        key: "initialized",
        get: function get() {
          return this._initialized;
        }
      }, {
        key: "enabled",
        get: function get() {
          return this._panEnabled || this._zoomEnabled;
        }
      }, {
        key: "panEnabled",
        get: function get() {
          return this._panEnabled;
        }
      }, {
        key: "zoomEnabled",
        get: function get() {
          return this._zoomEnabled;
        }
      }, {
        key: "position",
        get: function get() {
          return {
            x: this._x,
            y: this._y,
            z: this._z
          };
        }
      }, {
        key: "elementWidth",
        get: function get() {
          // offsetWidth is not defined for SVG elements, so use clientWidth as a fallback.
          return this.element.offsetWidth || this.element.clientWidth;
        }
      }, {
        key: "elementHeight",
        get: function get() {
          // offsetHeight is not defined for SVG elements, so use clientHeight as a fallback.
          return this.element.offsetHeight || this.element.clientHeight;
        }
      }, {
        key: "boundingWidth",
        get: function get() {
          // offsetWidth is not defined for SVG elements, so use clientWidth as a fallback.
          return this.boundingElement.offsetWidth || this.boundingElement.clientWidth;
        }
      }, {
        key: "boundingHeight",
        get: function get() {
          // offsetHeight is not defined for SVG elements, so use clientHeight as a fallback.
          return this.boundingElement.offsetHeight || this.boundingElement.clientHeight;
        }
      }]);

      return PanZ;
    }(Base);

    exports.default = PanZ;
    module.exports = exports.default;
  });
});

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function () {
  "use strict";

  (function (global, factory) {
    if (true) {
      !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! ./PanZ */ "./src/PanZ.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else { var mod; }
  })(void 0, function (exports, _PanZ) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    Object.defineProperty(exports, "default", {
      enumerable: true,
      get: function get() {
        return _interopRequireDefault(_PanZ).default;
      }
    });

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    module.exports = exports.default;
  });
});

/***/ })

/******/ });
});
//# sourceMappingURL=lib.js.map