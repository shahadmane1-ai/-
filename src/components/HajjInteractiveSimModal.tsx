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
  ArrowRight,
  Heart,
  ShieldCheck,
  Flame,
  Sun,
  Moon,
  MapPin,
  Clock,
  Send,
  Zap,
  Check
} from 'lucide-react';
import {
  playPeaceChime,
  playSoftTap,
  playPebbleThrow,
  playTakbeerTone,
  playFanfare
} from '../utils/audio';
import { recordScenarioAttempt } from '../services/learningStateManager';
import { Language } from '../types';

interface HajjInteractiveSimModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
  onAdjustScore?: (delta: number, reason: string, type: 'peace' | 'stress') => void;
  userGender?: 'male' | 'female';
}

type HajjStage =
  | 'overview_types'
  | 'gear_sorting'
  | 'umrah_tamattu'
  | 'day_tarwiyah'
  | 'day_arafah'
  | 'night_muzdalifah'
  | 'day_nahr'
  | 'days_tashreeq'
  | 'tawaf_wada'
  | 'quiz';

interface HajjQuizQuestion {
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

const HAJJ_QUIZ_QUESTIONS: HajjQuizQuestion[] = [
  {
    id: 1,
    questionAr: 'ما هو الفارق الجوهري الذي يميز متمتع الحج (عمرة التمتع) عن القارن والمفرد؟',
    questionEn: 'What fundamentally distinguishes a Tamattu’ pilgrim from Qiran and Ifrad?',
    optionsAr: [
      'المتمتع لا يذهب إلى عرفة',
      'المتمتع يؤدي العمرة في أشهر الحج ويتحلل منها تماماً، ثم يحرم بالحج في اليوم الثامن',
      'المتمتع لا يرمي الجمرات في أيام التشريق',
      'المتمتع ليس عليه هدي بخلاف المفرد'
    ],
    optionsEn: [
      'Tamattu’ pilgrim does not go to Arafah',
      'Performs complete Umrah in Hajj months, fully exits Ihram, then re-enters Ihram for Hajj on Day 8',
      'Does not throw pebbles during Tashreeq days',
      'Has no sacrificial animal (Hadi) required'
    ],
    correctIndex: 1,
    explanationAr: 'سُمي التمتع تمتعاً لتمتع الحاج بما أحل الله له بين العمرة والحج بعد تحلله من العمرة، وهو أفضل الأنساك التي حث النبي ﷺ أصحابه عليها.',
    explanationEn: 'Tamattu’ means enjoying lawful things between Umrah and Hajj after exiting Ihram. It is the most recommended form that the Prophet ﷺ encouraged.',
    hadithSource: 'صحيح البخاري (1564) ومسلم (1218)'
  },
  {
    id: 2,
    questionAr: 'ما الحكم الشرعي إذا لم يستطع المتمتع ذبح الهدي لضيق ذات اليد؟',
    questionEn: 'What is the ruling if a Tamattu’ pilgrim cannot afford the sacrificial animal (Hadi)?',
    optionsAr: [
      'يبطل حجه ويعيده في العام القادم',
      'يصوم ثلاثة أيام في الحج وسبعة إذا رجع إلى أهله (عشرة كاملة)',
      'يتصدق بصاع من تمر وتسقط عنه الفدية',
      'يطوف طوافاً إضافياً بدلاً من الصيام'
    ],
    optionsEn: [
      'Hajj is invalidated and must be repeated',
      'Fasts 3 days during Hajj and 7 days after returning home (ten in total)',
      'Gives a measure of dates and the duty drops',
      'Performs an extra Tawaf instead of fasting'
    ],
    correctIndex: 1,
    explanationAr: 'قال تعالى: ﴿فَمَن تَمَتَّعَ بِالْعُمْرَةِ إِلَى الْحَجِّ فَمَا اسْتَيْسَرَ مِنَ الْهَدْيِ فَمَن لَّمْ يَجِدْ فَصِيَامُ ثَلَاثَةِ أَيَّامٍ فِي الْحَجِّ وَسَبْعَةٍ إِذَا رَجَعْتُمْ تِلْكَ عَشَرَةٌ كَامِلَةٌ﴾.',
    explanationEn: 'Allah explicitly says (Al-Baqarah: 196): Whoever enjoys Umrah until Hajj shall offer what Hadi is easy; but if unable, fast 3 days in Hajj and 7 when returning.',
    hadithSource: 'سورة البقرة: الآية 196'
  },
  {
    id: 3,
    questionAr: 'ما هو ركن الحج الأعظم الذي لا يصح الحج بحال إلا بإدراكه؟',
    questionEn: 'What is the greatest pillar of Hajj without which Hajj is completely invalid?',
    optionsAr: [
      'المبيت بمنى ليلة 8 ذي الحجة',
      'الوقوف بعرفة في وقته المعتبر شرعاً',
      'رمي جمرة العقبة قبل طلوع الشمس',
      'المبيت بمزدلفة حتى الظهر'
    ],
    optionsEn: [
      'Staying overnight in Mina on Day 8',
      'Standing at Mount Arafah during its designated time',
      'Stoning Jamrat Al-Aqabah before sunrise',
      'Staying at Muzdalifah until noon'
    ],
    correctIndex: 1,
    explanationAr: 'قال رسول الله ﷺ: «الحَجُّ عَرَفَةُ، فَمَنْ أَدْرَكَ لَيْلَةَ عَرَفَةَ قَبْلَ طُلُوعِ الفَجْرِ فَقَدْ أَدْرَكَ الحَجَّ».',
    explanationEn: 'The Prophet ﷺ proclaimed: "Hajj is Arafah! Whoever reaches Arafah before the break of dawn on the night of Nahr has caught the Hajj."',
    hadithSource: 'جامع الترمذي (889) وأبو داود (1949) وصححه الألباني'
  },
  {
    id: 4,
    questionAr: 'كيف ومتى تُرمى الجمرات الثلاث في أيام التشريق (11 و 12 و 13 ذي الحجة)؟',
    questionEn: 'When and how are the three Jamarat stoned during the days of Tashreeq?',
    optionsAr: [
      'قبل شروق الشمس بدءاً بالجمرة الكبرى',
      'بعد زوال الشمس (دخول وقت الظهر) بدءاً بالصغرى ثم الوسطى ثم الكبرى بـ 21 حصاة يومياً',
      'في منتصف الليل دفعة واحدة بسبع حصيات',
      'في أي وقت من اليوم دون اشتراط الترتيب'
    ],
    optionsEn: [
      'Before sunrise starting with the largest Jamrah',
      'After the sun passes its zenith (Zawal/noon), starting with Small, then Medium, then Large (21 pebbles daily)',
      'At midnight all at once with 7 pebbles',
      'At any time without order requirements'
    ],
    correctIndex: 1,
    explanationAr: 'يرمي الحاج في كل يوم من أيام التشريق بعد الزوال 21 حصاة: يبدأ بالجمرة الصغرى (7 حصيات) ثم يقف ويدعو، ثم الوسطى (7) ثم يدعو، ثم الكبرى (7) ولا يقف عندها.',
    explanationEn: 'On each Tashreeq day after Zawal, throw 21 pebbles: Small (7) + dua, Middle (7) + dua, Large Aqabah (7) without standing.',
    hadithSource: 'صحيح البخاري (1753) ومسلم (1299)'
  },
  {
    id: 5,
    questionAr: 'ما هو التحلل الأول (الأصغر) في يوم النحر (10 ذي الحجة) وماذا يباح به للحاج؟',
    questionEn: 'What is the First (Lesser) Tahallul on Day of Nahr and what does it permit?',
    optionsAr: [
      'يحصل بصلاة الفجر بمزدلفة ويباح به كل شيء',
      'يحصل بفعل اثنين من ثلاثة (الرمي، الحلق/التقصير، طواف الإفاضة) ويباح به كل شيء عدا النساء',
      'يحصل بذبح الهدي فقط ويباح به اللباس فقط',
      'يحصل بدخول مكة ويباح به التطيب دون اللباس'
    ],
    optionsEn: [
      'Occurs at Fajr prayer in Muzdalifah and permits everything',
      'Occurs upon doing two of three (Jamrah, Shaving/Trimming, Tawaf Ifadah); permits all except intimacy',
      'Occurs only upon animal sacrifice and permits clothing only',
      'Occurs upon entering Makkah and permits perfume only'
    ],
    correctIndex: 1,
    explanationAr: 'إذا فعل الحاج اثنين من ثلاثة (رمي جمرة العقبة، الحلق أو التقصير، وطواف الإفاضة مع السعي)، حل له التحلل الأول فجاز له لبس المخيط والتطيب وجميع المحظورات إلا النساء.',
    explanationEn: 'Doing 2 of 3 (Stoning Aqabah, Shaving/Trimming, Tawaf Ifadah) gives the 1st Tahallul: permits normal clothes and scent, everything except spousal intimacy.',
    hadithSource: 'سنن أبي داود (1978) ومجموع فتاوى ابن باز (17/328)'
  },
  {
    id: 6,
    questionAr: 'ما حكم طواف الوداع قبل مغادرة مكة وما الاستثناء الشرعي فيه؟',
    questionEn: 'What is the ruling of Farewell Tawaf (Wada’) and what is the legitimate exception?',
    optionsAr: [
      'سنة مستحبة ولا إثم في تركه مطلقاً',
      'واجب على كل حاج قبل السفر، ويُعفى عنه وتسقط وجوبه عن المرأة الحائض والنفساء',
      'ركن يبطل الحج بتركه ولا يجبر بدم',
      'خاص بأهل مكة فقط دون الآفاقيين'
    ],
    optionsEn: [
      'Voluntary Sunnah with no obligation',
      'Compulsory (Wajib) for all pilgrims before leaving; waived for menstruating/postnatal women without penalty',
      'A pillar without which Hajj is void',
      'Only for residents of Makkah'
    ],
    correctIndex: 1,
    explanationAr: 'ثبت عن ابن عباس رضي الله عنهما: «أُمِرَ الناسُ أن يكونَ آخِرُ عهْدِهم بالبيتِ، إلا أنه خُفِّفَ عن المرأةِ الحائضِ».',
    explanationEn: 'Ibn Abbas narrated: "People were commanded that the last thing should be at the House, except that it was lightened for menstruating women."',
    hadithSource: 'صحيح البخاري (1755) ومسلم (1328)'
  }
];

export const HajjInteractiveSimModal: React.FC<HajjInteractiveSimModalProps> = ({
  isOpen,
  onClose,
  lang = 'ar',
  onAdjustScore,
  userGender = 'male'
}) => {
  const isAr = lang === 'ar';

  const [currentStage, setCurrentStage] = useState<HajjStage>('overview_types');
  const [completedStages, setCompletedStages] = useState<string[]>([]);

  // Stage 0: Type Selection
  const [selectedType, setSelectedType] = useState<'tamattu' | 'qiran' | 'ifrad'>('tamattu');

  // Mini-Game 1: Gear Sorting (Ihram preparation)
  const [equippedItems, setEquippedItems] = useState<string[]>([]);
  const [gearFeedback, setGearFeedback] = useState<string | null>(null);

  // Mini-Game 2: Umrah of Tamattu Tawaf & Sai
  const [tamattuTawafLap, setTamattuTawafLap] = useState<number>(1);
  const [isOrbiting, setIsOrbiting] = useState<boolean>(false);

  // Mini-Game 3: Day 8 Tarwiyah Prayer Bell Ringing (5 prayers)
  const [completedPrayers, setCompletedPrayers] = useState<string[]>([]);

  // Mini-Game 4: Day 9 Arafah Sun Dial & Dua Lanterns
  const [arafahSunHours, setArafahSunHours] = useState<number>(12); // 12 PM (Zawal) to 18 (Maghrib)
  const [duaSparksCount, setDuaSparksCount] = useState<number>(0);
  const [floatingLanterns, setFloatingLanterns] = useState<number[]>([]);

  // Mini-Game 5: Muzdalifah Pebble Hunt (Click rocks on sand)
  const [collectedPebbles, setCollectedPebbles] = useState<number>(0);

  // Mini-Game 6: Day 10 Jamrat Al-Aqabah Throwing Arcade
  const [aqabahPebblesRemaining, setAqabahPebblesRemaining] = useState<number>(7);
  const [isThrowingPebble, setIsThrowingPebble] = useState<boolean>(false);
  const [aqabahDone, setAqabahDone] = useState<boolean>(false);

  // Mini-Game 7: Halq/Taqsir Barber Cutting Action
  const [tahallulCutDone, setTahallulCutDone] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // Mini-Game 8: Tashreeq 3 Pillars Physical Arcade (Identical to Aqabah)
  const [tashreeqDay, setTashreeqDay] = useState<11 | 12 | 13>(11);
  const [tashreeqPillarIndex, setTashreeqPillarIndex] = useState<0 | 1 | 2>(0); // 0: Sughra, 1: Wusta, 2: Kubra
  const [tashreeqPebblesRemaining, setTashreeqPebblesRemaining] = useState<number>(7);
  const [isThrowingTashreeqPebble, setIsThrowingTashreeqPebble] = useState<boolean>(false);
  const [tashreeqPillarsDone, setTashreeqPillarsDone] = useState<{ [key: number]: boolean }>({});
  const [tashreeqDuaDone, setTashreeqDuaDone] = useState<{ [key: number]: boolean }>({});
  const [tashreeqDaysFinished, setTashreeqDaysFinished] = useState<number[]>([]);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  if (!isOpen) return null;

  const markStageComplete = (stg: string) => {
    if (!completedStages.includes(stg)) {
      setCompletedStages((prev) => [...prev, stg]);
    }
  };

  const handleNextStage = (next: HajjStage) => {
    playPeaceChime();
    setCurrentStage(next);
  };

  // Mini-game: Equip/Drop Gear
  const handleToggleGear = (id: string, isForbidden: boolean) => {
    if (isForbidden) {
      playSoftTap();
      setGearFeedback(
        isAr
          ? '🚫 تنبيه: هذا العنصر من محظورات الإحرام (كالطيب والمخيط وتغطية الرأس) ولا يجوز للمحرم!'
          : '🚫 Alert: This item is prohibited in Ihram (perfume, stitched shirts, direct head covering)!'
      );
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.(50);
      }
      return;
    }

    playPeaceChime();
    setGearFeedback(null);
    setEquippedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Mini-game: Tawaf Lap Advance
  const handleAdvanceTamattuTawaf = () => {
    if (tamattuTawafLap >= 7) {
      playFanfare();
      markStageComplete('umrah_tamattu');
      handleNextStage('day_tarwiyah');
      return;
    }
    playTakbeerTone();
    setIsOrbiting(true);
    setTimeout(() => {
      setTamattuTawafLap((l) => l + 1);
      setIsOrbiting(false);
    }, 350);
  };

  // Mini-game: Tarwiyah Prayer Click
  const handlePrayTarwiyah = (prayerId: string) => {
    playPeaceChime();
    setCompletedPrayers((prev) => (prev.includes(prayerId) ? prev : [...prev, prayerId]));
  };

  // Mini-game: Arafah Dua & Sun Dial
  const handleMakeArafahDua = () => {
    playPeaceChime();
    setDuaSparksCount((c) => c + 1);
    setFloatingLanterns((prev) => [...prev.slice(-6), Date.now()]);
    // Advance sun slightly
    setArafahSunHours((prev) => (prev < 18 ? Number((prev + 0.5).toFixed(1)) : 18));
  };

  // Mini-game: Collect Pebble at Muzdalifah
  const handlePickPebble = () => {
    playPebbleThrow();
    setCollectedPebbles((c) => Math.min(70, c + 7));
  };

  // Mini-game: Throw Pebble at Jamrat Al-Aqabah
  const handleThrowAqabahPebble = () => {
    if (aqabahPebblesRemaining <= 0 || isThrowingPebble) return;
    setIsThrowingPebble(true);
    playPebbleThrow();
    playTakbeerTone();

    setTimeout(() => {
      const nextRemaining = aqabahPebblesRemaining - 1;
      setAqabahPebblesRemaining(nextRemaining);
      setIsThrowingPebble(false);

      if (nextRemaining === 0) {
        playFanfare();
        setAqabahDone(true);
      }
    }, 300);
  };

  // Mini-game: Barber cut action
  const handleTriggerBarberCut = () => {
    playPeaceChime();
    setTahallulCutDone(true);
    setShowConfetti(true);
    playFanfare();
  };

  // Mini-game: Tashreeq 3 Pillars Physical Stoning (Identical to Aqabah)
  const handleThrowTashreeqPebble = () => {
    if (tashreeqPebblesRemaining <= 0 || isThrowingTashreeqPebble) return;
    setIsThrowingTashreeqPebble(true);
    playPebbleThrow();
    playTakbeerTone();
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(25);
    }

    setTimeout(() => {
      const nextRemaining = tashreeqPebblesRemaining - 1;
      setTashreeqPebblesRemaining(nextRemaining);
      setIsThrowingTashreeqPebble(false);

      if (nextRemaining === 0) {
        setTashreeqPillarsDone((prev) => ({ ...prev, [tashreeqPillarIndex]: true }));
        if (tashreeqPillarIndex === 2) {
          playFanfare();
          if (!tashreeqDaysFinished.includes(tashreeqDay)) {
            setTashreeqDaysFinished((prev) => [...prev, tashreeqDay]);
          }
        } else {
          playPeaceChime();
        }
      }
    }, 300);
  };

  const handleProceedAfterDua = (currentIdx: 0 | 1) => {
    playPeaceChime();
    setTashreeqDuaDone((prev) => ({ ...prev, [currentIdx]: true }));
    setTashreeqPillarIndex((currentIdx + 1) as 0 | 1 | 2);
    setTashreeqPebblesRemaining(7);
  };

  const handleSelectTashreeqDay = (day: 11 | 12 | 13) => {
    playSoftTap();
    setTashreeqDay(day);
    setTashreeqPillarIndex(0);
    setTashreeqPebblesRemaining(7);
    setTashreeqPillarsDone({});
    setTashreeqDuaDone({});
  };

  // Quiz handlers
  const handleSelectQuiz = (qId: number, idx: number) => {
    if (quizSubmitted) return;
    playSoftTap();
    setQuizAnswers((prev) => ({ ...prev, [qId]: idx }));
  };

  const handleSubmitQuiz = () => {
    playFanfare();
    let score = 0;
    HAJJ_QUIZ_QUESTIONS.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);

    if (score >= 4) {
      markStageComplete('quiz');
      if (onAdjustScore) {
        onAdjustScore(40, isAr ? '+40 إتقان فقه الحج وعمرة التمتع التفاعلي' : '+40 Hajj & Tamattu’ Mastery', 'peace');
      }
      recordScenarioAttempt(
        'HAJJ_TAMATTU_SIMULATION',
        true,
        ['hajj_tamattu_essence', 'hajj_tarwiyah_mina', 'hajj_arafah_standing', 'hajj_nahr_stages', 'hajj_tashreeq_jamarat'],
        'pilgrimage_hajj'
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#FAF9F5] border-2 border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] text-start select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Holy Sites Visual Path */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#111927] via-[#1a2942] to-[#0e1724] text-white flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20 shrink-0 border border-amber-300/40">
              🏔️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>{isAr ? 'محاكاة حركية تفاعلية فائقة' : 'Hyper-Interactive Kinetic Simulator'}</span>
                </span>
                <span className="text-[10px] text-amber-300 font-bold hidden sm:inline">
                  {isAr ? 'ألعاب رمي الجمار، جبل الرحمة، والأنساك' : 'Pebble throwing, Arafah & Tamattu’'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-amber-100 flex items-center gap-2 mt-0.5">
                <span>{isAr ? 'محاكي مناسك الحج وعمرة التمتع التفاعلي' : 'Interactive Hajj & Tamattu’ Simulator'}</span>
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

        {/* Interactive Itinerary Stepper */}
        <div className="bg-[#EFE7D8] border-b border-[#D8CABE] px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview_types', labelAr: 'الأنساك والتمتع', labelEn: 'Hajj Types', icon: '📖' },
            { id: 'gear_sorting', labelAr: 'لعبة الإحرام والميقات', labelEn: 'Ihram Gear', icon: '🎒' },
            { id: 'umrah_tamattu', labelAr: 'طواف وسعي التمتع', labelEn: 'Tamattu’ Umrah', icon: '🕋' },
            { id: 'day_tarwiyah', labelAr: '8 ذو الحجة (منى)', labelEn: 'Day 8 (Mina)', icon: '⛺' },
            { id: 'day_arafah', labelAr: '9 ذو الحجة (عرفة)', labelEn: 'Day 9 (Arafah)', icon: '☀️' },
            { id: 'night_muzdalifah', labelAr: 'مزدلفة وجمع الحصى', labelEn: 'Muzdalifah', icon: '🌙' },
            { id: 'day_nahr', labelAr: '10 ذو الحجة (رمي ونحر)', labelEn: 'Day 10 (Nahr)', icon: '🎯' },
            { id: 'days_tashreeq', labelAr: 'أيام التشريق (الجمرات)', labelEn: 'Tashreeq Days', icon: '🔥' },
            { id: 'tawaf_wada', labelAr: 'طواف الوداع', labelEn: 'Farewell', icon: '🕊️' },
            { id: 'quiz', labelAr: 'اختبار الإتقان', labelEn: 'Mastery Quiz', icon: '🏆' },
          ].map((st) => {
            const isActive = currentStage === st.id;
            const isDone = completedStages.includes(st.id);
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  playSoftTap();
                  setCurrentStage(st.id as HajjStage);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#15231c] text-amber-300 shadow-sm ring-1 ring-amber-400'
                    : isDone
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-white/80 hover:bg-white text-stone-700'
                }`}
              >
                <span>{st.icon}</span>
                <span className="whitespace-nowrap">{isAr ? st.labelAr : st.labelEn}</span>
                {isDone && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            );
          })}
        </div>

        {/* Modal Main Stage Container */}
        <div className="p-4 sm:p-6 overflow-y-auto grow space-y-6">
          {/* ===================== STAGE 0: OVERVIEW & TYPES ===================== */}
          {currentStage === 'overview_types' && (
            <div className="space-y-6 max-w-3xl mx-auto py-2">
              <div className="text-center space-y-2">
                <span className="text-3xl animate-bounce inline-block">🏔️ 🕋</span>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900">
                  {isAr ? 'علاقة الحج بالعمرة: الأنساك الثلاثة وفضل التمتع' : 'Hajj & Umrah Relation: The Three Forms'}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
                  {isAr
                    ? 'اضغط على كل نسك للتعرف على الفرق الجوهري وكيف تجتمع العمرة والحج في سفرة واحدة.'
                    : 'Click each rite to learn the core difference and how Umrah and Hajj combine in one journey.'}
                </p>
              </div>

              {/* 3 Interactive Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {[
                  {
                    id: 'tamattu',
                    nameAr: '1. التمتع (النسك الأفضل)',
                    nameEn: '1. At-Tamattu’',
                    badgeAr: 'عمرة كاملة + تحلل تام + حج + هدي',
                    badgeEn: 'Umrah + Full Exit + Hajj + Hadi',
                    descAr: 'يحرم بالعمرة في أشهر الحج، يطوف ويسعى ويقصر ويتحلل تماماً، ثم ينشئ إحراماً جديداً بالحج يوم 8 ذي الحجة. عليه هدي واجب.',
                    descEn: 'Perform Umrah, exit Ihram completely, then re-enter for Hajj on 8th Dhul-Hijjah. Hadi required.',
                    icon: '✨'
                  },
                  {
                    id: 'qiran',
                    nameAr: '2. القِران',
                    nameEn: '2. Al-Qiran',
                    badgeAr: 'قران بلا تحلل بينهما + هدي',
                    badgeEn: 'Combined without exit + Hadi',
                    descAr: 'يجمع العمرة والحج في إحرام واحد مستمر دون تحلل حتى يوم النحر، وطوافه وسعيه يكفيانه لهما. عليه هدي واجب.',
                    descEn: 'Combines both in one continuous Ihram until Day 10. Hadi is compulsory.',
                    icon: '🔗'
                  },
                  {
                    id: 'ifrad',
                    nameAr: '3. الإفراد',
                    nameEn: '3. Al-Ifrad',
                    badgeAr: 'حج فقط بلا عمرة ولا هدي',
                    badgeEn: 'Hajj only, no Hadi',
                    descAr: 'يحرم بالحج وحده فقط دون عمرة، ويبقى محرماً حتى يوم النحر، وليس عليه ذبح هدي.',
                    descEn: 'Enters Ihram for Hajj alone with no Umrah. No Hadi required.',
                    icon: '👤'
                  },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      playSoftTap();
                      setSelectedType(t.id as 'tamattu' | 'qiran' | 'ifrad');
                    }}
                    className={`p-4 rounded-3xl border-2 text-start transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      selectedType === t.id
                        ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-300 shadow-md'
                        : 'bg-white border-[#E0D5C3] hover:bg-stone-50'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{t.icon}</span>
                        {selectedType === t.id && <CheckCircle2 className="w-5 h-5 text-amber-600" />}
                      </div>
                      <h4 className="text-sm font-black text-stone-900">{isAr ? t.nameAr : t.nameEn}</h4>
                      <p className="text-[11px] text-stone-600 leading-relaxed">{isAr ? t.descAr : t.descEn}</p>
                    </div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md">
                      {isAr ? t.badgeAr : t.badgeEn}
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    markStageComplete('overview_types');
                    handleNextStage('gear_sorting');
                  }}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-sm shadow-md transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer mx-auto"
                >
                  <span>{isAr ? 'العب لعبة تجهيز حقيبة المحرم 🎒' : 'Play Ihram Gear Sorting Game 🎒'}</span>
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* ===================== STAGE 1: GEAR SORTING MINI-GAME ===================== */}
          {currentStage === 'gear_sorting' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900 text-xl shrink-0">🎒</div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-amber-950">
                    {isAr ? 'لعبة تفاعلية: تجهيز حقيبة المحرم عند الميقات' : 'Interactive Game: Equipping the Pilgrim at Miqat'}
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                    {isAr
                      ? 'اضغط على العناصر المسموحة للمحرم لوضعها في حقيبتك، واحذر من لمس محظورات الإحرام!'
                      : 'Tap permissible items to pack them for your Ihram, and avoid forbidden items!'}
                  </p>
                </div>
              </div>

              {/* Feedback Alert */}
              {gearFeedback && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-950 text-xs font-bold animate-shake flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{gearFeedback}</span>
                </div>
              )}

              {/* Items Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'izar_rida', titleAr: 'إزار ورداء أبيضين نظيفين', titleEn: 'Unstitched White Sheets', forbidden: false, icon: '🕊️' },
                  { id: 'sandals', titleAr: 'نعلان غير مغطيين للكعبين', titleEn: 'Open Sandals', forbidden: false, icon: '🩴' },
                  { id: 'waist_belt', titleAr: 'حزام لحفظ النفقة والبطاقات', titleEn: 'Money / Passport Belt', forbidden: false, icon: '👜' },
                  { id: 'watch', titleAr: 'ساعة يد ونظارة شمسية', titleEn: 'Wristwatch & Glasses', forbidden: false, icon: '⌚' },
                  { id: 'stitched_shirt', titleAr: 'قميص مخيط مفصل على البدن', titleEn: 'Stitched Shirt (Forbidden)', forbidden: true, icon: '👕' },
                  { id: 'perfume_bottle', titleAr: 'قارورة طيب للرش على الإحرام', titleEn: 'Scent/Perfume (Forbidden)', forbidden: true, icon: '🧴' },
                  { id: 'nail_clipper', titleAr: 'مقص أظافر لقصها في الإحرام', titleEn: 'Nail Clipper (Forbidden)', forbidden: true, icon: '✂️' },
                  { id: 'cap_hat', titleAr: 'قبعة ملاصقة لتغطية الرأس', titleEn: 'Fitted Head Cap (Forbidden)', forbidden: true, icon: '🧢' },
                  { id: 'miswak', titleAr: 'مسواك لتطييب الفم (جائز)', titleEn: 'Miswak (Permissible)', forbidden: false, icon: '🌿' },
                ].map((item) => {
                  const isEquipped = equippedItems.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleToggleGear(item.id, item.forbidden)}
                      className={`p-3.5 rounded-2xl border-2 text-start transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                        isEquipped
                          ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300 shadow-sm'
                          : 'bg-white border-[#E0D5C3] hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{item.icon}</span>
                        {isEquipped && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      </div>
                      <span className="text-xs font-black text-stone-900">{isAr ? item.titleAr : item.titleEn}</span>
                      <span className="text-[10px] text-stone-500 font-bold">
                        {item.forbidden ? (isAr ? 'محظور' : 'Forbidden') : (isAr ? 'مباح للمحرم' : 'Allowed')}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Progress Footer */}
              <div className="pt-2 flex justify-between items-center border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setCurrentStage('overview_types')}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-bold cursor-pointer"
                >
                  {isAr ? 'السابق' : 'Back'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    markStageComplete('gear_sorting');
                    handleNextStage('umrah_tamattu');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isAr ? 'الانتقال لطواف وسعي عمرة التمتع 🕋' : 'Start Tamattu’ Umrah'}</span>
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* ===================== STAGE 2: UMRAH OF TAMATTU TAWAF & SAI ===================== */}
          {currentStage === 'umrah_tamattu' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 text-xl shrink-0">🕋</div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-emerald-950">
                    {isAr ? 'عمرة التمتع: طواف الكعبة 7 أشواط والسعي والتقصير' : 'Tamattu’ Umrah: Tawaf 7 Laps & Sa’i'}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                    {isAr
                      ? 'يؤدي المتمتع طواف العمرة 7 أشواط بمحاذاة الحجر الأسود، ويصلي خلف المقام ويشرب من زمزم ويسعى بين الصفا والمروة 7 أشواط، ثم يقصر شعره ويتحلل تماماً حتى صباح 8 ذي الحجة.'
                      : 'Complete 7 rounds of Tawaf, pray at Maqam Ibrahim, drink Zamzam, perform Sa’i between Safa and Marwa, then trim hair to fully exit Ihram until Day 8.'}
                  </p>
                </div>
              </div>

              {/* Dynamic Rotating Tawaf Visual */}
              <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#131d2b] to-[#0a1017] text-white flex flex-col items-center justify-center min-h-[300px] border border-amber-400/40 shadow-inner">
                <div className="absolute top-4 start-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-mono font-bold">
                    {isAr ? `شوط العمرة: ${tamattuTawafLap} من 7` : `Lap: ${tamattuTawafLap} of 7`}
                  </span>
                  {tamattuTawafLap <= 3 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      {isAr ? 'سنّة الرمل والاضطباع نشطة' : 'Raml active'}
                    </span>
                  )}
                </div>

                {/* Orbit Kaaba Canvas */}
                <div className="relative my-6 flex items-center justify-center">
                  <div
                    className={`w-56 h-56 rounded-full border-2 border-dashed border-amber-400/30 flex items-center justify-center transition-transform duration-500 ${
                      isOrbiting ? 'rotate-45 scale-105 border-amber-300' : ''
                    }`}
                  >
                    {/* Pilgrim Indicator */}
                    <div
                      className="absolute w-8 h-8 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold text-white transition-all duration-300"
                      style={{
                        top: tamattuTawafLap % 2 === 0 ? '8px' : 'auto',
                        bottom: tamattuTawafLap % 2 !== 0 ? '8px' : 'auto',
                        left: tamattuTawafLap > 3 ? '8px' : 'auto',
                        right: tamattuTawafLap <= 3 ? '8px' : 'auto',
                      }}
                    >
                      {tamattuTawafLap}
                    </div>

                    {/* Kaaba */}
                    <div className="w-24 h-24 rounded-2xl bg-stone-950 border-2 border-amber-400 shadow-2xl flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-amber-200">الكعبة</span>
                      <span className="text-[9px] text-amber-400">Kaaba</span>
                    </div>
                  </div>
                </div>

                {/* Button */}
                <button
                  type="button"
                  onClick={handleAdvanceTamattuTawaf}
                  className="w-full max-w-sm py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black text-xs sm:text-sm shadow-md transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Footprints className="w-4 h-4 text-stone-950" />
                  <span>
                    {tamattuTawafLap < 7
                      ? isAr
                        ? `كبّر وأتم الشوط (${tamattuTawafLap}/7) 🕋`
                        : `Complete Lap (${tamattuTawafLap}/7)`
                      : isAr
                      ? 'إتمام طواف وسعي عمرة التمتع والتحلل الكامل 🌿'
                      : 'Finish Tawaf, Sa’i & Exit Ihram'}
                  </span>
                </button>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setCurrentStage('gear_sorting')}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-bold cursor-pointer"
                >
                  {isAr ? 'السابق' : 'Back'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    markStageComplete('umrah_tamattu');
                    handleNextStage('day_tarwiyah');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isAr ? 'الانتقال إلى يوم التروية بمنى (8 ذو الحجة) ⛺' : 'Proceed to Day 8 Mina'}</span>
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* ===================== STAGE 3: DAY OF TARWIYAH 8 DHUL HIJJAH ===================== */}
          {currentStage === 'day_tarwiyah' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-900 text-xl shrink-0">⛺</div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-blue-950">
                    {isAr ? 'اليوم الثامن: يوم التروية - الإحرام بالحج والصلوات الخمس بمنى' : 'Day 8: Day of Tarwiyah - 5 Shortened Prayers in Mina'}
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-900 leading-relaxed">
                    {isAr
                      ? 'يُحرم المتمتع بالحج صباحاً من فندقه بمكة قائلاً: "لَبَّيْكَ حَجّاً"، ثم يتوجه إلى منى. اضغط على كل صلاة من الصلوات الخمس لتأكيد سنّة القصر بلا جمع.'
                      : 'Enter Ihram for Hajj from hotel: "Labbayka Hajjan". Go to Mina and perform the 5 shortened prayers without combining.'}
                  </p>
                </div>
              </div>

              {/* 5 Prayers Interactive Camp */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-[#121c2d] to-[#0a111c] text-white space-y-4 border border-blue-400/30 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">
                    {isAr ? 'صلوات يوم التروية الخمس بمنى (اضغط لأداء كل صلاة):' : 'Click to perform the 5 prayers in Mina:'}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                    {completedPrayers.length} / 5 {isAr ? 'صلوات أُديت' : 'done'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                  {[
                    { id: 'dhuhr', nameAr: 'الظهر (2)', nameEn: 'Dhuhr (2)', icon: '☀️' },
                    { id: 'asr', nameAr: 'العصر (2)', nameEn: 'Asr (2)', icon: '🌤️' },
                    { id: 'maghrib', nameAr: 'المغرب (3)', nameEn: 'Maghrib (3)', icon: '🌅' },
                    { id: 'isha', nameAr: 'العشاء (2)', nameEn: 'Isha (2)', icon: '🌌' },
                    { id: 'fajr', nameAr: 'فجر 9 (2)', nameEn: 'Fajr 9 (2)', icon: '🌄' },
                  ].map((p) => {
                    const done = completedPrayers.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handlePrayTarwiyah(p.id)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                          done
                            ? 'bg-emerald-600/40 border-emerald-400 text-emerald-200'
                            : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/15'
                        }`}
                      >
                        <span className="text-xl">{p.icon}</span>
                        <span className="text-xs font-black">{isAr ? p.nameAr : p.nameEn}</span>
                        {done && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setCurrentStage('umrah_tamattu')}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-bold cursor-pointer"
                >
                  {isAr ? 'السابق' : 'Back'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    markStageComplete('day_tarwiyah');
                    handleNextStage('day_arafah');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isAr ? 'الانتقال إلى يوم عرفة العظيم (9 ذو الحجة) ☀️' : 'Proceed to Day of Arafah'}</span>
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* ===================== STAGE 4: DAY OF ARAFAH MINI-GAME ===================== */}
          {currentStage === 'day_arafah' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900 text-xl shrink-0">☀️</div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-amber-950">
                    {isAr ? 'اليوم التاسع: يوم عرفة - ركن الحج الأعظم «الحج عرفة»' : 'Day 9: Mount Arafah - The Greatest Pillar'}
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                    {isAr
                      ? 'الوقوف بعرفة يبدأ بعد الزوال (الظهر) ويستمر وجوباً حتى غروب الشمس التام. اضغط لرفع الدعاء ومشاهدة انحدار الشمس نحو الغروب لفتح بوابة الإفاضة إلى مزدلفة.'
                      : 'Standing at Arafah starts after Zawal (noon) and must continue until complete sunset. Tap to supplicate and watch the sun set to unlock departure to Muzdalifah.'}
                  </p>
                </div>
              </div>

              {/* Sun Dial & Spiritual Dua Ascender */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#231a0e] via-[#3a270f] to-[#120c04] text-white space-y-4 border border-amber-400/40 shadow-xl relative overflow-hidden">
                {/* Floating lanterns */}
                {floatingLanterns.map((key) => (
                  <div
                    key={key}
                    className="absolute bottom-10 start-1/2 -translate-x-1/2 text-2xl animate-float-up pointer-events-none opacity-80"
                  >
                    ✨
                  </div>
                ))}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun className="w-5 h-5 text-amber-400 animate-spin" />
                    <span className="text-xs font-bold text-amber-200">
                      {isAr ? `توقيت عرفة التفاعلي: الساعة ${arafahSunHours}:00` : `Arafah Time: ${arafahSunHours}:00`}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300">
                    {arafahSunHours >= 18
                      ? isAr ? 'غربت الشمس تماماً 🌅 (حلت الإفاضة)' : 'Sunset Reached 🌅'
                      : isAr ? 'الوقوف مستمر حتى الغروب' : 'Standing until sunset'}
                  </span>
                </div>

                {/* Sun Position Visual Bar */}
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden p-0.5">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-rose-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${((arafahSunHours - 12) / 6) * 100}%` }}
                  />
                </div>

                {/* Prophetic Dua Banner */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
                  <p className="text-base sm:text-lg font-black text-amber-100 font-arabic leading-relaxed">
                    « لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ »
                  </p>
                  <span className="text-[11px] text-amber-300 font-mono">
                    {isAr ? `دعوات وتضرعات صادقة: ${duaSparksCount}` : `Duas lifted: ${duaSparksCount}`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleMakeArafahDua}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black text-sm shadow-md transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-rose-600" />
                  <span>{isAr ? 'ارفع يديك بالدعاء وتدرج نحو الغروب 🤲' : 'Raise Hands in Supplication 🤲'}</span>
                </button>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setCurrentStage('day_tarwiyah')}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-bold cursor-pointer"
                >
                  {isAr ? 'السابق' : 'Back'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    markStageComplete('day_arafah');
                    handleNextStage('night_muzdalifah');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isAr ? 'الإفاضة إلى مزدلفة بعد الغروب 🌙' : 'Depart to Muzdalifah 🌙'}</span>
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* ===================== STAGE 5: MUZDALIFAH PEBBLE COLLECTOR ===================== */}
          {currentStage === 'night_muzdalifah' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-900 text-xl shrink-0">🌙</div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-indigo-950">
                    {isAr ? 'ليلة النحر: المزدلفة - المبيت وصلاة الفجر والتقاط الحصى' : 'Night of Muzdalifah: Resting & Gathering Pebbles'}
                  </h3>
                  <p className="text-xs sm:text-sm text-indigo-900 leading-relaxed">
                    {isAr
                      ? 'صلاة المغرب والعشاء جمع تأخير، المبيت بسكينة، والتقاط حصيات الجمار (حجم حبة الحمص). اضغط على الحصيات لملء كيس الحصى.'
                      : 'Combine Maghrib & Isha at Isha time. Sleep in tranquility and gather Jamarat pebbles (chickpea size). Tap to gather.'}
                  </p>
                </div>
              </div>

              {/* Pebble Hunting Desert Canvas */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c1424] to-[#060b13] text-white space-y-4 border border-indigo-400/40 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Moon className="w-4 h-4 text-amber-300" />
                    <span>{isAr ? 'كيس حصى الجمار (الهدف 7 لجمرة العقبة أو 49/70 لأيام التشريق):' : 'Jamarat Pebble Pouch:'}</span>
                  </span>
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    {collectedPebbles} {isAr ? 'حصاة مجمعة' : 'pebbles'}
                  </span>
                </div>

                {/* Clickable Pebbles Ground */}
                <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 flex flex-wrap items-center justify-center gap-3 min-h-[120px]">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={handlePickPebble}
                      className="w-11 h-11 rounded-2xl bg-stone-700 hover:bg-amber-500 text-stone-100 hover:text-stone-950 border border-stone-600 hover:scale-110 active:scale-90 transition-all flex items-center justify-center text-xs font-bold shadow-md cursor-pointer"
                      title={isAr ? 'التقط حصاة' : 'Pick pebble'}
                    >
                      🪨
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handlePickPebble}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Footprints className="w-4 h-4 text-amber-300" />
                  <span>{isAr ? 'اجمع 7 حصيات بنقرة واحدة (صوت حجارة واقعي) 🪨' : 'Gather 7 Pebbles into Pouch'}</span>
                </button>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setCurrentStage('day_arafah')}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-bold cursor-pointer"
                >
                  {isAr ? 'السابق' : 'Back'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    markStageComplete('night_muzdalifah');
                    handleNextStage('day_nahr');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isAr ? 'التوجه إلى يوم النحر ورمي جمرة العقبة 🎯' : 'Proceed to Day 10 Nahr'}</span>
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* ===================== STAGE 6: DAY 10 NAHR - STONING & TAHALLUL ===================== */}
          {currentStage === 'day_nahr' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-900 text-xl shrink-0">🎯</div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-rose-950">
                    {isAr ? 'اليوم العاشر: يوم النحر - محاكي رمي جمرة العقبة والتحلل الأول' : 'Day 10: Day of Nahr - Stoning Jamrat Al-Aqabah & 1st Tahallul'}
                  </h3>
                  <p className="text-xs sm:text-sm text-rose-900 leading-relaxed">
                    {isAr
                      ? 'اضغط على زر الرمي لإطلاق 7 حصيات متعاقبة في حوض الجمرة مع التكبير، ثم انتقل لقص/حلق الشعر للتحلل الأول.'
                      : 'Tap to throw 7 pebbles consecutively into the Jamrah basin with Takbeer, then trigger hair shaving/trimming for the 1st Tahallul.'}
                  </p>
                </div>
              </div>

              {/* Interactive Stoning Pillar Arcade */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#1c2438] via-[#0f172a] to-[#070b13] text-white border border-amber-400/40 text-center space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">
                    {isAr ? 'جمرة العقبة الكبرى (رمي 7 حصيات متعاقبة):' : 'Jamrat Al-Aqabah (Throw 7 pebbles):'}
                  </span>
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-400/20 text-amber-300">
                    {isAr ? `حصيات متبقية: ${aqabahPebblesRemaining}/7` : `Remaining: ${aqabahPebblesRemaining}/7`}
                  </span>
                </div>

                {/* Stoning Pillar Graphic */}
                <div className="relative py-6 flex flex-col items-center justify-center">
                  {/* Jamrah Pillar */}
                  <div className="w-16 h-36 rounded-2xl bg-gradient-to-b from-stone-600 to-stone-900 border-2 border-amber-300 shadow-2xl flex flex-col items-center justify-center relative">
                    <span className="text-xs font-black text-amber-200 uppercase">جمرة العقبة</span>
                    {isThrowingPebble && (
                      <span className="absolute -top-6 text-xl animate-bounce text-amber-300">🪨</span>
                    )}
                  </div>
                  {/* Basin */}
                  <div className="w-48 h-8 rounded-full bg-stone-950 border border-amber-400/50 mt-1 shadow-inner flex items-center justify-center text-[10px] text-stone-400">
                    {isAr ? 'حوض الجمرة' : 'Basin'}
                  </div>
                </div>

                {/* Stoning Throw Action */}
                {!aqabahDone ? (
                  <button
                    type="button"
                    onClick={handleThrowAqabahPebble}
                    disabled={isThrowingPebble}
                    className="w-full max-w-sm mx-auto py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 text-stone-950 font-black text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Flame className="w-4 h-4 text-stone-950" />
                    <span>{isAr ? `ارمِ حصاة وكبّر «الله أكبر» (${7 - aqabahPebblesRemaining + 1}/7)` : 'Throw Pebble with Takbeer'}</span>
                  </button>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs font-bold animate-fade-in flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>{isAr ? 'تم رمي جمرة العقبة بـ 7 حصيات بنجاح والحمد لله!' : 'Jamrah Stoning Complete!'}</span>
                  </div>
                )}

                {/* Barber Tahallul Action */}
                {aqabahDone && (
                  <div className="pt-2 border-t border-white/10 space-y-3">
                    <button
                      type="button"
                      onClick={handleTriggerBarberCut}
                      className="w-full max-w-sm mx-auto py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Scissors className="w-4 h-4" />
                      <span>{isAr ? 'احلق أو قصر الآن لإعلان التحلل الأول! ✂️' : 'Shave / Trim for 1st Tahallul ✂️'}</span>
                    </button>

                    {tahallulCutDone && (
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/30 to-emerald-500/30 border border-amber-400 text-amber-200 text-xs font-black animate-fade-in space-y-1">
                        <div className="text-lg">🎉 👕 ✨</div>
                        <p>{isAr ? 'مبروك! تم التحلل الأول (الأصغر): يحل لك اللباس والطيب وجميع المحظورات إلا النساء.' : 'First Tahallul achieved! Normal clothes & scent permitted.'}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setCurrentStage('night_muzdalifah')}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-bold cursor-pointer"
                >
                  {isAr ? 'السابق' : 'Back'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    markStageComplete('day_nahr');
                    handleNextStage('days_tashreeq');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isAr ? 'المتابعة: أيام التشريق بمنى 🔥' : 'Proceed: Tashreeq Days'}</span>
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* ===================== STAGE 7: DAYS OF TASHREEQ ===================== */}
          {currentStage === 'days_tashreeq' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-teal-100 text-teal-900 text-xl shrink-0">🔥</div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-teal-950">
                    {isAr ? 'أيام التشريق: رمي الجمرات الثلاث بالترتيب النبوي بعد الزوال' : 'Days of Tashreeq: Stoning the 3 Jamarat in Order'}
                  </h3>
                  <p className="text-xs sm:text-sm text-teal-900 leading-relaxed">
                    {isAr
                      ? 'الترتيب النبوي الصارم: 1) الجمرة الصغرى (7) + دعاء طويل، 2) الجمرة الوسطى (7) + دعاء، 3) الجمرة الكبرى العقبة (7) دون وقوف.'
                      : 'Strict order: 1) Small Jamrah (7) + long Dua, 2) Middle Jamrah (7) + long Dua, 3) Large Aqabah (7) without standing.'}
                  </p>
                </div>
              </div>

              {/* 3 Pillars Physical Stoning Arcade (Identical to Aqabah) */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#1c2438] via-[#0f172a] to-[#070b13] text-white border border-teal-400/40 text-center space-y-5 shadow-xl">
                {/* Tashreeq Days Selector */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-stone-400">{isAr ? 'يوم التشريق:' : 'Day:'}</span>
                    {[11, 12, 13].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => handleSelectTashreeqDay(d as 11 | 12 | 13)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          tashreeqDay === d
                            ? 'bg-teal-500 text-stone-950 font-black shadow-xs ring-1 ring-white'
                            : 'bg-white/10 text-stone-300 hover:bg-white/20'
                        }`}
                      >
                        {isAr ? `اليوم ${d}` : `Day ${d}`}
                        {d === 12 && (isAr ? ' (تعجل)' : ' (Nafar 1)')}
                        {d === 13 && (isAr ? ' (تأخر)' : ' (Nafar 2)')}
                      </button>
                    ))}
                  </div>

                  <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    {isAr
                      ? `الحصيات المرمية اليوم: ${
                          (tashreeqPillarsDone[0] ? 7 : (tashreeqPillarIndex === 0 ? 7 - tashreeqPebblesRemaining : 0)) +
                          (tashreeqPillarsDone[1] ? 7 : (tashreeqPillarIndex === 1 ? 7 - tashreeqPebblesRemaining : 0)) +
                          (tashreeqPillarsDone[2] ? 7 : (tashreeqPillarIndex === 2 ? 7 - tashreeqPebblesRemaining : 0))
                        } من 21`
                      : `Thrown today: ${
                          (tashreeqPillarsDone[0] ? 7 : (tashreeqPillarIndex === 0 ? 7 - tashreeqPebblesRemaining : 0)) +
                          (tashreeqPillarsDone[1] ? 7 : (tashreeqPillarIndex === 1 ? 7 - tashreeqPebblesRemaining : 0)) +
                          (tashreeqPillarsDone[2] ? 7 : (tashreeqPillarIndex === 2 ? 7 - tashreeqPebblesRemaining : 0))
                        }/21`}
                  </span>
                </div>

                {/* 3 Pillars Navigation Tabs */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { idx: 0, titleAr: '1. الجمرة الصغرى', titleEn: '1. Small Pillar', descAr: '7 حصيات + دعاء' },
                    { idx: 1, titleAr: '2. الجمرة الوسطى', titleEn: '2. Middle Pillar', descAr: '7 حصيات + دعاء' },
                    { idx: 2, titleAr: '3. جمرة العقبة', titleEn: '3. Large Pillar', descAr: '7 حصيات + انصراف' },
                  ].map((p) => {
                    const isSelected = tashreeqPillarIndex === p.idx;
                    const isDone = !!tashreeqPillarsDone[p.idx];
                    return (
                      <button
                        key={p.idx}
                        type="button"
                        onClick={() => {
                          playSoftTap();
                          setTashreeqPillarIndex(p.idx as 0 | 1 | 2);
                          if (!tashreeqPillarsDone[p.idx]) {
                            setTashreeqPebblesRemaining(7);
                          }
                        }}
                        className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-teal-600 border-white text-white shadow-md ring-2 ring-teal-400'
                            : isDone
                            ? 'bg-emerald-950/70 border-emerald-500/70 text-emerald-300'
                            : 'bg-white/5 border-white/10 text-stone-400 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1 text-xs font-black">
                          <span>{isAr ? p.titleAr : p.titleEn}</span>
                          {isDone && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                        <div className="text-[10px] mt-0.5 text-stone-300">
                          {isDone ? (isAr ? 'منجزة ✅' : 'Done') : isAr ? p.descAr : ''}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Physical Stoning Pillar Graphic (Identical to Aqabah) */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300">
                      {tashreeqPillarIndex === 0
                        ? isAr ? 'الجمرة الصغرى (أولى الجمار بعد الزوال):' : 'Small Jamrah:'
                        : tashreeqPillarIndex === 1
                        ? isAr ? 'الجمرة الوسطى (ثانية الجمار):' : 'Middle Jamrah:'
                        : isAr ? 'جمرة العقبة الكبرى (خاتمة الجمار):' : 'Large Jamrah Al-Aqabah:'}
                    </span>
                    <span className="font-mono font-bold px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300">
                      {isAr
                        ? `حصيات متبقية: ${tashreeqPillarsDone[tashreeqPillarIndex] ? 0 : tashreeqPebblesRemaining}/7`
                        : `Remaining: ${tashreeqPillarsDone[tashreeqPillarIndex] ? 0 : tashreeqPebblesRemaining}/7`}
                    </span>
                  </div>

                  {/* 3D Pillar Column Graphic */}
                  <div className="relative py-6 flex flex-col items-center justify-center">
                    <div className="w-16 h-36 rounded-2xl bg-gradient-to-b from-stone-600 via-stone-700 to-stone-900 border-2 border-amber-300 shadow-2xl flex flex-col items-center justify-center relative">
                      <span className="text-[11px] font-black text-amber-200 uppercase text-center px-1">
                        {tashreeqPillarIndex === 0
                          ? (isAr ? 'الجمرة الصغرى' : 'Small Jamrah')
                          : tashreeqPillarIndex === 1
                          ? (isAr ? 'الجمرة الوسطى' : 'Middle Jamrah')
                          : (isAr ? 'جمرة العقبة' : 'Aqabah')}
                      </span>
                      {isThrowingTashreeqPebble && (
                        <span className="absolute -top-6 text-xl animate-bounce text-amber-300">🪨</span>
                      )}
                    </div>
                    {/* Basin */}
                    <div className="w-48 h-8 rounded-full bg-stone-950 border border-amber-400/50 mt-1 shadow-inner flex items-center justify-center text-[10px] text-stone-400">
                      {isAr ? 'حوض الجمرة' : 'Jamrah Basin'}
                    </div>
                  </div>

                  {/* Throw Button */}
                  {!tashreeqPillarsDone[tashreeqPillarIndex] ? (
                    <button
                      type="button"
                      onClick={handleThrowTashreeqPebble}
                      disabled={isThrowingTashreeqPebble}
                      className="w-full max-w-sm mx-auto py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 text-stone-950 font-black text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Flame className="w-4 h-4 text-stone-950" />
                      <span>
                        {isAr
                          ? `ارمِ حصاة وكبّر «الله أكبر» (${7 - tashreeqPebblesRemaining + 1}/7)`
                          : `Throw Pebble with Takbeer (${7 - tashreeqPebblesRemaining + 1}/7)`}
                      </span>
                    </button>
                  ) : (
                    /* Success & Sunnah Next Actions */
                    <div className="space-y-3 animate-fade-in">
                      <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs font-bold flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>
                          {tashreeqPillarIndex === 0
                            ? isAr ? 'تم رمي الجمرة الصغرى بـ 7 حصيات بنجاح والحمد لله!' : 'Small Jamrah completed!'
                            : tashreeqPillarIndex === 1
                            ? isAr ? 'تم رمي الجمرة الوسطى بـ 7 حصيات بنجاح والحمد لله!' : 'Middle Jamrah completed!'
                            : isAr ? 'تم رمي جمرة العقبة بـ 7 حصيات (إتمام 21 حصاة كاملة لليوم)! 🎉' : 'All 21 pebbles completed for today! 🎉'}
                        </span>
                      </div>

                      {/* Sunnah Guidance & Transition Buttons */}
                      {tashreeqPillarIndex === 0 && (
                        <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-400/60 text-center space-y-2">
                          <span className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1">
                            <Heart className="w-4 h-4 text-rose-400" />
                            <span>{isAr ? 'السنّة النبوية بعد الصغرى: تقدم واستقبل القبلة وادعُ طويلاً' : 'Sunnah: Stand facing Qiblah & make long Dua'}</span>
                          </span>
                          <p className="text-xs text-stone-200 font-arabic leading-relaxed">
                            « رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ، وَتُبْ عَلَيْنَا إِنَّكَ أَنتَ التَّوَّابُ الرَّحِيمُ »
                          </p>
                          <button
                            type="button"
                            onClick={() => handleProceedAfterDua(0)}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
                          >
                            <span>{isAr ? 'أتممت الدعاء الطويل.. الانتقال للجمرة الوسطى 🌿' : 'Proceed to Middle Jamrah'}</span>
                            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                          </button>
                        </div>
                      )}

                      {tashreeqPillarIndex === 1 && (
                        <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-400/60 text-center space-y-2">
                          <span className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1">
                            <Heart className="w-4 h-4 text-rose-400" />
                            <span>{isAr ? 'السنّة النبوية بعد الوسطى: تقدم وادعُ دعاءً طويلاً ثانياً' : 'Sunnah: Stand & make second long Dua'}</span>
                          </span>
                          <p className="text-xs text-stone-200 font-arabic leading-relaxed">
                            « اللَّهُمَّ اجْعَلْهُ حَجّاً مَبْرُوراً، وَذَنْباً مَغْفُوراً، وَعَمَلاً صَالِحاً مَقْبُولاً »
                          </p>
                          <button
                            type="button"
                            onClick={() => handleProceedAfterDua(1)}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
                          >
                            <span>{isAr ? 'أتممت الدعاء الثاني.. الانتقال لجمرة العقبة الكبرى 🌿' : 'Proceed to Large Jamrah'}</span>
                            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                          </button>
                        </div>
                      )}

                      {tashreeqPillarIndex === 2 && (
                        <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-200 text-center space-y-2">
                          <p className="text-xs font-black">
                            {isAr
                              ? 'السنّة النبوية بعد جمرة العقبة: الانصراف فوراً دون وقوف للدعاء، كما كان هديه ﷺ.'
                              : 'Prophetic Sunnah after Aqabah: Depart immediately without standing for Dua.'}
                          </p>
                          <p className="text-[11px] text-stone-300">
                            {isAr
                              ? 'أتممت رمي الجمرات الثلاث (21 حصاة) كاملة لليوم، تقبل الله منكم!'
                              : 'You have completed all three Jamarat (21 pebbles) for today!'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setCurrentStage('day_nahr')}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-bold cursor-pointer"
                >
                  {isAr ? 'السابق' : 'Back'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    markStageComplete('days_tashreeq');
                    handleNextStage('tawaf_wada');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isAr ? 'المتابعة: طواف الوداع 🕊️' : 'Proceed: Farewell Tawaf'}</span>
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* ===================== STAGE 8: FAREWELL TAWAF ===================== */}
          {currentStage === 'tawaf_wada' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900 text-xl shrink-0">🕊️</div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-amber-950">
                    {isAr ? 'الختام المبارك: طواف الوداع قبل مغادرة مكة' : 'Farewell Tawaf (Tawaf Al-Wada’)'}
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                    {isAr
                      ? 'طواف الوداع 7 أشواط ليكون آخر عهد الحاج بالبيت الحرام، وهو واجب يسقط عن المرأة الحائض والنفساء دون فدية.'
                      : '7 rounds of Farewell Tawaf before traveling home. Waived for menstruating women.'}
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121c2d] to-[#0a111c] text-white text-center space-y-4 shadow-xl border border-amber-400/40">
                <div className="w-16 h-16 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center mx-auto text-3xl">
                  🕋
                </div>
                <h4 className="text-lg font-black text-amber-200">
                  {isAr ? 'حج مبرور وسعي مشكور وذنب مغفور!' : 'May Allah Accept Your Blessed Hajj!'}
                </h4>
                <p className="text-xs text-stone-300 max-w-md mx-auto">
                  {isAr
                    ? 'أتممت كافة مناسك الحج وفهمت ارتباط عمرة التمتع بها. حان وقت الاختبار الختامي لإتقان الفقه وحصد وسام التميز!'
                    : 'You have mastered the prophetic journey of Hajj & Tamattu’. Take the final quiz to earn your medal!'}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    markStageComplete('tawaf_wada');
                    handleNextStage('quiz');
                  }}
                  className="px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs sm:text-sm transition-all shadow-md cursor-pointer mx-auto flex items-center gap-2"
                >
                  <Award className="w-4 h-4 text-stone-950" />
                  <span>{isAr ? 'ابدأ الاختبار الفقهي الختامي الشامل 🏆' : 'Start Final Mastery Quiz 🏆'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ===================== STAGE 9: FINAL QUIZ ===================== */}
          {currentStage === 'quiz' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900 text-xl shrink-0">🏆</div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-amber-950">
                    {isAr ? 'الاختبار الختامي: إتقان فقه الحج وعمرة التمتع' : 'Final Mastery Quiz: Hajj & Tamattu’ Jurisprudence'}
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                    {isAr
                      ? 'أجب عن الأسئلة الفقهية الستة المسندة بالسنة النبوية لتوثيق إتقانك وحصد +40 نقطة سكينة.'
                      : 'Answer the six authentic questions to certify your mastery and gain +40 peace points.'}
                  </p>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-5">
                {HAJJ_QUIZ_QUESTIONS.map((q, idx) => {
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
                          <span className="w-5 h-5 rounded-full bg-[#1b263b] text-amber-300 text-[10px] flex items-center justify-center shrink-0">
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
                                <span>{isAr ? 'يحتاج مراجعة' : 'Review'}</span>
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
                            btnStyle = 'bg-[#1b263b] text-white border-[#1b263b] font-bold shadow-xs';
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectQuiz(q.id, optIdx)}
                              disabled={quizSubmitted}
                              className={`p-3 rounded-2xl border text-start text-xs transition-all cursor-pointer ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {quizSubmitted && (
                        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1 animate-fade-in">
                          <p className="text-stone-700 font-medium">
                            <span className="font-bold text-[#1b263b]">{isAr ? 'التأصيل النبوي: ' : 'Prophetic Grounding: '}</span>
                            {isAr ? q.explanationAr : q.explanationEn}
                          </p>
                          <p className="text-[10px] text-stone-500 font-mono">
                            {isAr ? `السند: ${q.hadithSource}` : `Source: ${q.hadithSource}`}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit & Results */}
              <div className="pt-2">
                {!quizSubmitted ? (
                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(quizAnswers).length < HAJJ_QUIZ_QUESTIONS.length}
                    className={`w-full py-4 rounded-2xl font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
                      Object.keys(quizAnswers).length === HAJJ_QUIZ_QUESTIONS.length
                        ? 'bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 text-white cursor-pointer hover:scale-[1.01]'
                        : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    <Award className="w-5 h-5 text-amber-300" />
                    <span>
                      {Object.keys(quizAnswers).length === HAJJ_QUIZ_QUESTIONS.length
                        ? isAr
                          ? 'تسليم الإجابات وإظهار وسام إتقان الحج 🏆'
                          : 'Submit Answers & Reveal Certificate 🏆'
                        : isAr
                        ? `أجب عن جميع الأسئلة أولاً (${Object.keys(quizAnswers).length}/${HAJJ_QUIZ_QUESTIONS.length})`
                        : `Answer all questions (${Object.keys(quizAnswers).length}/${HAJJ_QUIZ_QUESTIONS.length})`}
                    </span>
                  </button>
                ) : (
                  /* Certificate */
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121c2d] via-[#1d2a42] to-[#0a111c] text-white border-2 border-amber-400 shadow-2xl text-center space-y-4 animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center mx-auto text-3xl">
                      🏅
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                        {isAr ? 'وسام إتقان فقه الحج وعمرة التمتع' : 'Hajj & Tamattu’ Mastery Medal'}
                      </span>
                      <h3 className="text-2xl font-black text-white">
                        {isAr ? `نتيجتك: ${quizScore} من أصل ${HAJJ_QUIZ_QUESTIONS.length}` : `Score: ${quizScore} / ${HAJJ_QUIZ_QUESTIONS.length}`}
                      </h3>
                      <p className="text-xs text-stone-300 max-w-md mx-auto">
                        {quizScore >= 4
                          ? isAr
                            ? 'مبارك! أتقنت الفقه النبوي لمناسك الحج وعمرة التمتع وتم توثيق إنجازك في سجل التعلم وإضافة +40 نقطة سكينة.'
                            : 'Mabrook! You demonstrated authentic mastery of Hajj & Tamattu’ and earned +40 peace points.'
                          : isAr
                          ? 'أداء طيب، يمكنك مراجعة الأسئلة وتكرار المحاولة لترسيخ الفقه.'
                          : 'Good effort, you can review and retry anytime to reinforce your learning.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          playSoftTap();
                          setCurrentStage('overview_types');
                          setQuizAnswers({});
                          setQuizSubmitted(false);
                          setAqabahPebblesRemaining(7);
                          setAqabahDone(false);
                          setTahallulCutDone(false);
                          setTashreeqDay(11);
                          setTashreeqPillarIndex(0);
                          setTashreeqPebblesRemaining(7);
                          setTashreeqPillarsDone({});
                          setTashreeqDuaDone({});
                        }}
                        className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>{isAr ? 'إعادة المحاكاة من البداية' : 'Restart'}</span>
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

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-[#EFE7D8] border-t border-[#D8CABE] flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1b263b]">{isAr ? 'تأصيل الحج النبوي:' : 'Grounding:'}</span>
            <span className="hidden sm:inline">
              {isAr ? 'حجة الوداع وصحيحي البخاري ومسلم' : 'Prophet’s Farewell Pilgrimage'}
            </span>
          </div>

          <span className="text-[11px] font-mono">
            {completedStages.length} / 9 {isAr ? 'مراحل منجزة' : 'stages done'}
          </span>
        </div>
      </div>
    </div>
  );
};
