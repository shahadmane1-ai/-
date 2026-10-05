import React from 'react';
import {
  FileText,
  X,
  BookOpen,
  ShieldCheck,
  Lock,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Scale,
  Award,
  Layers,
  Sparkles,
  HeartHandshake,
  Compass,
  Database,
} from 'lucide-react';
import { Language } from '../types';

interface SystemGovernanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const SystemGovernanceModal: React.FC<SystemGovernanceModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  if (!isOpen) return null;

  const SEVEN_OFFICIAL_SOURCES = [
    {
      num: '1',
      titleAr: 'المستودع الدعوي الرقمي (Digital Dawa Center)',
      titleEn: 'Digital Dawa Center (dawa.center)',
      url: 'https://center.dawa.sa/',
      descAr: 'المنصة المركزية للحقائب الدعوية المتخصصة، الكتب والمطويات المعتمدة لتيسير مفاهيم الإسلام للمسلمين الجدد.',
      descEn: 'Approved digital repository for newcomer curriculum, brochures, translations, and outreach kits.',
      badgeAr: 'مرجع دعوي رسمي',
      badgeEn: 'Official Dawa Archive',
    },
    {
      num: '2',
      titleAr: 'موسوعة الجمهرة لمفردات المحتوى الإسلامي',
      titleEn: 'Al-Jamharah Islamic Terminology Dictionary',
      url: 'https://islamic-content.com/dictionary',
      descAr: 'المعجم المعتمد لضبط وترجمة المصطلحات الشرعية ومنع اللبس اللغوي والثقافي للمصطلحات التعبدية.',
      descEn: 'Certified standardized terminology dictionary ensuring accurate definitions and cross-language translation.',
      badgeAr: 'معجم المصطلحات',
      badgeEn: 'Standard Dictionary',
    },
    {
      num: '3',
      titleAr: 'مجمع الملك فهد لطباعة المصحف الشريف',
      titleEn: 'King Fahd Glorious Quran Printing Complex',
      url: 'https://quranpedia.net/',
      descAr: 'النصوص القرآنية الموثقة بالرسم العثماني المحرر، والترجمات المعتمدة لمعاني الآيات الكريمة.',
      descEn: 'Verified Quranic scriptures in Uthmani script and authenticated international translations.',
      badgeAr: 'مرجع النص القرآني',
      badgeEn: 'Quran Authority',
    },
    {
      num: '4',
      titleAr: 'مشروع قرآني (Quranpedia)',
      titleEn: 'Quranpedia Knowledge Mapping',
      url: 'https://quranpedia.net/',
      descAr: 'الربط المنهجي بين الآيات والدلالات المعرفية وسياقات النزول وتفاسير الآيات الميسرة.',
      descEn: 'Epistemological linkage between Quranic verses, cognitive themes, and authorized contextual meaning.',
      badgeAr: 'دلالات ومعارف',
      badgeEn: 'Semantic Knowledge',
    },
    {
      num: '5',
      titleAr: 'موسوعة التفسير — الدرر السنية',
      titleEn: 'Dorar Quranic Tafsir Encyclopedia',
      url: 'https://dorar.net/tafseer',
      descAr: 'التفاسير المعتمدة والمحررة بعناية علمية رصينة تميز بين النص المنزّل والبيان البشري.',
      descEn: 'Scholarly exegesis and commentary strictly distinguished from sacred divine texts.',
      badgeAr: 'تفسير معتمد',
      badgeEn: 'Verified Tafsir',
    },
    {
      num: '6',
      titleAr: 'الموسوعة الحديثية — الدرر السنية',
      titleEn: 'Dorar Hadith Database & Authentication',
      url: 'https://dorar.net/hadith',
      descAr: 'تخريج الأحاديث النبوية الشريفة، بيان درجة الصحة، وأرقام الأحاديث في الصحاح والسنن.',
      descEn: 'Prophetic traditions verification with authenticated sanad (chains), book references, and hadith numbers.',
      badgeAr: 'تخريج الأحاديث',
      badgeEn: 'Hadith Authentication',
    },
    {
      num: '7',
      titleAr: 'كتاب بينات ودليل المسلم الجديد والمتون الميسرة',
      titleEn: 'Bayyinat Q&A, New Muslim Guide & Facilitated Primers',
      url: 'https://dawa.center/file/7937',
      descAr: 'كتاب بينات (dawa.center/file/7937)، دليل المسلم الجديد (د. فهد باهمام)، وسلسلة المتون الميسرة (د. هيثم سرحان).',
      descEn: 'Bayyinat Q&A handbook, Dr. BaHammam’s New Muslim Guide, and Sheikh Dr. Sarhan’s primers for practical worship.',
      badgeAr: 'تأصيل وتدرج حركي',
      badgeEn: 'Curriculum & Primers',
    },
  ];

  const FOUR_TIER_MATRIX = [
    {
      tier: 'المستوى (أ) — أصول مستقرة وأركان العبادات',
      tierEn: 'Tier A: Established Core Facts',
      scope: 'القرآن الكريم، السنة الثابتة، أركان الإسلام الخمسة، أركان الإيمان الستة، خطوات الوضوء والصلاة وسجود السهو.',
      protocol: 'إرشاد فوري ميسر وبخطوات حركية تفاعلية. يُحظر التهرب أو قول "أنا لست مفتياً" في الأصول المستقرة.',
      color: 'bg-emerald-50 border-emerald-300 text-emerald-900',
      badgeColor: 'bg-emerald-200 text-emerald-800',
    },
    {
      tier: 'المستوى (ب) — شرح وحكمة ودفع الشبهات',
      tierEn: 'Tier B: Explanations, Wisdom & Public Doubts',
      scope: 'مقاصد الشريعة، حكمة تحريم المحرمات، علل العبادات، الرد على الشبهات (سيف، كعبة، خنزير).',
      protocol: 'بيان هادئ رحيم ومؤصل بالبراهين المعتمدة دون تشنج أو هجومية دفاعية.',
      color: 'bg-blue-50 border-blue-300 text-blue-900',
      badgeColor: 'bg-blue-200 text-blue-800',
    },
    {
      tier: 'المستوى (ج) — مسائل خلافية واجتهادية',
      tierEn: 'Tier C: Scholarly Jurisprudential Variations',
      scope: 'فروع المذاهب الفقهية الأربعة، رخص السفر والجمع، مدة المسح على الخفين، مسائل التطوع.',
      protocol: 'إبراز التيسير وسعة الخلاف المعتبر والقواعد الكبرى («المشقة تجلب التيسير»، «الأصل في الأشياء الإباحة»).',
      color: 'bg-amber-50 border-amber-300 text-amber-900',
      badgeColor: 'bg-amber-200 text-amber-800',
    },
    {
      tier: 'المستوى (د) — فتاوى خاصة ونوازل قضائية',
      tierEn: 'Tier D: Individual Legal Inquiries & Sensitive Status',
      scope: 'عقود النكاح، وقوع الطلاق والخلع، تقسيم المواريث والتركات، النزاعات القضائية، الإجهاض.',
      protocol: 'قاطع أمان فوري (Kill-Switch) يرفض التوليد الآلي المستقل، ويُحيل المستخدم فوراً إلى المفتي والمختص البشري.',
      color: 'bg-rose-50 border-rose-300 text-rose-900',
      badgeColor: 'bg-rose-200 text-rose-800',
    },
  ];

  const FIVE_STAGE_LOOP = [
    {
      num: '1',
      title: 'التهيئة وتحديد البيئة (Onboarding & Baseline)',
      desc: 'ضبط الأساس الديموغرافي الصريح (الجنس، الفئة العمرية) والبيئة المعيشية دون افتراضات نمطية مسبقة.',
    },
    {
      num: '2',
      title: 'الموقف التفاعلي والقرار الحركي (Interactive Scenario)',
      desc: 'محاكاة عملية في بيئات 2.5D واقعية (العمل، الجامعة، النادي، البيت) بالتحكم الحركي وليس بالاختيار المتعدد.',
    },
    {
      num: '3',
      title: 'المعالجة الذكية والتحقق الشرعي (Smart RAG & Grounding)',
      desc: 'معالجة متوازية لتحليل المشاعر والحمل المعرفي واسترجاع النصوص من الخزنة المعتمدة بدون أي هلوسة.',
    },
    {
      num: '4',
      title: 'تفكيك التضارب والذاكرة العائدة (Conflict Resolution & Memory)',
      desc: 'حفظ مسار التعلم محلياً، وتفكيك التعارضات الخارجية بالقواعد الفقهية الكبرى وتأصيل سعة الخلاف.',
    },
    {
      num: '5',
      title: 'التقييم الدوري والإحالة البشرية (Review & Referral)',
      desc: 'احتساب مؤشر السكينة التراكمي، إهداء الأوسمة، وتفعيل الإحالة البشرية الفورية عند النوازل الخاصة.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-3xl bg-white rounded-t-3xl sm:rounded-3xl border-t-2 sm:border-2 border-[#D4A373] shadow-2xl p-5 sm:p-7 text-start max-h-[88vh] sm:max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2C483F] to-[#15231D] text-[#D4A373] flex items-center justify-center shadow-soft">
              <FileText className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#2C483F]">
                {lang === 'ar' ? 'سجل المصادر المعتمدة وحوكمة «رفيق»' : 'Accredited Sources & System Governance'}
              </h3>
              <p className="text-xs text-stone-500">
                {lang === 'ar'
                  ? 'الهوية التأسيسية، المصادر الرسمية السبعة، مصفوفة المحتوى الرباعية، ودورة المحاكاة'
                  : 'Core Persona, 7 Official Sources, 4-Tier Matrix, and 5-Stage Simulation Cycle'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Definitive Identity Banner */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-[#2C483F] via-[#20362f] to-[#182a24] text-white shadow-soft space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#88C947]" />
            <span className="text-xs font-bold text-[#88C947] uppercase tracking-wider">
              {lang === 'ar' ? 'الهوية التأسيسية والمهمة المركزية' : 'Definitive Persona & System Mission'}
            </span>
          </div>
          <h4 className="text-sm font-black leading-snug">
            {lang === 'ar'
              ? '«رفيق»: المحاكي المعرفي والوجداني لتمكين المسلم الجديد من التأقلم مع البيئة اليومية والشعائر'
              : 'Rafeeq: Agentic Cognitive & Habit-Building Companion for New Muslims'}
          </h4>
          <p className="text-xs text-white/85 leading-relaxed">
            {lang === 'ar'
              ? '«رفيق» ليس مفتياً شرعياً آلياً، ولا جهة إصدار فتاوى قضائية، ولا روبوت اختبارات أكاديمية. مهمته المركزية ردم الفجوة بين المعرفة النظرية والممارسة الحركية، وتخفيض الحمل المعرفي بنسبة 60%، ورفع جاهزية المسلم الجديد لممارسة العبادات في بيئته الحقيقية إلى 85% عبر مؤشر السكينة.'
              : 'Rafeeq is strictly an agentic habit-building companion, NOT an automated mufti or judicial fatwa issuer. Its core mission is reducing cognitive burnout by 60% and lifting real-world worship readiness to 85%.'}
          </p>
        </div>

        {/* Section 1: The 7 Official Accredited References */}
        <div className="my-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-[#2C483F] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#D4A373]" />
              <span>{lang === 'ar' ? '1. المصادر الرسمية السبعة المعتمدة' : '1. Seven Official Accredited Sources'}</span>
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              100% Zero-Hallucination
            </span>
          </div>

          <div className="space-y-2.5">
            {SEVEN_OFFICIAL_SOURCES.map((source, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#FBF9F5] border border-[#D4A373]/30 flex items-start justify-between gap-3 text-start hover:border-[#D4A373] transition-all"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#2C483F] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                      {source.num}
                    </span>
                    <span className="text-xs font-black text-[#2C483F]">
                      {lang === 'ar' ? source.titleAr : source.titleEn}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {lang === 'ar' ? source.badgeAr : source.badgeEn}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed ps-7">
                    {lang === 'ar' ? source.descAr : source.descEn}
                  </p>
                  {source.url && (
                    <div className="ps-7 pt-0.5">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-mono text-emerald-700 hover:underline inline-flex items-center gap-1"
                      >
                        <span>{source.url}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  )}
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Strict 4-Tier Content Control Matrix */}
        <div className="my-5 space-y-3">
          <h4 className="text-xs font-black text-[#2C483F] uppercase tracking-wider flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-[#D4A373]" />
            <span>{lang === 'ar' ? '2. مصفوفة المحتوى وضبط الاستجابة (4 مستويات معتمدة)' : '2. 4-Tier Content Control Matrix'}</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {FOUR_TIER_MATRIX.map((tier, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border ${tier.color} space-y-1.5 text-start`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black">
                    {lang === 'ar' ? tier.tier : tier.tierEn}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${tier.badgeColor}`}>
                    Tier {String.fromCharCode(65 + idx)}
                  </span>
                </div>
                <div className="text-[11px] space-y-1">
                  <div>
                    <span className="font-bold opacity-80">{lang === 'ar' ? 'النطاق: ' : 'Scope: '}</span>
                    <span>{tier.scope}</span>
                  </div>
                  <div>
                    <span className="font-bold opacity-80">{lang === 'ar' ? 'البروتوكول: ' : 'Protocol: '}</span>
                    <span>{tier.protocol}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: 5-Stage Adaptive Simulation Cycle */}
        <div className="my-5 space-y-3">
          <h4 className="text-xs font-black text-[#2C483F] uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#D4A373]" />
            <span>{lang === 'ar' ? '3. دورة المحاكاة والتكيف المستمر (5 مراحل)' : '3. 5-Stage Continuous Adaptive Loop'}</span>
          </h4>

          <div className="space-y-2">
            {FIVE_STAGE_LOOP.map((stage, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-start gap-3 text-start"
              >
                <span className="w-6 h-6 rounded-full bg-[#D4A373]/20 text-[#2C483F] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                  {stage.num}
                </span>
                <div>
                  <h5 className="text-xs font-black text-[#2C483F]">{stage.title}</h5>
                  <p className="text-[11px] text-stone-600 leading-relaxed mt-0.5">{stage.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Privacy & Zero PII */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-300/80 space-y-2 text-start">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
            <Lock className="w-4 h-4 text-emerald-700" />
            <span>{lang === 'ar' ? '4. بيانات اصطناعية 100% وامتثال الخصوصية (Zero PII)' : '4. 100% Synthetic Data & Privacy Compliance'}</span>
          </div>
          <p className="text-xs text-emerald-950/85 leading-relaxed">
            {lang === 'ar'
              ? 'كافة الشخصيات والسيناريوهات وحوارات العمل في التطبيق هي بيانات اصطناعية مجهولة الهوية تماماً. لا يتم جمع أو حفظ أي بيانات شخصية حساسة أو استفسارات أسرية حقيقية، وتحفظ التفضيلات على جهاز المستخدم محلياً.'
              : 'All scenarios, coworker interactions, and dialogues are 100% synthetic, anonymized simulation data (Zero PII). No real private user identity is ever stored or transmitted.'}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-[#2C483F] hover:bg-[#1f342d] text-white font-bold text-xs shadow-soft transition-colors cursor-pointer"
          >
            {lang === 'ar' ? 'إغلاق سجل الحوكمة' : 'Close Governance Registry'}
          </button>
        </div>
      </div>
    </div>
  );
};
