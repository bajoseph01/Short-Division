const CACHE_NAME = 'jogo-short-division-v1'; // CHANGE THIS IF YOU UPDATE APP ASSETS
const ASSETS_TO_CACHE = [
  './', // Caches the root of where the PWA is served from
  './Short division_v6.html', // Your main HTML file
  // Add paths to your actual icons once created
  './icon-192x192.png',
  './icon-512x512.png',
  './apple-touch-icon.png',
  // External resources (fonts)
  'https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Roboto:wght@400&display=swap'
  // Note: The scratchpad canvas drawing is dynamic and not cached by this.
  // Only the app "shell" (HTML, CSS, core JS, fonts, icons) is cached.
];

// Install event: cache core assets
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch(error => {
        console.error('[ServiceWorker] Failed to cache app shell:', error);
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event: serve assets from cache if available, otherwise fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Serve from cache
        }
        return fetch(event.request); // Fetch from network
      }
    )
  );
});