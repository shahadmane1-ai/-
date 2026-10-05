import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  Volume2,
  BookOpen,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  VolumeX,
  Footprints,
  ShieldCheck,
  Check,
  AlertTriangle
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

export const GameFirstJumuah: React.FC<DispatcherProps> = ({ experience, lang, onFinish }) => {
  // Step State: 1 = Shoes, 2 = Cushion, 3 = Khutbah dilemma, 4 = Complete
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [shoesStored, setShoesStored] = useState<boolean>(false);
  const [isSeated, setIsSeated] = useState<boolean>(false);
  const [whisperAnswer, setWhisperAnswer] = useState<'reply' | 'silent' | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const scn59 = getScenarioById('SCN_059');

  // Calculate tranquility score based on actions
  const getTranquility = () => {
    let score = 25;
    if (shoesStored) score += 25;
    if (isSeated) score += 25;
    if (whisperAnswer === 'silent') score += 25;
    return score;
  };

  const tranquility = getTranquility();

  // Step 1: Place shoes in highlighted slot
  const handlePlaceShoes = () => {
    if (shoesStored) return;
    playSoftTap();
    setShoesStored(true);
    setCurrentStep(2);
  };

  // Step 2: Take a seat on the front cushion
  const handleTakeSeat = () => {
    if (!shoesStored || isSeated) return;
    playSoftTap();
    setIsSeated(true);
    setCurrentStep(3);
  };

  // Step 3: Handle whisper dilemma
  const handleWhisperDecision = (choice: 'reply' | 'silent') => {
    playSoftTap();
    setWhisperAnswer(choice);
    if (choice === 'silent') {
      playPeaceChime();
      setCurrentStep(4);
      setIsCompleted(true);

      // Record deterministic learning state for SCN_059
      recordScenarioAttempt(
        'SCN_059',
        true,
        ['الإنصات التام لخطبة الجمعة', 'أداء الصلاة مع الجماعة بالسكينة والوقار'],
        'social'
      );

      onFinish();
    }
  };

  const handleReset = () => {
    playSoftTap();
    setCurrentStep(1);
    setShoesStored(false);
    setIsSeated(false);
    setWhisperAnswer(null);
    setIsCompleted(false);
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto font-sans select-none">
      
      {/* Top Header Card */}
      <div className="bg-[#FAF7F2] rounded-3xl p-4 border border-[#E8DFD1] shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#5B7B68]/15 text-[#5B7B68] flex items-center justify-center font-bold">
              🕌
            </div>
            <div className="text-start">
              <h2 className="text-sm sm:text-base font-black text-[#2D3E35]">
                {lang === 'ar' ? 'آداب المسجد وصلاة الجمعة الأولى' : 'First Friday Prayer Mosque Etiquette'}
              </h2>
              <p className="text-[10px] text-stone-500 font-medium">
                {lang === 'ar' ? 'الدخول بوقار، ترتيب الحذاء، والإنصات للخطبة' : 'Entering with dignity, storing footwear & listening attentively'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#EAE2D5] rounded-full border border-[#D9CDBA] text-xs font-bold text-[#3B4E43]">
            <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-600' : 'text-stone-500'}`} />
            <span>
              {lang === 'ar' ? `السكينة: ${tranquility}%` : `Tranquility: ${tranquility}%`}
            </span>
          </div>
        </div>

        {/* Dynamic Step Instruction Banner */}
        <div className="p-2.5 rounded-2xl bg-white/80 border border-[#E8DFD1] text-start flex items-center justify-between">
          <span className="text-xs font-bold text-[#2D3E35]">
            {currentStep === 1 && (lang === 'ar' ? '1. انقر على الرف المضيء لوضع حذائك بنظام قبل الدخول.' : '1. Tap the glowing rack slot to place your shoes neatly.')}
            {currentStep === 2 && (lang === 'ar' ? '2. امشِ بسكينة وانقر على وسادة الصف الأول للجلوس.' : '2. Walk peacefully and tap the front-row cushion to sit.')}
            {currentStep === 3 && (lang === 'ar' ? '3. بدأت الخطبة! اختر التصرف النبوي الصحيح عند المشتتات.' : '3. The Khutbah began! Choose the Prophetic etiquette.')}
            {currentStep === 4 && (lang === 'ar' ? '✓ تم إتمام آداب الجمعة بخشوع وسكينة تامة.' : '✓ Friday prayer etiquette completed in full serenity.')}
          </span>

          <span className="text-[10px] font-bold text-[#5B7B68] bg-[#5B7B68]/10 px-2.5 py-0.5 rounded-full shrink-0">
            {currentStep === 4 ? (lang === 'ar' ? 'مكتمل' : 'Completed') : (lang === 'ar' ? `خطوة ${currentStep} من 3` : `Step ${currentStep} of 3`)}
          </span>
        </div>
      </div>

      {/* Main 2.5D Isometric Mosque Interior Stage */}
      <div className="relative w-full rounded-3xl overflow-hidden border-2 border-[#D6C4AD] shadow-xl bg-[#EDE5D8] p-4 sm:p-6 min-h-[360px] sm:min-h-[420px] flex flex-col justify-between">
        
        {/* Ambient Top Light Beam */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-amber-50/40 to-transparent pointer-events-none" />

        {/* 2.5D Isometric Mosque Layout */}
        <div className="relative w-full h-72 sm:h-84 flex items-center justify-between">
          
          {/* ======================================================== */}
          {/* LEFT: Wooden Shoe Cubby Rack on Raised Marble Step */}
          {/* ======================================================== */}
          <div className="absolute left-2 sm:left-4 top-8 sm:top-6 z-20 flex flex-col items-start">
            {/* Raised Marble Base */}
            <div className="relative p-1.5 pb-2 rounded-t-2xl bg-[#FAF7F2] border-2 border-[#DFD5C6] shadow-lg">
              
              {/* Wooden Shoe Rack Structure */}
              <div className="w-28 sm:w-36 h-40 sm:h-44 bg-[#D9B58B] border-3 border-[#B58C60] rounded-xl p-1.5 shadow-md flex flex-col justify-between">
                {/* 3 Rows x 4 Columns of Shoe Slots */}
                {[0, 1, 2].map((rowIdx) => (
                  <div key={rowIdx} className="grid grid-cols-4 gap-1 flex-1 my-0.5">
                    {[0, 1, 2, 3].map((colIdx) => {
                      const isTargetSlot = rowIdx === 1 && colIdx === 1;
                      const isOccupiedOther = (rowIdx === 0 && colIdx === 2) || (rowIdx === 2 && colIdx === 0) || (rowIdx === 2 && colIdx === 3);

                      return (
                        <div
                          key={colIdx}
                          onClick={isTargetSlot && !shoesStored ? handlePlaceShoes : undefined}
                          className={`rounded-md border flex items-center justify-center relative transition-all duration-300 ${
                            isTargetSlot
                              ? !shoesStored
                                ? 'bg-[#FAF6EE] border-white ring-2 ring-white shadow-[0_0_12px_rgba(255,255,255,0.9)] cursor-pointer hover:scale-110 animate-pulse'
                                : 'bg-[#C29D74] border-[#9E7A52] text-white shadow-inner'
                              : 'bg-[#C9A57C] border-[#B0895E]'
                          }`}
                        >
                          {isTargetSlot && (
                            shoesStored ? (
                              <span className="text-[10px] animate-scale-up">👞👞</span>
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                            )
                          )}
                          {isOccupiedOther && (
                            <span className="text-[8px] opacity-75">👟</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Slot prompt badge */}
              <div className="mt-1 w-full text-center">
                <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${
                  shoesStored ? 'bg-emerald-100 text-emerald-800' : 'bg-white/90 text-stone-700 shadow-xs'
                }`}>
                  {shoesStored ? (lang === 'ar' ? '✓ الحذاء في الرف' : '✓ Stored') : (lang === 'ar' ? 'رف الأحذية 👟' : 'Shoe Rack')}
                </span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CENTER-FOREGROUND: Polished White Marble Walkway */}
          {/* ======================================================== */}
          <div className="absolute left-24 sm:left-36 right-0 bottom-0 h-32 sm:h-36 bg-gradient-to-tr from-[#FAF8F5] via-[#F3EDE2] to-[#EAE0D2] border-t-3 border-l-3 border-[#DFD3C1] shadow-2xl rounded-tl-3xl overflow-hidden z-10">
            {/* Marble Veins Pattern */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#8B7355_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="absolute top-2 left-6 text-[8px] font-mono font-bold text-stone-400">
              {lang === 'ar' ? 'ممر الرخام الهادئ' : 'Marble Walkway'}
            </div>
          </div>

          {/* ======================================================== */}
          {/* UPPER-RIGHT: Elevated Prayer Carpet & Cushions & Minbar */}
          {/* ======================================================== */}
          <div className="absolute right-0 top-0 bottom-16 sm:bottom-20 left-32 sm:left-44 bg-[#678B76] border-b-4 border-l-4 border-[#4E6B5A] shadow-2xl rounded-bl-3xl overflow-hidden flex flex-col justify-between p-3 sm:p-4 z-10">
            
            {/* Carpet Decorative Border Lines (Saff lines) */}
            <div className="absolute inset-x-0 top-12 h-2 bg-[#7EA38D]/60 border-y border-[#527260]" />
            <div className="absolute inset-x-0 bottom-6 h-2 bg-[#7EA38D]/60 border-y border-[#527260]" />

            {/* Top Minbar & Ambient Khutbah Speaker */}
            <div className="flex items-start justify-end gap-3">
              {/* Floating Speaker Pill Icon (Glowing when Khutbah is active) */}
              <div className={`p-2 rounded-2xl border-2 flex items-center gap-1.5 transition-all duration-500 shadow-md ${
                currentStep >= 3
                  ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-pulse'
                  : 'bg-white/90 border-stone-200 text-stone-600'
              }`}>
                <Volume2 className="w-4 h-4 text-amber-600" />
                <span className="text-[9px] font-black">
                  {lang === 'ar' ? 'صوت الخطبة' : 'Khutbah Audio'}
                </span>
              </div>

              {/* Wooden Minbar (Pulpit) 3-step staircase */}
              <div className="w-16 sm:w-20 h-20 sm:h-24 bg-[#B88E5E] border-2 border-[#8E693D] rounded-t-xl shadow-xl flex flex-col justify-between p-1">
                {/* Arch Backing */}
                <div className="w-full h-8 rounded-t-lg bg-[#967145] border border-[#7A5B36] flex items-center justify-center text-amber-100 text-[9px] font-bold">
                  🕌
                </div>
                {/* 3 Step Treads */}
                <div className="space-y-0.5">
                  <div className="w-full h-2.5 bg-[#D4AA7A] rounded-xs shadow-xs" />
                  <div className="w-full h-2.5 bg-[#C59B6B] rounded-xs shadow-xs" />
                  <div className="w-full h-2.5 bg-[#B88E5E] rounded-xs shadow-xs" />
                </div>
              </div>
            </div>

            {/* Row of Prayer Cushions (Saff Seating) */}
            <div className="relative z-10 flex items-center justify-around px-2 sm:px-6 my-auto">
              {[0, 1, 2, 3].map((idx) => {
                const isTargetCushion = idx === 1; // 2nd cushion with the focus ring

                return (
                  <div key={idx} className="relative flex flex-col items-center">
                    {/* Glowing Focus Rings for Target Cushion */}
                    {isTargetCushion && (
                      <div
                        onClick={handleTakeSeat}
                        className={`cursor-pointer group ${
                          !isSeated && shoesStored ? 'animate-bounce' : ''
                        }`}
                      >
                        {/* Multiple Radiant Pulse Rings */}
                        {!isSeated && shoesStored && (
                          <>
                            <div className="absolute -inset-3 rounded-full border-2 border-white/80 animate-ping pointer-events-none" />
                            <div className="absolute -inset-1.5 rounded-full border-2 border-white/90 shadow-[0_0_15px_white] pointer-events-none" />
                          </>
                        )}

                        {/* Physical Cushion (Stacked Pillows) */}
                        <div className={`relative w-12 sm:w-16 h-8 sm:h-10 rounded-2xl border-2 transition-all duration-300 shadow-md flex items-center justify-center ${
                          isSeated
                            ? 'bg-[#EAE0D0] border-white scale-105'
                            : 'bg-[#FAF6EE] border-white group-hover:scale-110'
                        }`}>
                          {/* Inner Seating Texture */}
                          <div className="w-8 sm:w-10 h-5 sm:h-6 rounded-xl bg-[#527462] border border-[#405C4D] flex items-center justify-center">
                            {isSeated ? (
                              <span className="text-xs">🤲</span>
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            )}
                          </div>
                        </div>

                        {/* Seated status tag */}
                        <div className="mt-1 text-center">
                          <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full ${
                            isSeated ? 'bg-white text-emerald-900 shadow-xs' : 'bg-black/30 text-white'
                          }`}>
                            {isSeated ? (lang === 'ar' ? '✓ جالس بخشوع' : '✓ Seated') : (lang === 'ar' ? 'مكانك المفضل' : 'Seat spot')}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Other Neighbor Cushions */}
                    {!isTargetCushion && (
                      <div className="opacity-80 flex flex-col items-center">
                        <div className="w-10 sm:w-12 h-7 sm:h-8 rounded-xl bg-[#FAF6EE] border border-stone-200 shadow-sm flex items-center justify-center">
                          <div className={`w-6 sm:w-8 h-4 rounded-lg ${idx % 2 === 0 ? 'bg-[#527462]' : 'bg-[#E8DDD0]'}`} />
                        </div>
                        <span className="text-[7px] text-emerald-100 font-mono mt-0.5 opacity-60">
                          {idx === 0 ? '👥' : idx === 2 ? '👥' : '📖'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Carpet Runner Text */}
            <div className="text-end text-[8px] font-mono text-emerald-100/70">
              {lang === 'ar' ? 'الصف الأول — السكينة والإنصات' : 'Front Row — Tranquility'}
            </div>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* STEP 3 INTERACTIVE DILEMMA: The Khutbah Whisper Scenario */}
      {/* ======================================================== */}
      {currentStep >= 3 && !isCompleted && (
        <div className="p-4 rounded-3xl bg-[#FAF7F2] border-2 border-amber-300/80 shadow-md space-y-3 animate-fade-in text-start">
          <div className="flex items-center gap-2 text-amber-900 font-black text-xs sm:text-sm">
            <VolumeX className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {lang === 'ar'
                ? 'موقف أثناء الخطبة: همس صديقك بجانبك بسؤال، ماذا تفعل؟'
                : 'Khutbah Situation: Your friend whispers a question, what do you do?'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {/* Option A: Reply (Mistake) */}
            <button
              type="button"
              onClick={() => handleWhisperDecision('reply')}
              className={`p-3 rounded-2xl border text-xs font-bold text-start transition-all cursor-pointer ${
                whisperAnswer === 'reply'
                  ? 'bg-rose-50 border-rose-300 text-rose-900 ring-2 ring-rose-400'
                  : 'bg-white border-stone-200 hover:border-amber-400 text-stone-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{lang === 'ar' ? 'أرد عليه بهدوء وبصوت منخفض' : 'Reply quietly to him'}</span>
                {whisperAnswer === 'reply' && <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />}
              </div>
              {whisperAnswer === 'reply' && (
                <p className="text-[10px] text-rose-700 mt-1.5 font-normal">
                  {lang === 'ar'
                    ? '⚠️ التحدث أثناء الخطبة مكروه ويُذهب ثواب الجمعة، حتى لو كان رداً على سؤال.'
                    : 'Talking during Khutbah nullifies the Friday reward.'}
                </p>
              )}
            </button>

            {/* Option B: Silent Focus (Correct) */}
            <button
              type="button"
              onClick={() => handleWhisperDecision('silent')}
              className={`p-3 rounded-2xl border text-xs font-bold text-start transition-all cursor-pointer ${
                whisperAnswer === 'silent'
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-400'
                  : 'bg-white border-stone-200 hover:border-emerald-500 text-stone-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{lang === 'ar' ? 'أشير له بالإنصات التام دون كلام وأستمع للخطيب' : 'Signal silence without speaking & focus'}</span>
                {whisperAnswer === 'silent' && <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />}
              </div>
              <p className="text-[10px] text-stone-500 mt-1 font-normal">
                {lang === 'ar' ? 'الأدب النبوي: الإنصات التام وحفظ السكينة.' : 'Prophetic etiquette: absolute attentive silence.'}
              </p>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* COMPLETION & GROUNDED SACRED EVIDENCE DRAWER */}
      {/* ======================================================== */}
      {isCompleted && (
        <div className="p-4 rounded-3xl bg-gradient-to-b from-[#FAF7F2] to-[#EFE9DF] border border-[#D9CEBD] space-y-3 animate-fade-in text-start shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#2D3E35] font-black text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-[#5B7B68]" />
              <span>{lang === 'ar' ? 'التأصيل الشرعي لأدب الجمعة والإنصات للخطيب:' : 'Sacred Evidence on Friday Khutbah Etiquette:'}</span>
            </div>

            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#5B7B68]/15 text-[#3D5548]">
              {lang === 'ar' ? 'أدب وسنة نبوية' : 'Prophetic Etiquette'}
            </span>
          </div>

          <p className="text-xs text-stone-700 leading-relaxed">
            {lang === 'ar'
              ? 'صلاة الجمعة هي العيد الأسبوعي المبارك؛ وأعظم آدابها الإنصات التام لخطبة الإمام وتجنب أي كلام أو لغو، صيانةً لثواب الفريضة وإشاعةً للسكينة والخشوع في بيت الله.'
              : 'Friday prayer is a blessed weekly gathering. Its highest etiquette is complete, undistracted listening to the sermon to preserve the reward and foster peace.'}
          </p>

          {/* Verbatim Prophetic Hadith on Silence in Khutbah (Bukhari: 934 / Muslim: 851) */}
          <div className="p-3 bg-white/90 rounded-2xl border border-amber-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>صحيح البخاري ومسلم — حديث أبي هريرة رضي الله عنه</span>
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
            <p className="text-xs font-serif text-[#12183F] italic bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
              «إِذَا قُلْتَ لِصَاحِبِكَ يَوْمَ الْجُمُعَةِ: أَنْصِتْ، وَالإِمَامُ يَخْطُبُ، فَقَدْ لَغَوْتَ»
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
