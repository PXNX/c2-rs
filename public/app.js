function showMap() {
    var beforePan = function (oldPan, newPan) {
        var stopHorizontal = false
            , stopVertical = false
            , gutterWidth = 100
            , gutterHeight = 100
            // Computed variables
            , sizes = this.getSizes()
            , leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth
            , rightLimit = sizes.width - gutterWidth - (sizes.viewBox.x * sizes.realZoom)
            , topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight
            , bottomLimit = sizes.height - gutterHeight - (sizes.viewBox.y * sizes.realZoom)

        customPan = {}
        customPan.x = Math.max(leftLimit, Math.min(rightLimit, newPan.x))
        customPan.y = Math.max(topLimit, Math.min(bottomLimit, newPan.y))

        return customPan
    }


    var eventsHandler = {
        haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel']
        , init: function (options) {
            var instance = options.instance
                , initialScale = 1
                , pannedX = 0
                , pannedY = 0

            // Init Hammer
            // Listen only for pointer and touch events
            this.hammer = Hammer(options.svgElement, {
                inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
            })

            // Enable pinch
            this.hammer.get('pinch').set({enable: true})

            // Handle double tap
            this.hammer.on('doubletap', function (ev) {
                instance.zoomIn()
            })

            // Handle pan
            this.hammer.on('panstart panmove', function (ev) {
                // On pan start reset panned variables
                if (ev.type === 'panstart') {
                    pannedX = 0
                    pannedY = 0
                }

                // Pan only the difference
                instance.panBy({x: ev.deltaX - pannedX, y: ev.deltaY - pannedY})
                pannedX = ev.deltaX
                pannedY = ev.deltaY
            })

            // Handle pinch
            this.hammer.on('pinchstart pinchmove', function (ev) {
                // On pinch start remember initial zoom
                if (ev.type === 'pinchstart') {
                    initialScale = instance.getZoom()
                    instance.zoomAtPoint(initialScale * ev.scale, {x: ev.center.x, y: ev.center.y})
                }

                instance.zoomAtPoint(initialScale * ev.scale, {x: ev.center.x, y: ev.center.y})
            })

            // Prevent moving the page on some devices when panning over SVG
            options.svgElement.addEventListener('touchmove', function (e) {
                e.preventDefault();
            });
        }

        , destroy: function () {
            this.hammer.destroy()
        }
    }
    svgPanZoom('#limit-svg', {
        viewportSelector: '#limit-div',
        zoomEnabled: true
        , controlIconsEnabled: true

        , center: 1,

        contain: true, minZoom: 1
        , maxZoom: 40
        , contain: true
        , customEventsHandler: eventsHandler,
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
            console.log('Thanks for sharing!');
        })
            .catch(console.error);
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
                scope: "/",
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
(function () {
    const r = document.createElement("link").relList;
    if (r && r.supports && r.supports("modulepreload")) return;
    for (const e of document.querySelectorAll('link[rel="modulepreload"]')) n(e);
    new MutationObserver(e => {
        for (const t of e) if (t.type === "childList") for (const o of t.addedNodes) o.tagName === "LINK" && o.rel === "modulepreload" && n(o)
    }).observe(document, {childList: !0, subtree: !0});

    function i(e) {
        const t = {};
        return e.integrity && (t.integrity = e.integrity), e.referrerpolicy && (t.referrerPolicy = e.referrerpolicy), e.crossorigin === "use-credentials" ? t.credentials = "include" : e.crossorigin === "anonymous" ? t.credentials = "omit" : t.credentials = "same-origin", t
    }

    function n(e) {
        if (e.ep) return;
        e.ep = !0;
        const t = i(e);
        fetch(e.href, t)
    }
})();
//# sourceMappingURL=index-c730f519.js.map
