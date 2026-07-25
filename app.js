document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chatBox");
    const userInput = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");
    const uploadBtn = document.getElementById("uploadBtn");
    const imageInput = document.getElementById("imageInput");

    let selectedImageBase64 = null;

    loadChatHistory();

    // Kamera butonuna basınca dosya seçiciyi aç
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
        if (sender === "user") {
            msgDiv.classList.add("user-msg");
        } else {
            msgDiv.classList.add("nico-msg");
        }

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
            const textSpan = document.createElement("span");
            textSpan.textContent = text;
            msgDiv.appendChild(textSpan);
        } else if (imageUrl && !text.includes("Fotoğraf")) {
            // Sadece resim varsa
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
                            const textSpan = document.createElement("span");
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

    function handleSend() {
        const text = userInput.value.trim();
        if (!text && !selectedImageBase64) return;

        const currentImg = selectedImageBase64;
        addMessage(text || "📷 [Fotoğraf gönderildi]", "user", currentImg);
        
        userInput.value = "";
        selectedImageBase64 = null;
        if (imageInput) imageInput.value = "";

        setTimeout(() => {
            let reply = "Bunu henüz öğrenmedim ama üzerinde çalışıyorum patron!";
            const lower = text.toLowerCase().replace(/İ/g, 'i').replace(/I/g, 'ı');
            
            if (currentImg && !text) {
                reply = "Fotoğrafı aldım patron! Görsel işleme motorları şimdilik beklemede ama harika görünüyor.";
            } else if (lower.includes("merhaba") || lower.includes("selam")) {
                reply = "Aleykümselam patron! Sistemler %100 kapasiteyle emrinde.";
            } else if (lower.includes("nasılsın") || lower.includes("nasıl")) {
                reply = "Efsaneyim! Seninle kod yazmak ve bu sistemi geliştirmek bana enerji veriyor.";
            } else if (lower.includes("sevindim") || lower.includes("harika") || lower.includes("süper")) {
                reply = "Eyvallah patron! Seninle her şey daha da iyi olacak.";
            } else if (lower.includes("ne zaman") || lower.includes("nezaman") || lower.includes("ne vakit")) {
                reply = "Seninle bu hızla gidersek yarını beklemeden hemen şimdi öğrenirim patron!";
            } else if (lower.includes("ne yapıyorsun") || lower.includes("ne yapıyon")) {
                reply = "Seninle geleceğin uygulamasını inşa ediyoruz patron, başka ne olsun?";
            } else if (lower.includes("logo")) {
                reply = "Efsane logomuz yerine oturdu, sisteme ayrı bir hava kattı!";
            } else if (lower.includes("github") || lower.includes("kod")) {
                reply = "Kodlar güvende, GitHub Pages üzerinden canlı yayındayız. Hafızamız da aktif!";
            } else if (lower.includes("teşekkür") || lower.includes("sağol")) {
                reply = "Ne demek patron, lafı bile olmaz! Beraber harikalar yaratıyoruz.";
            }

            addMessage(reply, "nico");
        }, 600);
    }

    sendBtn.addEventListener("click", handleSend);
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    });
});
                   
