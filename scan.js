// FURINA FE - Core Graphics Engine
let matrixRows = 8;
let matrixCols = 8;

let scanData = Array(matrixRows).fill(0).map(() => Array(matrixCols).fill(0));
let pointerHistory = Array(30).fill(0);

let currentRow = 0;
let currentCol = 0;
let isScanning = false;
let currentViewMode = '2d';

// Pointer Canlı Dalga Güncelleme
function updatePointerGraphic(value) {
  pointerHistory.shift();
  pointerHistory.push(value);

  const pointerValEl = document.getElementById("pointerVal");
  if (pointerValEl) pointerValEl.innerText = Math.round(value);

  // Kadran Çerçevesi
  const gaugeBox = document.querySelector(".gauge-box");
  if (gaugeBox) {
    let percent = Math.min(Math.max((value / 5000) * 100, 0), 100);
    gaugeBox.style.background = `conic-gradient(#00e5ff ${percent}%, #263343 ${percent}%)`;
  }

  const data = [{
    y: pointerHistory,
    type: 'scatter',
    mode: 'lines',
    line: { color: '#00e5ff', width: 2.5 }
  }];

  const layout = {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    margin: { l: 25, r: 10, b: 25, t: 10 },
    xaxis: { visible: false },
    yaxis: { gridcolor: '#1f2633', tickfont: { color: '#8a99ad' } }
  };

  Plotly.react("pointerPlot", data, layout, { displayModeBar: false, responsive: true });
}

// Zemin Taraması Güncelleme
function updateScanPlot() {
  const plotDiv = document.getElementById("scanPlot");
  if (!plotDiv || !window.Plotly) return;

  const is2D = (currentViewMode === '2d');
  let textMatrix = scanData.map(row => row.map(val => (val !== 0 ? val.toString() : "")));

  const data = [{
    z: scanData,
    text: textMatrix,
    texttemplate: "%{text}",
    textfont: { color: '#ffffff', size: 10 },
    type: is2D ? 'heatmap' : 'surface',
    colorscale: 'Jet',
    zsmooth: false,
    xgap: 1.5,
    ygap: 1.5,
    colorbar: { thickness: 10, len: 0.85, tickfont: { color: '#ffffff', size: 9 } }
  }];

  let layout = {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    autosize: true,
    margin: { l: 5, r: 5, b: 5, t: 5 },
    dragmode: false
  };

  if (is2D) {
    layout.xaxis = { visible: false, fixedrange: true, constrain: 'domain' };
    layout.yaxis = { visible: false, fixedrange: true, scaleanchor: 'x', scaleratio: 1, autorange: 'reversed' };
  } else {
    layout.scene = {
      xaxis: { visible: false },
      yaxis: { visible: false },
      zaxis: { visible: false },
      camera: { eye: { x: 1.4, y: 1.4, z: 1.2 } }
    };
  }

  Plotly.react("scanPlot", data, layout, { responsive: true, displayModeBar: false, scrollZoom: false });
}

function processIncomingData(val) {
  let num = parseFloat(val);
  if (isNaN(num)) return;

  // Pointer Modunu Güncelle
  updatePointerGraphic(num);

  // Tarama Modu Aktifse Matrise Yaz
  if (isScanning) {
    if (currentRow < matrixRows) {
      scanData[currentRow][currentCol] = parseFloat(num.toFixed(2));
      currentCol++;

      if (currentCol >= matrixCols) {
        currentCol = 0;
        currentRow++;
      }
    }
    updateScanPlot();
    calculateAnalysis();
  }
}

function calculateAnalysis() {
  let flatData = scanData.flat();
  let max = Math.max(...flatData);
  let min = Math.min(...flatData);
  let diff = max - min;

  document.getElementById("maxVal").innerText = max;
  document.getElementById("minVal").innerText = min;
  document.getElementById("diffVal").innerText = diff;
                      }
