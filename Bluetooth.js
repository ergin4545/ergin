let bluetoothDevice;
let gattServer;
let rxCharacteristic;

// Bluetooth Cihazına Bağlanma
async function connectBluetooth() {
  try {
    bluetoothDevice = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: 'FURINA' }, { namePrefix: 'HC-' }, { namePrefix: 'JDY' }],
      optionalServices: ['00001101-0000-1000-8000-00805f9b34fb', '0000ffe0-0000-1000-8000-00805f9b34fb']
    });

    gattServer = await bluetoothDevice.gatt.connect();
    
    // Servis ve Characteristic bulma
    const services = await gattServer.getPrimaryServices();
    if (services.length > 0) {
      const characteristics = await services[0].getCharacteristics();
      rxCharacteristic = characteristics[0];

      // Veri Dinlemeyi Başlat
      await rxCharacteristic.startNotifications();
      rxCharacteristic.addEventListener('characteristicvaluechanged', handleIncomingData);
    }
  } catch (error) {
    console.error("Bluetooth Bağlantı Hatası:", error);
    throw error;
  }
}

// Bağlantıyı Kes
function disconnectBluetooth() {
  if (bluetoothDevice && bluetoothDevice.gatt.connected) {
    bluetoothDevice.gatt.disconnect();
  }
}

// Gelen Canlı Veriyi İşleme
let rawBuffer = "";
function handleIncomingData(event) {
  const decoder = new TextDecoder('utf-8');
  const chunk = decoder.decode(event.target.value);
  rawBuffer += chunk;

  // Satır sonu veya veri paketi tamamlandığında işle
  if (rawBuffer.includes('\n') || rawBuffer.includes(';')) {
    let lines = rawBuffer.split(/[\r\n;]+/);
    rawBuffer = lines.pop(); // Tamamlanmamış son parçayı sakla

    lines.forEach(line => {
      if (line.trim().length > 0) {
        // Gelen veriyi (Örn: "105,120,200,90") sayı dizisine çevir
        let numbers = line.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
        if (numbers.length > 0 && typeof processLiveBluetoothData === 'function') {
          processLiveBluetoothData(numbers);
        }
      }
    });
  }
        }
