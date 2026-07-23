// scan.js

let scanning = false;
let timer = null;
let cells = [];

function createGrid(){

const grid = document.getElementById("scanGrid");

grid.innerHTML = "";

cells = [];

for(let i=0;i<25;i++){

const cell = document.createElement("div");

cell.className = "cell";

grid.appendChild(cell);

cells.push(cell);

}

}

function startScan(){

if(scanning) return;

scanning = true;

timer = setInterval(()=>{

const value = Math.floor(Math.random()*1000);

document.getElementById("scanInfo").innerHTML =
"Tarama Değeri : "+value;

const index = Math.floor(Math.random()*25);

if(value>700){

cells[index].style.background="#ff0000";

}else if(value>350){

cells[index].style.background="#ffd000";

}else{

cells[index].style.background="#0080ff";

}

saveData(value);

},500);

}

function stopScan(){

scanning = false;

clearInterval(timer);

document.getElementById("scanInfo").innerHTML =
"Tarama Durduruldu";

}