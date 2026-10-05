import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Compass,
  MapPin,
  Clock,
  Layers,
  Building2,
  Home,
  Coffee,
  ShoppingBag,
  Dumbbell,
  GraduationCap,
  Play,
  CheckCircle2,
  Lock,
  RotateCcw,
  HeartHandshake,
  Eye,
} from 'lucide-react';
import { CityLandmark, Experience, LandmarkId, Language } from '../types';
import { experiences } from '../data/simulationData';
import { playSoftTap } from '../utils/audio';
import { isDayUnlocked } from '../utils/journeyUnlock';
import { MarketAmanahExperience } from './experiences/MarketAmanahExperience';
import { MarketHalalFoodInspectionExperience } from './experiences/MarketHalalFoodInspectionExperience';

interface BuildingDetailModalProps {
  landmark: CityLandmark | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onStartExperience?: (experience: Experience) => void;
  completedExperiences?: string[];
  completedTasks?: string[];
}

export const BuildingDetailModal: React.FC<BuildingDetailModalProps> = ({
  landmark,
  isOpen,
  onClose,
  lang,
  onStartExperience,
  completedExperiences = [],
  completedTasks = [],
}) => {
  const [isAmanahOpen, setIsAmanahOpen] = useState(false);
  const [isHalalFoodOpen, setIsHalalFoodOpen] = useState(false);

  if (!isOpen || !landmark) return null;

  // Filter experiences belonging to this landmark in multicultural city
  const buildingExperiences = experiences.filter((exp) => {
    const isThisBuilding =
      exp.buildingId === landmark.id ||
      (landmark.id === 'market' && (exp.buildingId === 'street' || exp.buildingId === 'market')) ||
      (landmark.id === 'cafe' && (exp.buildingId === 'cafe' || exp.buildingId === 'office')) ||
      (landmark.id === 'office' && (exp.buildingId === 'office' || exp.buildingId === 'cafe')) ||
      (landmark.id === 'apartment' && exp.buildingId === 'apartment');

    const isMulticultural = exp.environmentId === 'multicultural';
    return isThisBuilding && isMulticultural;
  });

  const getLandmarkIcon = () => {
    switch (landmark.id) {
      case 'mosque':
        return <Compass className="w-6 h-6 text-[#88C947]" />;
      case 'office':
        return <Building2 className="w-6 h-6 text-[#D4A373]" />;
      case 'apartment':
        return <Home className="w-6 h-6 text-[#D4A373]" />;
      case 'cafe':
        return <Coffee className="w-6 h-6 text-[#C89B84]" />;
      case 'market':
        return <ShoppingBag className="w-6 h-6 text-[#88C947]" />;
      case 'gym':
        return <Dumbbell className="w-6 h-6 text-[#D4A373]" />;
      case 'school':
        return <GraduationCap className="w-6 h-6 text-[#88C947]" />;
      default:
        return <Building2 className="w-6 h-6 text-[#88C947]" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#14231E]/80 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-t-3xl sm:rounded-3xl border-t-2 sm:border-2 border-[#D4A373]/50 shadow-2xl p-5 sm:p-6 max-h-[88vh] overflow-y-auto text-start flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Return to City button */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md pb-3.5 mb-2 border-b border-[#D4A373]/25 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#2C483F] to-[#1c302a] text-white text-xs font-bold shadow-soft hover:shadow-gold transition-all hover:scale-105 active:scale-95"
            >
              <ArrowRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180 text-[#D4A373]" />
              <span>{lang === 'ar' ? '← العودة إلى خريطة المدينة' : '← Return to City Map'}</span>
            </button>
            <span className="text-xs text-stone-500 font-mono">
              {landmark.id.toUpperCase()}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FBF9F5] hover:bg-stone-200 flex items-center justify-center text-stone-700 font-bold text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Building Details & Context */}
        <div className="space-y-4 my-2">
          {/* Building Title & Theme Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FBF9F5] to-[#F5EFE6] border border-[#D4A373]/40 flex items-start gap-3.5 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#2C483F] flex items-center justify-center shrink-0 shadow-soft">
              {getLandmarkIcon()}
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2C483F] text-[#D4A373]">
                  {lang === 'ar' ? 'معلم المدينة' : 'City Landmark'}
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  {lang === 'ar' ? 'المدينة متعددة الثقافات' : 'Multicultural City'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#2C483F]">
                {lang === 'ar' ? landmark.nameAr : landmark.nameEn}
              </h3>
              <p className="text-xs text-stone-600 font-medium">
                {lang === 'ar' ? landmark.subtitleAr : landmark.subtitleEn}
              </p>
              <p className="text-xs text-[#2C483F]/85 italic pt-1">
                {lang === 'ar' ? landmark.teaserAr : landmark.teaserEn}
              </p>
            </div>
          </div>

          {/* TWO Virtual 2D Interactive Experiences for "السوق والمعرفة" */}
          {landmark.id === 'market' && (
            <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-[#FAF6F0] via-white to-[#F5EFE6] border-2 border-[#D4A373]/50 shadow-sm">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#D4A373]/20">
                <span className="text-xs font-black text-[#2C483F] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#D4A373]" />
                  <span>{lang === 'ar' ? 'تجارب السوق والمعرفة الافتراضية 2D:' : 'Market & Knowledge 2D Virtual Experiences:'}</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2C483F] text-[#88C947]">
                  2 STANDALONE 2D
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. تجربة الأمانة */}
                <div className="p-3.5 rounded-xl bg-white border border-[#D4A373]/40 shadow-xs flex flex-col justify-between space-y-2.5">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-xl bg-[#2C483F] text-[#D4A373] flex items-center justify-center text-sm shadow-xs">
                        <HeartHandshake className="w-4 h-4" />
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        مشهد كاشير تفاعلي 2D
                      </span>
                    </div>
                    <h4 className="text-xs font-black text-[#2C483F]">
                      {lang === 'ar' ? 'تجربة الأمانة' : 'Amanah Experience'}
                    </h4>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      {lang === 'ar'
                        ? 'موقف عملي عند كاشير السوق لرد الزيادة المدفوعة بالخطأ أداءً للأمانة.'
                        : 'Interactive cashier scene to return extra change received by mistake.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAmanahOpen(true)}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#2C483F] to-[#1e342d] text-white text-xs font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3 h-3 text-[#D4A373] fill-current" />
                    <span>{lang === 'ar' ? 'بدء تجربة الأمانة' : 'Start Amanah 2D'}</span>
                  </button>
                </div>

                {/* 2. تجربة فحص الطعام الحلال */}
                <div className="p-3.5 rounded-xl bg-white border border-[#D4A373]/40 shadow-xs flex flex-col justify-between space-y-2.5">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-xl bg-[#2C483F] text-[#88C947] flex items-center justify-center text-sm shadow-xs">
                        <ShoppingBag className="w-4 h-4" />
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                        مشهد رفوف تفاعلي 2D
                      </span>
                    </div>
                    <h4 className="text-xs font-black text-[#2C483F]">
                      {lang === 'ar' ? 'فحص الطعام الحلال' : 'Halal Food Inspection'}
                    </h4>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      {lang === 'ar'
                        ? 'فحص تفاعلي لمنتجات السوق للتمييز بين الحلال الأصيل والمشتبهات.'
                        : 'Explore market shelves and inspect foods with interactive magnifying lens.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsHalalFoodOpen(true)}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#88C947] to-[#6fa733] text-[#14231E] text-xs font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3 h-3 text-[#14231E] fill-current" />
                    <span>{lang === 'ar' ? 'بدء فحص الحلال' : 'Start Inspection 2D'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Section: Experiences Associated With This Building */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#2C483F] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#88C947]" />
                <span>{lang === 'ar' ? 'تجارب هذا المعلم:' : 'Experiences for this Landmark:'}</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {buildingExperiences.length > 0 ? `${buildingExperiences.length} TOTAL` : 'NONE'}
              </span>
            </div>

            {/* Render building experiences */}
            {buildingExperiences.length > 0 ? (
              <div className="space-y-2.5">
                {buildingExperiences.map((exp) => {
                  const isDone = completedExperiences.includes(exp.experienceId);
                  const isUnlocked = isDayUnlocked(exp.day, completedExperiences, completedTasks);

                  return (
                    <div
                      key={exp.experienceId}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
                        isDone
                          ? 'border-emerald-300 bg-emerald-50/60'
                          : isUnlocked
                          ? 'border-[#D4A373]/40 bg-white hover:border-[#88C947]'
                          : 'border-stone-200 bg-stone-50/70 opacity-75'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#2C483F] bg-[#D4A373]/20 px-2 py-0.5 rounded-full font-mono">
                            {lang === 'ar' ? `اليوم ${exp.day}` : `Day ${exp.day}`}
                          </span>
                          {isDone ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>{lang === 'ar' ? 'مكتملة' : 'Completed'}</span>
                            </span>
                          ) : isUnlocked ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                              {lang === 'ar' ? 'متاحة للبدء' : 'Ready to Play'}
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200 text-stone-600 font-bold flex items-center gap-1">
                              <Lock className="w-3 h-3 text-stone-500" />
                              <span>{lang === 'ar' ? `تفتح بعد إتمام اليوم ${exp.day - 1}` : `Unlocks after Day ${exp.day - 1}`}</span>
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-black text-[#2C483F]">
                          {lang === 'ar' ? exp.title.ar : exp.title.en}
                        </h4>
                        <p className="text-xs text-stone-600 leading-relaxed max-w-lg">
                          {lang === 'ar' ? exp.description.ar : exp.description.en}
                        </p>
                      </div>

                      {isUnlocked ? (
                        <button
                          type="button"
                          onClick={() => onStartExperience && onStartExperience(exp)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 ${
                            isDone
                              ? 'bg-white border border-emerald-400 text-emerald-800 hover:bg-emerald-50'
                              : 'bg-gradient-to-r from-[#2C483F] to-[#1e342d] text-white shadow-soft hover:shadow-gold hover:scale-105 active:scale-95'
                          }`}
                        >
                          {isDone ? (
                            <>
                              <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{lang === 'ar' ? 'إعادة التجربة' : 'Replay'}</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 text-[#D4A373] fill-current" />
                              <span>{lang === 'ar' ? 'بدء التجربة' : 'Start Mini-Game'}</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="px-3 py-2 rounded-xl text-[11px] font-bold text-stone-400 bg-stone-100 flex items-center gap-1 shrink-0">
                          <Lock className="w-3 h-3 text-stone-400" />
                          <span>{lang === 'ar' ? 'مقفلة حالياً' : 'Locked'}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* If no experience assigned */
              <div className="p-6 rounded-2xl border-2 border-dashed border-[#D4A373]/40 bg-[#FBF9F5] text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-base">
                  <Lock className="w-5 h-5 text-amber-800" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-[#2C483F]">
                    {lang === 'ar' ? 'لا توجد تجارب لهذا المعلم' : 'No Experiences for this Landmark'}
                  </h4>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="pt-3 border-t border-[#D4A373]/20 flex items-center justify-between gap-3 text-xs">
          <span className="text-stone-400 font-mono text-[10px]">
            {lang === 'ar' ? 'المعالم تملك التجارب' : 'Building-Owned Mini-Games'}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#2C483F] font-bold transition-colors cursor-pointer"
          >
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>

      {/* Standalone Market 2D Virtual Experiences */}
      <MarketAmanahExperience
        isOpen={isAmanahOpen}
        onClose={() => setIsAmanahOpen(false)}
        lang={lang}
      />

      <MarketHalalFoodInspectionExperience
        isOpen={isHalalFoodOpen}
        onClose={() => setIsHalalFoodOpen(false)}
        lang={lang}
      />
    </div>
  );
};
