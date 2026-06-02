// DATABASE UTAMA KATA KUNCI & PEMBUATAN BUKU TOME
const TOME_DB = {
    3: [
        { id: 301, sprite: "0 -32px", name: { id: "Gale", en: "Gale", ru: "Шквал" }, recipe: [10, 10, 10] },
        { id: 302, sprite: "-32px -32px", name: { id: "The River God", en: "The River God", ru: "Речной бог" }, recipe: [10, 10, 10] },
        { id: 303, sprite: "-64px -32px", name: { id: "Divine Speed", en: "Divine Speed", ru: "Божественная скорость" }, recipe: [10, 10, 10] },
        { id: 304, sprite: "-96px -32px", name: { id: "Lone Red Flower", en: "Lone Red Flower", ru: "Одинокий красный цветок" }, recipe: [10, 10, 10] },
        { id: 305, sprite: "-128px -32px", name: { id: "A Fragrant Patch", en: "A Fragrant Patch", ru: "Благоухающий участок" }, recipe: [10, 10, 10] },
        { id: 306, sprite: "-160px -32px", name: { id: "Collapse", en: "Collapse", ru: "Обрушение" }, recipe: [10, 10, 10] },
        { id: 307, sprite: "-192px -32px", name: { id: "Spring breeze", en: "Spring breeze", ru: "Весенний бриз" }, recipe: [10, 10, 10] },
        { id: 308, sprite: "-224px -32px", name: { id: "Yearning", en: "Yearning", ru: "Тоска" }, recipe: [10, 10, 10] }
    ],
    4: [
        { id: 401, sprite: "0 -64px", name: { id: "The Moon's Solitude", en: "The Moon's Solitude", ru: "Уединение луны" }, recipe: [301, 302, 11] },
        { id: 402, sprite: "-32px -64px", name: { id: "Sunset", en: "Sunset", ru: "Закат" }, recipe: [303, 304, 11] },
        { id: 403, sprite: "-64px -64px", name: { id: "Rivers and Seas", en: "Rivers and Seas", ru: "Реки и моря" }, recipe: [305, 306, 11] },
        { id: 404, sprite: "-96px -64px", name: { id: "Glacial Isolation", en: "Glacial Isolation", ru: "Ледниковая изоляция" }, recipe: [307, 308, 11] },
        { id: 405, sprite: "-128px -64px", name: { id: "Flower's Scream", en: "Flower's Scream", ru: "Крик цветка" }, recipe: [301, 304, 11] },
        { id: 406, sprite: "-160px -64px", name: { id: "Autumn thoughts", en: "Autumn thoughts", ru: "Осенние мысли" }, recipe: [302, 303, 11] },
        { id: 407, sprite: "-192px -64px", name: { id: "Green Meadow", en: "Green Meadow", ru: "Зеленый луг" }, recipe: [305, 308, 11] },
        { id: 408, sprite: "-224px -64px", name: { id: "Anger", en: "Anger", ru: "Гнев" }, recipe: [306, 307, 11] }
    ],
    5: [
        { id: 501, sprite: "0 -96px", name: { id: "Warm Jade", en: "Warm Jade", ru: "Теплый нефрит" }, recipe: [401, 402, 12] },
        { id: 502, sprite: "-32px -96px", name: { id: "Red Lotus", en: "Red Lotus", ru: "Красный лотос" }, recipe: [403, 404, 12] },
        { id: 503, sprite: "-64px -96px", name: { id: "Hidden Dragon", en: "Hidden Dragon", ru: "Скрытый дракон" }, recipe: [405, 406, 12] },
        { id: 504, sprite: "-96px -96px", name: { id: "Crying Swallow", en: "Crying Swallow", ru: "Плачущая ласточка" }, recipe: [407, 408, 12] },
        { id: 505, sprite: "-128px -96px", name: { id: "God's Grace", en: "God's Grace", ru: "Божья благодать" }, recipe: [401, 403, 12] },
        { id: 506, sprite: "-160px -96px", name: { id: "Proud Scholar", en: "Proud Scholar", ru: "Гордый ученый" }, recipe: [402, 404, 12] },
        { id: 507, sprite: "-192px -96px", name: { id: "Waterfall", en: "Waterfall", ru: "Водопад" }, recipe: [405, 407, 12] },
        { id: 508, sprite: "-224px -96px", name: { id: "Purity", en: "Purity", ru: "Чистота" }, recipe: [406, 408, 12] }
    ],
    6: [
        { id: 601, sprite: "0 -128px", name: { id: "The One-Matrix", en: "The One-Matrix", ru: "Единая матрица" }, recipe: [501, 502, 503] },
        { id: 602, sprite: "-32px -128px", name: { id: "The Spring", en: "The Spring", ru: "Весна" }, recipe: [504, 505, 506] },
        { id: 603, sprite: "-64px -128px", name: { id: "The Fire-Matrix", en: "The Fire-Matrix", ru: "Огненная матрица" }, recipe: [507, 508, 501] },
        { id: 604, sprite: "-96px -128px", name: { id: "The River-Matrix", en: "The River-Matrix", ru: "Речная матрица" }, recipe: [502, 503, 504] },
        { id: 605, sprite: "-128px -128px", name: { id: "Love's Sickle", en: "Love's Sickle", ru: "Серп любви" }, recipe: [505, 506, 507] },
        { id: 606, sprite: "-160px -128px", name: { id: "A Flash", en: "A Flash", ru: "Вспышка" }, recipe: [508, 501, 502] },
        { id: 607, sprite: "-192px -128px", name: { id: "God's Tear", en: "God's Tear", ru: "Слеза бога" }, recipe: [503, 504, 505] },
        { id: 608, sprite: "-224px -128px", name: { id: "The Void-Matrix", en: "The Void-Matrix", ru: "Матрица пустоты" }, recipe: [506, 507, 508] }
    ]
};

// SITEM MULTI-BAHASA (LOCALIZATION)
const LANG = {
    id: {
        title: "Kalkulator Tome", subtitle: "Perfect World Mobile — Edisi Imersif",
        marketPrices: "Harga Pasar Bahan Dasar", btnReset: "Reset", labelQuantity: "Jumlah Pembuatan",
        itemLevel1: "Tome Frag. Lvl 1", itemLevel2: "Tome Frag. Lvl 2", itemLevel3: "Tome Frag. Lvl 3",
        craftingTree: "Pohon Struktur Crafting", totalCost: "Total Biaya Belanja Pasar:",
        alertReset: "Apakah Anda ingin mereset harga dan pilihan?", selectPrompt: "Pilih Tome Terlebih Dahulu"
    },
    en: {
        title: "Tome Calculator", subtitle: "Perfect World Mobile — Immersive Edition",
        marketPrices: "Base Item Market Prices", btnReset: "Reset", labelQuantity: "Craft Quantity",
        itemLevel1: "Tome Frag. Lvl 1", itemLevel2: "Tome Frag. Lvl 2", itemLevel3: "Tome Frag. Lvl 3",
        craftingTree: "Crafting Tree Structure", totalCost: "Total Market Cost:",
        alertReset: "Do you want to reset prices and selections?", selectPrompt: "Select a Tome First"
    },
    ru: {
        title: "Калькулятор Трактатов", subtitle: "Perfect World Mobile — Иммерсивное издание",
        marketPrices: "Рыночные цены ресурсов", btnReset: "Сброс", labelQuantity: "Количество крафта",
        itemLevel1: "Обрывок трактата Лвл 1", itemLevel2: "Обрывок трактата Лвл 2", itemLevel3: "Обрывок трактата Лвл 3",
        craftingTree: "Структурное дерево крафта", totalCost: "Итоговая стоимость рынка:",
        alertReset: "Вы хотите сбросить цены и выбор?", selectPrompt: "Сначала выберите Трактат"
    }
};

// STATE MANAGEMENT GLOBAL
let currentLang = 'id';
let activeTab = 3;
let rightTreeId = null;
let deductions = [];

// SINKRONISASI INITIATION SAAT DOM SELESAI DI-RENDER
document.addEventListener("DOMContentLoaded", () => {
    loadFromLocalStorage();
    setLanguage(currentLang);
    switchTab(activeTab);
    if (rightTreeId) {
        selectRightTree(rightTreeId);
    } else {
        document.getElementById('tree-root').innerHTML = `<div style="color:var(--text-muted); margin-top:40px;"><i class="fa-solid fa-arrow-left"></i> ${LANG[currentLang]['selectPrompt']}</div>`;
    }
});

function setLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('lang-' + lang).classList.add('active');
    
    // Ubah teks UI berdasarkan data-lang atribut
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        if(LANG[lang][key]) el.textContent = LANG[lang][key];
    });

    document.getElementById('search-input').placeholder = lang === 'ru' ? 'Поиск трактата...' : lang === 'en' ? 'Search Tome...' : 'Cari nama Tome...';
    
    switchTab(activeTab);
    if (rightTreeId) {
        const targetObj = findTomeById(rightTreeId);
        if (targetObj) document.getElementById('target-tome-display').textContent = targetObj.name[currentLang] + ` (Lvl ${getTomeLevel(rightTreeId)})`;
        renderTree();
    } else {
        document.getElementById('tree-root').innerHTML = `<div style="color:var(--text-muted); margin-top:40px;"><i class="fa-solid fa-arrow-left"></i> ${LANG[currentLang]['selectPrompt']}</div>`;
    }
}

function switchTab(lvl) {
    activeTab = lvl;
    document.querySelectorAll('.tab-btn').forEach((b, i) => {
        b.classList.toggle('active', [3,4,5,6][i] === lvl);
    });
    filterTomes();
}

function filterTomes() {
    const searchVal = document.getElementById('search-input').value.toLowerCase().trim();
    const clearBtn = document.getElementById('clear-search');
    clearBtn.style.display = searchVal ? 'block' : 'none';

    const container = document.getElementById('tome-list');
    container.innerHTML = '';

    // Gabungkan list untuk pencarian, atau gunakan level tab saat kosong
    let list = [];
    if (searchVal) {
        for (const lvl in TOME_DB) list = list.concat(TOME_DB[lvl]);
    } else {
        list = TOME_DB[activeTab] || [];
    }

    list.forEach(t => {
        const nameText = t.name[currentLang].toLowerCase();
        if (searchVal && !nameText.includes(searchVal)) return;

        const div = document.createElement('div');
        div.className = `tome-item ${rightTreeId === t.id ? 'active' : ''}`;
        div.onclick = () => selectRightTree(t.id);

        const lvl = getTomeLevel(t.id);

        div.innerHTML = `
            <div class="sprite-icon" style="background-position: ${t.sprite}"></div>
            <div class="tome-info">
                <span class="tome-name">${t.name[currentLang]}</span>
                <span class="tome-lvl">Level ${lvl}</span>
            </div>
        `;
        container.appendChild(container.children.length === 0 ? div : div);
    });
}

function clearSearch() {
    document.getElementById('search-input').value = '';
    filterTomes();
}

function selectRightTree(id) {
    rightTreeId = id;
    document.querySelectorAll('.tome-item').forEach(el => el.classList.remove('active'));
    
    const targetObj = findTomeById(id);
    if(targetObj) {
        document.getElementById('target-tome-display').textContent = targetObj.name[currentLang] + ` (Lvl ${getTomeLevel(id)})`;
        // Trigger efek kembang api kecil (Confetti) saat user memilih buku max level
        if(getTomeLevel(id) === 6 && typeof confetti === 'function') {
            confetti({ particleCount: 60, spread: 40, origin: { y: 0.8 } });
        }
    }
    
    renderTree();
    saveToLocalStorage();
    
    // Beri tanda active ulang pada list dom
    filterTomes();
}

function updatePrices() {
    renderTree();
    saveToLocalStorage();
}

function updateMultiplier() {
    let mEl = document.getElementById('mnojitel');
    let v = parseInt(mEl.value) || 1;
    if (v < 1) { mEl.value = 1; v = 1; }
    renderTree();
    saveToLocalStorage();
}

// ARSITEKTUR PROTEKSI PERBAIKAN BUG SAMARAN (INC_SAMARAN_FIX)
function saveToLocalStorage() {
    try {
        let p10 = Math.max(0, parseInt(document.getElementById('price10').value) || 0); 
        let p11 = Math.max(0, parseInt(document.getElementById('price11').value) || 0); 
        let p12 = Math.max(0, parseInt(document.getElementById('price12').value) || 0); 
        let m = Math.max(1, parseInt(document.getElementById('mnojitel').value) || 1);
        const compD = {}; deductions.forEach((val, idx) => { if (val > 0) compD[idx] = val; });
        
        let state = { r: rightTreeId, m: m, d: compD, p10: p10, p11: p11, p12: p12, l: currentLang, t: activeTab };
        localStorage.setItem('tomeCalculatorState', JSON.stringify(state));
    } catch (error) {
        console.warn("Browser memblokir LocalStorage (Mungkin Mode Samaran). Fitur autosave dinonaktifkan sementara.");
    }
}

function loadFromLocalStorage() {
    try {
        let saved = localStorage.getItem('tomeCalculatorState');
        if(saved) {
            let state = JSON.parse(saved);
            if(state.p10) document.getElementById('price10').value = state.p10;
            if(state.p11) document.getElementById('price11').value = state.p11;
            if(state.p12) document.getElementById('price12').value = state.p12;
            if(state.m) document.getElementById('mnojitel').value = state.m;
            if(state.l) currentLang = state.l;
            if(state.t) activeTab = state.t;
            if(state.r) rightTreeId = state.r;
            deductions = [];
            if (state.d) { for (const k in state.d) deductions[parseInt(k)] = state.d[k]; }
        }
    } catch(e) { 
        deductions = []; 
    }
}

function resetCalculator() {
    if (confirm(LANG[currentLang]['alertReset'])) {
        deductions = []; 
        try { localStorage.removeItem('tomeCalculatorState'); } catch(e){}
        document.getElementById('price10').value = 0; 
        document.getElementById('price11').value = 0; 
        document.getElementById('price12').value = 0; 
        document.getElementById('mnojitel').value = 1;
        rightTreeId = null;
        document.getElementById('target-tome-display').textContent = LANG[currentLang]['selectPrompt'];
        document.getElementById('tree-root').innerHTML = `<div style="color:var(--text-muted); margin-top:40px;"><i class="fa-solid fa-arrow-left"></i> ${LANG[currentLang]['selectPrompt']}</div>`;
        document.getElementById('total-cost-display').textContent = '0 Gold';
        filterTomes();
    }
}

// LOGIKA MATEMATIKA REKURSIF POHON KRAFTING
function processTree(itemId, multiplier) {
    if (itemId < 100) {
        // Ini adalah item dasar (Fragmen lvl 1, 2, atau 3)
        let price = 0;
        let nameStr = "";
        if (itemId === 10) { price = parseInt(document.getElementById('price10').value) || 0; nameStr = LANG[currentLang]['itemLevel1']; }
        if (itemId === 11) { price = parseInt(document.getElementById('price11').value) || 0; nameStr = LANG[currentLang]['itemLevel2']; }
        if (itemId === 12) { price = parseInt(document.getElementById('price12').value) || 0; nameStr = LANG[currentLang]['itemLevel3']; }

        let currentDeduction = deductions[itemId] || 0;
        let finalQty = Math.max(0, multiplier - currentDeduction);
        let totalCost = finalQty * price;

        let spritePos = itemId === 10 ? "0 0" : itemId === 11 ? "-32px 0" : "-64px 0";

        let html = `
            <div class="tree-node-wrapper">
                <div class="tree-node base-item">
                    <div class="sprite-icon" style="background-image:url('znachki.png'); background-position:${spritePos}"></div>
                    <div class="node-content">
                        <span class="node-title">${nameStr}</span>
                        <div class="node-details">
                            <span>Qty: <b>${finalQty}</b> <span style="color:var(--text-muted); font-size:11px;">(${multiplier}-${currentDeduction})</span></span>
                            <span class="node-price">${totalCost.toLocaleString()} G</span>
                        </div>
                    </div>
                    <button class="deduction-toggle ${currentDeduction > 0 ? 'has-deduction' : ''}" onclick="promptDeduction(${itemId}, ${multiplier})" title="Kurangi Bahan Dimiliki">
                        <i class="fa-solid ${currentDeduction > 0 ? 'fa-box-open' : 'fa-box'}"></i>
                    </button>
                </div>
            </div>
        `;
        return { cost: totalCost, html: html };
    }

    // Ini adalah Buku Tome Crafting campuran
    const tome = findTomeById(itemId);
    if (!tome) return { cost: 0, html: '' };

    let currentDeduction = deductions[itemId] || 0;
    let finalQty = Math.max(0, multiplier - currentDeduction);

    let totalSubCost = 0;
    let subNodesHtml = '';

    if (finalQty > 0 && tome.recipe) {
        tome.recipe.forEach(subId => {
            let subResult = processTree(subId, finalQty);
            totalSubCost += subResult.cost;
            subNodesHtml += subResult.html;
        });
    }

    let html = `
        <div class="tree-node-wrapper">
            <div class="tree-node craft-item">
                <div class="sprite-icon" style="background-position:${tome.sprite}"></div>
                <div class="node-content">
                    <span class="node-title">${tome.name[currentLang]}</span>
                    <div class="node-details">
                        <span>Qty: <b>${finalQty}</b> <span style="color:var(--text-muted); font-size:11px;">(${multiplier}-${currentDeduction})</span></span>
                        <span class="node-price">${totalSubCost > 0 ? totalSubCost.toLocaleString() + ' G' : 'Owned'}</span>
                    </div>
                </div>
                <button class="deduction-toggle ${currentDeduction > 0 ? 'has-deduction' : ''}" onclick="promptDeduction(${itemId}, ${multiplier})" title="Punya Buku Ini?">
                    <i class="fa-solid ${currentDeduction > 0 ? 'fa-box-open' : 'fa-box'}"></i>
                </button>
            </div>
            ${subNodesHtml ? `<div class="children-container">${subNodesHtml}</div>` : ''}
        </div>
    `;

    return { cost: totalSubCost, html: html };
}

function renderTree() {
    if (!rightTreeId) return;
    const globalM = parseInt(document.getElementById('mnojitel').value) || 1;
    const res = processTree(rightTreeId, globalM);
    document.getElementById('tree-root').innerHTML = res.html;
    document.getElementById('total-cost-display').textContent = res.cost.toLocaleString() + " Gold";
}

function promptDeduction(itemId, requiredQty) {
    let old = deductions[itemId] || 0;
    let label = itemId < 100 ? (itemId === 10 ? LANG[currentLang]['itemLevel1'] : itemId === 11 ? LANG[currentLang]['itemLevel2'] : LANG[currentLang]['itemLevel3']) : findTomeById(itemId).name[currentLang];
    
    let msg = currentLang === 'ru' ? `Сколько у вас уже есть "${label}"?` : currentLang === 'en' ? `How many "${label}" do you already own?` : `Berapa banyak "${label}" yang sudah Anda miliki di tas?`;
    let res = prompt(msg, old);
    
    if (res !== null) {
        let val = Math.max(0, parseInt(res) || 0);
        if (val === 0) {
            delete deductions[itemId];
        } else {
            deductions[itemId] = val;
        }
        renderTree();
        saveToLocalStorage();
    }
}

// UTILITY HELPERS
function findTomeById(id) {
    for (const lvl in TOME_DB) {
        const found = TOME_DB[lvl].find(t => t.id === id);
        if (found) return found;
    }
    return null;
}

function getTomeLevel(id) {
    for (const lvl in TOME_DB) {
        if (TOME_DB[lvl].some(t => t.id === id)) return parseInt(lvl);
    }
    return 1;
}