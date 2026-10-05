import { DailyTask, Language, LearningLevel, UserPersonalizationProfile } from '../types';
import { loadUserPersonalization } from './userAdaptation';

export interface SourcedExperienceRecommendation {
  experienceId: string;
  titleAr: string;
  titleEn: string;
  reasonAr: string;
  reasonEn: string;
  relevantTopic: string;
  groundedSourceIds: string[];
  suggestedDifficulty: LearningLevel;
  actionLabelAr: string;
  actionLabelEn: string;
}

export interface AdaptiveRecommendation {
  type: 'next_task' | 'sakinah_tip' | 'reflection' | 'milestone' | 'recommended_experience';
  titleAr: string;
  titleEn: string;
  detailAr: string;
  detailEn: string;
  actionLabelAr?: string;
  actionLabelEn?: string;
  actionType?: 'open_task' | 'open_experience' | 'reflect' | 'breathe' | 'scanner';
  targetTaskId?: string;
  targetExperienceId?: string;
  priority: 'high' | 'medium' | 'gentle';
  badgeAr: string;
  badgeEn: string;
  whyRecommendedAr?: string;
  whyRecommendedEn?: string;
}

/**
 * Deterministic, Context-Aware Experience Recommendation
 * (Implements Requirement 7 & Acceptance TEST 7)
 */
export function getRecommendedExperienceForUser(
  profile?: UserPersonalizationProfile
): SourcedExperienceRecommendation {
  const user = profile || loadUserPersonalization();
  const isFemale = user.preferredAddressing === 'female';
  const completed = user.completedExperiences;
  const recentQ = (user.recentQuestions || []).join(' ').toLowerCase();

  // TEST 7: User completed university-prayer and asks about family situations
  const hasCompletedUni = completed.includes('university-prayer');
  const hasFamilyInterest =
    recentQ.includes('اهل') ||
    recentQ.includes('امي') ||
    recentQ.includes('ابي') ||
    recentQ.includes('والد') ||
    recentQ.includes('اسره') ||
    recentQ.includes('عائله');

  if (hasCompletedUni && hasFamilyInterest) {
    const isFamilyDone = completed.includes('family-communication');
    return {
      experienceId: isFamilyDone ? 'honoring-parents' : 'family-communication',
      titleAr: isFamilyDone ? 'بر الوالدين وخدمتهما بإحسان' : 'حسن التواصل مع الأسرة والوالدين',
      titleEn: isFamilyDone ? 'Devotion to Parents' : 'Family Communication & Kindness',
      reasonAr: isFemale
        ? 'بما أنكِ أتممتِ تجربة الصلاة في الجامعة وسألتِ مؤخراً عن الأسرة، يقترح رفيق تجربة بر الوالدين لترسيخ المودة وخفض الجناح.'
        : 'بما أنك أتممت تجربة الجامعة وسألت مؤخراً عن الأسرة، يقترح رفيق تجربة بر الوالدين لترسيخ المودة.',
      reasonEn:
        'Since you completed the University Prayer experience and recently asked about family, Rafiq recommends the Family Kindness experience.',
      relevantTopic: 'family_parents',
      groundedSourceIds: ['src-family-parents-kindness', 'src-hadith-beloved-deeds-parents'],
      suggestedDifficulty: user.learningLevel,
      actionLabelAr: isFemale ? 'ابدئي تجربة الأسرة' : 'ابدأ تجربة الأسرة',
      actionLabelEn: 'Start Family Experience',
    };
  }

  // TEST 2: User asked about university/campus and hasn't finished it
  const hasUniInterest =
    recentQ.includes('جامعه') ||
    recentQ.includes('محاضره') ||
    recentQ.includes('كلاس') ||
    recentQ.includes('دراسه');

  if (hasUniInterest && !hasCompletedUni) {
    return {
      experienceId: 'university-prayer',
      titleAr: 'الصلاة بين المحاضرات بالجامعة',
      titleEn: 'Prayer Between Lectures on Campus',
      reasonAr: isFemale
        ? 'بما أنكِ سألتِ قبل قليل عن الصلاة في الجامعة ولم تجرّبي تجربة الجامعة بعد، يقترح رفيق خوضها لتعلم تحديد البقعة الطاهرة بسهولة.'
        : 'بما أنك سألت عن الصلاة بالجامعة ولم تجربها بعد، يقترح رفيق خوضها لتعلم التطبيق بيسر.',
      reasonEn:
        'Since you recently asked about campus prayer and have not tried the University experience yet, Rafiq suggests practicing it now.',
      relevantTopic: 'university_campus',
      groundedSourceIds: ['src-fiqh-university-prayer', 'src-hadith-deen-yusr'],
      suggestedDifficulty: user.learningLevel,
      actionLabelAr: isFemale ? 'ابدئي تجربة الجامعة' : 'ابدأ تجربة الجامعة',
      actionLabelEn: 'Start Campus Experience',
    };
  }

  // Default day-by-day progression
  if (!completed.includes('home-prayer-room')) {
    return {
      experienceId: 'home-prayer-room',
      titleAr: 'الصلاة في الغرفة الهادئة بالبيت',
      titleEn: 'Prayer in Quiet Bedroom',
      reasonAr: isFemale
        ? 'خطوة التأسيس الأولى في اليوم الأول: تعلم تهيئة مكان طاهر وهادئ للصلاة في غرفتكِ بسكينة.'
        : 'خطوة التأسيس الأولى: تعلم تهيئة مكان طاهر وهادئ للصلاة بغرفتك بسكينة.',
      reasonEn: 'Foundational first step: Setting up a serene, clean space for daily prayer at home.',
      relevantTopic: 'prayer',
      groundedSourceIds: ['src-quran-prayer-time', 'src-tafsir-prayer-serenity'],
      suggestedDifficulty: 'beginner',
      actionLabelAr: isFemale ? 'ابدئي تجربة الغرفة' : 'ابدأ تجربة الغرفة',
      actionLabelEn: 'Start Bedroom Experience',
    };
  }

  if (!completed.includes('work-lunch-halal')) {
    return {
      experienceId: 'work-lunch-halal',
      titleAr: 'غداء العمل واختيار الحلال الطيب',
      titleEn: 'Workplace Lunch & Halal Choices',
      reasonAr: isFemale
        ? 'ممارسة اجتماعية مهمة: كيف تختارين طعامكِ الطيب بثقة ودون حرج بين زملاء العمل.'
        : 'ممارسة اجتماعية مهمة: كيف تختار طعامك بثقة بين زملاء العمل.',
      reasonEn: 'Practical social skill: Gracefully selecting wholesome halal dishes with work peers.',
      relevantTopic: 'food_halal',
      groundedSourceIds: ['src-food-halal-principles'],
      suggestedDifficulty: user.learningLevel,
      actionLabelAr: isFemale ? 'ابدئي تجربة العمل' : 'ابدأ تجربة العمل',
      actionLabelEn: 'Start Lunch Experience',
    };
  }

  return {
    experienceId: 'first-jumuah',
    titleAr: 'صلاة الجمعة وآداب المسجد',
    titleEn: 'Friday Congregation & Mosque Manners',
    reasonAr: 'استكشاف بهجة الجمعة وعيد الأسبوع في بيت من بيوت الله.',
    reasonEn: 'Discovering the communal tranquility of Friday prayer.',
    relevantTopic: 'jumuah_mosque',
    groundedSourceIds: ['src-jumuah-mosque-etiquette'],
    suggestedDifficulty: user.learningLevel,
    actionLabelAr: 'استكشاف الجمعة',
    actionLabelEn: 'Explore Friday',
  };
}

/**
 * Generates Adaptive Recommendations for Proactive HUD & Dashboard
 */
export function generateAdaptiveRecommendations(
  currentDay: number,
  completedDays: number[],
  completedTasks: string[],
  tranquilityScore: number,
  allTasks: DailyTask[],
  lang: Language = 'ar',
  userProfile?: UserPersonalizationProfile
): AdaptiveRecommendation[] {
  const recommendations: AdaptiveRecommendation[] = [];
  const profile = userProfile || loadUserPersonalization();
  const isFemale = profile.preferredAddressing === 'female';

  // 1. Recommended Experience with "لماذا اقترحها أنس؟"
  const expRec = getRecommendedExperienceForUser(profile);
  recommendations.push({
    type: 'recommended_experience',
    titleAr: expRec.titleAr,
    titleEn: expRec.titleEn,
    detailAr: expRec.reasonAr,
    detailEn: expRec.reasonEn,
    actionLabelAr: expRec.actionLabelAr,
    actionLabelEn: expRec.actionLabelEn,
    actionType: 'open_experience',
    targetExperienceId: expRec.experienceId,
    priority: 'high',
    badgeAr: isFemale ? 'التجربة المقترحة لكِ' : 'التجربة المقترحة لك',
    badgeEn: 'Recommended Experience',
    whyRecommendedAr: expRec.reasonAr,
    whyRecommendedEn: expRec.reasonEn,
  });

  // 2. Next best daily task
  const currentDayTask = allTasks.find((t) => t.day === currentDay);
  if (currentDayTask && !completedTasks.includes(currentDayTask.taskId)) {
    recommendations.push({
      type: 'next_task',
      titleAr: `خطوتك العملية لليوم ${currentDay}: ${currentDayTask.title.ar}`,
      titleEn: `Your Action Step for Day ${currentDay}: ${currentDayTask.title.en}`,
      detailAr: isFemale
        ? `لديك مهمة تطبيقية في بيئة اليوم تثبت ما تعلمته وتكسبك سكينة وطمأنينة. انقري لإنجازها.`
        : `لديك مهمة تطبيقية في بيئة اليوم تثبت ما تعلمته وتكسبك سكينة وطمأنينة. انقر لإنجازها.`,
      detailEn: `An action step is ready in today's environment to solidify your practice with peace. Click to open and complete.`,
      actionLabelAr: 'فتح المهمة الآن',
      actionLabelEn: 'Open Task Now',
      actionType: 'open_task',
      targetTaskId: currentDayTask.taskId,
      priority: 'high',
      badgeAr: 'المهمة الأنسب الآن',
      badgeEn: 'Recommended Task',
    });
  }

  // 3. Sakinah Reflection based on Score
  if (tranquilityScore < 50) {
    recommendations.push({
      type: 'sakinah_tip',
      titleAr: 'لحظة هدوء واستعادة السكينة 🌿',
      titleEn: 'A Moment for Calm & Restoring Serenity 🌿',
      detailAr: isFemale
        ? 'مؤشر السكينة يحتاج لفتة رفق. تذكري وصية النبي ﷺ: "إن الرفق لا يكون في شيء إلا زانه". خذي نفساً عميقاً.'
        : 'مؤشر السكينة يحتاج لفتة رفق. تذكر وصية النبي ﷺ: "إن الرفق لا يكون في شيء إلا زانه". خذ نفساً عميقاً.',
      detailEn:
        'Your Serenity index invites gentle pacing. Remember the Prophetic reminder: "Gentleness beautifies everything." Take a slow breath.',
      actionLabelAr: 'تدبر مع رفيق',
      actionLabelEn: 'Reflect with Rafiq',
      actionType: 'reflect',
      priority: 'high',
      badgeAr: 'بلسم القلب',
      badgeEn: 'Heart Balm',
    });
  }

  return recommendations;
}
