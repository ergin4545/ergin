// Scan & Graphic Logic (Izgara + Değer Yazan Tam Veri Haritası)
let matrixRows = 8;
let matrixCols = 8;

// Başlangıç 8x8 boş zemin matrisi
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
      scanData[currentRow][currentCol] = parseFloat(val.toFixed(2));
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

  // Her hücrenin üstüne sayı değerini basmak için metin matrisi oluştur
  let textMatrix = scanData.map(row => row.map(val => val.toString()));

  const data = [{
    z: scanData,
    text: textMatrix,
    texttemplate: "%{text}", // Karelerin içine gerçek sayıları yazar
    textfont: {
      color: '#ffffff',
      size: 9,
      family: 'Arial'
    },
    type: is2D ? 'heatmap' : 'surface',
    colorscale: 'Jet',
    zsmooth: is2D ? 'best' : false,
    showscale: true,
    colorbar: {
      thickness: 12,
      len: 0.9,
      tickfont: { color: '#ffffff', size: 10 }
    }
  }];

  let layout = {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    autosize: true,
    margin: { l: 10, r: 10, b: 10, t: 10 }
  };

  if (is2D) {
    // Görseldeki gibi sarı/beyaz ızgara çizgilerini aktif et
    layout.xaxis = {
      visible: true,
      showgrid: true,
      gridcolor: 'rgba(255, 255, 255, 0.4)',
      gridwidth: 1,
      showticklabels: false,
      constrain: 'domain'
    };
    layout.yaxis = {
      visible: true,
      showgrid: true,
      gridcolor: 'rgba(255, 255, 255, 0.4)',
      gridwidth: 1,
      showticklabels: false,
      scaleanchor: 'x',
      scaleratio: 1
    };
  } else {
    layout.scene = {
      xaxis: { visible: false },
      yaxis: { visible: false },
      zaxis: { visible: false },
      camera: { eye: { x: 1.4, y: 1.4, z: 1.2 } }
    };
  }

  const config = {
    responsive: true,
    displayModeBar: false,
    doubleClick: false,
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
    if (diff > 50) {
      statusMsg.innerText = "⚠️ Yüksek anomali tespit edildi! (Metal / Yapı şüphesi)";
      statusMsg.style.color = "#ff4444";
    } else {
      statusMsg.innerText = "Nötr Zemin / Veri Dinleniyor...";
      statusMsg.style.color = "#00ff88";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(updatePlot, 300);
});
  
