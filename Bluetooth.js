// bluetooth.js

let bluetoothDevice = null;
let bluetoothServer = null;

async function connectBluetooth(){

bluetoothDevice = await navigator.bluetooth.requestDevice({

acceptAllDevices:true,

optionalServices:[
"0000ffe0-0000-1000-8000-00805f9b34fb",
"00001800-0000-1000-8000-00805f9b34fb",
"00001801-0000-1000-8000-00805f9b34fb"
]

});

bluetoothServer = await bluetoothDevice.gatt.connect();

return true;

}

function disconnectBluetooth(){

if(bluetoothDevice && bluetoothDevice.gatt.connected){

bluetoothDevice.gatt.disconnect();

}

}