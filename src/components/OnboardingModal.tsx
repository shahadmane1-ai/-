import React, { useState } from 'react';
import {
  Sparkles,
  User,
  Heart,
  Globe2,
  Building,
  Compass,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  MapPin,
  HelpCircle,
  X,
  Volume2,
  Lock,
} from 'lucide-react';
import { AnasAvatar } from './AnasAvatar';
import { AgeGroup, CityType, Gender, Language, UserProfile } from '../types';
import { CITY_TYPES, getAnasSalutation, SUPPORTED_LANGUAGES, t } from '../utils/i18n';
import { playPeaceChime, playSoftTap } from '../utils/audio';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  lang: Language;
  onSelectLang?: (lang: Language) => void;
}

const REGION_SUGGESTIONS = [
  { ar: 'الشرق الأوسط وشمال أفريقيا', en: 'Middle East & North Africa', fr: 'Moyen-Orient & Afrique du Nord', es: 'Oriente Medio y Norte de África', code: 'MENA' },
  { ar: 'أوروبا الغربية', en: 'Western Europe', fr: 'Europe de l’Ouest', es: 'Europa Occidental', code: 'EU' },
  { ar: 'أمريكا الشمالية (أمريكا / كندا)', en: 'North America (USA / Canada)', fr: 'Amérique du Nord (USA / Canada)', es: 'América del Norte (EE.UU. / Canadá)', code: 'NA' },
  { ar: 'أمريكا اللاتينية', en: 'Latin America', fr: 'Amérique Latine', es: 'América Latina', code: 'LATAM' },
  { ar: 'جنوب شرق آسيا', en: 'Southeast Asia', fr: 'Asie du Sud-Est', es: 'Sudeste Asiático', code: 'SEA' },
  { ar: 'أفريقيا جنوب الصحراء', en: 'Sub-Saharan Africa', fr: 'Afrique Subsaharienne', es: 'África Subsahariana', code: 'SSA' },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
  lang,
  onSelectLang,
}) => {
  const [gender, setGender] = useState<Gender>(currentProfile.gender);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(currentProfile.ageGroup);
  const [country, setCountry] = useState<string>(currentProfile.country || '');
  const [cityType, setCityType] = useState<CityType>(() => {
    return currentProfile.cityType === 'multicultural' ? 'multicultural' : 'multicultural';
  });

  if (!isOpen) return null;

  const isRtl = lang === 'ar';
  const selectedCityDetails = CITY_TYPES[cityType];
  const salutation = getAnasSalutation({ gender, ageGroup, country, cityType, completedOnboarding: true }, lang);

  const handleSave = () => {
    playPeaceChime();
    onSaveProfile({
      gender,
      ageGroup,
      country: country.trim() || (isRtl ? 'غير محدد' : 'Global'),
      cityType,
      completedOnboarding: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-5 animate-in fade-in duration-300">
      <div
        className="relative w-full max-w-3xl bg-[#FBF9F5] rounded-t-3xl sm:rounded-3xl shadow-2xl border-t-2 sm:border border-[#D4A373]/30 overflow-hidden text-[#2C483F] flex flex-col max-h-[88vh] sm:max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="relative z-10 px-6 py-5 bg-gradient-to-r from-[#2C483F] via-[#20362f] to-[#172822] text-white flex items-center justify-between shadow-soft border-b border-[#D4A373]/25">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <AnasAvatar size="sm" lang={lang} emotion="smiling" />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#88C947] border-2 border-[#2C483F]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-[#88C947]/20 text-[#88C947] border border-[#88C947]/30 text-[11px] font-bold">
                  {t('onboarding.badge', lang)}
                </span>
                <span className="text-white/60 text-xs font-mono">• 100% {lang === 'ar' ? 'خصوصية' : 'Private'}</span>
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight mt-0.5 text-white">
                {t('onboarding.title', lang)}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                playSoftTap();
                onClose();
              }}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all active:scale-95"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Questionnaire Form */}
        <div className="overflow-y-auto px-5 sm:px-8 py-6 space-y-7 grow">
          {/* Anas Warm Personal Greeting Card & Definitive Identity */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#88C947]/15 via-white/80 to-[#D4A373]/15 border border-[#88C947]/30 shadow-soft space-y-3">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#88C947]/20 text-[#2C483F] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#2C483F]" />
              </div>
              <div className="text-sm">
                <p className="font-black text-[#2C483F] text-base">
                  {salutation}، {lang === 'ar' ? 'أهلاً بك في بيتك الآمن مع «رفيق»!' : 'Welcome to your safe sanctuary with Rafeeq!'}
                </p>
                <p className="text-xs sm:text-sm text-[#2C483F]/80 mt-1 leading-relaxed">
                  {lang === 'ar'
                    ? 'المحاكي المعرفي والوجداني لتمكين المسلم الجديد من التأقلم مع البيئة اليومية والشعائر، وبناء العادات الحركية برفق وسكينة.'
                    : 'Your agentic cognitive and habit-building companion for daily Islamic practice and tranquility.'}
                </p>
              </div>
            </div>

            {/* Clear Mission & Boundaries Banner */}
            <div className="pt-2 border-t border-[#88C947]/20 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <span className="font-bold text-[#2C483F] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>
                  {lang === 'ar'
                    ? 'رفيق رفيق وجداني وليس مفتياً شرعياً أو جهة إفتاء قضائي'
                    : 'Rafeeq is a habit companion, not an automated fatwa mufti'}
                </span>
              </span>
              <div className="flex items-center gap-1.5 text-stone-600 font-mono">
                <span className="px-1.5 py-0.5 rounded bg-emerald-100/70 text-emerald-900 font-bold">
                  -60% {lang === 'ar' ? 'حمل معرفي' : 'Load'}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#D4A373]/20 text-[#2C483F] font-bold">
                  85% {lang === 'ar' ? 'جاهزية حركية' : 'Readiness'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Gender & Age Group Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Gender Selection */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#D4A373]" />
                <label className="text-sm font-black text-[#2C483F]">
                  {t('onboarding.gender_title', lang)}
                </label>
              </div>
              <p className="text-xs text-[#2C483F]/70">
                {t('onboarding.gender_subtitle', lang)}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Male */}
                <button
                  type="button"
                  onClick={() => {
                    playSoftTap();
                    setGender('male');
                  }}
                  className={`p-3.5 rounded-2xl border text-start transition-all duration-200 flex flex-col justify-between ${
                    gender === 'male'
                      ? 'bg-gradient-to-b from-[#2C483F] to-[#20362f] text-white border-[#D4A373] shadow-soft-lg scale-[1.02]'
                      : 'bg-white hover:bg-stone-50 border-stone-200 text-[#2C483F]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">🧔</span>
                    {gender === 'male' && <CheckCircle2 className="w-4 h-4 text-[#88C947]" />}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{t('onboarding.male', lang)}</div>
                    <div className={`text-[11px] mt-0.5 ${gender === 'male' ? 'text-white/80' : 'text-stone-500'}`}>
                      {t('onboarding.male_desc', lang)}
                    </div>
                  </div>
                </button>

                {/* Female */}
                <button
                  type="button"
                  onClick={() => {
                    playSoftTap();
                    setGender('female');
                  }}
                  className={`p-3.5 rounded-2xl border text-start transition-all duration-200 flex flex-col justify-between ${
                    gender === 'female'
                      ? 'bg-gradient-to-b from-[#2C483F] to-[#20362f] text-white border-[#D4A373] shadow-soft-lg scale-[1.02]'
                      : 'bg-white hover:bg-stone-50 border-stone-200 text-[#2C483F]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">🧕</span>
                    {gender === 'female' && <CheckCircle2 className="w-4 h-4 text-[#88C947]" />}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{t('onboarding.female', lang)}</div>
                    <div className={`text-[11px] mt-0.5 ${gender === 'female' ? 'text-white/80' : 'text-stone-500'}`}>
                      {t('onboarding.female_desc', lang)}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Age Group Selection */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#D4A373]" />
                <label className="text-sm font-black text-[#2C483F]">
                  {t('onboarding.age_title', lang)}
                </label>
              </div>
              <p className="text-xs text-[#2C483F]/70">
                {t('onboarding.age_subtitle', lang)}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Teen */}
                <button
                  type="button"
                  onClick={() => {
                    playSoftTap();
                    setAgeGroup('teen');
                  }}
                  className={`p-3.5 rounded-2xl border text-start transition-all duration-200 flex flex-col justify-between ${
                    ageGroup === 'teen'
                      ? 'bg-gradient-to-b from-[#2C483F] to-[#20362f] text-white border-[#D4A373] shadow-soft-lg scale-[1.02]'
                      : 'bg-white hover:bg-stone-50 border-stone-200 text-[#2C483F]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">🌱</span>
                    {ageGroup === 'teen' && <CheckCircle2 className="w-4 h-4 text-[#88C947]" />}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{t('onboarding.teen', lang)}</div>
                    <div className={`text-[11px] mt-0.5 ${ageGroup === 'teen' ? 'text-white/80' : 'text-stone-500'}`}>
                      {t('onboarding.teen_desc', lang)}
                    </div>
                  </div>
                </button>

                {/* Adult */}
                <button
                  type="button"
                  onClick={() => {
                    playSoftTap();
                    setAgeGroup('adult');
                  }}
                  className={`p-3.5 rounded-2xl border text-start transition-all duration-200 flex flex-col justify-between ${
                    ageGroup === 'adult'
                      ? 'bg-gradient-to-b from-[#2C483F] to-[#20362f] text-white border-[#D4A373] shadow-soft-lg scale-[1.02]'
                      : 'bg-white hover:bg-stone-50 border-stone-200 text-[#2C483F]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">🌳</span>
                    {ageGroup === 'adult' && <CheckCircle2 className="w-4 h-4 text-[#88C947]" />}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{t('onboarding.adult', lang)}</div>
                    <div className={`text-[11px] mt-0.5 ${ageGroup === 'adult' ? 'text-white/80' : 'text-stone-500'}`}>
                      {t('onboarding.adult_desc', lang)}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Country / Region */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#D4A373]" />
                <label className="text-sm font-black text-[#2C483F]">
                  {t('onboarding.country_title', lang)}
                </label>
              </div>
              <span className="text-xs text-stone-500 font-medium">
                {country ? `📍 ${country}` : ''}
              </span>
            </div>
            <p className="text-xs text-[#2C483F]/70">
              {t('onboarding.country_subtitle', lang)}
            </p>

            {/* Quick Regional Suggestion Chips */}
            <div className="flex flex-wrap gap-2">
              {REGION_SUGGESTIONS.map((reg) => {
                const label = reg[lang] || reg.en;
                const isSelected = country === label;
                return (
                  <button
                    key={reg.code}
                    type="button"
                    onClick={() => {
                      playSoftTap();
                      setCountry(label);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-[#2C483F] text-white border-[#D4A373] shadow-sm'
                        : 'bg-white hover:bg-stone-100 text-[#2C483F] border-stone-200'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Custom Input */}
            <div className="relative">
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder={t('onboarding.country_placeholder', lang)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-sm text-[#2C483F] focus:outline-none focus:ring-2 focus:ring-[#88C947] focus:border-transparent placeholder:text-stone-400 shadow-inner"
              />
              <MapPin className="absolute top-3 end-3 w-4 h-4 text-stone-400 pointer-events-none" />
            </div>
          </div>

          {/* Section 3: City Type Selection (Option A, B, C) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-[#D4A373]" />
                <label className="text-sm font-black text-[#2C483F]">
                  {t('onboarding.city_title', lang)}
                </label>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#D4A373]/20 text-[#2C483F] border border-[#D4A373]/30">
                {t('onboarding.difficulty_label', lang)}: {selectedCityDetails.difficulty[lang]}
              </span>
            </div>
            <p className="text-xs text-[#2C483F]/70">
              {t('onboarding.city_subtitle', lang)}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
              {(Object.keys(CITY_TYPES) as CityType[]).map((key) => {
                const details = CITY_TYPES[key];
                const isSelected = cityType === key;
                const isLocked = key === 'islamic' || key === 'isolated';
                const icon = key === 'islamic' ? '🕌' : key === 'multicultural' ? '🏙️' : '🌌';

                return (
                  <button
                    key={key}
                    type="button"
                    disabled={isLocked}
                    onClick={() => {
                      if (isLocked) return;
                      playSoftTap();
                      setCityType(key);
                    }}
                    className={`relative p-4 rounded-2xl border text-start transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                      isLocked
                        ? 'bg-stone-50/90 border-stone-200 text-stone-500 cursor-not-allowed opacity-85'
                        : isSelected
                        ? 'bg-gradient-to-b from-[#2C483F] to-[#1c302a] text-white border-[#88C947] shadow-soft-lg ring-2 ring-[#88C947]/40 scale-[1.02]'
                        : 'bg-white hover:bg-stone-50 border-stone-200 text-[#2C483F]'
                    }`}
                  >
                    {/* Top row */}
                    <div className="flex items-center justify-between mb-2 gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-2xl">{icon}</span>
                        {isLocked && <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />}
                      </div>
                      {isLocked ? (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-center shrink-0">
                          Soon / قريبًا — تحت التطوير
                        </span>
                      ) : (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-[#88C947]/20 text-[#88C947] border border-[#88C947]/40'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {details.difficulty[lang]}
                        </span>
                      )}
                    </div>

                    {/* Title & Subtitle */}
                    <div className="space-y-1">
                      <h4 className="font-black text-sm">{details.title[lang]}</h4>
                      <p
                        className={`text-xs leading-relaxed line-clamp-2 ${
                          isLocked ? 'text-stone-500' : isSelected ? 'text-white/80' : 'text-stone-600'
                        }`}
                      >
                        {details.subtitle[lang]}
                      </p>
                    </div>

                    {/* Feature bullet list */}
                    <div
                      className={`mt-3 pt-3 border-t text-[11px] space-y-1 ${
                        isLocked
                          ? 'border-stone-200 text-stone-400'
                          : isSelected
                          ? 'border-white/10 text-white/70'
                          : 'border-stone-100 text-stone-500'
                      }`}
                    >
                      {details.features[lang].slice(0, 2).map((feature, i) => (
                        <div key={i} className="flex items-center gap-1.5 truncate">
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              isLocked ? 'bg-stone-300' : 'bg-[#88C947]'
                            }`}
                          />
                          <span className="truncate">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Selected badge overlay */}
                    {isSelected && !isLocked && (
                      <div className="absolute top-2 end-2">
                        <CheckCircle2 className="w-4 h-4 text-[#88C947]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Dynamic Customization Preview for Selected City Type */}
            <div className="mt-3 p-4 rounded-2xl bg-white border border-[#D4A373]/30 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="text-xs font-bold text-[#2C483F] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#D4A373]" />
                  {selectedCityDetails.badge[lang]}
                </span>
                <span className="text-[11px] text-stone-500 font-mono">
                  {lang === 'ar' ? 'التوجيهات المعايرة' : 'Calibrated Guidance'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                  <div className="font-bold text-[#2C483F] mb-1">
                    🕌 {t('map.prayer_tip_header', lang)}:
                  </div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    {selectedCityDetails.prayerGuide[lang]}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                  <div className="font-bold text-[#2C483F] mb-1">
                    🥗 {t('map.dietary_tip_header', lang)}:
                  </div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    {selectedCityDetails.dietaryTip[lang]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500">
              {currentProfile.completedOnboarding ? t('onboarding.current_profile', lang) + ':' : ''}
            </span>
            <span className="text-xs font-bold text-[#2C483F]">
              {selectedCityDetails.title[lang]} • {gender === 'female' ? t('onboarding.female', lang) : t('onboarding.male', lang)}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                playSoftTap();
                onClose();
              }}
              className="px-4 py-2.5 rounded-2xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50 transition-all"
            >
              {t('common.cancel', lang)}
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#2C483F] via-[#20362f] to-[#172822] text-white text-xs font-bold shadow-soft hover:shadow-gold transition-all duration-300 hover:scale-[1.02] active:scale-95 border border-[#D4A373]/40"
            >
              <span>{t('onboarding.save_btn', lang)}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4 text-[#88C947]" /> : <ArrowRight className="w-4 h-4 text-[#88C947]" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
