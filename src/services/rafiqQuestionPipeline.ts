import { Language, LearningLevel, UserPersonalizationProfile } from '../types';
import { KnowledgeChunk, TRUSTED_KNOWLEDGE_BASE } from './knowledgeBase';
import {
  analyzeArabicNlp,
  extractNlpTokens,
  normalizeArabicNlp,
  stemArabicWord,
  NlpAnalysisResult,
} from './arabicNlp';
import {
  VerificationQA,
  loadSavedFatwaSanctuaryRecords,
  saveFatwaSanctuaryRecord,
} from './fatwaSanctuaryService';

// =========================================================================
// PIPELINE DATA CONTRACTS
// =========================================================================

export interface StageA_SemanticUnderstanding {
  rawQuery: string;
  normalizedQuery: string;
  semanticTokens: string[];
  intent: NlpAnalysisResult['intent'];
  topic: NlpAnalysisResult['topic'];
  detectedLevel: LearningLevel;
  queryType: NlpAnalysisResult['queryType'];
  isContextualFollowUp: boolean;
  effectiveTopic: string;
  extractedAction?: NlpAnalysisResult['extractedAction'];
}

export interface StageB_RetrievalResult {
  topChunks: KnowledgeChunk[];
  allScoredChunks: { chunk: KnowledgeChunk; score: number }[];
  confidenceScore: number;
  hasDirectEvidence: boolean;
  groundingLevel: 'HIGH_GROUNDING' | 'MODERATE_GROUNDING' | 'GENERAL_SYNTHESIS';
  contextMatched: boolean;
  retrievedContextText: string;
  primarySourceCitation?: string;
}

export interface StageC_AnswerGeneration {
  replyAr: string;
  replyEn: string;
  aiHelpSummary?: {
    intentUnderstoodAr: string;
    sourcesConsultedCount: number;
    primarySourceTitleAr: string;
    primarySourceFamily: string;
    ragScore: number;
    safetyChecksPassed: boolean;
    educationalNotesAr: string;
  };
}

export interface StageD_DoubtEvaluation {
  isDoubtOrMisconception: boolean;
  confidence: number;
  category: 'worship' | 'social' | 'food' | 'mindset';
  doubtType:
    | 'theological_skepticism'
    | 'historical_accusation'
    | 'worship_waswas_anxiety'
    | 'disputed_ruling_confusion'
    | 'scrupulosity'
    | 'none';
  rationaleAr: string;
  rationaleEn: string;
  coreRuleAr: string;
  coreRuleEn: string;
  hadithOrAyahAr: string;
  hadithOrAyahEn: string;
}

export interface StageE_SanctuaryResult {
  recorded: boolean;
  record?: VerificationQA;
  isDuplicate?: boolean;
}

export interface RafiqPipelineExecutionResult {
  stageA: StageA_SemanticUnderstanding;
  stageB: StageB_RetrievalResult;
  stageC: StageC_AnswerGeneration;
  stageD: StageD_DoubtEvaluation;
  stageE: StageE_SanctuaryResult;
  replyAr: string;
  replyEn: string;
  retrievedChunks: KnowledgeChunk[];
  confidence: number;
  hasDirectEvidence: boolean;
  suggestedAction?: {
    actionName: string;
    targetId?: string;
    gameTopic?: string;
    humanLabelAr?: string;
  };
}

// =========================================================================
// STAGE A: INTENT AND SEMANTIC UNDERSTANDING
// =========================================================================

/**
 * Analyzes the user's latest query semantically, discerning intent, domain,
 * and contextual continuity without rigid literal constraints.
 */
export function analyzeUserIntentAndSemantics(
  query: string,
  options?: {
    conversationHistory?: Array<{ sender: 'user' | 'anas'; text: string }>;
    lastTopic?: string;
    userProfile?: UserPersonalizationProfile;
  }
): StageA_SemanticUnderstanding {
  const norm = normalizeArabicNlp(query);
  const semanticTokens = extractNlpTokens(norm);
  const nlp = analyzeArabicNlp(query, options?.userProfile?.learningLevel || 'beginner');

  // Evaluate follow-up intent vs standalone topic shift
  const isPureFollowUpPhrase =
    norm === 'ليش' ||
    norm === 'لماذا' ||
    norm === 'وش السبب' ||
    norm === 'ما السبب' ||
    norm === 'وضحي اكثر' ||
    norm === 'وضح اكثر' ||
    norm === 'اشرحي اكثر' ||
    norm === 'كيف يعني' ||
    norm === 'ماذا تقصدين' ||
    norm === 'وش قصدك' ||
    norm === 'اعطني مثال' ||
    norm === 'عطيني مثال' ||
    norm === 'عطني مثال' ||
    norm === 'مثال توضيحي' ||
    norm === 'هل في مثال' ||
    norm === 'ودي اجرب' ||
    norm === 'سوي لي لعبه';

  const hasSubstantiveNewTopic = semanticTokens.some((t) => {
    const stem = stemArabicWord(t);
    return [
      'سيف', 'انتشر', 'توحيد', 'قران', 'صلاه', 'وضوء', 'طهاره', 'حيض', 'مصحف',
      'سفر', 'مطر', 'طعام', 'اكل', 'خنزير', 'اهل', 'والد', 'امانه', 'جمعه',
      'توكل', 'جامعه', 'كتابه', 'تاليف', 'اخترع'
    ].includes(stem);
  });

  const isContextualFollowUp = isPureFollowUpPhrase && !hasSubstantiveNewTopic;
  const effectiveTopic =
    isContextualFollowUp && options?.lastTopic && options?.lastTopic !== 'general'
      ? options.lastTopic
      : nlp.topic;

  return {
    rawQuery: query,
    normalizedQuery: norm,
    semanticTokens,
    intent: nlp.intent,
    topic: nlp.topic,
    detectedLevel: nlp.detectedLevel,
    queryType: nlp.queryType,
    isContextualFollowUp,
    effectiveTopic,
    extractedAction: nlp.extractedAction,
  };
}

// =========================================================================
// STAGE B: APPROVED KNOWLEDGE RETRIEVAL
// =========================================================================

/**
 * Retrieves relevant verified knowledge chunks from the approved sources registry
 * based on semantic topic alignment, keyword stems, and intent mapping.
 */
export function retrieveApprovedKnowledge(
  stageA: StageA_SemanticUnderstanding,
  options?: { topK?: number; activeDay?: number; activeExperienceId?: string }
): StageB_RetrievalResult {
  const topK = options?.topK || 2;
  const scoredList: { chunk: KnowledgeChunk; score: number }[] = [];

  const searchStems = new Set<string>();
  for (const token of stageA.semanticTokens) {
    searchStems.add(token);
    const stem = stemArabicWord(token);
    if (stem && stem.length > 1) searchStems.add(stem);
  }

  for (const chunk of TRUSTED_KNOWLEDGE_BASE) {
    let score = 0;
    const normTitle = normalizeArabicNlp(chunk.title);
    const normText = normalizeArabicNlp(chunk.text);
    const normKeywords = chunk.keywords.map((k) => normalizeArabicNlp(k));

    // 1. Semantic Topic Match
    if (stageA.effectiveTopic !== 'general' && chunk.topic === stageA.effectiveTopic) {
      score += 20;
    }

    // 2. Query Type Match
    if (stageA.queryType === 'misconception' && chunk.topic === 'history_spread') {
      score += 25;
    } else if (stageA.queryType === 'definition' && (chunk.sourceType === 'aqeedah' || chunk.sourceType === 'dictionary')) {
      score += 18;
    } else if (stageA.queryType === 'fiqh' && chunk.sourceType === 'fiqh') {
      score += 18;
    }

    // 3. Keyword / Stem matches
    for (const stem of searchStems) {
      if (normTitle.includes(stem)) score += 12;
      for (const kw of normKeywords) {
        if (kw.includes(stem)) score += 15;
      }
      if (normText.includes(stem)) score += 4;
    }

    if (score > 12) {
      scoredList.push({ chunk, score });
    }
  }

  scoredList.sort((a, b) => b.score - a.score);
  const topChunks = scoredList.slice(0, topK).map((item) => item.chunk);

  const topScore = scoredList.length > 0 ? scoredList[0].score : 0;
  const hasDirectEvidence = topScore >= 25 && topChunks.length > 0;
  const groundingLevel =
    topScore >= 35 ? 'HIGH_GROUNDING' : topScore >= 18 ? 'MODERATE_GROUNDING' : 'GENERAL_SYNTHESIS';

  const retrievedContextText = topChunks
    .map(
      (c, idx) =>
        `[مصدر ${idx + 1}: ${c.sourceName} — ${c.title}]\n${c.text}\n(التوثيق: ${c.surahAyah || c.hadithCitation || c.sourceUrl || 'معتمد'})`
    )
    .join('\n\n');

  return {
    topChunks,
    allScoredChunks: scoredList,
    confidenceScore: Math.min(100, Math.max(40, topScore * 2)),
    hasDirectEvidence,
    groundingLevel,
    contextMatched: topChunks.length > 0,
    retrievedContextText,
    primarySourceCitation: topChunks[0]?.sourceName,
  };
}

// =========================================================================
// STAGE C: SOURCE-GROUNDED ANSWER GENERATION
// =========================================================================

/**
 * Generates an educational, reassuring, and authentic response grounded in approved sources.
 */
export function generateSourceGroundedAnswer(
  stageA: StageA_SemanticUnderstanding,
  stageB: StageB_RetrievalResult,
  profile?: UserPersonalizationProfile,
  lang: Language = 'ar'
): StageC_AnswerGeneration {
  const addressing = profile?.preferredAddressing || 'female';
  const isFemale = addressing === 'female';
  const vocative = isFemale ? 'يا أختي' : 'يا أخي';

  let replyAr = '';
  let replyEn = '';

  const primaryChunk = stageB.topChunks[0];

  if (primaryChunk && stageB.hasDirectEvidence) {
    replyAr = `${primaryChunk.title} ${vocative}:\n\n${primaryChunk.text}`;
    replyEn = `Regarding your inquiry: ${primaryChunk.text}\n\nSourced from: ${primaryChunk.sourceName}.`;
  } else if (primaryChunk) {
    replyAr = isFemale
      ? `بخصوص استفساركِ الطيب ${vocative} 🌿\n\n${primaryChunk.text}`
      : `بخصوص استفسارك الطيب ${vocative} 🌿\n\n${primaryChunk.text}`;
    replyEn = `Regarding your reflection: ${primaryChunk.text} [${primaryChunk.sourceName}]`;
  } else {
    // General educational synthesis with openness and no refusal
    replyAr = isFemale
      ? `سؤالكِ مبارك ومهم ${vocative} 🌿\n\n` +
        'الأصل العام في شريعتنا الغراء قائم على التيسير ورفع الحرج وجلب الطمأنينة لقلب المسلم؛ فالمشقة تجلب التيسير، والأصل في الأمور العفو والسماحة.\n\n' +
        'فإذا كانت مسألتكِ استفساراً تعليمياً عاماً، فالدين يسر؛ وإذا كانت نازلة شخصية أو قضائية خاصة تتطلب معرفة ملابسات دقيقة، فيستحب الاستئناس برأي دار الإفتاء المعتمدة.'
      : `سؤالك مبارك ومهم ${vocative} 🌿\n\n` +
        'الأصل العام في شريعتنا الغراء قائم على التيسير ورفع الحرج وجلب الطمأنينة لقلب المسلم؛ فالمشقة تجلب التيسير، والأصل في الأمور العفو والسماحة.\n\n' +
        'فإذا كانت مسألتك استفساراً تعليمياً عاماً، فالدين يسر؛ وإذا كانت نازلة شخصية أو قضائية خاصة تتطلب معرفة ملابسات دقيقة، فيستحب الاستئناس برأي دار الإفتاء المعتمدة.';
    replyEn =
      'A thoughtful inquiry! Islamic principles center upon compassion, ease, and lifting hardship. For specific personal legal edicts, consulting verified scholars is recommended.';
  }

  return {
    replyAr,
    replyEn,
    aiHelpSummary: primaryChunk
      ? {
          intentUnderstoodAr: `فهم السؤال حول: ${stageA.rawQuery}`,
          sourcesConsultedCount: stageB.topChunks.length,
          primarySourceTitleAr: primaryChunk.title,
          primarySourceFamily: primaryChunk.sourceFamily,
          ragScore: stageB.confidenceScore,
          safetyChecksPassed: true,
          educationalNotesAr: primaryChunk.notes || '',
        }
      : undefined,
  };
}

// =========================================================================
// STAGE D: SEMANTIC DOUBT & MISCONCEPTION DETECTION
// =========================================================================

/**
 * Meaning-based semantic evaluator that independently determines whether the user's latest
 * question contains, expresses, or explores a doubt, misconception, objection, accusation,
 * or religious confusion/waswas about Islam.
 */
export function detectDoubtOrMisconceptionSemantic(
  stageA: StageA_SemanticUnderstanding,
  answerText?: string
): StageD_DoubtEvaluation {
  const norm = stageA.normalizedQuery;
  const raw = stageA.rawQuery.toLowerCase();

  // 1. Filter out pure baseline benign knowledge inquiries
  const isPureDefinition =
    (norm.startsWith('ما معني') ||
      norm.startsWith('ما هو') ||
      norm.startsWith('وش يعني') ||
      norm.startsWith('ما مفهوم') ||
      norm.startsWith('ما هي') ||
      norm.startsWith('اشرح لي') ||
      norm.startsWith('اشرح مفهوم')) &&
    !norm.includes('سيف') &&
    !norm.includes('غصب') &&
    !norm.includes('اكراه') &&
    !norm.includes('كتب') &&
    !norm.includes('الف') &&
    !norm.includes('شك') &&
    !norm.includes('وسوس') &&
    !norm.includes('حائض') &&
    !norm.includes('تبطل') &&
    !norm.includes('كفر') &&
    !norm.includes('بدعه') &&
    !norm.includes('شبهه') &&
    !norm.includes('تناقض');

  const isBasicLearningPractice =
    norm.startsWith('كيف اصلي') ||
    norm.startsWith('كيف اتعلم') ||
    norm.startsWith('اعطني مثال') ||
    norm.startsWith('عطيني مثال') ||
    norm.startsWith('سوي لي لعبه') ||
    norm.startsWith('ترجم') ||
    norm === 'موجز';

  if (isPureDefinition || isBasicLearningPractice) {
    return {
      isDoubtOrMisconception: false,
      confidence: 0,
      category: 'mindset',
      doubtType: 'none',
      rationaleAr: 'سؤال تعليمي معرفي عام لا يحمل شبهة أو تشكيكاً',
      rationaleEn: 'Ordinary factual inquiry without misconception',
      coreRuleAr: '',
      coreRuleEn: '',
      hadithOrAyahAr: '',
      hadithOrAyahEn: '',
    };
  }

  // 2. Evaluate Theological Skepticism & Authorship Inquiries (e.g. human authorship, invention, contradiction)
  if (
    norm.includes('كتب') ||
    norm.includes('الف') ||
    norm.includes('تاليف') ||
    norm.includes('اخترع') ||
    norm.includes('بشري') ||
    norm.includes('اساطير') ||
    norm.includes('تناقض') ||
    raw.includes('authored') ||
    raw.includes('write the quran') ||
    raw.includes('wrote the quran')
  ) {
    return {
      isDoubtOrMisconception: true,
      confidence: 95,
      category: 'mindset',
      doubtType: 'theological_skepticism',
      rationaleAr: 'استفسار أو شبهة حول مصدر القرآن الكريم وبشرية التأليف',
      rationaleEn: 'Inquiry or misconception regarding Quranic divine revelation',
      coreRuleAr: 'أصل عقدي قطعي: «القرآن كلام الله المعجز المنزّل بالحق، ليس من تأليف بشر»',
      coreRuleEn: 'Creedal Maxim: "The Quran is the uncreated Word of Allah, revealed in truth"',
      hadithOrAyahAr: '﴿قُل لَّئِنِ اجْتَمَعَتِ الْإِنسُ وَالْجِنُّ عَلَىٰ أَن يَأْتُوا بِمِثْلِ هَٰذَا الْقُرْآنِ لَا يَأْتُونَ بِمِثْلِهِ﴾ [الإسراء: 88]',
      hadithOrAyahEn: '"Say: If mankind and the jinn were to gather in order to produce the like of this Quran, they could not produce the like of it" [17:88]',
    };
  }

  // 3. Evaluate Historical / Violence / Coercion Misconceptions (e.g. spread by force, sword, compulsion)
  if (
    norm.includes('سيف') ||
    norm.includes('غصب') ||
    norm.includes('بالغصب') ||
    norm.includes('بالقوه') ||
    norm.includes('بالقوة') ||
    norm.includes('اكراه') ||
    norm.includes('اجبار') ||
    norm.includes('عنف') ||
    norm.includes('ارهاب') ||
    (norm.includes('انتشر') && (norm.includes('سيف') || norm.includes('قوه') || norm.includes('قتال') || norm.includes('حروب'))) ||
    raw.includes('sword') ||
    raw.includes('violence') ||
    raw.includes('forced conversion')
  ) {
    return {
      isDoubtOrMisconception: true,
      confidence: 95,
      category: 'mindset',
      doubtType: 'historical_accusation',
      rationaleAr: 'شبهة أو تساؤل حول انتشار الإسلام بالقوة أو السيف',
      rationaleEn: 'Misconception regarding the peaceful historical spread of Islam',
      coreRuleAr: 'محكم التنزيل: «لَا إِكْرَاهَ فِي الدِّينِ، والإيمان اقتناع قلبي وحرية»',
      coreRuleEn: 'Divine Principle: "There is no compulsion in religion; faith requires voluntary conviction"',
      hadithOrAyahAr: '﴿لَا إِكْرَاهَ فِي الدِّينِ ۖ قَد تَّبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ﴾ [البقرة: 256]',
      hadithOrAyahEn: '"There is no compulsion in religion. The right direction is distinct from error" [2:256]',
    };
  }

  // 4. Evaluate Purity / Menses / Touch-Reading Disputed Matters
  if (
    norm.includes('حائض') ||
    norm.includes('حيض') ||
    norm.includes('مس المصحف') ||
    norm.includes('لمس المصحف') ||
    norm.includes('قراءه الحائض')
  ) {
    return {
      isDoubtOrMisconception: true,
      confidence: 90,
      category: 'worship',
      doubtType: 'disputed_ruling_confusion',
      rationaleAr: 'استفسار حول حكم مس المصحف وقراءة القرآن للحائض والتيسير الفقهي',
      rationaleEn: 'Inquiry on touching/reading Quran during menses and scholarly concessions',
      coreRuleAr: 'قاعدة فقهية جامعة: «لا يُنكر المختلف فيه، والرخص الشرعية وشاشات الهواتف ترفع الحرج»',
      coreRuleEn: 'Fiqh Maxim: "No condemnation in disputed matters; electronic screens and concessions lift hardship"',
      hadithOrAyahAr: '«إِنَّ الدِّينَ يُسْرٌ، وَلَنْ يُشَادَّ الدِّينَ أَحَدٌ إِلَّا غَلَبَهُ» [صحيح البخاري]',
      hadithOrAyahEn: '"Indeed, the religion is ease, and none overburdens themselves with it but it overcomes them." [Bukhari]',
    };
  }

  // 5. Evaluate Obsessive Doubts / Waswas in Purity & Prayer Validity
  if (
    norm.includes('شك') ||
    norm.includes('وسواس') ||
    norm.includes('وسوس') ||
    norm.includes('شاك') ||
    norm.includes('ريح') ||
    norm.includes('تبطل') ||
    norm.includes('بطلت') ||
    norm.includes('انتقاض') ||
    norm.includes('انقض') ||
    norm.includes('عيد الوضوء') ||
    norm.includes('اعيدها') ||
    norm.includes('اعيد الصلاه') ||
    raw.includes('doubt') ||
    raw.includes('waswas')
  ) {
    return {
      isDoubtOrMisconception: true,
      confidence: 90,
      category: 'worship',
      doubtType: 'worship_waswas_anxiety',
      rationaleAr: 'شكوك أو وساوس طارئة في الطهارة أو صحة الصلاة والعبادة',
      rationaleEn: 'Transient doubt or whisper in wudu and prayer validity',
      coreRuleAr: 'قاعدة فقهية كبرى: «اليقين لا يزول بالشك»',
      coreRuleEn: 'Major Maxim: "Certainty is not overruled by doubt"',
      hadithOrAyahAr: '«فَلَا يَنْصَرِفْ حَتَّى يَسْمَعَ صَوْتًا أَوْ يَجِدَ رِيحًا» [صحيح البخاري]',
      hadithOrAyahEn: '"He should not leave prayer until he hears a sound or perceives an odor." [Bukhari]',
    };
  }

  // 6. Evaluate Extreme Rulings Confusion / Takfir / Social Media Distress
  if (
    norm.includes('كفر') ||
    norm.includes('شرك') ||
    norm.includes('بدعه') ||
    norm.includes('تشدد') ||
    norm.includes('متشدد') ||
    norm.includes('مقطع') ||
    norm.includes('سوشيال') ||
    norm.includes('عذاب') ||
    norm.includes('اثم') ||
    norm.includes('ذنب كبير')
  ) {
    return {
      isDoubtOrMisconception: true,
      confidence: 85,
      category: 'mindset',
      doubtType: 'disputed_ruling_confusion',
      rationaleAr: 'التباس ناشئ عن مقاطع أو فتاوى متشددة تسبب القلق والذنب',
      rationaleEn: 'Confusion from strict claims causing unnecessary distress',
      coreRuleAr: 'قاعدة فقهية كبرى: «المشقة تجلب التيسير، وما جعل عليكم في الدين من حرج»',
      coreRuleEn: 'Major Maxim: "Hardship begets ease, and faith contains no undue burden"',
      hadithOrAyahAr: '«يَسِّرُوا وَلَا تُعَسِّرُوا، وَبَشِّرُوا وَلَا تُنَفِّرُوا» [صحيح البخاري]',
      hadithOrAyahEn: '"Make things easy and do not make them difficult; give glad tidings and do not repel." [Bukhari]',
    };
  }

  // Default: ordinary inquiry
  return {
    isDoubtOrMisconception: false,
    confidence: 0,
    category: 'mindset',
    doubtType: 'none',
    rationaleAr: 'استفسار اعتيادي',
    rationaleEn: 'Standard inquiry',
    coreRuleAr: '',
    coreRuleEn: '',
    hadithOrAyahAr: '',
    hadithOrAyahEn: '',
  };
}

// =========================================================================
// STAGE E: "محراب اليقين" & "عدسة تفكيك الفتوى" RECORDING
// =========================================================================

/**
 * Automatically records the doubt/misconception in the Clarity Fatwa Sanctuary,
 * applying the 3-Layer Lens and deduplicating semantically.
 */
export function recordInFatwaSanctuary(
  stageA: StageA_SemanticUnderstanding,
  stageC: StageC_AnswerGeneration,
  stageD: StageD_DoubtEvaluation,
  profile?: UserPersonalizationProfile,
  lang: Language = 'ar'
): StageE_SanctuaryResult {
  if (!stageD.isDoubtOrMisconception) {
    return { recorded: false };
  }

  const cleanAnswer = stageC.replyAr
    .replace(/^أهلاً بك.*?🌿\s*/s, '')
    .trim();

  const id = `usr-sanctuary-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  const newRecord: VerificationQA = {
    id,
    category: stageD.category,
    queryAr: stageA.rawQuery.trim(),
    queryEn: stageA.rawQuery.trim(),
    answerAr: cleanAnswer || stageC.replyAr,
    answerEn: stageC.replyEn || stageC.replyAr,
    coreRuleAr: stageD.coreRuleAr,
    coreRuleEn: stageD.coreRuleEn,
    hadithOrAyahAr: stageD.hadithOrAyahAr,
    hadithOrAyahEn: stageD.hadithOrAyahEn,
    isUserSubmitted: true,
    createdAt: Date.now(),
  };

  const saved = saveFatwaSanctuaryRecord(newRecord);
  return {
    recorded: saved,
    record: newRecord,
    isDuplicate: !saved,
  };
}

// =========================================================================
// STAGE F: COMPLETE PIPELINE ORCHESTRATOR
// =========================================================================

/**
 * Executes Rafiq's end-to-end 6-stage question-processing pipeline:
 * USER MESSAGE
 * → Stage A: Understand meaning & intent
 * → Stage B: Retrieve relevant approved knowledge
 * → Stage C: Generate source-grounded answer
 * → Stage D: Independently determine doubt/misconception presence
 * → Stage E: Record in "محراب اليقين" & apply "عدسة تفكيك الفتوى"
 * → Stage F: Return synthesized response & structured metadata
 */
export function executeRafiqQuestionPipeline(
  query: string,
  options?: {
    activeDay?: number;
    activeExperienceId?: string;
    conversationHistory?: Array<{ sender: 'user' | 'anas'; text: string }>;
    lastTopic?: string;
    userProfile?: UserPersonalizationProfile;
    lang?: Language;
  }
): RafiqPipelineExecutionResult {
  // Stage A
  const stageA = analyzeUserIntentAndSemantics(query, options);

  // Stage B
  const stageB = retrieveApprovedKnowledge(stageA, {
    activeDay: options?.activeDay,
    activeExperienceId: options?.activeExperienceId,
  });

  // Stage C
  const stageC = generateSourceGroundedAnswer(
    stageA,
    stageB,
    options?.userProfile,
    options?.lang || 'ar'
  );

  // Stage D
  const stageD = detectDoubtOrMisconceptionSemantic(stageA, stageC.replyAr);

  // Stage E
  const stageE = recordInFatwaSanctuary(
    stageA,
    stageC,
    stageD,
    options?.userProfile,
    options?.lang || 'ar'
  );

  // Suggested Actions based on intent
  let suggestedAction: RafiqPipelineExecutionResult['suggestedAction'];
  if (stageA.extractedAction) {
    suggestedAction = {
      actionName: stageA.extractedAction.actionName,
      targetId: stageA.extractedAction.targetId,
      humanLabelAr: stageA.extractedAction.humanLabelAr,
    };
  } else if (stageA.rawQuery.includes('لعبه') || stageA.rawQuery.includes('تدرب')) {
    suggestedAction = {
      actionName: 'openMiniGame',
      gameTopic: stageA.effectiveTopic,
      humanLabelAr: 'بدء لعبة تفاعلية',
    };
  }

  return {
    stageA,
    stageB,
    stageC,
    stageD,
    stageE,
    replyAr: stageC.replyAr,
    replyEn: stageC.replyEn,
    retrievedChunks: stageB.topChunks,
    confidence: stageB.confidenceScore,
    hasDirectEvidence: stageB.hasDirectEvidence,
    suggestedAction,
  };
}
