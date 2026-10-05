import React, { useState } from 'react';
import { Sparkles, CloudRain, ShieldCheck, Home, BookOpen, ExternalLink, RotateCcw } from 'lucide-react';
import { Experience, Language } from '../../types';
import { playPeaceChime, playSoftTap } from '../../utils/audio';
import { recordScenarioAttempt } from '../../services/learningStateManager';
import { getScenarioById } from '../../services/scenarioVault';

interface DispatcherProps {
  experience: Experience;
  lang: Language;
  onFinish: () => void;
}

export const GameRainConcession: React.FC<DispatcherProps> = ({ experience, lang, onFinish }) => {
  const [sheltered, setSheltered] = useState(false);
  const [concessionTaken, setConcessionTaken] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const scn12 = getScenarioById('SCN_012');

  const handleTakeConcession = () => {
    playPeaceChime();
    setSheltered(true);
    setConcessionTaken(true);
    setIsCompleted(true);

    // Record deterministic learning progression for rain concession and lifting hardship
    recordScenarioAttempt(
      'SCN_012',
      true,
      ['رخصة الصلاة في البيوت والرحال عند المطر الغزير', 'رفع الحرج والمشقة في الشريعة'],
      'travel'
    );

    onFinish();
  };

  const handleResetRain = () => {
    playSoftTap();
    setSheltered(false);
    setConcessionTaken(false);
    setIsCompleted(false);
  };

  return (
    <div className="space-y-4">
      {/* 2D Interactive Rain & Concession Canvas */}
      <div className="relative w-full h-84 sm:h-96 rounded-3xl overflow-hidden border-2 border-sky-400/50 bg-gradient-to-b from-[#2E3C4D] via-[#222E3C] to-[#161F29] shadow-2xl p-4 flex flex-col justify-between select-none">
        
        {/* Storm Atmosphere & Audio Adhan Indicator */}
        <div className="flex items-center justify-between pb-2 border-b border-sky-500/30">
          <div className="flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-sky-400 animate-bounce" />
            <div className="text-start">
              <span className="text-xs font-black text-white block">
                {lang === 'ar' ? 'عاصفة ماطرة وسيول في شوارع المدينة' : 'Severe Rainstorm on City Streets'}
              </span>
              <span className="text-[9px] text-sky-200 font-mono">
                {lang === 'ar' ? 'رخصة المطر: «ألا صلّوا في رحالكم»' : 'Rain Concession: Pray in your dwellings'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-950/80 text-sky-300 text-[10px] font-bold border border-sky-500/40">
            <span>🌧️</span>
            <span>{lang === 'ar' ? 'وحل ومطر غزير' : 'Torrential Rain'}</span>
          </div>
        </div>

        {/* Central Scene: Rain Streaks & Shelter */}
        <div className="relative flex-1 rounded-2xl overflow-hidden border border-sky-600/30 p-3 my-1 flex items-center justify-between">
          
          {/* Animated Rain Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-40 animate-pulse" />

          {/* Left: The Raining Street with Puddles */}
          <div className="relative z-10 flex flex-col items-center gap-2 p-2">
            <div
              onClick={() => playSoftTap()}
              className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 shadow-md flex flex-col items-center hover:scale-105 cursor-pointer transition-all"
              title={lang === 'ar' ? 'مظلة في مهب الرياح' : 'Umbrella in storm'}
            >
              <span className="text-3xl animate-pulse">☂️</span>
              <span className="text-[8px] text-sky-200 font-bold mt-1">
                {lang === 'ar' ? 'رياح ومطر شديد' : 'Heavy Gale'}
              </span>
            </div>

            <div className="w-24 h-6 rounded-full bg-sky-400/30 border border-sky-300/40 flex items-center justify-center text-[7px] text-sky-100 font-mono">
              🌊 {lang === 'ar' ? 'وحل وسيول' : 'Deep Puddles'}
            </div>
          </div>

          {/* Center: Distant Mosque Calling the Concession Adhan */}
          <div className="relative z-10 flex flex-col items-center p-2 text-center bg-black/40 rounded-2xl border border-sky-500/30 backdrop-blur-xs max-w-xs">
            <span className="text-xl">🕌</span>
            <span className="text-[10px] font-black text-amber-300 mt-1">
              {lang === 'ar' ? 'صوت الأذان ينادي بالرخصة:' : 'Adhan announces concession:'}
            </span>
            <p className="text-[9px] text-stone-200 italic mt-0.5 leading-snug">
              {lang === 'ar'
                ? '«ألا صلوا في رحالكم، ألا صلوا في بيوتكم»'
                : '"Pray in your dwellings, pray in your shelters"'}
            </p>
          </div>

          {/* Right: The Warm Dry Shelter / Home Porch (Interactive) */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              onClick={handleTakeConcession}
              className={`p-3 rounded-2xl border-2 transition-all cursor-pointer shadow-xl flex flex-col items-center gap-1 ${
                sheltered
                  ? 'bg-emerald-950/90 border-emerald-400 ring-4 ring-emerald-400/50 scale-105'
                  : 'bg-amber-950/60 border-amber-400 hover:scale-105 hover:bg-amber-900/80 animate-pulse'
              }`}
              title={lang === 'ar' ? 'انقر للدخول إلى المأوى الجاف' : 'Click to enter dry shelter'}
            >
              <span className="text-3xl">🏠</span>
              <span className="text-[9px] font-black text-amber-200">
                {sheltered
                  ? (lang === 'ar' ? '✓ داخل المأوى الجاف' : '✓ In Dry Shelter')
                  : (lang === 'ar' ? 'المأوى والبيت الجاف' : 'Warm Shelter')}
              </span>
              <span className="text-[7px] text-emerald-300 font-bold bg-black/40 px-1.5 py-0.5 rounded">
                {lang === 'ar' ? 'انقر للأخذ بالرخصة' : 'Click for Concession'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Decision Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-sky-500/30">
          <button
            type="button"
            onClick={handleTakeConcession}
            className={`p-3 rounded-2xl border-2 text-start transition-all cursor-pointer flex items-center justify-between ${
              concessionTaken
                ? 'bg-emerald-900/90 border-emerald-400 text-white shadow-md'
                : 'bg-stone-900/90 border-sky-500/40 text-stone-200 hover:border-emerald-400'
            }`}
          >
            <div>
              <span className="text-xs font-black text-emerald-400 block">
                {lang === 'ar' ? 'الأخذ برخصة المطر النبوية' : 'Accept the Prophetic Rain Concession'}
              </span>
              <span className="text-[10px] text-stone-300 block mt-0.5">
                {lang === 'ar' ? 'الصلاة في البيت / المأوى دون حرج أو مشقة' : 'Pray in shelter/home without strain'}
              </span>
            </div>
            <span className="text-xl">🤲</span>
          </button>

          <button
            type="button"
            onClick={handleTakeConcession}
            className="p-3 rounded-2xl bg-stone-900/80 border border-stone-600 text-start text-stone-300 hover:border-stone-400 transition-all cursor-pointer flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-black text-amber-300 block">
                {lang === 'ar' ? 'الجمع بين الصلاتين' : 'Combine Prayers in Mosque'}
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">
                {lang === 'ar' ? 'تخفيفاً على المصلين من مشقة الخروج مرتين' : 'Lifting repeated hardship'}
              </span>
            </div>
            <span className="text-xl">🕌</span>
          </button>
        </div>
      </div>

      {/* Grounded Guidance & Prophetic Evidence Drawer (Appears After Interaction) */}
      {isCompleted && (
        <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-50/90 to-stone-50 border border-emerald-300/80 space-y-3 animate-fade-in text-start shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-900 font-black text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'ar' ? 'التأصيل الشرعي لرخصة المطر والمشقة:' : 'Grounded Evidence for Rain Concession:'}</span>
            </div>

            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
              {lang === 'ar' ? 'رخصة شرعية وسند' : 'Sacred Concession'}
            </span>
          </div>

          <p className="text-xs text-stone-700 leading-relaxed">
            {lang === 'ar'
              ? 'دين الإسلام قائم على اليسر ورفع الحرج؛ وعند هطول الأمطار الغزيرة أو حصول الوحل والسيول المانعة من الوصول للمسجد بسلام، شرع النبي ﷺ الأذان بالصلاة في الرحال والمنازل صيانةً للأرواح وتيسيراً على العباد.'
              : 'Islam is built on ease and lifting hardship. During heavy rainstorms and flooded streets, the Prophet prescribed praying at home to preserve safety.'}
          </p>

          {/* Verbatim Authentic Prophetic Hadith on Rain Concession (Bukhari: 668 / Muslim: 697) */}
          <div className="p-3 bg-white/80 rounded-xl border border-amber-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>صحيح البخاري ومسلم — حديث عبد الله بن عمر رضي الله عنهما في نداء المطر</span>
              </span>
              <a
                href="https://dorar.net/hadith/sharh/1296"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-emerald-700 hover:text-emerald-900 underline flex items-center gap-0.5 font-bold"
              >
                <span>{lang === 'ar' ? 'السند' : 'Source'}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <p className="text-xs font-serif text-[#12183F] italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
              «أنَّ ابنَ عُمَرَ أذَّنَ بالصَّلَاةِ في لَيْلَةٍ ذَاتِ بَرْدٍ ورِيحٍ، ثُمَّ قالَ: ألَا صَلُّوا في الرِّحَالِ، ثُمَّ قالَ: إنَّ رَسولَ اللَّهِ ﷺ كانَ يَأْمُرُ المُنَادِيَ إذَا كَانَتْ لَيْلَةٌ بَارِدَةٌ، أوْ ذَاتُ مَطَرٍ، يقولُ: ألَا صَلُّوا في رِحَالِكُمْ»
            </p>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleResetRain}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إعادة التجربة' : 'Replay Scene'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
