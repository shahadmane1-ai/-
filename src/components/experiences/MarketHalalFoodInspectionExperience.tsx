import React, { useState } from 'react';
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  ShoppingBag,
  Eye,
  AlertCircle,
  Check,
  X,
} from 'lucide-react';
import { Language } from '../../types';
import { playPeaceChime, playSoftTap, playStressReleaseTone } from '../../utils/audio';

interface MarketHalalFoodInspectionExperienceProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onComplete?: () => void;
}

interface ShelfProduct {
  id: string;
  nameAr: string;
  nameEn: string;
  categoryAr: string;
  icon: string;
  isPureByDefault: boolean; // true = inherently halal, false = needs ingredient verification
  explanationAr: string;
  ingredientsTextAr: string;
}

export const MarketHalalFoodInspectionExperience: React.FC<MarketHalalFoodInspectionExperienceProps> = ({
  isOpen,
  onClose,
  lang,
  onComplete,
}) => {
  const products: ShelfProduct[] = [
    {
      id: 'fish',
      nameAr: 'سمك بحري طازج مع ليمون',
      nameEn: 'Fresh Sea Fish with Lemon',
      categoryAr: 'صيد البحر الطازج',
      icon: '🐟',
      isPureByDefault: true,
      explanationAr: 'حلال طيب بإجماع المسلمين! صيد البحر كله مباح ولا يشترط فيه تذكية لقوله تعالى: ﴿أُحِلَّ لَكُمْ صَيْدُ الْبَحْرِ وَطَعَامُهُ مَتَاعًا لَكُمْ﴾.',
      ingredientsTextAr: 'المكونات: سمك بحري طبيعي 100%، ماء، ملح بحري.',
    },
    {
      id: 'marshmallow',
      nameAr: 'حلوى الخطمي (مارشميلو) بنكهة الفراولة',
      nameEn: 'Strawberry Marshmallow Gummy',
      categoryAr: 'حلويات مصنعة ومواد مضافة',
      icon: '🍬',
      isPureByDefault: false,
      explanationAr: 'يحتاج إلى تثبت وفحص! المارشميلو يحتوي على جيلاتين ومستحلبات (مثل E471)، فإذا كان الجيلاتين من مصدر بقري مذكى أو نباتي حل، وإلا تجنبته.',
      ingredientsTextAr: 'المكونات: سكر، شراب جلوكوز، جيلاتين بقري، مستحلب E471، نكهة فراولة.',
    },
    {
      id: 'dates_oil',
      nameAr: 'تمر سكري فاخر وزيت زيتون معصور على البارد',
      nameEn: 'Organic Dates & Cold-Pressed Olive Oil',
      categoryAr: 'ثمار وزيوت طبيعية',
      icon: '🫒',
      isPureByDefault: true,
      explanationAr: 'حلال طيب بيقين! الثمار والنباتات الأصل فيها الإباحة والطهارة التامة ولا داعي لأي وسواس أو شك.',
      ingredientsTextAr: 'المكونات: تمر طبيعي نقي 100%، زيت زيتون بكر ممتاز.',
    },
    {
      id: 'burger',
      nameAr: 'برجر لحم معلب في متجر أجنبي عام',
      nameEn: 'Canned Beef Burger in General Market',
      categoryAr: 'لحوم حيوانية مصنعة',
      icon: '🥩',
      isPureByDefault: false,
      explanationAr: 'يحتاج إلى تثبت من الختم والشهادة! اللحوم الحيوانية يشترط فيها التذكية الشرعية، فيجب التأكد من وجود ختم حلال أو أنها من أهل الكتاب.',
      ingredientsTextAr: 'المكونات: لحم بقر 75%، بهارات، دهن حيواني، نشا، ملح، مواد حافظة.',
    },
  ];

  // Placements: productId -> 'cart' (pure) | 'shelf' (needs check)
  const [placements, setPlacements] = useState<Record<string, 'cart' | 'shelf'>>({});
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showSources, setShowSources] = useState(false);

  if (!isOpen) return null;

  const handleInspect = (prodId: string) => {
    playSoftTap();
    setSelectedProductId(prodId);
  };

  const handlePlace = (prodId: string, decision: 'cart' | 'shelf') => {
    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;

    const isCorrect =
      (decision === 'cart' && prod.isPureByDefault) ||
      (decision === 'shelf' && !prod.isPureByDefault);

    if (isCorrect) {
      playPeaceChime();
    } else {
      playStressReleaseTone();
    }

    const next = { ...placements, [prodId]: decision };
    setPlacements(next);

    // Check if all placed correctly
    if (Object.keys(next).length === products.length) {
      const allCorrect = products.every(
        (p) =>
          (next[p.id] === 'cart' && p.isPureByDefault) ||
          (next[p.id] === 'shelf' && !p.isPureByDefault)
      );
      if (allCorrect && onComplete) {
        onComplete();
      }
    }
  };

  const handleReset = () => {
    playSoftTap();
    setPlacements({});
    setSelectedProductId(null);
    setShowSources(false);
  };

  const allCompleted =
    Object.keys(placements).length === products.length &&
    products.every(
      (p) =>
        (placements[p.id] === 'cart' && p.isPureByDefault) ||
        (placements[p.id] === 'shelf' && !p.isPureByDefault)
    );

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#FBF9F5] border-2 border-[#D4A373]/60 rounded-3xl shadow-2xl p-4 sm:p-6 text-start flex flex-col justify-between max-h-[94vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D4A373]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2C483F] flex items-center justify-center text-[#D4A373] shadow-md">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-[#2C483F]">
                  {lang === 'ar' ? 'فحص الطعام الحلال | رفوف السوق الذكية' : 'Halal Food Inspection | Smart Market Shelves'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#88C947]/20 text-[#2C483F] border border-[#88C947]/40">
                  {lang === 'ar' ? 'مشهد تفاعلي 2D' : '2D Interactive Shelf'}
                </span>
              </div>
              <p className="text-xs text-[#2C483F]/75">
                {lang === 'ar'
                  ? 'تفقد أصناف السوق: ميز بين الحلال الطيب بالأصل وما يحتاج إلى تدقيق وتثبت دون وسواس.'
                  : 'Inspect market products: distinguish inherently pure foods from items needing verification.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#2C483F] text-xs font-bold transition-all cursor-pointer"
              title="إعادة الفحص"
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

        {/* 2D Virtual Market Shelf & Interactive Zone */}
        <div className="space-y-4">
          {/* Market Shelf Display */}
          <div className="relative rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-[#2E241C] via-[#3D3025] to-[#241C16] border-2 border-[#D4A373]/50 shadow-xl overflow-hidden text-white">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/20">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <span>🛒 رف المنتجات في السوق (انقر على أي صنف لفحصه):</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-white/80">
                {Object.keys(placements).length}/{products.length} مفحوص
              </span>
            </div>

            {/* 4 Interactive Shelf Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {products.map((prod) => {
                const placed = placements[prod.id];
                const isSelected = selectedProductId === prod.id;

                return (
                  <div
                    key={prod.id}
                    onClick={() => handleInspect(prod.id)}
                    className={`relative p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[140px] backdrop-blur-md ${
                      isSelected
                        ? 'border-white bg-white text-[#2C483F] ring-4 ring-white/50 scale-[1.03] shadow-2xl'
                        : placed === 'cart'
                        ? 'border-emerald-400 bg-emerald-950/50 text-emerald-100'
                        : placed === 'shelf'
                        ? 'border-amber-400 bg-amber-950/50 text-amber-100'
                        : 'border-white/30 bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{prod.icon}</span>
                        {placed && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                              placed === 'cart'
                                ? 'bg-emerald-500 text-white'
                                : 'bg-amber-500 text-black'
                            }`}
                          >
                            {placed === 'cart' ? 'سلة الحلال' : 'رف التثبت'}
                          </span>
                        )}
                      </div>
                      <h5 className="font-bold text-xs mt-2 leading-tight">
                        {lang === 'ar' ? prod.nameAr : prod.nameEn}
                      </h5>
                      <span className="text-[10px] opacity-75 block mt-0.5">
                        {prod.categoryAr}
                      </span>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[10px] font-bold border-t border-white/10 mt-2">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-[#D4A373]" />
                        <span>{placed ? 'تم الفحص' : 'انقر للفحص 🔍'}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Inspection Loupe / Decision Card */}
          {selectedProduct && (
            <div className="p-4 rounded-2xl bg-white border-2 border-[#2C483F] shadow-lg space-y-3 animate-fade-in text-[#2C483F]">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedProduct.icon}</span>
                  <div>
                    <h5 className="text-sm font-black text-[#2C483F]">
                      🔍 فحص بطاقة المنتج: {selectedProduct.nameAr}
                    </h5>
                    <span className="text-[10px] text-stone-500 font-mono">
                      {selectedProduct.ingredientsTextAr}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProductId(null)}
                  className="text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-stone-800 leading-relaxed font-medium bg-[#FBF9F5] p-3 rounded-xl border border-stone-200">
                💡 <strong>التوجيه الفقهي:</strong> {selectedProduct.explanationAr}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <span className="text-xs font-bold text-[#2C483F]">
                  إلى أين توجه هذا المنتج بناءً على حالته؟
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePlace(selectedProduct.id, 'cart')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-all ${
                      placements[selectedProduct.id] === 'cart'
                        ? 'bg-emerald-700 text-white ring-2 ring-emerald-400'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <span>🛒 سلة المشتريات (حلال بيقين)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePlace(selectedProduct.id, 'shelf')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-all ${
                      placements[selectedProduct.id] === 'shelf'
                        ? 'bg-amber-600 text-white ring-2 ring-amber-400'
                        : 'bg-amber-500 hover:bg-amber-600 text-white'
                    }`}
                  >
                    <span>⚠️ رف التثبت (يحتاج تحقق)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Completion Banner */}
          {allCompleted && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-400 shadow-md space-y-2 animate-fade-in text-emerald-950">
              <div className="flex items-center gap-2 font-black text-sm text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>ما شاء الله! أتقنت فحص الأطعمة والتمييز بين الأصل المباح وما يحتاج تثبتاً 🌿</span>
              </div>
              <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                القاعدة الشرعية الكبرى: «الأصل في الأشياء الإباحة حتى يدل الدليل على التحريم»، و«اليقين لا يزول بالشك».
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 mt-3 border-t border-[#D4A373]/20 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setShowSources(!showSources)}
            className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#2C483F] font-bold transition-colors cursor-pointer flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#558824]" />
            <span>{lang === 'ar' ? 'المصادر المعتمدة' : 'Sources'}</span>
          </button>

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
