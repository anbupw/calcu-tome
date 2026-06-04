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
	loadTomeManager();
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

// ==========================================
// 🛠️ FUNGSI TOME MANAGER (EDITOR DATABASE)
// ==========================================

function loadTomeManager() {
    db.collection("tomes").onSnapshot((snap) => {
        const tbody = document.getElementById('tomeTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        if (snap.empty) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 20px;">
                        <div style="color: #94a3b8; margin-bottom:10px;">Database Tome saat ini kosong.</div>
                        <button onclick="migrateOldTomeDB()" style="background: #f59e0b; color: #000; border: none; padding: 8px 15px; border-radius: 6px; font-weight: bold; cursor: pointer;">
                            ⚡ Impor Data Lama (Migrasi)
                        </button>
                    </td>
                </tr>`;
            return;
        }

        // Urutkan data berdasarkan ID secara manual
        let tomes = [];
        snap.forEach(doc => tomes.push(doc.data()));
        tomes.sort((a, b) => a.id - b.id);

        tomes.forEach((data) => {
            const level = String(data.id).charAt(0); // Level diambil dari digit pertama ID
            
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid #334155';
            
            tr.innerHTML = `
                <td style="padding: 10px; color:#3b82f6; font-weight:bold;">${data.id}</td>
                <td style="padding: 10px;">
                    <span style="color:#f8fafc; font-weight:bold;">${data.name}</span><br>
                    <span style="color:#64748b; font-size:0.7rem;">Item ID: ${data.gameId}</span>
                </td>
                <td style="padding: 10px; text-align: center;">
                    <span style="background: rgba(245, 158, 11, 0.2); color: #f59e0b; padding: 3px 8px; border-radius: 4px; font-size:0.75rem; font-weight:bold;">Lv ${level}</span>
                </td>
                <td style="padding: 10px; text-align: center;">
                    <button onclick="openTomeModal(${data.id})" style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor:pointer; font-size:0.75rem; font-weight:bold;">✏️ Edit</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    });
}

// Buka Modal Edit/Tambah
window.openTomeModal = function(tomeId) {
    document.getElementById('tomeModal').style.display = 'flex';
    
    if (tomeId === 'NEW') {
        document.getElementById('tomeModalTitle').innerText = "✨ Tambah Buku Baru";
        document.getElementById('tomeEditId').readOnly = false;
        document.getElementById('tomeEditId').value = "";
        document.getElementById('tomeEditGameId').value = "";
        document.getElementById('tomeEditName').value = "";
        document.getElementById('tomeReq1').value = "0";
        document.getElementById('tomeReq2').value = "0";
        document.getElementById('tomeReq3').value = "0";
    } else {
        document.getElementById('tomeModalTitle').innerText = `📘 Edit Buku (ID: ${tomeId})`;
        document.getElementById('tomeEditId').readOnly = true;
        
        db.collection("tomes").doc(String(tomeId)).get().then(doc => {
            if (doc.exists) {
                const d = doc.data();
                document.getElementById('tomeEditId').value = d.id;
                document.getElementById('tomeEditGameId').value = d.gameId;
                document.getElementById('tomeEditName').value = d.name;
                document.getElementById('tomeReq1').value = d.req[0];
                document.getElementById('tomeReq2').value = d.req[1];
                document.getElementById('tomeReq3').value = d.req[2];
            }
        });
    }
};

// Simpan Data ke Firebase
window.saveTomeData = function() {
    const id = document.getElementById('tomeEditId').value;
    const gameId = document.getElementById('tomeEditGameId').value;
    const name = document.getElementById('tomeEditName').value;
    const req1 = parseInt(document.getElementById('tomeReq1').value) || 0;
    const req2 = parseInt(document.getElementById('tomeReq2').value) || 0;
    const req3 = parseInt(document.getElementById('tomeReq3').value) || 0;

    if (!id || !name) return alert("ID dan Nama Buku tidak boleh kosong!");

    const tomeData = {
        id: parseInt(id),
        gameId: parseInt(gameId),
        name: name,
        req: [req1, req2, req3]
    };

    db.collection("tomes").doc(String(id)).set(tomeData)
      .then(() => {
          document.getElementById('tomeModal').style.display = 'none';
      })
      .catch(err => alert("Gagal menyimpan: " + err.message));
};

// ⚡ FUNGSI MIGRASI OTOMATIS (Satu Kali Pakai)
window.migrateOldTomeDB = function() {
    if (!confirm("Proses ini akan mengimpor seluruh data dari Array lama Anda ke Firebase. Lanjutkan?")) return;
    
    // Ini adalah data asli milik Anda
    const TOME_DB = [];
    TOME_DB[601]=[501,502,509,17615,'The Calm of Ice']; TOME_DB[602]=[502,503,505,17622,'The Khatru']; TOME_DB[603]=[504,503,508,17628,'A Carmine Tear']; TOME_DB[604]=[503,508,501,17630,'The Fruit of Intense Labor']; TOME_DB[605]=[505,512,509,17634,'Tomorrows Phoenix']; TOME_DB[606]=[505,506,507,17636,'Riding the Scree']; TOME_DB[607]=[513,514,507,17642,'Turning the Tide']; TOME_DB[608]=[508,506,514,17649,'Existential Woe']; TOME_DB[609]=[510,501,505,17655,'Book of Fragrances']; TOME_DB[610]=[510,506,501,17657,'Bouquet of Regrets']; TOME_DB[611]=[511,509,505,17661,'The Union']; TOME_DB[612]=[511,513,503,17663,'Oblivious Enlightenment']; TOME_DB[613]=[513,507,514,17669,'As the Universe Fades']; TOME_DB[614]=[514,512,513,17676,'The Concubines Laugh']; TOME_DB[615]=[515,501,507,17679,'The Academy of the East']; TOME_DB[616]=[516,515,514,17683,'Pan Gu Creator'];
    TOME_DB[501]=[401,408,405,17618,'A Heart like Still Water']; TOME_DB[502]=[409,405,403,17621,'The Tsunamis of Yore']; TOME_DB[503]=[404,408,401,17624,'Laughing Mad']; TOME_DB[504]=[408,404,401,17627,'The Book of Congratulations']; TOME_DB[505]=[403,409,404,17633,'The Wrath of Heaven']; TOME_DB[506]=[409,403,402,17639,'A Strange Kindness']; TOME_DB[507]=[402,404,409,17645,'Flesh of the Lamia']; TOME_DB[508]=[404,408,402,17648,'Everything is Emptiness']; TOME_DB[509]=[403,401,405,17651,'The Oasis Remembered']; TOME_DB[510]=[401,405,407,17654,'The Heavenly Scent']; TOME_DB[511]=[403,409,404,17660,'Debt and Tombstones']; TOME_DB[512]=[409,403,404,17666,'Endless Waves']; TOME_DB[513]=[408,402,404,17672,'Parting Grief']; TOME_DB[514]=[408,402,404,17675,'Rouge and Red Lips']; TOME_DB[515]=[406,407,401,17678,'Gang of Hooligans']; TOME_DB[516]=[406,407,402,17682,'The Voidlands'];
    TOME_DB[401]=[303,307,304,17602,'Burning Desire']; TOME_DB[402]=[304,301,305,17603,'Tome of Predestination']; TOME_DB[403]=[302,305,303,17604,'The Roses Thorn']; TOME_DB[404]=[306,307,301,17605,'Letters of Social Unrest']; TOME_DB[405]=[303,307,306,17606,'The Appetites of Spring']; TOME_DB[406]=[308,305,307,17610,'The Rivers Edge']; TOME_DB[407]=[309,302,306,17614,'The Weak Stream of Many Miles']; TOME_DB[408]=[301,304,302,17600,'Battle Tactics']; TOME_DB[409]=[302,305,303,17601,'A Bewitching Proposal'];
    TOME_DB[301]=[201,206,203,17593,'Eat Drink and be Merry']; TOME_DB[302]=[202,205,206,17594,'Sunset Tales']; TOME_DB[303]=[207,203,202,17595,'Adventures and Mishaps']; TOME_DB[304]=[204,201,203,17596,'The Sunny Pass']; TOME_DB[305]=[205,202,201,17597,'Tales of Beauty']; TOME_DB[306]=[206,203,201,17598,'The Bards Wanderlust']; TOME_DB[307]=[207,205,204,17599,'A Poets Musings']; TOME_DB[308]=[208,202,204,17609,'Decaying Tome']; TOME_DB[309]=[209,203,202,17613,'Scene of Carnage'];
    TOME_DB[201]=[101,104,106,17586,'Tome of Iron Will']; TOME_DB[202]=[102,105,106,17587,'Misty Peach Blossoms']; TOME_DB[203]=[107,103,102,17588,'Tale of the Red Lotus']; TOME_DB[204]=[101,104,103,17589,'Tale of the Dolt']; TOME_DB[205]=[102,105,107,17590,'Tale of the Peach Fan']; TOME_DB[206]=[106,101,103,17591,'Story of the Blockade']; TOME_DB[207]=[107,103,104,17592,'Mediations Flame']; TOME_DB[208]=[108,103,101,17608,'Guide to Wolf Hunting']; TOME_DB[209]=[109,103,107,17612,'Fire Dance'];
    TOME_DB[101]=[0,0,0,17579,'Underestimated Resolve']; TOME_DB[102]=[0,0,0,17580,'Soaring Heart']; TOME_DB[103]=[0,0,0,17581,'Retributions Flame']; TOME_DB[104]=[0,0,0,17582,'Tome of the River Spirits']; TOME_DB[105]=[0,0,0,17583,'Flankers Tome']; TOME_DB[106]=[0,0,0,17584,'Tome of Hyperbolic Boasts']; TOME_DB[107]=[0,0,0,17585,'Tome of Grace']; TOME_DB[108]=[0,0,0,17607,'A Flowerless Plant']; TOME_DB[109]=[0,0,0,17611,'Eternitys Moon'];

    const batch = db.batch();
    
    TOME_DB.forEach((item, index) => {
        if (item) {
            const docRef = db.collection("tomes").doc(String(index));
            batch.set(docRef, {
                id: index,
                req: [item[0], item[1], item[2]],
                gameId: item[3],
                name: item[4]
            });
        }
    });

    batch.commit().then(() => {
        alert("✅ BINGO! Semua data Tome berhasil dipindahkan ke Database!");
    }).catch(err => alert("Gagal migrasi: " + err.message));
};

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