// FURINA FE - Bluetooth & Audio Sound Engine
let bluetoothDevice;
let gattCharacteristic;
let rxBuffer = "";

// Web Audio API Ses Oluşturucu
let audioCtx = null;
let lastBeepTime = 0;

function playBeep(value) {
  // Ayarlardan ses kapalıysa veya değer çok düşükse ses çıkarma
  const soundEnabled = document.getElementById("cfgSound") ? document.getElementById("cfgSound").checked : true;
  if (!soundEnabled || value < 100) return;

  const now = Date.now();
  // Sinyal şiddetine göre bip sıklığını ayarla (Yüksek sinyal = Hızlı bip)
  let interval = Math.max(50, 600 - (value / 5000) * 550);

  if (now - lastBeepTime > interval) {
    lastBeepTime = now;
    
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      // Sinyal büyüdükçe ses tonu (frekansı) da tizleşir
      let pitch = Math.min(2000, 300 + (value / 5000) * 1200);
      osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
      console.log("Ses oynatma hatası:", e);
    }
  }
}

async function toggleBluetooth() {
  if (bluetoothDevice && bluetoothDevice.gatt.connected) {
    bluetoothDevice.gatt.disconnect();
    updateBtStatus(false);
  } else {
    try {
      bluetoothDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          '6e400001-b5a3-f393-e0a9-e50e24dcca9e', 
          '00001101-0000-1000-8000-00805f9b34fb', 
          '0000ffe0-0000-1000-8000-00805f9b34fb'
        ]
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

  // Satır sonu (\n), virgül veya boşluk karakterlerine göre veriyi böl
  if (rxBuffer.includes('\n') || rxBuffer.includes(',') || rxBuffer.includes(' ')) {
    let parts = rxBuffer.split(/[\n,\s]+/);
    rxBuffer = parts.pop(); // Tamamlanmamış son parçayı tamponda tut

    parts.forEach(p => {
      let num = parseFloat(p.trim());
      if (!isNaN(num)) {
        // Ses ikazını tetikle
        playBeep(num);
        // Grafikleri ve matrisi güncelle
        if (typeof processIncomingData === 'function') {
          processIncomingData(num);
        }
      }
    });
  }
}

function updateBtStatus(connected) {
  const icon = document.getElementById("btStatusIcon");
  const text = document.getElementById("btStatusText");
  if (connected) {
    if (icon) icon.innerText = "🟢";
    if (text) text.innerText = "Bağlandı";
  } else {
    if (icon) icon.innerText = "🔴";
    if (text) text.innerText = "Bağlan";
  }
}

// Buton Tıklama Olayı Dinleyicisi
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btConnectBtn");
  if (btn) {
    btn.addEventListener("click", toggleBluetooth);
  }
});
    
