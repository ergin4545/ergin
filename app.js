import { StorageManager } from './storage.js';

// Google AI Studio'dan aldığın ücretsiz API anahtarın entegre edildi:
const GEMINI_API_KEY = "AQ.Ab8RN6LSEVp4isPzLO2Dn1TuaaQRo2XIj7YpSAQ12w6OzgYWcg";

// Doğrudan Google Gemini resmi ücretsiz adresi
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

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

    let userContent = text || "Bu görseli açıkla.";
    
    let contentsPayload = [];
    
    chatHistory.forEach(msg => {
        contentsPayload.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        });
    });

    let currentParts = [{ text: userContent }];
    
    if (selectedImageBase64) {
        const base64Data = selectedImageBase64.split(',')[1];
        const mimeType = selectedImageBase64.match(/data:(.*?);base64/)?.[1] || 'image/jpeg';
        
        currentParts.push({
            inline_data: {
                mime_type: mimeType,
                data: base64Data
            }
        });
    }

    contentsPayload.push({
        role: 'user',
        parts: currentParts
    });

    appendMessage('Kullanıcı', text || '[Görsel Gönderildi]', 'user');
    chatHistory.push({ role: 'user', text: text || '[Görsel Gönderildi]' });
    
    userInput.value = '';
    selectedImageBase64 = null;
    
    try {
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: contentsPayload
            })
        });

        const data = await response.json();
        
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || data.error?.message || "Yanıt alınamadı.";

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
        
