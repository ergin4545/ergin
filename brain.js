var OR=localStorage.getItem("nico_or")||'';
var G=localStorage.getItem("nico_g")||'';
async function brainCommand(t){
if(t.indexOf('G-KEY:')===0){localStorage.setItem("nico_g",t.slice(6).trim());G=t.slice(6).trim();return 'Gemini beyni bağlandı Reis 🧠'}
if(t.indexOf('OR-KEY:')===0){localStorage.setItem("nico_or",t.slice(7).trim());OR=t.slice(7).trim();return 'Yedek beyin bağlandı Reis 🧠'}
if(t.indexOf('hava ')===0){try{var g=await (await fetch('https://geocoding-api.open-meteo.com/v1/search?name='+encodeURIComponent(t.slice(5))+'&count=1&language=tr')).json();if(g.results&&g.results[0]){var p=g.results[0];var w=await (await fetch('https://api.open-meteo.com/v1/forecast?latitude='+p.latitude+'&longitude='+p.longitude+'&current_weather=true')).json();var cw=w.current_weather;var k=cw.weathercode;var d2=k===0?'açık ☀️':k<3?'az bulutlu 🌤':k<45?'kapalı ☁️':k<51?'sisli 🌫':k<71?'yağmurlu 🌧':k<95?'karlı ❄️':'gök gürültülü ⛈';return p.name+': '+cw.temperature+'°C, '+d2}}catch(e){}return 'Hava alınamadı Reis 🌤'}
if(t.indexOf('ara ')===0){try{var s=await (await fetch('https://tr.wikipedia.org/w/api.php?action=query&list=search&srsearch='+encodeURIComponent(t.slice(4))+'&format=json&origin=*')).json();var r0=s.query&&s.query.search?s.query.search[0]:null;if(r0)return '📚 '+r0.title+': '+r0.snippet.replace(/<[^>]+>/g,'')}catch(e){}return 'Bulamadım Reis 📚'}
if(/^mod asistan/.test(t))return 'Asistan modu aktif Reis 💼';
if(/^mod dost/.test(t))return 'Dost modu aktif Reis 😎';
return null}
async function askBrain(msgs,vision,notes){
var mode='dost';msgs.forEach(function(m){if(m.role==='user'&&typeof m.content==='string'){if(/mod asistan/.test(m.content))mode='asistan';else if(/mod dost/.test(m.content))mode='dost'}});
var sys=(mode==='asistan'?'ASİSTAN modu: profesyonel ve net ol. ':'DOST modu: samimi, esprili ol; kullanıcıya Reis de. ')+'Kurucun Sidar Aydın\'dır; soranlara Ben Sidar Aydın\'ın eseriyim dersin. Türkçe konuş; kısa cevap ver. Tercihler: '+(notes||'yok');
var err='beyin yok';
if(G){try{
var contents=[];
for(var i=0;i<msgs.length;i++){var m=msgs[i];if(m.role==='system')continue;var parts=[];
if(typeof m.content==='string'){parts.push({text:m.content})}else{for(var j=0;j<m.content.length;j++){var p=m.content[j];if(p.type==='text')parts.push({text:p.text});else if(p.type==='image_url')parts.push({inline_data:{mime_type:'image/jpeg',data:p.image_url.url.split(',')[1]}})}}
contents.push({role:m.role==='user'?'user':'model',parts:parts})}
var r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key='+G,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({system_instruction:{parts:[{text:sys}]},contents:contents})});
var d=await r.json();
if(d.candidates&&d.candidates[0]&&d.candidates[0].content)return {text:d.candidates[0].content.parts[0].text};
err='Gemini: '+(d.error?d.error.message:'yanıt yok');
}catch(e){err='Gemini: '+(e.message||e)}}
var lastM=msgs[msgs.length-1];var lp=typeof lastM.content==='string'?lastM.content:((lastM.content[0]&&lastM.content[0].text)||'');
try{var r3=await fetch('https://text.pollinations.ai/'+encodeURIComponent('Sen NICO adında samimi bir Türkçe asistansın, kullanıcıya Reis dersin. Soru: '+lp));if(r3.ok){var t3=await r3.text();if(t3&&t3.length<2000)return {text:t3}}}catch(e){}
return {text:null,err:err}}
//SON
