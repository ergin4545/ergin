// scan.js

let scanning = false;
let timer = null;
let currentView = '3d'; // '3d' veya '2d'

// 5x5 Matris Verimiz (Varsayılan nötr toprak seviyesi)
let matrixData = [
  [500, 502, 498, 505, 500],
  [495, 510, 505, 490, 502],
  [500, 505, 520, 515, 498],
  [508, 492, 501, 500, 505],
  [500, 498, 502, 499, 501]
];

function createGrid() {
  renderChart();
}

function switchView(viewType) {
  currentView = viewType;
  renderChart();
}

function renderChart() {
  const container = document.getElementById("scanPlot");
  if (!container) return;

  // GR3 Plus cihazlarında kullanılan klasik Jet Color Map (Mavi -> Yeşil -> Sarı -> Kırmızı)
  const jetColorscale = [
    [0.0, '#00008f'],  // Derin Boşluk (Koyu Mavi)
    [0.25, '#007fff'], // Boşluk / Tünel (Açık Mavi)
    [0.5, '#00ff7f'],  // Saf Toprak (Yeşil)
    [0.75, '#ffff00'], // Hafif Anomali (Sarı)
    [1.0, '#ff0000']   // Yoğun Metal / Obje (Kırmızı)
  ];

  let trace;

  if (currentView === '3d') {
    trace = {
      z: matrixData,
      type: 'surface',
      colorscale: jetColorscale,
      showscale: true,
      contours: {
        z: { show: true, usecolormap: true, highlightcolor: "#fff", project: { z: true } }
      }
    };
  } else {
    trace = {
      z: matrixData,
      type: 'heatmap',
      colorscale: jetColorscale,
      smoothygaps: true, // Akışkan yumuşak geçiş
      showscale: true
    };
  }

  const layout = {
    paper_bgcolor: '#111',
    plot_bgcolor: '#111',
    margin: { l: 20, r: 20, b: 20, t: 30 },
    font: { color: '#fff' },
    scene: {
      xaxis: { title: 'X (Metre)', gridcolor: '#333' },
      yaxis: { title: 'Y (Metre)', gridcolor: '#333' },
      zaxis: { title: 'Sinyal / Derinlik', gridcolor: '#333' },
      camera: { eye: { x: 1.5, y: 1.5, z: 1.2 } }
    }
  };

  const config = { responsive: true, displayModeBar: false };

  Plotly.react('scanPlot', [trace], layout, config);
  calculateAritmetic();
}

// Videodaki Aritmetik Birim Farkı Analiz Mantığı
function calculateAritmetic() {
  let flat = matrixData.flat();
  let max = Math.max(...flat);
  let min = Math.min(...flat);
  let diff = max - min;

  document.getElementById("maxVal").innerText = max;
  document.getElementById("minVal").innerText = min;
  document.getElementById("diffVal").innerText = diff;

  const statusMsg = document.getElementById("statusMsg");

  if (diff > 350) {
    statusMsg.innerText = "⚠️ YÜKSEK ANOMALİ: Bölgede belirgin bir yapı veya metal hedeflendi!";
    statusMsg.style.color = "#ff4444";
  } else if (diff > 180) {
    statusMsg.innerText = "ℹ️ DÜŞÜK ANOMALİ: Katmanlı toprak veya zemin değişikliği.";
    statusMsg.style.color = "#ffbb00";
  } else {
    statusMsg.innerText = "✅ STABİL: Saf / Bozulmamış Toprak yapısı.";
    statusMsg.style.color = "#00cc66";
  }
}

function startScan() {
  if (scanning) return;
  scanning = true;

  const settings = typeof getSettings === 'function' ? getSettings() : { scanSpeed: 300 };

  timer = setInterval(() => {
    // Rastgele nokta güncelleyerek tarama simülasyonu yapıyoruz
    // Bluetooth bağlandığında buraya sensörden gelen gerçek veri basılacak
    let row = Math.floor(Math.random() * 5);
    let col = Math.floor(Math.random() * 5);
    
    // Anomali simülasyonu (200 - 900 arası değerler)
    matrixData[row][col] = Math.floor(Math.random() * 700) + 200;

    renderChart();

    if (typeof saveData === 'function') {
      saveData(matrixData[row][col]);
    }
  }, settings.scanSpeed || 300);
}

function stopScan() {
  scanning = false;
  clearInterval(timer);
    }
