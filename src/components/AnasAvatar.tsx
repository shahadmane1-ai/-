import React, { useState } from 'react';
import { AnasEmotion, Language } from '../types';
import { playSoftTap } from '../utils/audio';

export interface AnasAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showGreetingBubble?: boolean;
  className?: string;
  lang?: Language;
  emotion?: AnasEmotion;
  onInteracted?: () => void;
}

/**
 * Pure SVG Icon for Anas - Young Adult Male Companion
 * Clean, friendly, calm, approachable, vector illustration matching Rafeeq brand
 */
export const AnasIcon: React.FC<{
  size?: number | string;
  className?: string;
  emotion?: AnasEmotion;
}> = ({ size = 44, className = '', emotion = 'smiling' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 overflow-visible select-none ${className}`}
      aria-label="رفيق - الرفيق الذكي"
    >
      <defs>
        {/* Background Circle Gradient */}
        <radialGradient id="anasBgGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#3A5D52" />
          <stop offset="80%" stopColor="#20362F" />
          <stop offset="100%" stopColor="#14241F" />
        </radialGradient>

        {/* Skin Tone Gradient */}
        <linearGradient id="anasSkin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F9DFCB" />
          <stop offset="100%" stopColor="#E8BF9E" />
        </linearGradient>

        {/* Male Hair Tone Gradient */}
        <linearGradient id="anasHair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3E4249" />
          <stop offset="50%" stopColor="#252A30" />
          <stop offset="100%" stopColor="#171A1E" />
        </linearGradient>

        {/* Clothing Emerald Gradient */}
        <linearGradient id="anasShirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3D685B" />
          <stop offset="100%" stopColor="#1E372F" />
        </linearGradient>

        {/* Cheek Blush */}
        <radialGradient id="anasBlush" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E5989B" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#E5989B" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer Border / Halo Ring */}
      <circle cx="50" cy="50" r="48" fill="url(#anasBgGrad)" />
      <circle cx="50" cy="50" r="47" stroke="#D4A373" strokeWidth="2.5" strokeOpacity="0.85" />

      {/* Shoulder / Collar / Shirt (Young Modern Emerald Jacket/Polo) */}
      <path
        d="M 20 94 C 20 80 32 74 44 73 L 56 73 C 68 74 80 80 80 94 Z"
        fill="url(#anasShirt)"
      />
      {/* Inner Collar V-neck / Trim in Brand Lime */}
      <path
        d="M 44 73 L 50 82 L 56 73 Z"
        fill="#88C947"
        opacity="0.9"
      />
      <path
        d="M 46 73 L 50 79 L 54 73 Z"
        fill="#F9DFCB"
      />

      {/* Neck */}
      <rect x="44" y="60" width="12" height="15" rx="3" fill="url(#anasSkin)" />

      {/* Ears */}
      <circle cx="28" cy="49" r="5" fill="url(#anasSkin)" />
      <circle cx="72" cy="49" r="5" fill="url(#anasSkin)" />
      <circle cx="28" cy="49" r="2.5" fill="#DDB28F" opacity="0.6" />
      <circle cx="72" cy="49" r="2.5" fill="#DDB28F" opacity="0.6" />

      {/* Head / Face Oval (Male proportions) */}
      <ellipse cx="50" cy="48" rx="22" ry="24" fill="url(#anasSkin)" />

      {/* Modern Styled Short Male Hair (Back & Top Layer) */}
      <path
        d="M 27 46 C 26 33 34 20 50 20 C 66 20 74 33 73 46 C 73 40 70 28 64 25 C 57 22 43 22 36 26 C 30 29 28 38 27 46 Z"
        fill="url(#anasHair)"
      />
      {/* Modern Hair Bangs / Sweep (Male parted style) */}
      <path
        d="M 28 34 C 33 26 44 24 53 25 C 62 26 69 31 72 37 C 66 32 58 31 50 32 C 43 33 36 36 32 40 C 30 38 29 36 28 34 Z"
        fill="url(#anasHair)"
      />

      {/* Eyebrows (Calm, friendly, slightly lifted) */}
      <path
        d="M 36 40 Q 42 38 46 41"
        stroke="#23272D"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 64 40 Q 58 38 54 41"
        stroke="#23272D"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Eyes (Calm, kind, smiling) */}
      {/* Left Eye */}
      <circle cx="41" cy="46" r="3.5" fill="#1A202C" />
      <circle cx="42" cy="45" r="1.2" fill="#FFFFFF" />

      {/* Right Eye */}
      <circle cx="59" cy="46" r="3.5" fill="#1A202C" />
      <circle cx="60" cy="45" r="1.2" fill="#FFFFFF" />

      {/* Subtle Cheerful Cheeks */}
      <circle cx="35" cy="52" r="4.5" fill="url(#anasBlush)" />
      <circle cx="65" cy="52" r="4.5" fill="url(#anasBlush)" />

      {/* Subtle Nose */}
      <path
        d="M 50 47 L 49 52 L 51.5 52"
        stroke="#DDB28F"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Warm Friendly Smile */}
      <path
        d="M 44 56 Q 50 62 56 56"
        stroke="#7A4F35"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Emotion Accents */}
      {emotion === 'holding_lantern' && (
        <g transform="translate(68, 62) scale(0.65)">
          {/* Gentle Lantern */}
          <polygon points="10,4 14,8 6,8" fill="#D4A373" />
          <rect x="6" y="8" width="8" height="12" rx="2" fill="#FDE047" opacity="0.9" />
          <circle cx="10" cy="14" r="3" fill="#FFFFFF" />
          <polygon points="6,20 14,20 10,23" fill="#D4A373" />
        </g>
      )}

      {emotion === 'waving' && (
        <g transform="translate(68, 30) scale(0.7)">
          <circle cx="10" cy="10" r="5" fill="url(#anasSkin)" />
          <path d="M 6 12 L 10 7 L 14 12" stroke="#2C483F" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </g>
      )}

      {emotion === 'nodding' && (
        <g transform="translate(68, 22)">
          <path d="M 5 0 L 7 4 L 11 5 L 7 7 L 5 11 L 3 7 L -1 5 L 3 4 Z" fill="#FDE047" />
        </g>
      )}
    </svg>
  );
};

export const AnasAvatar: React.FC<AnasAvatarProps> = ({
  size = 'sm',
  showGreetingBubble = false,
  className = '',
  lang = 'ar',
  emotion = 'smiling',
  onInteracted,
}) => {
  const [showSpeech, setShowSpeech] = useState(showGreetingBubble);
  const [greetingIndex, setGreetingIndex] = useState(0);

  const greetings = [
    {
      ar: 'السَّلَامُ عَلَيْكُمْ ورحمة الله وبركاته!',
      subAr: 'أنا رفيق، رفيقك في رحلة السكينة والتعلم',
      en: 'As-salamu alaykum wa rahmatullah!',
      subEn: "I'm Rafiq, your companion on this mindful journey",
    },
    {
      ar: 'أهلاً بك يا رفيقي! كيف حال قلبك اليوم؟',
      subAr: 'خذ نفساً هادئاً، وديننا يسر لا مشقة فيه',
      en: 'Welcome, dear companion! How is your heart today?',
      subEn: 'Take a calm breath; our faith is ease and peace',
    },
    {
      ar: 'أنا بجانبك في كل خطوة وتجربة 🌿',
      subAr: 'للتدبر، السكينة، وتيسير أمور يومك',
      en: 'I am by your side in every step and mini-game 🌿',
      subEn: 'For reflection, serenity, and practical ease',
    },
  ];

  const handleClick = () => {
    playSoftTap();
    setGreetingIndex((prev) => (prev + 1) % greetings.length);
    setShowSpeech(true);
    if (onInteracted) onInteracted();
  };

  const pixelSizes = {
    xs: 28,
    sm: 44,
    md: 68,
    lg: 96,
    xl: 120,
  };

  const currentGreeting = greetings[greetingIndex];

  return (
    <div className={`relative inline-flex items-center select-none ${className}`}>
      {/* Interactive Avatar Button */}
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setShowSpeech(true)}
        className="group relative cursor-pointer focus:outline-none transition-transform duration-300 hover:scale-105 active:scale-95"
        title={lang === 'ar' ? 'رفيق - رفيقك في السكينة' : 'Rafeeq  - Your Companion'}
        aria-label="Anas Avatar Companion"
      >
        {/* Soft Ambient Radiance Aura */}
        <div className="absolute inset-0 rounded-full bg-[#88C947]/20 blur-md scale-95 group-hover:scale-110 transition-transform duration-300 -z-10" />

        <AnasIcon size={pixelSizes[size]} emotion={emotion} />

        {/* Small Active State Indicator */}
        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#88C947] opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#88C947] border-2 border-white" />
        </span>
      </button>

      {/* Floating Greeting Speech Bubble */}
      {showSpeech && (
        <div
          className={`absolute z-50 transition-all duration-300 pointer-events-auto ${
            size === 'xs' || size === 'sm'
              ? 'top-14 -right-12 sm:right-0 w-64'
              : 'top-full mt-3 left-1/2 -translate-x-1/2 w-72'
          }`}
          onMouseLeave={() => setShowSpeech(false)}
        >
          <div className="relative bg-white/95 backdrop-blur-md border border-[#D4A373]/40 rounded-2xl p-3 shadow-soft-lg text-start">
            {/* Triangular arrow point towards mascot */}
            <div className="absolute -top-2 right-6 w-3 h-3 bg-white border-t border-l border-[#D4A373]/40 transform rotate-45" />

            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-[#2C483F] leading-snug">
                  {lang === 'ar' ? currentGreeting.ar : currentGreeting.en}
                </p>
                <p className="text-[11px] text-[#2C483F]/70 mt-1">
                  {lang === 'ar' ? currentGreeting.subAr : currentGreeting.subEn}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSpeech(false);
                }}
                className="text-[#2C483F]/40 hover:text-[#2C483F] text-xs px-1"
                aria-label="Close bubble"
              >
                ✕
              </button>
            </div>

            <div className="mt-2 pt-2 border-t border-[#D4A373]/20 flex items-center justify-between text-[10px] text-[#D4A373] font-medium">
              <span>{lang === 'ar' ? 'انقر على رفيق للمزيد' : 'Tap Rafeeq  to interact'}</span>
              <span className="bg-[#88C947]/15 text-[#558824] px-1.5 py-0.5 rounded-full font-semibold">
                {lang === 'ar' ? 'جاهز للمرافقة' : 'Active Buddy'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
