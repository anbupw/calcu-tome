const CACHE_NAME = 'Anbu-v3';

// Daftar aset utama yang wajib diakses secara offline
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

// 1. Tahap Install: Amankan semua aset statis ke penyimpanan lokal browser
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
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

// 2. Tahap Aktivasi: Bersihkan cache versi lama
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Tahap Fetch: Strategi Pintar Offline (Mencegah Error "Response body is already used")
self.addEventListener('fetch', (e) => {
  // Abaikan request ke database Firebase / API Cloud agar tidak merusak sistem auth/live data saat offline
  if (!e.request.url.startsWith(self.location.origin)) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      
      // Ambil data terbaru dari internet di latar belakang untuk memperbarui cache
      const fetchPromise = fetch(e.request).then((networkResponse) => {
        // VALIDASI: Pastikan respons valid sebelum disimpan
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // PENTING: Lakukan .clone() SEBELUM data tersebut dikembalikan ke browser!
        const responseToCache = networkResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Berhasil meredam error jika pengguna benar-benar offline tanpa internet
        console.log("Mode Offline Aktif untuk asset: " + e.request.url);
      });

      // Jika file ada di cache local, langsung tampilkan (cepat/instan). 
      // Jika tidak ada (misal file baru), tunggu hasil download internet.
      return cachedResponse || fetchPromise;
    })
  );
});

// Mendengarkan sinyal dari tombol "Update Versi Baru Tersedia!" di UI pengaturan Anda
self.addEventListener('message', (e) => {
  if (e.data && e.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});