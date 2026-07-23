// Global Görünüm Modu
let currentViewMode = '3d';

// Sayfa Yüklendiğinde Tetiklenen Ana Kodlar
window.addEventListener("DOMContentLoaded", () => {
  const statusBadge = document.getElementById("statusBadge");
  const connectBtn = document.getElementById("connectBtn");
  const disconnectBtn = document.getElementById("disconnectBtn");
  const scanBtn = document.getElementById("scanBtn");
  const stopBtn = document.getElementById("stopBtn");

  // Sayfa açıldığında boş grafiği oluştur
  initPlot();

  // 1. Bluetooth Bağlan
  if (connectBtn) {
    connectBtn.addEventListener("click", async () => {
      try {
        if (typeof connectBluetooth === "function") {
          await connectBluetooth();
        } else if (typeof connect === "function") {
          await connect();
        }
        if (statusBadge) {
          statusBadge.innerHTML = "Bluetooth Bağlandı";
          statusBadge.style.background = "#009944";
        }
      } catch (e) {
        alert("Bağlantı Hatası: " + (e.message || e));
      }
    });
  }

  // 2. Bağlantıyı Kes
  if (disconnectBtn) {
    disconnectBtn.addEventListener("click", () => {
      if (typeof disconnectBluetooth === "function") {
        disconnectBluetooth();
      } else if (typeof disconnect === "function") {
        disconnect();
      }
      if (statusBadge) {
        statusBadge.innerHTML = "Bağlı Değil";
        statusBadge.style.background = "#b00020";
      }
    });
  }

  // 3. Taramayı Başlat
  if (scanBtn) {
    scanBtn.addEventListener("click", () => {
      if (typeof startScan === "function") {
        startScan();
      } else if (typeof baslat === "function") {
        baslat();
      }
      if (statusBadge) {
        statusBadge.innerHTML = "Tarama Aktif";
        statusBadge.style.background = "#0066ff";
      }
    });
  }

  // 4. Taramayı Durdur
  if (stopBtn) {
    stopBtn.addEventListener("click", () => {
      if (typeof stopScan === "function") {
        stopScan();
      } else if (typeof durdur === "function") {
        durdur();
      }
      if (statusBadge) {
        statusBadge.innerHTML = "Hazır / Durduruldu";
        statusBadge.style.background = "#555";
      }
    });
  }
});

// 5. 3D / 2D Görünüm Değiştirme Fonksiyonu
function switchView(mode) {
  currentViewMode = mode;
  const btn3D = document.getElementById("btn3D");
  const btn2D = document.getElementById("btn2D");

  if (mode === '3d') {
    if (btn3D) btn3D.style.background = "#00a2ff";
    if (btn2D) btn2D.style.background = "#222";
  } else {
    if (btn2D) btn2D.style.background = "#00a2ff";
    if (btn3D) btn3D.style.background = "#222";
  }

  // Eğer veri varsa grafiği yeni moda göre tekrar çizdir
  if (typeof updatePlot === "function") {
    updatePlot();
  } else if (typeof renderChart === "function") {
    renderChart();
  }
}

// İlk Grafik Kurulumu (Plotly Kütüphanesi)
function initPlot() {
  const plotDiv = document.getElementById("scanPlot");
  if (!plotDiv) return;

  const initialData = [{
    z: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    type: 'surface',
    colorscale: 'Jet'
  }];

  const layout = {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    margin: { l: 0, r: 0, b: 0, t: 0 },
    scene: {
      xaxis: { title: '' },
      yaxis: { title: '' },
      zaxis: { title: '' }
    }
  };

  if (window.Plotly) {
    Plotly.newPlot("scanPlot", initialData, layout, { responsive: true });
  }
      }
        
