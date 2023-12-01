const urlsToCache = ["/", "/dist/app.js", "/dist/styles.css", "/dist/logo.svg"];
self.addEventListener("install", (event) => {
    event.waitUntil(async () => {
        const cache = await caches.open("pwa-assets");
        return cache.addAll(urlsToCache);
    });
});