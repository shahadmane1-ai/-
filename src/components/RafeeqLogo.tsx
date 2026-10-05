import React from 'react';
import { Language } from '../types';

interface RafeeqLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  showText?: boolean;
  lang?: Language;
}

export const RafeeqLogo: React.FC<RafeeqLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  showText = true,
  lang = 'ar',
}) => {
  // Dimension mappings
  const iconSizes = {
    sm: 40,
    md: 52,
    lg: 72,
  };

  const px = iconSizes[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Intricate Islamic Geometric Star Medallion in Rose-Gold Encased Ring */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={px}
          height={px}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-500 hover:rotate-6"
          aria-label="Rafeeq Official Emblem"
        >
          <defs>
            {/* Metallic Rose Gold Gradients */}
            <linearGradient id="roseGoldRing" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E2BC9B" />
              <stop offset="35%" stopColor="#D4A373" />
              <stop offset="70%" stopColor="#C89B84" />
              <stop offset="100%" stopColor="#A36B51" />
            </linearGradient>

            <linearGradient id="roseGoldFaceted" x1="40" y1="30" x2="120" y2="130" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F7DFD0" />
              <stop offset="40%" stopColor="#D4A373" />
              <stop offset="75%" stopColor="#BD856C" />
              <stop offset="100%" stopColor="#8E5843" />
            </linearGradient>

            <radialGradient id="centerStarGlow" cx="80" cy="80" r="35" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FFF4E6" />
              <stop offset="70%" stopColor="#E2BC9B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#D4A373" stopOpacity="0" />
            </radialGradient>

            <filter id="softGlow" x="40" y="40" width="80" height="80" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Thin Compass Ring */}
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="url(#roseGoldRing)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="95 18 95 18"
            opacity="0.85"
          />

          {/* Secondary Concentric Thin Arcs */}
          <circle
            cx="80"
            cy="80"
            r="63"
            stroke="url(#roseGoldRing)"
            strokeWidth="1.2"
            opacity="0.65"
          />

          {/* Layered 8-Fold Geometric Star Medallion Petals */}
          <g transform="translate(80, 80)">
            {/* Outer Arabesque Points */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <path
                key={i}
                d="M 0,-54 C 10,-42 18,-35 22,-22 C 16,-20 8,-18 0,-18 C -8,-18 -16,-20 -22,-22 C -18,-35 -10,-42 0,-54 Z"
                fill="url(#roseGoldFaceted)"
                transform={`rotate(${angle})`}
                opacity={i % 2 === 0 ? "0.95" : "0.8"}
              />
            ))}

            {/* Inner Intricate Facets */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <path
                key={`facet-${i}`}
                d="M 0,-48 L 9,-25 L 0,-16 L -9,-25 Z"
                fill={i % 2 === 0 ? "#E7C6A5" : "#B88065"}
                transform={`rotate(${angle})`}
                opacity="0.9"
              />
            ))}

            {/* Inner Radiating Star Relief */}
            <path
              d="M 0,-44 C 4,-20 18,-18 28,-12 C 18,-6 20,4 28,12 C 18,18 4,20 0,44 C -4,20 -18,18 -28,12 C -18,4 -20,-6 -28,-12 C -18,-18 -4,-20 0,-44 Z"
              fill="url(#roseGoldRing)"
              stroke="#FFF1E2"
              strokeWidth="0.8"
            />

            {/* Central 4-pointed radiant highlight star */}
            <path
              d="M 0,-32 Q 3,-8 18,-3 Q 3,3 0,32 Q -3,3 -18,-3 Q -3,-8 0,-32 Z"
              fill="url(#centerStarGlow)"
              filter="url(#softGlow)"
            />

            {/* Center Golden Core */}
            <circle cx="0" cy="0" r="6" fill="#FFFDF8" />
            <circle cx="0" cy="0" r="3" fill="#D4A373" />
          </g>
        </svg>

        {/* Ambient Warm Golden Halo Glow */}
        <div className="absolute inset-0 -z-10 rounded-full bg-[#D4A373]/15 blur-md scale-95" />
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline gap-2">
            <h1
              className={`font-bold tracking-tight text-[#2C483F] leading-none ${
                size === 'sm' ? 'text-2xl font-black' : size === 'md' ? 'text-3xl' : 'text-4xl'
              }`}
              style={{ fontFamily: "'Tajawal', 'IBM Plex Sans Arabic', sans-serif" }}
            >
              رفيق
            </h1>
            {lang === 'en' && (
              <span className="text-xs uppercase tracking-widest text-[#D4A373] font-semibold">
                Rafeeq AI
              </span>
            )}
          </div>
          {showSubtitle && (
            <p className="text-xs text-[#2C483F]/75 font-medium mt-0.5 leading-snug whitespace-nowrap">
              {lang === 'ar' ? 'الشريك في كل خطوة' : 'The Companion in Every Step'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
