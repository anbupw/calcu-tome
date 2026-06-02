// ==================== INITIALIZATION & FIREBASE AUTH WALL ====================
let currentUser = null;

// GERBANG MONITOR STATUS LOG-IN REALTIME
auth.onAuthStateChanged(user => {
    currentUser = user;
    const loginOverlay = document.getElementById('loginOverlay');
    const appContent = document.getElementById('appContent');
    const accountSection = document.getElementById('userAccountSection');
    
    if (user) {
        // Jika sukses Login -> Buka Aplikasi & Sembunyikan Layar Kunci
        if (loginOverlay) loginOverlay.style.display = 'none';
        if (appContent) appContent.style.display = 'block';
        
        // Tampilkan info Akun di panel gear pengaturan
        if (accountSection) {
            accountSection.innerHTML = `
                <img src="${user.photoURL || 'https://via.placeholder.com/48'}" class="user-profile-img" alt="Avatar">
                <div style="font-size:0.95rem; font-weight:600; color:white; margin-bottom:2px;">${user.displayName}</div>
                <div style="font-size:0.75rem; color:var(--success); display:flex; align-items:center; justify-content:center; gap:6px; font-weight:500; margin-bottom: 10px;">
                    <span style="display:inline-block; width:6px; height:6px; background:var(--success); border-radius:50%; box-shadow:0 0 6px var(--success);"></span> 
                    Cloud Sync Aktif
                </div>
                <button class="btn-danger" style="padding: 6px 14px; font-size: 0.75rem; width: auto; border-radius:6px; font-weight:600;" onclick="logoutGoogle()">
                	<i class="fas fa-sign-out-alt"></i> Keluar Akun
                </button>
            `;
        }
        
        loadFromCloud(user.uid);
        
    } else {
        // Jika belum Login / Keluar Akun -> Kunci Aplikasi & Paksa Layar Login Muncul
        if (loginOverlay) loginOverlay.style.display = 'flex';
        if (appContent) appContent.style.display = 'none';
        
        if (accountSection) accountSection.innerHTML = ''; // Kosongkan saat logout
    }
});

// FUNGSI TOMBOL LOGIN
function loginGoogle() {
    auth.signInWithPopup(provider)
        .then(() => {
            // Berhasil, UI otomatis ditangani oleh onAuthStateChanged
        })
        .catch(err => {
            console.error("Gagal melakukan autentikasi:", err);
            alert("Gagal masuk menggunakan Google. Silakan coba kembali.");
        });
}

// FUNGSI TOMBOL LOGOUT
function logoutGoogle() {
    if (confirm("Apakah Anda yakin ingin keluar dari aplikasi?")) {
        auth.signOut().then(() => {
            // UI otomatis mengunci layar setelah logout selesai
            toggleMenu(); // tutup panel jika terbuka
        });
    }
}

// ==================== LOGIKA BAWAAN APLIKASI ====================

const LANG = {
	id: { 
		btnTarget: "📚 Target Pembuatan Tome", 
		title2: "📋 Rincian Crafting Tome", 
		title3: "💰 Estimasi Biaya Pasar", 
		title4: "📦 Inventory", 
		desc3: "Masukkan harga pasar per item untuk mengestimasi Gold yang dibutuhkan.", 
		desc4: "Item ini secara otomatis akan mengurangi total kebutuhan", 
		progText: "Progres Pengumpulan:", 
		btnCalc: "Hitung Kuantitas", 
		totalCostLabel: "Total Sisa Biaya:", 
		btnReset: "🔄 Reset Kalkulator", 
		searchPlaceholder: "🔍 Cari nama buku target...", 
		modalTitleAdd: "Masukkan ke Inventory", 
		modalDesc: "Berapa banyak item yang Anda inginkan?", 
		btnSave: "Simpan", 
		btnCancel: "Batal", 
		baseMat: "Bahan Dasar", 
		lvl: "Level", 
		alertReset: "Hapus semua perhitungan dan mulai dari awal di Cloud?", 
		statEquipDesc: "* Mengikat saat digunakan (Bind on Equip).", 
		footerText: "Kalkulator Tome © 2026 | Dibuat oleh <strong>Sulfikar</strong>", 
		matDesc: "Bahan Crafting",
		btnAddItem: "➕ Tambah Item",
		modalInvTitle: "Menambahkan Item",
		invSearchPlaceholder: "🔍 Cari nama tome/bahan...",
		btnCloseWindow: "Tutup Jendela",
		btnCopy: "Salin Daftar Belanja",
		btnCompact: "Toggle Mode Ringkas",
		btnFav: "Simpan sebagai Favorit",
		btnLoadFav: "Muat Favorit Tersimpan",
		msgCopyOk: "Daftar belanja berhasil disalin ke clipboard!",
		msgFavSave: "Target ini telah disimpan sebagai favorit!",
		msgFavDel: "Favorit dihapus.",
		msgNoFav: "Belum ada favorit yang tersimpan.",
		txtTarget: "Target",
		txtMissing: "Sisa bahan dibutuhkan",
		txtComplete: "Tidak ada (Sudah Lengkap)",
		btnReverse: "🔍 Analisis Potensi",
		modalRevTitle: "🔍 Analisis Potensi Crafting",
		modalRevDesc: "Sistem mendeteksi isi Inventory Anda dan menghitung Tome terbaik yang bisa dibuat.",
		txtReadyToCraft: "✅ SIAP DIRAKIT (100% LENGKAP)",
		txtNearbyCraft: "⚡ HAMPIR SELESAI (TOP PROGRES)",
		txtNoMats: "Inventory Anda kosong. Tambahkan beberapa bahan atau Tome terlebih dahulu!",
		txtSelectTarget: "Jadikan Target",
		farmTitle: "Optimalisasi Farm",
		farmComplete: "✅ Semua material (atau Token) mencukupi untuk Crafting!",
		farmBuy: "🛒 Beli di Item Mall/Farming:",
		farmRecToken: "Gunakan <strong>{tokens} Token of Luck</strong> untuk mencetak <strong>{pages} Tome Page</strong>."
	},
	en: { 
		btnTarget: "📚 Target Tome Crafting", 
		title2: "📋 Tome Crafting Details", 
		title3: "💰 Market Cost Estimator", 
		title4: "📦 Inventory", 
		desc3: "Enter the market price per item to estimate required Gold.", 
		desc4: "Items here will automatically deduct from total requirements.", 
		progText: "Collection Progress:", 
		btnCalc: "Calculate Qty", 
		totalCostLabel: "Total Remaining Cost:", 
		btnReset: "🔄 Reset Calculator", 
		searchPlaceholder: "🔍 Search target book name...", 
		modalTitleAdd: "Add to Inventory", 
		modalDesc: "How many items do you want?", 
		btnSave: "Save", 
		btnCancel: "Cancel", 
		baseMat: "Base Materials", 
		lvl: "Level", 
		alertReset: "Clear all calculations and start over from Cloud?", 
		statEquipDesc: "* Bind on Equip.", 
		footerText: "Tome Calculator © 2026 | Created by <strong>Sulfikar</strong>", 
		matDesc: "Crafting Material",
		btnAddItem: "➕ Add Item",
		modalInvTitle: "Select Item for Inventory",
		invSearchPlaceholder: "🔍 Search book or material name...",
		btnCloseWindow: "Close Window",
		btnCopy: "Copy Shopping List",
		btnCompact: "Toggle Compact Mode",
		btnFav: "Save as Favorite",
		btnLoadFav: "Load Saved Favorite",
		msgCopyOk: "Shopping list copied to clipboard!",
		msgFavSave: "Target saved as favorite!",
		msgFavDel: "Favorite removed.",
		msgNoFav: "No favorite saved yet.",
		txtTarget: "Target",
		txtMissing: "Remaining materials needed",
		txtComplete: "None (Complete)",
		btnReverse: "🔍 Analyze Potential",
		modalRevTitle: "🔍 Crafting Potential Analysis",
		modalRevDesc: "The system scans your Inventory and calculates the best Tomes you can create.",
		txtReadyToCraft: "✅ READY TO CRAFT (100% COMPLETE)",
		txtNearbyCraft: "⚡ NEARBY COMPLETION (TOP PROGRESS)",
		txtNoMats: "Your inventory is empty. Please add some materials or Tomes first!",
		txtSelectTarget: "Set as Target",
		farmTitle: "Smart Farming Optimizer",
		farmComplete: "✅ All materials (or Tokens) are sufficient for Crafting!",
		farmBuy: "🛒 Buy from Item Mall:",
		farmRecToken: "Use <strong>{tokens} Token of Luck</strong> to forge <strong>{pages} Tome Page</strong>."
	}
};

let currentLang = localStorage.getItem('tomeLang') || 'id';
window.confettiLaunched = false;
let isCompactMode = false;
let favoriteTargetId = localStorage.getItem('tomeFavoriteId') || null;

function applyLanguage() {
	document.querySelectorAll('[data-i18n]').forEach(el => {
		const key = el.getAttribute('data-i18n');
		if (LANG[currentLang][key]) {
			if (el.tagName === 'INPUT') el.placeholder = LANG[currentLang][key];
			else el.innerHTML = LANG[currentLang][key]; 
		}
	});

	document.querySelectorAll('[data-i18n-title]').forEach(el => {
		const key = el.getAttribute('data-i18n-title');
		if (LANG[currentLang][key]) el.title = LANG[currentLang][key];
	});
	
	const descEl = document.getElementById('nazvaniye');
	if (descEl) {
		descEl.innerHTML = window.innerWidth <= 768 
			? (currentLang === 'id' ? "Sentuh ikon buku/bahan untuk melihat nama & stat." : "Tap book/material icons to view names & stats.")
			: (currentLang === 'id' ? "Arahkan kursor ke ikon untuk melihat nama buku." : "Hover over the icons to see the book names.");
	}

	document.getElementById('langBtn').innerText = currentLang === 'id' ? '🌐 Switch to English' : '🌐 Ganti ke Indonesia';
	
	renderBookSelection();
	processTree(rightTreeId);
	renderDeductions();
}

function toggleLanguage() {
	currentLang = currentLang === 'id' ? 'en' : 'id';
	localStorage.setItem('tomeLang', currentLang);
	applyLanguage();
}

function toggleMenu() {
	const panel = document.getElementById('mainMenuPanel');
	const btn = document.getElementById('menuToggleBtn');
	if (!panel || !btn) return;
	
	if (panel.style.display === 'none' || panel.style.display === '') {
		panel.style.display = 'block';
		btn.classList.add('active');
		btn.innerHTML = '<i class="fas fa-xmark"></i>';
	} else {
		panel.style.display = 'none';
		btn.classList.remove('active');
		btn.innerHTML = '<i class="fas fa-gear"></i>';
	}
}

function copyShoppingList() {
	let targetName = TOME_DB[rightTreeId][4];
	let multiplier = document.getElementById('mnojitel').value;
	let cost = document.getElementById('totalCostDisplay').innerText;
	
	let n12 = Math.max(0, (itemCounts[12] || 0)); 
	let n11 = Math.max(0, (itemCounts[11] || 0));
	let n10 = Math.max(0, (itemCounts[10] || 0));
	
	let text = `${LANG[currentLang]['txtTarget']}: ${multiplier}x ${targetName}.\n`;
	text += `${LANG[currentLang]['txtMissing']}: `;
	
	let mats = [];
	if(n12 > 0) mats.push(`${n12}x Tome Page`);
	if(n11 > 0) mats.push(`${n11}x Tome Fragment`);
	if(n10 > 0) mats.push(`${n10}x Token of Luck`);
	
	text += mats.length > 0 ? mats.join(', ') : LANG[currentLang]['txtComplete'];
	text += `.\n${LANG[currentLang]['totalCostLabel']} ${cost}`;
	
	navigator.clipboard.writeText(text).then(() => {
		alert(LANG[currentLang]['msgCopyOk']);
	});
}

function toggleCompactMode() {
	isCompactMode = !isCompactMode;
	const btn = document.getElementById('btnCompact');
	if(isCompactMode) {
		btn.classList.add('active');
		btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
	} else {
		btn.classList.remove('active');
		btn.innerHTML = '<i class="fas fa-eye"></i>';
	}
	renderTree();
}

function updateFavoriteButton() {
	const btn = document.getElementById('btnFavorite');
	if(favoriteTargetId == rightTreeId) {
		btn.innerHTML = '<i class="fas fa-star fav-active"></i>';
	} else {
		btn.innerHTML = '<i class="far fa-star"></i>';
	}
}

function saveFavorite() {
	if(favoriteTargetId == rightTreeId) {
		favoriteTargetId = null;
		localStorage.removeItem('tomeFavoriteId');
		alert(LANG[currentLang]['msgFavDel']);
	} else {
		favoriteTargetId = rightTreeId;
		localStorage.setItem('tomeFavoriteId', favoriteTargetId);
		alert(LANG[currentLang]['msgFavSave']);
	}
	updateFavoriteButton();
}

function loadFavorite() {
	if (favoriteTargetId && TOME_DB[favoriteTargetId]) {
		selectTargetBook(favoriteTargetId);
	} else {
		alert(LANG[currentLang]['msgNoFav']);
	}
}

// ---------------- REVERSE CALCULATOR CORE LOGIC ---------------- //

function openReverseCalcModal() {
    hideTooltip();
    document.getElementById('reverseCalcModal').style.display = 'flex';
    runReverseCalculator();
}

function closeReverseCalcModal() { 
    document.getElementById('reverseCalcModal').style.display = 'none'; 
}

function testCraft(id, pool) {
    if (pool[id] && pool[id] > 0) {
        pool[id]--;
        return 1;
    }
    if (id === 10 || id === 11 || id === 12) {
        if (id === 12 && pool[10] >= 20) { pool[10] -= 20; return 1; }
        return 0;
    }
    if (id >= 101 && id <= 109) {
        let pCount = 0;
        for(let i=0; i<4; i++) { 
            if(pool[12] && pool[12]>0) { pool[12]--; pCount++; } 
            else if(pool[10]>=20) { pool[10]-=20; pCount++; } 
        }
        let fCount = 0;
        for(let i=0; i<3; i++) { if(pool[11] && pool[11]>0) { pool[11]--; fCount++; } }
        return (pCount + fCount) / 7;
    }
    let recipe = TOME_DB[id];
    if (!recipe) return 0;
    let s0 = testCraft(recipe[0], pool);
    let s1 = testCraft(recipe[1], pool);
    let s2 = testCraft(recipe[2], pool);
    return (s0 + s1 + s2) / 3;
}

function runReverseCalculator() {
    let resultsDiv = document.getElementById('reverseCalcResults');
    let hasItems = false;
    for(let i=0; i<deductions.length; i++) {
        if(deductions[i] > 0) { hasItems = true; break; }
    }
    
    if(!hasItems) {
        resultsDiv.innerHTML = `<div style="color:var(--text-muted); padding:20px; font-style:italic; text-align:center;">${LANG[currentLang]['txtNoMats']}</div>`;
        return;
    }
    
    let readyList = [];
    let progressList = [];
    
    for (let id = 101; id <= 616; id++) {
        if (!TOME_DB[id]) continue;
        
        let simulationPool = [];
        for(let i=0; i<deductions.length; i++) { simulationPool[i] = deductions[i] || 0; }
        
        let score = testCraft(id, simulationPool);
        let percentage = score * 100;
        
        if (percentage >= 99.99) {
            readyList.push({ id: id, pct: 100 });
        } else if (percentage > 0) {
            progressList.push({ id: id, pct: percentage });
        }
    }
    
    progressList.sort((a, b) => b.pct - a.pct);
    let topProgress = progressList.slice(0, 5);
    let html = '';
    
    html += `<h4 style="color:var(--success); font-size:0.85rem; border-bottom:1px solid var(--border-color); margin-bottom:10px; padding-bottom:5px; text-transform:uppercase; letter-spacing:1px; text-align:left; margin-top:10px;">${LANG[currentLang]['txtReadyToCraft']}</h4>`;
    if (readyList.length === 0) {
        html += `<div style="color:var(--text-muted); font-size:0.85rem; text-align:left; margin-bottom:15px; font-style:italic;">-</div>`;
    } else {
        html += `<div style="display:flex; flex-direction:column; gap:8px; margin-bottom:20px;">`;
        readyList.forEach(item => {
            let name = TOME_DB[item.id][4];
            let lvl = Math.floor(item.id / 100);
            html += `
                <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); padding:10px; border-radius:10px; gap:10px;">
                    <div style="width:32px; height:32px; flex-shrink:0; background-image:url('znachki.png'); ${getSpritePosition(item.id)}"></div>
                    <div style="flex:1; text-align:left;">
                        <div style="font-weight:600; font-size:0.9rem; color:white;">${name}</div>
                        <div style="font-size:0.75rem; color:var(--text-muted);">${LANG[currentLang]['lvl']} ${lvl}</div>
                    </div>
                    <button class="btn-success" style="padding:4px 10px; font-size:0.75rem;" onclick="selectTargetBook(${item.id}); closeReverseCalcModal();">${LANG[currentLang]['txtSelectTarget']}</button>
                </div>
            `;
        });
        html += `</div>`;
    }
    
    html += `<h4 style="color:#f59e0b; font-size:0.85rem; border-bottom:1px solid var(--border-color); margin-bottom:10px; padding-bottom:5px; text-transform:uppercase; letter-spacing:1px; text-align:left;">${LANG[currentLang]['txtNearbyCraft']}</h4>`;
    if (topProgress.length === 0) {
        html += `<div style="color:var(--text-muted); font-size:0.85rem; text-align:left; font-style:italic;">-</div>`;
    } else {
        html += `<div style="display:flex; flex-direction:column; gap:10px;">`;
        topProgress.forEach(item => {
            let name = TOME_DB[item.id][4];
            let lvl = Math.floor(item.id / 100);
            html += `
                <div style="display:flex; flex-direction:column; background:rgba(255,255,255,0.02); border:1px solid var(--border-color); padding:10px; border-radius:10px; gap:6px;">
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
                        <div style="width:32px; height:32px; flex-shrink:0; background-image:url('znachki.png'); ${getSpritePosition(item.id)}"></div>
                        <div style="flex:1; text-align:left;">
                            <div style="font-weight:600; font-size:0.9rem; color:white;">${name}</div>
                            <div style="font-size:0.75rem; color:var(--text-muted);">${LANG[currentLang]['lvl']} ${lvl}</div>
                        </div>
                        <div style="font-weight:700; color:#f59e0b; font-size:0.85rem;">${item.pct.toFixed(0)}%</div>
                        <button class="btn-calc" style="padding:4px 10px; font-size:0.75rem; background:#475569;" onclick="selectTargetBook(${item.id}); closeReverseCalcModal();">${LANG[currentLang]['txtSelectTarget']}</button>
                    </div>
                    <div class="progress-bar-bg" style="height:6px;">
                        <div class="progress-bar" style="width:${item.pct}%; background:linear-gradient(90deg, #f59e0b, var(--success));"></div>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
    }
    
    resultsDiv.innerHTML = html;
}

// ------------------------------------------------------------------ //

const TOME_DB = [];
TOME_DB[601] = [501, 502, 509, 17615, 'The Calm of Ice']; 
TOME_DB[602] = [502, 503, 505, 17622, 'The Khatru']; 
TOME_DB[603] = [504, 503, 508, 17628, 'A Carmine Tear']; 
TOME_DB[604] = [503, 508, 501, 17630, 'The Fruit of Intense Labor']; 
TOME_DB[605] = [505, 512, 509, 17634, 'Tomorrows Phoenix']; 
TOME_DB[606] = [505, 506, 507, 17636, 'Riding the Scree']; 
TOME_DB[607] = [513, 514, 507, 17642, 'Turning the Tide']; 
TOME_DB[608] = [508, 506, 514, 17649, 'Existential Woe']; 
TOME_DB[609] = [510, 501, 505, 17655, 'Book of Fragrances']; 
TOME_DB[610] = [510, 506, 501, 17657, 'Bouquet of Regrets']; 
TOME_DB[611] = [511, 509, 505, 17661, 'The Union']; 
TOME_DB[612] = [511, 513, 503, 17663, 'Oblivious Enlightenment']; 
TOME_DB[613] = [513, 507, 514, 17669, 'As the Universe Fades']; 
TOME_DB[614] = [514, 512, 513, 17676, 'The Concubines Laugh']; 
TOME_DB[615] = [515, 501, 507, 17679, 'The Academy of the East']; 
TOME_DB[616] = [516, 515, 514, 17683, 'Pan Gu Creator'];

TOME_DB[501] = [401, 408, 405, 17618, 'A Heart like Still Water']; 
TOME_DB[502] = [409, 405, 403, 17621, 'The Tsunamis of Yore']; 
TOME_DB[503] = [404, 408, 401, 17624, 'Laughing Mad']; 
TOME_DB[504] = [408, 404, 401, 17627, 'The Book of Congratulations']; 
TOME_DB[505] = [403, 409, 404, 17633, 'The Wrath of Heaven']; 
TOME_DB[506] = [409, 403, 402, 17639, 'A Strange Kindness']; 
TOME_DB[507] = [402, 404, 409, 17645, 'Flesh of the Lamia']; 
TOME_DB[508] = [404, 408, 402, 17648, 'Everything is Emptiness']; 
TOME_DB[509] = [403, 401, 405, 17651, 'The Oasis Remembered']; 
TOME_DB[510] = [401, 405, 407, 17654, 'The Heavenly Scent']; 
TOME_DB[511] = [403, 409, 404, 17660, 'Debt and Tombstones']; 
TOME_DB[512] = [409, 403, 404, 17666, 'Endless Waves']; 
TOME_DB[513] = [408, 402, 404, 17672, 'Parting Grief']; 
TOME_DB[514] = [408, 402, 404, 17675, 'Rouge and Red Lips']; 
TOME_DB[515] = [406, 407, 401, 17678, 'Gang of Hooligans']; 
TOME_DB[516] = [406, 407, 402, 17682, 'The Voidlands']; 

TOME_DB[401] = [303, 307, 304, 17602, 'Burning Desire']; 
TOME_DB[402] = [304, 301, 305, 17603, 'Tome of Predestination']; 
TOME_DB[403] = [302, 305, 303, 17604, 'The Roses Thorn']; 
TOME_DB[404] = [306, 307, 301, 17605, 'Letters of Social Unrest']; 
TOME_DB[405] = [303, 307, 306, 17606, 'The Appetites of Spring']; 
TOME_DB[406] = [308, 305, 307, 17610, 'The Rivers Edge']; 
TOME_DB[407] = [309, 302, 306, 17614, 'The Weak Stream of Many Miles']; 
TOME_DB[408] = [301, 304, 302, 17600, 'Battle Tactics']; 
TOME_DB[409] = [302, 305, 303, 17601, 'A Bewitching Proposal'];

TOME_DB[301] = [201, 206, 203, 17593, 'Eat Drink and be Merry']; 
TOME_DB[302] = [202, 205, 206, 17594, 'Sunset Tales']; 
TOME_DB[303] = [207, 203, 202, 17595, 'Adventures and Mishaps']; 
TOME_DB[304] = [204, 201, 203, 17596, 'The Sunny Pass']; 
TOME_DB[305] = [205, 202, 201, 17597, 'Tales of Beauty']; 
TOME_DB[306] = [206, 203, 201, 17598, 'The Bards Wanderlust']; 
TOME_DB[307] = [207, 205, 204, 17599, 'A Poets Musings']; 
TOME_DB[308] = [208, 202, 204, 17609, 'Decaying Tome']; 
TOME_DB[309] = [209, 203, 202, 17613, 'Scene of Carnage'];

TOME_DB[201] = [101, 104, 106, 17586, 'Tome of Iron Will']; 
TOME_DB[202] = [102, 105, 106, 17587, 'Misty Peach Blossoms']; 
TOME_DB[203] = [107, 103, 102, 17588, 'Tale of the Red Lotus']; 
TOME_DB[204] = [101, 104, 103, 17589, 'Tale of the Dolt']; 
TOME_DB[205] = [102, 105, 107, 17590, 'Tale of the Peach Fan']; 
TOME_DB[206] = [106, 101, 103, 17591, 'Story of the Blockade']; 
TOME_DB[207] = [107, 103, 104, 17592, 'Mediations Flame']; 
TOME_DB[208] = [108, 103, 101, 17608, 'Guide to Wolf Hunting']; 
TOME_DB[209] = [109, 103, 107, 17612, 'Fire Dance'];

TOME_DB[101] = [0, 0, 0, 17579, 'Underestimated Resolve']; 
TOME_DB[102] = [0, 0, 0, 17580, 'Soaring Heart']; 
TOME_DB[103] = [0, 0, 0, 17581, 'Retributions Flame']; 
TOME_DB[104] = [0, 0, 0, 17582, 'Tome of the River Spirits']; 
TOME_DB[105] = [0, 0, 0, 17583, 'Flankers Tome']; 
TOME_DB[106] = [0, 0, 0, 17584, 'Tome of Hyperbolic Boasts']; 
TOME_DB[107] = [0, 0, 0, 17585, 'Tome of Grace']; 
TOME_DB[108] = [0, 0, 0, 17607, 'A Flowerless Plant']; 
TOME_DB[109] = [0, 0, 0, 17611, 'Eternitys Moon'];

const STATS_DB = {
    101: ["Magic +1", "Vitality +2"], 102: ["Strength +1", "Vitality +2"], 103: ["Dexterity +1", "Vitality +2"], 104: ["Magic +2", "Vitality +1"], 105: ["Strength +2", "Vitality +1"], 106: ["Dexterity +2", "Vitality +1"], 107: ["HP Recovery +3", "EXP +1%"], 108: ["Strength +3"], 109: ["Magic +3"],
    201: ["Magic +3", "Vitality +2"], 202: ["Strength +3", "Vitality +2"], 203: ["Dexterity +3", "Vitality +2"], 204: ["Magic +4", "Vitality +3"], 205: ["Strength +4", "Vitality +3"], 206: ["Dexterity +4", "Vitality +3"], 207: ["HP Recovery +6", "EXP +2%"], 208: ["Strength +5"], 209: ["Magic +5"],
    301: ["Magic +5", "Vitality +4"], 302: ["Strength +9", "Vitality +8"], 303: ["Magic +9", "Vitality +8"], 304: ["Strength +15"], 305: ["Dexterity +15"], 306: ["Vitality +15"], 307: ["Magic +15"], 308: ["HP Recovery +9", "EXP +3%"], 309: ["MP Recovery +9", "EXP +3%"],
    401: ["Magic +13", "Vitality +12"], 402: ["Strength +20"], 403: ["Dexterity +20"], 404: ["Vitality +20"], 405: ["Magic +20"], 406: ["HP Recovery +9", "EXP +4%"], 407: ["MP Recovery +12", "EXP +4%"], 408: ["Strength +13", "Vitality +12"], 409: ["Dexterity +13", "Vitality +12"],
    501: ["Magic +20", "Critical Hit Rate +1%"], 502: ["Magic +20", "Movement Speed +0.10 meters/second"], 503: ["Vitality +25"], 504: ["Vitality +20", "Reduce Physical damage taken +3%"], 505: ["Dexterity +25"], 506: ["Strength +20", "Critical Hit Rate +1%"], 507: ["Strength +20", "Movement Speed +0.10 m/s"], 508: ["Strength +25"], 509: ["Vitality +20", "Critical Hit Rate +1%"], 510: ["Magic +15", "Vitality +10"], 511: ["Dexterity +15", "Vitality +10"], 512: ["Dexterity +20", "Critical Hit Rate +1%"], 513: ["Strength +15", "Vitality +10"], 514: ["Strength +15", "Dexterity +10"], 515: ["Strength +5", "Dexterity +5", "Vitality +5", "Magic +5", "Max HP +40", "Max MP +50"], 516: ["Strength +5", "Dexterity +5", "Vitality +5", "Magic +5", "Critical Hit Rate +1%"],
    601: ["Magic +35"], 602: ["Magic +20", "Critical Hit Rate +2%"], 603: ["Vitality +6", "Reduce Physical damage taken +6%"], 604: ["Vitality +20", "Critical Hit Rate +2%"], 605: ["Dexterity +35"], 606: ["Dexterity +20", "Speed +0.2 meters/second"], 607: ["Strength +35"], 608: ["Strength +20", "Critical Hit Rate +2%"], 609: ["Magic +13", "Vitality +12", "Channeling -2%"], 610: ["Magic +13", "Vitality +12", "Critical Hit Rate +2%"], 611: ["Dexterity +13", "Vitality +12", "Speed +0.2 meters/second"], 612: ["Dexterity +13", "Vitality +12", "Max HP +140"], 613: ["Strength +13", "Vitality +12", "Reduce Physical damage taken +6%"], 614: ["Strength +13", "Vitality +12", "Critical Hit Rate +2%"], 615: ["Strength +9", "Dexterity +9", "Vitality +8", "Magic +9", "Max HP +70", "Max MP +80"], 616: ["Strength +9", "Dexterity +9", "Vitality +8", "Magic +9", "Critical Hit Rate +1%", "Channeling Time -1%", "Interval Between Hits -0.05 seconds"]
};

let itemCounts = [];
let deductions = [];
let rightTreeId = 616;
let activeModalItemId = null;

function sanitizeMultiplier(input) {
	let val = parseInt(input.value);
	if (isNaN(val) || val < 1) input.value = 1;
	if (val > 99) input.value = 99;
}

function sanitizePrice(input) {
	let val = parseInt(input.value);
	if (isNaN(val) || val < 0) input.value = 0;
	if (val > 999999999) input.value = 999999999;
}

function getSpritePosition(id) {
    const parsedId = parseInt(id);
    if (parsedId === 10) return 'background-position:32px -32px';
    if (parsedId === 11) return 'background-position:64px 0px';
    if (parsedId === 12) return 'background-position:32px 0px';
    let row = Math.floor(parsedId / 100);
    let num = parsedId - (row * 100);
    return `background-position:-${32 * (num - 1)}px -${32 * (row - 1)}px`;
}

function getActiveTreeIds() {
    let activeIds = new Set();
    function walk(nodeId) {
        if (!nodeId || !TOME_DB[nodeId]) return;
        activeIds.add(nodeId);
        if (nodeId > 200) {
            walk(TOME_DB[nodeId][0]);
            walk(TOME_DB[nodeId][1]);
            walk(TOME_DB[nodeId][2]);
        }
    }
    walk(rightTreeId);
    activeIds.add(10);
    activeIds.add(11);
    activeIds.add(12);
    return activeIds;
}

function showTooltip(element, event) {
    const id = parseInt(element.title);
    if (!TOME_DB[id] && id !== 10 && id !== 11 && id !== 12) return;
    const tooltip = document.getElementById('floatingTooltip');
    let nameText = "";
    let typeText = "";
    let statsHtml = "";
    let footerText = LANG[currentLang]['statEquipDesc'];
    
    if (id === 10) { nameText = "Token of Luck"; typeText = LANG[currentLang]['matDesc']; }
    else if (id === 11) { nameText = "Tome Fragment"; typeText = LANG[currentLang]['matDesc']; }
    else if (id === 12) { nameText = "Tome Page"; typeText = LANG[currentLang]['matDesc']; }
    else {
        nameText = TOME_DB[id][4];
        let row = Math.floor(id / 100);
        typeText = `${LANG[currentLang]['lvl']} ${row} Tome`;
        if (STATS_DB[id]) {
            STATS_DB[id].forEach(stat => { statsHtml += `<div class="tooltip-stat">${stat}</div>`; });
        }
    }
    
    tooltip.innerHTML = `
        <div class="tooltip-title"><div style="width:32px; height:32px; display:inline-block; vertical-align:middle; background-image:url('znachki.png'); ${getSpritePosition(id)}; transform:scale(0.85); border-radius:4px;"></div> ${nameText}</div>
        <div class="tooltip-type">${typeText}</div>
        <div class="tooltip-list">${statsHtml}</div>
        <div class="tooltip-footer">${footerText}</div>
    `;
    tooltip.style.display = 'block';
    moveTooltip(event);
    
    let linkUrl = (id === 10) ? "http://www.pwdatabase.com/pwi/items/24722" : (id === 11) ? "http://www.pwdatabase.com/pwi/items/17011" : (id === 12) ? "http://www.pwdatabase.com/pwi/items/17010" : `http://www.pwdatabase.com/pwi/items/${TOME_DB[id][3]}`;
    document.getElementById('nazvaniye').innerHTML = `<a href="${linkUrl}" target="_blank">► ${nameText}</a>`;
}

function moveTooltip(event) {
    const tooltip = document.getElementById('floatingTooltip');
    if (tooltip.style.display !== 'block') return;
    let x = event.clientX + 15;
    let y = event.clientY + 15;
    const tooltipWidth = tooltip.offsetWidth || 240;
    const tooltipHeight = tooltip.offsetHeight || 160;
    if (x + tooltipWidth > window.innerWidth) { x = event.clientX - tooltipWidth - 15; }
    if (y + tooltipHeight > window.innerHeight) { y = event.clientY - tooltipHeight - 15; }
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
}

function hideTooltip() { document.getElementById('floatingTooltip').style.display = 'none'; }
document.addEventListener('click', function(e) { if (!e.target.closest('button[title]')) { hideTooltip(); } });
document.addEventListener('touchstart', function(e) { if (!e.target.closest('button[title]')) { hideTooltip(); } });

// ==================== GENERATOR TOMBOL (UPDATE CRAFTING SIMULATOR) ====================
function getTreeItemHtml(id, isDeductionsView = false) {
    let count = isDeductionsView ? deductions[id] : itemCounts[id];
    if (!count) return '';
    
    let clickAttr = '';
    let extraStyle = '';
    let spanTag = '';

    if (isDeductionsView) {
        // Jika ini di area Inventory, klik untuk menghapus
        clickAttr = `onclick="removeDeduction(${id})"`;
        spanTag = `<span title="Hapus item dari inventory"></span>`;
    } else {
        // JIKA INI ADALAH TOME TARGET UTAMA DI ATAS POHON
        if (id == rightTreeId) {
            clickAttr = `onclick="attemptCrafting(${id})"`;
            // Tambahkan efek glow hijau agar user tahu ini bisa diklik untuk di-craft
            extraStyle = "box-shadow: 0 0 12px var(--success); border: 2px solid var(--success); border-radius: 6px; cursor: pointer;";
        } else {
            // Item pohon lainnya klik untuk masuk modal tambah manual
            clickAttr = `onclick="openModal(${id})"`;
        }
    }
    
    return `<li><button style="background-image:url('znachki.png'); ${getSpritePosition(id)}; ${extraStyle}" title="${id}" ${clickAttr} onmouseover="showTooltip(this, event);" onmousemove="moveTooltip(event);" onmouseout="hideTooltip();">${spanTag}</button><b>${count}</b></li>`;
}

function renderTree() {
    let txt = '';
    const txtLvl = LANG[currentLang]['lvl'];
    const txtBase = LANG[currentLang]['baseMat'];
    
    if (!isCompactMode) {
        for (let r = 6; r >= 1; r--) {
            let start = r * 100 + 1; let end = r * 100 + 16; let hasItem = false;
            let tempTxt = `<ul><li>${txtLvl} ${r}</li> `;
            for (let e = start; e <= end; e++) { if (itemCounts[e]) { tempTxt += getTreeItemHtml(e); hasItem = true; } }
            tempTxt += '</ul>';
            if (hasItem) txt += tempTxt;
        }
    }
    
    txt += `<ul id="niz"><li>${txtBase}</li> `;
    if (itemCounts[11]) txt += getTreeItemHtml(11);
    if (itemCounts[12]) txt += getTreeItemHtml(12);
    if (itemCounts[10]) txt += `<li id="strelki" style="margin: 0 10px;">→</li>${getTreeItemHtml(10)}`;
    txt += `</ul>`;
    document.getElementById('rightTree').innerHTML = txt;
}

function renderDeductions() {
    let txt = ''; let lis = '';
    const deductionsDiv = document.getElementById('deductionsList');
    let activeIds = getActiveTreeIds();
    
    if (deductions[11] && activeIds.has(11)) lis += getTreeItemHtml(11, true);
    if (deductions[12] && activeIds.has(12)) lis += getTreeItemHtml(12, true);
    if (deductions[10] && activeIds.has(10)) lis += getTreeItemHtml(10, true);
    if (lis !== '') txt += `<ul><li>${LANG[currentLang]['baseMat']}</li> ${lis}</ul>`;
    
    for (let r = 1; r <= 6; r++) {
        lis = ''; let start = r * 100 + 1; let end = r * 100 + 16;
        for (let e = start; e <= end; e++) { if (deductions[e] && activeIds.has(e)) lis += getTreeItemHtml(e, true); }
        if (lis !== '') txt += `<ul><li>${LANG[currentLang]['lvl']} ${r}</li> ${lis}</ul>`;
    }
    deductionsDiv.innerHTML = txt;
}

function renderBookSelection() {
    let txt = '';
    for (let r = 6; r >= 1; r--) {
        let lis = ''; let start = r * 100 + 1; let end = r * 100 + 16;
        for (let e = start; e <= end; e++) if (TOME_DB[e]) lis += `<li><button style="background-image:url('znachki.png'); ${getSpritePosition(e)}" title="${e}" onclick="selectTargetBook(${e})" onmouseover="showTooltip(this, event);" onmousemove="moveTooltip(event);" onmouseout="hideTooltip();"></button></li>`;
        if (lis !== '') txt += `<h4>${LANG[currentLang]['lvl']} ${r}</h4><ul>${lis}</ul>`;
    }
    document.getElementById('vyborDiv').innerHTML = txt;
}

function updateCostAndProgress() {
    let price10 = Math.max(0, parseInt(document.getElementById('price10').value) || 0);
    let price11 = Math.max(0, parseInt(document.getElementById('price11').value) || 0);
    let price12 = Math.max(0, parseInt(document.getElementById('price12').value) || 0);
    let multiplier = Math.max(1, parseInt(document.getElementById('mnojitel').value) || 1);
    saveDataTrigger();
    
    let netCounts = [];
    let deductionsCopy = [];
    for (let i = 0; i < deductions.length; i++) { deductionsCopy[i] = deductions[i] || 0; }
    
    function calcNetNode(nodeId) {
        if (!nodeId || !TOME_DB[nodeId]) return;
        if (deductionsCopy[nodeId] && deductionsCopy[nodeId] > 0) { deductionsCopy[nodeId]--; return; }
        if (!netCounts[nodeId]) netCounts[nodeId] = 0;
        netCounts[nodeId]++;
        if (nodeId > 200) { calcNetNode(TOME_DB[nodeId][0]); calcNetNode(TOME_DB[nodeId][1]); calcNetNode(TOME_DB[nodeId][2]); }
    }
    for (let z = 0; z < multiplier; z++) calcNetNode(rightTreeId);
    
    let netLv1Tomes = 0;
    for (let z = 101; z <= 109; z++) { if (netCounts[z]) netLv1Tomes += netCounts[z]; }
    
    netCounts[11] = netLv1Tomes * 3;
    netCounts[12] = netLv1Tomes * 4;
    
    if (deductionsCopy[11]) { netCounts[11] -= deductionsCopy[11]; if (netCounts[11] < 0) netCounts[11] = 0; }
    if (deductionsCopy[12]) { netCounts[12] -= deductionsCopy[12]; if (netCounts[12] < 0) netCounts[12] = 0; }
    
    netCounts[10] = netCounts[12] * 20;
    if (deductionsCopy[10]) { netCounts[10] -= deductionsCopy[10]; if (netCounts[10] < 0) netCounts[10] = 0; }
    
    let grossCounts = [];
    function calcGrossNode(nodeId) {
        if (!nodeId || !TOME_DB[nodeId]) return;
        if (!grossCounts[nodeId]) grossCounts[nodeId] = 0; grossCounts[nodeId]++;
        if (nodeId > 200) { calcGrossNode(TOME_DB[nodeId][0]); calcGrossNode(TOME_DB[nodeId][1]); calcGrossNode(TOME_DB[nodeId][2]); }
    }
    for (let z = 0; z < multiplier; z++) calcGrossNode(rightTreeId);
    
    let grossLv1Tomes = 0;
    for (let z = 101; z <= 109; z++) { if (grossCounts[z]) grossLv1Tomes += grossCounts[z]; }
    grossCounts[11] = grossLv1Tomes * 3;
    grossCounts[12] = grossLv1Tomes * 4;
    grossCounts[10] = grossCounts[12] * 20;
    
    let totalCost = (netCounts[10] || 0) * price10 + (netCounts[11] || 0) * price11 + (netCounts[12] || 0) * price12;
    document.getElementById('totalCostDisplay').innerText = totalCost.toLocaleString('id-ID') + " Gold";
    
    let grossTotalTokens = (grossCounts[10] || 0) + (grossCounts[12] || 0) * 20 + (grossCounts[11] || 0) * 20; 
    let netTotalTokens = (netCounts[10] || 0) + (netCounts[12] || 0) * 20 + (netCounts[11] || 0) * 20;
    
    let pct = grossTotalTokens > 0 ? ((grossTotalTokens - netTotalTokens) / grossTotalTokens) * 100 : 0;
    pct = Math.max(0, Math.min(100, pct));
    document.getElementById('progressBar').style.width = pct.toFixed(1) + '%';
    document.getElementById('progressPercentText').innerText = pct.toFixed(1) + '%';
    
    if (pct >= 100) {
        if (!window.confettiLaunched && typeof confetti === 'function') { 
            //confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, colors: ['#3b82f6', '#10b981', '#f59e0b'] }); 
            window.confettiLaunched = true;
        }
    } else {
        window.confettiLaunched = false;
    }
}

// ---------------- SMART FARMING OPTIMIZER WITH i18n ---------------- //
(function() {
    const rightTreeCard = document.getElementById('rightTree').parentElement;
    if (!document.getElementById('smartFarmingContainer')) {
        const farmingContainer = document.createElement('div');
        farmingContainer.id = 'smartFarmingContainer';
        farmingContainer.style.cssText = 'margin-top: 20px; padding: 15px; border-left: 4px solid #3b82f6; border-radius: 12px; background: rgba(0,0,0,0.15); border: 1px solid rgba(255,255,255,0.08); display: none; box-shadow: 0 4px 6px rgba(0,0,0,0.3);';
        farmingContainer.innerHTML = `
            <h4 style="color: #3b82f6; font-size: 1rem; margin: 0 0 10px 0;"><i class="fas fa-magic"></i> Smart Farming Optimizer</h4>
            <ul id="farmingListUI" style="color: #fb7185; font-size: 0.9rem; padding-left: 20px; margin-bottom: 10px;"></ul>
            <hr style="border-color: rgba(255,255,255,0.05); margin: 10px 0;">
            <ul id="farmingRecUI" style="color: #34d399; font-size: 0.9rem; padding-left: 20px; list-style: none; margin: 0;"></ul>
        `;
        rightTreeCard.appendChild(farmingContainer);
    }

    const SmartFarmingModule = {
        analyze: function(requiredPages, requiredFragments, currentTokens) {
            let missingPages = requiredPages || 0;
            let missingFragments = requiredFragments || 0;
            let remainingTokens = currentTokens || 0;
            
            let recs = [];
            let shopping = [];

            if (missingPages > 0 && remainingTokens > 0) {
                let affordablePages = Math.floor(remainingTokens / 20); 
                if (affordablePages > 0) {
                    let pagesCrafted = Math.min(affordablePages, missingPages);
                    let tokensUsed = pagesCrafted * 20;
                    missingPages -= pagesCrafted;
                    
                    let recText = LANG[currentLang]['farmRecToken']
                        .replace('{tokens}', tokensUsed)
                        .replace('{pages}', pagesCrafted);
                    recs.push(recText);
                }
            }

            if (missingPages > 0) shopping.push(`<strong>${missingPages}x</strong> Tome Page`);
            if (missingFragments > 0) shopping.push(`<strong>${missingFragments}x</strong> Tome Fragment`);

            this.renderUI(missingPages === 0 && missingFragments === 0, shopping, recs);
        },

        renderUI: function(isComplete, shoppingList, recommendations) {
            const container = document.getElementById('smartFarmingContainer');
            const listUI = document.getElementById('farmingListUI');
            const recUI = document.getElementById('farmingRecUI');
            const titleUI = container.querySelector('h4');
            
            container.style.display = 'block';
            listUI.innerHTML = ''; recUI.innerHTML = '';

            titleUI.innerHTML = `<i class="fas fa-magic"></i> ${LANG[currentLang]['farmTitle']}`;

            if (isComplete && shoppingList.length === 0) {
                container.style.borderLeftColor = '#34d399';
                listUI.innerHTML = `<li style="color: #34d399;">${LANG[currentLang]['farmComplete']}</li>`;
            } else {
                container.style.borderLeftColor = '#3b82f6';
                let prefix = LANG[currentLang]['farmBuy'];
                shoppingList.forEach(item => { listUI.innerHTML += `<li>${prefix} ${item}</li>`; });
            }

            recommendations.forEach(rec => { recUI.innerHTML += `<li>💡 ${rec}</li>`; });
        }
    };

    if (typeof processTree === 'function') {
        const originalProcessTree = processTree;
        processTree = function(id) {
            originalProcessTree(id);
            let pagesNeeded = (typeof itemCounts !== 'undefined') ? (itemCounts[12] || 0) : 0;
            let fragsNeeded = (typeof itemCounts !== 'undefined') ? (itemCounts[11] || 0) : 0;
            let tokensAvailable = (typeof deductions !== 'undefined') ? (deductions[10] || 0) : 0;
            
            SmartFarmingModule.analyze(pagesNeeded, fragsNeeded, tokensAvailable);
        };
    }
})();

// ------------------------------------------------------------------ //

function processTree(id) {
    if (!id || !TOME_DB[id]) return;
    rightTreeId = id;
    updateFavoriteButton();
    let multiplier = Math.max(1, parseInt(document.getElementById('mnojitel').value) || 1);
    itemCounts = [];
    
    let deductionsCopy = [];
    for (let i = 0; i < deductions.length; i++) { deductionsCopy[i] = deductions[i] || 0; }
    
    function walkAndCount(nodeId) {
        if (!nodeId || !TOME_DB[nodeId]) return;
        if (deductionsCopy[nodeId] > 0) { deductionsCopy[nodeId]--; return; }
        if (!itemCounts[nodeId]) itemCounts[nodeId] = 0;
        itemCounts[nodeId]++;
        if (nodeId > 200) { walkAndCount(TOME_DB[nodeId][0]); walkAndCount(TOME_DB[nodeId][1]); walkAndCount(TOME_DB[nodeId][2]); }
    }
    
    for (let z = 0; z < multiplier; z++) { walkAndCount(id); }
    
    let totalLv1Tomes = 0;
    for (let z = 101; z <= 109; z++) { totalLv1Tomes += (itemCounts[z] || 0); }
    
    itemCounts[11] = totalLv1Tomes * 3; 
    itemCounts[12] = totalLv1Tomes * 4; 
    
    if (deductionsCopy[11]) { itemCounts[11] -= deductionsCopy[11]; if (itemCounts[11] < 0) itemCounts[11] = 0; }
    if (deductionsCopy[12]) { itemCounts[12] -= deductionsCopy[12]; if (itemCounts[12] < 0) itemCounts[12] = 0; }
    
    itemCounts[10] = (itemCounts[12] || 0) * 20;
    if (deductionsCopy[10]) { itemCounts[10] -= deductionsCopy[10]; if (itemCounts[10] < 0) itemCounts[10] = 0; }
    
    renderTree(); renderDeductions(); updateCostAndProgress();
}

function selectTargetBook(id) { rightTreeId = id; processTree(rightTreeId); }

function openInventoryModal() {
    hideTooltip();
    document.getElementById('inventoryModal').style.display = 'flex';
    document.getElementById('invSearch').value = ''; 
    renderInventorySelection(''); 
    setTimeout(() => { document.getElementById('invSearch').focus(); }, 50);
}

function closeInventoryModal() { document.getElementById('inventoryModal').style.display = 'none'; }

function renderInventorySelection(query) {
    let html = '<ul style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center;">';
    const q = query.toLowerCase(); 
    let activeIds = getActiveTreeIds();
    let showAll = (q === ''); 

    const baseMats = [ {id: 12, name: 'Tome Page'}, {id: 11, name: 'Tome Fragment'}, {id: 10, name: 'Token of Luck'} ];
    
    baseMats.forEach(mat => {
        if (mat.name.toLowerCase().includes(q) && (showAll || activeIds.has(mat.id))) { 
            html += `<li><button style="background-image:url('znachki.png'); ${getSpritePosition(mat.id)}" title="${mat.id}" onclick="selectItemForInventory(${mat.id})" onmouseover="showTooltip(this, event);" onmousemove="moveTooltip(event);" onmouseout="hideTooltip();"></button></li>`; 
        }
    });
    
    TOME_DB.forEach((tome, id) => {
        if (tome && tome[4].toLowerCase().includes(q) && (showAll || activeIds.has(id))) { 
            html += `<li><button style="background-image:url('znachki.png'); ${getSpritePosition(id)}" title="${id}" onclick="selectItemForInventory(${id})" onmouseover="showTooltip(this, event);" onmousemove="moveTooltip(event);" onmouseout="hideTooltip();"></button></li>`; 
        }
    });
    html += '</ul>'; 
    document.getElementById('invItemList').innerHTML = html;
}

function filterInventorySearch(val) { renderInventorySelection(val); }
function selectItemForInventory(id) { closeInventoryModal(); openModal(id); }

function openModal(id) {
    hideTooltip();
    activeModalItemId = id;
    let nameText = (id === 10) ? "Token of Luck" : (id === 11) ? "Tome Fragment" : (id === 12) ? "Tome Page" : TOME_DB[id][4];
    document.getElementById('modalTitle').innerText = `${LANG[currentLang]['modalTitleAdd']} - ${nameText}`;
    document.getElementById('modalInput').value = 1;
    document.getElementById('customModal').style.display = 'flex';
    document.getElementById('modalInput').focus();
}

function closeModal() { document.getElementById('customModal').style.display = 'none'; activeModalItemId = null; }

function confirmModal() {
    const amount = Math.max(1, parseInt(document.getElementById('modalInput').value) || 1);
    if (!isNaN(amount) && amount > 0 && activeModalItemId) {
        if (!deductions[activeModalItemId]) deductions[activeModalItemId] = 0;
        deductions[activeModalItemId] += amount;
        saveDataTrigger(); processTree(rightTreeId); 
    }
    closeModal();
}

function removeDeduction(id) { deductions[id] = 0; saveDataTrigger(); processTree(rightTreeId); }

function filterBooks(query) {
    const q = query.toLowerCase();
    document.querySelectorAll('#vyborDiv ul').forEach(ul => {
        let hasVisibleItem = false;
        ul.querySelectorAll('li').forEach(li => {
            const id = li.querySelector('button').title; const bookName = TOME_DB[id] ? TOME_DB[id][4].toLowerCase() : '';
            if (bookName.includes(q)) { li.style.display = 'inline-block'; hasVisibleItem = true; } else li.style.display = 'none';
        });
        const header = ul.previousElementSibling; if (header && header.tagName === 'H4') header.style.display = hasVisibleItem ? 'block' : 'none';
    });
}

// ---------------- DATABASE MECHANISM (CLOUD VS LOCAL) ---------------- //

function saveDataTrigger() {
    let p10 = Math.max(0, parseInt(document.getElementById('price10').value) || 0); 
    let p11 = Math.max(0, parseInt(document.getElementById('price11').value) || 0); 
    let p12 = Math.max(0, parseInt(document.getElementById('price12').value) || 0); 
    let m = Math.max(1, parseInt(document.getElementById('mnojitel').value) || 1);
    const compD = {}; 
    deductions.forEach((val, idx) => { if (val > 0) compD[idx] = val; });
    
    let state = { r: rightTreeId, m: m, d: compD, p10: p10, p11: p11, p12: p12 };
    
    try { localStorage.setItem('tomeCalculatorState', JSON.stringify(state)); } catch(e){}
    
    if (currentUser) {
        db.collection("users").doc(currentUser.uid).set({
            calculatorState: state,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true }).catch(e => console.warn("Cloud save error:", e));
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
                    saveDataTrigger();
                } catch(e){}
            }
        }
        applyLanguage();
    }).catch(err => {
        console.error("Gagal sinkronisasi cloud, fallback ke lokal:", err);
        loadFromLocalStorage();
        applyLanguage();
    });
}

function parseStateToUI(state) {
    rightTreeId = state.r || 616;
    document.getElementById('mnojitel').value = state.m || 1;
    document.getElementById('price10').value = state.p10 || 0;
    document.getElementById('price11').value = state.p11 || 0;
    document.getElementById('price12').value = state.p12 || 0;
    deductions = [];
    if (state.d) { for (const k in state.d) deductions[parseInt(k)] = state.d[k]; }
}

function resetCalculator() {
    if (confirm(LANG[currentLang]['alertReset'])) {
        deductions = []; 
        localStorage.removeItem('tomeCalculatorState');
        document.getElementById('price10').value = 0; document.getElementById('price11').value = 0; document.getElementById('price12').value = 0; document.getElementById('mnojitel').value = 1;
        rightTreeId = favoriteTargetId ? parseInt(favoriteTargetId) : 616;
        
        if (currentUser) {
            db.collection("users").doc(currentUser.uid).set({
                calculatorState: { r: 616, m: 1, d: {}, p10: 0, p11: 0, p12: 0 },
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }
        
        processTree(rightTreeId);
        toggleMenu();
    }
}

// ==================== SELECTION FILTER HELPER (FIX FINAL) ====================
function filterBooks(query) {
    const q = query.toLowerCase().trim();
    
    // 1. Pastikan ID kontainernya BENAR: vyborDiv
    const vyborDiv = document.getElementById('vyborDiv');
    if (!vyborDiv) return;

    // 2. Loop setiap grup (ul) dari Level 6 sampai 1
    vyborDiv.querySelectorAll('ul').forEach(ul => {
        let hasVisibleItem = false;
        
        // Loop setiap item buku (li) di dalam grup tersebut
        ul.querySelectorAll('li').forEach(li => {
            const btn = li.querySelector('button');
            if (!btn) return;
            
            const id = btn.getAttribute('title');
            const bookName = (typeof TOME_DB !== 'undefined' && TOME_DB[id]) ? TOME_DB[id][4].toLowerCase() : '';
            
            // Cocokkan nama di TOME_DB dengan ketikan user
            if (bookName.includes(q)) {
                li.style.display = 'inline-block'; // Tampilkan tombol
                hasVisibleItem = true;             // Tandai bahwa grup ini punya isi
            } else {
                li.style.display = 'none';         // Sembunyikan tombol
            }
        });
        
        // 3. Sembunyikan atau tampilkan header "Level X" (h4)
        const header = ul.previousElementSibling;
        if (header && header.tagName === 'H4') {
            header.style.display = hasVisibleItem ? 'block' : 'none';
        }
    });
}

// ==================== MESIN SIMULATOR CRAFTING TOME ====================
function attemptCrafting(targetId) {
    if (!targetId) return;

    // Fungsi rekursif untuk mengecek dan memotong bahan secara virtual
    function tryCraftNode(nodeId, pool) {
        if (!nodeId) return false;
        
        // 1. Jika barang jadi (Tome/Bahan) sudah ada di inventory, pakai langsung
        if (pool[nodeId] && pool[nodeId] > 0) {
            pool[nodeId]--;
            return true;
        }

        // 2. Base mats (10, 11) tidak bisa dipecah lagi
        if (nodeId === 10 || nodeId === 11) return false; 
        
        // Tome Page (12) bisa dibuat otomatis jika ada 20 Token (10)
        if (nodeId === 12) {
            if (pool[10] >= 20) {
                pool[10] -= 20;
                return true;
            }
            return false;
        }

        // 3. Level 1 Tome (ID 101-109) -> Butuh 4 Page & 3 Fragment
        if (nodeId >= 101 && nodeId <= 109) {
            let backupPool = [...pool]; // Simpan state jika gagal di tengah jalan
            
            let pagesNeeded = 4;
            for(let i=0; i<4; i++) {
                if (pool[12] && pool[12] > 0) { pool[12]--; pagesNeeded--; }
                else if (pool[10] >= 20) { pool[10] -= 20; pagesNeeded--; }
            }
            
            let fragsNeeded = 3;
            for(let i=0; i<3; i++) {
                if (pool[11] && pool[11] > 0) { pool[11]--; fragsNeeded--; }
            }
            
            if (pagesNeeded === 0 && fragsNeeded === 0) {
                return true; // Bahan cukup!
            } else {
                // Rollback jika bahan kurang
                for(let i=0; i<pool.length; i++) pool[i] = backupPool[i] || 0;
                return false;
            }
        }

        // 4. Level 2 - 6 Tomes -> Butuh 3 sub-tome
        let recipe = TOME_DB[nodeId];
        if (!recipe) return false;

        let backupPool = [...pool];
        
        let s0 = tryCraftNode(recipe[0], pool);
        let s1 = tryCraftNode(recipe[1], pool);
        let s2 = tryCraftNode(recipe[2], pool);

        // Jika ketiga buku penyusun berhasil dibuat/dimiliki
        if (s0 && s1 && s2) {
            return true;
        } else {
            // Rollback jika gagal
            for(let i=0; i<pool.length; i++) pool[i] = backupPool[i] || 0;
            return false;
        }
    }

    // --- Mulai Eksekusi ---
    // Copy isi inventory nyata ke kolam simulasi
    let pool = [];
    for (let i = 0; i < deductions.length; i++) {
        pool[i] = deductions[i] || 0;
    }

    // Jalankan simulasi Crafting
    let success = tryCraftNode(targetId, pool);

    if (success) {
        // Terapkan hasil potongan bahan simulasi ke Inventory Asli
        for (let i = 0; i < pool.length; i++) {
            deductions[i] = pool[i] || 0;
        }
        
        // Tambahkan buku hasil craft ke Inventory
        if (!deductions[targetId]) deductions[targetId] = 0;
        deductions[targetId]++;
        
        saveDataTrigger(); // Simpan ke Cloud otomatis
        processTree(rightTreeId); // Segarkan UI
        
        // Mainkan efek Confetti Kemenangan!
        if (typeof confetti === 'function') {
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 }, colors: ['#fbbf24', '#f59e0b', '#d97706'] });
        }
		
		try {
            // Ganti 'success.mp3' dengan nama file atau URL link suara Anda
            let craftSound = new Audio('success.mp3'); 
            craftSound.volume = 0.6; // Mengatur volume (0.0 sampai 1.0)
            craftSound.play();
        } catch (error) {
            console.log("Gagal memutar suara, kemungkinan diblokir browser:", error);
        }
        
        const bookName = (TOME_DB[targetId] && TOME_DB[targetId][4]) ? TOME_DB[targetId][4] : "Target Tome";
        alert(`🎉 CRAFTING SUKSES!\n\n[${bookName}] telah berhasil dirakit dan dimasukkan ke Inventory Anda.`);
    } else {
        const bookName = (TOME_DB[targetId] && TOME_DB[targetId][4]) ? TOME_DB[targetId][4] : "Target Tome";
        alert(`❌ CRAFTING GAGAL!\n\nBahan baku atau sub-buku di Inventory Anda belum cukup untuk merakit [${bookName}].`);
    }
}

window.onload = () => { applyLanguage(); document.getElementById('modalInput').addEventListener('keydown', function(e) { if(e.key === 'Enter') confirmModal(); }); };