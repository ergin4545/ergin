// Web Bluetooth Manager
let bluetoothDevice;
let gattCharacteristic;
let rxBuffer = "";

async function toggleBluetooth() {
  if (bluetoothDevice && bluetoothDevice.gatt.connected) {
    bluetoothDevice.gatt.disconnect();
    updateBtStatus(false);
  } else {
    try {
      bluetoothDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e', '00001101-0000-1000-8000-00805f9b34fb', '0000ffe0-0000-1000-8000-00805f9b34fb']
      });

      const server = await bluetoothDevice.gatt.connect();
      const services = await server.getPrimaryServices();

      if (services.length > 0) {
        const characteristics = await services[0].getCharacteristics();
        if (characteristics.length > 0) {
          gattCharacteristic = characteristics[0];
          await gattCharacteristic.startNotifications();
          gattCharacteristic.addEventListener('characteristicvaluechanged', handleBluetoothData);
          updateBtStatus(true);
        }
      }
    } catch (error) {
      alert("Bluetooth Bağlantı Hatası: " + error);
    }
  }
}

function handleBluetoothData(event) {
  const decoder = new TextDecoder('utf-8');
  rxBuffer += decoder.decode(event.target.value);

  if (rxBuffer.includes('\n') || rxBuffer.includes(',') || rxBuffer.includes(' ')) {
    let parts = rxBuffer.split(/[\n,\s]+/);
    rxBuffer = parts.pop();

    parts.forEach(p => {
      let num = parseFloat(p.trim());
      if (!isNaN(num) && typeof processIncomingData === 'function') {
        processIncomingData(num);
      }
    });
  }
}

function updateBtStatus(connected) {
  const icon = document.getElementById("btStatusIcon");
  const text = document.getElementById("btStatusText");
  if (connected) {
    icon.innerText = "🟢";
    text.innerText = "Bağlandı";
  } else {
    icon.innerText = "🔴";
    text.innerText = "Bağlan";
  }
}
