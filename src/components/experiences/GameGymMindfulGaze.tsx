import React, { useState } from 'react';
import { Sparkles, Eye, Dumbbell, Smartphone, Droplets, CheckCircle2, BookOpen, ExternalLink, RotateCcw, ShieldCheck } from 'lucide-react';
import { Experience, Language } from '../../types';
import { playPeaceChime, playSoftTap } from '../../utils/audio';
import { recordScenarioAttempt } from '../../services/learningStateManager';
import { getScenarioById } from '../../services/scenarioVault';

interface DispatcherProps {
  experience: Experience;
  lang: Language;
  onFinish: () => void;
}

export const GameGymMindfulGaze: React.FC<DispatcherProps> = ({ experience, lang, onFinish }) => {
  const [focusProgress, setFocusProgress] = useState(0);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const scn36 = getScenarioById('SCN_036');

  const handleFocusOn = (zoneId: string, gain: number) => {
    playSoftTap();
    setActiveZone(zoneId);
    if (zoneId !== 'crowd') {
      const next = Math.min(100, focusProgress + gain);
      setFocusProgress(next);
      if (next >= 100 && !isCompleted) {
        playPeaceChime();
        setIsCompleted(true);

        // Record deterministic learning progression for mindful gaze and public ethics
        if (scn36 && scn36.is_active) {
          recordScenarioAttempt(
            'SCN_036',
            true,
            ['غض البصر في الأماكن العامة والمشتركة', 'حفظ الخصوصية والتركيز في العبادة والنشاط'],
            'ethics'
          );
        } else {
          recordScenarioAttempt(
            'SCN_048',
            true,
            ['غض البصر في الأماكن العامة والمشتركة', 'حفظ الخصوصية والتركيز في العبادة والنشاط'],
            'ethics'
          );
        }

        onFinish();
      }
    }
  };

  const handleResetGaze = () => {
    playSoftTap();
    setFocusProgress(0);
    setActiveZone(null);
    setIsCompleted(false);
  };

  return (
    <div className="space-y-4">
      {/* 2D Interactive Gym Floor Canvas */}
      <div className="relative w-full h-84 sm:h-96 rounded-3xl overflow-hidden border-2 border-[#D4A373]/40 bg-gradient-to-b from-[#2B3833] via-[#1E2925] to-[#121A17] shadow-2xl p-4 flex flex-col justify-between select-none">
        
        {/* Header Bar with Focus Meter */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-600/50">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#88C947]" />
            <div className="text-start">
              <span className="text-xs font-black text-white block">
                {lang === 'ar' ? 'صالة الأجهزة والتدريب بالنادي' : 'Gym Training Floor: Mindful Gaze'}
              </span>
              <span className="text-[9px] text-stone-400 font-mono">
                {lang === 'ar' ? 'انقر على أدوات تمرينك لتوجيه انتباهك وبصرك' : 'Tap your workout tools to focus your gaze'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-emerald-300 font-bold">
              {lang === 'ar' ? `التركيز والسكينة: ${focusProgress}%` : `Focus: ${focusProgress}%`}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden border border-stone-700 -mt-1">
          <div
            className="bg-gradient-to-r from-[#88C947] to-[#D4A373] h-full transition-all duration-500 shadow-sm"
            style={{ width: `${focusProgress}%` }}
          />
        </div>

        {/* Central Gym Workout Floor with 4 Interactive Objects */}
        <div className="relative flex-1 rounded-2xl bg-stone-900/60 border border-stone-700/60 p-3 my-1 flex items-center justify-around overflow-hidden">
          
          {/* Subtle Background Crowd in Distance (Blurred) */}
          <div
            onClick={() => handleFocusOn('crowd', 0)}
            className="absolute top-2 inset-x-8 h-12 bg-black/40 rounded-xl border border-dashed border-stone-600/60 flex items-center justify-between px-4 cursor-pointer hover:border-amber-400 transition-all group"
            title={lang === 'ar' ? 'المارة في الصالة' : 'People in gym'}
          >
            <span className="text-[9px] text-stone-400 font-mono">
              {lang === 'ar' ? 'الناس والمتدربون في الخلفية' : 'Background Gym Members'}
            </span>
            <span className="text-xs opacity-50 group-hover:opacity-100 transition-opacity">
              👥 👥 👥
            </span>
          </div>

          {/* Object 1: Weight Plates & Dumbbells (Interactive) */}
          <div
            onClick={() => handleFocusOn('weights', 35)}
            className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-1 shadow-md hover:scale-105 ${
              activeZone === 'weights'
                ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-400/50'
                : 'bg-stone-800/80 border-stone-600 hover:border-emerald-400'
            }`}
          >
            <span className="text-2xl">🏋️</span>
            <span className="text-[9px] font-black text-white">
              {lang === 'ar' ? 'أوزان التمرين' : 'Weight Rack'}
            </span>
            <span className="text-[7px] text-emerald-400 font-mono">
              {lang === 'ar' ? '+35% تركيز' : '+35% Focus'}
            </span>
          </div>

          {/* Object 2: Phone Workout Tracker App (Interactive) */}
          <div
            onClick={() => handleFocusOn('phone', 35)}
            className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-1 shadow-md hover:scale-105 ${
              activeZone === 'phone'
                ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-400/50'
                : 'bg-stone-800/80 border-stone-600 hover:border-emerald-400'
            }`}
          >
            <span className="text-2xl">📱</span>
            <span className="text-[9px] font-black text-white">
              {lang === 'ar' ? 'جدول التكرارات' : 'Workout Plan'}
            </span>
            <span className="text-[7px] text-emerald-400 font-mono">
              {lang === 'ar' ? '+35% تركيز' : '+35% Focus'}
            </span>
          </div>

          {/* Object 3: Water Bottle & Breathing (Interactive) */}
          <div
            onClick={() => handleFocusOn('water', 35)}
            className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-1 shadow-md hover:scale-105 ${
              activeZone === 'water'
                ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-400/50'
                : 'bg-stone-800/80 border-stone-600 hover:border-emerald-400'
            }`}
          >
            <span className="text-2xl">💧</span>
            <span className="text-[9px] font-black text-white">
              {lang === 'ar' ? 'ترطيب وتنفس' : 'Hydration'}
            </span>
            <span className="text-[7px] text-emerald-400 font-mono">
              {lang === 'ar' ? '+35% تركيز' : '+35% Focus'}
            </span>
          </div>
        </div>

        {/* Dynamic Context Feedback on Tapped Object */}
        <div className="p-2.5 rounded-xl bg-black/40 border border-stone-700 text-center text-xs">
          {activeZone === 'weights' && (
            <span className="text-emerald-300 font-bold">
              {lang === 'ar'
                ? '✓ وجهت بصرك لضبط أوزانك وتمرينك بدقة، فازداد تركيزك واطمئنانك.'
                : '✓ Directed your gaze onto your exercise weights, heightening discipline.'}
            </span>
          )}
          {activeZone === 'phone' && (
            <span className="text-emerald-300 font-bold">
              {lang === 'ar'
                ? '✓ تتابع تكراراتك وفترة الراحة في تطبيق التمارين دون انشغال بما حولك.'
                : '✓ Monitoring reps and rest timer on your phone without distraction.'}
            </span>
          )}
          {activeZone === 'water' && (
            <span className="text-emerald-300 font-bold">
              {lang === 'ar'
                ? '✓ تأخذ رشفة ماء وتنظم تنفسك في هدوء وسكينة ذاتية.'
                : '✓ Taking a hydration pause and regulating your breathing calmly.'}
            </span>
          )}
          {activeZone === 'crowd' && (
            <span className="text-amber-300 font-bold">
              {lang === 'ar'
                ? 'التحديق في الآخرين يشتت ذهنك ويزعج خصوصيتهم — أعد تركيز بصرك على تمرينك.'
                : 'Staring into the crowd invades privacy and breaks focus — redirect to workout.'}
            </span>
          )}
          {!activeZone && (
            <span className="text-stone-400 font-medium">
              {lang === 'ar'
                ? 'انقر على الأدوات الرياضية لملء مقياس التركيز وضبط النظر'
                : 'Tap workout tools to direct your gaze mindfully'}
            </span>
          )}
        </div>
      </div>

      {/* Grounded Guidance & Quranic Evidence Drawer (Appears After Interaction) */}
      {isCompleted && (
        <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-50/90 to-stone-50 border border-emerald-300/80 space-y-3 animate-fade-in text-start shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-900 font-black text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'ar' ? 'التأصيل الشرعي لغض البصر واحترام خصوصية الآخرين:' : 'Grounded Guidance on Mindful Gaze & Privacy:'}</span>
            </div>

            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
              {lang === 'ar' ? 'أدب وسند صحيح' : 'Authentic Guidance'}
            </span>
          </div>

          <p className="text-xs text-stone-700 leading-relaxed">
            {lang === 'ar'
              ? 'غض البصر في الأماكن المشتركة وحفظ النظر أدب رباني رفيع، يورث القلب طمأنينة ونوراً، ويصون خصوصيات المارة والمتدربين ويحفظ صفاء الفكر.'
              : 'Maintaining a mindful gaze in public and athletic spaces preserves inner tranquility, safeguards dignity, and respects everyone around you.'}
          </p>

          {/* Verbatim Quranic Verse on Lowering the Gaze (Surah An-Nur: 30) */}
          <div className="p-3 bg-white/80 rounded-xl border border-amber-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>سورة النور: الآية 30 — الأمر بغض البصر وحفظ العفة</span>
              </span>
              <a
                href="https://quranpedia.net/surah/24/30"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-emerald-700 hover:text-emerald-900 underline flex items-center gap-0.5 font-bold"
              >
                <span>{lang === 'ar' ? 'المصحف' : 'Verse'}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <p className="text-xs font-serif text-[#12183F] italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
              ﴿قُل لِّلْمُؤْمِنِينَ يَغُضُّوا مِنْ أَبْصَارِهِمْ وَيَحْفَظُوا فُرُوجَهُمْ ذَٰلِكَ أَزْكَىٰ لَهُمْ إِنَّ اللَّهَ خَبِيرٌ بِمَا يَصْنَعُونَ﴾
            </p>
          </div>

          {/* Verbatim Hadith on Accidental Gaze (Sahih Muslim: 2159) */}
          <div className="p-3 bg-white/80 rounded-xl border border-amber-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>صحيح مسلم — حديث جرير بن عبد الله رضي الله عنه في نظر الفجأة</span>
              </span>
              <a
                href="https://dorar.net/hadith/sharh/12965"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-emerald-700 hover:text-emerald-900 underline flex items-center gap-0.5 font-bold"
              >
                <span>{lang === 'ar' ? 'السند' : 'Source'}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <p className="text-xs font-serif text-[#12183F] italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
              «سَأَلْتُ رَسُولَ اللهِ ﷺ عَنْ نَظَرِ الْفَجْأَةِ فَأَمَرَنِي أَنْ أَصْرِفَ بَصَرِي»
            </p>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleResetGaze}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إعادة تدريب التركيز' : 'Replay Training'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
