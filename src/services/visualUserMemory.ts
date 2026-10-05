/**
 * Visual User Memory & Real-Time Progress Tracking Service (RAFIC_USER_STATE)
 * Fulfills Part 1: Visual User Memory, Unlocked Concessions, Milestone Tracking,
 * In-Chat Memory Recall, Emotional State Detection & Gentle Mode.
 */

export type EmotionalSentiment = 'peaceful' | 'anxious' | 'confused' | 'guilt' | 'hesitant';

export interface UnlockedConcession {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'wudu' | 'prayer' | 'food' | 'social' | 'travel';
  descriptionAr: string;
  descriptionEn: string;
  sourceAr: string;
  icon: string;
  unlockedAt: string;
}

export interface PracticedScenarioRecord {
  id: string;
  titleAr: string;
  titleEn: string;
  engineType: string;
  category: string;
  date: string;
  scoreDelta: number;
  tranquilityAfter: number;
  keyLearningAr: string;
}

export interface TranquilityHistoryPoint {
  day: number;
  date: string;
  score: number;
  eventAr: string;
}

export interface MilestoneSummary {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  achievedDate: string;
  category: string;
  selfEfficacyBoostAr: string;
}

export interface RaficUserState {
  totalCompletedActions: number;
  tranquilityHistory: TranquilityHistoryPoint[];
  unlockedConcessions: UnlockedConcession[];
  practicedScenarios: PracticedScenarioRecord[];
  lastEmotionalState: EmotionalSentiment;
  gentleModeActive: boolean;
  weeklyMilestones: MilestoneSummary[];
}

export const STORAGE_KEY_RAFIC_USER_STATE = 'RAFIC_USER_STATE';

export const INITIAL_CONCESSIONS_LIBRARY: UnlockedConcession[] = [
  {
    id: 'concession_sock_wiping',
    nameAr: 'رخصة المسح على الجوربين والخفين',
    nameEn: 'Concession: Sock Wiping (Khuffayn)',
    category: 'wudu',
    descriptionAr: 'يشرع المسح على الجوربين الطاهرين يوماً وليلة للمقيم وثلاثة أيام للمسافر دون خلع الحذاء في مغاسل العمل والجامعة.',
    descriptionEn: 'Permissible to wipe over socks for 1 day/night (resident) or 3 days/nights (traveler).',
    sourceAr: 'صحيح مسلم والدرر السنية — باب الطهارة',
    icon: '🧦',
    unlockedAt: 'اليوم الأول',
  },
  {
    id: 'concession_water_mudd',
    nameAr: 'رخصة وسنة المُدّ النبوي (650 مل)',
    nameEn: 'Concession: The Prophetic Mudd Economy',
    category: 'wudu',
    descriptionAr: 'الوضوء بملء الكفين فقط (المُدّ) يرفع الوسواس والشك ويوفر الطمأنينة الكاملة واليقين بصحة الطهارة.',
    descriptionEn: 'Performing Wudu with just a mudd (cupped hands) dispels doubt and waswas.',
    sourceAr: 'صحيح البخاري — باب الوضوء بالمد',
    icon: '💧',
    unlockedAt: 'اليوم الثاني',
  },
  {
    id: 'concession_sujud_sahw',
    nameAr: 'رخصة وتدارك سجود السهو',
    nameEn: 'Concession: Sujud al-Sahw Healing',
    category: 'prayer',
    descriptionAr: 'سجدتان قبل أو بعد السلام تجبران أي سهو أو شك أو زيادة ونقص في أركان الصلاة بسلام وطمأنينة.',
    descriptionEn: 'Two prostrations heal forgetfulness, omission, or addition in prayer.',
    sourceAr: 'صحيح البخاري ومسلم — باب سجود السهو',
    icon: '🕊️',
    unlockedAt: 'اليوم الثالث',
  },
  {
    id: 'concession_travel_shortening',
    nameAr: 'رخصة الجمع والقصر في السفر',
    nameEn: 'Concession: Shortening & Combining Prayers',
    category: 'travel',
    descriptionAr: 'قصر الصلاة الرباعية إلى ركعتين، وجواز الجمع بين الظهر والعصر، والمغرب والعشاء في السفر والمطر الشديد.',
    descriptionEn: 'Shortening 4-rakah prayers to 2 and combining them when traveling or during severe rain.',
    sourceAr: 'الموسوعة الفقهية — الدرر السنية',
    icon: '✈️',
    unlockedAt: 'اليوم الرابع',
  },
  {
    id: 'concession_sitting_prayer',
    nameAr: 'رخصة الصلاة قاعداً أو مومئاً في الطائرة والقطار',
    nameEn: 'Concession: Praying Seated / Nodding',
    category: 'prayer',
    descriptionAr: 'إذا تعذر القيام أو استقبال القبلة في وسيلة السفر، تصح الصلاة جالساً مع الإيماء بركوع وسجود ميسر.',
    descriptionEn: 'When standing or facing the Qibla is difficult while traveling, praying seated is valid.',
    sourceAr: 'دليل المسلم الجديد — د. فهد باهمام',
    icon: '🪑',
    unlockedAt: 'اليوم الخامس',
  },
  {
    id: 'concession_social_taysir',
    nameAr: 'رخصة التعايش بالحسنى والمداراة',
    nameEn: 'Concession: Gracious Social Coexistence',
    category: 'social',
    descriptionAr: 'ملاطفة الأهل وزملاء العمل غير المسلمين، وتناول الأطعمة المباحة معهم دون تنفير أو حرج اجتماعي.',
    descriptionEn: 'Kind social interaction with non-Muslim colleagues and family without awkwardness.',
    sourceAr: 'كتاب بينات — المستودع الدعوي الرقمي',
    icon: '🤝',
    unlockedAt: 'اليوم السادس',
  },
];

export const INITIAL_MILESTONES: MilestoneSummary[] = [
  {
    id: 'milestone_wudu_ease',
    titleAr: 'تجاوز وسواس الوضوء في العمل',
    titleEn: 'Overcoming Wudu Hesitation at Work',
    descriptionAr: 'تطبيق المسح على الجوربين بيقين ودون حرج في بيئة العمل.',
    descriptionEn: 'Wiping over clean socks with certainty at the workplace.',
    achievedDate: 'اليوم الثاني',
    category: 'الطهارة والوضوء',
    selfEfficacyBoostAr: 'أثبتَّ لنفسك أن الشريعة تيسير وليست عسراً، وأنك قادر على تطبيق دينك بوقار وسكينة.',
  },
  {
    id: 'milestone_prayer_recovery',
    titleAr: 'إتقان تدارك السهو في الصلاة',
    titleEn: 'Mastering Sahw Recovery in Prayer',
    descriptionAr: 'البناء على اليقين والتعامل مع الشك في عدد الركعات بسجدتي السهو دون إعادة الصلاة.',
    descriptionEn: 'Building on certainty and healing doubts with Sujud Sahw instead of repeating prayer.',
    achievedDate: 'اليوم الثالث',
    category: 'الصلاة والخشوع',
    selfEfficacyBoostAr: 'السهو يعرض لكل البشر؛ امتلاكك لأداة سجود السهو حررك من وسواس إعادة الصلاة.',
  },
  {
    id: 'milestone_social_grace',
    titleAr: 'التواصل اللبق في مأدبة زملاء العمل',
    titleEn: 'Gracious Communication at Work Banquet',
    descriptionAr: 'اختيار الطعام الحلال والاعتذار عن المشروبات المحرمة بابتسامة وثقة مريحة.',
    descriptionEn: 'Politely selecting halal food and refusing haram drinks with gentle confidence.',
    achievedDate: 'اليوم الخامس',
    category: 'التعايش والعلاقات',
    selfEfficacyBoostAr: 'كسبت احترام من حولك بحسن خلقك وثباتك الهادئ دون تصادم أو انطواء.',
  },
];

export const DEFAULT_RAFIC_USER_STATE: RaficUserState = {
  totalCompletedActions: 14,
  tranquilityHistory: [
    { day: 1, date: 'اليوم الأول', score: 55, eventAr: 'تهيئة البيئة والتطهر' },
    { day: 2, date: 'اليوم الثاني', score: 62, eventAr: 'تجاوز وسواس وضوء العمل' },
    { day: 3, date: 'اليوم الثالث', score: 70, eventAr: 'إتقان سجدتي السهو' },
    { day: 4, date: 'اليوم الرابع', score: 76, eventAr: 'رخصة الجمع والقصر بالسفر' },
    { day: 5, date: 'اليوم الخامس', score: 82, eventAr: 'التواصل الاجتماعي الواثق' },
    { day: 6, date: 'اليوم السادس', score: 87, eventAr: 'الاستمتاع بحلاوة العبادة' },
    { day: 7, date: 'اليوم السابع', score: 92, eventAr: 'رسوخ السكينة واليقين' },
  ],
  unlockedConcessions: INITIAL_CONCESSIONS_LIBRARY,
  practicedScenarios: [
    {
      id: 'scen_1',
      titleAr: 'الشك بين الركعة الثالثة والرابعة',
      titleEn: 'Doubt between 3rd and 4th Rakah',
      engineType: 'ENGINE_PRAYER_CORRECTION',
      category: 'الصلاة والسهو',
      date: 'اليوم الثالث',
      scoreDelta: 15,
      tranquilityAfter: 70,
      keyLearningAr: 'البناء على الأقل المتيقن وأداء سجدتي السهو قبل السلام.',
    },
    {
      id: 'scen_2',
      titleAr: 'المسح على الجوربين بمغسلة الجامعة',
      titleEn: 'Sock Wiping at Campus Basin',
      engineType: 'ENGINE_WUDU_PURITY',
      category: 'الطهارة والوضوء',
      date: 'اليوم الثاني',
      scoreDelta: 15,
      tranquilityAfter: 62,
      keyLearningAr: 'مسحة واحدة خفيفة على ظاهر الجورب الطاهر تغني عن خلع الحذاء.',
    },
    {
      id: 'scen_3',
      titleAr: 'مأدبة عشاء العمل واختيار الحلال',
      titleEn: 'Work Dinner & Halal Selection',
      engineType: 'ENGINE_SOCIAL_ETHICS',
      category: 'المواقف الاجتماعية',
      date: 'اليوم الخامس',
      scoreDelta: 15,
      tranquilityAfter: 82,
      keyLearningAr: 'الأصل في الأطعمة الطاهرة الحل، والاعتذار بلطف عن المحرمات يعزز الاحترام.',
    },
  ],
  lastEmotionalState: 'peaceful',
  gentleModeActive: false,
  weeklyMilestones: INITIAL_MILESTONES,
};

/**
 * Loads the user state from persistent storage or returns calibrated default
 */
export function loadRaficUserState(): RaficUserState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RAFIC_USER_STATE);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_RAFIC_USER_STATE,
        ...parsed,
        tranquilityHistory: parsed.tranquilityHistory?.length ? parsed.tranquilityHistory : DEFAULT_RAFIC_USER_STATE.tranquilityHistory,
        unlockedConcessions: parsed.unlockedConcessions?.length ? parsed.unlockedConcessions : DEFAULT_RAFIC_USER_STATE.unlockedConcessions,
        weeklyMilestones: parsed.weeklyMilestones?.length ? parsed.weeklyMilestones : DEFAULT_RAFIC_USER_STATE.weeklyMilestones,
        practicedScenarios: parsed.practicedScenarios || DEFAULT_RAFIC_USER_STATE.practicedScenarios,
      };
    }
  } catch (err) {
    console.warn('Error reading RAFIC_USER_STATE:', err);
  }
  return { ...DEFAULT_RAFIC_USER_STATE };
}

/**
 * Persists the user state to localStorage
 */
export function saveRaficUserState(state: RaficUserState): void {
  try {
    localStorage.setItem(STORAGE_KEY_RAFIC_USER_STATE, JSON.stringify(state));
  } catch (err) {
    console.warn('Error saving RAFIC_USER_STATE:', err);
  }
}

/**
 * Records a newly completed tactile scenario in user memory
 */
export function recordScenarioCompletion(
  scenario: {
    id: string;
    titleAr: string;
    titleEn?: string;
    engineType: string;
    category?: string;
    scoreDelta?: number;
    currentScore?: number;
    keyLearningAr?: string;
  }
): RaficUserState {
  const current = loadRaficUserState();
  const delta = scenario.scoreDelta || 15;
  const newScore = Math.min(100, (scenario.currentScore || 75) + delta);

  const record: PracticedScenarioRecord = {
    id: scenario.id || `scen_${Date.now()}`,
    titleAr: scenario.titleAr,
    titleEn: scenario.titleEn || scenario.titleAr,
    engineType: scenario.engineType,
    category: scenario.category || 'تطبيق عملي',
    date: 'اليوم',
    scoreDelta: delta,
    tranquilityAfter: newScore,
    keyLearningAr: scenario.keyLearningAr || 'إتمام التدريب الحركي العملي بنجاح وطمأنينة.',
  };

  const updatedHistory = [...current.tranquilityHistory];
  if (updatedHistory.length > 0) {
    updatedHistory[updatedHistory.length - 1] = {
      ...updatedHistory[updatedHistory.length - 1],
      score: newScore,
    };
  }

  const updated: RaficUserState = {
    ...current,
    totalCompletedActions: current.totalCompletedActions + 1,
    practicedScenarios: [record, ...current.practicedScenarios.slice(0, 19)],
    tranquilityHistory: updatedHistory,
    lastEmotionalState: 'peaceful',
  };

  saveRaficUserState(updated);
  return updated;
}

/**
 * Sentiment & Latency Detection Engine (رادار المشاعر)
 * Analyzes user input and interaction latency to detect emotional states
 */
export function detectEmotionalSentiment(
  text: string,
  latencyMs?: number
): {
  sentiment: EmotionalSentiment;
  isStress: boolean;
  gentleModeTriggered: boolean;
  reasonAr: string;
} {
  const clean = text.toLowerCase();

  // Severe stress / guilt keywords
  const guiltKeywords = ['ذنب', 'عذاب', 'أشعر بالذنب', 'ذنبي', 'هل يغفر الله', 'هل تقبل', 'خائف من العذاب', 'أنا مقصر جدا', 'فشلت'];
  const anxietyKeywords = ['قلق', 'أخاف', 'أخشى', 'خوف', 'مرعوب', 'توتر', 'أرتجف', 'ضغط', 'اختناق', 'هم', 'حزن'];
  const confusionKeywords = ['تشتت', 'ضائع', 'لا أفهم', 'محتار', 'تناقض', 'وسواس', 'أشك', 'شككت', 'تلعثمت'];
  const hesitationKeywords = ['متردد', 'أتردد', 'خجل', 'أخجل', 'صعب', 'ثقيل', 'أستحي', 'أحرج'];

  const hasGuilt = guiltKeywords.some((k) => clean.includes(k));
  const hasAnxiety = anxietyKeywords.some((k) => clean.includes(k));
  const hasConfusion = confusionKeywords.some((k) => clean.includes(k));
  const hasHesitation = hesitationKeywords.some((k) => clean.includes(k));

  const isHighLatency = latencyMs && latencyMs > 8000;

  if (hasGuilt) {
    return {
      sentiment: 'guilt',
      isStress: true,
      gentleModeTriggered: true,
      reasonAr: 'رصد مشاعر لوم النفس أو القلق من التقصير، يتطلب التذكير برحمة الله وسعة مغفرته.',
    };
  }

  if (hasAnxiety) {
    return {
      sentiment: 'anxious',
      isStress: true,
      gentleModeTriggered: true,
      reasonAr: 'رصد مشاعر قلق وضغط نفسي، يتطلب التهدئة وتفعيل رخص التيسير فوراً.',
    };
  }

  if (hasConfusion || hasHesitation || isHighLatency) {
    return {
      sentiment: hasConfusion ? 'confused' : 'hesitant',
      isStress: false,
      gentleModeTriggered: false,
      reasonAr: 'رصد تردد أو حيرة، يتطلب إرشاداً حركياً مبسطاً بدون تفاصيل متشعبة.',
    };
  }

  return {
    sentiment: 'peaceful',
    isStress: false,
    gentleModeTriggered: false,
    reasonAr: 'حالة وجدانية متوازنة ومستعدة لتلقي الإرشاد العملي.',
  };
}

/**
 * Contextual In-Chat Memory Hook
 * Provides Rafiq with a personalized memory recall of the user's prior success
 */
export function getContextualMemoryHook(state?: RaficUserState): string {
  const userState = state || loadRaficUserState();
  const scenarios = userState.practicedScenarios;

  if (scenarios && scenarios.length > 0) {
    const prior = scenarios[0];
    return `تذكر كيف أتممت بنجاح «${prior.titleAr}» واكتسبت الطمأنينة؟ هذا الموقف اليوم ميسر أيضاً وتستطيع تجاوزه براحة تامة 🌿`;
  }

  const milestones = userState.weeklyMilestones;
  if (milestones && milestones.length > 0) {
    const m = milestones[0];
    return `تذكر كيف تجاوزت سابقاً «${m.titleAr}»؟ ثق بقدرتك وهدي الشريعة، فكل عسير يزول بالتيسير 🌿`;
  }

  return 'تذكر أن كل خطوة تخطوها في سبيل الله محاطة برحمته ومعيته، وأن المشقة تجلب التيسير دائماً 🌿';
}

/**
 * Generates a personalized Weekly Mastery Review
 */
export function generateWeeklyMasteryReview(state?: RaficUserState): {
  headlineAr: string;
  totalMastered: number;
  tranquilityGain: number;
  topAchievementAr: string;
  concessionsLearnedCount: number;
  comfortingMessageAr: string;
} {
  const userState = state || loadRaficUserState();
  const history = userState.tranquilityHistory;
  const startScore = history.length > 0 ? history[0].score : 50;
  const currentScore = history.length > 0 ? history[history.length - 1].score : 85;
  const gain = Math.max(0, currentScore - startScore);

  const topMilestone = userState.weeklyMilestones[0]?.titleAr || 'إتقان رخص العبادات اليومية';

  return {
    headlineAr: 'حصاد أسبوعك المبارك مع رفيق السكينة ✨',
    totalMastered: userState.totalCompletedActions,
    tranquilityGain: gain,
    topAchievementAr: topMilestone,
    concessionsLearnedCount: userState.unlockedConcessions.length,
    comfortingMessageAr:
      'لقد قطعت شوطاً عظيماً يا رفيق الدرب. أثبت لنفسك أن الدين يسر، وأن قلبك قادر على استيعاب العبادات بشغف وسكينة دون إرهاق أو احتراق.',
  };
}
