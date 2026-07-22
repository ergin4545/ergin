// ERGİN Veri Kayıt Sistemi

const STORAGE_KEY = "ergin_scan_history";


// Veri kaydetme

function saveData(data){

    let history = getData();

    let record = {

        value:data,
        date:new Date().toLocaleString()

    };


    history.push(record);


    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(history)
    );


}


// Kayıtları alma

function getData(){

    let data = localStorage.getItem(STORAGE_KEY);


    if(data){

        return JSON.parse(data);

    }


    return [];

}


// Kayıtları temizleme

function clearData(){

    localStorage.removeItem(STORAGE_KEY);

    alert("Kayıtlar silindi");

}


// Son kayıt

function getLastData(){

    let history=getData();


    if(history.length>0){

        return history[history.length-1];

    }


    return null;

}