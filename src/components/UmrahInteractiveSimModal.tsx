import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Compass,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Award,
  ChevronRight,
  ChevronLeft,
  X,
  Volume2,
  Footprints,
  Droplets,
  Scissors,
  HelpCircle,
  Share2,
  ArrowRight,
  Heart,
  ShieldCheck
} from 'lucide-react';
import { playPeaceChime, playSoftTap, playStressReleaseTone, playWaterPour, playTakbeerTone, playFanfare } from '../utils/audio';
import { recordScenarioAttempt } from '../services/learningStateManager';
import { Language } from '../types';

interface UmrahInteractiveSimModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
  onAdjustScore?: (delta: number, reason: string, type: 'peace' | 'stress') => void;
  userGender?: 'male' | 'female';
}

type UmrahStage = 'intro' | 'ihram' | 'tawaf' | 'maqam' | 'sai' | 'tahallul' | 'quiz' | 'celebration';

interface QuizQuestion {
  id: number;
  questionAr: string;
  questionEn: string;
  optionsAr: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationAr: string;
  explanationEn: string;
  hadithSource: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    questionAr: 'من أين يبدأ المعتمر كل شوط من أشواط الطواف وأين ينتهي؟',
    questionEn: 'Where does the pilgrim begin and end each circuit of Tawaf?',
    optionsAr: [
      'يبدأ من الركن اليماني وينتهي عنده',
      'يبدأ بمحاذاة الحجر الأسود وينتهي بمحاذاته',
      'يبدأ من مقام إبراهيم وينتهي عند الحجر',
      'يبدأ من حجر إسماعيل وينتهي بالصفا'
    ],
    optionsEn: [
      'Starts and ends at the Yemeni Corner',
      'Starts aligned with the Black Stone and ends aligned with it',
      'Starts at Station of Ibrahim and ends at Black Stone',
      'Starts at Hijr Ismail and ends at Safa'
    ],
    correctIndex: 1,
    explanationAr: 'يبدأ الطواف من محاذاة الحجر الأسود بالتكبير، وينتهي كل شوط بمحاذاته تماماً، وهكذا لسبعة أشواط متتالية.',
    explanationEn: 'Tawaf begins by aligning with the Black Stone with Takbeer, and each circuit ends exactly at it for seven continuous rounds.',
    hadithSource: 'صحيح البخاري ومسلم - حديث جابر الطويل في صفة حجة النبي ﷺ'
  },
  {
    id: 2,
    questionAr: 'في أي أشواط الطواف يُسن الرمل (الإسراع في المشي) والاضطباع للرجل؟',
    questionEn: 'In which circuits of Tawaf are Raml (brisk walking) and Idtiba recommended for men?',
    optionsAr: [
      'في جميع الأشواط السبعة',
      'في الأشواط الثلاثة الأولى فقط',
      'في الشوطين الأخيرين فقط',
      'في الشوط الأول والسابع'
    ],
    optionsEn: [
      'In all seven circuits',
      'In the first three circuits only',
      'In the last two circuits only',
      'In the first and seventh circuits'
    ],
    correctIndex: 1,
    explanationAr: 'يسن للرجل في طواف القدوم الرمل في الأشواط الثلاثة الأولى، والمشي المعتاد في الأربعة الباقية، مع كشف الكتف الأيمن (الاضطباع) في كل طوافه.',
    explanationEn: 'It is recommended for men to walk briskly (Raml) in the first three circuits only, and walk normally in the remaining four, with right shoulder exposed.',
    hadithSource: 'صحيح البخاري (1603) عن ابن عمر رضي الله عنهما'
  },
  {
    id: 3,
    questionAr: 'أين ينتهي الشوط السابع والأخير في السعي بين الصفا والمروة؟',
    questionEn: 'Where does the seventh and final circuit of Sa’i end?',
    optionsAr: [
      'عند جبل الصفا',
      'عند جبل المروة',
      'عند مقام إبراهيم',
      'بين العلمين الأخضرين'
    ],
    optionsEn: [
      'At Mount Safa',
      'At Mount Marwa',
      'At the Station of Ibrahim',
      'Between the two green markers'
    ],
    correctIndex: 1,
    explanationAr: 'يبدأ السعي من الصفا، والذهاب من الصفا للمروة شوط (1)، والعودة شوط (2)، فينتهي الشوط السابع حتماً عند المروة.',
    explanationEn: 'Sa’i begins at Safa: going Safa to Marwa is circuit 1, returning to Safa is circuit 2, so the 7th circuit naturally ends at Marwa.',
    hadithSource: 'صحيح مسلم (1218) - قوله ﷺ: "ابدؤوا بما بدأ الله به"'
  },
  {
    id: 4,
    questionAr: 'ما هو الذكر المأثور الذي كان النبي ﷺ يكرره بين الركن اليماني والحجر الأسود؟',
    questionEn: 'What is the prophetic supplication recited between the Yemeni Corner and Black Stone?',
    optionsAr: [
      'سبحان الله وبحمده سبحان الله العظيم',
      'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
      'لا إله إلا الله وحده لا شريك له له الملك وله الحمد',
      'اللهم إني أسألك الفردوس الأعلى'
    ],
    optionsEn: [
      'Subhan Allahi wa bihamdihi',
      'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina ‘adhaban-nar',
      'La ilaha illallah wahdahu la shareeka lah',
      'Allahumma inni as-aluka al-firdaws'
    ],
    correctIndex: 1,
    explanationAr: 'كان من هدي النبي ﷺ إذا مر بين الركن اليماني والحجر الأسود أن يدعو: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ".',
    explanationEn: 'It is Sunnah to recite: "Our Lord, give us in this world good and in the Hereafter good and protect us from the punishment of the Fire."',
    hadithSource: 'سنن أبي داود (1892) بإسناد حسن'
  },
  {
    id: 5,
    questionAr: 'ماذا تفعل المرأة عند التحلل من العمرة؟',
    questionEn: 'What does a woman do to conclude her Umrah (Tahallul)?',
    optionsAr: [
      'تحلق رأسها بالموس كلياً',
      'تقص من أطراف شعرها قدر أنملة (نحو 2 سم) فقط ولا تحلق',
      'تتصدق بشاة دون قص شعر',
      'تصلي أربع ركعات بدلاً من التقصير'
    ],
    optionsEn: [
      'Shaves her head completely with a razor',
      'Trims the tips of her hair by a fingertip length (approx 2 cm) without shaving',
      'Gives charity instead of cutting hair',
      'Prays 4 rak’ahs instead of trimming'
    ],
    correctIndex: 1,
    explanationAr: 'ليس على النساء حلق وإنما عليهن التقصير؛ فتجمع المرأة أطراف شعرها وتقص منه قدر رأس الإصبع (أنملة).',
    explanationEn: 'Women do not shave; rather they trim approximately the length of a fingertip (~2 cm) from the ends of their hair.',
    hadithSource: 'سنن أبي داود (1985) - قوله ﷺ: "ليس على النساء حلق وإنما على النساء التقصير"'
  },
  {
    id: 6,
    questionAr: 'إذا شك المعتمر في عدد أشواط الطواف أثناء الطواف، ماذا يفعل؟',
    questionEn: 'If a pilgrim doubts the number of circuits during Tawaf, what should they do?',
    optionsAr: [
      'يبني على الأكثر ويخرج فوراً',
      'يبني على اليقين وهو الأقل ويكمل ما بقي',
      'يعيد الطواف كاملاً من الشوط الأول',
      'يتوقف ويصلي ركعتين للسهو'
    ],
    optionsEn: [
      'Assume the higher number and conclude immediately',
      'Build upon certainty (the lesser number) and complete the remainder',
      'Restart the entire Tawaf from circuit one',
      'Stop and pray two prostrations of forgetfulness'
    ],
    correctIndex: 1,
    explanationAr: 'القاعدة الفقهية النبوية في الطواف والصلاة: البناء على اليقين وهو الأقل، فإذا شك هل طاف 3 أو 4، بنى على 3 وأتمّ سبعة أشواط.',
    explanationEn: 'The prophetic jurisprudence principle is to build upon certainty (the lesser number). If doubting 3 or 4, count as 3 and complete 7.',
    hadithSource: 'المجموع للنووي (8/21) والفتاوى الكبرى لابن تيمية'
  }
];

export const UmrahInteractiveSimModal: React.FC<UmrahInteractiveSimModalProps> = ({
  isOpen,
  onClose,
  lang = 'ar',
  onAdjustScore,
  userGender = 'male'
}) => {
  const isAr = lang === 'ar';

  // Navigation State
  const [currentStage, setCurrentStage] = useState<UmrahStage>('intro');
  const [completedStages, setCompletedStages] = useState<string[]>([]);

  // Stage 1: Ihram & Talbiyah State
  const [talbiyahCount, setTalbiyahCount] = useState<number>(0);
  const [ihramChecks, setIhramChecks] = useState<{ [key: string]: boolean }>({});

  // Stage 2: Tawaf State
  const [tawafRound, setTawafRound] = useState<number>(1);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [tawafDuaShown, setTawafDuaShown] = useState<boolean>(false);

  // Stage 3: Maqam & Zamzam State
  const [prayedAtMaqam, setPrayedAtMaqam] = useState<boolean>(false);
  const [drankZamzam, setDrankZamzam] = useState<boolean>(false);

  // Stage 4: Sa'i State
  const [saiRound, setSaiRound] = useState<number>(1);
  const [isWalkingSai, setIsWalkingSai] = useState<boolean>(false);
  const [isInGreenZone, setIsInGreenZone] = useState<boolean>(false);

  // Stage 5: Tahallul State
  const [tahallulChoice, setTahallulChoice] = useState<'halq' | 'taqsir' | null>(null);

  // Stage 6: Quiz State
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      // Don't wipe if user resumes, but if pristine:
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const markStageComplete = (stage: string) => {
    if (!completedStages.includes(stage)) {
      setCompletedStages((prev) => [...prev, stage]);
    }
  };

  // Stage 1 Handlers
  const handleTalbiyah = () => {
    playPeaceChime();
    setTalbiyahCount((c) => c + 1);
  };

  const toggleIhramCheck = (id: string) => {
    playSoftTap();
    setIhramChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Stage 2 Handlers (Tawaf)
  const handleNextTawafRound = () => {
    if (tawafRound >= 7) {
      markStageComplete('tawaf');
      playFanfare();
      setCurrentStage('maqam');
      return;
    }
    playTakbeerTone();
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(25);
    }
    setIsRotating(true);
    setTimeout(() => {
      setTawafRound((r) => r + 1);
      setIsRotating(false);
      setTawafDuaShown(true);
    }, 400);
  };

  // Stage 4 Handlers (Sa'i)
  const handleNextSaiRound = () => {
    if (saiRound >= 7) {
      markStageComplete('sai');
      playPeaceChime();
      setCurrentStage('tahallul');
      return;
    }
    playSoftTap();
    setIsWalkingSai(true);
    setIsInGreenZone(true);
    setTimeout(() => {
      setSaiRound((r) => r + 1);
      setIsWalkingSai(false);
      setIsInGreenZone(false);
    }, 450);
  };

  // Stage 6 Handlers (Quiz)
  const handleSelectQuizAnswer = (qId: number, optIndex: number) => {
    if (quizSubmitted) return;
    playSoftTap();
    setQuizAnswers((prev) => ({ ...prev, [qId]: optIndex }));
  };

  const handleSubmitQuiz = () => {
    playFanfare();
    let correct = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    setQuizScore(correct);
    setQuizSubmitted(true);

    if (correct >= 4) {
      markStageComplete('quiz');
      if (onAdjustScore) {
        onAdjustScore(30, isAr ? '+30 إتقان مناسك العمرة والاختبار النبوي' : '+30 Umrah Rituals Mastery', 'peace');
      }
      // Record real learning state
      recordScenarioAttempt('UMRAH_SIMULATION', true, ['umrah_ihram_miqat', 'umrah_tawaf_etiquette', 'umrah_sai_order', 'umrah_halq_taqsir'], 'pilgrimage_umrah');
    }
  };

  const handleRestart = () => {
    playSoftTap();
    setCurrentStage('intro');
    setTawafRound(1);
    setSaiRound(1);
    setPrayedAtMaqam(false);
    setDrankZamzam(false);
    setTahallulChoice(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#FAF9F5] border border-amber-400/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-start"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0d1624] via-[#16253c] to-[#0b1320] text-white flex items-center justify-between border-b border-amber-500/30 relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-2xl shrink-0">
              🕋
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>{isAr ? 'محاكاة تفاعلية مسندة بالسنة' : 'Prophetic Grounded Simulator'}</span>
                </span>
                <span className="text-[11px] text-amber-300 font-bold hidden sm:inline">
                  {isAr ? 'مناسك خطوة بخطوة + اختبار الإتقان' : 'Step-by-Step + Mastery Quiz'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-100 flex items-center gap-2 mt-0.5">
                <span>{isAr ? 'محاكي مناسك العمرة التفاعلي' : 'Interactive Umrah Rituals Simulator'}</span>
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playSoftTap();
              onClose();
            }}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stage Navigation Stepper Tabs */}
        <div className="bg-[#F2ECE1] border-b border-[#E0D5C3] px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { id: 'intro', labelAr: 'البداية', labelEn: 'Intro', icon: '✨' },
            { id: 'ihram', labelAr: '1. الميقات والإحرام', labelEn: '1. Ihram', icon: '🕊️' },
            { id: 'tawaf', labelAr: '2. طواف الكعبة', labelEn: '2. Tawaf', icon: '🕋' },
            { id: 'maqam', labelAr: '3. المقام وزمزم', labelEn: '3. Maqam', icon: '💧' },
            { id: 'sai', labelAr: '4. السعي (الصفا والمروة)', labelEn: '4. Sa’i', icon: '🚶' },
            { id: 'tahallul', labelAr: '5. الحلق والتحلل', labelEn: '5. Tahallul', icon: '✂️' },
            { id: 'quiz', labelAr: '6. اختبار الإتقان', labelEn: '6. Quiz', icon: '🏆' },
          ].map((st) => {
            const isActive = currentStage === st.id;
            const isDone = completedStages.includes(st.id);
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  playSoftTap();
                  setCurrentStage(st.id as UmrahStage);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#2C483F] text-amber-200 shadow-sm ring-1 ring-amber-400/50'
                    : isDone
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-white/80 hover:bg-white text-stone-700'
                }`}
              >
                <span>{st.icon}</span>
                <span>{isAr ? st.labelAr : st.labelEn}</span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            );
          })}
        </div>

        {/* Modal Main Body */}
        <div className="p-5 sm:p-7 overflow-y-auto grow space-y-6">
          {/* ===================== STAGE: INTRO ===================== */}
          {currentStage === 'intro' && (
            <div className="space-y-6 max-w-2xl mx-auto py-4 text-center">
              <div className="w-20 h-20 rounded-full bg-amber-100 border-2 border-amber-300 text-4xl flex items-center justify-center mx-auto shadow-inner">
                🕋
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#1e2e28]">
                  {isAr ? 'عمرة مبرورة وسعي مشكور' : 'An Accepted Umrah & Rewarded Journey'}
                </h3>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl mx-auto">
                  {isAr
                    ? 'عش تجربة العمرة النبوية التفاعلية خطوة بخطوة بالترتيب الشرعي الصحيح، بدءاً من الميقات والإحرام، مروراً بالطواف والسعي، وصولاً للتحلل والاختبار التفاعلي الختامي لترسيخ فقه المناسك.'
                    : 'Experience the prophetic Umrah journey step-by-step in authentic order: from Miqat and Ihram, through Tawaf and Sa’i, to Tahallul and a comprehensive mastery quiz.'}
                </p>
              </div>

              {/* Pillars Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-start">
                {[
                  { titleAr: 'الإحرام', titleEn: 'Ihram', descAr: 'نية الدخول في النسك', descEn: 'Sacred intention', icon: '🕊️' },
                  { titleAr: 'الطواف', titleEn: 'Tawaf', descAr: 'سبعة أشواط حول الكعبة', descEn: '7 rounds around Kaaba', icon: '🕋' },
                  { titleAr: 'السعي', titleEn: 'Sa’i', descAr: 'سبعة أشواط بين الصفا والمروة', descEn: '7 circuits Safa-Marwa', icon: '🚶' },
                  { titleAr: 'التحلل', titleEn: 'Tahallul', descAr: 'الحلق أو التقصير', descEn: 'Shaving or trimming', icon: '✂️' },
                ].map((pillar, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-white border border-[#E4D9C8] shadow-xs space-y-1">
                    <span className="text-xl">{pillar.icon}</span>
                    <h4 className="text-sm font-black text-[#2C483F]">{isAr ? pillar.titleAr : pillar.titleEn}</h4>
                    <p className="text-[11px] text-stone-500">{isAr ? pillar.descAr : pillar.descEn}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    playPeaceChime();
                    setCurrentStage('ihram');
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-900 text-white font-black text-base shadow-lg shadow-emerald-800/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mx-auto"
                >
                  <span>{isAr ? 'ابدأ المناسك الآن من الميقات' : 'Start Rituals at Al-Miqat'}</span>
                  <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* ===================== STAGE 1: IHRAM ===================== */}
          {currentStage === 'ihram' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 text-xl shrink-0">🕊️</div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-emerald-950">
                    {isAr ? 'المرحلة 1: الميقات ولبس الإحرام والتلبية' : 'Stage 1: Al-Miqat, Ihram Garb & Talbiyah'}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                    {isAr
                      ? 'يصل المعتمر إلى الميقات؛ فيغتسل ويتطيب في بدنه (لا في ثياب إحرامه)، ويلبس الرجل إزاراً ورداءً أبيضين نعلين، وتلبس المرأة لباسها الساتر دون نقاب أو قفازين، ثم ينوي بقلبه: "لَبَّيْكَ اللَّهُمَّ عُمْرَةً".'
                      : 'At the Miqat, the pilgrim performs Ghusl, scents their body, and dons clean unstitched garments (men) or modest loose attire without face veil (women), intending: "Labbayka Allahumma Umrah".'}
                  </p>
                </div>
              </div>

              {/* Interactive Talbiyah Station */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-[#121E36] to-[#0A1224] text-white space-y-4 shadow-md border border-amber-400/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span className="text-xs font-bold text-amber-200">
                      {isAr ? 'تكرار التلبية النبوية (اضغط للتلبية)' : 'Prophetic Talbiyah Repetition'}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                    {isAr ? `رددت التلبية: ${talbiyahCount} مرة` : `Talbiyah: ${talbiyahCount}x`}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
                  <p className="text-lg sm:text-xl font-black text-amber-100 font-arabic leading-loose">
                    « لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ لاَ شَرِيكَ لَكَ »
                  </p>
                  <p className="text-xs text-stone-300">
                    {isAr
                      ? 'يرفع الرجال أصواتهم بالتلبية، وتخفض النساء أصواتهن.'
                      : 'Men raise their voices with Talbiyah; women recite softly.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleTalbiyah}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-sm transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-stone-950" />
                  <span>{isAr ? 'اضغط لترديد التلبية النبوية 🌿' : 'Tap to Repeat Talbiyah 🌿'}</span>
                </button>
              </div>

              {/* Interactive Dos and Don'ts of Ihram */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-stone-700 uppercase tracking-wider">
                  {isAr ? 'تأكد من معرفتك بمحظورات الإحرام (اضغط على ما يجتنبه المحرم):' : 'Key Prohibitions of Ihram:'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'hair', textAr: 'قص أو حلق شعر الرأس أو البدن', textEn: 'Cutting hair of head or body', forbidden: true },
                    { id: 'perfume', textAr: 'التطيب بعد عقد الإحرام', textEn: 'Using perfume after Ihram', forbidden: true },
                    { id: 'nails', textAr: 'قص الأظافر', textEn: 'Clipping nails', forbidden: true },
                    { id: 'head_men', textAr: 'تغطية الرأس بملاصق (للرجال)', textEn: 'Covering head with direct headgear (men)', forbidden: true },
                    { id: 'stitched_men', textAr: 'لبس المخيط المفصل كالقميص (للرجال)', textEn: 'Wearing stitched fitted clothes (men)', forbidden: true },
                    { id: 'bath', textAr: 'الاغتسال للتنظف أو التبرد (جائز بلا حرج)', textEn: 'Taking a bath for cleanliness (Permissible)', forbidden: false },
                  ].map((rule) => {
                    const checked = !!ihramChecks[rule.id];
                    return (
                      <button
                        key={rule.id}
                        type="button"
                        onClick={() => toggleIhramCheck(rule.id)}
                        className={`p-3 rounded-2xl border text-start transition-all flex items-center justify-between cursor-pointer ${
                          checked
                            ? rule.forbidden
                              ? 'bg-rose-50 border-rose-300 text-rose-950'
                              : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                            : 'bg-white border-[#E0D5C3] text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{rule.forbidden ? '🚫' : '✅'}</span>
                          <span className="text-xs font-bold">{isAr ? rule.textAr : rule.textEn}</span>
                        </div>
                        {checked && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Progress to Stage 2 */}
              <div className="pt-2 flex justify-between items-center border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setCurrentStage('intro')}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-bold cursor-pointer"
                >
                  {isAr ? 'الرجوع للمقدمة' : 'Back to Intro'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    markStageComplete('ihram');
                    playPeaceChime();
                    setCurrentStage('tawaf');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isAr ? 'المتابعة إلى طواف الكعبة' : 'Proceed to Tawaf'}</span>
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* ===================== STAGE 2: TAWAF ===================== */}
          {currentStage === 'tawaf' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900 text-xl shrink-0">🕋</div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-amber-950">
                    {isAr ? 'المرحلة 2: طواف العمرة حول الكعبة المشرفة (7 أشواط)' : 'Stage 2: Tawaf Around the Holy Kaaba (7 Circuits)'}
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                    {isAr
                      ? 'يبدأ المعتمر كل شوط من محاذاة الحجر الأسود مستقبلاً له ومكبّراً: "بسم الله والله أكبر". يطوف سبعة أشواط جاعلاً الكعبة عن يساره، ويُسن للرجل الرمل في الثلاثة الأولى، ويسن الدعاء بين الركنين.'
                      : 'Start each circuit aligned with the Black Stone with Takbeer: "Bismillah Allahu Akbar". Keep the Kaaba on your left for 7 rounds. Men jog briskly in rounds 1-3.'}
                  </p>
                </div>
              </div>

              {/* Kaaba Interactive 2D Simulator */}
              <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#1c2438] via-[#0f172a] to-[#070b13] border border-amber-400/40 text-white flex flex-col items-center justify-center min-h-[340px] shadow-inner overflow-hidden">
                {/* Circuit Counter Badge */}
                <div className="absolute top-4 start-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-mono font-bold">
                    {isAr ? `الشوط الحركي: ${tawafRound} من 7` : `Circuit: ${tawafRound} of 7`}
                  </span>
                  {tawafRound <= 3 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                      {isAr ? 'سنّة الرمل والاضطباع نشطة' : 'Raml & Idtiba Sunnah Active'}
                    </span>
                  )}
                </div>

                {/* Central Kaaba Graphic */}
                <div className="relative my-6 flex items-center justify-center">
                  {/* Rotating Orbit Path */}
                  <div
                    className={`w-64 h-64 sm:w-72 sm:h-72 rounded-full border-2 border-dashed border-amber-300/30 flex items-center justify-center transition-all duration-500 ${
                      isRotating ? 'rotate-45 scale-105 border-amber-400' : ''
                    }`}
                  >
                    {/* Pilgrim Marker */}
                    <div
                      className="absolute w-8 h-8 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold text-white transition-all duration-300"
                      style={{
                        top: tawafRound % 2 === 0 ? '12px' : 'auto',
                        bottom: tawafRound % 2 !== 0 ? '12px' : 'auto',
                        left: tawafRound > 3 ? '12px' : 'auto',
                        right: tawafRound <= 3 ? '12px' : 'auto',
                      }}
                    >
                      {tawafRound}
                    </div>

                    {/* The Kaaba (Center Cube) */}
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-gradient-to-br from-stone-900 to-black border-2 border-amber-400 shadow-2xl flex flex-col items-center justify-center relative">
                      <div className="absolute top-3 inset-x-2 h-2.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 rounded-sm" />
                      <div className="absolute top-7 inset-x-4 h-1 bg-amber-400/70" />
                      <span className="text-xl sm:text-2xl mt-4 font-black text-amber-200">الكعبة</span>
                      <span className="text-[9px] text-amber-400 font-mono">Al-Kaaba</span>

                      {/* Black Stone Corner Highlight */}
                      <div
                        className="absolute -bottom-1 -end-1 w-5 h-5 rounded-full bg-stone-950 border-2 border-amber-400 flex items-center justify-center"
                        title="الحجر الأسود"
                      >
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dua Banner between Yemeni Corner and Black Stone */}
                <div className="w-full max-w-lg p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-amber-400/30 text-center space-y-1">
                  <span className="text-[10px] font-bold text-amber-300 flex items-center justify-center gap-1">
                    <Heart className="w-3 h-3 text-rose-400" />
                    <span>{isAr ? 'دعاء ما بين الركن اليماني والحجر الأسود:' : 'Dua Between Yemeni Corner & Black Stone:'}</span>
                  </span>
                  <p className="text-xs sm:text-sm font-arabic font-bold text-amber-100">
                    « رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ »
                  </p>
                </div>

                {/* Circuit Advancing Button */}
                <div className="mt-5 w-full max-w-sm">
                  <button
                    type="button"
                    onClick={handleNextTawafRound}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>
                      {tawafRound < 7
                        ? isAr
                          ? `أكمل الشوط (${tawafRound}/7) وكبّر عند الحجر الأسود 🕋`
                          : `Complete Circuit (${tawafRound}/7) & Takbeer`
                        : isAr
                        ? 'إتمام الطواف (7/7) والمتابعة إلى مقام إبراهيم 🌿'
                        : 'Finish Tawaf & Proceed to Maqam Ibrahim'}
                    </span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                </div>
              </div>

              {/* Back / Skip Controls */}
              <div className="flex justify-between items-center border-t border-stone-200 pt-3">
                <button
                  type="button"
                  onClick={() => setCurrentStage('ihram')}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-bold cursor-pointer"
                >
                  {isAr ? 'السابق: الإحرام' : 'Previous: Ihram'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    markStageComplete('tawaf');
                    playPeaceChime();
                    setCurrentStage('maqam');
                  }}
                  className="px-4 py-2 rounded-xl text-emerald-800 hover:bg-emerald-50 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>{isAr ? 'تخطي إلى ركعتي الطواف' : 'Skip to Maqam'}</span>
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* ===================== STAGE 3: MAQAM & ZAMZAM ===================== */}
          {currentStage === 'maqam' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-900 text-xl shrink-0">💧</div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-blue-950">
                    {isAr ? 'المرحلة 3: ركعتا الطواف خلف مقام إبراهيم والشرب من زمزم' : 'Stage 3: Two Rak’ahs at Maqam Ibrahim & Drinking Zamzam'}
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-900 leading-relaxed">
                    {isAr
                      ? 'بعد الفراغ من الطواف، يتجه المعتمر إلى مقام إبراهيم تالياً: ﴿وَاتَّخِذُوا مِن مَّقَامِ إِبْرَاهِيمَ مُصَلًّى﴾، ويصلي ركعتين خفيفتين (بسورتي الكافرون والإخلاص)، ثم يتوجه لماء زمزم فيشرب ويتضلع ويدعو.'
                      : 'After Tawaf, head toward Station of Ibrahim reciting: "And take the standing place of Ibrahim as a place of prayer" (Al-Baqarah: 125). Pray two light rak’ahs, then drink Zamzam water.'}
                  </p>
                </div>
              </div>

              {/* Two Interactive Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Action 1: Maqam Prayer */}
                <div className="p-5 rounded-3xl bg-white border border-[#E0D5C3] shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-amber-100 text-amber-900 text-base">🕌</span>
                      <h4 className="text-sm font-black text-stone-900">
                        {isAr ? '1. صلاة ركعتي الطواف' : '1. Two Rak’ahs of Tawaf'}
                      </h4>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {isAr
                        ? 'يصلي ركعتين خلف المقام إن تيسر، وإلا ففي أي موضع بالمسجد الحرام. يقرأ في الأولى بعد الفاتحة بـ (قل يا أيها الكافرون)، وفي الثانية بـ (قل هو الله أحد).'
                        : 'Recite Surah Al-Kafirun in the first unit and Surah Al-Ikhlas in the second. If crowded, pray anywhere in the mosque.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playPeaceChime();
                      setPrayedAtMaqam(true);
                    }}
                    className={`w-full py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      prayedAtMaqam
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-[#2C483F] hover:bg-[#20362f] text-white shadow-md'
                    }`}
                  >
                    {prayedAtMaqam ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{isAr ? 'تمت صلاة الركعتين بسكينة 🌿' : 'Two Rak’ahs Performed'}</span>
                      </>
                    ) : (
                      <span>{isAr ? 'اضغط لأداء ركعتي الطواف' : 'Perform 2 Rak’ahs'}</span>
                    )}
                  </button>
                </div>

                {/* Action 2: Drinking Zamzam */}
                <div className="p-5 rounded-3xl bg-white border border-[#E0D5C3] shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-blue-100 text-blue-900 text-base">💧</span>
                      <h4 className="text-sm font-black text-stone-900">
                        {isAr ? '2. الشرب والتضلع من زمزم' : '2. Drinking from Zamzam'}
                      </h4>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {isAr
                        ? '«ماء زمزم لما شُرب له»؛ يشرب مستقبلاً القبلة داعياً بخيري الدنيا والآخرة، ويصب على رأسه من بركته.'
                        : 'Prophet ﷺ said: "The water of Zamzam is for whatever it is drunk for." Drink facing Qiblah and supplicate with pure conviction.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playWaterPour();
                      playPeaceChime();
                      setDrankZamzam(true);
                    }}
                    className={`w-full py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      drankZamzam
                        ? 'bg-blue-100 text-blue-950 border border-blue-300'
                        : 'bg-blue-700 hover:bg-blue-800 text-white shadow-md'
                    }`}
                  >
                    {drankZamzam ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span>{isAr ? 'شربت وتضلعت بدعاء الشفاء والبركة 💧' : 'Drank with Dua & Blessing'}</span>
                      </>
                    ) : (
                      <span>{isAr ? 'اضغط للشرب من ماء زمزم والدعاء' : 'Drink Zamzam & Make Dua'}</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Progress to Stage 4 */}
              <div className="pt-3 flex justify-between items-center border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setCurrentStage('tawaf')}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-bold cursor-pointer"
                >
                  {isAr ? 'السابق: الطواف' : 'Previous: Tawaf'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    markStageComplete('maqam');
                    playPeaceChime();
                    setCurrentStage('sai');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isAr ? 'المتابعة إلى السعي (الصفا والمروة)' : 'Proceed to Sa’i'}</span>
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* ===================== STAGE 4: SA'I ===================== */}
          {currentStage === 'sai' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-teal-100 text-teal-900 text-xl shrink-0">🚶</div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-teal-950">
                    {isAr ? 'المرحلة 4: السعي بين الصفا والمروة (7 أشواط)' : 'Stage 4: Sa’i Between Safa & Marwa (7 Circuits)'}
                  </h3>
                  <p className="text-xs sm:text-sm text-teal-900 leading-relaxed">
                    {isAr
                      ? 'يصعد إلى الصفا تالياً: ﴿إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ﴾، ويستقبل الكعبة موحداً ومكبراً ثلاثاً. يبدأ شوطه الأول من الصفا إلى المروة، والشوط الثاني من المروة إلى الصفا، حتى يختم الشوط السابع عند المروة حتماً.'
                      : 'Ascend Safa reciting the Quranic verse, face the Kaaba, praise Allah and supplicate. Start at Safa heading to Marwa (circuit 1), and conclude the 7th circuit at Marwa.'}
                  </p>
                </div>
              </div>

              {/* Interactive Sa'i Track Simulator */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#131f1a] text-white border border-teal-500/30 space-y-4 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30 text-xs font-mono font-bold">
                    {isAr ? `الشوط: ${saiRound} من 7` : `Circuit: ${saiRound} of 7`}
                  </span>
                  <span className="text-xs font-bold text-amber-300">
                    {saiRound % 2 !== 0
                      ? isAr ? 'الاتجاه: من الصفا ⬅️ إلى المروة' : 'Direction: Safa ➔ Marwa'
                      : isAr ? 'الاتجاه: من المروة ⬅️ إلى الصفا' : 'Direction: Marwa ➔ Safa'}
                  </span>
                </div>

                {/* Track Visualization */}
                <div className="relative py-6 px-4 bg-stone-900/60 rounded-2xl border border-stone-800 flex items-center justify-between">
                  {/* Safa Hill */}
                  <div className="flex flex-col items-center gap-1 z-10">
                    <span className="text-2xl">⛰️</span>
                    <span className="text-xs font-black text-amber-300">{isAr ? 'جبل الصفا' : 'Mount Safa'}</span>
                    <span className="text-[10px] text-stone-400">{isAr ? 'البداية (1, 3, 5, 7)' : 'Start point'}</span>
                  </div>

                  {/* Middle Path with Green Zone Indicator */}
                  <div className="grow mx-4 relative flex flex-col items-center">
                    {/* The Green Lights Marker (العلمان الأخضران) */}
                    <div className="w-28 sm:w-40 py-1 px-2 rounded-lg bg-emerald-500/20 border border-emerald-400 text-center animate-pulse">
                      <span className="text-[10px] font-bold text-emerald-300 flex items-center justify-center gap-1">
                        <span>🟢</span>
                        <span>{isAr ? 'بين العلمين (هرولة للرجال)' : 'Green Zone (Jog for men)'}</span>
                      </span>
                    </div>

                    {/* Animated Walking Dot */}
                    <div
                      className={`w-6 h-6 rounded-full bg-teal-400 border-2 border-white shadow-md flex items-center justify-center text-[10px] font-bold text-stone-900 mt-2 transition-all duration-500 ${
                        isWalkingSai ? 'scale-125 bg-amber-400 ring-2 ring-amber-300' : ''
                      }`}
                    >
                      {saiRound}
                    </div>
                  </div>

                  {/* Marwa Hill */}
                  <div className="flex flex-col items-center gap-1 z-10">
                    <span className="text-2xl">⛰️</span>
                    <span className="text-xs font-black text-amber-300">{isAr ? 'جبل المروة' : 'Mount Marwa'}</span>
                    <span className="text-[10px] text-stone-400">{isAr ? 'النهاية (2, 4, 6, 7)' : 'Final ending'}</span>
                  </div>
                </div>

                {/* Prophetic Dhikr at Safa & Marwa */}
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
                  <span className="text-[10px] font-bold text-teal-300">
                    {isAr ? 'الذكر المأثور عند صعود الصفا والمروة:' : 'Authentic Supplication at Safa & Marwa:'}
                  </span>
                  <p className="text-xs sm:text-sm font-arabic text-stone-200">
                    « لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، أَنْجَزَ وَعْدَهُ، وَنَصَرَ عَبْدَهُ، وَهَزَمَ الأَحْزَابَ وَحْدَهُ »
                  </p>
                </div>

                {/* Next Circuit Button */}
                <button
                  type="button"
                  onClick={handleNextSaiRound}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-stone-950 font-black text-sm shadow-md transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Footprints className="w-4 h-4 text-stone-950" />
                  <span>
                    {saiRound < 7
                      ? isAr
                        ? `امشِ الشوط (${saiRound}/7) نحو ${saiRound % 2 !== 0 ? 'المروة' : 'الصفا'} 🚶`
                        : `Walk Circuit (${saiRound}/7)`
                      : isAr
                      ? 'إتمام السعي (7/7 عند المروة) والتحلل 🌿'
                      : 'Conclude Sa’i at Marwa & Proceed'}
                  </span>
                </button>
              </div>

              {/* Progress to Stage 5 */}
              <div className="pt-3 flex justify-between items-center border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setCurrentStage('maqam')}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-bold cursor-pointer"
                >
                  {isAr ? 'السابق: المقام وزمزم' : 'Previous: Maqam'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    markStageComplete('sai');
                    playPeaceChime();
                    setCurrentStage('tahallul');
                  }}
                  className="px-4 py-2 rounded-xl text-emerald-800 hover:bg-emerald-50 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>{isAr ? 'تخطي إلى التحلل' : 'Skip to Tahallul'}</span>
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* ===================== STAGE 5: TAHALLUL ===================== */}
          {currentStage === 'tahallul' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-900 text-xl shrink-0">✂️</div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-rose-950">
                    {isAr ? 'المرحلة 5: الحلق أو التقصير وإتمام العمرة والتحلل' : 'Stage 5: Halq, Taqsir & Full Tahallul'}
                  </h3>
                  <p className="text-xs sm:text-sm text-rose-900 leading-relaxed">
                    {isAr
                      ? 'الحلق بالموس أفضل للرجال، ودعا النبي ﷺ للمحلقين ثلاثاً وللمقصرين واحدة. أما التقصير فيجب أن يستوعب جميع شعر الرأس. والمرأة تقصر من أطراف شعرها قدر أنملة فقط ولا تحلق.'
                      : 'Shaving is best for men (the Prophet supplicated for them three times), while trimming must encompass all hair. Women only trim a fingertip length (~2 cm) from hair ends.'}
                  </p>
                </div>
              </div>

              {/* Halq vs Taqsir Decision Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Halq */}
                <button
                  type="button"
                  onClick={() => {
                    playPeaceChime();
                    setTahallulChoice('halq');
                  }}
                  className={`p-5 rounded-3xl border text-start transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    tahallulChoice === 'halq'
                      ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300 shadow-md'
                      : 'bg-white border-[#E0D5C3] hover:bg-stone-50'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">🪒</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                        {isAr ? 'الأفضل للرجال (دعاء ثلاثاً)' : 'Best for Men'}
                      </span>
                    </div>
                    <h4 className="text-base font-black text-stone-900">
                      {isAr ? 'الحلق الكامل بالموس (للرجال فقط)' : 'Complete Shaving (Men Only)'}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {isAr
                        ? '«اللهم اغفر للمحلقين، قالوا: والمقصرين يا رسول الله؟ قال: اللهم اغفر للمحلقين... ثم قال في الرابعة: وللمقصرين».'
                        : 'Prophet ﷺ: "O Allah, forgive those who shave their heads..." supplicating three times for them before mentioning those who trim.'}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-amber-800">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{tahallulChoice === 'halq' ? (isAr ? 'تم اختيار الحلق 🌿' : 'Selected') : (isAr ? 'اختر الحلق' : 'Select Halq')}</span>
                  </div>
                </button>

                {/* Taqsir */}
                <button
                  type="button"
                  onClick={() => {
                    playPeaceChime();
                    setTahallulChoice('taqsir');
                  }}
                  className={`p-5 rounded-3xl border text-start transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    tahallulChoice === 'taqsir'
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300 shadow-md'
                      : 'bg-white border-[#E0D5C3] hover:bg-stone-50'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">✂️</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                        {isAr ? 'للرجال وللنساء حتماً' : 'For Men & Women'}
                      </span>
                    </div>
                    <h4 className="text-base font-black text-stone-900">
                      {isAr ? 'التقصير الشامل' : 'Trimming (Taqsir)'}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {isAr
                        ? 'يقص الرجل من جميع جوانب شعره، والمرأة تجمع شعرها وتقص قدر أنملة (~2 سم) من أطرافه، ولا يجوز للمرأة الحلق مطلقاً.'
                        : 'Men trim from all sides of the head. Women gather hair and trim fingertip length (~2 cm) without shaving.'}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{tahallulChoice === 'taqsir' ? (isAr ? 'تم اختيار التقصير 🌿' : 'Selected') : (isAr ? 'اختر التقصير' : 'Select Taqsir')}</span>
                  </div>
                </button>
              </div>

              {/* Tahallul Complete Announcement */}
              {tahallulChoice && (
                <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white text-center space-y-3 shadow-lg animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto text-2xl">
                    🎉
                  </div>
                  <h4 className="text-lg font-black text-amber-200">
                    {isAr ? 'تقبل الله عمرتكم وبورك في سعيكم!' : 'May Allah Accept Your Umrah!'}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-200 max-w-md mx-auto leading-relaxed">
                    {isAr
                      ? 'تم التحلل التام من جميع محظورات الإحرام. والآن، حان وقت الاختبار الختامي لإتقان مناسك العمرة وحصد شارة التميز وسكينة إضافية!'
                      : 'You are now fully released from Ihram. It is time for the Final Mastery Quiz to seal your knowledge and earn your serenity badge!'}
                  </p>
                </div>
              )}

              {/* Progress to Stage 6: Quiz */}
              <div className="pt-3 flex justify-between items-center border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setCurrentStage('sai')}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-bold cursor-pointer"
                >
                  {isAr ? 'السابق: السعي' : 'Previous: Sa’i'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    markStageComplete('tahallul');
                    playPeaceChime();
                    setCurrentStage('quiz');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isAr ? 'الانتقال إلى الاختبار الختامي 🏆' : 'Go to Final Quiz 🏆'}</span>
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* ===================== STAGE 6: FINAL QUIZ ===================== */}
          {currentStage === 'quiz' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900 text-xl shrink-0">🏆</div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-amber-950">
                    {isAr ? 'الاختبار الختامي لإتقان فقه مناسك العمرة' : 'Final Umrah Jurisprudence & Mastery Quiz'}
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                    {isAr
                      ? 'أجب عن الأسئلة الفقهية المسندة التالية للتأكد من رسوخ أحكام العمرة في ذهنك وحصد شارة الإتقان المعتمدة.'
                      : 'Answer the following grounded questions to verify your mastery of the prophetic rituals and earn your completion certificate.'}
                  </p>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-5">
                {QUIZ_QUESTIONS.map((q, idx) => {
                  const selectedOpt = quizAnswers[q.id];
                  const isAnswered = selectedOpt !== undefined;
                  const isCorrect = isAnswered && selectedOpt === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E0D5C3] shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-black text-stone-900 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#2C483F] text-amber-300 text-[10px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span>{isAr ? q.questionAr : q.questionEn}</span>
                        </h4>

                        {quizSubmitted && (
                          <span className="shrink-0">
                            {isCorrect ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>{isAr ? 'صحيح' : 'Correct'}</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 text-rose-600" />
                                <span>{isAr ? 'يحتاج مراجعة' : 'Incorrect'}</span>
                              </span>
                            )}
                          </span>
                        )}
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(isAr ? q.optionsAr : q.optionsEn).map((opt, optIdx) => {
                          const isSelected = selectedOpt === optIdx;
                          let btnStyle = 'bg-stone-50 border-[#E0D5C3] text-stone-700 hover:bg-stone-100';

                          if (quizSubmitted) {
                            if (optIdx === q.correctIndex) {
                              btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                            } else if (isSelected) {
                              btnStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                            }
                          } else if (isSelected) {
                            btnStyle = 'bg-[#2C483F] text-white border-[#2C483F] font-bold shadow-xs';
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectQuizAnswer(q.id, optIdx)}
                              disabled={quizSubmitted}
                              className={`p-3 rounded-2xl border text-start text-xs transition-all cursor-pointer ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation & Source when submitted */}
                      {quizSubmitted && (
                        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1 animate-fade-in">
                          <p className="text-stone-700 font-medium">
                            <span className="font-bold text-[#2C483F]">{isAr ? 'التوجيه النبوي: ' : 'Prophetic Guidance: '}</span>
                            {isAr ? q.explanationAr : q.explanationEn}
                          </p>
                          <p className="text-[10px] text-stone-500 font-mono">
                            {isAr ? `المصدر: ${q.hadithSource}` : `Source: ${q.hadithSource}`}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quiz Submit Button & Results */}
              <div className="pt-2">
                {!quizSubmitted ? (
                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length}
                    className={`w-full py-4 rounded-2xl font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
                      Object.keys(quizAnswers).length === QUIZ_QUESTIONS.length
                        ? 'bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 text-white cursor-pointer hover:scale-[1.01]'
                        : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    <Award className="w-5 h-5 text-amber-300" />
                    <span>
                      {Object.keys(quizAnswers).length === QUIZ_QUESTIONS.length
                        ? isAr
                          ? 'تسليم الإجابات وإظهار النتيجة والشهادة 🏆'
                          : 'Submit Answers & Reveal Certificate 🏆'
                        : isAr
                        ? `أجب عن جميع الأسئلة أولاً (${Object.keys(quizAnswers).length}/${QUIZ_QUESTIONS.length})`
                        : `Answer all questions (${Object.keys(quizAnswers).length}/${QUIZ_QUESTIONS.length})`}
                    </span>
                  </button>
                ) : (
                  /* Certificate Banner */
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121E36] via-[#1a2d4f] to-[#0A1224] text-white border-2 border-amber-400 shadow-2xl text-center space-y-4 animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center mx-auto text-3xl">
                      🏅
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                        {isAr ? 'وثيقة إتقان مناسك العمرة' : 'Umrah Mastery Certificate'}
                      </span>
                      <h3 className="text-2xl font-black text-white">
                        {isAr ? `نتيجتك: ${quizScore} من أصل ${QUIZ_QUESTIONS.length}` : `Score: ${quizScore} / ${QUIZ_QUESTIONS.length}`}
                      </h3>
                      <p className="text-xs text-stone-300 max-w-md mx-auto">
                        {quizScore >= 4
                          ? isAr
                            ? 'أحسنت! أتقنت الفقه النبوي لمناسك العمرة وتم توثيق إنجازك في سجل التعلم وإضافة +30 نقطة سكينة.'
                            : 'Mabrook! You have demonstrated authentic mastery of the Umrah rituals and earned +30 peace points.'
                          : isAr
                          ? 'أداء طيب، يمكنك مراجعة الأسئلة وإعادة المحاولة لترسيخ الفقه.'
                          : 'Good effort, you can review and retry anytime to reinforce your learning.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleRestart}
                        className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>{isAr ? 'إعادة المحاكاة من البداية' : 'Restart Simulator'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={onClose}
                        className="px-7 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs transition-all shadow-md cursor-pointer"
                      >
                        <span>{isAr ? 'إتمام وحفظ الإنجاز 🌿' : 'Complete & Save 🌿'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="p-3 sm:p-4 bg-[#F2ECE1] border-t border-[#E0D5C3] flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#2C483F]">
              {isAr ? 'تأصيل شرعي معتمد:' : 'Verified Grounding:'}
            </span>
            <span className="hidden sm:inline">
              {isAr ? 'وفق الهدي النبوي الشريف وصحيحي البخاري ومسلم' : 'Sahih Al-Bukhari & Muslim'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono">
              {completedStages.length} / 6 {isAr ? 'مراحل منجزة' : 'stages done'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
