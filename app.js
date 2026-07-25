document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chatBox");
    const userInput = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");
    const uploadBtn = document.getElementById("uploadBtn");
    const imageInput = document.getElementById("imageInput");

    let selectedImageBase64 = null;

    loadChatHistory();

    if (uploadBtn && imageInput) {
        uploadBtn.addEventListener("click", () => {
            imageInput.click();
        });

        imageInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(uploadEvent) {
                    selectedImageBase64 = uploadEvent.target.result;
                    addMessage("📷 [Fotoğraf seçildi]", "user", selectedImageBase64);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    function addMessage(text, sender, imageUrl = null, saveToStorage = true) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message");
        msgDiv.classList.add(sender === "user" ? "user-msg" : "nico-msg");

        if (imageUrl) {
            const img = document.createElement("img");
            img.src = imageUrl;
            img.style.maxWidth = "200px";
            img.style.borderRadius = "8px";
            img.style.display = "block";
            img.style.marginBottom = "5px";
            msgDiv.appendChild(img);
        }

        if (text && text !== "📷 [Fotoğraf seçildi]") {
            const textSpan = document.createElement("div");
            textSpan.style.whiteSpace = "pre-line";
            textSpan.textContent = text;
            msgDiv.appendChild(textSpan);
        } else if (text === "📷 [Fotoğraf seçildi]" && !imageUrl) {
            const textSpan = document.createElement("span");
            textSpan.textContent = text;
            msgDiv.appendChild(textSpan);
        }

        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

        if (saveToStorage && typeof saveData === "function") {
            saveData({ text: text, sender: sender, image: imageUrl });
        }
    }

    function loadChatHistory() {
        if (typeof getHistory === "function") {
            const history = getHistory();
            if (history.length > 0) {
                chatBox.innerHTML = "";
                history.forEach(item => {
                    if (item && item.value) {
                        const msgData = item.value;
                        const msgDiv = document.createElement("div");
                        msgDiv.classList.add("message");
                        msgDiv.classList.add(msgData.sender === "user" ? "user-msg" : "nico-msg");

                        if (msgData.image) {
                            const img = document.createElement("img");
                            img.src = msgData.image;
                            img.style.maxWidth = "200px";
                            img.style.borderRadius = "8px";
                            img.style.display = "block";
                            img.style.marginBottom = "5px";
                            msgDiv.appendChild(img);
                        }

                        if (msgData.text) {
                            const textSpan = document.createElement("div");
                            textSpan.style.whiteSpace = "pre-line";
                            textSpan.textContent = msgData.text;
                            msgDiv.appendChild(textSpan);
                        }

                        chatBox.appendChild(msgDiv);
                    }
                });
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        }
    }

    // Gerçek Yapay Zeka Yanıt Üreticisi
    async function getRealAIResponse(userText) {
        const apiKey = "BURAYA_GEMINI_API_ANAHTARINI_YAZ"; // Kendi API anahtarını buraya ekleyeceksin
        if (apiKey === "BURAYA_GEMINI_API_ANAHTARINI_YAZ") {
            return "Patron, tam anlamıyla akıllı bir yapay zeka olabilmem için kodun içindeki API anahtarını tanımlaman gerekiyor!";
        }

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Sen NICO adlı kişisel AI işbirlikçisisin. Kod yazabilir, fikir üretebilir, sorunları çözebilir ve tıpkı bir yazılım asistanı gibi esnek ve samimi konuşursun. Kullanıcının mesajı: "${userText}"`
                        }]
                    }]
                })
            });
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (err) {
            return "Bağlantı kurulamadı patron, internetini veya anahtarını kontrol edelim.";
        }
    }

    async function handleSend() {
        const text = userInput.value.trim();
        if (!text && !selectedImageBase64) return;

        const currentImg = selectedImageBase64;
        addMessage(text || "📷 [Fotoğraf gönderildi]", "user", currentImg);
        
        userInput.value = "";
        selectedImageBase64 = null;
        if (imageInput) imageInput.value = "";

        const loadingDiv = document.createElement("div");
        loadingDiv.classList.add("message", "nico-msg");
        loadingDiv.textContent = "Düşünüyor ve kodluyorum patron...";
        chatBox.appendChild(loadingDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

        let reply = await getRealAIResponse(text);

        chatBox.removeChild(loadingDiv);
        addMessage(reply, "nico");
    }

    sendBtn.addEventListener("click", handleSend);
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    });
});
                
