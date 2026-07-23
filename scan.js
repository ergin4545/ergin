// Scan & Graphic Logic
let matrixRows = 5;
let matrixCols = 5;
let scanData = Array(matrixRows).fill(0).map(() => Array(matrixCols).fill(0));

let currentRow = 0;
let currentCol = 0;
let isScanning = false;

// Taramayı Başlat
function startScan() {
  isScanning = true;
  scanData = Array(matrixRows).fill(0).map(() => Array(matrixCols).fill(0));
  currentRow = 0;
  currentCol = 0;
  updatePlot();
  calculateAnalysis();
}

// Taramayı Durdur
function stopScan() {
  isScanning = false;
}

// Bluetooth'tan Gelen Canlı Verileri Matrise Yerleştir
function processLiveBluetoothData(incomingNumbers) {
  if (!isScanning) return;

  incomingNumbers.forEach(val => {
    if (currentRow < matrixRows) {
      scanData[currentRow][currentCol] = val;
      currentCol++;

      if (currentCol >= matrixCols) {
        currentCol = 0;
        currentRow++;
      }
    }
  });

  updatePlot();
  calculateAnalysis();
}

// 3D / 2D Grafiği Güncelle
function updatePlot() {
  const plotDiv = document.getElementById("scanPlot");
  if (!plotDiv || !window.Plotly) return;

  const is2D = (typeof currentViewMode !== 'undefined' && currentViewMode === '2d');
  
  // 2D Isı Haritası için veri konfigürasyonu
  const data = [{
    z: scanData,
    type: is2D ? 'heatmap' : 'surface',
    colorscale: 'Jet',
    zsmooth: is2D ? 'best' : false, // 2D modunda pikselleşmeyi önler, yumuşak geçiş yapar
    colorbar: {
      thickness: 12,
      len: 0.85,
      tickfont: { color: '#ffffff', size: 10 }
    }
  }];

  // 2D ve 3D için özel Layout ayarları
  let layout = {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    autosize: true,
    margin: { l: 15, r: 15, b: 15, t: 15 }
  };

  if (is2D) {
    // 2D modunda görüntüyü tam kareye oturtur, oranları bozmaz/zoom yaptırmaz
    layout.xaxis = { visible: false, constrain: 'domain' };
    layout.yaxis = { visible: false, scaleanchor: 'x', scaleratio: 1 };
  } else {
    // 3D modunda eksen çizgilerini gizler
    layout.scene = {
      xaxis: { visible: false },
      yaxis: { visible: false },
      zaxis: { visible: false },
      camera: { eye: { x: 1.4, y: 1.4, z: 1.2 } }
    };
  }

  // Üstteki gereksiz zoom/büyüteç araç çubuğunu gizle
  const config = {
    responsive: true,
    displayModeBar: false,
    scrollZoom: false
  };

  Plotly.react("scanPlot", data, layout, config);
}

// Anomali ve Veri Analizini Hesapla
function calculateAnalysis() {
  if (!scanData || scanData.length === 0) return;

  let flatData = scanData.flat();
  let max = Math.max(...flatData);
  let min = Math.min(...flatData);
  let diff = max - min;

  const maxEl = document.getElementById("maxVal");
  const minEl = document.getElementById("minVal");
  const diffEl = document.getElementById("diffVal");
  const statusMsg = document.getElementById("statusMsg");

  if (maxEl) maxEl.innerText = max;
  if (minEl) minEl.innerText = min;
  if (diffEl) diffEl.innerText = diff;

  if (statusMsg) {
    if (diff > 50 && max > 0) {
      statusMsg.innerText = "⚠️ Yüksek anomali tespit edildi! (Metal / Yapı şüphesi)";
      statusMsg.style.color = "#ff4444";
    } else {
      statusMsg.innerText = "Nötr Zemin / Veri Bekleniyor";
      statusMsg.style.color = "#00ff88";
    }
  }
}
  
