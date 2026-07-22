// ERGİN Tarama Sistemi

let scanning = false;
let scanValue = 0;


function startScan(){

    if(scanning){

        alert("Tarama zaten devam ediyor");
        return;

    }


    scanning = true;

    let status = document.getElementById("statusBadge");

    if(status){

        status.innerHTML = "Tarama Aktif";
        status.style.background = "#0070c0";

    }


    console.log("Tarama başladı");


    // Test verisi (Bluetooth verisi gelince burası değişecek)

    let timer = setInterval(()=>{


        if(!scanning){

            clearInterval(timer);
            return;

        }


        scanValue = Math.floor(Math.random()*100);


        showData(scanValue);


    },1000);


}



function stopScan(){

    scanning = false;


    let status = document.getElementById("statusBadge");

    if(status){

        status.innerHTML="Hazır";
        status.style.background="#555";

    }


    console.log("Tarama durdu");

}