export type Language = 'ar' | 'en' | 'fr' | 'es';

export type Gender = 'male' | 'female';
export type AgeGroup = 'teen' | 'adult';
export type CityType = 'islamic' | 'multicultural' | 'isolated';

export interface UserProfile {
  gender: Gender;
  ageGroup: AgeGroup;
  country: string;
  cityType: CityType;
  completedOnboarding: boolean;
}

export type LandmarkId = 'office' | 'apartment' | 'cafe' | 'mosque' | 'market' | 'gym' | 'school' | 'street';

export interface FloatingBadge {
  id: string;
  text: string;
  type: 'peace' | 'stress' | 'neutral';
  value: number;
  timestamp: number;
}

export interface TranquilityState {
  score: number; // 0 - 100
  levelLabel: { ar: string; en: string };
  peacePoints: number;
  stressReduced: number;
  recentBadges: FloatingBadge[];
}

export interface KnowledgeStage {
  id: string;
  title: { ar: string; en: string };
  subtitle: { ar: string; en: string };
  category: { ar: string; en: string };
  icon: string;
  progress: number; // 0 - 100
  durationMinutes: number;
  completed: boolean;
  unlocked: boolean;
  description: { ar: string; en: string };
  quote?: { ar: string; en: string; source: string };
}

export interface UserSettings {
  geminiApiKey: string;
  soundEnabled: boolean;
  dailyReminder: boolean;
  voiceGender: 'anas' | 'calm';
}

// ==========================================
// 2.5D Isometric City Map Architectural Types
// ==========================================

export interface CityLandmark {
  id: LandmarkId;
  nameAr: string;
  nameEn: string;
  subtitleAr: string;
  subtitleEn: string;
  teaserAr: string;
  teaserEn: string;
  iconName: string;
  mapCoords: { x: number; y: number }; // Percentage coords in isometric canvas
  primaryColor: string;
  accentColor: string;
  ambientGlow: string;
  dayAssociation: number;
}

// ==========================================
// Future-Ready Building Experience Architecture
// ==========================================

export type ExperienceType = 'interactive' | 'reflection' | 'practice' | 'quiz' | 'scenario';
export type ExperienceStatus = 'locked' | 'available' | 'in_progress' | 'completed';

export interface Experience {
  experienceId: string;
  environmentId: 'multicultural';
  day: number;
  buildingId: LandmarkId;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  type?: ExperienceType | string;
  status?: ExperienceStatus;
  component?: string;
  completionCondition?: string;
  objectiveAr?: string;
  objectiveEn?: string;
}

export interface DailyTask {
  taskId: string;
  environmentId: 'multicultural';
  day: number;
  buildingId?: LandmarkId;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  promptAr?: string;
  promptEn?: string;
  status?: 'pending' | 'completed';
}

export interface WeekMilestone {
  weekNumber: 1 | 2 | 3 | 4;
  titleAr: string;
  titleEn: string;
  themeAr: string;
  themeEn: string;
  daysRange: [number, number];
  icon: string;
  badgeLabelAr: string;
  badgeLabelEn: string;
  isLocked: boolean;
}

export interface JourneyDay {
  dayNumber: number; // 1 to 30
  weekNumber: 1 | 2 | 3 | 4;
  title: { ar: string; en: string };
  isLocked: boolean;
}

// ==========================================
// World Memory Engine Types
// ==========================================

export interface WorldMemoryState {
  currentDay: number;
  week1Completed: boolean;
  completedExperiences: string[];
  completedTasks: string[];
  milestonesUnlocked: string[];
  totalPeaceEarned: number;
  totalStressAlleviated: number;
}

// ==========================================
// Anas Proactive Companion HUD Types
// ==========================================

export type AnasEmotion = 'smiling' | 'waving' | 'holding_lantern' | 'nodding';

export interface QuickReplyChip {
  id: string;
  labelAr: string;
  labelEn: string;
  responseAr: string;
  responseEn: string;
  peaceDelta?: number;
  emotion: AnasEmotion;
}

// ==========================================
// User Adaptation & Personalization Types
// ==========================================

export type AddressingPreference = 'female' | 'male' | 'neutral';
export type LearningLevel = 'beginner' | 'intermediate' | 'advanced';
export type InteractionStyle = 'guided' | 'autonomous' | 'reflective';

export interface UserPersonalizationProfile {
  preferredLanguage: Language;
  preferredAddressing: AddressingPreference;
  learningLevel: LearningLevel;
  interests: string[];
  completedExperiences: string[];
  completedTasks: string[];
  currentDay: number;
  currentExperience?: string;
  preferredInteractionStyle: InteractionStyle;
  difficultTopics: string[];
  recentQuestions: string[];
  recentChoices: string[];
  confidenceSignals: Record<string, number>;
  accessibilityPreferences: {
    textScale: 'normal' | 'large';
    soundEnabled: boolean;
  };
}

// ==========================================
// Dynamic Reasoning & Structured Decision Contract
// ==========================================

export type RafiqIntent = 'EXPLANATION' | 'INTERACTIVE_EXPERIENCE' | 'HUMAN_REFERRAL';
export type RafiqSceneType = 'PRAYER' | 'WUDU' | 'SOCIAL' | 'ENVIRONMENT';

export interface RafiqInteractiveElement {
  id: string;
  label: string;
  soundOrAnim?: string;
  completed?: boolean;
  tactileEffect?: string;
}

export interface RafiqExperiencePayload {
  sceneType: RafiqSceneType;
  coreAction: string;
  interactiveElements: RafiqInteractiveElement[];
  tranquilityDelta: number;
}

export interface RafiqStructuredDecision {
  intent: RafiqIntent;
  shortAnswer: string;
  sourceReference: string;
  experiencePayload: RafiqExperiencePayload | null;
}

// ==========================================
// 4-Tier Content Control Matrix & 5-Stage Loop
// ==========================================

export type ContentTier =
  | 'tier_a' // Established Core Facts (Quran, Sunnah, 5 Pillars, 6 Articles, Wudu, Prayer)
  | 'tier_b' // Explanations, Wisdom & Public Doubts (Maqasid, rationale, misconceptions)
  | 'tier_c' // Scholarly Jurisprudential Differences (Subsidiary fiqh, concessions, Taysir)
  | 'tier_d'; // Individual Legal Inquiries & Sensitive Statuses (Kill-Switch -> Human Referral)

export type SimulationStage =
  | 1 // Stage 1: Onboarding & Context Setup (التهيئة وتحديد البيئة)
  | 2 // Stage 2: Interactive Scenario & Decision (الموقف التفاعلي والقرار الحركي)
  | 3 // Stage 3: Smart Processing & Grounded RAG (المعالجة الذكية والتحقق الشرعي)
  | 4 // Stage 4: Conflict Resolution & World Memory (تفكيك التضارب والذاكرة العائدة)
  | 5; // Stage 5: Periodic Review & Human Referral (التقييم الدوري والإحالة البشرية)

export interface CognitiveLoadMetrics {
  cognitiveOverloadReductionPercent: number; // Target 60%
  realWorldReadinessPercent: number; // Target 85%
  hesitationLevel: 'low' | 'moderate' | 'elevated';
  activeMaximsApplied: string[]; // e.g. "المشقة تجلب التيسير", "الأصل في الأشياء الطاهرة الإباحة"
}

// ==========================================
// Approved Source Registry & Grounding Types
// ==========================================

export type ApprovedSourceFamily =
  | 'dawah_center' // المستودع الدعوي الرقمي (dawa.center)
  | 'jamhara_dict' // موسوعة مفردات المحتوى الإسلامي / الجمهرة (islamic-content.com)
  | 'quranpedia' // مجمع الملك فهد لطباعة المصحف والترجمات المعتمدة (quranpedia.net)
  | 'dorar_tafsir' // موسوعة التفسير — الدرر السنية (dorar.net/tafseer)
  | 'dorar_hadith' // الموسوعة الحديثية — الدرر السنية (dorar.net/hadith)
  | 'dorar_aqeedah' // الموسوعة العقدية — الدرر السنية (dorar.net/aqeeda)
  | 'dorar_fiqh' // الموسوعة الفقهية — الدرر السنية (dorar.net/feqhia)
  | 'dorar_history' // موسوعة التاريخ والسيرة — الدرر السنية (dorar.net/history)
  | 'bayyinah_qa' // كتاب بينات: أسئلة وأجوبة عن الإسلام (dawa.center/file/7937)
  | 'new_muslim_guide' // كتاب دليل المسلم الجديد — د. فهد باهمام
  | 'facilitated_primers' // سلسلة المتون الميسرة — الشيخ د. هيثم سرحان
  | 'shamela'; // المكتبة الشاملة لعيون التراث والحديث

export type SourceType =
  | 'quran'
  | 'hadith'
  | 'tafsir'
  | 'fiqh'
  | 'aqeedah'
  | 'history'
  | 'dictionary'
  | 'dawah';

export type GroundingLevel = 'HIGH_GROUNDING' | 'PARTIAL_GROUNDING' | 'INSUFFICIENT_GROUNDING';

export interface ApprovedSourceRegistryItem {
  family: ApprovedSourceFamily;
  nameAr: string;
  nameEn: string;
  url: string;
  category: SourceType;
  descriptionAr: string;
  descriptionEn: string;
  isOfficialRegistry: boolean;
}

export interface TrustedKnowledgeChunk {
  id: string;
  sourceFamily: ApprovedSourceFamily;
  sourceName: string;
  sourceUrl: string;
  sourceType: SourceType;
  title: string;
  text: string;
  topic: string;
  language: 'ar' | 'en' | 'both';
  authenticityLevel?: string;
  madhhabScope?: string;
  notes?: string;
  surahAyah?: string; // For Quran
  hadithCitation?: string; // For Hadith
  dictionaryTerm?: {
    termAr: string;
    termEn: string;
    approvedTranslation: string;
    definitionAr: string;
    definitionEn: string;
  };
  keywords: string[];
  relatedExperienceIds?: string[];
  day?: number;
  learningLevel?: LearningLevel;
}

// ==========================================
// 2.5D Generative Experience Primitives & Schemas
// ==========================================

export type SceneObjectType =
  | 'door'
  | 'desk'
  | 'chair'
  | 'prayer_mat'
  | 'food'
  | 'plate'
  | 'phone'
  | 'backpack'
  | 'water'
  | 'shelf'
  | 'bench'
  | 'sign'
  | 'room'
  | 'window'
  | 'tree'
  | 'lamp'
  | 'person_silhouette';

export interface SceneObjectState {
  stateId: string;
  labelAr: string;
  labelEn: string;
  visualEffect?: string;
  icon?: string;
  color?: string;
}

export interface SceneObject {
  id: string;
  type: SceneObjectType;
  position: { x: number; y: number }; // Percentage 0 - 100 on 2.5D canvas
  size: { width: number; height: number }; // Percentage width/height
  layer: number; // Z-ordering
  interactive: boolean;
  nameAr: string;
  nameEn: string;
  currentState: string;
  states: SceneObjectState[];
  actionPromptAr?: string;
  actionPromptEn?: string;
}

export interface SceneInteraction {
  interactionId: string;
  targetObjectId: string;
  fromState: string;
  toState: string;
  triggerLabelAr: string;
  triggerLabelEn: string;
  narrationAr: string;
  narrationEn: string;
  learningMomentId?: string;
  peaceAward?: number;
}

export interface LearningMoment {
  id: string;
  learningStatementAr: string;
  learningStatementEn: string;
  sourceIds: string[];
  scholarlyNoteAr?: string;
  scholarlyNoteEn?: string;
}

export interface Structured2D5Experience {
  experienceId: string;
  titleAr: string;
  titleEn: string;
  location: 'university' | 'apartment' | 'office' | 'market' | 'mosque';
  buildingId: LandmarkId;
  objectiveAr: string;
  objectiveEn: string;
  difficulty: LearningLevel;
  groundedSourceIds: string[];
  scene: {
    type: '2.5d';
    background: 'university_hallway' | 'apartment_bedroom' | 'office_workspace' | 'market_street';
    objects: SceneObject[];
  };
  interactions: SceneInteraction[];
  learningMoments: LearningMoment[];
  completionCondition: {
    requiredInteractionIds: string[];
  };
  reflection: {
    textAr: string;
    textEn: string;
  };
  isGenerated?: boolean;
}

// ==========================================
// Real-Time AI Pipeline Trace for Judges
// ==========================================

export interface AiPipelineTraceData {
  timestamp: number;
  userInput: string;
  nlp: {
    normalizedText: string;
    tokens: string[];
    intent: string;
    topic: string;
    detectedLevel: LearningLevel;
    queryType: string;
    extractedAction?: {
      actionName: string;
      targetId: string;
    };
  };
  rag: {
    matchedSourceCount: number;
    topSources: {
      id: string;
      title: string;
      sourceName: string;
      sourceType: SourceType;
      url: string;
      score: number;
    }[];
    groundingLevel: GroundingLevel;
    confidenceScore: number;
  };
  personalization: {
    addressing: AddressingPreference;
    learningLevel: LearningLevel;
    contextReason: string;
  };
  actionExecuted?: {
    actionType: string;
    targetId: string;
    status: 'executed' | 'recommended' | 'idle';
  };
  experienceValidation?: {
    totalStatements: number;
    groundedStatements: number;
    allGrounded: boolean;
    experienceId?: string;
  };
}

// ==========================================
// AI Mini-Game Lab (مختبر أنس التعليمي)
// Independent 2D Structured Generation Architecture
// ==========================================

export type MiniGameMechanic =
  | 'object_interaction' // تفاعل ومسح ورسم مباشر على مجسم في المشهد
  | 'spatial_placement' // وضع وتثبيت في موضع مكاني محدد
  | 'sequencing' // ترتيب خطوات
  | 'sorting' // تصنيف ومقارنة
  | 'inspection' // فحص واستكشاف عناصر
  | 'explore_discover' // استكشاف بيئة ومحطات
  | 'scenario_decision' // اتخاذ قرار موقف
  | 'matching'; // مطابقة مفهوم

export interface InteractiveTargetZone {
  id: string;
  labelAr: string;
  labelEn: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  width?: number; // percentage width
  height?: number; // percentage height
  shape?: 'rect' | 'circle' | 'path' | 'stroke';
  isCorrect: boolean;
  hintAr?: string;
  feedbackAr: string;
  feedbackEn: string;
  sourceId?: string;
}

export interface InteractiveVisualObject {
  objectType:
    | 'sock_wiping'
    | 'wudu_limb'
    | 'prayer_mat'
    | 'compass_qibla'
    | 'heart_scale'
    | 'food_cloche'
    | 'door_portal'
    | 'sujud_seven_parts'
    | 'generic_canvas';
  titleAr: string;
  titleEn: string;
  instructionAr: string;
  instructionEn: string;
  targetZones: InteractiveTargetZone[];
  promptPath?: string;
}

export interface MiniGameElement {
  id: string;
  labelAr: string;
  labelEn: string;
  sublabelAr?: string;
  icon?: string;
  correctCategory?: string; // For sorting
  correctOrder?: number; // For sequencing (1-indexed)
  isNeedsInspection?: boolean; // For food inspection
  isConcession?: boolean; // For concessions
  targetPosition?: { x: number; y: number }; // For spatial placement
  explanationAr?: string;
  sourceId?: string;
}

export interface MiniGameCategory {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr?: string;
  color?: string;
  icon?: string;
}

export interface MiniGameScenarioOption {
  id: string;
  textAr: string;
  textEn: string;
  isCorrect: boolean;
  feedbackAr: string;
  feedbackEn: string;
  sourceId?: string;
}

export interface MiniGameScenario {
  id: string;
  situationAr: string;
  situationEn: string;
  contextAr: string;
  options: MiniGameScenarioOption[];
  icon?: string;
}

export interface AiMiniGame {
  id: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  topic: string;
  learningObjectiveAr: string;
  learningObjectiveEn: string;
  sourceIds: string[];
  mechanic: MiniGameMechanic;
  difficulty: LearningLevel;
  sceneTheme:
    | 'classroom'
    | 'travel_road'
    | 'restaurant_table'
    | 'prayer_room'
    | 'desert_oasis'
    | 'home_living'
    | 'wudu_station'
    | 'market_shelf'
    | 'mosque_arch';
  interactiveObject?: InteractiveVisualObject;
  elements?: MiniGameElement[];
  categories?: MiniGameCategory[];
  scenarios?: MiniGameScenario[];
  feedback: {
    successAr: string;
    successEn: string;
    scholarlyNoteAr?: string;
    scholarlyNoteEn?: string;
  };
  completionConditionAr: string;
  isAiGenerated: boolean;
}

// =========================================================================
// Rafiq Dynamic Gemini Cognitive Pipeline & Session Orchestration Types
// =========================================================================

export type SemanticCategory =
  | 'WORSHIP_RECOVERY'
  | 'PURITY_CONCESSION'
  | 'SOCIAL_INTEGRATION'
  | 'TRAVEL_WEATHER_EASE'
  | 'HEART_CERTAINTY'
  | 'ESCALATE_HUMAN';

export type DetectedEmotion = 'anxious' | 'guilty' | 'hesitant' | 'calm' | 'peaceful';

export type EngineTarget =
  | 'ENGINE_PRAYER'
  | 'ENGINE_WUDU'
  | 'ENGINE_SOCIAL'
  | 'ENGINE_TRAVEL'
  | 'ENGINE_HEART';

export interface SceneParameters {
  focusSubject: string;
  remedialInstruction: string;
}

export interface ActionTrigger {
  engineTarget: EngineTarget;
  tactileActionLabel: string;
  sceneParameters: SceneParameters;
}

export interface RafiqCognitiveResponse {
  semanticCategory: SemanticCategory;
  companionReply: string;
  verifiedSourceTag: string;
  detectedEmotion: DetectedEmotion;
  tranquilityDelta: number;
  actionTrigger?: ActionTrigger | null;
}

export interface JourneyLogEntry {
  id: string;
  timestamp: number;
  dateStr: string;
  contextTag: string;
  titleAr: string;
  titleEn: string;
  delta: number;
  scoreAfter: number;
  emotion: DetectedEmotion;
  engineTarget?: string;
  concessionUnlocked?: string;
  verifiedSource?: string;
}

export interface UnlockedBadge {
  id: string;
  titleAr: string;
  titleEn: string;
  icon: string;
  unlockedAt: string;
  category: string;
  descriptionAr: string;
}

export interface RafiqDynamicSession {
  tranquilityScore: number;
  journeyLog: JourneyLogEntry[];
  unlockedBadges: UnlockedBadge[];
  tranquilityHistory: Array<{ day: number; date: string; score: number; eventAr: string }>;
  lastEmotionalState: DetectedEmotion;
  gentleModeActive: boolean;
  totalCompletedActions: number;
}

// Re-export Phase 1 Unified Scenario Knowledge Types
export * from './scenarioKnowledge';
// Re-export Phase 3 Structured NLU Routing Types
export * from './routingTypes';

