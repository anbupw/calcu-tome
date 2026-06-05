let statsDebounceTimer = null;

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

function testCraft(id, pool) {
    if (pool[id] > 0) {
        pool[id]--;
        return 1;
    }
    
    if (id === 10 || id === 11 || id === 12) return 0;
    
    if (!TOME_DB[id]) return 0; 

    let req = TOME_DB[id];
    
    let p1 = pool.slice(); 
    
    if (testCraft(req[0], p1) && testCraft(req[1], p1) && testCraft(req[2], p1)) {
        for (let i = 0; i < p1.length; i++) {
            pool[i] = p1[i];
        }
        return 1;
    }
    
    return 0;
}

function checkPartialCraft(id, pool) {
    if (pool[id] && pool[id] > 0) {
        pool[id]--;
        return 1;
    }
    
    if (id === 10 || id === 11 || id === 12 || !TOME_DB[id]) {
        return 0;
    }
    
    let r0 = TOME_DB[id][0];
    let r1 = TOME_DB[id][1];
    let r2 = TOME_DB[id][2];
    
    let p0 = checkPartialCraft(r0, pool);
    let p1 = checkPartialCraft(r1, pool);
    let p2 = checkPartialCraft(r2, pool);
    
    return (p0 + p1 + p2) / 3;
}


function runReverseCalculator() {
    let resultsDiv = document.getElementById('reverseCalcResults') || document.getElementById('reverseResults');
    
    if (!resultsDiv) {
        console.error("❌ Kotak hasil analisis tidak ditemukan! Pastikan ID di HTML sudah sesuai.");
        return;
    }

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
    
    for (let id = 101; id < TOME_DB.length; id++) {
        if (!TOME_DB[id]) continue;
        
        let simulationPool = deductions.slice();
        simulationPool[id] = 0;
        
        let score = checkPartialCraft(id, simulationPool);
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
                    <div style="width:32px; height:32px; flex-shrink:0; background-image:url('img/znachki.png'); ${getSpritePosition(item.id)}"></div>
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
                        <div style="width:32px; height:32px; flex-shrink:0; background-image:url('img/znachki.png'); ${getSpritePosition(item.id)}"></div>
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
    let targetId = parseInt(id);
    
    if (targetId === 10) return 'background-position:32px -32px';
    if (targetId === 11) return 'background-position:64px 0px';
    if (targetId === 12) return 'background-position:32px 0px';
    
    if (typeof window.TOME_DB !== 'undefined' && window.TOME_DB[targetId] && window.TOME_DB[targetId][5]) {
        targetId = parseInt(window.TOME_DB[targetId][5]);
    }
    
    let row = Math.floor(targetId / 100);
    let num = targetId - (row * 100);
    return `background-position:-${32 * (num - 1)}px -${32 * (row - 1)}px`;
}

function getTreeItemHtml(id, isDeductionsView = false) {
    let count = isDeductionsView ? deductions[id] : itemCounts[id];
    if (!count) return '';
    
    let clickAttr = '';
    let extraStyle = '';
    let spanTag = '';

    if (isDeductionsView) {
        clickAttr = `onclick="removeDeduction(${id})"`;
        spanTag = `<span title="Hapus item dari inventory"></span>`;
    } else {
        if (id == rightTreeId) {
            clickAttr = `onclick="attemptCrafting(${id})"`;
            
            extraStyle = "border-radius: 6px; cursor: pointer;";
            
            return `<li><button id="mainTargetBtn" style="background-image:url('img/znachki.png'); ${getSpritePosition(id)}; ${extraStyle}" data-id="${id}" ${clickAttr} onmouseover="showTooltip(this, event);" onmousemove="moveTooltip(event);" onmouseout="hideTooltip();">${spanTag}</button><b>${count}</b></li>`;
        } else {
            clickAttr = `onclick="openModal(${id})"`;
        }
    }
    
    return `<li><button style="background-image:url('img/znachki.png'); ${getSpritePosition(id)}; ${extraStyle}" data-id="${id}" ${clickAttr} onmouseover="showTooltip(this, event);" onmousemove="moveTooltip(event);" onmouseout="hideTooltip();">${spanTag}</button><b>${count}</b></li>`;
}

function renderTree() {
    let txt = '';
    const txtLvl = LANG[currentLang]['lvl'];
    const txtBase = LANG[currentLang]['baseMat'];
    
    let maxLevel = 1;
    for (let i = 101; i < TOME_DB.length; i++) {
        if (TOME_DB[i]) {
            let lvl = Math.floor(i / 100);
            if (lvl > maxLevel) maxLevel = lvl;
        }
    }
    
    if (!isCompactMode) {
        for (let r = maxLevel; r >= 1; r--) {
            let start = r * 100 + 1; 
            let end = r * 100 + 99;
            let hasItem = false;
            let tempTxt = `<ul><li>${txtLvl} ${r}</li> `;
            for (let e = start; e <= end; e++) { 
                if (itemCounts[e]) { tempTxt += getTreeItemHtml(e); hasItem = true; } 
            }
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
    
    if (deductions[11] > 0) lis += getTreeItemHtml(11, true);
    if (deductions[12] > 0) lis += getTreeItemHtml(12, true);
    if (deductions[10] > 0) lis += getTreeItemHtml(10, true);
    if (lis !== '') txt += `<ul><li>${LANG[currentLang]['baseMat']}</li> ${lis}</ul>`;
    
    let maxLevel = 1;
    for (let i = 101; i < TOME_DB.length; i++) {
        if (TOME_DB[i]) {
            let lvl = Math.floor(i / 100);
            if (lvl > maxLevel) maxLevel = lvl;
        }
    }
    
    for (let r = 1; r <= maxLevel; r++) {
        lis = ''; 
        let start = r * 100 + 1; 
        let end = r * 100 + 99;
        for (let e = start; e <= end; e++) { 
            if (deductions[e] > 0) lis += getTreeItemHtml(e, true); 
        }
        if (lis !== '') txt += `<ul><li>${LANG[currentLang]['lvl']} ${r}</li> ${lis}</ul>`;
    }
    deductionsDiv.innerHTML = txt;
}

function renderBookSelection() {
    let txt = '';
    const txtLvl = LANG[currentLang]['lvl'];
    
    let maxLevel = 1;
    for (let i = 101; i < TOME_DB.length; i++) {
        if (TOME_DB[i]) {
            let lvl = Math.floor(i / 100);
            if (lvl > maxLevel) maxLevel = lvl;
        }
    }
    
    for (let r = maxLevel; r >= 1; r--) {
        let lis = ''; 
        let start = r * 100 + 1; 
        
        let end = r * 100 + 99; 
        
        for (let e = start; e <= end; e++) {
            if (TOME_DB[e]) {
                lis += `<li><button style="background-image:url('img/znachki.png'); ${getSpritePosition(e)}" data-id="${e}" onclick="selectTargetBook(${e})" onmouseover="showTooltip(this, event);" onmousemove="moveTooltip(event);" onmouseout="hideTooltip();"></button></li>`;
            }
        }
        
        if (lis !== '') txt += `<h4>${txtLvl} ${r}</h4><ul>${lis}</ul>`;
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
    
    function calcNetNode(nodeId, isRoot = false) {
        if (!nodeId || !TOME_DB[nodeId]) return;
        
        if (!isRoot && deductionsCopy[nodeId] && deductionsCopy[nodeId] > 0) { 
            deductionsCopy[nodeId]--; 
            return; 
        }
        
        if (!netCounts[nodeId]) netCounts[nodeId] = 0;
        netCounts[nodeId]++;
        
        if (nodeId > 200) { 
            calcNetNode(TOME_DB[nodeId][0], false); 
            calcNetNode(TOME_DB[nodeId][1], false); 
            calcNetNode(TOME_DB[nodeId][2], false); 
        }
    }
    
    for (let z = 0; z < multiplier; z++) calcNetNode(rightTreeId, true);
    
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
    
    let mainBtn = document.getElementById('mainTargetBtn');

    if (pct >= 100) {
        if (mainBtn) mainBtn.classList.add('tome-ready-to-craft');
        
        if (!window.confettiLaunched && typeof confetti === 'function') { 
            window.confettiLaunched = true;
        }
    } else {
        if (mainBtn) mainBtn.classList.remove('tome-ready-to-craft');
        
        window.confettiLaunched = false;
    }
}

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

function processTree(id) {
    console.log("🚀 processTree dipanggil! ID Tome:", id);
    
    if (!id || !TOME_DB[id]) {
        console.warn("⚠️ TOME_DB tidak ditemukan atau ID kosong!");
        return;
    }
    
    rightTreeId = id;
    updateFavoriteButton();
    let multiplier = Math.max(1, parseInt(document.getElementById('mnojitel').value) || 1);
    itemCounts = [];
    
    let deductionsCopy = [];
    for (let i = 0; i < deductions.length; i++) { deductionsCopy[i] = deductions[i] || 0; }
    
    function walkAndCount(nodeId, isRoot = false) {
        if (!nodeId || !TOME_DB[nodeId]) return;
        
        if (!isRoot && deductionsCopy[nodeId] > 0) { 
            deductionsCopy[nodeId]--; 
            return; 
        }
        
        if (!itemCounts[nodeId]) itemCounts[nodeId] = 0;
        itemCounts[nodeId]++;
        
        if (nodeId > 200) { 
            walkAndCount(TOME_DB[nodeId][0], false); 
            walkAndCount(TOME_DB[nodeId][1], false); 
            walkAndCount(TOME_DB[nodeId][2], false); 
        }
    }
    
    for (let z = 0; z < multiplier; z++) { walkAndCount(id, true); }
    
    let totalLv1Tomes = 0;
    for (let z = 101; z <= 109; z++) { totalLv1Tomes += (itemCounts[z] || 0); }
    
    itemCounts[11] = totalLv1Tomes * 3; 
    itemCounts[12] = totalLv1Tomes * 4; 
    
    if (deductionsCopy[11]) { itemCounts[11] -= deductionsCopy[11]; if (itemCounts[11] < 0) itemCounts[11] = 0; }
    if (deductionsCopy[12]) { itemCounts[12] -= deductionsCopy[12]; if (itemCounts[12] < 0) itemCounts[12] = 0; }
    
    itemCounts[10] = (itemCounts[12] || 0) * 20;
    if (deductionsCopy[10]) { itemCounts[10] -= deductionsCopy[10]; if (itemCounts[10] < 0) itemCounts[10] = 0; }
    
    renderTree(); 
    renderDeductions(); 
    updateCostAndProgress();

    if (typeof window.sendStatsToFirebase === 'function' && window.lastTrackedTomeId !== id) {
        const targetBuku = (TOME_DB[id] && TOME_DB[id][4]) ? TOME_DB[id][4] : "Tome Rahasia";
        window.lastTrackedTomeId = id;
        
        clearTimeout(statsDebounceTimer);
        
        statsDebounceTimer = setTimeout(() => {
            window.sendStatsToFirebase(targetBuku);
            console.log("📈 Statistik dikirim untuk:", targetBuku);
        }, 3000); 
    }
}

function selectTargetBook(id) { rightTreeId = id; processTree(rightTreeId); }

function renderInventorySelection(query) {
    let html = '<ul style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center;">';
    const q = query.toLowerCase(); 

    const baseMats = [ {id: 12, name: 'Tome Page'}, {id: 11, name: 'Tome Fragment'}, {id: 10, name: 'Token of Luck'} ];
    
    baseMats.forEach(mat => {
        if (mat.name.toLowerCase().includes(q)) { 
            html += `<li><button style="background-image:url('img/znachki.png'); ${getSpritePosition(mat.id)}" data-id="${mat.id}" onclick="selectItemForInventory(${mat.id})" onmouseover="showTooltip(this, event);" onmousemove="moveTooltip(event);" onmouseout="hideTooltip();"></button></li>`; 
        }
    });
    
    TOME_DB.forEach((tome, id) => {
        if (tome && tome[4].toLowerCase().includes(q)) { 
            html += `<li><button style="background-image:url('img/znachki.png'); ${getSpritePosition(id)}" data-id="${id}" onclick="selectItemForInventory(${id})" onmouseover="showTooltip(this, event);" onmousemove="moveTooltip(event);" onmouseout="hideTooltip();"></button></li>`; 
        }
    });
    
    html += '</ul>'; 
    document.getElementById('invItemList').innerHTML = html;
}

function filterInventorySearch(val) { renderInventorySelection(val); }
function selectItemForInventory(id) { closeInventoryModal(); openModal(id); }

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

function filterBooks(query) {
    const q = query.toLowerCase().trim();
    const vyborDiv = document.getElementById('vyborDiv');
    if (!vyborDiv) return;

    vyborDiv.querySelectorAll('ul').forEach(ul => {
        let hasVisibleItem = false;
        
        ul.querySelectorAll('li').forEach(li => {
            const btn = li.querySelector('button');
            if (!btn) return;
            
            const id = btn.getAttribute('data-id');
            const bookName = (typeof TOME_DB !== 'undefined' && TOME_DB[id]) ? TOME_DB[id][4].toLowerCase() : '';
            
            if (bookName.includes(q)) {
                li.style.display = 'inline-block';
                hasVisibleItem = true;
            } else {
                li.style.display = 'none';
            }
        });
        
        const header = ul.previousElementSibling;
        if (header && header.tagName === 'H4') {
            header.style.display = hasVisibleItem ? 'block' : 'none';
        }
    });
}

function attemptCrafting(targetId) {
    if (!targetId) return;

    function tryCraftNode(nodeId, pool, isRoot = false) {
        if (!nodeId) return false;
        
        if (!isRoot && pool[nodeId] && pool[nodeId] > 0) {
            pool[nodeId]--;
            return true;
        }

        if (nodeId === 10 || nodeId === 11) return false; 
        
        if (nodeId === 12) {
            if (pool[10] >= 20) {
                pool[10] -= 20;
                return true;
            }
            return false;
        }

        if (nodeId >= 101 && nodeId <= 109) {
            let backupPool = pool.slice(); 
            
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
                return true;
            } else {
                for(let i=0; i<pool.length; i++) pool[i] = backupPool[i] || 0;
                return false;
            }
        }

        let recipe = TOME_DB[nodeId];
        if (!recipe) return false;

        let backupPool = pool.slice(); 
        
        let s0 = tryCraftNode(recipe[0], pool, false);
        let s1 = tryCraftNode(recipe[1], pool, false);
        let s2 = tryCraftNode(recipe[2], pool, false);

        if (s0 && s1 && s2) {
            return true;
        } else {
            for(let i=0; i<pool.length; i++) pool[i] = backupPool[i] || 0;
            return false;
        }
    }

    let pool = [];
    for (let i = 0; i < deductions.length; i++) {
        pool[i] = deductions[i] || 0;
    }

    let success = tryCraftNode(targetId, pool, true);

    if (success) {
        for (let i = 0; i < pool.length; i++) {
            deductions[i] = pool[i] || 0;
        }
        
        if (!deductions[targetId]) deductions[targetId] = 0;
        deductions[targetId]++;
        
        // Simpan Data
        if (typeof saveDataTrigger === 'function') {
            saveDataTrigger();
        } else if (typeof saveDeductionsToLocalStorage === 'function') {
            saveDeductionsToLocalStorage(); 
        }
        
        processTree(rightTreeId);
        
        if (typeof confetti === 'function') {
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 }, colors: ['#fbbf24', '#f59e0b', '#d97706'] });
        }
        
        try {
            let craftSound = new Audio('img/success.mp3');
            craftSound.volume = 0.6;
            craftSound.play();
        } catch (error) {
            console.log("Gagal memutar suara, kemungkinan diblokir browser:", error);
        }
        
        const bookName = (TOME_DB[targetId] && TOME_DB[targetId][4]) ? TOME_DB[targetId][4] : "Target Tome";
        alert(`🎉 CRAFTING SUKSES!\n\n[${bookName}] telah berhasil dirakit dan disimpan ke Inventory Anda.`);
    } else {
        const bookName = (TOME_DB[targetId] && TOME_DB[targetId][4]) ? TOME_DB[targetId][4] : "Target Tome";
        alert(`❌ CRAFTING GAGAL!\n\nMaterial atau sub-tome di Inventory Anda belum cukup untuk merakit [${bookName}].`);
    }
}

if (typeof window.db !== 'undefined') {
    
    const bannerElement = document.getElementById('globalBanner');
    const bannerTextElement = document.getElementById('bannerText');

    if (bannerElement && bannerTextElement) {
        window.db.collection("admin_data").doc("global_settings").onSnapshot((docSnap) => {
            if (docSnap.exists) {
                const data = docSnap.data();
                if (data.bannerText && data.bannerText.trim() !== "") {
                    bannerTextElement.innerText = data.bannerText;
                    bannerElement.style.display = "block";
                } else {
                    bannerElement.style.display = "none";
                }
            }
        });
    }

    window.hargaMysticPageGlobal = 0; 
    window.hargaFragmentGlobal = 0;

    window.db.collection("admin_data").doc("market_prices").onSnapshot((docSnap) => {
        if (docSnap.exists) {
            const data = docSnap.data();
            window.hargaMysticPageGlobal = data.mysticPagePrice || 0;
            window.hargaFragmentGlobal = data.fragmentPrice || 0;
            
            const inputPrice11 = document.getElementById('price11');
            const inputPrice12 = document.getElementById('price12');

            if (inputPrice11) inputPrice11.value = window.hargaFragmentGlobal;
            if (inputPrice12) inputPrice12.value = window.hargaMysticPageGlobal;
            
            if (typeof updateCostAndProgress === 'function') {
                updateCostAndProgress();
            }
            
            console.log("🔥 Harga terupdate dari Admin & Sinkron ke UI:", window.hargaMysticPageGlobal, window.hargaFragmentGlobal);
        }
    });

} else {
    console.warn("Firebase (db) belum terhubung ke script ini.");
}

window.sendStatsToFirebase = function(tomeName) {
    if (!window.db) return;
    
    const increment = firebase.firestore.FieldValue.increment(1);
    
    const updateData = {
        totalCalculations: increment
    };
    
    if (tomeName) {
        const cleanName = tomeName.replace(/[.#$/\[\]]/g, ""); 
        updateData.tomeCounter = {};
        updateData.tomeCounter[cleanName] = increment;
    }
    
    window.db.collection("admin_data").doc("statistics").set(updateData, { merge: true })
        .catch(err => console.error("Gagal mengirim statistik:", err));
};

function syncTomeDatabase(callback) {
    if (!window.db) {
        console.warn("Database tidak terhubung!");
        if (callback) callback();
        return;
    }

    console.log("Menghubungkan ke Database Tome...");
    
    window.db.collection("tomes").onSnapshot((snap) => {
        if (snap.empty) {
            console.warn("Database Tome kosong atau belum dimigrasi.");
            if (callback) callback();
            return;
        }

        snap.forEach((doc) => {
            const data = doc.data();
            window.TOME_DB[data.id] = [data.req[0], data.req[1], data.req[2], data.gameId, data.name, data.iconId || null];
        });
        
        console.log("✅ Database Tome berhasil disinkronisasi!");

        if (typeof window.renderBookSelection === 'function') {
            window.renderBookSelection();
        }
        
        if (callback) {
            callback();
            callback = null; 
        }
    }, (err) => {
        console.error("Gagal sinkronisasi database:", err);
        if (callback) callback();
    });
}


function syncStatsDatabase(callback) {
    if (!window.db) {
        if (callback) callback();
        return;
    }

    console.log("Mengambil Data Stats Tome dari Cloud...");
    
    window.db.collection("game_config").doc("tome_stats").get().then((doc) => {
        if (doc.exists) {
            window.STATS_DB = doc.data();
            console.log("✅ STATS_DB berhasil disinkronisasi!");
        } else {
            console.warn("⚠️ Dokumen STATS_DB tidak ditemukan di Firebase.");
        }
        if (callback) callback();
    }).catch(err => {
        console.error("Gagal load STATS_DB:", err);
        if (callback) callback();
    });
}

window.onload = () => { 
    syncTomeDatabase(() => {
        syncStatsDatabase(() => {
            applyLanguage(); 
            
            const modalInput = document.getElementById('modalInput');
            if (modalInput) {
                modalInput.addEventListener('keydown', function(e) { 
                    if(e.key === 'Enter') confirmModal(); 
                }); 
            }
        });
    });
};

window.filterBooks = filterBooks;
window.renderBookSelection = renderBookSelection;