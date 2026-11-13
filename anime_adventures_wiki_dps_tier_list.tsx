import React, { useState, useMemo } from 'react';
import { 
  Search, Shield, Zap, Flame, Droplets, Sun, Moon, Swords, 
  Sparkles, Info, X, Award, TrendingUp, TrendingDown, Minus,
  Sliders, BookOpen, Crown, Gem, Layers, ChevronRight
} from 'lucide-react';

// ============================================================================
// 1. БАЗА ДАННЫХ ЮНИТОВ (Легко редактировать и пополнять новыми персонажами)
// ============================================================================
const UNITS_DATA = [
  {
    id: 'enel-storm',
    name: 'Enel + 4 Storm Units (1 target)',
    shortName: 'Enel (Full Storm)',
    rarity: 'Secret',
    element: 'Storm',
    role: 'Hybrid / Boss Killer',
    placement: 1,
    baseAvgDps: 4.15, // в миллионах (без баффов)
    baseMaxDps: 4.98,
    lvl110Mult: 1.25,
    stats: { dmg: '485,000', spa: '5.2s', range: '42', cost: '68,500¥' },
    passive: 'Получает +25% урона за каждого Storm-юнита на поле (до 4). При полной зарядке наносит сокрушительный урон по одиночной цели.',
    evolution: 'Enel -> Enel (Kami) [Требуется: 3x Lightning Drum, 25x Star Fruit]',
    affectedBy: ['erwin', 'wendy', 'leafy', 'oshy', 'stormBoost', 'unique', 'relic', 'lvl110']
  },
  {
    id: 'vegeta',
    name: 'Vegeta',
    shortName: 'Vegeta (Ultra)',
    rarity: 'Secret',
    element: 'Dark',
    role: 'Ground / Nuker',
    placement: 3,
    baseAvgDps: 2.65,
    baseMaxDps: 3.16,
    lvl110Mult: 1.25,
    stats: { dmg: '320,000', spa: '4.8s', range: '36', cost: '54,000¥' },
    passive: 'Pride of the Prince: Чем меньше HP у босса или чем дольше юнит на поле, тем выше критический множитель атаки.',
    evolution: 'Vegeta -> Vegeta (Majin / Ego) [Требуется: Royal Crest]',
    affectedBy: ['erwin', 'wendy', 'leafy', 'oshy', 'unique', 'relic', 'lvl110']
  },
  {
    id: 'enel-alone',
    name: 'Enel alone (1 target)',
    shortName: 'Enel (Solo)',
    rarity: 'Secret',
    element: 'Storm',
    role: 'Hybrid / DPS',
    placement: 1,
    baseAvgDps: 2.08,
    baseMaxDps: 2.50,
    lvl110Mult: 1.25,
    stats: { dmg: '245,000', spa: '5.2s', range: '42', cost: '68,500¥' },
    passive: 'Базовая форма Kami без дополнительных союзников стихии Storm в команде.',
    evolution: 'Enel -> Enel (Kami)',
    affectedBy: ['erwin', 'wendy', 'leafy', 'oshy', 'unique', 'relic', 'lvl110']
  },
  {
    id: 'tengen',
    name: 'Tengen (Bead every hit)',
    shortName: 'Tengen Uzui',
    rarity: 'Secret',
    element: 'Fire',
    role: 'Ground / AoE Circle',
    placement: 3,
    baseAvgDps: 1.91,
    baseMaxDps: 2.35,
    lvl110Mult: 1.25,
    stats: { dmg: '215,000', spa: '4.5s', range: '34', cost: '49,200¥' },
    passive: 'Musical Score: Каждая атака детонирует звуковые бомбы, добавляя +40% взрывного урона по области.',
    evolution: 'Tengen -> Tengen (Flashiness)',
    affectedBy: ['erwin', 'wendy', 'leafy', 'oshy', 'unique', 'relic', 'lvl110']
  },
  {
    id: 'mahoraga',
    name: 'Mahoraga BOSS',
    shortName: 'Mahoraga',
    rarity: 'Secret',
    element: 'Physical',
    role: 'Ground / Adapt',
    placement: 1,
    baseAvgDps: 1.85,
    baseMaxDps: 2.11,
    lvl110Mult: 1.22,
    stats: { dmg: '510,000', spa: '7.1s', range: '38', cost: '75,000¥' },
    passive: 'Eight-Handled Sword: Адаптируется к типу брони врагов, игнорируя 60% сопротивления урону.',
    evolution: 'Босс-юнит (Выпадает с шансом 0.5% в Shibuya Incident)',
    affectedBy: ['erwin', 'wendy', 'oshy', 'unique', 'relic', 'lvl110']
  },
  {
    id: 'alucard',
    name: 'Alucard',
    shortName: 'Alucard (Release 0)',
    rarity: 'Secret',
    element: 'Dark',
    role: 'Hybrid / Bleed',
    placement: 3,
    baseAvgDps: 1.52,
    baseMaxDps: 1.82,
    lvl110Mult: 1.25,
    stats: { dmg: '188,000', spa: '5.0s', range: '40', cost: '52,000¥' },
    passive: 'Crimson King: Накладывает сильное кровотечение (Bleed) и увеличивает урон всех Dark-юнитов в радиусе на 15%.',
    evolution: 'Alucard -> Alucard (Vampire King)',
    affectedBy: ['erwin', 'wendy', 'leafy', 'oshy', 'unique', 'relic', 'lvl110']
  },
  {
    id: 'osaragi',
    name: 'Osaragi x4',
    shortName: 'Osaragi (4x Stack)',
    rarity: 'Mythical',
    element: 'Physical',
    role: 'Ground / Cone AoE',
    placement: 4,
    baseAvgDps: 1.18,
    baseMaxDps: 1.33,
    lvl110Mult: 1.22,
    stats: { dmg: '98,000 (x4)', spa: '4.1s', range: '30', cost: '36,000¥' },
    passive: 'Циркулярная пила наносит множественные удары по конусу. Суммарный DPS указан за все 4 копии на поле.',
    evolution: 'Osaragi -> Osaragi (Order)',
    affectedBy: ['erwin', 'wendy', 'oshy', 'relic', 'lvl110'] // x4 обычно без Unique
  },
  {
    id: 'kagurabachi',
    name: 'Kagurabachi',
    shortName: 'Chihiro (Enten)',
    rarity: 'Secret',
    element: 'Water',
    role: 'Ground / Line AoE',
    placement: 3,
    baseAvgDps: 1.12,
    baseMaxDps: 1.29,
    lvl110Mult: 1.25,
    stats: { dmg: '165,000', spa: '4.6s', range: '37', cost: '46,500¥' },
    passive: 'Kuro & Nishiki: Чередует дальние режущие волны с ускорением скорости атаки на 20%.',
    evolution: 'Chihiro -> Kagurabachi (Black Blade)',
    affectedBy: ['erwin', 'wendy', 'leafy', 'oshy', 'unique', 'relic', 'lvl110']
  },
  {
    id: 'nagumo',
    name: 'Nagumo',
    shortName: 'Nagumo Yoichi',
    rarity: 'Secret',
    element: 'Physical',
    role: 'Hybrid / Multi-Weapon',
    placement: 3,
    baseAvgDps: 1.05,
    baseMaxDps: 1.27,
    lvl110Mult: 1.25,
    stats: { dmg: '154,000', spa: '4.4s', range: '35', cost: '44,000¥' },
    passive: 'Dice Roll: Случайным образом выбирает одно из 6 оружий при атаке, давая бонус к криту или пробитию.',
    evolution: 'Nagumo -> Nagumo (Master of Disguise)',
    affectedBy: ['erwin', 'wendy', 'oshy', 'unique', 'relic', 'lvl110']
  },
  {
    id: 'aizen',
    name: 'Aizen',
    shortName: 'Aizen (Hogyoku)',
    rarity: 'Secret',
    element: 'Dark',
    role: 'Hybrid / Full AoE',
    placement: 2,
    baseAvgDps: 0.98,
    baseMaxDps: 1.18,
    lvl110Mult: 1.25,
    stats: { dmg: '210,000', spa: '6.2s', range: '46', cost: '64,000¥' },
    passive: 'Kyoka Suigetsu: Огромный Full AoE радиус и замедление всех врагов в зоне действия ауры.',
    evolution: 'Aizen -> Aizen (Transcendent)',
    affectedBy: ['erwin', 'wendy', 'leafy', 'oshy', 'unique', 'relic', 'lvl110']
  },
  {
    id: 'sasuke',
    name: 'Sasuke',
    shortName: 'Sasuke (Rinnegan)',
    rarity: 'Secret',
    element: 'Storm',
    role: 'Hybrid / Burn + Stun',
    placement: 3,
    baseAvgDps: 0.95,
    baseMaxDps: 1.45,
    lvl110Mult: 1.25,
    stats: { dmg: '148,000', spa: '4.9s', range: '39', cost: '48,000¥' },
    passive: 'Amaterasu & Indra Arrow: Накладывает вечное черное пламя и наносит огромный пиковый урон способностью.',
    evolution: 'Sasuke -> Sasuke (Shadow Hokage)',
    affectedBy: ['erwin', 'wendy', 'leafy', 'oshy', 'stormBoost', 'unique', 'relic', 'lvl110']
  },
  {
    id: 'rukia',
    name: 'Rukia',
    shortName: 'Rukia (Bankai)',
    rarity: 'Secret',
    element: 'Water',
    role: 'Ground / Freeze',
    placement: 3,
    baseAvgDps: 0.92,
    baseMaxDps: 2.62,
    lvl110Mult: 1.25,
    stats: { dmg: '135,000', spa: '5.5s', range: '36', cost: '47,500¥' },
    passive: 'Hakka no Togame: Замораживает всех врагов на карте при активации Bankai, утраивая урон по замороженным целям.',
    evolution: 'Rukia -> Rukia (Absolute Zero)',
    affectedBy: ['erwin', 'wendy', 'leafy', 'oshy', 'unique', 'relic', 'lvl110']
  },
  {
    id: 'gas',
    name: 'Gas x4',
    shortName: 'Gas (Heeter 4x)',
    rarity: 'Mythical',
    element: 'Light',
    role: 'Hybrid / Summon',
    placement: 4,
    baseAvgDps: 0.89,
    baseMaxDps: 1.75,
    lvl110Mult: 1.22,
    stats: { dmg: '84,000 (x4)', spa: '4.7s', range: '35', cost: '39,000¥' },
    passive: 'Awakened Instinct: Создает энергетическое оружие; при 4 копиях создает непрерывный шквал атак.',
    evolution: 'Gas -> Gas (Unleashed)',
    affectedBy: ['erwin', 'wendy', 'leafy', 'oshy', 'relic', 'lvl110']
  }
];

// ============================================================================
// 2. КОНФИГУРАЦИЯ БАФФОВ (Круглые иконки сверху как на скриншоте)
// ============================================================================
const BUFFS_CONFIG = [
  { id: 'erwin', name: 'Erwin (100%)', short: 'ERW', mult: 1.35, color: '#eab308', desc: '+35% эффективного DMG от цикла баффов Erwin' },
  { id: 'wendy', name: 'Wendy (100%)', short: 'WND', mult: 1.25, color: '#38bdf8', desc: '+25% DMG / Buff от цикла баффов Wendy' },
  { id: 'leafy', name: 'Leafy (Magic)', short: 'LFY', mult: 1.15, color: '#4ade80', desc: '+15% бонус к магическим / элементальным атакам' },
  { id: 'oshy', name: 'Oshy (Idol)', short: 'OSH', mult: 1.20, color: '#f472b6', desc: '+20% глобальный бафф урона и скидка на апгрейды' },
  { id: 'stormBoost', name: 'Storm Synergy', short: 'STM', mult: 1.22, color: '#a855f7', desc: '+22% синергия стихии Storm для электро-юнитов' },
  { id: 'unique', name: 'Unique Trait', short: 'UNQ', mult: 1.65, color: '#f97316', desc: 'Трейт Unique (+200% DMG, лимит 1 юнит — учтен баланс для x3/x4)' },
  { id: 'relic', name: 'Max Relic', short: 'RLC', mult: 1.18, color: '#ef4444', desc: '+18% урона от прокачанной реликвии (Star/Orb)' },
  { id: 'lvl110', name: 'Level 110', short: '110', mult: 1.25, color: '#3b82f6', desc: 'Максимальный 110 уровень персонажа (+25% к базовым статам)' }
];

// ============================================================================
// 3. СПРАВОЧНЫЕ ДАННЫЕ ДЛЯ ДРУГИХ РАЗДЕЛОВ ВИКИ
// ============================================================================
const TRAITS_DATA = [
  { name: 'Unique', chance: '0.1%', effect: '+200% DMG, -10% SPA, +10% Range (Лимит размещения: 1)', tier: 'S+' },
  { name: 'Golden', chance: '0.15%', effect: '+50% DMG, +25% Yen (Отлично для ферм и x3/x4 юнитов)', tier: 'S' },
  { name: 'Divine', chance: '0.2%', effect: '+40% DMG, -15% SPA, +15% Range', tier: 'S' },
  { name: 'Celestial', chance: '0.35%', effect: '+30% DMG, -10% SPA, +10% Range', tier: 'A' },
  { name: 'Reaper', chance: '0.8%', effect: '+25% DMG, -12% SPA', tier: 'A' },
  { name: 'Godspeed', chance: '1.2%', effect: '-20% SPA (Ускорение перезарядки)', tier: 'B' },
];

const RELICS_DATA = [
  { name: 'Star Remnant', bonus: '+18% Elemental DMG', source: 'Рейды / Лимитированные ивенты', bestFor: 'Enel, Sasuke, Rukia' },
  { name: 'Crimson Orb', bonus: '+15% Crit DMG & +10% Crit Chance', source: 'Infinite Castle / Tower', bestFor: 'Vegeta, Nagumo' },
  { name: 'Demon Blade', bonus: '+20% Boss Damage', source: 'Shibuya Raid Shop', bestFor: 'Mahoraga, Tengen' },
  { name: 'Cost Orb', bonus: '-15% Upgrade Cost', source: 'Испытания (Challenges)', bestFor: 'Орочимару / Саппорты' },
];

// Вспомогательная функция для иконки стихии
const ElementBadge = ({ element }) => {
  const styles = {
    Storm: { bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40', icon: <Zap className="w-3.5 h-3.5" /> },
    Fire: { bg: 'bg-orange-500/20 text-orange-300 border-orange-500/40', icon: <Flame className="w-3.5 h-3.5" /> },
    Water: { bg: 'bg-sky-500/20 text-sky-300 border-sky-500/40', icon: <Droplets className="w-3.5 h-3.5" /> },
    Dark: { bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40', icon: <Moon className="w-3.5 h-3.5" /> },
    Light: { bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: <Sun className="w-3.5 h-3.5" /> },
    Physical: { bg: 'bg-slate-500/20 text-slate-300 border-slate-500/40', icon: <Swords className="w-3.5 h-3.5" /> },
  };
  const current = styles[element] || styles.Physical;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${current.bg}`}>
      {current.icon}
      {element}
    </span>
  );
};

// ============================================================================
// 4. ГЛАВНЫЙ КОМПОНЕНТ ПРИЛОЖЕНИЯ
// ============================================================================
export default function App() {
  const [activeTab, setActiveTab] = useState('tierlist'); // 'tierlist' | 'units' | 'traits' | 'relics'
  const [dpsMode, setDpsMode] = useState('avg'); // 'avg' | 'max'
  
  // Состояние активных баффов (по умолчанию включены основные, как на скриншоте)
  const [activeBuffs, setActiveBuffs] = useState({
    erwin: true,
    wendy: true,
    leafy: true,
    oshy: false,
    stormBoost: true,
    unique: true,
    relic: true,
    lvl110: true,
  });

  // Состояния фильтров для раздела "Все юниты"
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedElement, setSelectedElement] = useState('All');
  const [selectedRarity, setSelectedRarity] = useState('All');

  // Модальное окно с подробностями юнита
  const [selectedUnit, setSelectedUnit] = useState(null);

  // Переключение отдельного баффа
  const toggleBuff = (id) => {
    setActiveBuffs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Кнопки "All off" и "All on"
  const setAllBuffs = (state) => {
    const updated = {};
    BUFFS_CONFIG.forEach((b) => {
      updated[b.id] = state;
    });
    setActiveBuffs(updated);
  };

  // Динамический расчет DPS и сортировка тир-листа в реальном времени
  const rankedUnits = useMemo(() => {
    // 1. Считаем эталонный рейтинг (при всех включенных баффах) для отображения дельты позиций
    const calculateUnitDps = (unit, buffsState) => {
      let avg = unit.baseAvgDps;
      let max = unit.baseMaxDps;

      BUFFS_CONFIG.forEach((buff) => {
        if (buffsState[buff.id] && unit.affectedBy.includes(buff.id)) {
          const factor = buff.id === 'lvl110' ? unit.lvl110Mult : buff.mult;
          avg *= factor;
          max *= factor;
        }
      });

      return { avg, max };
    };

    const allOnState = BUFFS_CONFIG.reduce((acc, b) => ({ ...acc, [b.id]: true }), {});
    const baselineSorted = [...UNITS_DATA]
      .map((u) => ({ id: u.id, val: calculateUnitDps(u, allOnState)[dpsMode] }))
      .sort((a, b) => b.val - a.val);

    const baselineRankMap = {};
    baselineSorted.forEach((item, idx) => {
      baselineRankMap[item.id] = idx + 1;
    });

    // 2. Считаем текущий DPS с выбранными пользователем баффами
    const computed = UNITS_DATA.map((unit) => {
      const { avg, max } = calculateUnitDps(unit, activeBuffs);
      const baseVal = dpsMode === 'avg' ? unit.baseAvgDps : unit.baseMaxDps;
      const currentVal = dpsMode === 'avg' ? avg : max;
      const bonusPercent = Math.round(((currentVal - baseVal) / baseVal) * 100);

      return {
        ...unit,
        computedAvg: avg,
        computedMax: max,
        activeDps: currentVal,
        bonusPercent,
      };
    });

    // Сортируем по убыванию активного DPS
    computed.sort((a, b) => b.activeDps - a.activeDps);

    // Добавляем текущее место и разницу позиций
    return computed.map((unit, index) => {
      const currentRank = index + 1;
      const baseRank = baselineRankMap[unit.id];
      const rankDiff = baseRank - currentRank; // положительное = поднялся выше
      return {
        ...unit,
        rank: currentRank,
        rankDiff,
      };
    });
  }, [activeBuffs, dpsMode]);

  // Фильтрация списка юнитов для вкладки "Все юниты"
  const filteredUnits = useMemo(() => {
    return UNITS_DATA.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.shortName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesElement = selectedElement === 'All' || u.element === selectedElement;
      const matchesRarity = selectedRarity === 'All' || u.rarity === selectedRarity;
      return matchesSearch && matchesElement && matchesRarity;
    });
  }, [searchQuery, selectedElement, selectedRarity]);

  // Форматирование цифр DPS (например, 19.83M)
  const formatDps = (num) => {
    if (num >= 1) return `${num.toFixed(2)}M`;
    return `${Math.round(num * 1000)}K`;
  };

  return (
    <div className="min-h-screen bg-[#0b0c1e] text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200 pb-16">
      {/* Декоративное фоновое свечение */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* ===================================================================== */}
      {/* ШАПКА САЙТА И НАВИГАЦИЯ ПО ОТДЕЛАМ ВИКИ                               */}
      {/* ===================================================================== */}
      <header className="sticky top-0 z-30 bg-[#0f1129]/90 backdrop-blur-md border-b border-indigo-500/20 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Логотип */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-purple-600 p-0.5 shadow-md shadow-amber-500/20">
              <div className="w-full h-full bg-[#131533] rounded-[10px] flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent">
                  AA WIKI & DPS HUB
                </h1>
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                  Fan Project
                </span>
              </div>
              <p className="text-xs text-slate-400">Anime Adventures • База юнитов и калькулятор урона</p>
            </div>
          </div>

          {/* Навигация по разделам */}
          <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {[
              { id: 'tierlist', label: 'DPS Тир-лист', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'units', label: 'Все юниты', icon: <Layers className="w-4 h-4" /> },
              { id: 'traits', label: 'Трейты и Баффы', icon: <Sparkles className="w-4 h-4" /> },
              { id: 'relics', label: 'Реликвии', icon: <Gem className="w-4 h-4" /> },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-400/50 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* ОСНОВНОЙ КОНТЕНТ                                                      */}
      {/* ===================================================================== */}
      <main className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 pt-6">
        
        {/* ------------------------------------------------------------------- */}
        {/* ВКЛАДКА 1: ИНТЕРАКТИВНЫЙ DPS ТИР-ЛИСТ (КАК НА СКРИНШОТЕ)            */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'tierlist' && (
          <div className="bg-[#141736]/95 border border-indigo-500/25 rounded-2xl p-4 sm:p-6 shadow-2xl">
            {/* Заголовок панели баффов */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <p className="text-xs sm:text-sm font-medium text-slate-300">
                Учитываемые баффы <span className="text-slate-400">(нажми, чтобы выключить; «110» — уровень 110):</span>
              </p>
              <span className="text-[11px] text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full self-start">
                Кликни на юнита для подробных статов
              </span>
            </div>

            {/* Ряд круглых иконок баффов (как на скрине) */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-4">
              {BUFFS_CONFIG.map((buff) => {
                const isOn = activeBuffs[buff.id];
                return (
                  <button
                    key={buff.id}
                    onClick={() => toggleBuff(buff.id)}
                    title={`${buff.name}: ${buff.desc}`}
                    className={`group relative w-12 h-12 sm:w-13 sm:h-13 rounded-full flex flex-col items-center justify-center transition-all duration-200 border-2 ${
                      isOn
                        ? 'bg-[#1e2452] border-sky-400/80 shadow-[0_0_15px_rgba(56,189,248,0.3)] scale-100'
                        : 'bg-[#10122b] border-slate-700/70 opacity-60 hover:opacity-85 scale-95'
                    }`}
                  >
                    {/* Иконка / короткое название баффа */}
                    <span
                      className="text-xs sm:text-sm font-black tracking-tighter"
                      style={{ color: isOn ? buff.color : '#64748b' }}
                    >
                      {buff.short}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium leading-none mt-0.5">
                      {buff.id === 'lvl110' ? 'LVL' : `x${buff.mult}`}
                    </span>

                    {/* Красная перечеркивающая линия при выключении (как на скриншоте) */}
                    {!isOn && (
                      <span
                        className="absolute inset-0 pointer-events-none flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <span className="w-10 h-[2.5px] bg-red-500 rounded-full -rotate-45 shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Кнопки "All off" и "All on" */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setAllBuffs(false)}
                className="px-3.5 py-1.5 rounded-lg bg-[#0d0f26] hover:bg-red-500/15 text-slate-300 hover:text-red-300 border border-slate-700/80 hover:border-red-500/40 text-xs font-bold transition-colors"
              >
                All off
              </button>
              <button
                onClick={() => setAllBuffs(true)}
                className="px-3.5 py-1.5 rounded-lg bg-[#0d0f26] hover:bg-emerald-500/15 text-slate-300 hover:text-emerald-300 border border-slate-700/80 hover:border-emerald-500/40 text-xs font-bold transition-colors"
              >
                All on
              </button>
            </div>

            {/* Переключатель Average DPS / Max DPS */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#0d0f26] rounded-xl border border-indigo-500/20 mb-4">
              <button
                onClick={() => setDpsMode('avg')}
                className={`py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  dpsMode === 'avg'
                    ? 'bg-[#1b1f47] text-amber-300 border border-amber-400/70 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                Average DPS
              </button>
              <button
                onClick={() => setDpsMode('max')}
                className={`py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  dpsMode === 'max'
                    ? 'bg-[#1b1f47] text-amber-300 border border-amber-400/70 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                Max DPS
              </button>
            </div>

            {/* Список юнитов в рейтинге */}
            <div className="space-y-2">
              {rankedUnits.map((unit) => {
                // Стили бейджа позиции (Золото, Серебро, Бронза для топ-3)
                let rankBadgeStyle = 'bg-[#222754] text-slate-300 border-indigo-500/30';
                if (unit.rank === 1) rankBadgeStyle = 'bg-amber-400 text-slate-950 border-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.5)]';
                if (unit.rank === 2) rankBadgeStyle = 'bg-slate-200 text-slate-900 border-white shadow-[0_0_10px_rgba(226,232,240,0.4)]';
                if (unit.rank === 3) rankBadgeStyle = 'bg-amber-700 text-amber-100 border-amber-500 shadow-[0_0_10px_rgba(180,83,9,0.4)]';

                return (
                  <div
                    key={unit.id}
                    onClick={() => setSelectedUnit(unit)}
                    className="group cursor-pointer flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-2.5 rounded-xl bg-[#191d42]/90 hover:bg-[#212654] border border-indigo-500/20 hover:border-amber-400/50 transition-all duration-200"
                  >
                    {/* Левая часть: Место + Иконка редкости + Имя юнита */}
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <span
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs sm:text-sm font-black border ${rankBadgeStyle}`}
                      >
                        {unit.rank}
                      </span>

                      {/* Бейдж редкости */}
                      <span
                        title={unit.rarity}
                        className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center ${
                          unit.rarity === 'Secret'
                            ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {unit.rarity === 'Secret' ? (
                          <Crown className="w-3.5 h-3.5" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                      </span>

                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs sm:text-sm font-bold truncate group-hover:underline ${
                              unit.rarity === 'Secret' ? 'text-rose-400' : 'text-amber-300'
                            }`}
                          >
                            {unit.name}
                          </span>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                          <span>{unit.element}</span>
                          <span>•</span>
                          <span>{unit.role}</span>
                        </div>
                      </div>
                    </div>

                    {/* Правая часть: Изменение позиции + Цифры DPS */}
                    <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
                      {/* Индикатор сдвига и бонуса баффов */}
                      <div className="text-right hidden xs:block">
                        <div className="flex items-center justify-end gap-0.5 text-[11px] font-bold">
                          {unit.rankDiff > 0 && (
                            <span className="text-emerald-400 flex items-center">
                              ▲{unit.rankDiff}
                            </span>
                          )}
                          {unit.rankDiff < 0 && (
                            <span className="text-rose-400 flex items-center">
                              ▼{Math.abs(unit.rankDiff)}
                            </span>
                          )}
                          {unit.rankDiff === 0 && (
                            <span className="text-slate-500">=</span>
                          )}
                        </div>
                        <div className="text-[10px] font-semibold text-emerald-400/90">
                          +{unit.bonusPercent}%
                        </div>
                      </div>

                      {/* Главные цифры DPS (Зеленый цвет как на скриншоте) */}
                      <div className="text-right min-w-[78px] sm:min-w-[92px]">
                        <div className="text-sm sm:text-base font-black text-[#4ade80] tracking-tight leading-tight">
                          {formatDps(dpsMode === 'avg' ? unit.computedAvg : unit.computedMax)}
                        </div>
                        <div className="text-[10px] sm:text-[11px] font-medium text-slate-400 leading-tight mt-0.5">
                          {dpsMode === 'avg'
                            ? `max ${formatDps(unit.computedMax)}`
                            : `avg ${formatDps(unit.computedAvg)}`}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* ВКЛАДКА 2: БАЗА ВСЕХ ЮНИТОВ С ПОИСКОМ И ФИЛЬТРАМИ                   */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'units' && (
          <div className="space-y-4">
            {/* Панель поиска и фильтров */}
            <div className="bg-[#141736] border border-indigo-500/25 rounded-2xl p-4 flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск юнита (например: Enel, Vegeta, Aizen)..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0d0f26] border border-indigo-500/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <select
                  value={selectedElement}
                  onChange={(e) => setSelectedElement(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#0d0f26] border border-indigo-500/30 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="All">Все стихии</option>
                  <option value="Storm">Storm</option>
                  <option value="Fire">Fire</option>
                  <option value="Water">Water</option>
                  <option value="Dark">Dark</option>
                  <option value="Light">Light</option>
                  <option value="Physical">Physical</option>
                </select>

                <select
                  value={selectedRarity}
                  onChange={(e) => setSelectedRarity(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#0d0f26] border border-indigo-500/30 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="All">Все редкости</option>
                  <option value="Secret">Secret</option>
                  <option value="Mythical">Mythical</option>
                </select>
              </div>
            </div>

            {/* Сетка карточек юнитов */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredUnits.map((unit) => (
                <div
                  key={unit.id}
                  onClick={() => setSelectedUnit(unit)}
                  className="cursor-pointer bg-[#141736] hover:bg-[#1a1e45] border border-indigo-500/25 hover:border-amber-400/50 rounded-2xl p-4 transition-all flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            unit.rarity === 'Secret'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {unit.rarity}
                        </span>
                        <h3 className="text-base font-bold text-white mt-1.5">{unit.shortName}</h3>
                      </div>
                      <ElementBadge element={unit.element} />
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{unit.passive}</p>
                  </div>

                  {/* Мини-статы */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-indigo-500/15 text-center">
                    <div className="bg-[#0d0f26] rounded-lg py-1.5">
                      <div className="text-[10px] text-slate-400">Base DMG</div>
                      <div className="text-xs font-bold text-slate-200">{unit.stats.dmg}</div>
                    </div>
                    <div className="bg-[#0d0f26] rounded-lg py-1.5">
                      <div className="text-[10px] text-slate-400">SPA</div>
                      <div className="text-xs font-bold text-sky-300">{unit.stats.spa}</div>
                    </div>
                    <div className="bg-[#0d0f26] rounded-lg py-1.5">
                      <div className="text-[10px] text-slate-400">Placement</div>
                      <div className="text-xs font-bold text-amber-300">{unit.placement}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* ВКЛАДКА 3: ТРЕЙТЫ И САППОРТ-БАФФЫ                                   */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'traits' && (
          <div className="space-y-6">
            <div className="bg-[#141736] border border-indigo-500/25 rounded-2xl p-5">
              <h2 className="text-lg font-bold text-amber-300 mb-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> Таблица Трейтов (Traits)
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Ключевые пассивные модификаторы, влияющие на итоговый DPS в калькуляторе.
              </p>
              <div className="space-y-2">
                {TRAITS_DATA.map((trait) => (
                  <div
                    key={trait.name}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[#0d0f26] border border-indigo-500/20"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/40">
                        {trait.tier}
                      </span>
                      <div>
                        <div className="text-sm font-bold text-white">{trait.name}</div>
                        <div className="text-xs text-slate-400">{trait.effect}</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-sky-300 bg-sky-500/10 px-2.5 py-1 rounded-lg self-start sm:self-center">
                      Шанс: {trait.chance}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#141736] border border-indigo-500/25 rounded-2xl p-5">
              <h2 className="text-lg font-bold text-sky-300 mb-3 flex items-center gap-2">
                <Sliders className="w-5 h-5" /> Как работают баффы в расчетах
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BUFFS_CONFIG.map((b) => (
                  <div key={b.id} className="p-3 rounded-xl bg-[#0d0f26] border border-indigo-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-white">{b.name}</span>
                      <span className="text-xs font-bold text-emerald-400">x{b.mult}</span>
                    </div>
                    <p className="text-xs text-slate-400">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* ВКЛАДКА 4: РЕЛИКВИИ И ПРЕДМЕТЫ                                      */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'relics' && (
          <div className="bg-[#141736] border border-indigo-500/25 rounded-2xl p-5">
            <h2 className="text-lg font-bold text-purple-300 mb-1 flex items-center gap-2">
              <Gem className="w-5 h-5" /> Реликвии и Снаряжение (Relics & Orbs)
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Экипируемые предметы для усиления персонажей на поздних стадиях игры.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RELICS_DATA.map((relic) => (
                <div
                  key={relic.name}
                  className="p-4 rounded-xl bg-[#0d0f26] border border-indigo-500/20 flex flex-col justify-between gap-2"
                >
                  <div>
                    <h3 className="text-sm font-bold text-amber-300">{relic.name}</h3>
                    <div className="text-xs font-semibold text-emerald-400 mt-1">{relic.bonus}</div>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 space-y-0.5">
                    <div><strong className="text-slate-300">Где получить:</strong> {relic.source}</div>
                    <div><strong className="text-slate-300">Лучше всего для:</strong> {relic.bestFor}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ===================================================================== */}
      {/* МОДАЛЬНОЕ ОКНО ДЕТАЛЬНОЙ КАРТОЧКИ ЮНИТА                              */}
      {/* ===================================================================== */}
      {selectedUnit && (
        <div
          onClick={() => setSelectedUnit(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#15183b] border border-indigo-400/40 rounded-2xl p-5 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
          >
            <button
              onClick={() => setSelectedUnit(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded ${
                  selectedUnit.rarity === 'Secret'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {selectedUnit.rarity}
              </span>
              <ElementBadge element={selectedUnit.element} />
            </div>

            <h2 className="text-xl font-black text-white mb-1">{selectedUnit.name}</h2>
            <p className="text-xs text-slate-400 mb-4">{selectedUnit.role} • Лимит постановки: {selectedUnit.placement}</p>

            {/* Таблица статов */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              <div className="bg-[#0d0f26] p-2.5 rounded-xl border border-indigo-500/20">
                <div className="text-[10px] text-slate-400">Max Upgrade DMG</div>
                <div className="text-xs sm:text-sm font-bold text-white mt-0.5">{selectedUnit.stats.dmg}</div>
              </div>
              <div className="bg-[#0d0f26] p-2.5 rounded-xl border border-indigo-500/20">
                <div className="text-[10px] text-slate-400">SPA (Скорость)</div>
                <div className="text-xs sm:text-sm font-bold text-sky-300 mt-0.5">{selectedUnit.stats.spa}</div>
              </div>
              <div className="bg-[#0d0f26] p-2.5 rounded-xl border border-indigo-500/20">
                <div className="text-[10px] text-slate-400">Range (Радиус)</div>
                <div className="text-xs sm:text-sm font-bold text-amber-300 mt-0.5">{selectedUnit.stats.range}</div>
              </div>
              <div className="bg-[#0d0f26] p-2.5 rounded-xl border border-indigo-500/20">
                <div className="text-[10px] text-slate-400">Полная прокачка</div>
                <div className="text-xs sm:text-sm font-bold text-emerald-400 mt-0.5">{selectedUnit.stats.cost}</div>
              </div>
            </div>

            {/* Пассивная способность и эволюция */}
            <div className="space-y-3 text-xs">
              <div className="bg-[#0d0f26] p-3 rounded-xl border border-indigo-500/20">
                <div className="font-bold text-amber-300 mb-1">Пассивная способность / Особенности:</div>
                <p className="text-slate-300 leading-relaxed">{selectedUnit.passive}</p>
              </div>

              <div className="bg-[#0d0f26] p-3 rounded-xl border border-indigo-500/20">
                <div className="font-bold text-purple-300 mb-1">Путь эволюции / Получение:</div>
                <p className="text-slate-300">{selectedUnit.evolution}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}