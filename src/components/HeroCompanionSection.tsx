import React from 'react';
import { Sparkles, MessageSquare, ArrowRight, Compass } from 'lucide-react';
import { AnasAvatar } from './AnasAvatar';
import { Language, UserProfile } from '../types';
import { getAnasSalutation, t } from '../utils/i18n';
import { playSoftTap } from '../utils/audio';

interface HeroCompanionSectionProps {
  score: number;
  onAdjustScore: (delta: number, label: string, type: 'peace' | 'stress') => void;
  lang: Language;
  onOpenJourney: () => void;
  onOpenMiniGameLab?: (topic?: string, query?: string) => void;
  userProfile?: UserProfile;
}

export const HeroCompanionSection: React.FC<HeroCompanionSectionProps> = ({
  score,
  lang,
  onOpenJourney,
  onOpenMiniGameLab,
  userProfile,
}) => {
  const isAr = lang === 'ar';

  const salutation = userProfile
    ? getAnasSalutation(userProfile, lang)
    : isAr
    ? 'أهلاً بك يا صاحبي الحبيب'
    : 'Welcome, dear companion';

  const handleOpenLab = () => {
    playSoftTap();
    if (onOpenMiniGameLab) {
      onOpenMiniGameLab();
    }
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-6 select-none">
      {/* Background Subtle Sand Arabesque Pattern */}
      <div className="absolute inset-0 bg-arabesque-pattern pointer-events-none opacity-30" />

      {/* Radiant Subtle Warm Ambient Glows */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-[#D4A373]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-[#88C947]/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* ========================================================================= */}
        {/* 1. WELCOME / RAFEEQ COMPANION FOCAL HERO */}
        {/* ========================================================================= */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#D4A373]/30 p-6 sm:p-8 md:p-10 shadow-soft-lg transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Greeting & Clear Mission Statement */}
            <div className="lg:col-span-8 space-y-4 text-start">
              {/* Main Headline */}
              <div>
                <div className="text-sm sm:text-base font-bold text-[#88C947] mb-3">
                  {salutation} ✨
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#2C483F] tracking-tight leading-tight">
                  {isAr
                    ? 'ابدأ خطوتك الأولى في الإسلام بسكينة وتدرج دون حيرة أو شتات'
                    : 'Begin your first step in Islam with tranquility and ease'}
                </h1>
                <div className="mt-3.5 space-y-1.5 max-w-2xl">
                  <p className="text-sm sm:text-base text-[#2C483F] font-semibold leading-relaxed">
                    {isAr
                      ? '«إن هذا الدين يسر، ولن يشاد الدين أحد إلا غلبه، فسددوا وقاربوا وأبشروا»'
                      : '"Indeed, this religion is easy, and no one overburdens themselves with it but that it overcomes them. So adhere to moderation and have glad tidings."'}
                  </p>
                  <p className="text-xs text-stone-500 font-bold">
                    {isAr
                      ? 'صحيح البخاري - وصية النبي ﷺ في الرفق والتدرج'
                      : 'Sahih al-Bukhari — Prophetic advice on moderation and gradual growth'}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    playSoftTap();
                    onOpenJourney();
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-[#2C483F] hover:bg-[#20362f] text-white text-xs sm:text-sm font-bold shadow-soft hover:shadow-gold transition-all duration-300 flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Compass className="w-4 h-4 text-[#D4A373]" />
                  <span>{isAr ? 'استكشف مسار الأسبوع التأسيسي ↵' : 'Explore Foundational Journey ↵'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Prominent Rafeeq Character Presentation */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <div className="relative p-6 rounded-3xl bg-gradient-to-b from-[#D4A373]/15 via-white/60 to-[#88C947]/10 border border-[#D4A373]/30 shadow-soft flex flex-col items-center text-center w-full max-w-xs">
                {/* Speech Bubble */}
                <div className="w-full mb-3 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 border border-[#D4A373]/30 shadow-xs text-center relative">
                  <p className="text-xs font-bold text-[#2C483F]">
                    {isAr ? '«يسروا ولا تعسروا، وبشروا ولا تنفروا»' : '"Make things easy and do not make them difficult"'}
                  </p>
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-[#D4A373]/30 transform rotate-45" />
                </div>

                {/* Rafeeq Character Avatar with Gentle Float Animation */}
                <div className="py-2 animate-float hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={handleOpenLab}>
                  <AnasAvatar
                    size="xl"
                    lang={lang}
                    showGreetingBubble={false}
                    className="filter drop-shadow-md"
                  />
                </div>

                <div className="mt-2 text-center">
                  <h3 className="font-black text-[#2C483F] text-base">
                    {isAr ? 'رفيق' : 'Rafeeq'}
                  </h3>
                  <span className="text-[11px] text-[#D4A373] font-bold">
                    {isAr ? 'رفيقك التفاعلي المساند' : 'Your Interactive Companion'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. RAFEEQ LAB — THE LARGE CONVERSATIONAL-STYLE ENTRY PANEL */}
        {/* ========================================================================= */}
        <div
          onClick={handleOpenLab}
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-r from-white via-[#FAF7F0] to-white border-2 border-[#D4A373]/50 hover:border-[#D4A373] p-5 sm:p-7 shadow-soft hover:shadow-soft-lg transition-all duration-300 cursor-pointer text-start"
        >
          <div className="absolute top-0 end-0 -mt-8 -me-8 w-32 h-32 rounded-full bg-[#88C947]/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 start-0 -mb-8 -ms-8 w-32 h-32 rounded-full bg-[#D4A373]/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Left: Icon & Conversational Prompt */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#2C483F] text-[#88C947] flex items-center justify-center text-xl shrink-0 shadow-soft group-hover:scale-105 transition-transform">
                <MessageSquare className="w-6 h-6 text-[#D4A373]" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#D4A373] uppercase tracking-wider block">
                  {isAr ? 'مختبر رفيق' : 'Rafeeq Lab'}
                </span>
                <h3 className="text-base sm:text-xl font-black text-[#2C483F]">
                  {isAr ? 'واجهت موقفًا أو استفسارًا في يومك؟ اسأل رفيق' : 'Faced a situation today? Ask Rafeeq'}
                </h3>
                <p className="text-xs text-stone-500 max-w-xl">
                  {isAr
                    ? 'اكتب أي موقف تواجهه في عملك، أسرتك، أو عبادتك ليوجّهك رفيق إلى التجربة المناسبة والتوجيه الشرعي المعتمد.'
                    : 'Describe any situation in work, family, or worship to receive grounded guidance and matching simulations.'}
                </p>
              </div>
            </div>

            {/* Right: Dialogue-style Action Button */}
            <div className="shrink-0 flex items-center">
              <div className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-[#2C483F] group-hover:bg-[#1f352e] text-white font-bold text-xs sm:text-sm shadow-soft transition-all flex items-center justify-center gap-2 group-hover:gap-3">
                <span>{isAr ? 'ابدأ' : 'Start'}</span>
                <ArrowRight className="w-4 h-4 text-[#88C947] rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
