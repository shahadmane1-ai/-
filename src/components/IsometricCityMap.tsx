import React, { useState } from 'react';
import {
  Building2,
  Home,
  Coffee,
  Compass,
  ShoppingBag,
  Sparkles,
  ArrowUpRight,
  Sun,
  MapPin,
  Eye,
  CheckCircle2,
  Moon,
  Shield,
  Layers,
  Dumbbell,
  GraduationCap,
  Play,
  Award,
  Volume2,
  CheckSquare,
  Lock,
  Brain,
  ShieldCheck,
  Activity,
  X,
  RotateCcw,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { CityLandmark, LandmarkId, Language, UserProfile } from '../types';
import { CITY_LANDMARKS } from '../data/simulationData';
import { CITY_TYPES, LANDMARK_TRANSLATIONS, t } from '../utils/i18n';
import { playSoftTap, playPeaceChime } from '../utils/audio';
import { getAdaptiveRecommendation } from '../services/adaptiveReinforcementService';
import { getLearningState, resetLearningState } from '../services/learningStateManager';
import { AdaptiveRecommendation } from '../types/scenarioKnowledge';

// =========================================================================
// BESPOKE 2.5D ISOMETRIC VECTOR ARCHITECTURAL BUILDINGS
// =========================================================================

// 1. Central Grand Mosque with Green Dome & Minaret
const IsometricMosqueBuilding: React.FC = () => (
  <svg width="130" height="130" viewBox="0 0 130 130" className="filter drop-shadow-md">
    {/* Base shadow */}
    <ellipse cx="65" cy="115" rx="55" ry="14" fill="#C5B8A5" opacity="0.5" />

    {/* Mosque Main Body - Isometric Cube */}
    {/* Left Face */}
    <path d="M65 80 L35 95 L35 112 L65 98 Z" fill="#EAE2CE" />
    {/* Right Face */}
    <path d="M65 80 L95 95 L95 112 L65 98 Z" fill="#D8CFBA" />
    {/* Top Roof */}
    <path d="M65 65 L95 80 L65 95 L35 80 Z" fill="#F8F3E8" stroke="#D4A373" strokeWidth="1" />

    {/* Grand Central Green Dome */}
    <path
      d="M45 74 C45 52, 65 42, 65 38 C65 42, 85 52, 85 74 Z"
      fill="url(#greenDomeGrad)"
      stroke="#276749"
      strokeWidth="1.5"
    />
    {/* Golden Dome Crescent Finial */}
    <path d="M65 38 L65 30" stroke="#D4A373" strokeWidth="2" strokeLinecap="round" />
    <circle cx="65" cy="28" r="3" fill="#D4A373" />
    <path d="M63 26 C66 26, 67 29, 65 30" stroke="#FFF" strokeWidth="1" fill="none" />

    {/* Elegant Arched Windows Left Face */}
    <path d="M43 97 C43 93, 47 91, 50 93 L50 106 L43 103 Z" fill="#2C483F" opacity="0.8" />
    <path d="M53 92 C53 88, 57 86, 60 88 L60 101 L53 98 Z" fill="#2C483F" opacity="0.8" />

    {/* Arched Windows Right Face */}
    <path d="M70 94 C70 90, 74 88, 77 90 L77 103 L70 101 Z" fill="#2C483F" opacity="0.8" />
    <path d="M80 99 C80 95, 84 93, 87 95 L87 108 L80 106 Z" fill="#2C483F" opacity="0.8" />

    {/* Slender Minaret (Right Side) */}
    {/* Shaft */}
    <path d="M98 62 L106 66 L106 114 L98 110 Z" fill="#EAE2CE" />
    <path d="M106 66 L114 62 L114 110 L106 114 Z" fill="#D8CFBA" />
    {/* Balcony */}
    <path d="M96 61 L106 66 L116 61 L106 56 Z" fill="#D4A373" />
    {/* Minaret Cap Dome */}
    <path d="M101 56 C101 46, 106 42, 106 40 C106 42, 111 46, 111 56 Z" fill="url(#greenDomeGrad)" />
    <path d="M106 40 L106 34" stroke="#D4A373" strokeWidth="1.5" />
    <circle cx="106" cy="33" r="2" fill="#D4A373" />

    {/* Gradients */}
    <defs>
      <linearGradient id="greenDomeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#48BB78" />
        <stop offset="50%" stopColor="#2F855A" />
        <stop offset="100%" stopColor="#1C4532" />
      </linearGradient>
    </defs>
  </svg>
);

// 2. Workplace Modern Corporate Tower
const IsometricOfficeBuilding: React.FC = () => (
  <svg width="120" height="130" viewBox="0 0 120 130" className="filter drop-shadow-md">
    {/* Shadow */}
    <ellipse cx="60" cy="116" rx="45" ry="12" fill="#C5B8A5" opacity="0.5" />

    {/* Lower Tier */}
    <path d="M60 70 L25 85 L25 114 L60 98 Z" fill="#3B5349" />
    <path d="M60 70 L95 85 L95 114 L60 98 Z" fill="#243730" />
    <path d="M60 55 L95 70 L60 85 L25 70 Z" fill="#4E6B5F" stroke="#88C947" strokeWidth="0.8" />

    {/* Upper Tower Tier */}
    <path d="M60 25 L35 36 L35 80 L60 70 Z" fill="#5A7D6F" />
    <path d="M60 25 L85 36 L85 80 L60 70 Z" fill="#2F443B" />
    <path d="M60 14 L85 25 L60 36 L35 25 Z" fill="#88C947" opacity="0.9" />

    {/* Rooftop Antenna */}
    <path d="M60 14 L60 4" stroke="#D4A373" strokeWidth="2" strokeLinecap="round" />
    <circle cx="60" cy="3" r="2" fill="#D4A373" />

    {/* Glass Windows Grid (Left) */}
    {[35, 45, 55, 65].map((y, i) => (
      <path key={`wl-${i}`} d={`M40 ${y} L55 ${y - 6}`} stroke="#A3E635" strokeWidth="1.5" opacity="0.75" />
    ))}
    {/* Glass Windows Grid (Right) */}
    {[35, 45, 55, 65].map((y, i) => (
      <path key={`wr-${i}`} d={`M65 ${y - 6} L80 ${y}`} stroke="#E2FAD4" strokeWidth="1.5" opacity="0.6" />
    ))}

    {/* Entrance Canopy */}
    <path d="M60 98 L45 104 L45 112 L60 106 Z" fill="#D4A373" />
  </svg>
);

// 3. Family Home & Domestic Haven
const IsometricApartmentBuilding: React.FC = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" className="filter drop-shadow-md">
    <ellipse cx="60" cy="108" rx="44" ry="12" fill="#C5B8A5" opacity="0.5" />

    {/* Main Walls */}
    <path d="M60 62 L28 76 L28 106 L60 92 Z" fill="#DFD3C3" />
    <path d="M60 62 L92 76 L92 106 L60 92 Z" fill="#C7B198" />

    {/* Terracotta Pitched Roof */}
    <path d="M60 32 L20 54 L28 76 L60 62 Z" fill="#C86D51" stroke="#A84D34" strokeWidth="1" />
    <path d="M60 32 L100 54 L92 76 L60 62 Z" fill="#A84D34" stroke="#8A3822" strokeWidth="1" />
    {/* Chimney */}
    <path d="M40 38 L48 42 L48 54 L40 50 Z" fill="#7D321F" />

    {/* Balcony & Warm Windows */}
    <rect x="36" y="80" width="12" height="12" rx="2" fill="#FBF0B2" stroke="#8A3822" strokeWidth="1" />
    <rect x="70" y="80" width="12" height="12" rx="2" fill="#FBF0B2" stroke="#8A3822" strokeWidth="1" />
    {/* Wooden Door */}
    <path d="M56 94 L64 90 L64 104 L56 108 Z" fill="#6B4423" />
    {/* Flower Pot */}
    <circle cx="32" cy="102" r="3" fill="#88C947" />
    <circle cx="88" cy="102" r="3" fill="#88C947" />
  </svg>
);

// 4. Downtown Café & Mindful Restaurant
const IsometricCafeBuilding: React.FC = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" className="filter drop-shadow-md">
    <ellipse cx="60" cy="106" rx="46" ry="12" fill="#C5B8A5" opacity="0.5" />

    {/* Cafe Walls */}
    <path d="M60 65 L26 78 L26 104 L60 92 Z" fill="#F7F1E5" />
    <path d="M60 65 L94 78 L94 104 L60 92 Z" fill="#E4DCCF" />
    {/* Flat Roof Patio */}
    <path d="M60 52 L94 65 L60 78 L26 65 Z" fill="#D4A373" stroke="#B88656" strokeWidth="1" />

    {/* Striped Canopy Awning */}
    <path d="M22 76 L60 63 L60 73 L22 86 Z" fill="#991B1B" />
    <path d="M30 73 L40 69 L40 79 L30 83 Z" fill="#FEE2E2" />
    <path d="M50 66 L60 63 L60 73 L50 76 Z" fill="#FEE2E2" />

    {/* Outdoor Bistro Umbrella & Table */}
    <path d="M78 86 L88 82 L98 86 L88 78 Z" fill="#D4A373" />
    <path d="M88 82 L88 100" stroke="#78350F" strokeWidth="1.5" />
    <circle cx="88" cy="98" r="5" fill="#E4DCCF" stroke="#78350F" strokeWidth="1" />

    {/* Coffee Cup Sign */}
    <circle cx="60" cy="44" r="6" fill="#FFF" stroke="#D4A373" strokeWidth="1" />
    <path d="M58 43 Q60 40, 62 43" stroke="#D4A373" strokeWidth="1" fill="none" />
  </svg>
);

// 5. Halal Market & Grocery Scanner
const IsometricMarketBuilding: React.FC = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" className="filter drop-shadow-md">
    <ellipse cx="60" cy="108" rx="46" ry="12" fill="#C5B8A5" opacity="0.5" />

    {/* Store Supermarket Pavilion */}
    <path d="M60 64 L24 78 L24 104 L60 92 Z" fill="#E2E8F0" />
    <path d="M60 64 L96 78 L96 104 L60 92 Z" fill="#CBD5E1" />
    {/* Curved Green Halal Canopy Roof */}
    <path d="M60 48 L96 64 L60 78 L24 64 Z" fill="#15803D" stroke="#88C947" strokeWidth="1.5" />

    {/* Glass Sliding Entrance */}
    <path d="M50 86 L70 78 L70 98 L50 106 Z" fill="#38BDF8" opacity="0.6" stroke="#0284C7" strokeWidth="1" />

    {/* Shopping Cart Station */}
    <rect x="28" y="94" width="8" height="6" rx="1" fill="#94A3B8" />
    <rect x="38" y="98" width="8" height="6" rx="1" fill="#94A3B8" />

    {/* Halal Badge Sign */}
    <circle cx="60" cy="40" r="7" fill="#88C947" stroke="#FFF" strokeWidth="1.5" />
    <path d="M57 40 L59 42 L63 38" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 6. Mindful Athletic Arena & Gym
const IsometricGymBuilding: React.FC = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" className="filter drop-shadow-md">
    <ellipse cx="60" cy="108" rx="46" ry="12" fill="#C5B8A5" opacity="0.5" />

    {/* Arena Metallic Body */}
    <path d="M60 66 L22 80 L22 104 L60 92 Z" fill="#334155" />
    <path d="M60 66 L98 80 L98 104 L60 92 Z" fill="#1E293B" />
    {/* Barrel Vault Roof */}
    <path d="M60 46 C36 46, 22 66, 22 80 L60 66 Z" fill="#0EA5E9" opacity="0.8" />
    <path d="M60 46 C84 46, 98 66, 98 80 L60 66 Z" fill="#0284C7" opacity="0.9" />

    {/* Neon Athletic Strip */}
    <path d="M22 82 L60 68 L98 82" stroke="#38BDF8" strokeWidth="2" fill="none" />

    {/* Dumbbell Emblem */}
    <circle cx="60" cy="38" r="8" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
    <path d="M55 38 L65 38" stroke="#FFF" strokeWidth="1.5" />
    <rect x="54" y="36" width="2" height="4" rx="0.5" fill="#38BDF8" />
    <rect x="64" y="36" width="2" height="4" rx="0.5" fill="#38BDF8" />
  </svg>
);

// 7. University Campus & Academic Academy
const IsometricSchoolBuilding: React.FC = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" className="filter drop-shadow-md">
    <ellipse cx="60" cy="110" rx="46" ry="12" fill="#C5B8A5" opacity="0.5" />

    {/* Brick Main Academy */}
    <path d="M60 68 L24 82 L24 106 L60 94 Z" fill="#991B1B" />
    <path d="M60 68 L96 82 L96 106 L60 94 Z" fill="#7F1D1D" />
    <path d="M60 54 L96 68 L60 82 L24 68 Z" fill="#B91C1C" stroke="#D4A373" strokeWidth="1" />

    {/* Central Library Clock Tower */}
    <path d="M60 30 L48 36 L48 64 L60 58 Z" fill="#FEF3C7" />
    <path d="M60 30 L72 36 L72 64 L60 58 Z" fill="#FDE68A" />
    <path d="M60 20 L72 30 L60 36 L48 30 Z" fill="#15803D" />

    {/* Clock Face */}
    <circle cx="60" cy="42" r="4" fill="#FFF" stroke="#78350F" strokeWidth="0.8" />
    <path d="M60 42 L60 40 M60 42 L62 42" stroke="#78350F" strokeWidth="0.8" />

    {/* Classical Entrance Columns */}
    <path d="M48 94 L52 92 L52 106 L48 108 Z" fill="#FFF" />
    <path d="M68 88 L72 86 L72 100 L68 102 Z" fill="#FFF" />
  </svg>
);

// =========================================================================
// MAIN 2.5D ISOMETRIC CITY CANVAS
// =========================================================================

interface IsometricCityMapProps {
  activeLandmarkId: LandmarkId | null;
  onSelectLandmark: (id: LandmarkId) => void;
  completedLandmarks: LandmarkId[];
  activeDayNumber: number;
  lang: Language;
  userProfile?: UserProfile;
  onOpenProfile?: () => void;
  lastQuestCompletedAt?: number;
  onOpenHubExperience?: (landmarkId: LandmarkId) => void;
}

export const IsometricCityMap: React.FC<IsometricCityMapProps> = ({
  activeLandmarkId,
  onSelectLandmark,
  completedLandmarks,
  activeDayNumber,
  lang,
  userProfile,
  onOpenProfile,
  lastQuestCompletedAt,
  onOpenHubExperience,
}) => {
  const [hoveredLandmarkId, setHoveredLandmarkId] = useState<LandmarkId | null>(null);
  const [activePopoverId, setActivePopoverId] = useState<LandmarkId | null>(null);
  const [showMatrixModal, setShowMatrixModal] = useState<boolean>(false);
  const [learningState, setLearningState] = useState(getLearningState());
  const [adaptiveRec, setAdaptiveRec] = useState<AdaptiveRecommendation | null>(null);

  React.useEffect(() => {
    const refreshState = () => {
      try {
        const rec = getAdaptiveRecommendation();
        setAdaptiveRec(rec);
        setLearningState(getLearningState());
      } catch (e) {
        console.warn('[IsometricCityMap] Error fetching adaptive rec:', e);
      }
    };

    refreshState();

    if (typeof window !== 'undefined') {
      window.addEventListener('rafic_learning_state_updated', refreshState);
      return () => window.removeEventListener('rafic_learning_state_updated', refreshState);
    }
  }, [activeDayNumber, lastQuestCompletedAt]);

  const landmarks = CITY_LANDMARKS;
  const currentCityType = userProfile?.cityType || 'multicultural';
  const cityDetails = CITY_TYPES[currentCityType];

  const handleLandmarkClick = (id: LandmarkId) => {
    playSoftTap();
    setActivePopoverId(id);
    onSelectLandmark(id);
  };

  const getIcon = (id: LandmarkId) => {
    switch (id) {
      case 'office':
        return Building2;
      case 'apartment':
        return Home;
      case 'cafe':
        return Coffee;
      case 'mosque':
        return Compass;
      case 'market':
        return ShoppingBag;
      case 'gym':
        return Dumbbell;
      case 'school':
        return GraduationCap;
      default:
        return Building2;
    }
  };

  const isIsolated = currentCityType === 'isolated';
  const isIslamic = currentCityType === 'islamic';

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-[#D4A373]/30 bg-[#FBF9F5] shadow-soft-lg select-none text-start">
      {/* Simulation World Header Banner */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-white/95 backdrop-blur-md border-b border-[#D4A373]/20">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-soft ${
              isIslamic
                ? 'bg-[#2C483F] text-[#88C947]'
                : isIsolated
                ? 'bg-[#172822] text-indigo-300'
                : 'bg-[#2C483F] text-[#D4A373]'
            }`}
          >
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '24s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black text-[#2C483F]">
                {cityDetails.title[lang]}
              </h3>
              {(isIslamic || isIsolated) && (
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shadow-xs">
                  <Lock className="w-3 h-3 text-amber-700" />
                  <span>Soon / قريبًا — تحت التطوير</span>
                </span>
              )}
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cityDetails.colorTheme.badgeBg} ${cityDetails.colorTheme.badgeText} ${cityDetails.colorTheme.border}`}
              >
                {cityDetails.badge[lang]}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#88C947]/20 text-[#2C483F] border border-[#88C947]/30">
                {t('onboarding.difficulty_label', lang)}: {cityDetails.difficulty[lang]}
              </span>
            </div>
            <p className="text-xs text-[#2C483F]/70 mt-0.5">
              {cityDetails.subtitle[lang]}
            </p>
          </div>
        </div>

        {/* Legend / Quick status & Change Environment Button */}
        <div className="flex items-center gap-2.5 text-xs">
          {onOpenProfile && (
            <button
              type="button"
              onClick={() => {
                playSoftTap();
                onOpenProfile();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D4A373]/40 hover:border-[#D4A373] text-[#2C483F] font-bold shadow-xs hover:shadow-soft transition-all text-xs active:scale-95"
              title={t('onboarding.edit_btn', lang)}
            >
              <Layers className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>
                {lang === 'ar'
                  ? 'تغيير البيئة الحضرية'
                  : lang === 'fr'
                  ? 'Changer de Ville'
                  : lang === 'es'
                  ? 'Cambiar Ciudad'
                  : 'Switch Environment'}
              </span>
            </button>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FBF9F5] border border-[#D4A373]/30 text-[#2C483F] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>
              {lang === 'ar'
                ? 'مدينة تفاعلية حية (2.5D)'
                : 'Living 2.5D Isometric City'}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADAPTIVE LEARNING RADAR HUD CARD (Task 3 Requirement) */}
      {/* ========================================================================= */}
      <div className="relative z-20 px-6 py-2.5 bg-gradient-to-r from-[#FAF7F0] via-white to-[#FAF7F0] border-b border-[#D4A373]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
        {learningState.needs_reinforcement && learningState.needs_reinforcement.length > 0 ? (
          <div className="flex items-center gap-2 text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-300 shadow-xs animate-pulse">
            <span className="font-black text-amber-800">⚡ رفيق التكيفي:</span>
            <span className="font-bold">
              {lang === 'ar'
                ? `تم رصد حاجة لتعزيز مفهوم «${learningState.needs_reinforcement[0]}» بناءً على تكرار الخطأ السابق`
                : `Reinforcement needed for: ${learningState.needs_reinforcement[0]}`}
            </span>
            {adaptiveRec && (
              <button
                type="button"
                onClick={() => {
                  playPeaceChime();
                  if (onOpenHubExperience && adaptiveRec.related_city_experience) {
                    onOpenHubExperience(adaptiveRec.related_city_experience as any);
                  }
                }}
                className="ms-1 px-2.5 py-1 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-black text-[10px] shadow-xs cursor-pointer transition-all hover:scale-105"
              >
                {lang === 'ar' ? 'ابدأ التمرين التعزيزي ↵' : 'Start Exercise ↵'}
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-300 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-bold">
              {lang === 'ar'
                ? 'مسارك التعليمي متزن — جميع المفاهيم المكتسبة مستقرة'
                : 'Learning path balanced — all acquired concepts verified'}
            </span>
          </div>
        )}

        {/* Button to open Adaptive Knowledge Matrix Modal */}
        <button
          type="button"
          onClick={() => {
            playSoftTap();
            setLearningState(getLearningState());
            setShowMatrixModal(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2C483F] hover:bg-[#1f352e] text-white font-bold text-xs shadow-soft transition-all cursor-pointer hover:scale-102"
        >
          <Brain className="w-3.5 h-3.5 text-[#88C947]" />
          <span>{lang === 'ar' ? 'سجل الكفاءة السلوكية (Matrix)' : 'Knowledge Matrix'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono font-bold">
            {learningState.mastered_concepts.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* THE 2.5D ISOMETRIC CITY CANVAS SCENE */}
      {/* ========================================================================= */}
      <div className="relative w-full h-[520px] sm:h-[620px] lg:h-[700px] overflow-hidden bg-gradient-to-b from-[#FAF7F0] via-[#F4EFE6] to-[#ECE5D8] flex items-center justify-center">
        {/* SVG Road Network & Landscape Layer */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1000 700"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Road paving pattern */}
            <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DFD7C7" />
              <stop offset="100%" stopColor="#CEC3AF" />
            </linearGradient>
            <linearGradient id="plazaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ECE5D7" />
              <stop offset="100%" stopColor="#DDD2BF" />
            </linearGradient>
          </defs>

          {/* Central Mosque Courtyard Plaza (Spacious Oval) */}
          <ellipse
            cx="500"
            cy="350"
            rx="140"
            ry="75"
            fill="url(#plazaGrad)"
            stroke="#D4A373"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            opacity="0.9"
          />

          {/* Radiating Arterial Isometric Roads */}
          <g stroke="url(#roadGrad)" strokeLinecap="round" opacity="0.85">
            {/* Road to Workplace (North-East: ~74%, 28%) */}
            <path d="M500 350 Q620 280, 740 200" strokeWidth="26" fill="none" />
            <path d="M500 350 Q620 280, 740 200" stroke="#FFF" strokeWidth="2" strokeDasharray="8 8" fill="none" opacity="0.6" />

            {/* Road to Campus (East: ~84%, 52%) */}
            <path d="M500 350 Q680 360, 840 370" strokeWidth="24" fill="none" />
            <path d="M500 350 Q680 360, 840 370" stroke="#FFF" strokeWidth="2" strokeDasharray="8 8" fill="none" opacity="0.6" />

            {/* Road to Halal Market (South-East: ~72%, 72%) */}
            <path d="M500 350 Q620 440, 720 510" strokeWidth="24" fill="none" />
            <path d="M500 350 Q620 440, 720 510" stroke="#FFF" strokeWidth="2" strokeDasharray="8 8" fill="none" opacity="0.6" />

            {/* Road to Café (South-West: ~30%, 68%) */}
            <path d="M500 350 Q390 430, 300 480" strokeWidth="24" fill="none" />
            <path d="M500 350 Q390 430, 300 480" stroke="#FFF" strokeWidth="2" strokeDasharray="8 8" fill="none" opacity="0.6" />

            {/* Road to Gym (West: ~18%, 78%) */}
            <path d="M500 350 Q330 420, 180 540" strokeWidth="22" fill="none" />
            <path d="M500 350 Q330 420, 180 540" stroke="#FFF" strokeWidth="2" strokeDasharray="8 8" fill="none" opacity="0.6" />

            {/* Road to Family Home (North-West: ~26%, 32%) */}
            <path d="M500 350 Q380 270, 260 220" strokeWidth="24" fill="none" />
            <path d="M500 350 Q380 270, 260 220" stroke="#FFF" strokeWidth="2" strokeDasharray="8 8" fill="none" opacity="0.6" />
          </g>

          {/* Lush Green Isometric Trees Across the City Districts */}
          {[
            { cx: 160, cy: 220, r: 16 },
            { cx: 190, cy: 250, r: 20 },
            { cx: 380, cy: 190, r: 18 },
            { cx: 430, cy: 170, r: 15 },
            { cx: 620, cy: 210, r: 22 },
            { cx: 640, cy: 370, r: 18 },
            { cx: 840, cy: 230, r: 20 },
            { cx: 370, cy: 460, r: 22 },
            { cx: 410, cy: 500, r: 18 },
            { cx: 780, cy: 430, r: 20 },
            { cx: 580, cy: 490, r: 16 },
          ].map((tree, idx) => (
            <g key={`tree-${idx}`} opacity="0.85">
              <ellipse cx={tree.cx + 5} cy={tree.cy + 10} rx={tree.r * 1.1} ry={tree.r * 0.55} fill="#C5B8A5" opacity="0.5" />
              <circle cx={tree.cx} cy={tree.cy} r={tree.r} fill="#88C947" />
              <circle cx={tree.cx - 3} cy={tree.cy - 3} r={tree.r * 0.75} fill="#A4E255" />
              <circle cx={tree.cx} cy={tree.cy - 4} r={tree.r * 0.35} fill="#C6F385" opacity="0.6" />
            </g>
          ))}
        </svg>

        {/* ========================================================================= */}
        {/* 7 CLICKABLE ISOMETRIC LANDMARK HUBS WITH ANTI-COLLISION PILL BADGES */}
        {/* ========================================================================= */}
        {landmarks.map((lm) => {
          const isSelected = activeLandmarkId === lm.id;
          const isHovered = hoveredLandmarkId === lm.id;
          const isPopoverOpen = activePopoverId === lm.id;
          const isCompleted = completedLandmarks.includes(lm.id);
          const IconComp = getIcon(lm.id);

          return (
            <div
              key={lm.id}
              style={{
                left: `${lm.mapCoords.x}%`,
                top: `${lm.mapCoords.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-10 transition-transform duration-300"
              onMouseEnter={() => setHoveredLandmarkId(lm.id)}
              onMouseLeave={() => setHoveredLandmarkId(null)}
            >
              {/* Pulsing Milestone Rings on Hover / Active */}
              <div
                className={`absolute -inset-6 rounded-full transition-all duration-500 pointer-events-none ${
                  isSelected
                    ? 'ring-4 ring-[#D4A373] bg-[#D4A373]/20 scale-110 shadow-gold'
                    : isHovered
                    ? 'ring-2 ring-[#D4A373]/80 bg-[#D4A373]/15 scale-105'
                    : 'opacity-0 scale-95'
                }`}
              />

              {/* Landmark Building Container Button */}
              <button
                type="button"
                onClick={() => handleLandmarkClick(lm.id)}
                className="group relative cursor-pointer focus:outline-none flex flex-col items-center"
                aria-label={lang === 'ar' ? lm.nameAr : lm.nameEn}
              >
                {/* 3D Isometric Building Graphic */}
                <div className="relative transform transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-105">
                  {lm.id === 'mosque' && <IsometricMosqueBuilding />}
                  {lm.id === 'office' && <IsometricOfficeBuilding />}
                  {lm.id === 'apartment' && <IsometricApartmentBuilding />}
                  {lm.id === 'cafe' && <IsometricCafeBuilding />}
                  {lm.id === 'market' && <IsometricMarketBuilding />}
                  {lm.id === 'gym' && <IsometricGymBuilding />}
                  {lm.id === 'school' && <IsometricSchoolBuilding />}
                </div>

                {/* Compact, Clean Anti-Collision Pill Badge */}
                <div
                  className={`mt-1 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-soft transition-all duration-300 border whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#2C483F] text-white border-[#D4A373] scale-105 shadow-gold'
                      : isHovered
                      ? 'bg-white text-[#2C483F] border-[#D4A373] scale-105'
                      : 'bg-white/95 text-[#2C483F] border-[#D4A373]/30'
                  }`}
                >
                  <IconComp
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isSelected ? 'text-[#D4A373]' : 'text-[#2C483F]'
                    }`}
                  />
                  <span>
                    {LANDMARK_TRANSLATIONS[lm.id]?.[lang]?.name ||
                      (lang === 'ar' ? lm.nameAr : lm.nameEn)}
                  </span>

                  {isCompleted && (
                    <span className="w-2 h-2 rounded-full bg-[#88C947] shrink-0" title="Completed" />
                  )}

                  <span className="text-[10px] font-mono opacity-70">
                    {lang === 'ar' ? `يوم ${lm.dayAssociation}` : `D${lm.dayAssociation}`}
                  </span>
                </div>
              </button>

              {/* Dynamic Popover on Click or Hover (Only ONE open at a time) */}
              {(isHovered || isPopoverOpen) && (
                <div
                  className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-72 z-30 pointer-events-auto animate-fade-in"
                  onMouseEnter={() => setHoveredLandmarkId(lm.id)}
                >
                  <div className="bg-white/98 backdrop-blur-md rounded-2xl border border-[#D4A373] p-3.5 shadow-soft-lg text-start">
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#D4A373]/20">
                      <span className="text-xs font-extrabold text-[#2C483F]">
                        {LANDMARK_TRANSLATIONS[lm.id]?.[lang]?.name ||
                          (lang === 'ar' ? lm.nameAr : lm.nameEn)}
                      </span>
                      <span className="text-[10px] font-bold text-[#D4A373] bg-[#D4A373]/15 px-2 py-0.5 rounded-full">
                        {lang === 'ar' ? 'معلم تفاعلي' : 'Interactive Landmark'}
                      </span>
                    </div>

                    <p className="text-xs text-[#2C483F]/80 mt-1.5 leading-relaxed line-clamp-2">
                      {LANDMARK_TRANSLATIONS[lm.id]?.[lang]?.teaser ||
                        (lang === 'ar' ? lm.teaserAr : lm.teaserEn)}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-[#D4A373]/15 flex flex-col gap-1.5">
                      {/* Button: Open Building Details & Context */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playSoftTap();
                          onSelectLandmark(lm.id);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-[#2C483F] to-[#1e342d] text-white text-xs font-bold shadow-soft hover:shadow-gold transition-all hover:scale-[1.02] active:scale-95"
                      >
                        <span className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#88C947]" />
                          <span>{lang === 'ar' ? 'سياق وتجارب المعلم' : 'Building Context & Experiences'}</span>
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#D4A373]" />
                      </button>
                    </div>
                  </div>
                  {/* Arrow Pin */}
                  <div className="w-3 h-3 bg-white border-b border-r border-[#D4A373] transform rotate-45 mx-auto -mt-1.5" />
                </div>
              )}
            </div>
          );
        })}

        {/* Floating Bottom Bar over the City Canvas */}
        <div className="absolute bottom-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#D4A373]/30 shadow-soft text-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">{isIslamic ? '🕌' : isIsolated ? '🌌' : '🏙️'}</span>
            <span className="font-bold text-[#2C483F]">
              {cityDetails.title[lang]}
            </span>
            <span className="text-stone-400 hidden sm:inline">|</span>
            <span className="text-stone-600 hidden sm:inline">
              {cityDetails.features[lang]?.[0] || ''}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-bold text-[#2C483F]">
              <CheckSquare className="w-3.5 h-3.5 text-[#88C947]" />
              <span>{lang === 'ar' ? `المسار التفاعلي: اليوم ${activeDayNumber} من 15` : `Day ${activeDayNumber} of 15`}</span>
            </span>
          </div>
        </div>

        {/* If Islamic or Isolated City: Locked Under Development Overlay */}
        {(isIslamic || isIsolated) && (
          <div className="absolute inset-0 z-30 bg-[#14231E]/75 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center animate-fade-in">
            <div className="max-w-md p-6 rounded-3xl bg-white/98 border-2 border-amber-300 shadow-2xl space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-800 border border-amber-300 flex items-center justify-center mx-auto text-2xl shadow-inner">
                <Lock className="w-7 h-7 text-amber-700" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
                  Soon / قريبًا — تحت التطوير
                </span>
                <h4 className="text-base font-black text-[#2C483F]">
                  {cityDetails.title[lang]}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {lang === 'ar'
                    ? 'هذه البيئة تحت التطوير حالياً. يُرجى الانتقال إلى المدينة متعددة الثقافات المتاحة بالكامل.'
                    : 'This environment is under development. Please switch to the open Multicultural City.'}
                </p>
              </div>
              {onOpenProfile && (
                <button
                  type="button"
                  onClick={() => {
                    playSoftTap();
                    onOpenProfile();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#2C483F] hover:bg-[#20362f] text-white text-xs font-bold shadow-soft transition-all cursor-pointer"
                >
                  {lang === 'ar' ? 'المدينة متعددة الثقافات' : 'Switch to Multicultural City'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* ADAPTIVE KNOWLEDGE MATRIX MODAL (Task 3 Requirement) */}
      {/* ========================================================================= */}
      {showMatrixModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-start"
          onClick={() => setShowMatrixModal(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#D4A373]/40 overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-[#2C483F] via-[#243c34] to-[#1a2d27] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#88C947]/20 border border-[#88C947]/40 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-[#88C947]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black flex items-center gap-2">
                    <span>{lang === 'ar' ? 'سجل الكفاءة السلوكية والتعلم التكيفي' : 'Adaptive Knowledge & Behavioral Matrix'}</span>
                  </h3>
                  <p className="text-xs text-stone-300">
                    {lang === 'ar' ? 'تتبع المفاهيم المتقنة والمواقف قيد التعزيز بناءً على المحاكاة الواقعية' : 'Track mastered concepts and active reinforcement needs'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  playSoftTap();
                  setShowMatrixModal(false);
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700">
              {/* Stats Counters */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                  <span className="text-xl font-black text-emerald-800 font-mono">
                    {learningState.mastered_concepts.length}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-900 block">
                    {lang === 'ar' ? 'مفاهيم متقنة' : 'Mastered Concepts'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1">
                  <span className="text-xl font-black text-amber-800 font-mono">
                    {learningState.needs_reinforcement.length}
                  </span>
                  <span className="text-[11px] font-bold text-amber-900 block">
                    {lang === 'ar' ? 'قيد التعزيز' : 'Needs Reinforcement'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-1">
                  <span className="text-xl font-black text-stone-800 font-mono">
                    {learningState.completed_scenarios.length}
                  </span>
                  <span className="text-[11px] font-bold text-stone-700 block">
                    {lang === 'ar' ? 'تجارب مكتملة' : 'Completed Experiences'}
                  </span>
                </div>
              </div>

              {/* Mastered Concepts Section */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black text-[#2C483F] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'ar' ? 'المفاهيم المتقنة (Mastered Concepts):' : 'Mastered Concepts:'}</span>
                </h4>

                {learningState.mastered_concepts.length === 0 ? (
                  <p className="text-stone-400 italic bg-stone-50 p-3 rounded-xl border border-stone-200">
                    {lang === 'ar' ? 'لم يتم تسجيل مفاهيم بعد؛ ابدأ التجارب اليومية بالمدينة.' : 'No mastered concepts yet; start exploring daily experiences.'}
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {learningState.mastered_concepts.map((concept, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold flex items-center gap-1.5 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                        <span>{concept}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Concepts Needing Reinforcement Section */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{lang === 'ar' ? 'مفاهيم قيد التعزيز والمراجعة (Active Reinforcement):' : 'Active Reinforcement:'}</span>
                </h4>

                {learningState.needs_reinforcement.length === 0 ? (
                  <p className="text-emerald-800 font-bold bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{lang === 'ar' ? 'لا توجد مفاهيم تحتاج لتعزيز حالياً؛ مسارك التعليمي مستقر.' : 'No reinforcement needed; your learning path is fully stable.'}</span>
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {learningState.needs_reinforcement.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 font-bold flex items-center gap-1.5 shadow-xs"
                      >
                        <span>⚡</span>
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Ethical Policy Guard Notice */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-stone-50 to-emerald-50/30 border border-emerald-200/80 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'ar' ? 'ضمان النزاهة الأخلاقية والخصوصية التامة:' : 'Ethical Policy & Privacy Guarantee:'}</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {lang === 'ar'
                    ? 'يخضع النظام لسياسة حوكمة صارمة تمنع تخزين أو تقييم أي مؤشرات دينية، إيمانية، أو تشخيصات نفسية ومزاجية للمستخدم. التتبع مقتصر على المهارات المعرفية والسلوكية لتيسير التعلم فقط.'
                    : 'Strict policy forbids storing or assessing any faith scores, piety levels, or psychological sentiment.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    playSoftTap();
                    resetLearningState();
                    setLearningState(getLearningState());
                  }}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'إعادة تعيين سجل التعلم' : 'Reset Learning State'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowMatrixModal(false)}
                  className="px-5 py-2 rounded-xl bg-[#2C483F] text-white text-xs font-bold shadow-soft hover:bg-[#1f352e] cursor-pointer"
                >
                  {lang === 'ar' ? 'إغلاق السجل' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
