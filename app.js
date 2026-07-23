// Uygulama Başlatma ve Buton Dinleyicileri
document.addEventListener("DOMContentLoaded", () => {
  const btnConnect = document.getElementById("btnConnect");
  const btnDisconnect = document.getElementById("btnDisconnect");
  const btnStartScan = document.getElementById("btnStartScan");
  const btnStopScan = document.getElementById("btnStopScan");
  const btn3D = document.getElementById("btn3D");
  const btn2D = document.getElementById("btn2D");

  if (btnConnect) {
    btnConnect.addEventListener("click", async () => {
      try {
        if (typeof connectBluetooth === 'function') {
          await connectBluetooth();
          alert("Bluetooth Cihazına Bağlanıldı!");
        }
      } catch (err) {
        alert("Bağlantı Hatası: " + err);
      }
    });
  }

  if (btnDisconnect) {
    btnDisconnect.addEventListener("click", () => {
      if (typeof disconnectBluetooth === 'function') {
        disconnectBluetooth();
        alert("Bağlantı Kesildi.");
      }
    });
  }

  if (btnStartScan) {
    btnStartScan.addEventListener("click", () => {
      if (typeof startScan === 'function') {
        startScan();
      }
    });
  }

  if (btnStopScan) {
    btnStopScan.addEventListener("click", () => {
      if (typeof stopScan === 'function') {
        stopScan();
      }
    });
  }

  if (btn3D) {
    btn3D.addEventListener("click", () => {
      window.currentViewMode = '3d';
      if (typeof updatePlot === 'function') updatePlot();
    });
  }

  if (btn2D) {
    btn2D.addEventListener("click", () => {
      window.currentViewMode = '2d';
      if (typeof updatePlot === 'function') updatePlot();
    });
  }
});
