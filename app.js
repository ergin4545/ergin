import { StorageManager } from './storage.js';

const WORKER_URL = 'https://bitter-haze-2503.usermame5252.workers.dev/';
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const clearChatBtn = document.getElementById('clear-chat');
const imageInput = document.getElementById('image-input');
const uploadBtn = document.getElementById('upload-btn');

let chatHistory = StorageManager.getHistory();
let selectedImageBase64 = null;

function renderHistory() {
    chatMessages.innerHTML = '';
    chatHistory.forEach(msg => {
        appendMessage(msg.role === 'user' ? 'Kullanıcı' : 'Nico', msg.text, msg.role);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendMessage(sender, text, role) {
    const div = document.createElement('div');
    div.classList.add('message', role === 'user' ? 'user' : 'ai');
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text && !selectedImageBase64) return;

    // OpenAI/NVIDIA uyumlu mesaj yapısı
    let userContent = text || "Bu görseli açıkla.";
    
    // Eğer görsel varsa formatı hazırlıyoruz
    let messagesPayload = [
        {
            role: "user",
            content: selectedImageBase64 ? [
                { type: "text", text: userContent },
                { type: "image_url", image_url: { url: selectedImageBase64 } }
            ] : userContent
        }
    ];

    appendMessage('Kullanıcı', text || '[Görsel Gönderildi]', 'user');
    chatHistory.push({ role: 'user', text: text || '[Görsel Gönderildi]' });
    
    userInput.value = '';
    selectedImageBase64 = null;
    
    try {
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: messagesPayload
            })
        });

        const data = await response.json();
        // NVIDIA/OpenAI standart yanıt yolu
        const aiText = data.choices?.[0]?.message?.content || data.candidates?.[0]?.content?.parts?.[0]?.text || "Yanıt alınamadı.";

        appendMessage('Nico', aiText, 'ai');
        chatHistory.push({ role: 'model', text: aiText });
        
        StorageManager.saveHistory(chatHistory);
    } catch (err) {
        appendMessage('Sistem', 'Bağlantı hatası oluştu.', 'ai');
    }
}

uploadBtn.addEventListener('click', () => imageInput.click());
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => { 
            selectedImageBase64 = reader.result; 
            appendMessage('Sistem', '📷 Görsel eklendi. Şimdi mesajınızı yazıp gönderebilirsiniz.', 'ai');
        };
        reader.readAsDataURL(file);
    }
});

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { 
    if (e.key === 'Enter' && !e.shiftKey) { 
        e.preventDefault(); 
        sendMessage(); 
    } 
});

clearChatBtn.addEventListener('click', () => {
    StorageManager.clearHistory();
    chatHistory = [];
    chatMessages.innerHTML = '';
});

renderHistory();
    
