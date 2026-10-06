import React, { useState, useRef, useEffect } from 'react';
import {
  Settings,
  Globe,
  HeartHandshake,
  ChevronDown,
  Check,
} from 'lucide-react';
import { RafeeqLogo } from './RafeeqLogo';
import { FloatingBadge, Language, UserProfile } from '../types';
import { CITY_TYPES, SUPPORTED_LANGUAGES, t } from '../utils/i18n';
import { playSoftTap } from '../utils/audio';

interface TopNavbarProps {
  score?: number;
  recentBadges?: FloatingBadge[];
  onAdjustScore?: (delta: number, label: string, type: 'peace' | 'stress') => void;
  lang: Language;
  onSelectLang: (lang: Language) => void;
  onToggleLang?: () => void;
  currentProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenHumanReferral: () => void;
  onOpenFatwaSanctuary?: () => void;
  onOpenJudgeTour?: () => void;
  onOpenGovernance?: () => void;
  onAnasInteracted?: () => void;
  onOpenTraceModal?: () => void;
  onOpenMiniGameLab?: () => void;
  onOpenUmrah?: () => void;
  onOpenHajj?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  lang,
  onSelectLang,
  currentProfile,
  onOpenProfile,
  onOpenSettings,
  onOpenHumanReferral,
}) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cityDetails = CITY_TYPES[currentProfile.cityType] || CITY_TYPES.multicultural;
  const cityIcon =
    currentProfile.cityType === 'islamic'
      ? '🕌'
      : currentProfile.cityType === 'multicultural'
      ? '🏙️'
      : '🌌';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#D4A373]/25 transition-all select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* LEFT ZONE: Official Rafeeq Vector Logo & Typography */}
        <div className="flex items-center shrink-0">
          <RafeeqLogo size="sm" showText={true} lang={lang} />
        </div>

        {/* RIGHT ZONE: Profile Badge, Language Switcher, Human Referral, Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Profile / City Type Quick Badge & Button */}
          <button
            type="button"
            onClick={() => {
              playSoftTap();
              onOpenProfile();
            }}
            className="group relative flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-2xl bg-white hover:bg-stone-50 text-[#2C483F] border border-[#D4A373]/30 hover:border-[#D4A373] shadow-xs transition-all hover:scale-[1.02] active:scale-95"
            title={t('onboarding.edit_btn', lang)}
          >
            <span className="text-base leading-none">{cityIcon}</span>
            <div className="hidden lg:flex flex-col text-start">
              <span className="text-[9px] text-stone-500 font-bold leading-tight">
                {t('nav.profile', lang)}
              </span>
              <span className="text-xs font-black text-[#2C483F] leading-tight truncate max-w-[90px]">
                {cityDetails.title[lang]}
              </span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-[#88C947]" />
          </button>

          {/* Language Switcher Dropdown */}
          <div className="relative" ref={langMenuRef}>
            <button
              type="button"
              onClick={() => {
                playSoftTap();
                setIsLangMenuOpen(!isLangMenuOpen);
              }}
              className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-2xl bg-white hover:bg-stone-50 text-[#2C483F] border border-[#D4A373]/30 text-xs font-bold transition-all shadow-xs"
              aria-label="Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#D4A373]" />
              <span className="uppercase text-[11px] font-mono">{lang}</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {isLangMenuOpen && (
              <div className="absolute end-0 mt-2 w-36 rounded-2xl bg-white/95 backdrop-blur-md border border-[#D4A373]/40 shadow-soft-lg py-1 z-50 animate-fade-in text-start">
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      playSoftTap();
                      onSelectLang(l.code);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold transition-colors ${
                      lang === l.code
                        ? 'bg-[#2C483F] text-white'
                        : 'text-[#2C483F] hover:bg-[#FBF9F5]'
                    }`}
                  >
                    <span>{l.nativeName}</span>
                    {lang === l.code && <Check className="w-3.5 h-3.5 text-[#88C947]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Prominent Human Referral Shortcut Button (Next to Settings) */}
          <button
            type="button"
            onClick={() => {
              playSoftTap();
              onOpenHumanReferral();
            }}
            className="group relative flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl bg-gradient-to-r from-[#2C483F] to-[#20362f] text-white text-xs font-semibold shadow-soft hover:shadow-gold transition-all duration-300 border border-[#D4A373]/40 hover:scale-[1.02] active:scale-95 cursor-pointer"
            title={t('nav.human_referral', lang)}
          >
            <HeartHandshake className="w-4 h-4 text-[#88C947] group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline font-bold">
              {lang === 'ar' ? 'مرشد بشري' : 'Human Specialist'}
            </span>
          </button>

          {/* Settings Button */}
          <button
            type="button"
            onClick={() => {
              playSoftTap();
              onOpenSettings();
            }}
            className="w-9 h-9 rounded-2xl bg-white hover:bg-stone-50 flex items-center justify-center text-[#2C483F] border border-[#D4A373]/30 shadow-xs hover:shadow-soft transition-all active:scale-95"
            title={t('nav.settings', lang)}
          >
            <Settings className="w-4 h-4 text-stone-600" />
          </button>
        </div>
      </div>
    </header>
  );
};
