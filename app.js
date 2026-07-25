document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chatBox");
    const userInput = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");

    loadChatHistory();

    function addMessage(text, sender, saveToStorage = true) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message");
        if (sender === "user") {
            msgDiv.classList.add("user-msg");
        } else {
            msgDiv.classList.add("nico-msg");
        }
        msgDiv.textContent = text;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

        if (saveToStorage && typeof saveData === "function") {
            saveData({ text: text, sender: sender });
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
                        msgDiv.textContent = msgData.text;
                        chatBox.appendChild(msgDiv);
                    }
                });
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        }
    }

    function handleSend() {
        const text = userInput.value.trim();
        if (!text) return;

        addMessage(text, "user");
        userInput.value = "";

        setTimeout(() => {
            let reply = "Bunu henüz öğrenmedim ama üzerinde çalışıyorum patron!";
            // Türkçe karakter ve büyük/küçük harf sorununu ortadan kaldıran dönüştürme:
            const lower = text.toLowerCase().replace(/İ/g, 'i').replace(/I/g, 'ı');
            
            if (lower.includes("merhaba") || lower.includes("selam")) {
                reply = "Aleykümselam patron! Sistemler %100 kapasiteyle emrinde.";
            } else if (lower.includes("nasılsın") || lower.includes("nasıl")) {
                reply = "Efsaneyim! Seninle kod yazmak ve bu sistemi geliştirmek bana enerji veriyor.";
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
