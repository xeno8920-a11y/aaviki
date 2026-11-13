<!DOCTYPE html>
<html lang="ru" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AA Wiki & DPS Calculator — Update 21: Heaven's Storm</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background-color: #090a1a;
      color: #f1f5f9;
    }
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    /* Эффект перечеркивания отключенного баффа */
    .buff-slash {
      position: absolute;
      width: 82%;
      height: 2.5px;
      background-color: #ef4444;
      transform: rotate(-45deg);
      border-radius: 9999px;
      box-shadow: 0 0 8px rgba(239, 68, 68, 0.9);
      pointer-events: none;
    }
    .rarity-secret {
      background: linear-gradient(135deg, rgba(244, 63, 94, 0.18), rgba(168, 85, 247, 0.18));
      border-color: rgba(244, 63, 94, 0.45);
    }
    .rarity-mythic {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.14), rgba(99, 102, 241, 0.16));
      border-color: rgba(245, 158, 11, 0.4);
    }
  </style>
</head>
<body class="min-h-screen relative overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200 pb-16">

  <!-- Фоновое свечение -->
  <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div class="absolute -top-40 left-1/4 w-[28rem] h-[28rem] bg-purple-600/15 rounded-full blur-3xl"></div>
    <div class="absolute top-1/3 right-1/4 w-[26rem] h-[26rem] bg-indigo-600/15 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 left-1/3 w-[30rem] h-[24rem] bg-rose-600/10 rounded-full blur-3xl"></div>
  </div>

  <!-- ===================================================================== -->
  <!-- ШАПКА САЙТА И НАВИГАЦИЯ                                               -->
  <!-- ===================================================================== -->
  <header class="sticky top-0 z-30 bg-[#0d0f26]/90 backdrop-blur-md border-b border-indigo-500/25 shadow-xl">
    <div class="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-rose-500 to-purple-600 p-0.5 shadow-lg shadow-amber-500/20">
          <div class="w-full h-full bg-[#121432] rounded-[10px] flex items-center justify-center text-amber-400 font-black text-lg">
            AA
          </div>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent">
              ANIME ADVENTURES WIKI
            </h1>
            <span class="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
              UPD 21
            </span>
          </div>
          <p class="text-xs text-slate-400">База юнитов по обновлениям и точный DPS-калькулятор</p>
        </div>
      </div>

      <!-- Вкладки разделов -->
      <nav class="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button onclick="switchTab('tierlist')" id="tab-tierlist" class="nav-btn px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all bg-amber-500/20 text-amber-300 border border-amber-400/50">
          📊 DPS Тир-лист
        </button>
        <button onclick="switchTab('units')" id="tab-units" class="nav-btn px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all text-slate-400 hover:text-white hover:bg-white/5 border border-transparent">
          🗂️ База юнитов
        </button>
        <button onclick="switchTab('traits')" id="tab-traits" class="nav-btn px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all text-slate-400 hover:text-white hover:bg-white/5 border border-transparent">
          ✨ Все 18 Трейтов и Баффы
        </button>
        <button onclick="switchTab('relics')" id="tab-relics" class="nav-btn px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all text-slate-400 hover:text-white hover:bg-white/5 border border-transparent">
          💎 Реликвии
        </button>
      </nav>
    </div>
  </header>

  <!-- ===================================================================== -->
  <!-- ОСНОВНОЙ КОНТЕЙНЕР                                                    -->
  <!-- ===================================================================== -->
  <main class="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 pt-5">

    <!-- Панель фильтрации по обновлениям и поиска -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 bg-[#121533]/90 border border-indigo-500/20 rounded-2xl p-3">
      <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar" id="update-filters"></div>

      <div class="relative sm:w-64">
        <input
          type="text"
          id="search-input"
          oninput="handleSearch(this.value)"
          placeholder="Поиск юнита или стихии..."
          class="w-full pl-3.5 pr-8 py-1.5 rounded-xl bg-[#090b1d] border border-indigo-500/30 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
        />
        <span class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">🔍</span>
      </div>
    </div>

    <!-- =================================================================== -->
    <!-- РАЗДЕЛ 1: ИНТЕРАКТИВНЫЙ DPS ТИР-ЛИСТ                                -->
    <!-- =================================================================== -->
    <section id="view-tierlist" class="bg-[#131636]/95 border border-indigo-500/25 rounded-2xl p-4 sm:p-6 shadow-2xl">
      
      <!-- Заголовок панели баффов -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3">
        <p class="text-xs sm:text-sm font-medium text-slate-300">
          Саппорты и баффы <span class="text-slate-400">(клик по Orwin/Wendy меняет режим: Off → x1 → x4):</span>
        </p>
        <span class="text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full self-start">
          Orwin = только Physical • Wendy = только Magic
        </span>
      </div>

      <!-- Круглые иконки саппортов и баффов -->
      <div id="buffs-container" class="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-4"></div>

      <!-- Селектор активного Трейта (все 18 трейтов) + кнопки All off / All on -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 p-3 rounded-xl bg-[#0b0d24] border border-indigo-500/20">
        <div class="flex items-center gap-2">
          <button onclick="setAllBuffs(false)" class="px-3 py-1.5 rounded-lg bg-[#141736] hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 text-xs font-bold transition-colors">
            All off
          </button>
          <button onclick="setAllBuffs(true)" class="px-3 py-1.5 rounded-lg bg-[#141736] hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 text-xs font-bold transition-colors">
            All on
          </button>
        </div>

        <!-- Выбор трейта для расчёта -->
        <div class="flex items-center gap-2">
          <label for="trait-select" class="text-xs font-semibold text-slate-400 whitespace-nowrap">Активный трейт:</label>
          <select
            id="trait-select"
            onchange="selectTrait(this.value)"
            class="px-3 py-1.5 rounded-lg bg-[#141736] border border-amber-400/40 text-xs font-bold text-amber-300 focus:outline-none focus:border-amber-400"
          >
            <!-- Опции генерируются из ALL_TRAITS -->
          </select>
        </div>
      </div>

      <!-- Предупреждение о лимите при Unique -->
      <div id="unique-warning" class="mb-3 px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/30 text-[11px] text-orange-300 font-medium hidden">
        ⚠️ Выбран трейт <strong>Unique</strong> (+300% DMG, -10% SPA, +10% Range): лимит размещения всех юнитов снижен до <strong>1</strong>.
      </div>

      <!-- Переключатель Average DPS / Max DPS -->
      <div class="grid grid-cols-2 gap-2 p-1 bg-[#0b0d24] rounded-xl border border-indigo-500/20 mb-4">
        <button id="btn-mode-avg" onclick="setDpsMode('avg')" class="py-2 rounded-lg text-xs sm:text-sm font-bold transition-all bg-[#1c204b] text-amber-300 border border-amber-400/70 shadow-sm">
          Average DPS (с учётом аптайма x1)
        </button>
        <button id="btn-mode-max" onclick="setDpsMode('max')" class="py-2 rounded-lg text-xs sm:text-sm font-bold transition-all text-slate-400 hover:text-slate-200 border border-transparent">
          Max DPS (Пиковый урон)
        </button>
      </div>

      <!-- Список юнитов тир-листа -->
      <div id="tierlist-rows" class="space-y-2"></div>
    </section>

    <!-- =================================================================== -->
    <!-- РАЗДЕЛ 2: БАЗА ВСЕХ ЮНИТОВ С ФИЛЬТРАМИ                              -->
    <!-- =================================================================== -->
    <section id="view-units" class="hidden space-y-4">
      <!-- Дополнительные фильтры по типу урона, цели атаки и редкости -->
      <div class="bg-[#131636] border border-indigo-500/25 rounded-2xl p-3.5 flex flex-wrap items-center gap-2.5">
        <select id="filter-dmg-type" onchange="setUnitFilter('damageType', this.value)" class="px-3 py-1.5 rounded-xl bg-[#090b1d] border border-indigo-500/30 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-400">
          <option value="All">Тип урона: Все (Phys / Magic)</option>
          <option value="Physical">⚔️ Physical (Баффает Orwin)</option>
          <option value="Magic">🔮 Magic (Баффает Wendy)</option>
        </select>

        <select id="filter-atk-type" onchange="setUnitFilter('attackType', this.value)" class="px-3 py-1.5 rounded-xl bg-[#090b1d] border border-indigo-500/30 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-400">
          <option value="All">Цели атаки: Все</option>
          <option value="Hybrid">🎯 Hybrid (Земля + Воздух)</option>
          <option value="Ground">👣 Ground (Только земля)</option>
          <option value="Air">🪽 Air (Только воздух)</option>
        </select>

        <select id="filter-rarity" onchange="setUnitFilter('rarity', this.value)" class="px-3 py-1.5 rounded-xl bg-[#090b1d] border border-indigo-500/30 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-400">
          <option value="All">Редкость: Все</option>
          <option value="Secret">👑 Secret</option>
          <option value="Mythic">⭐ Mythic</option>
        </select>
      </div>

      <div id="units-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-3.5"></div>
    </section>

    <!-- =================================================================== -->
    <!-- РАЗДЕЛ 3: ВСЕ 18 ТРЕЙТОВ И МЕХАНИКИ БАФФОВ                          -->
    <!-- =================================================================== -->
    <section id="view-traits" class="hidden space-y-5">
      <div class="bg-[#131636] border border-indigo-500/25 rounded-2xl p-5">
        <h2 class="text-base sm:text-lg font-extrabold text-amber-300 mb-1">✨ Все 18 Трейтов Anime Adventures</h2>
        <p class="text-xs text-slate-400 mb-4">Полный список трейтов с точными процентами и шансами выпадения. Любой из них можно выбрать в калькуляторе.</p>
        <div class="space-y-2" id="traits-table"></div>
      </div>

      <div class="bg-[#131636] border border-indigo-500/25 rounded-2xl p-5">
        <h2 class="text-base sm:text-lg font-extrabold text-sky-300 mb-1">⚡ Саппорты и Синергии (Точные правила)</h2>
        <p class="text-xs text-slate-400 mb-4">Как каждый саппорт влияет на Physical и Magic юнитов.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="buffs-reference"></div>
      </div>
    </section>

    <!-- =================================================================== -->
    <!-- РАЗДЕЛ 4: РЕЛИКВИИ И ПРЕДМЕТЫ                                       -->
    <!-- =================================================================== -->
    <section id="view-relics" class="hidden">
      <div class="bg-[#131636] border border-indigo-500/25 rounded-2xl p-5">
        <h2 class="text-base sm:text-lg font-extrabold text-purple-300 mb-1">💎 Реликвии и Снаряжение (Relics & Orbs)</h2>
        <p class="text-xs text-slate-400 mb-4">Экипируемые предметы для усиления характеристик персонажей.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="relics-grid"></div>
      </div>
    </section>

  </main>

  <!-- ===================================================================== -->
  <!-- МОДАЛЬНОЕ ОКНО ПОДРОБНОЙ ИНФОРМАЦИИ О ЮНИТЕ                           -->
  <!-- ===================================================================== -->
  <div id="unit-modal" onclick="closeModal()" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden items-center justify-center p-4">
    <div onclick="event.stopPropagation()" class="w-full max-w-lg bg-[#14173b] border border-indigo-400/40 rounded-2xl p-5 sm:p-6 shadow-2xl relative">
      <button onclick="closeModal()" class="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 flex items-center justify-center font-bold">
        ✕
      </button>
      <div id="modal-content"></div>
    </div>
  </div>

  <!-- ===================================================================== -->
  <!-- СКРИПТ: БАЗА ДАННЫХ И ДВИЖОК РАСЧЕТА                                  -->
  <!-- ===================================================================== -->
  <script>
    /**
     * =========================================================================
     * 1. БАЗА ДАННЫХ ЮНИТОВ (UPDATE 21: HEAVEN'S STORM)
     * СТРОГОЕ РАЗДЕЛЕНИЕ:
     * - damageType: ТОЛЬКО 'Physical' или 'Magic' (у каждого юнита один тип урона!)
     * - attackType: 'Ground' | 'Air' | 'Hybrid' (цели, по которым бьёт юнит)
     * =========================================================================
     */
    const UNITS_DATA = [
      {
        id: 'sky-god-rumble',
        name: 'Sky God (Rumble)',
        update: 'Update 21',
        updateTitle: "Update 21: Heaven's Storm",
        rarity: 'Secret',
        element: 'Lightning',
        damageType: 'Magic',     // Получает бафф только от Wendy
        attackType: 'Hybrid',    // Бьёт по земле и воздуху
        baseStats: '571 → 657 DMG',
        maxUpgradeDmg: 18400,
        spa: 6.5,
        range: 34,
        limit: 3,
        deployCost: '1,400¥',
        dotType: 'Shock',
        dotMultiplier: 0.25,
        burstMultiplier: 1.35,
        passive: 'Storm Overcharge: Магические атаки накладывают Shock (+25% DoT) и поражают как наземные, так и воздушные цели (Hybrid).'
      },
      {
        id: 'phoenix-mythic-flames',
        name: 'Phoenix (Mythic Flames)',
        update: 'Update 21',
        updateTitle: "Update 21: Heaven's Storm",
        rarity: 'Secret',
        element: 'Fire',
        damageType: 'Physical',  // Получает бафф только от Orwin
        attackType: 'Hybrid',    // Бьёт по земле и воздуху
        baseStats: '810 → 1,053 DMG',
        maxUpgradeDmg: 24500,
        spa: 7.2,
        range: 32,
        limit: 3,
        deployCost: '1,500¥',
        dotType: 'Burn',
        dotMultiplier: 0.30,
        burstMultiplier: 1.30,
        passive: 'Mythic Rebirth: Физические атаки поджигают врагов (Burn) и усиливают весь Burn-урон огненных союзников на +300%.'
      },
      {
        id: 'explosion-mage-archdemon',
        name: 'Explosion Mage (Archdemon)',
        update: 'Update 21',
        updateTitle: "Update 21: Heaven's Storm",
        rarity: 'Secret',
        element: 'Fire',
        damageType: 'Magic',     // Получает бафф только от Wendy
        attackType: 'Ground',    // Атакует только наземные цели
        baseStats: '900 → 1,080 DMG',
        maxUpgradeDmg: 42000,
        spa: 10.5,
        range: 38,
        limit: 1,
        deployCost: '1,750¥',
        dotType: 'Burn',
        dotMultiplier: 0.35,
        burstMultiplier: 1.55,
        passive: 'Nuclear Detonation: Колоссальный магический взрыв по земле (Ground Full AoE) с мощным горением (Burn).'
      },
      {
        id: 'fishi-obsession',
        name: 'Fishi (Obsession)',
        update: 'Update 21',
        updateTitle: "Update 21: Heaven's Storm",
        rarity: 'Mythic',
        element: 'Water',
        damageType: 'Physical',  // Получает бафф только от Orwin
        attackType: 'Hybrid',    // Бьёт по земле и воздуху
        baseStats: '770 → 962.5 DMG',
        maxUpgradeDmg: 19200,
        spa: 7.0,
        range: 28,
        limit: 4,
        deployCost: '1,300¥',
        dotType: 'Bleed',
        dotMultiplier: 0.20,
        burstMultiplier: 1.25,
        passive: 'Tidal Frenzy: Физические атаки накладывают кровотечение (Bleed +20%) по наземным и воздушным целям.'
      },
      {
        id: 'armored-crusader-noble',
        name: 'Armored Crusader (Noble)',
        update: 'Update 21',
        updateTitle: "Update 21: Heaven's Storm",
        rarity: 'Mythic',
        element: 'Dark',
        damageType: 'Physical',  // Получает бафф только от Orwin
        attackType: 'Ground',    // Атакует только землю
        baseStats: '750 → 937.5 DMG',
        maxUpgradeDmg: 17800,
        spa: 6.8,
        range: 29,
        limit: 4,
        deployCost: '1,000¥',
        dotType: 'None',
        dotMultiplier: 0,
        burstMultiplier: 1.30,
        passive: 'Unbreakable Will: Накапливает заряды брони при атаках по земле, увеличивая физический урон.'
      },
      {
        id: 'troy-flame-rage',
        name: 'Troy Flame (Rage)',
        update: 'Update 21',
        updateTitle: "Update 21: Heaven's Storm",
        rarity: 'Mythic',
        element: 'Fire',
        damageType: 'Magic',     // Получает бафф только от Wendy
        attackType: 'Hybrid',    // Бьёт по земле и воздуху
        baseStats: '620 → 837 DMG',
        maxUpgradeDmg: 18900,
        spa: 7.2,
        range: 30,
        limit: 4,
        deployCost: '1,350¥',
        dotType: 'Burn',
        dotMultiplier: 0.25,
        burstMultiplier: 1.28,
        passive: 'Hellfire Wrath: Поджигает цели (Burn) магическим пламенем и раскрывается под аурой Phoenix.'
      },
      {
        id: 'word-mage-script',
        name: 'Word Mage (Script)',
        update: 'Update 21',
        updateTitle: "Update 21: Heaven's Storm",
        rarity: 'Mythic',
        element: 'Light',
        damageType: 'Magic',     // Получает бафф только от Wendy
        attackType: 'Hybrid',    // Бьёт по земле и воздуху
        baseStats: '450 → 675 DMG',
        maxUpgradeDmg: 14800,
        spa: 6.5,
        range: 36,
        limit: 3,
        deployCost: '1,100¥',
        dotType: 'None',
        dotMultiplier: 0,
        burstMultiplier: 1.25,
        passive: 'Runic Sealing: Оглушает (Stun) врагов рунами и наносит магический урон по земле и воздуху.'
      },
      {
        id: 'water-goddess-holy',
        name: 'Water Goddess (Holy)',
        update: 'Update 21',
        updateTitle: "Update 21: Heaven's Storm",
        rarity: 'Mythic',
        element: 'Water',
        damageType: 'Magic',     // Получает бафф только от Wendy
        attackType: 'Ground',    // Атакует только землю
        baseStats: '480 → 648 DMG',
        maxUpgradeDmg: 13500,
        spa: 7.0,
        range: 35,
        limit: 3,
        deployCost: '1,150¥',
        dotType: 'None',
        dotMultiplier: 0,
        burstMultiplier: 1.22,
        passive: 'Sacred Purification: Очищает союзников от негативных эффектов и наносит магический урон по области.'
      },
      {
        id: 'crush-ace',
        name: 'Crush (Ace)',
        update: 'Update 21',
        updateTitle: "Update 21: Heaven's Storm",
        rarity: 'Mythic',
        element: 'Air',
        damageType: 'Physical',  // Получает бафф только от Orwin
        attackType: 'Ground',    // Атакует только землю
        baseStats: '150 → 202.5 DMG',
        maxUpgradeDmg: 11200,
        spa: 7.8,
        range: 25,
        limit: 4,
        deployCost: '1,500¥',
        dotType: 'None',
        dotMultiplier: 0,
        burstMultiplier: 1.20,
        passive: 'Gravity Slam: Отбрасывает наземных врагов назад (Knockback) физическими ударами.'
      }
    ];

    /**
     * =========================================================================
     * 2. ВСЕ 18 ТРЕЙТОВ ANIME ADVENTURES
     * =========================================================================
     */
    const ALL_TRAITS = [
      { id: 'none',        name: 'Без трейта (None)', chance: '—',     tier: '—',  dmgMult: 0,     spaRed: 0,     rangeMult: 0,    bossMult: 0,    limitOne: false, desc: 'Чистые статы без модификаторов трейта.' },
      { id: 'unique',      name: 'Unique',            chance: '0.1%',  tier: 'S+', dmgMult: 3.00,  spaRed: 0.10,  rangeMult: 0.10, bossMult: 0,    limitOne: true,  desc: '+300% DMG (x4), -10% SPA, +10% Range, Лимит размещения = 1.' },
      { id: 'golden',      name: 'Golden',            chance: '0.15%', tier: 'S',  dmgMult: 0.50,  spaRed: 0.10,  rangeMult: 0,    bossMult: 0,    limitOne: false, desc: '+50% DMG, -10% SPA, +25% Yen (сохраняет лимит x3/x4).' },
      { id: 'divine',      name: 'Divine',            chance: '0.2%',  tier: 'S',  dmgMult: 0.20,  spaRed: 0.10,  rangeMult: 0.10, bossMult: 0,    limitOne: false, desc: '+20% DMG, -10% SPA, +10% Range.' },
      { id: 'celestial',   name: 'Celestial',         chance: '0.35%', tier: 'A',  dmgMult: 0.15,  spaRed: 0.075, rangeMult: 0.10, bossMult: 0,    limitOne: false, desc: '+15% DMG, -7.5% SPA, +10% Range.' },
      { id: 'reaper',      name: 'Reaper',            chance: '0.8%',  tier: 'A',  dmgMult: 0.125, spaRed: 0.06,  rangeMult: 0,    bossMult: 0,    limitOne: false, desc: '+12.5% DMG, -6% SPA.' },
      { id: 'godspeed',    name: 'Godspeed',          chance: '1.2%',  tier: 'A',  dmgMult: 0,     spaRed: 0.15,  rangeMult: 0,    bossMult: 0,    limitOne: false, desc: '-15% SPA (ускорение перезарядки атак).' },
      { id: 'culling',     name: 'Culling',           chance: '1.5%',  tier: 'B',  dmgMult: 0,     spaRed: 0,     rangeMult: 0,    bossMult: 0.15, limitOne: false, desc: '+15% DMG против Боссов (учитывается в Max DPS).' },
      { id: 'adept',       name: 'Adept',             chance: '2.0%',  tier: 'B',  dmgMult: 0,     spaRed: 0,     rangeMult: 0,    bossMult: 0,    limitOne: false, desc: '+50% получаемого опыта (EXP) для прокачки уровня.' },
      { id: 'superior3',   name: 'Superior III',      chance: '3.0%',  tier: 'B',  dmgMult: 0.15,  spaRed: 0,     rangeMult: 0,    bossMult: 0,    limitOne: false, desc: '+15% DMG.' },
      { id: 'superior2',   name: 'Superior II',       chance: '6.5%',  tier: 'C',  dmgMult: 0.125, spaRed: 0,     rangeMult: 0,    bossMult: 0,    limitOne: false, desc: '+12.5% DMG.' },
      { id: 'superior1',   name: 'Superior I',        chance: '12.0%', tier: 'C',  dmgMult: 0.10,  spaRed: 0,     rangeMult: 0,    bossMult: 0,    limitOne: false, desc: '+10% DMG.' },
      { id: 'nimble3',     name: 'Nimble III',        chance: '3.0%',  tier: 'B',  dmgMult: 0,     spaRed: 0.125, rangeMult: 0,    bossMult: 0,    limitOne: false, desc: '-12.5% SPA.' },
      { id: 'nimble2',     name: 'Nimble II',         chance: '6.5%',  tier: 'C',  dmgMult: 0,     spaRed: 0.10,  rangeMult: 0,    bossMult: 0,    limitOne: false, desc: '-10% SPA.' },
      { id: 'nimble1',     name: 'Nimble I',          chance: '12.0%', tier: 'C',  dmgMult: 0,     spaRed: 0.075, rangeMult: 0,    bossMult: 0,    limitOne: false, desc: '-7.5% SPA.' },
      { id: 'range3',      name: 'Range III',         chance: '3.0%',  tier: 'C',  dmgMult: 0,     spaRed: 0,     rangeMult: 0.15, bossMult: 0,    limitOne: false, desc: '+15% Range.' },
      { id: 'range2',      name: 'Range II',          chance: '6.5%',  tier: 'D',  dmgMult: 0,     spaRed: 0,     rangeMult: 0.125,bossMult: 0,    limitOne: false, desc: '+12.5% Range.' },
      { id: 'range1',      name: 'Range I',           chance: '12.0%', tier: 'D',  dmgMult: 0,     spaRed: 0,     rangeMult: 0.10, bossMult: 0,    limitOne: false, desc: '+10% Range.' },
      { id: 'snipe',       name: 'Snipe',             chance: '2.5%',  tier: 'B',  dmgMult: 0.05,  spaRed: 0,     rangeMult: 0.20, bossMult: 0,    limitOne: false, desc: '+20% Range, +5% DMG.' }
    ];

    /**
     * =========================================================================
     * 3. РЕЛИКВИИ И САППОРТЫ
     * =========================================================================
     */
    const RELICS_DATA = [
      { name: 'Star Remnant', bonus: '+18% Elemental DMG', source: 'Рейды / Ивенты', bestFor: 'Sky God, Explosion Mage' },
      { name: 'Crimson Orb', bonus: '+15% Crit DMG & +10% Crit Chance', source: 'Infinite Castle / Tower', bestFor: 'Fishi, Armored Crusader' },
      { name: 'Demon Blade', bonus: '+20% Boss Damage', source: 'Shibuya Raid Shop', bestFor: 'Explosion Mage, Phoenix' },
      { name: 'Cost Orb', bonus: '-15% Upgrade Cost', source: 'Challenges', bestFor: 'Саппорты и фермы' }
    ];

    const BUFFS_REFERENCE = [
      { name: 'Orwin (x1 / x4)', color: '#facc15', badge: 'Physical Only', desc: 'Усиливает ТОЛЬКО Physical юнитов. x1 даёт +25% DMG (33.3% аптайма в Avg DPS, +25% в Max DPS). x4 даёт бесконечный цикл +100% DMG.' },
      { name: 'Wendy (x1 / x4)', color: '#38bdf8', badge: 'Magic Only', desc: 'Усиливает ТОЛЬКО Magic юнитов. x1 даёт +25% DMG (33.3% аптайма в Avg DPS, +25% в Max DPS). x4 даёт бесконечный цикл +100% DMG.' },
      { name: 'Oshy (Idol)', color: '#f472b6', badge: 'All Units', desc: '+25% DMG всем юнитам в радиусе и -15% стоимости прокачки.' },
      { name: 'Leafy (Sylph)', color: '#4ade80', badge: 'All Units', desc: '-15% SPA (снижение перезарядки, что повышает DPS на ~17.6%) и +15% Range.' },
      { name: 'Kisuke (Urahara)', color: '#34d399', badge: 'All Units', desc: '+15% DMG всем союзникам в радиусе и ускорение генерации энергии.' },
      { name: 'Sakura', color: '#fb7185', badge: 'All Units', desc: '+10% DMG и +10% Range всем союзникам в ауре.' },
      { name: 'Phoenix Burn Synergy', color: '#f87171', badge: 'Burn Units', desc: 'Усиливает урон от горения (Burn DoT) на +300% (итого x4 от базового Burn).' },
      { name: 'Level 110 Scaling', color: '#60a5fa', badge: 'Max Level', desc: 'Масштабирует базовые статы юнита от Lvl 1 до Lvl 110 (множитель x2.65).' }
    ];

    // =========================================================================
    // 4. СОСТОЯНИЕ ПРИЛОЖЕНИЯ
    // =========================================================================
    let state = {
      activeTab: 'tierlist',
      selectedUpdate: 'All',
      searchQuery: '',
      dpsMode: 'avg', // 'avg' | 'max'
      selectedTrait: 'unique',
      unitFilters: {
        damageType: 'All',
        attackType: 'All',
        rarity: 'All'
      },
      buffs: {
        orwin: 'x4',      // 'off' | 'x1' | 'x4' -> ТОЛЬКО Physical
        wendy: 'x4',      // 'off' | 'x1' | 'x4' -> ТОЛЬКО Magic
        oshy: true,       // +25% DMG
        leafy: true,      // -15% SPA, +15% Range
        kisuke: false,    // +15% DMG
        sakura: false,    // +10% DMG, +10% Range
        phoenixBurn: true,// +300% Burn DoT
        lvl110: true      // Lvl 110 (x2.65)
      }
    };

    // =========================================================================
    // 5. ДВИЖОК РАСЧЁТА DPS (СТРОГО PHYSICAL VS MAGIC)
    // =========================================================================
    function calculateUnitStats(unit) {
      const trait = ALL_TRAITS.find(t => t.id === state.selectedTrait) || ALL_TRAITS[0];

      // 1. Масштаб уровня (Lvl 1 = 1.0, Lvl 110 = 2.65)
      const levelMult = state.buffs.lvl110 ? 2.65 : 1.0;

      // 2. Раздельный бонус от Orwin (только Physical) и Wendy (только Magic)
      let supportAvgBonus = 0;
      let supportMaxBonus = 0;

      if (unit.damageType === 'Physical') {
        if (state.buffs.orwin === 'x1') {
          // 1 копия Orwin: +25% на 10 сек из 30 сек цикла -> 33.3% аптайм в среднем
          supportAvgBonus += 0.25 * (1 / 3);
          supportMaxBonus += 0.25;
        } else if (state.buffs.orwin === 'x4') {
          // 4 копии Orwin: бесконечный цикл +100% DMG
          supportAvgBonus += 1.00;
          supportMaxBonus += 1.00;
        }
      } else if (unit.damageType === 'Magic') {
        if (state.buffs.wendy === 'x1') {
          supportAvgBonus += 0.25 * (1 / 3);
          supportMaxBonus += 0.25;
        } else if (state.buffs.wendy === 'x4') {
          supportAvgBonus += 1.00;
          supportMaxBonus += 1.00;
        }
      }

      // 3. Общие саппорты (Oshy, Kisuke, Sakura)
      let globalSupportBonus = 0;
      if (state.buffs.oshy) globalSupportBonus += 0.25;
      if (state.buffs.kisuke) globalSupportBonus += 0.15;
      if (state.buffs.sakura) globalSupportBonus += 0.10;

      // 4. Итоговые множители урона с учётом выбранного трейта
      const avgDmgMult = levelMult * (1 + trait.dmgMult + supportAvgBonus + globalSupportBonus);
      const maxDmgMult = levelMult * (1 + trait.dmgMult + trait.bossMult + supportMaxBonus + globalSupportBonus);

      // 5. Расчёт SPA (перезарядки) с учётом трейта и Leafy (-15% SPA)
      let effectiveSpa = unit.spa * (1 - trait.spaRed);
      if (state.buffs.leafy) {
        effectiveSpa *= 0.85; // -15% SPA
      }

      // 6. Расчёт Range с учётом трейта, Leafy (+15%) и Sakura (+10%)
      let rangeBonus = trait.rangeMult;
      if (state.buffs.leafy) rangeBonus += 0.15;
      if (state.buffs.sakura) rangeBonus += 0.10;
      const effectiveRange = (unit.range * (1 + rangeBonus)).toFixed(1);

      // 7. Лимит размещения (Unique режет до 1)
      const effectiveLimit = trait.limitOne ? 1 : unit.limit;

      // 8. Прямой DPS и DoT (Burn / Bleed / Shock)
      const directAvgDps = ((unit.maxUpgradeDmg * avgDmgMult) / effectiveSpa) * effectiveLimit;
      const directMaxDps = ((unit.maxUpgradeDmg * maxDmgMult) / effectiveSpa) * effectiveLimit;

      let dotRatio = unit.dotMultiplier || 0;
      if (unit.dotType === 'Burn' && state.buffs.phoenixBurn) {
        dotRatio *= 4.0; // +300% к горению (итого x4)
      }

      const avgDps = directAvgDps * (1 + dotRatio);
      const maxDps = directMaxDps * (1 + dotRatio) * (unit.burstMultiplier || 1.25);

      // Базовый чистый DPS (Lvl 1, без баффов и трейтов) для отображения % прироста
      const rawBaseDps = ((unit.maxUpgradeDmg / unit.spa) * unit.limit) * (1 + (unit.dotMultiplier || 0));
      const boostPercent = Math.round(((avgDps - rawBaseDps) / rawBaseDps) * 100);

      return {
        avgDps,
        maxDps,
        effectiveLimit,
        effectiveSpa: effectiveSpa.toFixed(2),
        effectiveRange,
        boostPercent,
        getsOrwin: unit.damageType === 'Physical' && state.buffs.orwin !== 'off',
        getsWendy: unit.damageType === 'Magic' && state.buffs.wendy !== 'off'
      };
    }

    function formatNumber(num) {
      if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
      if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
      return Math.round(num).toString();
    }

    // Бейджи для Damage Type, Attack Type и Element
    function getDamageTypeBadge(dmgType) {
      if (dmgType === 'Physical') {
        return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/35">⚔️ Physical</span>`;
      }
      return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/35">🔮 Magic</span>`;
    }

    function getAttackTypeBadge(atkType) {
      if (atkType === 'Hybrid') {
        return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/35">🎯 Hybrid</span>`;
      }
      if (atkType === 'Air') {
        return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/35">🪽 Air</span>`;
      }
      return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-500/20 text-slate-300 border border-slate-500/35">👣 Ground</span>`;
    }

    function getElementBadge(el) {
      const map = {
        Lightning: { icon: '⚡', cls: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
        Fire:      { icon: '🔥', cls: 'bg-orange-500/20 text-orange-300 border-orange-500/40' },
        Water:     { icon: '💧', cls: 'bg-sky-500/20 text-sky-300 border-sky-500/40' },
        Dark:      { icon: '🌑', cls: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
        Light:     { icon: '✨', cls: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
        Air:       { icon: '🌪️', cls: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' }
      };
      const item = map[el] || { icon: '⚔️', cls: 'bg-slate-500/20 text-slate-300 border-slate-500/40' };
      return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${item.cls}">${item.icon} ${el}</span>`;
    }

    // =========================================================================
    // 6. РЕНДЕРИНГ ИНТЕРФЕЙСА
    // =========================================================================
    function renderUpdateFilters() {
      const updates = ['All', ...new Set(UNITS_DATA.map(u => u.update))];
      document.getElementById('update-filters').innerHTML = updates.map(upd => {
        const isActive = state.selectedUpdate === upd;
        return `
          <button
            onclick="selectUpdate('${upd}')"
            class="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              isActive
                ? 'bg-indigo-500/25 text-indigo-200 border-indigo-400/60 shadow-sm'
                : 'bg-[#090b1d] text-slate-400 hover:text-slate-200 border-indigo-500/20'
            }"
          >
            ${upd === 'All' ? 'Все обновления' : upd}
          </button>
        `;
      }).join('');
    }

    function renderTraitSelect() {
      document.getElementById('trait-select').innerHTML = ALL_TRAITS.map(t => `
        <option value="${t.id}" ${state.selectedTrait === t.id ? 'selected' : ''}>
          ${t.name} ${t.tier !== '—' ? `[${t.tier}]` : ''}
        </option>
      `).join('');
    }

    function renderBuffButtons() {
      const buttonsData = [
        {
          id: 'orwin',
          short: 'ORW',
          sub: state.buffs.orwin === 'off' ? 'OFF' : `${state.buffs.orwin} PHYS`,
          isOn: state.buffs.orwin !== 'off',
          color: '#facc15',
          title: 'Orwin (ТОЛЬКО Physical): клик переключает Off → x1 (+25%) → x4 (+100%)',
          onClick: "cycleSupport('orwin')"
        },
        {
          id: 'wendy',
          short: 'WND',
          sub: state.buffs.wendy === 'off' ? 'OFF' : `${state.buffs.wendy} MAG`,
          isOn: state.buffs.wendy !== 'off',
          color: '#38bdf8',
          title: 'Wendy (ТОЛЬКО Magic): клик переключает Off → x1 (+25%) → x4 (+100%)',
          onClick: "cycleSupport('wendy')"
        },
        {
          id: 'oshy',
          short: 'OSH',
          sub: '+25%',
          isOn: state.buffs.oshy,
          color: '#f472b6',
          title: 'Oshy (Idol): +25% DMG всем юнитам и -15% Cost',
          onClick: "toggleSimpleBuff('oshy')"
        },
        {
          id: 'leafy',
          short: 'LFY',
          sub: '-15% SPA',
          isOn: state.buffs.leafy,
          color: '#4ade80',
          title: 'Leafy (Sylph): -15% SPA и +15% Range всем юнитам',
          onClick: "toggleSimpleBuff('leafy')"
        },
        {
          id: 'kisuke',
          short: 'KSK',
          sub: '+15%',
          isOn: state.buffs.kisuke,
          color: '#34d399',
          title: 'Kisuke (Urahara): +15% DMG всем юнитам',
          onClick: "toggleSimpleBuff('kisuke')"
        },
        {
          id: 'sakura',
          short: 'SKR',
          sub: '+10%',
          isOn: state.buffs.sakura,
          color: '#fb7185',
          title: 'Sakura: +10% DMG и +10% Range всем юнитам',
          onClick: "toggleSimpleBuff('sakura')"
        },
        {
          id: 'phoenixBurn',
          short: 'PHX',
          sub: '+300%',
          isOn: state.buffs.phoenixBurn,
          color: '#f87171',
          title: 'Phoenix Synergy: +300% урона от Burn (горения)',
          onClick: "toggleSimpleBuff('phoenixBurn')"
        },
        {
          id: 'lvl110',
          short: '110',
          sub: 'LVL',
          isOn: state.buffs.lvl110,
          color: '#60a5fa',
          title: 'Level 110: максимальный уровень персонажа (x2.65)',
          onClick: "toggleSimpleBuff('lvl110')"
        }
      ];

      document.getElementById('buffs-container').innerHTML = buttonsData.map(b => `
        <button
          onclick="${b.onClick}"
          title="${b.title}"
          class="relative w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all duration-150 border-2 ${
            b.isOn
              ? 'bg-[#1b214d] border-sky-400/80 shadow-[0_0_14px_rgba(56,189,248,0.3)] scale-100'
              : 'bg-[#0c0e24] border-slate-700/70 opacity-60 hover:opacity-90 scale-95'
          }"
        >
          <span class="text-xs font-black tracking-tighter" style="color: ${b.isOn ? b.color : '#64748b'}">
            ${b.short}
          </span>
          <span class="text-[8px] font-bold text-slate-300 leading-none mt-0.5">
            ${b.sub}
          </span>
          ${!b.isOn ? '<span class="buff-slash"></span>' : ''}
        </button>
      `).join('');

      const warning = document.getElementById('unique-warning');
      if (state.selectedTrait === 'unique') {
        warning.classList.remove('hidden');
      } else {
        warning.classList.add('hidden');
      }
    }

    function getFilteredUnits(applyExtraFilters = false) {
      return UNITS_DATA.filter(u => {
        const matchUpd = state.selectedUpdate === 'All' || u.update === state.selectedUpdate;
        const q = state.searchQuery.toLowerCase();
        const matchSearch =
          u.name.toLowerCase().includes(q) ||
          u.element.toLowerCase().includes(q) ||
          u.damageType.toLowerCase().includes(q) ||
          u.attackType.toLowerCase().includes(q);

        if (!applyExtraFilters) return matchUpd && matchSearch;

        const matchDmg = state.unitFilters.damageType === 'All' || u.damageType === state.unitFilters.damageType;
        const matchAtk = state.unitFilters.attackType === 'All' || u.attackType === state.unitFilters.attackType;
        const matchRar = state.unitFilters.rarity === 'All' || u.rarity === state.unitFilters.rarity;

        return matchUpd && matchSearch && matchDmg && matchAtk && matchRar;
      });
    }

    function renderTierList() {
      const units = getFilteredUnits(false).map(u => ({
        ...u,
        calc: calculateUnitStats(u)
      }));

      units.sort((a, b) => {
        const valA = state.dpsMode === 'avg' ? a.calc.avgDps : a.calc.maxDps;
        const valB = state.dpsMode === 'avg' ? b.calc.avgDps : b.calc.maxDps;
        return valB - valA;
      });

      const container = document.getElementById('tierlist-rows');
      if (units.length === 0) {
        container.innerHTML = `<div class="text-center py-8 text-sm text-slate-400">Юниты не найдены</div>`;
        return;
      }

      container.innerHTML = units.map((u, idx) => {
        const rank = idx + 1;
        let rankStyle = 'bg-[#202552] text-slate-300 border-indigo-500/30';
        if (rank === 1) rankStyle = 'bg-amber-400 text-slate-950 border-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.5)]';
        if (rank === 2) rankStyle = 'bg-slate-200 text-slate-900 border-white shadow-[0_0_10px_rgba(226,232,240,0.4)]';
        if (rank === 3) rankStyle = 'bg-amber-700 text-amber-100 border-amber-500';

        const primaryDps = state.dpsMode === 'avg' ? u.calc.avgDps : u.calc.maxDps;
        const secondaryLabel = state.dpsMode === 'avg'
          ? `max ${formatNumber(u.calc.maxDps)}`
          : `avg ${formatNumber(u.calc.avgDps)}`;

        const nameColor = u.rarity === 'Secret' ? 'text-rose-400' : 'text-amber-300';
        const rarityIcon = u.rarity === 'Secret' ? '👑' : '⭐';

        // Индикатор активного профильного саппорта (Orwin для Phys, Wendy для Magic)
        let activeSupportTag = '';
        if (u.calc.getsOrwin) {
          activeSupportTag = `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">ORW ${state.buffs.orwin}</span>`;
        } else if (u.calc.getsWendy) {
          activeSupportTag = `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">WND ${state.buffs.wendy}</span>`;
        }

        return `
          <div onclick="openModal('${u.id}')" class="group cursor-pointer flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-2.5 rounded-xl bg-[#181c40]/90 hover:bg-[#202554] border border-indigo-500/20 hover:border-amber-400/50 transition-all">
            <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs sm:text-sm font-black border ${rankStyle}">
                ${rank}
              </span>
              <span class="text-sm flex-shrink-0" title="${u.rarity}">${rarityIcon}</span>
              <div class="truncate">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="text-xs sm:text-sm font-bold truncate group-hover:underline ${nameColor}">
                    ${u.name}
                  </span>
                  <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    x${u.calc.effectiveLimit}
                  </span>
                  ${activeSupportTag}
                </div>
                <div class="flex items-center gap-1.5 mt-1 flex-wrap">
                  ${getDamageTypeBadge(u.damageType)}
                  ${getAttackTypeBadge(u.attackType)}
                  <span class="text-[11px] text-slate-400 hidden sm:inline">• ${u.element}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3 sm:gap-5 flex-shrink-0">
              <div class="text-right hidden sm:block">
                <div class="text-[10px] font-bold text-emerald-400/90">+${u.calc.boostPercent}%</div>
                <div class="text-[10px] text-slate-500">SPA ${u.calc.effectiveSpa}s</div>
              </div>
              <div class="text-right min-w-[76px] sm:min-w-[90px]">
                <div class="text-sm sm:text-base font-black text-[#4ade80] tracking-tight leading-tight">
                  ${formatNumber(primaryDps)}
                </div>
                <div class="text-[10px] sm:text-[11px] font-medium text-slate-400 leading-tight mt-0.5">
                  ${secondaryLabel}
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    function renderUnitsDatabase() {
      const units = getFilteredUnits(true);
      const container = document.getElementById('units-grid');

      if (units.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-8 text-sm text-slate-400">По выбранным фильтрам юниты не найдены</div>`;
        return;
      }

      container.innerHTML = units.map(u => {
        const cardRarity = u.rarity === 'Secret' ? 'rarity-secret' : 'rarity-mythic';
        const badgeColor = u.rarity === 'Secret'
          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
          : 'bg-amber-500/20 text-amber-300 border-amber-500/40';

        return `
          <div onclick="openModal('${u.id}')" class="cursor-pointer rounded-2xl p-4 border transition-all hover:scale-[1.01] flex flex-col justify-between gap-3 ${cardRarity}">
            <div>
              <div class="flex items-center justify-between gap-2 mb-2">
                <div class="flex items-center gap-1.5">
                  <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${badgeColor}">${u.rarity}</span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-black/30 text-slate-300">${u.update}</span>
                </div>
                ${getElementBadge(u.element)}
              </div>

              <h3 class="text-base font-extrabold text-white mb-1.5">${u.name}</h3>

              <div class="flex items-center gap-1.5 mb-2">
                ${getDamageTypeBadge(u.damageType)}
                ${getAttackTypeBadge(u.attackType)}
              </div>

              <p class="text-xs text-slate-300/80 line-clamp-2">${u.passive}</p>
            </div>

            <div class="grid grid-cols-4 gap-1.5 pt-2.5 border-t border-white/10 text-center">
              <div class="bg-[#090b1d]/80 rounded-lg py-1.5">
                <div class="text-[9px] text-slate-400">Max DMG</div>
                <div class="text-xs font-bold text-white">${formatNumber(u.maxUpgradeDmg)}</div>
              </div>
              <div class="bg-[#090b1d]/80 rounded-lg py-1.5">
                <div class="text-[9px] text-slate-400">SPA</div>
                <div class="text-xs font-bold text-sky-300">${u.spa}s</div>
              </div>
              <div class="bg-[#090b1d]/80 rounded-lg py-1.5">
                <div class="text-[9px] text-slate-400">Range</div>
                <div class="text-xs font-bold text-amber-300">${u.range}</div>
              </div>
              <div class="bg-[#090b1d]/80 rounded-lg py-1.5">
                <div class="text-[9px] text-slate-400">Limit</div>
                <div class="text-xs font-bold text-emerald-400">${u.limit}</div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    function renderReferenceTables() {
      // Все 18 трейтов (кроме 'none')
      const displayTraits = ALL_TRAITS.filter(t => t.id !== 'none');
      document.getElementById('traits-table').innerHTML = displayTraits.map(t => `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[#0b0d24] border border-indigo-500/20">
          <div class="flex items-center gap-3">
            <span class="w-8 text-center py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/40">${t.tier}</span>
            <div>
              <div class="text-sm font-bold text-white">${t.name}</div>
              <div class="text-xs text-slate-400">${t.desc}</div>
            </div>
          </div>
          <span class="text-xs font-mono text-sky-300 bg-sky-500/10 px-2.5 py-1 rounded-lg self-start sm:self-center">Шанс: ${t.chance}</span>
        </div>
      `).join('');

      document.getElementById('buffs-reference').innerHTML = BUFFS_REFERENCE.map(b => `
        <div class="p-3 rounded-xl bg-[#0b0d24] border border-indigo-500/20">
          <div class="flex items-center justify-between mb-1">
            <span class="text-sm font-bold" style="color: ${b.color}">${b.name}</span>
            <span class="text-[10px] font-extrabold px-2 py-0.5 rounded bg-white/5 text-slate-300">${b.badge}</span>
          </div>
          <p class="text-xs text-slate-400">${b.desc}</p>
        </div>
      `).join('');

      document.getElementById('relics-grid').innerHTML = RELICS_DATA.map(r => `
        <div class="p-4 rounded-xl bg-[#0b0d24] border border-indigo-500/20 flex flex-col justify-between gap-2">
          <div>
            <h3 class="text-sm font-bold text-amber-300">${r.name}</h3>
            <div class="text-xs font-semibold text-emerald-400 mt-1">${r.bonus}</div>
          </div>
          <div class="text-[11px] text-slate-400 pt-2 border-t border-slate-800 space-y-0.5">
            <div><strong class="text-slate-300">Где получить:</strong> ${r.source}</div>
            <div><strong class="text-slate-300">Лучше для:</strong> ${r.bestFor}</div>
          </div>
        </div>
      `).join('');
    }

    // =========================================================================
    // 7. ОБРАБОТЧИКИ СОБЫТИЙ
    // =========================================================================
    function cycleSupport(id) {
      const order = ['off', 'x1', 'x4'];
      const nextIdx = (order.indexOf(state.buffs[id]) + 1) % order.length;
      state.buffs[id] = order[nextIdx];
      renderBuffButtons();
      renderTierList();
    }

    function toggleSimpleBuff(id) {
      state.buffs[id] = !state.buffs[id];
      renderBuffButtons();
      renderTierList();
    }

    function setAllBuffs(val) {
      state.buffs.orwin = val ? 'x4' : 'off';
      state.buffs.wendy = val ? 'x4' : 'off';
      state.buffs.oshy = val;
      state.buffs.leafy = val;
      state.buffs.kisuke = val;
      state.buffs.sakura = val;
      state.buffs.phoenixBurn = val;
      state.buffs.lvl110 = val;
      renderBuffButtons();
      renderTierList();
    }

    function selectTrait(traitId) {
      state.selectedTrait = traitId;
      renderBuffButtons();
      renderTierList();
    }

    function setDpsMode(mode) {
      state.dpsMode = mode;
      const btnAvg = document.getElementById('btn-mode-avg');
      const btnMax = document.getElementById('btn-mode-max');
      if (mode === 'avg') {
        btnAvg.className = 'py-2 rounded-lg text-xs sm:text-sm font-bold transition-all bg-[#1c204b] text-amber-300 border border-amber-400/70 shadow-sm';
        btnMax.className = 'py-2 rounded-lg text-xs sm:text-sm font-bold transition-all text-slate-400 hover:text-slate-200 border border-transparent';
      } else {
        btnMax.className = 'py-2 rounded-lg text-xs sm:text-sm font-bold transition-all bg-[#1c204b] text-amber-300 border border-amber-400/70 shadow-sm';
        btnAvg.className = 'py-2 rounded-lg text-xs sm:text-sm font-bold transition-all text-slate-400 hover:text-slate-200 border border-transparent';
      }
      renderTierList();
    }

    function selectUpdate(upd) {
      state.selectedUpdate = upd;
      renderUpdateFilters();
      renderTierList();
      renderUnitsDatabase();
    }

    function setUnitFilter(key, val) {
      state.unitFilters[key] = val;
      renderUnitsDatabase();
    }

    function handleSearch(val) {
      state.searchQuery = val;
      renderTierList();
      renderUnitsDatabase();
    }

    function switchTab(tab) {
      state.activeTab = tab;
      ['tierlist', 'units', 'traits', 'relics'].forEach(t => {
        const view = document.getElementById('view-' + t);
        const btn = document.getElementById('tab-' + t);
        if (t === tab) {
          view.classList.remove('hidden');
          btn.className = 'nav-btn px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all bg-amber-500/20 text-amber-300 border border-amber-400/50';
        } else {
          view.classList.add('hidden');
          btn.className = 'nav-btn px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all text-slate-400 hover:text-white hover:bg-white/5 border border-transparent';
        }
      });
    }

    function openModal(unitId) {
      const u = UNITS_DATA.find(item => item.id === unitId);
      if (!u) return;
      const calc = calculateUnitStats(u);
      const badgeColor = u.rarity === 'Secret'
        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
        : 'bg-amber-500/20 text-amber-300 border-amber-500/40';

      const supportNote = u.damageType === 'Physical'
        ? 'Получает бафф только от <strong>Orwin</strong> (игнорирует Wendy).'
        : 'Получает бафф только от <strong>Wendy</strong> (игнорирует Orwin).';

      document.getElementById('modal-content').innerHTML = `
        <div class="flex flex-wrap items-center gap-2 mb-2">
          <span class="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded border ${badgeColor}">${u.rarity}</span>
          ${getElementBadge(u.element)}
          <span class="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">${u.updateTitle}</span>
        </div>

        <h2 class="text-xl font-black text-white mb-2">${u.name}</h2>

        <div class="flex flex-wrap items-center gap-2 mb-3">
          ${getDamageTypeBadge(u.damageType)}
          ${getAttackTypeBadge(u.attackType)}
          <span class="text-xs text-slate-400">• Стоимость: ${u.deployCost}</span>
        </div>

        <p class="text-xs text-slate-300 bg-white/5 px-3 py-2 rounded-lg mb-4">${supportNote}</p>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <div class="bg-[#0b0d24] p-2.5 rounded-xl border border-indigo-500/20">
            <div class="text-[10px] text-slate-400">Base → Evo DMG</div>
            <div class="text-xs font-bold text-white mt-0.5">${u.baseStats}</div>
          </div>
          <div class="bg-[#0b0d24] p-2.5 rounded-xl border border-indigo-500/20">
            <div class="text-[10px] text-slate-400">Max Upgrade (Lvl 1)</div>
            <div class="text-xs font-bold text-amber-300 mt-0.5">${u.maxUpgradeDmg.toLocaleString()}</div>
          </div>
          <div class="bg-[#0b0d24] p-2.5 rounded-xl border border-indigo-500/20">
            <div class="text-[10px] text-slate-400">SPA / Range</div>
            <div class="text-xs font-bold text-sky-300 mt-0.5">${calc.effectiveSpa}s / ${calc.effectiveRange}</div>
          </div>
          <div class="bg-[#0b0d24] p-2.5 rounded-xl border border-indigo-500/20">
            <div class="text-[10px] text-slate-400">Placement Limit</div>
            <div class="text-xs font-bold text-emerald-400 mt-0.5">${u.limit} (Сейчас: x${calc.effectiveLimit})</div>
          </div>
        </div>

        <div class="bg-[#0b0d24] p-3.5 rounded-xl border border-emerald-500/30 mb-3 flex items-center justify-between">
          <div>
            <div class="text-[11px] text-slate-400">Расчетный DPS с текущими баффами</div>
            <div class="text-lg font-black text-[#4ade80]">${formatNumber(calc.avgDps)} <span class="text-xs font-normal text-slate-400">(Max: ${formatNumber(calc.maxDps)})</span></div>
          </div>
          <span class="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 text-xs font-bold">+${calc.boostPercent}% к базе</span>
        </div>

        <div class="bg-[#0b0d24] p-3.5 rounded-xl border border-indigo-500/20 text-xs">
          <div class="font-bold text-amber-300 mb-1">Способность и механика:</div>
          <p class="text-slate-300 leading-relaxed">${u.passive}</p>
        </div>
      `;

      const modal = document.getElementById('unit-modal');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }

    function closeModal() {
      const modal = document.getElementById('unit-modal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }

    // Инициализация
    renderUpdateFilters();
    renderTraitSelect();
    renderBuffButtons();
    renderTierList();
    renderUnitsDatabase();
    renderReferenceTables();
  </script>
</body>
</html>
