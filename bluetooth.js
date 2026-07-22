let bluetoothDevice = null;
let gattServer = null;
let dataCharacteristic = null;

async function connectBluetooth() {

    try {

        bluetoothDevice = await navigator.bluetooth.requestDevice({

            acceptAllDevices: true,

            optionalServices: [
                "0000ffe0-0000-1000-8000-00805f9b34fb",
                "00001800-0000-1000-8000-00805f9b34fb",
                "00001801-0000-1000-8000-00805f9b34fb"

            ]

        });

        gattServer = await bluetoothDevice.gatt.connect();

        document.getElementById("statusBadge").innerHTML = "Bağlandı";

        document.getElementById("statusBadge").style.background = "#00b050";

        alert("Bluetooth Bağlandı");

    }

    catch(error){

        alert(error.message);

    }

}

function disconnectBluetooth(){

    if(bluetoothDevice && bluetoothDevice.gatt.connected){

        bluetoothDevice.gatt.disconnect();

    }

    document.getElementById("statusBadge").innerHTML="Bağlı Değil";

    document.getElementById("statusBadge").style.background="#b00020";

}