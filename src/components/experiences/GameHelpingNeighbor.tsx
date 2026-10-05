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

export const GameHelpingNeighbor: React.FC<DispatcherProps> = ({ experience, lang, onFinish }) => {
  const [itemsGathered, setItemsGathered] = useState<string[]>([]);
  const [doorHeld, setDoorHeld] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const scn43 = getScenarioById('SCN_043');
  const scn44 = getScenarioById('SCN_044');

  const groceryItems = [
    { id: 'orange1', icon: '🍊', labelAr: 'برتقالة', labelEn: 'Orange', posX: '30%', posY: '65%' },
    { id: 'orange2', icon: '🍊', labelAr: 'برتقالة', labelEn: 'Orange', posX: '42%', posY: '72%' },
    { id: 'box', icon: '📦', labelAr: 'صندوق أغراض', labelEn: 'Grocery Box', posX: '55%', posY: '60%' },
  ];

  const handlePickItem = (id: string) => {
    playSoftTap();
    if (!itemsGathered.includes(id)) {
      const next = [...itemsGathered, id];
      setItemsGathered(next);
      if (next.length === groceryItems.length && !isCompleted) {
        playPeaceChime();
        setIsCompleted(true);

        // Record deterministic learning progression for neighbor rights and spontaneous assistance
        recordScenarioAttempt(
          'SCN_043',
          true,
          ['إفشاء السلام وحسن الجوار والإحسان إلى الجار'],
          'social'
        );
        recordScenarioAttempt(
          'SCN_044',
          true,
          ['المعاونة العفوية وإدخال السرور على المحتاج'],
          'social'
        );

        onFinish();
      }
    }
  };

  const handleResetHallway = () => {
    playSoftTap();
    setItemsGathered([]);
    setDoorHeld(false);
    setIsCompleted(false);
  };

  const allItemsCollected = itemsGathered.length === groceryItems.length;

  return (
    <div className="space-y-4">
      {/* 2D Interactive Apartment Hallway Canvas */}
      <div className="relative w-full h-84 sm:h-96 rounded-3xl overflow-hidden border-2 border-[#D4A373]/40 bg-gradient-to-b from-[#FAF6EE] via-[#EFE7D8] to-[#DFD0BA] shadow-2xl p-4 flex flex-col justify-between select-none">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-[#D4A373]/30">
          <div className="flex items-center gap-2">
            <span className="text-base">🏢</span>
            <div className="text-start">
              <span className="text-xs font-black text-[#2C483F] block">
                {lang === 'ar' ? 'ممر الشقق السكنية: موقف إحسان للجار' : 'Apartment Corridor: Helping a Neighbor'}
              </span>
              <span className="text-[9px] text-stone-500 font-mono">
                {lang === 'ar' ? 'تمزق كيس مشتريات الجار وسقطت الأغراض' : 'Neighbor dropped grocery bags in hallway'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-300">
            <span>❤️</span>
            <span>{lang === 'ar' ? 'حق الجار' : 'Neighbor’s Right'}</span>
          </div>
        </div>

        {/* Central Hallway Scene with Neighbor & Dropped Groceries */}
        <div className="relative flex-1 rounded-2xl overflow-hidden bg-gradient-to-b from-stone-100 via-[#EAE1D2] to-[#D5C6B0] border border-stone-300 p-3 my-1">
          
          {/* Apartment Doors & Elevator in Hallway Background */}
          <div className="absolute top-2 inset-x-4 flex justify-between items-center opacity-80">
            {/* Door 301 */}
            <div className="w-16 h-28 bg-[#8C5D38] border-2 border-[#5C3B20] rounded-t-lg flex flex-col items-center p-1">
              <span className="text-[8px] text-amber-100 font-mono">301</span>
              <div className="w-1.5 h-1.5 rounded-full bg-amber-300 self-start mt-8" />
            </div>

            {/* Elevator */}
            <div
              onClick={() => {
                playSoftTap();
                setDoorHeld(!doorHeld);
              }}
              className="p-2 rounded-xl bg-stone-300 border-2 border-stone-400 shadow-md flex flex-col items-center cursor-pointer hover:border-emerald-500"
              title={lang === 'ar' ? 'مسك باب المصعد للجار' : 'Hold elevator door'}
            >
              <span className="text-[7px] font-mono text-emerald-800 bg-black/10 px-1 rounded font-bold">▲ 3F</span>
              <span className="text-xl">🛗</span>
              <span className="text-[7px] font-bold text-stone-700 mt-0.5">
                {doorHeld ? (lang === 'ar' ? 'الباب مفتوح' : 'Holding Door') : (lang === 'ar' ? 'مسك المصعد' : 'Hold Elevator')}
              </span>
            </div>

            {/* Door 302 */}
            <div className="w-16 h-28 bg-[#8C5D38] border-2 border-[#5C3B20] rounded-t-lg flex flex-col items-center p-1">
              <span className="text-[8px] text-amber-100 font-mono">302</span>
              <div className="w-1.5 h-1.5 rounded-full bg-amber-300 self-end mt-8" />
            </div>
          </div>

          {/* Neighbor Silhouette Standing in Distress */}
          <div className="absolute top-16 left-12 flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-[#E5D2BA] border-2 border-[#8B7355] shadow-md flex items-center justify-center text-sm">
              👴
            </div>
            <div className="w-12 h-14 rounded-t-xl bg-[#5C6F7D] -mt-1 shadow-sm flex items-center justify-center">
              <span className="text-[8px] text-white font-bold">
                {lang === 'ar' ? 'الجار' : 'Neighbor'}
              </span>
            </div>
          </div>

          {/* The Dropped Items on the Carpet (Interactive) */}
          {groceryItems.map((item) => {
            const isPicked = itemsGathered.includes(item.id);
            if (isPicked) return null;

            return (
              <div
                key={item.id}
                onClick={() => handlePickItem(item.id)}
                style={{ left: item.posX, top: item.posY }}
                className="absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 border-2 border-[#D4A373] shadow-lg cursor-pointer hover:scale-125 transition-transform animate-bounce group"
                title={lang === 'ar' ? `انقر لجمع ${item.labelAr}` : `Click to pick up ${item.labelEn}`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-1 rounded bg-[#2C483F] text-white text-[7px] font-bold hidden group-hover:block whitespace-nowrap">
                  {lang === 'ar' ? 'جمع' : 'Pick'}
                </span>
              </div>
            );
          })}

          {/* Spontaneous Gratitude Speech Bubble */}
          <div className="absolute bottom-2 inset-x-6 py-1.5 px-3 bg-white/95 rounded-2xl border border-[#D4A373] shadow-md text-center">
            {allItemsCollected ? (
              <p className="text-[11px] font-bold text-emerald-900 leading-snug">
                {lang === 'ar'
                  ? '«بارك الله فيك يا جاري العزيز! أسعدك الله كما فرّجت عني وخففت هذا الحمل الثقيل!»'
                  : '"Thank you immensely, dear neighbor! You brought joy to my day and eased my burden!"'}
              </p>
            ) : (
              <p className="text-[10px] text-stone-600 font-medium">
                {lang === 'ar'
                  ? `انقر على الأغراض الساقطة على الأرض لجمعها (${itemsGathered.length}/3 تم جمعها)`
                  : `Tap dropped items on the floor to gather them (${itemsGathered.length}/3 collected)`}
              </p>
            )}
          </div>
        </div>

        {/* Action Decision Checklist */}
        <div className="flex items-center justify-between pt-2 border-t border-[#D4A373]/30">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#2C483F]">
              {lang === 'ar' ? 'المساعدة العفوية:' : 'Help Status:'}
            </span>
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${allItemsCollected ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
              {allItemsCollected ? (lang === 'ar' ? '✓ جُمعت الأغراض' : '✓ Items gathered') : (lang === 'ar' ? 'اجمع الأغراض' : 'Collect items')}
            </span>
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${doorHeld ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
              {doorHeld ? (lang === 'ar' ? '✓ المصعد ممسوك' : '✓ Elevator held') : (lang === 'ar' ? 'مسك المصعد' : 'Hold elevator')}
            </span>
          </div>

          {allItemsCollected && !isCompleted && (
            <button
              type="button"
              onClick={() => {
                playPeaceChime();
                setIsCompleted(true);
                onFinish();
              }}
              className="px-6 py-2 rounded-xl bg-[#2C483F] hover:bg-[#1e342d] text-white text-xs font-black shadow-soft hover:scale-105 transition-all cursor-pointer"
            >
              {lang === 'ar' ? 'إتمام الإحسان للجار' : 'Complete Neighbor Assistance'}
            </button>
          )}
        </div>
      </div>

      {/* Grounded Guidance & Prophetic Evidence Drawer (Appears After Interaction) */}
      {isCompleted && (
        <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-50/90 to-stone-50 border border-emerald-300/80 space-y-3 animate-fade-in text-start shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-900 font-black text-xs sm:text-sm">
              <Heart className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'ar' ? 'التأصيل الشرعي لمكانة الجار وحسن المعاشرة:' : 'Grounded Guidance on Neighbor Rights:'}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                {lang === 'ar' ? 'حق الجار' : 'Neighbor Rights'}
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-stone-200 text-stone-700">
                {lang === 'ar' ? 'سند معتمد' : 'Verified Evidence'}
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-700 leading-relaxed">
            {lang === 'ar'
              ? 'حق الجار في الإسلام من أوكد الحقوق وأعظمها؛ والمبادرة العفوية بالمعاونة وتفريج الكربات الصغيرة تفتح القلوب وتجسد معنى الأخلاق الإسلامية السامية في الحي والمبنى السكني.'
              : 'The neighbor’s right is paramount in Islam. Spontaneous everyday kindness and assistance ease burdens and embody noble Islamic character.'}
          </p>

          {/* Verbatim Authentic Prophetic Hadith on Neighbor's Right (Bukhari: 6014 / Muslim: 2624) */}
          <div className="p-3 bg-white/80 rounded-xl border border-amber-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>صحيح البخاري ومسلم — حديث عائشة وابن عمر رضي الله عنهم</span>
              </span>
              <a
                href="https://dorar.net/hadith/sharh/1298"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-emerald-700 hover:text-emerald-900 underline flex items-center gap-0.5 font-bold"
              >
                <span>{lang === 'ar' ? 'السند' : 'Source'}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <p className="text-xs font-serif text-[#12183F] italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
              «ما زال جبريل يوصيني بالجار حتى ظننت أنه سيورثه»
            </p>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleResetHallway}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إعادة الموقف' : 'Replay Scene'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
