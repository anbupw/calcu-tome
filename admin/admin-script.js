<script>
    // MASUKKAN KONFIGURASI FIREBASE ASLI ANDA DI SINI
    const firebaseConfig = {
        apiKey: "AIzaSyC1eCaQkeCf1IJQIDqveEKhHHFEYMd6bSs",
		authDomain: "kalkulator-tome.firebaseapp.com",
		projectId: "kalkulator-tome",
		storageBucket: "kalkulator-tome.firebasestorage.app",
		messagingSenderId: "794012581588",
		appId: "1:794012581588:web:021341eda428298daf0541"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.firestore();
    const auth = firebase.auth();

    // 📡 CEK STATUS LOGIN SECARA REAL-TIME
    auth.onAuthStateChanged((user) => {
        if (user) {
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('adminSection').style.display = 'block';
            document.getElementById('adminEmailTxt').innerText = user.email;
            loadCurrentData(); // Muat data lama ke input box (Auto-Fill)
        } else {
            document.getElementById('loginSection').style.display = 'block';
            document.getElementById('adminSection').style.display = 'none';
        }
    });

    // Fungsi Login
    function loginAdmin() {
        const email = document.getElementById('loginEmail').value;
        const pass = document.getElementById('loginPassword').value;
        auth.signInWithEmailAndPassword(email, pass)
            .catch(err => alert("Gagal Masuk: " + err.message));
    }

    // Fungsi Logout
    function logoutAdmin() {
        auth.signOut();
    }

    // 🔄 AUTO-FILL: Mengambil data aktif dari Firebase agar input form tidak kosong
    function loadCurrentData() {
        db.collection("admin_data").doc("global_settings").get().then((doc) => {
            if (doc.exists && doc.data().bannerText) {
                document.getElementById('inputBannerAdmin').value = doc.data().bannerText;
            }
        });
        db.collection("admin_data").doc("market_prices").get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                if (data.mysticPagePrice) document.getElementById('inputPagePriceAdmin').value = data.mysticPagePrice;
                if (data.fragmentPrice) document.getElementById('inputFragPriceAdmin').value = data.fragmentPrice;
            }
        });
    }

    // Fungsi menyimpan data Banner
    function saveAdminBanner() {
        const textTxt = document.getElementById('inputBannerAdmin').value;
        db.collection("admin_data").doc("global_settings").set({
            bannerText: textTxt
        }, { merge: true })
        .then(() => alert("Banner pengumuman berhasil diperbarui!"))
        .catch(err => alert("Gagal: " + err.message));
    }

    // Fungsi menyimpan data Harga Pasar Global
    function saveAdminPrices() {
        const pagePrice = parseInt(document.getElementById('inputPagePriceAdmin').value) || 0;
        const fragPrice = parseInt(document.getElementById('inputFragPriceAdmin').value) || 0;
        
        db.collection("admin_data").doc("market_prices").set({
            mysticPagePrice: pagePrice,
            fragmentPrice: fragPrice
        }, { merge: true })
        .then(() => alert("Harga pasar global berhasil diperbarui!"))
        .catch(err => alert("Gagal: " + err.message));
    }
</script>