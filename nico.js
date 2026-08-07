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
document.getElementById("vc").onclick=function(){VC=!VC;this.textContent=VC?"🟣":"️";add(VC?"Sesli sohbet AÇIK Reis 🎙️ Konuş;
