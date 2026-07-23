// Canlı Tarama Matrisi (5x5 Başlangıç Boyutu)
let matrixRows = 5;
let matrixCols = 5;
let scanData = Array(matrixRows).fill(0).map(() => Array(matrixCols).fill(0));

let currentRow = 0;
let currentCol = 0;
let isScanning = false;

// Taramayı Başlat
function startScan() {
  isScanning = true;
  // Matrisi sıfırla
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

      // Satır dolduysa bir alt satıra geç
      if (currentCol >= matrixCols) {
        currentCol = 0;
        currentRow++;
      }
    }
  });

  // Ekrandaki haritayı ve analizi anlık güncelle
  updatePlot();
  calculateAnalysis();
}

// 3D / 2D Grafiği Güncelle
function updatePlot() {
  const plotDiv = document.getElementById("scanPlot");
  if (!plotDiv || !window.Plotly) return;

  const is2D = (typeof currentViewMode !== 'undefined' && currentViewMode === '2d');
  const traceType = is2D ? 'heatmap' : 'surface';

  const data = [{
    z: scanData,
    type: traceType,
    colorscale: 'Jet',
    colorbar: {
      thickness: 15,
      len: 0.9,
      tickfont: { color: '#ffffff', size: 10 }
    }
  }];

  const layout = {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    autosize: true,
    margin: { l: 10, r: 10, b: 10, t: 10 },
    scene: {
      xaxis: { visible: false },
      yaxis: { visible: false },
      zaxis: { visible: false },
      camera: { eye: { x: 1.4, y: 1.4, z: 1.2 } }
    }
  };

  Plotly.react("scanPlot", data, layout, { responsive: true, displayModeBar: false });
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
      statusMsg.innerText = "Canlı Veri Dinleniyor...";
      statusMsg.style.color = "#00ff88";
    }
  }
}
