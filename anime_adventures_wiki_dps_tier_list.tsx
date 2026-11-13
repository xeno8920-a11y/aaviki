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
    /* Скрытие полосы прокрутки для горизонтальных фильтров на мобильных */
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    /* Эффект перечеркивания отключенного баффа как на скриншоте */
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
    /* Градиенты редкости */
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

  <!-- Фоновое космическое свечение -->
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
      <!-- Логотип -->
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
          <p class="text-xs text-slate-400">База юнитов по обновлениям и реальный DPS-калькулятор</p>
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
          ✨ Трейты и Баффы
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
      <!-- Фильтр по обновлениям -->
      <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar" id="update-filters">
        <!-- Кнопки генерируются через JS из списка обновлений -->
      </div>

      <!-- Поиск -->
      <div class="relative sm:w-64">
        <input
          type="text"
          id="search-input"
          oninput="handleSearch(this.value)"
          placeholder="Поиск юнита..."
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
          Учитываемые баффы <span class="text-slate-400">(нажми, чтобы выключить; «110» — уровень 110):</span>
        </p>
        <span class="text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full self-start">
          Клик по строке = карточка юнита
        </span>
      </div>

      <!-- Круглые иконки баффов (как на скриншоте) -->
      <div id="buffs-container" class="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-4">
        <!-- Рендерится через JS -->
      </div>

      <!-- Кнопки "All off" и "All on" -->
      <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div class="flex items-center gap-2">
          <button onclick="setAllBuffs(false)" class="px-3.5 py-1.5 rounded-lg bg-[#0b0d24] hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 text-xs font-bold transition-colors">
            All off
          </button>
          <button onclick="setAllBuffs(true)" class="px-3.5 py-1.5 rounded-lg bg-[#0b0d24] hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 text-xs font-bold transition-colors">
            All on
          </button>
        </div>

        <!-- Подсказка о лимите при Unique -->
        <div id="unique-warning" class="text-[11px] text-orange-300/90 font-medium hidden">
          ⚠️ Unique активен: лимит размещения всех юнитов снижен до 1
        </div>
      </div>

      <!-- Переключатель Average DPS / Max DPS -->
      <div class="grid grid-cols-2 gap-2 p-1 bg-[#0b0d24] rounded-xl border border-indigo-500/20 mb-4">
        <button id="btn-mode-avg" onclick="setDpsMode('avg')" class="py-2 rounded-lg text-xs sm:text-sm font-bold transition-all bg-[#1c204b] text-amber-300 border border-amber-400/70 shadow-sm">
          Average DPS
        </button>
        <button id="btn-mode-max" onclick="setDpsMode('max')" class="py-2 rounded-lg text-xs sm:text-sm font-bold transition-all text-slate-400 hover:text-slate-200 border border-transparent">
          Max DPS (Burst + Synergies)
        </button>
      </div>

      <!-- Список юнитов тир-листа -->
      <div id="tierlist-rows" class="space-y-2">
        <!-- Строки генерируются через JS -->
      </div>
    </section>

    <!-- =================================================================== -->
    <!-- РАЗДЕЛ 2: БАЗА ВСЕХ ЮНИТОВ (КАРТОЧКИ)                               -->
    <!-- =================================================================== -->
    <section id="view-units" class="hidden">
      <div id="units-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <!-- Карточки генерируются через JS -->
      </div>
    </section>

    <!-- =================================================================== -->
    <!-- РАЗДЕЛ 3: ТРЕЙТЫ И ФОРМУЛЫ БАФФОВ                                   -->
    <!-- =================================================================== -->
    <section id="view-traits" class="hidden space-y-5">
      <div class="bg-[#131636] border border-indigo-500/25 rounded-2xl p-5">
        <h2 class="text-base sm:text-lg font-extrabold text-amber-300 mb-1">✨ Трейты (Traits) в формулах калькулятора</h2>
        <p class="text-xs text-slate-400 mb-4">Реальные игровые множители, используемые при расчёте DPS на сайте.</p>
        <div class="space-y-2" id="traits-table"></div>
      </div>

      <div class="bg-[#131636] border border-indigo-500/25 rounded-2xl p-5">
        <h2 class="text-base sm:text-lg font-extrabold text-sky-300 mb-1">⚡ Саппорты, Уровни и Синергии</h2>
        <p class="text-xs text-slate-400 mb-4">Каждый переключатель в верхней панели меняет итоговый урон согласно этим правилам.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="buffs-reference"></div>
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
     * 1. БАЗА ДАННЫХ ЮНИТОВ (ПО ОБНОВЛЕНИЯМ)
     * Чтобы добавить новое обновление (например, Update 20), просто скопируй
     * объекты ниже, вставь в конец массива UNITS_DATA и укажи update: 'Update 20'.
     * =========================================================================
     */
    const UNITS_DATA = [
      // --- UPDATE 21: HEAVEN'S STORM (Все 9 юнитов патча) ---
      {
        id: 'sky-god-rumble',
        name: 'Sky God (Rumble)',
        baseName: 'Sky God',
        update: 'Update 21',
        updateTitle: "Update 21: Heaven's Storm",
        rarity: 'Secret',
        element: 'Lightning',
        damageType: 'Magic',
        baseStats: '571 → 657 DMG',
        maxUpgradeDmg: 18400, // Урон на максимальном апгрейде (Lvl 1)
        spa: 6.5,
        range: 34,
        limit: 3,
        deployCost: '1,400¥',
        dotType: 'Shock',
        dotMultiplier: 0.25, // +25% доп. урона от шока
        burstMultiplier: 1.35, // Пиковый DPS при срабатывании цепной молнии
        passive: 'Storm Overcharge: Атаки накладывают статус Shock (+25% DoT) и вызывают цепные молнии по области.'
      },
      {
        id: 'phoenix-mythic-flames',
        name: 'Phoenix (Mythic Flames)',
        baseName: 'Phoenix',
        update: 'Update 21',
        updateTitle: "Update 21: Heaven's Storm",
        rarity: 'Secret',
        element: 'Fire',
        damageType: 'Physical',
        baseStats: '810 → 1,053 DMG',
        maxUpgradeDmg: 24500,
        spa: 7.2,
        range: 32,
        limit: 3,
        deployCost: '1,500¥',
        dotType: 'Burn',
        dotMultiplier: 0.30, // Базовый Burn 30% (усиливается на +300% синергией Феникса!)
        burstMultiplier: 1.30,
        passive: 'Mythic Rebirth: Накладывает сильное горение (Burn) и усиливает весь Burn-урон огненных союзников на +300%.'
      },
      {
        id: 'explosion-mage-archdemon',
        name: 'Explosion Mage (Archdemon)',
        baseName: 'Explosion Mage',
        update: 'Update 21',
        updateTitle: "Update 21: Heaven's Storm",
        rarity: 'Secret',
        element: 'Fire',
        damageType: 'Magic',
        baseStats: '900 → 1,080 DMG',
        maxUpgradeDmg: 42000,
        spa: 10.5,
        range: 38,
        limit: 1,
        deployCost: '1,750¥',
        dotType: 'Burn',
        dotMultiplier: 0.35,
        burstMultiplier: 1.55, // Огромный пиковый взрыв
        passive: 'Nuclear Detonation: Колоссальный урон по огромному радиусу (Full AoE) с мощным эффектом Burn.'
      },
      {
        id: 'fishi-obsession',
        name: 'Fishi (Obsession)',
        baseName: 'Fishi',
        update: 'Update 21',
        updateTitle: "Update 21: Heaven's Storm",
        rarity: 'Mythic',
        element: 'Water',
        damageType: 'Physical',
        baseStats: '770 → 962.5 DMG',
        maxUpgradeDmg: 19200,
        spa: 7.0,
        range: 28,
        limit: 4,
        deployCost: '1,300¥',
        dotType: 'Bleed',
        dotMultiplier: 0.20,
        burstMultiplier: 1.25,
        passive: 'Tidal Frenzy: Накладывает кровотечение (Bleed +20%) и ускоряет серии атак по целям в воде.'
      },
      {
        id: 'armored-crusader-noble',
        name: 'Armored Crusader (Noble)',
        baseName: 'Armored Crusader',
        update: 'Update 21',
        updateTitle: "Update 21: Heaven's Storm",
        rarity: 'Mythic',
        element: 'Dark',
        damageType: 'Physical',
        baseStats: '750 → 937.5 DMG',
        maxUpgradeDmg: 17800,
        spa: 6.8,
        range: 29,
        limit: 4,
        deployCost: '1,000¥',
        dotType: 'None',
        dotMultiplier: 0,
        burstMultiplier: 1.30,
        passive: 'Unbreakable Will: Накапливает заряды брони при атаках, повышая итоговый урон и пробивая защиту.'
      },
      {
        id: 'troy-flame-rage',
        name: 'Troy Flame (Rage)',
        baseName: 'Troy Flame',
        update: 'Update 21',
        updateTitle: "Update 21: Heaven's Storm",
        rarity: 'Mythic',
        element: 'Fire',
        damageType: 'Magic',
        baseStats: '620 → 837 DMG',
        maxUpgradeDmg: 18900,
        spa: 7.2,
        range: 30,
        limit: 4,
        deployCost: '1,350¥',
        dotType: 'Burn',
        dotMultiplier: 0.25,
        burstMultiplier: 1.28,
        passive: 'Hellfire Wrath: Поджигает врагов (Burn) и отлично сочетается с аурой Phoenix (Mythic Flames).'
      },
      {
        id: 'word-mage-script',
        name: 'Word Mage (Script)',
        baseName: 'Word Mage',
        update: 'Update 21',
        updateTitle: "Update 21: Heaven's Storm",
        rarity: 'Mythic',
        element: 'Light',
        damageType: 'Magic',
        baseStats: '450 → 675 DMG',
        maxUpgradeDmg: 14800,
        spa: 6.5,
        range: 36,
        limit: 3,
        deployCost: '1,100¥',
        dotType: 'None',
        dotMultiplier: 0,
        burstMultiplier: 1.25,
        passive: 'Runic Sealing: Оглушает (Stun) врагов рунами и увеличивает входящий магический урон.'
      },
      {
        id: 'water-goddess-holy',
        name: 'Water Goddess (Holy)',
        baseName: 'Water Goddess',
        update: 'Update 21',
        updateTitle: "Update 21: Heaven's Storm",
        rarity: 'Mythic',
        element: 'Water',
        damageType: 'Magic',
        baseStats: '480 → 648 DMG',
        maxUpgradeDmg: 13500,
        spa: 7.0,
        range: 35,
        limit: 3,
        deployCost: '1,150¥',
        dotType: 'None',
        dotMultiplier: 0,
        burstMultiplier: 1.22,
        passive: 'Sacred Purification: Снимает дебаффы с союзников в радиусе и наносит очищающий урон по области.'
      },
      {
        id: 'crush-ace',
        name: 'Crush (Ace)',
        baseName: 'Crush',
        update: 'Update 21',
        updateTitle: "Update 21: Heaven's Storm",
        rarity: 'Mythic',
        element: 'Air',
        damageType: 'Physical',
        baseStats: '150 → 202.5 DMG',
        maxUpgradeDmg: 11200,
        spa: 7.8,
        range: 25,
        limit: 4,
        deployCost: '1,500¥',
        dotType: 'None',
        dotMultiplier: 0,
        burstMultiplier: 1.20,
        passive: 'Gravity Slam: Отбрасывает врагов назад (Knockback) и снижает их сопротивление физическим атакам.'
      }
    ];

    /**
     * =========================================================================
     * 2. КОНФИГУРАЦИЯ БАФФОВ И ТРЕЙТОВ (КРУГЛЫЕ ПЕРЕКЛЮЧАТЕЛИ СВЕРХУ)
     * =========================================================================
     */
    const BUFFS_CONFIG = [
      {
        id: 'erwin',
        short: 'ERW',
        sub: '+100%',
        name: 'Erwin (Max Stack)',
        color: '#facc15',
        desc: '+100% к базовому урону от полного цикла баффов Erwin.'
      },
      {
        id: 'wendy',
        short: 'WND',
        sub: '+60%',
        name: 'Wendy (Buff)',
        color: '#38bdf8',
        desc: '+60% к урону от баффа Wendy (складывается с Erwin).'
      },
      {
        id: 'oshy',
        short: 'OSH',
        sub: '+25%',
        name: 'Oshy / Idol',
        color: '#f472b6',
        desc: '+25% глобального урона от пассивной ауры Idol.'
      },
      {
        id: 'unique',
        short: 'UNQ',
        sub: 'x4 DMG',
        name: 'Unique Trait',
        color: '#fb923c',
        desc: '+300% DMG (итого x4 урон), -10% SPA, но принудительно снижает лимит размещения юнита до 1.'
      },
      {
        id: 'golden',
        short: 'GLD',
        sub: '+50%',
        name: 'Golden Trait',
        color: '#fde047',
        desc: '+50% DMG, -10% SPA без ограничения лимита размещения (выгодно для юнитов с лимитом 3–4).'
      },
      {
        id: 'divine',
        short: 'DIV',
        sub: '+20%',
        name: 'Divine Trait',
        color: '#c084fc',
        desc: '+20% DMG, -10% SPA, +10% Range без ограничения лимита.'
      },
      {
        id: 'phoenixBurn',
        short: 'PHX',
        sub: '+300%',
        name: 'Phoenix Burn Synergy',
        color: '#f87171',
        desc: 'Усиливает урон от горения (Burn DoT) на +300% для всех огненных юнитов.'
      },
      {
        id: 'lvl110',
        short: '110',
        sub: 'LVL',
        name: 'Level 110 Scaling',
        color: '#60a5fa',
        desc: 'Масштабирует статы от Level 1 до максимального Level 110 (множитель x2.65).'
      }
    ];

    const TRAITS_REFERENCE = [
      { name: 'Unique', chance: '0.1%', tier: 'S+', stats: '+300% DMG (x4), -10% SPA, +10% Range, Placement Limit = 1' },
      { name: 'Golden', chance: '0.15%', tier: 'S', stats: '+50% DMG, -10% SPA, +25% Yen (Сохраняет лимит x3/x4)' },
      { name: 'Divine', chance: '0.2%', tier: 'S', stats: '+20% DMG, -10% SPA, +10% Range' },
      { name: 'Celestial', chance: '0.35%', tier: 'A', stats: '+15% DMG, -7.5% SPA, +10% Range' },
      { name: 'Reaper', chance: '0.8%', tier: 'A', stats: '+12.5% DMG, -6% SPA' }
    ];

    // =========================================================================
    // 3. СОСТОЯНИЕ ПРИЛОЖЕНИЯ
    // =========================================================================
    let state = {
      activeTab: 'tierlist',
      selectedUpdate: 'All',
      searchQuery: '',
      dpsMode: 'avg', // 'avg' | 'max'
      buffs: {
        erwin: true,
        wendy: true,
        oshy: false,
        unique: true,
        golden: false,
        divine: false,
        phoenixBurn: true,
        lvl110: true
      }
    };

    // =========================================================================
    // 4. МАТЕМАТИКА РАСЧЕТА DPS
    // =========================================================================
    function calculateUnitStats(unit, customBuffs = state.buffs) {
      // 1. Масштаб уровня (Lvl 1 = 1.0, Lvl 110 = 2.65)
      const levelMult = customBuffs.lvl110 ? 2.65 : 1.0;

      // 2. Множитель урона от саппортов и трейтов
      let dmgBonus = 0;
      if (customBuffs.erwin) dmgBonus += 1.00;  // +100%
      if (customBuffs.wendy) dmgBonus += 0.60;  // +60%
      if (customBuffs.oshy) dmgBonus += 0.25;   // +25%
      if (customBuffs.unique) dmgBonus += 3.00; // +300% (x4 total)
      if (customBuffs.golden) dmgBonus += 0.50; // +50%
      if (customBuffs.divine) dmgBonus += 0.20; // +20%

      const totalDmgMult = levelMult * (1 + dmgBonus);

      // 3. Снижение SPA от трейтов (-10% за активный топ-трейт)
      let spaMult = 1.0;
      if (customBuffs.unique || customBuffs.golden || customBuffs.divine) {
        spaMult = 0.90;
      }
      const effectiveSpa = unit.spa * spaMult;

      // 4. Лимит размещения (если включен Unique, лимит принудительно = 1)
      const effectiveLimit = customBuffs.unique ? 1 : unit.limit;

      // 5. Прямой урон за удар и базовый DPS всех копий
      const hitDmg = unit.maxUpgradeDmg * totalDmgMult;
      const directDps = (hitDmg / effectiveSpa) * effectiveLimit;

      // 6. Расчет DoT (Burn / Bleed / Shock)
      let dotRatio = unit.dotMultiplier || 0;
      if (unit.dotType === 'Burn' && customBuffs.phoenixBurn) {
        dotRatio *= 4.0; // +300% к урону от горения (итого x4 от базового Burn)
      }
      const dotDps = directDps * dotRatio;

      // 7. Итоговый Average DPS и Max DPS
      const avgDps = directDps + dotDps;
      const maxDps = avgDps * (unit.burstMultiplier || 1.25);

      // Чистый базовый DPS (без баффов, на Lvl 1, со стандартным лимитом) для расчета % прироста
      const rawBaseDps = ((unit.maxUpgradeDmg / unit.spa) * unit.limit) * (1 + (unit.dotMultiplier || 0));
      const boostPercent = Math.round(((avgDps - rawBaseDps) / rawBaseDps) * 100);

      return {
        avgDps,
        maxDps,
        effectiveLimit,
        effectiveSpa: effectiveSpa.toFixed(2),
        boostPercent
      };
    }

    // Форматирование чисел (1.45M / 420.5K)
    function formatNumber(num) {
      if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
      if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
      return Math.round(num).toString();
    }

    // Бейдж стихии
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
    // 5. РЕНДЕРИНГ ИНТЕРФЕЙСА
    // =========================================================================
    function renderUpdateFilters() {
      const updates = ['All', ...new Set(UNITS_DATA.map(u => u.update))];
      const container = document.getElementById('update-filters');
      container.innerHTML = updates.map(upd => {
        const isActive = state.selectedUpdate === upd;
        const label = upd === 'All' ? 'Все обновления' : upd;
        return `
          <button
            onclick="selectUpdate('${upd}')"
            class="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              isActive
                ? 'bg-indigo-500/25 text-indigo-200 border-indigo-400/60 shadow-sm'
                : 'bg-[#090b1d] text-slate-400 hover:text-slate-200 border-indigo-500/20'
            }"
          >
            ${label}
          </button>
        `;
      }).join('');
    }

    function renderBuffButtons() {
      const container = document.getElementById('buffs-container');
      container.innerHTML = BUFFS_CONFIG.map(b => {
        const isOn = state.buffs[b.id];
        return `
          <button
            onclick="toggleBuff('${b.id}')"
            title="${b.name}: ${b.desc}"
            class="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center transition-all duration-150 border-2 ${
              isOn
                ? 'bg-[#1b214d] border-sky-400/80 shadow-[0_0_14px_rgba(56,189,248,0.3)] scale-100'
                : 'bg-[#0c0e24] border-slate-700/70 opacity-60 hover:opacity-90 scale-95'
            }"
          >
            <span class="text-xs sm:text-sm font-black tracking-tighter" style="color: ${isOn ? b.color : '#64748b'}">
              ${b.short}
            </span>
            <span class="text-[9px] font-bold text-slate-400 leading-none mt-0.5">
              ${b.sub}
            </span>
            ${!isOn ? '<span class="buff-slash"></span>' : ''}
          </button>
        `;
      }).join('');

      const warning = document.getElementById('unique-warning');
      if (state.buffs.unique) {
        warning.classList.remove('hidden');
      } else {
        warning.classList.add('hidden');
      }
    }

    function getFilteredUnits() {
      return UNITS_DATA.filter(u => {
        const matchUpd = state.selectedUpdate === 'All' || u.update === state.selectedUpdate;
        const q = state.searchQuery.toLowerCase();
        const matchSearch = u.name.toLowerCase().includes(q) || u.element.toLowerCase().includes(q);
        return matchUpd && matchSearch;
      });
    }

    function renderTierList() {
      const units = getFilteredUnits().map(u => ({
        ...u,
        calc: calculateUnitStats(u)
      }));

      // Сортировка по выбранному режиму (Average или Max DPS)
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

        return `
          <div onclick="openModal('${u.id}')" class="group cursor-pointer flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-2.5 rounded-xl bg-[#181c40]/90 hover:bg-[#202554] border border-indigo-500/20 hover:border-amber-400/50 transition-all">
            <!-- Левая часть -->
            <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs sm:text-sm font-black border ${rankStyle}">
                ${rank}
              </span>
              <span class="text-sm flex-shrink-0" title="${u.rarity}">${rarityIcon}</span>
              <div class="truncate">
                <div class="flex items-center gap-2">
                  <span class="text-xs sm:text-sm font-bold truncate group-hover:underline ${nameColor}">
                    ${u.name}
                  </span>
                  <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    x${u.calc.effectiveLimit}
                  </span>
                </div>
                <div class="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                  <span>${u.element}</span>
                  <span>•</span>
                  <span>${u.update}</span>
                  ${u.dotType !== 'None' ? `<span class="hidden sm:inline text-orange-300/80">• ${u.dotType}</span>` : ''}
                </div>
              </div>
            </div>

            <!-- Правая часть: прирост и DPS -->
            <div class="flex items-center gap-3 sm:gap-5 flex-shrink-0">
              <div class="text-right hidden xs:block">
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
      const units = getFilteredUnits();
      const container = document.getElementById('units-grid');

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
              <h3 class="text-base font-extrabold text-white">${u.name}</h3>
              <p class="text-xs text-slate-300/80 mt-1 line-clamp-2">${u.passive}</p>
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

    function renderTraitsReference() {
      document.getElementById('traits-table').innerHTML = TRAITS_REFERENCE.map(t => `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[#0b0d24] border border-indigo-500/20">
          <div class="flex items-center gap-3">
            <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/40">${t.tier}</span>
            <div>
              <div class="text-sm font-bold text-white">${t.name}</div>
              <div class="text-xs text-slate-400">${t.stats}</div>
            </div>
          </div>
          <span class="text-xs font-mono text-sky-300 bg-sky-500/10 px-2.5 py-1 rounded-lg self-start sm:self-center">Шанс: ${t.chance}</span>
        </div>
      `).join('');

      document.getElementById('buffs-reference').innerHTML = BUFFS_CONFIG.map(b => `
        <div class="p-3 rounded-xl bg-[#0b0d24] border border-indigo-500/20">
          <div class="flex items-center justify-between mb-1">
            <span class="text-sm font-bold" style="color: ${b.color}">${b.name}</span>
            <span class="text-xs font-extrabold text-emerald-400">${b.sub}</span>
          </div>
          <p class="text-xs text-slate-400">${b.desc}</p>
        </div>
      `).join('');
    }

    // =========================================================================
    // 6. ОБРАБОТЧИКИ СОБЫТИЙ И МОДАЛЬНОЕ ОКНО
    // =========================================================================
    function toggleBuff(id) {
      state.buffs[id] = !state.buffs[id];
      // Взаимоисключение для взаимозаменяемых трейтов (Unique / Golden / Divine)
      if (state.buffs[id] && ['unique', 'golden', 'divine'].includes(id)) {
        ['unique', 'golden', 'divine'].forEach(t => {
          if (t !== id) state.buffs[t] = false;
        });
      }
      renderBuffButtons();
      renderTierList();
    }

    function setAllBuffs(val) {
      BUFFS_CONFIG.forEach(b => {
        state.buffs[b.id] = val;
      });
      // Если включаем всё, оставляем только сильнейший трейт (Unique), чтобы не стакались 3 трейта сразу
      if (val) {
        state.buffs.golden = false;
        state.buffs.divine = false;
      }
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

    function handleSearch(val) {
      state.searchQuery = val;
      renderTierList();
      renderUnitsDatabase();
    }

    function switchTab(tab) {
      state.activeTab = tab;
      ['tierlist', 'units', 'traits'].forEach(t => {
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

      document.getElementById('modal-content').innerHTML = `
        <div class="flex flex-wrap items-center gap-2 mb-2">
          <span class="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded border ${badgeColor}">${u.rarity}</span>
          ${getElementBadge(u.element)}
          <span class="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">${u.updateTitle}</span>
        </div>
        <h2 class="text-xl font-black text-white">${u.name}</h2>
        <p class="text-xs text-slate-400 mt-0.5 mb-4">Тип урона: ${u.damageType} • Стоимость постановки: ${u.deployCost}</p>

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
            <div class="text-xs font-bold text-sky-300 mt-0.5">${u.spa}s / ${u.range}</div>
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

    // Инициализация при загрузке
    renderUpdateFilters();
    renderBuffButtons();
    renderTierList();
    renderUnitsDatabase();
    renderTraitsReference();
  </script>
</body>
</html>
