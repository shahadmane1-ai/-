import React from 'react';
import {
  ArrowRight,
  Lock,
  Layers,
  CheckSquare,
  Sparkles,
  Play,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { DailyTask, Experience, JourneyDay, Language, WorldMemoryState } from '../types';
import { experiences, dailyTasks } from '../data/simulationData';

interface ActiveScenarioModalProps {
  day: JourneyDay;
  isOpen: boolean;
  onClose: () => void;
  worldMemory?: WorldMemoryState;
  score?: number;
  lang: Language;
  onStartExperience?: (experience: Experience) => void;
  onOpenTaskModal?: (task: DailyTask) => void;
}

export const ActiveScenarioModal: React.FC<ActiveScenarioModalProps> = ({
  day,
  isOpen,
  onClose,
  worldMemory,
  lang,
  onStartExperience,
  onOpenTaskModal,
}) => {
  if (!isOpen) return null;

  const isLocked = day.isLocked || day.dayNumber > 7;
  const dayExperiences = experiences.filter((exp) => exp.day === day.dayNumber);
  const dayTask = dailyTasks.find((task) => task.day === day.dayNumber) || null;
  const completedExperiences = worldMemory?.completedExperiences || [];
  const completedTasks = worldMemory?.completedTasks || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#14231E]/80 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white/95 backdrop-blur-md rounded-t-3xl sm:rounded-3xl border-t-2 sm:border-2 border-[#D4A373]/50 shadow-2xl p-5 sm:p-6 max-h-[88vh] overflow-y-auto text-start flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md pb-3 mb-2 border-b border-[#D4A373]/25 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#2C483F] text-[#D4A373] font-mono">
              {lang === 'ar' ? `اليوم ${day.dayNumber}` : `Day ${day.dayNumber}`}
            </span>
            <span className="text-xs text-stone-500 font-mono">
              {lang === 'ar' ? `الأسبوع ${day.weekNumber}` : `Week ${day.weekNumber}`}
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

        {/* Content Area */}
        <div className="my-4 space-y-4">
          {/* If Day 8-30 (Locked Stage) */}
          {isLocked ? (
            <div className="p-6 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/60 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center mx-auto text-xl shadow-xs">
                <Lock className="w-6 h-6 text-amber-800" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-black text-amber-950">
                  {lang === 'ar'
                    ? 'مرحلة متقدمة — تفتح في التحديث القادم بعد إتمام الأسبوع التأسيسي'
                    : 'Advanced Stage — Unlocks in the upcoming update after completing the foundational week'}
                </h3>
                <p className="text-xs text-amber-800/80">
                  {lang === 'ar'
                    ? 'الأيام من 8 إلى 30 مقفلة حالياً ومخصصة للمراحل المتقدمة.'
                    : 'Days 8 to 30 are locked and reserved for advanced learning content.'}
                </p>
              </div>
            </div>
          ) : (
            /* Days 1-7: Available days with 2 experiences and 1 task */
            <div className="space-y-4">
              {/* Day Experiences */}
              <div className="space-y-2">
                <span className="text-xs font-black text-[#2C483F] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#88C947]" />
                  <span>{lang === 'ar' ? 'تجارب اليوم (محاكاة مواقف حقيقية):' : 'Today’s Experiences (Real-life Mini-Games):'}</span>
                </span>

                <div className="space-y-2">
                  {dayExperiences.map((exp) => {
                    const isDone = completedExperiences.includes(exp.experienceId);

                    return (
                      <div
                        key={exp.experienceId}
                        className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          isDone
                            ? 'bg-emerald-50/70 border-emerald-300'
                            : 'bg-white border-[#D4A373]/30 hover:border-[#88C947]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2C483F] text-[#D4A373] font-mono">
                              {exp.buildingId.toUpperCase()}
                            </span>
                            {isDone && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>{lang === 'ar' ? 'مكتملة' : 'Done'}</span>
                              </span>
                            )}
                          </div>
                          <h5 className="text-xs font-black text-[#2C483F] mt-1">
                            {lang === 'ar' ? exp.title.ar : exp.title.en}
                          </h5>
                          <p className="text-[11px] text-stone-500 line-clamp-1">
                            {lang === 'ar' ? exp.description.ar : exp.description.en}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onStartExperience && onStartExperience(exp);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                            isDone
                              ? 'bg-white border border-emerald-400 text-emerald-800'
                              : 'bg-[#2C483F] hover:bg-[#1e342d] text-white shadow-soft'
                          }`}
                        >
                          {isDone ? (
                            <>
                              <RotateCcw className="w-3 h-3" />
                              <span>{lang === 'ar' ? 'إعادة' : 'Replay'}</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 text-[#D4A373] fill-current" />
                              <span>{lang === 'ar' ? 'بدء' : 'Play'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Day Task */}
              {dayTask && (
                <div className="space-y-2 pt-1 border-t border-[#D4A373]/20">
                  <span className="text-xs font-black text-[#2C483F] flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-[#D4A373]" />
                    <span>{lang === 'ar' ? 'مهمة اليوم التطبيقية في الحياة:' : 'Today’s Real-Life Task:'}</span>
                  </span>

                  <div
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      completedTasks.includes(dayTask.taskId)
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : 'bg-white border-[#D4A373]/30'
                    }`}
                  >
                    <div>
                      <h5 className="text-xs font-black text-[#2C483F]">
                        {lang === 'ar' ? dayTask.title.ar : dayTask.title.en}
                      </h5>
                      <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">
                        {lang === 'ar' ? dayTask.description.ar : dayTask.description.en}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenTaskModal && onOpenTaskModal(dayTask);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        completedTasks.includes(dayTask.taskId)
                          ? 'bg-white border border-emerald-400 text-emerald-800'
                          : 'bg-[#2C483F] hover:bg-[#1e342d] text-white shadow-soft'
                      }`}
                    >
                      {completedTasks.includes(dayTask.taskId)
                        ? lang === 'ar'
                          ? 'مراجعة المهمة'
                          : 'Review Task'
                        : lang === 'ar'
                        ? 'الانتقال إلى المهمة'
                        : 'Go to Task'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="pt-3 border-t border-[#D4A373]/20 flex items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#2C483F] font-bold transition-colors"
          >
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>

          <span className="text-[10px] text-stone-400 font-mono">
            {lang === 'ar' ? 'المدينة متعددة الثقافات' : 'Multicultural City Journey'}
          </span>
        </div>
      </div>
    </div>
  );
};
