// ERGİN Ayarlar Sistemi

const SETTINGS_KEY = "ergin_settings";


// Varsayılan ayarlar

let defaultSettings = {

    deviceName: "ERGİN Cihaz",
    scanSpeed: 1000,
    autoSave: true

};


// Ayarları kaydetme

function saveSettings(settings){

    localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(settings)
    );

    alert("Ayarlar kaydedildi");

}


// Ayarları alma

function getSettings(){

    let data = localStorage.getItem(SETTINGS_KEY);


    if(data){

        return JSON.parse(data);

    }


    return defaultSettings;

}


// Ayar değiştirme

function updateSetting(key,value){

    let settings = getSettings();

    settings[key] = value;

    saveSettings(settings);

}


// Ayarları sıfırlama

function resetSettings(){

    localStorage.removeItem(SETTINGS_KEY);

    alert("Ayarlar sıfırlandı");

}