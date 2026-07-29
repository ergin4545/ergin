import StorageManager from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    const activeUser = StorageManager.getActiveUser();
    
    // Eğer kullanıcı daha önceden giriş yaptıysa geçmişi yükle
    if (activeUser) {
        loadChatHistory(activeUser);
    }
});

// Sohbet geçmişini ekrana yükleme fonksiyonu
function loadChatHistory(user) {
    const history = StorageManager.loadHistory(user);
    const messagesContainer = document.getElementById('messages');
    
    // Varsayılan karşılama mesajı dışındakileri temizle ve geçmişi bas
    messagesContainer.innerHTML = `<div class="message nico">Tekrar hoş geldin ${user}! Kaldığımız yerden devam ediyoruz.</div>`;
    
    history.forEach(msg => {
        appendMessageDirect(msg.text, msg.sender);
    });
}

// Mesaj gönderme ve yanıtlama akışı
async function handleUserMessage(text, user) {
    if (!text.trim()) return;

    // 1. Kullanıcı mesajını ekrana bas ve hafızaya kaydet
    appendMessageDirect(text, 'user');
    StorageManager.saveMessage(user, 'user', text);

    // 2. Hızlı yanıt simülasyonu / API İsteği
    try {
        // Cloudflare Worker veya backend bağlantısı
        const response = await fetch('https://bitter-haze-2503.usermame5252.workers.dev', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, user: user })
        });
        
        const data = await response.json();
        const reply = data.reply || "Hafızaya kaydedildi!";
        
        appendMessageDirect(reply, 'nico');
        StorageManager.saveMessage(user, 'nico', reply);

    } catch (e) {
        // Çevrimdışı / Hızlı Yerel Yanıt Yedek Mekanizması
        setTimeout(() => {
            const fallbackReply = `Anladım Sidar. "${text}" bilgisini hafızama kaydettim, anında işleme alıyorum!`;
            appendMessageDirect(fallbackReply, 'nico');
            StorageManager.saveMessage(user, 'nico', fallbackReply);
        }, 200);
    }
}

// Ekrana doğrudan mesaj ekleme yardımcı fonksiyonu
function appendMessageDirect(text, sender) {
    const messages = document.getElementById('messages');
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.innerText = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

// HTML içindeki tetikleyiciler için global bağlama
window.sendMessage = function() {
    const input = document.getElementById('user-input');
    const text = input.value;
    const user = StorageManager.getActiveUser() || localStorage.getItem('nico_user');
    
    if (text.trim()) {
        input.value = '';
        handleUserMessage(text, user);
    }
};

window.handleKeyPress = function(e) {
    if (e.key === 'Enter') {
        window.sendMessage();
    }
};

window.loginSuccess = function(method) {
    const emailInput = method === 'Email' ? document.getElementById('user-email').value : method + ' Kullanıcısı';
    if(method === 'Email' && !emailInput) { 
        alert('Lütfen bir e-posta adresi girin.'); 
        return; 
    }
    
    StorageManager.saveUserSession(emailInput);
    localStorage.setItem('nico_user', emailInput);
    
    document.getElementById('auth-modal').style.display = 'none';
    document.getElementById('chat-container').style.display = 'flex';
    document.getElementById('user-display').innerText = emailInput;
    
    loadChatHistory(emailInput);
};
