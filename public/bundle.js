(function () { function r(e, n, t) { function o(i, f) { if (!n[i]) { if (!e[i]) { var c = "function" == typeof require && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = "MODULE_NOT_FOUND", a } var p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) { var n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t) } return n[i].exports } for (var u = "function" == typeof require && require, i = 0; i < t.length; i++)o(t[i]); return o } return r })()({
    1: [function (require, module, exports) {
        const pz = require('@thesoulfresh/pan-z')
        const PanZ = new PanZ();
        const Panzoom = require('@panzoom/panzoom')
    }, { "@panzoom/panzoom": 2, "@thesoulfresh/pan-z": 3 }], 2: [function (require, module, exports) {
        /**
        * Panzoom for panning and zooming elements using CSS transforms
        * Copyright Timmy Willison and other contributors
        * https://github.com/timmywil/panzoom/blob/main/MIT-License.txt
        */
        (function (global, factory) {
            typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
                typeof define === 'function' && define.amd ? define(factory) :
                    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Panzoom = factory());
        })(this, (function () {
            'use strict';

            /******************************************************************************
            Copyright (c) Microsoft Corporation.
        
            Permission to use, copy, modify, and/or distribute this software for any
            purpose with or without fee is hereby granted.
        
            THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
            REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
            AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
            INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
            LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
            OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
            PERFORMANCE OF THIS SOFTWARE.
            ***************************************************************************** */

            var __assign = function () {
                __assign = Object.assign || function __assign(t) {
                    for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
                    }
                    return t;
                };
                return __assign.apply(this, arguments);
            };

            /* eslint-disable no-var */
            if (typeof window !== 'undefined') {
                // Support: IE11 only
                if (window.NodeList && !NodeList.prototype.forEach) {
                    NodeList.prototype.forEach = Array.prototype.forEach;
                }
                // Support: IE11 only
                // CustomEvent is an object instead of a constructor
                if (typeof window.CustomEvent !== 'function') {
                    window.CustomEvent = function CustomEvent(event, params) {
                        params = params || { bubbles: false, cancelable: false, detail: null };
                        var evt = document.createEvent('CustomEvent');
                        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                        return evt
                    };
                }
            }

            /**
             * Utilites for working with multiple pointer events
             */
            function findEventIndex(pointers, event) {
                var i = pointers.length;
                while (i--) {
                    if (pointers[i].pointerId === event.pointerId) {
                        return i;
                    }
                }
                return -1;
            }
            function addPointer(pointers, event) {
                var i;
                // Add touches if applicable
                if (event.touches) {
                    i = 0;
                    for (var _i = 0, _a = event.touches; _i < _a.length; _i++) {
                        var touch = _a[_i];
                        touch.pointerId = i++;
                        addPointer(pointers, touch);
                    }
                    return;
                }
                i = findEventIndex(pointers, event);
                // Update if already present
                if (i > -1) {
                    pointers.splice(i, 1);
                }
                pointers.push(event);
            }
            function removePointer(pointers, event) {
                // Add touches if applicable
                if (event.touches) {
                    // Remove all touches
                    while (pointers.length) {
                        pointers.pop();
                    }
                    return;
                }
                var i = findEventIndex(pointers, event);
                if (i > -1) {
                    pointers.splice(i, 1);
                }
            }
            /**
             * Calculates a center point between
             * the given pointer events, for panning
             * with multiple pointers.
             */
            function getMiddle(pointers) {
                // Copy to avoid changing by reference
                pointers = pointers.slice(0);
                var event1 = pointers.pop();
                var event2;
                while ((event2 = pointers.pop())) {
                    event1 = {
                        clientX: (event2.clientX - event1.clientX) / 2 + event1.clientX,
                        clientY: (event2.clientY - event1.clientY) / 2 + event1.clientY
                    };
                }
                return event1;
            }
            /**
             * Calculates the distance between two points
             * for pinch zooming.
             * Limits to the first 2
             */
            function getDistance(pointers) {
                if (pointers.length < 2) {
                    return 0;
                }
                var event1 = pointers[0];
                var event2 = pointers[1];
                return Math.sqrt(Math.pow(Math.abs(event2.clientX - event1.clientX), 2) +
                    Math.pow(Math.abs(event2.clientY - event1.clientY), 2));
            }

            var events = {
                down: 'mousedown',
                move: 'mousemove',
                up: 'mouseup mouseleave'
            };
            if (typeof window !== 'undefined') {
                if (typeof window.PointerEvent === 'function') {
                    events = {
                        down: 'pointerdown',
                        move: 'pointermove',
                        up: 'pointerup pointerleave pointercancel'
                    };
                }
                else if (typeof window.TouchEvent === 'function') {
                    events = {
                        down: 'touchstart',
                        move: 'touchmove',
                        up: 'touchend touchcancel'
                    };
                }
            }
            function onPointer(event, elem, handler, eventOpts) {
                events[event].split(' ').forEach(function (name) {
                    elem.addEventListener(name, handler, eventOpts);
                });
            }
            function destroyPointer(event, elem, handler) {
                events[event].split(' ').forEach(function (name) {
                    elem.removeEventListener(name, handler);
                });
            }

            var isIE = typeof document !== 'undefined' && !!document.documentMode;
            /**
             * Lazy creation of a CSS style declaration
             */
            var divStyle;
            function createStyle() {
                if (divStyle) {
                    return divStyle;
                }
                return (divStyle = document.createElement('div').style);
            }
            /**
             * Proper prefixing for cross-browser compatibility
             */
            var prefixes = ['webkit', 'moz', 'ms'];
            var prefixCache = {};
            function getPrefixedName(name) {
                if (prefixCache[name]) {
                    return prefixCache[name];
                }
                var divStyle = createStyle();
                if (name in divStyle) {
                    return (prefixCache[name] = name);
                }
                var capName = name[0].toUpperCase() + name.slice(1);
                var i = prefixes.length;
                while (i--) {
                    var prefixedName = "".concat(prefixes[i]).concat(capName);
                    if (prefixedName in divStyle) {
                        return (prefixCache[name] = prefixedName);
                    }
                }
            }
            /**
             * Gets a style value expected to be a number
             */
            function getCSSNum(name, style) {
                return parseFloat(style[getPrefixedName(name)]) || 0;
            }
            function getBoxStyle(elem, name, style) {
                if (style === void 0) { style = window.getComputedStyle(elem); }
                // Support: FF 68+
                // Firefox requires specificity for border
                var suffix = name === 'border' ? 'Width' : '';
                return {
                    left: getCSSNum("".concat(name, "Left").concat(suffix), style),
                    right: getCSSNum("".concat(name, "Right").concat(suffix), style),
                    top: getCSSNum("".concat(name, "Top").concat(suffix), style),
                    bottom: getCSSNum("".concat(name, "Bottom").concat(suffix), style)
                };
            }
            /**
             * Set a style using the properly prefixed name
             */
            function setStyle(elem, name, value) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                elem.style[getPrefixedName(name)] = value;
            }
            /**
             * Constructs the transition from panzoom options
             * and takes care of prefixing the transition and transform
             */
            function setTransition(elem, options) {
                var transform = getPrefixedName('transform');
                setStyle(elem, 'transition', "".concat(transform, " ").concat(options.duration, "ms ").concat(options.easing));
            }
            /**
             * Set the transform using the proper prefix
             *
             * Override the transform setter.
             * This is exposed mostly so the user could
             * set other parts of a transform
             * aside from scale and translate.
             * Default is defined in src/css.ts.
             *
             * ```js
             * // This example always sets a rotation
             * // when setting the scale and translation
             * const panzoom = Panzoom(elem, {
             *   setTransform: (elem, { scale, x, y }) => {
             *     panzoom.setStyle('transform', `rotate(0.5turn) scale(${scale}) translate(${x}px, ${y}px)`)
             *   }
             * })
             * ```
             */
            function setTransform(elem, _a, _options) {
                var x = _a.x, y = _a.y, scale = _a.scale, isSVG = _a.isSVG;
                setStyle(elem, 'transform', "scale(".concat(scale, ") translate(").concat(x, "px, ").concat(y, "px)"));
                if (isSVG && isIE) {
                    var matrixValue = window.getComputedStyle(elem).getPropertyValue('transform');
                    elem.setAttribute('transform', matrixValue);
                }
            }
            /**
             * Dimensions used in containment and focal point zooming
             */
            function getDimensions(elem) {
                var parent = elem.parentNode;
                var style = window.getComputedStyle(elem);
                var parentStyle = window.getComputedStyle(parent);
                var rectElem = elem.getBoundingClientRect();
                var rectParent = parent.getBoundingClientRect();
                return {
                    elem: {
                        style: style,
                        width: rectElem.width,
                        height: rectElem.height,
                        top: rectElem.top,
                        bottom: rectElem.bottom,
                        left: rectElem.left,
                        right: rectElem.right,
                        margin: getBoxStyle(elem, 'margin', style),
                        border: getBoxStyle(elem, 'border', style)
                    },
                    parent: {
                        style: parentStyle,
                        width: rectParent.width,
                        height: rectParent.height,
                        top: rectParent.top,
                        bottom: rectParent.bottom,
                        left: rectParent.left,
                        right: rectParent.right,
                        padding: getBoxStyle(parent, 'padding', parentStyle),
                        border: getBoxStyle(parent, 'border', parentStyle)
                    }
                };
            }

            /**
             * Determine if an element is attached to the DOM
             * Panzoom requires this so events work properly
             */
            function isAttached(elem) {
                var doc = elem.ownerDocument;
                var parent = elem.parentNode;
                return (doc &&
                    parent &&
                    doc.nodeType === 9 &&
                    parent.nodeType === 1 &&
                    doc.documentElement.contains(parent));
            }

            function getClass(elem) {
                return (elem.getAttribute('class') || '').trim();
            }
            function hasClass(elem, className) {
                return elem.nodeType === 1 && " ".concat(getClass(elem), " ").indexOf(" ".concat(className, " ")) > -1;
            }
            function isExcluded(elem, options) {
                for (var cur = elem; cur != null; cur = cur.parentNode) {
                    if (hasClass(cur, options.excludeClass) || options.exclude.indexOf(cur) > -1) {
                        return true;
                    }
                }
                return false;
            }

            /**
             * Determine if an element is SVG by checking the namespace
             * Exception: the <svg> element itself should be treated like HTML
             */
            var rsvg = /^http:[\w\.\/]+svg$/;
            function isSVGElement(elem) {
                return rsvg.test(elem.namespaceURI) && elem.nodeName.toLowerCase() !== 'svg';
            }

            function shallowClone(obj) {
                var clone = {};
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        clone[key] = obj[key];
                    }
                }
                return clone;
            }

            var defaultOptions = {
                animate: false,
                canvas: false,
                cursor: 'move',
                disablePan: false,
                disableZoom: false,
                disableXAxis: false,
                disableYAxis: false,
                duration: 200,
                easing: 'ease-in-out',
                exclude: [],
                excludeClass: 'panzoom-exclude',
                handleStartEvent: function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                },
                maxScale: 4,
                minScale: 0.125,
                overflow: 'hidden',
                panOnlyWhenZoomed: false,
                pinchAndPan: false,
                relative: false,
                setTransform: setTransform,
                startX: 0,
                startY: 0,
                startScale: 1,
                step: 0.3,
                touchAction: 'none'
            };
            function Panzoom(elem, options) {
                if (!elem) {
                    throw new Error('Panzoom requires an element as an argument');
                }
                if (elem.nodeType !== 1) {
                    throw new Error('Panzoom requires an element with a nodeType of 1');
                }
                if (!isAttached(elem)) {
                    throw new Error('Panzoom should be called on elements that have been attached to the DOM');
                }
                options = __assign(__assign({}, defaultOptions), options);
                var isSVG = isSVGElement(elem);
                var parent = elem.parentNode;
                // Set parent styles
                parent.style.overflow = options.overflow;
                parent.style.userSelect = 'none';
                // This is important for mobile to
                // prevent scrolling while panning
                parent.style.touchAction = options.touchAction;
                (options.canvas ? parent : elem).style.cursor = options.cursor;
                // Set element styles
                elem.style.userSelect = 'none';
                elem.style.touchAction = options.touchAction;
                // The default for HTML is '50% 50%'
                // The default for SVG is '0 0'
                // SVG can't be changed in IE
                setStyle(elem, 'transformOrigin', typeof options.origin === 'string' ? options.origin : isSVG ? '0 0' : '50% 50%');
                function resetStyle() {
                    parent.style.overflow = '';
                    parent.style.userSelect = '';
                    parent.style.touchAction = '';
                    parent.style.cursor = '';
                    elem.style.cursor = '';
                    elem.style.userSelect = '';
                    elem.style.touchAction = '';
                    setStyle(elem, 'transformOrigin', '');
                }
                function setOptions(opts) {
                    if (opts === void 0) { opts = {}; }
                    for (var key in opts) {
                        if (opts.hasOwnProperty(key)) {
                            options[key] = opts[key];
                        }
                    }
                    // Handle option side-effects
                    if (opts.hasOwnProperty('cursor') || opts.hasOwnProperty('canvas')) {
                        parent.style.cursor = elem.style.cursor = '';
                        (options.canvas ? parent : elem).style.cursor = options.cursor;
                    }
                    if (opts.hasOwnProperty('overflow')) {
                        parent.style.overflow = opts.overflow;
                    }
                    if (opts.hasOwnProperty('touchAction')) {
                        parent.style.touchAction = opts.touchAction;
                        elem.style.touchAction = opts.touchAction;
                    }
                }
                var x = 0;
                var y = 0;
                var scale = 1;
                var isPanning = false;
                zoom(options.startScale, { animate: false, force: true });
                // Wait for scale to update
                // for accurate dimensions
                // to constrain initial values
                setTimeout(function () {
                    pan(options.startX, options.startY, { animate: false, force: true });
                });
                function trigger(eventName, detail, opts) {
                    if (opts.silent) {
                        return;
                    }
                    var event = new CustomEvent(eventName, { detail: detail });
                    elem.dispatchEvent(event);
                }
                function setTransformWithEvent(eventName, opts, originalEvent) {
                    var value = { x: x, y: y, scale: scale, isSVG: isSVG, originalEvent: originalEvent };
                    requestAnimationFrame(function () {
                        if (typeof opts.animate === 'boolean') {
                            if (opts.animate) {
                                setTransition(elem, opts);
                            }
                            else {
                                setStyle(elem, 'transition', 'none');
                            }
                        }
                        opts.setTransform(elem, value, opts);
                        trigger(eventName, value, opts);
                        trigger('panzoomchange', value, opts);
                    });
                    return value;
                }
                function constrainXY(toX, toY, toScale, panOptions) {
                    var opts = __assign(__assign({}, options), panOptions);
                    var result = { x: x, y: y, opts: opts };
                    if (!opts.force && (opts.disablePan || (opts.panOnlyWhenZoomed && scale === opts.startScale))) {
                        return result;
                    }
                    toX = parseFloat(toX);
                    toY = parseFloat(toY);
                    if (!opts.disableXAxis) {
                        result.x = (opts.relative ? x : 0) + toX;
                    }
                    if (!opts.disableYAxis) {
                        result.y = (opts.relative ? y : 0) + toY;
                    }
                    if (opts.contain) {
                        var dims = getDimensions(elem);
                        var realWidth = dims.elem.width / scale;
                        var realHeight = dims.elem.height / scale;
                        var scaledWidth = realWidth * toScale;
                        var scaledHeight = realHeight * toScale;
                        var diffHorizontal = (scaledWidth - realWidth) / 2;
                        var diffVertical = (scaledHeight - realHeight) / 2;
                        if (opts.contain === 'inside') {
                            var minX = (-dims.elem.margin.left - dims.parent.padding.left + diffHorizontal) / toScale;
                            var maxX = (dims.parent.width -
                                scaledWidth -
                                dims.parent.padding.left -
                                dims.elem.margin.left -
                                dims.parent.border.left -
                                dims.parent.border.right +
                                diffHorizontal) /
                                toScale;
                            result.x = Math.max(Math.min(result.x, maxX), minX);
                            var minY = (-dims.elem.margin.top - dims.parent.padding.top + diffVertical) / toScale;
                            var maxY = (dims.parent.height -
                                scaledHeight -
                                dims.parent.padding.top -
                                dims.elem.margin.top -
                                dims.parent.border.top -
                                dims.parent.border.bottom +
                                diffVertical) /
                                toScale;
                            result.y = Math.max(Math.min(result.y, maxY), minY);
                        }
                        else if (opts.contain === 'outside') {
                            var minX = (-(scaledWidth - dims.parent.width) -
                                dims.parent.padding.left -
                                dims.parent.border.left -
                                dims.parent.border.right +
                                diffHorizontal) /
                                toScale;
                            var maxX = (diffHorizontal - dims.parent.padding.left) / toScale;
                            result.x = Math.max(Math.min(result.x, maxX), minX);
                            var minY = (-(scaledHeight - dims.parent.height) -
                                dims.parent.padding.top -
                                dims.parent.border.top -
                                dims.parent.border.bottom +
                                diffVertical) /
                                toScale;
                            var maxY = (diffVertical - dims.parent.padding.top) / toScale;
                            result.y = Math.max(Math.min(result.y, maxY), minY);
                        }
                    }
                    if (opts.roundPixels) {
                        result.x = Math.round(result.x);
                        result.y = Math.round(result.y);
                    }
                    return result;
                }
                function constrainScale(toScale, zoomOptions) {
                    var opts = __assign(__assign({}, options), zoomOptions);
                    var result = { scale: scale, opts: opts };
                    if (!opts.force && opts.disableZoom) {
                        return result;
                    }
                    var minScale = options.minScale;
                    var maxScale = options.maxScale;
                    if (opts.contain) {
                        var dims = getDimensions(elem);
                        var elemWidth = dims.elem.width / scale;
                        var elemHeight = dims.elem.height / scale;
                        if (elemWidth > 1 && elemHeight > 1) {
                            var parentWidth = dims.parent.width - dims.parent.border.left - dims.parent.border.right;
                            var parentHeight = dims.parent.height - dims.parent.border.top - dims.parent.border.bottom;
                            var elemScaledWidth = parentWidth / elemWidth;
                            var elemScaledHeight = parentHeight / elemHeight;
                            if (options.contain === 'inside') {
                                maxScale = Math.min(maxScale, elemScaledWidth, elemScaledHeight);
                            }
                            else if (options.contain === 'outside') {
                                minScale = Math.max(minScale, elemScaledWidth, elemScaledHeight);
                            }
                        }
                    }
                    result.scale = Math.min(Math.max(toScale, minScale), maxScale);
                    return result;
                }
                function pan(toX, toY, panOptions, originalEvent) {
                    var result = constrainXY(toX, toY, scale, panOptions);
                    // Only try to set if the result is somehow different
                    if (x !== result.x || y !== result.y) {
                        x = result.x;
                        y = result.y;
                        return setTransformWithEvent('panzoompan', result.opts, originalEvent);
                    }
                    return { x: x, y: y, scale: scale, isSVG: isSVG, originalEvent: originalEvent };
                }
                function zoom(toScale, zoomOptions, originalEvent) {
                    var result = constrainScale(toScale, zoomOptions);
                    var opts = result.opts;
                    if (!opts.force && opts.disableZoom) {
                        return;
                    }
                    toScale = result.scale;
                    var toX = x;
                    var toY = y;
                    if (opts.focal) {
                        // The difference between the point after the scale and the point before the scale
                        // plus the current translation after the scale
                        // neutralized to no scale (as the transform scale will apply to the translation)
                        var focal = opts.focal;
                        toX = (focal.x / toScale - focal.x / scale + x * toScale) / toScale;
                        toY = (focal.y / toScale - focal.y / scale + y * toScale) / toScale;
                    }
                    var panResult = constrainXY(toX, toY, toScale, { relative: false, force: true });
                    x = panResult.x;
                    y = panResult.y;
                    scale = toScale;
                    return setTransformWithEvent('panzoomzoom', opts, originalEvent);
                }
                function zoomInOut(isIn, zoomOptions) {
                    var opts = __assign(__assign(__assign({}, options), { animate: true }), zoomOptions);
                    return zoom(scale * Math.exp((isIn ? 1 : -1) * opts.step), opts);
                }
                function zoomIn(zoomOptions) {
                    return zoomInOut(true, zoomOptions);
                }
                function zoomOut(zoomOptions) {
                    return zoomInOut(false, zoomOptions);
                }
                function zoomToPoint(toScale, point, zoomOptions, originalEvent) {
                    var dims = getDimensions(elem);
                    // Instead of thinking of operating on the panzoom element,
                    // think of operating on the area inside the panzoom
                    // element's parent
                    // Subtract padding and border
                    var effectiveArea = {
                        width: dims.parent.width -
                            dims.parent.padding.left -
                            dims.parent.padding.right -
                            dims.parent.border.left -
                            dims.parent.border.right,
                        height: dims.parent.height -
                            dims.parent.padding.top -
                            dims.parent.padding.bottom -
                            dims.parent.border.top -
                            dims.parent.border.bottom
                    };
                    // Adjust the clientX/clientY to ignore the area
                    // outside the effective area
                    var clientX = point.clientX -
                        dims.parent.left -
                        dims.parent.padding.left -
                        dims.parent.border.left -
                        dims.elem.margin.left;
                    var clientY = point.clientY -
                        dims.parent.top -
                        dims.parent.padding.top -
                        dims.parent.border.top -
                        dims.elem.margin.top;
                    // Adjust the clientX/clientY for HTML elements,
                    // because they have a transform-origin of 50% 50%
                    if (!isSVG) {
                        clientX -= dims.elem.width / scale / 2;
                        clientY -= dims.elem.height / scale / 2;
                    }
                    // Convert the mouse point from it's position over the
                    // effective area before the scale to the position
                    // over the effective area after the scale.
                    var focal = {
                        x: (clientX / effectiveArea.width) * (effectiveArea.width * toScale),
                        y: (clientY / effectiveArea.height) * (effectiveArea.height * toScale)
                    };
                    return zoom(toScale, __assign(__assign({}, zoomOptions), { animate: false, focal: focal }), originalEvent);
                }
                function zoomWithWheel(event, zoomOptions) {
                    // Need to prevent the default here
                    // or it conflicts with regular page scroll
                    event.preventDefault();
                    var opts = __assign(__assign(__assign({}, options), zoomOptions), { animate: false });
                    // Normalize to deltaX in case shift modifier is used on Mac
                    var delta = event.deltaY === 0 && event.deltaX ? event.deltaX : event.deltaY;
                    var wheel = delta < 0 ? 1 : -1;
                    var toScale = constrainScale(scale * Math.exp((wheel * opts.step) / 3), opts).scale;
                    return zoomToPoint(toScale, event, opts, event);
                }
                function reset(resetOptions) {
                    var opts = __assign(__assign(__assign({}, options), { animate: true, force: true }), resetOptions);
                    scale = constrainScale(opts.startScale, opts).scale;
                    var panResult = constrainXY(opts.startX, opts.startY, scale, opts);
                    x = panResult.x;
                    y = panResult.y;
                    return setTransformWithEvent('panzoomreset', opts);
                }
                var origX;
                var origY;
                var startClientX;
                var startClientY;
                var startScale;
                var startDistance;
                var pointers = [];
                function handleDown(event) {
                    // Don't handle this event if the target is excluded
                    if (isExcluded(event.target, options)) {
                        return;
                    }
                    addPointer(pointers, event);
                    isPanning = true;
                    options.handleStartEvent(event);
                    origX = x;
                    origY = y;
                    trigger('panzoomstart', { x: x, y: y, scale: scale, isSVG: isSVG, originalEvent: event }, options);
                    // This works whether there are multiple
                    // pointers or not
                    var point = getMiddle(pointers);
                    startClientX = point.clientX;
                    startClientY = point.clientY;
                    startScale = scale;
                    startDistance = getDistance(pointers);
                }
                function handleMove(event) {
                    if (!isPanning ||
                        origX === undefined ||
                        origY === undefined ||
                        startClientX === undefined ||
                        startClientY === undefined) {
                        return;
                    }
                    addPointer(pointers, event);
                    var current = getMiddle(pointers);
                    var hasMultiple = pointers.length > 1;
                    var toScale = scale;
                    if (hasMultiple) {
                        // A startDistance of 0 means
                        // that there weren't 2 pointers
                        // handled on start
                        if (startDistance === 0) {
                            startDistance = getDistance(pointers);
                        }
                        // Use the distance between the first 2 pointers
                        // to determine the current scale
                        var diff = getDistance(pointers) - startDistance;
                        toScale = constrainScale((diff * options.step) / 80 + startScale).scale;
                        zoomToPoint(toScale, current, { animate: false }, event);
                    }
                    // Pan during pinch if pinchAndPan is true.
                    // Note: some calculations may be off because the zoom
                    // above has not yet rendered. However, the behavior
                    // was removed before the new scale was used in the following
                    // pan calculation.
                    // See https://github.com/timmywil/panzoom/issues/512
                    // and https://github.com/timmywil/panzoom/issues/606
                    if (!hasMultiple || options.pinchAndPan) {
                        pan(origX + (current.clientX - startClientX) / toScale, origY + (current.clientY - startClientY) / toScale, {
                            animate: false
                        }, event);
                    }
                }
                function handleUp(event) {
                    // Don't call panzoomend when panning with 2 touches
                    // until both touches end
                    if (pointers.length === 1) {
                        trigger('panzoomend', { x: x, y: y, scale: scale, isSVG: isSVG, originalEvent: event }, options);
                    }
                    // Note: don't remove all pointers
                    // Can restart without having to reinitiate all of them
                    // Remove the pointer regardless of the isPanning state
                    removePointer(pointers, event);
                    if (!isPanning) {
                        return;
                    }
                    isPanning = false;
                    origX = origY = startClientX = startClientY = undefined;
                }
                var bound = false;
                function bind() {
                    if (bound) {
                        return;
                    }
                    bound = true;
                    onPointer('down', options.canvas ? parent : elem, handleDown);
                    onPointer('move', document, handleMove, { passive: true });
                    onPointer('up', document, handleUp, { passive: true });
                }
                function destroy() {
                    bound = false;
                    destroyPointer('down', options.canvas ? parent : elem, handleDown);
                    destroyPointer('move', document, handleMove);
                    destroyPointer('up', document, handleUp);
                }
                if (!options.noBind) {
                    bind();
                }
                return {
                    bind: bind,
                    destroy: destroy,
                    eventNames: events,
                    getPan: function () { return ({ x: x, y: y }); },
                    getScale: function () { return scale; },
                    getOptions: function () { return shallowClone(options); },
                    handleDown: handleDown,
                    handleMove: handleMove,
                    handleUp: handleUp,
                    pan: pan,
                    reset: reset,
                    resetStyle: resetStyle,
                    setOptions: setOptions,
                    setStyle: function (name, value) { return setStyle(elem, name, value); },
                    zoom: zoom,
                    zoomIn: zoomIn,
                    zoomOut: zoomOut,
                    zoomToPoint: zoomToPoint,
                    zoomWithWheel: zoomWithWheel
                };
            }
            Panzoom.defaultOptions = defaultOptions;

            return Panzoom;

        }));

    }, {}], 3: [function (require, module, exports) {
        !function (t, e) { "object" === typeof exports && "object" === typeof module ? module.exports = e() : "function" === typeof define && define.amd ? define([], e) : "object" === typeof exports ? exports.Demo = e() : t.Demo = e() }(window, (function () { return function (t) { var e = {}; function n(i) { if (e[i]) return e[i].exports; var o = e[i] = { i: i, l: !1, exports: {} }; return t[i].call(o.exports, o, o.exports, n), o.l = !0, o.exports } return n.m = t, n.c = e, n.d = function (t, e, i) { n.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: i }) }, n.r = function (t) { "undefined" !== typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t, "__esModule", { value: !0 }) }, n.t = function (t, e) { if (1 & e && (t = n(t)), 8 & e) return t; if (4 & e && "object" === typeof t && t && t.__esModule) return t; var i = Object.create(null); if (n.r(i), Object.defineProperty(i, "default", { enumerable: !0, value: t }), 2 & e && "string" != typeof t) for (var o in t) n.d(i, o, function (e) { return t[e] }.bind(null, o)); return i }, n.n = function (t) { var e = t && t.__esModule ? function () { return t.default } : function () { return t }; return n.d(e, "a", e), e }, n.o = function (t, e) { return Object.prototype.hasOwnProperty.call(t, e) }, n.p = "", n(n.s = 2) }([function (t, e) { var n; n = function () { return this }(); try { n = n || new Function("return this")() } catch (i) { "object" === typeof window && (n = window) } t.exports = n }, function (t, e, n) { "use strict"; Object.defineProperty(e, "__esModule", { value: !0 }), e.fit = (t, e, n = "fill") => { if ("scale-down" === n && (n = e.width <= t.width && e.height <= t.height ? "none" : "contain"), "cover" === n || "contain" === n) { const i = t.width / e.width, o = t.height / e.height, r = "cover" === n ? Math.max(i, o) : Math.min(i, o); return { width: e.width * r, height: e.height * r } } return "none" === n ? e : t }, e.position = (t, e, n = "50%", o = "50%") => ({ x: i(n, t.width, e.width), y: i(o, t.height, e.height) }), e.fitAndPosition = (t, n, i = "fill", o = "50%", r = "50%") => { const s = e.fit(t, n, i), { x: u, y: a } = e.position(t, s, o, r), { width: c, height: l } = s; return { x: u, y: a, width: c, height: l } }; const i = (t, e, n) => t.endsWith("%") ? (e - n) * (parseFloat(t) / 100) : parseFloat(t) }, function (t, e, n) { var i, o, r; "undefined" !== typeof globalThis ? globalThis : "undefined" !== typeof self && self, o = [], i = function () { "use strict"; !function (s, u) { o = [e, n(3)], void 0 === (r = "function" === typeof (i = u) ? i.apply(e, o) : i) || (t.exports = r) }(0, (function (e, n) { function i(t) { return t && t.__esModule ? t : { default: t } } Object.defineProperty(e, "__esModule", { value: !0 }), Object.defineProperty(e, "default", { enumerable: !0, get: function () { return i(n).default } }), t.exports = e.default })) }, void 0 === (r = "function" === typeof i ? i.apply(e, o) : i) || (t.exports = r) }, function (t, e, n) { var i, o, r; "undefined" !== typeof globalThis ? globalThis : "undefined" !== typeof self && self, o = [], i = function () { "use strict"; !function (s, u) { o = [e, n(4), n(5), n(6), n(7), n(10)], void 0 === (r = "function" === typeof (i = u) ? i.apply(e, o) : i) || (t.exports = r) }(0, (function (e, n, i, o, r, s) { Object.defineProperty(e, "__esModule", { value: !0 }), e.default = void 0; var u = f(n), a = f(i), c = f(o), l = f(s); function f(t) { return t && t.__esModule ? t : { default: t } } function h(t, e) { var n = Object.keys(t); if (Object.getOwnPropertySymbols) { var i = Object.getOwnPropertySymbols(t); e && (i = i.filter((function (e) { return Object.getOwnPropertyDescriptor(t, e).enumerable }))), n.push.apply(n, i) } return n } function d(t) { for (var e = 1; e < arguments.length; e++) { var n = null != arguments[e] ? arguments[e] : {}; e % 2 ? h(Object(n), !0).forEach((function (e) { v(t, e, n[e]) })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : h(Object(n)).forEach((function (e) { Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e)) })) } return t } function v(t, e, n) { return e in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t } function p(t, e) { for (var n = 0; n < e.length; n++) { var i = e[n]; i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i) } } function y(t, e, n) { return e && p(t.prototype, e), n && p(t, n), t } function m(t) { return (m = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" === typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } function _(t, e) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") } function g(t, e) { if ("function" !== typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), e && b(t, e) } function b(t, e) { return (b = Object.setPrototypeOf || function (t, e) { return t.__proto__ = e, t })(t, e) } function x(t) { var e = O(); return function () { var n, i = z(t); if (e) { var o = z(this).constructor; n = Reflect.construct(i, arguments, o) } else n = i.apply(this, arguments); return w(this, n) } } function w(t, e) { return !e || "object" !== m(e) && "function" !== typeof e ? E(t) : e } function E(t) { if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return t } function O() { if ("undefined" === typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" === typeof Proxy) return !0; try { return Date.prototype.toString.call(Reflect.construct(Date, [], (function () { }))), !0 } catch (t) { return !1 } } function z(t) { return (z = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) { return t.__proto__ || Object.getPrototypeOf(t) })(t) } var T = function (t) { g(n, t); var e = x(n); function n() { var t, i = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, o = i.minZoom, r = void 0 === o ? .3 : o, s = i.maxZoom, u = void 0 === s ? 4 : s, a = i.zoomSpeed, l = void 0 === a ? 1 : a, f = i.zoomEnabled, h = void 0 === f || f, d = i.panEnabled, v = void 0 === d || d, p = i.bounds, y = void 0 === p ? .8 : p, m = i.boundingElement, g = i.gestureTimeout, b = void 0 === g ? 60 : g, x = i.initialFit, w = void 0 === x ? null : x, O = arguments.length > 1 ? arguments[1] : void 0, z = arguments.length > 2 ? arguments[2] : void 0; return _(this, n), (t = e.call(this, z)).log("created with", arguments), t._x = 0, t._y = 0, t._z = 1, t._cx = 0, t._cy = 0, t.boundingType = 0, t._moving = !1, t.onResize = (0, c.default)(t.onResize.bind(E(t)), 300), t.onGestureStart = t.onGestureStart.bind(E(t)), t.onGestureChange = t.onGestureChange.bind(E(t)), t.onGestureEnd = t.onGestureEnd.bind(E(t)), t.onDoubleClick = t.onDoubleClick.bind(E(t)), t.bounds = y, t.boundingElement = m, t._zoomEnabled = v, t._panEnabled = h, t._zoomSpeed = l / 100, t.minZoom = r, t.maxZoom = u, t.initialFit = w, t.gestureTimeout = b, O && t.init(O, {}), t } return y(n, [{ key: "init", value: function (t, e) { if (this.destroy(), this.element = t, e) for (var n in e) this[n] = e[n]; this._initPanZoom(), this._setTransformOrigin(), this._setSelectionProperties(), this._testTransform(), this.boundingElement || (this.boundingElement = t), this._resizeObserver = new l.default(this.onResize), this._resizeObserver.observe(this.boundingElement), this.info("initialized with", arguments), this.debug("settings:", this), "center" === this.initialFit ? this.center(!1, !0) : "contain" === this.initialFit ? this.contain(!1, !0) : "cover" === this.initialFit && this.cover(!1, !0), this._initialized = !0 } }, { key: "destroy", value: function () { this.element && (this.onResize.cancel && this.onResize.cancel(), this._destroyPanZoom(), this._resizeObserver.disconnect(), this.removeAllListeners(), this.element = null, this.boundingElement = null, this._initialized = !1, this.info("destroyed")) } }, { key: "_initPanZoom", value: function () { !this.unpz && this.element && this.enabled && (this.unpz = new u.default(this.element, this.onGestureChange, { onStart: this.onGestureStart, onEnd: this.onGestureEnd, onDoubleTap: this.onDoubleClick }), this._moving = !1, this._panEnabled || this.disablePan(), this._zoomEnabled || this.disableZoom()) } }, { key: "_destroyPanZoom", value: function () { this.unpz && (this.unpz(), this.unpz = null, this._moving = !1) } }, { key: "enable", value: function () { this.enablePan(), this.enableZoom(), this._initPanZoom() } }, { key: "disable", value: function () { this.disablePan(), this.disableZoom(), this._destroyPanZoom() } }, { key: "enablePan", value: function () { this._panEnabled = !0, this.unpz.enablePan(), this.info("pan enabled") } }, { key: "disablePan", value: function () { this._panEnabled = !1, this.unpz.disablePan(), this._moving = !1, this.info("pan disabled") } }, { key: "enableZoom", value: function () { this._zoomEnabled = !0, this.unpz.enableZoom(), this.info("zoom enabled") } }, { key: "disableZoom", value: function () { this._zoomEnabled = !1, this.unpz.disableZoom(), this._moving = !1, this.info("zoom disabled") } }, { key: "reset", value: function (t, e) { this._emitState("start"), this._setState(0, 0, 1, t, e) } }, { key: "center", value: function (t, e) { this._emitState("start"); var n = this._percentToTranslation(.5, .5); this._setState(n.x, n.y, this._z, !1, t, e) } }, { key: "contain", value: function (t, e) { this._fitToBounds("contain", !1, t, e) } }, { key: "cover", value: function (t, e) { this._fitToBounds("cover", !1, t, e) } }, { key: "scaleDown", value: function (t, e) { this._fitToBounds("scale-down", !1, t, e) } }, { key: "panTo", value: function (t, e, n, i) { this._emitState("start"); var o = this._percentToTranslation(t, e); this._setState(o.x, o.y, this._z, n, i) } }, { key: "zoomTo", value: function () { var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1, e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : .5, n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : .5, i = arguments.length > 3 ? arguments[3] : void 0, o = arguments.length > 4 ? arguments[4] : void 0; this._emitState("start"); var r = this._scaleToScaleDelta(t); this.zoomBy(r, e, n, i, o) } }, { key: "centerOn", value: function () { var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : .5, e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : .5, n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this._z, i = arguments.length > 3 ? arguments[3] : void 0, o = arguments.length > 4 ? arguments[4] : void 0; this._emitState("start"); var r = this._percentToTranslation(t, e), s = n - this._z, u = this._getPositionAdjustedForScale(s, t, e), a = r.x + u.x, c = r.y + u.y; this._setState(a, c, n, i, o) } }, { key: "zoomToArea", value: function () { } }, { key: "_scaleToScaleDelta", value: function (t) { return (this._z - t) / this._zoomSpeed } }, { key: "_percentToTranslation", value: function (t, e) { var n = this.boundingWidth, i = this.boundingHeight, o = this.element.getBoundingClientRect(); return { x: n / 2 - o.width * t, y: i / 2 - o.height * e } } }, { key: "getContainSize", value: function () { var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.element, e = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.boundingElement).getBoundingClientRect(), n = t.getBoundingClientRect(), i = (0, r.fitAndPosition)(e, n, "contain", "50%", "50%"); return d(d({}, i), {}, { scale: i.width / n.width }) } }, { key: "getCoverSize", value: function () { var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.element, e = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.boundingElement).getBoundingClientRect(), n = t.getBoundingClientRect(), i = (0, r.fitAndPosition)(e, n, "cover", "50%", "50%"); return d(d({}, i), {}, { scale: i.width / n.width }) } }, { key: "getScaleDownSize", value: function () { var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.element, e = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.boundingElement).getBoundingClientRect(), n = t.getBoundingClientRect(), i = (0, r.fitAndPosition)(e, n, "scale-down", "50%", "50%"); return d(d({}, i), {}, { scale: i.width / n.width }) } }, { key: "_fitToBounds", value: function () { var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "contain", e = arguments.length > 1 ? arguments[1] : void 0, n = arguments.length > 2 ? arguments[2] : void 0, i = arguments.length > 3 ? arguments[3] : void 0, o = this.boundingElement.getBoundingClientRect(), s = this.element.getBoundingClientRect(), u = (0, r.fitAndPosition)(o, s, t, "50%", "50%"), a = u.x, c = u.y, l = u.width / s.width * this._z; this._emitState("start"), this._setState(a, c, l, e, n, i) } }, { key: "onGestureStart", value: function () { this._moving = !0, this._emitState("start"), this._emitState("gesturestart") } }, { key: "onGestureEnd", value: function () { this._moving = !1, this._clampStateAfterTransition(), this._emitState("end"), this._emitState("gestureend") } }, { key: "onGestureChange", value: function (t) { var e = t.dx, n = void 0 === e ? 0 : e, i = t.dy, o = void 0 === i ? 0 : i, r = t.dz, s = void 0 === r ? 0 : r, u = t.px0, a = t.py0, c = t.event; if (this.enabled) { c.preventDefault(); var l = this._x, f = this._y, h = this._z; if (this._panEnabled && (l += n, f += o), this._zoomEnabled) { var d = this._calculatePositionForZoom(this._z, s, u, a); l += d.x, f += d.y, h = d.z } this._gestureUpdate(l, f, h, u, a) } } }, { key: "panBy", value: function (t, e, n, i) { var o = this._x + t, r = this._y + e; this._setState(o, r, this._z, n, i) } }, { key: "zoomBy", value: function (t, e, n, i, o) { var r = this._x, s = this._y, u = this._z, a = this._calculatePositionForZoom(this._z, t, e, n); r += a.x, s += a.y, u = a.z, this._setState(r, s, u, i, o) } }, { key: "onDoubleClick", value: function (t) { var e = t.px0, n = t.py0; if (this._zoomEnabled) { var i = this.maxZoom, o = this.minZoom; this.initialFit && ("contain" === this.initialFit ? o = this.getContainSize().scale : "cover" === this.initialFit ? o = this.getCoverSize().scale : "scale-down" === this.initialFit && (o = this.getScaleDownSize().scale)); var r = o + (i - o) / 2, s = this._z > r ? o : i, u = (this._z - s) / this._zoomSpeed; this.log("DOUBLE CLICK", "this._z", this._z, "mid", r, "z", s, "dz", u), this.zoomBy(u, e, n, !0) } } }, { key: "onResize", value: function () { this._clampStateAfterTransition(), this.info("resize end") } }, { key: "_setState", value: function (t, e, n, i) { var o = arguments.length > 5 ? arguments[5] : void 0; arguments.length > 4 && void 0 !== arguments[4] && !arguments[4] ? this.update(t, e, n, i, o) : this._transitionTo(t, e, n, i) } }, { key: "_transitionTo", value: function () { var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0, e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1, i = arguments.length > 3 ? arguments[3] : void 0; this._x === t && this._y === e && this._z === n || (this.log("TRANSITION TO", "x", t, "y", e, "z", n), this._x = t, this._y = e, this._z = n, this._transitionToState(i)) } }, { key: "_cancelRAF", value: function () { this.rafId && (cancelAnimationFrame(this.rafId), this.rafId = null) } }, { key: "update", value: function (t, e, n) { var i = this, o = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], r = arguments.length > 4 && void 0 !== arguments[4] && arguments[4]; if (r || (this._moving = !0), o) { var s = this._clampPanZoom(t, e, n); this._x = s.x, this._y = s.y, this._z = s.z } else this._x = t, this._y = e, this._z = n; this._cancelRAF(), this._cancelTransitions(), r ? this._setTransform(this._x, this._y, this._z) : this.rafId = requestAnimationFrame((function () { i._setTransform(i._x, i._y, i._z), i.rafId = null, i._moving = !1, i._emitState("update") })) } }, { key: "_gestureUpdate", value: function (t, e, n, i, o) { var r = this; this._x = t, this._y = e, this._z = n, this._cx = i, this._cy = o, this._cancelRAF(), this._cancelTransitions(), this.rafId = requestAnimationFrame((function () { r._setTransform(r._x, r._y, r._z), r.rafId = null, r._emitState("update") })) } }, { key: "_calculatePositionForZoom", value: function (t, e, n, i) { if (0 === e) return { x: 0, y: 0, z: t }; var o = t, r = -1 * e * this._zoomSpeed, s = 0; if (0 === s) o = Math.min(Math.max(t + r, this.minZoom), this.maxZoom); else if (1 === s) { var u = this.minZoom - .5 * this.minZoom, a = this.maxZoom + .5 * this.maxZoom; o = Math.min(Math.max(t + r, u), a) } else o = Math.max(t + r, 0); var c = o - t; return d(d({}, c ? this._getPositionAdjustedForScale(c, n, i) : { x: 0, y: 0 }), {}, { z: o }) } }, { key: "_getPositionAdjustedForScale", value: function (t) { var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0; return { x: -this.elementWidth * t * e, y: -this.elementHeight * t * n } } }, { key: "_clampZoom", value: function (t) { var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : .5, n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : .5, i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : this.minZoom, o = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : this.maxZoom, r = 0, s = 0, u = t; if (null != i && (u = Math.max(u, i)), null != o && (u = Math.min(u, o)), t !== u) { var a = u - t, c = this._getPositionAdjustedForScale(a, e, n); r += c.x, s += c.y, this.info("CLAMP SCALE:", "unclamped scale", t, "clamped scale", u, "dz", a, "x", r, "y", s) } return { x: r, y: s, z: u } } }, { key: "_clampPan", value: function (t, e) { var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this.bounds, i = t, o = e; if (n) { var r, s, u, a, c = this.boundingWidth, l = this.boundingHeight, f = this.elementWidth, h = this.elementHeight, d = Math.ceil(f * this._z), v = Math.ceil(h * this._z); if (0 === this.boundingType) r = c * (1 - n) - d, s = l * (1 - n) - v, u = c * n, a = l * n; else if (1 === this.boundingType) { var p = d * n, y = v * n; r = -p, s = -y, u = c - (d - p), a = l - (v - y) } else { var m = Math.round(100 * n); r = -d + m, s = -v + m, u = c - m, a = l - m } i = Math.min(Math.max(t, r), u), o = Math.min(Math.max(e, s), a), i === t && o === e || this.log("CLAMP X/Y:", "x", t, "clamped x", i, "xMin", r, "xMax", u, "y", e, "clamped y", o, "yMin", s, "yMax", a) } return { x: i, y: o } } }, { key: "_clampPanZoom", value: function () { var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this._x, e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this._y, n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this._z, i = !1, o = this._clampZoom(n); o.z !== n && (i = !0, n = o.z, t = o.x, e = o.y); var r = this._clampPan(t, e); return t === r.x && e === r.y || (i = !0, t = r.x, e = r.y), { clamped: i, x: t, y: e, z: n } } }, { key: "_clampStateAfterTransition", value: function () { var t = this._clampPanZoom(); t.clamped && (this._x = t.x, this._y = t.y, this._z = t.z, this._transitionToState()) } }, { key: "_transitionToState", value: function (t) { var e = this; this._setTransition(t), requestAnimationFrame((function () { e._setTransform(e._x, e._y, e._z), e._emitState("update") })) } }, { key: "_cancelTransitions", value: function () { this._cancelTransitionEndListener && this._cancelTransitionEndListener() } }, { key: "_setTransition", value: function () { var t = this, e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0], n = this.element.style.transition; if (!/transform /.test(n)) { var i = function () { t._cancelTransitions(), t._emitState("update"), t._moving = !1, e ? t._clampStateAfterTransition() : t._emitState("end") }; this._cancelTransitionEndListener = function () { t.element.style.transition = n, t.element.removeEventListener("transitionend", i), t._cancelTransitionEndListener = null }, this._moving = !0, this.element.addEventListener("transitionend", i), this.element.style.transition = "transform 300ms cubic-bezier(0.785, 0.135, 0.150, 0.860)" } } }, { key: "_setSelectionProperties", value: function () { this.element.style.touchAction && "none" !== this.element.style.touchAction && this.warn('element already has a "touch-action" style set. PanZ will reset the "touch-action" to "none" for propery gesture handling.'), this.element.style.touchAction = "none", this.element.style.userSelect = "none" } }, { key: "_setTransformOrigin", value: function () { this.element.style.transformOrigin && this.warn('element already has a "transform-origin" style set. PanZ will reset the "transform-origin" to "0 0" for proper pan/zoom functionality.'), this.element.style.transformOrigin = "0 0" } }, { key: "_setTransform", value: function (t, e, n) { this.element.style.transform = "translate(".concat(t, "px, ").concat(e, "px) scale(").concat(n, ")") } }, { key: "_testTransform", value: function () { this.element.style.transform && this.warn('element already has a "transform" style set. Be aware that PanZ will modify the "transform" style during pan/zoom gestures, overriding your custom transform.') } }, { key: "_emitState", value: function (t) { var e = this.elementWidth, n = this.elementHeight, i = { x: this._x, y: this._y, scale: this._z, width: Math.ceil(e * this._z), height: Math.ceil(n * this._z), unscaledWidth: e, unscaledHeight: n }; this["update" === t ? "debug" : "log"](t.toUpperCase(), "x", i.x.toFixed(0), "y", i.y.toFixed(0), "scale", i.scale.toFixed(4), "width", i.width.toFixed(0), "height", i.height.toFixed(0), "originalWidth", i.unscaledWidth, "originalHeight", i.unscaledHeight), this.emit(t, i) } }, { key: "scale", get: function () { return this._z } }, { key: "x", get: function () { return this._x } }, { key: "y", get: function () { return this._y } }, { key: "moving", get: function () { return this._moving } }, { key: "initialized", get: function () { return this._initialized } }, { key: "enabled", get: function () { return this._panEnabled || this._zoomEnabled } }, { key: "panEnabled", get: function () { return this._panEnabled } }, { key: "zoomEnabled", get: function () { return this._zoomEnabled } }, { key: "position", get: function () { return { x: this._x, y: this._y, z: this._z } } }, { key: "elementWidth", get: function () { return this.element.offsetWidth || this.element.clientWidth } }, { key: "elementHeight", get: function () { return this.element.offsetHeight || this.element.clientHeight } }, { key: "boundingWidth", get: function () { return this.boundingElement.offsetWidth || this.boundingElement.clientWidth } }, { key: "boundingHeight", get: function () { return this.boundingElement.offsetHeight || this.boundingElement.clientHeight } }]), n }(function (t) { g(n, t); var e = x(n); function n() { var t, i = arguments.length > 0 && void 0 !== arguments[0] && arguments[0]; _(this, n), t = e.call(this); var o = function (t) { return console[t].bind(window.console, "[PanZ]") }, r = function () { }; return ["debug", "log", "info"].forEach((function (e) { t[e] = i ? o(e) : r })), t.error = o("error"), t.warn = o("warn"), t } return n }(a.default)); e.default = T, t.exports = e.default })) }, void 0 === (r = "function" === typeof i ? i.apply(e, o) : i) || (t.exports = r) }, function (t, e, n) { window, t.exports = function (t) { var e = {}; function n(i) { if (e[i]) return e[i].exports; var o = e[i] = { i: i, l: !1, exports: {} }; return t[i].call(o.exports, o, o.exports, n), o.l = !0, o.exports } return n.m = t, n.c = e, n.d = function (t, e, i) { n.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: i }) }, n.r = function (t) { "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t, "__esModule", { value: !0 }) }, n.t = function (t, e) { if (1 & e && (t = n(t)), 8 & e) return t; if (4 & e && "object" == typeof t && t && t.__esModule) return t; var i = Object.create(null); if (n.r(i), Object.defineProperty(i, "default", { enumerable: !0, value: t }), 2 & e && "string" != typeof t) for (var o in t) n.d(i, o, function (e) { return t[e] }.bind(null, o)); return i }, n.n = function (t) { var e = t && t.__esModule ? function () { return t.default } : function () { return t }; return n.d(e, "a", e), e }, n.o = function (t, e) { return Object.prototype.hasOwnProperty.call(t, e) }, n.p = "", n(n.s = 9) }([function (t, e, n) { "use strict"; var i = n(7); t.exports = i && function () { var t = !1; try { var e = Object.defineProperty({}, "passive", { get: function () { t = !0 } }); window.addEventListener("test", null, e), window.removeEventListener("test", null, e) } catch (e) { t = !1 } return t }() }, function (t, e, n) { "use strict"; var i, o = "object" == typeof Reflect ? Reflect : null, r = o && "function" == typeof o.apply ? o.apply : function (t, e, n) { return Function.prototype.apply.call(t, e, n) }; i = o && "function" == typeof o.ownKeys ? o.ownKeys : Object.getOwnPropertySymbols ? function (t) { return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t)) } : function (t) { return Object.getOwnPropertyNames(t) }; var s = Number.isNaN || function (t) { return t != t }; function u() { u.init.call(this) } t.exports = u, t.exports.once = function (t, e) { return new Promise((function (n, i) { function o() { void 0 !== r && t.removeListener("error", r), n([].slice.call(arguments)) } var r; "error" !== e && (r = function (n) { t.removeListener(e, o), i(n) }, t.once("error", r)), t.once(e, o) })) }, u.EventEmitter = u, u.prototype._events = void 0, u.prototype._eventsCount = 0, u.prototype._maxListeners = void 0; var a = 10; function c(t) { if ("function" != typeof t) throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof t) } function l(t) { return void 0 === t._maxListeners ? u.defaultMaxListeners : t._maxListeners } function f(t, e, n, i) { var o, r, s, u; if (c(n), void 0 === (r = t._events) ? (r = t._events = Object.create(null), t._eventsCount = 0) : (void 0 !== r.newListener && (t.emit("newListener", e, n.listener ? n.listener : n), r = t._events), s = r[e]), void 0 === s) s = r[e] = n, ++t._eventsCount; else if ("function" == typeof s ? s = r[e] = i ? [n, s] : [s, n] : i ? s.unshift(n) : s.push(n), (o = l(t)) > 0 && s.length > o && !s.warned) { s.warned = !0; var a = new Error("Possible EventEmitter memory leak detected. " + s.length + " " + String(e) + " listeners added. Use emitter.setMaxListeners() to increase limit"); a.name = "MaxListenersExceededWarning", a.emitter = t, a.type = e, a.count = s.length, u = a, console && console.warn && console.warn(u) } return t } function h() { if (!this.fired) return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, 0 === arguments.length ? this.listener.call(this.target) : this.listener.apply(this.target, arguments) } function d(t, e, n) { var i = { fired: !1, wrapFn: void 0, target: t, type: e, listener: n }, o = h.bind(i); return o.listener = n, i.wrapFn = o, o } function v(t, e, n) { var i = t._events; if (void 0 === i) return []; var o = i[e]; return void 0 === o ? [] : "function" == typeof o ? n ? [o.listener || o] : [o] : n ? function (t) { for (var e = new Array(t.length), n = 0; n < e.length; ++n)e[n] = t[n].listener || t[n]; return e }(o) : y(o, o.length) } function p(t) { var e = this._events; if (void 0 !== e) { var n = e[t]; if ("function" == typeof n) return 1; if (void 0 !== n) return n.length } return 0 } function y(t, e) { for (var n = new Array(e), i = 0; i < e; ++i)n[i] = t[i]; return n } Object.defineProperty(u, "defaultMaxListeners", { enumerable: !0, get: function () { return a }, set: function (t) { if ("number" != typeof t || t < 0 || s(t)) throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + t + "."); a = t } }), u.init = function () { void 0 !== this._events && this._events !== Object.getPrototypeOf(this)._events || (this._events = Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0 }, u.prototype.setMaxListeners = function (t) { if ("number" != typeof t || t < 0 || s(t)) throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + t + "."); return this._maxListeners = t, this }, u.prototype.getMaxListeners = function () { return l(this) }, u.prototype.emit = function (t) { for (var e = [], n = 1; n < arguments.length; n++)e.push(arguments[n]); var i = "error" === t, o = this._events; if (void 0 !== o) i = i && void 0 === o.error; else if (!i) return !1; if (i) { var s; if (e.length > 0 && (s = e[0]), s instanceof Error) throw s; var u = new Error("Unhandled error." + (s ? " (" + s.message + ")" : "")); throw u.context = s, u } var a = o[t]; if (void 0 === a) return !1; if ("function" == typeof a) r(a, this, e); else { var c = a.length, l = y(a, c); for (n = 0; n < c; ++n)r(l[n], this, e) } return !0 }, u.prototype.addListener = function (t, e) { return f(this, t, e, !1) }, u.prototype.on = u.prototype.addListener, u.prototype.prependListener = function (t, e) { return f(this, t, e, !0) }, u.prototype.once = function (t, e) { return c(e), this.on(t, d(this, t, e)), this }, u.prototype.prependOnceListener = function (t, e) { return c(e), this.prependListener(t, d(this, t, e)), this }, u.prototype.removeListener = function (t, e) { var n, i, o, r, s; if (c(e), void 0 === (i = this._events)) return this; if (void 0 === (n = i[t])) return this; if (n === e || n.listener === e) 0 == --this._eventsCount ? this._events = Object.create(null) : (delete i[t], i.removeListener && this.emit("removeListener", t, n.listener || e)); else if ("function" != typeof n) { for (o = -1, r = n.length - 1; r >= 0; r--)if (n[r] === e || n[r].listener === e) { s = n[r].listener, o = r; break } if (o < 0) return this; 0 === o ? n.shift() : function (t, e) { for (; e + 1 < t.length; e++)t[e] = t[e + 1]; t.pop() }(n, o), 1 === n.length && (i[t] = n[0]), void 0 !== i.removeListener && this.emit("removeListener", t, s || e) } return this }, u.prototype.off = u.prototype.removeListener, u.prototype.removeAllListeners = function (t) { var e, n, i; if (void 0 === (n = this._events)) return this; if (void 0 === n.removeListener) return 0 === arguments.length ? (this._events = Object.create(null), this._eventsCount = 0) : void 0 !== n[t] && (0 == --this._eventsCount ? this._events = Object.create(null) : delete n[t]), this; if (0 === arguments.length) { var o, r = Object.keys(n); for (i = 0; i < r.length; ++i)"removeListener" !== (o = r[i]) && this.removeAllListeners(o); return this.removeAllListeners("removeListener"), this._events = Object.create(null), this._eventsCount = 0, this } if ("function" == typeof (e = n[t])) this.removeListener(t, e); else if (void 0 !== e) for (i = e.length - 1; i >= 0; i--)this.removeListener(t, e[i]); return this }, u.prototype.listeners = function (t) { return v(this, t, !0) }, u.prototype.rawListeners = function (t) { return v(this, t, !1) }, u.listenerCount = function (t, e) { return "function" == typeof t.listenerCount ? t.listenerCount(e) : p.call(t, e) }, u.prototype.listenerCount = p, u.prototype.eventNames = function () { return this._eventsCount > 0 ? i(this._events) : [] } }, function (t, e) { var n = { left: 0, top: 0 }; t.exports = function (t, e, i) { e = e || t.currentTarget || t.srcElement, Array.isArray(i) || (i = [0, 0]); var o, r = t.clientX || 0, s = t.clientY || 0, u = (o = e) === window || o === document || o === document.body ? n : o.getBoundingClientRect(); return i[0] = r - u.left, i[1] = s - u.top, i } }, function (t, e) { t.exports = function (t, e) { return { configurable: !0, enumerable: !0, get: t, set: e } } }, function (t, e) { t.exports = function (t, e) { var n = e[0] - t[0], i = e[1] - t[1]; return Math.sqrt(n * n + i * i) } }, function (t, e, n) { var i = n(2), o = n(1).EventEmitter; function r(t) { var e = (t = t || {}).element || window, n = new o, r = t.position || [0, 0]; return !1 !== t.touchstart && (e.addEventListener("mousedown", u, !1), e.addEventListener("touchstart", s, !1)), e.addEventListener("mousemove", u, !1), e.addEventListener("touchmove", s, !1), n.position = r, n.dispose = function () { e.removeEventListener("mousemove", u, !1), e.removeEventListener("mousedown", u, !1), e.removeEventListener("touchmove", s, !1), e.removeEventListener("touchstart", s, !1) }, n; function s(t) { u(t.targetTouches[0]) } function u(t) { i(t, e, r), n.emit("move", t) } } t.exports = function (t) { return r(t).position }, t.exports.emitter = function (t) { return r(t) } }, function (t, e, n) { (function (e) { var n = /^\s+|\s+$/g, i = /^[-+]0x[0-9a-f]+$/i, o = /^0b[01]+$/i, r = /^0o[0-7]+$/i, s = parseInt, u = "object" == typeof e && e && e.Object === Object && e, a = "object" == typeof self && self && self.Object === Object && self, c = u || a || Function("return this")(), l = Object.prototype.toString, f = Math.max, h = Math.min, d = function () { return c.Date.now() }; function v(t) { var e = typeof t; return !!t && ("object" == e || "function" == e) } function p(t) { if ("number" == typeof t) return t; if (function (t) { return "symbol" == typeof t || function (t) { return !!t && "object" == typeof t }(t) && "[object Symbol]" == l.call(t) }(t)) return NaN; if (v(t)) { var e = "function" == typeof t.valueOf ? t.valueOf() : t; t = v(e) ? e + "" : e } if ("string" != typeof t) return 0 === t ? t : +t; t = t.replace(n, ""); var u = o.test(t); return u || r.test(t) ? s(t.slice(2), u ? 2 : 8) : i.test(t) ? NaN : +t } t.exports = function (t, e, n) { var i, o, r, s, u, a, c = 0, l = !1, y = !1, m = !0; if ("function" != typeof t) throw new TypeError("Expected a function"); function _(e) { var n = i, r = o; return i = o = void 0, c = e, s = t.apply(r, n) } function g(t) { return c = t, u = setTimeout(x, e), l ? _(t) : s } function b(t) { var n = t - a; return void 0 === a || n >= e || n < 0 || y && t - c >= r } function x() { var t = d(); if (b(t)) return w(t); u = setTimeout(x, function (t) { var n = e - (t - a); return y ? h(n, r - (t - c)) : n }(t)) } function w(t) { return u = void 0, m && i ? _(t) : (i = o = void 0, s) } function E() { var t = d(), n = b(t); if (i = arguments, o = this, a = t, n) { if (void 0 === u) return g(a); if (y) return u = setTimeout(x, e), _(a) } return void 0 === u && (u = setTimeout(x, e)), s } return e = p(e) || 0, v(n) && (l = !!n.leading, r = (y = "maxWait" in n) ? f(p(n.maxWait) || 0, e) : r, m = "trailing" in n ? !!n.trailing : m), E.cancel = function () { void 0 !== u && clearTimeout(u), c = 0, i = a = o = u = void 0 }, E.flush = function () { return void 0 === u ? s : w(d()) }, E } }).call(this, n(8)) }, function (t, e) { t.exports = !0 }, function (t, e) { var n; n = function () { return this }(); try { n = n || new Function("return this")() } catch (t) { "object" == typeof window && (n = window) } t.exports = n }, function (t, e, n) { "use strict"; n.r(e); var i = n(1), o = n(0), r = n.n(o); function s(t) { return (s = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } function u(t, e) { return (u = Object.setPrototypeOf || function (t, e) { return t.__proto__ = e, t })(t, e) } function a(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Date.prototype.toString.call(Reflect.construct(Date, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, i = f(t); if (e) { var o = f(this).constructor; n = Reflect.construct(i, arguments, o) } else n = i.apply(this, arguments); return c(this, n) } } function c(t, e) { return !e || "object" !== s(e) && "function" != typeof e ? l(t) : e } function l(t) { if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return t } function f(t) { return (f = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) { return t.__proto__ || Object.getPrototypeOf(t) })(t) } var h = !!r.a && { capture: !1, passive: !0 }, d = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (t) { window.setTimeout(t, 1e3 / 60) }; window.addEventListener("touchmove", (function () { })); var v = function (t) { !function (t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), e && u(t, e) }(n, t); var e = a(n); function n(t) { var i, o, s, u, a, c, f, v, p, y, m, _, g = t.source, b = void 0 === g ? document : g, x = t.update, w = t.multiplier, E = void 0 === w ? 1 : w, O = t.friction, z = void 0 === O ? .92 : O, T = t.initialValues, S = t.boundX, j = t.boundY, L = t.bounce, P = void 0 === L || L; !function (t, e) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") }(this, n), i = e.call(this); var k = 0, M = 0, A = .3 * E, C = !1, R = !1, F = !1, Z = !1, D = [], B = null; !function () { if (!(b = "string" == typeof b ? document.querySelector(b) : b)) throw new Error("IMPETUS: source not found."); if (!x) throw new Error("IMPETUS: update function not defined."); T && (T[0] && (k = T[0]), T[1] && (M = T[1]), I()), S && (o = S[0], s = S[1]), j && (u = j[0], a = j[1]), b.addEventListener("touchstart", G, h), b.addEventListener("mousedown", G, h) }(); var W = i.emit.bind(l(i)); function H() { document.removeEventListener("touchmove", q, !!r.a && { passive: !1 }), document.removeEventListener("touchend", Y, h), document.removeEventListener("touchcancel", X, h), document.removeEventListener("mousemove", q, !!r.a && { passive: !1 }), document.removeEventListener("mouseup", Y, h) } function I() { x.call(b, k, M, B) } function N(t) { if ("touchmove" === t.type || "touchstart" === t.type || "touchend" === t.type) { var e = t.targetTouches[0] || t.changedTouches[0]; return { x: e.clientX, y: e.clientY, id: e.identifier } } return { x: t.clientX, y: t.clientY, id: null } } function G(t) { B = t; var e = N(t); R || F || (R = !0, Z = !1, y = e.id, c = v = e.x, f = p = e.y, D = [], U(c, f), H(), document.addEventListener("touchmove", q, !!r.a && { passive: !1 }), document.addEventListener("touchend", Y, h), document.addEventListener("touchcancel", X, h), document.addEventListener("mousemove", q, !!r.a && { passive: !1 }), document.addEventListener("mouseup", Y, h), W("start", { x: v, y: p, event: B })) } function q(t) { t.preventDefault(), B = t; var e = N(t); R && e.id === y && (v = e.x, p = e.y, U(c, f), C || d($), C = !0) } function Y(t) { B = t; var e = N(t); R && e.id === y && X() } function X() { R = !1, U(c, f), function () { var t = D[0], e = D[D.length - 1], n = e.x - t.x, i = e.y - t.y, o = (e.time - t.time) / 15 / E; m = n / o || 0, _ = i / o || 0; var r = K(); Math.abs(m) > 1 || Math.abs(_) > 1 || !r.inBounds ? (Z = !0, d(J)) : W("end", { x: k, y: M, event: B }) }(), H() } function U(t, e) { for (var n = Date.now(); D.length > 0 && !(n - D[0].time <= 100);)D.shift(); D.push({ x: t, y: e, time: n }) } function $() { var t = v - c, e = p - f; if (k += t * E, M += e * E, P) { var n = K(); 0 !== n.x && (k -= t * V(n.x) * E), 0 !== n.y && (M -= e * V(n.y) * E) } else K(!0); I(), c = v, f = p, C = !1 } function V(t) { return 5e-6 * Math.pow(t, 2) + 1e-4 * t + .55 } function K(t) { var e = 0, n = 0; return void 0 !== o && k < o ? e = o - k : void 0 !== s && k > s && (e = s - k), void 0 !== u && M < u ? n = u - M : void 0 !== a && M > a && (n = a - M), t && (0 !== e && (k = e > 0 ? o : s), 0 !== n && (M = n > 0 ? u : a)), { x: e, y: n, inBounds: 0 === e && 0 === n } } function J() { if (Z) { k += m *= z, M += _ *= z; var t = K(); if (Math.abs(m) > A || Math.abs(_) > A || !t.inBounds) { if (P) { if (0 !== t.x) if (t.x * m <= 0) m += .04 * t.x; else { var e = t.x > 0 ? 2.5 : -2.5; m = .11 * (t.x + e) } if (0 !== t.y) if (t.y * _ <= 0) _ += .04 * t.y; else { var n = t.y > 0 ? 2.5 : -2.5; _ = .11 * (t.y + n) } } else 0 !== t.x && (k = t.x > 0 ? o : s, m = 0), 0 !== t.y && (M = t.y > 0 ? u : a, _ = 0); I(), d(J) } else Z = !1, W("end", { x: k, y: M, event: B }) } } return i.destroy = function () { return b.removeEventListener("touchstart", G), b.removeEventListener("mousedown", G), H(), null }, i.pause = function () { H(), R = !1, F = !0 }, i.resume = function () { F = !1 }, i.setValues = function (t, e) { "number" == typeof t && (k = t), "number" == typeof e && (M = e) }, i.setMultiplier = function (t) { A = .3 * (E = t) }, i.setBoundX = function (t) { o = t[0], s = t[1] }, i.setBoundY = function (t) { u = t[0], a = t[1] }, i } return n }(i.EventEmitter), p = n(4), y = n.n(p), m = n(3), _ = n.n(m), g = n(2), b = n.n(g), x = !!r.a && { capture: !1, passive: !0 }; function w() { this.position = [0, 0], this.touch = null } var E = function (t) { t = t || window; var e = new i.EventEmitter, n = [null, null], o = 0, r = 0, s = !1, u = !1; return Object.defineProperties(e, { pinching: _()((function () { return 2 === o })), fingers: _()((function () { return n })) }), c(), e.enable = c, e.disable = function () { u && (u = !1, o = 0, n[0] = null, n[1] = null, r = 0, s = !1, t.removeEventListener("touchstart", l, x), t.removeEventListener("touchmove", f, x), t.removeEventListener("touchend", h, x), t.removeEventListener("touchcancel", h, x)) }, e.indexOfTouch = a, e; function a(t) { for (var e = t.identifier, i = 0; i < n.length; i++)if (n[i] && n[i].touch && n[i].touch.identifier === e) return i; return -1 } function c() { u || (u = !0, t.addEventListener("touchstart", l, x), t.addEventListener("touchmove", f, x), t.addEventListener("touchend", h, x), t.addEventListener("touchcancel", h, x)) } function l(i) { for (var u = 0; u < i.changedTouches.length; u++) { var c = i.changedTouches[u]; if (-1 === a(c.identifier) && o < 2) { var l = 0 === o, f = n[0] ? 1 : 0, h = n[0] ? 0 : 1, v = new w; n[f] = v, o++, v.touch = c, b()(c, t, v.position); var p = n[h] ? n[h].touch : void 0; if (e.emit("place", c, p), !l) { var y = d(); s = !1, e.emit("start", y, i), r = y } } } } function f(i) { for (var s = !1, u = 0; u < i.changedTouches.length; u++) { var c = i.changedTouches[u], l = a(c); -1 !== l && (s = !0, n[l].touch = c, b()(c, t, n[l].position)) } if (2 === o && s) { var f = d(); e.emit("change", f, r, i), r = f } } function h(t) { for (var i = 0; i < t.changedTouches.length; i++) { var u = t.changedTouches[i], c = a(u); if (-1 !== c) { n[c] = null, o--; var l = 0 === c ? 1 : 0, f = n[l] ? n[l].touch : void 0; e.emit("lift", u, f, t) } } s || 2 === o || (s = !0, e.emit("end", r, t)) } function d() { return o < 2 ? 0 : y()(n[0].position, n[1].position) } }, O = n(5), z = n.n(O), T = n(6), S = n.n(T); e.default = function (t, e, n) { function i(t) { n.onStart && n.onStart(t) } function o(t) { n.onEnd && requestAnimationFrame((function () { n.onEnd(t) })) } t instanceof Function && (e = t, t = document.documentElement || document.body), n || (n = {}); var r = null, s = null, u = null; "string" == typeof t && (t = document.querySelector(t)); var a, c, l = z.a.emitter(); function f(e) { return e || (e = t.getBoundingClientRect()), { x: l.position[0] - e.x, y: l.position[1] - e.y } } var h = { x: 0, y: 0, px: 0, py: 0 }, d = 0, p = 0; (a = new v({ source: t, update: function (n, i, o) { var r = f(t.getBoundingClientRect()), s = { srcElement: c, event: o, target: t, type: "mouse", dx: n - d, dy: i - p, dz: 0, x: r.x, y: r.y, x0: h.x, y0: h.y, px0: h.px, py0: h.py }; d = n, p = i, e(s) }, multiplier: n.friction || 1, friction: n.multiplier || .75, boundX: n.boundX, boundY: n.boundY, bounce: n.bounce })).on("start", (function (e) { var n = e.event, o = t.getBoundingClientRect(), r = f(o); h = { x: r.x, y: r.y, px: r.x / o.width, py: r.y / o.height }, i({ srcElement: c = n.srcElement, event: n, target: t, type: "mouse", dx: 0, dy: 0, dz: 0, x: r.x, y: r.y, x0: h.x, y0: h.y, px0: h.px, py0: h.py }) })), a.on("end", (function (e) { var n = e.event, i = f(); o({ srcElement: c, event: n, target: t, type: "mouse", dx: 0, dy: 0, dz: 0, x: i.x, y: i.y, x0: h.x, y0: h.y, px0: h.px, py0: h.py }) })), [window, document, document.documentElement, document.body].indexOf(t); var y = null; function m() { if (y) return y; var a = function (a) { n.passive || a.preventDefault(); var c = t.getBoundingClientRect(), l = a.clientX - c.x, h = a.clientY - c.y, d = function (e) { e || (e = {}); var n = t.getBoundingClientRect(), a = f(n), c = s || {}, l = u || {}, h = null != e.x ? e.x : a.x, d = null != e.y ? e.y : a.y, v = null != l.x ? l.x : h, p = null != l.y ? l.y : d, y = null != e.dx ? e.dx : h - v, m = null != e.dy ? e.dy : d - p, _ = null != e.dz ? e.dz : 0, g = null != c.x0 ? c.x0 : null != e.x0 ? e.x0 : a.x, b = null != c.y0 ? c.y0 : null != e.y0 ? e.y0 : a.y, x = null != c.px0 ? c.px0 : g / n.width, w = null != c.py0 ? c.py0 : b / n.height, E = { type: e.type || "mouse", srcElement: e.srcElement || t, target: t, event: e.event, x: h, y: d, dx: y, dy: m, dz: _, x0: g, y0: b, px0: x, py0: w }, O = !1; r || (O = !0, s = u = E, i(E), r = S()((function (t) { o(t), r = null, s = null, u = null }), 60)), r(E); var z = { isStart: O, init: s, last: u, event: E }; return u = z.event, z }({ dx: 0, dy: 0, dz: .5 * a.deltaY, x: l, y: h, x0: l, y0: h, srcElement: a.srcElement, event: a, type: "mouse" }); e(d.event) }; return t.addEventListener("wheel", a, { passive: !!n.passive }), a } function _() { y && (y = t.removeEventListener("wheel", y, { passive: !0 })) } y = m(); var g, b = E(); function x() { return function (t) { var e, n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : window, i = (arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}).threshold || 500, o = function (n) { e ? (e = clearTimeout(e), t && t(n)) : e = setTimeout((function () { e = null }), i) }; return n.addEventListener("click", o, { passive: !0 }), function () { return n.removeEventListener("click", o, { passive: !0 }), null } }((function () { var e, i = t.getBoundingClientRect(), o = f(i); e = { srcElement: t, target: t, type: "mouse", dx: 0, dy: 0, dz: 0, x: o.x, y: o.x, x0: o.x, y0: o.x, px0: o.x / i.width, py0: o.y / i.height }, n.onDoubleTap && n.onDoubleTap(e) }), t) } b.on("start", (function (e, n) { var o, r, s = (o = b.fingers[0], [.5 * (r = b.fingers[1]).position[0] + .5 * o.position[0], .5 * r.position[1] + .5 * o.position[1]]), u = t.getBoundingClientRect(), c = s[0], l = s[1]; (function (e, n, i) { return i || (i = t.getBoundingClientRect()), e >= i.x && e <= i.x + i.width && n >= i.y && n <= i.y + i.height })(c, l, u) && (c -= u.x, l -= u.y, g = { x: c, y: l, px0: c / u.width, py0: l / u.height }, a && a.pause(), i({ srcElement: n.srcElement, event: n, target: t, type: "touch", dx: 0, dy: 0, dz: 0, x: g.x, y: g.y, x0: g.x, y0: g.y, px0: g.px0, py0: g.py0 })) })), b.on("end", (function (e, n) { g && (a && a.resume(), o({ srcElement: n.srcElement, event: n, target: t, type: "touch", dx: 0, dy: 0, dz: 0, x: g.x, y: g.y, x0: g.x, y0: g.y, px0: g.px0, py0: g.py0 }), g = null) })), b.on("change", (function (n, i, o) { b.pinching && g && e({ srcElement: t, event: o, target: t, type: "touch", dx: 0, dy: 0, dz: 1.3 * -(n - i), x: g.x, y: g.x, x0: g.x, y0: g.x, px0: g.px0, py0: g.py0 }) })); var w = x(), O = function () { l.dispose(), a.destroy(), _(), w && (w = w()), b.disable() }; return O.disablePan = function () { a && a.pause() }, O.enablePan = function () { a && a.resume() }, O.disableZoom = function () { b && b.disable(), _(), w && (w = w()) }, O.enableZoom = function () { b && b.enable(), y = m(), w = x() }, O } }]) }, function (t, e, n) { "use strict"; var i = Object.prototype.hasOwnProperty, o = "~"; function r() { } function s(t, e, n) { this.fn = t, this.context = e, this.once = n || !1 } function u(t, e, n, i, r) { if ("function" !== typeof n) throw new TypeError("The listener must be a function"); var u = new s(n, i || t, r), a = o ? o + e : e; return t._events[a] ? t._events[a].fn ? t._events[a] = [t._events[a], u] : t._events[a].push(u) : (t._events[a] = u, t._eventsCount++), t } function a(t, e) { 0 === --t._eventsCount ? t._events = new r : delete t._events[e] } function c() { this._events = new r, this._eventsCount = 0 } Object.create && (r.prototype = Object.create(null), (new r).__proto__ || (o = !1)), c.prototype.eventNames = function () { var t, e, n = []; if (0 === this._eventsCount) return n; for (e in t = this._events) i.call(t, e) && n.push(o ? e.slice(1) : e); return Object.getOwnPropertySymbols ? n.concat(Object.getOwnPropertySymbols(t)) : n }, c.prototype.listeners = function (t) { var e = o ? o + t : t, n = this._events[e]; if (!n) return []; if (n.fn) return [n.fn]; for (var i = 0, r = n.length, s = new Array(r); i < r; i++)s[i] = n[i].fn; return s }, c.prototype.listenerCount = function (t) { var e = o ? o + t : t, n = this._events[e]; return n ? n.fn ? 1 : n.length : 0 }, c.prototype.emit = function (t, e, n, i, r, s) { var u = o ? o + t : t; if (!this._events[u]) return !1; var a, c, l = this._events[u], f = arguments.length; if (l.fn) { switch (l.once && this.removeListener(t, l.fn, void 0, !0), f) { case 1: return l.fn.call(l.context), !0; case 2: return l.fn.call(l.context, e), !0; case 3: return l.fn.call(l.context, e, n), !0; case 4: return l.fn.call(l.context, e, n, i), !0; case 5: return l.fn.call(l.context, e, n, i, r), !0; case 6: return l.fn.call(l.context, e, n, i, r, s), !0 }for (c = 1, a = new Array(f - 1); c < f; c++)a[c - 1] = arguments[c]; l.fn.apply(l.context, a) } else { var h, d = l.length; for (c = 0; c < d; c++)switch (l[c].once && this.removeListener(t, l[c].fn, void 0, !0), f) { case 1: l[c].fn.call(l[c].context); break; case 2: l[c].fn.call(l[c].context, e); break; case 3: l[c].fn.call(l[c].context, e, n); break; case 4: l[c].fn.call(l[c].context, e, n, i); break; default: if (!a) for (h = 1, a = new Array(f - 1); h < f; h++)a[h - 1] = arguments[h]; l[c].fn.apply(l[c].context, a) } } return !0 }, c.prototype.on = function (t, e, n) { return u(this, t, e, n, !1) }, c.prototype.once = function (t, e, n) { return u(this, t, e, n, !0) }, c.prototype.removeListener = function (t, e, n, i) { var r = o ? o + t : t; if (!this._events[r]) return this; if (!e) return a(this, r), this; var s = this._events[r]; if (s.fn) s.fn !== e || i && !s.once || n && s.context !== n || a(this, r); else { for (var u = 0, c = [], l = s.length; u < l; u++)(s[u].fn !== e || i && !s[u].once || n && s[u].context !== n) && c.push(s[u]); c.length ? this._events[r] = 1 === c.length ? c[0] : c : a(this, r) } return this }, c.prototype.removeAllListeners = function (t) { var e; return t ? (e = o ? o + t : t, this._events[e] && a(this, e)) : (this._events = new r, this._eventsCount = 0), this }, c.prototype.off = c.prototype.removeListener, c.prototype.addListener = c.prototype.on, c.prefixed = o, c.EventEmitter = c, t.exports = c }, function (t, e, n) { (function (e) { var n = /^\s+|\s+$/g, i = /^[-+]0x[0-9a-f]+$/i, o = /^0b[01]+$/i, r = /^0o[0-7]+$/i, s = parseInt, u = "object" == typeof e && e && e.Object === Object && e, a = "object" == typeof self && self && self.Object === Object && self, c = u || a || Function("return this")(), l = Object.prototype.toString, f = Math.max, h = Math.min, d = function () { return c.Date.now() }; function v(t) { var e = typeof t; return !!t && ("object" == e || "function" == e) } function p(t) { if ("number" == typeof t) return t; if (function (t) { return "symbol" == typeof t || function (t) { return !!t && "object" == typeof t }(t) && "[object Symbol]" == l.call(t) }(t)) return NaN; if (v(t)) { var e = "function" == typeof t.valueOf ? t.valueOf() : t; t = v(e) ? e + "" : e } if ("string" != typeof t) return 0 === t ? t : +t; t = t.replace(n, ""); var u = o.test(t); return u || r.test(t) ? s(t.slice(2), u ? 2 : 8) : i.test(t) ? NaN : +t } t.exports = function (t, e, n) { var i, o, r, s, u, a, c = 0, l = !1, y = !1, m = !0; if ("function" != typeof t) throw new TypeError("Expected a function"); function _(e) { var n = i, r = o; return i = o = void 0, c = e, s = t.apply(r, n) } function g(t) { return c = t, u = setTimeout(x, e), l ? _(t) : s } function b(t) { var n = t - a; return void 0 === a || n >= e || n < 0 || y && t - c >= r } function x() { var t = d(); if (b(t)) return w(t); u = setTimeout(x, function (t) { var n = e - (t - a); return y ? h(n, r - (t - c)) : n }(t)) } function w(t) { return u = void 0, m && i ? _(t) : (i = o = void 0, s) } function E() { var t = d(), n = b(t); if (i = arguments, o = this, a = t, n) { if (void 0 === u) return g(a); if (y) return u = setTimeout(x, e), _(a) } return void 0 === u && (u = setTimeout(x, e)), s } return e = p(e) || 0, v(n) && (l = !!n.leading, r = (y = "maxWait" in n) ? f(p(n.maxWait) || 0, e) : r, m = "trailing" in n ? !!n.trailing : m), E.cancel = function () { void 0 !== u && clearTimeout(u), c = 0, i = a = o = u = void 0 }, E.flush = function () { return void 0 === u ? s : w(d()) }, E } }).call(this, n(0)) }, function (t, e, n) { "use strict"; Object.defineProperty(e, "__esModule", { value: !0 }); var i = n(1); e.fit = i.fit, e.position = i.position, e.fitAndPosition = i.fitAndPosition; var o = n(8); e.transformFittedPoint = o.transformFittedPoint; var r = n(9); e.isFit = r.isFit }, function (t, e, n) { "use strict"; Object.defineProperty(e, "__esModule", { value: !0 }); const i = n(1); e.transformFittedPoint = (t, e, n, o = "fill", r = "50%", s = "50%") => { const { x: u, y: a, width: c, height: l } = i.fitAndPosition(e, n, o, r, s), f = n.width / c, h = n.height / l; return { x: (t.x - u) * f, y: (t.y - a) * h } } }, function (t, e, n) { "use strict"; Object.defineProperty(e, "__esModule", { value: !0 }); const i = { contain: !0, cover: !0, fill: !0, none: !0, "scale-down": !0 }; e.isFit = t => t in i }, function (t, e, n) { "use strict"; n.r(e), function (t) { var n = function () { if ("undefined" !== typeof Map) return Map; function t(t, e) { var n = -1; return t.some((function (t, i) { return t[0] === e && (n = i, !0) })), n } return function () { function e() { this.__entries__ = [] } return Object.defineProperty(e.prototype, "size", { get: function () { return this.__entries__.length }, enumerable: !0, configurable: !0 }), e.prototype.get = function (e) { var n = t(this.__entries__, e), i = this.__entries__[n]; return i && i[1] }, e.prototype.set = function (e, n) { var i = t(this.__entries__, e); ~i ? this.__entries__[i][1] = n : this.__entries__.push([e, n]) }, e.prototype.delete = function (e) { var n = this.__entries__, i = t(n, e); ~i && n.splice(i, 1) }, e.prototype.has = function (e) { return !!~t(this.__entries__, e) }, e.prototype.clear = function () { this.__entries__.splice(0) }, e.prototype.forEach = function (t, e) { void 0 === e && (e = null); for (var n = 0, i = this.__entries__; n < i.length; n++) { var o = i[n]; t.call(e, o[1], o[0]) } }, e }() }(), i = "undefined" !== typeof window && "undefined" !== typeof document && window.document === document, o = "undefined" !== typeof t && t.Math === Math ? t : "undefined" !== typeof self && self.Math === Math ? self : "undefined" !== typeof window && window.Math === Math ? window : Function("return this")(), r = "function" === typeof requestAnimationFrame ? requestAnimationFrame.bind(o) : function (t) { return setTimeout((function () { return t(Date.now()) }), 1e3 / 60) }; var s = ["top", "right", "bottom", "left", "width", "height", "size", "weight"], u = "undefined" !== typeof MutationObserver, a = function () { function t() { this.connected_ = !1, this.mutationEventsAdded_ = !1, this.mutationsObserver_ = null, this.observers_ = [], this.onTransitionEnd_ = this.onTransitionEnd_.bind(this), this.refresh = function (t, e) { var n = !1, i = !1, o = 0; function s() { n && (n = !1, t()), i && a() } function u() { r(s) } function a() { var t = Date.now(); if (n) { if (t - o < 2) return; i = !0 } else n = !0, i = !1, setTimeout(u, e); o = t } return a }(this.refresh.bind(this), 20) } return t.prototype.addObserver = function (t) { ~this.observers_.indexOf(t) || this.observers_.push(t), this.connected_ || this.connect_() }, t.prototype.removeObserver = function (t) { var e = this.observers_, n = e.indexOf(t); ~n && e.splice(n, 1), !e.length && this.connected_ && this.disconnect_() }, t.prototype.refresh = function () { this.updateObservers_() && this.refresh() }, t.prototype.updateObservers_ = function () { var t = this.observers_.filter((function (t) { return t.gatherActive(), t.hasActive() })); return t.forEach((function (t) { return t.broadcastActive() })), t.length > 0 }, t.prototype.connect_ = function () { i && !this.connected_ && (document.addEventListener("transitionend", this.onTransitionEnd_), window.addEventListener("resize", this.refresh), u ? (this.mutationsObserver_ = new MutationObserver(this.refresh), this.mutationsObserver_.observe(document, { attributes: !0, childList: !0, characterData: !0, subtree: !0 })) : (document.addEventListener("DOMSubtreeModified", this.refresh), this.mutationEventsAdded_ = !0), this.connected_ = !0) }, t.prototype.disconnect_ = function () { i && this.connected_ && (document.removeEventListener("transitionend", this.onTransitionEnd_), window.removeEventListener("resize", this.refresh), this.mutationsObserver_ && this.mutationsObserver_.disconnect(), this.mutationEventsAdded_ && document.removeEventListener("DOMSubtreeModified", this.refresh), this.mutationsObserver_ = null, this.mutationEventsAdded_ = !1, this.connected_ = !1) }, t.prototype.onTransitionEnd_ = function (t) { var e = t.propertyName, n = void 0 === e ? "" : e; s.some((function (t) { return !!~n.indexOf(t) })) && this.refresh() }, t.getInstance = function () { return this.instance_ || (this.instance_ = new t), this.instance_ }, t.instance_ = null, t }(), c = function (t, e) { for (var n = 0, i = Object.keys(e); n < i.length; n++) { var o = i[n]; Object.defineProperty(t, o, { value: e[o], enumerable: !1, writable: !1, configurable: !0 }) } return t }, l = function (t) { return t && t.ownerDocument && t.ownerDocument.defaultView || o }, f = m(0, 0, 0, 0); function h(t) { return parseFloat(t) || 0 } function d(t) { for (var e = [], n = 1; n < arguments.length; n++)e[n - 1] = arguments[n]; return e.reduce((function (e, n) { return e + h(t["border-" + n + "-width"]) }), 0) } function v(t) { var e = t.clientWidth, n = t.clientHeight; if (!e && !n) return f; var i = l(t).getComputedStyle(t), o = function (t) { for (var e = {}, n = 0, i = ["top", "right", "bottom", "left"]; n < i.length; n++) { var o = i[n], r = t["padding-" + o]; e[o] = h(r) } return e }(i), r = o.left + o.right, s = o.top + o.bottom, u = h(i.width), a = h(i.height); if ("border-box" === i.boxSizing && (Math.round(u + r) !== e && (u -= d(i, "left", "right") + r), Math.round(a + s) !== n && (a -= d(i, "top", "bottom") + s)), !function (t) { return t === l(t).document.documentElement }(t)) { var c = Math.round(u + r) - e, v = Math.round(a + s) - n; 1 !== Math.abs(c) && (u -= c), 1 !== Math.abs(v) && (a -= v) } return m(o.left, o.top, u, a) } var p = "undefined" !== typeof SVGGraphicsElement ? function (t) { return t instanceof l(t).SVGGraphicsElement } : function (t) { return t instanceof l(t).SVGElement && "function" === typeof t.getBBox }; function y(t) { return i ? p(t) ? function (t) { var e = t.getBBox(); return m(0, 0, e.width, e.height) }(t) : v(t) : f } function m(t, e, n, i) { return { x: t, y: e, width: n, height: i } } var _ = function () { function t(t) { this.broadcastWidth = 0, this.broadcastHeight = 0, this.contentRect_ = m(0, 0, 0, 0), this.target = t } return t.prototype.isActive = function () { var t = y(this.target); return this.contentRect_ = t, t.width !== this.broadcastWidth || t.height !== this.broadcastHeight }, t.prototype.broadcastRect = function () { var t = this.contentRect_; return this.broadcastWidth = t.width, this.broadcastHeight = t.height, t }, t }(), g = function (t, e) { var n, i, o, r, s, u, a, l = (i = (n = e).x, o = n.y, r = n.width, s = n.height, u = "undefined" !== typeof DOMRectReadOnly ? DOMRectReadOnly : Object, a = Object.create(u.prototype), c(a, { x: i, y: o, width: r, height: s, top: o, right: i + r, bottom: s + o, left: i }), a); c(this, { target: t, contentRect: l }) }, b = function () { function t(t, e, i) { if (this.activeObservations_ = [], this.observations_ = new n, "function" !== typeof t) throw new TypeError("The callback provided as parameter 1 is not a function."); this.callback_ = t, this.controller_ = e, this.callbackCtx_ = i } return t.prototype.observe = function (t) { if (!arguments.length) throw new TypeError("1 argument required, but only 0 present."); if ("undefined" !== typeof Element && Element instanceof Object) { if (!(t instanceof l(t).Element)) throw new TypeError('parameter 1 is not of type "Element".'); var e = this.observations_; e.has(t) || (e.set(t, new _(t)), this.controller_.addObserver(this), this.controller_.refresh()) } }, t.prototype.unobserve = function (t) { if (!arguments.length) throw new TypeError("1 argument required, but only 0 present."); if ("undefined" !== typeof Element && Element instanceof Object) { if (!(t instanceof l(t).Element)) throw new TypeError('parameter 1 is not of type "Element".'); var e = this.observations_; e.has(t) && (e.delete(t), e.size || this.controller_.removeObserver(this)) } }, t.prototype.disconnect = function () { this.clearActive(), this.observations_.clear(), this.controller_.removeObserver(this) }, t.prototype.gatherActive = function () { var t = this; this.clearActive(), this.observations_.forEach((function (e) { e.isActive() && t.activeObservations_.push(e) })) }, t.prototype.broadcastActive = function () { if (this.hasActive()) { var t = this.callbackCtx_, e = this.activeObservations_.map((function (t) { return new g(t.target, t.broadcastRect()) })); this.callback_.call(t, e, t), this.clearActive() } }, t.prototype.clearActive = function () { this.activeObservations_.splice(0) }, t.prototype.hasActive = function () { return this.activeObservations_.length > 0 }, t }(), x = "undefined" !== typeof WeakMap ? new WeakMap : new n, w = function t(e) { if (!(this instanceof t)) throw new TypeError("Cannot call a class as a function."); if (!arguments.length) throw new TypeError("1 argument required, but only 0 present."); var n = a.getInstance(), i = new b(e, n, this); x.set(this, i) };["observe", "unobserve", "disconnect"].forEach((function (t) { w.prototype[t] = function () { var e; return (e = x.get(this))[t].apply(e, arguments) } })); var E = "undefined" !== typeof o.ResizeObserver ? o.ResizeObserver : w; e.default = E }.call(this, n(0)) }]) }));

    }, {}]
}, {}, [1]);
