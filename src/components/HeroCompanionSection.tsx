import React from 'react';
import { Sparkles, Sun, Smile, Wind, Heart, Shield } from 'lucide-react';
import { AnasAvatar } from './AnasAvatar';
import { Language, UserProfile } from '../types';
import { getAnasSalutation, t } from '../utils/i18n';
import { playPeaceChime, playStressReleaseTone, playSoftTap } from '../utils/audio';

interface HeroCompanionSectionProps {
  score: number;
  onAdjustScore: (delta: number, label: string, type: 'peace' | 'stress') => void;
  lang: Language;
  onOpenJourney: () => void;
  userProfile?: UserProfile;
}

export const HeroCompanionSection: React.FC<HeroCompanionSectionProps> = ({
  score,
  onAdjustScore,
  lang,
  onOpenJourney,
  userProfile,
}) => {
  const getBadgeText = (delta: number, type: 'peace' | 'stress') => {
    const sign = delta > 0 ? `+${delta}` : `${delta}`;
    const word = type === 'peace' ? t('common.peace', lang) : t('common.stress', lang);
    return `${sign} ${word}`;
  };

  const moods = [
    {
      id: 'serene',
      icon: Smile,
      labelAr: 'مطمئن وراضٍ',
      labelEn: 'Serene & Content',
      labelFr: 'Serein & Comblé',
      labelEs: 'Sereno y Satisfecho',
      delta: 10,
      type: 'peace' as const,
      color: 'hover:border-[#88C947] hover:bg-[#88C947]/10',
    },
    {
      id: 'reflective',
      icon: Wind,
      labelAr: 'متأمل وهادئ',
      labelEn: 'Reflective & Calm',
      labelFr: 'Méditatif & Apaisé',
      labelEs: 'Reflexivo y en Calma',
      delta: 5,
      type: 'peace' as const,
      color: 'hover:border-[#D4A373] hover:bg-[#D4A373]/10',
    },
    {
      id: 'anxious',
      icon: Shield,
      labelAr: 'مشوش أو قلق',
      labelEn: 'Anxious / Overwhelmed',
      labelFr: 'Inquiet / Débordé',
      labelEs: 'Inquieto o Abrumado',
      delta: -5,
      type: 'stress' as const,
      color: 'hover:border-[#C89B84] hover:bg-[#C89B84]/10',
    },
    {
      id: 'tired',
      icon: Heart,
      labelAr: 'مجهد وبحاجة لراحة',
      labelEn: 'Tired / Seeking Rest',
      labelFr: 'Fatigué / Besoin de Repos',
      labelEs: 'Cansado / Busco Descanso',
      delta: 5,
      type: 'peace' as const,
      color: 'hover:border-[#2C483F] hover:bg-[#2C483F]/10',
    },
  ];

  const handleMoodSelect = (mood: typeof moods[0]) => {
    if (mood.type === 'peace') {
      playPeaceChime();
    } else {
      playStressReleaseTone();
    }
    const badgeText = getBadgeText(mood.delta, mood.type);
    onAdjustScore(mood.delta, badgeText, mood.type);
  };

  const getMoodLabel = (m: typeof moods[0]) => {
    if (lang === 'ar') return m.labelAr;
    if (lang === 'fr') return m.labelFr;
    if (lang === 'es') return m.labelEs;
    return m.labelEn;
  };

  const salutation = userProfile
    ? getAnasSalutation(userProfile, lang)
    : lang === 'ar'
    ? 'يا صاحبي الحبيب'
    : 'Dear companion';

  return (
    <section className="relative overflow-hidden pt-6 pb-8">
      {/* Background Subtle Sand Arabesque Texture */}
      <div className="absolute inset-0 bg-arabesque-pattern pointer-events-none opacity-40" />

      {/* Radiant Rose-Gold Ambient Glows */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-[#D4A373]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-[#88C947]/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Card Surface with rounded-3xl and backdrop blur */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-[#D4A373]/30 p-6 sm:p-8 md:p-10 shadow-soft-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Greeting, Typography, and Mood check-in */}
            <div className="lg:col-span-8 space-y-6 text-start">
              {/* Subtle Tagline / Track Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2C483F]/5 border border-[#D4A373]/30 text-xs font-semibold text-[#2C483F]">
                <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>
                  {t('hero.badge', lang)}
                </span>
                <span className="text-[#D4A373]">·</span>
                <span className="text-[#88C947] font-bold">2026</span>
              </div>

              {/* Main Headline with Salutation */}
              <div>
                <div className="text-sm font-bold text-[#88C947] mb-1">
                  {salutation} ✨
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#2C483F] tracking-tight leading-tight">
                  {t('hero.title_pre', lang)}{' '}
                  <span className="text-[#2C483F] underline decoration-[#D4A373] decoration-4 underline-offset-8">
                    {t('hero.title_highlight', lang)}
                  </span>{' '}
                  {t('hero.title_post', lang)}
                </h2>
                <p className="mt-4 text-base sm:text-lg text-[#2C483F]/80 leading-relaxed max-w-2xl font-normal">
                  {t('hero.quote', lang)}
                  <span className="block mt-1 text-xs text-[#D4A373] font-bold">
                    {t('hero.quote_ref', lang)}
                  </span>
                </p>
              </div>

              {/* Interactive Mood Check-in Station */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#2C483F] uppercase tracking-wider flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-[#D4A373]" />
                    <span>{t('hero.how_are_you', lang)}</span>
                  </span>
                  <span className="text-[11px] text-[#2C483F]/60 hidden">
                    {lang === 'ar' ? 'يُحدّث مقياس السكينة تلقائياً' : 'Updates live tranquility'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {moods.map((mood) => {
                    const IconComp = mood.icon;
                    return (
                      <button
                        key={mood.id}
                        type="button"
                        onClick={() => handleMoodSelect(mood)}
                        className={`group relative flex items-center gap-2.5 p-3 rounded-2xl bg-[#FBF9F5] border border-[#D4A373]/25 transition-all duration-300 ${mood.color} hover:shadow-soft text-start`}
                      >
                        <div className="w-8 h-8 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#2C483F] group-hover:scale-110 transition-transform">
                          <IconComp className="w-4 h-4 text-[#2C483F]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#2C483F] leading-tight">
                            {getMoodLabel(mood)}
                          </span>
                          <span className="text-[10px] text-[#D4A373] font-semibold mt-0.5">
                            {getBadgeText(mood.delta, mood.type)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Call to Action Bar */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    playSoftTap();
                    onOpenJourney();
                  }}
                  className="px-6 py-3 rounded-2xl bg-[#2C483F] hover:bg-[#20362f] text-white text-sm font-bold shadow-soft hover:shadow-gold transition-all duration-300 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#D4A373]" />
                  <span>{t('hero.explore_btn', lang)}</span>
                </button>

                <div className="text-xs text-[#2C483F]/70 flex items-center gap-1.5 px-3 py-2 bg-[#FBF9F5] rounded-xl border border-[#D4A373]/20">
                  <span className="w-2 h-2 rounded-full bg-[#88C947]" />
                  <span>{t('nav.tranquility', lang)}: </span>
                  <strong className="text-[#2C483F] font-mono">{score}%</strong>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Mascot Anas Showcase & Interactive Speech */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
              {/* Milestone Halo in Rose-Gold */}
              <div className="relative p-6 rounded-3xl bg-gradient-to-b from-[#D4A373]/15 via-white/40 to-[#88C947]/10 border border-[#D4A373]/30 shadow-gold flex flex-col items-center text-center w-full max-w-sm">
                {/* Upper Speech Bubble */}
                <div className="w-full mb-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-[#D4A373]/30 shadow-soft text-center relative">
                  <p className="text-sm font-bold text-[#2C483F]">
                    {salutation}
                  </p>
                  <p className="text-xs text-[#2C483F]/75 mt-0.5">
                    {lang === 'ar'
                      ? '«ألا بذكر الله تطمئن القلوب»'
                      : lang === 'fr'
                      ? '« N’est-ce point par l’évocation d’Allah que les cœurs s’apaisent ? »'
                      : lang === 'es'
                      ? '«¿Acaso no es con el recuerdo de Dios que se sosiegan los corazones?»'
                      : '"Verily in the remembrance of Allah do hearts find rest"'}
                  </p>
                  {/* Speech bubble pointer */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-[#D4A373]/30 transform rotate-45" />
                </div>

                {/* Anas Large Animated 3D Avatar */}
                <div className="py-2">
                  <AnasAvatar
                    size="lg"
                    lang={lang}
                    showGreetingBubble={false}
                    className="cursor-pointer"
                  />
                </div>

                <div className="mt-3">
                  <h3 className="font-extrabold text-[#2C483F] text-base">
                    {lang === 'ar' ? 'رفيق | رفيقك الأخضر' : 'Rafiq | Your Companion'}
                  </h3>
                  <p className="text-xs text-[#2C483F]/70 mt-1 max-w-xs">
                    {lang === 'ar'
                      ? 'انقر على رفيق للتحية والاستماع إلى نبضات السكينة'
                      : 'Tap Rafiq to converse and receive soothing reflections'}
                  </p>
                </div>

                {/* Subtle Interactive Tap Hint */}
                <div className="mt-4 pt-3 border-t border-[#D4A373]/20 w-full flex items-center justify-between text-[11px] text-[#D4A373] font-semibold">
                  <span>{lang === 'ar' ? 'جاهز للمرافقة' : 'Ready to accompany'}</span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#88C947] animate-ping" />
                    <span>{lang === 'ar' ? 'متاح الآن' : 'Online'}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
