import React from 'react';
import { ChevronRight } from 'lucide-react';
import { playPeaceChime } from '../utils/audio';
import { Language } from '../types';

interface UmrahLauncherCardProps {
  onOpenUmrah: () => void;
  onOpenHajj?: () => void;
  lang?: Language;
}

export const UmrahLauncherCard: React.FC<UmrahLauncherCardProps> = ({
  onOpenUmrah,
  onOpenHajj,
  lang = 'ar'
}) => {
  const isAr = lang === 'ar';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d1624] via-[#16253c] to-[#0b1320] border-2 border-amber-400/40 text-white p-6 sm:p-7 shadow-xl hover:shadow-2xl transition-all duration-300">
      {/* Decorative Gold & Emerald Glows */}
      <div className="absolute top-0 end-0 -mt-10 -me-10 w-44 h-44 rounded-full bg-amber-500/15 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 start-1/4 -mb-10 w-40 h-40 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 text-start">
        {/* Left Side: Icon & Info */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20 shrink-0 border border-amber-300/40">
            🕋
          </div>

          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-amber-100 flex items-center gap-2">
              <span>{isAr ? 'محاكي مناسك الحج والعمرة التفاعلي' : 'Interactive Hajj & Umrah Simulators'}</span>
            </h3>
          </div>
        </div>

        {/* Right Side: Dual Action Buttons */}
        <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 lg:pt-0">
          {onOpenHajj && (
            <button
              type="button"
              onClick={() => {
                playPeaceChime();
                onOpenHajj();
              }}
              className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-700/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-400/40"
            >
              <span className="text-base">🏔️</span>
              <span>{isAr ? 'محاكي مناسك الحج والتمتع' : 'Hajj & Tamattu’ Sim'}</span>
              <ChevronRight className="w-4 h-4 rtl:rotate-180 text-white" />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              playPeaceChime();
              onOpenUmrah();
            }}
            className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-300/50"
          >
            <span className="text-base">🕋</span>
            <span>{isAr ? 'محاكي مناسك العمرة' : 'Umrah Simulator'}</span>
            <ChevronRight className="w-4 h-4 rtl:rotate-180 text-stone-950" />
          </button>
        </div>
      </div>
    </div>
  );
};
