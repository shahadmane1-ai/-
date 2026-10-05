import React, { useState } from 'react';
import { Sparkles, Heart, Activity, ArrowUpRight, ArrowDownRight, Wind } from 'lucide-react';
import { FloatingBadge, Language } from '../types';
import { playPeaceChime, playStressReleaseTone } from '../utils/audio';

interface TranquilityIndexProps {
  score: number;
  recentBadges: FloatingBadge[];
  onAdjustScore: (delta: number, label: string, type: 'peace' | 'stress') => void;
  lang?: Language;
}

export const TranquilityIndex: React.FC<TranquilityIndexProps> = ({
  score,
  recentBadges,
  onAdjustScore,
  lang = 'ar',
}) => {
  const [showQuickModal, setShowQuickModal] = useState(false);

  // Dynamic status descriptor based on score
  const getStatus = (val: number) => {
    if (val >= 80) {
      return {
        labelAr: 'طمأنينة ورضا تام',
        labelEn: 'Serene & Deep Peace',
        color: '#2C483F',
        bg: 'bg-emerald-50',
      };
    }
    if (val >= 60) {
      return {
        labelAr: 'سكينة مستقرة',
        labelEn: 'Stable Tranquility',
        color: '#2C483F',
        bg: 'bg-[#FBF9F5]',
      };
    }
    if (val >= 40) {
      return {
        labelAr: 'هدوء متوازن',
        labelEn: 'Balanced Calm',
        color: '#D4A373',
        bg: 'bg-amber-50/50',
      };
    }
    return {
      labelAr: 'بحاجة إلى استراحة وتدبر',
      labelEn: 'Needs Gentle Rest',
      color: '#C89B84',
      bg: 'bg-rose-50/50',
    };
  };

  const status = getStatus(score);

  const handlePeaceBoost = () => {
    playPeaceChime();
    onAdjustScore(10, lang === 'ar' ? '+10 سكينة' : '+10 Peace', 'peace');
  };

  const handleStressRelease = () => {
    playStressReleaseTone();
    onAdjustScore(-5, lang === 'ar' ? '-5 توتر' : '-5 Stress', 'stress');
  };

  return (
    <div className="relative inline-flex items-center">
      {/* Main Pill Surface with Rose-Gold border and backdrop blur */}
      <div
        onClick={() => setShowQuickModal(!showQuickModal)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setShowQuickModal(!showQuickModal)}
        className="group relative cursor-pointer flex items-center gap-2.5 px-3.5 py-1.5 bg-white/90 backdrop-blur-md border border-[#D4A373]/40 rounded-full shadow-soft hover:border-[#D4A373] hover:shadow-gold transition-all duration-300"
        title={lang === 'ar' ? 'مقياس السكينة - انقر لتحديث حالتك' : 'Tranquility Index - Click to interact'}
      >
        {/* Pulsing Combined Heart & Star Emblem */}
        <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-[#D4A373]/20 to-[#88C947]/20 text-[#2C483F]">
          {/* Animated pulse halo */}
          <span className="absolute inset-0 rounded-full bg-[#D4A373]/25 animate-ping opacity-75" />

          {/* Icon morph or composite */}
          <Heart className="w-3.5 h-3.5 text-[#2C483F] fill-[#D4A373]/40 animate-pulse relative z-10" />
          <Sparkles className="w-2.5 h-2.5 text-[#D4A373] absolute -top-0.5 -right-0.5 z-20 animate-spin" style={{ animationDuration: '8s' }} />
        </div>

        {/* Text Metric & Percentage */}
        <div className="flex items-center gap-1.5">
          <div className="flex flex-col text-start">
            <span className="text-[10px] text-[#2C483F]/70 font-medium leading-none flex items-center gap-1">
              <span>{lang === 'ar' ? 'مقياس السكينة' : 'Tranquility Index'}</span>
              <Activity className="w-2.5 h-2.5 text-[#88C947]" />
            </span>
            <span className="text-xs font-semibold text-[#2C483F] leading-tight">
              {lang === 'ar' ? status.labelAr : status.labelEn}
            </span>
          </div>

          <div className="h-4 w-[1px] bg-[#D4A373]/30 mx-0.5" />

          {/* Numeric Score */}
          <div className="flex items-baseline">
            <span className="text-base font-extrabold font-mono tabular-nums text-[#2C483F] tracking-tight">
              {score}
            </span>
            <span className="text-[11px] font-bold text-[#D4A373] ml-0.5">%</span>
          </div>
        </div>

        {/* Mini indicator dot */}
        <div
          className="w-2 h-2 rounded-full transition-colors duration-500"
          style={{ backgroundColor: score >= 60 ? '#88C947' : '#D4A373' }}
        />
      </div>

      {/* Floating Change Badges (+10 Peace / -5 Stress) */}
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center gap-1">
        {recentBadges.slice(-3).map((badge) => (
          <div
            key={badge.id}
            className={`animate-bounce px-2 py-0.5 rounded-full text-[11px] font-bold shadow-md border ${
              badge.type === 'peace'
                ? 'bg-[#88C947] text-white border-[#6EA832]'
                : badge.type === 'stress'
                ? 'bg-[#D4A373] text-white border-[#B98656]'
                : 'bg-white text-[#2C483F] border-[#2C483F]/20'
            }`}
          >
            {badge.text}
          </div>
        ))}
      </div>

      {/* Quick Interactive Dropdown Card */}
      {showQuickModal && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-72 z-50 bg-white/95 backdrop-blur-md rounded-2xl border border-[#D4A373]/40 p-4 shadow-soft-lg text-start">
          <div className="flex items-center justify-between pb-2 border-b border-[#D4A373]/20">
            <span className="text-xs font-bold text-[#2C483F]">
              {lang === 'ar' ? 'تحديث مقياس السكينة اليومي' : 'Update Live Tranquility'}
            </span>
            <button
              onClick={() => setShowQuickModal(false)}
              className="text-[#2C483F]/50 hover:text-[#2C483F] text-xs font-bold p-1"
            >
              ✕
            </button>
          </div>

          <div className="py-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[#2C483F]/70">{lang === 'ar' ? 'الحالة الحالية' : 'Current State'}</span>
              <span className="font-bold text-[#2C483F]">{score}%</span>
            </div>
            {/* Progress Bar with Rose Gold Halo */}
            <div className="w-full h-2 bg-[#FBF9F5] rounded-full overflow-hidden border border-[#D4A373]/20">
              <div
                className="h-full bg-gradient-to-r from-[#D4A373] via-[#88C947] to-[#2C483F] transition-all duration-700 rounded-full"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#D4A373]/15">
            <button
              type="button"
              onClick={handlePeaceBoost}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#88C947]/15 hover:bg-[#88C947]/25 text-[#2C483F] text-xs font-semibold rounded-xl border border-[#88C947]/30 transition-colors"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-[#88C947]" />
              <span>{lang === 'ar' ? '+10 سكينة' : '+10 Peace'}</span>
            </button>

            <button
              type="button"
              onClick={handleStressRelease}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#D4A373]/15 hover:bg-[#D4A373]/25 text-[#2C483F] text-xs font-semibold rounded-xl border border-[#D4A373]/30 transition-colors"
            >
              <ArrowDownRight className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>{lang === 'ar' ? '-5 توتر' : '-5 Stress'}</span>
            </button>
          </div>

          <div className="mt-3 text-[11px] text-[#2C483F]/70 bg-[#FBF9F5] p-2 rounded-xl flex items-center gap-2">
            <Wind className="w-4 h-4 text-[#D4A373] shrink-0" />
            <p className="leading-tight">
              {lang === 'ar'
                ? '«ألا بذكر الله تطمئن القلوب» - ينعكس تفاعلك فوراً على مؤشرك'
                : '"Verily in the remembrance of Allah do hearts find rest"'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
