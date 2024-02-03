function shareLink(title, url = window.location.href) {
    if (navigator.share) {
        navigator
            .share({
                title: title,
                url: url,
            })
            .then(() => {
                console.log("Thanks for sharing!");
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

function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
        try {
            const registration = navigator.serviceWorker.register(
                "/dist/sw.js",
                {
                    scope: "/",
                }
            );
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
}
registerServiceWorker();


function showMap() {
    window.addEventListener("load", init);
    const svgElement = document.getElementById("svg");

    const mc = new Hammer.Manager(svgElement);

    function init() {
        for (const child of document.getElementById("province").children) {
            child.setAttribute("onclick", `clickMap(${child.id});`);
        }

        const pinch = new Hammer.Pinch();
        const pan = new Hammer.Pan();

        pinch.requireFailure(pan);

        mc.add([pinch, pan]);

        mc.on("pinchstart", () => {
            console.log("pinchstart");
        });
        mc.on("pinchmove", zoom);
        mc.on("pinchend", pinchend);
        mc.on("panstart", panstart);
        mc.on("panmove", panmove);
        mc.on("panend", panend);

        //  回報滑鼠座標事件
        // svgElement.addEventListener('mousemove', reportCurrentPoint, false)
        //  拖曳的事件
        // svgElement.addEventListener('mousedown', mouseDown, false)
        // svgElement.addEventListener('mousemove', drag, false)
        // svgElement.addEventListener('mouseup', mouseUp, false)
        //  縮放的事件
        svgElement.addEventListener("wheel", zoom, false);
    }

    let paning;
    let startViewBox = null;

    function panstart() {
        paning = true;
        console.log("panstart");

        startViewBox = svgElement
            .getAttribute("viewBox")
            .split(" ")
            .map(n => parseFloat(n));
    }

    function panmove(e) {
        if (paning) {
            let startClient = {
                x: e.changedPointers[0].clientX,
                y: e.changedPointers[0].clientY
            };

            let newSVGPoint = svgElement.createSVGPoint();
            let CTM = svgElement.getScreenCTM();
            newSVGPoint.x = startClient.x;
            newSVGPoint.y = startClient.y;
            let startSVGPoint = newSVGPoint.matrixTransform(CTM.inverse());

            let moveToClient = {
                x: e.changedPointers[0].clientX + e.deltaX,
                y: e.changedPointers[0].clientY + e.deltaY
            };

            newSVGPoint = svgElement.createSVGPoint();
            CTM = svgElement.getScreenCTM();
            newSVGPoint.x = moveToClient.x;
            newSVGPoint.y = moveToClient.y;
            let moveToSVGPoint = newSVGPoint.matrixTransform(CTM.inverse());

            let delta = {
                dx: startSVGPoint.x - moveToSVGPoint.x,
                dy: startSVGPoint.y - moveToSVGPoint.y
            };

            let moveToViewBox = `${startViewBox[0] + delta.dx} ${startViewBox[1] + delta.dy} ${startViewBox[2]} ${startViewBox[3]}`;
            svgElement.setAttribute("viewBox", moveToViewBox);
        }
    }

    function panend() {
        console.log("panend");
        paning = false;
    }

    let adjustScale = 1;
    let currentScale = null;
    let ratio = 1;

    function zoom(e) {
        //  1.取得一開始的 viewBox。
        let startViewBox = svgElement
            .getAttribute("viewBox")
            .split(" ")
            .map(n => parseFloat(n));

        let startClient;
        if (e.type === "wheel") {
            startClient = {
                x: e.clientX,
                y: e.clientY
            };
        }
        if (e.type === "pinchmove") {
            startClient = {
                x: e.center.x,
                y: e.center.y
            };
        }

        let newSVGPoint = svgElement.createSVGPoint();
        let CTM = svgElement.getScreenCTM();
        newSVGPoint.x = startClient.x;
        newSVGPoint.y = startClient.y;
        let startSVGPoint = newSVGPoint.matrixTransform(CTM.inverse());

        let zoomSize = {
            max: 1,
            min: 0.1
        };

        let viewport = {
            width: svgElement.getBoundingClientRect().width,
            height: svgElement.getBoundingClientRect().height
        };

        if (e.type === "wheel") {
            let tmp = ratio + e.deltaY / 100;
            console.log('tmp', tmp)
            if (tmp >= zoomSize.max) {
                tmp = zoomSize.max;
            }
            if (tmp <= zoomSize.min) {
                tmp = zoomSize.min;
            }
            ratio = tmp;
        }

        if (e.type === "pinchmove") {
            currentScale = adjustScale * e.scale;
            ratio = 1 / currentScale;

            if (ratio >= zoomSize.max) {
                ratio = zoomSize.max;
                currentScale = 1 / zoomSize.max;
            }

            if (ratio <= zoomSize.min) {
                ratio = zoomSize.min;
                currentScale = 1 / zoomSize.min;
            }
        }

        svgElement.setAttribute(
            "viewBox",
            `${startViewBox[0]} ${startViewBox[1]} ${viewport.width * ratio} ${viewport.height * ratio}`
        );

        CTM = svgElement.getScreenCTM();
        let moveToSVGPoint = newSVGPoint.matrixTransform(CTM.inverse());

        let delta = {
            dx: startSVGPoint.x - moveToSVGPoint.x,
            dy: startSVGPoint.y - moveToSVGPoint.y
        };

        let middleViewBox = svgElement
            .getAttribute("viewBox")
            .split(" ")
            .map(n => parseFloat(n));
        let moveBackViewBox = `${middleViewBox[0] + delta.dx} ${middleViewBox[1] + delta.dy} ${middleViewBox[2]} ${middleViewBox[3]}`;
        svgElement.setAttribute("viewBox", moveBackViewBox);
    }

    function pinchend(e) {
        adjustScale = currentScale;
        mc.off("pan");
        setTimeout(mc.on("pan"), 100);
        console.log("pinchend");
    }
}

function clickMap(region_id) {
    console.log(region_id)

    document.getElementById("region_name").textContent = `Test ${region_id}`;
    document.getElementById("region_logo").src = `https://picsum.photos/seed/${region_id}/40`;
    document.getElementById("region_link").href = `/region/${region_id}`;

}


