import { UserPersonalizationProfile } from '../types';

export interface VerificationQA {
  id: string;
  category: 'worship' | 'social' | 'food' | 'mindset';
  queryAr: string;
  queryEn: string;
  answerAr: string;
  answerEn: string;
  coreRuleAr: string;
  coreRuleEn: string;
  hadithOrAyahAr: string;
  hadithOrAyahEn: string;
  isUserSubmitted?: boolean;
  createdAt?: number;
}

export const FATWA_SANCTUARY_STORAGE_KEY = 'rafeeq_fatwa_sanctuary_records';

/**
 * Normalizes text for clean semantic and deduplication comparison.
 */
function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[^\w\s\u0600-\u06FF]/g, '')
    .trim();
}

/**
 * Dynamic Semantic Evaluator:
 * Determines whether a question contains, expresses, or explores a doubt, misconception,
 * objection, accusation, or potentially confusing/disputed claim about Islam.
 *
 * Distinguishes genuine doubts/misconceptions from ordinary baseline knowledge questions.
 */
export function isDoubtOrMisconceptionQuestion(query: string, answerText?: string): boolean {
  if (!query || typeof query !== 'string') return false;
  const qNorm = normalizeText(query);
  const qLower = query.toLowerCase().trim();

  // Baseline ordinary questions that DO NOT constitute doubts/misconceptions:
  // e.g., Direct educational requests without skeptical claims or doubt
  const isOrdinaryDefinition =
    (qNorm.startsWith('ما معنى') || qNorm.startsWith('ما هو') || qNorm.startsWith('وش معنى') || qNorm.startsWith('ما مفهوم') || qNorm.startsWith('ما هي')) &&
    !qNorm.includes('شبهه') &&
    !qNorm.includes('شك') &&
    !qNorm.includes('وسواس') &&
    !qNorm.includes('حرام') &&
    !qNorm.includes('سيف') &&
    !qNorm.includes('كتبه') &&
    !qNorm.includes('الفه') &&
    !qNorm.includes('حائض') &&
    !qNorm.includes('كفر') &&
    !qNorm.includes('شرك') &&
    !qNorm.includes('بدعه') &&
    !qNorm.includes('تبطل') &&
    !qNorm.includes('تناقض');

  const isOrdinaryLearningPractice =
    qNorm.startsWith('كيف اصلي') ||
    qNorm.startsWith('كيف اتعلم') ||
    qNorm.startsWith('ترتيب خطوات') ||
    qNorm.startsWith('سوي لي لعبه') ||
    qNorm.startsWith('ابي لعبه') ||
    qNorm.startsWith('اعطني مثال') ||
    qNorm.startsWith('عطيني مثال') ||
    qNorm === 'موجز' ||
    qNorm.startsWith('ما اوقات');

  if (isOrdinaryDefinition || isOrdinaryLearningPractice) {
    return false;
  }

  // SKEPTICAL CLAIMS & MISCONCEPTIONS INDICATORS:
  // Questions questioning divine origins, alleging human authorship, violence, coercion, injustice, contradictions
  const hasTheologicalOrHistoricalObjection =
    qNorm.includes('كتبه') ||
    qNorm.includes('الفه') ||
    qNorm.includes('اخترعه') ||
    qNorm.includes('تاليف') ||
    qNorm.includes('اقتبس') ||
    qNorm.includes('سيف') ||
    qNorm.includes('بالسيف') ||
    qNorm.includes('انتشر بالسيف') ||
    qNorm.includes('انتشار بالسيف') ||
    qNorm.includes('اكراه') ||
    qNorm.includes('اجبار') ||
    qNorm.includes('ارهاب') ||
    qNorm.includes('عنف') ||
    qNorm.includes('شبهه') ||
    qNorm.includes('شبهات') ||
    qNorm.includes('تناقض') ||
    qNorm.includes('اساطير') ||
    qNorm.includes('ظلم') ||
    qNorm.includes('ضد العلم') ||
    qLower.includes('sword') ||
    qLower.includes('violence') ||
    qLower.includes('authored') ||
    qLower.includes('coercion') ||
    qLower.includes('misconception');

  // WORSHIP, PURITY & RULING CONFUSION / WASWAS / GUILT INDICATORS:
  // Questions exploring whether an act broke worship, impurity doubts, strict conflicting fatwas, menses rulings
  const hasWorshipOrRulingDoubt =
    qNorm.includes('شك') ||
    qNorm.includes('وسواس') ||
    qNorm.includes('شاك') ||
    qNorm.includes('تبطل') ||
    qNorm.includes('بطلت') ||
    qNorm.includes('انتقاض') ||
    qNorm.includes('نقض') ||
    qNorm.includes('ريح') ||
    qNorm.includes('حائض') ||
    qNorm.includes('حيض') ||
    qNorm.includes('مس المصحف') ||
    qNorm.includes('لمس المصحف') ||
    qNorm.includes('كفر') ||
    qNorm.includes('شرك') ||
    qNorm.includes('بدعه') ||
    qNorm.includes('تشدد') ||
    qNorm.includes('متشدد') ||
    qNorm.includes('مقطع') ||
    qNorm.includes('سوشيال') ||
    qNorm.includes('عذاب') ||
    qNorm.includes('اثم') ||
    qNorm.includes('ذنب') ||
    qNorm.includes('خلاف') ||
    qNorm.includes('مختلف فيه') ||
    qNorm.includes('حرام ولا حلال') ||
    qNorm.includes('حلال ولا حرام') ||
    qNorm.includes('هل يجوز') ||
    qNorm.includes('هل حرام') ||
    qNorm.includes('هل صحيح ان') ||
    qLower.includes('doubt') ||
    qLower.includes('whisper') ||
    qLower.includes('invalid') ||
    qLower.includes('menses') ||
    qLower.includes('haram');

  return hasTheologicalOrHistoricalObjection || hasWorshipOrRulingDoubt;
}

/**
 * Backward compatibility alias
 */
export const isFatwaSanctuaryQuestion = isDoubtOrMisconceptionQuestion;

/**
 * Dynamically categorizes the question based on semantic domain.
 */
function categorizeQuestionDomain(query: string, answer: string): 'worship' | 'social' | 'food' | 'mindset' {
  const text = normalizeText(`${query} ${answer}`);

  if (text.includes('طعام') || text.includes('اكل') || text.includes('مطعم') || text.includes('جبن') || text.includes('لحم') || text.includes('خنزير') || text.includes('كحول') || text.includes('جيلاتين') || text.includes('مستحلب')) {
    return 'food';
  }
  if (text.includes('اهل') || text.includes('عائل') || text.includes('والد') || text.includes('ام') || text.includes('اب') || text.includes('اصدقاء') || text.includes('مجتمع') || text.includes('غير مسلم')) {
    return 'social';
  }
  if (text.includes('وضوء') || text.includes('صلاه') || text.includes('طهاره') || text.includes('حيض') || text.includes('حائض') || text.includes('مصحف') || text.includes('ريح') || text.includes('سجود') || text.includes('ركوع') || text.includes('قبله') || text.includes('جورب')) {
    return 'worship';
  }
  return 'mindset';
}

/**
 * Dynamically derives the 3-Layer Fatwa Disentangler Lens metadata based on meaning.
 */
function deriveDynamicLensMetadata(
  query: string,
  answer: string,
  category: 'worship' | 'social' | 'food' | 'mindset'
): {
  coreRuleAr: string;
  coreRuleEn: string;
  hadithOrAyahAr: string;
  hadithOrAyahEn: string;
} {
  const norm = normalizeText(query);

  // 1. Quran Origin / Authorship Misconceptions
  if (norm.includes('كتبه') || norm.includes('الفه') || norm.includes('تاليف') || norm.includes('اخترعه') || norm.includes('كلام الله')) {
    return {
      coreRuleAr: 'أصل عقدي قطعي: «القرآن كلام الله المعجز المنزّل بالحق، لا يأتيه الباطل من بين يديه ولا من خلفه»',
      coreRuleEn: 'Core Creedal Principle: "The Quran is the uncreated, revealed Word of Allah, free from human fabrication"',
      hadithOrAyahAr: '﴿قُل لَّئِنِ اجْتَمَعَتِ الْإِنسُ وَالْجِنُّ عَلَىٰ أَن يَأْتُوا بِمِثْلِ هَٰذَا الْقُرْآنِ لَا يَأْتُونَ بِمِثْلِهِ﴾ [الإسراء: 88]',
      hadithOrAyahEn: '"Say: If mankind and the jinn were to come together to produce the like of this Quran, they could not produce the like of it" [17:88]',
    };
  }

  // 2. Spread of Islam / Sword Misconceptions
  if (norm.includes('سيف') || norm.includes('انتشر') || norm.includes('اكراه') || norm.includes('اجبار')) {
    return {
      coreRuleAr: 'محكم التنزيل: «لَا إِكْرَاهَ فِي الدِّينِ، والإيمان تصديق قلبي حرّ»',
      coreRuleEn: 'Divine Principle: "There is no compulsion in religion; true faith is a willing conviction"',
      hadithOrAyahAr: '﴿لَا إِكْرَاهَ فِي الدِّينِ ۖ قَد تَّبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ﴾ [البقرة: 256]',
      hadithOrAyahEn: '"There shall be no compulsion in [acceptance of] the religion. The right course has become clear from the wrong" [2:256]',
    };
  }

  // 3. Women/Purity & Disputed Rulings (e.g., Menses & Touching/Reading Mus'haf)
  if (norm.includes('حائض') || norm.includes('حيض') || norm.includes('مس المصحف') || norm.includes('لمس المصحف')) {
    return {
      coreRuleAr: 'قاعدة فقهية جامعة: «لا يُنكر المختلف فيه، والرخص الشرعية وتطبيقات الهواتف ترفع الحرج عن المرأة»',
      coreRuleEn: 'Fiqh Maxim: "No condemnation in valid differences of opinion; digital screens and concessions lift difficulty"',
      hadithOrAyahAr: '«إِنَّ الدِّينَ يُسْرٌ، وَلَنْ يُشَادَّ الدِّينَ أَحَدٌ إِلَّا غَلَبَهُ» [صحيح البخاري]',
      hadithOrAyahEn: '"Indeed, the religion is ease, and none overburdens themselves with it but it overcomes them." [Sahih Bukhari]',
    };
  }

  // 4. Waswas, Doubts in Purity, Wudu, Prayer Validity
  if (norm.includes('شك') || norm.includes('وسواس') || norm.includes('شاك') || norm.includes('ريح') || norm.includes('وضوء') || norm.includes('طهاره')) {
    return {
      coreRuleAr: 'قاعدة فقهية كبرى: «اليقين لا يزول بالشك»',
      coreRuleEn: 'Major Maxim: "Certainty is not overruled by doubt"',
      hadithOrAyahAr: '«فَلَا يَنْصَرِفْ حَتَّى يَسْمَعَ صَوْتًا أَوْ يَجِدَ رِيحًا» [صحيح البخاري]',
      hadithOrAyahEn: '"He should not leave prayer until he hears a sound or perceives an odor." [Sahih Bukhari]',
    };
  }

  // 5. Food Inquiries & Over-investigation
  if (category === 'food' || norm.includes('مطعم') || norm.includes('اكل') || norm.includes('جبن')) {
    return {
      coreRuleAr: 'قاعدة فقهية: «الأصل في الأعيان والأطعمة الإباحة والحلّ، واليقين لا يزول بالظن»',
      coreRuleEn: 'Jurisprudential Maxim: "The original status of food and items is permissibility"',
      hadithOrAyahAr: '«سَمُّوا اللَّهَ عَلَيْهِ وَكُلُوا» [صحيح البخاري]',
      hadithOrAyahEn: '"Mention Allah’s name and eat" [Sahih Bukhari]',
    };
  }

  // 6. Social & Family Relations
  if (category === 'social' || norm.includes('والد') || norm.includes('اهل')) {
    return {
      coreRuleAr: 'أمر قرآني محكم: «وَصَاحِبْهُمَا فِي الدُّنْيَا مَعْرُوفًا»',
      coreRuleEn: 'Divine Command: "Accompany them in this world with kindness"',
      hadithOrAyahAr: '«إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الْأَخْلَاقِ»',
      hadithOrAyahEn: '"I was only sent to perfect good character."',
    };
  }

  // 7. General Universal Ease & Removing Hardship
  return {
    coreRuleAr: 'قاعدة كلية كبرى: «المشقة تجلب التيسير، والأمر إذا ضاق اتسع»',
    coreRuleEn: 'Major Universal Maxim: "Hardship brings ease, and constriction invites latitude"',
    hadithOrAyahAr: '﴿يُرِيدُ اللَّهُ بِكُمُ الْيُسْرَ وَلَا يُرِيدُ بِكُمُ الْعُسْرَ﴾ [البقرة: 185]',
    hadithOrAyahEn: '"Allah intends for you ease and does not intend for you hardship" [2:185]',
  };
}

/**
 * Loads all saved user sanctuary records from localStorage safely across browser and SSR/tests.
 */
export function loadSavedFatwaSanctuaryRecords(): VerificationQA[] {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return [];
    }
    const raw = localStorage.getItem(FATWA_SANCTUARY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (err) {
    console.warn('Error loading fatwa sanctuary records from localStorage:', err);
  }
  return [];
}

/**
 * Saves a new deconstructed question to persistent storage if not already present.
 */
export function saveFatwaSanctuaryRecord(qa: VerificationQA): boolean {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return true; // Virtual success in test environments
    }
    const existing = loadSavedFatwaSanctuaryRecords();
    const newNormKey = normalizeText(qa.queryAr);

    // Check for duplicates by ID or normalized query text
    const alreadyExists = existing.some(
      (item) => item.id === qa.id || normalizeText(item.queryAr) === newNormKey
    );

    if (alreadyExists) {
      return false; // Duplicate prevented
    }

    const updated = [qa, ...existing];
    // Keep reasonable max size (up to 100 entries)
    const trimmed = updated.slice(0, 100);
    localStorage.setItem(FATWA_SANCTUARY_STORAGE_KEY, JSON.stringify(trimmed));
    return true;
  } catch (err) {
    console.warn('Error saving fatwa sanctuary record:', err);
    return false;
  }
}

/**
 * Automatically evaluates whether a question contains a doubt/misconception,
 * and if so, applies the 3-Layer Fatwa Disentangler Lens and persists it.
 *
 * If it is an ordinary question with no doubt/misconception, returns null without saving.
 */
export function processAndSaveFatwaSanctuaryQuestion(
  query: string,
  answerText: string,
  profile?: UserPersonalizationProfile,
  lang: string = 'ar'
): VerificationQA | null {
  if (!isDoubtOrMisconceptionQuestion(query, answerText)) {
    return null;
  }

  const category = categorizeQuestionDomain(query, answerText);
  const metadata = deriveDynamicLensMetadata(query, answerText, category);

  // Clean answer text for display
  const cleanAnswer = answerText
    .replace(/^أهلاً بك.*?🌿\s*/s, '')
    .trim();

  const id = `usr-sanctuary-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  const newRecord: VerificationQA = {
    id,
    category,
    queryAr: query.trim(),
    queryEn: query.trim(),
    answerAr: cleanAnswer || answerText,
    answerEn: cleanAnswer || answerText,
    coreRuleAr: metadata.coreRuleAr,
    coreRuleEn: metadata.coreRuleEn,
    hadithOrAyahAr: metadata.hadithOrAyahAr,
    hadithOrAyahEn: metadata.hadithOrAyahEn,
    isUserSubmitted: true,
    createdAt: Date.now(),
  };

  saveFatwaSanctuaryRecord(newRecord);
  return newRecord;
}
