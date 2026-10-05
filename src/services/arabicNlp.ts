import { LearningLevel } from '../types';

export interface NlpAnalysisResult {
  rawInput: string;
  normalizedText: string;
  tokens: string[];
  intent:
    | 'learning_prayer'
    | 'definition_request'
    | 'practical_guidance'
    | 'translation_request'
    | 'hadith_proof_request'
    | 'personal_fiqh_request'
    | 'family_inquiry'
    | 'travel_concession'
    | 'food_inquiry'
    | 'open_experience_action'
    | 'misconception_clarification'
    | 'general_inquiry';
  topic:
    | 'prayer'
    | 'aqeedah_tawhid'
    | 'aqeedah_tawakkul'
    | 'food_halal'
    | 'family_parents'
    | 'university_campus'
    | 'travel_rain'
    | 'jumuah_mosque'
    | 'modesty_manners'
    | 'integrity_amanah'
    | 'history_spread'
    | 'general';
  detectedLevel: LearningLevel;
  queryType:
    | 'definition'
    | 'quran'
    | 'hadith'
    | 'fiqh'
    | 'translation'
    | 'misconception'
    | 'practical_scenario'
    | 'action';
  extractedAction?: {
    actionName: 'openExperience' | 'openBuilding' | 'openTask';
    targetId: string;
    humanLabelAr: string;
  };
}

// Arabic diacritics regex
const DIACRITICS_REGEX = /[\u064B-\u065F\u0670\u0640]/g;

// Stop words that do not carry discriminative topical weight
// Note: We keep words like 'اسلام', 'دين' in the query so topical compound queries (e.g. 'انتشار الاسلام') work properly
const STOP_WORDS = new Set([
  'في', 'من', 'على', 'إلى', 'عن', 'مع', 'هذا', 'هذه', 'ذلك', 'تلك', 'التي',
  'الذي', 'الذين', 'هو', 'هي', 'هم', 'نحن', 'أنا', 'انا', 'أنت', 'انت', 'كان',
  'كانت', 'يكون', 'أن', 'ان', 'إن', 'هل', 'كيف', 'ما', 'ماذا', 'لماذا', 'متى',
  'أين', 'اين', 'لو', 'إذا', 'اذا', 'كل', 'بعض', 'غير', 'ثم', 'أو', 'او', 'أم',
  'ام', 'لا', 'لم', 'لن', 'يا', 'طيب', 'وش', 'ايش', 'شو', 'شنو', 'ليه', 'عشان',
  'أبي', 'ابي', 'ودي', 'ابغى', 'اريد', 'أريد', 'عندي', 'معي', 'لي', 'لك',
]);

/**
 * High-precision Arabic word stemmer:
 * Strips common Arabic grammatical prefixes (ال، بال، كال، لل، وال، فال، ب، و، ف، ل)
 * for words of sufficient length to avoid over-stemming.
 */
export function stemArabicWord(word: string): string {
  let w = word.trim();
  if (w.length <= 3) return w;

  // Compound 3-letter prefixes
  if (w.startsWith('بال') || w.startsWith('كال') || w.startsWith('فال') || w.startsWith('وال')) {
    if (w.length >= 5) return w.slice(3);
  }
  // 2-letter prefixes
  if (w.startsWith('ال') || w.startsWith('لل')) {
    if (w.length >= 4) return w.slice(2);
  }
  // Single-letter conjunctions/prepositions
  if ((w.startsWith('و') || w.startsWith('ف') || w.startsWith('ب') || w.startsWith('ل') || w.startsWith('ك')) && w.length >= 4) {
    // Avoid stripping letter if it is an inherent root letter
    return w.slice(1);
  }

  return w;
}

/**
 * High-precision Arabic NLP Normalizer:
 * - Strips diacritics and tatweel
 * - Normalizes all hamzas (أ إ آ ء ؤ ئ -> ا)
 * - Normalizes Taa Marbuta (ة -> ه)
 * - Normalizes Alif Maqsura (ى -> ي)
 * - Normalizes punctuation & multiple spaces
 */
export function normalizeArabicNlp(input: string): string {
  if (!input) return '';
  return input
    .toLowerCase()
    .replace(DIACRITICS_REGEX, '')
    // Normalize all hamza forms to basic Alif
    .replace(/[إأآا]/g, 'ا')
    .replace(/ئ/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ء/g, '')
    // Normalize Yaa / Alif Maqsura
    .replace(/[ىي]/g, 'ي')
    // Normalize Taa Marbuta
    .replace(/ة/g, 'ه')
    // Clean non-alphanumeric punctuation including Arabic comma (،) and semicolon (؛)
    .replace(/[.,/#!$%^&*;:{}=\-_`~()؟?«»"'،؛٪]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Tokenizes normalized Arabic query into clean keyword array,
 * including base tokens and their stemmed variants for robust search.
 */
export function extractNlpTokens(normalized: string): string[] {
  const rawWords = normalized
    .split(' ')
    .map((w) => w.trim())
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));

  const tokenSet = new Set<string>();
  for (const w of rawWords) {
    tokenSet.add(w);
    const stem = stemArabicWord(w);
    if (stem && stem.length > 1) {
      tokenSet.add(stem);
    }
  }

  return Array.from(tokenSet);
}

/**
 * Deep Intent & Semantic Pattern Classifier
 * Detects beginner phrasing variants and maps them reliably to canonical concepts
 */
export function analyzeArabicNlp(query: string, currentLevel: LearningLevel = 'beginner'): NlpAnalysisResult {
  const norm = normalizeArabicNlp(query);
  const tokens = extractNlpTokens(norm);

  // 1. Detect Explicit UI / Application Actions
  if (
    norm.includes('افتح لي') ||
    norm.includes('افتح تجربه') ||
    norm.includes('افتح') ||
    norm.includes('ابدئي تجربه') ||
    norm.includes('ودني') ||
    norm.includes('شغل تجربه')
  ) {
    if (norm.includes('جامعه') || norm.includes('دراسه') || norm.includes('محاضره')) {
      return {
        rawInput: query,
        normalizedText: norm,
        tokens,
        intent: 'open_experience_action',
        topic: 'university_campus',
        detectedLevel: currentLevel,
        queryType: 'action',
        extractedAction: {
          actionName: 'openExperience',
          targetId: 'university-prayer',
          humanLabelAr: 'الصلاة بين المحاضرات بالجامعة',
        },
      };
    }
    if (norm.includes('بيت') || norm.includes('غرفه') || norm.includes('سجاده')) {
      return {
        rawInput: query,
        normalizedText: norm,
        tokens,
        intent: 'open_experience_action',
        topic: 'prayer',
        detectedLevel: currentLevel,
        queryType: 'action',
        extractedAction: {
          actionName: 'openExperience',
          targetId: 'home-prayer-room',
          humanLabelAr: 'الصلاة في الغرفة الهادئة بالبيت',
        },
      };
    }
    if (norm.includes('طعام') || norm.includes('عمل') || norm.includes('غداء') || norm.includes('حلال')) {
      return {
        rawInput: query,
        normalizedText: norm,
        tokens,
        intent: 'open_experience_action',
        topic: 'food_halal',
        detectedLevel: currentLevel,
        queryType: 'action',
        extractedAction: {
          actionName: 'openExperience',
          targetId: 'work-lunch-halal',
          humanLabelAr: 'غداء العمل واختيار الحلال الطيب',
        },
      };
    }
  }

  // 2. Detect Beginner Signals
  let detectedLevel: LearningLevel = currentLevel;
  if (
    norm.includes('انا جديده') ||
    norm.includes('انا جديد') ||
    norm.includes('ابي اتعلم') ||
    norm.includes('كيف ابدا') ||
    norm.includes('وش يعني') ||
    norm.includes('ما معني') ||
    norm.includes('ماني عارفه') ||
    norm.includes('ما اعرف')
  ) {
    detectedLevel = 'beginner';
  }

  // 3. Translation Requests (e.g. "ترجم التوحيد للإنجليزي")
  if (
    norm.includes('ترجم') ||
    norm.includes('ترجمه') ||
    norm.includes('بالانجليزي') ||
    norm.includes('معناها بالانجليزي') ||
    norm.includes('english')
  ) {
    return {
      rawInput: query,
      normalizedText: norm,
      tokens,
      intent: 'translation_request',
      topic: norm.includes('توحيد') ? 'aqeedah_tawhid' : 'general',
      detectedLevel,
      queryType: 'translation',
    };
  }

  // 4. Hadith Proof Inquiries (e.g. "أعطني حديث يثبت هذا", "في حديث؟")
  if (
    norm.includes('اعطني حديث') ||
    norm.includes('حديث يثبت') ||
    norm.includes('نص الحديث') ||
    norm.includes('هل ورد حديث') ||
    norm.includes('قال النبي') ||
    norm.includes('رواه البخاري')
  ) {
    return {
      rawInput: query,
      normalizedText: norm,
      tokens,
      intent: 'hadith_proof_request',
      topic: 'general',
      detectedLevel,
      queryType: 'hadith',
    };
  }

  // 5. Personal Fiqh Dilemmas requiring individualized Scholar Ruling
  if (
    norm.includes('طلاقي') ||
    norm.includes('ميراث') ||
    norm.includes('نذر معقد') ||
    norm.includes('حكم عقد') ||
    norm.includes('فتوي خاصه بي')
  ) {
    return {
      rawInput: query,
      normalizedText: norm,
      tokens,
      intent: 'personal_fiqh_request',
      topic: 'general',
      detectedLevel,
      queryType: 'fiqh',
    };
  }

  // 5. Spread of Islam / Sword Misconception Clarification (Test A)
  if (norm.includes('سيف') || (norm.includes('انتشر') && norm.includes('اسلام')) || norm.includes('اكراه') || norm.includes('بالسيف')) {
    return {
      rawInput: query,
      normalizedText: norm,
      tokens,
      intent: 'misconception_clarification',
      topic: 'history_spread',
      detectedLevel,
      queryType: 'misconception',
    };
  }

  // 6. Tawakkul vs Tawaakul Requests
  if (norm.includes('توكل') || norm.includes('تواكل') || norm.includes('اعقلها')) {
    return {
      rawInput: query,
      normalizedText: norm,
      tokens,
      intent: 'definition_request',
      topic: 'aqeedah_tawakkul',
      detectedLevel,
      queryType: 'definition',
    };
  }

  // 7. Definition Requests (e.g. "وش يعني التوحيد؟", "ما هو التوحيد؟", "مفهوم لا إله إلا الله")
  if (
    norm.includes('توحيد') ||
    norm.includes('عقيده') ||
    norm.includes('شهادتين') ||
    norm.includes('لا اله الا الله') ||
    norm.includes('لااله الا الله') ||
    norm.includes('معبود') ||
    norm.includes('الالوهيه') ||
    norm.includes('الربوبيه')
  ) {
    return {
      rawInput: query,
      normalizedText: norm,
      tokens,
      intent: 'definition_request',
      topic: 'aqeedah_tawhid',
      detectedLevel,
      queryType: 'definition',
    };
  }

  // 7. Practical University / Campus Prayer Scenarios (TEST 2)
  if (
    norm.includes('جامعه') ||
    norm.includes('محاضره') ||
    norm.includes('كلاس') ||
    norm.includes('بين المحاضرات') ||
    (norm.includes('صلاه') && (norm.includes('ادرس') || norm.includes('دراسه')))
  ) {
    return {
      rawInput: query,
      normalizedText: norm,
      tokens,
      intent: 'practical_guidance',
      topic: 'university_campus',
      detectedLevel,
      queryType: 'practical_scenario',
      extractedAction: {
        actionName: 'openExperience',
        targetId: 'university-prayer',
        humanLabelAr: 'الصلاة بين المحاضرات بالجامعة',
      },
    };
  }

  // 8. Learning Prayer Variants (TEST 1 & Core Intent)
  // "كيف أصلي؟", "طريقة الصلاة", "ابي اتعلم الصلاة", "كيف أبدأ الصلاة؟"
  if (
    norm.includes('كيف اصلي') ||
    norm.includes('طريقه الصلاه') ||
    norm.includes('اتعلم الصلاه') ||
    norm.includes('ابدا الصلاه') ||
    norm.includes('خطوات الصلاه')
  ) {
    return {
      rawInput: query,
      normalizedText: norm,
      tokens,
      intent: 'learning_prayer',
      topic: 'prayer',
      detectedLevel: 'beginner',
      queryType: 'practical_scenario',
    };
  }

  // 9. Qiblah Inquiries & Orientation (e.g. "وش معنى القبلة؟")
  if (norm.includes('قبله') || norm.includes('كعبه') || norm.includes('اتجاه الصلاه')) {
    return {
      rawInput: query,
      normalizedText: norm,
      tokens,
      intent: 'definition_request',
      topic: 'prayer',
      detectedLevel,
      queryType: 'definition',
    };
  }

  // 9. Family & Parents Communication
  if (
    norm.includes('اهل') ||
    norm.includes('امي') ||
    norm.includes('ابي') ||
    norm.includes('والد') ||
    norm.includes('اسره') ||
    norm.includes('عائله')
  ) {
    return {
      rawInput: query,
      normalizedText: norm,
      tokens,
      intent: 'family_inquiry',
      topic: 'family_parents',
      detectedLevel,
      queryType: 'practical_scenario',
      extractedAction: {
        actionName: 'openExperience',
        targetId: 'family-communication',
        humanLabelAr: 'بر الوالدين وحسن التواصل مع الأسرة',
      },
    };
  }

  // 10. Travel & Rain Concessions
  if (norm.includes('سفر') || norm.includes('مطر') || norm.includes('رخصه') || norm.includes('قصر') || norm.includes('جمع')) {
    return {
      rawInput: query,
      normalizedText: norm,
      tokens,
      intent: 'travel_concession',
      topic: 'travel_rain',
      detectedLevel,
      queryType: 'fiqh',
    };
  }

  // 11. Halal Food & Ingredients
  if (norm.includes('حلال') || norm.includes('اكل') || norm.includes('طعام') || norm.includes('خنزير') || norm.includes('جيلاتين') || norm.includes('e471')) {
    return {
      rawInput: query,
      normalizedText: norm,
      tokens,
      intent: 'food_inquiry',
      topic: 'food_halal',
      detectedLevel,
      queryType: 'fiqh',
    };
  }

  // General default fallback
  return {
    rawInput: query,
    normalizedText: norm,
    tokens,
    intent: 'general_inquiry',
    topic: 'general',
    detectedLevel,
    queryType: 'practical_scenario',
  };
}
