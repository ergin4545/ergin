// settings.js

const SETTINGS_KEY = "ergin_settings";

const defaultSettings = {

deviceName:"ERGİN",

scanSpeed:500,

autoSave:true

};

function saveSettings(settings){

localStorage.setItem(
SETTINGS_KEY,
JSON.stringify(settings)
);

}

function getSettings(){

let data = localStorage.getItem(SETTINGS_KEY);

if(data){

return JSON.parse(data);

}

return defaultSettings;

}

function updateSetting(key,value){

let settings=getSettings();

settings[key]=value;

saveSettings(settings);

}

function resetSettings(){

localStorage.removeItem(SETTINGS_KEY);

}