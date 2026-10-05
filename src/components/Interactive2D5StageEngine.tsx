import React, { useState } from 'react';
import {
  Sparkles,
  X,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Compass,
  Award,
} from 'lucide-react';
import { Experience, Language } from '../types';
import { playPeaceChime, playSoftTap } from '../utils/audio';

// Import all 14 individual 2.5D tactile game components
import { GameHomePrayerRoom } from './experiences/GameHomePrayerRoom';
import { GameWorkLunchHalal } from './experiences/GameWorkLunchHalal';
import { GameUniversityPrayer } from './experiences/GameUniversityPrayer';
import { GameFirstRowMosque } from './experiences/GameFirstRowMosque';
import { GameFamilyCommunication } from './experiences/GameFamilyCommunication';
import { GameHelpingNeighbor } from './experiences/GameHelpingNeighbor';
import { GameStreetHonestyAmanah } from './experiences/GameStreetHonestyAmanah';
import { GameFirstJumuah } from './experiences/GameFirstJumuah';
import { GameTravelConcession } from './experiences/GameTravelConcession';
import { GameRainConcession } from './experiences/GameRainConcession';
import { GameHonoringParents } from './experiences/GameHonoringParents';
import { GameEncourageGoodness } from './experiences/GameEncourageGoodness';
import { GameGymAttireModesty } from './experiences/GameGymAttireModesty';
import { GameGymMindfulGaze } from './experiences/GameGymMindfulGaze';

interface Interactive2D5StageEngineProps {
  experience: Experience;
  lang: Language;
  onClose: () => void;
  onFinish: () => void;
  onNextExperience?: () => void;
}

export const Interactive2D5StageEngine: React.FC<Interactive2D5StageEngineProps> = ({
  experience,
  lang,
  onClose,
  onFinish,
  onNextExperience,
}) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    playPeaceChime();
    setIsCompleted(true);
    onFinish();
  };

  const renderGameComponent = () => {
    switch (experience.experienceId) {
      case 'home-prayer-room':
        return <GameHomePrayerRoom experience={experience} lang={lang} onFinish={handleComplete} />;
      case 'work-lunch-halal':
        return <GameWorkLunchHalal experience={experience} lang={lang} onFinish={handleComplete} />;
      case 'university-prayer':
        return <GameUniversityPrayer experience={experience} lang={lang} onFinish={handleComplete} />;
      case 'first-row-mosque':
        return <GameFirstRowMosque experience={experience} lang={lang} onFinish={handleComplete} />;
      case 'family-communication':
        return <GameFamilyCommunication experience={experience} lang={lang} onFinish={handleComplete} />;
      case 'helping-neighbor':
        return <GameHelpingNeighbor experience={experience} lang={lang} onFinish={handleComplete} />;
      case 'street-honesty-amanah':
      case 'market-amanah':
        return <GameStreetHonestyAmanah experience={experience} lang={lang} onFinish={handleComplete} />;
      case 'first-jumuah':
        return <GameFirstJumuah experience={experience} lang={lang} onFinish={handleComplete} />;
      case 'travel-concession':
        return <GameTravelConcession experience={experience} lang={lang} onFinish={handleComplete} />;
      case 'rain-concession':
        return <GameRainConcession experience={experience} lang={lang} onFinish={handleComplete} />;
      case 'honoring-parents':
        return <GameHonoringParents experience={experience} lang={lang} onFinish={handleComplete} />;
      case 'encourage-goodness':
        return <GameEncourageGoodness experience={experience} lang={lang} onFinish={handleComplete} />;
      case 'gym-attire-modesty':
        return <GameGymAttireModesty experience={experience} lang={lang} onFinish={handleComplete} />;
      case 'gym-mindful-gaze':
        return <GameGymMindfulGaze experience={experience} lang={lang} onFinish={handleComplete} />;
      default:
        return (
          <div className="p-8 text-center bg-stone-50 rounded-3xl border-2 border-[#D4A373]/30 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold">
              🌿
            </div>
            <h4 className="text-base font-bold text-[#2C483F]">
              {lang === 'ar' ? experience.title.ar : experience.title.en}
            </h4>
            <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
              {lang === 'ar' ? experience.description.ar : experience.description.en}
            </p>
            <button
              type="button"
              onClick={handleComplete}
              className="px-6 py-2.5 rounded-xl bg-[#2C483F] text-white text-xs font-bold shadow-soft hover:shadow-gold transition-all cursor-pointer"
            >
              {lang === 'ar' ? 'إتمام التجربة وتثبيت السكينة' : 'Complete Experience'}
            </button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#D4A373]/20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2C483F] to-[#1E322B] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {lang === 'ar' ? `اليوم ${experience.day} • محاكاة واقعية` : `Day ${experience.day} • Simulation`}
              </span>
              {isCompleted && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{lang === 'ar' ? 'مكتملة بنجاح' : 'Completed'}</span>
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-black text-[#2C483F] mt-0.5">
              {lang === 'ar' ? experience.title.ar : experience.title.en}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            playSoftTap();
            onClose();
          }}
          className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Interactive Scene Canvas */}
      <div className="relative">
        {renderGameComponent()}
      </div>

      {/* Footer Objective & Next Action Bar */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-[#D4A373]/20">
        <div className="flex items-center gap-2 text-stone-600">
          <BookOpen className="w-4 h-4 text-[#D4A373]" />
          <span className="font-medium">
            {lang === 'ar'
              ? experience.objectiveAr || experience.description.ar
              : experience.objectiveEn || experience.description.en}
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {onNextExperience && (
            <button
              type="button"
              onClick={() => {
                playSoftTap();
                onNextExperience();
              }}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{lang === 'ar' ? 'التجربة التالية' : 'Next Simulation'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              playSoftTap();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-[#2C483F] hover:bg-[#20362f] text-white font-bold text-xs shadow-soft transition-all cursor-pointer"
          >
            {lang === 'ar' ? 'إغلاق والعودة للمدينة' : 'Return to City'}
          </button>
        </div>
      </div>
    </div>
  );
};
