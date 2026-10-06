import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  BookOpen,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Droplets,
  Layers,
  MapPin,
  Check,
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { Experience, Language } from '../../types';
import { playPeaceChime, playSoftTap } from '../../utils/audio';
import { recordScenarioAttempt } from '../../services/learningStateManager';
import { getScenarioById } from '../../services/scenarioVault';

interface DispatcherProps {
  experience: Experience;
  lang: Language;
  onFinish: () => void;
}

export const GameUniversityPrayer: React.FC<DispatcherProps> = ({ experience, lang, onFinish }) => {
  // Step State: 1 = Choose spot, 2 = Unfold mat, 3 = Tactile sock wiping, 4 = Prayer / Completed
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [spotSelected, setSpotSelected] = useState<boolean>(false);
  const [matUnfolded, setMatUnfolded] = useState<boolean>(false);
  const [wipedTop, setWipedTop] = useState<boolean>(false);
  const [clickedBottomWarning, setClickedBottomWarning] = useState<boolean>(false);
  const [isPraying, setIsPraying] = useState<boolean>(false);
  const [swipeProgress, setSwipeProgress] = useState<number>(0);

  const scn13 = getScenarioById('SCN_013');
  const scn25 = getScenarioById('SCN_025');

  // Calculate tranquility score
  const getTranquility = () => {
    let score = 25;
    if (spotSelected) score += 25;
    if (matUnfolded) score += 25;
    if (wipedTop) score += 25;
    return score;
  };

  const tranquility = getTranquility();

  // Step 1: Select clean parquet spot
  const handleSelectSpot = () => {
    if (spotSelected) return;
    playSoftTap();
    setSpotSelected(true);
    setStep(2);
  };

  // Step 2: Unfold travel mat into the golden ring
  const handleUnfoldMat = () => {
    if (!spotSelected || matUnfolded) return;
    playSoftTap();
    setMatUnfolded(true);
    setStep(3);
  };

  // Step 3: Tactile Sock Wiping Handler
  const handleWipeTop = () => {
    if (wipedTop) return;
    playPeaceChime();
    setWipedTop(true);
    setClickedBottomWarning(false);
    setSwipeProgress(100);
  };

  const handleBottomClick = () => {
    playSoftTap();
    setClickedBottomWarning(true);
    // Record learning mistake for wiping bottom of socks
    recordScenarioAttempt('SCN_025', false, [], 'purity');
  };

  // Step 4: Begin Prayer
  const handleStartPrayer = () => {
    playPeaceChime();
    setIsPraying(true);
    setStep(4);

    // Record learning progression for campus spot & sock wiping
    recordScenarioAttempt(
      'SCN_013',
      true,
      ['طهارة الأرض المفتوحة بالأصل', 'أداء الصلاة بوقار دون تعطيل المارة'],
      'prayer'
    );
    recordScenarioAttempt(
      'SCN_025',
      true,
      ['المسح على الخفين والجوربين لتيسير الطهارة في الحرم الجامعي'],
      'purity'
    );

    onFinish();
  };

  const handleReset = () => {
    playSoftTap();
    setStep(1);
    setSpotSelected(false);
    setMatUnfolded(false);
    setWipedTop(false);
    setClickedBottomWarning(false);
    setIsPraying(false);
    setSwipeProgress(0);
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto font-sans select-none">
      
      {/* Top Header Card */}
      <div className="bg-[#FAF7F2] rounded-3xl p-4 border border-[#E8DFD1] shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#5B7B68]/15 text-[#5B7B68] flex items-center justify-center font-bold">
              📚
            </div>
            <div className="text-start">
              <h2 className="text-sm sm:text-base font-black text-[#2D3E35]">
                {lang === 'ar' ? 'ركن الصلاة بالجامعة: تيسير العبادة والسكينة' : 'Campus Prayer Spot: Focus & Facilitation'}
              </h2>
              <p className="text-[10px] text-stone-500 font-medium">
                {lang === 'ar' ? 'اختيار ركن هادئ، بسط سجادة السفر، ومسح الجوربين' : 'Choosing a tranquil nook, unrolling travel mat & wiping socks'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#EAE2D5] rounded-full border border-[#D9CDBA] text-xs font-bold text-[#3B4E43]">
            <CheckCircle2 className={`w-3.5 h-3.5 ${isPraying ? 'text-emerald-600' : 'text-stone-500'}`} />
            <span>
              {lang === 'ar' ? `السكينة: ${tranquility}%` : `Tranquility: ${tranquility}%`}
            </span>
          </div>
        </div>

        {/* Step Guide Banner */}
        <div className="p-2.5 rounded-2xl bg-white/80 border border-[#E8DFD1] text-start flex items-center justify-between">
          <span className="text-xs font-bold text-[#2D3E35]">
            {step === 1 && (lang === 'ar' ? '1. انقر على الحلقة الذهبية لاختيار موضع الصلاة الهادئ والنظيف.' : '1. Tap the golden ring to choose the clean, quiet spot.')}
            {step === 2 && (lang === 'ar' ? '2. انقر على سجادة السفر على المقعد لبسطها في الموضع المختار.' : '2. Tap the travel rug on the bench to unroll it into the spot.')}
            {step === 3 && (lang === 'ar' ? '3. تجديد الوضوء بالجامعة: قم بالمسح على ظاهر الجورب (أعلاه).' : '3. Campus Wudu concession: wipe across the top of your sock.')}
            {step === 4 && (lang === 'ar' ? '✓ تهيأ المكان وصح الوضوء بالرخصة، صلاة مقبولة وسكينة تامة.' : '✓ Spot ready & wudu verified with concession in peace.')}
          </span>

          <span className="text-[10px] font-bold text-[#5B7B68] bg-[#5B7B68]/10 px-2.5 py-0.5 rounded-full shrink-0">
            {step === 4 ? (lang === 'ar' ? 'مكتمل' : 'Ready') : (lang === 'ar' ? `خطوة ${step} من 3` : `Step ${step} of 3`)}
          </span>
        </div>
      </div>

      {/* Main 2.5D Semi-Isometric Library Corner Stage */}
      <div className="relative w-full rounded-3xl overflow-hidden border-2 border-[#D6C4AD] shadow-xl bg-[#EFE6D8] p-4 sm:p-6 min-h-[380px] sm:min-h-[440px] flex flex-col justify-between">
        
        {/* Background Full-Height Glass Window Wall with Outdoors View */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#E6F0EB] via-[#F4EDE2] to-[#E9DEC9] pointer-events-none">
          {/* Glass window vertical mullions & garden greenery */}
          <div className="absolute top-0 left-0 w-2/3 h-56 border-r-4 border-b-4 border-[#8A7968]/30 bg-gradient-to-br from-sky-100/50 via-emerald-50/30 to-amber-50/20 overflow-hidden">
            {/* Garden foliage visible through glass */}
            <div className="absolute bottom-2 left-4 flex gap-3 text-lg opacity-40">
              <span>🌳</span>
              <span>🌿</span>
              <span>🌱</span>
            </div>
            {/* Sunlight rays casting across window */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-100/30 via-white/20 to-transparent" />
          </div>

          {/* Isometric Parquet Wood Plank Floor Texture */}
          <div className="absolute inset-x-0 bottom-0 h-64 bg-[#DFCCA8]">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_32px,rgba(139,94,43,0.08)_32px,rgba(139,94,43,0.08)_34px)]" />
            <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_32px,rgba(139,94,43,0.08)_32px,rgba(139,94,43,0.08)_34px)]" />
          </div>
        </div>

        {/* Interior Bookcase on Background Wall (Left) */}
        <div className="absolute top-10 left-4 sm:left-8 w-24 sm:w-32 h-44 bg-[#D9B58B] border-3 border-[#A88258] rounded-xl shadow-lg p-1.5 flex flex-col justify-between z-10">
          {[0, 1, 2].map((shelf) => (
            <div key={shelf} className="border-b-2 border-[#947047] pb-0.5 flex items-end justify-around px-1">
              <span className="text-xs">📕</span>
              <span className="text-xs">📗</span>
              <span className="text-xs">📘</span>
            </div>
          ))}
          <span className="text-[7px] font-bold text-amber-950 text-center">Library 102</span>
        </div>

        {/* Center Stage: Golden Interactive Focus Ring & Parquet Prayer Spot */}
        <div className="relative z-10 flex-1 flex items-center justify-center my-auto">
          
          {/* Parquet Floor Center Zone */}
          <div className="relative flex flex-col items-center justify-center">
            
            {/* Step 1: Golden Focus Ring (Pulsating before selection) */}
            {!matUnfolded && (
              <div
                onClick={handleSelectSpot}
                className={`relative w-44 sm:w-56 h-28 sm:h-36 rounded-full border-4 transition-all duration-500 cursor-pointer flex items-center justify-center ${
                  spotSelected
                    ? 'border-[#88C947] bg-[#88C947]/10 shadow-[0_0_25px_rgba(136,201,71,0.5)]'
                    : 'border-amber-300 bg-amber-100/30 hover:bg-amber-100/50 shadow-[0_0_20px_rgba(251,191,36,0.7)] animate-pulse'
                }`}
                title={lang === 'ar' ? 'انقر لاختيار هذا الموضع الهادئ' : 'Click to select this spot'}
              >
                {!spotSelected && (
                  <div className="flex flex-col items-center gap-1 text-amber-900 animate-bounce">
                    <MapPin className="w-5 h-5 text-amber-600" />
                    <span className="text-[9px] font-black bg-white/90 px-2.5 py-0.5 rounded-full shadow-xs">
                      {lang === 'ar' ? 'انقر لتحديد موضع الصلاة' : 'Tap to select spot'}
                    </span>
                  </div>
                )}

                {spotSelected && !matUnfolded && (
                  <span className="text-[9px] font-bold text-emerald-800 bg-white/90 px-3 py-1 rounded-full shadow-xs flex items-center gap-1 animate-scale-up">
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                    <span>{lang === 'ar' ? 'الموضع هادئ ونظيف ✓' : 'Spot Verified ✓'}</span>
                  </span>
                )}
              </div>
            )}

            {/* Step 2+: Unfolded Sage-Green Travel Rug in Center of Floor */}
            {matUnfolded && (
              <div className="relative w-36 sm:w-44 h-56 sm:h-64 rounded-t-3xl bg-gradient-to-b from-[#274436] via-[#1E372B] to-[#12241C] border-3 border-[#D4A373] p-2 flex flex-col items-center justify-between text-white shadow-2xl animate-scale-up z-20">
                {/* Top Fringes */}
                <div className="w-full flex justify-between px-1 opacity-70">
                  <span className="text-[6px] tracking-widest text-[#D4A373]">||||||||||||</span>
                  <span className="text-[6px] tracking-widest text-[#D4A373]">||||||||||||</span>
                </div>

                {/* Islamic Mihrab Embroidered Arch */}
                <div className="w-24 sm:w-28 h-36 sm:h-40 border-2 border-[#D4A373]/80 rounded-t-full flex flex-col items-center justify-between bg-black/20 p-2 relative overflow-hidden">
                  <span className="text-xs text-[#D4A373]">✦</span>
                  <div className="text-center">
                    <span className="text-lg">🕌</span>
                    <span className="text-[8px] font-bold text-[#E6C594] block mt-0.5">
                      {lang === 'ar' ? 'اتجاه القبلة' : 'Facing Qibla'}
                    </span>
                  </div>
                  <div className="w-8 h-0.5 bg-[#D4A373]/60 rounded-full" />
                </div>

                {/* Mat Bottom Fringes */}
                <div className="w-full flex justify-between px-1 opacity-70">
                  <span className="text-[6px] tracking-widest text-[#D4A373]">||||||||||||</span>
                  <span className="text-[6px] tracking-widest text-[#D4A373]">||||||||||||</span>
                </div>

                {/* Character In-Prayer Avatar Overlay */}
                {isPraying && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-xs rounded-t-3xl flex flex-col items-center justify-center animate-fade-in z-30">
                    <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-[#D4A373] shadow-lg flex items-center justify-center text-lg">
                      🤲
                    </div>
                    <span className="text-[10px] font-bold text-amber-200 mt-2 bg-black/60 px-3 py-1 rounded-full border border-amber-400/40">
                      {lang === 'ar' ? 'في سكينة وخشوع...' : 'Praying in serenity...'}
                    </span>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Right Side: Wooden Study Bench with Backpack, Plant & Travel Mat */}
        <div className="absolute right-2 sm:right-6 bottom-6 sm:bottom-8 z-20 flex flex-col items-end">
          
          {/* Items sitting on bench */}
          <div className="flex items-end gap-2 sm:gap-3 mb-1 pr-2">
            
            {/* Potted Green Plant */}
            <div className="flex flex-col items-center">
              <span className="text-base sm:text-lg -mb-1 animate-pulse">🪴</span>
              <div className="w-5 h-4 bg-[#C29267] rounded-b-md border border-[#8C603B]" />
            </div>

            {/* Student Backpack */}
            <div className="w-12 sm:w-14 h-16 sm:h-18 bg-[#6B7C85] border-2 border-[#475760] rounded-t-xl rounded-b-md shadow-md p-1 flex flex-col justify-between">
              <div className="w-4 h-1 bg-stone-300 rounded-full mx-auto" />
              <div className="w-full h-6 bg-[#51616A] rounded border-t border-sky-200/30 flex items-center justify-center text-[7px] text-white font-mono">
                🎒 Student
              </div>
            </div>

            {/* Compact Folded Travel Prayer Mat (Interactive in Step 2) */}
            {!matUnfolded && (
              <div
                onClick={handleUnfoldMat}
                className={`w-14 sm:w-16 h-12 sm:h-14 rounded-xl border-2 p-1 flex flex-col items-center justify-center transition-all duration-300 shadow-md ${
                  spotSelected
                    ? 'bg-[#274436] border-[#88C947] text-white ring-2 ring-[#88C947] cursor-pointer hover:scale-110 animate-bounce'
                    : 'bg-[#3A5648] border-[#274436] text-stone-300 opacity-80'
                }`}
                title={lang === 'ar' ? 'سجادة سفر مدمجة' : 'Travel rug'}
              >
                <span className="text-sm">📜</span>
                <span className="text-[7px] font-bold mt-0.5">
                  {lang === 'ar' ? 'سجادة السفر' : 'Travel Mat'}
                </span>
              </div>
            )}
          </div>

          {/* Wooden Bench Base Structure */}
          <div className="w-44 sm:w-56 h-7 bg-[#C59B6B] border-2 border-[#9E7345] rounded-lg shadow-md flex items-center justify-between px-3">
            <div className="w-3 h-5 bg-[#8E6339] rounded-xs" />
            <span className="text-[8px] font-mono text-amber-950 font-bold opacity-60">Study Nook Bench</span>
            <div className="w-3 h-5 bg-[#8E6339] rounded-xs" />
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* STEP 3 ENHANCEMENT: TACTILE SOCK-WIPING CARD (مسح ظاهر الجورب) */}
      {/* ======================================================== */}
      {step === 3 && (
        <div className="p-4 rounded-3xl bg-[#FAF7F2] border-2 border-[#5B7B68] shadow-lg space-y-3 animate-fade-in text-start">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#2D3E35] font-black text-xs sm:text-sm">
              <Droplets className="w-4 h-4 text-[#5B7B68]" />
              <span>
                {lang === 'ar' ? 'تيسير الطهارة: مسح ظاهر الجورب بالماء' : 'Wudu Facilitation: Wiping Top of the Sock'}
              </span>
            </div>

            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
              {lang === 'ar' ? 'رخصة المسح الشرعية' : 'Wiping Concession'}
            </span>
          </div>

          <p className="text-[11px] text-stone-600 leading-relaxed">
            {lang === 'ar'
              ? 'إذا توضأت ولبست جوربيك على طهارة، يمكنك تجديد الوضوء بالمسح باليد المبللة على ظاهر الجورب (أعلاه) دون الحاجة لنزعهما.'
              : 'If you wore clean socks over wudu, you can renew wudu by wiping moist hands over the top surface effortlessly.'}
          </p>

          {/* Tactile Interactive Sock Graphic Area */}
          <div className="relative w-full bg-gradient-to-b from-[#FAF5EC] to-[#EAE0D0] rounded-2xl p-4 border-2 border-[#DFD3C1] flex flex-col sm:flex-row items-center justify-around gap-4 overflow-hidden">
            
            {/* Sock Graphic with Highlighted Top Surface & Bottom */}
            <div className="relative flex flex-col items-center">
              
              {/* Top Surface Action Trigger (ظاهر الجورب) */}
              <div
                onClick={handleWipeTop}
                className={`relative w-44 sm:w-52 h-20 rounded-t-3xl border-3 border-dashed transition-all duration-300 cursor-pointer flex flex-col items-center justify-center p-2 group ${
                  wipedTop
                    ? 'bg-emerald-100/80 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : 'bg-white/90 border-[#5B7B68] hover:bg-emerald-50 ring-2 ring-[#5B7B68]/30 animate-pulse'
                }`}
                title={lang === 'ar' ? 'انقر أو اسحب هنا لمسح ظاهر الجورب' : 'Tap/swipe here to wipe top of sock'}
              >
                {/* Wet Streaks Water Animation on Successful Wipe */}
                {wipedTop ? (
                  <div className="flex items-center gap-2 animate-fade-in text-emerald-900 font-bold text-xs">
                    <span className="text-base">💧 ✦</span>
                    <span>{lang === 'ar' ? 'تم المسح على ظاهر الجورب بنجاح ✓' : 'Wiped Top Successfully ✓'}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[#2D3E35] font-black text-xs group-hover:scale-105 transition-transform">
                    <Droplets className="w-4 h-4 text-emerald-600 animate-bounce" />
                    <span>{lang === 'ar' ? 'اسحب أو انقر هنا: ظاهر الجورب (أعلاه) ↵' : 'Swipe/Tap: Top of Sock ↵'}</span>
                  </div>
                )}
                
                <span className="text-[8px] font-mono text-stone-500 mt-0.5">
                  {lang === 'ar' ? 'من أطراف الأصابع إلى الساق' : 'From toes towards shin'}
                </span>
              </div>

              {/* Bottom Sole Area (أسفل الجورب — to demonstrate correct Sunnah) */}
              <div
                onClick={handleBottomClick}
                className="w-44 sm:w-52 h-8 rounded-b-2xl bg-stone-300/80 border-x-2 border-b-2 border-stone-400 flex items-center justify-center cursor-pointer hover:bg-rose-100 transition-colors"
                title={lang === 'ar' ? 'أسفل الجورب' : 'Bottom sole'}
              >
                <span className="text-[8px] text-stone-600 font-bold">
                  {lang === 'ar' ? 'أسفل الجورب (لا يُمسح)' : 'Bottom Sole (Not wiped)'}
                </span>
              </div>
            </div>

            {/* Quick Action Button or Status Confirmation */}
            <div className="flex flex-col items-center sm:items-start gap-2">
              {!wipedTop ? (
                <button
                  type="button"
                  onClick={handleWipeTop}
                  className="px-5 py-2.5 rounded-2xl bg-[#5B7B68] hover:bg-[#486354] text-white text-xs font-black shadow-md hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Droplets className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'تطبيق مسح ظاهر الجورب' : 'Wipe Top of Sock'}</span>
                </button>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span>{lang === 'ar' ? 'طهارة صحيحة وميسرة' : 'Purity Valid & Facilitated'}</span>
                </div>
              )}

              {/* Gentle Clarification if user clicked bottom */}
              {clickedBottomWarning && (
                <div className="p-2 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-medium max-w-xs animate-shake">
                  {lang === 'ar'
                    ? '⚠️ السنة مسح ظاهر الجورب (أعلاه) وليس أسفله كما قال علي رضي الله عنه.'
                    : 'The Sunnah is to wipe the top surface, not the sole.'}
                </div>
              )}
            </div>

          </div>

          {/* CTA: Begin Prayer once wiped */}
          {wipedTop && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleStartPrayer}
                className="px-6 py-2.5 rounded-2xl bg-[#2D3E35] hover:bg-[#1C2923] text-white text-xs font-black shadow-md hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5 animate-pulse"
              >
                <span>{lang === 'ar' ? 'أداء الصلاة بوقار في الركن الهادئ' : 'Begin Prayer Peacefully in Nook'}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* COMPLETION & GROUNDED SACRED EVIDENCE DRAWER */}
      {/* ======================================================== */}
      {step === 4 && (
        <div className="p-4 rounded-3xl bg-gradient-to-b from-[#FAF7F2] to-[#EFE9DF] border border-[#D9CEBD] space-y-3 animate-fade-in text-start shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#2D3E35] font-black text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-[#5B7B68]" />
              <span>{lang === 'ar' ? 'التأصيل الشرعي للصلاة في الحرم الجامعي ورخصة المسح:' : 'Sacred Grounding on Campus Prayer & Sock Wiping:'}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#5B7B68]/15 text-[#3D5548]">
                {lang === 'ar' ? 'فقه الطهارة' : 'Purification'}
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-stone-200 text-stone-700">
                {lang === 'ar' ? 'سند صحيح' : 'Authentic Hadith'}
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-700 leading-relaxed">
            {lang === 'ar'
              ? 'الصلاة مدمجة في صلب يومك الجامعي؛ والأرض كلها طاهرة ومسجد للمسلم، ورخصة المسح على الجوربين ترفع المشقة تماماً وتتيح تجديد الطهارة في دقائق بين المحاضرات بيسر وطمأنينة.'
              : 'Prayer integrates seamlessly into university routines. The earth is universally pure and sacred, and wiping over socks facilitates quick, stress-free wudu.'}
          </p>

          {/* Verbatim Prophetic Hadith 1: Earth as Pure Place of Prayer (Bukhari: 335 / Muslim: 521) */}
          <div className="p-3 bg-white/90 rounded-2xl border border-amber-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>صحيح البخاري ومسلم — حديث جابر بن عبد الله رضي الله عنه</span>
              </span>
              <a
                href="https://dorar.net/hadith/sharh/1297"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-emerald-700 hover:text-emerald-900 underline flex items-center gap-0.5 font-bold"
              >
                <span>{lang === 'ar' ? 'السند' : 'Source'}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <p className="text-xs font-serif text-[#12183F] italic bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
              «جُعِلَتْ لِيَ الْأَرْضُ مَسْجِدًا وَطَهُورًا، فَأَيُّمَا رَجُلٍ مِنْ أُمَّتِي أَدْرَكَتْهُ الصَّلَاةُ فَلْيُصَلِّ»
            </p>
          </div>

          {/* Verbatim Prophetic Hadith 2: Sunnah of Wiping Top of Sock (Abu Dawud: 162) */}
          <div className="p-3 bg-white/90 rounded-2xl border border-amber-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>سنن أبي داود — أثر علي بن أبي طالب رضي الله عنه في مسح أعلى الخف</span>
              </span>
              <a
                href="https://dorar.net/hadith/sharh/21805"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-emerald-700 hover:text-emerald-900 underline flex items-center gap-0.5 font-bold"
              >
                <span>{lang === 'ar' ? 'السند' : 'Source'}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <p className="text-xs font-serif text-[#12183F] italic bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
              «لَوْ كَانَ الدِّينُ بِالرَّأْيِ لَكَانَ أَسْفَلُ الْخُفِّ أَوْلَى بِالْمَسْحِ مِنْ أَعْلَاهُ، وَقَدْ رَأَيْتُ رَسُولَ اللَّهِ ﷺ يَمْسَحُ عَلَى ظَاهِرِ خُفَّيْهِ»
            </p>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl bg-stone-200/80 hover:bg-stone-300/80 text-stone-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
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
