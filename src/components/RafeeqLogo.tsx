import React from 'react';
import { Language } from '../types';
import { AnasIcon } from './AnasAvatar';

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
  showText = true,
  lang = 'ar',
}) => {
  // Dimension mappings
  const iconSizes = {
    sm: 44,
    md: 56,
    lg: 72,
  };

  const px = iconSizes[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Green Rafeeq Mascot Avatar */}
      <div className="relative shrink-0 flex items-center justify-center hover:scale-105 transition-transform duration-300">
        <AnasIcon size={px} className="filter drop-shadow-sm" />
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline gap-2">
            <h1
              className={`font-black tracking-widest text-[#2C483F] leading-none ${
                size === 'sm' ? 'text-3xl sm:text-4xl' : size === 'md' ? 'text-4xl sm:text-5xl' : 'text-5xl sm:text-6xl'
              }`}
              style={{ fontFamily: "'Tajawal', 'IBM Plex Sans Arabic', sans-serif" }}
            >
              رفيق
            </h1>
            {lang === 'en' && (
              <span className="text-xs uppercase tracking-widest text-[#D4A373] font-bold">
                Rafeeq
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
