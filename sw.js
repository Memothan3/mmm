// Service Worker for DCT Entertainment
const CACHE_NAME = 'dct-entertainment-v1.1';
const OFFLINE_PAGE = '/offline.html';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/about.html',
  '/services.html',
  '/portfolio.html',
  '/events.html',
  '/contact.html',
  '/css/style.css',
  '/js/app.js',
  '/assets/Dct logo-01.jpg',
  '/assets/Favicon/favicon.ico',
  '/manifest.json',
  OFFLINE_PAGE
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, falling back to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if found and not a navigation request
      if (response) {
        return response;
      }

      // For navigation requests, use the network first, then cache, then offline page
      if (event.request.mode === 'navigate') {
        return fetch(event.request)
          .then((networkResponse) => {
            // Cache the page
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
          .catch(() => {
            // If offline and not in cache, show offline page
            return caches.match(OFFLINE_PAGE);
          });
      }

      // For other requests, try network first, then cache
      return fetch(event.request)
        .then((networkResponse) => {
          // Cache the response if it's valid
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and not in cache, return offline page for HTML requests
          if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match(OFFLINE_PAGE);
          }
          return new Response('', { status: 408, statusText: 'Network request failed' });
        });
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', cache);
            return caches.delete(cache);
          }
        })
      ).then(() => self.clients.claim())
    })
  );
});
