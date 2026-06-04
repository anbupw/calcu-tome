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
	loadLiveChatModeration();
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
        tbody.innerHTML = '';

        if (snap.empty) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 20px; color:#94a3b8;">Belum ada pemain yang mendaftar.</td></tr>';
            return;
        }

        snap.forEach((doc) => {
            const data = doc.data();
            const userId = doc.id;
            const email = data.email || 'Email tidak diketahui';
            const namaGamer = data.displayName || 'Pemain Google';
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

// ==========================================
// 💬 FUNGSI MODERASI CHAT GLOBAL
// ==========================================

function loadLiveChatModeration() {
    // Kita ambil 50 pesan terakhir, diurutkan dari yang terbaru
    db.collection("global_chats").orderBy("timestamp", "desc").limit(50).onSnapshot((snap) => {
        const streamContainer = document.getElementById('adminChatStream');
        if (!streamContainer) return;
        streamContainer.innerHTML = ''; // Bersihkan kontainer

        if (snap.empty) {
            streamContainer.innerHTML = '<div style="text-align: center; color: #94a3b8; padding: 20px;"><i>Belum ada pesan di Global Chat.</i></div>';
            return;
        }

        snap.forEach((doc) => {
            const data = doc.data();
            const chatId = doc.id;
            
            // Asumsi field standar: displayName, uid, text, timestamp
            const senderName = data.displayName || data.senderName || 'Pemain Anonim';
            const senderId = data.uid || data.userId || '';
            const message = data.text || data.message || '(Pesan Kosong)';
            
            // Format waktu menjadi Jam:Menit yang rapi
            let timeString = '-';
            if (data.timestamp) {
                const date = data.timestamp.toDate ? data.timestamp.toDate() : new Date(data.timestamp);
                timeString = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            }

            // Buat gelembung chat
            const chatDiv = document.createElement('div');
            chatDiv.style.background = '#1e293b';
            chatDiv.style.padding = '12px';
            chatDiv.style.borderRadius = '8px';
            chatDiv.style.borderLeft = '4px solid #3b82f6'; // Garis penanda
            chatDiv.style.display = 'flex';
            chatDiv.style.justifyContent = 'space-between';
            chatDiv.style.alignItems = 'flex-start';
            chatDiv.style.gap = '10px';

            chatDiv.innerHTML = `
                <div style="flex: 1; word-break: break-word;">
                    <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 4px;">
                        <strong style="color: #3b82f6; font-size: 0.95rem;">${senderName}</strong>
                        <span style="color: #64748b; font-size: 0.75rem;">${timeString}</span>
                    </div>
                    <div style="color: #f8fafc; font-size: 0.9rem; line-height: 1.4;">
                        ${message}
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 6px; min-width: 80px;">
                    <button onclick="deleteChatMessage('${chatId}')" style="background: #ef4444; color: white; border: none; padding: 6px 8px; border-radius: 6px; font-size: 0.75rem; cursor: pointer; font-weight: bold; width: 100%;">🗑️ Hapus</button>
                    ${senderId ? `<button onclick="banFromChat('${senderId}')" style="background: #f59e0b; color: white; border: none; padding: 6px 8px; border-radius: 6px; font-size: 0.75rem; cursor: pointer; font-weight: bold; width: 100%;">🔨 Ban Akun</button>` : ''}
                </div>
            `;
            streamContainer.appendChild(chatDiv);
        });
    });
}

// 🗑️ Fungsi Menghapus Pesan
window.deleteChatMessage = function(chatId) {
    if (confirm("Hapus pesan ini secara permanen dari pandangan semua pemain?")) {
        db.collection("global_chats").doc(chatId).delete()
          .catch(err => alert("Gagal menghapus pesan: " + err.message));
    }
};

// 🔨 Fungsi Ban User Cepat via Chat
window.banFromChat = function(userId) {
    // Kita panggil ulang fungsi toggleBan yang sudah kita buat sebelumnya!
    // Flag 'false' karena diasumsikan akun tersebut sedang aktif dan akan di-ban
    window.toggleBan(userId, false);
};

window.viewInventory = function(userId) {
    document.getElementById('godEyeModal').style.display = 'flex';
    document.getElementById('godEyeTitle').innerText = `🎒 Mengintip Tas Player`;
    document.getElementById('godEyeContent').innerHTML = '<span style="color:#94a3b8;">Menggali database...</span>';

    db.collection("users").doc(userId).get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            
            const inventory = (data.calculatorState && data.calculatorState.d) ? data.calculatorState.d : null;
            
            let html = '<ul style="list-style: none; padding: 0; margin: 0;">';
            let hasItems = false;
            
            if (inventory && typeof inventory === 'object') {
                for (const [itemId, count] of Object.entries(inventory)) {
                    if (count > 0) {
                        hasItems = true;
                        
                        let itemName = `Tome ID [${itemId}]`;
                        if (itemId === "12") itemName = "Tome Page 📄";
                        if (itemId === "11") itemName = "Tome Fragment 🧩";
                        if (itemId === "10") itemName = "Token of Luck 🪙";
                        
                        html += `<li style="margin-bottom:8px; border-bottom: 1px dashed #334155; padding-bottom: 4px; font-size:0.95rem;">
                                    ${itemName}: <strong style="color:#f59e0b; float:right;">${count}x</strong>
                                 </li>`;
                    }
                }
            }
            html += '</ul>';
            
            if (!hasItems) {
                html = '<div style="text-align:center; color:#94a3b8; padding: 10px;"><i>Tas pemain ini kosong melompong.</i></div>';
            }
            
            document.getElementById('godEyeContent').innerHTML = html;
        } else {
            document.getElementById('godEyeContent').innerHTML = '<div style="text-align:center; color:#94a3b8;"><i>Pemain belum memiliki dokumen di database.</i></div>';
        }
    }).catch(err => {
        document.getElementById('godEyeContent').innerHTML = `<span style="color:#ef4444;">Gagal mengambil data: ${err.message}</span>`;
        console.error("Error God Eye:", err);
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