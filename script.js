// script.js - File Logika & Database Kalkulator Tome
const LANG = {
    id: { title1: "Pohon Lengkap", title2: "Cabang Terpilih", title3: "Estimasi Biaya Pasar", title4: "📦 Inventory (Bahan Dimiliki)", desc1: "Arahkan kursor ke ikon untuk melihat nama buku.", desc3: "Masukkan harga pasar per item untuk mengestimasi Gold yang dibutuhkan.", desc4: "Item di sini akan otomatis mengurangi total kebutuhan.", progText: "Progres Pengumpulan:", btnCalc: "Hitung Kuantitas", totalCostLabel: "Total Sisa Biaya:", menuBtnText: "⚙️ Buka Menu", btnTarget: "📚 Pilihan Buku Target", btnShare: "🔗 Bagikan Build (Copy)", btnExport: "📸 Download Gambar Build", btnReset: "🔄 Reset Kalkulator", searchPlaceholder: "🔍 Cari nama buku target...", modalTitleAdd: "Tambah Buku/Bahan", modalDesc: "Berapa banyak item ini yang sudah Anda miliki saat ini?", btnSave: "Simpan", btnCancel: "Batal", baseMat: "Bahan Dasar", lvl: "Level", alertCopy: "Link Build berhasil disalin ke clipboard!", alertReset: "Hapus semua perhitungan, profil, dan mulai dari awal?", promptCopy: "Salin tautan di bawah ini:", statEquipDesc: "* Mengikat saat digunakan (Bind on Equip).", footerText: "Kalkulator Tome © 2026 | Dibuat oleh <strong>Sulfikar</strong>", matDesc: "Bahan Crafting" },
    en: { title1: "Total Requirements", title2: "Selected Branch", title3: "Market Cost Estimator", title4: "📦 Inventory (Owned Items)", desc1: "Hover over the icons to see the book names.", desc3: "Enter the market price per item to estimate required Gold.", desc4: "Items here will automatically deduct from total requirements.", progText: "Collection Progress:", btnCalc: "Calculate Qty", totalCostLabel: "Total Remaining Cost:", menuBtnText: "⚙️ Open Menu", btnTarget: "Target Book Selection", btnShare: "🔗 Share Build (Copy)", btnExport: "📸 Download Build Image", btnReset: "🔄 Reset Calculator", searchPlaceholder: "🔍 Search target book name...", modalTitleAdd: "Add Book/Material", modalDesc: "How many of this item do you currently own?", btnSave: "Save", btnCancel: "Cancel", baseMat: "Base Materials", lvl: "Level", alertCopy: "Build Link successfully copied to clipboard!", alertReset: "Clear all calculations, profiles, and start over?", promptCopy: "Copy the link below:", statEquipDesc: "* Bind on Equip.", footerText: "Tome Calculator © 2026 | Created by <strong>Sulfikar</strong>", matDesc: "Crafting Material" }
};

let currentLang = localStorage.getItem('tomeLang') || 'id';

function applyLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (LANG[currentLang][key]) {
            if (el.tagName === 'INPUT') el.placeholder = LANG[currentLang][key];
            else el.innerHTML = LANG[currentLang][key]; 
        }
    });
    
    document.getElementById('langBtn').innerText = currentLang === 'id' ? '🌐 Switch to English' : '🌐 Ganti ke Indonesia';
    document.getElementById('menuToggleBtn').innerText = LANG[currentLang]['menuBtnText'];
    
    processTree(leftTreeId, false);
    processTree(rightTreeId, true);
    renderDeductions();
    renderMenu();
}

function toggleLanguage() {
    currentLang = currentLang === 'id' ? 'en' : 'id';
    localStorage.setItem('tomeLang', currentLang);
    applyLanguage();
}

const TOME_DB = [];
TOME_DB[601] = [501, 502, 509, 17615, 'The Calm of Ice']; TOME_DB[602] = [502, 503, 505, 17622, 'The Khatru']; TOME_DB[603] = [504, 503, 508, 17628, 'A Carmine Tear']; TOME_DB[604] = [503, 508, 501, 17630, 'The Fruit of Intense Labor']; TOME_DB[605] = [505, 512, 509, 17634, 'Tomorrows Phoenix']; TOME_DB[606] = [505, 506, 507, 17636, 'Riding the Scree']; TOME_DB[607] = [513, 514, 507, 17642, 'Turning the Tide']; TOME_DB[608] = [508, 506, 514, 17649, 'Existential Woe']; TOME_DB[609] = [510, 501, 505, 17655, 'Book of Fragrances']; TOME_DB[610] = [510, 506, 501, 17657, 'Bouquet of Regrets']; TOME_DB[611] = [511, 509, 505, 17661, 'The Union']; TOME_DB[612] = [511, 513, 503, 17663, 'Oblivious Enlightenment']; TOME_DB[613] = [513, 507, 514, 17669, 'As the Universe Fades']; TOME_DB[614] = [514, 512, 513, 17676, 'The Concubines Laugh']; TOME_DB[615] = [515, 501, 507, 17679, 'The Academy of the East']; TOME_DB[616] = [516, 515, 514, 17683, 'Pan Gu Creator'];
TOME_DB[501] = [401, 408, 405, 17618, 'A Heart like Still Water']; TOME_DB[502] = [409, 405, 403, 17621, 'The Tsunamis of Yore']; TOME_DB[503] = [404, 408, 401, 17624, 'Laughing Mad']; TOME_DB[504] = [408, 404, 401, 17627, 'The Book of Congratulations']; TOME_DB[505] = [403, 409, 404, 17633, 'The Wrath of Heaven']; TOME_DB[506] = [409, 403, 402, 17639, 'A Strange Kindness']; TOME_DB[507] = [402, 404, 409, 17645, 'Flesh of the Lamia']; TOME_DB[508] = [404, 408, 402, 17648, 'Everything is Emptiness']; TOME_DB[509] = [403, 401, 405, 17651, 'The Oasis Remembered']; TOME_DB[510] = [401, 405, 407, 17654, 'The Heavenly Scent']; TOME_DB[511] = [403, 409, 404, 17660, 'Debt and Tombstones']; TOME_DB[512] = [409, 403, 404, 17666, 'Endless Waves']; TOME_DB[513] = [408, 402, 404, 17672, 'Parting Grief']; TOME_DB[514] = [408, 402, 404, 17675, 'Rouge and Red Lips']; TOME_DB[515] = [406, 407, 401, 17678, 'Gang of Hooligans']; TOME_DB[516] = [406, 407, 401, 17682, 'The Voidlands'];
TOME_DB[401] = [303, 307, 304, 17602, 'Burning Desire']; TOME_DB[402] = [304, 301, 305, 17603, 'Tome of Predestination']; TOME_DB[403] = [302, 305, 303, 17604, 'The Roses Thorn']; TOME_DB[404] = [306, 307, 301, 17605, 'Letters of Social Unrest']; TOME_DB[405] = [303, 307, 306, 17606, 'The Appetites of Spring']; TOME_DB[406] = [308, 205, 207, 17610, 'The Rivers Edge']; TOME_DB[407] = [309, 302, 306, 17614, 'The Weak Stream of Many Miles']; TOME_DB[408] = [301, 304, 302, 17600, 'Battle Tactics']; TOME_DB[409] = [302, 305, 303, 17601, 'A Bewitching Proposal'];
TOME_DB[301] = [201, 206, 203, 17593, 'Eat Drink and be Merry']; TOME_DB[302] = [202, 205, 206, 17594, 'Sunset Tales']; TOME_DB[303] = [207, 203, 202, 17595, 'Adventures and Mishaps']; TOME_DB[304] = [204, 201, 203, 17596, 'The Sunny Pass']; TOME_DB[305] = [205, 202, 201, 17597, 'Tales of Beauty']; TOME_DB[306] = [206, 203, 201, 17598, 'The Bards Wanderlust']; TOME_DB[307] = [207, 205, 204, 17599, 'A Poets Musings']; TOME_DB[308] = [208, 202, 204, 17609, 'Decaying Tome']; TOME_DB[309] = [209, 203, 202, 17613, 'Scene of Carnage'];
TOME_DB[201] = [101, 102, 103, 17584, 'Tome of Water']; TOME_DB[202] = [102, 103, 104, 17585, 'Tome of Fire']; TOME_DB[203] = [103, 104, 105, 17586, 'Tome of Earth']; TOME_DB[204] = [104, 105, 106, 17587, 'Tome of Wood']; TOME_DB[205] = [105, 106, 107, 17588, 'Tome of Metal']; TOME_DB[206] = [106, 107, 108, 17589, 'Tome of Wind']; TOME_DB[207] = [107, 108, 109, 17590, 'Tome of Thunder']; TOME_DB[208] = [108, 109, 101, 17591, 'Tome of Light']; TOME_DB[209] = [109, 101, 102, 17592, 'Tome of Darkness'];
TOME_DB[101] = [0, 0, 0, 17001, 'Grace']; TOME_DB[102] = [0, 0, 0, 17002, 'Power']; TOME_DB[103] = [0, 0, 0, 17003, 'Courage']; TOME_DB[104] = [0, 0, 0, 17004, 'Wisdom']; TOME_DB[105] = [0, 0, 0, 17005, 'Yin']; TOME_DB[106] = [0, 0, 0, 17006, 'Yang']; TOME_DB[107] = [0, 0, 0, 17007, 'Life']; TOME_DB[108] = [0, 0, 0, 17008, 'Death']; TOME_DB[109] = [0, 0, 0, 17009, 'Void'];

const TOME_STATS = {
    101: ["+5 Magic"], 102: ["+5 Strength"], 103: ["+5 Dexterity"], 104: ["+5 Vitality"],
    105: ["HP Regeneration +3", "Exp Gain +1%"], 106: ["MP Regeneration +3", "Exp Gain +1%"],
    107: ["+4 Strength", "+3 Vitality"], 108: ["+4 Dexterity", "+3 Vitality"], 109: ["+4 Magic", "+3 Vitality"],
    201: ["+7 Magic", "+6 Vitality"], 202: ["+7 Strength", "+6 Vitality"], 203: ["+7 Dexterity", "+6 Vitality"],
    204: ["+9 Magic"], 205: ["+9 Strength"], 206: ["+9 Dexterity"], 207: ["+9 Vitality"],
    208: ["HP Regeneration +5", "Exp Gain +2%"], 209: ["MP Regeneration +5", "Exp Gain +2%"],
    301: ["+10 Strength", "Critical Hit Rate +1%"], 302: ["+10 Magic", "Channelling -1%"],
    303: ["+10 Dexterity", "Critical Hit Rate +1%"], 304: ["+10 Vitality", "Maximum HP +100"],
    305: ["+7 Strength", "+7 Dexterity"], 306: ["+7 Magic", "+7 Vitality"], 307: ["+12 Strength"],
    308: ["+12 Dexterity"], 309: ["+12 Magic"],
    401: ["+15 Strength", "Critical Hit Rate +1%"], 402: ["+15 Magic", "Channelling -2%"],
    403: ["+15 Dexterity", "Critical Hit Rate +1%"], 404: ["+15 Vitality", "Maximum HP +150"],
    405: ["+10 Strength", "+10 Vitality"], 406: ["+10 Dexterity", "+10 Vitality"], 407: ["+10 Magic", "+10 Vitality"],
    408: ["+8 Strength", "+8 Dexterity", "+8 Vitality"], 409: ["+8 Magic", "+8 Dexterity", "+8 Vitality"],
    501: ["+20 Strength", "Critical Hit Rate +1%"], 502: ["+20 Magic", "Channelling -2%"],
    503: ["+20 Dexterity", "Critical Hit Rate +1%"], 504: ["+20 Vitality", "Maximum HP +200"],
    505: ["+15 Strength", "+15 Dexterity"], 506: ["+15 Magic", "+15 Vitality"],
    507: ["+12 Strength", "+12 Dexterity", "+12 Vitality"], 508: ["+12 Magic", "+12 Dexterity", "+12 Vitality"],
    509: ["+10 Strength", "+10 Dexterity", "+10 Magic", "+10 Vitality"], 510: ["+15 Strength", "Physical Attack +20"],
    511: ["+15 Magic", "Magic Attack +20"], 512: ["+15 Dexterity", "Critical Hit Rate +2%"],
    513: ["+15 Vitality", "Physical Defense +100"], 514: ["Maximum HP +300"], 515: ["+18 Magic", "Channelling -3%"],
    516: ["+18 Strength", "Critical Hit Rate +2%"],
    601: ["+15 Strength", "+15 Dexterity", "Critical Hit Rate +1%"], 602: ["+15 Magic", "+15 Vitality", "Channelling -3%"],
    603: ["+15 Strength", "+15 Vitality", "Maximum HP +150"], 604: ["+20 Dexterity", "Attack Interval -0.05", "Movement Speed +0.10"],
    605: ["+20 Magic", "Channelling -3", "Maximum MP +200"], 606: ["+20 Strength", "Critical Hit Rate +1%", "Physical Attack +30"],
    607: ["+20 Vitality", "Maximum HP +200", "Physical Defense +50"], 608: ["+10 Strength", "+10 Dexterity", "+10 Magic", "+10 Vitality"],
    609: ["+15 Dexterity", "+15 Vitality", "Critical Hit Rate +1%"], 610: ["+15 Magic", "+15 Dexterity", "Channelling -3%"],
    611: ["+15 Strength", "+15 Magic", "Physical Attack +20"], 612: ["+25 Magic", "Channelling -3%"],
    613: ["+25 Strength", "Critical Hit Rate +1%"], 614: ["+25 Dexterity", "Attack Interval -0.05"],
    615: ["+20 Magic", "+20 Dexterity", "Channelling -3%", "Critical Hit Rate +1%"],
    616: ["+20 Strength", "+20 Dexterity", "+20 Magic", "+20 Vitality", "Critical Hit Rate +1%"]
};

let itemCounts = [];       
let deductions = [];       
let deductionsCopy = [];   
let leftTreeId = 616;
let rightTreeId = 515;
let activeModalItemId = null;
let profiles = {};
let currentProfile = 'Default';

function showTooltip(element, event) {
    const id = parseInt(element.title);
    if (!TOME_DB[id] && id !== 10 && id !== 11 && id !== 12) return;
    
    let title = "", stats = [], levelText = "";
    if (id >= 10 && id <= 12) {
        levelText = LANG[currentLang]['matDesc'];
        if (id === 10) title = "Token of Luck";
        if (id === 11) title = "Tome Fragment";
        if (id === 12) title = "Tome Page";
    } else {
        title = TOME_DB[id][4];
        levelText = LANG[currentLang]['lvl'] + " " + Math.floor(id / 100);
        stats = TOME_STATS[id] || [];
    }
    
    const tooltip = document.getElementById('floatingTooltip');
    let html = `<div class="tooltip-title">${title}</div><div class="tooltip-type">${levelText}</div><div class="tooltip-list">`;
    if (stats.length > 0) {
        stats.forEach(s => { html += `<div class="tooltip-stat">${s}</div>`; });
        html += `<div class="tooltip-footer">${LANG[currentLang]['statEquipDesc']}</div>`;
    }
    html += `</div>`;
    tooltip.innerHTML = html;
    tooltip.style.display = 'block';
    moveTooltip(event);
}

function moveTooltip(event) {
    const tooltip = document.getElementById('floatingTooltip');
    let x = event.clientX + 15;
    let y = event.clientY + 15;
    if (x + tooltip.offsetWidth > window.innerWidth) x = event.clientX - tooltip.offsetWidth - 15;
    if (y + tooltip.offsetHeight > window.innerHeight) y = event.clientY - tooltip.offsetHeight - 15;
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
}

function hideTooltip() {
    document.getElementById('floatingTooltip').style.display = 'none';
}

function processTree(id, isRight) {
    itemCounts = [];
    if (!TOME_DB[id]) return;
    
    let multiplier = isRight ? parseInt(document.getElementById('mnojitel').value) || 1 : 1;
    calculateRequirements(id, multiplier);
    
    deductions.forEach(d => {
        if (itemCounts[d.id]) {
            itemCounts[d.id] = Math.max(0, itemCounts[d.id] - d.count);
        }
    });
    
    convertLowerMaterials();
    
    let html = `<ul><li>${TOME_DB[id][4]}</li>`;
    for (let i in itemCounts) {
        if (itemCounts[i] > 0) {
            let bgPos = getBgPosition(i);
            html += `<li><button title="${i}" style="background-position:${bgPos}" onmousemove="showTooltip(this, event)" onmouseout="hideTooltip()" onClick="openModal(${i})"></button><b>${itemCounts[i]}</b></li>`;
        }
    }
    html += `</ul>`;
    
    if (isRight) {
        document.getElementById('rightTree').innerHTML = html;
        updateCostAndProgress();
    } else {
        document.getElementById('leftTree').innerHTML = html;
    }
}

function calculateRequirements(id, count) {
    if (!TOME_DB[id]) return;
    let components = TOME_DB[id];
    if (components[0] === 0) {
        itemCounts[id] = (itemCounts[id] || 0) + count;
        return;
    }
    calculateRequirements(components[0], count);
    calculateRequirements(components[1], count);
    calculateRequirements(components[2], count);
}

function convertLowerMaterials() {
    for (let i = 109; i >= 101; i--) {
        if (itemCounts[i] > 0) {
            let qty = itemCounts[i];
            itemCounts[10] = (itemCounts[10] || 0) + (qty * 4);
            itemCounts[11] = (itemCounts[11] || 0) + (qty * 3);
            itemCounts[12] = (itemCounts[12] || 0) + qty;
            itemCounts[i] = 0;
        }
    }
}

function getBgPosition(id) {
    id = parseInt(id);
    if (id === 10) return "32px -32px";
    if (id === 11) return "64px 0px";
    if (id === 12) return "32px 0px";
    if (!TOME_DB[id]) return "0px 0px";
    let iconId = TOME_DB[id][3];
    let row = Math.floor((iconId - 17001) / 30) || 0;
    let col = (iconId - 17001) % 30;
    if (iconId >= 17584) {
        let offset = iconId - 17584;
        row = 3 + Math.floor(offset / 30);
        col = offset % 30;
    }
    return `-${col * 32}px -${row * 32}px`;
}

function updateCostAndProgress() {
    let p10 = parseInt(document.getElementById('price10').value) || 0;
    let p11 = parseInt(document.getElementById('price11').value) || 0;
    let p12 = parseInt(document.getElementById('price12').value) || 0;
    
    let req10 = itemCounts[10] || 0;
    let req11 = itemCounts[11] || 0;
    let req12 = itemCounts[12] || 0;
    
    let totalCost = (req10 * p10) + (req11 * p11) + (req12 * p12);
    document.getElementById('totalCostDisplay').innerText = totalCost.toLocaleString('id-ID') + " Gold";
    
    // Progress calculation
    let totalNeededRaw = 0, totalOwnedRaw = 0;
    deductionsCopy = [];
    calculateRequirements(rightTreeId, parseInt(document.getElementById('mnojitel').value) || 1);
    for (let i in itemCounts) {
        if (i <= 109) totalNeededRaw += itemCounts[i] * 8; // weight system
    }
    
    deductions.forEach(d => {
        totalOwnedRaw += d.count * 8;
    });
    
    let percentage = totalNeededRaw > 0 ? (totalOwnedRaw / (totalNeededRaw + totalOwnedRaw)) * 100 : 0;
    if (percentage > 100) percentage = 100;
    document.getElementById('progressBar').style.width = percentage + "%";
    document.getElementById('progressPercentText').innerText = percentage.toFixed(1) + "%";
    
    if (percentage === 100 && totalNeededRaw === 0) {
        triggerConfetti();
    }
    saveProfilesToStorage();
}

function openModal(id) {
    activeModalItemId = id;
    document.getElementById('customModal').style.display = 'flex';
    document.getElementById('modalInput').value = 1;
    document.getElementById('modalInput').focus();
}

function closeModal() {
    document.getElementById('customModal').style.display = 'none';
}

function confirmModal() {
    let count = parseInt(document.getElementById('modalInput').value) || 0;
    if (count > 0 && activeModalItemId) {
        let existing = deductions.find(d => d.id === activeModalItemId);
        if (existing) existing.count += count;
        else deductions.push({ id: activeModalItemId, count: count });
        
        renderDeductions();
        processTree(rightTreeId, true);
    }
    closeModal();
}

function removeDeduction(id) {
    deductions = deductions.filter(d => d.id !== id);
    renderDeductions();
    processTree(rightTreeId, true);
}

function renderDeductions() {
    let html = `<ul><li>${LANG[currentLang]['baseMat']}</li>`;
    let hasItems = false;
    deductions.forEach(d => {
        hasItems = true;
        let bgPos = getBgPosition(d.id);
        let name = (d.id >= 10 && d.id <= 12) ? (d.id===10?"Token of Luck":d.id===11?"Tome Fragment":"Tome Page") : TOME_DB[d.id][4];
        html += `<li><button title="${d.id}" style="background-position:${bgPos}" onmousemove="showTooltip(this, event)" onmouseout="hideTooltip()"></button><b>${d.count}</b><span onClick="removeDeduction(${d.id})"></span></li>`;
    });
    html += `</ul>`;
    document.getElementById('deductionsList').innerHTML = hasItems ? html : `<div style="padding:15px; color:var(--text-muted); font-size:0.85rem; text-align:center;">Empty</div>`;
}

function openInventoryModal() {
    document.getElementById('inventoryModal').style.display = 'flex';
    filterInventorySearch('');
}

function closeModalInventoryModal() {
    document.getElementById('inventoryModal').style.display = 'none';
}

function closeInventoryModal() { closeModalInventoryModal(); }

function filterInventorySearch(val) {
    let html = `<ul>`;
    // Add raw materials
    let mats = [{id:12, n:"Tome Page"}, {id:11, n:"Tome Fragment"}, {id:10, n:"Token of Luck"}];
    mats.forEach(m => {
        if (m.n.toLowerCase().includes(val.toLowerCase())) {
            html += `<li><button title="${m.id}" style="background-position:${getBgPosition(m.id)}" onClick="selectInventoryItem(${m.id})"></button></li>`;
        }
    });
    // Add books
    for (let i = 101; i <= 616; i++) {
        if (TOME_DB[i] && TOME_DB[i][4].toLowerCase().includes(val.toLowerCase())) {
            html += `<li><button title="${i}" style="background-position:${getBgPosition(i)}" onClick="selectInventoryItem(${i})"></button></li>`;
        }
    }
    html += `</ul>`;
    document.getElementById('invItemList').innerHTML = html;
}

function selectInventoryItem(id) {
    closeInventoryModal();
    openModal(id);
}

function toggleBookPanel() {
    let box = document.getElementById('bookSearch');
    let div = document.getElementById('vyborDiv');
    let state = box.style.display === 'none' ? 'block' : 'none';
    box.style.display = state;
    div.style.display = state;
}

function renderMenu() {
    let html = "";
    for (let lvl = 6; lvl >= 1; lvl--) {
        html += `<h4>Level ${lvl}</h4><ul>`;
        for (let i = lvl*100; i <= lvl*100+30; i++) {
            if (TOME_DB[i]) {
                html += `<li><button title="${i}" style="background-position:${getBgPosition(i)}" onmousemove="showTooltip(this, event)" onmouseout="hideTooltip()" onClick="setTrees(${i})"></button></li>`;
            }
        }
        html += `</ul>`;
    }
    document.getElementById('vyborDiv').innerHTML = html;
}

function setTrees(id) {
    leftTreeId = id;
    rightTreeId = id;
    processTree(leftTreeId, false);
    processTree(rightTreeId, true);
}

function filterBooks(val) {
    if(!val) { renderMenu(); return; }
    let html = `<ul>`;
    for (let i = 101; i <= 616; i++) {
        if (TOME_DB[i] && TOME_DB[i][4].toLowerCase().includes(val.toLowerCase())) {
            html += `<li><button title="${i}" style="background-position:${getBgPosition(i)}" onmousemove="showTooltip(this, event)" onmouseout="hideTooltip()" onClick="setTrees(${i})"></button></li>`;
        }
    }
    html += `</ul>`;
    document.getElementById('vyborDiv').innerHTML = html;
}

function resetCalculator() {
    if (confirm(LANG[currentLang]['alertReset'])) {
        deductions = [];
        document.getElementById('price10').value = 0;
        document.getElementById('price11').value = 0;
        document.getElementById('price12').value = 0;
        document.getElementById('mnojitel').value = 1;
        setTrees(616);
        renderDeductions();
        updateCostAndProgress();
    }
}

function triggerConfetti() {
    canvasConfetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
}

function loadProfiles() {
    let data = localStorage.getItem('tomeProfiles');
    if (data) {
        profiles = JSON.parse(data);
    } else {
        profiles = { 'Default': { left: 616, right: 616, qty: 1, p10: 0, p11: 0, p12: 0, items: [] } };
    }
    currentProfile = localStorage.getItem('tomeCurrentProfile') || 'Default';
    if (!profiles[currentProfile]) currentProfile = Object.keys(profiles)[0];
    
    renderProfileSelect();
    applyProfile(currentProfile);
}

function renderProfileSelect() {
    let select = document.getElementById('profileSelect');
    select.innerHTML = "";
    for (let name in profiles) {
        let opt = document.createElement('option');
        opt.value = name; opt.innerText = name;
        if (name === currentProfile) opt.selected = true;
        select.appendChild(opt);
    }
}

function applyProfile(name) {
    let p = profiles[name];
    if (!p) return;
    leftTreeId = p.left || 616;
    rightTreeId = p.right || 616;
    document.getElementById('mnojitel').value = p.qty || 1;
    document.getElementById('price10').value = p.p10 || 0;
    document.getElementById('price11').value = p.p11 || 0;
    document.getElementById('price12').value = p.p12 || 0;
    deductions = p.items || [];
    
    processTree(leftTreeId, false);
    processTree(rightTreeId, true);
    renderDeductions();
}

function saveProfilesToStorage() {
    profiles[currentProfile] = {
        left: leftTreeId, right: rightTreeId,
        qty: parseInt(document.getElementById('mnojitel').value) || 1,
        p10: parseInt(document.getElementById('price10').value) || 0,
        p11: parseInt(document.getElementById('price11').value) || 0,
        p12: parseInt(document.getElementById('price12').value) || 0,
        items: deductions
    };
    localStorage.setItem('tomeProfiles', JSON.stringify(profiles));
    localStorage.setItem('tomeCurrentProfile', currentProfile);
}

function handleProfileChange(val) {
    currentProfile = val;
    applyProfile(val);
}

function createNewProfile() {
    let name = prompt("Masukkan nama profil baru:");
    if (name && name.trim()) {
        name = name.trim();
        if (profiles[name]) return alert("Nama profil sudah ada!");
        profiles[name] = { left: 616, right: 616, qty: 1, p10: 0, p11: 0, p12: 0, items: [] };
        currentProfile = name;
        renderProfileSelect();
        applyProfile(name);
    }
}

function removeCurrentProfile() {
    if (Object.keys(profiles).length <= 1) return alert("Anda tidak bisa menghapus semua profil!");
    if (confirm("Hapus profil ini?")) {
        delete profiles[currentProfile];
        currentProfile = Object.keys(profiles)[0];
        renderProfileSelect();
        applyProfile(currentProfile);
    }
}

function exportProfilesData() {
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profiles));
    let dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "tome_kalkulator_profiles.json");
    dlAnchorElem.click();
}

function importProfilesData(event) {
    let input = event.target;
    let reader = new FileReader();
    reader.onload = function() {
        try {
            let imported = JSON.parse(reader.result);
            if (imported && typeof imported === 'object') {
                profiles = imported;
                currentProfile = Object.keys(profiles)[0];
                renderProfileSelect();
                applyProfile(currentProfile);
            }
        } catch(e) { alert("Format file JSON tidak valid!"); }
    };
    reader.readAsText(input.files[0]);
}

function copyShareLink() {
    let state = {
        l: leftTreeId, r: rightTreeId, q: document.getElementById('mnojitel').value,
        p10: document.getElementById('price10').value, p11: document.getElementById('price11').value, p12: document.getElementById('price12').value,
        d: deductions.map(d => `${d.id}-${d.count}`).join(',')
    };
    let base64 = btoa(JSON.stringify(state));
    let url = window.location.origin + window.location.pathname + "?build=" + base64;
    
    navigator.clipboard.writeText(url).then(() => { alert(LANG[currentLang]['alertCopy']); })
    .catch(() => { prompt(LANG[currentLang]['promptCopy'], url); });
}

function parseShareLink() {
    let params = new URLSearchParams(window.location.search);
    let build = params.get('build');
    if (build) {
        try {
            let p = JSON.parse(atob(build));
            leftTreeId = p.l || 616; rightTreeId = p.r || 616;
            document.getElementById('mnojitel').value = p.q || 1;
            document.getElementById('price10').value = p.p10 || 0;
            document.getElementById('price11').value = p.p11 || 0;
            document.getElementById('price12').value = p.p12 || 0;
            if (p.d) {
                deductions = p.d.split(',').map(x => { let s = x.split('-'); return { id: parseInt(s[0]), count: parseInt(s[1]) }; });
            }
        } catch(e) { console.error("Gagal memuat link share build."); }
    }
}

function exportToImage(e) {
    e.preventDefault();
    html2canvas(document.body, { backgroundColor: "#0f172a" }).then(canvas => {
        let link = document.createElement('a');
        link.download = 'tome_calculator_build.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

// Inisialisasi awal saat halaman web dimuat
window.onload = function() {
    parseShareLink();
    loadProfiles();
    applyLanguage();
};