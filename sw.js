const CACHE_NAME = 'Anbu-v2';

const assetsToCache = [
  './',
  './index.html',
  './style.css',
  './img/icon-192.png',
  './img/icon-512.png',
  './js/firebase-config.js',
  './js/db_stats.js',
  './js/db_tome.js',
  './js/lang.js'
];

// 2. Tahap Install yang Pintar (Mendeteksi file yang rusak/404)
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Menggunakan map agar kita bisa menangkap (catch) file mana yang gagal di-fetch
      return Promise.all(
        assetsToCache.map((url) => {
          return cache.add(url).catch((err) => {
            console.error(`❌ PWA gagal menyimpan file ini ke cache (Kemungkinan 404/Salah Jalur): ${url}`, err);
          });
        })
      );
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