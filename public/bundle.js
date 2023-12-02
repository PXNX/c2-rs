(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function showMap() {
    var beforePan = function (oldPan, newPan) {
        var stopHorizontal = false,
            stopVertical = false,
            gutterWidth = 100,
            gutterHeight = 100,

        // Computed variables
        sizes = this.getSizes(),
            leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth,
            rightLimit = sizes.width - gutterWidth - sizes.viewBox.x * sizes.realZoom,
            topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight,
            bottomLimit = sizes.height - gutterHeight - sizes.viewBox.y * sizes.realZoom;

        var customPan = {};
        customPan.x = Math.max(leftLimit, Math.min(rightLimit, newPan.x));
        customPan.y = Math.max(topLimit, Math.min(bottomLimit, newPan.y));

        return customPan;
    };

    var eventsHandler = {
        haltEventListeners: ["touchstart", "touchend", "touchmove", "touchleave", "touchcancel"],
        init: function (options) {
            var instance = options.instance,
                initialScale = 1,
                pannedX = 0,
                pannedY = 0;

            // Init Hammer
            // Listen only for pointer and touch events
            this.hammer = Hammer(options.svgElement, {
                inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
            });

            // Enable pinch
            this.hammer.get("pinch").set({ enable: true });

            // Handle double tap
            this.hammer.on("doubletap", function (ev) {
                instance.zoomIn();
            });

            // Handle pan
            this.hammer.on("panstart panmove", function (ev) {
                // On pan start reset panned variables
                if (ev.type === "panstart") {
                    pannedX = 0;
                    pannedY = 0;
                }

                // Pan only the difference
                instance.panBy({ x: ev.deltaX - pannedX, y: ev.deltaY - pannedY });
                pannedX = ev.deltaX;
                pannedY = ev.deltaY;
            });

            // Handle pinch
            this.hammer.on("pinchstart pinchmove", function (ev) {
                // On pinch start remember initial zoom
                if (ev.type === "pinchstart") {
                    initialScale = instance.getZoom();
                    instance.zoomAtPoint(initialScale * ev.scale, {
                        x: ev.center.x,
                        y: ev.center.y
                    });
                }

                instance.zoomAtPoint(initialScale * ev.scale, {
                    x: ev.center.x,
                    y: ev.center.y
                });
            });

            // Prevent moving the page on some devices when panning over SVG
            options.svgElement.addEventListener("touchmove", function (e) {
                e.preventDefault();
            });
        },

        destroy: function () {
            this.hammer.destroy();
        }
    };
    svgPanZoom("#limit-svg", {
        viewportSelector: "#limit-div",
        zoomEnabled: true,
        controlIconsEnabled: true,

        center: 1,

        contain: true,
        minZoom: 1,
        maxZoom: 40,

        customEventsHandler: eventsHandler,
        beforePan: beforePan
    });

    document.getElementById("map").classList.remove("hidden");
}

function shareLink(title, url = window.location.href) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).then(() => {
            console.log("Thanks for sharing!");
        }).catch(console.error);
    } else {
        // fallback
    }
}

function replaceImg(img) {
    img.onerror = null;
    img.src = "/dist/icons/account.svg";
}

const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
        try {
            const registration = await navigator.serviceWorker.register("/dist/sw.js", {
                scope: "/"
            });
            if (registration.installing) {
                console.log("Service worker installing");
            } else if (registration.waiting) {
                console.log("Service worker installed");
            } else if (registration.active) {
                console.log("Service worker active");
            }
        } catch (error) {
            console.error(`Registration failed with ${error}`);
        }
    }
};

registerServiceWorker();

//https://www.digitalocean.com/community/tools/minify

//const {of} = require('ol');

},{}]},{},[1]);
