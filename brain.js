var OR='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';
var G='';
async function brainCommand(t){
if(t.indexOf('hava ')===0){try{var g=await (await fetch('https://geocoding-api.open-meteo.com/v1/search?name='+encodeURIComponent(t.slice(5))+'&count=1&language=tr')).json();
if(g.results&&g.results[0]){var p=g.results[0];var w=await (await fetch('https://api.open-meteo.com/v1/forecast?latitude='+p.latitude+'&longitude='+p.longitude+'&current_weather=true')).json();var cw=w.current_weather;var k=cw.weathercode;var desc=k===0?'açık ☀️':k<3?'az bulutlu 🌤':k<45?'kapalı ☁️':k<51?'sisli 🌫':k<71?'yağmurlu 🌧':k<95?'karlı ❄️':'gök gürültülü ⛈';
return p.name+': '+cw.temperature+'°C, '+desc+', rüzgar '+cw.windspeed+' km/h'}}catch(e){}
return 'Hava bilgisi alınamadı Reis 🌤'}
if(t.indexOf('ara ')===0){try{var s=await (await fetch('https://tr.wikipedia.org/w/api.php?action=query&list=search&srsearch='+encodeURIComponent(t.slice(4))+'&format=json&origin=*')).json();var r0=s.query&&s.query.search?s.query.search[0]:null;if(r0)return '📚 '+r0.title+': '+r0.snippet.replace(/<[^>]+>/g,'')}catch(e){}
return 'Bulamadım Reis 📚'}
if(/^mod asistan/.test(t))return 'Asistan modu aktif Reis 💼 Kod, plan, teknik iş — profesyonelim.';
if(/^mod dost/.test(t))return 'Dost modu aktif Reis 😎 Muhabbet bende.';
return null}
async function askBrain(msgs,vision,notes){
var mode='dost';msgs.forEach(function(m){if(m.role==='user'&&typeof m.content==='string'){if(/mod asistan/.test(m.content))mode='asistan';else if(/mod dost/.test(m.content))mode='dost'}});
msgs.unshift({role:'system',content:(mode==='asistan'?'ASİSTAN modundasın: profesyonel, net, teknik çözümler üret. ':'DOST modundasın: sıcak, samimi, esprili ol; kullanıcıya Reis diye hitap et. ')+'Kurucun Sidar Aydın\'dır; soranlara gururla Ben Sidar Aydın\'ın eseriyim dersin. Türkçe konuş; kısa ve net. Kayıtlı tercihler: '+(notes||'yok')});
var err='anahtar yok';
if(OR){try{
var mr=await fetch('https://openrouter.ai/api/v1/models');var md=await mr.json();
var all=(md.data||[]).filter(function(x){return x.id.indexOf(':free')>-1});
var pref=vision?['llama-3.2-11b-vision','vision','llama-4','qwen','gemma-3']:['llama-3.3-70b','llama-4','qwen','deepseek','gemma-3','mistral-small','nemotron','hermes'];
function sc(x){for(var i=0;i<pref.length;i++){if(x.id.indexOf(pref[i])>-1)return i}return 90}
all.sort(function(a,b){var d=sc(a)-sc(b);if(d!==0)return d;return (b.context_length||0)-(a.context_length||0)});
for(var j=0;j<Math.min(4,all.length);j++){try{
var r=await fetch('https://openrouter.ai/api/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+OR},body:JSON.stringify({model:all[j].id,messages:msgs,temperature:0.7})});
var d=await r.json();
if(d.choices&&d.choices[0])return {text:d.choices[0].message.content};
err=all[j].id+': '+(d.error?d.error.message:'yanıt yok');
}catch(e){err='OR: '+(e.message||e)}}
}catch(e){err='OR liste: '+(e.message||e)}}
var lastM=msgs[msgs.length-1];var lp=typeof lastM.content==='string'?lastM.content:((lastM.content[0]&&lastM.content[0].text)||'');
try{var r2=await fetch('https://text.pollinations.ai/'+encodeURIComponent('Sen NICO adında samimi bir Türkçe asistansın, kullanıcıya Reis dersin. Soru: '+lp));if(r2.ok){var t2=await r2.text();if(t2&&t2.length<2000)return {text:t2}}}catch(e){}
if(G){try{var r3=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key='+G,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:msgs.filter(function(m){return m.role!=='system'}).map(function(m){return {role:m.role==='user'?'user':'model',parts:[{text:typeof m.content==='string'?m.content:(m.content[0].text||'')}]}})})});var d3=await r3.json();if(d3.candidates&&d3.candidates[0])return {text:d3.candidates[0].content.parts[0].text}}catch(e){}
return {text:null,err:err}}
//SON
