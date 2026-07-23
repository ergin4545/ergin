// storage.js

const STORAGE_KEY = "ergin_scan_history";

function saveData(value){

let history = getHistory();

history.push({

value:value,
time:new Date().toLocaleString()

});

localStorage.setItem(
STORAGE_KEY,
JSON.stringify(history)
);

}

function getHistory(){

let data = localStorage.getItem(STORAGE_KEY);

if(data){

return JSON.parse(data);

}

return [];

}

function clearHistory(){

localStorage.removeItem(STORAGE_KEY);

}

function getLastRecord(){

let history = getHistory();

if(history.length===0){

return null;

}

return history[history.length-1];

}