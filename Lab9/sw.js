const CACHE_NAME = "v1.1";
const OFFLINE_URL = "offline.html";

async function cacheOffline() {
    const cache = await caches.open(CACHE_NAME);
    // Can add files to cache by using:
    // cache.add(fileName)
    // or
    // cache.addAll([fileName1, fileName2, fileName3...])
    cache.add(OFFLINE_URL);
}

function deleteOldCache() {
    caches.keys()
        .then(keys => {
            return Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        });
}

async function onlineOrOffline(req) {
    try {
        // Always try the network first.
        return await fetch(req);
    } catch (error) {
        const cache = await caches.open(CACHE_NAME);
        // If the file is HTML, respond with offline.html
        const cachedResponse = await cache.match(OFFLINE_URL);
        return cachedResponse;
    }
}

self.addEventListener("install", (event) => {
    event.waitUntil(cacheOffline());
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(deleteOldCache());
});

self.addEventListener("fetch", (event) => {
    if (event.request.mode === "navigate") {
        event.respondWith(onlineOrOffline(event.request));
    }
});
