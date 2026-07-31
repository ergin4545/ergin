const WORKER_URL =
"https://bitter-haze-2503.usermame5252.workers.dev/";


document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("user-input");
    const button = document.getElementById("send-button");
    const container = document.getElementById("chat-container");


    if (!input || !button || !container) {
        console.log("NICO: HTML element bulunamadı");
        return;
    }


    console.log("NICO hazır");


    button.addEventListener("click", sendMessage);


    input.addEventListener("keydown", (e) => {

        if (e.key === "Enter") {
            sendMessage();
        }

    });



    async function sendMessage() {


        const text = input.value.trim();


        if (!text) return;


        addMessage(text, "user");


        input.value = "";


        const loading = document.createElement("div");

        loading.id = "loading";

        loading.className = "message-row nico";


        loading.innerHTML = `
            <div class="bubble">
                NICO düşünüyor...
            </div>
        `;


        container.appendChild(loading);



        try {


            const response = await fetch(
                WORKER_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        message: text
                    })
                }
            );


            const data = await response.json();


            loading.remove();


            addMessage(
                data.reply || "Cevap alınamadı",
                "nico"
            );


            if (typeof saveChat === "function") {
                saveChat();
            }


        } catch(error) {


            loading.remove();


            addMessage(
                "Bağlantı hatası: " + error.message,
                "nico"
            );


        }

    }



    function addMessage(text, type) {


        const row = document.createElement("div");

        row.className = "message-row " + type;


        const bubble = document.createElement("div");

        bubble.className = "bubble";


        bubble.innerText = text;


        row.appendChild(bubble);


        container.appendChild(row);


        container.scrollTop =
        container.scrollHeight;

    }


});
          
