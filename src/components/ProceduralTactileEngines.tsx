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
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { Language } from '../types';
import { ProceduralEngineType, InternalCatalogueScenario, RAFIC_INTERNAL_CATALOGUE } from '../services/raficInternalCatalogue';
import { playPeaceChime, playSoftTap } from '../utils/audio';
import { recordScenarioAttempt, addReinforcementNeed } from '../services/learningStateManager';

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

  const formattedScenId = `SCN_${numericId.toString().padStart(3, '0')}`;

  // Interactive Kinetic States
  const [activeStep, setActiveStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [mistakeFeedback, setMistakeFeedback] = useState<string | null>(null);
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);

  // SCN_009 Specific States
  const [tayammumStep, setTayammumStep] = useState<number>(0); // 0: condition check, 1: tap, 2: face, 3: hands
  const [tayammumConditionOk, setTayammumConditionOk] = useState<boolean>(false);

  // Other Scenario States
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

  // Triggers mistake feedback & learning state reinforcement
  const triggerMistake = (conceptTag: string, explanationAr: string) => {
    playSoftTap();
    setMistakeFeedback(explanationAr);
    addReinforcementNeed(conceptTag);
    recordScenarioAttempt(formattedScenId, false, [conceptTag]);
  };

  const handleAction = (label?: string, conceptsCovered: string[] = []) => {
    playPeaceChime();
    setMistakeFeedback(null);
    setIsCompleted(true);
    setActionTriggered(true);

    if (numericId === 23) {
      setIdScanStep('stamped');
    }

    // Record success attempt with covered concepts
    recordScenarioAttempt(formattedScenId, true, conceptsCovered);

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
            <div className="flex flex-col items-center justify-center gap-3 w-full">
              <svg viewBox="0 0 280 120" className="w-full max-w-xs h-28">
                <ellipse cx="140" cy="105" rx="90" ry="12" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="1" />
                <g className="animate-fade-in">
                  <circle cx="150" cy="30" r="14" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
                  <path d="M 136 48 Q 150 44 164 48 L 160 95 L 140 95 Z" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2.5" />
                  <line x1="145" y1="95" x2="145" y2="110" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="155" y1="95" x2="155" y2="110" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
                  <text x="150" y="15" fontSize="9" fill="#34D399" fontWeight="bold" textAnchor="middle">استتممت قائماً للركعة الثالثة</text>
                </g>
              </svg>

              <div className="space-y-2 text-center w-full max-w-sm">
                <span className="text-xs text-stone-200 block font-bold">نسيت التشهد الأول واستتممت قائماً؛ كيف تتصرف؟</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => triggerMistake('prayer_first_tashahhud_continuation', 'إذا استتم القائم إلى الركعة الثالثة يكره له الرجوع إلى الجلوس للتشهد الأول، ويمضي في صلاته ويجبر النقص بسجدتي السهو قبل السلام.')}
                    className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold transition-all cursor-pointer text-start"
                  >
                    ❌ الرجوع للجلوس لقراءة التشهد الأول
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleAction('الاستمرار في القيام وسجود السهو قبل السلام', ['prayer_first_tashahhud_continuation', 'sujud_sahw_timing']);
                    }}
                    className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold transition-all cursor-pointer text-start"
                  >
                    ✓ الاستمرار في القيام وسجود السهو قبل السلام
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SCENARIO 2: Doubt in Rak'ah Count */}
          {numericId === 2 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm">
              <div className="flex items-center justify-center gap-6 my-auto">
                <div
                  onClick={() => {
                    playPeaceChime();
                    setRakahChoice(3);
                  }}
                  className={`p-3.5 sm:p-4 rounded-2xl border-2 flex flex-col items-center cursor-pointer transition-all ${
                    rakahChoice === 3
                      ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 shadow-xl scale-105'
                      : 'bg-white/5 border-white/20 text-white/60'
                  }`}
                >
                  <span className="text-3xl font-black">٣</span>
                  <span className="text-xs font-bold mt-1 text-emerald-300">اليقين (الأقل) ✓</span>
                </div>
                <div className="text-white/40 text-xl font-black">VS</div>
                <div className="p-3.5 sm:p-4 rounded-2xl border border-white/10 bg-white/5 opacity-50 flex flex-col items-center line-through text-rose-300">
                  <span className="text-3xl font-black">٤</span>
                  <span className="text-xs font-bold mt-1">الشك (يطرح) ✕</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => triggerMistake('prayer_rakah_doubt_certainty', 'عند التردد بين 3 و4 يجب طرد الشك والبناء على اليقين وهو الأقل (3)، ثم الإتيان بالركعة الرابعة وسجود السهو قبل السلام.')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ❌ البناء على الأكثر (4) أو إعادة الصلاة من جديد
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('البناء على اليقين (3) والإتيان بالرابعة وسجود السهو', ['prayer_rakah_doubt_certainty', 'sujud_sahw_timing'])}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ✓ البناء على اليقين (3) والإتيان بالرابعة وسجود السهو
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO 3: Involuntary Laughter or Slip of Speech */}
          {numericId === 3 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm">
              <svg viewBox="0 0 240 100" className="w-56 h-24">
                <circle cx="120" cy="50" r="40" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse opacity-60" />
                <circle cx="120" cy="50" r="24" fill="#10B981" fillOpacity="0.15" stroke="#10B981" strokeWidth="2" />
                <circle cx="120" cy="30" r="10" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2" />
                <path d="M 110 44 Q 120 40 130 44 L 126 80 L 114 80 Z" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2" />
                <text x="120" y="94" fontSize="8" fill="#34D399" fontWeight="bold" textAnchor="middle">استعادة الخشوع والسكينة فوراً</text>
              </svg>

              <div className="grid grid-cols-1 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => triggerMistake('prayer_involuntary_actions', 'الضحك عارضاً غلبة دون تعمد والكلام السهو لا يبطلان الصلاة بل يكفي كتمه ومواصلة الصلاة بالخشوع.')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ❌ قطع الصلاة فوراً وإعادتها من الأول
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('كتم الضحك والاستغفار في النفس ومواصلة الصلاة', ['prayer_involuntary_actions', 'salah_focus_tranquility'])}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ✓ كتم الضحك والاستغفار في النفس ومواصلة الصلاة بالخشوع
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO 4: Missed Essential Pillar */}
          {numericId === 4 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm">
              <div className="flex items-center justify-center gap-3 w-full">
                <div className="p-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-center flex-1">
                  <span className="text-[10px] text-amber-300 block font-bold">الركعة 1 (ناقصة سجدة)</span>
                  <span className="text-xs font-black text-rose-300">ملغاة ✕</span>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="p-2.5 rounded-xl border-2 border-emerald-400 bg-emerald-500/20 text-center flex-1 shadow-lg">
                  <span className="text-[10px] text-emerald-200 block font-bold">الركعة 2 (الحالية)</span>
                  <span className="text-xs font-black text-emerald-300">تقوم مقامها ✓</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => triggerMistake('prayer_missing_pillar_remedy', 'السجود ركن أساسي لا يسقط بالسهو ولا يجبره سجود السهو وحده، بل تجب إلغاء الركعة الناقصة واحتساب الحالية بدلاً عنها.')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ❌ الاكتفاء بسجود السهو دون تدارك الركعة الملغاة
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('إلغاء الركعة الناقصة واحتساب الركعة الحالية بدلاً عنها', ['prayer_missing_pillar_remedy', 'sujud_sahw_timing'])}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ✓ إلغاء الركعة الناقصة واحتساب الركعة الحالية بدلاً عنها
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO 5: Khanzab Whispers */}
          {numericId === 5 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm">
              <svg viewBox="0 0 240 100" className="w-56 h-24">
                <g transform="translate(110, 15)">
                  <circle cx="20" cy="20" r="12" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2" />
                  <path d="M 10 20 L -15 35" stroke="#38BDF8" strokeWidth="2" strokeDasharray="2 2" />
                  <path d="M 10 25 L -15 42" stroke="#38BDF8" strokeWidth="2" strokeDasharray="2 2" />
                  <path d="M 10 30 L -15 50" stroke="#38BDF8" strokeWidth="2" strokeDasharray="2 2" />
                  <text x="-25" y="45" fontSize="8" fill="#38BDF8" textAnchor="end">نفث خفيف 3× عن اليسار</text>
                </g>
                <text x="120" y="90" fontSize="8.5" fill="#A7F3D0" fontWeight="bold" textAnchor="middle">الاستعاذة بالله وطرد وساوس خنزب 🛡️</text>
              </svg>

              <div className="grid grid-cols-1 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => triggerMistake('prayer_waswas_khanzab_response', 'العلاج النبوي لوسواس خنزب هو التفات خفيف لليسار مع نفث خفيف 3 مرات والاستعاذة بالله دون قطع الصلاة أو الاسترسال مع الحديث.')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ❌ الاسترسال مع الأفكار أو التحدث بصوت عالٍ بالصلاة
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('النفث الخفيف 3 مرات عن اليسار والتعوذ بالله من خنزب', ['prayer_waswas_khanzab_response', 'salah_focus_tranquility'])}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ✓ النفث الخفيف 3 مرات عن اليسار والتعوذ بالله من خنزب
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO 6: Cast / Bandage Wiping */}
          {numericId === 6 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm">
              <svg viewBox="0 0 240 80" className="w-56 h-20">
                <rect x="50" y="25" width="140" height="30" rx="15" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
                <line x1="80" y1="25" x2="70" y2="55" stroke="#CBD5E1" strokeWidth="2" />
                <line x1="110" y1="25" x2="100" y2="55" stroke="#CBD5E1" strokeWidth="2" />
                <line x1="140" y1="25" x2="130" y2="55" stroke="#CBD5E1" strokeWidth="2" />
                <g className={wipedBandage ? 'translate-x-12 transition-transform duration-700' : ''}>
                  <path d="M 90 10 Q 120 5 150 10" stroke="#38BDF8" strokeWidth="3" fill="none" strokeDasharray="3 3" />
                  <circle cx="120" cy="12" r="5" fill="#38BDF8" />
                </g>
                <text x="120" y="72" fontSize="8.5" fill="#38BDF8" fontWeight="bold" textAnchor="middle">
                  {wipedBandage ? 'تمت المسحة الواحدة بالبلل بنجاح ✓' : 'مسحة واحدة خفيفة باليد المبتلة فوق الجبيرة'}
                </text>
              </svg>

              <div className="grid grid-cols-1 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => triggerMistake('wudu_bandage_cast_wiping', 'نزع الضمادة أو الجبيرة يسهم في إلحاق الضرر بالعضو، والواجب هو تمرير الكف المبللة برفق مسحة واحدة فقط.')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ❌ نزع الضمادة وغسل الجرح بالماء رغم ألم الكسر
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWipedBandage(true);
                    handleAction('تمرير بلل الكف برفق فوق الجبيرة مسحة واحدة', ['wudu_bandage_cast_wiping', 'wudu_purity_concessions']);
                  }}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ✓ تمرير بلل الكف برفق فوق الجبيرة مسحة واحدة
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO 7: Minimal Wudu in Extreme Cold */}
          {numericId === 7 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm">
              <div className="flex items-center gap-3">
                <span className="text-2xl">❄️</span>
                <div className="p-2.5 rounded-2xl bg-sky-500/20 border border-sky-400/40 text-center">
                  <span className="text-[10px] text-sky-200 block">معيار التيسير في البرد القارس</span>
                  <span className="text-xs font-black text-sky-300">غسلة واحدة شاملة لكل عضو (1/1) ✓</span>
                </div>
                <span className="text-2xl">💧</span>
              </div>

              <div className="grid grid-cols-1 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => triggerMistake('wudu_cold_weather_concession', 'غسل الأعضاء 3 مرات ليس واجباً، بل الواجب الفرض هو غسلة واحدة شاملة ترفع عنك الحرج والمشقة بالثلج.')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ❌ الإصرار على الغسل 3 مرات وتكراره مع شدة البرد والمشقة
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('الاكتفاء بغسلة واحدة تامة لكل عضو رفعاً للمشقة', ['wudu_cold_weather_concession', 'wudu_purity_concessions'])}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ✓ الاكتفاء بغسلة واحدة تامة لكل عضو رفعاً للمشقة
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO 8: Compulsive Gas/Wind Doubt */}
          {numericId === 8 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm">
              <div className="p-3 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-center shadow-lg w-full">
                <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <span className="text-xs font-black text-emerald-200 block">درع اليقين المحكم</span>
                <span className="text-[10px] text-emerald-100/90 font-medium">«اليقين لا يزول بالشك» — لا تنصرف حتى تسمع صوتاً أو تجد ريحاً</span>
              </div>

              <div className="grid grid-cols-1 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => triggerMistake('wudu_doubt_certainty_principle', '«اليقين لا يزول بالشك»؛ طهارتك باقية بيقين، ولا يجوز قطع الصلاة لمجرد الشك والتخيل ما لم يتحقق الصوت أو الرائحة.')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ❌ قطع الصلاة فوراً وإعادة الوضوء مع كل حركة في البطن
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('الثبات في الصلاة وطرد الشكوك حتى التيقن التام', ['wudu_doubt_certainty_principle', 'salah_focus_tranquility'])}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ✓ الثبات في الصلاة وطرد الشكوك حتى اليقين التام
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO 9: Tayammum (Dry Ablution) */}
          {numericId === 9 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full">
              {/* Step Progress Indicator */}
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300">
                <span className={`px-2.5 py-0.5 rounded-full border ${tayammumStep === 0 ? 'bg-amber-500/30 border-amber-400 text-white' : 'bg-white/10 border-white/20 text-white/60'}`}>
                  1. شروط التيمم
                </span>
                <span>←</span>
                <span className={`px-2.5 py-0.5 rounded-full border ${tayammumStep === 1 ? 'bg-amber-500/30 border-amber-400 text-white' : 'bg-white/10 border-white/20 text-white/60'}`}>
                  2. ضربة التراب
                </span>
                <span>←</span>
                <span className={`px-2.5 py-0.5 rounded-full border ${tayammumStep >= 2 ? 'bg-amber-500/30 border-amber-400 text-white' : 'bg-white/10 border-white/20 text-white/60'}`}>
                  3. مسح الوجه والكفين
                </span>
              </div>

              {/* Stage 0: Conditions Check */}
              {tayammumStep === 0 && (
                <div className="space-y-2 text-center w-full max-w-sm">
                  <span className="text-xs text-stone-200 block font-bold">متى يُشرع لك التيمم؟ (اختر القرار الصحيح)</span>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={() => triggerMistake('tayammum_conditions', 'التيمم رخصة عند فقد الماء بالكامل أو العجز عن استعماله لخوف الضرر بالمرض، وليس لمجرد الكسل أو البرد العادي مع توفر الماء.')}
                      className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                    >
                      ❌ عند الشعور بالكسل عن الوضوء أو البرد العادي مع توفر الماء
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playPeaceChime();
                        setMistakeFeedback(null);
                        setTayammumConditionOk(true);
                        setTayammumStep(1);
                      }}
                      className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                    >
                      ✓ عند فقد الماء تماماً أو العجز عن استعماله لخوف الضرر بالمرض
                    </button>
                  </div>
                </div>
              )}

              {/* Stage 1: Tap Dry Earth */}
              {tayammumStep === 1 && (
                <div className="flex flex-col items-center gap-2">
                  <svg viewBox="0 0 240 80" className="w-56 h-20">
                    <rect x="40" y="45" width="160" height="25" rx="8" fill="#78716C" stroke="#A8A29E" strokeWidth="2" />
                    <text x="120" y="62" fontSize="9" fill="#F5F5F4" fontWeight="bold" textAnchor="middle">صعيد طاهر (حجر أو تراب)</text>
                    <g className="animate-bounce">
                      <ellipse cx="90" cy="25" rx="14" ry="10" fill="#FDE047" fillOpacity="0.4" stroke="#FDE047" strokeWidth="2" />
                      <ellipse cx="150" cy="25" rx="14" ry="10" fill="#FDE047" fillOpacity="0.4" stroke="#FDE047" strokeWidth="2" />
                    </g>
                  </svg>
                  <button
                    type="button"
                    onClick={() => {
                      playPeaceChime();
                      setTayammumStep(2);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-all cursor-pointer shadow-md"
                  >
                    (انقر) ضربة واحدة خفيفة باليدين على الصعيد الطاهر ✋
                  </button>
                </div>
              )}

              {/* Stage 2: Wipe Face & Hands */}
              {tayammumStep === 2 && (
                <div className="space-y-2 text-center w-full max-w-sm">
                  <span className="text-xs text-amber-200 block font-bold">الصفة الصحيحة لمسح التيمم باليدين:</span>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={() => triggerMistake('tayammum_action_sequence', 'السنة المعتمدة ضربة واحدة يمسح بها الوجه ثم ظاهر الكفين فقط، ولا يجب المسح إلى المرفقين في التيمم.')}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                    >
                      ❌ المسح عدة ضربات مع غسل المرفقين كالوضوء
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTayammumDone(true);
                        handleAction('إتمام صفة التيمم الشاملة بنجاح', ['tayammum_conditions', 'tayammum_action_sequence', 'tayammum_process']);
                      }}
                      className="p-2 rounded-xl bg-emerald-500/25 hover:bg-emerald-500/35 border border-emerald-400/50 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                    >
                      ✓ مسح الوجه باليدين ثم مسح ظاهري الكفين بضربة واحدة ✋
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SCENARIO 10: Street Mud Splashes */}
          {numericId === 10 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm">
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-center w-full">
                <Search className="w-5 h-5 text-amber-300 mx-auto mb-1" />
                <span className="text-xs font-black text-emerald-300 block">فحص رذاذ الوحل والطين</span>
                <span className="text-[10px] text-emerald-100">معفو عنه شرعاً • الأصل بقاء الطهارة</span>
              </div>

              <div className="grid grid-cols-1 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => triggerMistake('purity_street_mud_forgiveness', 'طين الشوارع ورذاذ الطرقات معفو عنه شرعاً للأصل وهو بقاء الطهارة ودفع الحرج والشقّة عن المسلم.')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ❌ غسل الثياب بالكامل وإعادة الوضوء بسبب رذاذ الطريق
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('اعتبار رذاذ الطريق معفواً عنه ومواصلة الصلاة', ['purity_street_mud_forgiveness', 'wudu_purity_concessions'])}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ✓ اعتبار رذاذ الطريق معفواً عنه ومواصلة الصلاة
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO 11: Seated Airplane Prayer */}
          {numericId === 11 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm">
              <div className="flex items-center justify-center gap-3 w-full">
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
                  <Plane className="w-4 h-4 text-sky-400 mb-1" />
                  <span className="text-[9px] text-sky-200 font-mono">في الجو ☁️</span>
                </div>

                <div className="p-2 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFlightPosture('takbeer')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      flightPosture === 'takbeer' ? 'bg-emerald-400 text-slate-900 shadow-md' : 'bg-white/10 text-white'
                    }`}
                  >
                    1. التكبير
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlightPosture('ruku')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      flightPosture === 'ruku' ? 'bg-emerald-400 text-slate-900 shadow-md' : 'bg-white/10 text-white'
                    }`}
                  >
                    2. الركوع
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlightPosture('sujud')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      flightPosture === 'sujud' ? 'bg-emerald-400 text-slate-900 shadow-md' : 'bg-white/10 text-white'
                    }`}
                  >
                    3. السجود
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => triggerMistake('prayer_airplane_travel_rules', 'لا يجوز إخراج الصلاة المكتوبة عن وقتها في السفر بالطائرة؛ بل تصلى بالجلوس والإيماء بالركوع والسجود حسب الاستطاعة.')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ❌ تأخير الصلاة المكتوبة حتى هبوط الطائرة وخروج وقتها
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('أداء الصلاة جالساً بالطائرة بالإيماء للركوع والسجود', ['prayer_airplane_travel_rules', 'travel_salah_concessions'])}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ✓ أداء الصلاة جالساً بالطائرة بالإيماء للركوع والسجود
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO 12: Train / Bus In-Motion Prayer */}
          {numericId === 12 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm">
              <svg viewBox="0 0 260 80" className="w-64 h-20">
                <rect x="20" y="10" width="220" height="60" rx="10" fill="#1E293B" stroke="#475569" strokeWidth="2" />
                <rect x="35" y="20" width="45" height="25" rx="4" fill="#38BDF8" fillOpacity="0.3" stroke="#38BDF8" strokeWidth="1" />
                <rect x="90" y="20" width="45" height="25" rx="4" fill="#38BDF8" fillOpacity="0.3" stroke="#38BDF8" strokeWidth="1" />
                <line x1="20" y1="55" x2="240" y2="55" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
                <text x="130" y="72" fontSize="8" fill="#38BDF8" fontWeight="bold" textAnchor="middle">الصلاة داخل وسائل النقل • التكبير لجهة القبلة</text>
              </svg>

              <div className="grid grid-cols-1 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => triggerMistake('prayer_train_bus_motion_rules', 'عند الصلاة في حافلة أو قطار يسوغ التمسك بالمقابض أو الجلوس لضمان الطمأنينة وعدم السقوط مع استقبال القبلة عند التكبير.')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ❌ القيام دون الاستناد للمقابض والمخاطرة بالسقوط
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('استقبال القبلة عند التكبير والصلاة بثبات وحفظ التوازن', ['prayer_train_bus_motion_rules', 'travel_salah_concessions'])}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ✓ استقبال القبلة عند التكبير والصلاة بثبات وحفظ التوازن
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO 13: Masbooq in Ruku */}
          {numericId === 13 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm">
              <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-center w-full">
                <span className="text-[10px] text-amber-200 block">الإمام راكع في الصف</span>
                <span className="text-xs font-black text-amber-300">تكبيرة الإحرام قائماً ➜ الهويّ للركوع</span>
              </div>

              <div className="grid grid-cols-1 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => triggerMistake('masbooq_ruku_takbeer_rules', 'تكبيرة الإحرام ركن لا بد أن تؤدى قائماً بانتصاب، ولا تجزئ إذا كبر وهو هويّ وانحناء للركوع.')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ❌ التكبير أثناء الانحناء للركوع مباشرة دون انتصاب
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('تكبيرة الإحرام قائماً بانتصاب ثم الهويّ للركوع مع الإمام', ['masbooq_ruku_takbeer_rules', 'jamaah_prayer_etiquettes'])}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ✓ تكبيرة الإحرام قائماً بانتصاب ثم الهويّ للركوع مع الإمام
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO 14: Airport Corner Prayer */}
          {numericId === 14 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm">
              <svg viewBox="0 0 240 80" className="w-60 h-20">
                <rect x="20" y="10" width="200" height="60" rx="8" fill="#0F172A" stroke="#334155" strokeWidth="2" />
                <line x1="60" y1="10" x2="60" y2="70" stroke="#64748B" strokeWidth="2" strokeDasharray="3 3" />
                <rect x="90" y="20" width="60" height="35" rx="4" fill="#10B981" fillOpacity="0.4" stroke="#10B981" strokeWidth="1.5" />
                <circle cx="120" cy="32" r="6" fill="#F59E0B" />
                <text x="120" y="65" fontSize="8" fill="#A7F3D0" fontWeight="bold" textAnchor="middle">بسط سجادة الجيب في ركن المطار الهادئ 🧭</text>
              </svg>

              <div className="grid grid-cols-1 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => triggerMistake('prayer_public_space_etiquettes', 'تُكره الصلاة في معابر الناس وممرات المطار؛ والمشروع اختيار ركن هادئ مع وضع سترة لراحة الخاشع والمارين.')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ❌ الصلاة وسط ممر المطار المزدحِم وإعاقة المسافرين
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('بسط سجادة الجيب في ركن هادئ بالمطار مع سترة', ['prayer_public_space_etiquettes', 'salah_focus_tranquility'])}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ✓ بسط سجادة الجيب في ركن هادئ بالمطار مع سترة
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO 15: Combining for Surgery */}
          {numericId === 15 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm">
              <div className="p-3 rounded-2xl bg-sky-500/20 border border-sky-400/30 text-center w-full">
                <Clock className="w-5 h-5 text-sky-300 mx-auto mb-1" />
                <span className="text-[10px] text-sky-200 font-bold block">الظهر + العصر</span>
                <span className="text-xs font-black text-sky-300">جمع تقديم / تأخير للعذر الطبي 🏥</span>
              </div>

              <div className="grid grid-cols-1 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => triggerMistake('prayer_medical_combining_rules', 'العمليات الجراحية الممتدة من الأعذار الشرعية المبيحة لجمع الصلاتين تقديمًا أو تأخيراً دون تفويت الفريضة.')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ❌ ترك الصلاة بالكامل وإهمالها دون جمع رخصة
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('جمع الصلاتين تقديمًا أو تأخيرًا بسبب الجراحة الطبية', ['prayer_medical_combining_rules', 'travel_salah_concessions'])}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ✓ جمع الصلاتين تقديمًا أو تأخيرًا بسبب الجراحة الطبية
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO 16: Non-Muslim Neighbor Gifts */}
          {numericId === 16 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm">
              <svg viewBox="0 0 200 70" className="w-48 h-16">
                <rect x="65" y="15" width="70" height="45" rx="8" fill="#D97706" stroke="#FDE68A" strokeWidth="2" />
                <line x1="100" y1="15" x2="100" y2="60" stroke="#FDE68A" strokeWidth="3" />
                <line x1="65" y1="37" x2="135" y2="37" stroke="#FDE68A" strokeWidth="3" />
                <text x="100" y="68" fontSize="8" fill="#FDE68A" fontWeight="bold" textAnchor="middle">حلويات الجيران المباحة 🎁</text>
              </svg>

              <div className="grid grid-cols-1 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => triggerMistake('social_ethics_nonmuslim_gifts', 'قبول هدايا الجيران غير المسلمين من البر والإحسان المأمور به شرعاً، ما لم تتضمن محرمات كالخنزير أو الخمر.')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ❌ رفض الهدية بفظاظة ظناً أن هدايا غير المسلمين محرمة
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('قبول الهدية المباحة بلطف وإحسان صلة للجوار', ['social_ethics_nonmuslim_gifts', 'interfaith_courtesy_ethics'])}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ✓ قبول الهدية المباحة بلطف وإحسان صلة للجوار
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO 17: Bank Usury Clause */}
          {numericId === 17 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm">
              <div
                onClick={() => {
                  playSoftTap();
                  setRibaStruck(!ribaStruck);
                }}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-700 w-full text-center cursor-pointer hover:border-amber-400 transition-all"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>عقد بنكي / إيجار</span>
                  <span className="text-amber-300">انقر لشطب الفائدة</span>
                </div>
                <div className={`p-2 rounded-xl text-xs font-bold transition-all ${ribaStruck ? 'bg-emerald-950/60 text-emerald-300 line-through border border-emerald-500/40' : 'bg-rose-950/60 text-rose-300 border border-rose-500/40'}`}>
                  {ribaStruck ? 'تم شطب شرط الفائدة الربوية 5% ✓' : 'بند 4: شرط غرامة تأخير بفائدة ربوية 5%'}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => triggerMistake('financial_ethics_riba_avoidance', 'الشرط الربوي محرم شرعاً؛ ويجب شطب الشرط الربوي من العقد أو تنظيم السداد التلقائي لتجنب غرامات التأخير الربوية.')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ❌ التوقيع على الشرط الربوي بالموافقة دون اعتراض
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('شطب بند الفائدة الربوية وتنظيم السداد المالي النقي', ['financial_ethics_riba_avoidance', 'halal_earnings_ethics'])}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ✓ شطب بند الفائدة الربوية وتنظيم السداد المالي النقي
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO 18: Supermarket Halal / Kosher Meat */}
          {numericId === 18 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm">
              <svg viewBox="0 0 220 70" className="w-56 h-16">
                <rect x="20" y="10" width="80" height="50" rx="8" fill="#047857" stroke="#34D399" strokeWidth="1.5" />
                <text x="60" y="32" fontSize="9" fill="#FFFFFF" fontWeight="bold" textAnchor="middle">ذبيحة أهل الكتاب</text>
                <text x="60" y="48" fontSize="8" fill="#A7F3D0" textAnchor="middle">حلال ومباحة</text>
                <rect x="120" y="10" width="80" height="50" rx="8" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" />
                <text x="160" y="32" fontSize="9" fill="#FFFFFF" fontWeight="bold" textAnchor="middle">مأكولات بحرية</text>
                <text x="160" y="48" fontSize="8" fill="#BAE6FD" textAnchor="middle">حلال طاهرة</text>
              </svg>

              <div className="grid grid-cols-1 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => triggerMistake('food_halal_kosher_rules', 'طعام أهل الكتاب (الذبح الكتابي) والأسماك حلال طاهر بنص القرآن الكريم، ولا يحرم إلا ما ذُبح لغير الله أو الخنزير.')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ❌ الامتناع عن جميع اللحوم والأسماك ظناً أنها محرمة
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('تناول الذبح الكتابي والمأكولات البحرية بطمأنينة', ['food_halal_kosher_rules', 'halal_earnings_ethics'])}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ✓ تناول الذبح الكتابي والمأكولات البحرية بطمأنينة
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO 19: Dining Near Alcohol */}
          {numericId === 19 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm">
              <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-center w-full">
                <Utensils className="w-5 h-5 text-amber-300 mx-auto mb-1" />
                <span className="text-xs font-black text-amber-300 block">طاولة عشاء العمل المستقلة</span>
              </div>

              <div className="grid grid-cols-1 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => triggerMistake('social_dining_alcohol_etiquettes', 'نهى النبي ﷺ عن الجلوس على مائدة يُدار عليها الخمر؛ والمشروع الجلوس على طاولة مستقلة خالية من المحرمات.')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ❌ الجلوس على نفس الطاولة التي يُسكَب عليها الخمر
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('الجلوس على طاولة مستقلة خالية من المحرمات وطلب الحلال', ['social_dining_alcohol_etiquettes', 'interfaith_courtesy_ethics'])}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ✓ الجلوس على طاولة مستقلة خالية من المحرمات وطلب الحلال
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO 20: Cashier Lottery Job */}
          {numericId === 20 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm">
              <div className="p-3 rounded-2xl bg-sky-500/20 border border-sky-400/30 text-center w-full">
                <Briefcase className="w-5 h-5 text-sky-300 mx-auto mb-1" />
                <span className="text-xs font-black text-sky-300 block">طلب النقل لقسم الأغذية الحلال</span>
              </div>

              <div className="grid grid-cols-1 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => triggerMistake('employment_lottery_gambling_rules', 'لا يجوز المباشرة في بيع تذاكر القمار واليانصيب؛ والمشروع طلب التبديل إلى قسم الأغذية الحلال.')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ❌ بيع تذاكر القمار واليانصيب مباشرة للزبائن
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('طلب النقل لقسم البضائع الحلال والتعفف عن القمار', ['employment_lottery_gambling_rules', 'halal_earnings_ethics'])}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ✓ طلب النقل لقسم البضائع الحلال والتعفف عن القمار
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO 21: Family Dinner Pork */}
          {numericId === 21 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm">
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-center w-full">
                <Users className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <span className="text-xs font-black text-emerald-300 block">صلة الرحم مع العائلة</span>
              </div>

              <div className="grid grid-cols-1 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => triggerMistake('family_pork_dinners_kinship', 'صلة الرحم واجبة مع الأهل؛ ويجوز تلبية الدعوة والأكل من الطعام المباح كالأرز والسمك مع الاعتذار بلطف عن المحرم.')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ❌ قطيعة الأهل ومقاطعة العشاء العائلي بصدام وجفاء
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('تلبية العشاء العائلي وأكل الطعام المباح مع الاعتذار بلطف', ['family_pork_dinners_kinship', 'interfaith_courtesy_ethics'])}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ✓ تلبية العشاء العائلي وأكل الطعام المباح مع الاعتذار بلطف
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO 22: Condolences for Non-Muslim Relative */}
          {numericId === 22 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm">
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-center w-full">
                <Heart className="w-5 h-5 text-rose-400 mx-auto mb-1" />
                <span className="text-xs font-black text-emerald-300 block">واجب العزاء والمواساة الإنسانية</span>
              </div>

              <div className="grid grid-cols-1 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => triggerMistake('interfaith_condolences_ethics', 'تعزية الأقارب غير المسلمين ومواساتهم بالكلام الطيب والتعاطف الإنساني من البر والإحسان المأمور به.')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ❌ الامتناع عن تعزية ومواساة الأقارب غير المسلمين
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('تقديم كلمات العزاء والمواساة الإنسانية بالبر والإحسان', ['interfaith_condolences_ethics', 'interfaith_courtesy_ethics'])}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ✓ تقديم كلمات العزاء والمواساة الإنسانية بالبر والإحسان
                </button>
              </div>
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
            <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm">
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-center w-full">
                <ShieldCheck className="w-5 h-5 text-emerald-300 mx-auto mb-1" />
                <span className="text-xs font-black text-emerald-200 block">الحلم الوقور والإعراض</span>
              </div>

              <div className="grid grid-cols-1 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => triggerMistake('social_mockery_patience', 'أمر الله بالإعراض عن الجاهلين والرد بالسلام والوقار والحلم دون الدخول في مشاحنات كلامية حادة.')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ❌ الدخول في مشادات كلامية حادة وتبادل الإهانات
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('الرد بالسلام والوقار والحلم والإعراض عن الاستفزاز', ['social_mockery_patience', 'interfaith_courtesy_ethics'])}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ✓ الرد بالسلام والوقار والحلم والإعراض عن الاستفزاز
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO 25: Overnight at In-Laws */}
          {numericId === 25 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm">
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-center w-full">
                <Home className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <span className="text-xs font-black text-emerald-300 block">المبيت عند الأصهار بإحسان</span>
              </div>

              <div className="grid grid-cols-1 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => triggerMistake('inlaws_overnight_prayer_confidence', 'لا حياء في أداء فرائض الله؛ والمشروع أداء الصلاة بالسكينة في الغرفة المخصصة مع احترام العائلة تقديم الهدايا.')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ❌ ترك الصلاة حياءً وخجلاً من عائلة الزوج/الزوجة
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('أداء الصلاة بسكينة في الغرفة مع المداراة والإحسان لأصهارك', ['inlaws_overnight_prayer_confidence', 'salah_focus_tranquility'])}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ✓ أداء الصلاة بسكينة في الغرفة مع المداراة والإحسان لأصهارك
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO 26: Guilt Over Past Life */}
          {numericId === 26 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm">
              <div
                onClick={() => {
                  playPeaceChime();
                  setPadlockOpen(!padlockOpen);
                }}
                className="p-3 rounded-2xl bg-amber-500/20 border-2 border-amber-400/40 text-center cursor-pointer hover:bg-amber-500/30 transition-all shadow-lg w-full"
              >
                <span className="text-2xl block mb-1">{padlockOpen ? '🔓' : '🔒'}</span>
                <span className="text-xs font-black text-amber-200 block">
                  {padlockOpen ? 'انحلال قيد الماضي بنور المغفرة ✨' : 'قيد الذنوب السابقة (انقر لفك القيد)'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => triggerMistake('heart_repentance_islam_erases_past', '«الإسلام يهدم ما كان قبله»؛ دخولك في الإسلام يمحو جميع الذنوب والخطايا السابقة وتصبح صحيفتك نقية بيضاء.')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ❌ القنوط والشعور بعقدة الذنب وتعذيب الذات على الماضي
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPadlockOpen(true);
                    handleAction('فك قيد الذنوب واليقين الشامل بمغفرة الله ومحو ما سبق', ['heart_repentance_islam_erases_past', 'faith_certainty_peace']);
                  }}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ✓ فك قيد الذنوب واليقين الشامل بمغفرة الله ومحو ما سبق
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO 27: Conflicting Online Fatwas */}
          {numericId === 27 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full">
              <div className="p-3.5 rounded-2xl bg-[#0F172A] border border-amber-500/30 w-full max-w-sm text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-amber-300" />
                  <span className="text-xs font-black text-amber-200">تقييم الفتاوى الرقمية والمصادر المعتمدة</span>
                </div>
                <div className="space-y-2 text-start">
                  <button
                    type="button"
                    onClick={() => triggerMistake('source_evaluation_credibility', 'تتبع المجموعات والفتاوى المجهولة التي تشيع التشدد والتجريح يورث الحيرة، والواجب الأخذ برأي الدور الإفتائية المعتمدة ومهيع التيسير.')}
                    className="w-full p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-medium cursor-pointer transition-all flex items-center justify-between"
                  >
                    <span>❌ فتوى مجهولة في منشور عابر ينشر التشديد والتنطع</span>
                    <span className="text-[10px] text-rose-300 font-bold px-2 py-0.5 rounded bg-rose-950/60 shrink-0">غير معتمد</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction('الأخذ برأي المؤسسات الإفتائية المعتمدة والتيسير النبوي', ['source_evaluation_credibility', 'fiqh_diversity_tolerance'])}
                    className="w-full p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold cursor-pointer transition-all flex items-center justify-between"
                  >
                    <span>✓ فتوى مؤسسة رسمية معتمدة (مثل دور الإفتاء) بمهيع التيسير</span>
                    <span className="text-[10px] text-emerald-300 font-bold px-2 py-0.5 rounded bg-emerald-950/60 shrink-0">مصدر موثوق</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SCENARIO 28: Work Prayer Breaks */}
          {numericId === 28 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm">
              <div
                onClick={() => {
                  playPeaceChime();
                  setPrayerBreakBooked(!prayerBreakBooked);
                }}
                className={`p-3 rounded-2xl border text-center w-full cursor-pointer transition-all ${
                  prayerBreakBooked
                    ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 shadow-lg'
                    : 'bg-sky-500/20 border-sky-400/30 text-sky-200'
                }`}
              >
                <Calendar className="w-5 h-5 text-sky-300 mx-auto mb-1" />
                <span className="text-xs font-black block">
                  {prayerBreakBooked ? 'تم حجز استراحة الصلاة في التقويم (12:30 PM) ✓' : 'حجز 10 دقائق لصلاة الظهر في العمل'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => triggerMistake('workplace_prayer_break_management', 'تنسيق وقت الصلاة في العمل عبر حجز استراحة قصيرة في التقويم يضمن الفريضة دون إخلال بمهام الوظيفية.')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ❌ التفريط في الصلاة وتأخيرها أو تركها في بيئة العمل
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPrayerBreakBooked(true);
                    handleAction('حجز استراحة صلاة قصيرة في تقويم العمل بانتظام', ['workplace_prayer_break_management', 'salah_focus_tranquility']);
                  }}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ✓ حجز استراحة صلاة قصيرة في تقويم العمل بانتظام
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO 29: Recitation Concession (Non-Arabic) */}
          {numericId === 29 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm">
              <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-center w-full">
                <span className="text-xs font-black text-amber-200 block">الذكر البديل حتى إتقان الفاتحة:</span>
                <span className="text-xs text-emerald-300 font-bold block mt-1">
                  (سبحان الله، والحمد لله، ولا إله إلا الله، والله أكبر)
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => triggerMistake('non_arabic_recitation_concession', 'من عجز عن قراءة الفاتحة في أدايته الأولى يجزئه الذكر (التسبيح والتحميد والتكبير) وتصح صلاته بالكامل مع الاستمرار بالتعلم.')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ❌ التوقف عن الصلاة بالكامل حتى إتقان اللغة العربية والقرآن
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('قراءة التسبيح والذكر البديل أثناء أداء الصلاة مع التعلم التدريجي', ['non_arabic_recitation_concession', 'salah_focus_tranquility'])}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ✓ قراءة التسبيح والذكر البديل أثناء أداء الصلاة مع التعلم التدريجي
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO 30: Zakat al-Fitr (Traditional Sa'a Bowl + Digital Scale) */}
          {numericId === 30 && (
            <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm">
              <div className="flex items-center justify-center gap-3 w-full">
                <svg viewBox="0 0 120 70" className="w-28 h-16">
                  <path d="M 20 25 Q 60 10 100 25 L 90 60 Q 60 68 30 60 Z" fill="#854D0E" stroke="#A16207" strokeWidth="2" />
                  <ellipse cx="60" cy="25" rx="40" ry="12" fill="#FEF08A" stroke="#FDE047" strokeWidth="1.5" />
                  <text x="60" y="50" fontSize="8" fill="#FEF9C3" fontWeight="bold" textAnchor="middle">صاع نبوي (أرز)</text>
                </svg>

                <div className="p-2.5 rounded-2xl bg-emerald-500/25 border-2 border-emerald-400 text-center shadow-lg">
                  <Scale className="w-4 h-4 text-emerald-300 mx-auto mb-0.5" />
                  <span className="text-lg font-black text-emerald-200">{saCount} كجم</span>
                  <span className="text-[9px] text-emerald-100 block font-bold">طعام المستحقين</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => triggerMistake('zakat_fitr_timing_amount', 'تخرج زكاة الفطر قُبيل صلاة العيد (صاع من طعام ~2.5 كجم) طهرة للصائم وطعمة للمساكين، ولا تُؤخر عن صلاة العيد إلا بعذر.')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ❌ تأخير إخراج زكاة الفطر إلى ما بعد انتهاء صلاة العيد
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('إخراج الصاع النبوي من الطعام للمساكين قبل صلاة العيد', ['zakat_fitr_timing_amount', 'zakat_purification_ethics'])}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-start transition-all cursor-pointer"
                >
                  ✓ إخراج الصاع النبوي من الطعام للمساكين قبل صلاة العيد
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MISTAKE FEEDBACK ALERT BOX */}
        {mistakeFeedback && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-950/80 border-2 border-rose-400 text-rose-100 text-xs sm:text-sm font-medium space-y-2 animate-fade-in relative z-10 shadow-xl">
            <div className="flex items-center justify-between font-bold text-rose-300">
              <span className="flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>توجيه تصحيحي للموقف</span>
              </span>
              <button
                type="button"
                onClick={() => setMistakeFeedback(null)}
                className="text-[11px] text-rose-200 bg-rose-900/60 hover:bg-rose-900 px-2.5 py-1 rounded-lg border border-rose-400/40 cursor-pointer transition-all flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>إعادة المحاولة والتصحيح</span>
              </button>
            </div>
            <p className="leading-relaxed text-rose-100">{mistakeFeedback}</p>
          </div>
        )}

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
