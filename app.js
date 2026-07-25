document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chatBox");
    const userInput = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");

    function addMessage(text, sender) {
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
    }

    function handleSend() {
        const text = userInput.value.trim();
        if (!text) return;

        addMessage(text, "user");
        userInput.value = "";

        // Nico'nun gelişmiş zeka simülasyonu
        setTimeout(() => {
            let reply = "Bunu henüz öğrenmedim ama üzerinde çalışıyorum patron!";
            const lower = text.toLowerCase();
            
            if (lower.includes("merhaba") || lower.includes("selam")) {
                reply = "Aleykümselam patron! Sistemler %100 kapasiteyle emrinde.";
            } else if (lower.includes("nasılsın")) {
                reply = "Efsaneyim! Seninle kod yazmak ve bu sistemi geliştirmek bana enerji veriyor.";
            } else if (lower.includes("ne yapıyorsun") || lower.includes("ne yapıyon")) {
                reply = "Seninle geleceğin uygulamasını inşa ediyoruz patron, başka ne olsun?";
            } else if (lower.includes("logo")) {
                reply = "Efsane logomuz yerine oturdu, sisteme ayrı bir hava kattı!";
            } else if (lower.includes("github") || lower.includes("kod")) {
                reply = "Kodlar güvende, GitHub Pages üzerinden canlı yayındayız. İstediğimiz an yeni özellikler ekleyebiliriz.";
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
            
