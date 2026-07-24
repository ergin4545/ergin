<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ERGİN 3D - Zemin Taraması</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.plot.ly/plotly-2.27.0.min.js"></script>
</head>
<body class="bg-[#0b0f17] text-white h-screen flex flex-col justify-between p-3 select-none">

  <header class="flex justify-between items-center py-2 border-b border-cyan-900/40">
    <button onclick="window.location.href='index.html'" class="text-cyan-400 text-sm font-semibold flex items-center gap-1">
      ◀ Ana Menü
    </button>
    <h1 class="text-lg font-bold text-cyan-400 tracking-wider">ERGİN 3D RADAR</h1>
    <div class="text-xs text-gray-400" id="scanStatus">Hazır</div>
  </header>

  <div class="relative w-full h-[55vh] bg-[#121824] rounded-2xl border border-[#232d3f] my-2 overflow-hidden">
    <div id="scanPlot" class="w-full h-full"></div>
    
    <div class="absolute top-3 left-3 bg-black/60 backdrop-blur border border-cyan-500/30 px-3 py-1.5 rounded-lg">
      <span class="text-xs text-gray-400 block">Sinyal</span>
      <span id="liveVal" class="text-lg font-bold text-cyan-400">0</span>
    </div>
  </div>

  <div class="grid grid-cols-2 gap-2 my-1">
    <div class="bg-[#161c28] border border-[#232d3f] p-2 rounded-xl flex justify-around items-center">
      <span class="text-xs text-gray-400 font-bold">Filtre:</span>
      <button onclick="setFilter('F1')" class="px-2.5 py-1 text-xs rounded-lg bg-cyan-600 font-bold">F1</button>
      <button onclick="setFilter('F2')" class="px-2.5 py-1 text-xs rounded-lg bg-[#232d3f] text-gray-300">F2</button>
      <button onclick="setFilter('F3')" class="px-2.5 py-1 text-xs rounded-lg bg-[#232d3f] text-gray-300">F3</button>
    </div>

    <div class="bg-[#161c28] border border-[#232d3f] p-2 rounded-xl flex justify-around items-center">
      <span class="text-xs text-gray-400 font-bold">Mod:</span>
      <button onclick="setColorScale('Jet')" class="px-2.5 py-1 text-xs rounded-lg bg-cyan-600 font-bold">RGB</button>
      <button onclick="setColorScale('Greys')" class="px-2.5 py-1 text-xs rounded-lg bg-[#232d3f] text-gray-300">Gri</button>
    </div>
  </div>

  <div class="grid grid-cols-3 gap-2 py-2 border-t border-cyan-900/40">
    <button onclick="startScanning()" class="bg-emerald-600 active:bg-emerald-700 py-3 rounded-xl font-bold text-sm">
      ▶ Başlat
    </button>
    <button onclick="resetCalibration()" class="bg-amber-600 active:bg-amber-700 py-3 rounded-xl font-bold text-sm">
      🎯 Sıfırla
    </button>
    <button onclick="clearMap()" class="bg-rose-600 active:bg-rose-700 py-3 rounded-xl font-bold text-sm">
      🗑️ Temizle
    </button>
  </div>

  <script src="Bluetooth.js"></script>
  <script src="scan.js"></script>
</body>
</html>
  
