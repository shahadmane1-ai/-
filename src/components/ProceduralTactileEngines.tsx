import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Droplets,
  Heart,
  Compass,
  ArrowRight,
  ShieldCheck,
  Scale,
  Smile,
  Volume2,
  RotateCcw,
  Plane,
  AlertTriangle,
  Flame,
  Search,
  BookOpen,
  Clock,
  Calendar,
  Layers,
  ShoppingBag,
  FileText,
  UserCheck,
  Check,
  RefreshCw,
  Award,
  Zap,
  Gift,
  Utensils,
  Briefcase,
  Users,
  MessageSquare,
  Home,
  CheckCircle,
} from 'lucide-react';
import { Language } from '../types';
import { ProceduralEngineType, InternalCatalogueScenario, RAFIC_INTERNAL_CATALOGUE } from '../services/raficInternalCatalogue';
import { playPeaceChime, playSoftTap } from '../utils/audio';

export interface TactileEngineProps {
  scenarioId?: number | string;
  conceptTitle: string;
  conceptTitleEn?: string;
  fiqhSource: string;
  shortGuidance: string;
  shortGuidanceEn?: string;
  interactiveSteps: string[];
  remedialButtonText: string;
  tranquilityDelta: number;
  initialData?: any;
  lang: Language;
  onComplete: (delta: number, label: string) => void;
  hadithReference?: {
    textAr: string;
    sourceAr: string;
  };
  rafiqMessage?: {
    maleAr: string;
    femaleAr: string;
    activeText?: string;
  };
}

/**
 * MASTER KINETIC SCENARIO CANVAS (2.5D SVG)
 * Strictly matches the blueprint viewport art-style:
 * - Rounded dark navy card (#12183F / #0B102B) with subtle ambient glow
 * - Header Badges: Right pill (Scenario Title), Left pill (Accredited Source Tag)
 * - Tactile 2.5D SVG graphic assets with physical actions and zero empty boxes
 * - Clickable pill action buttons directly beneath
 * - Bottom white card with practical rule, empathetic voice, and Sahih hadith
 */
export const MasterKineticScenarioCanvas: React.FC<TactileEngineProps> = ({
  scenarioId,
  conceptTitle,
  conceptTitleEn,
  fiqhSource,
  shortGuidance,
  shortGuidanceEn,
  interactiveSteps,
  remedialButtonText,
  tranquilityDelta = 20,
  initialData,
  lang,
  onComplete,
  hadithReference,
  rafiqMessage,
}) => {
  // Determine numeric ID (1 to 30)
  const numericId: number = (() => {
    if (typeof scenarioId === 'number') return scenarioId;
    if (typeof scenarioId === 'string') {
      const match = scenarioId.match(/\d+/);
      if (match) return parseInt(match[0], 10);
    }
    const found = RAFIC_INTERNAL_CATALOGUE.find(
      (s) => s.conceptTitle === conceptTitle || conceptTitle.includes(s.conceptTitle)
    );
    return found ? found.numericId : 1;
  })();

  // Interactive Kinetic States
  const [activeStep, setActiveStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [flightPosture, setFlightPosture] = useState<'takbeer' | 'ruku' | 'sujud'>('takbeer');
  const [rakahChoice, setRakahChoice] = useState<3 | 4>(3);
  const [saCount, setSaCount] = useState<number>(2.5);
  const [wipedBandage, setWipedBandage] = useState(false);
  const [padlockOpen, setPadlockOpen] = useState(false);
  const [coldWashCount, setColdWashCount] = useState(1);
  const [doubtShieldActive, setDoubtShieldActive] = useState(true);
  const [tayammumDone, setTayammumDone] = useState(false);
  const [actionTriggered, setActionTriggered] = useState(false);

  // Scenario 23 Specific Interactive Verification Lab States
  const [idScanStep, setIdScanStep] = useState<'idle' | 'scanning' | 'scanned' | 'stamped'>('idle');
  const [idName, setIdName] = useState<string>('Alexander');

  // Scenario 17 Contract strike-through state
  const [ribaStruck, setRibaStruck] = useState(false);

  // Scenario 28 Calendar block state
  const [prayerBreakBooked, setPrayerBreakBooked] = useState(false);

  const handleAction = (label?: string) => {
    playPeaceChime();
    setIsCompleted(true);
    setActionTriggered(true);

    if (numericId === 23) {
      setIdScanStep('stamped');
    }

    onComplete(tranquilityDelta, label || conceptTitle);
  };

  return (
    <div className="space-y-4 text-start animate-fade-in select-none">
      {/* 1. VIEWPORT CARD: Rounded dark navy-blue card (#12183F / #0B102B) with ambient glow */}
      <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#12183F] to-[#0B102B] p-5 sm:p-6 text-white overflow-hidden border border-[#D4A373]/30 shadow-2xl">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* HEADER BADGES */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 relative z-10">
          {/* Right Pill: Scenario Title */}
          <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{lang === 'ar' ? conceptTitle : conceptTitleEn || conceptTitle}</span>
          </span>

          {/* Left Pill: Accredited Source Tag */}
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 text-amber-200 border border-amber-400/20 flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-amber-300" />
            <span>{fiqhSource}</span>
          </span>
        </div>

        {/* GRAPHIC ASSETS: Tactile 2.5D SVG Kinetic Viewport */}
        <div className="relative w-full min-h-[220px] sm:min-h-[240px] rounded-2xl bg-black/35 border border-white/10 p-4 flex flex-col items-center justify-center overflow-hidden mb-4">
          {/* SCENARIO 1: Missed First Tashahhud */}
          {numericId === 1 && (
            <svg viewBox="0 0 280 150" className="w-full max-w-xs h-36">
              <ellipse cx="140" cy="130" rx="90" ry="12" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="1" />
              <g className="animate-fade-in">
                <circle cx="150" cy="40" r="14" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
                <path d="M 136 58 Q 150 54 164 58 L 160 115 L 140 115 Z" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2.5" />
                <line x1="145" y1="115" x2="145" y2="132" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="155" y1="115" x2="155" y2="132" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="150" cy="40" r="18" fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="3 3" />
                <text x="150" y="20" fontSize="9" fill="#34D399" fontWeight="bold" textAnchor="middle">الركعة الثالثة (استتمام القيام)</text>
              </g>
              <g transform="translate(60, 45)">
                <rect x="0" y="0" width="55" height="60" rx="8" fill="#EF4444" fillOpacity="0.2" stroke="#EF4444" strokeWidth="2" />
                <text x="27" y="26" fontSize="9" fill="#F87171" fontWeight="bold" textAnchor="middle">لا ترجع</text>
                <text x="27" y="42" fontSize="8" fill="#FCA5A5" textAnchor="middle">للجلوس</text>
                <line x1="8" y1="52" x2="47" y2="8" stroke="#EF4444" strokeWidth="2.5" />
              </g>
            </svg>
          )}

          {/* SCENARIO 2: Doubt in Rak'ah Count */}
          {numericId === 2 && (
            <div className="flex items-center justify-center gap-6 my-auto">
              <div
                onClick={() => {
                  playPeaceChime();
                  setRakahChoice(3);
                }}
                className={`p-4 sm:p-5 rounded-2xl border-2 flex flex-col items-center cursor-pointer transition-all ${
                  rakahChoice === 3
                    ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 shadow-xl scale-105'
                    : 'bg-white/5 border-white/20 text-white/60'
                }`}
              >
                <span className="text-4xl font-black">٣</span>
                <span className="text-xs font-bold mt-1 text-emerald-300">اليقين (الأقل) ✓</span>
                <span className="text-[10px] text-emerald-100/70">البناء على ما استيقن</span>
              </div>
              <div className="text-white/40 text-2xl font-black">VS</div>
              <div className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/5 opacity-50 flex flex-col items-center line-through text-rose-300">
                <span className="text-4xl font-black">٤</span>
                <span className="text-xs font-bold mt-1">الشك (يطرح) ✕</span>
                <span className="text-[10px] text-rose-200/70">لا عبرة بالتردد</span>
              </div>
            </div>
          )}

          {/* SCENARIO 3: Involuntary Laughter or Slip of Speech */}
          {numericId === 3 && (
            <svg viewBox="0 0 240 140" className="w-56 h-36">
              <circle cx="120" cy="70" r="50" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse opacity-60" />
              <circle cx="120" cy="70" r="30" fill="#10B981" fillOpacity="0.15" stroke="#10B981" strokeWidth="2" />
              <circle cx="120" cy="40" r="12" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2" />
              <path d="M 108 58 Q 120 54 132 58 L 128 110 L 112 110 Z" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2" />
              <text x="120" y="130" fontSize="9" fill="#34D399" fontWeight="bold" textAnchor="middle">حلقة الخشوع الذهبية (استعادة السكينة)</text>
            </svg>
          )}

          {/* SCENARIO 4: Missed Essential Pillar */}
          {numericId === 4 && (
            <div className="flex items-center justify-center gap-3 w-full max-w-sm">
              <div className="p-3 rounded-xl border border-amber-500/40 bg-amber-500/10 text-center flex-1">
                <span className="text-[10px] text-amber-300 block font-bold">الركعة 1 (ناقصة سجدة)</span>
                <span className="text-xs font-black text-rose-300">ملغاة ✕</span>
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-400" />
              <div className="p-3 rounded-xl border-2 border-emerald-400 bg-emerald-500/20 text-center flex-1 shadow-lg">
                <span className="text-[10px] text-emerald-200 block font-bold">الركعة 2 (الحالية)</span>
                <span className="text-xs font-black text-emerald-300">تقوم مقامها ✓</span>
              </div>
            </div>
          )}

          {/* SCENARIO 5: Khanzab Whispers */}
          {numericId === 5 && (
            <svg viewBox="0 0 240 140" className="w-56 h-36">
              <g transform="translate(110, 30)">
                <circle cx="20" cy="20" r="14" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2" />
                <path d="M 10 20 L -15 35" stroke="#38BDF8" strokeWidth="2" strokeDasharray="2 2" />
                <path d="M 10 25 L -15 42" stroke="#38BDF8" strokeWidth="2" strokeDasharray="2 2" />
                <path d="M 10 30 L -15 50" stroke="#38BDF8" strokeWidth="2" strokeDasharray="2 2" />
                <text x="-25" y="45" fontSize="8" fill="#38BDF8" textAnchor="end">نفث خفيف 3× عن اليسار</text>
              </g>
              <text x="120" y="125" fontSize="9" fill="#A7F3D0" fontWeight="bold" textAnchor="middle">الاستعاذة بالله وطرد وساوس خنزب 🛡️</text>
            </svg>
          )}

          {/* SCENARIO 6: Cast / Bandage Wiping */}
          {numericId === 6 && (
            <div className="flex flex-col items-center justify-center gap-2">
              <svg viewBox="0 0 240 100" className="w-56 h-28">
                <rect x="50" y="35" width="140" height="30" rx="15" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
                <line x1="80" y1="35" x2="70" y2="65" stroke="#CBD5E1" strokeWidth="2" />
                <line x1="110" y1="35" x2="100" y2="65" stroke="#CBD5E1" strokeWidth="2" />
                <line x1="140" y1="35" x2="130" y2="65" stroke="#CBD5E1" strokeWidth="2" />
                <g className={wipedBandage ? 'translate-x-12 transition-transform duration-700' : ''}>
                  <path d="M 90 20 Q 120 15 150 20" stroke="#38BDF8" strokeWidth="3" fill="none" strokeDasharray="3 3" />
                  <circle cx="120" cy="22" r="5" fill="#38BDF8" />
                </g>
                <text x="120" y="85" fontSize="9" fill="#38BDF8" fontWeight="bold" textAnchor="middle">
                  {wipedBandage ? 'تمت المسحة الواحدة بالبلل بنجاح ✓' : 'مسحة واحدة خفيفة باليد المبتلة فوق الجبيرة'}
                </text>
              </svg>
            </div>
          )}

          {/* SCENARIO 7: Minimal Wudu in Extreme Cold */}
          {numericId === 7 && (
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl">❄️</span>
                <div className="p-3 rounded-2xl bg-sky-500/20 border border-sky-400/40 text-center">
                  <span className="text-[10px] text-sky-200 block">معيار التيسير في البرد القارس</span>
                  <span className="text-sm font-black text-sky-300">غسلة واحدة شاملة لكل عضو (1/1) ✓</span>
                </div>
                <span className="text-3xl">💧</span>
              </div>
              <span className="text-[11px] text-emerald-300 font-bold mt-1">الواجب المجزئ يرفع الحرج والمشقة تماماً</span>
            </div>
          )}

          {/* SCENARIO 8: Compulsive Gas/Wind Doubt */}
          {numericId === 8 && (
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="p-4 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-center shadow-lg max-w-xs">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
                <span className="text-xs font-black text-emerald-200 block">درع اليقين المحكم</span>
                <span className="text-[11px] text-emerald-100/90 font-medium">«اليقين لا يزول بالشك» — لا تنصرف حتى تسمع صوتاً أو تجد ريحاً</span>
              </div>
            </div>
          )}

          {/* SCENARIO 9: Tayammum (Dry Ablution) */}
          {numericId === 9 && (
            <div className="flex flex-col items-center justify-center gap-2">
              <svg viewBox="0 0 240 100" className="w-56 h-28">
                <rect x="40" y="60" width="160" height="25" rx="8" fill="#78716C" stroke="#A8A29E" strokeWidth="2" />
                <text x="120" y="77" fontSize="9" fill="#F5F5F4" fontWeight="bold" textAnchor="middle">صعيد طاهر (حجر أو تراب)</text>
                <g className="animate-bounce">
                  <ellipse cx="90" cy="35" rx="14" ry="10" fill="#FDE047" fillOpacity="0.3" stroke="#FDE047" strokeWidth="2" />
                  <ellipse cx="150" cy="35" rx="14" ry="10" fill="#FDE047" fillOpacity="0.3" stroke="#FDE047" strokeWidth="2" />
                </g>
              </svg>
              <span className="text-[11px] text-amber-300 font-bold">ضربة واحدة خفيفة ثم مسح الوجه والكفين</span>
            </div>
          )}

          {/* SCENARIO 10: Street Mud Splashes */}
          {numericId === 10 && (
            <div className="flex items-center justify-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-center">
                <Search className="w-6 h-6 text-amber-300 mx-auto mb-1" />
                <span className="text-xs font-black text-emerald-300 block">فحص رذاذ الوحل والطين</span>
                <span className="text-[10px] text-emerald-100">معفو عنه شرعاً • الأصل بقاء الطهارة</span>
              </div>
            </div>
          )}

          {/* SCENARIO 11: Seated Airplane Prayer */}
          {numericId === 11 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full">
              <div className="flex items-center justify-center gap-3 w-full">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
                  <Plane className="w-5 h-5 text-sky-400 mb-1" />
                  <span className="text-[9px] text-sky-200 font-mono">في الجو ☁️</span>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setFlightPosture('takbeer')}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                      flightPosture === 'takbeer' ? 'bg-emerald-400 text-slate-900 shadow-md scale-105' : 'bg-white/10 text-white'
                    }`}
                  >
                    1. تكبيرة الإحرام جالساً
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlightPosture('ruku')}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                      flightPosture === 'ruku' ? 'bg-emerald-400 text-slate-900 shadow-md scale-105' : 'bg-white/10 text-white'
                    }`}
                  >
                    2. إيماء الركوع (~30°)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlightPosture('sujud')}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                      flightPosture === 'sujud' ? 'bg-emerald-400 text-slate-900 shadow-md scale-105' : 'bg-white/10 text-white'
                    }`}
                  >
                    3. إيماء السجود الأخفض (~60°)
                  </button>
                </div>
              </div>

              <div className="text-center text-xs font-bold text-amber-300">
                {flightPosture === 'takbeer' && '💺 وضعية التكبير: الجلوس باعتدال على المقعد واستقبال جهة القبلة قدر الاستطاعة'}
                {flightPosture === 'ruku' && '💺 وضعية الركوع: الانحناء الخفيف بالرأس والجذع للأمام بنحو 30 درجة'}
                {flightPosture === 'sujud' && '💺 وضعية السجود: الانحناء الأخفض للأمام بنحو 60 درجة بحيث يكون أخفض من الركوع'}
              </div>
            </div>
          )}

          {/* SCENARIO 12: Train / Bus In-Motion Prayer */}
          {numericId === 12 && (
            <div className="flex flex-col items-center justify-center gap-2">
              <svg viewBox="0 0 260 110" className="w-64 h-28">
                <rect x="20" y="15" width="220" height="80" rx="12" fill="#1E293B" stroke="#475569" strokeWidth="2" />
                <rect x="35" y="25" width="45" height="35" rx="6" fill="#38BDF8" fillOpacity="0.3" stroke="#38BDF8" strokeWidth="1" />
                <rect x="90" y="25" width="45" height="35" rx="6" fill="#38BDF8" fillOpacity="0.3" stroke="#38BDF8" strokeWidth="1" />
                <line x1="20" y1="75" x2="240" y2="75" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
                <circle cx="170" cy="40" r="10" fill="#F8FAFC" stroke="#10B981" strokeWidth="2" />
                <path d="M 162 55 Q 170 52 178 55 L 176 80 L 164 80 Z" fill="#E2E8F0" />
                <text x="130" y="102" fontSize="8.5" fill="#38BDF8" fontWeight="bold" textAnchor="middle">الصلاة داخل وسيلة السفر • التكبير لجهة القبلة مع حفظ التوازن</text>
              </svg>
            </div>
          )}

          {/* SCENARIO 13: Masbooq in Ruku */}
          {numericId === 13 && (
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-center">
                <span className="text-[10px] text-amber-200 block">الإمام راكع في الصف</span>
                <span className="text-xs font-black text-amber-300">تكبيرة الإحرام قائماً ➜ الركوع مباشرة معهم</span>
              </div>
              <span className="text-xs font-black text-emerald-300">تُدرك الركعة كاملة ✓</span>
            </div>
          )}

          {/* SCENARIO 14: Airport Corner Prayer */}
          {numericId === 14 && (
            <div className="flex items-center justify-center gap-3">
              <svg viewBox="0 0 240 100" className="w-60 h-28">
                <rect x="20" y="10" width="200" height="80" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="2" />
                <line x1="60" y1="10" x2="60" y2="90" stroke="#64748B" strokeWidth="2" strokeDasharray="3 3" />
                <rect x="90" y="30" width="60" height="45" rx="4" fill="#10B981" fillOpacity="0.4" stroke="#10B981" strokeWidth="1.5" />
                <circle cx="120" cy="45" r="8" fill="#F59E0B" />
                <text x="120" y="85" fontSize="8" fill="#A7F3D0" fontWeight="bold" textAnchor="middle">بسط سجادة الجيب في ركن المطار الهادئ 🧭</text>
              </svg>
            </div>
          )}

          {/* SCENARIO 15: Combining for Surgery */}
          {numericId === 15 && (
            <div className="flex items-center justify-center gap-4">
              <div className="p-3 rounded-2xl bg-sky-500/20 border border-sky-400/30 text-center">
                <Clock className="w-5 h-5 text-sky-300 mx-auto mb-1" />
                <span className="text-[10px] text-sky-200 font-bold block">الظهر + العصر</span>
                <span className="text-xs font-black text-sky-300">جمع تقديم / تأخير</span>
              </div>
              <span className="text-xs font-black text-emerald-300">رخصة التيسير للمرض والجراحة 🏥</span>
            </div>
          )}

          {/* SCENARIO 16: Non-Muslim Neighbor Gifts */}
          {numericId === 16 && (
            <div className="flex items-center justify-center gap-3">
              <svg viewBox="0 0 200 90" className="w-52 h-24">
                <rect x="65" y="25" width="70" height="55" rx="8" fill="#D97706" stroke="#FDE68A" strokeWidth="2" />
                <line x1="100" y1="25" x2="100" y2="80" stroke="#FDE68A" strokeWidth="4" />
                <line x1="65" y1="52" x2="135" y2="52" stroke="#FDE68A" strokeWidth="4" />
                <circle cx="100" cy="20" r="8" fill="#EF4444" />
                <text x="100" y="85" fontSize="8" fill="#FDE68A" fontWeight="bold" textAnchor="middle">حلويات الجيران (مباحة وخالية من المحرمات)</text>
              </svg>
            </div>
          )}

          {/* SCENARIO 17: Bank Usury Clause */}
          {numericId === 17 && (
            <div className="flex flex-col items-center justify-center gap-2">
              <div
                onClick={() => {
                  playSoftTap();
                  setRibaStruck(!ribaStruck);
                }}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-700 max-w-xs text-center cursor-pointer hover:border-amber-400 transition-all"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>عقد بنكي / إيجار</span>
                  <span className="text-amber-300">انقر لشطب الفائدة</span>
                </div>
                <div className={`p-2 rounded-xl text-xs font-bold transition-all ${ribaStruck ? 'bg-emerald-950/60 text-emerald-300 line-through border border-emerald-500/40' : 'bg-rose-950/60 text-rose-300 border border-rose-500/40'}`}>
                  {ribaStruck ? 'تم شطب شرط الفائدة الربوية 5% ✓' : 'بند 4: شرط غرامة تأخير بفائدة ربوية 5%'}
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
                  {ribaStruck ? 'معاملة نقية مبرأة الذمة' : 'شطب البند أو السداد التلقائي لمنع الفائدة'}
                </span>
              </div>
            </div>
          )}

          {/* SCENARIO 18: Supermarket Halal / Kosher Meat */}
          {numericId === 18 && (
            <div className="flex items-center justify-center gap-3">
              <svg viewBox="0 0 220 90" className="w-56 h-24">
                <rect x="20" y="15" width="80" height="60" rx="8" fill="#047857" stroke="#34D399" strokeWidth="1.5" />
                <text x="60" y="42" fontSize="9" fill="#FFFFFF" fontWeight="bold" textAnchor="middle">ذبيحة أهل الكتاب</text>
                <text x="60" y="58" fontSize="8" fill="#A7F3D0" textAnchor="middle">حلال ومباحة</text>
                <rect x="120" y="15" width="80" height="60" rx="8" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" />
                <text x="160" y="42" fontSize="9" fill="#FFFFFF" fontWeight="bold" textAnchor="middle">مأكولات بحرية</text>
                <text x="160" y="58" fontSize="8" fill="#BAE6FD" textAnchor="middle">حلال طاهرة</text>
              </svg>
            </div>
          )}

          {/* SCENARIO 19: Dining Near Alcohol */}
          {numericId === 19 && (
            <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-center max-w-xs">
              <Utensils className="w-6 h-6 text-amber-300 mx-auto mb-1" />
              <span className="text-xs font-black text-amber-300 block">طاولة عشاء العمل المستقلة</span>
              <span className="text-[10px] text-amber-100">الجلوس على طاولة نقية خالية من المنكرات وطلب العصير الحلال</span>
            </div>
          )}

          {/* SCENARIO 20: Cashier Lottery Job */}
          {numericId === 20 && (
            <div className="p-3.5 rounded-2xl bg-sky-500/20 border border-sky-400/30 text-center max-w-xs">
              <Briefcase className="w-6 h-6 text-sky-300 mx-auto mb-1" />
              <span className="text-xs font-black text-sky-300 block">طلب النقل لقسم الأغذية الحلال</span>
              <span className="text-[10px] text-sky-100">«ومن يتق الله يجعل له مخرجاً» • التعفف عن بيع القمار مع طلب بديل</span>
            </div>
          )}

          {/* SCENARIO 21: Family Dinner Pork */}
          {numericId === 21 && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-center max-w-xs">
              <Users className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
              <span className="text-xs font-black text-emerald-300 block">صلة الرحم مع العائلة</span>
              <span className="text-[10px] text-emerald-100">تلبية الدعوة وتناول الأسماك والسلطات والاعتذار بلطف عن المحرم</span>
            </div>
          )}

          {/* SCENARIO 22: Condolences for Non-Muslim Relative */}
          {numericId === 22 && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-center max-w-xs">
              <Heart className="w-6 h-6 text-rose-400 mx-auto mb-1" />
              <span className="text-xs font-black text-emerald-300 block">واجب العزاء والمواساة الإنسانية</span>
              <span className="text-[10px] text-emerald-100">تقديم الكلمات الطيبة ومواساة الأهل صلةً للرحم وبرّاً بهم</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCENARIO 23: INTERACTIVE 2.5D IDENTITY CARD / VERIFICATION LAB (UPGRADED) */}
          {/* ========================================================================= */}
          {numericId === 23 && (
            <div className="w-full max-w-md flex flex-col items-center justify-center gap-3">
              {/* 2.5D Digital Identity Card / Passport Mockup */}
              <div className="relative w-full rounded-2xl bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E1B4B] p-4 sm:p-5 border-2 border-cyan-500/40 shadow-2xl overflow-hidden">
                {/* Cyan Laser Scan Line Animation */}
                {idScanStep === 'scanning' && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent animate-pulse pointer-events-none border-b-2 border-cyan-400 shadow-[0_0_15px_#22d3ee]" />
                )}

                {/* ID Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
                      <UserCheck className="w-4 h-4 text-cyan-300" />
                    </div>
                    <div>
                      <span className="text-[10px] text-cyan-200/70 block leading-tight">وثيقة الهوية والاسم الأصلي</span>
                      <span className="text-xs font-black text-cyan-300">Identity Verification Certificate</span>
                    </div>
                  </div>

                  {/* Verification Chip Badge */}
                  <div className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/40 text-[9px] font-mono text-amber-300">
                    CHIP • ID-23
                  </div>
                </div>

                {/* Card Content & Name Verification */}
                <div className="flex items-center justify-between gap-3">
                  {/* Avatar silhouette */}
                  <div className="w-14 h-16 rounded-xl bg-white/5 border border-white/20 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="w-6 h-6 rounded-full bg-slate-400/30 mb-1" />
                    <div className="w-10 h-6 rounded-t-full bg-slate-400/30" />
                    {idScanStep === 'scanned' || idScanStep === 'stamped' ? (
                      <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      </div>
                    ) : null}
                  </div>

                  {/* Name & Details */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400">الاسم المسجل:</span>
                      <span className="text-sm font-black text-white font-mono tracking-wide">{idName}</span>
                    </div>

                    {/* Dual Status Meters */}
                    <div className="space-y-1 pt-1">
                      {/* Status Meter 1: Linguistic Meaning */}
                      <div className="flex items-center justify-between text-[10px] px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-slate-300">المعنى اللغوي:</span>
                        <span className={`font-bold flex items-center gap-1 ${idScanStep === 'scanned' || idScanStep === 'stamped' ? 'text-emerald-300' : 'text-cyan-300'}`}>
                          {idScanStep === 'scanned' || idScanStep === 'stamped' ? '✓ (حامٍ وطيب)' : 'قيد الفحص...'}
                        </span>
                      </div>

                      {/* Status Meter 2: Sharia Rulings */}
                      <div className="flex items-center justify-between text-[10px] px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-slate-300">الحكم الشرعي:</span>
                        <span className={`font-bold flex items-center gap-1 ${idScanStep === 'scanned' || idScanStep === 'stamped' ? 'text-emerald-300' : 'text-cyan-300'}`}>
                          {idScanStep === 'scanned' || idScanStep === 'stamped' ? '✓ (جائز ولا يتعارض)' : 'قيد الفحص...'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Animated Official Emerald Wax Seal Stamp */}
                {(idScanStep === 'stamped' || isCompleted) && (
                  <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/25 border-2 border-emerald-400 text-center animate-bounce shadow-lg flex items-center justify-center gap-2">
                    <Award className="w-5 h-5 text-emerald-300" />
                    <span className="text-xs font-black text-emerald-200">
                      معتمد شرعاً — لا يلزم تغييره نهائياً ✨
                    </span>
                  </div>
                )}
              </div>

              {/* Tactical Buttons to control scanner and stamp */}
              <div className="flex flex-wrap items-center justify-center gap-2 w-full pt-1">
                <button
                  type="button"
                  onClick={() => {
                    playSoftTap();
                    setIdScanStep('scanning');
                    setTimeout(() => {
                      playPeaceChime();
                      setIdScanStep('scanned');
                    }, 800);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    idScanStep === 'scanned' || idScanStep === 'stamped'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 hover:bg-cyan-500/30'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>(انقر) فحص دلالة الاسم بالماسح الضوئي 🔍</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playPeaceChime();
                    setIdScanStep('stamped');
                    handleAction('(انقر) ختم الاعتماد وبقاء الاسم الأصلي');
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>(انقر) ختم الاعتماد وبقاء الاسم الأصلي 📜</span>
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO 24: Mockery from Former Peers */}
          {numericId === 24 && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-center max-w-xs">
              <ShieldCheck className="w-6 h-6 text-emerald-300 mx-auto mb-1" />
              <span className="text-xs font-black text-emerald-200 block">الحلم الوقور والإعراض</span>
              <span className="text-[10px] text-emerald-100">«وإذا خاطبهم الجاهلون قالوا سلاماً» • الثبات بالسكينة</span>
            </div>
          )}

          {/* SCENARIO 25: Overnight at In-Laws */}
          {numericId === 25 && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-center max-w-xs">
              <Home className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
              <span className="text-xs font-black text-emerald-300 block">المبيت عند الأصهار بإحسان</span>
              <span className="text-[10px] text-emerald-100">تقديم الهدايا وحفظ خصوصية الصلاة والوضوء بالسكينة</span>
            </div>
          )}

          {/* SCENARIO 26: Guilt Over Past Life */}
          {numericId === 26 && (
            <div className="flex flex-col items-center justify-center gap-2">
              <div
                onClick={() => {
                  playPeaceChime();
                  setPadlockOpen(!padlockOpen);
                }}
                className="p-4 rounded-2xl bg-amber-500/20 border-2 border-amber-400/40 text-center cursor-pointer hover:bg-amber-500/30 transition-all shadow-lg"
              >
                <span className="text-3xl block mb-1">{padlockOpen ? '🔓' : '🔒'}</span>
                <span className="text-xs font-black text-amber-200 block">
                  {padlockOpen ? 'انحلال قيد الماضي بنور المغفرة ✨' : 'قيد الماضي والذنوب (انقر للفك)'}
                </span>
                <span className="text-[10px] text-amber-100/80">«الإسلام يهدم ما كان قبله» • صفحتك بيضاء نقية</span>
              </div>
            </div>
          )}

          {/* SCENARIO 27: Conflicting Online Fatwas */}
          {numericId === 27 && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-center max-w-xs">
              <BookOpen className="w-6 h-6 text-amber-300 mx-auto mb-1" />
              <span className="text-xs font-black text-emerald-300 block">المتون الفقهية المعتمدة</span>
              <span className="text-[10px] text-emerald-100">«يسروا ولا تعسروا» • ترك جدالات الإنترنت والأخذ بالأيسر</span>
            </div>
          )}

          {/* SCENARIO 28: Work Prayer Breaks */}
          {numericId === 28 && (
            <div className="flex flex-col items-center justify-center gap-2">
              <div
                onClick={() => {
                  playPeaceChime();
                  setPrayerBreakBooked(!prayerBreakBooked);
                }}
                className={`p-3.5 rounded-2xl border text-center max-w-xs cursor-pointer transition-all ${
                  prayerBreakBooked
                    ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 shadow-lg'
                    : 'bg-sky-500/20 border-sky-400/30 text-sky-200'
                }`}
              >
                <Calendar className="w-5 h-5 text-sky-300 mx-auto mb-1" />
                <span className="text-xs font-black block">
                  {prayerBreakBooked ? 'تم حجز استراحة الصلاة في التقويم (12:30 PM) ✓' : 'حجز 10 دقائق لصلاة الظهر في العمل'}
                </span>
                <span className="text-[10px] text-sky-100 block mt-0.5">«أرحنا بها يا بلال» • تنظيم المواعيد بيقين</span>
              </div>
            </div>
          )}

          {/* SCENARIO 29: Recitation Concession (Non-Arabic) */}
          {numericId === 29 && (
            <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-center max-w-xs">
              <span className="text-xs font-black text-amber-200 block">الذكر البديل حتى إتقان الفاتحة:</span>
              <span className="text-[11px] text-emerald-300 font-bold block mt-1">
                (سبحان الله، والحمد لله، ولا إله إلا الله، والله أكبر)
              </span>
              <span className="text-[9px] text-amber-100/70">تجزئك صلاتك تماماً وتتعلم بالتدريج</span>
            </div>
          )}

          {/* SCENARIO 30: Zakat al-Fitr (Traditional Sa'a Bowl + Digital Scale) */}
          {numericId === 30 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full">
              <div className="flex items-center justify-center gap-4">
                <svg viewBox="0 0 140 100" className="w-32 h-24">
                  <path d="M 20 40 Q 70 20 120 40 L 105 85 Q 70 95 35 85 Z" fill="#854D0E" stroke="#A16207" strokeWidth="2" />
                  <ellipse cx="70" cy="40" rx="45" ry="15" fill="#FEF08A" stroke="#FDE047" strokeWidth="1.5" />
                  <circle cx="55" cy="35" r="2.5" fill="#FFFFFF" />
                  <circle cx="70" cy="30" r="2.5" fill="#FFFFFF" />
                  <circle cx="85" cy="36" r="2.5" fill="#FFFFFF" />
                  <text x="70" y="70" fontSize="8" fill="#FEF9C3" fontWeight="bold" textAnchor="middle">صاع نبوي (أرز)</text>
                </svg>

                <div className="p-3 rounded-2xl bg-emerald-500/25 border-2 border-emerald-400 text-center shadow-lg">
                  <Scale className="w-5 h-5 text-emerald-300 mx-auto mb-0.5" />
                  <span className="text-xl font-black text-emerald-200">{saCount} كجم</span>
                  <span className="text-[9px] text-emerald-100 block font-bold">صاع نبوي من طعام</span>
                </div>
              </div>
              <span className="text-[11px] text-amber-300 font-bold">
                طهرة للصائم وطعمة للمساكين • تخرج قبل صلاة العيد
              </span>
            </div>
          )}
        </div>

        {/* CLICKABLE ACTION BUTTONS DIRECTLY UNDERNEATH */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
          <button
            type="button"
            onClick={() => {
              if (numericId === 6) setWipedBandage(true);
              if (numericId === 26) setPadlockOpen(true);
              if (numericId === 23) setIdScanStep('stamped');
              handleAction();
            }}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
              isCompleted
                ? 'bg-emerald-500 text-slate-950 scale-102 ring-4 ring-emerald-400/30'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 hover:scale-102'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-slate-950" />
                <span>{lang === 'ar' ? 'تم استيعاب وتطبيق الموقف بنجاح ✓' : 'Scenario Completed Successfully ✓'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{remedialButtonText || (lang === 'ar' ? '(انقر) تطبيق التوجيه الفقهي' : 'Apply Fiqh Guidance')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. BOTTOM KNOWLEDGE CARD: Clean White Card */}
      <div className="rounded-3xl bg-white p-5 sm:p-6 border border-[#D4A373]/30 shadow-xl space-y-4">
        {/* Item 1: Practical Fiqh Rule */}
        <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#D4A373]/20 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>{lang === 'ar' ? 'الحكم الفقهي المباشر' : 'Practical Fiqh Rule'}</span>
            </span>
            <span className="text-[10px] text-stone-500 font-mono">{fiqhSource}</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-[#2C483F] leading-relaxed pt-1">
            {lang === 'ar' ? shortGuidance : shortGuidanceEn || shortGuidance}
          </p>
        </div>

        {/* Item 2: Rafiq's Empathetic Voice */}
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-black text-emerald-950">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === 'ar' ? 'رسالة رفيق المؤنسة لك:' : 'Rafiq’s Comforting Message:'}</span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
            {rafiqMessage?.activeText ||
              rafiqMessage?.maleAr ||
              (lang === 'ar'
                ? 'يا أخي، دينك مبني على الرحمة والتيسير التام؛ اتبع الهدي النبوي واطمئن لصلاتك وطهارتك.'
                : 'Islam is built on total ease and mercy; follow the prophetic guidance with full peace of mind.')}
          </p>
        </div>

        {/* Item 3: Exact Verified Sahih Hadith / Fiqh Maxim with citation */}
        {hadithReference && (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span>{lang === 'ar' ? 'الدليل والحديث النبوي المعتمد:' : 'Verified Evidence & Hadith:'}</span>
            </div>
            <p className="text-xs sm:text-sm font-arabic font-bold text-amber-950 leading-relaxed">
              {hadithReference.textAr}
            </p>
            <p className="text-[10px] text-amber-800 font-mono text-end font-semibold">
              — {hadithReference.sourceAr}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Aliases for compatibility
export const EnginePrayerCorrection = MasterKineticScenarioCanvas;
export const EngineWuduPurity = MasterKineticScenarioCanvas;
export const EngineSocialEthics = MasterKineticScenarioCanvas;
export const EngineTimingQibla = MasterKineticScenarioCanvas;
export const EngineDoubtVault = MasterKineticScenarioCanvas;
export const EngineStreetCharity = MasterKineticScenarioCanvas;
export const EngineHeartCertainty = MasterKineticScenarioCanvas;
