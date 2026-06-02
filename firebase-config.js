// firebase-config.js
// Konfigurasi Firebase Absolut & Inisialisasi Global

const firebaseConfig = {
    apiKey: "AIzaSyC1eCaQkeCf1IJQIDqveEKhHHFEYMd6bSs",
    authDomain: "kalkulator-tome.firebaseapp.com",
    projectId: "kalkulator-tome",
    storageBucket: "kalkulator-tome.firebasestorage.app",
    messagingSenderId: "794012581588",
    appId: "1:794012581588:web:021341eda428298daf0541"
};

// Inisialisasi Firebase menggunakan mode Compat v10
firebase.initializeApp(firebaseConfig);

// Deklarasi variabel global agar langsung dikenali oleh script.js
const auth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();