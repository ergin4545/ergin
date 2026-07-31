console.log("NICO app.js çalıştı");
const WORKER_URL =
"https://bitter-haze-2503.usermame5252.workers.dev/";



const input =
document.getElementById("user-input");


const button =
document.getElementById("send-button");


const container =
document.getElementById("chat-container");



button.onclick = sendMessage;


input.addEventListener(
"keydown",
(e)=>{

if(e.key==="Enter")
sendMessage();

});





async function sendMessage(){


let text=input.value.trim();


if(!text)return;


addMessage(text,"user");


input.value="";



const loading =
document.createElement("div");


loading.id="loading";

loading.className="message-row nico";


loading.innerHTML=
`
<div class="bubble">
NICO düşünüyor...
</div>
`;

container.appendChild(loading);



try{


const response =
await fetch(
WORKER_URL,
{

method:"POST",

headers:{
"Content-Type":"application/json"
},


body:JSON.stringify({

message:text

})


});



const data =
await response.json();



loading.remove();



addMessage(
data.reply || "Cevap yok",
"nico"
);



saveChat();



}

catch(error){


loading.remove();


addMessage(
"Bağlantı hatası",
"nico"
);


}



}





function addMessage(text,type){


const row =
document.createElement("div");


row.className=
"message-row "+type;



const bubble =
document.createElement("div");


bubble.className="bubble";


bubble.innerText=text;


row.appendChild(bubble);


container.appendChild(row);


container.scrollTop=
container.scrollHeight;
}
