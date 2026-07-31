function saveChat(){

localStorage.setItem(
"NICO_HISTORY",
document.getElementById(
"chat-container"
).innerHTML
);


}



function loadChat(){


const old =
localStorage.getItem(
"NICO_HISTORY"
);



if(old){

document.getElementById(
"chat-container"
).innerHTML=old;

}


}



window.addEventListener(
"load",
loadChat
);
