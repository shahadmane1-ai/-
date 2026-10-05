import React, { useState, useRef } from 'react';
import {
  Calendar,
  Lock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Layers,
  CheckSquare,
  Play,
  CheckCircle2,
  RotateCcw,
  Compass,
} from 'lucide-react';
import { DailyTask, Experience, JourneyDay, Language, WorldMemoryState } from '../types';
import { JOURNEY_DAYS, experiences, dailyTasks } from '../data/simulationData';
import { playSoftTap } from '../utils/audio';
import { isDayUnlocked } from '../utils/journeyUnlock';
import { useJudgeDemoMode } from '../utils/demoMode';

interface SevenDayJourneyStepperProps {
  activeDay: number;
  completedDays: number[];
  onSelectDay: (dayNumber: number) => void;
  worldMemory?: WorldMemoryState;
  onOpenMemoryModal?: () => void;
  lang: Language;
  onStartExperience?: (experience: Experience) => void;
  onOpenTaskModal?: (task: DailyTask) => void;
  onOpenScenarioModal?: () => void;
}

export const SevenDayJourneyStepper: React.FC<SevenDayJourneyStepperProps> = ({
  activeDay,
  onSelectDay,
  worldMemory,
  lang,
  onStartExperience,
  onOpenTaskModal,
}) => {
  // Navigation mode: 'foundational' (Days 1–7) | 'advanced' (Days 8–30 locked)
  const [activeTab, setActiveTab] = useState<'foundational' | 'advanced'>('foundational');
  const ribbonScrollRef = useRef<HTMLDivElement>(null);
  const { isDemoMode } = useJudgeDemoMode();

  const foundationalDays = JOURNEY_DAYS.filter((d) => d.dayNumber <= 7);
  const completedExperiences = worldMemory?.completedExperiences || [];
  const completedTasks = worldMemory?.completedTasks || [];

  // Filter Day's experiences and task
  const currentDayExperiences = experiences.filter((e) => e.day === activeDay);
  const currentDayTask = dailyTasks.find((t) => t.day === activeDay) || null;
  const isCurrentDayUnlocked = isDayUnlocked(activeDay, completedExperiences, completedTasks);

  const currentDayDoneCount =
    currentDayExperiences.filter((e) => completedExperiences.includes(e.experienceId)).length +
    (currentDayTask && completedTasks.includes(currentDayTask.taskId) ? 1 : 0);
  const currentDayTotalCount = currentDayExperiences.length + (currentDayTask ? 1 : 0);

  const handleSelectDay = (dayNumber: number) => {
    playSoftTap();
    // Days 8–30 must remain completely locked (Requirement 7)
    if (dayNumber > 7) {
      setActiveTab('advanced');
      return;
    }

    // Sequential Unlock (Requirement 11)
    const unlocked = isDayUnlocked(dayNumber, completedExperiences, completedTasks);
    if (!unlocked) {
      return;
    }

    onSelectDay(dayNumber);
  };

  const handleScrollRibbon = (direction: 'left' | 'right') => {
    playSoftTap();
    if (ribbonScrollRef.current) {
      const offset = direction === 'left' ? -200 : 200;
      ribbonScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl border border-[#D4A373]/30 p-4 sm:p-5 shadow-soft transition-all space-y-4 select-none text-start">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#D4A373]/20">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2C483F] to-[#1d322b] text-[#D4A373] flex items-center justify-center font-black text-sm shadow-soft">
            <Calendar className="w-5 h-5 text-[#88C947]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm sm:text-base font-black text-[#2C483F]">
                {lang === 'ar' ? 'مسار الرحلة والخطوات اليومية' : 'Journey Timeline & Daily Steps'}
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#88C947]/20 text-[#2C483F] border border-[#88C947]/40 flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3 text-[#D4A373]" />
                <span>
                  {lang === 'ar' ? `اليوم ${activeDay} من 7` : `Day ${activeDay} of 7`}
                </span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                {lang === 'ar'
                  ? `إنجاز اليوم: ${currentDayDoneCount} من ${currentDayTotalCount}`
                  : `Day Progress: ${currentDayDoneCount}/${currentDayTotalCount}`}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {lang === 'ar'
                ? 'الأسبوع التأسيسي في المدينة متعددة الثقافات: 14 تجربة حية و7 مهام واقعية'
                : 'Foundational Week in Multicultural City: 14 real-life mini-games & 7 daily tasks'}
            </p>
          </div>
        </div>

        {/* Tab Switcher: Foundational vs Advanced */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-100 border border-stone-200">
          <button
            type="button"
            onClick={() => {
              playSoftTap();
              setActiveTab('foundational');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'foundational'
                ? 'bg-[#2C483F] text-white shadow-soft'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {lang === 'ar' ? 'الأسبوع التأسيسي (1-7)' : 'Foundational (1-7)'}
          </button>

          <button
            type="button"
            onClick={() => {
              playSoftTap();
              setActiveTab('advanced');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === 'advanced'
                ? 'bg-amber-800 text-white shadow-soft'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Lock className="w-3 h-3 text-amber-500" />
            <span>{lang === 'ar' ? 'مراحل متقدمة (8-30)' : 'Advanced (8-30)'}</span>
          </button>
        </div>
      </div>

      {/* Days 1–7 Ribbon */}
      {activeTab === 'foundational' && (
        <div className="space-y-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => handleScrollRibbon('left')}
              className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/95 shadow-md border border-stone-200 text-stone-700 flex items-center justify-center hover:bg-stone-50 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleScrollRibbon('right')}
              className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/95 shadow-md border border-stone-200 text-stone-700 flex items-center justify-center hover:bg-stone-50 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div
              ref={ribbonScrollRef}
              className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 px-4 scroll-smooth"
            >
              {foundationalDays.map((d) => {
                const isSelected = activeDay === d.dayNumber;
                const isUnlocked = isDayUnlocked(d.dayNumber, completedExperiences, completedTasks);

                return (
                  <button
                    key={d.dayNumber}
                    type="button"
                    disabled={!isUnlocked}
                    onClick={() => handleSelectDay(d.dayNumber)}
                    className={`min-w-[105px] flex-1 py-3 px-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 relative ${
                      !isUnlocked
                        ? 'border-stone-200 bg-stone-100/70 text-stone-400 opacity-60 cursor-not-allowed'
                        : isSelected
                        ? 'border-[#2C483F] bg-[#2C483F] text-white shadow-soft scale-105'
                        : 'border-[#D4A373]/30 bg-white hover:border-[#88C947] text-stone-700'
                    }`}
                  >
                    <span className="text-[10px] font-mono opacity-80">
                      {lang === 'ar' ? 'أسبوع 1' : 'Week 1'}
                    </span>
                    <span className="text-xs font-black">
                      {lang === 'ar' ? `اليوم ${d.dayNumber}` : `Day ${d.dayNumber}`}
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        !isUnlocked
                          ? 'bg-stone-200 text-stone-500'
                          : isSelected
                          ? 'bg-[#88C947] text-[#2C483F] font-bold'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {!isUnlocked ? (
                        <>
                          <Lock className="w-2.5 h-2.5" />
                          <span>{lang === 'ar' ? 'مغلق' : 'Locked'}</span>
                        </>
                      ) : (
                        <span>{lang === 'ar' ? 'متاح' : 'Available'}</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Day Content: 2 Real-Life Experiences + 1 Practical Daily Task */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 pt-1">
            {/* 2 Experiences Column (8 cols) */}
            <div className="lg:col-span-8 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#2C483F] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#88C947]" />
                  <span>
                    {lang === 'ar'
                      ? `تجارب اليوم ${activeDay} الحركية (تجربتان واقعيتان):`
                      : `Day ${activeDay} Real-Life Experiences (2 Mini-Games):`}
                  </span>
                </span>
                <span className="text-[10px] font-mono text-stone-500">
                  {lang === 'ar' ? 'الموقف أولاً ثم الشرح' : 'Interaction First'}
                </span>
              </div>

              <div className="space-y-2.5">
                {currentDayExperiences.map((exp) => {
                  const isDone = completedExperiences.includes(exp.experienceId);

                  return (
                    <div
                      key={exp.experienceId}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
                        isDone
                          ? 'border-emerald-300 bg-emerald-50/70'
                          : 'border-[#D4A373]/35 bg-white hover:border-[#88C947]'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2C483F] text-[#D4A373] font-mono">
                            {exp.buildingId.toUpperCase()}
                          </span>
                          {isDone ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>{lang === 'ar' ? 'مكتملة' : 'Completed'}</span>
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                              {lang === 'ar' ? 'متاحة للبدء' : 'Playable'}
                            </span>
                          )}
                        </div>

                        <h5 className="text-xs sm:text-sm font-black text-[#2C483F]">
                          {lang === 'ar' ? exp.title.ar : exp.title.en}
                        </h5>
                        <p className="text-[11px] text-stone-600 leading-relaxed max-w-xl">
                          {lang === 'ar' ? exp.description.ar : exp.description.en}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onStartExperience && onStartExperience(exp)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 ${
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
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 1 Daily Task Column (4 cols) */}
            <div className="lg:col-span-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#2C483F] flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-[#D4A373]" />
                  <span>
                    {lang === 'ar' ? `مهمة اليوم ${activeDay} الواقعية:` : `Day ${activeDay} Daily Task:`}
                  </span>
                </span>
                <span className="text-[10px] font-mono text-stone-500">
                  {lang === 'ar' ? 'تطبيق حياتي' : 'Real-Life Action'}
                </span>
              </div>

              {currentDayTask ? (
                <div
                  className={`p-4 rounded-2xl border transition-all space-y-3 flex flex-col justify-between h-[calc(100%-28px)] ${
                    completedTasks.includes(currentDayTask.taskId)
                      ? 'border-emerald-300 bg-emerald-50/70'
                      : 'border-[#D4A373]/35 bg-white'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {completedTasks.includes(currentDayTask.taskId)
                          ? lang === 'ar'
                            ? '✓ تم إنجاز المهمة'
                            : '✓ Task Finished'
                          : lang === 'ar'
                          ? 'مهمة عملية'
                          : 'Action Step'}
                      </span>
                    </div>

                    <h5 className="text-xs sm:text-sm font-black text-[#2C483F]">
                      {lang === 'ar' ? currentDayTask.title.ar : currentDayTask.title.en}
                    </h5>

                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      {lang === 'ar' ? currentDayTask.description.ar : currentDayTask.description.en}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={!isCurrentDayUnlocked}
                    onClick={() => {
                      playSoftTap();
                      if (isCurrentDayUnlocked && onOpenTaskModal && currentDayTask) {
                        onOpenTaskModal(currentDayTask);
                      }
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      !isCurrentDayUnlocked
                        ? 'bg-stone-200 text-stone-500 cursor-not-allowed border border-stone-300'
                        : completedTasks.includes(currentDayTask.taskId)
                        ? 'bg-white border border-emerald-400 text-emerald-800 hover:bg-emerald-50'
                        : 'bg-[#2C483F] hover:bg-[#1e342d] text-white shadow-soft hover:scale-[1.02] active:scale-95'
                    }`}
                  >
                    {!isCurrentDayUnlocked ? (
                      <>
                        <Lock className="w-3.5 h-3.5 text-stone-500" />
                        <span>{lang === 'ar' ? 'المهمة مقفلة (أكمل اليوم السابق)' : 'Task Locked (Complete Previous Day)'}</span>
                      </>
                    ) : (
                      <>
                        <CheckSquare className="w-3.5 h-3.5 text-[#88C947]" />
                        <span>
                          {completedTasks.includes(currentDayTask.taskId)
                            ? lang === 'ar'
                              ? 'مراجعة المهمة'
                              : 'Review Task'
                            : lang === 'ar'
                            ? 'الانتقال إلى المهمة'
                            : 'Go to Task'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Days 8–30 Completely Locked State (Requirement 7) */}
      {activeTab === 'advanced' && (
        <div className="p-8 rounded-3xl border-2 border-dashed border-amber-300 bg-amber-50/70 text-center space-y-4 animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center mx-auto text-2xl shadow-xs">
            <Lock className="w-7 h-7 text-amber-900" />
          </div>

          <div className="space-y-1.5 max-w-lg mx-auto">
            <h3 className="text-base sm:text-lg font-black text-amber-950">
              {lang === 'ar'
                ? 'مرحلة متقدمة — تفتح في التحديث القادم بعد إتمام الأسبوع التأسيسي'
                : 'Advanced Stage — Unlocks in the upcoming update after completing the foundational week'}
            </h3>
            <p className="text-xs text-amber-800/90 leading-relaxed">
              {lang === 'ar'
                ? 'الأيام من 8 إلى 30 مقفلة بالكامل وغير متاحة للتصفح حالياً حتى يتم استكمال المحتوى التأسيسي للأيام 1 إلى 7.'
                : 'Days 8 through 30 are completely locked and cannot be navigated until the foundational content is finalized.'}
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() => {
                playSoftTap();
                setActiveTab('foundational');
                onSelectDay(1);
              }}
              className="px-4 py-2 rounded-xl bg-[#2C483F] hover:bg-[#1e342d] text-white text-xs font-bold transition-all shadow-soft"
            >
              {lang === 'ar' ? 'العودة إلى الأسبوع التأسيسي (الأيام 1-7)' : 'Return to Foundational Week (Days 1-7)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
