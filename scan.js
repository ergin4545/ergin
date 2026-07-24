// DEDSIS 3D Style - Advanced Ground Radar Engine
let matrixRows = 10;
let matrixCols = 10;
let scanData = Array(matrixRows).fill(0).map(() => Array(matrixCols).fill(0));

let currentFilter = 'F1'; // F1: Normal, F2: High Detail, F3: Ultra Smooth
let currentColorScale = 'Jet'; // 'Jet' (RGB) or 'Greys' (Gray Scale)
let viewMode = '3d'; // '3d' or '2d'

// 9 Noktalı Otomatik Sıfırlama / Nötr Kalibrasyon Değeri
let baseZeroValue = 0; 
let isCalibrated = false;

// Veri Yumuşatma Algoritması (Interpolation)
function interpolateMatrix(data, factor = 3) {
  let rows = data.length;
  let cols = data[0].length;
  let newRows = (rows - 1) * factor + 1;
  let newCols = (cols - 1) * factor + 1;
  
  let result = Array(newRows).fill(0).map(() => Array(newCols).fill(0));

  for (let r = 0; r < newRows; r++) {
    for (let c = 0; c < newCols; c++) {
      let origR = r / factor;
      let origC = c / factor;

      let r1 = Math.floor(origR);
      let r2 = Math.min(r1 + 1, rows - 1);
      let c1 = Math.floor(origC);
      let c2 = Math.min(c1 + 1, cols - 1);

      let rf = origR - r1;
      let cf = origC - c1;

      let top = data[r1][c1] * (1 - cf) + data[r1][c2] * cf;
      let bottom = data[r2][c1] * (1 - cf) + data[r2][c2] * cf;

      result[r][c] = top * (1 - rf) + bottom * rf;
    }
  }
  return result;
}

// Filtre Algoritmaları (F1, F2, F3)
function applyFilter(data, filterType) {
  if (filterType === 'F1') return data; // Ham/Hassas Veri

  let rows = data.length;
  let cols = data[0].length;
  let filtered = JSON.parse(JSON.stringify(data));

  let passCount = filterType === 'F2' ? 1 : 2; // F2 1 tur, F3 2 tur yumuşatır

  for (let p = 0; p < passCount; p++) {
    for (let r = 1; r < rows - 1; r++) {
      for (let c = 1; c < cols - 1; c++) {
        let sum = data[r-1][c] + data[r+1][c] + data[r][c-1] + data[r][c+1] + data[r][c]*2;
        filtered[r][c] = sum / 6;
      }
    }
  }
  return filtered;
}

// Radar Grafiğini Çizdirme
function renderRadarPlot() {
  const plotDiv = document.getElementById("scanPlot");
  if (!plotDiv || !window.Plotly) return;

  // 1. Filtre Uygula
  let processedData = applyFilter(scanData, currentFilter);

  // 2. Yüksek Çözünürlük İçin Yumuşat (Interpolation)
  let smoothData = interpolateMatrix(processedData, 3);

  const is3D = (viewMode === '3d');

  const trace = {
    z: smoothData,
    type: is3D ? 'surface' : 'heatmap',
    colorscale: currentColorScale,
    showscale: true,
    colorbar: { thickness: 12, len: 0.8, tickfont: { color: '#ffffff', size: 10 } }
  };

  if (is3D) {
    trace.contours = {
      z: { show: true, usecolormap: true, highlightcolor: "#ffffff", project: { z: true } }
    };
  }

  const layout = {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    autosize: true,
    margin: { l: 0, r: 0, b: 0, t: 0 },
    scene: {
      xaxis: { visible: false },
      yaxis: { visible: false },
      zaxis: { visible: true, gridcolor: '#334155', tickfont: { color: '#94a3b8' } },
      camera: { eye: { x: 1.5, y: 1.5, z: 1.2 } },
      aspectratio: { x: 1, y: 1, z: 0.5 } // Derinlik/Yükseklik Oranı
    }
  };

  Plotly.react("scanPlot", [trace], layout, { responsive: true, displayModeBar: false });
}

// Bluetooth'tan Gelen Anlık Veriyi İşleme
function processIncomingData(val) {
  let num = parseFloat(val);
  if (isNaN(num)) return;

  // Sıfırlama/Kalibrasyon Yapıldıysa Nötr Değeri Çıkar
  let calibratedVal = isCalibrated ? (num - baseZeroValue) : num;

  // Tarama Verisini Matrise Yazırma Mantığı (Sırayla)
  // ...
  renderRadarPlot();
}

// Filtre Değiştirme Fonksiyonları (Arayüz Butonları İçin)
function setFilter(type) {
  currentFilter = type; // 'F1', 'F2', 'F3'
  renderRadarPlot();
}

function setColorScale(scale) {
  currentColorScale = scale; // 'Jet' veya 'Greys'
  renderRadarPlot();
}

function toggleViewMode(mode) {
  viewMode = mode; // '3d' veya '2d'
  renderRadarPlot();
        }
        
