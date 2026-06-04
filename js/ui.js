//Semua urusan buka/tutup jendela
function openReverseCalcModal() {
    hideTooltip();
    document.getElementById('reverseCalcModal').style.display = 'flex';
    runReverseCalculator();
}

function closeReverseCalcModal() { 
    document.getElementById('reverseCalcModal').style.display = 'none'; 
}

function openInventoryModal() {
    hideTooltip();
    document.getElementById('inventoryModal').style.display = 'flex';
    document.getElementById('invSearch').value = ''; 
    renderInventorySelection(''); 
    setTimeout(() => { document.getElementById('invSearch').focus(); }, 50);
}

function closeInventoryModal() {
	document.getElementById('inventoryModal').style.display = 'none'; 
}

function openModal(id) {
    hideTooltip();
    activeModalItemId = id;
    let nameText = (id === 10) ? "Token of Luck" : (id === 11) ? "Tome Fragment" : (id === 12) ? "Tome Page" : TOME_DB[id][4];
    document.getElementById('modalTitle').innerText = `${LANG[currentLang]['modalTitleAdd']} - ${nameText}`;
    document.getElementById('modalInput').value = 1;
    document.getElementById('customModal').style.display = 'flex';
    document.getElementById('modalInput').focus();
}

function closeModal() {
	document.getElementById('customModal').style.display = 'none'; activeModalItemId = null; 
}

//Urusan Tooltip item
function showTooltip(element, event) {
    const id = parseInt(element.getAttribute('data-id'));
	
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
        <div class="tooltip-title"><div style="width:32px; height:32px; display:inline-block; vertical-align:middle; background-image:url('img/znachki.png'); ${getSpritePosition(id)}; transform:scale(0.85); border-radius:4px;"></div> ${nameText}</div>
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

//Interaksi tombol minor
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