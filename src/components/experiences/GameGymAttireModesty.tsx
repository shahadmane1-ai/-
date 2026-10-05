import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Dumbbell, BookOpen, ExternalLink, RotateCcw } from 'lucide-react';
import { Experience, Language } from '../../types';
import { playPeaceChime, playSoftTap } from '../../utils/audio';
import { recordScenarioAttempt } from '../../services/learningStateManager';
import { getScenarioById } from '../../services/scenarioVault';

interface DispatcherProps {
  experience: Experience;
  lang: Language;
  onFinish: () => void;
}

export const GameGymAttireModesty: React.FC<DispatcherProps> = ({ experience, lang, onFinish }) => {
  const [selectedBottom, setSelectedBottom] = useState<'joggers' | 'knee_shorts' | 'ultra_short'>('joggers');
  const [selectedTop, setSelectedTop] = useState<'tee' | 'jacket'>('tee');
  const [lockerOpen, setLockerOpen] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  const scn36 = getScenarioById('SCN_036');

  const handleEquipAndHeadOut = () => {
    playPeaceChime();
    setIsCompleted(true);

    // Record deterministic learning progression for sports modesty & attire
    if (scn36 && scn36.is_active) {
      recordScenarioAttempt(
        'SCN_036',
        true,
        ['ستر العورة في النشاط الرياضي', 'اختيار اللباس الساتر المريح للبدن'],
        'ethics'
      );
    } else {
      recordScenarioAttempt(
        'SCN_032',
        true,
        ['ستر العورة في النشاط الرياضي', 'اختيار اللباس الساتر المريح للبدن'],
        'ethics'
      );
    }

    onFinish();
  };

  const handleResetAttire = () => {
    playSoftTap();
    setSelectedBottom('joggers');
    setSelectedTop('tee');
    setLockerOpen(true);
    setIsCompleted(false);
  };

  return (
    <div className="space-y-4">
      {/* 2D Interactive Gym Locker Room Canvas */}
      <div className="relative w-full h-84 sm:h-96 rounded-3xl overflow-hidden border-2 border-[#D4A373]/40 bg-gradient-to-b from-[#2E3C36] via-[#24312C] to-[#17201C] shadow-2xl p-4 flex flex-col justify-between select-none">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-600/50">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-[#88C947]" />
            <div className="text-start">
              <span className="text-xs font-black text-white block">
                {lang === 'ar' ? 'غرفة تبديل الملابس بالنادي الرياضي' : 'Athletic Gym Locker Room'}
              </span>
              <span className="text-[9px] text-stone-400 font-mono">
                {lang === 'ar' ? 'تنسيق اللباس الرياضي المريح والساتر' : 'Assembling modest & flexible gym wear'}
              </span>
            </div>
          </div>

          <div className="text-[9px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            {lang === 'ar' ? 'حشمة ومرونة رياضية' : 'Modesty & Flexibility'}
          </div>
        </div>

        {/* Central Stage: Locker + Full-Length Mirror Mannequin */}
        <div className="relative flex-1 flex items-center justify-around px-2 sm:px-8 my-1">
          
          {/* Metal Gym Locker (Interactive) */}
          <div className="flex flex-col items-center">
            <div
              onClick={() => {
                playSoftTap();
                setLockerOpen(!lockerOpen);
              }}
              className="relative w-28 sm:w-32 h-52 bg-gradient-to-b from-[#3E4F47] to-[#25322C] rounded-t-xl border-3 border-stone-500 shadow-xl p-2 cursor-pointer flex flex-col justify-between transition-transform hover:scale-102"
              title={lang === 'ar' ? 'انقر لفتح/إغلاق الخزانة' : 'Click to toggle locker'}
            >
              {/* Locker Vent Slits */}
              <div className="flex flex-col gap-1 items-center opacity-60">
                <div className="w-12 h-0.5 bg-black" />
                <div className="w-12 h-0.5 bg-black" />
                <div className="w-12 h-0.5 bg-black" />
              </div>

              {/* Locker Content (Hangers with Clothes) */}
              <div className="flex flex-col items-center gap-1.5 my-auto">
                <span className="text-xl">👕</span>
                <span className="text-xl">👖</span>
                <span className="text-[8px] text-stone-300 font-mono font-bold">
                  Locker 14
                </span>
              </div>

              {/* Locker Handle & Lock */}
              <div className="w-3 h-3 rounded-full bg-amber-400 self-end m-1 shadow" />
            </div>

            <div className="w-36 h-3 bg-stone-700 rounded-full -mt-1 shadow-sm" />
          </div>

          {/* Full-Length Dressing Mirror with Mannequin Display */}
          <div className="flex flex-col items-center">
            <div className="relative w-36 sm:w-44 h-56 rounded-2xl bg-gradient-to-b from-sky-100/20 via-white/10 to-sky-200/20 backdrop-blur-xs border-4 border-[#D4A373] shadow-2xl p-2 flex flex-col items-center justify-between overflow-hidden">
              
              {/* Mirror Reflection Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />

              <span className="text-[8px] font-bold text-[#D4A373] bg-black/40 px-2 py-0.5 rounded-full z-10">
                {lang === 'ar' ? 'المرآة: مظهرك الرياضي' : 'Mirror: Your Outfit'}
              </span>

              {/* Equipped Athlete Silhouette */}
              <div className="flex flex-col items-center my-auto z-10 animate-fade-in">
                {/* Head */}
                <div className="w-8 h-8 rounded-full bg-[#E5D2BA] border-2 border-stone-500 shadow-sm flex items-center justify-center text-xs">
                  🏃
                </div>

                {/* Equipped Top */}
                <div className={`w-14 h-12 rounded-t-xl mt-0.5 shadow flex items-center justify-center text-white text-[8px] font-bold ${
                  selectedTop === 'tee' ? 'bg-emerald-700' : 'bg-stone-700'
                }`}>
                  {selectedTop === 'tee' ? (lang === 'ar' ? 'تيشيرت' : 'T-Shirt') : (lang === 'ar' ? 'سترة خفيفة' : 'Zip Jacket')}
                </div>

                {/* Equipped Bottom */}
                <div className={`w-12 rounded-b-xl shadow flex items-center justify-center text-white text-[8px] font-bold ${
                  selectedBottom === 'joggers'
                    ? 'h-14 bg-stone-900 border-t border-stone-600'
                    : selectedBottom === 'knee_shorts'
                    ? 'h-10 bg-sky-900'
                    : 'h-6 bg-rose-900'
                }`}>
                  {selectedBottom === 'joggers'
                    ? (lang === 'ar' ? 'بنطال ساتر' : 'Joggers')
                    : selectedBottom === 'knee_shorts'
                    ? (lang === 'ar' ? 'شورت للركبة' : 'Knee Shorts')
                    : (lang === 'ar' ? 'شورت ضيق' : 'Short')}
                </div>
              </div>

              {/* Status Indicator */}
              <div className="z-10">
                {selectedBottom !== 'ultra_short' ? (
                  <span className="text-[8px] font-black text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500">
                    {lang === 'ar' ? '✓ ساتر ومناسب للنشاط' : '✓ Modest & Athletic'}
                  </span>
                ) : (
                  <span className="text-[8px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500">
                    {lang === 'ar' ? 'قليل الستر — يُفضل الأطول' : 'Low coverage'}
                  </span>
                )}
              </div>
            </div>

            <div className="w-44 h-2 bg-stone-700 rounded-full mt-1 shadow-sm" />
          </div>
        </div>

        {/* In-Scene Interactive Wardrobe Selectors */}
        <div className="space-y-2 pt-2 border-t border-stone-600/50">
          {/* Bottoms Options */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-stone-300 w-16 text-start">
              {lang === 'ar' ? 'السفلي:' : 'Bottom:'}
            </span>
            <div className="flex-1 grid grid-cols-3 gap-1.5">
              {[
                { id: 'joggers', labelAr: 'بنطال رياضي ساتر', labelEn: 'Athletic Joggers', icon: '👖' },
                { id: 'knee_shorts', labelAr: 'شورت سابغ للركبة', labelEn: 'Knee-length Shorts', icon: '🩳' },
                { id: 'ultra_short', labelAr: 'شورت قصير جداً', labelEn: 'Tight Compression', icon: '⚡' },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    playSoftTap();
                    setSelectedBottom(b.id as any);
                  }}
                  className={`p-1.5 rounded-xl border text-[9px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    selectedBottom === b.id
                      ? 'bg-emerald-600 border-emerald-400 text-white shadow-md'
                      : 'bg-stone-800/80 border-stone-600 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  <span>{b.icon}</span>
                  <span className="truncate">{lang === 'ar' ? b.labelAr : b.labelEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tops Options & Equip Button */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-[10px] font-bold text-stone-300 w-16 text-start">
                {lang === 'ar' ? 'العلوي:' : 'Top:'}
              </span>
              <div className="flex-1 grid grid-cols-2 gap-1.5">
                {[
                  { id: 'tee', labelAr: 'قميص رياضي مريح', labelEn: 'Performance Tee', icon: '👕' },
                  { id: 'jacket', labelAr: 'سترة رياضية خفيفة', labelEn: 'Light Zip Jacket', icon: '🧥' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      playSoftTap();
                      setSelectedTop(t.id as any);
                    }}
                    className={`p-1.5 rounded-xl border text-[9px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      selectedTop === t.id
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-md'
                        : 'bg-stone-800/80 border-stone-600 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    <span>{t.icon}</span>
                    <span className="truncate">{lang === 'ar' ? t.labelAr : t.labelEn}</span>
                  </button>
                ))}
              </div>
            </div>

            {!isCompleted && (
              <button
                type="button"
                onClick={handleEquipAndHeadOut}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#2C483F] to-[#1C4135] text-white text-xs font-black shadow-soft hover:scale-105 transition-all cursor-pointer shrink-0"
              >
                {lang === 'ar' ? 'الانطلاق للتمرين' : 'Start Workout'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grounded Guidance & Prophetic Evidence Drawer (Appears After Interaction) */}
      {isCompleted && (
        <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-50/90 to-stone-50 border border-emerald-300/80 space-y-3 animate-fade-in text-start shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-900 font-black text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'ar' ? 'التأصيل الشرعي للحشمة والوقار في الرياضة:' : 'Grounded Guidance on Athletic Modesty:'}</span>
            </div>

            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
              SCN_036 / SCN_032
            </span>
          </div>

          <p className="text-xs text-stone-700 leading-relaxed">
            {lang === 'ar'
              ? 'الحشمة وستر العورة من شعب الإيمان والوقار الإنساني؛ واختيار الملابس الرياضية الفضفاضة والمريحة يجمع بين تحقيق اللياقة البدنية والنشاط وبين صيانة الحياء دون أي مشقة أو حرج.'
              : 'Modesty and maintaining personal coverage are integral to Islamic ethics. Selecting comfortable, functional sportswear harmonizes fitness and dignity effortlessly.'}
          </p>

          {/* Verbatim Prophetic Hadith on Modesty & Dignity (Sahih al-Bukhari: 6117 / Sahih Muslim: 37) */}
          <div className="p-3 bg-white/80 rounded-xl border border-amber-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>صحيح البخاري — حديث عمران بن حصين رضي الله عنه في فضل الحياء</span>
              </span>
              <a
                href="https://dorar.net/hadith/sharh/30477"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-emerald-700 hover:text-emerald-900 underline flex items-center gap-0.5 font-bold"
              >
                <span>{lang === 'ar' ? 'السند' : 'Source'}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <p className="text-xs font-serif text-[#12183F] italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
              «الْحَيَاءُ لَا يَأْتِي إِلَّا بِخَيْرٍ»
            </p>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleResetAttire}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إعادة تنسيق اللباس الرياضي' : 'Replay Outfit'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
