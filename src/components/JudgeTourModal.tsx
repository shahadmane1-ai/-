import React from 'react';
import {
  Scale,
  Sparkles,
  Building2,
  Lock,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { CityType, Language, UserProfile, LandmarkId } from '../types';
import { CITY_LANDMARKS, JOURNEY_DAYS } from '../data/simulationData';
import { playPeaceChime, playSoftTap } from '../utils/audio';

interface JudgeTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onSelectDay: (dayNumber: number) => void;
  currentDay: number;
  onSwitchCityType: (cityType: CityType) => void;
  currentProfile: UserProfile;
  onAdjustScore: (delta: number, label: string, type: 'peace' | 'stress') => void;
  currentScore: number;
  onOpenHubExperience?: (landmarkId: LandmarkId) => void;
  onOpenTraceModal?: () => void;
}

export const JudgeTourModal: React.FC<JudgeTourModalProps> = ({
  isOpen,
  onClose,
  lang,
  onSelectDay,
  currentDay,
  onSwitchCityType,
  currentProfile,
  onAdjustScore,
  currentScore,
  onOpenHubExperience,
  onOpenTraceModal,
}) => {
  if (!isOpen) return null;

  const foundationalDays = JOURNEY_DAYS.filter((d) => d.dayNumber <= 7);

  const handleTeleport = (dayNum: number) => {
    if (dayNum > 7) return;
    playPeaceChime();
    onSelectDay(dayNum);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5 bg-black/60 backdrop-blur-sm animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl border-t-2 sm:border-2 border-[#D4A373] shadow-2xl p-5 sm:p-6 text-start max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2C483F] to-[#1a2b25] text-amber-300 flex items-center justify-center shadow-soft">
              <Scale className="w-5 h-5 text-[#D4A373]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#2C483F] flex items-center gap-2">
                <span>{lang === 'ar' ? 'مسار الاستكشاف السريع' : 'Quick Navigation Suite'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  {lang === 'ar' ? 'الأسبوع التأسيسي' : 'Foundational Week'}
                </span>
              </h3>
              <p className="text-xs text-stone-500">
                {lang === 'ar'
                  ? 'التنقل بين أيام الأسبوع التأسيسي (1-7) واستكشاف معالم المدينة'
                  : 'Navigate Foundational Week days (1-7) and explore city landmarks'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Foundational Days Section (1-7) */}
        <div className="my-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#2C483F]">
              {lang === 'ar' ? 'الأسبوع التأسيسي (الأيام 1-7 المتاحة):' : 'Foundational Week (Available Days 1-7):'}
            </span>
            <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {lang === 'ar' ? '7 أيام متاحة' : '7 Days Active'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {foundationalDays.map((d) => (
              <button
                key={d.dayNumber}
                type="button"
                onClick={() => handleTeleport(d.dayNumber)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  currentDay === d.dayNumber
                    ? 'border-[#2C483F] bg-[#2C483F] text-white shadow-soft font-bold'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800'
                }`}
              >
                <span className="text-xs font-black block">
                  {lang === 'ar' ? `اليوم ${d.dayNumber}` : `Day ${d.dayNumber}`}
                </span>
                <span className="text-[10px] opacity-75 block mt-0.5">
                  {lang === 'ar' ? 'متاح' : 'Available'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Locked Days Notice (8-30) */}
        <div className="p-3.5 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/70 text-center space-y-1 my-3">
          <div className="flex items-center justify-center gap-1.5 text-amber-900 font-bold text-xs">
            <Lock className="w-4 h-4 text-amber-700" />
            <span>
              {lang === 'ar'
                ? 'مرحلة متقدمة — تفتح في التحديث القادم بعد إتمام الأسبوع التأسيسي'
                : 'Advanced Stage — Unlocks in the upcoming update after completing the foundational week'}
            </span>
          </div>
          <p className="text-[10px] text-amber-800/80">
            {lang === 'ar' ? 'الأيام 8 إلى 30 مقفلة بالكامل.' : 'Days 8 through 30 are completely locked.'}
          </p>
        </div>

        {/* City Landmarks Context List */}
        <div className="my-4 space-y-2">
          <span className="text-xs font-black text-[#2C483F] block">
            {lang === 'ar' ? 'معالم المدينة وسياقها المعماري:' : 'City Buildings & Architectural Context:'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CITY_LANDMARKS.map((lm) => (
              <button
                key={lm.id}
                type="button"
                onClick={() => {
                  playSoftTap();
                  if (onOpenHubExperience) onOpenHubExperience(lm.id);
                  onClose();
                }}
                className="p-2.5 rounded-xl border border-stone-200 hover:border-[#88C947] bg-white text-start transition-all flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-[#2C483F] block">
                    {lang === 'ar' ? lm.nameAr : lm.nameEn}
                  </span>
                  <span className="text-[10px] text-stone-500 line-clamp-1">
                    {lang === 'ar' ? lm.subtitleAr : lm.subtitleEn}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-stone-400">
                  {lm.id.toUpperCase()}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
          {onOpenTraceModal && (
            <button
              type="button"
              onClick={() => {
                onOpenTraceModal();
                onClose();
              }}
              className="text-[11px] font-mono text-stone-500 hover:text-stone-800 underline cursor-pointer"
            >
              [لوحة التشخيص الهندسي للتحكيم]
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all ms-auto"
          >
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
