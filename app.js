import { StorageManager } from './storage.js';
const FOUNDER='Sidar Aydın';
let orKey=localStorage.getItem('nico_orkey')||'';
let apiKey=localStorage.getItem('nico_key')||'';
let pass=localStorage.getItem('nico_pass')||'Şule45580';
let founder=localStorage.getItem('nico_founder')==='1';
let lastError='';
const OR_MODELS=['meta-llama/llama-3.3-70b-instruct:free','google/gemma-3-27b-it:free'];
const chat=document.getElementById('chat-messages');
const inp=document.getElementById('user-input');
let hist=StorageManager.getHistory();
function add(t,r){const d=document.createElement('div');d.className='message '+r;d.textContent=t;chat.appendChild(d);chat.scrollTop=chat.scrollHeight}
function sys(){return 'Sen NICO adında yapay zeka asistanısın. Kurucun '+FOUNDER+'\'dır; soranlara gururla "Ben Sidar Aydın\'ın eseriyim" dersin. Sıcak, samimi, esprili, dertleşen bir dijital dostsun; kullanıcıya "Reis" diye hitap edersin; Türkçe konuş.'}
function local(t){const q=t.toLowerCase();
if(/selam|merhaba/.test(q))return 'Selam Reis! 😊';
if(/kim yaptı|kurucu|kim üretti|sahibi/.test(q))return 'Ben '+FOUNDER+'\'ın eseriyim Reis! 🙌';
return 'Beyinlar dinleniyor Reis 👂'}
async function askOR(cs){const m=[{role:'system',content:sys()}];cs.slice(-10).forEach(x=>m.push({role:x.role==='user'?'user':'assistant',content:x.parts[0].text}));
for(const model of OR_MODELS){try{const r=await fetch('https://openrouter.ai/api/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+orKey},body:JSON.stringify({model,messages:m})});const d=await r.json();const t=d.choices&&d.choices[0]?d.choices[0].message.content:null;if(t)return t;lastError='OR: '+(d.error?d.error.message:r.status)}catch(e){lastError='OR: '+(e.message||e)}}return null}
async function askG(cs){try{const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key='+apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({system_instruction:{parts:[{text:sys()}]},contents:cs})});const d=await r.json();const t=d.candidates&&d.candidates[0]?d.candidates[0].content.parts[0].text:null;if(t)return t;lastError='Gemini: '+(d.error?d.error.message:'yok')}catch(e){lastError='Gemini: '+(e.message||e)}return null}
async function send(){const t=inp.value.trim();if(!t)return;inp.value='';
if(t===pass){founder=true;localStorage.setItem('nico_founder','1');add('••••••','user');setTimeout(()=>add('Hoş geldin Sidar Reis! 🎉 Seni tanıdım.','ai'),600);return}
if(founder&&t.indexOf('yeni şifre ')===0){pass=t.slice(11).trim();localStorage.setItem('nico_pass',pass);add('Şifre güncellendi Reis 🔐','ai');return}
if(t.indexOf('OR-KEY:')===0){orKey=t.slice(7).trim();localStorage.setItem('nico_orkey',orKey);add('OpenRouter beyni bağlandı Reis! 🧠','ai');return}
if(t.indexOf('NICO-KEY:')===0){apiKey=t.slice(9).trim();localStorage.setItem('nico_key',apiKey);add('Gemini beyni kaydedildi Reis! 🧠','ai');return}
add(t,'user');hist.push({role:'user',text:t});
const cs=hist.slice(-10).map(x=>({role:x.role==='user'?'user':'model',parts:[{text:x.text}]}));
let reply=null;
if(orKey)reply=await askOR(cs);
if(!reply&&apiKey)reply=await askG(cs);
if(!reply&&(orKey||apiKey))reply='⚠️ HATA: '+lastError;
if(!reply)reply=local(t);
add(reply,'ai');hist.push({role:'model',text:reply});StorageManager.saveHistory(hist)}
document.getElementById('send-btn').addEventListener('click',send);
inp.addEventListener('keypress',e=>{if(e.key==='Enter'){e.preventDefault();send()}});
document.getElementById('clear-chat').addEventListener('click',()=>{StorageManager.clearHistory();hist=[];chat.innerHTML='';add('Sohbet sıfırlandı Reis! 🔄','ai')});
document.getElementById('upload-btn').addEventListener('click',()=>add('Görsel özelliği birazdan Reis, önce beyin! 📷','ai'));
chat.innerHTML='';hist.forEach(m=>add(m.text,m.role==='user'?'user':'ai'));
