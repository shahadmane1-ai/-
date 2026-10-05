import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
  ChevronDown,
  ChevronUp,
  Volume2,
  Wind,
  Smile,
  ShieldCheck,
  Flame,
  MessageCircle,
  CheckSquare,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { AnasEmotion, DailyTask, Language, QuickReplyChip, UserProfile } from '../types';
import { getAnasSalutation } from '../utils/i18n';
import { playPeaceChime, playSoftTap, playStressReleaseTone } from '../utils/audio';
import { AnasIcon } from './AnasAvatar';
import { generateAdaptiveRecommendations } from '../services/recommendationEngine';

export interface ProactiveCompanionHUDProps {
  currentEmotion: AnasEmotion;
  proactiveSpeechAr: string;
  proactiveSpeechEn: string;
  lang: Language;
  onAdjustScore: (delta: number, label: string, type: 'peace' | 'stress') => void;
  onQuickReplyChosen?: (chipId: string) => void;
  userProfile?: UserProfile;
  activeDayNumber?: number;
  dailyTasks?: DailyTask[];
  completedTaskIds?: string[];
  onToggleTask?: (taskId: string) => void;
  onOpenTaskModal?: (task: DailyTask) => void;
  onOpenExperience?: (experienceId: string) => void;
  completedDays?: number[];
  tranquilityScore?: number;
  // Backward compatibility
  dailyQuests?: any[];
  completedQuestIds?: string[];
  onToggleQuest?: (id: string, item: any) => void;
}

export const ProactiveCompanionHUD: React.FC<ProactiveCompanionHUDProps> = ({
  currentEmotion,
  proactiveSpeechAr,
  proactiveSpeechEn,
  lang,
  onAdjustScore,
  onQuickReplyChosen,
  userProfile,
  activeDayNumber = 1,
  dailyTasks = [],
  completedTaskIds = [],
  onToggleTask,
  onOpenTaskModal,
  onOpenExperience,
  completedDays = [1],
  tranquilityScore = 65,
  dailyQuests = [],
  completedQuestIds = [],
  onToggleQuest,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeSpeechAr, setActiveSpeechAr] = useState(proactiveSpeechAr);
  const [activeSpeechEn, setActiveSpeechEn] = useState(proactiveSpeechEn);
  const [localEmotion, setLocalEmotion] = useState<AnasEmotion>(currentEmotion);
  const [selectedChipId, setSelectedChipId] = useState<string | null>(null);

  // Tab mode in HUD: 'whisper' | 'quests' | 'recommendations'
  const [activeTab, setActiveTab] = useState<'whisper' | 'quests' | 'recommendations'>('whisper');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Effective tasks list (both empty in reset)
  const tasksList = dailyTasks.length > 0 ? dailyTasks : (dailyQuests as DailyTask[]);
  const effectiveCompletedIds = completedTaskIds.length > 0 ? completedTaskIds : completedQuestIds;

  // Adaptive recommendations generated dynamically
  const recommendations = generateAdaptiveRecommendations(
    activeDayNumber,
    completedDays,
    effectiveCompletedIds,
    tranquilityScore,
    tasksList,
    lang
  );

  // Sync when parent changes proactive speech
  useEffect(() => {
    setActiveSpeechAr(proactiveSpeechAr);
    setActiveSpeechEn(proactiveSpeechEn);
    setLocalEmotion(currentEmotion);
    setSelectedChipId(null);
  }, [proactiveSpeechAr, proactiveSpeechEn, currentEmotion]);

  const salutation = userProfile ? getAnasSalutation(userProfile, lang) : '';

  const quickReplyChips: QuickReplyChip[] = [
    {
      id: 'felt_calm',
      labelAr: 'شعرت بسكينة الآن',
      labelEn: 'I feel calm now',
      responseAr: 'الحمد لله الذي ملأ قلبك بالسكينة والرضا.. استشعر هذا الهدوء وتابع يومك بقلب مطمئن!',
      responseEn: 'Praise be to Allah Who filled your heart with serenity.. embrace this calmness!',
      peaceDelta: 5,
      emotion: 'smiling',
    },
    {
      id: 'need_support',
      labelAr: 'أحتاج تذكيراً بالصبر',
      labelEn: 'Need a reminder for patience',
      responseAr: 'خطوة بخطوة يا صاحبي.. "إن مع العسر يسراً"، لم يكلفنا الله فوق طاقتنا وديننا يسر لا مشقة فيه.',
      responseEn: 'Step by step, dear companion.. Verily with hardship comes ease; our faith is ease, not hardship.',
      peaceDelta: 4,
      emotion: 'holding_lantern',
    },
    {
      id: 'ready_journey',
      labelAr: 'مستعد لاستكشاف المدينة',
      labelEn: 'Ready to explore the city',
      responseAr: 'رائع جداً! انقر على معالم المدينة أو اختر يوماً من الأسبوع التأسيسي لاستكشاف السياق.',
      responseEn: 'Splendid! Click city landmarks or choose any day from the Foundational Week to explore.',
      peaceDelta: 5,
      emotion: 'waving',
    },
  ];

  const handleChipClick = (chip: QuickReplyChip) => {
    playPeaceChime();
    setSelectedChipId(chip.id);
    setActiveSpeechAr(chip.responseAr);
    setActiveSpeechEn(chip.responseEn);
    setLocalEmotion(chip.emotion);

    if (chip.peaceDelta) {
      onAdjustScore(
        chip.peaceDelta,
        lang === 'ar' ? `+${chip.peaceDelta} سكينة الحوار مع رفيق` : `+${chip.peaceDelta} Serenity with Rafiq`,
        'peace'
      );
    }

    if (onQuickReplyChosen) {
      onQuickReplyChosen(chip.id);
    }
  };

  const handleTaskCheck = (task: DailyTask) => {
    playSoftTap();
    if (onToggleTask) {
      onToggleTask(task.taskId);
    } else if (onToggleQuest) {
      onToggleQuest(task.taskId, task);
    }
  };

  return (
    <aside
      aria-label={lang === 'ar' ? 'رفيق السكينة رفيق' : 'Rafiq Companion HUD'}
      className={`fixed z-40 transition-all duration-500 ease-in-out select-none ${
        lang === 'ar' ? 'bottom-5 right-4 sm:right-6' : 'bottom-5 left-4 sm:left-6'
      }`}
    >
      <div className="relative flex flex-col items-end">
        {/* Proactive Speech Bubble & Task Tracker (if not minimized) */}
        {!isMinimized && (
          <div
            className={`mb-3 w-80 sm:w-[410px] transition-all duration-300 transform origin-bottom-${
              lang === 'ar' ? 'right' : 'left'
            } animate-fade-in`}
          >
            <div className="relative bg-white/95 backdrop-blur-md rounded-3xl border border-[#D4A373]/40 p-4 shadow-soft-lg text-start max-h-[85vh] overflow-y-auto">
              {/* Triangular arrow anchor pointing towards Anas */}
              <div
                className={`absolute -bottom-2 w-4 h-4 bg-white border-b border-r border-[#D4A373]/40 transform rotate-45 ${
                  lang === 'ar' ? 'right-10' : 'left-10'
                }`}
              />

              {/* Top Tab Bar: Anas Whispers vs Daily Tasks */}
              <div className="flex items-center justify-between pb-2.5 border-b border-[#D4A373]/20 gap-2">
                <div className="flex items-center p-0.5 bg-[#FBF9F5] rounded-xl border border-[#D4A373]/30 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      playSoftTap();
                      setActiveTab('whisper');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-black transition-all ${
                      activeTab === 'whisper'
                        ? 'bg-[#2C483F] text-white shadow-xs'
                        : 'text-[#2C483F]/70 hover:text-[#2C483F]'
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#D4A373]" />
                    <span>{lang === 'ar' ? 'همسة رفيق' : 'Whisper'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playSoftTap();
                      setActiveTab('quests');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-black transition-all ${
                      activeTab === 'quests'
                        ? 'bg-[#2C483F] text-white shadow-xs'
                        : 'text-[#2C483F]/70 hover:text-[#2C483F]'
                    }`}
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-[#88C947]" />
                    <span>{lang === 'ar' ? 'المهام' : 'Tasks'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playSoftTap();
                      setActiveTab('recommendations');
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-black transition-all ${
                      activeTab === 'recommendations'
                        ? 'bg-[#2C483F] text-white shadow-xs'
                        : 'text-[#2C483F]/70 hover:text-[#2C483F]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
                    <span>{lang === 'ar' ? 'التوجيه' : 'Advice'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsMinimized(true)}
                    className="text-[#2C483F]/50 hover:text-[#2C483F] p-1 rounded-lg hover:bg-stone-100 transition-colors"
                    title={lang === 'ar' ? 'تصغير' : 'Minimize'}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* TAB 1: ANAS PROACTIVE EMOTIONAL WHISPER */}
              {activeTab === 'whisper' && (
                <div className="py-2.5 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#2C483F] flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#88C947] animate-ping" />
                      <span>{lang === 'ar' ? 'رفيق يهمس لك الآن:' : 'Rafiq whispers:'}</span>
                    </span>

                    <span className="text-[10px] font-mono text-[#D4A373] bg-[#2C483F] px-2 py-0.5 rounded-full font-bold">
                      {localEmotion === 'smiling' && (lang === 'ar' ? 'بابتسامة مطمئنة' : 'Warm smile')}
                      {localEmotion === 'holding_lantern' && (lang === 'ar' ? 'حاملاً قنديل الهدى' : 'Guiding lantern')}
                      {localEmotion === 'waving' && (lang === 'ar' ? 'مرحّباً بك' : 'Friendly wave')}
                      {localEmotion === 'nodding' && (lang === 'ar' ? 'مؤيّداً برفق' : 'Gentle nod')}
                    </span>
                  </div>

                  {/* Anas Speech Bubble */}
                  <div className="p-3.5 bg-gradient-to-br from-[#FBF9F5] to-[#F5EFE6] border border-[#D4A373]/30 rounded-2xl relative shadow-xs">
                    {salutation && (
                      <p className="text-xs font-bold text-[#88C947] mb-1">
                        {salutation}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-[#2C483F] font-medium leading-relaxed">
                      {lang === 'ar' ? activeSpeechAr : activeSpeechEn}
                    </p>
                  </div>

                  {/* Interactive Quick Reply Chips */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] text-stone-500 font-bold block">
                      {lang === 'ar' ? 'شارك رفيق خاطرك:' : 'Share your thought with Rafiq:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {quickReplyChips.map((chip) => {
                        const isSelected = selectedChipId === chip.id;
                        return (
                          <button
                            key={chip.id}
                            type="button"
                            onClick={() => handleChipClick(chip)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all text-start flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-[#2C483F] text-white shadow-soft scale-105'
                                : 'bg-[#FBF9F5] border border-[#D4A373]/35 text-[#2C483F] hover:bg-white hover:border-[#88C947]'
                            }`}
                          >
                            <Sparkles className="w-3 h-3 text-[#D4A373]" />
                            <span>{lang === 'ar' ? chip.labelAr : chip.labelEn}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DAILY TASKS (EMPTY ARCHITECTURE) */}
              {activeTab === 'quests' && (
                <div className="py-2.5 space-y-3 animate-fade-in">
                  {tasksList.length === 0 ? (
                    <div className="p-5 rounded-2xl border-2 border-dashed border-[#D4A373]/40 bg-[#FBF9F5] text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-sm">
                        <CheckSquare className="w-5 h-5 text-emerald-800" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-black text-[#2C483F]">
                        {lang === 'ar' ? 'المهام قيد الإعداد' : 'Tasks Under Development'}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        {lang === 'ar'
                          ? `مهام اليوم ${activeDayNumber} ستُضاف وفق الهيكل الجديد لاحقاً.`
                          : `Daily tasks for Day ${activeDayNumber} will be integrated under the new architecture.`}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {tasksList.map((task) => {
                        const isCompleted = effectiveCompletedIds.includes(task.taskId);
                        const isExpanded = expandedTaskId === task.taskId;

                        return (
                          <div
                            key={task.taskId}
                            className={`p-2.5 rounded-2xl border transition-all text-start ${
                              isCompleted
                                ? 'bg-emerald-50/70 border-emerald-300'
                                : 'bg-[#FBF9F5] border-[#D4A373]/25 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <button
                                type="button"
                                onClick={() => handleTaskCheck(task)}
                                className={`mt-0.5 w-6 h-6 rounded-xl flex items-center justify-center shrink-0 transition-transform active:scale-90 ${
                                  isCompleted
                                    ? 'bg-[#2C483F] text-[#88C947]'
                                    : 'bg-white border-2 border-stone-300 text-transparent hover:border-[#2C483F]'
                                }`}
                              >
                                <CheckCircle2 className="w-4 h-4 fill-current" />
                              </button>

                              <div className="grow min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <h5
                                    className={`text-xs font-black cursor-pointer ${
                                      isCompleted ? 'line-through text-stone-500' : 'text-[#2C483F]'
                                    }`}
                                    onClick={() => setExpandedTaskId(isExpanded ? null : task.taskId)}
                                  >
                                    {lang === 'ar' ? task.title.ar : task.title.en}
                                  </h5>
                                  {onOpenTaskModal && (
                                    <button
                                      type="button"
                                      onClick={() => onOpenTaskModal(task)}
                                      className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#2C483F]/10 hover:bg-[#2C483F] text-[#2C483F] hover:text-white transition-all shrink-0"
                                    >
                                      {lang === 'ar' ? 'فتح' : 'Open'}
                                    </button>
                                  )}
                                </div>
                                <p className="text-[11px] text-stone-600 mt-0.5">
                                  {lang === 'ar' ? task.description.ar : task.description.en}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: ADAPTIVE RECOMMENDATIONS LAYER */}
              {activeTab === 'recommendations' && (
                <div className="py-2.5 space-y-2.5 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#2C483F] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
                      <span>{lang === 'ar' ? 'توجيهات رفيق التكيفية اليوم:' : 'Adaptive Suggestions:'}</span>
                    </span>
                    <span className="text-[10px] font-mono text-stone-500">
                      {lang === 'ar' ? `اليوم ${activeDayNumber}` : `Day ${activeDayNumber}`}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {recommendations.map((rec, rIdx) => (
                      <div
                        key={rIdx}
                        className={`p-3 rounded-2xl border transition-all text-start space-y-1.5 ${
                          rec.priority === 'high'
                            ? 'bg-amber-50/80 border-amber-300'
                            : 'bg-[#FBF9F5] border-[#D4A373]/30'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-stone-200 text-[#2C483F]">
                            {lang === 'ar' ? rec.badgeAr : rec.badgeEn}
                          </span>
                        </div>

                        <h5 className="text-xs font-black text-[#2C483F]">
                          {lang === 'ar' ? rec.titleAr : rec.titleEn}
                        </h5>

                        <p className="text-[11px] text-stone-600 leading-relaxed">
                          {lang === 'ar' ? rec.detailAr : rec.detailEn}
                        </p>

                        {rec.actionLabelAr && (
                          <div className="pt-1 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                playSoftTap();
                                if (rec.actionType === 'open_experience' && onOpenExperience && rec.targetExperienceId) {
                                  onOpenExperience(rec.targetExperienceId);
                                } else if (rec.actionType === 'open_task' && onOpenTaskModal && rec.targetTaskId) {
                                  const targetTask = tasksList.find((t) => t.taskId === rec.targetTaskId);
                                  if (targetTask) {
                                    onOpenTaskModal(targetTask);
                                  }
                                } else {
                                  setActiveTab('whisper');
                                }
                              }}
                              className="px-3 py-1 rounded-xl bg-[#2C483F] hover:bg-[#1f352e] text-white text-[10px] font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                            >
                              <span>{lang === 'ar' ? rec.actionLabelAr : rec.actionLabelEn}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Floating Avatar Trigger (Anas Character Icon) */}
        <div className="relative group">
          <button
            type="button"
            onClick={() => {
              playSoftTap();
              setIsMinimized(!isMinimized);
            }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#2C483F] via-[#213730] to-[#162721] p-0.5 shadow-soft-lg hover:shadow-gold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center relative border-2 border-[#D4A373] cursor-pointer"
            aria-label={lang === 'ar' ? 'التحدث مع رفيق' : 'Talk with Rafiq'}
          >
            {/* Ambient Pulse Ring */}
            <span className="absolute -inset-1 rounded-full bg-[#88C947]/30 blur-sm animate-pulse -z-10" />

            {/* Anas Face Icon */}
            <div className="w-full h-full rounded-full bg-[#2C483F] flex items-center justify-center overflow-hidden">
              <AnasIcon size="100%" emotion={localEmotion} />
            </div>

            {/* Active Companion Status Badge */}
            <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#88C947] border-2 border-white flex items-center justify-center shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2C483F]" />
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};
