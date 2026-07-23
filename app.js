// app.js

window.addEventListener("load", () => {

const statusBadge = document.getElementById("statusBadge");

const connectBtn = document.getElementById("connectBtn");
const disconnectBtn = document.getElementById("disconnectBtn");
const scanBtn = document.getElementById("scanBtn");
const stopBtn = document.getElementById("stopBtn");

createGrid();

connectBtn.addEventListener("click", async () => {

try{

await connectBluetooth();

statusBadge.innerHTML="Bluetooth Bağlandı";
statusBadge.style.background="#009944";

}catch(e){

alert(e.message);

}

});

disconnectBtn.addEventListener("click",()=>{

disconnectBluetooth();

statusBadge.innerHTML="Bağlı Değil";
statusBadge.style.background="#b00020";

});

scanBtn.addEventListener("click",()=>{

startScan();

statusBadge.innerHTML="Tarama Aktif";
statusBadge.style.background="#0066ff";

});

stopBtn.addEventListener("click",()=>{

stopScan();

statusBadge.innerHTML="Hazır";
statusBadge.style.background="#555";

});

});