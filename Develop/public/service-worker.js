var CACHE_NAME = 'my-site-cache-v1';
const DATA_CACHE = 'my-data-cache-v1';

var urlsToCache = [
  '/',
  '/styles.css',
  '/index.js',
  '/db.js',
  'manifest.json',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png'
];


self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener("fetch", function(event) {
  if(event.request.url.includes("api")){
    event.respondWith(
      caches.open(DATA_CACHE).then(cache => {
        return fetch(event.request)
        .then(response => {
          cache.put(event.request, response.clone())
          return response;
        })
        .catch(()=> caches.match(event.request))
      })
    )
    return
  }
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request).then(function(response) {
        if (response) {
          return response;
        } else if (event.request.headers.get("accept").includes("text/html")) {
          return caches.match("/index.html");
        }
      });
    })
  );
});

