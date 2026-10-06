import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  Droplet,
  Sparkles,
  RefreshCw,
  Feather,
  Compass,
} from 'lucide-react';
import { Language } from '../types';
import { playPeaceChime, playSoftTap, playStressReleaseTone } from '../utils/audio';

interface InteractiveTranquilityStationProps {
  onAdjustScore: (delta: number, label: string, type: 'peace' | 'stress') => void;
  lang: Language;
}

export const InteractiveTranquilityStation: React.FC<InteractiveTranquilityStationProps> = ({
  onAdjustScore,
  lang,
}) => {
  // Tabs: 'heartbeat' (Heartbeat Pulse at Mosque Gate) | 'wudu_gauge' (Sunnah Wudu Gauge) | 'offload' (Thought Offload)
  const [activeTab, setActiveTab] = useState<'heartbeat' | 'wudu_gauge' | 'offload'>('heartbeat');

  // 1. Heartbeat Pulse at Mosque Gate state
  const [heartBpm, setHeartBpm] = useState<number>(150);
  const [isCalming, setIsCalming] = useState<boolean>(false);
  const [pulseCount, setPulseCount] = useState<number>(0);
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
        heartbeatTimerRef.current = null;
      }
    };
  }, []);

  // 2. Sunnah Wudu Water Gauge state
  const [wuduMl, setWuduMl] = useState<number>(0);
  const [wuduRinses, setWuduRinses] = useState<number>(0);
  const [wuduFlowing, setWuduFlowing] = useState<boolean>(false);

  // 3. Offload state
  const [worryText, setWorryText] = useState('');
  const [isOffloaded, setIsOffloaded] = useState(false);

  // Heartbeat Calming Interactive Effect
  const handleCalmHeartbeat = () => {
    playSoftTap();
    setIsCalming(true);

    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
    }

    heartbeatTimerRef.current = setInterval(() => {
      setHeartBpm((prev) => {
        const nextBpm = prev - 6;
        if (nextBpm <= 72) {
          if (heartbeatTimerRef.current) {
            clearInterval(heartbeatTimerRef.current);
            heartbeatTimerRef.current = null;
          }
          setTimeout(() => {
            setIsCalming(false);
            playPeaceChime();
            onAdjustScore(15, lang === 'ar' ? '+15 سكينة (خفض نبض القلب)' : '+15 Serenity (Heart Calmed)', 'peace');
          }, 0);
          return 72;
        }
        return nextBpm;
      });
      setPulseCount((c) => c + 1);
    }, 280);
  };

  const handleResetHeartbeat = () => {
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
    playSoftTap();
    setIsCalming(false);
    setHeartBpm(150);
    setPulseCount(0);
  };

  // Sunnah Wudu Dispenser
  const handleWuduRinse = () => {
    if (wuduRinses >= 3) {
      playStressReleaseTone();
      return;
    }

    playSoftTap();
    setWuduFlowing(true);
    const nextRinses = wuduRinses + 1;
    const nextMl = wuduMl + 215;

    setWuduRinses(nextRinses);
    setWuduMl(nextMl);

    setTimeout(() => {
      setWuduFlowing(false);
      if (nextRinses === 3) {
        playPeaceChime();
        onAdjustScore(15, lang === 'ar' ? '+15 سنة نبوية (اقتصاد بالوضوء)' : '+15 Sunnah Water Economy', 'peace');
      }
    }, 500);
  };

  const handleResetWudu = () => {
    playSoftTap();
    setWuduMl(0);
    setWuduRinses(0);
  };

  // Offload submit
  const handleOffloadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!worryText.trim()) return;

    playStressReleaseTone();
    setIsOffloaded(true);
    onAdjustScore(-10, lang === 'ar' ? '-10 توتر (تفويض وتوكل)' : '-10 Stress (Tawakkul)', 'stress');

    setTimeout(() => {
      setWorryText('');
      setIsOffloaded(false);
    }, 3200);
  };

  return (
    <section className="py-6 select-none text-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C483F]">
              {lang === 'ar' ? 'واحة تنظيم المشاعر' : 'Emotional Regulation Oasis'}
            </h2>
            <span className="px-3 py-1 rounded-full bg-amber-100/90 text-[#2C483F] text-xs font-bold border border-amber-300/70 shadow-xs">
              {lang === 'ar' ? 'هل أنت متوتر؟' : 'Feeling stressed?'}
            </span>
          </div>

          {/* Interactive Navigation Tabs for Physical Exercises */}
          <div className="flex items-center p-1 bg-white/90 backdrop-blur-md rounded-2xl border border-[#D4A373]/30 shadow-xs flex-wrap">
            <button
              type="button"
              onClick={() => {
                playSoftTap();
                setActiveTab('heartbeat');
              }}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'heartbeat'
                  ? 'bg-[#2C483F] text-white shadow-soft'
                  : 'text-[#2C483F]/70 hover:text-[#2C483F]'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>{lang === 'ar' ? 'نبض عتبة المسجد' : 'Mosque Gate Pulse'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playSoftTap();
                setActiveTab('wudu_gauge');
              }}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'wudu_gauge'
                  ? 'bg-[#2C483F] text-white shadow-soft'
                  : 'text-[#2C483F]/70 hover:text-[#2C483F]'
              }`}
            >
              <Droplet className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'ar' ? 'مقياس المُدّ والوضوء' : 'Mudd & Wudu Gauge'}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Active 2D Heartbeat Pulse at the Mosque Gate */}
        {activeTab === 'heartbeat' && (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#D4A373]/30 p-6 sm:p-8 shadow-soft animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-6 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#1E293B] to-[#0F172A] rounded-3xl border-2 border-slate-700 text-white relative overflow-hidden min-h-[360px]">
                {/* Calculated gradual color interpolation (Red to Green via HSL) */}
                {(() => {
                  const bpmProgress = Math.max(0, Math.min(1, (150 - heartBpm) / (150 - 60)));
                  const heartHue = bpmProgress * 120; // 0 is red, 120 is green
                  const heartColor = `hsl(${heartHue}, 100%, 50%)`;
                  const heartBg = `hsla(${heartHue}, 90%, 15%, 0.7)`;
                  const heartBorder = `3px solid hsl(${heartHue}, 100%, 45%)`;
                  const heartGlow = `0 0 40px hsla(${heartHue}, 100%, 50%, 0.4)`;

                  const handleHeartTap = () => {
                    if (heartBpm <= 60) return;
                    playSoftTap();
                    setHeartBpm((prev) => {
                      const next = prev - 10;
                      if (next <= 60) {
                        playPeaceChime();
                        onAdjustScore(15, lang === 'ar' ? '+15 سكينة (خفض نبض القلب)' : '+15 Serenity (Heart Calmed)', 'peace');
                        return 60;
                      }
                      return next;
                    });
                  };

                  return (
                    <>
                      {/* Radial Pulse Waves with dynamic color */}
                      <div
                        className="absolute inset-0 rounded-full animate-ping pointer-events-none opacity-40"
                        style={{
                          animationDuration: `${120 / heartBpm}s`,
                          backgroundColor: `hsla(${heartHue}, 100%, 50%, 0.1)`,
                        }}
                      />

                      <div className="relative z-10 flex flex-col items-center justify-center w-full">
                        {/* Tap Instructions */}
                        <span className="text-xs font-bold text-rose-300 mb-4 animate-bounce tracking-wide">
                          {lang === 'ar' ? 'اضغط على القلب مباشرة لتخفيف التوتر 👇' : 'Tap the heart directly to release tension 👇'}
                        </span>

                        {/* LARGE TACTILE HEART IN CENTER */}
                        <div
                          onClick={handleHeartTap}
                          className="w-40 h-40 sm:w-44 sm:h-44 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 select-none"
                          style={{
                            background: heartBg,
                            border: heartBorder,
                            boxShadow: heartGlow,
                          }}
                        >
                          <Heart
                            className="w-20 h-20 sm:w-24 sm:h-24 transition-all duration-300 fill-current"
                            style={{
                              color: heartColor,
                              transform: `scale(${1 + (heartBpm / 300)})`,
                              animation: `pulse ${60 / heartBpm}s infinite alternate ease-in-out`,
                            }}
                          />
                        </div>

                        {/* Pulse Rate Display Below Heart */}
                        <div className="mt-6 text-center space-y-1">
                          <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight transition-all duration-300 block" style={{ color: `hsl(${heartHue}, 100%, 75%)` }}>
                            {heartBpm} <span className="text-lg font-bold text-stone-300">BPM</span>
                          </span>
                          <span className="text-xs block text-stone-300 font-extrabold max-w-xs leading-relaxed">
                            {heartBpm > 130
                              ? lang === 'ar' ? '⚠️ توتر عالي جداً ونبض متسارع (اضغط لتخفيف التوتر)' : '⚠️ Extremely high stress (Tap to soothe)'
                              : heartBpm > 100
                              ? lang === 'ar' ? '⚠️ نبض متسارع عند عتبة المسجد (رهبة البداية)' : '⚠️ Accelerated Pulse (Mosque Threshold Hesitation)'
                              : heartBpm > 70
                              ? lang === 'ar' ? '✨ بدأ التوتر بالتلاشي والهدوء يقترب' : '✨ Tension easing, tranquility near'
                              : lang === 'ar' ? '✨ نبض مستقر وسكينة تامة (60 نبضة)' : '✨ Steady Calm & Inner Peace (60 BPM)'}
                          </span>
                        </div>
                      </div>

                      {/* Reset Control */}
                      <div className="mt-6 flex items-center gap-3 relative z-10">
                        {heartBpm <= 60 && (
                          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                            {lang === 'ar' ? 'تمت السكينة واستقرار النبض ✅' : 'Heart Rate Stabilized ✅'}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={handleResetHeartbeat}
                          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-stone-300 cursor-pointer transition-all border border-slate-700 hover:scale-105"
                          title={lang === 'ar' ? 'إعادة المحاكاة' : 'Reset'}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="md:col-span-6 space-y-4 text-start">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
                  <h4 className="text-sm font-black text-[#2C483F] flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#D4A373]" />
                    <span>{lang === 'ar' ? 'هدي النبي ﷺ عند دخول المسجد' : 'Prophetic Guidance upon Entering the Mosque'}</span>
                  </h4>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {lang === 'ar'
                      ? '«إذا أتيتم الصلاة فعليكم بالسكينة والوقار، فما أدركتم فصلوا، وما فاتكم فأتموا». لا تركض ولا تقلق من نظرات المصلين، فكل من في المسجد أخٌ لك يفرح بقدومك.'
                      : '"When you come to prayer, observe tranquility and dignity; pray what you catch, and complete what you missed." Walk calmly; every worshipper inside rejoices to welcome you.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
                  <span className="font-bold text-[#2C483F] block">
                    {lang === 'ar' ? 'التطبيق الفسيولوجي المباشر:' : 'Physiological Mechanism:'}
                  </span>
                  <p>
                    {lang === 'ar'
                      ? 'التركيز على خفض نبض القلب يخفف نشاط الجهاز العصبي الودي ويفرز هرمونات الطمأنينة استعداداً للوقوف بين يدي الله.'
                      : 'Focused somatic grounding down-regulates sympathetic nervous tension, anchoring the soul in deep presence.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Active 2D Sunnah Wudu Water Gauge */}
        {activeTab === 'wudu_gauge' && (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#D4A373]/30 p-6 sm:p-8 shadow-soft animate-fade-in space-y-4">
            {/* Top Wudu Category Badge */}
            <div className="flex items-center justify-between border-b border-[#D4A373]/20 pb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100/90 text-cyan-900 text-xs font-black border border-cyan-300 shadow-xs">
                <Droplet className="w-3.5 h-3.5 text-cyan-600" />
                <span>{lang === 'ar' ? 'وسواس الوضوء؟' : 'Wudu Doubts?'}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-6 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#0F1E28] to-[#081218] rounded-3xl border-2 border-cyan-900 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center">
                  {/* Faucet and Beaker Visual */}
                  <div className="w-32 h-44 rounded-b-2xl border-4 border-cyan-400/40 bg-slate-900/80 p-2 relative flex flex-col justify-end overflow-hidden shadow-inner">
                    {/* Measurement Ticks */}
                    <div className="absolute top-2 start-2 text-[9px] font-mono text-cyan-300">650 ml (المُدّ)</div>
                    <div className="absolute top-1/2 start-2 text-[9px] font-mono text-cyan-500">325 ml</div>

                    {/* Water Level */}
                    <div
                      className="w-full bg-gradient-to-t from-cyan-500 to-teal-300 rounded-b-lg transition-all duration-500 shadow-md"
                      style={{ height: `${Math.min(100, (wuduMl / 650) * 100)}%` }}
                    />
                  </div>

                  <div className="mt-4 text-center">
                    <span className="text-3xl font-black font-mono text-cyan-300">
                      {wuduMl} <span className="text-sm font-normal text-stone-400">/ 650 ml</span>
                    </span>
                    <span className="text-xs block text-stone-300 font-bold mt-1">
                      {lang === 'ar' ? `عدد الغسلات: ${wuduRinses} من 3` : `Rinses: ${wuduRinses} of 3 max`}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3 relative z-10">
                  <button
                    type="button"
                    disabled={wuduRinses >= 3 || wuduFlowing}
                    onClick={handleWuduRinse}
                    className={`px-5 py-2.5 rounded-2xl font-bold text-xs shadow-soft transition-all ${
                      wuduRinses >= 3
                        ? 'bg-cyan-800 text-stone-300 cursor-default'
                        : 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white hover:scale-105 active:scale-95'
                    }`}
                  >
                    {wuduRinses >= 3
                      ? lang === 'ar' ? 'اكتمل الوضوء النبوي المبارك ✅' : 'Prophetic Limit Achieved ✅'
                      : lang === 'ar' ? 'اسكب ماء الغسلة التالية 💧' : 'Dispense Gentle Rinse 💧'}
                  </button>

                  <button
                    type="button"
                    onClick={handleResetWudu}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-stone-300"
                    title={lang === 'ar' ? 'إعادة المحاكاة' : 'Reset'}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="md:col-span-6 space-y-4 text-start">
                <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-950 space-y-2">
                  <h4 className="text-sm font-black text-[#2C483F] flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-cyan-600" />
                    <span>{lang === 'ar' ? 'حكمة الاقتصاد في ماء الوضوء' : 'Wisdom of Prophetic Water Conservation'}</span>
                  </h4>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {lang === 'ar'
                      ? 'مر النبي ﷺ بسعد وهو يتوضأ فقال: «ما هذا السرف يا سعد؟» قال: أفي الوضوء سرف؟ قال: «نعم، وإن كنت على نهر جارٍ». التكرار الزائد عن 3 يفتح باب الوسوسة، بينما السير على قدر الكفاية يورث الطمأنينة.'
                      : 'The Prophet ﷺ passed by Sa’d washing and said: "What is this excess, O Sa’d?" Sa’d asked: "Is there excess in ablution?" He replied: "Yes, even if by a flowing river." Moderation closes the doors of doubt.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
                  <span className="font-bold text-[#2C483F] block">
                    {lang === 'ar' ? 'كسر وسواس الطهارة:' : 'Defeating Purity Waswas:'}
                  </span>
                  <p>
                    {lang === 'ar'
                      ? 'إذا انتهيت من غسل العضو ثلاثاً، فاليقين حصل، ولا تلتفت لأي وسوسة بعد ذلك لأن الشريعة لا تكلفك بالمستحيل.'
                      : 'Once washed three times, certainty is established. Refuse any compulsive repetition.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Thought Offload */}
        {activeTab === 'offload' && (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#D4A373]/30 p-6 sm:p-8 shadow-soft animate-fade-in">
            <div className="max-w-xl mx-auto space-y-4 text-center">
              <div className="text-start space-y-1">
                <h4 className="text-sm font-bold text-[#2C483F]">
                  {lang === 'ar' ? 'تفويض القلق والهموم إلى الله تعالى (التوكل)' : 'Entrusting Worries to Allah (Tawakkul)'}
                </h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {lang === 'ar'
                    ? 'اكتب ما يقلقك أو يثقل صدرك اليوم، ثم فوضه بالدعاء لله، واشعر بانجلاء الهم.'
                    : 'Write whatever weighs heavy on your chest, release it to Allah in prayer, and feel the lightness return.'}
                </p>
              </div>

              <form onSubmit={handleOffloadSubmit} className="space-y-3">
                <textarea
                  value={worryText}
                  onChange={(e) => setWorryText(e.target.value)}
                  placeholder={
                    lang === 'ar'
                      ? 'أودع هنا قلقك (مثلاً: أخشى من ردة فعل زملائي في العمل، أو صعوبة الاستيقاظ للفجر)...'
                      : 'Entrust your anxiety here (e.g. fear of coworker opinions, early Fajr waking)...'
                  }
                  rows={3}
                  className="w-full p-3.5 rounded-2xl border border-[#D4A373]/30 focus:border-[#D4A373] focus:ring-2 focus:ring-[#D4A373]/20 text-xs text-[#2C483F] outline-none"
                />

                <button
                  type="submit"
                  disabled={!worryText.trim() || isOffloaded}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2C483F] to-[#1f342d] text-white font-bold text-xs shadow-soft hover:shadow-gold transition-all active:scale-95"
                >
                  {isOffloaded
                    ? lang === 'ar' ? 'تم التفويض لله تعالى.. سكينة وطمأنينة 🕊️' : 'Entrusted to Allah.. Peace Descends 🕊️'
                    : lang === 'ar' ? 'تفويض وإرسال إلى الله (-10 توتر)' : 'Release & Entrust (-10 Stress)'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
