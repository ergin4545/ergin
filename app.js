// uygulama.js

window.addEventListener("load", () => {
  const statusBadge = document.getElementById("statusBadge");
  const connectBtn = document.getElementById("connectBtn");
  const disconnectBtn = document.getElementById("disconnectBtn");
  const scanBtn = document.getElementById("scanBtn");
  const stopBtn = document.getElementById("stopBtn");

  // Sayfa yüklendiğinde 3D grafiği ilk kez çiz
  if (typeof renderChart === "function") {
    renderChart();
  }

  // Bluetooth Bağlan
  connectBtn.addEventListener("click", async () => {
    try {
      if (typeof connectBluetooth === "function") {
        await connectBluetooth();
        statusBadge.innerHTML = "Bluetooth Bağlandı";
        statusBadge.style.background = "#009944";
      }
    } catch (e) {
      alert("Bağlantı Hatası: " + e.message);
    }
  });

  // Bağlantıyı Kes
  disconnectBtn.addEventListener("click", () => {
    if (typeof disconnectBluetooth === "function") {
      disconnectBluetooth();
    }
    statusBadge.innerHTML = "Bağlı Değil";
    statusBadge.style.background = "#b00020";
  });

  // Taramayı Başlat
  scanBtn.addEventListener("click", () => {
    if (typeof startScan === "function") {
      startScan();
      statusBadge.innerHTML = "Tarama Aktif";
      statusBadge.style.background = "#0066ff";
    }
  });

  // Taramayı Durdur
  stopBtn.addEventListener("click", () => {
    if (typeof stopScan === "function") {
      stopScan();
      statusBadge.innerHTML = "Hazır / Durduruldu";
      statusBadge.style.background = "#555";
    }
  });
});
    
