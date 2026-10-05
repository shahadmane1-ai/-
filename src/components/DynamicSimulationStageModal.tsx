import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Droplets,
  Heart,
  Compass,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import { RafiqExperiencePayload, Language } from '../types';
import { playPeaceChime, playSoftTap } from '../utils/audio';

interface DynamicSimulationStageModalProps {
  payload: RafiqExperiencePayload;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onAdjustScore: (delta: number, label: string, type: 'peace' | 'stress') => void;
  onNavigateToCity?: () => void;
}

export const DynamicSimulationStageModal: React.FC<DynamicSimulationStageModalProps> = ({
  payload,
  isOpen,
  onClose,
  lang,
  onAdjustScore,
  onNavigateToCity,
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [hasTriggeredSahw, setHasTriggeredSahw] = useState(false);
  const [waterEconomyLevel, setWaterEconomyLevel] = useState<number>(1); // 1 = Sunnah Mudd, 2 = Moderate, 3 = Excessive
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen || !payload) return null;

  const totalSteps = payload.interactiveElements.length;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / (totalSteps || 1)) * 100);

  const handleStepClick = (elementId: string) => {
    playSoftTap();
    const updated = {
      ...completedSteps,
      [elementId]: !completedSteps[elementId],
    };
    setCompletedSteps(updated);

    const newCompletedCount = Object.values(updated).filter(Boolean).length;
    if (newCompletedCount === totalSteps && !isFinished) {
      setIsFinished(true);
      playPeaceChime();
      onAdjustScore(
        payload.tranquilityDelta || 10,
        lang === 'ar' ? `+${payload.tranquilityDelta || 10} إتمام التدريب الحركي العملي` : `+${payload.tranquilityDelta || 10} Practical Motor Practice Completed`,
        'peace'
      );
    }
  };

  const handleSahwRecovery = () => {
    playPeaceChime();
    setHasTriggeredSahw(true);
    onAdjustScore(
      10,
      lang === 'ar' ? '+10 سجدتا السهو للتدارك وطرد الشك' : '+10 Sujud Sahw Recovery',
      'peace'
    );
  };

  const handleReset = () => {
    playSoftTap();
    setCompletedSteps({});
    setHasTriggeredSahw(false);
    setIsFinished(false);
  };

  const sceneConfig = {
    PRAYER: {
      titleAr: 'محراب الصلاة الحركي وتدارك السهو',
      titleEn: 'Prayer Motor Sanctuary & Sahw Recovery',
      themeGradient: 'from-[#2C483F] to-[#1f342e]',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      icon: Sparkles,
      guidanceAr: 'رتب أركان صلاتك باطمئنان وسكينة، وتذكر أن السهو يطرأ على كل مصلٍّ وعلاجه يسير بسجدتي السهو.',
      guidanceEn: 'Move peacefully through prayer pillars; forgetfulness is natural and easily healed through Sujud Sahw.',
    },
    WUDU: {
      titleAr: 'محطة الطهارة والوضوء المقتصد',
      titleEn: 'Wudu Cleanliness & Water Economy Station',
      themeGradient: 'from-[#1E3A8A] to-[#1e293b]',
      badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
      icon: Droplets,
      guidanceAr: 'اغسل الأعضاء باعتدال دون إفراط في الماء، واستحضر يقين الطهارة النبوية: «اليقين لا يزول بالشك».',
      guidanceEn: 'Perform wudu moderately with minimal water, resting in certainty: certainty dispels doubt.',
    },
    SOCIAL: {
      titleAr: 'الموقف الاجتماعي الهادئ والتعامل الودود',
      titleEn: 'Social Confidence & Respectful Conduct',
      themeGradient: 'from-[#9A3412] to-[#78350F]',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: Heart,
      guidanceAr: 'التوتر أمام الأهل أو الزملاء طبيعي؛ قابله بالابتسامة، والسكينة الداخلية، والرفق في المعاملة.',
      guidanceEn: 'Social hesitation is natural; meet it with warmth, calm breath, and gentle presence.',
    },
    ENVIRONMENT: {
      titleAr: 'المحاكاة الحركية للبيئة اليومية',
      titleEn: 'Everyday Environmental Simulation',
      themeGradient: 'from-[#065F46] to-[#047857]',
      badgeBg: 'bg-teal-100 text-teal-900 border-teal-300',
      icon: Compass,
      guidanceAr: 'تجربة حركية ميسرة لتأصيل العبادة وسط مشاغل العمل والجامعة والحياة اليومية.',
      guidanceEn: 'A hands-on simulation to anchor worship amidst everyday work and study.',
    },
  }[payload.sceneType] || {
    titleAr: 'التجربة العملية الحركية التفاعلية',
    titleEn: 'Interactive Motor Simulation',
    themeGradient: 'from-[#2C483F] to-[#1f342e]',
    badgeBg: 'bg-stone-100 text-stone-900 border-stone-300',
    icon: Sparkles,
    guidanceAr: 'تطبيق عملي ميسر لتجاوز الحرج وترسيخ السكينة.',
    guidanceEn: 'Hands-on practice to remove friction and anchor peace.',
  };

  const HeaderIcon = sceneConfig.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#D4A373]/40 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`p-5 sm:p-6 bg-gradient-to-r ${sceneConfig.themeGradient} text-white flex items-start justify-between relative`}>
          <div className="space-y-1.5 pe-8">
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${sceneConfig.badgeBg}`}>
                {payload.sceneType}
              </span>
              <span className="text-[11px] font-bold text-amber-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>+{payload.tranquilityDelta || 10} {lang === 'ar' ? 'سكينة' : 'Tranquility'}</span>
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black flex items-center gap-2">
              <HeaderIcon className="w-5 h-5 text-amber-300" />
              <span>{lang === 'ar' ? sceneConfig.titleAr : sceneConfig.titleEn}</span>
            </h3>
            <p className="text-xs text-white/85 leading-relaxed">
              {lang === 'ar' ? sceneConfig.guidanceAr : sceneConfig.guidanceEn}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              playSoftTap();
              onClose();
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-start">
          {/* Core Action Callout */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2C483F]" />
              <span>{lang === 'ar' ? 'التوجيه الحركي المستهدف' : 'Targeted Practical Action'}</span>
            </div>
            <p className="text-sm font-black text-[#2C483F] leading-snug">
              {payload.coreAction}
            </p>
          </div>

          {/* Interactive Steps Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-[#2C483F] flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>{lang === 'ar' ? 'الخطوات التفاعلية (المس للتطبيق):' : 'Interactive Steps (Tap to Execute):'}</span>
              </h4>
              <span className="text-[11px] font-mono font-bold text-stone-500">
                {completedCount} / {totalSteps} {lang === 'ar' ? 'مكتمل' : 'done'} ({progressPercent}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#88C947] to-[#2C483F] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Step Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {payload.interactiveElements.map((el, index) => {
                const isChecked = !!completedSteps[el.id];
                return (
                  <button
                    key={el.id}
                    type="button"
                    onClick={() => handleStepClick(el.id)}
                    className={`p-3.5 rounded-2xl border text-start flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs'
                        : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                          isChecked
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {isChecked ? '✓' : index + 1}
                      </span>
                      <span className="text-xs font-bold leading-tight">{el.label}</span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isChecked
                          ? 'bg-emerald-500 border-emerald-600 text-white'
                          : 'border-stone-300'
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Domain Widget: PRAYER -> Sujud Sahw Recovery Button */}
          {payload.sceneType === 'PRAYER' && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-emerald-50 border border-amber-300/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{lang === 'ar' ? 'زر التدارك الفوري: سجدتا السهو 🕊️' : 'Instant Sahw Recovery Action'}</span>
                </span>
                {hasTriggeredSahw && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {lang === 'ar' ? 'تم جبر السهو والاطمئنان' : 'Sahw Healed'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-amber-950 leading-relaxed">
                {lang === 'ar'
                  ? 'إذا شككت في عدد الركعات أو نسيت التشهد الأول، فابنِ على ما تيقنت (الأقل)، واسجد سجدتين قبل السلام أو بعده ثم سلم. صلاتك صحيحة ومقبولة بإذن الله.'
                  : 'If doubt arises about rakahs or first tashahhud, build upon certainty (the lesser) and perform two prostrations. Your prayer is fully valid.'}
              </p>
              <button
                type="button"
                onClick={handleSahwRecovery}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold shadow-soft flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>🕊️ {lang === 'ar' ? 'تطبيق سجدتي السهو الآن (طرد الوسواس وجبر الخلل)' : 'Perform Sujud Sahw (Expel Doubt)'}</span>
              </button>
            </div>
          )}

          {/* Special Domain Widget: WUDU -> Water Economy Gauge & Certainty */}
          {payload.sceneType === 'WUDU' && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  <span>{lang === 'ar' ? 'مقياس الاقتصاد النبوي في الماء 💧' : 'Prophetic Water Economy Gauge'}</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                  {waterEconomyLevel === 1 ? 'سنة نبوية (المُدّ)' : waterEconomyLevel === 2 ? 'معتدل' : 'مفرط (مكروه)'}
                </span>
              </div>
              <p className="text-[11px] text-blue-950 leading-relaxed">
                {lang === 'ar'
                  ? 'كان النبي ﷺ يتوضأ بالمُدّ (ملء الكفين فقط). الإسراف يفتح باب الوسواس والشك. اضبط صنبور الماء على التدفق الهادئ المقتصد.'
                  : 'The Prophet ﷺ performed wudu with just a mudd (cupped hands). Moderation dispels waswas.'}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playSoftTap();
                    setWaterEconomyLevel(1);
                  }}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    waterEconomyLevel === 1
                      ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                      : 'bg-white text-blue-900 border-blue-200'
                  }`}
                >
                  💧 {lang === 'ar' ? 'اقتصاد وسنة (مُدّ)' : 'Sunnah (Mudd)'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playSoftTap();
                    setWaterEconomyLevel(2);
                  }}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    waterEconomyLevel === 2
                      ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                      : 'bg-white text-blue-900 border-blue-200'
                  }`}
                >
                  💧 {lang === 'ar' ? 'معتدل' : 'Moderate'}
                </button>
              </div>
            </div>
          )}

          {/* Completion Celebration Card */}
          {isFinished && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 font-black text-xs text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{lang === 'ar' ? 'بارك الله فيك! أتممت التجربة العملية الحركية بنجاح 🌿' : 'Well done! Practical simulation completed.'}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-900">
                {lang === 'ar'
                  ? `تم تخفيض الحمل المعرفي وتعزيز السكينة لديك بمقدار +${payload.tranquilityDelta || 10} نقطة. الممارسة الحركية المتكررة تبدد الشك وتبني الثقة في وجدانك.`
                  : 'Cognitive friction has been lifted and tranquility enhanced.'}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'إعادة التجربة' : 'Reset'}</span>
          </button>

          <div className="flex items-center gap-2">
            {onNavigateToCity && (
              <button
                type="button"
                onClick={() => {
                  playSoftTap();
                  onClose();
                  onNavigateToCity();
                }}
                className="px-4 py-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-[#2C483F] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>{lang === 'ar' ? 'الانتقال لخريطة المدينة 🏙️' : 'City Map'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                playSoftTap();
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-[#2C483F] hover:bg-[#20362f] text-white text-xs font-black shadow-soft flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{lang === 'ar' ? 'إتمام ومتابعة' : 'Done & Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
