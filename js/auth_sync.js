// ==================== AUTH WALL ====================
let currentUser = null;
let isDataLoaded = false; 
let banListener = null;

auth.onAuthStateChanged(user => {
    currentUser = user;
    const loginOverlay = document.getElementById('loginOverlay');
    const appContent = document.getElementById('appContent');
    const accountSection = document.getElementById('userAccountSection');
    
    if (user) {
        if (loginOverlay) loginOverlay.style.display = 'none';
        if (appContent) appContent.style.display = 'block';
        
        if (accountSection) {
            accountSection.innerHTML = `
                <img src="${user.photoURL || 'https://via.placeholder.com/48'}" class="user-profile-img" alt="Avatar">
                <div style="font-size:0.95rem; font-weight:600; color:white; margin-bottom:2px;">${user.displayName}</div>
                <div style="font-size:0.75rem; color:var(--success); display:flex; align-items:center; justify-content:center; gap:6px; font-weight:500; margin-bottom: 10px;">
                    <span style="display:inline-block; width:6px; height:6px; background:var(--success); border-radius:50%; box-shadow:0 0 6px var(--success);"></span> 
                    Cloud Sync Aktif
                </div>
                <button class="btn-danger" style="padding: 6px 14px; font-size: 0.75rem; width: auto; border-radius:6px; font-weight:600;" onclick="logoutGoogle()">
                    <i class="fas fa-sign-out-alt"></i> Keluar
                </button>
            `;
        }
        
        loadFromCloud(user.uid);
        listenGlobalChat();
        
        if (window.db) {
            window.db.collection("users").doc(user.uid).set({
                email: user.email,
                displayName: user.displayName || "Pemain Anonim",
                photoURL: user.photoURL || ""
            }, { merge: true }).catch(err => console.error("Gagal simpan profil:", err));
        }
		
        if (window.db) {
            banListener = window.db.collection("users").doc(user.uid).onSnapshot((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    if (userData.isBanned === true) {
                        alert("🚨 PERINGATAN SISTEM: Akun Anda telah di-banned oleh Admin karena pelanggaran! Anda dikeluarkan secara paksa.");
                        
                        auth.signOut().then(() => {
                            window.location.reload();
                        });
                    }
                }
            }, (error) => {
                console.error("Gagal memantau status ban:", error);
            });
        }
        
    } else {
        if (loginOverlay) loginOverlay.style.display = 'flex';
        if (appContent) appContent.style.display = 'none';
        
        if (accountSection) accountSection.innerHTML = '';
        
        unsubscribeGlobalChat();
        
        if (banListener) {
            banListener();
            banListener = null;
        }
    }
});

function loginGoogle() {
    auth.signInWithPopup(provider)
        .then(() => {
        })
        .catch(err => {
            console.error("Gagal melakukan autentikasi:", err);
            alert("Gagal masuk menggunakan Google. Silakan coba kembali.");
        });
}

function logoutGoogle() {
    if (confirm("Apakah Anda yakin ingin keluar dari aplikasi?")) {
        auth.signOut().then(() => {
            toggleMenu();
        });
    }
}

function saveDataTrigger() {
    if (!isDataLoaded) return;
    
    let p10 = Math.max(0, parseInt(document.getElementById('price10').value) || 0); 
    let p11 = Math.max(0, parseInt(document.getElementById('price11').value) || 0); 
    let p12 = Math.max(0, parseInt(document.getElementById('price12').value) || 0); 
    let m = Math.max(1, parseInt(document.getElementById('mnojitel').value) || 1);
    
    const compD = {}; 
    deductions.forEach((val, idx) => { if (val > 0) compD[idx] = val; });
    
    let state = { 
        r: rightTreeId,
        m: m, 
        d: compD,
        p10: p10, 
        p11: p11, 
        p12: p12 
    };
    
    try { localStorage.setItem('tomeCalculatorState', JSON.stringify(state)); } catch(e){}
    
    if (currentUser) {

        db.collection("users").doc(currentUser.uid).update({
            calculatorState: state,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }).catch(e => console.warn("Cloud save error:", e));
    }
}

function loadFromLocalStorage() {
    let savedData = localStorage.getItem('tomeCalculatorState');
    if (savedData) {
        try {
            let state = JSON.parse(savedData);
            parseStateToUI(state);
        } catch(e) { deductions = []; }
    }
}

function loadFromCloud(uid) {
    db.collection("users").doc(uid).get().then(doc => {
        if (doc.exists && doc.data().calculatorState) {
            parseStateToUI(doc.data().calculatorState);
        } else {
            let savedData = localStorage.getItem('tomeCalculatorState');
            if (savedData) {
                try {
                    let state = JSON.parse(savedData);
                    parseStateToUI(state);
					
					isDataLoaded = true;
                    saveDataTrigger();
                } catch(e){}
            }
        }
		isDataLoaded = true;
        applyLanguage();
    }).catch(err => {
        console.error("Gagal sinkronisasi cloud, fallback ke lokal:", err);
        loadFromLocalStorage();
        
		isDataLoaded = true;
		applyLanguage();
    });
}

function parseStateToUI(state) {
    if (!state) return;

    if (document.getElementById('price10')) document.getElementById('price10').value = state.p10 || 0;
    if (document.getElementById('price11')) document.getElementById('price11').value = state.p11 || 0;
    if (document.getElementById('price12')) document.getElementById('price12').value = state.p12 || 0;
    if (document.getElementById('mnojitel')) document.getElementById('mnojitel').value = state.m || 1;

    if (state.r) {
        rightTreeId = state.r;
    } else {
        rightTreeId = 101;
    }

    for (let i = 0; i < deductions.length; i++) {
        deductions[i] = 0;
    }
    
    if (state.d) {
        for (let idx in state.d) {
            deductions[parseInt(idx)] = parseInt(state.d[idx]) || 0;
        }
    }

    if (typeof processTree === 'function') {
        processTree(rightTreeId);
    }
}