// FURINA FE - App Navigation & Archive Logic

function switchView(viewId) {
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  const target = document.getElementById(viewId);
  if (target) target.classList.add('active');

  setTimeout(() => {
    if (viewId === 'pointerView') updatePointerGraphic(0);
    if (viewId === 'scanView') updateScanPlot();
  }, 100);
}

function setScanMode(mode) {
  currentViewMode = mode;
  document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  updateScanPlot();
}

function toggleScan() {
  isScanning = !isScanning;
  const btn = document.getElementById("startScanBtn");
  if (isScanning) {
    btn.innerText = "⏹ Taramayı Durdur";
    btn.style.background = "#ff4444";
    btn.style.color = "#fff";
    // Matrisi sıfırla
    currentRow = 0;
    currentCol = 0;
    scanData = Array(matrixRows).fill(0).map(() => Array(matrixCols).fill(0));
  } else {
    btn.innerText = "▶ Taramayı Başlat";
    btn.style.background = "#00e5ff";
    btn.style.color = "#000";
  }
}

// ARŞİV KAYIT SİSTEMİ (LocalStorage)
function saveCurrentScan() {
  let archive = JSON.parse(localStorage.getItem("furina_scans") || "[]");
  let newRecord = {
    id: Date.now(),
    date: new Date().toLocaleString("tr-TR"),
    data: scanData
  };
  archive.push(newRecord);
  localStorage.setItem("furina_scans", JSON.stringify(archive));
  alert("Tarama başarıyla arşive kaydedildi!");
}

function loadArchiveList() {
  const listEl = document.getElementById("archiveList");
  let archive = JSON.parse(localStorage.getItem("furina_scans") || "[]");

  if (archive.length === 0) {
    listEl.innerHTML = "<p style='color:#8a99ad; text-align:center;'>Kayıtlı tarama bulunamadı.</p>";
    return;
  }

  listEl.innerHTML = archive.map(item => `
    <div class="archive-item">
      <div>
        <strong>Tarama #${item.id.toString().slice(-4)}</strong><br>
        <small style="color:#8a99ad">${item.date}</small>
      </div>
      <button onclick="openArchiveItem(${item.id})" style="background:#00e5ff; border:none; padding:6px 12px; border-radius:4px; font-weight:bold;">Aç</button>
    </div>
  `).join("");
}

function openArchiveItem(id) {
  let archive = JSON.parse(localStorage.getItem("furina_scans") || "[]");
  let record = archive.find(r => r.id === id);
  if (record) {
    scanData = record.data;
    matrixRows = scanData.length;
    matrixCols = scanData[0].length;
    switchView('scanView');
  }
}

// Ayarlar Güncellemesi
document.addEventListener("DOMContentLoaded", () => {
  const colsInput = document.getElementById("cfgCols");
  const rowsInput = document.getElementById("cfgRows");

  if (colsInput) colsInput.addEventListener("change", (e) => matrixCols = parseInt(e.target.value));
  if (rowsInput) rowsInput.addEventListener("change", (e) => matrixRows = parseInt(e.target.value));
});
