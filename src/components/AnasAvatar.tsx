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
 * Pure SVG Component for Rafeeq (رفيق) Mascot
 * Authentic Green Chubby Character with Waving Arm, Pink Blushing Cheeks,
 * Intricate Islamic Geometric Belly Pattern, Standing on a Prayer Carpet.
 * Based on the official Rafeeq Mascot Asset.
 */
export const AnasIcon: React.FC<{
  size?: number | string;
  className?: string;
  emotion?: AnasEmotion;
}> = ({ size = 44, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 overflow-visible select-none ${className}`}
      aria-label="رفيق — Rafeeq Mascot"
    >
      <defs>
        {/* Main Body Green Gradient */}
        <linearGradient id="rafeeqBodyGrad" x1="60" y1="20" x2="140" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7CD836" />
          <stop offset="35%" stopColor="#67C627" />
          <stop offset="70%" stopColor="#52B019" />
          <stop offset="100%" stopColor="#3E9610" />
        </linearGradient>

        {/* Head Top Specular Shine */}
        <radialGradient id="rafeeqHeadShine" cx="95" cy="40" r="45" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A8F064" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#8AE03F" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#67C627" stopOpacity="0" />
        </radialGradient>

        {/* Cheerful Pink Blush */}
        <radialGradient id="rafeeqCheekBlush" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF708A" stopOpacity="0.95" />
          <stop offset="80%" stopColor="#FF859C" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FF9EB1" stopOpacity="0" />
        </radialGradient>

        {/* Prayer Rug Blue & Gold Tile Gradient */}
        <linearGradient id="carpetGrad" x1="20" y1="180" x2="180" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>

        {/* Drop Shadow Filter */}
        <filter id="rafeeqShadow" x="15" y="170" width="170" height="30" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="100" cy="182" rx="65" ry="10" fill="#2D4D1E" opacity="0.25" />

      {/* Decorative Prayer Carpet Base */}
      <g opacity="0.9">
        <path
          d="M 25 186 L 175 186 L 190 198 L 10 198 Z"
          fill="url(#carpetGrad)"
          stroke="#D4A373"
          strokeWidth="1.5"
        />
        {/* Carpet Arabesque Tile Pattern Lines */}
        <path d="M 40 186 L 30 198 M 60 186 L 50 198 M 80 186 L 70 198 M 100 186 L 100 198 M 120 186 L 130 198 M 140 186 L 150 198 M 160 186 L 170 198" stroke="#D4A373" strokeWidth="1" opacity="0.6" />
        <path d="M 20 192 L 180 192" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="4 4" opacity="0.8" />
      </g>

      {/* Left Arm Resting on Side */}
      <path
        d="M 152 76 C 168 84 176 108 174 126 C 172 136 160 138 154 130 C 148 122 146 104 148 88 Z"
        fill="url(#rafeeqBodyGrad)"
        stroke="#275E10"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Two Cute Little Stubby Feet */}
      <g>
        {/* Left Foot */}
        <path
          d="M 64 162 C 64 176 72 182 86 182 C 96 182 98 172 98 162 Z"
          fill="url(#rafeeqBodyGrad)"
          stroke="#275E10"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
        {/* Right Foot */}
        <path
          d="M 102 162 C 102 172 104 182 114 182 C 128 182 136 176 136 162 Z"
          fill="url(#rafeeqBodyGrad)"
          stroke="#275E10"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
      </g>

      {/* Main Body (Chubby Bean / Cactus Silhouette) */}
      <path
        d="M 100 18 
           C 134 18, 154 44, 154 84 
           C 154 118, 158 144, 150 166 
           C 146 174, 134 176, 100 176 
           C 66 176, 54 174, 50 166 
           C 42 144, 46 118, 46 84 
           C 46 44, 66 18, 100 18 Z"
        fill="url(#rafeeqBodyGrad)"
        stroke="#275E10"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Head Top Specular Glow */}
      <path
        d="M 100 21 C 128 21 144 42 146 72 C 136 40 114 26 86 26 C 90 22 95 21 100 21 Z"
        fill="url(#rafeeqHeadShine)"
      />

      {/* Raised Waving Right Arm (Waving Hello / Salam) */}
      <path
        d="M 52 82 
           C 42 70, 30 52, 28 42 
           C 26 34, 34 26, 42 32 
           C 48 36, 56 46, 58 56 
           C 60 66, 60 74, 58 84 Z"
        fill="url(#rafeeqBodyGrad)"
        stroke="#275E10"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ========================================================================= */}
      {/* FACE ELEMENTS */}
      {/* ========================================================================= */}
      {/* Left Eye */}
      <circle cx="86" cy="68" r="6.5" fill="#15240E" />
      <circle cx="88.5" cy="65.5" r="2.2" fill="#FFFFFF" />
      <circle cx="84.5" cy="70" r="1.1" fill="#FFFFFF" />

      {/* Right Eye */}
      <circle cx="122" cy="68" r="6.5" fill="#15240E" />
      <circle cx="124.5" cy="65.5" r="2.2" fill="#FFFFFF" />
      <circle cx="120.5" cy="70" r="1.1" fill="#FFFFFF" />

      {/* Pink Blushing Cheeks */}
      <circle cx="72" cy="80" r="8" fill="url(#rafeeqCheekBlush)" />
      <circle cx="134" cy="80" r="8" fill="url(#rafeeqCheekBlush)" />

      {/* Happy Friendly Smile */}
      <path
        d="M 94 78 Q 104 87 114 78"
        stroke="#15240E"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* ========================================================================= */}
      {/* INTRICATE ISLAMIC GEOMETRIC ARABESQUE PATTERN ON BELLY */}
      {/* ========================================================================= */}
      <g transform="translate(100, 132) scale(0.68)" opacity="0.88">
        {/* Outer Arabesque Border Arch */}
        <path
          d="M 0 -48 C 22 -48, 44 -30, 48 -6 C 52 18, 38 42, 0 46 C -38 42, -52 18, -48 -6 C -44 -30, -22 -48, 0 -48 Z"
          stroke="#2A6311"
          strokeWidth="2.2"
          fill="none"
        />

        {/* Central 8-Pointed Star (Khatim) */}
        <path
          d="M 0 -16 L 5 -5 L 16 0 L 5 5 L 0 16 L -5 5 L -16 0 L -5 -5 Z"
          stroke="#2A6311"
          strokeWidth="1.8"
          fill="#5CB521"
          fillOpacity="0.4"
        />
        <path
          d="M -11 -11 L 0 -7 L 11 -11 L 7 0 L 11 11 L 0 7 L -11 11 L -7 0 Z"
          stroke="#2A6311"
          strokeWidth="1.8"
          fill="#5CB521"
          fillOpacity="0.4"
        />

        {/* Radiating Arabesque Geometry Petals */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => (
          <g key={i} transform={`rotate(${ang})`}>
            <path
              d="M 0 -16 C 6 -26, 12 -34, 0 -44 C -12 -34, -6 -26, 0 -16 Z"
              stroke="#2A6311"
              strokeWidth="1.6"
              fill="none"
            />
            <path
              d="M 0 -22 L 6 -32 L 0 -38 L -6 -32 Z"
              stroke="#2A6311"
              strokeWidth="1.2"
              fill="none"
            />
          </g>
        ))}

        {/* Concentric Geometric Rings */}
        <circle cx="0" cy="0" r="28" stroke="#2A6311" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
        <circle cx="0" cy="0" r="40" stroke="#2A6311" strokeWidth="1.5" fill="none" />
      </g>
    </svg>
  );
};

export const AnasAvatar: React.FC<AnasAvatarProps> = ({
  size = 'md',
  showGreetingBubble = false,
  className = '',
  lang = 'ar',
  onInteracted,
}) => {
  const [isWaving, setIsWaving] = useState(false);

  const sizePixels = {
    xs: 36,
    sm: 52,
    md: 84,
    lg: 130,
    xl: 180,
  };

  const px = sizePixels[size] || 84;

  const handleInteract = () => {
    playSoftTap();
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 800);
    if (onInteracted) {
      onInteracted();
    }
  };

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none cursor-pointer transition-transform duration-300 ${className} ${
        isWaving ? 'scale-105 animate-wiggle' : 'hover:scale-105'
      }`}
      onClick={handleInteract}
      role="button"
      tabIndex={0}
      aria-label="رفيق — الرفيق التفاعلي"
    >
      {/* Optional Speech Bubble */}
      {showGreetingBubble && (
        <div className="absolute -top-10 bg-white/95 backdrop-blur-md px-3 py-1 rounded-2xl border border-[#D4A373]/40 shadow-soft text-xs font-bold text-[#2C483F] animate-bounce whitespace-nowrap z-20">
          <span>{lang === 'ar' ? 'السلام عليكم! 👋' : 'Salam Alaykum! 👋'}</span>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-[#D4A373]/40 transform rotate-45" />
        </div>
      )}

      {/* Rafeeq Green Mascot Vector */}
      <div className="relative">
        <AnasIcon size={px} />
      </div>
    </div>
  );
};
