import React, { useState } from 'react';
import {
  Sparkles,
  Utensils,
  Check,
  HelpCircle,
  BookOpen,
  ExternalLink,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Salad,
  Info,
  X
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

type FoodId = 'salad' | 'chicken' | 'hummus' | 'juice' | 'cutlery';

interface TrayFoodItem {
  id: FoodId;
  nameAr: string;
  nameEn: string;
  badgeIcons: string;
  category: 'pure_halal' | 'needs_inquiry';
  ingredientsAr: string[];
  ingredientsEn: string[];
  inquiryQuestionAr?: string;
  inquiryQuestionEn?: string;
  verifiedAnswerAr?: string;
  verifiedAnswerEn?: string;
  descriptionAr: string;
  descriptionEn: string;
}

export const GameWorkLunchHalal: React.FC<DispatcherProps> = ({ experience, lang, onFinish }) => {
  const [activeItem, setActiveItem] = useState<FoodId | null>('chicken');
  const [inspectedItems, setInspectedItems] = useState<FoodId[]>(['chicken']);
  const [chickenVerified, setChickenVerified] = useState<boolean>(false);
  const [mealConfirmed, setMealConfirmed] = useState<boolean>(false);

  const scn18 = getScenarioById('SCN_018');

  const foodItems: Record<FoodId, TrayFoodItem> = {
    salad: {
      id: 'salad',
      nameAr: 'سلطة الحديقة الخضراء',
      nameEn: 'Fresh Garden Salad',
      badgeIcons: '🍃',
      category: 'pure_halal',
      ingredientsAr: ['خس روماني طازج', 'طماطم كرزية', 'خيار مقرمش', 'ذرة حلوة', 'زيت زيتون وليمون'],
      ingredientsEn: ['Crisp romaine lettuce', 'Cherry tomatoes', 'Sliced cucumbers', 'Sweet corn', 'Olive oil & lemon'],
      descriptionAr: 'نباتات طبيعية وخضروات طازجة؛ الأصل في الأطعمة النباتية الإباحة والطهارة التامة دون شبهة.',
      descriptionEn: 'Crisp fresh vegetables and olive oil; plant-based foods are inherently pure and lawful by default.'
    },
    chicken: {
      id: 'chicken',
      nameAr: 'صدر دجاج مشوي مع أرز متبل',
      nameEn: 'Grilled Chicken with Seasoned Rice',
      badgeIcons: '🍗 🍴',
      category: 'needs_inquiry',
      ingredientsAr: ['صدر دجاج متبل', 'أرز حبوب كاملة', 'أعشاب عطرية وزيت نباتي'],
      ingredientsEn: ['Seasoned chicken breast', 'Whole grain rice', 'Herb blend & vegetable oil'],
      inquiryQuestionAr: 'استفسار لطيف من النادل/الطاهي: هل الدجاج حلال ومطهو في أوانٍ منفصلة؟',
      inquiryQuestionEn: 'Gentle question to chef: Is the chicken Halal-certified and prepared separately?',
      verifiedAnswerAr: 'إجابة النادل: «نعم، لحم الدجاج مذبوح على الطريقة الحلال، ومشوي بزيت نباتي نقي 100%».',
      verifiedAnswerEn: 'Server reply: "Yes, certified Halal poultry grilled with 100% pure vegetable oil."',
      descriptionAr: 'اللحوم تحتاج إلى تحقق هادئ لمعرفة مصدر التذكية الشرعية، ويُسأل عنها بلطف وبلا تعقيد.',
      descriptionEn: 'Poultry requires gentle inquiry to verify halal slaughter and absence of wine glazes.'
    },
    hummus: {
      id: 'hummus',
      nameAr: 'طبق حمص بزيت الزيتون والخبز',
      nameEn: 'Hummus with Olive Oil & Pita',
      badgeIcons: '🍲 🥖',
      category: 'pure_halal',
      ingredientsAr: ['حمص حب مهروس', 'طحينة سمسم نقية', 'زيت زيتون بكر', 'مثلثات خبز عربي'],
      ingredientsEn: ['Pureed chickpeas', 'Sesame tahini', 'Extra virgin olive oil', 'Pita bread wedges'],
      descriptionAr: 'مقبلات نباتية أصيلة مكونة من الحبوب والزيوت الطبيعية، طيبة وحلال بالاتفاق.',
      descriptionEn: 'Authentic Mediterranean spread of chickpeas, tahini, and olive oil; wholly lawful.'
    },
    juice: {
      id: 'juice',
      nameAr: 'عصير برتقال طبيعي مع الثلج',
      nameEn: 'Fresh Iced Orange Juice',
      badgeIcons: '🧃 🍊',
      category: 'pure_halal',
      ingredientsAr: ['عصير برتقال معصور طازج', 'مكعبات ثلج نقية', 'شريحة برتقال للتزيين'],
      ingredientsEn: ['Fresh squeezed oranges', 'Purified ice cubes', 'Citrus orange garnish'],
      descriptionAr: 'مشروب فواكه طبيعي طازج خالي من أي إضافات كحولية أو مشتقات حيوانية.',
      descriptionEn: 'Freshly pressed fruit juice without any added gelatins or alcoholic flavorings.'
    },
    cutlery: {
      id: 'cutlery',
      nameAr: 'أدوات المائدة النظيفة',
      nameEn: 'Sanitized Dining Cutlery',
      badgeIcons: '🍴 🔍',
      category: 'pure_halal',
      ingredientsAr: ['شوكة وسكين ستانلس ستيل معقمة'],
      ingredientsEn: ['Sanitized stainless steel fork & knife'],
      descriptionAr: 'أدوات طعام نظيفة مخصصة لوجبات الكافيتيريا لراحة وأمان متناول الطعام.',
      descriptionEn: 'Clean, sanitized utensils ready for your dining comfort.'
    }
  };

  const handleSelectItem = (id: FoodId) => {
    playSoftTap();
    setActiveItem(id);
    if (!inspectedItems.includes(id)) {
      setInspectedItems((prev) => [...prev, id]);
    }
  };

  const handleVerifyChicken = () => {
    playPeaceChime();
    setChickenVerified(true);
    if (!inspectedItems.includes('chicken')) {
      setInspectedItems((prev) => [...prev, 'chicken']);
    }
  };

  const handleConfirmMeal = () => {
    playPeaceChime();
    setMealConfirmed(true);

    // Record learning progress for halal food verification and wisdom
    recordScenarioAttempt(
      'SCN_018',
      true,
      ['التحري الحكيم في الأطعمة المشتبهة', 'الأصل في الأطعمة النباتية والبحرية الإباحة'],
      'food'
    );

    onFinish();
  };

  const handleReset = () => {
    playSoftTap();
    setActiveItem('chicken');
    setInspectedItems(['chicken']);
    setChickenVerified(false);
    setMealConfirmed(false);
  };

  const activeFood = activeItem ? foodItems[activeItem] : null;
  const allInspected = inspectedItems.length >= 4 && chickenVerified;

  return (
    <div className="space-y-4 max-w-2xl mx-auto font-sans select-none">
      
      {/* Top Header Card */}
      <div className="bg-[#FAF7F2] rounded-3xl p-4 border border-[#E8DFD1] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#E89242]/15 text-[#D96B27] flex items-center justify-center font-bold">
            🍽️
          </div>
          <div className="text-start">
            <h2 className="text-sm sm:text-base font-black text-[#2D3E35]">
              {lang === 'ar' ? 'غداء العمل: اختيار الوجبة الحلال' : 'Work Lunch: Halal Meal Selection'}
            </h2>
            <p className="text-[10px] text-stone-500 font-medium">
              {lang === 'ar' ? 'فحص صينية طعام الكافيتيريا والتحقق من المكونات' : 'Inspect cafeteria tray & verify wholesome ingredients'}
            </p>
          </div>
        </div>

        {/* Verification Progress Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EAE2D5] border border-[#D9CDBA] text-xs font-bold text-[#3B4E43]">
          <CheckCircle2 className={`w-3.5 h-3.5 ${allInspected ? 'text-emerald-600' : 'text-stone-500'}`} />
          <span>
            {lang === 'ar'
              ? `${inspectedItems.length} من 4 عناصر مفحوصة`
              : `${inspectedItems.length} of 4 items inspected`}
          </span>
        </div>
      </div>

      {/* Main Top-Down Wooden Table & Cafeteria Tray Stage */}
      <div className="relative w-full rounded-3xl overflow-hidden border-2 border-[#D6C4AD] shadow-xl bg-[#DEC8A8] p-3 sm:p-6 flex flex-col items-center justify-center min-h-[360px] sm:min-h-[420px]">
        
        {/* Realistic Wooden Desk Background Texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#E7D6BE] via-[#DEC8A8] to-[#D5BE9C] pointer-events-none">
          {/* Subtle horizontal wood plank grain */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_28px,rgba(139,94,43,0.06)_28px,rgba(139,94,43,0.06)_29px)]" />
          {/* Soft table ambiance vignette */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/10" />
        </div>

        {/* Cafeteria Tray (Compartmentalized Beige Tray Matching Mockup) */}
        <div className="relative z-10 w-full max-w-lg bg-[#EFE4D2] rounded-3xl p-3 sm:p-4 border-4 border-[#DECBB4] shadow-2xl">
          
          {/* Tray Compartments Grid */}
          <div className="grid grid-cols-12 gap-2.5 sm:gap-3.5">
            
            {/* 1. Left Compartment: Fresh Garden Salad Bowl */}
            <div
              onClick={() => handleSelectItem('salad')}
              className={`col-span-5 row-span-2 bg-[#E5D7C2] rounded-2xl p-2.5 sm:p-3 border-2 transition-all duration-300 cursor-pointer relative flex flex-col items-center justify-center shadow-inner group hover:brightness-105 ${
                activeItem === 'salad' ? 'border-[#5B7B68] ring-2 ring-[#5B7B68]/40 bg-[#DFD0BA]' : 'border-[#D4C3AC]'
              }`}
            >
              {/* Tooltip Tag attached to Salad (Like Figma mockup) */}
              <div className="absolute -top-3 -left-2 z-20 bg-white/95 px-2 py-1 rounded-xl shadow-md border border-stone-200 flex items-center gap-1 group-hover:scale-110 transition-transform">
                <span className="text-sm">🍃</span>
                {inspectedItems.includes('salad') && (
                  <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                )}
              </div>

              {/* The Ceramic Salad Bowl Vector */}
              <div className="relative w-28 sm:w-36 h-28 sm:h-36 rounded-full bg-[#FAF5EC] border-4 border-[#DFCDB7] shadow-md flex items-center justify-center p-2 overflow-hidden">
                {/* Salad Leaves & Greens */}
                <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-[#385B3F] via-[#4F7D56] to-[#719F68] flex items-center justify-center">
                  {/* Decorative Salad Veggies (Tomatoes, Cucumbers, Corn) */}
                  <div className="relative w-full h-full">
                    {/* Tomato Slices */}
                    <div className="absolute top-2 left-4 w-5 h-5 rounded-full bg-rose-500 border border-rose-700 shadow-xs flex items-center justify-center text-[8px] text-white font-bold">🍅</div>
                    <div className="absolute bottom-2 right-4 w-5 h-5 rounded-full bg-rose-500 border border-rose-700 shadow-xs flex items-center justify-center text-[8px] text-white font-bold">🍅</div>
                    <div className="absolute top-4 right-3 w-5 h-5 rounded-full bg-rose-500 border border-rose-700 shadow-xs flex items-center justify-center text-[8px] text-white font-bold">🍅</div>
                    
                    {/* Cucumber Slices */}
                    <div className="absolute top-7 left-2 w-5 h-5 rounded-full bg-emerald-200 border-2 border-emerald-700 shadow-xs flex items-center justify-center text-[8px] text-emerald-900 font-bold">🥒</div>
                    <div className="absolute bottom-5 left-5 w-5 h-5 rounded-full bg-emerald-200 border-2 border-emerald-700 shadow-xs flex items-center justify-center text-[8px] text-emerald-900 font-bold">🥒</div>
                    <div className="absolute top-9 right-6 w-5 h-5 rounded-full bg-emerald-200 border-2 border-emerald-700 shadow-xs flex items-center justify-center text-[8px] text-emerald-900 font-bold">🥒</div>

                    {/* Sweet Corn Kernels */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 text-[8px]">
                      <span>🌽</span>
                      <span>🌽</span>
                    </div>
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-black text-[#3B4E43] mt-1.5 text-center">
                {lang === 'ar' ? 'سلطة خضراء' : 'Garden Salad'}
              </span>
            </div>

            {/* 2. Center-Top Compartment: Hummus & Pita Bowl */}
            <div
              onClick={() => handleSelectItem('hummus')}
              className={`col-span-4 bg-[#E5D7C2] rounded-2xl p-2 sm:p-2.5 border-2 transition-all duration-300 cursor-pointer relative flex flex-col items-center justify-center shadow-inner group hover:brightness-105 ${
                activeItem === 'hummus' ? 'border-[#5B7B68] ring-2 ring-[#5B7B68]/40 bg-[#DFD0BA]' : 'border-[#D4C3AC]'
              }`}
            >
              {/* Tooltip Tag */}
              <div className="absolute -top-3 -left-2 z-20 bg-white/95 px-2 py-0.5 rounded-xl shadow-md border border-stone-200 flex items-center gap-1 group-hover:scale-110 transition-transform">
                <span className="text-xs">🍲 🥖</span>
                {inspectedItems.includes('hummus') && (
                  <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                )}
              </div>

              {/* Terracotta Bowl with Hummus */}
              <div className="relative w-18 sm:w-22 h-18 sm:h-22 rounded-full bg-[#B86B43] border-3 border-[#8F4E2C] shadow-md flex items-center justify-center p-1.5">
                {/* Hummus Dip Surface */}
                <div className="w-full h-full rounded-full bg-[#E8D1A7] border-2 border-[#D6BD90] flex items-center justify-center relative overflow-hidden">
                  {/* Olive oil drizzle & paprika center */}
                  <div className="w-6 h-6 rounded-full bg-[#D1AE6C]/40 border border-[#BFA15C] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-rose-600" />
                  </div>
                  {/* Whole Chickpeas */}
                  <span className="absolute top-1 text-[7px]">🧆</span>
                  <span className="absolute bottom-1 text-[7px]">🧆</span>
                </div>
                {/* Pita Wedge Sticking Out */}
                <div className="absolute -top-2 -right-1 w-7 h-7 bg-[#E2C79E] border border-[#BD9E70] rounded-tl-full rotate-12 shadow-xs flex items-center justify-center text-[7px] font-bold text-amber-900">
                  🥖
                </div>
              </div>

              <span className="text-[9px] font-black text-[#3B4E43] mt-1 text-center">
                {lang === 'ar' ? 'حمص وخبز' : 'Hummus & Pita'}
              </span>
            </div>

            {/* 3. Right-Top Compartment: Iced Orange Juice */}
            <div
              onClick={() => handleSelectItem('juice')}
              className={`col-span-3 bg-[#E5D7C2] rounded-2xl p-2 sm:p-2.5 border-2 transition-all duration-300 cursor-pointer relative flex flex-col items-center justify-center shadow-inner group hover:brightness-105 ${
                activeItem === 'juice' ? 'border-[#5B7B68] ring-2 ring-[#5B7B68]/40 bg-[#DFD0BA]' : 'border-[#D4C3AC]'
              }`}
            >
              {/* Tooltip Tag */}
              <div className="absolute -top-3 -right-2 z-20 bg-white/95 px-2 py-0.5 rounded-xl shadow-md border border-stone-200 flex items-center gap-1 group-hover:scale-110 transition-transform">
                <span className="text-xs">🧃 🍊</span>
                {inspectedItems.includes('juice') && (
                  <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                )}
              </div>

              {/* Tall Glass with Orange Juice */}
              <div className="relative w-12 sm:w-14 h-20 sm:h-22 rounded-b-2xl rounded-t-sm bg-gradient-to-b from-sky-100/40 via-white/20 to-sky-100/60 border-2 border-white/80 shadow-md flex flex-col justify-end p-1 overflow-hidden">
                {/* Orange Juice Liquid */}
                <div className="w-full h-14 sm:h-16 rounded-b-xl bg-gradient-to-b from-[#F6A536] via-[#EE8421] to-[#E26E12] relative overflow-hidden flex flex-col justify-between p-0.5">
                  {/* Floating Ice Cubes */}
                  <div className="flex justify-around">
                    <div className="w-3 h-3 bg-white/60 rounded-xs rotate-12 border border-white/40" />
                    <div className="w-3 h-3 bg-white/60 rounded-xs -rotate-12 border border-white/40" />
                  </div>
                  {/* Citrus Slice */}
                  <div className="self-center text-xs">🍊</div>
                </div>
              </div>

              <span className="text-[9px] font-black text-[#3B4E43] mt-1 text-center">
                {lang === 'ar' ? 'عصير برتقال' : 'Orange Juice'}
              </span>
            </div>

            {/* 4. Center-Bottom Compartment: Grilled Chicken with Rice */}
            <div
              onClick={() => handleSelectItem('chicken')}
              className={`col-span-4 bg-[#E5D7C2] rounded-2xl p-2 sm:p-2.5 border-2 transition-all duration-300 cursor-pointer relative flex flex-col items-center justify-center shadow-inner group hover:brightness-105 ${
                activeItem === 'chicken' ? 'border-[#5B7B68] ring-2 ring-[#5B7B68]/40 bg-[#DFD0BA]' : 'border-[#D4C3AC]'
              }`}
            >
              {/* Tooltip Tag */}
              <div className="absolute -top-3 -left-2 z-20 bg-white/95 px-2 py-0.5 rounded-xl shadow-md border border-stone-200 flex items-center gap-1 group-hover:scale-110 transition-transform">
                <span className="text-xs">🍗 🍴</span>
                {chickenVerified && (
                  <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                )}
              </div>

              {/* Dinner Plate with Chicken & Seasoned Rice */}
              <div className="relative w-20 sm:w-26 h-20 sm:h-26 rounded-full bg-[#FAF6F0] border-3 border-[#DFD3C3] shadow-md flex items-center justify-around p-1.5 overflow-hidden">
                {/* Left: Seasoned Rice Mound */}
                <div className="w-8 sm:w-10 h-14 rounded-full bg-[#E5D0B1] border border-[#CBB391] flex items-center justify-center shadow-xs">
                  <span className="text-[7px] text-amber-900 font-bold">🍚 🌾</span>
                </div>

                {/* Right: Golden Grilled Chicken Fillet with grill marks */}
                <div className="w-9 sm:w-12 h-14 rounded-2xl bg-gradient-to-br from-[#E29D52] via-[#C97930] to-[#9C5318] border border-[#8C430B] shadow-md flex flex-col items-center justify-center p-1 relative">
                  {/* Grill Marks */}
                  <div className="w-6 h-0.5 bg-[#5F2C05] -rotate-12 rounded-full my-0.5 opacity-80" />
                  <div className="w-6 h-0.5 bg-[#5F2C05] -rotate-12 rounded-full my-0.5 opacity-80" />
                  <div className="w-6 h-0.5 bg-[#5F2C05] -rotate-12 rounded-full my-0.5 opacity-80" />
                  <span className="text-[7px] text-amber-100 font-bold mt-0.5">🍗</span>
                </div>
              </div>

              <span className="text-[9px] font-black text-[#3B4E43] mt-1 text-center">
                {lang === 'ar' ? 'دجاج وأرز' : 'Chicken & Rice'}
              </span>
            </div>

            {/* 5. Right-Bottom Compartment: Cutlery Slot */}
            <div
              onClick={() => handleSelectItem('cutlery')}
              className={`col-span-3 bg-[#E5D7C2] rounded-2xl p-2 border-2 transition-all duration-300 cursor-pointer relative flex flex-col items-center justify-center shadow-inner group hover:brightness-105 ${
                activeItem === 'cutlery' ? 'border-[#5B7B68] ring-2 ring-[#5B7B68]/40 bg-[#DFD0BA]' : 'border-[#D4C3AC]'
              }`}
            >
              {/* Tooltip Tag */}
              <div className="absolute -top-3 -right-2 z-20 bg-white/95 px-2 py-0.5 rounded-xl shadow-md border border-stone-200 flex items-center gap-1 group-hover:scale-110 transition-transform">
                <span className="text-xs">🍴 🔍</span>
              </div>

              {/* Molded Utensils Slot with Fork & Knife */}
              <div className="w-12 sm:w-14 h-20 sm:h-22 rounded-xl bg-[#DFD1BD] border-2 border-dashed border-[#C5B39C] flex items-center justify-center gap-1 shadow-inner">
                <span className="text-base sm:text-lg">🍴</span>
              </div>

              <span className="text-[9px] font-black text-[#3B4E43] mt-1 text-center">
                {lang === 'ar' ? 'أدوات المائدة' : 'Cutlery'}
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* Interactive Food Inspection & Inquiry Card */}
      {activeFood && !mealConfirmed && (
        <div className="p-4 rounded-3xl bg-[#FAF7F2] border-2 border-[#E4D9C8] shadow-md space-y-3 animate-fade-in text-start">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl p-2 rounded-2xl bg-[#EBE3D5] border border-[#D9CDBA]">
                {activeFood.badgeIcons}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-black text-[#2D3E35]">
                    {lang === 'ar' ? activeFood.nameAr : activeFood.nameEn}
                  </h3>
                  <span
                    className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border ${
                      activeFood.id === 'chicken'
                        ? chickenVerified
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                          : 'bg-amber-100 border-amber-300 text-amber-800'
                        : 'bg-emerald-100 border-emerald-300 text-emerald-800'
                    }`}
                  >
                    {activeFood.id === 'chicken'
                      ? chickenVerified
                        ? (lang === 'ar' ? '✓ تم التحقق: حلال وطيب' : '✓ Verified Halal')
                        : (lang === 'ar' ? 'يحتاج إلى استفسار لطيف' : 'Needs gentle check')
                      : (lang === 'ar' ? '✓ حلال مؤكد (نباتي طاهر)' : '✓ Confirmed Halal')}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 mt-1">
                  {lang === 'ar' ? activeFood.descriptionAr : activeFood.descriptionEn}
                </p>
              </div>
            </div>
          </div>

          {/* Ingredients List */}
          <div className="p-2.5 rounded-2xl bg-white/80 border border-[#E8DFD1] flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold text-[#4F6456] me-1">
              {lang === 'ar' ? 'المكونات:' : 'Ingredients:'}
            </span>
            {(lang === 'ar' ? activeFood.ingredientsAr : activeFood.ingredientsEn).map((ing, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-lg bg-[#FAF7F2] border border-stone-200 text-[10px] text-stone-700 font-medium"
              >
                {ing}
              </span>
            ))}
          </div>

          {/* Specific Chicken Inquiry Action */}
          {activeFood.id === 'chicken' && (
            <div className="pt-1">
              {!chickenVerified ? (
                <div className="p-3 rounded-2xl bg-amber-50/90 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 text-amber-900 text-xs">
                    <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      {lang === 'ar'
                        ? 'اللحوم في بيئة العمل يُستحب السؤال عنها بلطف دون حرج: «إذا لم تعرف، تحقق قبل أن تحكم».'
                        : 'For meats, inquire courteously: "Check gently before you decide".'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyChicken}
                    className="px-4 py-1.5 rounded-xl bg-[#E89242] hover:bg-[#D47E2F] text-white text-xs font-black shadow-xs transition-all hover:scale-105 cursor-pointer shrink-0"
                  >
                    {lang === 'ar' ? 'سؤال النادل / التحقق' : 'Ask Server / Verify'}
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {lang === 'ar' ? activeFood.verifiedAnswerAr : activeFood.verifiedAnswerEn}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Tray CTA Bar */}
      {!mealConfirmed && (
        <div className="p-3.5 rounded-3xl bg-[#FAF7F2] border border-[#E4D9C8] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2 text-[#2D3E35] text-xs font-bold text-start">
            <Utensils className="w-4 h-4 text-[#5B7B68] shrink-0" />
            <span>
              {allInspected
                ? (lang === 'ar'
                  ? 'تم التحقق من جميع مكونات الصينية؛ الوجبة حلال وطيبة وجاهزة لتناولها مع الزملاء.'
                  : 'All items verified; your tray is wholesome and ready to dine.')
                : (lang === 'ar'
                  ? 'انقر على عناصر الصينية وتحقق من مصدر الدجاج للمتابعة.'
                  : 'Tap tray items and verify chicken to proceed.')}
            </span>
          </div>

          <button
            type="button"
            disabled={!allInspected}
            onClick={handleConfirmMeal}
            className={`px-6 py-2.5 rounded-2xl text-xs font-black transition-all shadow-md shrink-0 ${
              allInspected
                ? 'bg-[#5B7B68] hover:bg-[#486354] text-white hover:scale-105 cursor-pointer animate-pulse'
                : 'bg-stone-200 border border-stone-300 text-stone-400 cursor-not-allowed'
            }`}
          >
            {lang === 'ar' ? 'تناول وجبة الغداء مع الزملاء بارتياح' : 'Enjoy Lunch with Colleagues'}
          </button>
        </div>
      )}

      {/* Grounded Evidence & Quranic Wisdom Drawer (Appears After Confirmation) */}
      {mealConfirmed && (
        <div className="p-4 rounded-3xl bg-gradient-to-b from-[#FAF7F2] to-[#EFE9DF] border border-[#D9CEBD] space-y-3 animate-fade-in text-start shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#2D3E35] font-black text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-[#5B7B68]" />
              <span>{lang === 'ar' ? 'التأصيل الشرعي لتناول الطيبات مع زملاء العمل:' : 'Sacred Evidence on Wholesome Halal Dining:'}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#5B7B68]/15 text-[#3D5548]">
                {lang === 'ar' ? 'تأصيل شرعي' : 'Sacred Evidence'}
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-stone-200 text-stone-700">
                {lang === 'ar' ? 'سند معتمد' : 'Verified Source'}
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-700 leading-relaxed">
            {lang === 'ar'
              ? 'تناول الغداء مع زملاء العمل فرصة طيبة للألفة والمحبة وحسن المعاشرة؛ والأصل في الأطعمة النباتية والبحرية الإباحة، والتحري في اللحوم يكون بالحكمة واللطف دون تضييق أو وسوسة زائدة.'
              : 'Dining with coworkers builds mutual warmth and understanding. Plant and seafood foods are lawful by default; verifying meats is done courteously without undue anxiety.'}
          </p>

          {/* Verbatim Quranic Verse on Halal Wholesome Food (Al-Baqarah: 172) */}
          <div className="p-3 bg-white/90 rounded-2xl border border-amber-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>سورة البقرة: الآية 172 — الأمر بأكل الطيبات الحلال</span>
              </span>
              <a
                href="https://quranpedia.net/surah/2/172"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-emerald-700 hover:text-emerald-900 underline flex items-center gap-0.5 font-bold"
              >
                <span>{lang === 'ar' ? 'المصحف' : 'Verse'}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <p className="text-xs font-serif text-[#12183F] italic bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
              ﴿يَا أَيُّهَا الَّذِينَ آمَنُوا كُلُوا مِن طَيِّبَاتِ مَا رَزَقْنَاكُمْ وَاشْكُرُوا لِلَّهِ إِن كُنتُمْ إِيَّاهُ تَعْبُدُونَ﴾
            </p>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl bg-stone-200/80 hover:bg-stone-300/80 text-stone-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إعادة فحص الصينية' : 'Reset Lunch Tray'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
