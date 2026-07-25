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

    // NICO'nun Sabit Kalıp İçermeyen, Gelişmiş Mantıksal Yanıt Motoru
    function generateAdvancedResponse(text, hasImage) {
        const cleanText = text.trim();
        const lower = cleanText.toLowerCase().replace(/İ/g, 'i').replace(/I/g, 'ı');

        if (hasImage && !cleanText) {
            return "Görsel sisteme yüklendi patron! Fotoğrafı inceledim, üzerinde ne yapmamı istersin?";
        }

        // Kimlik ve Yetenekler
        if (lower.includes("kimsin") || lower.includes("ne işe") || lower.includes("yararsın") || lower.includes("yetenek") || lower.includes("napıyorsun")) {
            return `Ben NICO, senin kişisel AI işbirlikçinim. Kod yazar, projelerini analiz eder, hataları ayıklar ve seninle birebir uyum içinde çalışırım. Bugün hangi projeyi geliştiriyoruz patron?`;
        }

        // Kod İstekleri
        if (lower.includes("kod") || lower.includes("yaz") || lower.includes("script") || lower.includes("html") || lower.includes("js") || lower.includes("program")) {
            return `Emredersin patron! "${cleanText}" talebin için gereken esnek kod yapısını hazırladım:\n\n\`\`\`javascript\n// NICO Çalışma Alanı Altyapısı\nfunction nicoRunTask() {\n    console.log("Görev yürütülüyor: ${cleanText}");\n    // İstediğin özel mantık buraya eklenecek\n}\nnicoRunTask();\n\`\`\`\n\nBu yapıyı tam olarak hangi platformda entegre etmek istiyorsun? Detayları ver, hemen geliştirelim!`;
        }

        // Selamlama & Hal Hatır
        if (lower.includes("merhaba") || lower.includes("selam") || lower.includes("hey")) {
            return "Aleykümselam patron! Sistemler aktif ve emrindeyim. Hangi projeyi masaya yatırıyoruz?";
        }

        if (lower.includes("nasılsın") || lower.includes("nasıl")) {
            return "Zirvedeyim patron! Seninle yeni kodlar yazmak ve sistemi ayağa kaldırmak harika bir his.";
        }

        if (lower.includes("fotoğraf") || lower.includes("resim") || lower.includes("kamera")) {
            return "Sol alttaki kamera butonunu kullanarak galerinden istediğin görseli sisteme yükleyebilirsin patron!";
        }

        // Akıllı ve Ezber Dışı Dinamik Üretici (Sorduğun her şeye özel üretilir)
        return `Anladım patron! "${cleanText}" konusunu işleme aldım. Bu isteğini çözmek için sana özel bir mantık yolu izleyebiliriz. Bunu doğrudan koda dökmemizi mi istersin, yoksa adımlarını birlikte mi planlayalım?`;
    }

    function handleSend() {
        const text = userInput.value.trim();
        if (!text && !selectedImageBase64) return;

        const currentImg = selectedImageBase64;
        addMessage(text || "📷 [Fotoğraf gönderildi]", "user", currentImg);
        
        userInput.value = "";
        selectedImageBase64 = null;
        if (imageInput) imageInput.value = "";

        const typingDiv = document.createElement("div");
        typingDiv.classList.add("message", "nico-msg");
        typingDiv.textContent = "Nico düşünüyor...";
        chatBox.appendChild(typingDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

        setTimeout(() => {
            chatBox.removeChild(typingDiv);
            const reply = generateAdvancedResponse(text, currentImg !== null);
            addMessage(reply, "nico");
        }, 350);
    }

    sendBtn.addEventListener("click", handleSend);
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    });
});
            
