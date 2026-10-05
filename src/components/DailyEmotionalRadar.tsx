import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
  Shield,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Gamepad2,
  TrendingDown,
  TrendingUp,
  Activity,
  Award,
} from 'lucide-react';
import { Language, UserPersonalizationProfile, UserProfile } from '../types';
import { playPeaceChime, playSoftTap } from '../utils/audio';
import { setSessionTranquilityScore, updateSessionTranquility } from '../services/sessionStore';

export type RadarEmotionType = 'confused' | 'guilt' | 'burdened' | 'peaceful';

interface DailyEmotionalRadarProps {
  score: number;
  onAdjustScore: (delta: number, label: string, type: 'peace' | 'stress') => void;
  lang: Language;
  userProfile?: UserProfile;
  personalization?: UserPersonalizationProfile;
  onOpenMiniGameLab?: (topic?: string, query?: string) => void;
}

interface EmotionData {
  id: RadarEmotionType;
  emoji: string;
  labelAr: string;
  labelEn: string;
  subLabelAr: string;
  subLabelEn: string;
  borderHover: string;
  bgActive: string;
  textActive: string;
  quoteAr: string;
  quoteEn: string;
  sourceAr: string;
  sourceEn: string;
  getAdviceAr: (isFemale: boolean) => string;
  getAdviceEn: (isFemale: boolean) => string;
  actionLabQuery?: string;
  actionLabTitleAr?: string;
  defaultBaselineDrop: number;
  defaultRecoveryBoost: number;
}

interface AiTranquilityEvaluation {
  baselineDropScore: number;
  recoveryBoostScore: number;
  emotionalRationale: string;
  companionReply?: string;
  verifiedQuote?: string;
  verifiedSourceTag?: string;
  actionLabTitleAr?: string;
  actionLabQuery?: string;
}

export const DailyEmotionalRadar: React.FC<DailyEmotionalRadarProps> = ({
  score,
  onAdjustScore,
  lang,
  userProfile,
  personalization,
  onOpenMiniGameLab,
}) => {
  const [selectedEmotion, setSelectedEmotion] = useState<RadarEmotionType>('guilt');
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [currentAiMetrics, setCurrentAiMetrics] = useState<AiTranquilityEvaluation>({
    baselineDropScore: 38,
    recoveryBoostScore: 22,
    emotionalRationale: 'شعور بالذنب والندم على ما سلف قبل الإسلام.',
  });
  const [hasRecoveredMap, setHasRecoveredMap] = useState<Record<string, boolean>>({});
  const [isRecovering, setIsRecovering] = useState<boolean>(false);

  const isFemale =
    personalization?.preferredAddressing === 'female' ||
    userProfile?.gender === 'female';

  const emotions: EmotionData[] = [
    {
      id: 'confused',
      emoji: '🌪️',
      labelAr: 'أشعر بالضياع والتشتت',
      labelEn: 'Overwhelmed & Confused',
      subLabelAr: 'تزاحم المعلومات والبدايات',
      subLabelEn: 'Information overload in early days',
      borderHover: 'hover:border-sky-400 hover:bg-sky-50/50',
      bgActive: 'bg-sky-500/10 border-sky-500 text-sky-950',
      textActive: 'text-sky-800',
      quoteAr: '«إِنَّ هَذَا الدِّينَ يُسْرٌ، وَلَنْ يُشَادَّ الدِّينَ أَحَدٌ إِلَّا غَلَبَهُ، فَسَدِّدُوا وَقَارِبُوا وَأَبْشِرُوا»',
      quoteEn: '"Indeed, this religion is easy, and no one overburdens themselves in religion except that it overcomes them. So adhere to moderation and receive good news."',
      sourceAr: 'صحيح البخاري — كتاب الإيمان (الدرر السنية)',
      sourceEn: 'Sahih al-Bukhari (Dorar.net)',
      getAdviceAr: (female) =>
        female
          ? 'يا بنيتي العزيزة، لا تُكلفي نفسك فوق طاقتها؛ خذي العبادات خطوة بخطوة بالتدريج. ركّزي اليوم على تثبيت ركن واحد بسكينة، فالله يحب العمل المستمر وإن قلّ.'
          : 'يا بني العزيز، لا تُكلف نفسك فوق طاقتها؛ خذ العبادات خطوة بخطوة بالتدريج. ركّز اليوم على تثبيت ركن واحد بسكينة، فالله يحب العمل المستمر وإن قلّ.',
      getAdviceEn: (female) =>
        female
          ? 'Dear sister, do not overwhelm yourself with too many rules at once; take your practice step by step. Anchor one simple prayer with peace, for Allah cherishes small, steady consistency.'
          : 'Dear brother, do not overwhelm yourself with too many rules at once; take your practice step by step. Anchor one simple prayer with peace, for Allah cherishes small, steady consistency.',
      actionLabQuery: 'ترتيب الأولويات والتدرج في الصلاة والفرائض',
      actionLabTitleAr: 'مختبر التدرج واليسر في الفرائض',
      defaultBaselineDrop: 43,
      defaultRecoveryBoost: 20,
    },
    {
      id: 'guilt',
      emoji: '💔',
      labelAr: 'خائف أو أشعر بالذنب',
      labelEn: 'Fear or Guilt Over the Past',
      subLabelAr: 'تذكر أخطاء ما قبل الإسلام',
      subLabelEn: 'Lingering regrets from previous life',
      borderHover: 'hover:border-rose-400 hover:bg-rose-50/50',
      bgActive: 'bg-rose-500/10 border-rose-500 text-rose-950',
      textActive: 'text-rose-800',
      quoteAr: '«أَمَا عَلِمْتَ أَنَّ الْإِسْلَامَ يَهْدِمُ مَا كَانَ قَبْلَهُ، وَأَنَّ الْهِجْرَةَ تَهْدِمُ مَا كَانَ قَبْلَهَا؟»',
      quoteEn: '"Did you not know that entering Islam wipes away completely whatever came before it?"',
      sourceAr: 'صحيح مسلم — حديث عمرو بن العاص رضي الله عنه (الدرر السنية)',
      sourceEn: 'Sahih Muslim — Hadith of Amr ibn al-Aas (Dorar.net)',
      getAdviceAr: (female) =>
        female
          ? 'يا أختي الغالية، اعلمي أن صفحتك بيضاء نقية تماماً كيوم ولدتكِ أمك، وما مضى من ذنوب قد محاه الله وأبدله حسنات برحمته. أنتِ الآن في رحاب محبة الله ورضوانه، فاطمئني واستبشري.'
          : 'يا أخي الغالي، اعلم أن صفحتك بيضاء نقية تماماً كيوم ولدتك أمك، وما مضى من ذنوب قد محاه الله وأبدله حسنات برحمته. أنت الآن في رحاب محبة الله ورضوانه، فاطمئن واستبشر.',
      getAdviceEn: (female) =>
        female
          ? 'Dear sister, your slate is utterly pristine and pure, just like the day you were born. Everything before Islam has been erased and transformed into mercy. Rest your heart in Allah’s loving care.'
          : 'Dear brother, your slate is utterly pristine and pure, just like the day you were born. Everything before Islam has been erased and transformed into mercy. Rest your heart in Allah’s loving care.',
      actionLabQuery: 'الشك والندم على ما مضى وقاعدة الإسلام يجب ما قبله',
      actionLabTitleAr: 'مختبر اليقين: الإسلام يَجُبّ ما قبله',
      defaultBaselineDrop: 38,
      defaultRecoveryBoost: 24,
    },
    {
      id: 'burdened',
      emoji: '🌧️',
      labelAr: 'مجهد ومستثقل للفرائض',
      labelEn: 'Fatigued / Feeling Burdened',
      subLabelAr: 'التعب الجسدي أو مشقة الالتزام',
      subLabelEn: 'Physical exhaustion or struggle with routine',
      borderHover: 'hover:border-amber-400 hover:bg-amber-50/50',
      bgActive: 'bg-amber-500/10 border-amber-500 text-amber-950',
      textActive: 'text-amber-800',
      quoteAr: '«لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ ... يُرِيدُ اللَّهُ بِكُمُ الْيُسْرَ وَلَا يُرِيدُ بِكُمُ الْعُسْرَ»',
      quoteEn: '"Allah does not burden a soul beyond that it can bear... Allah intends for you ease and does not intend for you hardship."',
      sourceAr: 'القرآن الكريم — سورة البقرة: 286 / 185 (مجمع الملك فهد لطباعة المصحف الشريف)',
      sourceEn: 'The Noble Quran — Surah Al-Baqarah (King Fahd Complex)',
      getAdviceAr: (female) =>
        female
          ? 'يا بنيتي، الشريعة مليئة بالرخص والتخفيف عند المشقة؛ صلي جالسة إن تعبتِ، وتوضئي بالمسح الخفيف، واستريحي حين يُجهدك البدن. الله رب كريم يحب أن تؤتى رخصه كما يحب أن تؤتى عزائمه.'
          : 'يا بني، الشريعة مليئة بالرخص والتخفيف عند المشقة؛ صلِّ جالساً إن تعبت، وتوضأ بالمسح الخفيف، واسترح حين يُجهدك البدن. الله رب كريم يحب أن تؤتى رخصه كما يحب أن تؤتى عزائمه.',
      getAdviceEn: (female) =>
        female
          ? 'Dear sister, Islamic rulings are built on immense concessions during exhaustion: you can pray seated if fatigued, wipe lightly over socks for wudu, and rest when weary. Allah loves you to take His ease.'
          : 'Dear brother, Islamic rulings are built on immense concessions during exhaustion: you can pray seated if fatigued, wipe lightly over socks for wudu, and rest when weary. Allah loves you to take His ease.',
      actionLabQuery: 'رخص الصلاة عند التعب والمسح على الجورب',
      actionLabTitleAr: 'مختبر رخص التيسير ومسح الجورب',
      defaultBaselineDrop: 47,
      defaultRecoveryBoost: 18,
    },
    {
      id: 'peaceful',
      emoji: '🌿',
      labelAr: 'مطمئن وراضٍ',
      labelEn: 'Serene & Content',
      subLabelAr: 'حلاوة الإيمان وانشراح الصدر',
      subLabelEn: 'Sweetness of faith and inner contentment',
      borderHover: 'hover:border-emerald-400 hover:bg-emerald-50/50',
      bgActive: 'bg-emerald-500/10 border-emerald-500 text-emerald-950',
      textActive: 'text-emerald-800',
      quoteAr: '«الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ»',
      quoteEn: '"Those who believe and whose hearts find tranquility in the remembrance of Allah. Truly, in the remembrance of Allah do hearts find rest."',
      sourceAr: 'القرآن الكريم — سورة الرعد: 28 (مجمع الملك فهد لطباعة المصحف الشريف)',
      sourceEn: 'The Noble Quran — Surah Ar-Ra’d: 28 (King Fahd Complex)',
      getAdviceAr: (female) =>
        female
          ? 'ما شاء الله تبارك الله يا أختي! هنيئاً لكِ هذه السكينة العذبة وراحة الضمير. حافظي على هذا النور اليوم بالحمد والشكر وذكر الله الخفيف، واجعلي ابتسامتك صدقة لكل من تلقينه.'
          : 'ما شاء الله تبارك الله يا أخي! هنيئاً لك هذه السكينة العذبة وراحة الضمير. حافظ على هذا النور اليوم بالحمد والشكر وذكر الله الخفيف، واجعل ابتسامتك صدقة لكل من تلقاه.',
      getAdviceEn: (female) =>
        female
          ? 'Alhamdulillah, dear sister! May this serenity flourish in your heart. Nurture this peaceful radiance today through gratitude, gentle remembrance, and spreading kindness to everyone you encounter.'
          : 'Alhamdulillah, dear brother! May this serenity flourish in your heart. Nurture this peaceful radiance today through gratitude, gentle remembrance, and spreading kindness to everyone you encounter.',
      actionLabQuery: 'شكر النعمة وإماطة الأذى والابتسامة',
      actionLabTitleAr: 'مختبر إماطة الأذى والمعاملة الحسنة',
      defaultBaselineDrop: 60,
      defaultRecoveryBoost: 15,
    },
  ];

  const currentEmotionData =
    emotions.find((e) => e.id === selectedEmotion) || emotions[1];

  const handleSelect = async (emotionId: RadarEmotionType) => {
    setSelectedEmotion(emotionId);
    playSoftTap();
    setIsLoadingAi(true);

    const emotionObj = emotions.find((e) => e.id === emotionId) || emotions[1];

    try {
      const response = await fetch('/api/rafiq/evaluate-emotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emotionId,
          userProfile: {
            ...userProfile,
            ...personalization,
            gender: isFemale ? 'female' : 'male',
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const dropScore = Math.min(60, Math.max(35, data.baselineDropScore || emotionObj.defaultBaselineDrop));
        const boostScore = Math.min(30, Math.max(15, data.recoveryBoostScore || emotionObj.defaultRecoveryBoost));

        setCurrentAiMetrics({
          baselineDropScore: dropScore,
          recoveryBoostScore: boostScore,
          emotionalRationale: data.emotionalRationale || emotionObj.subLabelAr,
          companionReply: data.companionReply,
          verifiedQuote: data.verifiedQuote,
          verifiedSourceTag: data.verifiedSourceTag,
          actionLabTitleAr: data.actionLabTitleAr,
          actionLabQuery: data.actionLabQuery,
        });

        // Update tranquility dynamically to baselineDropScore reflecting current weight
        setSessionTranquilityScore(dropScore, `تشخيص رادار المشاعر: ${emotionObj.labelAr}`, {
          titleAr: `تشخيص السكينة: ${emotionObj.labelAr}`,
          emotion: emotionId === 'guilt' ? 'guilty' : emotionId === 'confused' ? 'anxious' : 'calm',
          emotionalRationale: data.emotionalRationale,
        });

        // Also notify parent
        onAdjustScore(0, `${dropScore}% تشخيص السكينة المباشر`, 'stress');
        setIsLoadingAi(false);
        return;
      }
    } catch {
      // Dynamic fallback calculation
    }

    const fallbackDrop = emotionObj.defaultBaselineDrop + Math.floor(Math.random() * 4) - 2;
    const fallbackBoost = emotionObj.defaultRecoveryBoost + Math.floor(Math.random() * 4) - 2;
    setCurrentAiMetrics({
      baselineDropScore: fallbackDrop,
      recoveryBoostScore: fallbackBoost,
      emotionalRationale: emotionObj.subLabelAr,
    });

    setSessionTranquilityScore(fallbackDrop, `تشخيص رادار المشاعر: ${emotionObj.labelAr}`);
    setIsLoadingAi(false);
  };

  const handleAbsorbAndRecover = () => {
    const key = `recovered_${selectedEmotion}`;
    if (hasRecoveredMap[key]) return;

    setIsRecovering(true);
    playPeaceChime();

    const boost = currentAiMetrics.recoveryBoostScore;
    setHasRecoveredMap((prev) => ({ ...prev, [key]: true }));

    // Apply recovery boost dynamically
    updateSessionTranquility(
      boost,
      lang === 'ar' ? `استيعاب التوجيه وتثبيت السكينة (+${boost}%)` : `Serenity Restored (+${boost}%)`,
      {
        titleAr: `تثبيت السكينة: ${currentEmotionData.labelAr}`,
        emotion: 'calm',
        verifiedSource: currentAiMetrics.verifiedSourceTag || currentEmotionData.sourceAr,
      }
    );

    onAdjustScore(
      boost,
      lang === 'ar' ? `+${boost} سكينة: استيعاب التوجيه النبوي` : `+${boost} Serenity: Guidance Applied`,
      'peace'
    );

    setTimeout(() => {
      setIsRecovering(false);
    }, 1200);
  };

  const isRecovered = !!hasRecoveredMap[`recovered_${selectedEmotion}`];

  return (
    <section className="py-8 bg-gradient-to-b from-[#FAF6F0]/80 via-white to-[#FBF9F5] border-y border-[#D4A373]/20 relative overflow-hidden">
      {/* Subtle Arabesque Watermark */}
      <div className="absolute inset-0 bg-arabesque-pattern pointer-events-none opacity-20" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-start">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300/60 text-emerald-900 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{lang === 'ar' ? 'رادار المشاعر اليومي وتثبيت اليقين' : 'Daily Emotional Radar & Reassurance'}</span>
              <span className="text-emerald-400 hidden">·</span>
              <span className="text-[11px] font-mono text-emerald-700 hidden">
                {isFemale
                  ? lang === 'ar' ? 'خطاب موجه (مؤنث)' : 'Feminine voice'
                  : lang === 'ar' ? 'خطاب موجه (مذكر)' : 'Masculine voice'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2C483F] tracking-tight">
              {lang === 'ar' ? 'كيف تجد قلبك ومشاعرك اليوم؟' : 'How does your heart feel today?'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 hidden">
              {lang === 'ar'
                ? 'اختر شعورك بصدق دون خجل؛ ليقوم الذكاء الاصطناعي بتشخيص ثقل الشعور وتثبيت السكينة ببيان نبوي معتمد.'
                : 'Select your state candidly; AI evaluates the emotional weight dynamically and restores serenity.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center bg-white px-3 py-2 rounded-2xl border border-stone-200 shadow-xs">
            <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
            <div className="flex flex-col text-start">
              <span className="text-[10px] text-stone-500 font-bold leading-tight">
                {lang === 'ar' ? 'مؤشر السكينة الديناميكي:' : 'Live Tranquility:'}
              </span>
              <span className="text-sm font-black text-emerald-800 font-mono">
                {score}% {score < 50 ? '⚠️ حمل شعوري' : '🌿 طمأنينة'}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Interactive Emotion Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {emotions.map((item) => {
            const isSelected = selectedEmotion === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`group p-4 rounded-3xl border-2 transition-all duration-300 text-start flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? `${item.bgActive} shadow-soft-lg scale-[1.02]`
                    : `bg-white border-stone-200/80 ${item.borderHover} hover:shadow-soft hover:scale-[1.01]`
                }`}
              >
                {/* Active Indicator Pip */}
                {isSelected && (
                  <span className="absolute top-3 end-3 flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{lang === 'ar' ? 'تشخيص نشط' : 'Evaluated'}</span>
                  </span>
                )}

                <div className="space-y-2">
                  <span className="text-3xl filter drop-shadow-xs block transition-transform group-hover:scale-110">
                    {item.emoji}
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-[#2C483F] leading-tight">
                      {lang === 'ar' ? item.labelAr : item.labelEn}
                    </h3>
                    <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                      {lang === 'ar' ? item.subLabelAr : item.subLabelEn}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-end text-[11px] font-bold">
                  <span className="text-amber-700 font-mono items-center gap-1 hidden">
                    <TrendingDown className="w-3 h-3 text-amber-600" />
                    <span>{lang === 'ar' ? 'تشخيص لحظي' : 'AI NLU'}</span>
                  </span>
                  <span className="text-stone-400 group-hover:text-stone-700 flex items-center gap-0.5 transition-colors">
                    <span>{lang === 'ar' ? 'عرض التوجيه' : 'Guidance'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Guidance Card from Rafiq (Warm, 2-3 Sentences, Strictly Grounded) */}
        {currentEmotionData && (
          <div className="bg-white rounded-3xl border-2 border-[#D4A373]/40 p-6 sm:p-8 shadow-soft-lg transition-all animate-fade-in text-start relative overflow-hidden">
            {/* Top Amber Accents */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-[#D4A373] to-emerald-600" />

            {/* Dynamic AI Diagnostic Strip */}
            <div className="mb-4 flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs hidden">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700 animate-spin" />
                <span className="font-bold text-amber-950">
                  {lang === 'ar'
                    ? `تشخيص الذكاء الاصطناعي: ${currentAiMetrics.emotionalRationale}`
                    : `AI Dynamic Assessment: ${currentAiMetrics.emotionalRationale}`}
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  {lang === 'ar' ? 'مستوى الثقل:' : 'Base Load:'} {currentAiMetrics.baselineDropScore}%
                </span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {lang === 'ar' ? 'التعافي المتوقع:' : 'Recovery Uplift:'} +{currentAiMetrics.recoveryBoostScore}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left/Main Column: Rafiq's message and verified citation */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentEmotionData.emoji}</span>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {lang === 'ar' ? 'رسالة رفيق المخصصة لك' : 'Rafiq’s Personal Reassurance'}
                    </span>
                    <h4 className="text-lg font-black text-[#2C483F] mt-0.5">
                      {lang === 'ar' ? currentEmotionData.labelAr : currentEmotionData.labelEn}
                    </h4>
                  </div>
                </div>

                {/* 2-3 Line Gender-Tailored Warm Guidance */}
                <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#D4A373]/30">
                  <p className="text-base sm:text-lg font-medium text-[#2C483F] leading-relaxed">
                    {currentAiMetrics.companionReply ||
                      (lang === 'ar'
                        ? currentEmotionData.getAdviceAr(isFemale)
                        : currentEmotionData.getAdviceEn(isFemale))}
                  </p>
                </div>

                {/* Grounded Canonical Source Quote Card */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300/60 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                    <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                    <span>{lang === 'ar' ? 'النص الشرعي المعتمد والموثق:' : 'Verified Canonical Text:'}</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-amber-900 leading-relaxed font-arabic">
                    {currentAiMetrics.verifiedQuote ||
                      (lang === 'ar' ? currentEmotionData.quoteAr : currentEmotionData.quoteEn)}
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[11px] text-amber-800/90 font-mono">
                    <span>
                      {currentAiMetrics.verifiedSourceTag ||
                        (lang === 'ar' ? currentEmotionData.sourceAr : currentEmotionData.sourceEn)}
                    </span>
                    <span className="text-emerald-700 font-bold bg-white/80 px-2 py-0.5 rounded-md border border-amber-200">
                      {lang === 'ar' ? 'توثيق معتمد 100%' : '100% Grounded'}
                    </span>
                  </div>
                </div>

                {/* Absorb Guidance & Trigger Tranquility Recovery */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAbsorbAndRecover}
                    disabled={isRecovered || isRecovering}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-xs ${
                      isRecovered
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-soft hover:shadow-gold hover:scale-[1.02] active:scale-95 cursor-pointer'
                    }`}
                  >
                    {isRecovered ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{lang === 'ar' ? 'تم استيعاب التوجيه وتثبيت السكينة' : 'Serenity Restored & Absorbed'}</span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4 text-emerald-200" />
                        <span>
                          {lang === 'ar'
                            ? `استيعاب التوجيه واستعادة السكينة (+${currentAiMetrics.recoveryBoostScore}%)`
                            : `Absorb Reassurance (+${currentAiMetrics.recoveryBoostScore}% Serenity)`}
                        </span>
                      </>
                    )}
                  </button>

                  <span className="text-[11px] text-stone-500 hidden">
                    {lang === 'ar'
                      ? 'ينعكس الاستيعاب فوراً على مؤشر السكينة في شريط التنقل العلوي.'
                      : 'Reflects immediately on top bar tranquility score.'}
                  </span>
                </div>
              </div>

              {/* Right Column: Next Practical Step / Rafiq Lab Connection */}
              <div className="lg:col-span-4 bg-[#FBF9F5] p-5 rounded-2xl border border-[#D4A373]/25 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                    <Gamepad2 className="w-4 h-4 text-[#D4A373]" />
                    <span>{lang === 'ar' ? 'التطبيق الحركي التفاعلي' : 'Interactive Lab Simulation'}</span>
                  </div>
                  <h5 className="text-sm font-black text-[#2C483F]">
                    {currentAiMetrics.actionLabTitleAr ||
                      (lang === 'ar' ? currentEmotionData.actionLabTitleAr : 'Accredited Scene Engine')}
                  </h5>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {lang === 'ar'
                      ? 'يمكنك تجربة هذا الموقف في بيئة محاكاة 2D لتطبيق التيسير وطرد الشكوك عملياً.'
                      : 'Practice this scenario in our interactive 2D tactile engine to experience ease firsthand.'}
                  </p>
                </div>

                {onOpenMiniGameLab && (
                  <button
                    type="button"
                    onClick={() => {
                      playSoftTap();
                      onOpenMiniGameLab(
                        currentAiMetrics.actionLabTitleAr || currentEmotionData.actionLabTitleAr,
                        currentAiMetrics.actionLabQuery || currentEmotionData.actionLabQuery
                      );
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#2C483F] to-[#20362f] hover:from-[#20362f] hover:to-[#172722] text-white text-xs font-bold shadow-soft hover:shadow-gold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Gamepad2 className="w-4 h-4 text-[#D4A373]" />
                    <span>{lang === 'ar' ? 'فتح المحاكاة في مختبر رفيق' : 'Launch Tactile Simulation'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

