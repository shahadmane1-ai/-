import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  ExternalLink,
  Smartphone,
  VolumeX,
  Volume2,
  Compass,
  Layers,
  Check,
  BellOff
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

export const GameHomePrayerRoom: React.FC<DispatcherProps> = ({ experience, lang, onFinish }) => {
  const [matUnrolled, setMatUnrolled] = useState(false);
  const [phoneSilenced, setPhoneSilenced] = useState(false);
  const [isPraying, setIsPraying] = useState(false);

  const scn1 = getScenarioById('SCN_001');
  const scn5 = getScenarioById('SCN_005');

  // Calculate tranquility progression score
  const getTranquilityScore = () => {
    if (isPraying) return 100;
    let score = 30;
    if (matUnrolled) score += 35;
    if (phoneSilenced) score += 35;
    return Math.min(100, score);
  };

  const tranquilityScore = getTranquilityScore();
  const readyToPray = matUnrolled && phoneSilenced;

  const handleToggleMat = () => {
    playSoftTap();
    setMatUnrolled((prev) => !prev);
  };

  const handleTogglePhone = () => {
    playSoftTap();
    setPhoneSilenced((prev) => !prev);
  };

  const handleStartPrayer = () => {
    playPeaceChime();
    setIsPraying(true);

    // Record deterministic learning progression for bound production scenarios
    recordScenarioAttempt(
      'SCN_001',
      true,
      ['الاستمرار في الركعة الثالثة', 'سجدتا السهو قبل السلام'],
      'prayer'
    );
    recordScenarioAttempt(
      'SCN_005',
      true,
      ['الاستعاذة النبوية من خنزب', 'النهي عن قطع الصلاة بسبب الوسواس'],
      'mindset'
    );

    onFinish();
  };

  const handleResetScene = () => {
    playSoftTap();
    setMatUnrolled(false);
    setPhoneSilenced(false);
    setIsPraying(false);
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto font-sans select-none">
      {/* Top Header Card Matching Reference UI */}
      <div className="bg-[#FAF7F2] rounded-3xl p-4 border border-[#E8DFD1] shadow-xs">
        {/* Header Title */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#5B7B68]/15 flex items-center justify-center text-[#5B7B68]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-[#2D3E35]">
                {lang === 'ar' ? 'تحضير الصلاة المنزلية' : 'Home Prayer Preparation'}
              </h2>
              <p className="text-[10px] text-stone-500 font-medium">
                {lang === 'ar' ? 'تهيئة محراب هادئ خاشع في غرفتك' : 'Arranging a tranquil prayer sanctuary'}
              </p>
            </div>
          </div>

          {/* Day / Module Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#EBE3D5] rounded-full border border-[#D9CEBD] text-[#3F5448]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#5B7B68]" />
            <span className="text-[11px] font-bold">
              {lang === 'ar' ? 'اليوم 1: تجهيز المحراب' : 'Day 1: Sanctuary Setup'}
            </span>
          </div>
        </div>

        {/* Tranquility Gauge Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E8DFD1]/80">
          <div className="flex items-center gap-2">
            {/* Circular Mini Gauge */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  className="stroke-[#E0D5C3]"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  className="stroke-[#5B7B68] transition-all duration-700 ease-out"
                  strokeWidth="3"
                  strokeDasharray="94.25"
                  strokeDashoffset={94.25 - (94.25 * tranquilityScore) / 100}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <span className="absolute text-[8px] font-black text-[#2D3E35]">
                {tranquilityScore}%
              </span>
            </div>
            <span className="text-xs font-bold text-[#4B5E53]">
              {lang === 'ar' ? 'نقطة الصفاء والسكينة' : 'Tranquility Level'}
            </span>
          </div>

          <span className="text-[11px] font-bold text-[#5B7B68] bg-[#5B7B68]/10 px-2.5 py-0.5 rounded-full">
            {tranquilityScore === 100
              ? (lang === 'ar' ? '✓ مكتمل وجاهز للصلاة' : '✓ Ready for Prayer')
              : (lang === 'ar' ? `${3 - (matUnrolled ? 1 : 0) - (phoneSilenced ? 1 : 0) - (isPraying ? 1 : 0)} خطوات متبقية` : 'Steps remaining')}
          </span>
        </div>
      </div>

      {/* Main Tactile Stage Canvas (Wooden Floor with 3 Core Objects) */}
      <div className="relative w-full h-84 sm:h-96 rounded-3xl overflow-hidden border border-[#D9CBB7] shadow-lg bg-[#EADDCB] p-4 flex flex-col justify-between select-none">
        
        {/* Realistic Wooden Floor Planks Texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#ECDDC9] via-[#E4D4BE] to-[#DC Rugby_9B] pointer-events-none opacity-95">
          {/* Vertical wood plank seams */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_75px,rgba(140,109,71,0.18)_75px,rgba(140,109,71,0.18)_77px)]" />
          {/* Subtle wood grain horizontal lines */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_20px,rgba(0,0,0,0.03)_20px,rgba(0,0,0,0.03)_21px)]" />
          {/* Soft ambient vignette */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/10" />
        </div>

        {/* In-Canvas Ambient Light / Sunlight Glow */}
        <div className="absolute top-0 right-1/4 w-64 h-48 bg-gradient-to-b from-amber-100/30 to-transparent blur-xl pointer-events-none" />

        {/* Central Stage Area: Phone (Left) + Prayer Mat (Center) + Qibla Compass (Right) */}
        <div className="relative z-10 flex-1 flex items-center justify-between px-2 sm:px-6">
          
          {/* Left Object: Smartphone on Floor (Interactive) */}
          <div className="flex flex-col items-center">
            <div
              onClick={handleTogglePhone}
              className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95 flex flex-col items-center ${
                phoneSilenced ? '-rotate-6' : '-rotate-12'
              }`}
              title={lang === 'ar' ? 'انقر لكتم الإشعارات' : 'Click to mute notifications'}
            >
              {/* Notification Ripples (Only when NOT silenced) */}
              {!phoneSilenced && (
                <div className="absolute -inset-2.5 rounded-2xl border-2 border-rose-400/60 animate-ping pointer-events-none" />
              )}

              {/* Physical Phone Device */}
              <div
                className={`w-14 sm:w-16 h-26 sm:h-28 rounded-2xl p-1.5 shadow-xl border-2 flex flex-col items-center justify-between transition-colors duration-300 ${
                  phoneSilenced
                    ? 'bg-[#2E3C36] border-[#5B7B68] text-white shadow-emerald-950/20'
                    : 'bg-[#FBF8F2] border-stone-400 text-stone-800 shadow-stone-900/30'
                }`}
              >
                {/* Phone Speaker Notch */}
                <div className="w-4 h-1 bg-stone-500/50 rounded-full mt-0.5" />

                {/* Phone Screen Graphic */}
                <div
                  className={`w-full flex-1 rounded-xl my-1 flex flex-col items-center justify-center p-1 border transition-colors ${
                    phoneSilenced
                      ? 'bg-[#1C2621] border-[#3E5247]'
                      : 'bg-gradient-to-b from-rose-50 to-amber-50 border-rose-200 animate-pulse'
                  }`}
                >
                  {phoneSilenced ? (
                    <>
                      <VolumeX className="w-5 h-5 text-[#88C947]" />
                      <span className="text-[7px] font-black text-emerald-300 font-mono mt-1">
                        {lang === 'ar' ? 'صامت 🔕' : 'Muted'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-5 h-5 text-rose-500 animate-bounce" />
                      <span className="text-[7px] font-black text-rose-600 font-mono mt-1">
                        {lang === 'ar' ? 'رنين وإشعارات' : 'Vibrating'}
                      </span>
                    </>
                  )}
                </div>

                {/* Home Indicator Bar */}
                <div className="w-5 h-0.5 bg-stone-400/60 rounded-full mb-0.5" />
              </div>

              {/* Status Pill below phone */}
              <div
                className={`mt-2 px-2 py-0.5 rounded-full text-[8px] font-bold shadow-xs border transition-colors ${
                  phoneSilenced
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                    : 'bg-rose-100 border-rose-300 text-rose-800'
                }`}
              >
                {phoneSilenced
                  ? (lang === 'ar' ? '✓ تم الكتم' : '✓ Muted')
                  : (lang === 'ar' ? 'مشتتات نشطة' : 'Active alerts')}
              </div>
            </div>
          </div>

          {/* Center Object: Tactile Prayer Mat (Rolled Up vs Unrolled) */}
          <div className="flex flex-col items-center my-auto px-2">
            <div
              onClick={handleToggleMat}
              className="cursor-pointer group flex flex-col items-center justify-center transition-all duration-500"
              title={lang === 'ar' ? 'انقر لفرش أو طي السجادة' : 'Click to unroll/roll mat'}
            >
              {matUnrolled ? (
                /* Fully Unrolled Sage & Gold Prayer Mat */
                <div className="relative w-36 sm:w-44 h-56 sm:h-64 rounded-t-3xl bg-gradient-to-b from-[#567464] via-[#466152] to-[#34483D] border-3 border-[#D4A373] p-2 flex flex-col items-center justify-between text-white shadow-2xl animate-scale-up hover:scale-[1.02] transition-transform">
                  
                  {/* Top Fringe / Tassels */}
                  <div className="w-full flex justify-between px-1 opacity-75">
                    <span className="text-[6px] tracking-widest text-[#EBD5B3]">||||||||||||||</span>
                    <span className="text-[6px] tracking-widest text-[#EBD5B3]">||||||||||||||</span>
                  </div>

                  {/* Embroidered Islamic Mihrab Arch */}
                  <div className="w-24 sm:w-28 h-36 sm:h-40 rounded-t-full border-2 border-[#D4A373]/90 bg-[#28382F]/70 p-2 flex flex-col items-center justify-between shadow-inner relative overflow-hidden">
                    {/* Inner Arch Peak Glow */}
                    <div className="w-3 h-3 rounded-full bg-[#D4A373]/30 flex items-center justify-center text-[9px] text-[#F3E7D3]">
                      ✦
                    </div>

                    <div className="text-center my-auto space-y-0.5">
                      <div className="text-base sm:text-lg">🕌</div>
                      <span className="text-[8px] sm:text-[9px] font-bold text-[#EBD5B3] block">
                        {lang === 'ar' ? 'اتجاه القبلة' : 'Facing Qibla'}
                      </span>
                    </div>

                    <div className="w-12 h-0.5 bg-[#D4A373]/70 rounded-full mb-1" />
                  </div>

                  {/* Mat Bottom Fringe */}
                  <div className="w-full flex justify-between px-1 opacity-75">
                    <span className="text-[6px] tracking-widest text-[#EBD5B3]">||||||||||||||</span>
                    <span className="text-[6px] tracking-widest text-[#EBD5B3]">||||||||||||||</span>
                  </div>

                  {/* Character in Prayer Avatar Overlay if Prayer Started */}
                  {isPraying && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xs rounded-t-3xl flex flex-col items-center justify-center animate-fade-in z-20">
                      <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-[#D4A373] shadow-lg flex items-center justify-center text-lg">
                        🤲
                      </div>
                      <span className="text-[10px] font-bold text-amber-200 mt-2 bg-black/60 px-3 py-1 rounded-full border border-amber-400/40">
                        {lang === 'ar' ? 'في خشوع وسكينة...' : 'Praying in tranquility...'}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                /* Neatly Rolled Up Rug Cylinder */
                <div className="relative flex flex-col items-center group-hover:scale-105 transition-transform duration-300">
                  {/* Rolled Mat Cylinder */}
                  <div className="w-32 sm:w-36 h-14 sm:h-16 rounded-2xl bg-gradient-to-r from-[#3B5044] via-[#567464] to-[#2F4137] border-2 border-[#D4A373] shadow-2xl p-2 flex items-center justify-between relative overflow-hidden">
                    {/* Decorative Rolled Fastening Straps */}
                    <div className="w-2.5 h-full bg-[#D4A373]/80 rounded-xs shadow-xs" />
                    
                    {/* Center Label on Rolled Mat */}
                    <div className="flex flex-col items-center justify-center text-center">
                      <span className="text-xs">📜</span>
                      <span className="text-[9px] font-black text-[#F5ECDC]">
                        {lang === 'ar' ? 'سجادة الصلاة' : 'Prayer Mat'}
                      </span>
                    </div>

                    <div className="w-2.5 h-full bg-[#D4A373]/80 rounded-xs shadow-xs" />

                    {/* Edge Tassels sticking out */}
                    <div className="absolute -left-1 inset-y-2 flex flex-col justify-between opacity-80">
                      <span className="text-[6px] text-[#EBD5B3] -rotate-90">|||</span>
                    </div>
                    <div className="absolute -right-1 inset-y-2 flex flex-col justify-between opacity-80">
                      <span className="text-[6px] text-[#EBD5B3] rotate-90">|||</span>
                    </div>
                  </div>

                  {/* Floor Cast Shadow */}
                  <div className="w-36 h-3 bg-stone-900/30 rounded-full blur-xs mt-1" />

                  {/* Prompt badge */}
                  <div className="mt-1 px-2.5 py-0.5 rounded-full bg-white/90 border border-stone-300 text-stone-700 text-[8px] font-bold shadow-xs">
                    {lang === 'ar' ? 'انقر لفرش السجادة' : 'Tap to unroll'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Object: Qibla Vintage Compass (Interactive) */}
          <div className="flex flex-col items-center">
            <div className="relative flex flex-col items-center">
              {/* Compass Ring & Top Hanging Loop */}
              <div className="w-3 h-3 rounded-full border-2 border-[#C5A059] -mb-1 bg-[#FAF6F0] z-0 shadow-xs" />

              {/* Dial Face */}
              <div className="relative w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-gradient-to-b from-[#FDFBF7] to-[#EFE7D8] border-3 border-[#C5A059] shadow-xl p-1 flex flex-col items-center justify-center">
                {/* Degree tick markers */}
                <div className="absolute inset-1 rounded-full border border-stone-300/80 pointer-events-none" />

                {/* Kaaba & Qibla Direction Heading */}
                <div className="flex flex-col items-center justify-center text-center z-10">
                  <span className="text-xs">🕋</span>
                  <span className="text-[7px] font-black text-stone-800 font-mono -mt-0.5">
                    215° SE
                  </span>
                  <span className="text-[6px] font-bold text-[#5B7B68]">
                    {lang === 'ar' ? 'القبلة' : 'Qibla'}
                  </span>
                </div>

                {/* Subtle Alignment Glow when Rug is Unrolled */}
                {matUnrolled && (
                  <div className="absolute inset-0 rounded-full bg-[#88C947]/15 border-2 border-emerald-500 animate-pulse flex items-center justify-center">
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-600 rounded-full text-white text-[8px] font-bold flex items-center justify-center shadow">
                      ✓
                    </span>
                  </div>
                )}
              </div>

              {/* Status Indicator */}
              <div className="mt-2 px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[8px] font-bold shadow-xs">
                {lang === 'ar' ? 'مضبوط للقبلة' : 'Qibla Aligned'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Control Bar (Tactile Card Matching Reference UI) */}
      <div className="bg-[#FAF7F2]/95 backdrop-blur-md rounded-3xl p-4 border border-[#E4D9C8] shadow-md space-y-3">
        {/* Welcome & Prompt Text */}
        <div className="text-start">
          <h3 className="text-xs sm:text-sm font-black text-[#2D3E35] flex items-center gap-1.5">
            <span>{lang === 'ar' ? 'مرحبًا بك!' : 'Welcome!'}</span>
            <span className="text-stone-400 text-xs font-normal">✦</span>
          </h3>
          <p className="text-[11px] text-stone-600 font-medium mt-0.5">
            {lang === 'ar'
              ? 'استعد للصلاة في مكان هادئ؛ افرش سجادتك واكتم إشعارات الهاتف.'
              : 'Prepare for prayer in a quiet spot: unroll your mat and silence active alerts.'}
          </p>
        </div>

        {/* Action Controls Row (Single Unified Row - No Duplicates) */}
        <div className="grid grid-cols-3 gap-2">
          {/* Action 1: Unroll Rug */}
          <button
            type="button"
            onClick={handleToggleMat}
            className={`py-2 px-1.5 rounded-2xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer ${
              matUnrolled
                ? 'bg-[#5B7B68] border-[#4A6B5B] text-white shadow-sm'
                : 'bg-white border-[#D6C7B2] text-[#3D4F45] hover:bg-stone-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="truncate">
              {matUnrolled
                ? (lang === 'ar' ? 'السجادة مفروشة ✓' : 'Mat Ready ✓')
                : (lang === 'ar' ? 'افرش السجادة' : 'Unroll Mat')}
            </span>
          </button>

          {/* Action 2: Mute Notifications */}
          <button
            type="button"
            onClick={handleTogglePhone}
            className={`py-2 px-1.5 rounded-2xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer ${
              phoneSilenced
                ? 'bg-[#5B7B68] border-[#4A6B5B] text-white shadow-sm'
                : 'bg-white border-[#D6C7B2] text-[#3D4F45] hover:bg-stone-50'
            }`}
          >
            <BellOff className="w-3.5 h-3.5" />
            <span className="truncate">
              {phoneSilenced
                ? (lang === 'ar' ? 'تم الكتم ✓' : 'Silenced ✓')
                : (lang === 'ar' ? 'كتم الإشعارات' : 'Silence Phone')}
            </span>
          </button>

          {/* Action 3: Start Prayer (Enabled when ready) */}
          <button
            type="button"
            disabled={!readyToPray || isPraying}
            onClick={handleStartPrayer}
            className={`py-2 px-1.5 rounded-2xl border text-[11px] font-black flex items-center justify-center gap-1.5 transition-all duration-300 ${
              readyToPray && !isPraying
                ? 'bg-[#4A6B5B] border-[#395346] text-white shadow-md hover:brightness-110 cursor-pointer animate-pulse'
                : isPraying
                ? 'bg-[#395346] border-[#2E4338] text-white opacity-90 cursor-default'
                : 'bg-stone-200 border-stone-300 text-stone-400 cursor-not-allowed'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span className="truncate">
              {isPraying
                ? (lang === 'ar' ? 'بدأت الصلاة' : 'Praying')
                : (lang === 'ar' ? 'ابدأ الصلاة' : 'Start Prayer')}
            </span>
          </button>
        </div>
      </div>

      {/* Completion & Grounded Sacred Evidence Drawer (Appears After Prayer Begins) */}
      {isPraying && (
        <div className="p-4 rounded-3xl bg-gradient-to-b from-[#FAF7F2] to-[#EFE9DF] border border-[#D9CEBD] space-y-3 animate-fade-in text-start shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#2D3E35] font-black text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-[#5B7B68]" />
              <span>{lang === 'ar' ? 'الحكمة والتأصيل الشرعي في تهيئة الصلاة والخشوع:' : 'Sacred Evidence on Prayer Focus & Khushu:'}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#5B7B68]/15 text-[#3D5548]">
                {lang === 'ar' ? 'فقه الخشوع' : 'Khushu Focus'}
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-stone-200 text-stone-700">
                {lang === 'ar' ? 'سند صحيح' : 'Authentic Hadith'}
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-700 leading-relaxed">
            {lang === 'ar'
              ? 'تهيئة مكان هادئ وإبعاد المشتتات كإشعارات الهاتف يعين القلب على استحضار عظمة الوقوف بين يدي الله تعالى، ويطرد وساوس الانشغال بالدنيا تحقيقاً لسكينة الصلاة وطمأنينتها.'
              : 'Arranging a quiet sanctuary and removing digital distractions grounds the heart in reverent focus (Khushu) and drives away restless wandering thoughts.'}
          </p>

          {/* Verbatim Authentic Hadith from SCN_005 / SCN_001 */}
          {scn5?.approved_sources?.[0] && (
            <div className="p-3 bg-white/90 rounded-2xl border border-amber-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                  <span>{scn5.approved_sources[0].reference_title}</span>
                </span>
                {scn5.approved_sources[0].source_page_url && (
                  <a
                    href={scn5.approved_sources[0].source_page_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-emerald-700 hover:text-emerald-900 underline flex items-center gap-0.5 font-bold"
                  >
                    <span>{lang === 'ar' ? 'السند' : 'Source'}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
              <p className="text-xs font-serif text-[#12183F] italic bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                «{scn5.approved_sources[0].verbatim_evidence_text}»
              </p>
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleResetScene}
              className="px-3.5 py-1.5 rounded-xl bg-stone-200/80 hover:bg-stone-300/80 text-stone-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إعادة تهيئة المحراب' : 'Reset Sanctuary'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
