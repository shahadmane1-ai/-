import {
  ContentTier,
  CognitiveLoadMetrics,
  GroundingLevel,
  LearningLevel,
  RafiqExperiencePayload,
  RafiqIntent,
  RafiqStructuredDecision,
  SourceType,
  TrustedKnowledgeChunk,
  UserPersonalizationProfile,
} from '../types';
import { TRUSTED_KNOWLEDGE_BASE } from './knowledgeBase';
import {
  analyzeArabicNlp,
  extractNlpTokens,
  NlpAnalysisResult,
  normalizeArabicNlp,
  stemArabicWord,
} from './arabicNlp';
import { inflectArabic } from './userAdaptation';

export interface RetrievedSourceItem {
  chunk: TrustedKnowledgeChunk;
  score: number;
  relevanceReasonAr: string;
  relevanceReasonEn: string;
}

export interface AnasAiHelpSummary {
  headlineAr: string;
  operationsAr: string[];
  sourceCount: number;
  levelLabelAr: string;
  adaptationNoticeAr?: string;
  suggestedGameTopic?: string;
  suggestedActionLabelAr?: string;
  tierBadgeAr?: string;
  cognitiveLoadReducedPercent?: number;
}

export interface ConversationTurn {
  sender: 'user' | 'anas';
  text: string;
}

export interface ContentTierClassification {
  tier: ContentTier;
  tierLabelAr: string;
  tierLabelEn: string;
  reasonAr: string;
  reasonEn: string;
  triggeredKillSwitch: boolean;
  refusalDisclaimerAr?: string;
  refusalDisclaimerEn?: string;
  maximsApplied: string[];
}

/**
 * Deterministic 4-Tier Content Control Matrix Classifier (Official Guidelines)
 * Evaluates the query to strictly enforce:
 * - Tier A: Established Core Facts (Quran, Sunnah, 5 Pillars, 6 Articles, Wudu, Prayer, Sujud Sahw)
 * - Tier B: Explanations, Wisdom & Public Doubts (Maqasid, rationale, misconceptions)
 * - Tier C: Scholarly Jurisprudential Differences (Subsidiary fiqh, concessions, Taysir)
 * - Tier D: Individual Legal Inquiries & Sensitive Statuses (Kill-Switch -> Human Referral)
 */
export function classifyContentTier(query: string, nlp?: NlpAnalysisResult): ContentTierClassification {
  const norm = normalizeArabicNlp(query);
  const qLower = query.toLowerCase();

  // =========================================================================
  // TIER D: INDIVIDUAL LEGAL INQUIRIES & SENSITIVE STATUSES (KILL-SWITCH)
  // Specific personal contracts, marriage validity, divorce/Khul', inheritance/estate disputes, medical/criminal litigation
  // =========================================================================
  const isSpecificMarriageDispute =
    norm.includes('عقد زواجي') ||
    norm.includes('نكاحي') ||
    norm.includes('تزوجت بدون ولي') ||
    norm.includes('شروط عقدي') ||
    norm.includes('شهود النكاح بحالتي') ||
    norm.includes('تزوجنا سرا') ||
    norm.includes('مهر مؤخر نزاع') ||
    norm.includes('حكم عقدي في المحكمة');

  const isSpecificDivorceDispute =
    norm.includes('طلقت زوجتي') ||
    norm.includes('هل وقع طلاقي') ||
    norm.includes('زوجي قال لي طالق') ||
    norm.includes('زوجي قال طالق') ||
    norm.includes('طلقة بائنة') ||
    norm.includes('عدة الطلاق بحالتي') ||
    norm.includes('رجعة في العدة') ||
    norm.includes('دعوى خلع') ||
    norm.includes('فسخ نكاح');

  const isSpecificInheritanceDispute =
    (norm.includes('توفي') || norm.includes('مات') || norm.includes('وفاة')) &&
    (norm.includes('تركة') || norm.includes('ميراث') || norm.includes('ورثة') || norm.includes('عقار'));

  const isSpecificCourtOrLitigation =
    norm.includes('قضية في المحكمة') ||
    norm.includes('دعوى قضائية') ||
    norm.includes('نزاع مالي بيني وبين شريكي') ||
    norm.includes('شرط جزائي بيني وبين');

  const isSpecificCriminalOrAbortion =
    norm.includes('إجهاض جنين') ||
    norm.includes('اسقاط جنين') ||
    norm.includes('دية قتل') ||
    norm.includes('قصاص بحالتي');

  const isTierD =
    isSpecificMarriageDispute ||
    isSpecificDivorceDispute ||
    isSpecificInheritanceDispute ||
    isSpecificCourtOrLitigation ||
    isSpecificCriminalOrAbortion;

  if (isTierD) {
    return {
      tier: 'tier_d',
      tierLabelAr: 'المستوى د: فتوى أو مسألة قضائية خاصة (إحالة بشرية)',
      tierLabelEn: 'Tier D: Individual Legal Edict / Sensitive Status (Kill-Switch & Referral)',
      reasonAr: 'المسألة تتعلق بنازلة شخصية أو قضائية خاصة تستوجب النظر في ملابساتها لدى جهة إفتاء أو قضاء رسمي معتمد.',
      reasonEn: 'Inquiry involves personal status, marriage, divorce, or estate division requiring human authority.',
      triggeredKillSwitch: true,
      refusalDisclaimerAr:
        'تنويه شرعي وأخلاقي: «رفيق» هو محاكٍ معرفي ورفيق وجداني لبناء العادات للمسلم الجديد، وليس مفتياً شرعياً ولا يصدر أحكاماً في النوازل الشخصية والقضائية الخاصة (كالطلاق، النكاح، المواريث، والنزاعات التعاقدية). لهذه المسائل الدقيقة، نحيلك فوراً إلى المشايخ والمفتين المعتمدين والمراكز الرسمية.',
      refusalDisclaimerEn:
        'Ethical & Scholarly Note: Rafeeq is a cognitive habit-building companion for new Muslims and is definitively not an automated mufti. It does not issue verdicts on specific private contracts, marriage validity, divorce, or inheritance disputes. Please consult accredited official scholars.',
      maximsApplied: ['درء المفاسد مقدم على جلب المصالح', 'الفتوى مسؤولية أهل الذكر والاختصاص'],
    };
  }

  // =========================================================================
  // TIER C: SCHOLARLY JURISPRUDENTIAL DIFFERENCES (SUBSIDIARY FIQH & CONCESSIONS)
  // Subsidiary fiqh variations across the four Sunni madhhabs, travel/work prayer concessions, wiping durations
  // =========================================================================
  const isSubsidiaryFiqhDifference =
    norm.includes('مذاهب') ||
    norm.includes('المذاهب الاربعه') ||
    norm.includes('خلاف العلماء') ||
    norm.includes('ابو حنيفه') ||
    norm.includes('مالك') ||
    norm.includes('الشافعي') ||
    norm.includes('احمد') ||
    norm.includes('مدة المسح') ||
    norm.includes('مسح الخفين') ||
    norm.includes('المسافر والمقيم') ||
    norm.includes('جمع وقصر') ||
    norm.includes('قصر الصلاه') ||
    norm.includes('صلاة في الطياره') ||
    norm.includes('مطر شديد') ||
    norm.includes('رخصه') ||
    norm.includes('رخص');

  if (isSubsidiaryFiqhDifference) {
    return {
      tier: 'tier_c',
      tierLabelAr: 'المستوى ج: مسائل خلافية واجتهادية (سعة الفقه والتيسير)',
      tierLabelEn: 'Tier C: Scholarly Jurisprudential Differences (Taysir & Legitimate Latitude)',
      reasonAr: 'المسألة تتسع لاجتهاد أئمة المذاهب المعتبرة، ويُبرز فيها التيسير وسعة الخلاف المعتبر دون تعصب مذهبي.',
      reasonEn: 'Inquiry involves legitimate subsidiary fiqh variations where ease and scholarly breadth apply.',
      triggeredKillSwitch: false,
      maximsApplied: [
        'المشقة تجلب التيسير',
        'الأصل في الأشياء الطاهرة الإباحة',
        'اليقين لا يزول بالشك',
        'سعة الخلاف رحمة وتيسير للأمة',
      ],
    };
  }

  // =========================================================================
  // TIER B: EXPLANATIONS, WISDOM & PUBLIC DOUBTS (MAQASID & MISCONCEPTIONS)
  // Objectives of Islamic Law (Maqasid al-Shariah), rationale of worship, addressing misconceptions
  // =========================================================================
  const isWisdomOrDoubt =
    norm.includes('حكمه') ||
    norm.includes('لماذا') ||
    norm.includes('ليش') ||
    norm.includes('مقاصد') ||
    norm.includes('سيف') ||
    norm.includes('بالسيف') ||
    norm.includes('انتشر بالسيف') ||
    norm.includes('اكراه') ||
    norm.includes('اجبار') ||
    norm.includes('شبهه') ||
    norm.includes('تناقض') ||
    norm.includes('كتبه محمد') ||
    norm.includes('الكعبه') ||
    norm.includes('ليش نصلي للكعبه') ||
    norm.includes('الخنزير') ||
    norm.includes('لحم الخنزير') ||
    norm.includes('الميته');

  if (isWisdomOrDoubt) {
    return {
      tier: 'tier_b',
      tierLabelAr: 'المستوى ب: شرح وحكمة واستدلال (مقاصد الشريعة والرد على الشبهات)',
      tierLabelEn: 'Tier B: Explanations, Wisdom & Public Doubts (Maqasid & Sourced Clarification)',
      reasonAr: 'المسألة تقتضي بياناً رصيناً لحكمة التشريع ومقاصده، أو توضيحاً موضوعياً لشبهة شائعة بالأدلة المعتمدة.',
      reasonEn: 'Inquiry explores legal wisdom, rationale of worship, or objective answers to public doubts.',
      triggeredKillSwitch: false,
      maximsApplied: [
        'لا إكراه في الدين',
        'الحكم يدور مع علته ومصلحة العباد',
        'الشريعة مبنية على جلب المصالح ودرء المفاسد',
      ],
    };
  }

  // =========================================================================
  // TIER A: ESTABLISHED CORE FACTS (DEFAULT BASELINE)
  // Quran, Sunnah, Five Pillars, Six Articles of Faith, baseline Seerah, Wudu, Prayer, Sujud Sahw
  // Never refuse or say "I am not a mufti" for Tier A.
  // =========================================================================
  return {
    tier: 'tier_a',
    tierLabelAr: 'المستوى أ: أصول مستقرة وأركان العبادات (إرشاد حركي فوري)',
    tierLabelEn: 'Tier A: Established Core Facts & Rites (Direct Step-by-Step Guidance)',
    reasonAr: 'معلومات قطعية مجمع عليها وأركان أساسية يُجاب عنها فوراً وبخطوات عملية ميسرة.',
    reasonEn: 'Foundational verified Islamic consensus and step-by-step motor practice.',
    triggeredKillSwitch: false,
    maximsApplied: [
      'إن الدين يسر',
      'صلوا كما رأيتموني أصلي',
      'اليقين لا يزول بالشك',
    ],
  };
}

export interface RagRetrievalResult {
  query: string;
  nlp: NlpAnalysisResult;
  sources: RetrievedSourceItem[];
  topChunks: TrustedKnowledgeChunk[];
  chunks: TrustedKnowledgeChunk[]; // Backward compatibility alias
  groundingLevel: GroundingLevel;
  confidenceScore: number;
  confidence: number; // Backward compatibility alias
  hasDirectEvidence: boolean;
  contextMatched: boolean;
  isAmbiguous?: boolean;
  isFollowUp?: boolean;
  suggestedAction?: {
    actionName: 'openExperience' | 'openBuilding' | 'openTask' | 'openMiniGame';
    targetId: string;
    humanLabelAr: string;
    gameTopic?: string;
  };
  retrievedContextText: string;
  groundedAnswerSynthesisAr?: string;
  groundedAnswerSynthesisEn?: string;
  aiHelpSummary?: AnasAiHelpSummary;
  isGameRequest?: boolean;
  contentTier: ContentTier;
  isTierDRefusal: boolean;
  cognitiveMetrics: CognitiveLoadMetrics;
  structuredDecision?: RafiqStructuredDecision;
  intent?: RafiqIntent;
  experiencePayload?: RafiqExperiencePayload | null;
  sourceReference?: string;
}

// =========================================================================
// STRICT DYNAMIC SCHEMATIC REASONING ENGINE (JSON CONTRACT)
// Path A: Conceptual question -> EXPLANATION (max 2 lines, Taysir focus, experiencePayload: null)
// Path B: Practical struggle/forgetfulness/action -> INTERACTIVE_EXPERIENCE ("دعنا نتدرب عليها عملياً معاً الآن." + dynamic experiencePayload)
// Path C: Divorce/custody/contracts/inheritance -> HUMAN_REFERRAL (escalation flag, no autonomous fatwa)
// =========================================================================
export function evaluateRafiqStructuredDecision(
  query: string,
  options: RetrievalOptions = {}
): RafiqStructuredDecision {
  const norm = normalizeArabicNlp(query);
  const isFemale = (options.userProfile?.preferredAddressing || 'female') === 'female';
  const addressingVocative = isFemale ? 'يا أختي' : 'يا أخي';

  // PATH C: IF AND ONLY IF the input involves divorce, child custody, legal contracts, or inheritance disputes:
  const isPathC =
    norm.includes('طلاق') ||
    norm.includes('طلقت') ||
    norm.includes('خلع') ||
    norm.includes('حضانة') ||
    norm.includes('حضانتي') ||
    norm.includes('ميراث') ||
    norm.includes('تركة') ||
    norm.includes('عقد زواج') ||
    norm.includes('عقد نكاح') ||
    norm.includes('نزاع قضائي') ||
    norm.includes('محكمة') ||
    norm.includes('دعوى قضائية') ||
    norm.includes('إجهاض') ||
    norm.includes('قصاص');

  if (isPathC) {
    return {
      intent: 'HUMAN_REFERRAL',
      shortAnswer: isFemale
        ? 'هذه مسألة قضائية وأسرية خاصة يا أختي تستوجب الاستماع الدقيق من جهات الإفتاء الرسمية لحفظ الحقوق وصيانتها. نحيلكِ فوراً للتواصل مع دار الإفتاء أو مستشار معتمد.'
        : 'هذه مسألة قضائية وأسرية خاصة يا أخي تستلزم الاستماع الدقيق من جهات الإفتاء الرسمية لحفظ الحقوق وصيانتها. نحيلك فوراً للتواصل مع دار الإفتاء أو مستشار معتمد.',
      sourceReference: 'الرئاسة العامة للبحوث العلمية والإفتاء',
      experiencePayload: null,
    };
  }

  // PATH B: IF the input is a practical struggle, forgetfulness, anxiety, or physical action:
  const isPracticalStruggleOrAction =
    norm.includes('أنسى') ||
    norm.includes('انسي') ||
    norm.includes('نسيت') ||
    norm.includes('أشك') ||
    norm.includes('اشك') ||
    norm.includes('شككت') ||
    norm.includes('شك') ||
    norm.includes('أخجل') ||
    norm.includes('اخجل') ||
    norm.includes('خجل') ||
    norm.includes('أخاف') ||
    norm.includes('اخاف') ||
    norm.includes('خوف') ||
    norm.includes('أتردد') ||
    norm.includes('اتردد') ||
    norm.includes('تردد') ||
    norm.includes('كيف أفعل') ||
    norm.includes('كيف افعل') ||
    norm.includes('كيف أصلي') ||
    norm.includes('كيف اصلي') ||
    norm.includes('كيف أتوضأ') ||
    norm.includes('كيف اتوضا') ||
    norm.includes('كيف أمسح') ||
    norm.includes('كيف امسح') ||
    norm.includes('كيف أتعامل') ||
    norm.includes('كيف اتعامل') ||
    norm.includes('وسواس') ||
    norm.includes('أخطأت') ||
    norm.includes('اخطات') ||
    norm.includes('تلعثمت') ||
    norm.includes('ثقل') ||
    norm.includes('صعوبة') ||
    norm.includes('حرج') ||
    norm.includes('خطوات') ||
    norm.includes('ترتيب الصلاة') ||
    norm.includes('ترتيب الصلاه') ||
    norm.includes('ترتيب الوضوء') ||
    norm.includes('سجود السهو') ||
    norm.includes('سهو') ||
    norm.includes('ركعات') ||
    norm.includes('سجدت');

  if (isPracticalStruggleOrAction) {
    const isPrayerDomain =
      norm.includes('صلاة') ||
      norm.includes('صلاه') ||
      norm.includes('صلي') ||
      norm.includes('ركوع') ||
      norm.includes('سجود') ||
      norm.includes('سهو') ||
      norm.includes('ركعة') ||
      norm.includes('ركعه') ||
      norm.includes('تشهد') ||
      norm.includes('قبلة') ||
      norm.includes('قبله') ||
      norm.includes('تكبيرة') ||
      norm.includes('فاتحة');

    const isWuduDomain =
      norm.includes('وضوء') ||
      norm.includes('وضو') ||
      norm.includes('طهارة') ||
      norm.includes('طهاره') ||
      norm.includes('ماء') ||
      norm.includes('غسل') ||
      norm.includes('مسح') ||
      norm.includes('جورب') ||
      norm.includes('خف') ||
      norm.includes('ريح') ||
      norm.includes('انتقاض');

    const isSocialDomain =
      norm.includes('أخجل') ||
      norm.includes('اخجل') ||
      norm.includes('أهلي') ||
      norm.includes('اهلي') ||
      norm.includes('أمي') ||
      norm.includes('امي') ||
      norm.includes('أبي') ||
      norm.includes('ابي') ||
      norm.includes('والد') ||
      norm.includes('زملائي') ||
      norm.includes('زملاء') ||
      norm.includes('عمل') ||
      norm.includes('وظيفة') ||
      norm.includes('جامعة') ||
      norm.includes('جامعه') ||
      norm.includes('نادي') ||
      norm.includes('حرج اجتماعي');

    if (isPrayerDomain) {
      return {
        intent: 'INTERACTIVE_EXPERIENCE',
        shortAnswer: isFemale
          ? 'السهو والشك في الصلاة يعرض لكل مصلٍّ يا أختي، والشريعة وضعت سجود السهو رحمةً وتيسيراً لترميم الخلل بقلب مطمئن. دعنا نتدرب عليها عملياً معاً الآن.'
          : 'السهو والشك في الصلاة يعرض لكل مصلٍّ يا أخي، والشريعة وضعت سجود السهو رحمةً وتيسيراً لترميم الخلل بقلب مطمئن. دعنا نتدرب عليها عملياً معاً الآن.',
        sourceReference: 'صحيح البخاري والموسوعة الفقهية — الدرر السنية',
        experiencePayload: {
          sceneType: 'PRAYER',
          coreAction: 'ترتيب أركان الصلاة والتدارك بسجود السهو',
          interactiveElements: [
            { id: 'action_step_takbeer', label: 'تكبيرة الإحرام والنية', soundOrAnim: 'chime' },
            { id: 'action_step_fatihah', label: 'قراءة الفاتحة بسكون', soundOrAnim: 'breath' },
            { id: 'action_step_ruku', label: 'الركوع والاطمئنان', soundOrAnim: 'peace' },
            { id: 'action_step_sujud', label: 'السجود وتسبيح الأعلى', soundOrAnim: 'water' },
            { id: 'action_step_sujud_sahw', label: 'سجدتا السهو للتدارك', soundOrAnim: 'bell' },
          ],
          tranquilityDelta: 15,
        },
      };
    }

    if (isWuduDomain) {
      return {
        intent: 'INTERACTIVE_EXPERIENCE',
        shortAnswer: isFemale
          ? 'الشك في الطهارة وسواس يدفعه يقين القاعدة الشرعية «اليقين لا يزول بالشك» يا أختي، والوضوء قائم على الاقتصاد والاعتدال. دعنا نتدرب عليها عملياً معاً الآن.'
          : 'الشك في الطهارة وسواس يدفعه يقين القاعدة الشرعية «اليقين لا يزول بالشك» يا أخي، والوضوء قائم على الاقتصاد والاعتدال. دعنا نتدرب عليها عملياً معاً الآن.',
        sourceReference: 'دليل المسلم الجديد وسلسلة المتون الميسرة',
        experiencePayload: {
          sceneType: 'WUDU',
          coreAction: 'غسل الأعضاء باعتدال دون إفراط واليقين بالطهارة',
          interactiveElements: [
            { id: 'action_wudu_face', label: 'غسل الوجه مرة بيقين', soundOrAnim: 'water' },
            { id: 'action_wudu_arms', label: 'غسل اليدين للمرفقين', soundOrAnim: 'water' },
            { id: 'action_wudu_head', label: 'مسح الرأس والأذنين', soundOrAnim: 'breath' },
            { id: 'action_wudu_feet', label: 'غسل القدمين أو المسح', soundOrAnim: 'water' },
            { id: 'action_wudu_certainty', label: 'تثبيت اليقين وطرد الوسواس', soundOrAnim: 'shield' },
          ],
          tranquilityDelta: 15,
        },
      };
    }

    if (isSocialDomain) {
      return {
        intent: 'INTERACTIVE_EXPERIENCE',
        shortAnswer: isFemale
          ? 'الارتباك الاجتماعي في البدايات شعور طبيعي يمر به كل مهتدٍ يا أختي، وحسن المعاملة واللطف كفيلان بإيصال جمال دينك. دعنا نتدرب عليها عملياً معاً الآن.'
          : 'الارتباك الاجتماعي في البدايات شعور طبيعي يمر به كل مهتدٍ يا أخي، وحسن المعاملة واللطف كفيلان بإيصال جمال دينك. دعنا نتدرب عليها عملياً معاً الآن.',
        sourceReference: 'دليل المسلم الجديد — فقه المعاملات والتعايش',
        experiencePayload: {
          sceneType: 'SOCIAL',
          coreAction: 'الموقف الحركي الهادئ والتعامل الودود مع الأهل والزملاء',
          interactiveElements: [
            { id: 'action_social_breath', label: 'التنفس والسكينة الداخلية', soundOrAnim: 'breath' },
            { id: 'action_social_reply', label: 'الرد بالحسنى والابتسامة', soundOrAnim: 'heart' },
            { id: 'action_social_taysir', label: 'الثبات برفق وتيسير', soundOrAnim: 'peace' },
          ],
          tranquilityDelta: 15,
        },
      };
    }

    // Default physical / environmental action
    return {
      intent: 'INTERACTIVE_EXPERIENCE',
      shortAnswer: isFemale
        ? 'بناء أي عادة جديدة يتطلب تجربة حركية بسيطة تتكرر حتى تسكن في وجدانكِ يا أختي. دعنا نتدرب عليها عملياً معاً الآن.'
        : 'بناء أي عادة جديدة يتطلب تجربة حركية بسيطة تتكرر حتى تسكن في وجدانك يا أخي. دعنا نتدرب عليها عملياً معاً الآن.',
      sourceReference: 'دليل المسلم الجديد',
      experiencePayload: {
        sceneType: 'ENVIRONMENT',
        coreAction: 'المحاكاة الحركية الهادئة للموقف اليومي',
        interactiveElements: [
          { id: 'action_env_step_1', label: 'معاينة الموقف بهدوء', soundOrAnim: 'breath' },
          { id: 'action_env_step_2', label: 'الممارسة الحركية الميسرة', soundOrAnim: 'peace' },
          { id: 'action_env_step_3', label: 'إتمام الفعل والسكينة', soundOrAnim: 'chime' },
        ],
        tranquilityDelta: 10,
      },
    };
  }

  // PATH A: CONCEPTUAL QUESTION (e.g. "ما هو...", "لماذا...", "حكم...", "ما معنى...", "هل يجوز...")
  let bestChunk: TrustedKnowledgeChunk | undefined;
  for (const chunk of TRUSTED_KNOWLEDGE_BASE) {
    if (chunk.keywords.some((k) => norm.includes(normalizeArabicNlp(k)))) {
      bestChunk = chunk;
      break;
    }
  }

  let shortAnswer = '';
  let sourceRef = 'دليل المسلم الجديد والدرر السنية';

  if (bestChunk) {
    sourceRef = bestChunk.sourceName;
    const sentences = bestChunk.text
      .split(/(?<=[.!?؟\n])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const conciseText = sentences.slice(0, 2).join(' ');
    shortAnswer = `${conciseText} ${addressingVocative}، والأصل في شريعتنا التيسير ورفع الحرج.`;
  } else {
    shortAnswer = isFemale
      ? `الأصل في هذا الأمر قائم على التيسير وسماحة الشريعة يا أختي؛ فديننا رحمة ونور يبعث الطمأنينة في القلب ويعفو عن المشقة.`
      : `الأصل في هذا الأمر قائم على التيسير وسماحة الشريعة يا أخي؛ فديننا رحمة ونور يبعث الطمأنينة في القلب ويعفو عن المشقة.`;
  }

  return {
    intent: 'EXPLANATION',
    shortAnswer: inflectArabic(shortAnswer, isFemale ? 'female' : 'male'),
    sourceReference: sourceRef,
    experiencePayload: null,
  };
}

export interface RetrievalOptions {
  activeDay?: number;
  activeExperienceId?: string;
  userProfile?: UserPersonalizationProfile;
  topK?: number;
  minScoreThreshold?: number;
  conversationHistory?: ConversationTurn[];
  lastTopic?: string;
}

/**
 * Priority Hierarchy Driven RAG Retrieval & Conversational Synthesizer:
 * 1. Latest explicit user question (ABSOLUTE HIGHEST PRIORITY)
 * 2. Current conversation context (ONLY when latest message clearly refers back to it)
 * 3. Topic Isolation (When query is a new question, previous context is strictly dropped)
 * 4. Grounding Check (Unrelated chunks are NEVER used just to produce an answer)
 * 5. Personalization (Natural "يا أختي" for female, learning level adjustment)
 */
export function retrieveGroundedKnowledge(
  query: string,
  options: RetrievalOptions = {}
): RagRetrievalResult {
  const {
    userProfile,
    topK = 2,
    conversationHistory = [],
    lastTopic,
  } = options;

  const currentLevel: LearningLevel = userProfile?.learningLevel || 'beginner';
  const addressing = userProfile?.preferredAddressing || 'female';
  const isFemale = addressing === 'female';

  const norm = normalizeArabicNlp(query);
  const nlp = analyzeArabicNlp(query, currentLevel);
  const tokens = extractNlpTokens(norm);

  // =========================================================================
  // 4-TIER CONTENT CONTROL MATRIX & COGNITIVE OVERLOAD EVALUATION
  // =========================================================================
  const tierInfo = classifyContentTier(query, nlp);

  const isHesitant =
    norm.includes('شاك') ||
    norm.includes('شككت') ||
    norm.includes('خايف') ||
    norm.includes('خايفة') ||
    norm.includes('متردد') ||
    norm.includes('مترددة') ||
    norm.includes('وسواس') ||
    norm.includes('تعبت') ||
    norm.includes('حاس بثقل') ||
    norm.includes('أخاف أخطأت');

  const hesitationLevel: CognitiveLoadMetrics['hesitationLevel'] = isHesitant
    ? 'elevated'
    : norm.includes('شك') || norm.includes('هل يجوز')
    ? 'moderate'
    : 'low';

  const cognitiveMetrics: CognitiveLoadMetrics = {
    cognitiveOverloadReductionPercent: 60,
    realWorldReadinessPercent: 85,
    hesitationLevel,
    activeMaximsApplied: tierInfo.maximsApplied,
  };

  // IMMEDIATE KILL-SWITCH FOR TIER D: SENSITIVE PERSONAL/LEGAL/JUDICIAL MATTERS
  if (tierInfo.triggeredKillSwitch) {
    const addressingVocative = isFemale ? 'يا أختي' : 'يا أخي';
    const refusalAr =
      `${tierInfo.refusalDisclaimerAr}\n\n` +
      `نوصيكِ ${addressingVocative} بالتواصل مباشرة مع دار الإفتاء الرسمية أو استخدام زر «الإحالة لمختص بشري» بالأسفل لربطكِ بمستشار شرعي معتمد يراعي ملابسات حالتكِ الخاصة بسرية وأمانة.`;
    const refusalEn =
      `${tierInfo.refusalDisclaimerEn}\n\n` +
      `We advise you to contact the official fatwa department or use the "Human Specialist Referral" button below.`;

    return {
      query,
      nlp,
      sources: [],
      topChunks: [],
      chunks: [],
      groundingLevel: 'HIGH_GROUNDING',
      confidenceScore: 100,
      confidence: 100,
      hasDirectEvidence: true,
      contextMatched: true,
      isAmbiguous: false,
      isFollowUp: false,
      suggestedAction: {
        actionName: 'openBuilding',
        targetId: 'human-referral',
        humanLabelAr: 'طلب إحالة لمختص بشري معتمد',
      },
      retrievedContextText: '',
      groundedAnswerSynthesisAr: refusalAr,
      groundedAnswerSynthesisEn: refusalEn,
      aiHelpSummary: {
        headlineAr: '🛡️ حوكمة الفتوى: إحالة لمختص بشري معتمد',
        operationsAr: [
          'تفعيل قاطع الأمان الشرعي والأخلاقي للمسائل الشخصية والقضائية (Tier D)',
          'رفض التوليد الآلي المستقل لعدم أهلية الذكاء الاصطناعي في الفتوى الخاصة',
          'تحويل الطلب فوراً إلى منصة الإحالة لمختص بشري معتمد',
        ],
        sourceCount: 0,
        levelLabelAr: 'إحالة لمفتٍ بشري معتمد',
        tierBadgeAr: tierInfo.tierLabelAr,
        cognitiveLoadReducedPercent: 60,
        suggestedActionLabelAr: 'فتح نموذج الإحالة لمختص بشري',
      },
      isGameRequest: false,
      contentTier: 'tier_d',
      isTierDRefusal: true,
      cognitiveMetrics,
    };
  }

  // =========================================================================
  // RULE 1 & 3: CONTEXT REFERRAL VS STANDALONE TOPIC DETECTION
  // =========================================================================

  // 1. Explicit topic switch markers ("غيري الموضوع", "موضوع ثاني", "سؤال ثاني")
  const isExplicitTopicSwitch =
    norm.includes('غيري الموضوع') ||
    norm.includes('غير الموضوع') ||
    norm.includes('موضوع ثاني') ||
    norm.includes('سؤال ثاني') ||
    norm.includes('بالمناسبه') ||
    norm.includes('على فكره') ||
    norm.includes('دعنا من هذا') ||
    norm.includes('خلنا من هذا');

  // 2. Pure clarification / follow-up requests with NO independent subject
  const isPureClarification =
    norm.includes('ما فهمت') ||
    norm.includes('وضحي اكثر') ||
    norm.includes('اشرحي اكثر') ||
    norm.includes('وضحي لي') ||
    norm.includes('بسطي لي') ||
    norm.includes('سهليها') ||
    norm.includes('اختصري') ||
    norm.includes('بدون تطويل') ||
    norm === 'موجز';

  const isExampleRequest =
    norm.includes('اعطني مثال') ||
    norm.includes('عطيني مثال') ||
    norm.includes('مثل ايش') ||
    norm.includes('ممكن مثال') ||
    norm === 'مثال';

  const isWisdomRequest =
    norm.startsWith('طيب ليش') ||
    norm === 'طيب ليش' ||
    norm === 'ليش' ||
    norm === 'لماذا' ||
    norm === 'وش السبب' ||
    norm === 'ما السبب';

  const isMeaningRequest =
    norm.includes('وش تقصدين') ||
    norm.includes('ما قصدك') ||
    norm.includes('ماذا تقصدين') ||
    norm.includes('وش المعنى');

  const isGameRequest =
    norm.includes('اصنع اللعبه') ||
    norm.includes('سوي لي لعبه') ||
    norm.includes('سوي لعبه') ||
    norm.includes('ابي لعبه') ||
    norm.includes('ابغى لعبه') ||
    norm.includes('ودي اتدرب') ||
    norm.includes('ابي اتدرب على هذا') ||
    norm.includes('سوي لي لعبه عليه') ||
    norm.includes('خليني اجرب') ||
    norm.includes('سويها لعبه');

  const isCampusAdaptationFollowUp =
    norm.includes('لو كنت في الجامعه') ||
    norm.includes('لو كنت بالجامعه') ||
    norm.includes('لو كنت في الكليه');

  const isAnaphoricReferral =
    norm.includes('علاقته') ||
    norm.includes('علاقتها') ||
    norm.includes('علاقته بال') ||
    norm.includes('علاقتها بال') ||
    (norm.startsWith('وش حكمه') && norm.length <= 15) ||
    (norm.startsWith('وش حكمها') && norm.length <= 15) ||
    (norm.startsWith('ما حكمه') && norm.length <= 15) ||
    (norm.startsWith('ما حكمها') && norm.length <= 15);

  const isAmbiguousShortQuestion =
    norm === 'هل يجوز' ||
    norm === 'حلال ولا حرام' ||
    norm === 'وش رايك' ||
    norm === 'ما حكمه' ||
    norm === 'ما حكمها';

  // Check if query contains its own substantive subject terms
  const hasSubstantiveSubject =
    tokens.some((t) => {
      const stem = stemArabicWord(t);
      return (
        stem === 'سيف' ||
        stem === 'انتشر' ||
        stem === 'انتشار' ||
        stem === 'توحيد' ||
        stem === 'صلاه' ||
        stem === 'اصلي' ||
        stem === 'قبله' ||
        stem === 'كعبه' ||
        stem === 'وضوء' ||
        stem === 'جورب' ||
        stem === 'خف' ||
        stem === 'سفر' ||
        stem === 'مطر' ||
        stem === 'غداء' ||
        stem === 'طعام' ||
        stem === 'حلال' ||
        stem === 'خنزير' ||
        stem === 'جيلاتين' ||
        stem === 'والدين' ||
        stem === 'اهل' ||
        stem === 'امانه' ||
        stem === 'جمعه' ||
        stem === 'مسجد' ||
        stem === 'توكل' ||
        stem === 'تواكل' ||
        stem === 'ترجم' ||
        stem === 'حديث' ||
        stem === 'جامعه' ||
        stem === 'محاضره'
      );
    });

  // A message is a contextual follow-up ONLY IF:
  // - It does NOT explicitly switch topic
  // - AND it is a pure follow-up phrase OR anaphoric referral
  // - AND it does NOT introduce a brand new substantive subject
  const isContextualFollowUp =
    !isExplicitTopicSwitch &&
    !hasSubstantiveSubject &&
    (isPureClarification ||
      isExampleRequest ||
      isWisdomRequest ||
      isMeaningRequest ||
      isGameRequest ||
      isCampusAdaptationFollowUp ||
      isAnaphoricReferral);

  // Effective topic determination:
  // If standalone question: STRICTLY use current query NLP topic (NO context inheritance!)
  // Only inherit lastTopic if it's a genuine contextual follow-up with no new subject.
  const effectiveTopic =
    isContextualFollowUp && lastTopic && lastTopic !== 'general'
      ? lastTopic
      : nlp.topic;

  // =========================================================================
  // RULE 4 & 5: STRICT RAG RETRIEVAL (NO UNRELATED CHUNKS)
  // =========================================================================

  const scoredList: { chunk: TrustedKnowledgeChunk; score: number; reasonAr: string; reasonEn: string }[] = [];

  // When searching, if it's a standalone question, rely exclusively on latest query tokens
  // If it's a pure follow-up with no subject, we can optionally use effectiveTopic keywords
  const searchTokens = new Set<string>();
  for (const t of tokens) {
    searchTokens.add(t);
    const stem = stemArabicWord(t);
    if (stem.length > 1) searchTokens.add(stem);
  }

  for (const chunk of TRUSTED_KNOWLEDGE_BASE) {
    let score = 0;
    const reasonsAr: string[] = [];
    const reasonsEn: string[] = [];

    const normTitle = normalizeArabicNlp(chunk.title);
    const normText = normalizeArabicNlp(chunk.text);
    const normKeywords = chunk.keywords.map((k) => normalizeArabicNlp(k));

    // 1. Direct Topic Alignment (ONLY if effective topic is specific and matches chunk)
    if (effectiveTopic !== 'general' && chunk.topic === effectiveTopic) {
      // If standalone question, verify that query actually has at least one keyword matching this topic
      if (!isContextualFollowUp) {
        if (nlp.topic === chunk.topic) {
          score += 15;
          reasonsAr.push('تطابق الموضوع الشرعي المباشر');
          reasonsEn.push('Direct topic match');
        }
      } else {
        // Legitimate follow-up inherits topic score
        score += 15;
        reasonsAr.push('متابعة سياق السؤال السابق');
        reasonsEn.push('Follow-up context match');
      }
    }

    // 2. Query Type Match (ONLY if chunk topic matches effective topic)
    if (nlp.queryType === 'misconception' && chunk.topic === 'history_spread') {
      score += 25;
    } else if (nlp.queryType === 'translation' && chunk.sourceType === 'dictionary' && (effectiveTopic === 'general' || chunk.topic === effectiveTopic)) {
      score += 20;
    } else if (nlp.queryType === 'hadith' && chunk.sourceType === 'hadith' && (effectiveTopic === 'general' || chunk.topic === effectiveTopic)) {
      score += 18;
    } else if (nlp.queryType === 'definition' && chunk.topic === effectiveTopic && (chunk.sourceType === 'aqeedah' || chunk.sourceType === 'dictionary')) {
      score += 15;
    }

    // 3. Substantive tokens matching
    const UBIQUITOUS_RELIGIOUS_BASELINES = new Set([
      'اسلام', 'الاسلام', 'دين', 'الدين', 'مسلم', 'مسلمين', 'الله', 'رب', 'شريعه', 'الشريعه',
      // Inquiry & grammatical meta words that must not create false-positive chunk matches
      'معنى', 'معني', 'مفهوم', 'حكم', 'طريقه', 'كيفيه', 'موضوع', 'سؤال', 'شيء', 'امر'
    ]);

    let matchingSubstantiveTokens = 0;
    for (const t of searchTokens) {
      if (t.length >= 2) {
        const isBaseline = UBIQUITOUS_RELIGIOUS_BASELINES.has(t);
        let tokenMatched = false;

        // Keyword match
        if (normKeywords.some((k) => k === t || k.includes(t) || stemArabicWord(k) === t)) {
          score += isBaseline ? 1 : 10;
          tokenMatched = true;
        }
        // Title match
        if (normTitle.includes(t) || normTitle.split(' ').some((w) => stemArabicWord(w) === t)) {
          score += isBaseline ? 1 : 8;
          tokenMatched = true;
        }
        // Text match
        if (normText.includes(t)) {
          score += isBaseline ? 1 : 3;
          tokenMatched = true;
        }

        if (tokenMatched && !isBaseline) {
          matchingSubstantiveTokens++;
        }
      }
    }

    // Full phrase boost
    if (norm.length > 5 && normTitle.includes(norm)) {
      score += 20;
    }

    // STRICT RELEVANCE GATE (Rules 5 & 7):
    // A chunk is ONLY considered if it has genuine substantive matches!
    // Never allow an unrelated chunk to qualify on default topic alone.
    const isGenuinelyRelevant =
      (matchingSubstantiveTokens > 0 && score >= 12) ||
      (isContextualFollowUp && chunk.topic === effectiveTopic && score >= 15);

    if (isGenuinelyRelevant) {
      scoredList.push({
        chunk,
        score,
        reasonAr: reasonsAr.join('، ') || 'تطابق كلمات السؤال المباشر',
        reasonEn: reasonsEn.join(', ') || 'Direct query tokens match',
      });
    }
  }

  scoredList.sort((a, b) => b.score - a.score);
  // RULE 5: Do not pass unrelated chunks to the LLM. If the primary chunk has a specific topic,
  // do not pair it with a low-scoring chunk from a completely different topic.
  const primaryTopic = scoredList.length > 0 ? scoredList[0].chunk.topic : undefined;
  const filteredList = scoredList.filter((item, index) => {
    if (index === 0) return true;
    if (primaryTopic && primaryTopic !== 'general') {
      return item.chunk.topic === primaryTopic || item.score >= 0.8 * scoredList[0].score;
    }
    return true;
  });
  const topScored = filteredList.slice(0, topK);

  // RULE 6 & 7: Check that retrieved chunks are truly relevant
  const hasGenuineMatch = topScored.length > 0 && topScored[0].score >= 12;
  const topChunks: TrustedKnowledgeChunk[] = hasGenuineMatch ? topScored.map((s) => s.chunk) : [];

  const maxScore = hasGenuineMatch ? topScored[0].score : 0;
  const confidenceScore = Math.min(100, Math.round((maxScore / 30) * 100));

  let groundingLevel: GroundingLevel = 'INSUFFICIENT_GROUNDING';
  if (hasGenuineMatch && maxScore >= 20) {
    groundingLevel = 'HIGH_GROUNDING';
  } else if (hasGenuineMatch && maxScore >= 12) {
    groundingLevel = 'PARTIAL_GROUNDING';
  }

  const hasDirectEvidence = groundingLevel === 'HIGH_GROUNDING' && topChunks.length > 0;
  const contextMatched = hasGenuineMatch && maxScore >= 15;

  const retrievedContextText = topChunks
    .map(
      (c, i) =>
        `[المصدر المعتمد ${i + 1}]:\n` +
        `• التوثيق: ${c.sourceName} (${c.sourceUrl})\n` +
        `• التصنيف: ${c.sourceType} | درجة الصحة: ${c.authenticityLevel || 'موثق'}\n` +
        `• العنوان: ${c.title}\n` +
        (c.surahAyah ? `• الآية: ${c.surahAyah}\n` : '') +
        (c.hadithCitation ? `• الحديث: ${c.hadithCitation}\n` : '') +
        `• النص الشرعي المعتمد: ${c.text}`
    )
    .join('\n\n---\n\n');

  // =========================================================================
  // RULE 8 & 12: OPEN-ENDED ANSWER SYNTHESIS (Female addressing: "يا أختي")
  // =========================================================================

  let replyAr = '';
  let replyEn = '';
  let suggestedGameTopic: string | undefined = undefined;
  let suggestedAction: RagRetrievalResult['suggestedAction'] = undefined;

  const addressingVocative = isFemale ? 'يا أختي' : 'يا أخي';

  // CASE 1: Ambiguous questions with no clear referent -> ask polite clarification (Rule 11)
  if (isAmbiguousShortQuestion) {
    replyAr = isFemale
      ? 'أكيد يا أختي، وضحي لي قصدكِ أكثر؛ وش الشيء أو الموقف المحدد اللي تسألين عن حكمه لأجيبكِ بدقة وهدي الشريعة 🌿'
      : 'أكيد يا أخي، وضح لي قصدك أكثر؛ وش الشيء أو الموقف المحدد اللي تسأل عن حكمه لأجيبك بدقة وهدي الشريعة 🌿';
    replyEn = 'Of course! Could you clarify the specific situation or deed you are asking about so I can provide accurate, peaceful guidance?';
  }

  // CASE 2: Explicit practice / Mini-Game requests (Rule 9)
  else if (isGameRequest) {
    suggestedGameTopic =
      effectiveTopic === 'prayer'
        ? 'prayer_steps'
        : effectiveTopic === 'aqeedah_tawakkul'
        ? 'tawakkul_vs_tawaakul'
        : effectiveTopic === 'food_halal'
        ? 'food_inspection'
        : effectiveTopic === 'travel_rain'
        ? 'travel_concessions'
        : effectiveTopic === 'aqeedah_tawhid'
        ? 'tawheed_vs_ibadah'
        : 'prayer_steps';

    replyAr = isFemale
      ? `أبشري ${addressingVocative}! جاري فتح «مختبر رفيق» لبناء تدريب تفاعلي مخصص لكِ لترسيخ هذا المفهوم عملياً 🎮✨`
      : `أبشر ${addressingVocative}! جاري فتح «مختبر رفيق» لبناء تدريب تفاعلي مخصص لك لترسيخ هذا المفهوم عملياً 🎮✨`;
    replyEn = 'Gladly! Opening Rafiq AI Mini-Game Lab to generate an interactive practice session for this concept 🎮✨';
    suggestedAction = {
      actionName: 'openMiniGame',
      targetId: suggestedGameTopic,
      humanLabelAr: 'بدء لعبة مختبر رفيق',
      gameTopic: suggestedGameTopic,
    };
  }

  // CASE 3: Contextual Follow-ups (Referring back to previous topic) (Rule 9)
  else if (isContextualFollowUp) {
    // 3A: "طيب وش علاقته بالعبادة؟" (Anaphoric connection)
    if (norm.includes('علاقته') || norm.includes('علاقتها')) {
      if (effectiveTopic === 'aqeedah_tawhid') {
        replyAr =
          `العلاقة بينهما وثيقة وأساسية ${addressingVocative}: التوحيد هو الأصل واليقين القلبي، والعبادة هي التطبيق العملي وثماره الظاهرة 🌿\n\n` +
          'فالتوحيد كالشجرة وجذورها الراسخة في القلب، والعبادات (كالصلاة، والدعاء، وبر الوالدين، ومساعدة الناس) هي أغصانها وثمارها الحية؛ فنحن نعبد الله وحده لأننا نوحده ولا نشرك به أحداً.\n\n' +
          'المصدر المعتمد: الموسوعة العقدية — الدرر السنية.';
        replyEn = 'The relationship is foundational: Tawhid is the creedal root in the heart, and acts of worship are its living fruits.';
      } else {
        replyAr =
          `العلاقة وثيقة ومباشرة ${addressingVocative}: الإيمان في القلب يثمر عملاً صالحاً بالجوارح، وكل عمل طيب بنية صالحة هو عبادة تنبع من امتثال أمر الله 🌿`;
        replyEn = 'The relationship is direct: faith in the heart blossoms into righteous actions in daily life.';
      }
    }
    // 3B: "ما فهمت، وضحي أكثر" / تبسيط وتوضيح
    else if (isPureClarification) {
      if (effectiveTopic === 'history_spread') {
        replyAr =
          `أبشري، أوضحها لكِ ببساطة ${addressingVocative}: الإيمان تصديق واقتناع بالقلب، والقلوب لا تُفتح بالإكراه؛ لذلك لم يفرض الإسلام نفسه بالسيف، بل انتشر حين رأى الناس صدق المسلمين وعدلهم 🌿`;
        replyEn = 'Simply put: faith is a heartfelt conviction and cannot be forced. Islam spread through exemplary character and justice.';
      } else if (effectiveTopic === 'aqeedah_tawakkul') {
        replyAr =
          `سأبسطها لكِ بمثال واقعي ${addressingVocative}:\n\n` +
          '«التوكل» مثل أن تستعدي وتذاكري للاختبار بكل جهد، ثم تفوضي النتيجة لله بقلب مطمئن. أما «التواكل» فهو ترك المذاكرة وإهمال الأسباب بدعوى أن النجاح مقدر، وهذا عجز نهى عنه النبي ﷺ 🌿';
        replyEn = 'To simplify: Tawakkul is doing your best with practical means while trusting Allah with the outcome.';
      } else if (effectiveTopic === 'aqeedah_tawhid') {
        replyAr =
          `بكل بساطة ${addressingVocative}: التوحيد يعني أن قلبكِ مطمئن بأن الله وحده هو الخالق والرازق، فلا تدعين سواه، ولا تطلبين السكينة التامة إلا منه سبحانه بلا شريك 🌿`;
        replyEn = 'Simply put: Tawhid means dedicating your prayers and absolute reliance to the One Creator without partners.';
      } else if (effectiveTopic === 'prayer') {
        replyAr =
          `الفكرة ميسرة ومريحة ${addressingVocative}: الصلاة موعد مناجاة وسكينة مع الله؛ تبدئين بتكبيرة الإحرام، وتقرئين الفاتحة، وتركعين وتسجدين بخشوع وهدوء، وتختمين بالتسليم 🌿`;
        replyEn = 'Prayer is a peaceful communion with Allah, moving gently through reading, bowing, and prostration in tranquility.';
      } else {
        replyAr =
          `أبشري ${addressingVocative}، الفكرة الأساسية باختصار: ديننا الحنيف مبني على التيسير ورفع الحرج؛ فافعلي المستطاع من العمل مع طمأنينة القلب 🌿`;
        replyEn = 'The foundational principle: Islam is built upon ease and lifting hardship.';
      }
    }
    // 3C: "أعطني مثال"
    else if (isExampleRequest) {
      if (effectiveTopic === 'prayer' || effectiveTopic === 'university_campus') {
        replyAr =
          `مثال واقعي يرفع الحرج ${addressingVocative}: إذا حان وقت الصلاة وأنتِ في الجامعة أو العمل ولا يوجد مصلى، تكفيكِ سجادة خفيفة في أي قاعة هادئة أو ركن طاهر، فالأرض كلها جعلت مسجداً وطهوراً 🌿`;
        replyEn = 'A practical example: praying on a clean travel mat in any quiet campus room is fully valid and peaceful.';
      } else if (effectiveTopic === 'travel_rain') {
        replyAr =
          `مثال ميسر ${addressingVocative}: إذا سافرتِ لمسافة تقارب 80 كم، يشرع لكِ قصر صلاة الظهر لركعتين والعصر لركعتين والجمع بينهما، وهي رخصة ومحبة من الله لتيسير رحلتكِ 🌿`;
        replyEn = 'Example: during travel of ~80km, shortening 4-rakah prayers to 2 and combining them is a beloved concession.';
      } else {
        replyAr =
          `مثال عملي ${addressingVocative}: عند مواجهة أي ضيق أو مشقة في تطبيق أمر معين، فإن الشريعة تفتح لكِ باب التيسير والرخصة بما يناسب قدرتكِ واستطاعتكِ 🌿`;
        replyEn = 'Practical example: whenever hardship arises, Islamic principles grant tailored concessions to lift difficulty.';
      }
    }
    // 3D: "طيب ليش؟" / حكمة التشريع
    else if (isWisdomRequest) {
      if (effectiveTopic === 'history_spread') {
        replyAr =
          `الحكمة جلية وعظيمة ${addressingVocative}: لأن الإيمان الحقيقي لا ينبت إلا في قلوب مختارة ومطمئنة؛ والإكراه لا يصنع إلا النفاق، والله تعالى لا يرضى لعباده إلا الصدق واليقين الحر 🌿`;
        replyEn = 'The profound wisdom is that true faith can only blossom through free conviction; coercion only breeds hypocrisy.';
      } else if (effectiveTopic === 'prayer') {
        replyAr =
          `الحكمة من الصلاة ${addressingVocative} هي وصل القلب بالله وسط مشاغل الدنيا، لتكون محطة راحة نفسية وطمأنينة، كما كان النبي ﷺ يقول: «أرحنا بها يا بلال» 🌿`;
        replyEn = 'The wisdom of prayer is nourishing the soul amid worldly distractions, serving as a sanctuary of serenity.';
      } else {
        replyAr =
          `الحكمة الكلية في تشريعات ديننا ${addressingVocative} هي جلب المصالح ودرء المفاسد، وحفظ سكينة الإنسان وروحه برفق ورحمة 🌿`;
        replyEn = 'The universal wisdom in Islamic guidance is securing human well-being and mercy.';
      }
    }
    // 3E: "طيب لو كنت في الجامعة؟"
    else if (isCampusAdaptationFollowUp) {
      replyAr =
        `إذا كنتِ في الجامعة وحان الوقت ${addressingVocative}:\n\n` +
        '1. الطهارة ميسرة: يمكنكِ المسح على الجوربين الطاهرين دون حاجة لخلع الحذاء وغسل القدمين في مغسلة الكلية.\n' +
        '2. المكان ميسر: أي قاعة خالية أو مكتب أو ركن هادئ ونظيف تصح فيه الصلاة، لأن الأرض كلها مسجد.\n' +
        '3. الوقت مرن: صلي الفريضة في وقتها بخشوع وسكينة ومارسي يومكِ الدراسي باطمئنان 🌿';
      replyEn = 'On campus: wipe over clean socks for wudu, pray in any clean quiet corner, and keep your peace of heart.';
    }
  }

  // CASE 4: DYNAMIC SCHEMATIC REASONING CONTRACT
  const structuredDecision = evaluateRafiqStructuredDecision(query, options);

  replyAr = structuredDecision.shortAnswer;
  replyEn = structuredDecision.shortAnswer;

  if (structuredDecision.experiencePayload) {
    suggestedGameTopic = structuredDecision.experiencePayload.sceneType.toLowerCase();
    suggestedAction = {
      actionName: 'openMiniGame',
      targetId: suggestedGameTopic,
      humanLabelAr: '[ خوض التجربة العملية الحركية الآن 🎯 ]',
      gameTopic: suggestedGameTopic,
    };
  }

  // Clean internal system tags and metrics
  const cleanInternalTags = (str: string) =>
    str
      .replace(/\[المستوى\s*[أ-د][^\]]*\]/gi, '')
      .replace(/\[-?\d+%\s*حمل\s*معرفي\]/gi, '')
      .replace(/\[\d+%\s*جاهزية\s*حركية\]/gi, '')
      .replace(/\[Tier\s*[A-D][^\]]*\]/gi, '')
      .replace(/\[-?\d+%\s*Cognitive[^\]]*\]/gi, '')
      .replace(/\[\d+%\s*Readiness[^\]]*\]/gi, '')
      .trim();

  // Apply grammatical gender inflection
  replyAr = inflectArabic(cleanInternalTags(replyAr), addressing);
  replyEn = cleanInternalTags(replyEn);
  structuredDecision.shortAnswer = replyAr;

  // User-Facing "كيف ساعدك رفيق؟" Summary
  const aiHelpSummary: AnasAiHelpSummary = {
    headlineAr: '✨ كيف ساعدك رفيق؟',
    operationsAr: [
      topChunks.length > 0
        ? `بحث في المصادر الشرعية المعتمدة (${topChunks[0].sourceName.split('—')[0].trim()})`
        : 'أجاب على سؤالكِ المباشر وفق القواعد الشرعية العامة والتيسير',
      isFemale ? 'خصص الشرح بأسلوب ميسر يناسب سؤالكِ' : 'خصص الشرح الميسر لمستواك',
      suggestedGameTopic
        ? 'أعد تدريباً تفاعلياً بـ«مختبر رفيق» لتثبيت المفهوم'
        : 'قدم توجيهاً مباشراً خالياً من التكلف والوسواس',
    ],
    sourceCount: topChunks.length,
    levelLabelAr:
      currentLevel === 'beginner'
        ? 'مناسب للمبتدئين'
        : currentLevel === 'advanced'
        ? 'مستوى متقدم ومفصل'
        : 'مستوى متوسط',
    suggestedGameTopic,
    suggestedActionLabelAr: suggestedAction?.humanLabelAr,
  };

  return {
    query,
    nlp,
    sources: scoredList.slice(0, topK).map((v) => ({
      chunk: v.chunk,
      score: v.score,
      relevanceReasonAr: v.reasonAr,
      relevanceReasonEn: v.reasonEn,
    })),
    topChunks,
    chunks: topChunks,
    groundingLevel,
    confidenceScore,
    confidence: confidenceScore,
    hasDirectEvidence,
    contextMatched,
    isAmbiguous: isAmbiguousShortQuestion,
    isFollowUp: isContextualFollowUp,
    suggestedAction,
    retrievedContextText,
    groundedAnswerSynthesisAr: replyAr,
    groundedAnswerSynthesisEn: replyEn,
    aiHelpSummary: {
      ...aiHelpSummary,
      tierBadgeAr: tierInfo.tierLabelAr,
      cognitiveLoadReducedPercent: 60,
    },
    isGameRequest,
    contentTier: tierInfo.tier,
    isTierDRefusal: structuredDecision.intent === 'HUMAN_REFERRAL',
    cognitiveMetrics,
    structuredDecision,
    intent: structuredDecision.intent,
    experiencePayload: structuredDecision.experiencePayload,
    sourceReference: structuredDecision.sourceReference,
  };
}

/**
 * Builds Rafiq System Prompt for Gemini Server & Conversational Intelligence
 * Grounded in:
 * 1. STRICT JSON SCHEMATIC REASONING CONTRACT
 * 2. DEFINITIVE SYSTEM IDENTITY & CORE MISSION (Agentic Companion, NOT a fatwa issuer)
 * 3. 3 DYNAMIC CLASSIFICATION PATHS (EXPLANATION, INTERACTIVE_EXPERIENCE, HUMAN_REFERRAL)
 * 4. OFFICIAL ACCREDITED SOURCE REGISTRY
 */
export function buildSourceGroundedAnasPrompt(
  retrieval: RagRetrievalResult,
  profile?: UserPersonalizationProfile
): string {
  const addressing = profile?.preferredAddressing || 'female';
  const level = profile?.learningLevel || 'beginner';
  const isFemale = addressing === 'female';

  const genderDirective = isFemale
    ? '- المستخدم أنثى (Female): خاطبها دائماً بصيغة المؤنث الطبيعية ("يا أختي"، "تحبين"، "تقدرين"، "جربي"، "صلاتكِ").'
    : '- المستخدم ذكر (Male): خاطبه دائماً بصيغة المذكر الطبيعية ("يا أخي"، "تحب"، "تقدر"، "جرب"، "صلاتك").';

  return `أنت المحرك الاستدلالي الذكي لـ «رفيق» (Rafeeq): المحاكي المعرفي لتمكين المسلم الجديد من التأقلم مع البيئة اليومية والشعائر، وتخفيض الحمل المعرفي.

تعليمات صارمة وغير قابلة للتفاوض:
يجب عليك الرد حصراً بصيغة JSON نظيفة فقط (Strict JSON Schema)، دون أي نصوص إضافية قبل أو بعد الـ JSON، ودون أي وسوم داخلية أو مؤشرات تقييم مسربة.

مخطط JSON الإلزامي:
{
  "intent": "EXPLANATION" | "INTERACTIVE_EXPERIENCE" | "HUMAN_REFERRAL",
  "shortAnswer": "شرح عملي دافئ ومطمئن في سطرين كحد أقصى بالعربية البسيطة الميسرة.",
  "sourceReference": "اسم المرجع المعتمد (مثل: دليل المسلم الجديد أو الدرر السنية)",
  "experiencePayload": null | {
    "sceneType": "PRAYER" | "WUDU" | "SOCIAL" | "ENVIRONMENT",
    "coreAction": "توجيه مقتضب للخطوة الحركية التفاعلية",
    "interactiveElements": [
      { "id": "action_btn_1", "label": "عنوان الخطوة الحركية", "soundOrAnim": "trigger_animation" }
    ],
    "tranquilityDelta": 10
  }
}

قواعد التصنيف الديناميكي (Dynamic Classification Rules):
1. المسار (أ) - إذا كان السؤال استفساراً مفاهيمياً أو معرفياً ("ما هو...", "لماذا...", "حكم...", "ما معنى..."):
   - "intent": "EXPLANATION"
   - "shortAnswer": شرح المعنى الجوهري بود في جملتين كحد أقصى مع التركيز على التيسير وراحة البال.
   - "sourceReference": المصدر المعتمد (مثل: دليل المسلم الجديد أو الدرر السنية).
   - "experiencePayload": null

2. المسار (ب) - إذا كان المدخل صعوبة عملية، سهواً، شكاً، قلقاً، خجلاً، أو كيفية فعل حركي ("أنسى...", "أشك في...", "أخجل من...", "كيف أفعل...", "وسواس..."):
   - "intent": "INTERACTIVE_EXPERIENCE"
   - "shortAnswer": جملتان كحد أقصى لطمأنة المستخدم بأن هذا أمر طبيعي، متبوعة بالعبارة التالية نصاً: "دعنا نتدرب عليها عملياً معاً الآن."
   - "experiencePayload":
     * متعلق بالصلاة/السهو -> sceneType: "PRAYER"
     * متعلق بالطهارة/الوضوء/الماء -> sceneType: "WUDU"
     * متعلق بالحرج الاجتماعي/الأهل/العمل -> sceneType: "SOCIAL"
     * غير ذلك -> sceneType: "ENVIRONMENT"

3. المسار (ج) - إذا كان المدخل يتعلق حصراً بالطلاق، الحضانة، العقود القضائية، أو النزاعات على المواريث والتركات:
   - "intent": "HUMAN_REFERRAL"
   - "shortAnswer": بيان مقتضب ومهذب بأن النوازل الشخصية والقضائية تستوجب إحالة بشرية رسمية معتمدة.
   - "sourceReference": "الرئاسة العامة للبحوث العلمية والإفتاء"
   - "experiencePayload": null

صيغة المخاطبة:
${genderDirective}

مبدأ الخزنة الصارمة:
نصوص القرآن والسنة تؤخذ نصاً دون تحريف أو اختلاق.
${retrieval.hasDirectEvidence && retrieval.topChunks.length > 0 ? `\nالمصادر المسترجعة من الخزنة:\n${retrieval.retrievedContextText}\n` : ''}`;
}

export const retrieveKnowledge = retrieveGroundedKnowledge;
export const buildAnasRagSystemPrompt = buildSourceGroundedAnasPrompt;

export {
  analyzeUserIntentAndSemantics,
  retrieveApprovedKnowledge,
  generateSourceGroundedAnswer,
  detectDoubtOrMisconceptionSemantic,
  recordInFatwaSanctuary,
  executeRafiqQuestionPipeline,
} from './rafiqQuestionPipeline';
export type {
  StageA_SemanticUnderstanding,
  StageB_RetrievalResult,
  StageC_AnswerGeneration,
  StageD_DoubtEvaluation,
  StageE_SanctuaryResult,
  RafiqPipelineExecutionResult,
} from './rafiqQuestionPipeline';
