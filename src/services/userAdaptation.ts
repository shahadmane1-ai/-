import { AddressingPreference, LearningLevel, UserPersonalizationProfile } from '../types';

const STORAGE_KEY = 'rafeeq_user_adaptation_v2';

export const DEFAULT_USER_PROFILE: UserPersonalizationProfile = {
  preferredLanguage: 'ar',
  preferredAddressing: 'female', // Default targeted female Arabic addressing as requested
  learningLevel: 'beginner',
  interests: ['الصلاة اليومية', 'السكينة واليقين', 'الطعام الحلال', 'العلاقات الأسرية'],
  completedExperiences: [],
  completedTasks: [],
  currentDay: 1,
  currentExperience: 'home-prayer-room',
  preferredInteractionStyle: 'guided',
  difficultTopics: [],
  recentQuestions: [],
  recentChoices: [],
  confidenceSignals: {
    prayer: 40,
    halal_food: 60,
    family: 50,
  },
  accessibilityPreferences: {
    textScale: 'normal',
    soundEnabled: true,
  },
};

/**
 * Loads the user personalization profile from persistent storage,
 * keeping the explicitly saved gender in rafeeq_user_profile as the single source of truth.
 */
export function loadUserPersonalization(): UserPersonalizationProfile {
  let addressingFromUserProfile: AddressingPreference | undefined = undefined;
  try {
    const rawUserProfile = localStorage.getItem('rafeeq_user_profile');
    if (rawUserProfile) {
      const parsed = JSON.parse(rawUserProfile);
      if (parsed.gender === 'female' || parsed.gender === 'male') {
        addressingFromUserProfile = parsed.gender;
      }
    }
  } catch {}

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const profile = { ...DEFAULT_USER_PROFILE, ...parsed };
      if (addressingFromUserProfile) {
        profile.preferredAddressing = addressingFromUserProfile;
      }
      return profile;
    }
  } catch {
    // Fallback to default
  }
  const defaultProfile = { ...DEFAULT_USER_PROFILE };
  if (addressingFromUserProfile) {
    defaultProfile.preferredAddressing = addressingFromUserProfile;
  }
  return defaultProfile;
}

/**
 * Saves the user personalization profile to persistent storage and syncs rafeeq_user_profile
 */
export function saveUserPersonalization(profile: UserPersonalizationProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    if (profile.preferredAddressing === 'female' || profile.preferredAddressing === 'male') {
      const rawUserProfile = localStorage.getItem('rafeeq_user_profile');
      if (rawUserProfile) {
        try {
          const parsed = JSON.parse(rawUserProfile);
          parsed.gender = profile.preferredAddressing;
          localStorage.setItem('rafeeq_user_profile', JSON.stringify(parsed));
        } catch {}
      }
    }
  } catch (err) {
    console.warn('Failed to persist user profile:', err);
  }
}

/**
 * Resets user personalization profile to pristine state
 */
export function resetUserPersonalization(): UserPersonalizationProfile {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  return { ...DEFAULT_USER_PROFILE };
}

/**
 * Natural Arabic grammatical inflection helper for female / male / neutral addressing.
 * Adapts phrasing naturally based strictly on the explicitly selected gender.
 */
export function inflectArabic(text: string, addressing: AddressingPreference): string {
  if (!text) return '';
  if (addressing === 'neutral') {
    return text
      .replace(/أهلًا بكِ|أهلاً بكِ|أهلًا بكَ|أهلاً بكَ/g, 'أهلاً بك')
      .replace(/عزيزتي|عزيزي/g, 'يا رفيق السكينة')
      .replace(/يا رفيقتي|يا رفيقي/g, 'يا رفيق السكينة')
      .replace(/يا أختي|يا أخي/g, 'يا رفيق السكينة')
      .replace(/يمكنكِ|يمكنكَ/g, 'يمكنك')
      .replace(/إذا أردتِ|إذا أردتَ/g, 'إذا أردت')
      .replace(/تفضلي|تفضلْ/g, 'تفضل')
      .replace(/ابدئي|ابدأْ/g, 'ابدأ');
  }

  if (addressing === 'female') {
    return text
      .replace(/أهلًا بكَ|أهلاً بكَ|أهلاً بك\b/g, 'أهلاً بكِ')
      .replace(/يا رفيقي\b/g, 'يا أختي')
      .replace(/يا أخي\b/g, 'يا أختي')
      .replace(/أخي الكريم\b|أخي\b/g, 'أختي الكريمة')
      .replace(/تحب\b/g, 'تحبين')
      .replace(/تقدر\b/g, 'تقدرين')
      .replace(/جرب\b/g, 'جربي')
      .replace(/اسألني\b/g, 'اسأليني')
      .replace(/وضح\b/g, 'وضحي')
      .replace(/اشرح\b/g, 'اشرحي')
      .replace(/تتعلم\b/g, 'تتعلمين')
      .replace(/تتدرب\b/g, 'تتدربين')
      .replace(/ترفع\b/g, 'ترفعين')
      .replace(/تسأل\b/g, 'تسألين')
      .replace(/صلاتك\b/g, 'صلاتكِ')
      .replace(/سؤالك\b/g, 'سؤالكِ')
      .replace(/قصدك\b/g, 'قصدكِ')
      .replace(/لك\b/g, 'لكِ')
      .replace(/معك\b/g, 'معكِ')
      .replace(/عنك\b/g, 'عنكِ')
      .replace(/فيك\b/g, 'فيكِ')
      .replace(/بك\b/g, 'بكِ')
      .replace(/رفيقك\b/g, 'رفيقكِ')
      .replace(/أبشر\b/g, 'أبشري')
      .replace(/انقر\b/g, 'انقري')
      .replace(/تفقد\b/g, 'تفقدي')
      .replace(/ابسط\b/g, 'ابسطي')
      .replace(/تحقق\b/g, 'تحققي')
      .replace(/افتح\b/g, 'افتحي')
      .replace(/قدم\b/g, 'قدمي')
      .replace(/ساعدك\b/g, 'ساعدكِ')
      .replace(/ننصحك\b/g, 'ننصحكِ')
      .replace(/نوصيك\b/g, 'نوصيكِ')
      .replace(/يمكنكَ|يمكنك\b/g, 'يمكنكِ')
      .replace(/إذا أردتَ|إذا أردت\b/g, 'إذا أردتِ')
      .replace(/تشيل هم/g, 'تشيلي هم')
      .replace(/تحدد\b/g, 'تحددين')
      .replace(/بهاتفك\b/g, 'بهاتفكِ')
      .replace(/تفضلْ|تفضل\b/g, 'تفضلي')
      .replace(/ابدأْ|ابدأ\b/g, 'ابدئي')
      .replace(/جربتَ\b/g, 'جربتِ')
      .replace(/اخترتَ\b/g, 'اخترتِ')
      .replace(/سألتَ\b/g, 'سألتِ')
      .replace(/قائلاً/g, 'قائلة');
  }

  // Male
  return text
    .replace(/أهلًا بكِ|أهلاً بكِ/g, 'أهلاً بكَ')
    .replace(/يا رفيقتي\b/g, 'يا أخي')
    .replace(/يا أختي\b/g, 'يا أخي')
    .replace(/أختي الكريمة\b|أختي\b/g, 'أخي الكريم')
    .replace(/تحبين\b/g, 'تحب')
    .replace(/تقدرين\b/g, 'تقدر')
    .replace(/جربي\b/g, 'جرب')
    .replace(/اسأليني\b/g, 'اسألني')
    .replace(/وضحي\b/g, 'وضح')
    .replace(/اشرحي\b/g, 'اشرح')
    .replace(/تتعلمين\b/g, 'تتعلم')
    .replace(/تتدربين\b/g, 'تتدرب')
    .replace(/ترفعين\b/g, 'ترفع')
    .replace(/تسألين\b/g, 'تسأل')
    .replace(/صلاتكِ\b/g, 'صلاتك')
    .replace(/سؤالكِ\b/g, 'سؤالك')
    .replace(/قصدكِ\b/g, 'قصدك')
    .replace(/لكِ\b/g, 'لك')
    .replace(/معكِ\b/g, 'معك')
    .replace(/عنكِ\b/g, 'عنك')
    .replace(/فيكِ\b/g, 'فيك')
    .replace(/بكِ\b|بيكِ\b/g, 'بك')
    .replace(/رفيقكِ\b/g, 'رفيقك')
    .replace(/أبشري\b/g, 'أبشر')
    .replace(/انقري\b/g, 'انقر')
    .replace(/تفقدي\b/g, 'تفقد')
    .replace(/ابسطي\b/g, 'ابسط')
    .replace(/تحققي\b/g, 'تحقق')
    .replace(/افتحي\b/g, 'افتح')
    .replace(/قدمي\b/g, 'قدم')
    .replace(/ساعدكِ\b/g, 'ساعدك')
    .replace(/ننصحكِ\b/g, 'ننصحك')
    .replace(/نوصيكِ\b/g, 'نوصيك')
    .replace(/يمكنكِ\b/g, 'يمكنك')
    .replace(/إذا أردتِ\b/g, 'إذا أردت')
    .replace(/تشيلي هم/g, 'تشيل هم')
    .replace(/تحددين\b/g, 'تحدد')
    .replace(/بهاتفكِ\b/g, 'بهاتفك')
    .replace(/فصلي\b/g, 'فصلِّ')
    .replace(/تفضلي\b/g, 'تفضل')
    .replace(/ابدئي\b/g, 'ابدأ')
    .replace(/جربتِ\b/g, 'جربتَ')
    .replace(/اخترتِ\b/g, 'اخترتَ')
    .replace(/سألتِ\b/g, 'سألتَ')
    .replace(/قائلة\b/g, 'قائلاً');
}

/**
 * Generates Anas's adaptive persona guidelines based on user level and addressing
 */
export function buildAnasPersonaGuidance(profile: UserPersonalizationProfile): {
  salutationAr: string;
  salutationEn: string;
  pedagogicalDirectiveAr: string;
  pedagogicalDirectiveEn: string;
} {
  const isFemale = profile.preferredAddressing === 'female';
  const level = profile.learningLevel;

  let salutationAr = isFemale ? 'أهلاً بكِ يا أختي 🌿' : 'أهلاً بكَ يا أخي 🌿';
  let salutationEn = 'Welcome, dear companion 🌿';

  let pedagogicalDirectiveAr = '';
  let pedagogicalDirectiveEn = '';

  if (level === 'beginner') {
    pedagogicalDirectiveAr =
      'المستخدم في مستوى البدايات (Beginner): اشرح المفاهيم بلغة دارجة ميسرة أولاً قبل ذكر المصطلح الشرعي (مثال: اشرح القبلة بأنها "جهة الكعبة الشريفة التي نتجه إليها في الصلاة" ثم رسخ المصطلح). احرص على تطييب الخاطر وإبراز مبدأ التيسير والرفق.';
    pedagogicalDirectiveEn =
      'User is a beginner: Explain concepts in everyday intuitive language before introducing formal Islamic terminology. Emphasize comfort, gradual progression, and divine ease.';
  } else if (level === 'intermediate') {
    pedagogicalDirectiveAr =
      'المستخدم في مستوى متوسط (Intermediate): استخدم المصطلحات الشرعية المعتمدة بطبيعية مع شرح موجز ومباشر، وقدم أمثلة عملية من الحياة اليومية.';
    pedagogicalDirectiveEn =
      'User is intermediate: Use established Islamic terminology naturally with concise explanations and practical daily situations.';
  } else {
    pedagogicalDirectiveAr =
      'المستخدم في مستوى متقدم (Advanced): قدم تأصيلاً فقهياً مدعوماً بنصوص المصادر المعتمدة وأقوال أهل العلم ومراعاة مذاهب الفقه دون تعصب.';
    pedagogicalDirectiveEn =
      'User is advanced: Provide deeper sourced grounding with verified citations and scholarly context.';
  }

  return {
    salutationAr,
    salutationEn,
    pedagogicalDirectiveAr,
    pedagogicalDirectiveEn,
  };
}

/**
 * Record a user question into recent profile memory
 */
export function recordUserQuestion(question: string): void {
  const profile = loadUserPersonalization();
  const recent = [question, ...profile.recentQuestions.filter((q) => q !== question)].slice(0, 10);
  saveUserPersonalization({ ...profile, recentQuestions: recent });
}

/**
 * Record completed experience into profile memory
 */
export function recordCompletedExperience(experienceId: string): void {
  const profile = loadUserPersonalization();
  if (!profile.completedExperiences.includes(experienceId)) {
    saveUserPersonalization({
      ...profile,
      completedExperiences: [...profile.completedExperiences, experienceId],
    });
  }
}
