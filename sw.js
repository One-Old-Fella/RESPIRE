const CACHE_NAME = 'respire-system-v0.1.9.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// 1. Install Phase: Cache the "Commissioning Assets"
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[System] Caching core assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Activate Phase: Clean up old "Firmware" versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[System] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

// 3. Fetch Phase: Serve from Battery (Cache) if Grid (Network) is down
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cache if found, otherwise fetch from network
      return response || fetch(event.request);
    })
  );
});

// 4. Message Handler: Allow the client to force an update
self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

