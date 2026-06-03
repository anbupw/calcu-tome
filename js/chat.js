let chatUnsubscribe = null;

function listenGlobalChat() {
    if (chatUnsubscribe) chatUnsubscribe();

    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    chatUnsubscribe = db.collection("global_chats")
        .orderBy("timestamp", "desc")
        .limit(50)
        .onSnapshot(snapshot => {
            let html = "";
            const docs = snapshot.docs.reverse();

            if (docs.length === 0) {
                html = `<div style="color:var(--text-muted); text-align:center; padding: 20px; font-style:italic; font-size:0.85rem;">Belum ada obrolan. Mari sapa pemain lain pertama kali!</div>`;
                chatMessages.innerHTML = html;
                return;
            }

            docs.forEach(doc => {
                const data = doc.data();
                const isMe = data.uid === (currentUser ? currentUser.uid : null);
                
                let timeStr = "...";
                if (data.timestamp) {
                    const date = data.timestamp.toDate();
                    timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }

                const safeName = escapeChatHTML(data.name || "Anonymous");
                const safeMessage = escapeChatHTML(data.message || "");
                const photoURL = data.photo || "https://via.placeholder.com/40";

                html += `
                    <div class="chat-bubble" style="display: flex; gap: 10px; align-items: flex-start; ${isMe ? 'flex-direction: row-reverse;' : ''}">
                        <img src="${photoURL}" style="width: 32px; height: 32px; border-radius: 50%; border: 1px solid ${isMe ? 'var(--accent)' : 'var(--border-color)'}; flex-shrink: 0;" alt="Avatar">
                        <div style="background: ${isMe ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.03)'}; border: 1px solid ${isMe ? 'var(--accent)' : 'var(--border-color)'}; padding: 8px 12px; border-radius: 10px; max-width: 80%; text-align: left; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <div style="display: flex; justify-content: space-between; align-items: center; gap: 15px; margin-bottom: 2px;">
                                <span style="font-weight: 600; font-size: 0.78rem; color: ${isMe ? 'var(--accent)' : '#fbbf24'};">${safeName}</span>
                                <span style="font-size: 0.65rem; color: var(--text-muted);">${timeStr}</span>
                            </div>
                            <p style="margin: 0; font-size: 0.85rem; color: #e2e8f0; line-height: 1.4; word-break: break-word; white-space: pre-wrap;">${safeMessage}</p>
                        </div>
                    </div>
                `;
            });

            chatMessages.innerHTML = html;
            
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, err => {
            console.error("Gagal melakukan sinkronisasi chat forum:", err);
        });
}

function unsubscribeGlobalChat() {
    if (chatUnsubscribe) {
        chatUnsubscribe();
        chatUnsubscribe = null;
    }
}

function sendGlobalChat() {
    const inputField = document.getElementById('chatInputField');
    if (!inputField) return;

    const text = inputField.value.trim();
    if (!text) return;
    if (!currentUser) return;

    if (text.length > 400) {
        alert("Pesan Anda terlalu panjang! Maksimal adalah 400 karakter.");
        return;
    }

    db.collection("global_chats").add({
        uid: currentUser.uid,
        name: currentUser.displayName || "Player Classic",
        photo: currentUser.photoURL || "https://via.placeholder.com/40",
        message: text,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        inputField.value = '';
    })
    .catch(err => {
        console.error("Gagal mengirim pesan ke server:", err);
        alert("Gagal mengirim obrolan. Silakan periksa jaringan Anda.");
    });
}

function escapeChatHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag] || tag));
}

function toggleEmojiPicker() {
    const panel = document.getElementById('emojiPickerPanel');
    if (panel.style.display === 'none' || panel.style.display === '') {
        panel.style.display = 'flex';
    } else {
        panel.style.display = 'none';
    }
}

function insertEmoji(emoji) {
    const inputField = document.getElementById('chatInputField');
    inputField.value += emoji;
    inputField.focus();
    document.getElementById('emojiPickerPanel').style.display = 'none';
}

document.addEventListener('click', function(event) {
    const panel = document.getElementById('emojiPickerPanel');
    const toggleBtn = document.getElementById('btnEmojiToggle');

    if (panel && panel.style.display === 'flex') {
        if (!panel.contains(event.target) && !toggleBtn.contains(event.target) && !toggleBtn.querySelector('i').contains(event.target)) {
            panel.style.display = 'none';
        }
    }
});

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.calc-card[id]');
    const navItems = document.querySelectorAll('.mobile-navbar .nav-item');
    
    let currentSectionId = '';

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        
        if (rect.top <= 150) {
            currentSectionId = section.getAttribute('id');
        }
    });

    if (window.scrollY === 0) {
        currentSectionId = 'cardTarget';
    }

    if (currentSectionId) {
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    }
});