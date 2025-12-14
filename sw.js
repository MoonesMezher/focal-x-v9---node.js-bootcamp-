const SITE_STATIC_CACHE_NAME = "pwa-cache-v14";
const SITE_DYNAMIC_CACHE_NAME = "pwa-cache-dynamic-v14";

const assets = [
    "/",
    "/index.html",
    "/fallback.html",
    "/logo.jpg",
    "/tasks/index.html",
    "/tables/index.html",
    "/resources/index.html",
    "manifest.json"
]

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(SITE_STATIC_CACHE_NAME).then(cache => {
            return cache.addAll(assets);
        })
    );

    // console.log("service worker has been installed");
});

self.addEventListener("activate", event => {
    // console.log("service worker has been activated");
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== SITE_STATIC_CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
})

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request).then(async res => {
                    return caches.open(SITE_DYNAMIC_CACHE_NAME).then(cache => {
                        cache.put(event.request.url, res.clone());

                        return res;
                    })
                });
            })
            .catch(() => {
                if(event.request.url.indexOf(".html") > -1) {
                    return caches.match("/fallback.html")
                }
            })
    );
    /* console.log("service worker has been fetched", event); */
});
