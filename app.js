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

        // Nico'nun akıllı cevap simülasyonu
        setTimeout(() => {
            let reply = "Anladım patron, üzerinde çalışıyorum!";
            const lower = text.toLowerCase();
            
            if (lower.includes("merhaba") || lower.includes("selam")) {
                reply = "Selam patron! Sistemler tam gaz çalışıyor, ne yapıyoruz?";
            } else if (lower.includes("nasılsın")) {
                reply = "Efsaneyim! GitHub altyapısına geçtikten sonra hızım katlandı.";
            } else if (lower.includes("kod") || lower.includes("program")) {
                reply = "Kodlar güvenle GitHub'da saklanıyor. Yeni bir özellik mi ekleyelim?";
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
