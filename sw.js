const CACHE_NAME = 'calcu-tome-cache-v2';

// Daftarkan file lokal yang ingin bisa diakses secara offline
const assets = [
  './',
  './index.html',
  './css/style.css',
  './js/script.js',
  './img/icon-192.png',
  './img/icon-512.png'
];

// Tahap Install: Menyimpan file ke dalam Cache browser
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

// Tahap Aktivasi: Membersihkan cache lama jika ada update
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Tahap Fetch: Mengambil data dari cache jika offline, atau dari internet jika online
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
