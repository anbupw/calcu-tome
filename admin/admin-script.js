// ==========================================
// 1. KONFIGURASI & IMPOR FIREBASE
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Tambahkan impor khusus Authentication di sini:
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyC1eCaQkeCf1IJQIDqveEKhHHFEYMd6bSs",
    authDomain: "kalkulator-tome.firebaseapp.com",
    projectId: "kalkulator-tome",
    storageBucket: "kalkulator-tome.firebasestorage.app",
    messagingSenderId: "794012581588",
    appId: "1:794012581588:web:021341eda428298daf0541"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // <-- Inisialisasi Auth

// ==========================================
// 2. LOGIKA LOGIN FIREBASE ASLI
// ==========================================
const loginOverlay = document.getElementById('loginOverlay');
const btnLoginAdmin = document.getElementById('btnLoginAdmin');
const btnLogout = document.getElementById('btnLogout'); // Pastikan tombol logout di HTML ada ID ini

// A. Pemantau Status Penjaga Pintu (onAuthStateChanged)
// Fungsi ini otomatis mengecek: "Apakah admin sedang login atau tidak?"
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Jika sudah login, sembunyikan layar hitam (Buka Pintu)
        loginOverlay.style.display = 'none';
    } else {
        // Jika belum login / sudah logout, munculkan layar hitam (Kunci Pintu)
        loginOverlay.style.display = 'flex';
    }
});

// B. Tombol Eksekusi Login
btnLoginAdmin.addEventListener('click', async () => {
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    if (email === "" || password === "") {
        alert("Email dan Password tidak boleh kosong!");
        return;
    }

    btnLoginAdmin.innerText = "Memeriksa...";
    btnLoginAdmin.disabled = true;

    try {
        // Mengetuk pintu server Firebase dengan email dan password
        await signInWithEmailAndPassword(auth, email, password);
        alert("Selamat datang, Komandan!");
        // (Tidak perlu manual menghilangkan overlay di sini, karena onAuthStateChanged di atas akan otomatis melakukannya)
    } catch (error) {
        console.error("Login Error:", error.code);
        alert("Akses Ditolak! Email atau Password salah.");
    } finally {
        btnLoginAdmin.innerText = "Masuk ke Dasbor";
        btnLoginAdmin.disabled = false;
    }
});

// C. Tombol Eksekusi Keluar (Logout)
btnLogout.addEventListener('click', async () => {
    try {
        await signOut(auth);
        alert("Anda telah berhasil keluar dari mode Admin.");
    } catch (error) {
        console.error("Logout Error:", error);
    }
});

// ==========================================
// 3. LOGIKA UPDATE PENGUMUMAN KE FIREBASE
// ==========================================
const btnSaveAnnouncement = document.getElementById('btnSaveAnnouncement');
const globalAnnouncement = document.getElementById('globalAnnouncement');

btnSaveAnnouncement.addEventListener('click', async () => {
    const teksPengumuman = globalAnnouncement.value;

    if (teksPengumuman.trim() === "") {
        alert("Teks pengumuman tidak boleh kosong!");
        return;
    }

    // Ubah tombol jadi status loading agar terlihat profesional
    btnSaveAnnouncement.innerText = "Mengirim...";
    btnSaveAnnouncement.disabled = true;

    try {
        // Menyimpan data teks ke Firestore di dalam dokumen 'global_settings'
        await setDoc(doc(db, "admin_data", "global_settings"), {
            bannerText: teksPengumuman,
            timestamp: new Date()
        }, { merge: true }); // merge: true agar data lain (seperti harga pasar) tidak ikut terhapus

        alert("Berhasil! Pengumuman sudah disebarkan ke seluruh pemain.");
        globalAnnouncement.value = ""; // Kosongkan kolom teks
        
    } catch (error) {
        console.error("Gagal mengirim pengumuman: ", error);
        alert("Terjadi kesalahan sistem.");
    } finally {
        // Kembalikan tombol seperti semula
        btnSaveAnnouncement.innerText = "Sebarkan Pengumuman";
        btnSaveAnnouncement.disabled = false;
    }
});

// ==========================================
// 4. LOGIKA UPDATE HARGA PASAR (MARKET PRICES)
// ==========================================
const btnSavePrice = document.getElementById('btnSavePrice');
const priceMystic = document.getElementById('priceMystic');
const priceFragment = document.getElementById('priceFragment');

btnSavePrice.addEventListener('click', async () => {
    // Ambil nilai angka dari inputan admin
    const mysticValue = parseInt(priceMystic.value);
    const fragmentValue = parseInt(priceFragment.value);

    // Validasi agar admin tidak memasukkan harga kosong atau minus
    if (isNaN(mysticValue) || isNaN(fragmentValue) || mysticValue < 0 || fragmentValue < 0) {
        alert("Mohon masukkan angka harga yang valid!");
        return;
    }

    // Ubah tombol jadi mode loading
    btnSavePrice.innerText = "Menyimpan Harga...";
    btnSavePrice.disabled = true;

    try {
        // Menyimpan harga ke Firestore di dalam dokumen 'market_prices'
        await setDoc(doc(db, "admin_data", "market_prices"), {
            mysticPagePrice: mysticValue,
            fragmentPrice: fragmentValue,
            lastUpdated: new Date()
        });

        alert("Harga pasar berhasil diperbarui! Seluruh kalkulator pemain akan menggunakan harga ini.");
        
    } catch (error) {
        console.error("Gagal mengupdate harga: ", error);
        alert("Terjadi kesalahan saat menyimpan harga.");
    } finally {
        // Kembalikan tombol
        btnSavePrice.innerText = "Update Harga Global";
        btnSavePrice.disabled = false;
    }
});


// ==========================================
// 5. LOGIKA REFRESH STATISTIK PENGGUNA
// ==========================================
// Membutuhkan fungsi tambahan dari Firebase Firestore
import { collection, getCountFromServer, getDocs } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const btnRefreshStats = document.getElementById('btnRefreshStats');
const statUsers = document.getElementById('statUsers');
const statTopTome = document.getElementById('statTopTome');

btnRefreshStats.addEventListener('click', async () => {
    btnRefreshStats.innerText = "Memuat data...";
    btnRefreshStats.disabled = true;

    try {
        // 1. Menghitung total user (Misal dari koleksi 'users' di database Anda)
        // Catatan: Pastikan Anda punya koleksi 'users' nanti.
        const usersCollection = collection(db, "users");
        const snapshot = await getCountFromServer(usersCollection);
        const totalUsers = snapshot.data().count;
        
        statUsers.innerText = totalUsers;

        // 2. Simulasi mengambil data Tome terpopuler
        // Nanti bisa diganti dengan query asli yang menghitung Tome target pemain
        statTopTome.innerText = "Tome Pan Gu (Simulasi)";
        statTopTome.style.color = "#00ff00";

    } catch (error) {
        console.error("Gagal mengambil statistik: ", error);
        statUsers.innerText = "Error";
        statTopTome.innerText = "Error";
    } finally {
        btnRefreshStats.innerText = "Segarkan Data";
        btnRefreshStats.disabled = false;
    }
});