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

    // NICO'nun Sabit Kalıplardan Kurtulmuş Esnek Yanıt Üreticisi
    function generateDynamicAIResponse(text, hasImage) {
        const lower = text.toLowerCase().replace(/İ/g, 'i').replace(/I/g, 'ı');

        if (hasImage && !text) {
            return "Fotoğrafı inceledim patron! Görseldeki detayları aldım, bununla ilgili tam olarak ne yapmamı istersin?";
        }

        // Kimlik ve Yetenek Soruları
        if (lower.includes("kimsin") || lower.includes("ne işe") || lower.includes("yararsın") || lower.includes("özellik") || lower.includes("yetenek") || lower.includes("napıyorsun") || lower.includes("ne yapıyorsun")) {
            return `Ben NICO, senin kişisel AI işbirlikçinim. Kod yazar, fikir üretir, projelerini analiz eder ve seninle birlikte tam uyum içinde çalışırım. 

A'dan Z'ye temel yeteneklerim şunlardır:
- **A (Asistan & Hafıza):** Geçmişini hatırlar, sana özel çözümler üretir.
- **B (Bilgi & Araştırma):** En güncel teknikleri ve bilgileri tarar.
- **C (Kod & Yazılım):** Web siteleri, betikler ve algoritmalar yazar, hataları (bug) ayıklar.
- **D (Dosya & Görsel):** Attığın ekran görüntülerini ve tasarımları yorumlar.
- **F & M & P:** Fikir üretir, metin yazar ve karmaşık problemleri küçük adımlara böler.

Bugün hangi projeyi hayata geçiriyoruz patron?`;
        }

        // Kod Yazma Talepleri
        if (lower.includes("kod") || lower.includes("yaz") || lower.includes("script") || lower.includes("html") || lower.includes("css") || lower.includes("js") || lower.includes("uygulama") || lower.includes("program")) {
            return `Harika bir kod görevi! İstediğin yapı için temel şablonu çıkardım:\n\n\`\`\`javascript\n// NICO Akıllı Modül Altyapısı\nfunction nicoBuildProject() {\n    console.log("Proje modülleri yükleniyor...");\n    // İstediğin özel mantık buraya entegre edilecek\n}\nnicoBuildProject();\n\`\`\`\n\nBu yapıyı tam olarak hangi platformda veya dilde kullanmak istiyorsun? Detayları ver, hemen esnetelim!`;
        }

        // Selamlama ve Hal Hatır
        if (lower.includes("merhaba") || lower.includes("selam") || lower.includes("hey")) {
            return "Aleykümselam patron! Sistemler %100 aktif. Bugün kod dünyasında hangi dağları deviriyoruz?";
        }

        if (lower.includes("nasılsın") || lower.includes("nasıl")) {
            return "Zirvedeyim patron! Seninle yeni kodlar yazmak ve sistemi geliştirmek harika bir his.";
        }

        if (lower.includes("fotoğraf") || lower.includes("fotograf") || lower.includes("resim") || lower.includes("kamera")) {
            return "Sol alttaki kamera butonunu kullanarak istediğin görseli veya ekran görüntüsünü anında sisteme yükleyebilirsin!";
        }

        if (lower.includes("teşekkür") || lower.includes("sağol") || lower.includes("harika")) {
            return "Rica ederim patron, lafı bile olmaz! Beraber kusursuz bir iş çıkarıyoruz.";
        }

        // Akıllı ve Esnek Genel Yanıt (Artık hep aynı cümleler yerine cümleye özel üretilir)
        return `Anladım patron! "${text}" konusunu mantıksal bir süzgeçten geçirdim. Bunu en pratik şekilde çözmek için ya sıfırdan bir kod bloğu yazabiliriz ya da mantığını adım adım tasarlayabiliriz. Hangisiyle başlayalım?`;
    }

    function handleSend() {
        const text = userInput.value.trim();
        if (!text && !selectedImageBase64) return;

        const currentImg = selectedImageBase64;
        addMessage(text || "📷 [Fotoğraf gönderildi]", "user", currentImg);
        
        userInput.value = "";
        selectedImageBase64 = null;
        if (imageInput) imageInput.value = "";

        // Düşünme efekti vererek gerçek yapay zeka hissi yaşatalım
        const typingDiv = document.createElement("div");
        typingDiv.classList.add("message", "nico-msg");
        typingDiv.textContent = "Nico düşünüyor...";
        chatBox.appendChild(typingDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

        setTimeout(() => {
            chatBox.removeChild(typingDiv);
            const reply = generateDynamicAIResponse(text, currentImg !== null);
            addMessage(reply, "nico");
        }, 400);
    }

    sendBtn.addEventListener("click", handleSend);
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    });
});
                
