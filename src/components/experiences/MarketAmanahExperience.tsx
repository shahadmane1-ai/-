import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  ShoppingBag,
  Coins,
  Receipt,
  HeartHandshake,
} from 'lucide-react';
import { Language } from '../../types';
import { playPeaceChime, playSoftTap, playStressReleaseTone } from '../../utils/audio';

interface MarketAmanahExperienceProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onComplete?: () => void;
}

export const MarketAmanahExperience: React.FC<MarketAmanahExperienceProps> = ({
  isOpen,
  onClose,
  lang,
  onComplete,
}) => {
  // State: 'start' | 'examining_receipt' | 'extra_cash_discovered' | 'returned_change' | 'completed'
  const [step, setStep] = useState<'checkout' | 'inspect_change' | 'returned' | 'completed'>('checkout');
  const [isBillPickedUp, setIsBillPickedUp] = useState(false);
  const [showSources, setShowSources] = useState(false);

  if (!isOpen) return null;

  const handleReturnMoney = () => {
    playPeaceChime();
    setIsBillPickedUp(true);
    setStep('returned');
    if (onComplete) {
      onComplete();
    }
  };

  const handleReset = () => {
    playSoftTap();
    setStep('checkout');
    setIsBillPickedUp(false);
    setShowSources(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#FBF9F5] border-2 border-[#D4A373]/60 rounded-3xl shadow-2xl p-4 sm:p-6 text-start flex flex-col justify-between max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D4A373]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2C483F] flex items-center justify-center text-[#D4A373] shadow-md">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-[#2C483F]">
                  {lang === 'ar' ? 'تجربة الأمانة | كاشير السوق' : 'Amanah Experience | Market Cashier'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#88C947]/20 text-[#2C483F] border border-[#88C947]/40">
                  {lang === 'ar' ? 'مشهد تفاعلي 2D' : '2D Interactive Scene'}
                </span>
              </div>
              <p className="text-xs text-[#2C483F]/75">
                {lang === 'ar'
                  ? 'موقف عملي في السوق: كيف تتصرف عند رد البائع لمال زائد بالخطأ؟'
                  : 'A real-life market situation: Returning extra change given by mistake.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#2C483F] text-xs font-bold transition-all cursor-pointer"
              title="إعادة المشهد"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 font-bold text-sm transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Interactive 2D Virtual Market Checkout Scene */}
        <div className="relative rounded-2xl p-4 sm:p-6 bg-gradient-to-b from-[#223932] via-[#2C483F] to-[#1a2d27] border-2 border-[#D4A373]/40 shadow-xl overflow-hidden text-white min-h-[340px] flex flex-col justify-between">
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-10 w-48 h-48 rounded-full bg-[#D4A373]/15 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-48 h-48 rounded-full bg-[#88C947]/15 blur-2xl pointer-events-none" />

          {/* Upper Context & Cashier Dialogue */}
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-black/30 p-3.5 rounded-2xl border border-white/15 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4A373] to-[#a87a4c] flex items-center justify-center text-2xl shadow-md shrink-0">
                👨‍💼
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#D4A373] block">
                  {lang === 'ar' ? 'البائع في متجر السوق' : 'Market Cashier'}
                </span>
                <p className="text-xs sm:text-sm font-bold text-white">
                  {step === 'returned'
                    ? lang === 'ar'
                      ? '«جزاك الله خيراً وبارك في رزقك! ما انتبهت للزيادة، بيض الله وجهك على أمانتك 🌿»'
                      : '"May Allah bless your sustenance! I did not notice the extra bill, thank you for your honesty!"'
                    : lang === 'ar'
                    ? '«حسابك 35 ريالاً يا طيب، واستلمت منك ورقة 50 ريالاً، تفضل الباقي...»'
                    : '"Total is 35 SAR. Received 50 SAR, here is your change..."'}
                </p>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-mono font-bold text-amber-200 shrink-0">
              {lang === 'ar' ? 'الفاتورة: 35 ر.س | المدفوع: 50 ر.س' : 'Bill: 35 SAR | Paid: 50 SAR'}
            </div>
          </div>

          {/* Central 2D Interactive Counter Surface */}
          <div className="relative z-10 my-4 p-4 rounded-2xl bg-gradient-to-r from-[#422F22] via-[#5A402F] to-[#3B291D] border-2 border-[#D4A373]/60 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left Counter Item: The Goods & Receipt */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-white/10 w-full md:w-auto">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-xl">
                🍯
              </div>
              <div className="text-start">
                <span className="text-xs font-bold text-white block">
                  {lang === 'ar' ? 'جرة عسل طبيعي' : 'Pure Honey Jar'}
                </span>
                <span className="text-[11px] text-amber-200 font-mono">
                  {lang === 'ar' ? 'السعر: 35.00 ريال' : 'Price: 35.00 SAR'}
                </span>
              </div>
              <Receipt className="w-5 h-5 text-stone-300 mr-auto" />
            </div>

            {/* Center Counter: Change Cash Placed by Cashier */}
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-black/40 border border-white/20 w-full md:flex-1 text-center space-y-2">
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                {lang === 'ar' ? 'المبلغ الموضوع على طاولة المحاسب' : 'Cash Change on Counter'}
              </span>

              <div className="flex items-center justify-center gap-3 flex-wrap">
                {/* 10 SAR bill */}
                <div className="px-3 py-1.5 rounded-lg bg-emerald-700/80 border border-emerald-400 text-xs font-mono font-bold shadow-md">
                  💵 10 ر.س
                </div>
                {/* 5 SAR bill */}
                <div className="px-3 py-1.5 rounded-lg bg-emerald-700/80 border border-emerald-400 text-xs font-mono font-bold shadow-md">
                  💵 5 ر.س
                </div>

                {/* The EXTRA 20 SAR bill inadvertently given */}
                {!isBillPickedUp ? (
                  <div
                    onClick={handleReturnMoney}
                    className="group relative px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-black text-xs font-mono border-2 border-yellow-300 shadow-gold cursor-pointer animate-pulse hover:scale-110 active:scale-95 transition-all flex items-center gap-1.5"
                    title="انقر لرد هذه الورقة الزائدة للبائع"
                  >
                    <span className="text-sm">⚠️</span>
                    <span>💵 20 ر.س (زيادة بالخطأ!)</span>
                    <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-bold animate-bounce">
                      {lang === 'ar' ? 'رد الزيادة 👆' : 'Return Extra 👆'}
                    </span>
                  </div>
                ) : (
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-900/60 border border-emerald-400/50 text-emerald-300 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'ar' ? 'تم رد الـ 20 ريالاً للبائع' : '20 SAR returned to cashier'}</span>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-stone-300">
                {isBillPickedUp
                  ? lang === 'ar'
                    ? '✨ أديت الأمانة كاملة، وبقي معك حقك الشرعي (15 ريالاً)'
                    : 'Amanah fulfilled! You kept your exact change (15 SAR)'
                  : lang === 'ar'
                  ? 'حقك الشرعي: 15 ريالاً فقط. انقر على الورقة الزائدة (20 ر.س) لردها للبائع.'
                  : 'Your rightful change is 15 SAR. Tap the extra 20 SAR to return it.'}
              </span>
            </div>
          </div>

          {/* Bottom Action / Feedback */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            {!isBillPickedUp ? (
              <button
                type="button"
                onClick={handleReturnMoney}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#88C947] to-[#73b036] hover:from-[#95dc4f] hover:to-[#88C947] text-[#162923] text-sm font-black shadow-gold hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>{lang === 'ar' ? 'أداء الأمانة: إعادة الـ 20 ريالاً للبائع فوراً' : 'Fulfill Amanah: Return 20 SAR Now'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs sm:text-sm">
                <Sparkles className="w-5 h-5 text-[#D4A373] animate-spin" />
                <span>
                  {lang === 'ar'
                    ? 'ما شاء الله! كسبت +15 نقطة سكينة ويقين بأداء الأمانة 🌿'
                    : '+15 Serenity points earned by upholding Amanah!'}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowSources(!showSources)}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#88C947]" />
              <span>{lang === 'ar' ? 'التأصيل الشرعي' : 'Scholarly Evidence'}</span>
            </button>
          </div>
        </div>

        {/* Sourced Reference Drawer */}
        {showSources && (
          <div className="mt-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 space-y-1.5 animate-fade-in">
            <h5 className="font-black text-emerald-900 flex items-center gap-1.5">
              <span>📜 هدي النبي ﷺ في الأمانة:</span>
            </h5>
            <p className="font-serif leading-relaxed">
              عن أبي هريرة رضي الله عنه قال: قال رسول الله ﷺ: «أَدِّ الأَمَانَةَ إِلَى مَنِ ائْتَمَنَكَ، وَلا تَخُنْ مَنْ خَانَكَ» (رواه أبو داود 3535 والترمذي 1264 وصححه الألباني).
            </p>
            <p className="text-[11px] text-emerald-800">
              الأمانة في البيع والشراء وبركة الرزق الحلال تورث طمأنينة القلب وانشراح الصدر في الدنيا والآخرة.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 mt-3 border-t border-[#D4A373]/20 flex items-center justify-between text-xs">
          <span className="text-stone-500 font-medium">
            {lang === 'ar' ? 'تجربة تفاعلية تابعة لمعلم السوق والمعرفة' : 'Interactive experience in Market & Knowledge'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#2C483F] font-bold transition-colors cursor-pointer"
          >
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
