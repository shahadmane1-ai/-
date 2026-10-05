/**
 * RAFIC_INTERNAL_CATALOGUE - The 30 Authoritative Accredited Kinetic Tactile Scenarios
 * Grounded strictly in: The New Muslim Guide (دليل المسلم الجديد), Dorar.net (الدرر السنية), and Bayyinat (كتاب بينات).
 */

export type ProceduralEngineType =
  | 'ENGINE_PRAYER_CORRECTION'
  | 'ENGINE_WUDU_PURITY'
  | 'ENGINE_SOCIAL_ETHICS'
  | 'ENGINE_TIMING_QIBLA'
  | 'ENGINE_DOUBT_VAULT'
  | 'ENGINE_STREET_CHARITY'
  | 'ENGINE_HEART_CERTAINTY';

export interface InternalCatalogueScenario {
  numericId: number; // 1 to 30
  id: string; // 'scen_1' .. 'scen_30'
  group: 1 | 2 | 3 | 4 | 5 | 6;
  groupTitleAr: string;
  groupTitleEn: string;
  targetEngine: ProceduralEngineType;
  conceptTitle: string;
  conceptTitleEn: string;
  fiqhSource: string;
  shortGuidance: string;
  shortGuidanceEn: string;
  interactiveSteps: string[];
  remedialButtonText: string;
  tranquilityDelta: number;
  keywords: string[];
  compoundPhrases: string[];
  rootRegex?: RegExp;
  initialEngineData?: any;
  hadithReference: {
    textAr: string;
    sourceAr: string;
  };
  rafiqMessage: {
    maleAr: string;
    femaleAr: string;
  };
}

export const RAFIC_INTERNAL_CATALOGUE: InternalCatalogueScenario[] = [
  // =========================================================================
  // GROUP 1: PRAYER CORRECTION & RECTIFICATION (عوارض وأخطاء الصلاة)
  // =========================================================================
  {
    numericId: 1,
    id: 'scen_1',
    group: 1,
    groupTitleAr: 'عوارض وأخطاء الصلاة',
    groupTitleEn: 'Prayer Correction & Rectification',
    targetEngine: 'ENGINE_PRAYER_CORRECTION',
    conceptTitle: 'نسيان التشهد الأول والقيام للثالثة',
    conceptTitleEn: 'Missed First Tashahhud',
    fiqhSource: 'دليل المسلم الجديد — صحيح البخاري',
    shortGuidance: 'إذا نسيت التشهد الأول واستتممت قائماً، فلا ترجع إليه، وأكمل صلاتك واسجد سجدتي السهو قبل التسليم صيانةً لصلاتك.',
    shortGuidanceEn: 'If you stood upright for the 3rd rak\'ah forgetting the first tashahhud, do not return. Continue prayer and perform two prostrations before salam.',
    interactiveSteps: [
      'استمرار القيام وإتمام الركعة دون الرجوع للجلوس',
      'إكمال باقي الصلاة بسكينة وطمأنينة',
      'الجلوس للتشهد الأخير',
      'سجدتا السهو قبل السلام جبراً للواجب المتروك',
    ],
    remedialButtonText: '(انقر) متابعة القيام وسجدتا السهو قبل السلام',
    tranquilityDelta: 20,
    keywords: ['تشهد اول', 'نسيت التشهد', 'قمت للثالثة', 'ركعة ثالثة', 'سهوت عن الجلوس', 'تركت التشهد', 'ما جلست', 'نسيت التحيات', 'forgot tashahhud', 'first tashahhud', 'stood for third'],
    compoundPhrases: ['نسيان التشهد', 'التشهد الاول', 'القيام للثالثة', 'نسيت التحيات', 'قمت للثالثة ناسي التشهد', 'missed tashahhud', 'first tashahhud', 'stood for third'],
    rootRegex: /(تشهد\s*اول|نسيت\s*التشهد|قمت\s*ل?لثالث[ةه]|فاتني\s*التشهد|missed\s*tashahhud|first\s*tashahhud|stood\s*for\s*third)/i,
    initialEngineData: { scenarioId: 1, posture: 'standing', doubtType: 'missed_tashahhud' },
    hadithReference: {
      textAr: '«إِذَا قَامَ أَحَدُكُمْ مِنَ الرَّكْعَتَيْنِ فَلَمْ يَسْتَتِمَّ قَائِمًا فَلْيَجْلِسْ، فَإِذَا اسْتَتَمَّ قَائِمًا فَلَا يَجْلِسْ، وَيَسْجُدُ سَجْدَتَيِ السَّهْوِ»',
      sourceAr: 'سنن أبي داود وصحيح البخاري بمعناه — حديث عبد الله بن بحينة',
    },
    rafiqMessage: {
      maleAr: 'يا أخي الحبيب، لا تقلق من طروء السهو في صلاتك؛ فقد سها النبي ﷺ ليعلمنا كيف نجبر صلاتنا برحمة وتيسير. استمر في قيامك واسجد سجدتي السهو قبل السلام.',
      femaleAr: 'يا أختي الحبيبة، لا تقلقي من طروء السهو في صلاتكِ؛ فقد سها النبي ﷺ ليعلمنا كيف نجبر صلاتنا برحمة وتيسير. استمري في قيامكِ واسجدي سجدتي السهو قبل السلام.',
    },
  },
  {
    numericId: 2,
    id: 'scen_2',
    group: 1,
    groupTitleAr: 'عوارض وأخطاء الصلاة',
    groupTitleEn: 'Prayer Correction & Rectification',
    targetEngine: 'ENGINE_PRAYER_CORRECTION',
    conceptTitle: 'الشك في عدد الركعات (3 أم 4)',
    conceptTitleEn: 'Doubt in Rak\'ah Count',
    fiqhSource: 'صحيح مسلم — باب البناء على اليقين',
    shortGuidance: 'إذا شككت في عدد الركعات فلم تدرِ أثلاثاً صليت أم أربعاً، فاطرح الشك وابنِ على ما استيقنت (وهو الأقل 3)، ثم أتم ركعتك واسجد سجدتي السهو.',
    shortGuidanceEn: 'If in doubt between 3 or 4 rak\'ahs, discard doubt and build upon certainty (the lower count: 3), complete the prayer, and do Sujud Sahw.',
    interactiveSteps: [
      'طرح الشك والبناء على اليقين (الأقل: 3)',
      'القيام للإتيان بالركعة الرابعة المتبقية بيقين',
      'الجلوس للتشهد الأخير وقراءة التحيات',
      'تطبيق سجدتي السهو قبل السلام ترغيماً للشيطان',
    ],
    remedialButtonText: '(انقر) البناء على اليقين (3) وسجود السهو',
    tranquilityDelta: 20,
    keywords: ['شاك في الركعات', '3 ام 4', 'كم ركعة', 'شككت بالعدد', 'الركعة الثالثة', 'الركعة الرابعة', 'doubt rakah', '3 or 4', 'how many rakahs', 'rakah count'],
    compoundPhrases: ['الشك في الركعات', 'ثلاث ام اربع', 'عدد الركعات', 'شك بالصلاة', 'كم صليت ركعة', 'doubt in rakah', 'three or four', 'rakah count doubt'],
    rootRegex: /(الشك\s*في\s*الركعات|3\s*ام\s*4|ثلاث\s*ام\s*اربع|كم\s*ركع[ةه]|شككت\s*ب?العدد|doubt\s*rakah|three\s*or\s*four)/i,
    initialEngineData: { scenarioId: 2, posture: 'sitting', doubtType: 'doubt_count' },
    hadithReference: {
      textAr: '«إِذَا شَكَّ أَحَدُكُمْ فِي صَلَاتِهِ فَلَمْ يَدْرِ كَمْ صَلَّى ثَلَاثًا أَمْ أَرْبَعًا، فَلْيَطْرَحِ الشَّكَّ وَلْيَبْنِ عَلَى مَا اسْتَيْقَنَ»',
      sourceAr: 'صحيح مسلم — حديث أبي سعيد الخدري رضي الله عنه',
    },
    rafiqMessage: {
      maleAr: 'يا أخي الكريم، الشك في الركعات لا يفسد صلاتك؛ ابنِ دائماً على الأقل واستشعر فضل سجدتي السهو في طرد وسواس الشيطان.',
      femaleAr: 'يا أختي الكريمة، الشك في الركعات لا يفسد صلاتكِ؛ ابني دائماً على الأقل واستشعري فضل سجدتي السهو في طرد وسواس الشيطان.',
    },
  },
  {
    numericId: 3,
    id: 'scen_3',
    group: 1,
    groupTitleAr: 'عوارض وأخطاء الصلاة',
    groupTitleEn: 'Prayer Correction & Rectification',
    targetEngine: 'ENGINE_PRAYER_CORRECTION',
    conceptTitle: 'الكلام أو الضحك العارض غلبة في الصلاة',
    conceptTitleEn: 'Involuntary Laughter or Slip of Speech',
    fiqhSource: 'الموسوعة الفقهية — الدرر السنية',
    shortGuidance: 'الحركات اليسيرة العارضة والضحك غلبة أو التكلم سهواً لا يبطل الصلاة إذا بادر المسلم لكتمه واستغفر في نفسه وواصل صلاته بخشوع.',
    shortGuidanceEn: 'Involuntary giggles or brief accidental words do not invalidate prayer if suppressed immediately and focus is restored.',
    interactiveSteps: [
      'كتم الضحك والاستغفار في النفس فوراً',
      'استعادة الخشوع ومواصلة الفريضة دون قطعها',
      'التركيز على تدبر آيات الفاتحة والذكر',
      'إتمام الصلاة بسكينة وطمأنينة قلبية',
    ],
    remedialButtonText: '(انقر) استعادة الخشوع ومواصلة الفريضة',
    tranquilityDelta: 20,
    keywords: ['ضحكت بالصلاة', 'تكلمت سهوا', 'خرج صوت', 'ضحك غلبة', 'كلام عارض', 'laughed in prayer', 'spoke accidentally', 'giggle salah'],
    compoundPhrases: ['ضحك في الصلاة', 'كلام في الصلاة', 'ضحكت سهوا', 'ضحك بالصلاة', 'تكلمت في الصلاة', 'laughed in prayer', 'spoke in prayer'],
    rootRegex: /(ضحك.*صل[اةه]|تكلمت.*صل[اةه]|ضحكت\s*سهوا|كلام\s*عارض|laughed\s*in\s*prayer|spoke\s*accidentally)/i,
    initialEngineData: { scenarioId: 3, posture: 'standing', doubtType: 'involuntary_action' },
    hadithReference: {
      textAr: '«إِنَّ اللَّهَ يُحِبُّ الْعُطَاسَ وَيَكْرَهُ التَّثَاؤُبَ.. وَإِنَّ فِي الصَّلَاةِ لَشُغْلًا»',
      sourceAr: 'صحيح البخاري والدرر السنية — باب ما يعفى عنه في الصلاة',
    },
    rafiqMessage: {
      maleAr: 'يا أخي، العوارض غير المقصودة معفو عنها؛ اكتم الضحكة فوراً وتنفس بهدوء واستحضر عظمة من تقف بين يديه.',
      femaleAr: 'يا أختي، العوارض غير المقصودة معفو عنها؛ اكتمي الضحكة فوراً وتنفّسي بهدوء واستحضري عظمة من تقفين بين يديه.',
    },
  },
  {
    numericId: 4,
    id: 'scen_4',
    group: 1,
    groupTitleAr: 'عوارض وأخطاء الصلاة',
    groupTitleEn: 'Prayer Correction & Rectification',
    targetEngine: 'ENGINE_PRAYER_CORRECTION',
    conceptTitle: 'نسيان ركن كالسجود وتذكره في الركعة التالية',
    conceptTitleEn: 'Missed Essential Pillar (Sujud/Ruku)',
    fiqhSource: 'المتون الميسرة — دليل المسلم الجديد',
    shortGuidance: 'الركن كالسجود لا يسقط بالسهو؛ تُلغى الركعة الفاسدة التي نقص منها الركن وتقوم الركعة الحالية مقامها، ويسجد للسهو بعد السلام.',
    shortGuidanceEn: 'An essential pillar is not dropped by mistake; the incomplete rak\'ah is canceled, replaced by the current one, followed by Sujud Sahw.',
    interactiveSteps: [
      'إلغاء الركعة التي نقص منها الركن',
      'احتساب الركعة الحالية بديلاً عنها فوراً',
      'إتمام باقي ركعات الصلاة كاملة',
      'سجدتا السهو بعد السلام صيانة للفريضة',
    ],
    remedialButtonText: '(انقر) إلغاء الركعة الناقصة واستبدالها بركعة تامة',
    tranquilityDelta: 20,
    keywords: ['نسيت سجدة', 'نسيت ركوع', 'نسيان ركن', 'سجدة واحدة', 'ركعة ناقصة', 'missed prostration', 'forgot sujud', 'missed ruku', 'missed pillar'],
    compoundPhrases: ['نسيان سجدة', 'نسيان ركوع', 'نسيان ركن', 'نسيت سجدة وتذكرت', 'missed prostration', 'forgot sujud', 'missed ruku'],
    rootRegex: /(نسيان\s*سجد[ةه]|نسيت\s*سجد[ةه]|نسيان\s*ركوع|نسيان\s*ركن|ركن\s*ناقص|missed\s*sujud|missed\s*pillar|forgot\s*sujud)/i,
    initialEngineData: { scenarioId: 4, posture: 'standing', doubtType: 'missed_pillar' },
    hadithReference: {
      textAr: '«مَنْ نَسِيَ صَلَاةً أَوْ شَيْئًا مِنْهَا فَلْيُصَلِّهَا كَمَا هِيَ وَيَسْجُدُ سَجْدَتَيِ السَّهْوِ»',
      sourceAr: 'سنن أبي داود وصحيح ابن خزيمة — فقه تدارك الأركان',
    },
    rafiqMessage: {
      maleAr: 'يا أخي، القاعدة الشرعية سهلة: الركعة التي سقط منها ركن تلغى، وتواصل صلاتك بركعة بديلة ثم تسجد للسهو بعد السلام.',
      femaleAr: 'يا أختي، القاعدة الشرعية سهلة: الركعة التي سقط منها ركن تلغى، وتواصلين صلاتكِ بركعة بديلة ثم تسجدين للسهو بعد السلام.',
    },
  },
  {
    numericId: 5,
    id: 'scen_5',
    group: 1,
    groupTitleAr: 'عوارض وأخطاء الصلاة',
    groupTitleEn: 'Prayer Correction & Rectification',
    targetEngine: 'ENGINE_PRAYER_CORRECTION',
    conceptTitle: 'الوسوسة وهجوم الأفكار المشوشة في الصلاة (خنزب)',
    conceptTitleEn: 'Combating Whispers in Salah (Khanzab)',
    fiqhSource: 'صحيح مسلم — حديث عثمان بن أبي العاص',
    shortGuidance: 'إذا أحسست بوسوسة أو شرود، فانفث عن يسارك ثلاثاً واستعذ بالله من الشيطان الرجيم؛ فإنه يذهب عنك وتستقر طمأنينتك.',
    shortGuidanceEn: 'When overwhelmed by intrusive thoughts in prayer, spit dryly (puff) thrice over your left shoulder and seek refuge with Allah.',
    interactiveSteps: [
      'الالتفات الخفيف لليسار والنفث ثلاثاً',
      'الاستعاذة بالله: «أعوذ بالله من الشيطان الرجيم»',
      'تجديد استحضار الوقوف بين يدي الله',
      'متابعة القراءة بهدوء وتؤدة',
    ],
    remedialButtonText: '(انقر) النفث الخفيف 3 مرات عن اليسار والتعوذ',
    tranquilityDelta: 20,
    keywords: ['وسواس الصلاة', 'خنزب', 'تشتت', 'سرحان', 'وساوس', 'شيطان الصلاة', 'waswas prayer', 'khanzab', 'intrusive thoughts salah'],
    compoundPhrases: ['وسواس الصلاة', 'وسوسة خنزب', 'تشتت الذهن', 'شيطان الصلاة خنزب', 'waswas in prayer', 'whispers in salah'],
    rootRegex: /(وسواس\s*الصلاة|خنزب|تشتت\s*الذهن|وساوس\s*في\s*الصلاة|waswas|khanzab|whispers\s*in\s*salah)/i,
    initialEngineData: { scenarioId: 5, posture: 'standing', doubtType: 'waswas_khanzab' },
    hadithReference: {
      textAr: '«ذَاكَ شَيْطَانٌ يُقَالُ لَهُ خَنْزَبٌ، فَإِذَا أَحْسَسْتَهُ فَتَعَوَّذْ بِاللهِ مِنْهُ، وَاتْفُلْ عَلَى يَسَارِكَ ثَلَاثًا»',
      sourceAr: 'صحيح مسلم — رواية عثمان بن أبي العاص رضي الله عنه',
    },
    rafiqMessage: {
      maleAr: 'يا بني ويا أخي، الشيطان يغيظه إقبالك على الصلاة؛ اتبع التوجيه النبوي بالنفث اليسير والاستعاذة وسترى كيف تتبدد الوساوس فوراً.',
      femaleAr: 'يا بنيتي ويا أختي، الشيطان يغيظه إقبالكِ على الصلاة؛ اتبعي التوجيه النبوي بالنفث اليسير والاستعاذة وسترين كيف تتبدد الوساوس فوراً.',
    },
  },

  // =========================================================================
  // GROUP 2: PURITY & WUDU EMERGENCIES (طوارئ ورخص الطهارة)
  // =========================================================================
  {
    numericId: 6,
    id: 'scen_6',
    group: 2,
    groupTitleAr: 'طوارئ ورخص الطهارة',
    groupTitleEn: 'Purity & Wudu Emergencies',
    targetEngine: 'ENGINE_WUDU_PURITY',
    conceptTitle: 'المسح على الجبيرة أو اللصقة الطبية',
    conceptTitleEn: 'Wiping Over Cast / Bandage',
    fiqhSource: 'الموسوعة الفقهية — الدرر السنية',
    shortGuidance: 'يجزئ المسح بالماء على ظاهر الجبيرة أو اللاصق الطبي مرة واحدة باليد المبللة دون غسل يضر العضو المصاب.',
    shortGuidanceEn: 'It suffices to wipe gently with wet hands once over a medical cast or bandage without removing it or harming the injury.',
    interactiveSteps: [
      'غسل الأعضاء السليمة بالماء كالمعتاد',
      'تبليل الكف بالماء النظيف دون إسراف',
      'المسح بلطف فوق الضمادة أو الجبيرة مسحة واحدة',
      'إتمام باقي الوضوء دون نزع اللاصق الطبي',
    ],
    remedialButtonText: '(انقر) تمرير بلل الكف برفق فوق الجبيرة',
    tranquilityDelta: 20,
    keywords: ['جبيرة', 'ضمادة', 'لصقة طبية', 'شاش', 'كسر', 'جرح', 'wiping over cast', 'bandage wudu', 'cast wudu', 'medical dressing'],
    compoundPhrases: ['المسح على الجبيرة', 'المسح على اللصقة', 'وضوء الجبيرة', 'المسح على الضمادة', 'wiping over cast', 'bandage wudu', 'cast wudu'],
    rootRegex: /(جبير[ةه]|ضماد[ةه]|شاش|كسر.*وضوء|لصق[ةه]\s*طبي[ةه]|wiping\s*over\s*cast|bandage\s*wudu|cast\s*wudu)/i,
    initialEngineData: { scenarioId: 6, waterVolumeMl: 500, mode: 'bandage_wipe' },
    hadithReference: {
      textAr: '«إِنَّمَا كَانَ يَكْفِيهِ أَنْ يَتَيَمَّمَ وَيَعْصِبَ عَلَى جُرْحِهِ خِرْقَةً ثُمَّ يَمْسَحَ عَلَيْهَا»',
      sourceAr: 'سنن أبي داود والدرر السنية — باب المسح على الجبائر',
    },
    rafiqMessage: {
      maleAr: 'يا أخي، سلامتك وعافيتك أولوية شرعية؛ امسح برفق بالماء على ظاهر الجبيرة دون نزعها وصلاتك صحيحة تامة.',
      femaleAr: 'يا أختي، سلامتكِ وعافيتكِ أولوية شرعية؛ امسحي برفق بالماء على ظاهر الجبيرة دون نزعها وصلاتكِ صحيحة تامة.',
    },
  },
  {
    numericId: 7,
    id: 'scen_7',
    group: 2,
    groupTitleAr: 'طوارئ ورخص الطهارة',
    groupTitleEn: 'Purity & Wudu Emergencies',
    targetEngine: 'ENGINE_WUDU_PURITY',
    conceptTitle: 'الوضوء في البرد القارس وتعذر تسخين الماء',
    conceptTitleEn: 'Minimal Wudu in Extreme Cold',
    fiqhSource: 'صحيح البخاري — باب الوضوء مرة مرة',
    shortGuidance: 'الواجب المجزئ في الوضوء غسلة واحدة تامة تعم العضو، وهي كافية شرعاً وترفع الحرج والمشقة في البرد القارس.',
    shortGuidanceEn: 'Washing each limb thoroughly once (1/1) is the complete valid obligation in Islam, lifting burden in freezing cold.',
    interactiveSteps: [
      'فتح الصنبور بتدفق خفيف مقتصد',
      'تعميم العضو بغسلة واحدة تامة ترفع المشقة',
      'استحضار أجر إسباغ الوضوء على المكاره',
      'تجفيف الأعضاء سريعاً لتدفئتها',
    ],
    remedialButtonText: '(انقر) إسباغ غسلة واحدة تامة لكل عضو',
    tranquilityDelta: 20,
    keywords: ['وضوء في البرد', 'ماء مثلج', 'برد قارس', 'صقيع', 'شتاء', 'wudu in cold', 'freezing water wudu', 'cold weather wudu'],
    compoundPhrases: ['الوضوء في البرد', 'برد قارس', 'ماء بارد جدا', 'وضوء البرد', 'wudu in cold', 'freezing water wudu'],
    rootRegex: /(الوضوء\s*في\s*البرد|برد\s*قارس|ماء\s*مثلج|صقيع|wudu\s*in\s*cold|freezing\s*water\s*wudu)/i,
    initialEngineData: { scenarioId: 7, waterVolumeMl: 400, mode: 'meter_gauge' },
    hadithReference: {
      textAr: '«تَوَضَّأَ النَّبِيُّ ﷺ مَرَّةً مَرَّةً»',
      sourceAr: 'صحيح البخاري — رواية ابن عباس رضي الله عنهما',
    },
    rafiqMessage: {
      maleAr: 'يا أخي، غسلة واحدة شاملة لكل عضو تجزئك وتسقط عنك مشقة البرد، ولك أجر عظيم على طاعتك.',
      femaleAr: 'يا أختي، غسلة واحدة شاملة لكل عضو تجزئكِ وتسقط عنكِ مشقة البرد، ولكِ أجر عظيم على طاعتكِ.',
    },
  },
  {
    numericId: 8,
    id: 'scen_8',
    group: 2,
    groupTitleAr: 'طوارئ ورخص الطهارة',
    groupTitleEn: 'Purity & Wudu Emergencies',
    targetEngine: 'ENGINE_WUDU_PURITY',
    conceptTitle: 'الشك القهري في انتقاض الوضوء أثناء الصلاة',
    conceptTitleEn: 'Compulsive Gas / Wind Doubt',
    fiqhSource: 'صحيح البخاري — باب لا ينصرف حتى يسمع صوتاً أو يجد ريحاً',
    shortGuidance: 'لا تخرج من الصلاة ولا تعد الوضوء لمجرد حركة في البطن أو وسواس؛ اليقين بطهارتك باقٍ حتى تسمع صوتاً أو تجد ريحاً محققاً.',
    shortGuidanceEn: 'Do not interrupt prayer based on stomach sensations. Purity remains certain unless you distinctly hear a sound or smell an odor.',
    interactiveSteps: [
      'استحضار قاعدة: «اليقين لا يزول بالشك»',
      'تجاهل حركة الغازات الخفيفة في البطن',
      'عدم قطع الصلاة إلا بصوت محقق أو رائحة تامة',
      'تثبيت طهارة اليقين وقطع وساوس الشيطان',
    ],
    remedialButtonText: '(انقر) البقاء في الصلاة اعتماداً على اليقين',
    tranquilityDelta: 20,
    keywords: ['شك في الوضوء', 'ريح', 'نقض', 'وسواس الوضوء', 'بطني يتحرك', 'doubt breaking wudu', 'phantom gas prayer', 'broke wudu doubt'],
    compoundPhrases: ['الشك في الوضوء', 'انتقاض الوضوء', 'شك في خروج ريح', 'شكيت في الوضوء', 'doubt breaking wudu', 'broke wudu doubt'],
    rootRegex: /(شك.*وضوء|خروج\s*ريح|انتقاض\s*الوضوء|بطني\s*يتحرك|doubt.*wudu|phantom\s*gas)/i,
    initialEngineData: { scenarioId: 8, waterVolumeMl: 650, mode: 'certainty_shield' },
    hadithReference: {
      textAr: '«لَا يَنْصَرِفْ حَتَّى يَسْمَعَ صَوْتًا، أَوْ يَجِدَ رِيحًا»',
      sourceAr: 'صحيح البخاري ومسلم — حديث عبد الله بن زيد رضي الله عنه',
    },
    rafiqMessage: {
      maleAr: 'يا أخي، الشيطان يحاول قطع صلتك بربك بالوساوس؛ اثبت في صلاتك بيقين فالأصل بقاء طهارتك.',
      femaleAr: 'يا أختي، الشيطان يحاول قطع صلتكِ بربكِ بالوساوس؛ اثبتي في صلاتكِ بيقين فالأصل بقاء طهارتكِ.',
    },
  },
  {
    numericId: 9,
    id: 'scen_9',
    group: 2,
    groupTitleAr: 'طوارئ ورخص الطهارة',
    groupTitleEn: 'Purity & Wudu Emergencies',
    targetEngine: 'ENGINE_WUDU_PURITY',
    conceptTitle: 'العجز التام عن استعمال الماء (التيمم)',
    conceptTitleEn: 'Dry Ablution (Tayammum)',
    fiqhSource: 'دليل المسلم الجديد — المتون الميسرة',
    shortGuidance: 'التيمم ضربة واحدة بالأكف على الصعيد الطاهر (تراب أو حجر) ثم مسح الوجه والكفين عند انعدام الماء أو تعذر استعماله.',
    shortGuidanceEn: 'Tayammum is performed with a single gentle tap on clean earth/stone, then wiping the face and hands once.',
    interactiveSteps: [
      'استحضار النية بالقلب لاستباحة الصلاة',
      'ضرب الصعيد الطاهر (تراب أو حجر) ضربة واحدة خفيفة',
      'مسح الوجه كاملاً بالكفين',
      'مسح ظاهر الكفين بعضهما ببعض والانتهاء بطمأنينة',
    ],
    remedialButtonText: '(انقر) ضربة واحدة باليدين ومسح الوجه والكفين',
    tranquilityDelta: 20,
    keywords: ['تيمم', 'صعيد', 'تراب', 'حجر', 'انعدام الماء', 'العجز عن الماء', 'tayammum', 'dry ablution', 'no water prayer', 'clean earth'],
    compoundPhrases: ['التيمم بالتراب', 'العجز عن الماء', 'كيفية التيمم', 'التيمم بالحجر', 'how to tayammum', 'dry ablution'],
    rootRegex: /(تيمم|صعيد\s*طيب|العجز\s*عن\s*الماء|انعدام\s*الماء|ضربة\s*بالتراب|tayammum|dry\s*ablution)/i,
    initialEngineData: { scenarioId: 9, waterVolumeMl: 0, mode: 'tayammum' },
    hadithReference: {
      textAr: '«إِنَّمَا كَانَ يَكْفِيكَ أَنْ تَصْنَعَ هَكَذَا، فَضَرَبَ بِكَفَّيْهِ ضَرْبَةً عَلَى الْأَرْضِ.. ثُمَّ مَسَحَ بِهِمَا وَجْهَهُ وَكَفَّيْهِ»',
      sourceAr: 'صحيح البخاري — حديث عمار بن ياسر رضي الله عنه',
    },
    rafiqMessage: {
      maleAr: 'يا أخي، جعل الله لك الأرض مسجداً وطهوراً؛ ضربة واحدة باليدين على الحجر أو التراب تجعلك طاهراً للصلاة فوراً.',
      femaleAr: 'يا أختي، جعل الله لكِ الأرض مسجداً وطهوراً؛ ضربة واحدة باليدين على الحجر أو التراب تجعلكِ طاهرة للصلاة فوراً.',
    },
  },
  {
    numericId: 10,
    id: 'scen_10',
    group: 2,
    groupTitleAr: 'طوارئ ورخص الطهارة',
    groupTitleEn: 'Purity & Wudu Emergencies',
    targetEngine: 'ENGINE_WUDU_PURITY',
    conceptTitle: 'رذاذ الوحل وطهارة الثياب في الشارع',
    conceptTitleEn: 'Street Mud Splashes on Garments',
    fiqhSource: 'المتون الميسرة — قاعدة الأصل في الأشياء الطهارة',
    shortGuidance: 'طين الشوارع والأوحال معفو عنها شرعاً والأصل بقاء الثياب على الطهارة؛ صلِّ في ثيابك دون حاجة لتبديلها أو الوسوسة فيها.',
    shortGuidanceEn: 'Street mud and rainwater splashes on garments are legally pardoned in Islamic fiqh; clothes remain pure by default.',
    interactiveSteps: [
      'استصحاب الأصل المحكم: «الأصل في الثياب الطهارة»',
      'العفو التام عن طين الشوارع ورذاذ المطر',
      'عدم تكلف غسل الملابس أو تبديلها للوسواس',
      'الدخول في الصلاة بالثوب الحالي بقلب مطمئن',
    ],
    remedialButtonText: '(انقر) اعتماد قاعدة (الأصل في الأشياء الطهارة)',
    tranquilityDelta: 20,
    keywords: ['طين', 'وحل', 'رذاذ', 'طين الشارع', 'وسخ الثياب', 'بركة ماء', 'street mud clothes', 'mud splash pants', 'dirty water clothes'],
    compoundPhrases: ['طين الشارع', 'رذاذ الوحل', 'طهارة الملابس', 'طين المطر', 'street mud clothes', 'mud splash pants'],
    rootRegex: /(طين|وحل|رذاذ\s*المطر|طهارة\s*الملابس|طين\s*الشارع|street\s*mud|mud\s*splash)/i,
    initialEngineData: { scenarioId: 10, waterVolumeMl: 300, mode: 'certainty_shield' },
    hadithReference: {
      textAr: '«الأَصْلُ فِي الأَشْيَاءِ الطَّهَارَةُ حَتَّى تَتَيَقَّنَ النَّجَاسَةَ»',
      sourceAr: 'القواعد الفقهية الكبرى — الدرر السنية',
    },
    rafiqMessage: {
      maleAr: 'يا أخي، شريعتنا سمحة وعفت عن طين الشوارع؛ لا تثقل على نفسك بتغيير ملابسك، وصلِّ باطمئنان.',
      femaleAr: 'يا أختي، شريعتنا سمحة وعفت عن طين الشوارع؛ لا تثقلي على نفسكِ بتغيير ملابسكِ، وصلِّي باطمئنان.',
    },
  },

  // =========================================================================
  // GROUP 3: UNCONVENTIONAL PRAYER & TRANSIT (الصلاة في الأماكن غير المهيأة والتنقل)
  // =========================================================================
  {
    numericId: 11,
    id: 'scen_11',
    group: 3,
    groupTitleAr: 'الصلاة والتنقل والأماكن العامة',
    groupTitleEn: 'Unconventional Prayer & Transit',
    targetEngine: 'ENGINE_TIMING_QIBLA',
    conceptTitle: 'الصلاة جالساً على مقعد الطائرة',
    conceptTitleEn: 'How to Pray Seated in an Airplane Seat',
    fiqhSource: 'الدرر السنية — دليل المسلم الجديد',
    shortGuidance: '«فَاتَّقُوا اللَّهَ مَا اسْتَطَعْتُمْ» وتصح الفريضة على المقعد بالإيماء عند ضيق المكان وعدم إمكانية القيام، مع الركوع والسجود إيماءً.',
    shortGuidanceEn: 'When traveling by plane and standing is impossible, pray seated in your seat with nodding gestures for Ruku (~30°) and deeper Sujud (~60°).',
    interactiveSteps: [
      'تكبيرة الإحرام جالساً على مقعد الطائرة',
      'إيماء الركوع الخفيف بالانحناء نحو 30 درجة',
      'الرفع من الركوع بحمد الله',
      'إيماء السجود الأخفض بالانحناء نحو 60 درجة',
    ],
    remedialButtonText: '(انقر) تكبيرة الإحرام جالساً وإيماء الركوع والسجود',
    tranquilityDelta: 20,
    keywords: ['طائرة', 'طيران', 'بالجو', 'مقعد', 'صلاة الطائرة', 'طيارة', 'airplane prayer', 'flight prayer', 'pray on plane', 'cabin seat'],
    compoundPhrases: ['صلاة الطائرة', 'الصلاة في الطائرة', 'مقعد الطائرة', 'صلاة بالطيارة', 'airplane prayer', 'flight prayer', 'pray on plane'],
    rootRegex: /(طائر[ةه]|طيران|بالجو|مقعد\s*الطائر[ةه]|صلاة\s*الطائر[ةه]|طيار[ةه]|airplane\s*prayer|flight\s*prayer|pray\s*on\s*plane)/i,
    initialEngineData: { scenarioId: 11, travelMode: 'airplane', concession: 'seated_nodding' },
    hadithReference: {
      textAr: '«فَاتَّقُوا اللَّهَ مَا اسْتَطَعْتُمْ.. وَإِذَا أَمَرْتُكُمْ بِأَمْرٍ فَأْتُوا مِنْهُ مَا اسْتَطَعْتُمْ»',
      sourceAr: 'صحيح البخاري ومسلم — حديث أبي هريرة رضي الله عنه',
    },
    rafiqMessage: {
      maleAr: 'يا بني ويا أخي، صلاتك في مقعد الطائرة بالإيماء تامة وصحيحة برحمة الله؛ أومئ برأسك ركوعاً وسجوداً وقلبك خاشع.',
      femaleAr: 'يا بنيتي ويا أختي، صلاتكِ في مقعد الطائرة بالإيماء تامة وصحيحة برحمة الله؛ أومئي برأسكِ ركوعاً وسجوداً وقلبكِ خاشع.',
    },
  },
  {
    numericId: 12,
    id: 'scen_12',
    group: 3,
    groupTitleAr: 'الصلاة والتنقل والأماكن العامة',
    groupTitleEn: 'Unconventional Prayer & Transit',
    targetEngine: 'ENGINE_TIMING_QIBLA',
    conceptTitle: 'الصلاة داخل قطار سريع أو حافلة',
    conceptTitleEn: 'Praying in Motion on Train / Coach',
    fiqhSource: 'الموسوعة الفقهية — الدرر السنية',
    shortGuidance: 'تصح الصلاة في وسائل النقل قبل خروج وقتها قائماً مع التوازن، أو قاعداً بالإيماء إن خاف السقوط أو تعذر الوقوف.',
    shortGuidanceEn: 'Prayer in high-speed trains or buses is valid standing with handrail support or seated with nodding if there is risk of falling.',
    interactiveSteps: [
      'استقبال القبلة عند تكبيرة الإحرام ما أمكن',
      'حفظ التوازن بالإمساك بالمقبض أو الجلوس',
      'الإيماء بالركوع الخفيف',
      'الإيماء بالسجود الأخفض وإتمام الصلاة',
    ],
    remedialButtonText: '(انقر) التكبير لجهة القبلة وحفظ التوازن قائماً أو قاعداً',
    tranquilityDelta: 20,
    keywords: ['قطار', 'حافلة', 'باص', 'وسيلة نقل', 'مترو', 'صلاة القطار', 'train prayer', 'bus prayer', 'pray on train', 'transit prayer'],
    compoundPhrases: ['صلاة القطار', 'الصلاة في القطار', 'صلاة الحافلة', 'الصلاة في الباص', 'train prayer', 'bus prayer'],
    rootRegex: /(قطار|حافل[ةه]|باص|مترو|صلاة\s*القطار|train\s*prayer|bus\s*prayer|pray\s*on\s*train)/i,
    initialEngineData: { scenarioId: 12, travelMode: 'train', concession: 'seated_nodding' },
    hadithReference: {
      textAr: '«كَانَ رَسُولُ اللَّهِ ﷺ يُصَلِّي عَلَى رَاحِلَتِهِ حَيْثُ تَوَجَّهَتْ بِهِ»',
      sourceAr: 'صحيح البخاري — باب الصلاة على الدابة في السفر',
    },
    rafiqMessage: {
      maleAr: 'يا أخي، صلِّ في القطار مستقبلاً القبلة ما استطعت، وإن خشيت الترنح فصلِّ جالساً برفق وأمان.',
      femaleAr: 'يا أختي، صلِّي في القطار مستقبلة القبلة ما استطعتِ، وإن خشيتِ الترنح فصلِّي جالسة برفق وأمان.',
    },
  },
  {
    numericId: 13,
    id: 'scen_13',
    group: 3,
    groupTitleAr: 'الصلاة والتنقل والأماكن العامة',
    groupTitleEn: 'Unconventional Prayer & Transit',
    targetEngine: 'ENGINE_PRAYER_CORRECTION',
    conceptTitle: 'صلاة المسبوق في صلاة الجماعة',
    conceptTitleEn: 'Entering Mosque with Imam in Ruku',
    fiqhSource: 'صحيح البخاري — باب ما أدركتم فصلوا',
    shortGuidance: '«فَما أدْرَكْتُمْ فَصَلُّوا، وما فاتَكُمْ فأتِمُّوا»؛ كبّر للإحرام قائماً ثم اركع مع الإمام مباشرة وتدرك الركعة كاملة بإدراك الركوع.',
    shortGuidanceEn: 'Takbeer for Ihram while standing, then bow immediately with the imam; catching the ruku counts as catching the full rak\'ah.',
    interactiveSteps: [
      'تكبيرة الإحرام قائماً بنية الصلاة',
      'النزول مباشرة لمتابعة الإمام في حاله',
      'إذا أدركت الركوع حسبت لك الركعة',
      'بعد تسليم الإمام، قم لقضاء ما فاتك دون تسليم',
    ],
    remedialButtonText: '(انقر) تكبيرة الإحرام قائماً ثم الركوع مباشرة مع الإمام',
    tranquilityDelta: 20,
    keywords: ['مسبوق', 'لحقت الامام', 'امام راكع', 'ادركت الركوع', 'فاتتني ركعة', 'masbooq prayer', 'late to prayer', 'joined imam ruku'],
    compoundPhrases: ['صلاة المسبوق', 'اللحوق بالإمام راكع', 'فاتتني ركعة', 'ادركت الركوع', 'masbooq prayer', 'late to prayer'],
    rootRegex: /(مسبوق|لحقت\s*الامام|الامام\s*راكع|ادركت\s*الركوع|صلاة\s*المسبوق|masbooq|joined\s*imam\s*ruku)/i,
    initialEngineData: { scenarioId: 13, posture: 'bowing', doubtType: 'masbooq' },
    hadithReference: {
      textAr: '«إِذَا أَتَيْتُمُ الصَّلَاةَ وَنَحْنُ سُجُودٌ فَاسْجُدُوا وَلَا تَعُدُّوهَا شَيْئًا، وَمَنْ أَدْرَكَ الرَّكْعَةَ فَقَدْ أَدْرَكَ الصَّلَاةَ»',
      sourceAr: 'سنن أبي داود وصحيح البخاري بمعناه',
    },
    rafiqMessage: {
      maleAr: 'يا أخي، ادخل مع الجماعة فوراً دون انتظار؛ كبّر قائماً ثم انزل معهم وما فاتك تقضيه بعد تسليم الإمام.',
      femaleAr: 'يا أختي، ادخلي مع الجماعة فوراً دون انتظار؛ كبّري قائمة ثم انزلي معهم وما فاتكِ تقضينه بعد تسليم الإمام.',
    },
  },
  {
    numericId: 14,
    id: 'scen_14',
    group: 3,
    groupTitleAr: 'الصلاة والتنقل والأماكن العامة',
    groupTitleEn: 'Unconventional Prayer & Transit',
    targetEngine: 'ENGINE_TIMING_QIBLA',
    conceptTitle: 'الصلاة في مطار مزدحم لا توجد به مصليات',
    conceptTitleEn: 'Airport Waiting Area Prayer Corner',
    fiqhSource: 'صحيح البخاري — «وجُعِلَتْ لي الأرضُ مَسْجِدًا وطَهُورًا»',
    shortGuidance: 'الأرض كلها طاهرة ومسجد؛ يمكنك الصلاة في أي ركن نظيف وهادئ بصالة المطار أو المحطة بفرش سجادتك واستقبال القبلة بوقار.',
    shortGuidanceEn: 'The whole earth is made a mosque and pure; choose any clean corner in the terminal, lay your mat, and pray with dignity.',
    interactiveSteps: [
      'اختيار ركن نظيف وهادئ بعيداً عن مسار الأقدام',
      'فرش سجادة الصلاة أو سترة طاهرة',
      'تحديد جهة القبلة بالبوصلة الرقمية',
      'أداء الصلاة بسكينة وخشوع تام',
    ],
    remedialButtonText: '(انقر) بسط سجادة الجيب واستقبال القبلة بوقار',
    tranquilityDelta: 20,
    keywords: ['مطار', 'صالة انتظار', 'مصلى المطار', 'صلاة بالمطار', 'بوابة السفر', 'airport prayer', 'terminal prayer', 'pray at airport'],
    compoundPhrases: ['الصلاة في المطار', 'صلاة المطار', 'مصلى المطار', 'صالة المطار', 'airport prayer', 'terminal prayer', 'pray at airport'],
    rootRegex: /(مطار|صالة\s*انتظار|مصلى\s*المطار|صلاة.*مطار|airport\s*prayer|terminal\s*prayer)/i,
    initialEngineData: { scenarioId: 14, travelMode: 'transit_hub', concession: 'public_ground' },
    hadithReference: {
      textAr: '«جُعِلَتْ لِيَ الْأَرْضُ مَسْجِدًا وَطَهُورًا، فَأَيُّمَا رَجُلٍ مِنْ أُمَّتِي أَدْرَكَتْهُ الصَّلَاةُ فَلْيُصَلِّ»',
      sourceAr: 'صحيح البخاري — حديث جابر بن عبد الله رضي الله عنه',
    },
    rafiqMessage: {
      maleAr: 'يا أخي، صلِّ بوقار وثقة في أي زاوية نظيفة بالمطار؛ عبادتك نور والأرض كلها مسجد مبارك.',
      femaleAr: 'يا أختي، صلِّي بوقار وثقة في أي زاوية نظيفة بالمطار؛ عبادتكِ نور والأرض كلها مسجد مبارك.',
    },
  },
  {
    numericId: 15,
    id: 'scen_15',
    group: 3,
    groupTitleAr: 'الصلاة والتنقل والأماكن العامة',
    groupTitleEn: 'Unconventional Prayer & Transit',
    targetEngine: 'ENGINE_TIMING_QIBLA',
    conceptTitle: 'جمع الصلاة لعذر المرض أو العمليات الجراحية',
    conceptTitleEn: 'Combining Prayers for Medical Illness / Surgery',
    fiqhSource: 'صحيح مسلم — باب الجمع بين الصلاتين في الحضر للمرض والمشقة',
    shortGuidance: 'يجوز للمريض المقبل على عملية جراحية أو الذي يشق عليه تفريق الصلوات جمع الظهر مع العصر، والمغرب مع العشاء تقديماً أو تأخيراً.',
    shortGuidanceEn: 'Patients undergoing lengthy surgeries or experiencing severe illness are permitted to combine Dhuhr & Asr, or Maghrib & Isha.',
    interactiveSteps: [
      'استحضار نية رخصة الجمع لدفع الحرج والمشقة',
      'أداء صلاة الظهر أربع ركعات تامة',
      'إقامة صلاة العصر وأداؤها مباشرة بعدها أربع ركعات',
      'الدخول إلى العملية ببال مطمئن وذمة بريئة',
    ],
    remedialButtonText: '(انقر) تفعيل رخصة الجمع بين الصلاتين رفعاً للمشقة',
    tranquilityDelta: 20,
    keywords: ['جمع للمريض', 'عملية جراحية', 'مستشفى', 'تخدير', 'مرض شديد', 'combining prayer illness', 'surgery prayer', 'hospital prayer combine'],
    compoundPhrases: ['جمع الصلاة للمريض', 'جمع الصلاتين للمرض', 'صلاة العمليات الجراحية', 'combining prayer illness', 'surgery prayer'],
    rootRegex: /(جمع\s*للمريض|عملي[ةه]\s*جراحي[ةه]|صلاة\s*المريض|مستشفى.*صلاة|surgery\s*prayer|combining.*illness)/i,
    initialEngineData: { scenarioId: 15, travelMode: 'hospital', concession: 'illness_combine' },
    hadithReference: {
      textAr: '«جَمَعَ رَسُولُ اللهِ ﷺ بَيْنَ الظُّهْرِ وَالْعَصْرِ.. مِنْ غَيْرِ خَوْفٍ وَلَا مَطَرٍ.. أَرَادَ أَنْ لَا يُحْرِجَ أُمَّتَهُ»',
      sourceAr: 'صحيح مسلم — حديث عبد الله بن عباس رضي الله عنهما',
    },
    rafiqMessage: {
      maleAr: 'يا أخي، حفظ صحتك ورفع الحرج عنك من مقاصد الشريعة؛ اجمع صلاتك بيقين وادخل عمليتك متوكلاً على الشافي المعافي.',
      femaleAr: 'يا أختي، حفظ صحتكِ ورفع الحرج عنكِ من مقاصد الشريعة؛ اجمعي صلاتكِ بيقين وادخلي عمليتكِ متوكلةً على الشافي المعافي.',
    },
  },

  // =========================================================================
  // GROUP 4: TRANSACTIONS & DIETARY REALITIES (المعاملات والأغذية اليومية)
  // =========================================================================
  {
    numericId: 16,
    id: 'scen_16',
    group: 4,
    groupTitleAr: 'المعاملات والأغذية اليومية',
    groupTitleEn: 'Transactions & Dietary Realities',
    targetEngine: 'ENGINE_SOCIAL_ETHICS',
    conceptTitle: 'قبول هدايا الجيران غير المسلمين في مناسباتهم',
    conceptTitleEn: 'Gifts from Non-Muslim Neighbors',
    fiqhSource: 'مجمع الفقه الإسلامي — صحيح البخاري',
    shortGuidance: 'يجوز قبول هدايا الجيران غير المسلمين من الحلوى والمأكولات المباحة تأليفاً لقلوبهم وبراً بهم، ما لم تكن محرمة بذاتها كالخمر ولحم الخنزير.',
    shortGuidanceEn: 'Accepting baked gifts and sweets from non-Muslim neighbors is permitted to foster goodwill, provided they contain no pork or alcohol.',
    interactiveSteps: [
      'استقبال الجار بابتسامة وشكر وتقدير',
      'التأكد من خلو الحلوى من الكحول ودهن الخنزير',
      'قبول الهدية ومبادلتهم الإحسان بالهدايا الطيبة',
      'إظهار سماحة الإسلام وخلقه الرفيع',
    ],
    remedialButtonText: '(انقر) قبول الهدية بالبشاشة وحسن الجوار',
    tranquilityDelta: 20,
    keywords: ['هدية الجار', 'كيكة الجيران', 'جيران غير مسلمين', 'حلوى الجيران', 'مناسبة الجيران', 'gifts from neighbors', 'neighbor cake', 'neighbor gift'],
    compoundPhrases: ['هدايا الجيران', 'حلوى الجيران', 'قبول هدية الجار', 'هدية الجار غير المسلم', 'gifts from neighbors', 'neighbor cake'],
    rootRegex: /(هدي[ةه]\s*الجار|كيك[ةه]\s*الجيران|حلوى\s*الجيران|جاري\s*غير\s*مسلم|gifts\s*from\s*neighbors|neighbor\s*cake)/i,
    initialEngineData: { scenarioId: 16, sceneContext: 'home', dialogueType: 'neighbor_kindness' },
    hadithReference: {
      textAr: '«مَا زَالَ جِبْرِيلُ يُوصِينِي بِالْجَارِ حَتَّى ظَنَنْتُ أَنَّهُ سَيُوَرِّثُهُ»',
      sourceAr: 'صحيح البخاري ومسلم — حديث عائشة وابن عمر رضي الله عنهم',
    },
    rafiqMessage: {
      maleAr: 'يا أخي، حسن الجوار والتهادي من أعظم أبواب تأليف القلوب؛ اقبل الهدية بابتسامة طالما أنها خالية من المحرمات.',
      femaleAr: 'يا أختي، حسن الجوار والتهادي من أعظم أبواب تأليف القلوب؛ اقبلي الهدية بابتسامة طالما أنها خالية من المحرمات.',
    },
  },
  {
    numericId: 17,
    id: 'scen_17',
    group: 4,
    groupTitleAr: 'المعاملات والأغذية اليومية',
    groupTitleEn: 'Transactions & Dietary Realities',
    targetEngine: 'ENGINE_DOUBT_VAULT',
    conceptTitle: 'توقيع عقد بنكي بشرط فائدة (الربا الصريح)',
    conceptTitleEn: 'Declining Usury Clauses in Contracts',
    fiqhSource: 'كتاب بينات — المجامع الفقهية المعاصرة',
    shortGuidance: 'اجتناب الربا والحرص على نقاء المعاملات المالية من الشروط المحرمة؛ وإن اضطر لعقد فليشطب شرط الفائدة أو يلتزم بالسداد الفوري لمنع ترتبها.',
    shortGuidanceEn: 'Strive for clean financial dealings free of usury; if signing necessary agreements, ensure automatic payments prevent interest penalties.',
    interactiveSteps: [
      'التأكد من عدم وجود بديل خالٍ تماماً من شروط الفائدة',
      'العزم الأكيد وضبط الاستقطاع التلقائي لمنع أي تأخير',
      'عدم أخذ أي زيادة ربوية على الحسابات الشخصية',
      'استبراء الدين والتخلص من الفوائد بصرفها في وجوه الخير',
    ],
    remedialButtonText: '(انقر) شطب شرط الفائدة وطلب معاملة خالية من الشبهات',
    tranquilityDelta: 20,
    keywords: ['عقد بنكي', 'ربا', 'شرط فائدة', 'غرامة تأخير ربوية', 'قرض بفائدة', 'bank interest contract', 'riba clause', 'signing usury agreement'],
    compoundPhrases: ['عقد بنكي ربوي', 'شرط الفائدة', 'فوائد البنك', 'توقيع عقد ربوي', 'bank interest contract', 'riba clause'],
    rootRegex: /(عقد\s*بنكي|ربا|شرط\s*فائد[ةه]|فوائد\s*البنك|bank\s*interest|riba\s*clause|usury)/i,
    initialEngineData: { scenarioId: 17, vaultCategory: 'jurisprudence_sorting' },
    hadithReference: {
      textAr: '«لَعَنَ رَسُولُ اللهِ ﷺ آكِلَ الرِّبَا، وَمُؤْكِلَهُ، وَكَاتِبَهُ، وَشَاهِدَيْهِ، وَقَالَ: هُمْ سَوَاءٌ»',
      sourceAr: 'صحيح مسلم — حديث جابر بن عبد الله رضي الله عنه',
    },
    rafiqMessage: {
      maleAr: 'يا أخي، بركة مالك في نقائه من الحرام؛ احرص على البدائل النقية واجتنب شروط الفائدة قدر استطاعتك.',
      femaleAr: 'يا أختي، بركة مالكِ في نقائه من الحرام؛ احرصي على البدائل النقية واجتنبي شروط الفائدة قدر استطاعتكِ.',
    },
  },
  {
    numericId: 18,
    id: 'scen_18',
    group: 4,
    groupTitleAr: 'المعاملات والأغذية اليومية',
    groupTitleEn: 'Transactions & Dietary Realities',
    targetEngine: 'ENGINE_SOCIAL_ETHICS',
    conceptTitle: 'شراء لحوم في بلاد غير إسلامية دون تصنيف حلال',
    conceptTitleEn: 'Buying Meat in Non-Muslim Supermarkets',
    fiqhSource: 'دليل المسلم الجديد — سورة المائدة',
    shortGuidance: '«وطَعامُ الَّذِينَ أُوتُوا الكِتابَ حِلٌّ لَكُمْ» وسعة المأكولات البحرية والنباتية حلال بيسر؛ ويحرص على المذبوح حلالاً ويتجنب الميتة والمصعوق.',
    shortGuidanceEn: 'Seafood and vegetarian options are always halal; meats slaughtered by People of the Book are permissible unless electric stunning/strangling is known.',
    interactiveSteps: [
      'فحص الملصق والبحث عن علامة الحلال المعتمدة',
      'اختيار المأكولات البحرية والنباتية كبديل آمن وسهل',
      'التأكد من خلو المنتجات من مشتقات الخنزير والجيلاتين الحيواني',
      'التسمية عند الأكل واطمئنان القلب بذكر الله',
    ],
    remedialButtonText: '(انقر) اختيار ذبيحة أهل الكتاب أو المأكولات البحرية',
    tranquilityDelta: 20,
    keywords: ['لحوم اهل الكتاب', 'ذبح حلال', 'لحم بالغرب', 'سوبرماركت بالخارج', 'شراء لحم', 'meat in non muslim countries', 'buying halal meat', 'kosher vs halal'],
    compoundPhrases: ['شراء اللحوم بالخارج', 'لحوم اهل الكتاب', 'الذبح الحلال', 'meat in non muslim countries', 'buying halal meat'],
    rootRegex: /(لحوم\s*اهل\s*الكتاب|ذبح\s*حلال|شراء\s*اللحوم|سوبرماركت.*لحم|buying\s*halal\s*meat|kosher\s*vs\s*halal)/i,
    initialEngineData: { scenarioId: 18, sceneContext: 'restaurant', dialogueType: 'product_inspection' },
    hadithReference: {
      textAr: '«الْحَلَالُ بَيِّنٌ، وَالْحَرَامُ بَيِّنٌ، وَبَيْنَهُمَا مُشَبَّهَاتٌ لَا يَعْلَمُهَا كَثِيرٌ مِنَ النَّاسِ، فَمَنِ اتَّقَى الشُّبُهَاتِ اسْتَبْرَأَ لِدِينِهِ وَعِرْضِهِ»',
      sourceAr: 'صحيح البخاري ومسلم — حديث النعمان بن بشير رضي الله عنه',
    },
    rafiqMessage: {
      maleAr: 'يا أخي، المأكولات البحرية والأسماك حلال واسعة لا تحتاج لذبح؛ واللحوم تحرّ فيها المذبوح بذكر الله لتطمئن نفسك.',
      femaleAr: 'يا أختي، المأكولات البحرية والأسماك حلال واسعة لا تحتاج لذبح؛ واللحوم تحرّي فيها المذبوح بذكر الله لتطمئن نفسكِ.',
    },
  },
  {
    numericId: 19,
    id: 'scen_19',
    group: 4,
    groupTitleAr: 'المعاملات والأغذية اليومية',
    groupTitleEn: 'Transactions & Dietary Realities',
    targetEngine: 'ENGINE_SOCIAL_ETHICS',
    conceptTitle: 'مطعم يبيع المشروبات الروحية في طاولات مجاورة',
    conceptTitleEn: 'Navigating Dinners Near Alcohol Service',
    fiqhSource: 'الدرر السنية — فقه المعاملات والمطاعم',
    shortGuidance: 'يُكره الجلوس على مائدة يُدار عليها الخمر؛ ويجوز تناول الطعام الحلال بطاولة مستقلة عند الحاجة أو عشاء العمل مع طلب المشروبات المباحة.',
    shortGuidanceEn: 'Avoid sitting at tables where alcohol is served directly; dining at a separate alcohol-free table for work commitments is permissible.',
    interactiveSteps: [
      'الجلوس على طاولة خاصة لا يوضع عليها كحول',
      'طلب العصير الطبيعي أو الشاي بثقة ولباقة',
      'إذا وُضع الخمر على نفس مائدتك، اعتذر برقي وغيّر مكانك',
      'المحافظة على الاحترام المهني المتبادل مع التمسك بالقيم',
    ],
    remedialButtonText: '(انقر) الجلوس على طاولة مستقلة خالية من المنكرات',
    tranquilityDelta: 20,
    keywords: ['طاولة مجاورة خمر', 'كحول', 'مطعم يبيع كحول', 'عشاء عمل كحول', 'شراب روحي', 'restaurant serves alcohol', 'dinner with wine', 'business dinner alcohol'],
    compoundPhrases: ['مطعم يبيع كحول', 'طاولة فيها خمر', 'عشاء عمل كحول', 'restaurant serves alcohol', 'drinking at adjacent tables'],
    rootRegex: /(طاول[ةه].*خمر|كحول|مطعم\s*يبيع\s*كحول|عشاء\s*عمل.*خمر|restaurant.*alcohol|dinner\s*with\s*wine)/i,
    initialEngineData: { scenarioId: 19, sceneContext: 'restaurant', dialogueType: 'product_inspection' },
    hadithReference: {
      textAr: '«مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلَا يَجْلِسْ عَلَى مَائِدَةٍ يُدَارُ عَلَيْهَا الْخَمْرُ»',
      sourceAr: 'سنن الترمذي ومسند أحمد — حديث جابر بن عبد الله رضي الله عنه',
    },
    rafiqMessage: {
      maleAr: 'يا أخي، اعتذر بلباقة عن الجلوس على طاولة عليها مسكرات؛ واجلس على مائدة مستقلة تطلب فيها طعامك الحلال بوقار.',
      femaleAr: 'يا أختي، اعتذري بلباقة عن الجلوس على طاولة عليها مسكرات؛ واجلسي على مائدة مستقلة تطلبين فيها طعامكِ الحلال بوقار.',
    },
  },
  {
    numericId: 20,
    id: 'scen_20',
    group: 4,
    groupTitleAr: 'المعاملات والأغذية اليومية',
    groupTitleEn: 'Transactions & Dietary Realities',
    targetEngine: 'ENGINE_SOCIAL_ETHICS',
    conceptTitle: 'العمل كمحاسب (كاشير) في متجر يبيع اليانصيب',
    conceptTitleEn: 'Store Cashier Dealing with Lottery Tickets',
    fiqhSource: 'كتاب بينات — فتاوى الكسب الحلال',
    shortGuidance: '«ومَن يَتَّقِ اللَّهَ يَجْعَلْ له مَخْرَجًا»؛ التعفف عن بيع القمار واجب، ويطلب الموظف نقله بلباقة لقسم المنتجات الحلال مع السعي لبديل طاهر.',
    shortGuidanceEn: 'Avoid directly selling gambling tickets; politely request task reassignment to standard grocery aisles while seeking purely halal roles.',
    interactiveSteps: [
      'طلب النقل بلباقة إلى قسم الأغذية الطازجة أو التنظيم',
      'البحث المستمر عن بديل وظيفي طاهر تماماً',
      'استشعار مراقبة الله وتقواه في الرزق',
      'استبراء المكسب بالصدقة والحرص على الكسب الحلال',
    ],
    remedialButtonText: '(انقر) طلب نقل المهام لقسم المنتجات الحلال بلباقة',
    tranquilityDelta: 20,
    keywords: ['كاشير يانصيب', 'لوتري', 'بيع الدخان', 'محاسب سوبرماركت', 'قمار', 'cashier selling lottery', 'selling tobacco', 'supermarket cashier job'],
    compoundPhrases: ['كاشير يانصيب', 'بيع الدخان', 'العمل في سوبرماركت', 'cashier selling lottery', 'supermarket cashier job'],
    rootRegex: /(كاشير\s*يانصيب|لوتري|بيع\s*الدخان|محاسب\s*سوبرماركت|cashier\s*lottery|selling\s*tobacco)/i,
    initialEngineData: { scenarioId: 20, sceneContext: 'office', dialogueType: 'workplace_break' },
    hadithReference: {
      textAr: '«إِنَّكَ لَنْ تَدَعَ شَيْئًا لِلَّهِ عَزَّ وَجَلَّ إِلَّا بَدَّلَكَ اللَّهُ بِهِ مَا هُوَ خَيْرٌ لَكَ مِنْهُ»',
      sourceAr: 'مسند أحمد — حديث أبي قتادة وأبي الدهماء بإسناد صحيح',
    },
    rafiqMessage: {
      maleAr: 'يا أخي، من ترك شيئاً لله عوضه الله خيراً منه؛ تحدث مع مشرفك بلباقة لنقلك لأقسام الأغذية وسيبارك الله في رزقك.',
      femaleAr: 'يا أختي، من ترك شيئاً لله عوضه الله خيراً منه؛ تحدثي مع مشرفكِ بلباقة لنقلكِ لأقسام الأغذية وسيبارك الله في رزقكِ.',
    },
  },

  // =========================================================================
  // GROUP 5: FAMILY & SOCIAL DYNAMICS (العلاقات والضغوط الأسرية)
  // =========================================================================
  {
    numericId: 21,
    id: 'scen_21',
    group: 5,
    groupTitleAr: 'العلاقات والضغوط الأسرية',
    groupTitleEn: 'Family & Social Dynamics',
    targetEngine: 'ENGINE_SOCIAL_ETHICS',
    conceptTitle: 'دعوة العائلة لعشاء به أطعمة غير حلال',
    conceptTitleEn: 'Attending Family Dinner with Mixed Food',
    fiqhSource: 'دليل المسلم الجديد — فقه صلة الرحم والمطاعم',
    shortGuidance: 'إجابة دعوة الأسرة صلة للرحم وبر بالوالدين؛ شاركهم الجلسة وتناول الأسماك والسلطات والمباحات واعتذر عن المحرم بلطف وابتسامة دون فظاظة.',
    shortGuidanceEn: 'Attending family meals upholds kinship; enjoy seafood, salads, and halal dishes while gently passing on non-halal items with warmth.',
    interactiveSteps: [
      'تلبية الدعوة صلةً للرحم وبرّاً بالوالدين',
      'اختيار الأطباق البحرية والسلطات المباحة على المائدة',
      'الاعتذار بابتسامة وهدوء عن الأطعمة المحظورة',
      'إظهار أثر الإسلام في نبل الخلق وحسن الحديث',
    ],
    remedialButtonText: '(انقر) تلبية الدعوة صلةً للرحم وتناول الأسماك والسلطات',
    tranquilityDelta: 20,
    keywords: ['عشاء عائلي', 'خنزير الاهل', 'عزومة اهلي', 'طعام غير حلال بالبيت', 'عائلة غير مسلمة عشاء', 'family dinner pork', 'non halal family meal', 'dinner with parents'],
    compoundPhrases: ['عشاء عائلي', 'دعوة العائلة لعشاء', 'خنزير الاهل', 'family dinner pork', 'non halal family meal'],
    rootRegex: /(عشاء\s*عائلي|خنزير\s*الاهل|عزوم[ةه]\s*اهلي|طعام\s*غير\s*حلال.*بيت|family\s*dinner\s*pork|non\s*halal\s*family)/i,
    initialEngineData: { scenarioId: 21, sceneContext: 'family_gathering', dialogueType: 'parental_kindness' },
    hadithReference: {
      textAr: '«وَصَاحِبْهُمَا فِي الدُّنْيَا مَعْرُوفًا.. وَاتَّبِعْ سَبِيلَ مَنْ أَنَابَ إِلَيَّ»',
      sourceAr: 'سورة لقمان [آية: 15] ودليل المسلم الجديد',
    },
    rafiqMessage: {
      maleAr: 'يا أخي، صلة رحمك وبر والديك عبادة عظيمة؛ شاركهم دفء الأسرة وتناول ما طاب من الأسماك والخضار دون إحراج.',
      femaleAr: 'يا أختي، صلة رحمكِ وبر والديكِ عبادة عظيمة؛ شاركيهم دفء الأسرة وتناولي ما طاب من الأسماك والخضار دون إحراج.',
    },
  },
  {
    numericId: 22,
    id: 'scen_22',
    group: 5,
    groupTitleAr: 'العلاقات والضغوط الأسرية',
    groupTitleEn: 'Family & Social Dynamics',
    targetEngine: 'ENGINE_SOCIAL_ETHICS',
    conceptTitle: 'تعزية قريب غير مسلم عند الوفاة',
    conceptTitleEn: 'Respectful Condolences for Non-Muslim Relative',
    fiqhSource: 'الموسوعة الفقهية — الدرر السنية',
    shortGuidance: 'تجوز تعزية القريب غير المسلم ومواساة أهله بالكلمات الإنسانية الطيبة صلةً للرحم وتأليفاً للقلوب، دون المشاركة في الطقوس العقدية المخالفة.',
    shortGuidanceEn: 'Offering heartfelt human condolences to non-Muslim relatives is permissible for upholding family ties, avoiding liturgical rites.',
    interactiveSteps: [
      'حضور واجب العزاء لمواساة العائلة المفجوعة',
      'تقديم كلمات المواساة الإنسانية: «أحسن الله عزاءكم وألهمكم الصبر»',
      'تجنب المشاركة في الطقوس العقدية الخاصة',
      'مساندة الأهل بالخدمة والإحسان والوقوف بجانبهم',
    ],
    remedialButtonText: '(انقر) تقديم واجب العزاء الإنساني والمواساة الطيبة',
    tranquilityDelta: 20,
    keywords: ['عزاء قريبي', 'جنازة', 'وفاة قريبي غير المسلم', 'تعزية الاهل', 'موت احد الاقارب', 'non muslim relative condolence', 'funeral relative', 'condolences non muslim'],
    compoundPhrases: ['تعزية قريب غير مسلم', 'عزاء قريبي', 'جنازة غير مسلم', 'non muslim relative condolence', 'funeral relative'],
    rootRegex: /(عزاء\s*قريبي|جناز[ةه]|وفاة\s*قريب.*غير\s*مسلم|تعزي[ةه]\s*الاهل|condolence.*relative|funeral)/i,
    initialEngineData: { scenarioId: 22, sceneContext: 'home', dialogueType: 'parental_kindness' },
    hadithReference: {
      textAr: '«مَرَّتْ بِهِ جَنَازَةٌ فَقَامَ، فَقِيلَ لَهُ: إِنَّهَا جَنَازَةُ يَهُودِيٍّ، فَقَالَ: أَلَيْسَتْ نَفْسًا؟»',
      sourceAr: 'صحيح البخاري ومسلم — حديث سهل بن حنيف وقيس بن سعد',
    },
    rafiqMessage: {
      maleAr: 'يا أخي، مواساة أهلك في حزنهم من محاسن الأخلاق؛ قف معهم بكلمات الرحمة والمواساة الصادقة.',
      femaleAr: 'يا أختي، مواساة أهلكِ في حزنهم من محاسن الأخلاق؛ قفي معهم بكلمات الرحمة والمواساة الصادقة.',
    },
  },
  {
    numericId: 23,
    id: 'scen_23',
    group: 5,
    groupTitleAr: 'العلاقات والضغوط الأسرية',
    groupTitleEn: 'Family & Social Dynamics',
    targetEngine: 'ENGINE_DOUBT_VAULT',
    conceptTitle: 'حيرة تغيير الاسم الأصلي بعد الإسلام',
    conceptTitleEn: 'Keeping Original Birth Name',
    fiqhSource: 'كتاب بينات — فتاوى الأسماء والأنساب',
    shortGuidance: 'لا يلزم تغيير الاسم بعد الإسلام إذا كان معناه حسناً ولا يتضمن عبودية لغير الله؛ احتفظ باسمك وهويتك بثقة وراحة بال.',
    shortGuidanceEn: 'It is not mandatory to change your birth name after Islam if its meaning is good and not worshiping false deities.',
    interactiveSteps: [
      'فحص معنى الاسم الأصلي والتأكد من خلوه من التعبيد لغير الله',
      'الاطمئنان إلى جواز البقاء على الاسم والوثائق الرسمية',
      'عدم التكلف في تغيير الأسماء في الأوراق الحكومية',
      'الاعتزاز بالهوية الإسلامية مع صيانة البر بالأسرة',
    ],
    remedialButtonText: '(انقر) إقرار بقاء الاسم الأصلي لعدم تعارضه مع التوحيد',
    tranquilityDelta: 20,
    keywords: ['تغيير اسمي', 'اسمي غربي', 'هل اغير اسمي', 'اسم غير عربي', 'اسم الميلاد', 'keeping birth name', 'western name islam', 'change name convert'],
    compoundPhrases: ['تغيير الاسم بعد الاسلام', 'تغيير اسمي', 'اسمي غربي', 'keeping birth name', 'western name'],
    rootRegex: /(تغيير\s*اسمي|اسمي\s*غربي|هل\s*اغير\s*اسمي|اسم\s*الميلاد|keeping\s*birth\s*name|western\s*name)/i,
    initialEngineData: { scenarioId: 23, vaultCategory: 'jurisprudence_sorting' },
    hadithReference: {
      textAr: '«إِنَّكُمْ تُدْعَوْنَ يَوْمَ الْقِيَامَةِ بِأَسْمَائِكُمْ وَأَسْمَاءِ آبَائِكُمْ فَأَحْسِنُوا أَسْمَاءَكُمْ»',
      sourceAr: 'سنن أبي داود — باب في تغيير الأسماء القبيحة فقط',
    },
    rafiqMessage: {
      maleAr: 'يا أخي، اسمك جزء من هويتك؛ ما دام معناه جميلاً وطيباً فلا يلزمك تغييره أبداً، واطمئن لدينك.',
      femaleAr: 'يا أختي، اسمكِ جزء من هويتكِ؛ ما دام معناه جميلاً وطيباً فلا يلزمكِ تغييره أبداً، واطمئني لدينكِ.',
    },
  },
  {
    numericId: 24,
    id: 'scen_24',
    group: 5,
    groupTitleAr: 'العلاقات والضغوط الأسرية',
    groupTitleEn: 'Family & Social Dynamics',
    targetEngine: 'ENGINE_DOUBT_VAULT',
    conceptTitle: 'التعامل مع سخرية الأصدقاء القدامى بعد الالتزام',
    conceptTitleEn: 'Handling Mockery from Former Peers',
    fiqhSource: 'سورة الفرقان — كتاب بينات',
    shortGuidance: '«وإِذَا خَاطَبَهُمُ الجَاهِلُونَ قَالُوا سَلَامًا»؛ الثبات على المبدأ بالحكمة وترك المماراة، ومقابلة السخرية بالابتسامة الوقورة والحلم.',
    shortGuidanceEn: 'When faced with sarcastic comments from former peers regarding your practice, respond with calm dignity: "Peace", letting your character speak.',
    interactiveSteps: [
      'تجاهل التعليقات الساخرة وعدم الانجرار للجدال العقيم',
      'الرد بابتسامة واثقة وعبارة وقورة: «هذا خياري الذي أجد فيه راحتي»',
      'الدعاء لهم بالهداية والانشغال بتطوير الذات',
      'اختيار الصحبة الصالحة التي تعين على الخير',
    ],
    remedialButtonText: '(انقر) تفعيل الحلم الوقور والإعراض عن المهاترات',
    tranquilityDelta: 20,
    keywords: ['سخرية الاصدقاء', 'تنمر', 'استهزاء', 'اصحابي القدامى', 'يضحكون علي', 'old friends mocking', 'ridicule convert', 'friends making fun'],
    compoundPhrases: ['سخرية الاصدقاء', 'استهزاء الاصدقاء', 'تنمر على اسلامي', 'old friends mocking', 'handling mockery'],
    rootRegex: /(سخري[ةه]\s*الاصدقاء|تنمر|استهزاء.*اسلامي|يضحكون\s*علي|old\s*friends\s*mocking|ridicule)/i,
    initialEngineData: { scenarioId: 24, vaultCategory: 'misconception_debunk' },
    hadithReference: {
      textAr: '«لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ»',
      sourceAr: 'صحيح البخاري ومسلم — حديث أبي هريرة رضي الله عنه',
    },
    rafiqMessage: {
      maleAr: 'يا أخي، ثباتك على الحق رفعة لك؛ لا تجعل كلماتهم تؤثر على سكينة قلبك، وعاملهم بالحلم والوقار.',
      femaleAr: 'يا أختي، ثباتكِ على الحق رفعة لكِ؛ لا تجعلي كلماتهم تؤثر على سكينة قلبكِ، وعامليهم بالحلم والوقار.',
    },
  },
  {
    numericId: 25,
    id: 'scen_25',
    group: 5,
    groupTitleAr: 'العلاقات والضغوط الأسرية',
    groupTitleEn: 'Family & Social Dynamics',
    targetEngine: 'ENGINE_SOCIAL_ETHICS',
    conceptTitle: 'زيارة ومبيت لدى أصهار أو عائلة غير مسلمة',
    conceptTitleEn: 'Overnight Stay at Non-Muslim In-Laws',
    fiqhSource: 'دليل المسلم الجديد — فقه المعاشرة والزيارة',
    shortGuidance: 'حسن المعاشرة للأصهار وإكرامهم بالهدايا مع ترتيب خصوصية الوضوء والصلاة بهدوء واحترام في الغرفة الخاصة دون تكلف أو إحراج.',
    shortGuidanceEn: 'Honoring in-laws with gifts and warm manners while quietly maintaining prayer and wudu privacy in your designated guest room.',
    interactiveSteps: [
      'تقديم هدية طيبة للأصهار عند الوصول لإدخال السرور',
      'ترتيب ركن هادئ ونظيف في الغرفة لأداء الصلاة',
      'الوضوء بهدوء واقتصاد بالماء دون إحداث بلل',
      'مشاركتهم الأحاديث الودية مع حفظ أوقات العبادة',
    ],
    remedialButtonText: '(انقر) تقديم الهدايا وحفظ خصوصية الصلاة والسكينة',
    tranquilityDelta: 20,
    keywords: ['بيت الاصهار', 'مبيت عند العائلة', 'زيارة اهل زوجتي', 'زيارة اهل زوجي', 'نوم عند اهل غير مسلمين', 'overnight stay in laws', 'visiting in laws convert', 'staying with non muslim family'],
    compoundPhrases: ['زيارة ومبيت لدى الاصهار', 'بيت الاصهار', 'مبيت عند العائلة', 'overnight stay in laws', 'visiting in laws'],
    rootRegex: /(بيت\s*الاصهار|مبيت\s*عند\s*العائل[ةه]|زيارة\s*اهل\s*زوج|نوم\s*عند\s*الاهل|overnight\s*stay\s*in\s*laws|visiting\s*in\s*laws)/i,
    initialEngineData: { scenarioId: 25, sceneContext: 'home', dialogueType: 'parental_kindness' },
    hadithReference: {
      textAr: '«مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيُكْرِمْ ضَيْفَهُ، وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَصِلْ رَحِمَهُ»',
      sourceAr: 'صحيح البخاري ومسلم — حديث أبي هريرة رضي الله عنه',
    },
    rafiqMessage: {
      maleAr: 'يا أخي، زيارتك لأصهارك فرصة لإظهار نقاء الإسلام؛ كن ضيفاً خفيف الظل، كريماً بأخلاقك، ومحافظاً على صلاتك بهدوء.',
      femaleAr: 'يا أختي، زيارتكِ لأصهاركِ فرصة لإظهار نقاء الإسلام؛ كوني ضيفة خفيفة الظل، كريمة بأخلاقكِ، ومحافظة على صلاتكِ بهدوء.',
    },
  },

  // =========================================================================
  // GROUP 6: PEACE OF MIND & COGNITIVE SHOCKS (السكينة وصدمات التأقلم الفكري)
  // =========================================================================
  {
    numericId: 26,
    id: 'scen_26',
    group: 6,
    groupTitleAr: 'السكينة والتأقلم الفكري',
    groupTitleEn: 'Peace of Mind & Cognitive Shocks',
    targetEngine: 'ENGINE_HEART_CERTAINTY',
    conceptTitle: 'الشعور بالذنب وجلد الذات على ماضي ما قبل الإسلام',
    conceptTitleEn: 'Overcoming Guilt Over Past Life',
    fiqhSource: 'صحيح مسلم — «إنَّ الإسْلامَ يَهْدِمُ ما كانَ قَبْلَهُ»',
    shortGuidance: '«إنَّ الإسْلامَ يَهْدِمُ ما كانَ قَبْلَهُ، وإنَّ التَّوْبَةَ تَهْدِمُ ما كانَ قَبْلَها»؛ ماضيك مغفور تماماً وصفحتك بيضاء نقية كيوم ولدتك أمك.',
    shortGuidanceEn: 'Islam completely wipes away all past sins before it; your slate is entirely pure and white like a newborn.',
    interactiveSteps: [
      'استحضار البشارة النبوية: «الإسلام يهدم ما كان قبله»',
      'إلقاء ثقل الماضي والندم في بحر عفو الله ومغفرته',
      'استشعار ولادة الروح من جديد بنور الإيمان',
      'الإقبال على العمل الصالح بانشراح وأمل عظيم',
    ],
    remedialButtonText: '(انقر) استشعار السكينة بقاعدة: الإسلام يجبّ ما قبله',
    tranquilityDelta: 20,
    keywords: ['جلد الذات', 'ماضي قبل الاسلام', 'ذنوبي القديمة', 'حاسس بضيقة', 'مخنوق من ماضيي', 'هل يغفر الله لي', 'guilt past sins', 'overcoming past guilt', 'pre islamic sins'],
    compoundPhrases: ['الماضي قبل الاسلام', 'جلد الذات على الماضي', 'الاسلام يجب ما قبله', 'ذنوب ما قبل الاسلام', 'guilt over past', 'pre islamic guilt'],
    rootRegex: /(جلد\s*الذات|ماضي\s*قبل\s*الاسلام|ذنوبي\s*القديم[ةه]|حاسس\s*بضيقة|مخنوق\s*من\s*ماضي|guilt.*past|pre\s*islamic\s*sins)/i,
    initialEngineData: { scenarioId: 26, vaultCategory: 'ethics_charter' },
    hadithReference: {
      textAr: '«أَمَا عَلِمْتَ أَنَّ الْإِسْلَامَ يَهْدِمُ مَا كَانَ قَبْلَهُ، وَأَنَّ الْهِجْرَةَ تَهْدِمُ مَا كَانَ قَبْلَهَا، وَأَنَّ الْحَجَّ يَهْدِمُ مَا كَانَ قَبْلَهُ؟»',
      sourceAr: 'صحيح مسلم — حديث عمرو بن العاص رضي الله عنه',
    },
    rafiqMessage: {
      maleAr: 'يا بني ويا أخي الغالي، لا تلتفت خلفك أبداً؛ إسلامك ولدك من جديد نقياً كالثوب الأبيض، والله يحبك ويباهي بك.',
      femaleAr: 'يا بنيتي ويا أختي الغالية، لا تلتفتي خلفكِ أبداً؛ إسلامكِ ولدكِ من جديد نقية كالثوب الأبيض، والله يحبكِ ويباهي بكِ.',
    },
  },
  {
    numericId: 27,
    id: 'scen_27',
    group: 6,
    groupTitleAr: 'السكينة والتأقلم الفكري',
    groupTitleEn: 'Peace of Mind & Cognitive Shocks',
    targetEngine: 'ENGINE_DOUBT_VAULT',
    conceptTitle: 'التشتت والارتباك من تضارب فتاوى مشاهير الإنترنت',
    conceptTitleEn: 'Handling Conflicting Social Media Fatwas',
    fiqhSource: 'كتاب بينات — «يَسِّرُوا ولا تُعَسِّرُوا»',
    shortGuidance: '«يَسِّرُوا ولا تُعَسِّرُوا، وبَشِّرُوا ولا تُنَفِّرُوا»؛ اعتمد المتون الفقهية المعتمدة والمصادر الرسمية، واطرح عنك الآراء المتشددة والمتضاربة.',
    shortGuidanceEn: 'Stick to accredited foundational texts and official bodies; disregard contradictory social media alarmism and follow Islamic ease.',
    interactiveSteps: [
      'التوقف عن متابعة الحسابات المثيرة للجدل والتشدد',
      'اعتماد المصادر الموثوقة الرسمية (دليل المسلم الجديد، كتاب بينات)',
      'الأخذ بالأيسر والأرفق في مسائل الاجتهاد',
      'تثبيت القلب على الأصول الجامعة والعبادة الهادئة',
    ],
    remedialButtonText: '(انقر) التمسك بالمتون المعتمدة والأخذ بالأيسر شرعاً',
    tranquilityDelta: 20,
    keywords: ['تضارب الفتاوى', 'شيوخ الانترنت', 'تيك توك فتاوى', 'حيرة الفتاوى', 'اختلاف الشيوخ', 'conflicting online fatwas', 'social media fatwas', 'confused about fatwas'],
    compoundPhrases: ['تضارب فتاوى الانترنت', 'تضارب الفتاوى', 'فتاوى مشاهير الانترنت', 'conflicting online fatwas', 'confused fatwas'],
    rootRegex: /(تضارب\s*الفتاوى|شيوخ\s*الانترنت|فتاوى.*تيك\s*توك|حيرة\s*الفتاوى|conflicting.*fatwa|social\s*media\s*fatwa)/i,
    initialEngineData: { scenarioId: 27, vaultCategory: 'jurisprudence_sorting' },
    hadithReference: {
      textAr: '«يَسِّرُوا وَلَا تُعَسِّرُوا، وَبَشِّرُوا وَلَا تُنَفِّرُوا»',
      sourceAr: 'صحيح البخاري ومسلم — حديث أنس بن مالك رضي الله عنه',
    },
    rafiqMessage: {
      maleAr: 'يا أخي، دينك يسر ونور؛ لا تشوش قلبك بجدالات الإنترنت، واستقِ علمك من المتون الميسرة المعتمدة.',
      femaleAr: 'يا أختي، دينكِ يسر ونور؛ لا تشوشي قلبكِ بجدالات الإنترنت، واستقي علمكِ من المتون الميسرة المعتمدة.',
    },
  },
  {
    numericId: 28,
    id: 'scen_28',
    group: 6,
    groupTitleAr: 'السكينة والتأقلم الفكري',
    groupTitleEn: 'Peace of Mind & Cognitive Shocks',
    targetEngine: 'ENGINE_TIMING_QIBLA',
    conceptTitle: 'تنظيم الوقت بين ضغط الدوام ومواقيت الصلاة',
    conceptTitleEn: 'Scheduling 10-Minute Prayer Breaks at Work',
    fiqhSource: 'دليل المسلم الجديد — «أَرِحْنَا بِهَا يَا بِلَالُ»',
    shortGuidance: 'تنظيم الوقت للاطمئنان بالصلاة استجابةً للتوجيه النبوي: «أَرِحْنَا بِهَا يَا بِلَالُ»؛ حجز 10 دقائق هادئة في التقويم يمنحك تركيزاً ونشاطاً مضاعفاً.',
    shortGuidanceEn: 'Block a 10-15 minute tranquil window in your daily work calendar; prayer refreshes your cognitive focus and spirit.',
    interactiveSteps: [
      'تحديد أوقات الصلوات اليومية في تقويم العمل',
      'حجز فترة استراحة هادئة لمدة 10 دقائق (Calendar Block)',
      'التنسيق مع فريق العمل والمدير بمهنية ووضوح',
      'أداء الصلاة بركود واطمئنان والعودة بنشاط متجدد',
    ],
    remedialButtonText: '(انقر) تثبيت استراحة الصلاة في جدول المواعيد اليومي',
    tranquilityDelta: 20,
    keywords: ['وقت الصلاة بالدوام', 'تنظيم المواعيد', 'ضغط العمل والصلاة', 'استراحة الصلاة بالعمل', 'work schedule prayer', 'prayer breaks work', 'scheduling prayer meeting'],
    compoundPhrases: ['تنظيم وقت الصلاة بالعمل', 'وقت الصلاة بالدوام', 'استراحة الصلاة بالعمل', 'work schedule prayer', 'prayer breaks at work'],
    rootRegex: /(وقت\s*الصلاة.*دوام|تنظيم\s*المواعيد|ضغط\s*العمل.*صلاة|استراحة\s*الصلاة|work\s*schedule\s*prayer|prayer\s*break)/i,
    initialEngineData: { scenarioId: 28, travelMode: 'transit_hub', concession: 'work_schedule' },
    hadithReference: {
      textAr: '«يَا بِلَالُ، أَقِمِ الصَّلَاةَ، أَرِحْنَا بِهَا»',
      sourceAr: 'سنن أبي داود ومسند أحمد — حديث سالم بن أبي الجعد',
    },
    rafiqMessage: {
      maleAr: 'يا أخي، الصلاة واحة سكينة في وسط زحام يومك؛ نسق وقتك باحترافية واجعلها محطة استراحة وتجديد لطاقتك.',
      femaleAr: 'يا أختي، الصلاة واحة سكينة في وسط زحام يومكِ؛ نسقي وقتكِ باحترافية واجعليها محطة استراحة وتجديد لطاقتكِ.',
    },
  },
  {
    numericId: 29,
    id: 'scen_29',
    group: 6,
    groupTitleAr: 'السكينة والتأقلم الفكري',
    groupTitleEn: 'Peace of Mind & Cognitive Shocks',
    targetEngine: 'ENGINE_HEART_CERTAINTY',
    conceptTitle: 'صعوبة حفظ الفاتحة أو التشهد في البداية',
    conceptTitleEn: 'Recitation Concession for Non-Arabic Speakers',
    fiqhSource: 'سنن أبي داود — باب ما يجزئ الألثغ والأعجمي',
    shortGuidance: '«فإنْ كانَ معكَ قُرْآنٌ فاقْرَأْ، وإلَّا فاحْمَدِ اللَّهَ وهَلِّلْهُ وكَبِّرْهُ»؛ يجزئ المبتدئ الذكر البديل (سبحان الله، والحمد لله، ولا إله إلا الله، والله أكبر) حتى يتعلم.',
    shortGuidanceEn: 'If unable to recite Al-Fatihah yet, it is fully sufficient to praise Allah (SubhanAllah, Alhamdulillah, La ilaha illa Allah, Allahu Akbar) while learning.',
    interactiveSteps: [
      'استحضار التيسير النبوي لمن لا يتقن العربية بعد',
      'ترديد الأذكار البديلة الأربعة في موضع الفاتحة بخشوع',
      'القراءة من بطاقة أو شاشة الهاتف أمامك إن تيسر',
      'مواصلة التعلم بالتدريج دون ضغط أو قلق',
    ],
    remedialButtonText: '(انقر) الترخيص بالذكر البديل (التسبيح والتحميد) حتى التعلم',
    tranquilityDelta: 20,
    keywords: ['صعوبة الفاتحة', 'ذكر بديل', 'ما اعرف عربي', 'نسيت الفاتحة للمسلم الجديد', 'كيف اصلي بدون فاتحة', 'struggling fatihah', 'arabic prayer convert', 'recitation concession'],
    compoundPhrases: ['صعوبة حفظ الفاتحة', 'الذكر البديل في الصلاة', 'صعوبة قراءة الفاتحة', 'struggling to recite fatihah', 'arabic recitation concession'],
    rootRegex: /(صعوب[ةه]\s*الفاتح[ةه]|ذكر\s*بديل|ما\s*اعرف\s*عربي|كيف\s*اصلي\s*بدون\s*فاتح[ةه]|struggling.*fatihah|cannot\s*read\s*arabic)/i,
    initialEngineData: { scenarioId: 29, vaultCategory: 'ethics_charter' },
    hadithReference: {
      textAr: '«فَإِنْ كَانَ مَعَكَ قُرْآنٌ فَاقْرَأْ، وَإِلَّا فَاحْمَدِ اللَّهَ وَهَلِّلْهُ وَكَبِّرْهُ»',
      sourceAr: 'سنن أبي داود والترمذي — حديث رفاعة بن رافع رضي الله عنه',
    },
    rafiqMessage: {
      maleAr: 'يا أخي، الله يعلم صدق قلبك؛ ردد التسبيح والتحميد وصلاتك تامة ومقبولة، وتعلم الفاتحة بهدوء حرفاً فحرفاً.',
      femaleAr: 'يا أختي، الله يعلم صدق قلبكِ؛ رددي التسبيح والتحميد وصلاتكِ تامة ومقبولة، وتعلمي الفاتحة بهدوء حرفاً فحرفاً.',
    },
  },
  {
    numericId: 30,
    id: 'scen_30',
    group: 6,
    groupTitleAr: 'السكينة والتأقلم الفكري',
    groupTitleEn: 'Peace of Mind & Cognitive Shocks',
    targetEngine: 'ENGINE_STREET_CHARITY',
    conceptTitle: 'حساب ودفع زكاة الفطر لأول مرة',
    conceptTitleEn: 'Measuring & Paying Zakat al-Fitr',
    fiqhSource: 'صحيح البخاري — باب فرض صدقة الفطر صاعاً من طعام',
    shortGuidance: 'فرض رسول الله ﷺ زكاة الفطر صاعاً من طعام (نحو 2.5 إلى 3 كجم أرز أو قمح) تخرج قبل صلاة العيد طهرة للصائم وطعمة للمساكين.',
    shortGuidanceEn: 'Zakat al-Fitr is prescribed as one Sa\'a of food (~2.5-3 kg of rice/grain) paid before Eid prayer to purify fasting and feed the needy.',
    interactiveSteps: [
      'معايرة مقدار الصاع النبوي (حوالي 2.5 إلى 3 كجم من الأرز أو القوت)',
      'شراء الطعام الطيب المناسب لأهل البلد',
      'تحديد العائلات المحتاجة والمستحقين قبل صلاة العيد',
      'دفع الزكاة بقلب مفعم بالسرور والشكر لله على إتمام رمضان',
    ],
    remedialButtonText: '(انقر) معايرة مقدار الصاع وتحديد المستحقين',
    tranquilityDelta: 20,
    keywords: ['زكاة الفطر', 'صاع', 'رز رمضان', 'كم اطلع رز', 'فطرة', 'طعام المساكين', 'zakat al fitr', 'saa of food', 'ramadan charity rice', 'fitr grain'],
    compoundPhrases: ['زكاة الفطر', 'حساب زكاة الفطر', 'صاع نبوي', 'كم اطلع رز باخر رمضان', 'zakat al fitr', 'sa\'a of rice', 'ramadan food charity'],
    rootRegex: /(زكاة\s*الفطر|صاع|كم\s*اطلع\s*رز|فطر[ةه]|رز\s*رمضان|zakat\s*al\s*fitr|saa\s*of\s*food|fitr)/i,
    initialEngineData: { scenarioId: 30, streetObject: 'sa_a_bowl', action: 'measure_zakat' },
    hadithReference: {
      textAr: '«فَرَضَ رَسُولُ اللهِ ﷺ زَكَاةَ الْفِطْرِ صَاعًا مِنْ تَمْرٍ، أَوْ صَاعًا مِنْ شَعِيرٍ.. طُهْرَةً لِلصَّائِمِ مِنَ اللَّغْوِ وَالرَّفَثِ وَطُعْمَةً لِلْمَسَاكِينِ»',
      sourceAr: 'صحيح البخاري وسنن أبي داود — حديث عبد الله بن عمر وابن عباس',
    },
    rafiqMessage: {
      maleAr: 'يا أخي، زكاة الفطر فرحة للمساكين وطهرة لصيامك؛ صاع من أرز طيب (2.5 كجم) تقدمه للمحتاجين قبل صلاة العيد يسعد قلبك وقلوبهم.',
      femaleAr: 'يا أختي، زكاة الفطر فرحة للمساكين وطهرة لصيامكِ؛ صاع من أرز طيب (2.5 كجم) تقدمينه للمحتاجين قبل صلاة العيد يسعد قلبكِ وقلوبهم.',
    },
  },
];

// =========================================================================
// SECONDARY ROOT SEMANTIC REGEX & COMPOUND MATCHER
// =========================================================================

export function normalizeSearchText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[\u0617-\u061A\u064B-\u0652\u0670]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’“”،؛؟]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Secondary Layer Local / Offline Thematic & Root Regex Matcher.
 * Matches with confidence score between 0.0 and 1.0.
 */
export function matchScenarioLocallyWithConfidence(userQuery: string): {
  scenario: InternalCatalogueScenario | null;
  confidence: number;
} {
  if (!userQuery || !userQuery.trim()) {
    return { scenario: null, confidence: 0 };
  }

  const raw = userQuery.trim();
  const norm = normalizeSearchText(raw);

  // 1. Check Root Regex Interceptor across the 30 scenarios
  for (const scen of RAFIC_INTERNAL_CATALOGUE) {
    if (scen.rootRegex && (scen.rootRegex.test(raw) || scen.rootRegex.test(norm))) {
      return { scenario: scen, confidence: 0.95 };
    }
  }

  // 2. Check Compound Phrases
  for (const scen of RAFIC_INTERNAL_CATALOGUE) {
    for (const cp of scen.compoundPhrases) {
      const normCp = normalizeSearchText(cp);
      if (norm.includes(normCp) || normCp.includes(norm)) {
        return { scenario: scen, confidence: 0.9 };
      }
    }
  }

  // 3. Keyword Scoring
  let bestScen: InternalCatalogueScenario | null = null;
  let highestHits = 0;

  for (const scen of RAFIC_INTERNAL_CATALOGUE) {
    let hits = 0;
    for (const kw of scen.keywords) {
      const normKw = normalizeSearchText(kw);
      if (norm.includes(normKw)) {
        hits++;
      }
    }
    if (hits > highestHits) {
      highestHits = hits;
      bestScen = scen;
    }
  }

  if (bestScen && highestHits >= 2) {
    return { scenario: bestScen, confidence: 0.75 };
  } else if (bestScen && highestHits === 1) {
    return { scenario: bestScen, confidence: 0.45 };
  }

  return { scenario: null, confidence: 0.0 };
}

export function matchScenarioLocally(userQuery: string): InternalCatalogueScenario {
  const result = matchScenarioLocallyWithConfidence(userQuery);
  if (result.scenario && result.confidence >= 0.35) {
    return result.scenario;
  }
  return RAFIC_INTERNAL_CATALOGUE[0];
}

// Backward-compatibility adapter mapping legacy numeric/string IDs to Phase 1 ScenarioKnowledgeItem
import { getScenarioById } from './scenarioVault';
import { ScenarioKnowledgeItem } from '../types/scenarioKnowledge';

export function getUnifiedScenario(id: number | string): ScenarioKnowledgeItem | undefined {
  return getScenarioById(id);
}
