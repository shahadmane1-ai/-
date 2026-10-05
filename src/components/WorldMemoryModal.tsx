import React from 'react';
import {
  Brain,
  Award,
  Sparkles,
  Layers,
  CheckSquare,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { Language, WorldMemoryState } from '../types';
import { playSoftTap } from '../utils/audio';

interface WorldMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  worldMemory: WorldMemoryState;
  score: number;
  onResetMemory: () => void;
  lang: Language;
}

export const WorldMemoryModal: React.FC<WorldMemoryModalProps> = ({
  isOpen,
  onClose,
  worldMemory,
  score,
  onResetMemory,
  lang,
}) => {
  if (!isOpen) return null;

  const completedExperiencesCount = worldMemory.completedExperiences?.length || 0;
  const completedTasksCount = worldMemory.completedTasks?.length || 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5 bg-[#2C483F]/45 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-t-3xl sm:rounded-3xl border-t-2 sm:border border-[#D4A373]/40 shadow-soft-lg p-5 sm:p-8 max-h-[88vh] overflow-y-auto text-start"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D4A373]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4A373]/30 to-[#88C947]/30 flex items-center justify-center text-[#2C483F]">
              <Brain className="w-5 h-5 text-[#2C483F]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#2C483F]">
                {lang === 'ar' ? 'ذاكرة العالم وتتبع الإنجاز' : 'World Memory & Progress Tracker'}
              </h3>
              <p className="text-xs text-[#2C483F]/70">
                {lang === 'ar'
                  ? 'سجل السكينة، التجارب، والمهام المكتملة في رحلتك'
                  : 'Tracks peace score, experiences, and tasks completed along your journey'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FBF9F5] hover:bg-slate-200/60 flex items-center justify-center text-[#2C483F] font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-5">
          <div className="p-3 bg-[#FBF9F5] border border-[#D4A373]/20 rounded-2xl text-center">
            <span className="text-[11px] text-[#2C483F]/70 block font-medium">
              {lang === 'ar' ? 'التجارب المنجزة' : 'Experiences Done'}
            </span>
            <span className="text-lg font-black font-mono text-[#2C483F] mt-0.5 block">
              {completedExperiencesCount}
            </span>
          </div>

          <div className="p-3 bg-[#FBF9F5] border border-[#D4A373]/20 rounded-2xl text-center">
            <span className="text-[11px] text-[#2C483F]/70 block font-medium">
              {lang === 'ar' ? 'المهام المنجزة' : 'Tasks Done'}
            </span>
            <span className="text-lg font-black font-mono text-[#88C947] mt-0.5 block">
              {completedTasksCount}
            </span>
          </div>

          <div className="p-3 bg-[#FBF9F5] border border-[#D4A373]/20 rounded-2xl text-center">
            <span className="text-[11px] text-[#2C483F]/70 block font-medium">
              {lang === 'ar' ? 'مؤشر السكينة' : 'Tranquility Index'}
            </span>
            <span className="text-lg font-black font-mono text-[#D4A373] mt-0.5 block">
              {score}%
            </span>
          </div>

          <div className="p-3 bg-[#FBF9F5] border border-[#D4A373]/20 rounded-2xl text-center">
            <span className="text-[11px] text-[#2C483F]/70 block font-medium">
              {lang === 'ar' ? 'اليوم النشط' : 'Current Day'}
            </span>
            <span className="text-lg font-black font-mono text-[#2C483F] mt-0.5 block">
              {worldMemory.currentDay || 1} / 7
            </span>
          </div>
        </div>

        {/* Status Callout */}
        <div className="space-y-3 mb-5">
          <div className="p-4 rounded-2xl border-2 border-dashed border-[#D4A373]/40 bg-[#FBF9F5] text-center space-y-2">
            <span className="text-xs font-black text-[#2C483F] block">
              {lang === 'ar' ? 'الهيكل الجديد للتعلم' : 'New Learning Content Structure'}
            </span>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
              {lang === 'ar'
                ? 'تمت إعادة ضبط محتوى التعلم القديم بنجاح. الأسبوع التأسيسي (الأيام 1-7) جاهز لاستقبال التجارب والمهام الجديدة المربوطة بمعالم المدينة.'
                : 'Old learning content has been completely reset. Foundational Week (Days 1-7) is ready to receive new experiences associated with city buildings.'}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#D4A373]/20">
          <button
            type="button"
            onClick={() => {
              playSoftTap();
              onResetMemory();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-300 text-rose-700 bg-rose-50/70 hover:bg-rose-100 text-xs font-bold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'تصفير الذاكرة والإنجازات' : 'Reset Memory & Progress'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#2C483F] hover:bg-[#1e342d] text-white text-xs font-bold transition-all shadow-soft"
          >
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
