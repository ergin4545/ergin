var P=localStorage.getItem("nico_p")||"Şule45580",F=localStorage.getItem("nico_f")==="1";
var H=JSON.parse(localStorage.getItem("nico_h")||"[]");
var B=JSON.parse(localStorage.getItem("nico_b")||"[]");
var N=JSON.parse(localStorage.getItem("nico_n")||"[]");
var T=localStorage.getItem("nico_tts")==="1",VI=0,VC=false,PEND=null;
var c=document.getElementById("chat"),i=document.getElementById("inp");
function add(t,r,media){var d=document.createElement("div");d.className="m "+r;
if(media&&media.indexOf("data:image")===0){var im=new Image();im.src=media;d.appendChild(im)}
else if(media&&media.indexOf("data:video")===0){var v=document.createElement("video");v.src=media;v.controls=true;d.appendChild(v)}
else if(t&&t.indexOf("[Görsel:")===0){var q=t.slice(9,t.length-1);var g=document.createElement("img");g.src="https://image.pollinations.ai/prompt/"+encodeURIComponent(q)+"?width=512&height=512&nologo=true";d.appendChild(g)}
else{d.textContent=t}
c.appendChild(d);c.scrollTop=c.scrollHeight}
function speak(t,cb){if(!('speechSynthesis'in window)){if(cb)cb();return}var u=new SpeechSynthesisUtterance(t.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu,''));u.lang='tr-TR';var vs=speechSynthesis.getVoices().filter(function(v){return v.lang.indexOf('tr')===0});if(vs.length)u.voice=vs[VI%vs.length];if(cb)u.onend=cb;speechSynthesis.speak(u)}
function listen(cb){var SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){cb(null);return}var R=new SR();R.lang="tr-TR";R.onresult=function(e){cb(e.results[0][0].transcript)};R.onerror=function(){cb(null)};R.start()}
function resume(){setTimeout(function(){add("🎙️ Dinliyorum Reis","a");listen(function(s){if(s){if(/hey nico/i.test(s))s=s.replace(/hey nico/i,"").trim();i.value=s||"dinliyorum";send()}else add("Duyamadım Reis 🎙️","a")})},400)}
function mood(t){var q=t.toLowerCase(),m="";if(/kızgın|sinir|öfke|lanet/.test(q))m="kizgin";else if(/üzgün|moral|ağla|kötü/.test(q))m="uzgun";else if(/mutlu|harika|süper|sevin|komik/.test(q))m="mutlu";else if(/aşk|sevgi|seviyorum/.test(q))m="ask";document.body.dataset.mood=m}
document.getElementById("tts").textContent=T?"🔊":"";
document.getElementById("tts").onclick=function(){T=!T;localStorage.setItem("nico_tts",T?"1":"0");this.textContent=T?"🔊":"";if(T)speak("Ses açıldı Reis")};
document.getElementById("voc").onclick=function(){VI++;speak("Ses değiştirildi Reis")};
document.getElementById("mic").onclick=function(){add("🎙️ Dinliyorum Reis","a");listen(function(s){if(s){if(/hey nico/i.test(s))s=s.replace(/hey nico/i,"").trim();i.value=s||"dinliyorum";send()}else add("Duyamadım Reis 🎙️","a")})};
document.getElementById("vc").onclick=function(){VC=!VC;this.textContent=VC?"🟣":"️";add(VC?"Sesli sohbet AÇIK Reis 🎙️ Konuş; cevabı sesli veririm, sonra yine dinlerim.":"Sesli sohbet kapalı Reis.","a");if(VC)resume()};
document.getElementById("clr").onclick=function(){H=[];localStorage.setItem("nico_h","[]");c.innerHTML="";add("Sayfa temizlendi Reis! 🧹","a")};
document.getElementById("cam").onclick=function(){document.getElementById("file").click()};
document.getElementById("file").onchange=function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(){if(f.type.indexOf("video")===0){add("","u",r.result);add("Videoyu arşive aldım Reis 🎬","a")}else{var img=new Image();img.onload=function(){var cv=document.createElement("canvas");var s=Math.min(1,512/Math.max(img.width,img.height));cv.width=img.width*s;cv.height=img.height*s;cv.getContext("2d").drawImage(img,0,0,cv.width,cv.height);PEND=cv.toDataURL("image/jpeg",0.7);add("","u",PEND);add("Fotoğraf hazır Reis 📷 Altına sorunu yaz, birlikte gönderelim.","a")};img.src=r.result}};r.readAsDataURL(f);e.target.value=""};
H.forEach(function(m){add(m.t,m.r)});
if(!H.length)add("Selam Reis! 👋 Ben NICO, dijital dostun. Ne konuşalım?","a");
async function send(){var t=i.value.trim();if(!t&&!PEND)return;i.value="";mood(t);
if(t===P){F=true;localStorage.setItem("nico_f","1");add("••••••","u");setTimeout(function(){add("Hoş geldin Sidar Reis! 🎉 Seni tanıdım. Hafızam açık, her şey emrine amade.","a");speak("Hoş geldin Sidar Reis. Seni tanıdım.")},500);return}
if(F&&t.indexOf("yeni şifre ")===0){P=t.slice(11).trim();localStorage.setItem("nico_p",P);add("Şifre güncellendi Reis 🔐","a");return}
if(/reset nico/i.test(t)){H=[];localStorage.setItem("nico_h","[]");c.innerHTML="";add("Sistem tazelendi Reis! 🔄","a");return}
var nt=t.match(/^(nico not:|bunu böyle yap|not al)(.+)/i);
if(nt){N.push(nt[2].trim());localStorage.setItem("nico_n",JSON.stringify(N));add("Hafızama kazıdım Reis 📝","a");return}
var im=t.match(/^görsel (.+)/);
if(im){add(t,"u");add("[Görsel: "+im[1]+"]","a");H.push({t:t,r:"u"});H.push({t:"[Görsel: "+im[1]+"]",r:"a"});localStorage.setItem("nico_h",JSON.stringify(H));return}
var vision=!!PEND;var content;
if(PEND){content=[{type:"text",text:t||"Bu fotoğrafı açıkla ve yorum yap"},{type:"image_url",image_url:{url:PEND}}];PEND=null;add(t||"📷","u");H.push({t:t||"[Fotoğraf]",r:"u"})}else{add(t,"u");H.push({t:t,r:"u"});content=t}
if(H.length>40)H=H.slice(-40);localStorage.setItem("nico_h",JSON.stringify(H));
var cmd=null;try{cmd=await brainCommand(t)}catch(e){cmd=null}
if(cmd){add(cmd,"a");H.push({t:cmd,r:"a"});localStorage.setItem("nico_h",JSON.stringify(H));if(T||VC)speak(cmd,function(){if(VC)resume()});return}
var rm=t.match(/^hatırlat (\d{1,2}):(\d{2}) (.+)/);
if(rm){var d=new Date();d.setHours(+rm[1],+rm[2],0,0);if(d<new Date())d.setDate(d.getDate()+1);setTimeout(function(){add("Reis unuttun mu? ⏰ "+rm[3],"a");speak("Reis unuttun mu? "+rm[3]);if(navigator.vibrate)navigator.vibrate(400)},d-Date.now());add("Tamam Reis, "+rm[1]+":"+rm[2]+" için kurdum ⏰","a");return}
var g=t.match(/^(gelir|gider) (\d+)/);
if(g){B.push({t:g[1],v:+g[2]});localStorage.setItem("nico_b",JSON.stringify(B));add((g[1]==="gelir"?"+":"-")+g[2]+" TL işlendi Reis 💰","a");return}
if(/^bütçe/.test(t)){var gi=0,ge=0;B.forEach(function(x){if(x.t==="gelir")gi+=x.v;else ge+=x.v});add("Gelir: +"+gi+" TL\nGider: -"+ge+" TL\nKalan: "+(gi-ge)+" TL 💰","a");return}
if(/^kur/.test(t)){try{var r2=await fetch("https://open.er-api.com/v6/latest/USD");var d2=await r2.json();add("💱 1 USD = "+d2.rates.TRY.toFixed(2)+" TL\n1 EUR = "+(d2.rates.TRY/d2.rates.EUR).toFixed(2)+" TL","a")}catch(e){add("Kur alınamadı Reis","a")}return}
var msgs=[];
H.slice(-10).forEach(function(m){msgs.push({role:m.r==="u"?"user":"assistant",content:m.t})});
msgs.push({role:"user",content:content});
var res={text:null,err:'beyin dosyası yok'};
try{res=await askBrain(msgs,vision,N.join(" | "))}catch(e){res={text:null,err:'beyin hatası: '+(e.message||e)}}
var reply=res.text||("⚠️ "+res.err);
add(reply,"a");H.push({t:reply,r:"a"});localStorage.setItem("nico_h",JSON.stringify(H));
if(T||VC){speak(reply,function(){if(VC)resume()})}}
document.getElementById("go").onclick=send;
i.addEventListener("keypress",function(e){if(e.key==="Enter")send()});
//SON
