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

export const GameFamilyCommunication: React.FC<DispatcherProps> = ({ experience, lang, onFinish }) => {
  const [selectedApproach, setSelectedApproach] = useState<'calm' | 'defiant' | 'defensive' | null>(null);
  const [teaServed, setTeaServed] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const scn44 = getScenarioById('SCN_044');
  const scn43 = getScenarioById('SCN_043');

  const handleChooseApproach = (type: 'calm' | 'defiant' | 'defensive') => {
    playSoftTap();
    setSelectedApproach(type);
    if (type === 'calm') {
      playPeaceChime();
      setIsCompleted(true);

      // Record deterministic learning progression for bound production scenarios
      recordScenarioAttempt(
        'SCN_044',
        true,
        ['وجوب البر والمصاحبة بالمعروف', 'طاعة الوالدين واجبة في غير المعصية'],
        'social'
      );
      recordScenarioAttempt(
        'SCN_043',
        true,
        ['البشاشة والقول الحسن مع جميع الناس'],
        'social'
      );

      onFinish();
    }
  };

  const handleResetDialogue = () => {
    playSoftTap();
    setSelectedApproach(null);
    setTeaServed(false);
    setIsCompleted(false);
  };

  return (
    <div className="space-y-4">
      {/* 2D Interactive Family Living Room Canvas */}
      <div className="relative w-full h-84 sm:h-96 rounded-3xl overflow-hidden border-2 border-[#D4A373]/40 bg-gradient-to-b from-[#F9F5EC] via-[#EFE6D5] to-[#DFCDB4] shadow-2xl p-4 flex flex-col justify-between select-none">
        
        {/* Wall & Ambient Living Room Decor */}
        <div className="flex items-center justify-between pb-2 border-b border-[#D4A373]/30">
          <div className="flex items-center gap-2">
            <span className="text-base">🏡</span>
            <div className="text-start">
              <span className="text-xs font-black text-[#2C483F] block">
                {lang === 'ar' ? 'جلسة أسرية في صالة البيت' : 'Family Living Room Conversation'}
              </span>
              <span className="text-[9px] text-stone-500 font-mono">
                {lang === 'ar' ? 'المصارحة بالبر والسكينة' : 'Gentle honest communication'}
              </span>
            </div>
          </div>

          {/* Warm Floor Lamp Glow */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100/80 text-amber-900 text-[10px] font-bold border border-amber-300">
            <span>✨</span>
            <span>{lang === 'ar' ? 'أجواء عائلية دافئة' : 'Warm Atmosphere'}</span>
          </div>
        </div>

        {/* Central Scene: Living Room Sofa & Parents */}
        <div className="relative flex-1 flex flex-col items-center justify-center my-1">
          {/* Living Room Sofa */}
          <div className="relative w-72 sm:w-84 h-36 bg-[#8B5A2B] rounded-3xl border-4 border-[#654321] shadow-xl p-3 flex justify-between items-center">
            
            {/* Mother on Sofa */}
            <div className="flex flex-col items-center -mt-6">
              <div className="w-10 h-10 rounded-full bg-[#E8D0BA] border-2 border-[#8B5A2B] shadow-md flex items-center justify-center text-sm">
                🧕
              </div>
              <div className="w-14 h-12 rounded-t-xl bg-[#5C7065] -mt-1 shadow-sm flex items-center justify-center">
                <span className="text-[8px] text-emerald-100 font-bold">
                  {lang === 'ar' ? 'الوالدة' : 'Mother'}
                </span>
              </div>
              {selectedApproach === 'calm' && (
                <span className="text-xs text-rose-500 animate-bounce -mt-2">❤️</span>
              )}
            </div>

            {/* Coffee Table in center */}
            <div
              onClick={() => {
                playSoftTap();
                setTeaServed(true);
              }}
              className="cursor-pointer p-2 rounded-xl bg-[#FAF6EE] border-2 border-[#D4A373] shadow-md flex flex-col items-center hover:scale-105 transition-transform"
              title={lang === 'ar' ? 'انقر لتقديم الشاي الدافئ للوالدين' : 'Click to serve warm tea'}
            >
              <div className="text-base sm:text-lg animate-pulse">☕</div>
              <span className="text-[8px] font-bold text-[#2C483F] whitespace-nowrap">
                {teaServed ? (lang === 'ar' ? 'شاي دافئ مُقدّم' : 'Tea Served') : (lang === 'ar' ? 'صبّ الشاي' : 'Serve Tea')}
              </span>
            </div>

            {/* Father on Sofa */}
            <div className="flex flex-col items-center -mt-6">
              <div className="w-10 h-10 rounded-full bg-[#DFBC98] border-2 border-[#8B5A2B] shadow-md flex items-center justify-center text-sm">
                👓
              </div>
              <div className="w-14 h-12 rounded-t-xl bg-[#4A5D6E] -mt-1 shadow-sm flex items-center justify-center">
                <span className="text-[8px] text-sky-100 font-bold">
                  {lang === 'ar' ? 'الوالد' : 'Father'}
                </span>
              </div>
              {selectedApproach === 'calm' && (
                <span className="text-xs text-rose-500 animate-bounce -mt-2">❤️</span>
              )}
            </div>
          </div>

          {/* Parental Reaction Speech Bubble */}
          <div className="mt-3 px-4 py-1.5 rounded-2xl bg-white/95 border border-[#D4A373] shadow-md text-center max-w-sm">
            {selectedApproach === 'calm' ? (
              <p className="text-[11px] font-bold text-emerald-900 leading-snug">
                {lang === 'ar'
                  ? '«نسعد ببرك وصدقك يا بني، طالما وجدت في صلاتك السكينة ويزيدك ذلك محبة وبرّاً بنا فنحن فخورون بك دائماً!»'
                  : '"We are proud of your honesty; as long as prayer brings peace and increases your love for us, we support you!"'}
              </p>
            ) : selectedApproach === 'defiant' ? (
              <p className="text-[11px] font-bold text-rose-800 leading-snug">
                {lang === 'ar'
                  ? '«لماذا هذا الغضب والحدة يا بني؟ نحن نحبك ولا نريد لك إلا الخير والاطمئنان!»'
                  : '"Why this anger and hostility? We love you and only want what is good for you!"'}
              </p>
            ) : selectedApproach === 'defensive' ? (
              <p className="text-[11px] font-bold text-amber-800 leading-snug">
                {lang === 'ar'
                  ? '«انغلاقك وتوترك يقلقنا.. شاركنا ما في قلبك بهدوء.»'
                  : '"Your secretiveness worries us.. talk to us calmly."'}
              </p>
            ) : (
              <p className="text-[10px] text-stone-600 font-medium">
                {lang === 'ar'
                  ? 'والداك ينظران إليك باهتمام.. اختر أسلوب الحوار الأكثر برّاً ومحبة:'
                  : 'Your parents look attentively.. choose the most loving dialogue style:'}
              </p>
            )}
          </div>
        </div>

        {/* The 3 Interactive In-Scene Dialogue Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-[#D4A373]/20">
          
          {/* Choice 1: Calm & Respectful (Target) */}
          <button
            type="button"
            onClick={() => handleChooseApproach('calm')}
            className={`p-2.5 rounded-2xl border-2 text-start transition-all cursor-pointer flex flex-col justify-between ${
              selectedApproach === 'calm'
                ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-400'
                : 'bg-white/90 border-stone-200 hover:border-emerald-400 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-emerald-950">
                {lang === 'ar' ? 'بر ومصارحة هادئة' : 'Calm & Loving'}
              </span>
              <span className="text-sm">🌸</span>
            </div>
            <p className="text-[10px] text-stone-600 mt-1 italic leading-snug">
              {lang === 'ar'
                ? '«أمي، أبي العزيز.. وجدت في الصلاة سكينة وطمأنينة، وبري بكما سيزداد دائماً محبة وعوناً.»'
                : '"Mom, Dad.. I found peace in prayer, and my devotion to you will only grow."'}
            </p>
          </button>

          {/* Choice 2: Defiant */}
          <button
            type="button"
            onClick={() => handleChooseApproach('defiant')}
            className={`p-2.5 rounded-2xl border-2 text-start transition-all cursor-pointer flex flex-col justify-between ${
              selectedApproach === 'defiant'
                ? 'bg-rose-50 border-rose-400'
                : 'bg-white/80 border-stone-200 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-700">
                {lang === 'ar' ? 'حدة وتحدٍّ' : 'Defiant Tone'}
              </span>
              <span className="text-sm">⚡</span>
            </div>
            <p className="text-[10px] text-stone-500 mt-1 italic leading-snug">
              {lang === 'ar'
                ? '«سأصلي ولا يهمني رأي أحد!»'
                : '"I will pray regardless of your opinion!"'}
            </p>
          </button>

          {/* Choice 3: Defensive */}
          <button
            type="button"
            onClick={() => handleChooseApproach('defensive')}
            className={`p-2.5 rounded-2xl border-2 text-start transition-all cursor-pointer flex flex-col justify-between ${
              selectedApproach === 'defiant' || selectedApproach === 'defensive'
                ? 'bg-amber-50 border-amber-400'
                : 'bg-white/80 border-stone-200 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-700">
                {lang === 'ar' ? 'انغلاق وتوتر' : 'Defensive Tone'}
              </span>
              <span className="text-sm">🔒</span>
            </div>
            <p className="text-[10px] text-stone-500 mt-1 italic leading-snug">
              {lang === 'ar'
                ? '«لا تسألوني عن أي شيء!»'
                : '"Do not ask me anything!"'}
            </p>
          </button>
        </div>
      </div>

      {/* Grounded Evidence & Wisdom Drawer (Appears After Interaction) */}
      {isCompleted && (
        <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-50/90 to-stone-50 border border-emerald-300/80 space-y-3 animate-fade-in text-start shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-900 font-black text-xs sm:text-sm">
              <Heart className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'ar' ? 'التأصيل الشرعي لمصارحة الأهل بالبر:' : 'Grounded Guidance on Filial Devotion:'}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                SCN_044
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-stone-200 text-stone-700">
                SCN_043
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-700 leading-relaxed">
            {lang === 'ar'
              ? 'البر والإحسان هما مفتاح القلوب؛ والداك يحبانك ويخافان عليك، والمصارحة الهادئة المقرونة بزيادة اللطف والخدمة تطمئن قلوبهما وتبدد أي توجس دون حاجة للجدال أو التشنج.'
              : 'Filial respect opens hearts. Gentle conversation backed by sincere love reassures parents and dispels misunderstandings without confrontation.'}
          </p>

          {/* Verbatim Authentic Quran & Hadith Evidence from SCN_044 */}
          {scn44?.approved_sources?.[0] && (
            <div className="p-3 bg-white/80 rounded-xl border border-amber-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                  <span>{scn44.approved_sources[0].reference_title}</span>
                </span>
                {scn44.approved_sources[0].source_page_url && (
                  <a
                    href={scn44.approved_sources[0].source_page_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-emerald-700 hover:text-emerald-900 underline flex items-center gap-0.5 font-bold"
                  >
                    <span>{lang === 'ar' ? 'السند' : 'Source'}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
              <p className="text-xs font-serif text-[#12183F] italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                «{scn44.approved_sources[0].verbatim_evidence_text}»
              </p>
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleResetDialogue}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'تجربة أسلوب حوار آخر' : 'Try Another Tone'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
