// ERGİN Ana Uygulama Kontrolü

window.onload = function(){

    console.log("ERGİN uygulaması başladı");

    const connectBtn = document.getElementById("connectBtn");
    const disconnectBtn = document.getElementById("disconnectBtn");
    const scanBtn = document.getElementById("scanBtn");


    if(connectBtn){

        connectBtn.addEventListener("click", function(){

            if(typeof connectBluetooth === "function"){

                connectBluetooth();

            }else{

                alert("Bluetooth modülü bulunamadı");

            }

        });

    }


    if(disconnectBtn){

        disconnectBtn.addEventListener("click", function(){

            if(typeof disconnectBluetooth === "function"){

                disconnectBluetooth();

            }

        });

    }


    if(scanBtn){

        scanBtn.addEventListener("click", function(){

            if(typeof startScan === "function"){

                startScan();

            }else{

                alert("Tarama sistemi hazır değil");

            }

        });

    }

};


// Bluetooth bağlantı durumu güncelleme

function updateStatus(text,color){

    let badge=document.getElementById("statusBadge");

    if(badge){

        badge.innerHTML=text;
        badge.style.background=color;

    }

}


// Gelen veriyi ekrana basma

function showData(data){

    let output=document.getElementById("scanValue");

    if(output){

        output.innerHTML=data;

    }

}