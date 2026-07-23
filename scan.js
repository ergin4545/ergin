// Scan & Graphic Logic
let scanData = [];
let isScanning = false;

// Taramayı Başlat
function startScan() {
  isScanning = true;
  scanData = generateSampleData(); // Örnek veri seti veya sensör verisi
  updatePlot();
  calculateAnalysis();
}

// Taramayı Durdur
function stopScan() {
  isScanning = false;
}

// 3D / 2D Grafiği Güncelle
function updatePlot() {
  const plotDiv = document.getElementById("scanPlot");
  if (!plotDiv || !window.Plotly) return;

  const traceType = (typeof currentViewMode !== 'undefined' && currentViewMode === '2d') ? 'heatmap' : 'surface';

  const data = [{
    z: scanData,
    type: traceType,
    colorscale: 'Jet'
  }];

  const layout = {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    margin: { l: 10, r: 10, b: 10, t: 10 },
    scene: {
      xaxis: { title: '' },
      yaxis: { title: '' },
      zaxis: { title: '' }
    }
  };

  Plotly.react("scanPlot", data, layout, { responsive: true });
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
      statusMsg.innerText = "Nötr Zemin / Normal Veri";
      statusMsg.style.color = "#00ff88";
    }
  }
}

// Örnek Tarama Matrisi
function generateSampleData() {
  return [
    [100, 102, 105, 103, 100],
    [101, 150, 180, 140, 102], // Yüksek değer (Metal)
    [99,  145, 210, 135, 98],
    [100,  50,  40,  60, 101], // Düşük değer (Boşluk)
    [102, 101, 100, 103, 102]
  ];
                                          }
