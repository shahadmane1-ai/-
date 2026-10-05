import { AiMiniGame, InteractiveVisualObject, LearningLevel, MiniGameMechanic, UserPersonalizationProfile } from '../types';
import { TRUSTED_KNOWLEDGE_BASE } from './knowledgeBase';
import { normalizeArabicNlp } from './arabicNlp';

/**
 * AI Mini-Game Lab Generator (مختبر رفيق للذكاء الاصطناعي)
 * 
 * General AI-powered interactive visual experience generator:
 * Any learning question, difficulty, fear, confusion, or concept
 * 1. Understand actual meaning and learning objective
 * 2. Retrieve relevant information from approved sources first
 * 3. Use verified information to design the visual interactive experience
 * 4. Immediately generate a playable 2D/2.5D interactive scene (no quizzes, no MCQs).
 */

export interface MiniGameGenerationOptions {
  userQuery?: string;
  topic?: string;
  problemType?: 'ordering' | 'distinguishing' | 'concessions' | 'inspection' | 'scenario' | 'general';
  userProfile?: UserPersonalizationProfile;
  difficulty?: LearningLevel;
}

export function generateAiMiniGame(options: MiniGameGenerationOptions): AiMiniGame {
  const {
    userQuery = '',
    topic: explicitTopic,
    userProfile,
    difficulty = userProfile?.learningLevel || 'beginner',
  } = options;

  const isFemale =
    userProfile?.preferredAddressing === 'female' || (userProfile as any)?.gender === 'female';
  const norm = normalizeArabicNlp(userQuery);

  // 1. SPECIFIC PHYSICAL & VISUAL INTERACTION TOPICS (Drawing / Wiping / Tapping on Virtual Objects)
  if (norm.includes('مسح') || norm.includes('جورب') || norm.includes('خف') || norm.includes('رجل') || norm.includes('قدم')) {
    return buildSockWipingVisualGame(isFemale, difficulty);
  }

  if (norm.includes('تيمم') || norm.includes('تراب') || norm.includes('صعيد') || norm.includes('جبيره') || norm.includes('جرح')) {
    return buildTayammumVisualGame(isFemale, difficulty);
  }

  if (norm.includes('قبله') || norm.includes('كعبه') || norm.includes('اتجاه') || norm.includes('بوصله') || norm.includes('استقبال')) {
    return buildQiblaCompassVisualGame(isFemale, difficulty);
  }

  if (norm.includes('سجود') && (norm.includes('اعضاء') || norm.includes('سبعه') || norm.includes('جبهه') || norm.includes('كيف') || norm.includes('هيئه'))) {
    return buildSujudSevenPartsVisualGame(isFemale, difficulty);
  }

  // 2. CREED & HEART BALANCE (Tawakkul, Tawhid, Ikhlas, Anxiety)
  if (explicitTopic === 'tawakkul_vs_tawaakul' || norm.includes('توكل') || norm.includes('تواكل') || norm.includes('اسباب') || norm.includes('اعقلها') || norm.includes('رزق')) {
    return buildTawakkulGame(isFemale, difficulty);
  }

  if (explicitTopic === 'prayer_steps' || ((norm.includes('صلاه') || norm.includes('صلي') || norm.includes('ركوع') || norm.includes('تكبير') || norm.includes('تشهد')) && (norm.includes('ترتيب') || norm.includes('خطوات') || norm.includes('اركان')))) {
    return buildPrayerStepsGame(isFemale, difficulty);
  }

  if (explicitTopic === 'wudu_steps' || (norm.includes('وضوء') && (norm.includes('خطوات') || norm.includes('ترتيب') || norm.includes('طريقه')))) {
    return buildWuduStepsGame(isFemale, difficulty);
  }

  if (explicitTopic === 'travel_concessions' || norm.includes('سفر') || norm.includes('مطر') || norm.includes('طياره') || norm.includes('قصر') || norm.includes('جمع') || norm.includes('رخصه')) {
    return buildTravelConcessionsGame(isFemale, difficulty);
  }

  if (explicitTopic === 'food_inspection' || norm.includes('اكل') || norm.includes('طعام') || norm.includes('مكونات') || norm.includes('جيلاتين') || norm.includes('e471') || norm.includes('مشتبه')) {
    return buildFoodInspectionGame(isFemale, difficulty);
  }

  if (explicitTopic === 'tawheed_vs_ibadah' || ((norm.includes('توحيد') || norm.includes('عقيده')) && (norm.includes('عباده') || norm.includes('فرق')))) {
    return buildTawheedGame(isFemale, difficulty);
  }

  if (norm.includes('والدين') || norm.includes('امي') || norm.includes('ابي') || norm.includes('بر') || norm.includes('عقوق')) {
    return buildParentsGame(isFemale, difficulty);
  }

  if (norm.includes('سهو') || norm.includes('نسيت') || norm.includes('شك') || norm.includes('وسواس')) {
    return buildSujudSahwGame(isFemale, difficulty);
  }

  if (norm.includes('صدقه') || norm.includes('رياء') || norm.includes('اخلاص') || norm.includes('سر')) {
    return buildIkhlasGame(isFemale, difficulty);
  }

  if (norm.includes('خوف') || norm.includes('حزن') || norm.includes('ضيق') || norm.includes('قلق') || norm.includes('تعب') || norm.includes('هم')) {
    return buildTranquilityMindGame(isFemale, difficulty);
  }

  // 3. UNIVERSAL DYNAMIC VISUAL GENERATOR for any arbitrary query
  return buildUniversalDynamicGame(userQuery, isFemale, difficulty);
}

// =========================================================================
// 1. VISUAL OBJECT INTERACTION: SOCK WIPING (المسح على الخفين والجوربين)
// =========================================================================
function buildSockWipingVisualGame(isFemale: boolean, difficulty: LearningLevel): AiMiniGame {
  return {
    id: `game-sock-wiping-${Date.now()}`,
    titleAr: 'المسح على الخفين والجوربين: تفاعل عملي على المجسم',
    titleEn: 'Wiping Over Socks: Interactive Object Demonstration',
    subtitleAr: isFemale
      ? 'تفاعلي مباشرة مع مجسم الجورب بالمسح على الموضع الشرعي الصحيح لتثبيت سنة النبي ﷺ.'
      : 'تفاعل مباشرة مع مجسم الجورب بالمسح على الموضع الشرعي الصحيح لتثبيت سنة النبي ﷺ.',
    subtitleEn: 'Interact directly with the virtual sock by wiping the authentic area.',
    topic: 'wudu_concessions',
    learningObjectiveAr: 'معرفة الموضع الشرعي للمسح على الخف والجورب (ظاهر أعلى القدم) والتمييز بينه وبين الأسفل والعقب.',
    learningObjectiveEn: 'Mastering the exact physical area of wiping over socks (top surface of foot).',
    sourceIds: ['src-fiqh-travel-rain-concessions', 'src-hadith-deen-yusr'],
    mechanic: 'object_interaction',
    difficulty,
    sceneTheme: 'wudu_station',
    interactiveObject: {
      objectType: 'sock_wiping',
      titleAr: 'مجسم الجورب والخف الافتراضي 2.5D',
      titleEn: '2.5D Virtual Foot & Sock Model',
      instructionAr: isFemale
        ? 'اسحبي بإصبعك أو بالفأرة وامسحي على الموضع الصحيح على ظاهر الجورب بالماء 💧'
        : 'اسحب بإصبعك أو بالفأرة وامسح على الموضع الصحيح على ظاهر الجورب بالماء 💧',
      instructionEn: 'Drag your finger/cursor across the correct area on top of the sock.',
      targetZones: [
        {
          id: 'top_surface',
          labelAr: 'ظاهر (أعلى) الجورب من أطراف الأصابع إلى الساق ✨',
          labelEn: 'Top surface of sock from toes upward',
          x: 48,
          y: 35,
          width: 32,
          height: 38,
          shape: 'stroke',
          isCorrect: true,
          hintAr: 'هنا موضع المسح النبوي الصحيح',
          feedbackAr: isFemale
            ? 'أحسنتِ تماماً! المسح يكون على ظاهر أعلى الخف ببلل اليدين مرة واحدة.'
            : 'أحسنت تماماً! المسح يكون على ظاهر أعلى الخف ببلل اليدين مرة واحدة.',
          feedbackEn: 'Correct! Wiping is performed once across the top surface of the foot.',
          sourceId: 'src-fiqh-travel-rain-concessions',
        },
        {
          id: 'bottom_sole',
          labelAr: 'أسفل باطن القدم (النعل)',
          labelEn: 'Bottom sole of foot',
          x: 45,
          y: 78,
          width: 35,
          height: 20,
          shape: 'rect',
          isCorrect: false,
          hintAr: 'لا يشرع مسح باطن القدم',
          feedbackAr: 'قال علي رضي الله عنه: «لو كان الدين بالرأي لكان أسفل الخف أولى بالمسح من أعلاه، وقد رأيت رسول الله ﷺ يمسح على ظاهر خفيه».',
          feedbackEn: 'Ali (RA) said: If religion were based on opinion, the bottom of the sock would be wiped rather than the top, but I saw the Prophet ﷺ wipe over the top.',
          sourceId: 'src-fiqh-travel-rain-concessions',
        },
        {
          id: 'heel_back',
          labelAr: 'عقب القدم ومؤخرة الكعب',
          labelEn: 'Heel and back of ankle',
          x: 18,
          y: 60,
          width: 22,
          height: 25,
          shape: 'circle',
          isCorrect: false,
          hintAr: 'العقب لا يمسح',
          feedbackAr: 'السنة مسح ظاهر القدم فقط من جهة الأصابع إلى أول الساق، ولا يمسح العقب.',
          feedbackEn: 'The Sunnah is to wipe solely over the top of the foot.',
          sourceId: 'src-fiqh-travel-rain-concessions',
        },
      ],
    },
    feedback: {
      successAr: isFemale
        ? 'ما شاء الله! مسحتِ على ظاهر الجورب كما علمنا النبي ﷺ 🌿 هدي نبوي مبارك يرفع الحرج وييسر الطهارة.'
        : 'ما شاء الله! مسحت على ظاهر الجورب كما علمنا النبي ﷺ 🌿 هدي نبوي مبارك يرفع الحرج وييسر الطهارة.',
      successEn: 'Brilliant! You wiped over the top of the sock following the authentic Prophetic Sunnah.',
      scholarlyNoteAr: 'عن علي بن أبي طالب رضي الله عنه قال: «لو كان الدين بالرأي لكان أسفل الخف أولى بالمسح من أعلاه، وقد رأيت رسول الله ﷺ يمسح على ظاهر خفيه» (سنن أبي داود 162 وصححه الألباني).',
    },
    completionConditionAr: 'المسح الصحيح على ظاهر مجسم الجورب',
    isAiGenerated: true,
  };
}

// =========================================================================
// 2. VISUAL OBJECT INTERACTION: TAYAMMUM (التيمم والمسح بالصعيد الطاهر)
// =========================================================================
function buildTayammumVisualGame(isFemale: boolean, difficulty: LearningLevel): AiMiniGame {
  return {
    id: `game-tayammum-${Date.now()}`,
    titleAr: 'صفة التيمم الميسر: تفاعل مباشر مع الصعيد والأعضاء',
    titleEn: 'Tayammum Purity: Interactive Clean Earth & Limbs',
    subtitleAr: isFemale
      ? 'اضربي ضربة واحدة على الصعيد الطيب ثم امسحي الوجه والكفين كما علمنا النبي ﷺ.'
      : 'اضرب ضربة واحدة على الصعيد الطيب ثم امسح الوجه والكفين كما علمنا النبي ﷺ.',
    subtitleEn: 'Interact directly by touching the clean earth then wiping the face and hands.',
    topic: 'tayammum_concession',
    learningObjectiveAr: 'إتقان صفة التيمم الشرعية (ضربة واحدة باليدين على الأرض، ثم مسح الوجه والكفين).',
    learningObjectiveEn: 'Mastering the authentic single-strike Tayammum for face and hands.',
    sourceIds: ['src-hadith-deen-yusr', 'src-fiqh-travel-rain-concessions'],
    mechanic: 'object_interaction',
    difficulty,
    sceneTheme: 'desert_oasis',
    interactiveObject: {
      objectType: 'wudu_limb',
      titleAr: 'لوحة التيمم والصعيد الطاهر',
      titleEn: 'Clean Earth & Ablution Limbs',
      instructionAr: isFemale
        ? 'المسي الصعيد الطاهر أولاً، ثم امسحي الوجه والكفين ضربة واحدة برفق 🌿'
        : 'المس الصعيد الطاهر أولاً، ثم امسح الوجه والكفين ضربة واحدة برفق 🌿',
      instructionEn: 'Touch clean earth first, then wipe face and hands once with ease.',
      targetZones: [
        {
          id: 'clean_earth',
          labelAr: '1. ضربة واحدة خفيفة على الصعيد الطيب (التراب أو الحجر الطاهر)',
          labelEn: '1. Single light touch on clean earth or stone',
          x: 20,
          y: 50,
          width: 25,
          height: 35,
          isCorrect: true,
          feedbackAr: 'ضربة واحدة بكفي اليدين مع النفخ فيهما لتخفيف الغبار.',
          feedbackEn: 'A single light strike with both palms, blowing off excess dust.',
        },
        {
          id: 'face_hands',
          labelAr: '2. مسح الوجه والكفين إلى الرسغين ضربة واحدة',
          labelEn: '2. Wiping the face and both hands to wrists',
          x: 65,
          y: 45,
          width: 30,
          height: 40,
          isCorrect: true,
          feedbackAr: 'يمسح بهما وجهه وظاهر كفيه وباطنهما بيسر وسكينة.',
          feedbackEn: 'Wiping face and hands with peace and ease.',
        },
      ],
    },
    feedback: {
      successAr: isFemale
        ? 'مبارك! أتقنتِ التيمم النبوي الميسر 🌿 رخصة شرعية عظيمة ترفع الحرج عند فقد الماء أو المرض.'
        : 'مبارك! أتقنت التيمم النبوي الميسر 🌿 رخصة شرعية عظيمة ترفع الحرج عند فقد الماء أو المرض.',
      successEn: 'Excellent! You mastered authentic Tayammum with ease.',
      scholarlyNoteAr: 'قال النبي ﷺ لعمار بن ياسر: «إِنَّمَا كَانَ يَكْفِيكَ أَنْ تَصْنَعَ هَكَذَا، فَضَرَبَ بِكَفَّيْهِ ضَرْبَةً عَلَى الأَرْضِ ثُمَّ نَفَخَ فِيهِمَا ثُمَّ مَسَحَ بِهِمَا وَجْهَهُ وَكَفَّيْهِ» (متفق عليه).',
    },
    completionConditionAr: 'إتمام ضربة الصعيد ومسح الوجه والكفين',
    isAiGenerated: true,
  };
}

// =========================================================================
// 3. VISUAL OBJECT INTERACTION: QIBLA COMPASS & MECCA ORIENTATION
// =========================================================================
function buildQiblaCompassVisualGame(isFemale: boolean, difficulty: LearningLevel): AiMiniGame {
  return {
    id: `game-qibla-compass-${Date.now()}`,
    titleAr: 'بوصلة القبلة: توجيه المحراب واستقبال الكعبة',
    titleEn: 'Qibla Compass: Aligning Toward Kaaba',
    subtitleAr: isFemale
      ? 'دوري بوصلة المحراب لتوجيه سجادة الصلاة نحو الكعبة المشرفة بدقة.'
      : 'دوّر بوصلة المحراب لتوجيه سجادة الصلاة نحو الكعبة المشرفة بدقة.',
    subtitleEn: 'Rotate the mihrab compass to align prayer orientation toward the Holy Kaaba.',
    topic: 'prayer_conditions',
    learningObjectiveAr: 'معرفة شرط استقبال القبلة في الصلاة والاجتهاد في تحديدها بالسفر والبلدان.',
    learningObjectiveEn: 'Understanding the condition of facing Qiblah with certainty and reasonable effort.',
    sourceIds: ['src-fiqh-prayer-steps-order', 'src-hadith-deen-yusr'],
    mechanic: 'object_interaction',
    difficulty,
    sceneTheme: 'prayer_room',
    interactiveObject: {
      objectType: 'compass_qibla',
      titleAr: 'بوصلة الكعبة والمحراب 2.5D',
      titleEn: '2.5D Mihrab & Kaaba Compass',
      instructionAr: isFemale
        ? 'انقري على الاتجاه الصحيح للقبلة لتوجيه سجادة الصلاة نحو الكعبة المشرفة'
        : 'انقر على الاتجاه الصحيح للقبلة لتوجيه سجادة الصلاة نحو الكعبة المشرفة',
      instructionEn: 'Align toward the Holy Kaaba direction.',
      targetZones: [
        {
          id: 'mecca_qibla',
          labelAr: 'اتجاه الكعبة المشرفة (القبلة الصحيحة) 🕋',
          labelEn: 'Direction of Holy Kaaba (True Qiblah)',
          x: 50,
          y: 25,
          width: 30,
          height: 30,
          isCorrect: true,
          feedbackAr: 'استقبال القبلة شرط لصحة الصلاة للمستطيع، والمصلي يتحرى جهتها برفق.',
          feedbackEn: 'Facing Qiblah is a core condition for valid prayer.',
        },
        {
          id: 'wrong_west',
          labelAr: 'اتجاه معاكس للقبلة ⚠️',
          labelEn: 'Opposite direction',
          x: 50,
          y: 80,
          width: 25,
          height: 20,
          isCorrect: false,
          feedbackAr: 'هذا اتجاه مخالف لجهة الكعبة المشرفة، يُتحرى اتجاه القبلة بالأدوات والبوصلة.',
          feedbackEn: 'This faces away from Kaaba direction.',
        },
      ],
    },
    feedback: {
      successAr: isFemale
        ? 'أحسنتِ! تم توجيه القبلة بدقة وسكينة 🌿 صلاتكِ معراج روحكِ إلى الله.'
        : 'أحسنت! تم توجيه القبلة بدقة وسكينة 🌿 صلاتك معراج روحك إلى الله.',
      successEn: 'Great job! Qiblah is accurately aligned toward the Kaaba.',
      scholarlyNoteAr: 'قال تعالى: ﴿فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ وَحَيْثُ مَا كُنْتُمْ فَوَلُّوا وُجُوهَكُمْ شَطْرَهُ﴾ (البقرة: 144).',
    },
    completionConditionAr: 'توجيه بوصلة الصلاة نحو القبلة',
    isAiGenerated: true,
  };
}

// =========================================================================
// 4. VISUAL OBJECT INTERACTION: SUJUD ON SEVEN LIMBS
// =========================================================================
function buildSujudSevenPartsVisualGame(isFemale: boolean, difficulty: LearningLevel): AiMiniGame {
  return {
    id: `game-sujud-seven-${Date.now()}`,
    titleAr: 'سجادة السجود: ملامسة الأعضاء السبعة المطمئنة',
    titleEn: 'Prostration Pillars: Touching the Seven Bodily Points',
    subtitleAr: isFemale
      ? 'المسي الأعضاء السبعة المشروعة على سجادة الصلاة لتثبيت السجود النبوي الخاشع.'
      : 'المس الأعضاء السبعة المشروعة على سجادة الصلاة لتثبيت السجود النبوي الخاشع.',
    subtitleEn: 'Touch the seven designated bodily parts on the prayer rug to master authentic Sujud.',
    topic: 'prayer_pillars',
    learningObjectiveAr: 'معرفة الأعضاء السبعة التي أمر النبي ﷺ بالسجود عليها (الجبهة مع الأنف، اليدين، الركبتين، أطراف القدمين).',
    learningObjectiveEn: 'Mastering prostration on the seven distinct body parts.',
    sourceIds: ['src-fiqh-prayer-steps-order', 'src-hadith-deen-yusr'],
    mechanic: 'object_interaction',
    difficulty,
    sceneTheme: 'prayer_room',
    interactiveObject: {
      objectType: 'sujud_seven_parts',
      titleAr: 'هيئة السجود على الأعضاء السبعة',
      titleEn: 'Seven Bodily Points in Prostration',
      instructionAr: isFemale
        ? 'اضغطي على مواضع الأعضاء السبعة المشروعة لتثبيت ملامستها للأرض بالسجود'
        : 'اضغط على مواضع الأعضاء السبعة المشروعة لتثبيت ملامستها للأرض بالسجود',
      instructionEn: 'Tap the seven body points that must touch the ground during prostration.',
      targetZones: [
        {
          id: 'forehead_nose',
          labelAr: '1. الجبهة والأنف (عضو واحد) ✨',
          labelEn: '1. Forehead and nose',
          x: 50,
          y: 20,
          width: 25,
          height: 20,
          isCorrect: true,
          feedbackAr: 'أشار النبي ﷺ بيده إلى أنفه وجبهته كعضو أساسي بالسجود.',
          feedbackEn: 'The Prophet ﷺ indicated his forehead and nose.',
        },
        {
          id: 'hands_palms',
          labelAr: '2 & 3. كفا اليدين مبسوطتين حذو المنكبين أو الأذنين',
          labelEn: '2 & 3. Both palms flat on ground',
          x: 30,
          y: 35,
          width: 40,
          height: 18,
          isCorrect: true,
          feedbackAr: 'وضع الكفين على الأرض مستقبلاً بأصابعهما القبلة.',
          feedbackEn: 'Both palms placed flat facing Qiblah.',
        },
        {
          id: 'knees',
          labelAr: '4 & 5. الركبتان مستقرتان على السجادة',
          labelEn: '4 & 5. Both knees resting firmly',
          x: 50,
          y: 60,
          width: 35,
          height: 18,
          isCorrect: true,
          feedbackAr: 'استقرار الركبتين على الأرض باطمئنان.',
          feedbackEn: 'Both knees firmly on the prayer rug.',
        },
        {
          id: 'feet_toes',
          labelAr: '6 & 7. أطراف أصابع القدمين منصوبتين باتجاه القبلة',
          labelEn: '6 & 7. Tips of toes planted facing Qiblah',
          x: 50,
          y: 85,
          width: 35,
          height: 15,
          isCorrect: true,
          feedbackAr: 'نصب القدمين واستقبال القبلة ببطون أصابعهما.',
          feedbackEn: 'Erecting feet with toes pointing toward Qiblah.',
        },
      ],
    },
    feedback: {
      successAr: isFemale
        ? 'تبارك الله! سجدتِ على الأعضاء السبعة كاملة باطمئنان 🌿 أقرب ما يكون العبد من ربه وهو ساجد.'
        : 'تبارك الله! سجدت على الأعضاء السبعة كاملة باطمئنان 🌿 أقرب ما يكون العبد من ربه وهو ساجد.',
      successEn: 'Splendid! You completed prostration on all seven authentic bodily parts.',
      scholarlyNoteAr: 'عن ابن عباس رضي الله عنهما قال: قال رسول الله ﷺ: «أُمِرْتُ أَنْ أَسْجُدَ عَلَى سَبْعَةِ أَعْظُمٍ: عَلَى الْجَبْهَةِ - وَأَشَارَ بِيَدِهِ إِلَى أَنْفِهِ - وَالْيَدَيْنِ، وَالرُّكْبَتَيْنِ، وَأَطْرَافِ الْقَدَمَيْنِ» (صحيح البخاري 812).',
    },
    completionConditionAr: 'تثبيت الأعضاء السبعة على سجادة الصلاة',
    isAiGenerated: true,
  };
}

// =========================================================================
// 5. TAWAKKUL VS TAWAAKUL (Heart Balance Scale)
// =========================================================================
function buildTawakkulGame(isFemale: boolean, difficulty: LearningLevel): AiMiniGame {
  return {
    id: `game-tawakkul-${Date.now()}`,
    titleAr: 'ميزان القلب: التوكل والأخذ بالأسباب',
    titleEn: 'Heart Scale: True Reliance vs Passive Neglect',
    subtitleAr: isFemale
      ? 'اسحبي المواقف الحياتية وضعي كل موقف على منصته لترسيخ هدي «اعقلها وتوكل».'
      : 'اسحب المواقف الحياتية وضع كل موقف على منصته لترسيخ هدي «اعقلها وتوكل».',
    subtitleEn: 'Sort real-life scenarios into genuine reliance vs passive neglect.',
    topic: 'aqeedah_tawakkul',
    learningObjectiveAr: 'التمييز العملي بين اعتماد القلب مع بذل السبب المشروع (التوكل) وترك السعي بدعوى القدر (التواكل).',
    learningObjectiveEn: 'Differentiating between active reliance with effort versus passive negligence.',
    sourceIds: ['src-aqeedah-tawakkul-vs-tawaakul', 'src-hadith-deen-yusr'],
    mechanic: 'sorting',
    difficulty,
    sceneTheme: 'desert_oasis',
    categories: [
      {
        id: 'tawakkul',
        titleAr: 'توكل مأمور به 🌿',
        titleEn: 'Rightful Tawakkul',
        descriptionAr: 'صدق الاعتماد على الله مع بذل السبب المشروع والاجتهاد.',
        color: '#2C483F',
        icon: 'Sparkles',
      },
      {
        id: 'tawaakul',
        titleAr: 'تواكل مذموم ⚠️',
        titleEn: 'Passive Tawaakul',
        descriptionAr: 'ترك السعي والعمل بدعوى أن الرزق مكتوب دون بذل الجهد.',
        color: '#C89B84',
        icon: 'AlertTriangle',
      },
    ],
    elements: [
      {
        id: 't-1',
        labelAr: 'المذاكرة الجادة للامتحان مع الدعاء بطلب التوفيق والسكينة',
        labelEn: 'Studying diligently while praying to Allah for success',
        sublabelAr: 'موقف الدراسة والامتحان',
        correctCategory: 'tawakkul',
        explanationAr: 'هذا هو عين التوكل: بذل الجهد البشري وتفويض النتيجة لله تعالى.',
        sourceId: 'src-aqeedah-tawakkul-vs-tawaakul',
      },
      {
        id: 't-2',
        labelAr: 'ترك البحث عن عمل والجلوس بالبيت قائلاً: "رزقي سيأتيني"',
        labelEn: 'Staying home without job hunting, saying "My sustenance will come"',
        sublabelAr: 'موقف طلب الرزق والعمل',
        correctCategory: 'tawaakul',
        explanationAr: 'هذا تواكل وعجز نهى عنه الشرع؛ فالطير تغدو خماصاً وتروح بطاناً بسعيها.',
        sourceId: 'src-aqeedah-tawakkul-vs-tawaakul',
      },
      {
        id: 't-3',
        labelAr: 'ربط حزام الأمان في السيارة والتأكد من صيانتها ثم قراءة دعاء السفر',
        labelEn: 'Fastening car seatbelt, checking tires, then reciting travel supplication',
        sublabelAr: 'موقف قيادة السيارة والسفر',
        correctCategory: 'tawakkul',
        explanationAr: 'تطبيق مباشر لحديث النبي ﷺ: «اعقلها وتوكل».',
        sourceId: 'src-aqeedah-tawakkul-vs-tawaakul',
      },
      {
        id: 't-4',
        labelAr: 'إهمال تناول الدواء ومراجعة الطبيب بزعم: "الله هو الشافي وحده"',
        labelEn: 'Neglecting medicine claiming: "Allah is the only Healer without medicine"',
        sublabelAr: 'موقف المرض والتداوي',
        correctCategory: 'tawaakul',
        explanationAr: 'التداوي سنة نبوية، والله تعالى جعل الدواء سبباً للشفاء بمشيئته.',
        sourceId: 'src-aqeedah-tawakkul-vs-tawaakul',
      },
    ],
    feedback: {
      successAr: isFemale
        ? 'أحسنتِ صنعاً! ميزتِ بدقة بين التوكل القلبي المثمر والتواكل العاجز 🌿 قلبكِ الآن ممتلئ باليقين والسعي.'
        : 'أحسنت صنعاً! ميزت بدقة بين التوكل القلبي المثمر والتواكل العاجز 🌿 قلبك الآن ممتلئ باليقين والسعي.',
      successEn: 'Excellent! You successfully distinguished between fruitful reliance and passive neglect.',
      scholarlyNoteAr: 'قال الإمام ابن رجب الحنبلي: "التوكل هو صدق اعتماد القلب على الله عز وجل في استجلاب المصالح ودفع المضار، مع مباشرة الأسباب المأذون فيها".',
    },
    completionConditionAr: 'تصنيف جميع المواقف الـ 4 في قسمها الصحيح',
    isAiGenerated: true,
  };
}

// =========================================================================
// 6. PRAYER STEPS SEQUENCING (Pathway of Peace)
// =========================================================================
function buildPrayerStepsGame(isFemale: boolean, difficulty: LearningLevel): AiMiniGame {
  return {
    id: `game-prayer-${Date.now()}`,
    titleAr: 'محراب الطمأنينة: تسلسل أركان الصلاة',
    titleEn: 'Sanctuary of Peace: Prayer Pillars Order',
    subtitleAr: isFemale
      ? 'رتبي أفعال الصلاة خطوة بخطوة بالترتيب الشرعي الصحيح لتحقيق الطمأنينة والخشوع.'
      : 'رتّب أفعال الصلاة خطوة بخطوة بالترتيب الشرعي الصحيح لتحقيق الطمأنينة والخشوع.',
    subtitleEn: 'Arrange the sequence of prayer steps from Takbeer to Tasleem.',
    topic: 'prayer',
    learningObjectiveAr: 'إتقان الترتيب الصحيح لأركان الصلاة من النية وتكبيرة الإحرام حتى التسليم مع استحضار الطمأنينة.',
    learningObjectiveEn: 'Mastering the chronological order of basic prayer pillars.',
    sourceIds: ['src-fiqh-prayer-steps-order', 'src-hadith-deen-yusr'],
    mechanic: 'sequencing',
    difficulty,
    sceneTheme: 'prayer_room',
    elements: [
      {
        id: 'p-1',
        labelAr: 'استقبال القبلة والنية وتكبيرة الإحرام (الله أكبر)',
        labelEn: 'Facing Qiblah, inward intention, and opening Takbeer (Allahu Akbar)',
        sublabelAr: 'الخطوة الأولى',
        correctOrder: 1,
        explanationAr: 'تبدأ الصلاة بتكبيرة الإحرام، وبها يدخل المصلي في حمى الصلاة وحرمتها.',
        sourceId: 'src-fiqh-prayer-steps-order',
      },
      {
        id: 'p-2',
        labelAr: 'قراءة سورة الفاتحة وما تيسر من آيات القرآن الكريم بخشوع',
        labelEn: 'Reciting Surah Al-Fatihah and whatever is easy from the Quran',
        sublabelAr: 'الخطوة الثانية',
        correctOrder: 2,
        explanationAr: 'لا صلاة لمن لم يقرأ بفاتحة الكتاب، وهي أم القرآن وشفاء القلوب.',
        sourceId: 'src-fiqh-prayer-steps-order',
      },
      {
        id: 'p-3',
        labelAr: 'الركوع مع تعظيم الله (سبحان ربي العظيم) والاطمئنان فيه',
        labelEn: 'Bowing (Ruku) glorifying Allah (Subhana Rabbiyal-Azeem) with composure',
        sublabelAr: 'الخطوة الثالثة',
        correctOrder: 3,
        explanationAr: 'تعظيم الله تعالى في الركوع مع استواء الظهر والطمأنينة ركن أساسي.',
        sourceId: 'src-fiqh-prayer-steps-order',
      },
      {
        id: 'p-4',
        labelAr: 'الرفع من الركوع قائلاً: "سمع الله لمن حمده، ربنا ولك الحمد"',
        labelEn: 'Rising from Ruku saying: "Sami Allahu liman hamidah, Rabbana wa lakal hamd"',
        sublabelAr: 'الخطوة الرابعة',
        correctOrder: 4,
        explanationAr: 'الاعتدال قائماً بعد الركوع والحمد والشكر لله مع السكون.',
        sourceId: 'src-fiqh-prayer-steps-order',
      },
      {
        id: 'p-5',
        labelAr: 'السجود على الأعضاء السبعة (الجبهة والأنف واليدين والركبتين والقدمين)',
        labelEn: 'Prostration (Sujud) on seven bodily parts with serenity',
        sublabelAr: 'الخطوة الخامسة',
        correctOrder: 5,
        explanationAr: 'أقرب ما يكون العبد من ربه وهو ساجد، وفيه التسبيح بالعلى.',
        sourceId: 'src-fiqh-prayer-steps-order',
      },
      {
        id: 'p-6',
        labelAr: 'الجلوس للتشهد الأخير والصلاة الإبراهيمية ثم التسليم عن اليمين واليسار',
        labelEn: 'Sitting for Tashahhud, sending blessings, then final Tasleem',
        sublabelAr: 'الخطوة السادسة',
        correctOrder: 6,
        explanationAr: 'خاتمة الصلاة بالسلام والرحمة على عباد الله الصالحين.',
        sourceId: 'src-fiqh-prayer-steps-order',
      },
    ],
    feedback: {
      successAr: isFemale
        ? 'تبارك الله! رتبتِ خطوات الصلاة كاملة بصورة صحيحة ومتقنة 🌿 صلاتكِ سكن لروحكِ وطمأنينة ليومكِ.'
        : 'تبارك الله! رتّبت خطوات الصلاة كاملة بصورة صحيحة ومتقنة 🌿 صلاتك سكن لروحك وطمأنينة ليومك.',
      successEn: 'Splendid! You ordered the prayer steps accurately and with mindfulness.',
      scholarlyNoteAr: 'قال النبي ﷺ: «صَلُّوا كَمَا رَأَيْتُمُونِي أُصَلِّي» (صحيح البخاري 631). والترتيب ركن أساسي في صحة الصلاة.',
    },
    completionConditionAr: 'ترتيب جميع الخطوات الـ 6 بالتسلسل الصحيح',
    isAiGenerated: true,
  };
}

// =========================================================================
// 7. WUDU STEPS (Ablution Pathway)
// =========================================================================
function buildWuduStepsGame(isFemale: boolean, difficulty: LearningLevel): AiMiniGame {
  return {
    id: `game-wudu-${Date.now()}`,
    titleAr: 'سلسال الوضوء: ترتيب خطوات الطهارة',
    titleEn: 'Ablution Pathway: Pure Water Sequence',
    subtitleAr: isFemale
      ? 'رتبي خطوات الوضوء النبوي المبارك خطوة بخطوة لتحقيق الطهارة المطمئنة.'
      : 'رتّب خطوات الوضوء النبوي المبارك خطوة بخطوة لتحقيق الطهارة المطمئنة.',
    subtitleEn: 'Sequence the authentic Prophetic steps of ablution.',
    topic: 'wudu_steps',
    learningObjectiveAr: 'إتقان الترتيب الصحيح لفرائض وسنن الوضوء مع دفع الوسواس والاطمئنان بالطهارة.',
    learningObjectiveEn: 'Mastering the order of wudu steps with peace and avoiding obsessive doubts.',
    sourceIds: ['src-fiqh-prayer-steps-order', 'src-hadith-deen-yusr'],
    mechanic: 'sequencing',
    difficulty,
    sceneTheme: 'wudu_station',
    elements: [
      {
        id: 'wd-1',
        labelAr: 'النية بالقلب والتسمية (بسم الله) وغسل الكفين ثلاثاً',
        labelEn: 'Inward intention, saying Bismillah, and washing hands three times',
        sublabelAr: 'البداية والاستفتاح',
        correctOrder: 1,
        explanationAr: 'البدء بالتسمية وغسل اليدين سنة مباركة تمهد للطهارة.',
      },
      {
        id: 'wd-2',
        labelAr: 'المضمضة والاستنشاق بالماء ونثره بكف واحدة أو ثلاث',
        labelEn: 'Rinsing mouth and sniffing water into nostrils',
        sublabelAr: 'طهارة الفم والأنف',
        correctOrder: 2,
        explanationAr: 'تنظيف الفم والأنف يطهر منافذ الكلام والنفس.',
      },
      {
        id: 'wd-3',
        labelAr: 'غسل الوجه كاملاً من منابت شعر الرأس إلى أسفل الذقن',
        labelEn: 'Washing the entire face from hairline to chin',
        sublabelAr: 'فرض الوجه',
        correctOrder: 3,
        explanationAr: 'غسل الوجه ركن منصوص عليه في القرآن الكريم: ﴿فَاغْسِلُوا وُجُوهَكُمْ﴾.',
      },
      {
        id: 'wd-4',
        labelAr: 'غسل اليدين مع المرفقين (البدء باليمنى ثم اليسرى)',
        labelEn: 'Washing hands including elbows (right then left)',
        sublabelAr: 'غسل اليدين للمرفقين',
        correctOrder: 4,
        explanationAr: 'إسباغ الوضوء على المرفقين ركن من أركان الطهارة.',
      },
      {
        id: 'wd-5',
        labelAr: 'مسح الرأس كله مع الأذنين بالماء مرة واحدة',
        labelEn: 'Wiping over entire head and ears once with wet hands',
        sublabelAr: 'مسح الرأس والأذنين',
        correctOrder: 5,
        explanationAr: 'مسح الرأس والأذنين سنة وركن ميسر يمسح فيه بماء جديد.',
      },
      {
        id: 'wd-6',
        labelAr: 'غسل القدمين مع الكعبين والخلل بين الأصابع ثم الشهادتين',
        labelEn: 'Washing feet with ankles, followed by concluding Shahadah',
        sublabelAr: 'خاتمة الطهارة والدعاء',
        correctOrder: 6,
        explanationAr: 'ختام الوضوء بغسل القدمين وقول: "أشهد أن لا إله إلا الله وأشهد أن محمداً عبده ورسوله".',
      },
    ],
    feedback: {
      successAr: isFemale
        ? 'ما شاء الله! وضوء مبارك وطهارة تامة تملأ قلبكِ بالسكينة والنور 🌿'
        : 'ما شاء الله! وضوء مبارك وطهارة تامة تملأ قلبك بالسكينة والنور 🌿',
      successEn: 'Excellent! You mastered the complete sequence of ablution with serenity.',
      scholarlyNoteAr: 'قال رسول الله ﷺ: «مَنْ تَوَضَّأَ فَأَحْسَنَ الْوُضُوءَ خَرَجَتْ خَطَايَاهُ مِنْ جَسَدِهِ حَتَّى تَخْرُجَ مِنْ تَحْتِ أَظْفَارِهِ» (صحيح مسلم).',
    },
    completionConditionAr: 'ترتيب خطوات الوضوء الـ 6 بالتسلسل الصحيح',
    isAiGenerated: true,
  };
}

// =========================================================================
// 8. TRAVEL & RAIN CONCESSIONS (Situational Waypoints)
// =========================================================================
function buildTravelConcessionsGame(isFemale: boolean, difficulty: LearningLevel): AiMiniGame {
  return {
    id: `game-travel-${Date.now()}`,
    titleAr: 'مسار المسافر: فقه الرخص والتيسير',
    titleEn: 'Traveler Path: Concessions & Situational Fiqh',
    subtitleAr: isFemale
      ? 'واجهي مواقف السفر والمطر واختاري الرخصة الفقهية المناسبة استناداً لحديث «إن الله يحب أن تؤتى رخصه».'
      : 'واجه مواقف السفر والمطر واختر الرخصة الفقهية المناسبة استناداً لحديث «إن الله يحب أن تؤتى رخصه».',
    subtitleEn: 'Navigate real travel situations and select the authentic legal concession.',
    topic: 'travel_rain',
    learningObjectiveAr: 'معرفة متى يشرع قصر الصلاة الرباعية، والجمع، ومتى يتم المسافر صلاته دون تفريط.',
    learningObjectiveEn: 'Recognizing valid concessions of shortening and combining prayers during journey.',
    sourceIds: ['src-fiqh-travel-rain-concessions'],
    mechanic: 'sorting',
    difficulty,
    sceneTheme: 'travel_road',
    categories: [
      {
        id: 'valid_concession',
        titleAr: 'رخصة مشروعة ومستحبة 🌿',
        titleEn: 'Valid Authentic Concession',
        descriptionAr: 'ما شرعه الله للتيسير كقصر المسافر والجمع في المطر الشديد.',
        color: '#2C483F',
        icon: 'Sparkles',
      },
      {
        id: 'invalid_practice',
        titleAr: 'تجاوز أو تفريط غير مشروع ⚠️',
        titleEn: 'Invalid Deviation',
        descriptionAr: 'إخراج الصلاة عن وقتها دون عذر أو قصر الصلاة في غير سفر.',
        color: '#C89B84',
        icon: 'AlertTriangle',
      },
    ],
    elements: [
      {
        id: 'tc-1',
        labelAr: 'قصر صلاة الظهر والعصر والعشاء إلى ركعتين للمسافر مسافة 150 كم',
        labelEn: 'Shortening 4-rakah prayers to 2 rakats for travel over 80 km',
        sublabelAr: 'رخصة قصر الصلاة في السفر',
        correctCategory: 'valid_concession',
        explanationAr: 'قصر الصلاة الرباعية سنة مؤكدة في السفر يحبها الله تعالى.',
      },
      {
        id: 'tc-2',
        labelAr: 'تأخير صلاة العصر حتى يخرج وقتها بعد مغيب الشمس بحجة السفر',
        labelEn: 'Delaying Asr past Maghrib claiming travel hardship',
        sublabelAr: 'إخراج الصلاة عن وقتها',
        correctCategory: 'invalid_practice',
        explanationAr: 'لا يجوز إخراج الصلاة عن وقتها، بل المسافر يجمع العصر مع الظهر تقديماً أو تأخيراً قبل المغرب.',
      },
      {
        id: 'tc-3',
        labelAr: 'الجمع بين صلاتي المغرب والعشاء في المسجد عند هطول مطر شديد وسيول',
        labelEn: 'Combining Maghrib & Isha at mosque during severe rain and floods',
        sublabelAr: 'رخصة المطر والسيول',
        correctCategory: 'valid_concession',
        explanationAr: 'رخصة المطر تبيح الجمع لدفع المشقة البالغة عن المصلين دون قصر لعدد الركعات.',
      },
      {
        id: 'tc-4',
        labelAr: 'قصر صلاة المغرب إلى ركعة ونصف وقصر الصبح إلى ركعة',
        labelEn: 'Shortening Maghrib or Fajr prayers',
        sublabelAr: 'قصر غير مشروع',
        correctCategory: 'invalid_practice',
        explanationAr: 'القصر خاص بالصلوات الرباعية فقط (الظهر والعصر والعشاء)، أما الفجر والمغرب فلا تقصران بإجماع.',
      },
    ],
    feedback: {
      successAr: isFemale
        ? 'مبارك! أتقنتِ فقه الرخص ومواقف السفر والجمع بحكمة وسكينة 🌿 دمتِ مطمئنة في حلك وترحالكِ.'
        : 'مبارك! أتقنت فقه الرخص ومواقف السفر والجمع بحكمة وسكينة 🌿 دمت مطمئناً في حلك وترحالك.',
      successEn: 'Congratulations! You mastered the nuances of travel and weather concessions with wisdom.',
      scholarlyNoteAr: 'روى ابن حبان عن ابن عمر رضي الله عنهما قال: قال رسول الله ﷺ: «إِنَّ اللَّهَ يُحِبُّ أَنْ تُؤْتَى رُخَصُهُ كَمَا يَكْرَهُ أَنْ تُؤْتَى مَعْصِيَتُهُ».',
    },
    completionConditionAr: 'تصنيف جميع أحكام السفر والمطر الـ 4 بنجاح',
    isAiGenerated: true,
  };
}

// =========================================================================
// 9. FOOD INSPECTION & TABLE DISCOVERY
// =========================================================================
function buildFoodInspectionGame(isFemale: boolean, difficulty: LearningLevel): AiMiniGame {
  return {
    id: `game-food-${Date.now()}`,
    titleAr: 'طاولة التحقق: فحص الحلال والمشتبهات',
    titleEn: 'Inspection Table: Halal & Ingredient Discernment',
    subtitleAr: isFemale
      ? 'افحصي الأطباق والمكونات على الطاولة، وحددي ما يحتاج إلى تدقيق وما الأصل فيه الحل بلا وسواس.'
      : 'افحص الأطباق والمكونات على الطاولة، وحدد ما يحتاج إلى تدقيق وما الأصل فيه الحل بلا وسواس.',
    subtitleEn: 'Inspect table items to discern what requires ingredient checking versus naturally pure foods.',
    topic: 'food_halal',
    learningObjectiveAr: 'إدراك أن الأصل في الطعام الطهارة والإباحة، وتحديد المكونات التي تتطلب فحصاً حقيقياً.',
    learningObjectiveEn: 'Understanding that foods are inherently pure, while identifying ingredients needing verification.',
    sourceIds: ['src-fiqh-food-inspection-rules', 'src-food-halal-principles'],
    mechanic: 'inspection',
    difficulty,
    sceneTheme: 'restaurant_table',
    elements: [
      {
        id: 'fd-1',
        labelAr: 'طبق سمك مشوي طازج مع ليمون وخضار',
        labelEn: 'Grilled fresh fish with lemon and vegetables',
        sublabelAr: 'صيد البحر الطازج',
        icon: 'Fish',
        isNeedsInspection: false,
        explanationAr: 'حلال طيب بإجماع! صيد البحر كله حلال ولا يشترط فيه ذبح خاص لقوله تعالى: ﴿أُحِلَّ لَكُمْ صَيْدُ الْبَحْرِ وَطَعَامُهُ﴾.',
        sourceId: 'src-fiqh-food-inspection-rules',
      },
      {
        id: 'fd-2',
        labelAr: 'وجبة لحم برجر مصنّع في مطعم عام غير موثق بحلال',
        labelEn: 'Processed beef burger in an uncertified restaurant',
        sublabelAr: 'لحم حيواني مصنع',
        icon: 'Beef',
        isNeedsInspection: true,
        explanationAr: 'يحتاج إلى تحقق! اللحوم تشترط التذكية الشرعية، فإذا لم يكن اللحم حلالاً مذكى أو من أهل الكتاب وجب التثبت.',
        sourceId: 'src-fiqh-food-inspection-rules',
      },
      {
        id: 'fd-3',
        labelAr: 'طبق باستا بصلصة طماطم وزيت زيتون وريحان',
        labelEn: 'Pasta with tomato sauce, olive oil, and basil',
        sublabelAr: 'مكونات نباتية خالصة',
        icon: 'Soup',
        isNeedsInspection: false,
        explanationAr: 'حلال طيب بالأصل! المكونات نباتية واضحة لا لبس فيها ولا تحتاج لأي قلق أو وسواس.',
        sourceId: 'src-food-halal-principles',
      },
      {
        id: 'fd-4',
        labelAr: 'حلوى هلامية (مارشميلو) تحتوي على جيلاتين ومستحلب E471',
        labelEn: 'Gummy marshmallows containing gelatin and E471 emulsifier',
        sublabelAr: 'مواد مضافة مشتبهة',
        icon: 'Cookie',
        isNeedsInspection: true,
        explanationAr: 'يحتاج إلى تدقيق العبوة! إذا كان الجيلاتين بقرياً مذكى أو المستحلب من مصدر نباتي حلّ، وإلا تجنبته.',
        sourceId: 'src-fiqh-food-inspection-rules',
      },
      {
        id: 'fd-5',
        labelAr: 'سلطة فواكه موسمية طازجة مع عصير برتقال',
        labelEn: 'Seasonal fruit salad with orange juice',
        sublabelAr: 'ثمار طبيعية نقية',
        icon: 'Apple',
        isNeedsInspection: false,
        explanationAr: 'حلال طيب بيقين! الثمار والفواكه من نعم الله المباحة بالأصل دون أي تدقيق.',
        sourceId: 'src-food-halal-principles',
      },
    ],
    feedback: {
      successAr: isFemale
        ? 'رائع جداً! استطعتِ التمييز بين الأطعمة الطبيعية المباحة بيقين، وبين ما يحتاج فعلاً إلى فحص وتثبت 🌿 هكذا يعيش المسلم براحة واعتدال.'
        : 'رائع جداً! استطعت التمييز بين الأطعمة الطبيعية المباحة بيقين، وبين ما يحتاج فعلاً إلى فحص وتثبت 🌿 هكذا يعيش المسلم براحة واعتدال.',
      successEn: 'Great job! You distinguished between inherently permissible foods and items requiring verification.',
      scholarlyNoteAr: 'القاعدة الفقهية الكبرى: «الأصل في الأشياء الإباحة حتى يدل الدليل على التحريم»، و«اليقين لا يزول بالشك».',
    },
    completionConditionAr: 'فحص جميع العناصر الـ 5 وتحديد حاجتها للتثبت',
    isAiGenerated: true,
  };
}

// =========================================================================
// 10. TAWHID VS IBADAH (Tree of Faith)
// =========================================================================
function buildTawheedGame(isFemale: boolean, difficulty: LearningLevel): AiMiniGame {
  return {
    id: `game-tawheed-${Date.now()}`,
    titleAr: 'شجرة الإيمان: أصل التوحيد وثمار العبادة',
    titleEn: 'Tree of Faith: Foundation of Tawhid & Acts of Worship',
    subtitleAr: isFemale
      ? 'صنفي المفاهيم بين أصل التوحيد واليقين القلبي، وبين العبادات العملية النابعة منه.'
      : 'صنّف المفاهيم بين أصل التوحيد واليقين القلبي، وبين العبادات العملية النابعة منه.',
    subtitleEn: 'Sort concepts between the foundation of Tawhid and practical acts of worship.',
    topic: 'aqeedah_tawhid',
    learningObjectiveAr: 'إدراك أن التوحيد هو الأصل واليقين القلبي، والعبادات هي الثمار العملية والأعمال الصالحة.',
    learningObjectiveEn: 'Understanding Tawhid as the creedal root, and acts of worship as its fruits.',
    sourceIds: ['src-aqeedah-tawhid-vs-ibadah', 'src-aqeedah-tawhid-definition'],
    mechanic: 'sorting',
    difficulty,
    sceneTheme: 'classroom',
    categories: [
      {
        id: 'root_tawheed',
        titleAr: 'أصل التوحيد بالقلب 🌟',
        titleEn: 'Foundation of Tawhid',
        descriptionAr: 'اليقين الجازم بأن الله وحده الخالق الرازق المستحق للعبادة وحده.',
        color: '#2C483F',
        icon: 'Shield',
      },
      {
        id: 'fruit_ibadah',
        titleAr: 'ثمار العبادة بالجوارح 🌸',
        titleEn: 'Acts of Worship',
        descriptionAr: 'الأعمال الصالحة والأقوال التي يحبها الله ويرضاها تطبيقاً للتوحيد.',
        color: '#88C947',
        icon: 'Heart',
      },
    ],
    elements: [
      {
        id: 'tw-1',
        labelAr: 'الإيقان بأن الله وحده هو خالق الكون ومدبره ورازق كل دابة دون شريك',
        labelEn: 'Certainty that Allah alone is the Creator and Sustainer without partner',
        sublabelAr: 'توحيد الربوبية',
        correctCategory: 'root_tawheed',
        explanationAr: 'هذا هو توحيد الربوبية وهو أساس الإيمان واليقين.',
        sourceId: 'src-aqeedah-tawhid-definition',
      },
      {
        id: 'tw-2',
        labelAr: 'الوقوف في الصلاة، والركوع، والدعاء بخشوع ورجاء في جوف الليل',
        labelEn: 'Standing in prayer and supplication with humility at night',
        sublabelAr: 'الصلاة والدعاء',
        correctCategory: 'fruit_ibadah',
        explanationAr: 'الصلاة والدعاء من أعظم العبادات الظاهرة والباطنة لله وحده.',
        sourceId: 'src-aqeedah-tawhid-vs-ibadah',
      },
      {
        id: 'tw-3',
        labelAr: 'إفراد الله وحده بالمحبة والتعظيم وإخلاص القصد والخوف والرجاء له',
        labelEn: 'Singling out Allah alone in supreme love, awe, and sincere intent',
        sublabelAr: 'توحيد الألوهية',
        correctCategory: 'root_tawheed',
        explanationAr: 'هذا صميم توحيد الألوهية وإخلاص الدين لله.',
        sourceId: 'src-aqeedah-tawhid-definition',
      },
      {
        id: 'tw-4',
        labelAr: 'إطعام المساكين، وبر الوالدين، والابتسامة في وجوه الناس وصدق الحديث',
        labelEn: 'Feeding the needy, kindness to parents, and smiling at others',
        sublabelAr: 'المعاملات والأخلاق',
        correctCategory: 'fruit_ibadah',
        explanationAr: 'كل عمل طيب بنية صالحة هو عبادة يثاب عليها المؤمن.',
        sourceId: 'src-aqeedah-tawhid-vs-ibadah',
      },
    ],
    feedback: {
      successAr: isFemale
        ? 'ممتاز! ربطتِ بين أصل التوحيد المتين في القلب وبين فيض العبادة والرحمة في الحياة 🌿'
        : 'ممتاز! ربطت بين أصل التوحيد المتين في القلب وبين فيض العبادة والرحمة في الحياة 🌿',
      successEn: 'Excellent! You harmonized between the root of Tawhid and the fruits of worship.',
      scholarlyNoteAr: 'التوحيد شجرة طيبة أصلها ثابت في القلب، وفرعها يزهر في السماء بالأعمال الصالحة.',
    },
    completionConditionAr: 'تصنيف جميع المفاهيم الـ 4 بنجاح',
    isAiGenerated: true,
  };
}

// =========================================================================
// 11. PARENTS DUTY (Wing of Humility)
// =========================================================================
function buildParentsGame(isFemale: boolean, difficulty: LearningLevel): AiMiniGame {
  return {
    id: `game-parents-${Date.now()}`,
    titleAr: 'جناح الذل: بر الوالدين والتعامل مع الخلاف',
    titleEn: 'Wing of Humility: Honoring Parents Through Life',
    subtitleAr: isFemale
      ? 'صنفي ردود الأفعال بين بر الوالدين المأمور به بالقرآن، وبين مسالك العقوق وسوء الخلق.'
      : 'صنّف ردود الأفعال بين بر الوالدين المأمور به بالقرآن، وبين مسالك العقوق وسوء الخلق.',
    subtitleEn: 'Sort behaviors into righteous dutifulness to parents vs harmful discord.',
    topic: 'ethics_parents',
    learningObjectiveAr: 'إدراك فضل بر الوالدين وخفض الجناح لهما بالقول اللين، وتجنب التأفف والرفع بالصوت حتى عند الاختلاف.',
    learningObjectiveEn: 'Recognizing filial piety, gentle speech, and avoiding harsh tones with parents.',
    sourceIds: ['src-hadith-deen-yusr'],
    mechanic: 'sorting',
    difficulty,
    sceneTheme: 'home_living',
    categories: [
      {
        id: 'birr',
        titleAr: 'بر وإحسان مأجور 🌸',
        titleEn: 'Righteous Filial Duty',
        descriptionAr: 'القول الكريم، والإنصات، وخفض الجناح، والدعاء لهما.',
        color: '#2C483F',
        icon: 'Heart',
      },
      {
        id: 'uquq',
        titleAr: 'عقوق وتأفف منهي عنه ⚠️',
        titleEn: 'Harmful Neglect / Disrespect',
        descriptionAr: 'رفع الصوت، والتأفف (أف)، وإظهار الضجر من طلباتهما.',
        color: '#C89B84',
        icon: 'AlertTriangle',
      },
    ],
    elements: [
      {
        id: 'pr-1',
        labelAr: 'خفض الصوت والإنصات باهتمام عند حديث الوالد أو الوالدة حتى لو كررا القصة',
        labelEn: 'Listening patiently with lowered voice even if parents repeat a story',
        sublabelAr: 'أدب الاستماع والمجالسة',
        correctCategory: 'birr',
        explanationAr: 'هذا من القول الكريم وخفض جناح الرحمة الذي أمر الله به في سورة الإسراء.',
      },
      {
        id: 'pr-2',
        labelAr: 'التأفف (قول أف) أو إغلاق الباب بقوة عند طلب الوالدة أمراً لا يناسب الرغبة',
        labelEn: 'Sighing with irritation ("Uff") or slamming door when asked for help',
        sublabelAr: 'إظهار الضجر',
        correctCategory: 'uquq',
        explanationAr: 'نهى الله صراحة عن أدنى درجات الضجر: ﴿فَلَا تَقُلْ لَهُمَا أُفٍّ وَلَا تَنْهَرْهُمَا﴾.',
      },
      {
        id: 'pr-3',
        labelAr: 'المبادرة بقضاء حوائج البيت وتقديم رغبة الوالدين برفق وابتسامة',
        labelEn: 'Taking initiative to help with home tasks with a cheerful smile',
        sublabelAr: 'المسارعة في الخدمة',
        correctCategory: 'birr',
        explanationAr: 'خدمة الوالدين من أعظم القربات وأحب الأعمال إلى الله بعد الصلاة.',
      },
      {
        id: 'pr-4',
        labelAr: 'تجاهل اتصالات الوالدين وتأخير الرد عليهما لأيام دون عذر حقيقي',
        labelEn: 'Ignoring parents calls and delaying reply for days without valid excuse',
        sublabelAr: 'القطيعة والإهمال',
        correctCategory: 'uquq',
        explanationAr: 'إهمال الوالدين وقطع التواصل معهما يورث القسوة وحرمان التوفيق.',
      },
    ],
    feedback: {
      successAr: isFemale
        ? 'مبارك يا أختي! رزقكِ الله بر والديكِ ورضاهما، وجعلكِ قرة عين لهما في الدنيا والآخرة 🌿'
        : 'مبارك يا أخي! رزقك الله بر والديك ورضاهما، وجعلك قرة عين لهما في الدنيا والآخرة 🌿',
      successEn: 'Excellent! You clearly identified the path of honoring parents and righteous speech.',
      scholarlyNoteAr: 'قال تعالى: ﴿وَقَضَى رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا إِمَّا يَبْلُغَنَّ عِنْدَكَ الْكِبَرَ أَحَدُهُمَا أَوْ كِلَاهُمَا فَلَا تَقُلْ لَهُمَا أُفٍّ وَلَا تَنْهَرْهُمَا وَقُلْ لَهُمَا قَوْلًا كَرِيمًا﴾ (الإسراء: 23).',
    },
    completionConditionAr: 'تصنيف جميع مواقف التعامل مع الوالدين الـ 4 بنجاح',
    isAiGenerated: true,
  };
}

// =========================================================================
// 12. SUJUD SAHW & DOUBT OVERCOMING
// =========================================================================
function buildSujudSahwGame(isFemale: boolean, difficulty: LearningLevel): AiMiniGame {
  return {
    id: `game-sahw-${Date.now()}`,
    titleAr: 'سجود السهو: علاج النسيان والشك بالصلاة',
    titleEn: 'Prostration of Forgetfulness: Overcoming Prayer Doubts',
    subtitleAr: isFemale
      ? 'صنفي القرارات الشرعية عند الشك أو النسيان في الصلاة لتطبيق قاعدة البناء على اليقين.'
      : 'صنّف القرارات الشرعية عند الشك أو النسيان في الصلاة لتطبيق قاعدة البناء على اليقين.',
    subtitleEn: 'Sort proper rulings when experiencing forgetfulness or doubts in prayer.',
    topic: 'sujud_sahw',
    learningObjectiveAr: 'إتقان التصرف الشرعي عند الشك في عدد الركعات، والنسيان للتشهد الأول، وتطبيق سجود السهو.',
    learningObjectiveEn: 'Mastering the rule of certainty when doubting rakah counts or omitting first Tashahhud.',
    sourceIds: ['src-fiqh-prayer-steps-order', 'src-hadith-deen-yusr'],
    mechanic: 'sorting',
    difficulty,
    sceneTheme: 'prayer_room',
    categories: [
      {
        id: 'sahw_correct',
        titleAr: 'الحكم النبوي الصحيح ✨',
        titleEn: 'Authentic Prophetic Rule',
        descriptionAr: 'البناء على اليقين وجبر النقص بسجدتي السهو دون قطع الصلاة.',
        color: '#2C483F',
        icon: 'Sparkles',
      },
      {
        id: 'sahw_mistake',
        titleAr: 'مسلك الوسواس والخطأ ⚠️',
        titleEn: 'Obsessive Mistake',
        descriptionAr: 'قطع الصلاة لمجرد الشك أو الاسترسال مع وسوسة الشيطان.',
        color: '#C89B84',
        icon: 'AlertTriangle',
      },
    ],
    elements: [
      {
        id: 'sh-1',
        labelAr: 'الشك بين 3 أو 4 ركعات: البناء على اليقين (وهو الأقل: 3) والإتيان برابعة ثم سجود السهو',
        labelEn: 'Doubting 3 or 4: build on certainty (lesser: 3), pray 4th, then Sujud Sahw',
        sublabelAr: 'الشك في عدد الركعات',
        correctCategory: 'sahw_correct',
        explanationAr: 'هذه هي القاعدة النبوية الجامعة: طرح الشك والبناء على ما استيقن ثم سجدتا السهو.',
      },
      {
        id: 'sh-2',
        labelAr: 'قطع الصلاة فوراً وإعادتها من الصفر عند كل شك عارض',
        labelEn: 'Severing prayer immediately and restarting for every passing doubt',
        sublabelAr: 'قطع الصلاة بالوسواس',
        correctCategory: 'sahw_mistake',
        explanationAr: 'لا يجوز قطع الصلاة لمجرد الشك؛ فإن الشريعة جعلت سجود السهو جبراً وترغيماً للشيطان.',
      },
      {
        id: 'sh-3',
        labelAr: 'نسيان التشهد الأول والاستتمام قائماً: المضي في الصلاة وسجود السهو قبل السلام',
        labelEn: 'Forgetting first Tashahhud & standing: continue and do Sujud Sahw before Tasleem',
        sublabelAr: 'نسيان واجب التشهد الأول',
        correctCategory: 'sahw_correct',
        explanationAr: 'إذا استتم المصلي قائماً مضى في صلاته وجبر ترك الواجب بسجدتي السهو قبل التسليم.',
      },
      {
        id: 'sh-4',
        labelAr: 'الرجوع للجلوس بعد الشروع بقراءة الفاتحة في الركعة الثالثة',
        labelEn: 'Returning down to sit after starting Fatihah in 3rd rakat',
        sublabelAr: 'الرجوع بعد استتمام القيام',
        correctCategory: 'sahw_mistake',
        explanationAr: 'يكره أو يبطل الرجوع بعد الشروع بركن القراءة، بل السنة المضي وجبره بسجود السهو.',
      },
    ],
    feedback: {
      successAr: isFemale
        ? 'تبارك الله! فهمتِ حكمة سجود السهو ورحمة الشريعة في دفع الوسواس وجبر النقص 🌿'
        : 'تبارك الله! فهمت حكمة سجود السهو ورحمة الشريعة في دفع الوسواس وجبر النقص 🌿',
      successEn: 'Great job! You mastered how to handle forgetfulness in prayer with tranquility.',
      scholarlyNoteAr: 'قال رسول الله ﷺ: «إِذَا شَكَّ أَحَدُكُمْ فِي صَلاَتِهِ فَلَمْ يَدْرِ كَمْ صَلَّى ثَلاَثاً أَمْ أَرْبَعاً، فَلْيَطْرَحِ الشَّكَّ وَلْيَبْنِ عَلَى مَا اسْتَيْقَنَ ثُمَّ يَسْجُدُ سَجْدَتَيْنِ قَبْلَ أَنْ يُسَلِّمَ» (صحيح مسلم).',
    },
    completionConditionAr: 'تصنيف جميع أحكام السهو والشك بالصلاة',
    isAiGenerated: true,
  };
}

// =========================================================================
// 13. IKHLAS & SINCERITY
// =========================================================================
function buildIkhlasGame(isFemale: boolean, difficulty: LearningLevel): AiMiniGame {
  return {
    id: `game-ikhlas-${Date.now()}`,
    titleAr: 'مرآة القصد: الإخلاص وحراسة النية',
    titleEn: 'Mirror of Intent: Sincerity & Guarding Deeds',
    subtitleAr: isFemale
      ? 'صنفي الأعمال بين ما هو خالص لوجه الله تعالى يثمر السكينة، وما دخله الرياء أو حب الثناء.'
      : 'صنّف الأعمال بين ما هو خالص لوجه الله تعالى يثمر السكينة، وما دخله الرياء أو حب الثناء.',
    subtitleEn: 'Sort actions into sincere deeds seeking Allah alone vs ostentatious behavior.',
    topic: 'aqeedah_ikhlas',
    learningObjectiveAr: 'معرفة أن قبول الأعمال مشروط بإخلاص النية لله ومتابعة هدي النبي ﷺ، وتجنب الرياء وإحباط الأجر.',
    learningObjectiveEn: 'Understanding sincerity of intention as a pillar for accepted deeds.',
    sourceIds: ['src-hadith-deen-yusr', 'src-aqeedah-tawhid-definition'],
    mechanic: 'sorting',
    difficulty,
    sceneTheme: 'classroom',
    categories: [
      {
        id: 'ikhlas',
        titleAr: 'إخلاص نقي لله 🌟',
        titleEn: 'Pure Sincere Intent',
        descriptionAr: 'قصد وجه الله ورضاه دون التفات لمدح الناس أو ثنائهم.',
        color: '#2C483F',
        icon: 'Sparkles',
      },
      {
        id: 'riyaa',
        titleAr: 'رياء أو حب ثناء ⚠️',
        titleEn: 'Seeking Praise / Show',
        descriptionAr: 'تحسين العمل لأجل نظر المخلوقين أو التباهي به في المجالس.',
        color: '#C89B84',
        icon: 'AlertTriangle',
      },
    ],
    elements: [
      {
        id: 'ik-1',
        labelAr: 'إعطاء صدقة خفية لمحتاج بالسر دون تصوير أو إخبار أحد بها',
        labelEn: 'Giving secret charity without filming or telling anyone',
        sublabelAr: 'صدقة السر',
        correctCategory: 'ikhlas',
        explanationAr: 'صدقة السر تطفئ غضب الرب، وصاحبها ممن يظلهم الله في ظله يوم لا ظل إلا ظله.',
      },
      {
        id: 'ik-2',
        labelAr: 'تصوير تقديم المساعدة للمساكين ونشرها في وسائل التواصل لكسب المتابعين والثناء',
        labelEn: 'Recording charity for social media to gain fame and public praise',
        sublabelAr: 'الاستعراض بالعمل',
        correctCategory: 'riyaa',
        explanationAr: 'إذا كان القصد مدح الناس والرياء ضاع أجر العمل؛ فالله أغنى الشركاء عن الشرك.',
      },
      {
        id: 'ik-3',
        labelAr: 'الاستغفار والدعاء في جوف الليل والناس نيام إخباتاً لله وحده',
        labelEn: 'Seeking forgiveness and praying in the quiet night unseen',
        sublabelAr: 'خبيئة الليل',
        correctCategory: 'ikhlas',
        explanationAr: 'عمل السر والخبيئة الصالحة من أصدق علامات الإخلاص ورسوخ الإيمان.',
      },
      {
        id: 'ik-4',
        labelAr: 'إطالة الصلاة وتحسين الركوع فقط حينما يراك زملاء العمل ليمدحوا تدينك',
        labelEn: 'Prolonging prayer only when watched by colleagues for compliments',
        sublabelAr: 'تحسين العمل للمخلوق',
        correctCategory: 'riyaa',
        explanationAr: 'هذا عين الرياء الذي حذر منه النبي ﷺ وسماه بالشرك الأصغر.',
      },
    ],
    feedback: {
      successAr: isFemale
        ? 'طاب سعيكِ! حراسة النية وإخلاص القلب لله هما مفتاح كل خير وسكينة في الحياة 🌿'
        : 'طاب سعيك! حراسة النية وإخلاص القلب لله هما مفتاح كل خير وسكينة في الحياة 🌿',
      successEn: 'Splendid! You mastered the discernment between pure intent and seeking human praise.',
      scholarlyNoteAr: 'قال رسول الله ﷺ: «إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى» (متفق عليه).',
    },
    completionConditionAr: 'تصنيف جميع الأعمال الـ 4 بنجاح',
    isAiGenerated: true,
  };
}

// =========================================================================
// 14. TRANQUILITY & RELEASING ANXIETY
// =========================================================================
function buildTranquilityMindGame(isFemale: boolean, difficulty: LearningLevel): AiMiniGame {
  return {
    id: `game-tranquility-${Date.now()}`,
    titleAr: 'واحة السكينة: تفريغ القلق وترسيخ اليقين',
    titleEn: 'Oasis of Serenity: Releasing Anxiety & Anchoring Hope',
    subtitleAr: isFemale
      ? 'واجهي أفكار القلق والضيق واستبدليها بحصون اليقين والأذكار النبوية المطمئنة.'
      : 'واجه أفكار القلق والضيق واستبدلها بحصون اليقين والأذكار النبوية المطمئنة.',
    subtitleEn: 'Disarm distressing thoughts by matching them with verified anchors of peace and dhikr.',
    topic: 'mental_peace',
    learningObjectiveAr: 'إدراك أن أسباب الطمأنينة بيد الله، والاستعانة بالذكر والدعاء وتفويض الأمر لرفع الهم والحزن.',
    learningObjectiveEn: 'Anchoring heart tranquility through prophetic supplications and relinquishing unwarranted fears.',
    sourceIds: ['src-hadith-deen-yusr', 'src-aqeedah-tawakkul-vs-tawaakul'],
    mechanic: 'sorting',
    difficulty,
    sceneTheme: 'desert_oasis',
    categories: [
      {
        id: 'serenity_anchor',
        titleAr: 'مرتكز السكينة واليقين 🌿',
        titleEn: 'Anchor of Serenity',
        descriptionAr: 'التسليم لله، واستشعار معيته، والاستعاذة من الهم والحزن.',
        color: '#2C483F',
        icon: 'Sparkles',
      },
      {
        id: 'anxiety_trap',
        titleAr: 'فخاخ القلق والوسواس ⚠️',
        titleEn: 'Anxiety Pitfall',
        descriptionAr: 'استباق الشرور المستقبلية واليأس من رحمة الله وتضخيم الخوف.',
        color: '#C89B84',
        icon: 'AlertTriangle',
      },
    ],
    elements: [
      {
        id: 'tq-1',
        labelAr: 'ترديد دعاء: "اللهم إني أعوذ بك من الهم والحزن، والعجز والكسل"',
        labelEn: 'Reciting: "O Allah, I seek refuge in You from grief, anxiety, and helplessness"',
        sublabelAr: 'الحصن النبوي للهم',
        correctCategory: 'serenity_anchor',
        explanationAr: 'كان النبي ﷺ يكثر من هذا الدعاء لأنه يعالج أسباب الاضطراب القلبي.',
      },
      {
        id: 'tq-2',
        labelAr: 'الاستسلام للأفكار السلبية القائلة: "كل جهودي ستفشل ولا أمل في المستقبل"',
        labelEn: 'Surrendering to thoughts claiming: "All my efforts will fail, there is no hope"',
        sublabelAr: 'اليأس وسوء الظن',
        correctCategory: 'anxiety_trap',
        explanationAr: 'اليأس وسوء الظن بالله من مداخل الشيطان التي تذهب السكينة وتثبط عن العمل.',
      },
      {
        id: 'tq-3',
        labelAr: 'استحضار قوله تعالى: ﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾ والتنفس الهادئ مع التسبيح',
        labelEn: 'Reflecting on "Verily in the remembrance of Allah do hearts find rest"',
        sublabelAr: 'بلسم الذكر والسكينة',
        correctCategory: 'serenity_anchor',
        explanationAr: 'ذكر الله هو الغذاء الحقيقي للروح والشفاء من اضطراب الأفكار.',
      },
      {
        id: 'tq-4',
        labelAr: 'المقارنة الدائمة مع الآخرين والشعور بالنقص والغبن على ما فات',
        labelEn: 'Constant toxic comparison with others feeling envious or resentful',
        sublabelAr: 'فخ المقارنة',
        correctCategory: 'anxiety_trap',
        explanationAr: 'النظر إلى من فضل عليك في الدنيا يورث السخط، والنبي ﷺ أمرنا بالنظر إلى من هو أسفل منا لنشكر النعمة.',
      },
    ],
    feedback: {
      successAr: isFemale
        ? 'أراح الله قلبكِ وملأه بالسكينة والنور 🌿 تذكري دوماً: ما أصابكِ لم يكن ليخطئكِ، وما قدره الله خير.'
        : 'أراح الله قلبك وملأه بالسكينة والنور 🌿 تذكر دوماً: ما أصابك لم يكن ليخطئك، وما قدره الله خير.',
      successEn: 'Peace be upon your heart! You anchored yourself in verified sources of serenity.',
      scholarlyNoteAr: 'قال النبي ﷺ: «عَجَبًا لِأَمْرِ الْمُؤْمِنِ، إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ، وَلَيْسَ ذَاكَ لِأَحَدٍ إِلَّا لِلْمُؤْمِنِ: إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْرًا لَهُ، وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ فَكَانَ خَيْرًا لَهُ» (صحيح مسلم).',
    },
    completionConditionAr: 'تصنيف جميع المرتكزات الـ 4 بنجاح',
    isAiGenerated: true,
  };
}

// =========================================================================
// 15. UNIVERSAL DYNAMIC VISUAL GENERATOR
// =========================================================================
function buildUniversalDynamicGame(
  userQuery: string,
  isFemale: boolean,
  difficulty: LearningLevel
): AiMiniGame {
  const queryClean = userQuery.trim() || 'فهم وتطبيق هدي التيسير';
  const shortTitle = queryClean.length > 35 ? `${queryClean.substring(0, 35)}...` : queryClean;

  return {
    id: `game-dynamic-${Date.now()}`,
    titleAr: `مشهد تفاعلي 2.5D: ${shortTitle}`,
    titleEn: `2.5D Interactive Experience: ${shortTitle}`,
    subtitleAr: isFemale
      ? `صنع رفيق لكِ هذا المشهد التفاعلي خصيصاً لمساعدتكِ على فهم وتثبيت: «${shortTitle}» عملياً.`
      : `صنع رفيق لك هذا المشهد التفاعلي خصيصاً لمساعدتك على فهم وتثبيت: «${shortTitle}» عملياً.`,
    subtitleEn: `Rafiq generated this interactive challenge to master: "${shortTitle}".`,
    topic: 'custom_learning_need',
    learningObjectiveAr: `إتقان وتطبيق الحكم الشرعي والهدي النبوي الموثق المتعلق بمسألة: ${shortTitle}، والتمييز بين الصواب والخطأ باليقين.`,
    learningObjectiveEn: `Mastering the correct understanding and action for: ${shortTitle}.`,
    sourceIds: ['src-hadith-deen-yusr', 'src-aqeedah-tawakkul-vs-tawaakul'],
    mechanic: 'sorting',
    difficulty,
    sceneTheme: 'classroom',
    categories: [
      {
        id: 'true_guidance',
        titleAr: 'الهدي الصحيح والمشروع 🌿',
        titleEn: 'Sound Authentic Practice',
        descriptionAr: 'ما وافق هدي النبي ﷺ وقواعد الشريعة والتيسير.',
        color: '#2C483F',
        icon: 'Sparkles',
      },
      {
        id: 'misconception',
        titleAr: 'الخطأ أو الغلو والتفريط ⚠️',
        titleEn: 'Misconception / Pitfall',
        descriptionAr: 'ما خالف السنة من الوسواس، أو التشدد بغير دليل، أو الإهمال.',
        color: '#C89B84',
        icon: 'AlertTriangle',
      },
    ],
    elements: [
      {
        id: 'dyn-1',
        labelAr: `الرجوع للأدلة المعتمدة وسؤال أهل العلم عند الإشكال في (${shortTitle}) مع استصحاب التيسير`,
        labelEn: `Seeking authentic knowledge on (${shortTitle}) with ease and confidence`,
        sublabelAr: 'موقف البحث والتثبت',
        correctCategory: 'true_guidance',
        explanationAr: 'العلم الشرعي المؤصل يدفع الشك ويبني اليقين والراحة في القلب.',
      },
      {
        id: 'dyn-2',
        labelAr: `الاسترسال مع الوسواس والشكوك بدعوى الاحتياط المبالغ فيه حتى تتعطل الحياة`,
        labelEn: `Succumbing to obsessive doubts claiming excessive precaution`,
        sublabelAr: 'فخ الغلو والوسوسة',
        correctCategory: 'misconception',
        explanationAr: 'الوسواس من الشيطان، والشريعة جاءت بدفع الحرج ورفع المشقة.',
      },
      {
        id: 'dyn-3',
        labelAr: `تطبيق هدي النبي ﷺ في التدرج والرفق وحسن الظن بالله والعمل الصالح المستمر`,
        labelEn: `Applying the Prophetic Sunnah of gradual progress, kindness, and steadfastness`,
        sublabelAr: 'هدي الاتزان والعمل',
        correctCategory: 'true_guidance',
        explanationAr: 'أحب العمل إلى الله أدومه وإن قل، والرفق ما كان في شيء إلا زانه.',
      },
      {
        id: 'dyn-4',
        labelAr: `التعصب للآراء غير الموثقة وتضليل الناس دون حجة شرعية معتبرة`,
        labelEn: `Adopting unverified opinions rigidly without authentic guidance`,
        sublabelAr: 'الاجتهاد بغير علم',
        correctCategory: 'misconception',
        explanationAr: 'الدين علم وتأصيل، والأصل في الفتوى التثبت وحسن البيان.',
      },
    ],
    feedback: {
      successAr: isFemale
        ? `أحسنتِ صنعاً يا أختي! أتممتِ تدريب «${shortTitle}» بنجاح وتثبت 🌿 استمري في طلب المعرفة بثقة وسكينة.`
        : `أحسنت صنعاً يا أخي! أتممت تدريب «${shortTitle}» بنجاح وتثبت 🌿 استمر في طلب المعرفة بثقة وسكينة.`,
      successEn: `Brilliant! You completed the challenge on "${shortTitle}" with clarity.`,
      scholarlyNoteAr: 'القاعدة الشرعية الكبرى: «إِنَّ الدِّينَ يُسْرٌ، وَلَنْ يُشَادَّ الدِّينَ أَحَدٌ إِلَّا غَلَبَهُ، فَسَدِّدُوا وَقَارِبُوا وَأَبْشِرُوا» (صحيح البخاري).',
    },
    completionConditionAr: 'تصنيف جميع المواقف الـ 4 في قسمها الصحيح',
    isAiGenerated: true,
  };
}
