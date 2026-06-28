const CACHE_NAME = 'Anbu-v1';

const assetsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './admin-script.js',
  './icon-192.png',
  './icon-512.png'
];

// Tahap Install: Kunci semua aset penting agar bisa dibuka offline
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    }).then(() => self.skipWaiting())
  );
});

// Tahap Aktivasi: Hapus cache usang secara otomatis
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Tahap Fetch (Strategi Super Offline): Ambil dari cache dulu, lalu perbarui dari internet di latar belakang
self.addEventListener('fetch', (e) => {
  // Abaikan request eksternal seperti Firebase Auth/Firestore agar tidak crash saat offline
  if (!e.request.url.startsWith(self.location.origin)) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      const fetchPromise = fetch(e.request).then((networkResponse) => {
        if (networkResponse.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        // Menangkap error jika benar-benar offline tanpa koneksi sama sekali
        console.log("Mode Offline Aktif untuk: " + e.request.url);
      });

      // Kembalikan response dari cache jika ada, jika tidak tunggu internet
      return cachedResponse || fetchPromise;
    })
  );
});

// Mendengar sinyal klik "Update" dari tombol UI untuk memaksa aktivasi kode baru
self.addEventListener('message', (e) => {
  if (e.data && e.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});