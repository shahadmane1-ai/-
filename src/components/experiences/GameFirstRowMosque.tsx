import React, { useState } from 'react';
import { Sparkles, Compass, ArrowRight, BookOpen, ExternalLink, RotateCcw, ShieldCheck } from 'lucide-react';
import { Experience, Language } from '../../types';
import { playPeaceChime, playSoftTap } from '../../utils/audio';
import { recordScenarioAttempt } from '../../services/learningStateManager';
import { getScenarioById } from '../../services/scenarioVault';

interface DispatcherProps {
  experience: Experience;
  lang: Language;
  onFinish: () => void;
}

export const GameFirstRowMosque: React.FC<DispatcherProps> = ({ experience, lang, onFinish }) => {
  const [sceneState, setSceneState] = useState<'exterior' | 'interior'>('exterior');
  const [doorOpening, setDoorOpening] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<'row1' | 'row2' | 'row3' | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const scn2 = getScenarioById('SCN_002');
  const scn59 = getScenarioById('SCN_059');

  const handleOpenDoor = () => {
    playSoftTap();
    setDoorOpening(true);
    setTimeout(() => {
      setSceneState('interior');
      setDoorOpening(false);
    }, 600);
  };

  const handleSelectSpot = (spot: 'row1' | 'row2' | 'row3') => {
    playSoftTap();
    setSelectedSpot(spot);
  };

  const handleConfirmPrayer = () => {
    playPeaceChime();
    setIsCompleted(true);

    // Record deterministic learning progression for bound production scenario
    recordScenarioAttempt(
      'SCN_002',
      true,
      ['التبكير والاصطفاف بالمعروف', 'المسارعة والسكينة في الصلاة'],
      'prayer'
    );
    if (scn59 && scn59.is_active) {
      recordScenarioAttempt(
        'SCN_059',
        true,
        ['الصدق والبيان في المعاملات', 'رد الحقوق إلى أهلها'],
        'social'
      );
    }

    onFinish();
  };

  const handleResetScene = () => {
    playSoftTap();
    setSelectedSpot(null);
    setIsCompleted(false);
    setSceneState('exterior');
  };

  return (
    <div className="space-y-4">
      {/* 2D Interactive Mosque Experience Canvas */}
      <div className="relative w-full h-84 sm:h-96 rounded-3xl overflow-hidden border-2 border-[#D4A373]/40 shadow-2xl select-none">
        
        {/* ============================================================== */}
        {/* SCENE 1: MOSQUE EXTERIOR */}
        {/* ============================================================== */}
        {sceneState === 'exterior' && (
          <div className="relative w-full h-full bg-gradient-to-b from-sky-300 via-sky-200 to-stone-200 p-4 flex flex-col justify-between animate-fade-in">
            {/* Sky, Sun & Distant Minaret */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-200 border-2 border-amber-300 shadow-sm flex items-center justify-center text-sm">
                  ☀️
                </div>
                <div className="text-start">
                  <span className="text-[10px] font-black text-[#2C483F] block">
                    {lang === 'ar' ? 'المسجد قبل إقامة الصلاة' : 'Mosque Before Congregational Prayer'}
                  </span>
                  <span className="text-[8px] text-stone-600 font-mono">
                    {lang === 'ar' ? 'التبكير والسكينة' : 'Early arrival with tranquility'}
                  </span>
                </div>
              </div>

              {/* Dome & Crescent Silhouette */}
              <div className="flex flex-col items-center">
                <div className="text-amber-500 text-sm">🌙</div>
                <div className="w-16 h-8 rounded-t-full bg-gradient-to-b from-[#2C483F] to-[#1C332B] shadow-md border-t border-[#D4A373]" />
              </div>
            </div>

            {/* Modern Mosque Facade Architecture */}
            <div className="relative flex-1 flex flex-col items-center justify-end pb-8">
              {/* Stone Arches & Entrance */}
              <div className="relative w-64 sm:w-80 h-44 bg-[#F5EFE6] border-4 border-[#C7B59D] rounded-t-3xl shadow-xl flex flex-col items-center justify-between p-3">
                {/* Arch Trim Pattern */}
                <div className="w-full flex justify-between px-2 text-[#8B7355] text-xs">
                  <span>✦</span>
                  <span className="text-[9px] font-bold">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
                  <span>✦</span>
                </div>

                {/* The Interactive Grand Wooden Entrance Doors */}
                <div
                  onClick={handleOpenDoor}
                  className={`group relative w-28 sm:w-32 h-36 rounded-t-2xl border-4 cursor-pointer transition-all duration-700 shadow-2xl flex items-center justify-center ${
                    doorOpening
                      ? 'bg-amber-950 border-[#8B7355] scale-95 opacity-50'
                      : 'bg-gradient-to-b from-[#784E2D] to-[#4A2E16] border-[#D4A373] hover:brightness-110 hover:scale-105'
                  }`}
                  title={lang === 'ar' ? 'انقر على الباب لدخول المسجد' : 'Click door to enter mosque'}
                >
                  {/* Left / Right Door Leaves */}
                  <div className="absolute inset-y-0 left-1/2 w-0.5 bg-black/40 -translate-x-1/2" />
                  
                  {/* Geometric Islamic Star Door Panels */}
                  <div className="w-12 h-16 rounded-xl border border-amber-300/40 flex items-center justify-center">
                    <span className="text-base text-amber-200 group-hover:scale-125 transition-transform">
                      🕌
                    </span>
                  </div>

                  {/* Brass Door Handles */}
                  <div className="absolute top-1/2 left-10 w-2 h-2 rounded-full bg-amber-300 shadow" />
                  <div className="absolute top-1/2 right-10 w-2 h-2 rounded-full bg-amber-300 shadow" />

                  {/* Floating Action Badge */}
                  <div className="absolute -top-3 px-2 py-0.5 rounded-full bg-[#2C483F] text-[#D4A373] text-[8px] font-bold shadow-md ring-2 ring-[#D4A373] whitespace-nowrap animate-bounce">
                    {lang === 'ar' ? 'انقر لدخول المسجد ↵' : 'Click to enter ↵'}
                  </div>
                </div>

                {/* Shoes Rack Area on Side */}
                <div className="absolute bottom-2 left-2 p-1.5 rounded-lg bg-stone-200/90 border border-stone-300 shadow-xs flex flex-col items-center">
                  <span className="text-[10px]">👟</span>
                  <span className="text-[7px] font-bold text-stone-600">
                    {lang === 'ar' ? 'رف الأحذية' : 'Shoe Rack'}
                  </span>
                </div>

                {/* Abstract Worshippers Entering */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-80">
                  <div className="w-5 h-5 rounded-full bg-stone-300 border border-stone-400 flex items-center justify-center text-[9px]">
                    👤
                  </div>
                  <div className="w-5 h-5 rounded-full bg-stone-300 border border-stone-400 flex items-center justify-center text-[9px]">
                    👤
                  </div>
                </div>
              </div>
            </div>

            {/* Pavement / Sidewalk */}
            <div className="absolute bottom-0 inset-x-0 h-10 bg-[#D3C7B5] border-t-2 border-[#B8A892] flex items-center justify-center text-[9px] text-[#4E3B29] font-medium">
              {lang === 'ar' ? 'الممشى المؤدي للمسجد — السكينة والوقار في الخطى' : 'Mosque Pathway — Walking with composure and serenity'}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SCENE 2: MOSQUE INTERIOR & PRAYER ROWS */}
        {/* ============================================================== */}
        {sceneState === 'interior' && (
          <div className="relative w-full h-full bg-gradient-to-b from-[#FAF6EE] via-[#EFE7D8] to-[#DFD3BE] p-3 flex flex-col justify-between animate-fade-in">
            {/* Top Mihrab Direction Header */}
            <div className="flex items-center justify-between pb-1.5 border-b border-[#D4A373]/30">
              <button
                type="button"
                onClick={() => setSceneState('exterior')}
                className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white text-stone-700 text-[10px] font-bold shadow-xs cursor-pointer"
              >
                <ArrowRight className="w-3 h-3 rtl:rotate-0 ltr:rotate-180" />
                <span>{lang === 'ar' ? 'الباب الخارجي' : 'Exterior'}</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs font-black text-[#2C483F]">
                <Compass className="w-3.5 h-3.5 text-[#88C947]" />
                <span>{lang === 'ar' ? 'داخل مصلى المسجد: اختر مكانك بسكينة' : 'Mosque Interior: Choose your spot'}</span>
              </div>

              <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                {lang === 'ar' ? 'الصف الأول متاح' : 'First Row Open'}
              </span>
            </div>

            {/* Mihrab Architectural Arch (Direction of Prayer) */}
            <div className="relative flex flex-col items-center -mt-1">
              <div className="w-24 sm:w-28 h-10 rounded-t-full bg-gradient-to-b from-[#2C483F] to-[#1C332B] border-2 border-[#D4A373] flex flex-col items-center justify-center shadow-md">
                <span className="text-[8px] font-black text-[#D4A373]">
                  {lang === 'ar' ? 'محراب المسجد (القبلة)' : 'Mosque Mihrab'}
                </span>
              </div>
            </div>

            {/* Prayer Carpet Rows in Perspective */}
            <div className="space-y-2 sm:space-y-2.5 my-1">
              
              {/* ROW 1 (Front Row Nearest to Mihrab) */}
              <div
                onClick={() => handleSelectSpot('row1')}
                className={`relative p-2.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between shadow-md ${
                  selectedSpot === 'row1'
                    ? 'bg-[#1C4135] border-[#D4A373] text-white ring-4 ring-[#88C947]/50 scale-[1.02]'
                    : 'bg-gradient-to-r from-emerald-100 via-emerald-50 to-emerald-100 border-emerald-400 hover:border-[#2C483F]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black">
                    {lang === 'ar' ? 'الصف الأول (محراب المسجد)' : 'Row 1 (Nearest to Mihrab)'}
                  </span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${selectedSpot === 'row1' ? 'bg-[#D4A373] text-[#1C4135]' : 'bg-emerald-600 text-white'}`}>
                    {lang === 'ar' ? 'مكان متاح ومستحب' : 'Available & Beloved'}
                  </span>
                </div>

                {/* Visual Presence in Row */}
                <div className="flex items-center gap-2">
                  {/* Other worshippers in row 1 */}
                  <span className="text-xs opacity-75">👤 👤</span>

                  {/* Player Slot */}
                  {selectedSpot === 'row1' ? (
                    <div className="flex items-center gap-1 bg-[#D4A373] text-[#1C4135] px-2 py-0.5 rounded-lg font-black text-[10px] animate-scale-up">
                      <span>🤲</span>
                      <span>{lang === 'ar' ? 'أنت هنا' : 'You are here'}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded-lg bg-[#2C483F] text-white text-[9px] font-bold shadow-xs hover:scale-105 cursor-pointer"
                    >
                      {lang === 'ar' ? 'التقدم للصف الأول' : 'Step into Row 1'}
                    </button>
                  )}
                </div>
              </div>

              {/* ROW 2 (Middle Row) */}
              <div
                onClick={() => handleSelectSpot('row2')}
                className={`relative p-2 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  selectedSpot === 'row2'
                    ? 'bg-[#2C483F] border-[#D4A373] text-white ring-2 ring-emerald-300'
                    : 'bg-white/80 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-700">
                    {lang === 'ar' ? 'الصف الثاني' : 'Row 2'}
                  </span>
                  <span className="text-[8px] text-stone-500">
                    {lang === 'ar' ? 'مصلون يقرؤون القرآن' : 'Worshippers reading Quran'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400">👤 👤 👤</span>
                  {selectedSpot === 'row2' ? (
                    <span className="text-[9px] font-bold bg-[#D4A373] text-[#2C483F] px-2 py-0.5 rounded">
                      {lang === 'ar' ? 'أنت هنا' : 'You are here'}
                    </span>
                  ) : (
                    <span className="text-[8px] text-stone-400">
                      {lang === 'ar' ? 'انقر للاختيار' : 'Tap to select'}
                    </span>
                  )}
                </div>
              </div>

              {/* ROW 3 (Back Row) */}
              <div
                onClick={() => handleSelectSpot('row3')}
                className={`relative p-2 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  selectedSpot === 'row3'
                    ? 'bg-[#2C483F] border-[#D4A373] text-white ring-2 ring-emerald-300'
                    : 'bg-white/70 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-600">
                    {lang === 'ar' ? 'الصف الأخير قرب المدخل' : 'Back Row near entrance'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400">👤 👤</span>
                  {selectedSpot === 'row3' ? (
                    <span className="text-[9px] font-bold bg-[#D4A373] text-[#2C483F] px-2 py-0.5 rounded">
                      {lang === 'ar' ? 'أنت هنا' : 'You are here'}
                    </span>
                  ) : (
                    <span className="text-[8px] text-stone-400">
                      {lang === 'ar' ? 'انقر للاختيار' : 'Tap to select'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Decision / Prayer Button */}
            <div className="pt-1 flex items-center justify-between border-t border-[#D4A373]/20">
              <span className="text-[11px] text-stone-600">
                {selectedSpot === 'row1'
                  ? (lang === 'ar' ? '✓ وقفت في الصف الأول برفق ووقار دون تخطٍ للرقاب' : '✓ Stood in first row with calm dignity')
                  : selectedSpot
                  ? (lang === 'ar' ? 'اخترت مكانك، والصف الأول متاح أيضاً' : 'You selected a spot, Row 1 is also open')
                  : (lang === 'ar' ? 'انقر لاختيار مكانك في الصفوف' : 'Tap to choose your place in rows')}
              </span>

              {selectedSpot && !isCompleted && (
                <button
                  type="button"
                  onClick={handleConfirmPrayer}
                  className="px-6 py-2 rounded-xl bg-[#2C483F] hover:bg-[#1e342d] text-white text-xs font-black shadow-soft hover:scale-105 transition-all cursor-pointer"
                >
                  {lang === 'ar' ? 'أداء الصلاة بوقار وسكينة' : 'Perform Prayer with Dignity'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Grounded Guidance & Prophetic Evidence Drawer (Appears After Interaction) */}
      {isCompleted && (
        <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-50/90 to-stone-50 border border-emerald-300/80 space-y-3 animate-fade-in text-start shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-900 font-black text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'ar' ? 'فضل الصف الأول وحسن الأدب في المسجد:' : 'Virtue of First Row & Mosque Etiquette:'}</span>
            </div>

            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
              SCN_002 / SCN_059
            </span>
          </div>

          <p className="text-xs text-stone-700 leading-relaxed">
            {lang === 'ar'
              ? 'التبكير والتقدم للصف الأول من الفضائل النبوية العظيمة، وأدب المسلم أن يسير بسكينة ووقار، يملأ الفراغ المتاح بلطف دون تخطٍ للرقاب أو تضييق على إخوانه المصلين.'
              : 'Advancing early to the first row holds great virtue. The etiquette of the believer is to walk with composure, filling open spots gently without pushing.'}
          </p>

          {/* Verbatim Authentic Prophetic Hadith on First Row (Bukhari: 615 / Muslim: 437) */}
          <div className="p-3 bg-white/80 rounded-xl border border-amber-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>صحيح البخاري ومسلم — حديث أبي هريرة رضي الله عنه</span>
              </span>
              <a
                href="https://dorar.net/hadith/sharh/21655"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-emerald-700 hover:text-emerald-900 underline flex items-center gap-0.5 font-bold"
              >
                <span>{lang === 'ar' ? 'السند' : 'Source'}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <p className="text-xs font-serif text-[#12183F] italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
              «لو يعلم الناس ما في النداء والصف الأول، ثم لم يجدوا إلا أن يستهموا عليه لاستهموا»
            </p>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleResetScene}
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
