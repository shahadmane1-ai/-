import React, { useState } from 'react';
import { Sparkles, Heart, BookOpen, ExternalLink, RotateCcw } from 'lucide-react';
import { Experience, Language } from '../../types';
import { playPeaceChime, playSoftTap } from '../../utils/audio';
import { recordScenarioAttempt } from '../../services/learningStateManager';
import { getScenarioById } from '../../services/scenarioVault';

interface DispatcherProps {
  experience: Experience;
  lang: Language;
  onFinish: () => void;
}

export const GameHonoringParents: React.FC<DispatcherProps> = ({ experience, lang, onFinish }) => {
  const [performedDeeds, setPerformedDeeds] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const scn44 = getScenarioById('SCN_044');

  const deeds = [
    {
      id: 'tea',
      icon: '🍵',
      labelAr: 'إعداد كوب شاي دافئ بالنعناع للوالدة',
      labelEn: 'Brew mint tea for mother',
      posX: '20%',
      posY: '65%',
      target: 'mother',
    },
    {
      id: 'glasses',
      icon: '👓',
      labelAr: 'إحضار نظارة القراءة للوالد',
      labelEn: 'Bring reading glasses to father',
      posX: '80%',
      posY: '65%',
      target: 'father',
    },
    {
      id: 'tidy',
      icon: '🧹',
      labelAr: 'ترتيب طاولة المعيشة بهدوء',
      labelEn: 'Tidy the living room table quietly',
      posX: '50%',
      posY: '75%',
      target: 'room',
    },
    {
      id: 'footrest',
      icon: '🛋️',
      labelAr: 'تقريب مسند القدم المريح لأمي',
      labelEn: 'Adjust footrest for mother',
      posX: '32%',
      posY: '70%',
      target: 'mother',
    },
  ];

  const handlePerformDeed = (id: string) => {
    playSoftTap();
    if (!performedDeeds.includes(id)) {
      const next = [...performedDeeds, id];
      setPerformedDeeds(next);
      if (next.length >= 2 && !isCompleted) {
        playPeaceChime();
        setIsCompleted(true);

        // Record deterministic learning progression for bound production scenario
        recordScenarioAttempt(
          'SCN_044',
          true,
          ['وجوب البر والمصاحبة بالمعروف', 'إدخال السرور على الوالدين بالمبادرات العفوية'],
          'social'
        );

        onFinish();
      }
    }
  };

  const handleResetDeeds = () => {
    playSoftTap();
    setPerformedDeeds([]);
    setIsCompleted(false);
  };

  return (
    <div className="space-y-4">
      {/* 2D Interactive Family Evening Canvas */}
      <div className="relative w-full h-84 sm:h-96 rounded-3xl overflow-hidden border-2 border-[#D4A373]/40 bg-gradient-to-b from-[#FBF8F2] via-[#EFE7D8] to-[#DFD0BA] shadow-2xl p-4 flex flex-col justify-between select-none">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-[#D4A373]/30">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <div className="text-start">
              <span className="text-xs font-black text-[#2C483F] block">
                {lang === 'ar' ? 'أمسية أسرية في البيت: بر الوالدين بالعناية العفوية' : 'Family Evening: Honoring Parents'}
              </span>
              <span className="text-[9px] text-stone-500 font-mono">
                {lang === 'ar' ? 'اختر تفاصيل صغيرة في الصالة تسعد قلبيهما' : 'Choose small gestures in the room to bring them joy'}
              </span>
            </div>
          </div>

          <div className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold">
            {performedDeeds.length}/2 {lang === 'ar' ? 'مبادرات مكتملة' : 'completed'}
          </div>
        </div>

        {/* Central Room Scene with Parents & Objects */}
        <div className="relative flex-1 rounded-2xl bg-gradient-to-b from-[#FAF4E8] to-[#E5D7C2] border border-[#D4A373]/40 p-3 my-1 overflow-hidden flex items-center justify-around">
          
          {/* Mother on Armchair */}
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-24 rounded-2xl bg-[#C7826B] border-2 border-[#9E5D48] shadow-md flex flex-col items-center justify-between p-1.5">
              <div className="w-8 h-8 rounded-full bg-[#E8D0BA] border border-[#9E5D48] flex items-center justify-center text-xs">
                🧕
              </div>
              <span className="text-[8px] font-bold text-white">
                {lang === 'ar' ? 'الوالدة تقرأ' : 'Mother'}
              </span>
              {performedDeeds.some((d) => d === 'tea' || d === 'footrest') && (
                <span className="absolute -top-2 text-xs text-rose-500 animate-bounce">❤️</span>
              )}
            </div>
            <span className="text-[8px] text-stone-500 mt-1 font-mono">
              {performedDeeds.includes('tea') ? (lang === 'ar' ? 'تشرب الشاي' : 'Drinking Tea') : ''}
            </span>
          </div>

          {/* Center Table (Tidy Object) */}
          <div className="flex flex-col items-center">
            <div className="w-24 sm:w-28 h-16 rounded-xl bg-[#8B5A2B] border-2 border-[#654321] shadow-md flex flex-col items-center justify-center p-1">
              <span className="text-base">☕ 📚</span>
              <span className="text-[7px] text-amber-100 font-bold mt-0.5">
                {performedDeeds.includes('tidy')
                  ? (lang === 'ar' ? '✓ طاولة مرتبة' : '✓ Table Tidied')
                  : (lang === 'ar' ? 'طاولة الصالة' : 'Living Table')}
              </span>
            </div>
          </div>

          {/* Father at Desk */}
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-24 rounded-2xl bg-[#5C7065] border-2 border-[#3D4F45] shadow-md flex flex-col items-center justify-between p-1.5">
              <div className="w-8 h-8 rounded-full bg-[#DFBC98] border border-[#3D4F45] flex items-center justify-center text-xs">
                👓
              </div>
              <span className="text-[8px] font-bold text-white">
                {lang === 'ar' ? 'الوالد يعمل' : 'Father'}
              </span>
              {performedDeeds.includes('glasses') && (
                <span className="absolute -top-2 text-xs text-rose-500 animate-bounce">❤️</span>
              )}
            </div>
            <span className="text-[8px] text-stone-500 mt-1 font-mono">
              {performedDeeds.includes('glasses') ? (lang === 'ar' ? 'يرتدي النظارة' : 'Wearing Glasses') : ''}
            </span>
          </div>
        </div>

        {/* The 4 Interactive Small Gestures in the Room */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#D4A373]/30">
          {deeds.map((deed) => {
            const isDone = performedDeeds.includes(deed.id);

            return (
              <button
                key={deed.id}
                type="button"
                onClick={() => handlePerformDeed(deed.id)}
                className={`p-2 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-1 ${
                  isDone
                    ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-400'
                    : 'bg-white/90 border-stone-200 hover:border-[#D4A373] hover:scale-105'
                }`}
              >
                <span className="text-xl">{deed.icon}</span>
                <span className="text-[9px] font-bold text-[#2C483F] leading-snug">
                  {lang === 'ar' ? deed.labelAr : deed.labelEn}
                </span>
                <span className="text-[7px] text-stone-500 font-mono">
                  {isDone ? (lang === 'ar' ? '✓ تم البر' : '✓ Done') : (lang === 'ar' ? 'انقر للمبادرة' : 'Tap to perform')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grounded Evidence & Wisdom Drawer (Appears After Interaction) */}
      {isCompleted && (
        <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-50/90 to-stone-50 border border-emerald-300/80 space-y-3 animate-fade-in text-start shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-900 font-black text-xs sm:text-sm">
              <Heart className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'ar' ? 'التأصيل الشرعي لبر الوالدين في تفاصيل الحياة:' : 'Grounded Evidence for Filial Kindness:'}</span>
            </div>

            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
              {lang === 'ar' ? 'سند معتمد' : 'Verified Evidence'}
            </span>
          </div>

          <p className="text-xs text-stone-700 leading-relaxed">
            {lang === 'ar'
              ? 'بر الوالدين ليس مجرد طاعة شكلية، بل يظهر في أرق تفاصيل اليوم؛ ابتسامة، خدمة عفوية، واستماع صادق يسعد قلبيهما ويملأ البيت بركة وسكينة.'
              : 'Kindness to parents is not rigid duty; it blooms in the gentlest moments of the day, bringing divine blessings and quiet joy.'}
          </p>

          {/* Verbatim Authentic Evidence from SCN_044 (Sahih Bukhari - Asma bint Abi Bakr) */}
          {scn44?.approved_sources?.[1] && (
            <div className="p-3 bg-white/80 rounded-xl border border-amber-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                  <span>{scn44.approved_sources[1].reference_title}</span>
                </span>
                {scn44.approved_sources[1].source_page_url && (
                  <a
                    href={scn44.approved_sources[1].source_page_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-emerald-700 hover:text-emerald-900 underline flex items-center gap-0.5 font-bold"
                  >
                    <span>{lang === 'ar' ? 'السند' : 'Source'}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
              <p className="text-xs font-serif text-[#12183F] italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                «{scn44.approved_sources[1].verbatim_evidence_text}»
              </p>
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleResetDeeds}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إعادة المحاكاة' : 'Replay Gestures'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
