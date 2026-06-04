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

auth.onAuthStateChanged((user) => {
    if (user) {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('adminSection').style.display = 'block';
        document.getElementById('adminEmailTxt').innerText = user.email;
        loadCurrentData();
    } else {
        document.getElementById('loginSection').style.display = 'block';
        document.getElementById('adminSection').style.display = 'none';
    }
});

function loginAdmin() {
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPassword').value;
    auth.signInWithEmailAndPassword(email, pass)
        .catch(err => alert("Gagal Masuk: " + err.message));
}

function logoutAdmin() {
    auth.signOut();
}

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
    
    loadStatistics();
	loadPlayerCRM();
}

function saveAdminBanner() {
    const textTxt = document.getElementById('inputBannerAdmin').value;
    db.collection("admin_data").doc("global_settings").set({
        bannerText: textTxt
    }, { merge: true })
    .then(() => alert("Banner pengumuman berhasil diperbarui!"))
    .catch(err => alert("Gagal: " + err.message));
}

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

function loadStatistics() {
    db.collection("users").get().then((snap) => {
        document.getElementById('statUsers').innerText = snap.size;
    });

    db.collection("admin_data").doc("statistics").onSnapshot((doc) => {
        if (doc.exists) {
            const data = doc.data();
            
            document.getElementById('statSimulations').innerText = data.totalCalculations || 0;
            
            if (data.tomeCounter) {
                let topTome = "-";
                let maxCount = 0;
                for (const [name, count] of Object.entries(data.tomeCounter)) {
                    if (count > maxCount) {
                        maxCount = count;
                        topTome = name;
                    }
                }
                document.getElementById('statTopTome').innerText = `${topTome} (${maxCount}x)`;
            }
        }
    }); 
}

function loadPlayerCRM() {
    db.collection("users").onSnapshot((snap) => {
        const tbody = document.getElementById('playerTableBody');
        if (!tbody) return;
        tbody.innerHTML = ''; // Bersihkan isi tabel

        if (snap.empty) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 20px; color:#94a3b8;">Belum ada pemain yang mendaftar.</td></tr>';
            return;
        }

        snap.forEach((doc) => {
            const data = doc.data();
            const userId = doc.id;
            const email = data.email || 'Google Player';
            const isBanned = data.isBanned || false;
            
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid #334155';
            tr.style.background = isBanned ? 'rgba(239, 68, 68, 0.05)' : 'transparent'; // Beri warna merah tipis jika dibanned
            
            tr.innerHTML = `
                <td style="padding: 10px; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    <strong style="color: #3b82f6; display: block; overflow: hidden; text-overflow: ellipsis;">${email}</strong>
                    <span style="color: #64748b; font-size: 0.75rem;">ID: ${userId.substring(0, 8)}...</span>
                </td>
                <td style="padding: 10px; text-align: center; vertical-align: middle;">
                    ${isBanned ? '<span style="color: #ef4444; font-weight:bold; font-size: 0.75rem; background: rgba(239,68,68,0.1); padding: 3px 6px; border-radius: 4px;">BANNED</span>' : '<span style="color: #10b981; font-weight:bold; font-size: 0.75rem; background: rgba(16,185,129,0.1); padding: 3px 6px; border-radius: 4px;">AKTIF</span>'}
                </td>
                <td style="padding: 10px; vertical-align: middle;">
                    <!-- FLEXBOX CONTAINER: Otomatis tersusun vertikal di layar HP cerdas -->
                    <div style="display: flex; gap: 6px; justify-content: center; flex-wrap: wrap;">
                        <button onclick="viewInventory('${userId}')" style="background: #f59e0b; color: #fff; border: none; padding: 6px 10px; border-radius: 6px; font-size: 0.75rem; cursor: pointer; font-weight: 600; flex: 1; min-width: 65px; text-align: center;">👁️ Intip</button>
                        <button onclick="toggleBan('${userId}', ${isBanned})" style="background: ${isBanned ? '#10b981' : '#ef4444'}; color: #fff; border: none; padding: 6px 10px; border-radius: 6px; font-size: 0.75rem; cursor: pointer; font-weight: 600; flex: 1; min-width: 65px; text-align: center;">
                            ${isBanned ? 'UNBAN' : 'BAN'}
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    });
}

window.viewInventory = function(userId) {
    document.getElementById('godEyeModal').style.display = 'flex';
    document.getElementById('godEyeTitle').innerText = `🎒 Mengintip Tas Player`;
    document.getElementById('godEyeContent').innerHTML = '<span style="color:#94a3b8;">Menggali database...</span>';

    db.collection("users").doc(userId).get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            const inventory = data.inventory || {};
            let html = '<ul style="list-style: none; padding: 0; margin: 0;">';
            let hasItems = false;
            
            for (const [itemId, count] of Object.entries(inventory)) {
                if (count > 0) {
                    hasItems = true;
                    let itemName = `Tome ID [${itemId}]`;
                    if(itemId == "12") itemName = "Tome Page";
                    if(itemId == "11") itemName = "Tome Fragment";
                    if(itemId == "10") itemName = "Token of Luck";
                    
                    html += `<li style="margin-bottom:8px; border-bottom: 1px dashed #334155; padding-bottom: 4px;">
                                ${itemName}: <strong style="color:#f59e0b; float:right;">${count}x</strong>
                             </li>`;
                }
            }
            html += '</ul>';
            
            if (!hasItems) html = '<div style="text-align:center; color:#94a3b8;"><i>Tas pemain ini kosong melompong.</i></div>';
            document.getElementById('godEyeContent').innerHTML = html;
        } else {
            document.getElementById('godEyeContent').innerHTML = '<i>Pemain belum menyimpan data inventory.</i>';
        }
    }).catch(err => {
        document.getElementById('godEyeContent').innerHTML = `<span style="color:red;">Gagal: ${err.message}</span>`;
    });
};

window.toggleBan = function(userId, currentStatus) {
    const confirmMsg = currentStatus 
        ? "Apakah Anda yakin ingin memulihkan (UNBAN) pemain ini?" 
        : "BANNED pemain ini? Data mereka akan ditandai sebagai pelanggar.";
        
    if (confirm(confirmMsg)) {
        db.collection("users").doc(userId).set({ isBanned: !currentStatus }, { merge: true })
          .catch(err => alert("Gagal update status: " + err.message));
    }
};