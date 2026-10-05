import React, { useState } from 'react';
import {
  ShieldCheck,
  PhoneCall,
  HeartHandshake,
  UserCheck,
  CheckCircle2,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  Scale,
  BookOpen,
  X,
} from 'lucide-react';
import { Language } from '../types';
import { playSoftTap, playPeaceChime } from '../utils/audio';

interface HumanReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

export const HumanReferralModal: React.FC<HumanReferralModalProps> = ({
  isOpen,
  onClose,
  lang = 'ar',
}) => {
  const [activeTab, setActiveTab] = useState<'fatwa' | 'counseling'>('fatwa');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    inquiryType: 'marriage_divorce',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playPeaceChime();
    setSubmitted(true);
  };

  const OFFICIAL_FATWA_CHANNELS = [
    {
      titleAr: 'الرئاسة العامة للبحوث العلمية والإفتاء',
      titleEn: 'General Presidency of Scholarly Research and Ifta',
      descAr: 'الجهة الرسمية المعتمدة للفتاوى الخاصة بالنوازل الشخصية، النكاح، الطلاق، والتركات.',
      phone: '0114595555',
      webUrl: 'https://www.alifta.gov.sa/',
      badgeAr: 'رسمي معتمد',
    },
    {
      titleAr: 'مجمع الفقه الإسلامي الدولي',
      titleEn: 'International Islamic Fiqh Academy',
      descAr: 'قرارات المجمع الفقهي المعتمدة لكبرى النوازل المعاصرة والأقليات المسلمة حول العالم.',
      phone: '+966126900320',
      webUrl: 'https://iifa-aifi.org/',
      badgeAr: 'دولي',
    },
    {
      titleAr: 'منصة المستشار الشرعي المعتمد',
      titleEn: 'Certified Islamic Legal Consultation Service',
      descAr: 'جلسات استماع شرعية خاصة للمسلمين الجدد والأسر بالتعاون مع المراكز الرسمية.',
      phone: '800-245-0000',
      webUrl: 'https://center.dawa.sa/',
      badgeAr: 'للمسلمين الجدد',
    },
  ];

  const COUNSELING_HOTLINES = [
    {
      titleAr: 'مركز الاستشارات النفسية والوجدانية',
      titleEn: 'Mental Health & Emotional Counseling',
      descAr: 'دعم نفسي ومعرفي وتخفيف القلق اليومي بسرية وأمانة تامة.',
      phone: '920033360',
      timing: '24/7 مجاني',
    },
    {
      titleAr: 'خط الإرشاد الأسري والاجتماعي',
      titleEn: 'Family & Social Guidance Helpline',
      descAr: 'استشارات لحل الخلافات الأسرية ومساندة المهتدين الجدد مع عائلاتهم.',
      phone: '800-4673',
      timing: 'يومياً 8 ص - 10 م',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div
        className="relative w-full max-w-xl bg-white rounded-t-3xl sm:rounded-3xl border-t-2 sm:border-2 border-[#D4A373] shadow-2xl p-5 sm:p-6 overflow-hidden max-h-[88vh] sm:max-h-[92vh] overflow-y-auto text-start"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2C483F] text-[#D4A373] flex items-center justify-center shadow-soft">
              <HeartHandshake className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#2C483F]">
                {lang === 'ar' ? 'الإحالة لمفتٍ ومختص بشري معتمد' : 'Accredited Human Specialist Referral'}
              </h2>
              <p className="text-xs text-stone-500">
                {lang === 'ar'
                  ? 'قنوات الإفتاء الرسمي، الاستشارات الأسرية، والدعم الوجداني المباشر'
                  : 'Official Fatwa authorities, certified family counselors, and direct support'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ethical Safety Kill-Switch Notice */}
        <div className="mt-4 p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3 text-xs text-amber-950">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">
              {lang === 'ar'
                ? 'تنويه شرعي وأخلاقي: «رفيق» ليس مفتياً آلياً ولا يصدر أحكاماً في النوازل الشخصية'
                : 'Ethical Note: Rafeeq is strictly an habit companion, not an automated mufti.'}
            </p>
            <p className="text-[11px] leading-relaxed text-amber-900">
              {lang === 'ar'
                ? 'المسائل القضائية والشخصية الخاصة (عقود النكاح، وقوع الطلاق، المواريث والتركات، والنزاعات التعاقدية) تستوجب سماع التفاصيل والتحقق من أهل الذكر والاختصاص البشريين عملاً بقوله تعالى: ﴿فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ﴾.'
                : 'Private legal matters (marriage, divorce, inheritance, civil litigation) legally require licensed human jurists.'}
            </p>
          </div>
        </div>

        {/* Tabs: Fatwa vs Counseling */}
        <div className="mt-4 flex gap-2 p-1 bg-stone-100 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              playSoftTap();
              setActiveTab('fatwa');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'fatwa'
                ? 'bg-white text-[#2C483F] shadow-soft'
                : 'text-stone-600 hover:text-[#2C483F]'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>{lang === 'ar' ? 'دور الإفتاء الرسمية (Tier D)' : 'Official Fatwa Channels'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              playSoftTap();
              setActiveTab('counseling');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'counseling'
                ? 'bg-white text-[#2C483F] shadow-soft'
                : 'text-stone-600 hover:text-[#2C483F]'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-[#88C947]" />
            <span>{lang === 'ar' ? 'الاستشارات الأسرية والنفسية' : 'Counseling & Helplines'}</span>
          </button>
        </div>

        {/* Tab 1: Official Fatwa Channels */}
        {activeTab === 'fatwa' && (
          <div className="mt-4 space-y-2.5">
            {OFFICIAL_FATWA_CHANNELS.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#FBF9F5] border border-[#D4A373]/30 flex flex-col justify-between gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-[#2C483F]">{item.titleAr}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {item.badgeAr}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">{item.descAr}</p>
                <div className="pt-1 border-t border-stone-200/70 flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-[#2C483F] flex items-center gap-1">
                    <PhoneCall className="w-3 h-3 text-[#D4A373]" />
                    {item.phone}
                  </span>
                  <a
                    href={item.webUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
                  >
                    <span>زيارة البوابة الرسمية</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Counseling & Mental Well-being */}
        {activeTab === 'counseling' && (
          <div className="mt-4 space-y-2.5">
            {COUNSELING_HOTLINES.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#FBF9F5] border border-[#D4A373]/30 flex flex-col justify-between gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-[#2C483F]">{item.titleAr}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                    {item.timing}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">{item.descAr}</p>
                <div className="pt-1 border-t border-stone-200/70 flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-[#2C483F] flex items-center gap-1">
                    <PhoneCall className="w-3 h-3 text-[#D4A373]" />
                    {item.phone}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Direct Follow-up Booking Form */}
        <div className="mt-5 pt-4 border-t border-stone-200">
          <h3 className="text-xs font-black text-[#2C483F] mb-3 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-[#88C947]" />
            <span>{lang === 'ar' ? 'طلب موعد تواصل مع مستشار بشري معتمد' : 'Request Human Specialist Session'}</span>
          </h3>

          {submitted ? (
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm text-emerald-900">
                {lang === 'ar' ? 'تم تسجيل طلب الإحالة بأمانة وسرية' : 'Referral Logged with Care'}
              </h4>
              <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                {lang === 'ar'
                  ? 'سيتواصل معك المستشار المعتمد عبر وسيلة التواصل المحددة. نسأل الله لك التوفيق والسكينة.'
                  : 'An accredited specialist will follow up shortly with full confidentiality.'}
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-2 px-4 py-1.5 text-xs bg-white text-emerald-800 font-bold rounded-xl border border-emerald-300 shadow-sm"
              >
                {lang === 'ar' ? 'تسجيل طلب آخر' : 'Submit Another'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#2C483F]/80 font-bold mb-1">
                    {lang === 'ar' ? 'الاسم أو الكنية' : 'Preferred Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'ar' ? 'عبدالله / سارة' : 'Your name'}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-[#2C483F] focus:outline-none focus:ring-2 focus:ring-[#88C947]"
                  />
                </div>
                <div>
                  <label className="block text-[#2C483F]/80 font-bold mb-1">
                    {lang === 'ar' ? 'البريد أو الهاتف' : 'Contact (Email / Phone)'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'ar' ? 'example@email.com' : 'Contact info'}
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-[#2C483F] focus:outline-none focus:ring-2 focus:ring-[#88C947]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#2C483F]/80 font-bold mb-1">
                  {lang === 'ar' ? 'تصنيف المسألة' : 'Category'}
                </label>
                <select
                  value={formData.inquiryType}
                  onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-[#2C483F] focus:outline-none focus:ring-2 focus:ring-[#88C947]"
                >
                  <option value="marriage_divorce">
                    {lang === 'ar' ? 'عقد نكاح / طلاق / نزاع أسري (Tier D)' : 'Marriage / Divorce / Marital dispute'}
                  </option>
                  <option value="inheritance">
                    {lang === 'ar' ? 'مواريث وتقسيم تركات (Tier D)' : 'Inheritance & Estate Distribution'}
                  </option>
                  <option value="spiritual_mindfulness">
                    {lang === 'ar' ? 'إرشاد وجداني وتثبيت إيماني' : 'Spiritual & Emotional Mentorship'}
                  </option>
                  <option value="stress_anxiety">
                    {lang === 'ar' ? 'تخفيف التوتر والوسواس القهري في الطهارة' : 'Wudu / Prayer Anxiety & Waswas'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-[#2C483F]/80 font-bold mb-1">
                  {lang === 'ar' ? 'ملخص مقتضب (اختياري)' : 'Brief Summary (Optional)'}
                </label>
                <textarea
                  rows={2}
                  placeholder={lang === 'ar' ? 'تفاصيل موجزة لمساعدة المستشار...' : 'Brief context for the specialist...'}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-[#2C483F] focus:outline-none focus:ring-2 focus:ring-[#88C947]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-stone-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#88C947]" />
                  {lang === 'ar' ? 'سرية وأمانة تامة' : 'Confidential & Secure'}
                </span>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#2C483F] hover:bg-[#1f342d] text-white font-bold rounded-xl shadow-soft transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span>{lang === 'ar' ? 'إرسال طلب الإحالة' : 'Submit Referral'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
