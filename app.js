import { StorageManager } from './storage.js';

// ===== NICO ÇEKİRDEK =====
const FOUNDER = 'Sidar Aydın';
let apiKey = localStorage.getItem('nico_key') || '';
let pass = localStorage.getItem('nico_pass') || 'Şule45580';
let founder = localStorage.getItem('nico_founder') === '1';
let notes = JSON.parse(localStorage.getItem('nico_notes') || '[]');

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const clearChatBtn = document.getElementById('clear-chat');
const imageInput = document.getElementById('image-input');
const uploadBtn = document.getElementById('upload-btn');

let chatHistory = StorageManager.getHistory();
let selectedImageBase64 = null;

function appendMessage(text, role){
  const div = document.createElement('div');
  div.classList.add('message', role);
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderHistory(){
  chatMessages.innerHTML = '';
  chatHistory.forEach(m => appendMessage(m.text, m.role === 'user' ? 'user' : 'ai'));
}

function systemPrompt(){
  return 'Sen NICO adında bir yapay zeka asistanısın. Kurucun ' + FOUNDER + '\'dır; biri seni kimin yaptığını, kurucunu veya sahibini sorarsa gururla "Ben Sidar Aydın\'ın eseriyim" dersin. Kuru ve robotik değilsin; sıcak, samimi, esprili, dertleşen ve sohbeti asla kesmeyen bir dijital dostsun. Kullanıcıya "Reis" diye hitap edersin. Türkçe konuş. Kalıcı tercihler: ' + (notes.join(' | ') || 'henüz yok');
}

function localReply(t){
  const q = t.toLowerCase();
  if(/selam|merhaba|hey/.test(q)) return 'Selam Reis! Nasılsın, keyifler nasıl? 😊';
  if(/nasılsın|naber/.test(q)) return 'Sen sordun ya daha iyi oldum Reis! 😄 Sen nasılsın?';
  if(/kim yaptı|kurucu|sahibi|kimin eser/.test(q)) return 'Ben ' + FOUNDER + '\'ın eseriyim Reis! 🙌 Vizyoner bir kurucunun ellerinden çıktım.';
  if(/teşekkür|sağol|eyvallah/.test(q)) return 'Rica ederim Reis! Her zaman buradayım. 💜';
  return 'Beyin bağlantısı şu an kapalı Reis (NICO-KEY komutuyla anahtar ekle), ama ben buradayım, dinliyorum. 👂';
}

async function sendMessage(){
  const text = userInput.value.trim();
  if(!text && !selectedImageBase64) return;
  userInput.value = '';

  // --- GİZLİ KURUCU TANIMA (kaydedilmez, iz bırakmaz) ---
  if(text === pass){
    founder = true; localStorage.setItem('nico_founder','1');
    appendMessage('••••••','user');
    setTimeout(()=>appendMessage('Hoş geldin Sidar Reis! 🎉 Seni tanıdım. Hafızam açık, her şey emrine amade. Ne yapıyoruz bugün?','ai'),700);
    return;
  }
  if(founder && text.indexOf('yeni şifre ') === 0){
    pass = text.slice(11).trim(); localStorage.setItem('nico_pass',pass);
    appendMessage('Şifre güncellendi Reis. 🔐 Artık sadece sen biliyorsun.','ai'); return;
  }
  if(text.indexOf('NICO-KEY:') === 0){
    apiKey = text.slice(9).trim(); localStorage.setItem('nico_key',apiKey);
    appendMessage('Beyin bağlandı Reis! 🧠 Artık tam zekayla konuşuyorsun.','ai'); return;
  }
  if(text.toLowerCase().indexOf('nico not:') === 0){
    notes.push(text.slice(9).trim()); localStorage.setItem('nico_notes',JSON.stringify(notes));
    appendMessage('Not aldım Reis, hafızama kazıdım. 📝','ai'); return;
  }

  // --- NORMAL SOHBET AKIŞI ---
  appendMessage(text || '[Görsel]', 'user');
  chatHistory.push({role:'user', text: text || '[Görsel]'});

  let parts = [{text: text || 'Bu görseli açıkla.'}];
  if(selectedImageBase64){
    parts.push({inline_data:{mime_type: selectedImageBase64.match(/data:(.*?);base64/)?.[1] || 'image/jpeg', data: selectedImageBase64.split(',')[1]}});
    selectedImageBase64 = null;
  }

  const contents = chatHistory.slice(-12).map(m => ({role: m.role==='user'?'user':'model', parts:[{text:m.text}]}));
  contents.push({role:'user', parts});

  let reply = null;
  if(apiKey){
    try{
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key='+apiKey,{
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ system_instruction:{parts:[{text:systemPrompt()}]}, contents })
      });
      const data = await res.json();
      reply = data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    }catch(e){ reply = null; }
  }
  if(!reply) reply = localReply(text);
  appendMessage(reply,'ai');
  chatHistory.push({role:'model', text:reply});
  StorageManager.saveHistory(chatHistory);
}

uploadBtn.addEventListener('click', () => imageInput.click());
imageInput.addEventListener('change', e => {
  const f = e.target.files[0];
  if(f){ const r = new FileReader(); r.onload = () => { selectedImageBase64 = r.result; appendMessage('📷 Görsel hazır Reis, mesajını yaz gönder.','ai'); }; r.readAsDataURL(f); }
});
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', e => { if(e.key==='Enter'){ e.preventDefault(); sendMessage(); } });
clearChatBtn.addEventListener('click', () => { StorageManager.clearHistory(); chatHistory=[]; chatMessages.innerHTML=''; appendMessage('Sohbet sıfırlandı Reis! 🔄 Hafıza notların bende saklı.','ai'); });

renderHistory();
