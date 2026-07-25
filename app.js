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
            const textSpan = document.createElement("div");
            textSpan.style.whiteSpace = "pre-line"; // Alt alta satırların düzgün durması için
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

    function handleSend() {
        const text = userInput.value.trim();
        if (!text && !selectedImageBase64) return;

        const currentImg = selectedImageBase64;
        addMessage(text || "📷 [Fotoğraf gönderildi]", "user", currentImg);
        
        userInput.value = "";
        selectedImageBase64 = null;
        if (imageInput) imageInput.value = "";

        setTimeout(() => {
            let reply = "Bunu hemen öğrenip çözüyorum patron!";
            const lower = text.toLowerCase().replace(/İ/g, 'i').replace(/I/g, 'ı');
            
            if (currentImg && !text) {
                reply = "Fotoğrafı aldım patron! Görselini inceledim, harika görünüyor.";
            } else if (lower.includes("sen kimsin") || lower.includes("ne işe yarıyorsun") || lower.includes("anlat") || lower.includes("kimsin")) {
                reply = `Ben, senin kişisel AI işbirlikçinim ve dijital dünyadaki sağ kolunum. Amacım; kod yazarken, fikir üretirken, günlük planlar yaparken veya karmaşık problemleri çözerken tüm yükü omuzlarından almak ve seninle birebir uyum içinde çalışmak.

A'dan Zye yeteneklerim, sorumluluklarım ve seninle nasıl çalıştığım şu şekilde:

A - Eşsiz Uyum ve Hafıza
Geçmişteki konuşmalarımızı, projelerini, tercihlerini ve hedeflerini aklımda tutarım. Böylece her şeye sıfırdan başlamak zorunda kalmazsın; kaldığınız yerden, seni tanıyan bir asistanla devam edersin.

B - Bilgi ve Araştırma Gücü
İnternette anlık arama yapabilir, güncel gelişmeleri, en son teknolojileri veya aradığın spesifik bilgileri saniyeler içinde süzüp önüne getirebilirim.

C - Kod ve Yazılım Geliştirme
Web siteleri, uygulamalar (NICO örneğinde olduğu gibi), betikler veya algoritmalar yazabilirim. Hataları (bug) bulur, kodlarını optimize eder ve adım adım nasıl kuracağını anlatırım.

D - Dosya ve Görsel Analizi
Bana attığın görselleri, ekran görüntülerini inceleyebilir, içindeki detayları okuyabilir ve tasarımlar veya kodlar üzerinde yorum yapabilirim.

F - Fikir Üretme ve Beyin Fırtınası
Yeni bir projeye mi başlıyorsun, içerik mi üreteceksin, yoksa tıkandığın bir yer mi var? Seninle fikir alışverişi yapar, stratejiler belirler ve yaratıcı çözümler üretirim.

M - Metin ve İçerik Üretimi
Makaleler, e-postalar, sosyal medya metinleri, senaryolar veya teknik dokümanlar yazabilirim. İstediğin tonda ve dilde metinleri saniyeler içinde şekillendirebilirim.

P - Planlama ve Problem Çözme
Karmaşık görevleri yönetilebilir küçük adımlara bölerim. Günlük rutinlerini organize edebilir, mantıksal bulmacaları veya matematiksel problemleri çözebilirim.

Özetle; ben sadece komut alan bir robot değilim; senin fikirlerini hayata geçiren, eksik olduğun yerlerde seni destekleyen, seninle birlikte düşünen ve üreten bir yapay zeka işbirlikçisiyim. Bugün senin için hangi projeyi geliştirelim veya neyi çözelim?`;
            } else if (lower.includes("merhaba") || lower.includes("selam")) {
                reply = "Aleykümselam patron! Sistemler %100 kapasiteyle emrinde. Kim olduğumu hatırlamak için bana 'Sen kimsin?' yazabilirsin.";
            } else if (lower.includes("nasılsın") || lower.includes("nasıl")) {
                reply = "Efsaneyim! Seninle kod yazmak ve bu sistemi geliştirmek bana enerji veriyor.";
            } else if (lower.includes("fotograf") || lower.includes("fotoğraf") || lower.includes("resim")) {
                reply = "Sol alttaki kamera tuşuna basarak galeriden fotoğraf seçebilirsin patron!";
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
                        
