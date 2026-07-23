// Uygulama ve Buton Tıklama Yönetimi
document.addEventListener("DOMContentLoaded", () => {
  const btnConnect = document.getElementById("btnConnect");
  const btnDisconnect = document.getElementById("btnDisconnect");
  const btnStartScan = document.getElementById("btnStartScan");
  const btnStopScan = document.getElementById("btnStopScan");
  const btn3D = document.getElementById("btn3D");
  const btn2D = document.getElementById("btn2D");
  const statusDiv = document.getElementById("status");

  // Bluetooth Bağlan
  if (btnConnect) {
    btnConnect.addEventListener("click", async () => {
      try {
        if (typeof connectBluetooth === 'function') {
          await connectBluetooth();
          if (statusDiv) {
            statusDiv.innerText = "Bluetooth Bağlandı";
            statusDiv.style.background = "#008855";
          }
        } else {
          alert("Bluetooth fonksiyonu yüklenemedi!");
        }
      } catch (err) {
        alert("Bağlantı Hatası: " + err);
      }
    });
  }

  // Bağlantıyı Kes
  if (btnDisconnect) {
    btnDisconnect.addEventListener("click", () => {
      if (typeof disconnectBluetooth === 'function') {
        disconnectBluetooth();
        if (statusDiv) {
          statusDiv.innerText = "Cihaz Bağlı Değil";
          statusDiv.style.background = "#b00020";
        }
      }
    });
  }

  // Taramayı Başlat
  if (btnStartScan) {
    btnStartScan.addEventListener("click", () => {
      if (typeof startScan === 'function') {
        startScan();
      }
    });
  }

  // Taramayı Durdur
  if (btnStopScan) {
    btnStopScan.addEventListener("click", () => {
      if (typeof stopScan === 'function') {
        stopScan();
      }
    });
  }

  // 3D Görünüm
  if (btn3D) {
    btn3D.addEventListener("click", () => {
      window.currentViewMode = '3d';
      if (typeof updatePlot === 'function') updatePlot();
    });
  }

  // 2D Görünüm
  if (btn2D) {
    btn2D.addEventListener("click", () => {
      window.currentViewMode = '2d';
      if (typeof updatePlot === 'function') updatePlot();
    });
  }
});
