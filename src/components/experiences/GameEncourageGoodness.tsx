import React, { useState } from 'react';
import { Sparkles, Heart, BookOpen, ExternalLink, RotateCcw, ShieldCheck } from 'lucide-react';
import { Experience, Language } from '../../types';
import { playPeaceChime, playSoftTap } from '../../utils/audio';
import { recordScenarioAttempt } from '../../services/learningStateManager';
import { getScenarioById } from '../../services/scenarioVault';

interface DispatcherProps {
  experience: Experience;
  lang: Language;
  onFinish: () => void;
}

export const GameEncourageGoodness: React.FC<DispatcherProps> = ({ experience, lang, onFinish }) => {
  const [trayCarried, setTrayCarried] = useState(false);
  const [actionChosen, setActionChosen] = useState<'support' | 'mock' | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const scn43 = getScenarioById('SCN_043');
  const scn44 = getScenarioById('SCN_044');

  const handleSupport = () => {
    playPeaceChime();
    setActionChosen('support');
    setTrayCarried(true);
    setIsCompleted(true);

    // Record deterministic learning progression for cooperation in righteousness
    recordScenarioAttempt(
      'SCN_043',
      true,
      ['التعاون على البر والتقوى', 'تشجيع أهل البيت على الخير دون سخرية'],
      'social'
    );
    recordScenarioAttempt(
      'SCN_044',
      true,
      ['إدخال السرور على الوالدين بالمبادرات العفوية'],
      'social'
    );

    onFinish();
  };

  const handleMock = () => {
    playSoftTap();
    setActionChosen('mock');
  };

  const handleResetKitchen = () => {
    playSoftTap();
    setTrayCarried(false);
    setActionChosen(null);
    setIsCompleted(false);
  };

  return (
    <div className="space-y-4">
      {/* 2D Interactive Home Kitchen Canvas */}
      <div className="relative w-full h-84 sm:h-96 rounded-3xl overflow-hidden border-2 border-[#D4A373]/40 bg-gradient-to-b from-[#FBF8F2] via-[#EFE7D8] to-[#DFD3BE] shadow-2xl p-4 flex flex-col justify-between select-none">
        
        {/* Kitchen Atmosphere & Shelves */}
        <div className="flex items-center justify-between pb-2 border-b border-[#D4A373]/30">
          <div className="flex items-center gap-2">
            <span className="text-base">🍲</span>
            <div className="text-start">
              <span className="text-xs font-black text-[#2C483F] block">
                {lang === 'ar' ? 'مطبخ البيت: بر وإحسان' : 'Home Kitchen: Acts of Goodness'}
              </span>
              <span className="text-[9px] text-stone-500 font-mono">
                {lang === 'ar' ? 'أخوك يعد حساءً ودواءً للوالدة المتعبة' : 'Sibling preparing soup for tired mother'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-300">
            <span>🤝</span>
            <span>{lang === 'ar' ? 'التعاون على البر' : 'Mutual Support'}</span>
          </div>
        </div>

        {/* Center: Kitchen Counter, Sibling & The Tray */}
        <div className="relative flex-1 flex flex-col items-center justify-center my-2">
          {/* Kitchen Counter Cabinet */}
          <div className="relative w-72 sm:w-84 h-36 bg-[#E8DDD0] rounded-2xl border-4 border-[#C5B39E] shadow-xl p-3 flex justify-between items-end">
            
            {/* Stove with Steaming Pot */}
            <div className="flex flex-col items-center">
              <div className="text-xs text-stone-400 animate-bounce -mb-1">♨️</div>
              <div className="w-10 h-8 rounded-b-lg bg-[#5C6F7D] border-2 border-[#394955] flex items-center justify-center text-white text-xs shadow-sm">
                🍲
              </div>
              <span className="text-[7px] text-stone-600 font-mono font-bold mt-1">
                {lang === 'ar' ? 'حساء دافئ' : 'Warm Soup'}
              </span>
            </div>

            {/* Sibling standing by counter */}
            <div className="flex flex-col items-center -mt-8">
              <div className="w-10 h-10 rounded-full bg-[#E5D2BA] border-2 border-[#8B7355] shadow-md flex items-center justify-center text-sm">
                👦
              </div>
              <div className="w-14 h-14 rounded-t-xl bg-[#4A6B82] -mt-1 shadow-sm flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">
                  {lang === 'ar' ? 'أخوك' : 'Sibling'}
                </span>
              </div>
            </div>

            {/* Serving Tray (Interactive) */}
            <div
              onClick={handleSupport}
              className={`p-2 rounded-xl border-2 transition-all cursor-pointer shadow-md flex flex-col items-center ${
                trayCarried
                  ? 'bg-emerald-100 border-emerald-500 scale-105 ring-2 ring-emerald-400'
                  : 'bg-white border-[#D4A373] hover:scale-105'
              }`}
              title={lang === 'ar' ? 'انقر لمعاونته في حمل الصينية' : 'Click to help carry tray'}
            >
              <div className="flex items-center gap-1 text-sm">
                <span>🥣</span>
                <span>💊</span>
              </div>
              <span className="text-[8px] font-bold text-[#2C483F] whitespace-nowrap mt-1">
                {trayCarried
                  ? (lang === 'ar' ? '✓ نحملها معاً' : 'Carrying Together')
                  : (lang === 'ar' ? 'صينية الوالدة' : 'Mother’s Tray')}
              </span>
            </div>
          </div>

          {/* Sibling Response Speech Bubble */}
          <div className="mt-3 px-4 py-1.5 rounded-2xl bg-white/95 border border-[#D4A373] shadow-md text-center max-w-sm">
            {actionChosen === 'support' ? (
              <p className="text-[11px] font-bold text-emerald-900 leading-snug">
                {lang === 'ar'
                  ? '«شكراً لك يا أخي! جزاك الله خيراً، فرحت بمعاونتك وسنفاجئ أمنا معاً!»'
                  : '"Thank you so much! I am so glad you joined me to cheer up Mom!"'}
              </p>
            ) : actionChosen === 'mock' ? (
              <p className="text-[11px] font-bold text-rose-800 leading-snug">
                {lang === 'ar'
                  ? '«لماذا تسخر مني؟ كنت أحاول فقط مساعدة والدتنا المتعبة..»'
                  : '"Why tease me? I was just trying to help our tired mother.."'}
              </p>
            ) : (
              <p className="text-[10px] text-stone-600 font-medium">
                {lang === 'ar'
                  ? 'أخوك يبادر بالبر.. اختر كيف تتفاعل معه وتشجعه:'
                  : 'Your sibling is doing good.. choose how to react:'}
              </p>
            )}
          </div>
        </div>

        {/* The 2 Interactive Action Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-[#D4A373]/20">
          {/* Supportive Action (Target) */}
          <button
            type="button"
            onClick={handleSupport}
            className={`p-3 rounded-2xl border-2 text-start transition-all cursor-pointer flex items-center justify-between ${
              actionChosen === 'support'
                ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-400'
                : 'bg-white/95 border-[#2C483F]/30 hover:border-emerald-500 hover:bg-white'
            }`}
          >
            <div>
              <span className="text-xs font-black text-emerald-950 block">
                {lang === 'ar' ? 'التشجيع والمعاونة بلطف' : 'Encourage & Assist with Warmth'}
              </span>
              <p className="text-[10px] text-stone-600 mt-0.5 leading-snug">
                {lang === 'ar'
                  ? '«ما شاء الله، خطوة مباركة! دعني أحمل الصينية معك ونرتّب وسادتها.»'
                  : '"Splendid! Let me carry the tray with you and adjust her pillow."'}
              </p>
            </div>
            <span className="text-xl">🌸</span>
          </button>

          {/* Sarcastic Tease */}
          <button
            type="button"
            onClick={handleMock}
            className={`p-3 rounded-2xl border-2 text-start transition-all cursor-pointer flex items-center justify-between ${
              actionChosen === 'mock'
                ? 'bg-rose-50 border-rose-400'
                : 'bg-white/80 border-stone-200 hover:bg-white'
            }`}
          >
            <div>
              <span className="text-xs font-bold text-stone-700 block">
                {lang === 'ar' ? 'السخرية والتثبيط' : 'Tease & Discourage'}
              </span>
              <p className="text-[10px] text-stone-500 mt-0.5 leading-snug">
                {lang === 'ar'
                  ? '«منذ متى وأنت تقوم بأعمال البيت؟! شيء غريب!»'
                  : '"Since when do you do chores?! How unusual!"'}
              </p>
            </div>
            <span className="text-xl">⚡</span>
          </button>
        </div>
      </div>

      {/* Grounded Guidance & Quranic Evidence Drawer (Appears After Interaction) */}
      {isCompleted && (
        <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-50/90 to-stone-50 border border-emerald-300/80 space-y-3 animate-fade-in text-start shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-900 font-black text-xs sm:text-sm">
              <Heart className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'ar' ? 'التأصيل الشرعي للتعاون على البر في البيت:' : 'Grounded Evidence for Mutual Goodness:'}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                SCN_043
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-stone-200 text-stone-700">
                SCN_044
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-700 leading-relaxed">
            {lang === 'ar'
              ? 'التعاون على البر وتشجيع أفراد العائلة يثبت قيم الخير في البيت، وتجنب السخرية أو التثبيط يجعل المعروف محبباً إلى النفوس ويزرع المحبة والرحمة بين الإخوة.'
              : 'Supporting family members in doing good solidifies virtue at home. Gentleness makes righteous deeds beloved and fosters brotherly affection.'}
          </p>

          {/* Verbatim Quranic Verse on Cooperation in Righteousness (Al-Ma'idah: 2) */}
          <div className="p-3 bg-white/80 rounded-xl border border-amber-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>سورة المائدة: الآية 2 — الأمر بالتعاون على البر والتقوى</span>
              </span>
              <a
                href="https://quranpedia.net/surah/5/2"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-emerald-700 hover:text-emerald-900 underline flex items-center gap-0.5 font-bold"
              >
                <span>{lang === 'ar' ? 'السند' : 'Source'}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <p className="text-xs font-serif text-[#12183F] italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
              ﴿وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ ۖ وَلَا تَعَاوَنُوا عَلَى الْإِثْمِ وَالْعُدْوَانِ ۚ وَاتَّقُوا اللَّهَ ۖ إِنَّ اللَّهَ شَدِيدُ الْعِقَابِ﴾
            </p>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleResetKitchen}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إعادة الموقف' : 'Replay Scene'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
