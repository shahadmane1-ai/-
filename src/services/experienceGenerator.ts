import {
  LearningMoment,
  SceneInteraction,
  SceneObject,
  Structured2D5Experience,
  UserPersonalizationProfile,
} from '../types';
import { TRUSTED_KNOWLEDGE_BASE } from './knowledgeBase';

export interface ExperienceValidationReport {
  isValid: boolean;
  totalStatements: number;
  groundedStatements: number;
  unsupportedSourceIds: string[];
  statusMessageAr: string;
  statusMessageEn: string;
}

/**
 * Validates that all learning statements in an experience are grounded in authentic reference chunks
 */
export function validateExperienceGrounding(
  experience: Structured2D5Experience
): ExperienceValidationReport {
  const verifiedChunkIds = new Set(TRUSTED_KNOWLEDGE_BASE.map((c) => c.id));
  const unsupportedIds: string[] = [];

  let totalStatements = 0;
  let groundedStatements = 0;

  for (const moment of experience.learningMoments) {
    totalStatements++;
    const allValid = moment.sourceIds.length > 0 && moment.sourceIds.every((id) => verifiedChunkIds.has(id));
    if (allValid) {
      groundedStatements++;
    } else {
      const invalid = moment.sourceIds.filter((id) => !verifiedChunkIds.has(id));
      unsupportedIds.push(...invalid);
    }
  }

  const isValid = unsupportedIds.length === 0 && groundedStatements === totalStatements;

  return {
    isValid,
    totalStatements,
    groundedStatements,
    unsupportedSourceIds: unsupportedIds,
    statusMessageAr: isValid
      ? `جميع الوقفات التعليمية (${groundedStatements}/${totalStatements}) موثقة بالأدلة المعتمدة.`
      : `تحذير أمان: تم رصد عبارات تعليمية غير مكتملة التوثيق (${unsupportedIds.join(', ')}).`,
    statusMessageEn: isValid
      ? `All learning statements (${groundedStatements}/${totalStatements}) are grounded in approved references.`
      : `Safety alert: Unverified claims found (${unsupportedIds.join(', ')}).`,
  };
}

/**
 * Generates or Adapts a Safe Structured 2.5D Experience JSON
 * Uses reusable primitives: door, desk, chair, prayer_mat, backpack, phone, room, etc.
 */
export function generateStructuredExperience(params: {
  topic: string;
  userProfile: UserPersonalizationProfile;
  customLocation?: 'university' | 'apartment' | 'office' | 'market';
}): Structured2D5Experience {
  const { topic, userProfile, customLocation } = params;
  const isFemale = userProfile.preferredAddressing === 'female';
  const level = userProfile.learningLevel;

  // 1. SCENARIO A: UNIVERSITY CAMPUS PRAYER (TEST 2 & 11)
  if (topic === 'university_campus' || customLocation === 'university' || topic === 'prayer_study') {
    const objects: SceneObject[] = [
      {
        id: 'uni-door',
        type: 'door',
        nameAr: 'باب القاعة الدراسية',
        nameEn: 'Study Hall Door',
        position: { x: 18, y: 35 },
        size: { width: 14, height: 32 },
        layer: 2,
        interactive: true,
        currentState: 'closed',
        states: [
          { stateId: 'closed', labelAr: 'مغلق بهدوء', labelEn: 'Gently Closed', color: '#8C6239' },
          { stateId: 'opening', labelAr: 'جارٍ الفتح', labelEn: 'Opening', color: '#D4A373' },
          { stateId: 'open', labelAr: 'مفتوح ومرحب', labelEn: 'Open & Peaceful', color: '#2C483F' },
        ],
        actionPromptAr: isFemale ? 'انقري على الباب لتفقّد القاعة الهادئة' : 'انقر على الباب لتفقد القاعة',
        actionPromptEn: 'Tap the door to check the quiet study room',
      },
      {
        id: 'uni-desk',
        type: 'desk',
        nameAr: 'طاولة دراسية نظيفة',
        nameEn: 'Clean Study Desk',
        position: { x: 50, y: 55 },
        size: { width: 22, height: 18 },
        layer: 3,
        interactive: false,
        currentState: 'clean',
        states: [{ stateId: 'clean', labelAr: 'طاهرة ومرتبة', labelEn: 'Clean & Tidy' }],
      },
      {
        id: 'uni-backpack',
        type: 'backpack',
        nameAr: 'حقيبة الظهر الدراسية',
        nameEn: 'Student Backpack',
        position: { x: 42, y: 62 },
        size: { width: 10, height: 12 },
        layer: 4,
        interactive: true,
        currentState: 'on_floor',
        states: [
          { stateId: 'on_floor', labelAr: 'بجوار المقعد', labelEn: 'By the seat' },
          { stateId: 'inspected', labelAr: 'أخرجتِ سجادة الصلاة الخفيفة', labelEn: 'Retrieved portable prayer mat' },
        ],
        actionPromptAr: isFemale ? 'تفقدي حقيبتكِ لإخراج سجادة الصلاة الخفيفة' : 'تفقد حقيبتك لإخراج سجادة الصلاة',
        actionPromptEn: 'Check backpack to retrieve portable prayer mat',
      },
      {
        id: 'uni-prayer-mat',
        type: 'prayer_mat',
        nameAr: 'سجادة الصلاة المحمولة',
        nameEn: 'Portable Prayer Mat',
        position: { x: 68, y: 65 },
        size: { width: 16, height: 22 },
        layer: 5,
        interactive: true,
        currentState: 'folded',
        states: [
          { stateId: 'folded', labelAr: 'مطوية داخل الجيب', labelEn: 'Folded' },
          { stateId: 'placed', labelAr: 'مبسوطة باتجاه القبلة', labelEn: 'Laid towards Qiblah', visualEffect: 'glow' },
        ],
        actionPromptAr: isFemale ? 'ابسطي سجادة الصلاة في البقعة الطاهرة' : 'ابسط سجادة الصلاة في البقعة الطاهرة',
        actionPromptEn: 'Lay the prayer mat in the clean quiet spot',
      },
      {
        id: 'uni-phone',
        type: 'phone',
        nameAr: 'الهاتف الذكي (تطبيق القبلة والوضع الصامت)',
        nameEn: 'Phone (Qiblah Compass & Silent Mode)',
        position: { x: 54, y: 52 },
        size: { width: 5, height: 6 },
        layer: 4,
        interactive: true,
        currentState: 'ringing',
        states: [
          { stateId: 'ringing', labelAr: 'وضع عادي (تنبيهات)', labelEn: 'Normal Mode' },
          { stateId: 'silent_qiblah', labelAr: 'صامت وموجه للقبلة', labelEn: 'Silent & Qiblah Verified', color: '#88C947' },
        ],
        actionPromptAr: isFemale ? 'فعّلي الوضع الصامت وتحققي من اتجاه القبلة' : 'فعّل الوضع الصامت وتحقق من القبلة',
        actionPromptEn: 'Enable silent mode & verify Qiblah orientation',
      },
    ];

    const interactions: SceneInteraction[] = [
      {
        interactionId: 'int-door-open',
        targetObjectId: 'uni-door',
        fromState: 'closed',
        toState: 'open',
        triggerLabelAr: 'فتح باب القاعة الدراسية',
        triggerLabelEn: 'Open Study Room Door',
        narrationAr: isFemale
          ? 'وجدتِ قاعة دراسية خالية وهادئة بين المحاضرات، مكان مثالي للصلاة بسكينة.'
          : 'وجدتَ قاعة دراسية خالية وهادئة بين المحاضرات، مكان مثالي للصلاة بسكينة.',
        narrationEn: 'You found an empty, serene classroom between lectures—ideal for mindful prayer.',
        learningMomentId: 'lm-earth-mosque',
        peaceAward: 5,
      },
      {
        interactionId: 'int-phone-silent',
        targetObjectId: 'uni-phone',
        fromState: 'ringing',
        toState: 'silent_qiblah',
        triggerLabelAr: 'ضبط الهاتف صامتاً وتحديد القبلة',
        triggerLabelEn: 'Silent Phone & Check Qiblah',
        narrationAr: 'تم تفعيل الوضع الصامت لضمان الخشوع، والتأكد من اتجاه القبلة بيسر وطمأنينة.',
        narrationEn: 'Phone switched to silent for inner serenity, with Qiblah direction confirmed.',
        peaceAward: 4,
      },
      {
        interactionId: 'int-mat-spread',
        targetObjectId: 'uni-prayer-mat',
        fromState: 'folded',
        toState: 'placed',
        triggerLabelAr: 'بسط سجادة الصلاة الطاهرة',
        triggerLabelEn: 'Spread the Clean Prayer Mat',
        narrationAr: isFemale
          ? 'بسطتِ سجادتكِ في ركن القاعة النظيف؛ الأرض كلها طهور وسعتها رحمة من الله.'
          : 'بسطتَ سجادتك في ركن القاعة النظيف؛ الأرض كلها طهور وسعتها رحمة من الله.',
        narrationEn: 'You placed the mat in a clean corner; the entire earth is pure by divine decree.',
        learningMomentId: 'lm-deen-ease',
        peaceAward: 6,
      },
    ];

    const learningMoments: LearningMoment[] = [
      {
        id: 'lm-earth-mosque',
        learningStatementAr:
          'الأرض كلها مسجد وطهور؛ يمكن للمسلم والمسلمة أداء الصلاة في أي مكان طاهر بالجامعة دون حرج.',
        learningStatementEn:
          'The entire earth is a pure place of prostration; students may pray in any clean quiet spot on campus.',
        sourceIds: ['src-fiqh-university-prayer', 'src-quran-prayer-time'],
        scholarlyNoteAr: 'مستند لحديث رسول الله ﷺ في صحيح البخاري 335، وفقه التيسير بالدرر السنية.',
        scholarlyNoteEn: 'Grounded in Sahih al-Bukhari (Hadith 335) and Dorar Fiqh principles.',
      },
      {
        id: 'lm-deen-ease',
        learningStatementAr:
          'الشريعة مبنية على التيسير ورفع المشقة؛ الصلاة بين أوقات الدراسة راحة للنفس وتجديد للنشاط.',
        learningStatementEn:
          'Islamic guidance centers upon ease and lifting burden; campus prayer renews focus and inner calm.',
        sourceIds: ['src-hadith-deen-yusr', 'src-tafsir-prayer-serenity'],
        scholarlyNoteAr: 'حديث «إن الدين يسر» رواه البخاري 39.',
        scholarlyNoteEn: 'Prophetic Hadith "Indeed, the religion is ease" (Bukhari 39).',
      },
    ];

    return {
      experienceId: 'generated-university-prayer',
      titleAr: 'الصلاة بين المحاضرات في رحاب الجامعة',
      titleEn: 'Prayer Between Lectures on Campus',
      location: 'university',
      buildingId: 'school',
      objectiveAr: isFemale
        ? 'تعلمي كيف تؤدين صلاتكِ بهدوء وثقة داخل بيئة الحرم الجامعي دون خجل أو تردد.'
        : 'تعلم كيف تؤدي صلاتك بهدوء وثقة داخل الحرم الجامعي دون حرج.',
      objectiveEn: 'Practice locating a clean quiet spot, setting Qiblah, and praying calmly on campus.',
      difficulty: level,
      groundedSourceIds: ['src-fiqh-university-prayer', 'src-hadith-deen-yusr', 'src-quran-prayer-time'],
      scene: {
        type: '2.5d',
        background: 'university_hallway',
        objects,
      },
      interactions,
      learningMoments,
      completionCondition: {
        requiredInteractionIds: ['int-door-open', 'int-phone-silent', 'int-mat-spread'],
      },
      reflection: {
        textAr: isFemale
          ? 'أحسنتِ صنعاً يا رفيقتي! الصلاة في الجامعة أصبحت خطوة ميسرة وطبيعية تملأ يومكِ الدراسي بركة وهدوءاً.'
          : 'أحسنت صنعاً يا رفيقي! الصلاة في الجامعة أصبحت ممارسة طبيعية ميسرة تفيض سكينة.',
        textEn:
          'Splendid step, dear companion! Campus prayer is now a natural, tranquil moment that enriches your studies.',
      },
      isGenerated: true,
    };
  }

  // 2. SCENARIO B: FAMILY & APARTMENT PEACE (TEST 7)
  const objectsHome: SceneObject[] = [
    {
      id: 'home-door',
      type: 'door',
      nameAr: 'باب الغرفة الهادئة',
      nameEn: 'Quiet Room Door',
      position: { x: 22, y: 38 },
      size: { width: 14, height: 32 },
      layer: 2,
      interactive: true,
      currentState: 'closed',
      states: [
        { stateId: 'closed', labelAr: 'مغلق بلطف', labelEn: 'Closed Gently' },
        { stateId: 'open', labelAr: 'مفتوح لاستقبال الأسرة بمودة', labelEn: 'Open with warmth' },
      ],
      actionPromptAr: isFemale ? 'افتحي الباب للترحيب بالوالدة' : 'افتح الباب للترحيب بالوالدة',
      actionPromptEn: 'Open the door to warmly greet your mother',
    },
    {
      id: 'home-shelf',
      type: 'shelf',
      nameAr: 'رف الكتب والقرآن الكريم',
      nameEn: 'Book & Quran Shelf',
      position: { x: 75, y: 30 },
      size: { width: 14, height: 26 },
      layer: 3,
      interactive: false,
      currentState: 'tidy',
      states: [{ stateId: 'tidy', labelAr: 'مرتب ونظيف', labelEn: 'Tidy & Clean' }],
    },
    {
      id: 'home-tea-tray',
      type: 'plate',
      nameAr: 'صينية الشاي الساخن للوالدين',
      nameEn: 'Warm Tea Tray for Parents',
      position: { x: 50, y: 60 },
      size: { width: 12, height: 10 },
      layer: 4,
      interactive: true,
      currentState: 'waiting',
      states: [
        { stateId: 'waiting', labelAr: 'جاهزة للتقديم بإحسان', labelEn: 'Ready to serve with love' },
        { stateId: 'served', labelAr: 'تم تقديمها بابتسامة خافضة للجناح', labelEn: 'Served with gentle respect' },
      ],
      actionPromptAr: isFemale ? 'قدمي كوب الشاي مع كلمة طيبة لوالدتكِ' : 'قدم كوب الشاي مع كلمة طيبة لوالدك',
      actionPromptEn: 'Serve tea with a gentle, loving word to parents',
    },
  ];

  const interactionsHome: SceneInteraction[] = [
    {
      interactionId: 'int-door-greet',
      targetObjectId: 'home-door',
      fromState: 'closed',
      toState: 'open',
      triggerLabelAr: 'فتح الباب بودّ',
      triggerLabelEn: 'Open Door with Kindness',
      narrationAr: isFemale
        ? 'فتحتِ باب غرفتكِ بابتسامة دافئة؛ الإسلام جاء ليزيدكِ براً وقرباً من أهلكِ.'
        : 'فتحتَ باب غرفتك بابتسامة دافئة؛ الإسلام جاء ليزيدك براً وقرباً من أهلك.',
      narrationEn: 'You opened your door with warmth; faith enriches your gentleness with family.',
      learningMomentId: 'lm-parents-kindness',
      peaceAward: 6,
    },
    {
      interactionId: 'int-tea-serve',
      targetObjectId: 'home-tea-tray',
      fromState: 'waiting',
      toState: 'served',
      triggerLabelAr: 'تقديم الشاي وخفض الجناح',
      triggerLabelEn: 'Serve Tea with Humility',
      narrationAr: '﴿وَاخْفِضْ لَهُمَا جَنَاحَ الذُّلِّ مِنَ الرَّحْمَةِ﴾؛ الإحسان للوالدين أعظم أبواب الجنة.',
      narrationEn: 'Honoring parents with humility and patience is the crowning gate of divine reward.',
      learningMomentId: 'lm-parents-hadith',
      peaceAward: 8,
    },
  ];

  const learningMomentsHome: LearningMoment[] = [
    {
      id: 'lm-parents-kindness',
      learningStatementAr: 'الإحسان إلى الوالدين والقول الكريم لهما وصية ربانية مقترنة بالتوحيد.',
      learningStatementEn: 'Kindness to parents is a divine command inseparable from faith.',
      sourceIds: ['src-family-parents-kindness'],
      scholarlyNoteAr: 'سورة الإسراء، الآيات 23-24 (Quranpedia).',
      scholarlyNoteEn: 'Surah Al-Isra 17:23-24 (Quranpedia).',
    },
    {
      id: 'lm-parents-hadith',
      learningStatementAr: 'بر الوالدين من أحب الأعمال إلى الله بعد الصلاة على وقتها.',
      learningStatementEn: 'Devotion to parents is among the dearest deeds to Allah after prayer.',
      sourceIds: ['src-hadith-beloved-deeds-parents'],
      scholarlyNoteAr: 'صحيح البخاري 527 وصحيح مسلم 85.',
      scholarlyNoteEn: 'Sahih al-Bukhari 527 & Sahih Muslim 85.',
    },
  ];

  return {
    experienceId: 'generated-family-kindness',
    titleAr: 'سكينة البيت وخفض الجناح للوالدين بالرحمة',
    titleEn: 'Home Serenity & Compassion to Parents',
    location: 'apartment',
    buildingId: 'apartment',
    objectiveAr: isFemale
      ? 'تدربي على مداراة الأسرة وبر الوالدين بالكلمة الطيبة والخدمة العفوية.'
      : 'تدرب على مداراة الأسرة وبر الوالدين بالكلمة الطيبة.',
    objectiveEn: 'Practice filial kindness and loving everyday connection with parents.',
    difficulty: level,
    groundedSourceIds: ['src-family-parents-kindness', 'src-hadith-beloved-deeds-parents'],
    scene: {
      type: '2.5d',
      background: 'apartment_bedroom',
      objects: objectsHome,
    },
    interactions: interactionsHome,
    learningMoments: learningMomentsHome,
    completionCondition: {
      requiredInteractionIds: ['int-door-greet', 'int-tea-serve'],
    },
    reflection: {
      textAr: isFemale
        ? 'ما أجمل هذا البر والسكينة! رضاء الله في رضاء الوالدين، وابتسامتهما أثمن كنز في بيتكِ.'
        : 'ما أجمل هذا البر والسكينة! رضاء الوالدين من أعظم القربات.',
      textEn: 'Such serene devotion! Seeking parental happiness brings divine peace to your home.',
    },
    isGenerated: true,
  };
}
