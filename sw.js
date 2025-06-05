// Service Worker for CovY - PWA Support
const CACHE_NAME = 'covy-v1';
const urlsToCache = [
  '/',
  '/css/styles.css',
  '/index.html',
  '/docs.html',
  '/ecommerce-pro.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
