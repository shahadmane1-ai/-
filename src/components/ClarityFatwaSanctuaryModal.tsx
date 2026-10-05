import React, { useState } from 'react';
import {
  Shield,
  Sparkles,
  Search,
  Compass,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Sliders,
  X,
  HelpCircle,
  ExternalLink,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { Language } from '../types';
import { playPeaceChime, playSoftTap } from '../utils/audio';
import {
  VerificationQA,
  loadSavedFatwaSanctuaryRecords,
} from '../services/fatwaSanctuaryService';

export type { VerificationQA };

interface ClarityFatwaSanctuaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const VERIFIED_ANSWERS: VerificationQA[] = [
  {
    id: 'wudu_doubts',
    category: 'worship',
    queryAr: 'وسوسة الوضوء والشك في انتقاض الطهارة',
    queryEn: 'Wudu Doubts and Obsession over Breaking Purity',
    answerAr: 'القاعدة النبوية الصريحة: «لا ينصرف حتى يسمع صوتاً أو يجد ريحاً». اليقين أنك طاهر، والشك الطارئ ملغى شرعاً ولا تلتفت إليه أبداً.',
    answerEn: 'Prophetic rule: Do not leave prayer unless you hear a sound or smell an odor. Your certainty of purity dispels passing doubt entirely.',
    coreRuleAr: 'قاعدة فقهية كبرى: «اليقين لا يزول بالشك»',
    coreRuleEn: 'Major Maxim: "Certainty is not overruled by doubt"',
    hadithOrAyahAr: '«فَلَا يَنْصَرِفْ حَتَّى يَسْمَعَ صَوْتًا أَوْ يَجِدَ رِيحًا»',
    hadithOrAyahEn: '"He should not leave until he hears a sound or perceives an odor."',
  },
  {
    id: 'prayer_at_work',
    category: 'worship',
    queryAr: 'الصلاة في مكان العمل أو الأماكن العامة دون سجادة مخصصة',
    queryEn: 'Praying at Work or Public Spaces Without a Special Rug',
    answerAr: 'الأرض كلها طاهرة ومسجد أينما أدركتك الصلاة. يكفيك أن تكون البقعة نظيفة ظاهرياً ولا يُشترط مصلى خاص أو سجادة معينة.',
    answerEn: 'The entire earth is a clean sanctuary. Any dry, clean floor suffices without needing a special carpet.',
    coreRuleAr: 'قاعدة فقهية: «جُعلت لي الأرض مسجداً وطهوراً»',
    coreRuleEn: 'Prophetic Maxim: "The earth has been made for me a mosque and pure"',
    hadithOrAyahAr: '«فَأَيُّمَا رَجُلٍ مِنْ أُمَّتِي أَدْرَكَتْهُ الصَّلَاةُ فَلْيُصَلِّ»',
    hadithOrAyahEn: '"Wherever prayer overtakes anyone of my nation, let them pray."',
  },
  {
    id: 'food_inspection',
    category: 'food',
    queryAr: 'التدقيق المفرط والوسواس في أطعمة المطاعم العادية',
    queryEn: 'Over-investigating and Doubting Wholesome Restaurant Food',
    answerAr: 'الأصل في الأطعمة الحل والطهارة. ما لم يكن لحم خنزير أو خمراً ظاهراً، فالشريعة تنهى عن التنقيب والوسوسة وسؤال الناس عما وراء الظاهر.',
    answerEn: 'Original status of food is lawful and pure. Unless explicit pork or intoxicating liquor is present, avoid obsessive inquiry.',
    coreRuleAr: 'قاعدة فقهية: «الأصل في الأشياء الإباحة والحل»',
    coreRuleEn: 'Jurisprudential Maxim: "Original status of things is permissibility"',
    hadithOrAyahAr: '«سَمُّوا اللَّهَ عَلَيْهِ وَكُلُوا» (رواه البخاري في رفع الحرج عن طعام المسلمين)',
    hadithOrAyahEn: '"Mention Allah’s name and eat" (Bukhari)',
  },
  {
    id: 'scholarly_disputes',
    category: 'mindset',
    queryAr: 'النزاعات والآراء المتشددة على شبكات التواصل الاجتماعي',
    queryEn: 'Rigid Opinions & Contentious Debates on Social Media',
    answerAr: 'المسائل الاجتهادية التي اختلف فيها الفقهاء المعتبرون لا إنكار فيها. خذ بالأيسر والأنسب لحالك، ولا تجعل الخلاف الفقهي سبباً للتوتر.',
    answerEn: 'Valid scholarly differences carry zero condemnation. Choose the established opinion providing ease and peace in your daily life.',
    coreRuleAr: 'قاعدة فقهية ذهبية: «لا يُنْكَرُ المختلفُ فيه، وإنما يُنْكَرُ المجمعُ عليه»',
    coreRuleEn: 'Golden Maxim: "No condemnation in matters of valid scholarly difference"',
    hadithOrAyahAr: '«إِنَّ الدِّينَ يُسْرٌ، وَلَنْ يُشَادَّ الدِّينَ أَحَدٌ إِلَّا غَلَبَهُ»',
    hadithOrAyahEn: '"Indeed, the religion is ease, and none overburdens themselves with it but it overcomes them."',
  },
  {
    id: 'family_relations',
    category: 'social',
    queryAr: 'التعامل مع العائلة والأقارب غير المسلمين أو غير الملتزمين',
    queryEn: 'Interacting with Non-Muslim or Less Practicing Family Members',
    answerAr: 'بر الوالدين وحسن الخلق والإحسان إلى الأهل فريضة لا تسقط أبداً. المشاركة في مناسباتهم العائلية ببر ولطف من أعظم أبواب الدعوة بالقدوة.',
    answerEn: 'Kindness, filial devotion to parents, and gentle familial bonds remain an absolute duty. Warm presence exemplifies true faith.',
    coreRuleAr: 'أمر قرآني محكم: «وَصَاحِبْهُمَا فِي الدُّنْيَا مَعْرُوفًا»',
    coreRuleEn: 'Divine Command: "Accompany them in this world with kindness"',
    hadithOrAyahAr: '«صِلِي أُمَّكِ» (توجيه النبي ﷺ لأسماء بنت أبي بكر)',
    hadithOrAyahEn: '"Maintain ties with your mother" (Prophetic instruction)',
  },
];

export const ClarityFatwaSanctuaryModal: React.FC<ClarityFatwaSanctuaryModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'lens' | 'compass' | 'search'>('lens');
  const [lensSlider, setLensSlider] = useState<number>(75);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedQaId, setExpandedQaId] = useState<string | null>('wudu_doubts');
  const [selectedCompassPrinciple, setSelectedCompassPrinciple] = useState<number>(0);
  const [userRecords, setUserRecords] = useState<VerificationQA[]>([]);

  // Load saved records whenever modal opens
  React.useEffect(() => {
    if (isOpen) {
      const saved = loadSavedFatwaSanctuaryRecords();
      setUserRecords(saved);
    }
  }, [isOpen]);

  // Combine user records with predefined verified answers (newest first, no duplicates)
  const combinedQas: VerificationQA[] = React.useMemo(() => {
    const seenIds = new Set<string>();
    const seenQueries = new Set<string>();
    const result: VerificationQA[] = [];

    for (const item of userRecords) {
      const normQ = item.queryAr.trim().toLowerCase();
      if (!seenIds.has(item.id) && !seenQueries.has(normQ)) {
        seenIds.add(item.id);
        seenQueries.add(normQ);
        result.push(item);
      }
    }

    for (const item of VERIFIED_ANSWERS) {
      const normQ = item.queryAr.trim().toLowerCase();
      if (!seenIds.has(item.id) && !seenQueries.has(normQ)) {
        seenIds.add(item.id);
        seenQueries.add(normQ);
        result.push(item);
      }
    }

    return result;
  }, [userRecords]);

  if (!isOpen) return null;

  const filteredQas = combinedQas.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.queryAr.toLowerCase().includes(q) ||
      item.queryEn.toLowerCase().includes(q) ||
      item.answerAr.toLowerCase().includes(q) ||
      item.answerEn.toLowerCase().includes(q) ||
      item.coreRuleAr.toLowerCase().includes(q)
    );
  });

  const EASE_PRINCIPLES = [
    {
      titleAr: 'المشقة تجلب التيسير',
      titleEn: 'Hardship Begets Ease',
      taglineAr: 'كلما ضاق الأمر اتسع، والرخص الشرعية شرعت لرحمة العباد',
      taglineEn: 'Whenever circumstances constrict, divine concessions expand',
      evidenceAr: '«يُرِيدُ اللَّهُ بِكُمُ الْيُسْرَ وَلَا يُرِيدُ بِكُمُ الْعُسْرَ» [البقرة: 185]',
      evidenceEn: '"Allah intends for you ease and does not intend for you hardship" [2:185]',
      practicalAr: 'إذا مرضت تصلي جالساً، وإذا سافرت تقصر وتجمع، وإذا خشيت فوت الوقت تؤدي الفريضة بيسر.',
      practicalEn: 'If sick pray seated, if traveling shorten and combine, if constrained pray with gentle simplicity.',
      icon: '🌿',
    },
    {
      titleAr: 'رفع الحرج ونفي المشقة المفرطة',
      titleEn: 'Removal of Undue Burden',
      taglineAr: 'الشريعة لم تبنَ على التعذيب النفسي أو المشقة المرهقة',
      taglineEn: 'Faith was never revealed to burden hearts or exhaust the soul',
      evidenceAr: '«وَمَا جَعَلَ عَلَيْكُمْ فِي الدِّينِ مِنْ حَرَجٍ» [الحج: 78]',
      evidenceEn: '"And has not placed upon you in the religion any difficulty" [22:78]',
      practicalAr: 'التكليف منوط بالقدرة والاستطاعة، وما عجزت عنه سقط عنك دون تأنيب ضمير.',
      practicalEn: 'Obligations match true capacity; whatever exceeds reasonable means is pardoned.',
      icon: '🕊️',
    },
    {
      titleAr: 'الأصل في الأشياء الإباحة والحل',
      titleEn: 'Original State is Permissibility',
      taglineAr: 'كل شيء في الكون حلال مباح ما لم يأتِ نص قطعي صريح بالتحريم',
      taglineEn: 'Everything in life is lawful unless an explicit, definitive text forbids it',
      evidenceAr: '«هُوَ الَّذِي خَلَقَ لَكُم مَّا فِي الْأَرْضِ جَمِيعًا» [البقرة: 29]',
      evidenceEn: '"It is He who created for you all of that which is on the earth" [2:29]',
      practicalAr: 'لا تشكك في الأطعمة أو الملابس أو المعاملات العادية دون دليل واضح.',
      practicalEn: 'Never doubt foods, garments, or everyday dealings without clear evidence.',
      icon: '✨',
    },
    {
      titleAr: 'اليقين لا يزول بالشك',
      titleEn: 'Certainty Overcomes Doubt',
      taglineAr: 'طرد الوساوس والشكوك الطارئة في الطهارة والنية والعبادة',
      taglineEn: 'Repelling transient whispers and anxiety in worship and purity',
      evidenceAr: '«دَعْ مَا يَرِيبُكَ إِلَى مَا لَا يَرِيبُكَ» [الترمذي]',
      evidenceEn: '"Leave that which makes you doubt for that which does not make you doubt"',
      practicalAr: 'إذا تيقنت الوضوء وشككت في خروج الريح، فأنت طاهر 100% ولا تعيد الوضوء أبداً.',
      practicalEn: 'If certain of wudu but doubtful of breaking it, you remain 100% pure.',
      icon: '🛡️',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#1C2E28]/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
    >
      <div className="relative w-full max-w-4xl bg-gradient-to-br from-[#FFFDF9] via-[#FBF9F5] to-[#F5EFEB] rounded-t-3xl sm:rounded-3xl border-t-2 sm:border-2 border-[#D4A373] shadow-soft-lg overflow-hidden flex flex-col max-h-[88vh] sm:max-h-[92vh]">
        {/* Sanctuary Top Banner */}
        <div className="bg-gradient-to-r from-[#2C483F] via-[#20362f] to-[#1C2E28] text-white p-4 sm:p-6 border-b border-[#D4A373]/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4A373] to-[#b38253] text-[#1C2E28] flex items-center justify-center font-black shadow-gold shrink-0">
              <Shield className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            <div className="text-start">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {lang === 'ar'
                    ? 'محراب اليقين وتفكيك الشبهات'
                    : 'Clarity & Fatwa Sanctuary'}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#88C947] text-[#1C2E28]">
                  {lang === 'ar' ? 'ملاذ الراحة والفتوى المعتمدة' : 'Verified Ease & Balance'}
                </span>
              </div>
              <p className="text-xs text-white/80 mt-0.5">
                {lang === 'ar'
                  ? 'فصل الأركان الثابتة عن الخلاف، والتمسك بقواعد التيسير النبوية بعيداً عن ضجيج التشدد.'
                  : 'Separating core pillars from disputed opinions, anchored in Prophetic ease.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playSoftTap();
              onClose();
            }}
            className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Main Sanctuary Tabs */}
        <div className="p-3 bg-white/70 border-b border-[#D4A373]/25 flex items-center gap-2 overflow-x-auto">
          {[
            {
              id: 'lens',
              labelAr: '🔍 عدسة تفكيك الفتوى (3 طبقات)',
              labelEn: '🔍 Fatwa Disentangler Lens',
              icon: <Layers className="w-4 h-4" />,
            },
            {
              id: 'compass',
              labelAr: '🧭 بوصلة التيسير وقواعد رفع الحرج',
              labelEn: '🧭 Ease & Mercy Compass',
              icon: <Compass className="w-4 h-4" />,
            },
            {
              id: 'search',
              labelAr: '📚 بنك الإجابات المعتمدة للمبتدئين',
              labelEn: '📚 Verified Beginner Q&A',
              icon: <Search className="w-4 h-4" />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                playSoftTap();
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#2C483F] text-white shadow-soft'
                  : 'bg-stone-100 hover:bg-stone-200 text-[#2C483F]'
              }`}
            >
              {tab.icon}
              <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* TAB 1: THE FATWA DISENTANGLER LENS */}
          {activeTab === 'lens' && (
            <div className="space-y-6 animate-fade-in text-start">
              {/* Introduction Banner */}
              <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#D4A373]/30">
                <h4 className="text-sm font-black text-[#2C483F] flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#88C947]" />
                  <span>
                    {lang === 'ar'
                      ? 'مبدأ العدسة التفكيكية: الشريعة ليست كتلة متشددة صماء!'
                      : 'The Disentangler Principle: Faith is not a rigid monolithic block!'}
                  </span>
                </h4>
                <p className="text-xs text-[#2C483F]/80 leading-relaxed">
                  {lang === 'ar'
                    ? 'كثير من القلق ينشأ عندما يُصوّر مقطع فيديو عابر أو رأي متشدد سنة مستحبة على أنها فرض تبطل الصلاة بتركه! حرك العدسة لتفكيك أي مسألة إلى طبقاتها الشرعية الثلاث الحقيقية:'
                    : 'Anxiety often stems from aggressive videos portraying optional beautifications as critical pillars. Move the slider to decompose any claim into its 3 authentic jurisprudence layers:'}
                </p>

                {/* Slider */}
                <div className="mt-3 pt-3 border-t border-[#D4A373]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 grow">
                    <span className="text-[11px] font-bold text-stone-500 whitespace-nowrap">
                      {lang === 'ar' ? 'مستوى عدسة الصفاء:' : 'Clarity Filter:'}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={lensSlider}
                      onChange={(e) => setLensSlider(Number(e.target.value))}
                      className="grow accent-[#88C947] cursor-pointer"
                    />
                    <span className="font-mono text-xs font-black text-[#2C483F] w-12 text-end">
                      {lensSlider}%
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {lensSlider >= 50
                      ? lang === 'ar'
                        ? 'السكينة والصفاء مفعلان ✓'
                        : 'Peace & Clarity Active ✓'
                      : lang === 'ar'
                      ? 'اسحب لتنقية الضجيج'
                      : 'Slide to clarify'}
                  </span>
                </div>
              </div>

              {/* 3 Explicit Layers Presentation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Layer 1: Core Pillars */}
                <div
                  className={`p-4 rounded-3xl border-2 transition-all ${
                    lensSlider >= 20
                      ? 'bg-emerald-50/90 border-emerald-400 shadow-soft'
                      : 'bg-white border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                      1
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                      {lang === 'ar' ? 'قطعي الثبوت والدلالة' : 'Definite Core Pillars'}
                    </span>
                  </div>
                  <h5 className="font-black text-sm text-emerald-950 mb-1">
                    {lang === 'ar' ? 'الطبقة الأولى: الأركان والفرائض' : 'Layer 1: Core Pillars'}
                  </h5>
                  <p className="text-xs text-emerald-900/80 leading-relaxed mb-3">
                    {lang === 'ar'
                      ? 'هي جوهر الدين المجمع عليه قطعاً: أركان الإسلام الخمسة، الوضوء الأصيل، والصدق وبر الوالدين وطيب المكسب.'
                      : 'Definitive fundamentals agreed by entire Muslim consensus: 5 pillars, basic wudu, honesty, filial piety.'}
                  </p>
                  <div className="p-2.5 rounded-xl bg-white border border-emerald-300 text-[11px] font-bold text-emerald-900">
                    {lang === 'ar' ? '✓ تركيزك اليومي هنا يجلب 90% من السكينة' : 'Focus here yields 90% of peace'}
                  </div>
                </div>

                {/* Layer 2: Sunnahs & Beautifications */}
                <div
                  className={`p-4 rounded-3xl border-2 transition-all ${
                    lensSlider >= 50
                      ? 'bg-amber-50/90 border-amber-400 shadow-soft'
                      : 'bg-white border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center font-black text-xs">
                      2
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                      {lang === 'ar' ? 'مستحبات وجماليات' : 'Sunnahs & Virtues'}
                    </span>
                  </div>
                  <h5 className="font-black text-sm text-amber-950 mb-1">
                    {lang === 'ar' ? 'الطبقة الثانية: السنن ومحاسن العبادة' : 'Layer 2: Sunnahs & Virtues'}
                  </h5>
                  <p className="text-xs text-amber-900/80 leading-relaxed mb-3">
                    {lang === 'ar'
                      ? 'أفعال نبوية كريمة تُثاب على فعلها ولا تُعاقب على تركها: السواك، أذكار الركوع المتعددة، والدعاء المأثور.'
                      : 'Beautifications and virtues: rewarded if performed, absolutely no penalty or guilt if missed.'}
                  </p>
                  <div className="p-2.5 rounded-xl bg-white border border-amber-300 text-[11px] font-bold text-amber-900">
                    {lang === 'ar' ? '✨ تُفعل بحب وشوق دون تشنج أو جلد ذات' : 'Embraced with joy, never harsh guilt'}
                  </div>
                </div>

                {/* Layer 3: Scholarly Differences */}
                <div
                  className={`p-4 rounded-3xl border-2 transition-all ${
                    lensSlider >= 75
                      ? 'bg-indigo-50/90 border-indigo-400 shadow-soft'
                      : 'bg-white border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
                      3
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-900">
                      {lang === 'ar' ? 'مساحة رحمة واجتهاد' : 'Scholarly Differences'}
                    </span>
                  </div>
                  <h5 className="font-black text-sm text-indigo-950 mb-1">
                    {lang === 'ar' ? 'الطبقة الثالثة: الخلاف المعتبر' : 'Layer 3: Valid Differences'}
                  </h5>
                  <p className="text-xs text-indigo-900/80 leading-relaxed mb-3">
                    {lang === 'ar'
                      ? 'مسائل فرعية احتملت أدلتها آراء متعددة لفقهاء المذاهب: كرفع اليدين، جلسة الاستراحة، وقراءة الفاتحة خلف الإمام.'
                      : 'Secondary branches with multiple valid scholarly views. Never cause for division or self-doubt.'}
                  </p>
                  <div className="p-2.5 rounded-xl bg-white border border-indigo-300 text-[11px] font-bold text-indigo-900">
                    {lang === 'ar' ? '🛡️ القاعدة: لا إنكار في مسائل الخلاف' : 'Rule: Zero condemnation in ijtihad'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STRICTNESS VS EASE COMPASS */}
          {activeTab === 'compass' && (
            <div className="space-y-6 animate-fade-in text-start">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-emerald-500/10 border border-[#D4A373]/30">
                <h4 className="text-sm font-black text-[#2C483F] flex items-center gap-2 mb-1">
                  <Compass className="w-5 h-5 text-[#88C947]" />
                  <span>
                    {lang === 'ar'
                      ? 'بوصلة القواعد الفقهية الكبرى: أصول التيسير في الشريعة'
                      : 'The Grand Jurisprudence Maxims: Foundational Principles of Ease'}
                  </span>
                </h4>
                <p className="text-xs text-[#2C483F]/80 leading-relaxed">
                  {lang === 'ar'
                    ? 'اتفق أئمة الإسلام عبر القرون على 5 قواعد كلية تحكم كل أبواب الفقه. هذه القواعد كفيلة بحمايتك من أي وسواس أو تشدد:'
                    : 'Classical jurists agreed on universal legal maxims governing all worship. These maxims protect your heart from obsessive doubt:'}
                </p>
              </div>

              {/* 4 Pillars Interactive Compass Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {EASE_PRINCIPLES.map((principle, idx) => {
                  const isSelected = selectedCompassPrinciple === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        playSoftTap();
                        setSelectedCompassPrinciple(idx);
                      }}
                      className={`p-4 rounded-3xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white border-[#88C947] ring-2 ring-[#88C947]/30 shadow-soft scale-[1.01]'
                          : 'bg-[#FBF9F5] border-stone-200 hover:border-[#D4A373]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{principle.icon}</span>
                          <h5 className="font-black text-sm text-[#2C483F]">
                            {lang === 'ar' ? principle.titleAr : principle.titleEn}
                          </h5>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[#88C947]" />
                        )}
                      </div>

                      <p className="text-xs text-stone-600 mb-2 font-medium">
                        {lang === 'ar' ? principle.taglineAr : principle.taglineEn}
                      </p>

                      <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs italic text-[#2C483F] font-bold mb-2">
                        {lang === 'ar' ? principle.evidenceAr : principle.evidenceEn}
                      </div>

                      <div className="text-[11px] text-emerald-800 font-bold bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                        <span className="text-[#2C483F] font-black block mb-0.5">
                          {lang === 'ar' ? 'التطبيق العملي السهل:' : 'Practical Application:'}
                        </span>
                        {lang === 'ar' ? principle.practicalAr : principle.practicalEn}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: VERIFIED BEGINNER Q&A BANK */}
          {activeTab === 'search' && (
            <div className="space-y-4 animate-fade-in text-start">
              {/* Search Bar Input */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute top-3.5 start-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    lang === 'ar'
                      ? 'ابحث عن مسألة مقلقة (مثل: الوضوء، الصلاة بالعمل، الشك، المطاعم)...'
                      : 'Search common questions (e.g. wudu doubts, prayer at work, restaurant food)...'
                  }
                  className="w-full ps-10 pe-4 py-2.5 rounded-2xl bg-white border border-[#D4A373]/40 focus:border-[#88C947] focus:ring-2 focus:ring-[#88C947]/20 text-xs text-[#2C483F] font-bold transition-all shadow-xs"
                />
              </div>

              {/* Q&A Accordion Items */}
              <div className="space-y-2.5">
                {filteredQas.length === 0 ? (
                  <div className="text-center py-8 text-stone-500 text-xs">
                    {lang === 'ar'
                      ? 'لا توجد نتائج مطابقة، تواصل مع المستشار البشري في شريط الأدوات لأي سؤال خاص.'
                      : 'No matching answers found. Feel free to use the Human Counselor button for personal guidance.'}
                  </div>
                ) : (
                  filteredQas.map((item) => {
                    const isExpanded = expandedQaId === item.id;
                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-stone-200 bg-white overflow-hidden transition-all shadow-xs"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            playSoftTap();
                            setExpandedQaId(isExpanded ? null : item.id);
                          }}
                          className="w-full p-3.5 flex items-center justify-between text-start gap-2 hover:bg-stone-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">
                              {item.category === 'worship'
                                ? '💧'
                                : item.category === 'food'
                                ? '🥗'
                                : item.category === 'social'
                                ? '🤝'
                                : '🛡️'}
                            </span>
                            <span className="text-xs font-black text-[#2C483F]">
                              {lang === 'ar' ? item.queryAr : item.queryEn}
                            </span>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-stone-400 transition-transform ${
                              isExpanded ? 'rotate-180 text-[#88C947]' : ''
                            }`}
                          />
                        </button>

                        {isExpanded && (
                          <div className="px-4 pb-4 pt-1 border-t border-stone-100 bg-[#FBF9F5] space-y-2.5 text-xs animate-fade-in">
                            <p className="text-[#2C483F] leading-relaxed font-medium">
                              {lang === 'ar' ? item.answerAr : item.answerEn}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-2 pt-1">
                              <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-200">
                                {lang === 'ar' ? item.coreRuleAr : item.coreRuleEn}
                              </span>
                              <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 border border-amber-200">
                                {lang === 'ar' ? item.hadithOrAyahAr : item.hadithOrAyahEn}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#88C947]" />
            <span className="text-[11px] font-bold">
              {lang === 'ar'
                ? 'مُراجع ومعتمد وفق المقاصد الشرعية الكبرى وإجماع الفقهاء'
                : 'Anchored in universal classical Islamic jurisprudence maxims'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              playPeaceChime();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-[#2C483F] hover:bg-[#1f332c] text-white font-bold text-xs"
          >
            {lang === 'ar' ? 'إغلاق ومتابعة الرحلة' : 'Close & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};
