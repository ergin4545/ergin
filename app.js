// NICO AI Assistant - app.js

const WORKER_URL = "https://bitter-haze-2503.usermame5252.workers.dev/";

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const uploadBtn = document.getElementById("uploadBtn");
const imageInput = document.getElementById("imageInput");


// Mesaj ekleme
function addMessage(text, type) {
    const msg = document.createElement("div");
    msg.className = "message " + type;
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}


// Worker üzerinden NICO'ya gönder
async function askNico(text) {

    const loading = document.createElement("div");
    loading.className = "message nico-msg";
    loading.textContent = "NICO düşünüyor...";
    chatBox.appendChild(loading);

    try {

        const res = await fetch(WORKER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: text
            })
        });


        const data = await res.json();

        loading.remove();


        if (data.reply) {
            addMessage(data.reply, "nico-msg");
        } else {
            addMessage(
                "Patron, Worker cevap döndürmedi.",
                "nico-msg"
            );
        }


    } catch (error) {

        console.error(error);

        loading.remove();

        addMessage(
            "Bağlantı kurulamadı. Worker veya Gemini ayarını kontrol et.",
            "nico-msg"
        );
    }
}


// Gönder butonu
sendBtn.addEventListener("click", () => {

    const text = userInput.value.trim();

    if (!text) return;


    addMessage(text, "user-msg");

    userInput.value = "";

    askNico(text);

});


// Enter tuşu
userInput.addEventListener("keydown", (e)=>{

    if(e.key === "Enter"){
        sendBtn.click();
    }

});


// Fotoğraf butonu
uploadBtn.addEventListener("click", ()=>{

    imageInput.click();

});


// Fotoğraf seçildiğinde
imageInput.addEventListener("change", ()=>{

    const file = imageInput.files[0];

    if(file){

        addMessage(
            "📷 Fotoğraf seçildi: " + file.name,
            "user-msg"
        );


        askNico(
            "Kullanıcı bir fotoğraf yükledi. Bu özelliği yakında destekle."
        );

    }

});


console.log("NICO aktif. Worker bağlantısı hazır.");
