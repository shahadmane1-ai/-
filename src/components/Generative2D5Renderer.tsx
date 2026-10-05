import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  DoorOpen,
  DoorClosed,
  Smartphone,
  Backpack,
  Award,
  Layers,
  ChevronDown,
  ChevronUp,
  Volume2,
  ExternalLink,
} from 'lucide-react';
import { Language, SceneObject, Structured2D5Experience } from '../types';
import { playPeaceChime, playSoftTap } from '../utils/audio';
import { AnasAvatar } from './AnasAvatar';
import { TRUSTED_KNOWLEDGE_BASE } from '../services/knowledgeBase';
import { validateExperienceGrounding } from '../services/experienceGenerator';

interface Generative2D5RendererProps {
  experience: Structured2D5Experience;
  lang: Language;
  onFinish: () => void;
}

export const Generative2D5Renderer: React.FC<Generative2D5RendererProps> = ({
  experience,
  lang,
  onFinish,
}) => {
  // Scene interactive state
  const [objectsState, setObjectsState] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const obj of experience.scene.objects) {
      map[obj.id] = obj.currentState;
    }
    return map;
  });

  const [completedInteractions, setCompletedInteractions] = useState<string[]>([]);
  const [activeNarration, setActiveNarration] = useState<string>(
    lang === 'ar' ? experience.objectiveAr : experience.objectiveEn
  );
  const [activeLearningMomentId, setActiveLearningMomentId] = useState<string | null>(null);
  const [showSourcesPanel, setShowSourcesPanel] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Validate grounding of learning statements
  const validationReport = validateExperienceGrounding(experience);

  // Get full source chunks for grounded citations panel
  const groundedSources = TRUSTED_KNOWLEDGE_BASE.filter((c) =>
    experience.groundedSourceIds.includes(c.id)
  );

  const handleObjectClick = (obj: SceneObject) => {
    if (!obj.interactive) return;

    playSoftTap();
    const currentState = objectsState[obj.id] || obj.currentState;

    // Find available interaction
    const matchingInteraction = experience.interactions.find(
      (int) => int.targetObjectId === obj.id && int.fromState === currentState
    );

    if (matchingInteraction) {
      // Transition state
      setObjectsState((prev) => ({
        ...prev,
        [obj.id]: matchingInteraction.toState,
      }));

      setActiveNarration(
        lang === 'ar' ? matchingInteraction.narrationAr : matchingInteraction.narrationEn
      );

      if (matchingInteraction.learningMomentId) {
        setActiveLearningMomentId(matchingInteraction.learningMomentId);
      }

      setCompletedInteractions((prev) => {
        if (!prev.includes(matchingInteraction.interactionId)) {
          const next = [...prev, matchingInteraction.interactionId];
          // Check completion condition
          const allRequiredMet = experience.completionCondition.requiredInteractionIds.every((id) =>
            next.includes(id)
          );
          if (allRequiredMet) {
            setIsCompleted(true);
            playPeaceChime();
          }
          return next;
        }
        return prev;
      });
    }
  };

  // Helper to render icon for primitive
  const renderPrimitiveVisual = (obj: SceneObject, stateId: string) => {
    switch (obj.type) {
      case 'door':
        return stateId === 'open' ? (
          <DoorOpen className="w-12 h-16 text-[#88C947] transition-all transform scale-110" />
        ) : (
          <DoorClosed className="w-12 h-16 text-[#D4A373] hover:text-[#88C947] transition-colors" />
        );
      case 'prayer_mat':
        return (
          <div
            className={`w-16 h-24 rounded-lg border-2 flex items-center justify-center transition-all ${
              stateId === 'placed'
                ? 'bg-gradient-to-b from-[#2C483F] to-[#1e332c] border-[#D4A373] shadow-gold transform scale-105'
                : 'bg-stone-300 border-dashed border-stone-400 opacity-60'
            }`}
          >
            <span className="text-xl">🕌</span>
          </div>
        );
      case 'phone':
        return (
          <div
            className={`w-8 h-12 rounded-lg border flex items-center justify-center transition-all ${
              stateId === 'silent_qiblah'
                ? 'bg-[#2C483F] border-[#88C947] text-white shadow-soft'
                : 'bg-stone-200 border-stone-300 text-stone-600 animate-pulse'
            }`}
          >
            <Smartphone className="w-4 h-4 text-[#88C947]" />
          </div>
        );
      case 'backpack':
        return (
          <div className="w-12 h-14 rounded-2xl bg-amber-900/80 border border-[#D4A373] flex items-center justify-center text-white shadow-md">
            <Backpack className="w-6 h-6 text-[#D4A373]" />
          </div>
        );
      case 'desk':
        return (
          <div className="w-32 h-16 rounded-xl bg-amber-100 border-2 border-[#D4A373]/60 shadow-md flex items-center justify-center text-xs font-bold text-[#2C483F]/70">
            <span>{obj.nameAr}</span>
          </div>
        );
      case 'plate':
        return (
          <div className="w-14 h-14 rounded-full bg-white border-2 border-stone-300 shadow-md flex items-center justify-center text-2xl">
            ☕
          </div>
        );
      default:
        return (
          <div className="w-14 h-14 rounded-xl bg-stone-100 border border-stone-300 flex items-center justify-center text-xs font-bold">
            {obj.nameAr}
          </div>
        );
    }
  };

  const activeLearningMoment = experience.learningMoments.find(
    (lm) => lm.id === activeLearningMomentId
  );

  return (
    <div className="w-full bg-[#FBF9F5] rounded-3xl border border-[#D4A373]/40 shadow-soft-lg p-4 sm:p-6 text-start select-none space-y-4">
      {/* 2.5D Canvas Area */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] rounded-2xl bg-gradient-to-b from-[#EFE9DF] via-[#F4EFE6] to-[#E5DDD0] border-2 border-[#D4A373]/50 shadow-inner overflow-hidden flex items-center justify-center">
        {/* Isometric Grid Floor pattern */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(30deg, #2C483F 12%, transparent 12.5%, transparent 87%, #2C483F 87.5%, #2C483F), linear-gradient(150deg, #2C483F 12%, transparent 12.5%, transparent 87%, #2C483F 87.5%, #2C483F), linear-gradient(30deg, #2C483F 12%, transparent 12.5%, transparent 87%, #2C483F 87.5%, #2C483F), linear-gradient(150deg, #2C483F 12%, transparent 12.5%, transparent 87%, #2C483F 87.5%, #2C483F), linear-gradient(60deg, #2C483F77 25%, transparent 25.5%, transparent 75%, #2C483F77 75%, #2C483F77), linear-gradient(60deg, #2C483F77 25%, transparent 25.5%, transparent 75%, #2C483F77 75%, #2C483F77)',
            backgroundSize: '40px 70px',
          }}
        />

        {/* Ambient Room Header Tag */}
        <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-white/90 backdrop-blur-md border border-[#D4A373]/40 text-[10px] font-black text-[#2C483F] flex items-center gap-1.5 shadow-xs z-20">
          <Layers className="w-3.5 h-3.5 text-[#88C947]" />
          <span>
            {lang === 'ar' ? 'بيئة تفاعلية مؤصلة 2.5D' : '2.5D Grounded Environment'}
          </span>
        </div>

        {/* Placed Scene Objects */}
        {experience.scene.objects.map((obj) => {
          const currentState = objectsState[obj.id] || obj.currentState;
          return (
            <div
              key={obj.id}
              onClick={() => handleObjectClick(obj)}
              style={{
                left: `${obj.position.x}%`,
                top: `${obj.position.y}%`,
                zIndex: obj.layer * 10,
              }}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 ${
                obj.interactive
                  ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform'
                  : 'pointer-events-none'
              }`}
            >
              {renderPrimitiveVisual(obj, currentState)}

              {/* Action Tooltip / State Badge */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/95 text-[#2C483F] border border-[#D4A373]/40 shadow-xs whitespace-nowrap">
                  {lang === 'ar' ? obj.nameAr : obj.nameEn}
                </span>
                {obj.interactive && currentState !== 'placed' && currentState !== 'open' && (
                  <span className="text-[9px] text-emerald-800 font-bold bg-[#88C947]/30 px-1.5 rounded-md mt-0.5 animate-pulse">
                    {lang === 'ar' ? 'انقري للتفاعل' : 'Tap to interact'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Narration & Active Learning Statement */}
      <div className="p-4 rounded-2xl bg-white border border-[#D4A373]/30 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <AnasAvatar size="sm" lang={lang} />
          <div>
            <span className="text-xs font-bold text-[#2C483F] block">
              {lang === 'ar' ? 'توجيه رفيق التفاعلي:' : 'Rafiq Interactive Guidance:'}
            </span>
            <p className="text-xs text-stone-700 leading-relaxed font-medium">
              {activeNarration}
            </p>
          </div>
        </div>

        {/* Active Learning Moment Grounding Note */}
        {activeLearningMoment && (
          <div className="mt-2 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-1 animate-fade-in">
            <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>{lang === 'ar' ? 'وقفة علمية مؤصلة:' : 'Grounded Learning Moment:'}</span>
            </div>
            <p className="text-[11px] text-emerald-950 italic">
              «
              {lang === 'ar'
                ? activeLearningMoment.learningStatementAr
                : activeLearningMoment.learningStatementEn}
              »
            </p>
            {activeLearningMoment.scholarlyNoteAr && (
              <span className="text-[10px] text-stone-500 font-mono block">
                {lang === 'ar'
                  ? activeLearningMoment.scholarlyNoteAr
                  : activeLearningMoment.scholarlyNoteEn}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Expandable Approved Sources Panel (Requirement 14) */}
      <div className="rounded-2xl border border-[#D4A373]/30 bg-white/90 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowSourcesPanel(!showSourcesPanel)}
          className="w-full p-3 flex items-center justify-between text-xs font-bold text-[#2C483F] hover:bg-stone-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#88C947]" />
            <span>
              {lang === 'ar'
                ? `المصادر المعتمدة المستخدمة في هذه التجربة (${groundedSources.length})`
                : `Approved Sources Grounding This Experience (${groundedSources.length})`}
            </span>
          </div>
          {showSourcesPanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showSourcesPanel && (
          <div className="p-3 pt-0 border-t border-stone-100 space-y-2 text-xs animate-fade-in">
            {groundedSources.map((source, sIdx) => (
              <div
                key={source.id || sIdx}
                className="p-2.5 rounded-xl bg-[#FBF9F5] border border-stone-200/80 space-y-1"
              >
                <div className="flex items-center justify-between gap-1 text-[11px]">
                  <span className="font-black text-[#2C483F]">{source.sourceName}</span>
                  <a
                    href={source.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <span>{source.sourceUrl}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <h5 className="text-[11px] font-bold text-stone-800">{source.title}</h5>
                <p className="text-[10px] text-stone-600 font-mono bg-white p-1.5 rounded-lg border border-stone-200/60 leading-relaxed">
                  {source.text}
                </p>
                <div className="flex items-center gap-2 text-[9px] text-stone-500">
                  <span>التصنيف: {source.sourceType}</span>
                  <span>•</span>
                  <span>درجة الصحة: {source.authenticityLevel || 'موثق'}</span>
                </div>
              </div>
            ))}

            <div className="p-2 rounded-lg bg-emerald-50 text-[10px] text-emerald-900 font-mono">
              {validationReport.statusMessageAr}
            </div>
          </div>
        )}
      </div>

      {/* Completion Modal / Action Bar */}
      {isCompleted ? (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-amber-50 border-2 border-emerald-300 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <h4 className="text-sm font-black text-emerald-950">
                {lang === 'ar' ? 'اكتملت التجربة بنجاح!' : 'Experience Completed!'}
              </h4>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
              +15 {lang === 'ar' ? 'سكينة' : 'Serenity'}
            </span>
          </div>

          <p className="text-xs text-stone-700 leading-relaxed">
            {lang === 'ar' ? experience.reflection.textAr : experience.reflection.textEn}
          </p>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={onFinish}
              className="px-5 py-2 rounded-xl bg-[#2C483F] hover:bg-[#1f342e] text-white text-xs font-bold transition-all shadow-soft flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4 text-[#88C947]" />
              <span>{lang === 'ar' ? 'حفظ الأثر والعودة للمدينة' : 'Save & Return to City'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
          <span>
            {lang === 'ar'
              ? `الخطوات المكتملة: (${completedInteractions.length}/${experience.completionCondition.requiredInteractionIds.length})`
              : `Steps completed: (${completedInteractions.length}/${experience.completionCondition.requiredInteractionIds.length})`}
          </span>
          <span className="text-[10px] font-mono text-[#D4A373]">
            {lang === 'ar' ? 'تفاعل حر وآمن' : 'Safe Interactive Scene'}
          </span>
        </div>
      )}
    </div>
  );
};
