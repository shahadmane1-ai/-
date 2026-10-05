import React from 'react';
import { RafeeqLogo } from './RafeeqLogo';
import { ShieldCheck, HeartHandshake, Award } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
  onOpenHumanReferral: () => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onOpenHumanReferral }) => {
  return (
    <footer className="mt-12 border-t border-[#D4A373]/25 bg-white/60 backdrop-blur-md py-10 transition-colors hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#D4A373]/20">
          {/* Logo & Subtitle */}
          <div>
            <RafeeqLogo size="sm" showSubtitle={true} showText={true} lang={lang} />
            <p className="text-xs text-[#2C483F]/70 mt-2 max-w-sm text-start">
              {lang === 'ar'
                ? 'مبادرة وتطبيق ضمن تحدي الذكاء الاصطناعي الإسلامي 2026 (المسار الثالث: التجارب التفاعلية والرحلة المعرفية).'
                : 'Built for the Islamic AI Challenge 2026 (Track 3: Interactive Experiences & Knowledge Journey).'}
            </p>
          </div>

          {/* Quick Ethical Action Badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#2C483F]/80">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#88C947]" />
              <span>{lang === 'ar' ? 'خصوصية وأمان أخلاقي' : 'Ethical Islamic AI'}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#D4A373]" />
              <span>{lang === 'ar' ? 'تحدي الذكاء الاصطناعي 2026' : 'Islamic AI Challenge 2026'}</span>
            </div>

            <button
              type="button"
              onClick={onOpenHumanReferral}
              className="text-[#2C483F] hover:text-[#D4A373] underline flex items-center gap-1"
            >
              <HeartHandshake className="w-4 h-4 text-[#D4A373]" />
              <span>{lang === 'ar' ? 'الإحالة لمختص بشري' : 'Human Specialist Referral'}</span>
            </button>
          </div>
        </div>

        {/* Quiet Copyright Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#2C483F]/60 text-start">
          <p>
            {lang === 'ar'
              ? '© 2026 رفيق AI · جميع الحقوق محفوظة لرحلة السكينة والتدبر'
              : '© 2026 Rafeeq AI · All rights reserved for mindful serenity journeys'}
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>{lang === 'ar' ? '«ألا بذكر الله تطمئن القلوب»' : '"In remembrance do hearts find rest"'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
