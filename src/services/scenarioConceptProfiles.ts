/**
 * Scenario Concept Profiles & Arabic NLU Intent Registry
 * Connects Arabic colloquial expressions, alias patterns, and learning concept localizations.
 */

export interface ScenarioConceptProfile {
  scenario_id: string;
  numeric_id: number;
  primary_concepts: string[];
  arabic_aliases: string[];
  common_question_patterns: string[];
  semantic_description: string;
  learning_concepts: string[];
}

export interface ConceptLocalization {
  ar: string;
  en: string;
}

/**
 * Static Dictionary Mapping Internal Concept IDs -> User-Facing Localized Labels.
 * Strictly prevents raw technical string IDs (e.g. tayammum_conditions) from appearing in Arabic UI.
 */
export const CONCEPT_LOCALIZATION_MAP: Record<string, ConceptLocalization> = {
  // SCN_001
  'prayer_first_tashahhud_continuation': {
    ar: 'الاستمرار في القيام عند نسيان التشهد الأول',
    en: 'Continuing standing when forgetting first Tashahhud',
  },
  'sujud_sahw_timing': {
    ar: 'موضع وسنة سجود السهو',
    en: 'Timing of Sujud al-Sahw',
  },
  'sujud_sahw_missed_first_tashahhud': {
    ar: 'جبر نسيان التشهد بسجود السهو',
    en: 'Compensating missed Tashahhud with Sujud Sahw',
  },

  // SCN_002
  'prayer_doubt_build_on_certainty': {
    ar: 'البناء على اليقين عند الشك في عدد الركعات',
    en: 'Building on certainty during prayer doubt',
  },
  'sujud_sahw_doubt': {
    ar: 'سجود السهو للشك في الصلاة',
    en: 'Sujud Sahw for doubt in prayer',
  },

  // SCN_003
  'prayer_invalidation_speech_laughter': {
    ar: 'الفرق بين التبسم والقهقهة في الصلاة',
    en: 'Distinction between smiling and laughter in prayer',
  },
  'smile_vs_laughter_distinction': {
    ar: 'ضوابط استعادة السكينة والتركيز',
    en: 'Rules for restoring tranquility and focus',
  },

  // SCN_004
  'prayer_missed_essential_pillar': {
    ar: 'تدارك الركن المنسي والركعة البديلة',
    en: 'Remediating missed essential pillar',
  },
  'rakah_substitution_rule': {
    ar: 'إقامة الركعة الحالية مقام الناقصة',
    en: 'Substituting current Rak’ah for incomplete one',
  },

  // SCN_005
  'prayer_khushoo_whisper_remedy': {
    ar: 'علاج وسواس الصلاة واستعادة الخشوع',
    en: 'Remedy for prayer whispers and restoring Khushoo',
  },
  'dry_spit_left_protection': {
    ar: 'الاستعاذة والنفث الخفيف عن اليسار',
    en: 'Seeking refuge and light dry spitting left',
  },

  // SCN_006
  'wudu_wipe_over_splint_bandage': {
    ar: 'المسح على الجبيرة والضمادة الطبية',
    en: 'Wiping over medical cast or bandage',
  },
  'medical_bandage_purity': {
    ar: 'طهارة صاحب الجرح والضماد',
    en: 'Purity for injured persons with bandages',
  },

  // SCN_007
  'tahara_concession_extreme_cold': {
    ar: 'رخصة الوضوء عند البرد القارس',
    en: 'Wudu concession during severe cold',
  },
  'minimal_single_wash_concession': {
    ar: 'الاقتصار على الغسلة الواحدة المجزئة',
    en: 'Sufficing with a single complete wash',
  },

  // SCN_008
  'tahara_doubt_rule_certainty': {
    ar: 'قاعدة اليقين لا يزول بالشك في الوضوء',
    en: 'Certainty is not overruled by doubt in Wudu',
  },
  'doubt_vs_certainty_purity': {
    ar: 'طرد وساوس انتقاض الطهارة',
    en: 'Dispelling doubts of invalidating purity',
  },

  // SCN_009
  'tayammum_conditions': {
    ar: 'شروط وجواز التيمم',
    en: 'Conditions and permissibility of Tayammum',
  },
  'tayammum_action_sequence': {
    ar: 'صفة وخطوات التيمم الصحيحة',
    en: 'Correct sequence of Tayammum',
  },
  'tayammum_process': {
    ar: 'مسح الوجه والكفين بالصعيد الطاهر',
    en: 'Wiping face and hands with clean earth',
  },

  // SCN_010
  'tahara_street_mud_purity_principle': {
    ar: 'طهارة طين الشارع ورذاذ الطريق',
    en: 'Purity of street mud and road splashes',
  },
  'purity_doubt_inspection': {
    ar: 'عدم التكلف في فحص النجاسات المشكوكة',
    en: 'Avoiding hardship in inspecting doubtful impurities',
  },

  // SCN_011
  'prayer_in_airplane_constraints': {
    ar: 'أحكام الصلاة جالساً في الطائرة',
    en: 'Rules for praying seated in an airplane',
  },
  'seated_nodding_gestures': {
    ar: 'الإيماء بالركوع والسجود للمسافر',
    en: 'Nodding gestures for Ruku and Sujud',
  },

  // SCN_012
  'prayer_in_transit_vehicle': {
    ar: 'أحكام الصلاة في وسائل النقل والمواصلات',
    en: 'Prayer rules inside transit vehicles',
  },
  'qibla_alignment_in_motion': {
    ar: 'تحديد واستقبال القبلة أثناء السفر',
    en: 'Qibla alignment during motion',
  },

  // SCN_013
  'entering_prayer_with_imam': {
    ar: 'أحكام الدخول مع الإمام المسبوق',
    en: 'Joining the prayer behind the Imam as Masbooq',
  },
  'prayer_public_space_sutrah': {
    ar: 'إدراك الركعة بالركوع مع الجماعة',
    en: 'Catching the Rak’ah during Ruku with congregation',
  },

  // SCN_014
  'prayer_airport_transit_management': {
    ar: 'اختيار مكان الصلاة في الأماكن العامة والمطارات',
    en: 'Selecting prayer spots in airports and public spaces',
  },
  'quiet_space_selection': {
    ar: 'بسط سجادة الجيب واستحضار الخشوع',
    en: 'Using pocket mat and maintaining Khushoo',
  },

  // SCN_015
  'combining_prayers_for_hardship': {
    ar: 'رخصة جمع الصلوات للمرض والحاجة الشديدة',
    en: 'Combining prayers for medical hardship',
  },
  'prayer_patient_hospital_adaptation': {
    ar: 'تكييف الصلاة للمريض والمستشفى',
    en: 'Adapting prayer for patients in hospital',
  },

  // SCN_016
  'muamalat_gift_neighbor_kindness': {
    ar: 'قبول هدية الجار والإحسان إليه',
    en: 'Accepting neighbor gifts and kindness',
  },
  'halal_gift_inspection': {
    ar: 'ضوابط فحص الهدية المباحة',
    en: 'Checking permissibility of received gifts',
  },

  // SCN_017
  'usury_contract_clause_review': {
    ar: 'فحص العقود وشطب الشروط الربوية',
    en: 'Contract review and removing usury clauses',
  },
  'financial_riba_disposal_ethics': {
    ar: 'تنزيه الأموال والمعاملات المالية',
    en: 'Purifying wealth and financial transactions',
  },

  // SCN_018
  'halal_food_verification_balance': {
    ar: 'التحقق من الأطعمة والذبائح المباحة',
    en: 'Verifying Halal food and permissible meat',
  },
  'ingredient_checking_ethics': {
    ar: 'فحص المكونات الاعتيادي دون وسوسة',
    en: 'Balanced ingredient checking without obsession',
  },

  // SCN_019
  'workplace_social_alcohol_boundary': {
    ar: 'ضوابط طاولات الطعام واجتناب المنكرات',
    en: 'Social dining boundaries and avoiding alcohol tables',
  },
  'social_dining_purity': {
    ar: 'المحافظة على العفاف في لقاءات العمل',
    en: 'Maintaining modesty in professional social gatherings',
  },

  // SCN_020
  'workplace_halal_earnings_integrity': {
    ar: 'نزاهة الكسب والتنزه عن المبيعات المحرمة',
    en: 'Integrity of Halal earnings and avoiding unlawful sales',
  },
  'avoiding_unlawful_trade': {
    ar: 'طلب النقل للقسم الحلال في العمل',
    en: 'Requesting transfer to Halal work section',
  },

  // SCN_021
  'family_social_dining_harmony': {
    ar: 'صلة الرحم والعشاء العائلي مع التثبت',
    en: 'Family ties and dining harmony with non-Muslim family',
  },
  'salah_travel_qasr_jam_rules': {
    ar: 'تناول الطيبات المباحة والاعتذار اللطيف',
    en: 'Consuming permissible food and gentle refusal',
  },

  // SCN_022
  'condolence_vs_ritual_distinction': {
    ar: 'تقديم التعزية والمواساة الإنسانية للأقارب',
    en: 'Offering human condolences to relatives',
  },
  'prayer_jam_concession_rain': {
    ar: 'التفريق بين التعزية والمشاركة في الطقوس',
    en: 'Distinguishing condolences from religious rituals',
  },

  // SCN_023
  'identity_name_change_principles': {
    ar: 'ضوابط تغيير الاسم والهوية بعد الإسلام',
    en: 'Principles of name change and identity after Islam',
  },
  'cultural_heritage_after_islam': {
    ar: 'الإبقاء على الاسم الأصلي المباح وحفظ التراث',
    en: 'Retaining permissible original name and heritage',
  },

  // SCN_024
  'peer_pressure_resilience': {
    ar: 'التعامل بحلم وسكينة مع سخرية الأصدقاء',
    en: 'Handling peer mockery with patience and calm',
  },
  'qiblah_ijtihad_mistake_ruling': {
    ar: 'الثبات على الحق والإعراض عن الجاهلين',
    en: 'Firmness on truth and ignoring ignorance',
  },

  // SCN_025
  'prayer_in_non_muslim_family': {
    ar: 'الصلاة والوضوء أثناء المبيت عند العائلة',
    en: 'Prayer and Wudu while staying with non-Muslim family',
  },
  'wudu_khuffayn_wiping_duration': {
    ar: 'مدة المسح على الخفين والجوربين',
    en: 'Duration of wiping over socks and leather footwear',
  },

  // SCN_026
  'spiritual_islam_erases_past_sins': {
    ar: 'قاعدة الإسلام يهدم ما كان قبله',
    en: 'Principle that Islam erases all prior sins',
  },
  'converting_burden_to_new_start': {
    ar: 'تحويل شعور الذنب إلى بداية جديدة نقية',
    en: 'Converting past guilt into a clean new beginning',
  },

  // SCN_027
  'source_evaluation_credibility': {
    ar: 'تقييم مصادر الفتاوى الرقمية والمؤسسات المعتمدة',
    en: 'Evaluating online fatwa sources and accredited institutions',
  },
  'fiqh_diversity_tolerance': {
    ar: 'الأخذ بمهيع التيسير وترك الجدالات',
    en: 'Adopting ease and avoiding online arguments',
  },

  // SCN_028
  'daily_time_organization_prayer': {
    ar: 'تنظيم وقت الصلاة في التقويم والجدول اليومي',
    en: 'Organizing prayer breaks in daily calendar',
  },
  'learning_seeking_knowledge_without_shame': {
    ar: 'طلب التعلم ورفع الحرج بالسكينة',
    en: 'Seeking knowledge comfortably without shame',
  },

  // SCN_029
  'prayer_beginner_quran_recitation_gradualism': {
    ar: 'التدرج في تعلم الفاتحة والذكر البديل',
    en: 'Gradual Fatihah learning and alternative Dhikr',
  },
  'gradual_learning_bridge': {
    ar: 'إجزاء الصلاة بالذكر المتاح حتى الإتقان',
    en: 'Sufficing prayer with available Dhikr until mastery',
  },

  // SCN_030
  'zakat_fitr_calculation_distribution': {
    ar: 'حساب وإخراج زكاة الفطر',
    en: 'Zakat al-Fitr calculation and distribution',
  },
  'zakat_sa_calculation_family': {
    ar: 'حساب الصاع النبوي وطعام المساكين للأسرة',
    en: 'Prophetic Sa\'a food calculation for family',
  },
};

/**
  * Returns user-facing localized label for any internal concept ID.
  */
export function getLocalizedConceptLabel(conceptId: string, lang: 'ar' | 'en' = 'ar'): string {
  if (!conceptId) return '';
  const item = CONCEPT_LOCALIZATION_MAP[conceptId];
  if (item) {
    return lang === 'en' ? item.en : item.ar;
  }
  // Fallback if untranslated tag: clean up underscores into human title
  return conceptId
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * Full Canonical Concept Profiles for the 30 Active Production Scenarios.
 */
export const SCENARIO_CONCEPT_PROFILES: ScenarioConceptProfile[] = [
  {
    scenario_id: 'SCN_001',
    numeric_id: 1,
    primary_concepts: ['نسيان التشهد الأول', 'سجود السهو', 'القيام للركعة الثالثة'],
    arabic_aliases: [
      'نسيت التشهد الاول',
      'نسيت التشهد الاوسط',
      'نسيت التشهد الأول',
      'نسيت الجلوس للتشهد',
      'ما تذكرت التشهد',
      'قمت للركعة الثالثة ونسيت التشهد',
      'نسيت التحيات الاولى',
    ],
    common_question_patterns: [
      'نسيت التشهد الأول',
      'ما تذكرت التشهد وأنا أصلي',
      'قمت للركعة اللي بعدها ونسيت التشهد',
      'نسيت التشهد الأول وقمت للثالثة',
      'هل ارجع اذا نسيت التشهد الاول',
      'ماذا افعل اذا نسيت التشهد الاول',
      'نسيت التشهد الاوسط وقمت',
    ],
    semantic_description: 'تعامل المصلي مع نسيان التشهد الأول والقيام للركعة الثالثة واستمرار الصلاة وجبرها بسجدتي السهو قبل السلام.',
    learning_concepts: ['prayer_first_tashahhud_continuation', 'sujud_sahw_timing'],
  },
  {
    scenario_id: 'SCN_002',
    numeric_id: 2,
    primary_concepts: ['الشك في عدد الركعات', 'البناء على اليقين', 'سجود السهو للشك'],
    arabic_aliases: [
      'الشك في الصلاة',
      'شاك صليت ثلاث او اربع',
      'شاك صليت 3 او 4',
      'ما ادري كم صليت ركعة',
      'ترددت في عدد الركعات',
    ],
    common_question_patterns: [
      'شاك صليت ثلاث ولا أربع ركعات',
      'ما أدري صليت ٣ أو ٤',
      'شكيت في عدد الركعات وش أسوي',
      'كيف أتصرف إذا شكيت كم ركعة صليت',
      'هل أبني على الأقل أم الأكثر في الشك',
    ],
    semantic_description: 'حكم الشك في عدد ركعات الصلاة والبناء على اليقين (الأقل) وإتمام الصلاة ثم سجود السهو.',
    learning_concepts: ['prayer_doubt_build_on_certainty', 'sujud_sahw_doubt'],
  },
  {
    scenario_id: 'SCN_003',
    numeric_id: 3,
    primary_concepts: ['الضحك أثناء الصلاة', 'التبسم في الصلاة', 'سبق اللسان'],
    arabic_aliases: [
      'ضحكت بالصلاة',
      'تبسمت في الصلاة',
      'ضحكت بدون قصد',
      'طلع صوت ضحك بالصلاة',
      'تكلمت بالخطأ بالصلاة',
    ],
    common_question_patterns: [
      'ضحكت بالخطأ وأنا أصلي هل تبطل صلاتي',
      'هل التبسم يبطل الصلاة',
      'طلع مني صوت ضحك بالصلاة وش أسوي',
      'تكلمت كلمة بالخطأ في الصلاة',
    ],
    semantic_description: 'التمييز بين التبسم غير المبطل والضحك بصوت المبطل واستعادة الخشوع والسكينة.',
    learning_concepts: ['prayer_invalidation_speech_laughter', 'smile_vs_laughter_distinction'],
  },
  {
    scenario_id: 'SCN_004',
    numeric_id: 4,
    primary_concepts: ['تذكر سجدة فائتة', 'نسيان ركن في الصلاة', 'الركعة البديلة'],
    arabic_aliases: [
      'نسيت سجدة',
      'ما سجدت الا سجدة واحدة',
      'تذكرت سجدة ناقصة بالركعة الثانية',
      'نسيت ركن في الصلاة',
    ],
    common_question_patterns: [
      'تذكرت أني سجدت سجدة واحدة فقط في الركعة الأولى',
      'نسيت سجدة وقمت للركعة الثانية',
      'كيف أجبر الركن المنسي في الصلاة',
    ],
    semantic_description: 'تدارك الركن المنسي كالسجدة الفائتة وإلغاء الركعة الناقصة وإقامة الحالية مقامها.',
    learning_concepts: ['prayer_missed_essential_pillar', 'rakah_substitution_rule'],
  },
  {
    scenario_id: 'SCN_005',
    numeric_id: 5,
    primary_concepts: ['وسواس الصلاة', 'شيطان الصلاة خنزب', 'استعادة الخشوع'],
    arabic_aliases: [
      'يجيني وسواس بالصلاة',
      'تشتت بالصلاة',
      'افكار تفكير بالصلاة',
      'شيطان خنزب',
      'افقد التركيز في الصلاة',
    ],
    common_question_patterns: [
      'أفكر بأشياء كثيرة وأنا أصلي وأفقد التركيز',
      'يجيني وسواس شديد بالصلاة وش العلاج',
      'كيف أطرد شيطان الصلاة خنزب',
    ],
    semantic_description: 'علاج وساوس الشيطان خنزب أثناء الصلاة بالاستعاذة والنفث الخفيف واستمرار الصلاة.',
    learning_concepts: ['prayer_khushoo_whisper_remedy', 'dry_spit_left_protection'],
  },
  {
    scenario_id: 'SCN_006',
    numeric_id: 6,
    primary_concepts: ['المسح على الجبيرة', 'الوضوء مع وجود جبس', 'طهارة الضماد الطبي'],
    arabic_aliases: [
      'عندي جبيرة',
      'يدي فيها جبس كيف اتوضأ',
      'رباط طبي باليد',
      'شاش طبي على الجرح',
      'كيف اتوضا وعلي جبيرة',
    ],
    common_question_patterns: [
      'عندي جبيرة في يدي كيف أتوضأ',
      'هل يجب إزالة الجبيرة عند الوضوء',
      'كيف أمسح على الشاش أو الجبس في الوضوء',
    ],
    semantic_description: 'طريقة المسح على الجبيرة أو الضماد الطبي المربوط على الجرح بالماء المبتل دون إزالتها.',
    learning_concepts: ['wudu_wipe_over_splint_bandage', 'medical_bandage_purity'],
  },
  {
    scenario_id: 'SCN_007',
    numeric_id: 7,
    primary_concepts: ['البرد القارس والوضوء', 'رخصة الوضوء في البرد', 'الغسلة الواحدة المجزئة'],
    arabic_aliases: [
      'برد شديد ما اقدر اتوضا',
      'الماء بارد جدا',
      'البرد القارس والوضوء',
      'هل اتيمم من البرد',
    ],
    common_question_patterns: [
      'الجو بارد جداً والماء مثلج كيف أتوضأ',
      'هل يجوز الاقتصار على غسلة واحدة في البرد',
      'متى يكون البرد رخصة للتيمم أو التيسير',
    ],
    semantic_description: 'معيار التيسير في البرد القارس والاقتصار على الغسلة الواحدة الشاملة لرفع المشقة.',
    learning_concepts: ['tahara_concession_extreme_cold', 'minimal_single_wash_concession'],
  },
  {
    scenario_id: 'SCN_008',
    numeric_id: 8,
    primary_concepts: ['الشك في الوضوء', 'خروج الريح والغازات', 'اليقين لا يزول بالشك'],
    arabic_aliases: [
      'اشك ان وضوئي خرب',
      'احس بطلع ريح بالصلاة',
      'غازات وشك بالوضوء',
      'هل انتقض وضوئي',
    ],
    common_question_patterns: [
      'أحس بخروج غازات أو صوت وأنا أصلي لكن غير متأكد',
      'يجيني شك مستمر هل وضوئي انتقض أم لا',
      'متى ينتقض الوضوء بالريح يقينًا',
    ],
    semantic_description: 'قاعدة الثبات على الطهارة وعدم قطع الصلاة بالشكوك الخفيفة حتى التيقن بصوت أو ريح.',
    learning_concepts: ['tahara_doubt_rule_certainty', 'doubt_vs_certainty_purity'],
  },
  {
    scenario_id: 'SCN_009',
    numeric_id: 9,
    primary_concepts: ['التيمم', 'صفة التيمم', 'شروط التيمم', 'فقد الماء والمرض'],
    arabic_aliases: [
      'كيف اتيمم',
      'طريقة التيمم الصحيحة',
      'متى اقدر اتيمم',
      'ما اعرف متى اقدر اتيمم',
      'التيمم بالتراب والحجر',
    ],
    common_question_patterns: [
      'كيف أتيمم بالطريقة الصحيحة',
      'ما هي شروط التيمم ومتى يجوز لي التيمم',
      'ما أعرف متى أقدر أتيمم',
      'هل التيمم ضربة واحدة أم ضربتان',
    ],
    semantic_description: 'تعليم شروط التيمم ورخصته عند فقد الماء أو المرض وتطبيق ضربة واحدة للوجه والكفين.',
    learning_concepts: ['tayammum_conditions', 'tayammum_action_sequence', 'tayammum_process'],
  },
  {
    scenario_id: 'SCN_010',
    numeric_id: 10,
    primary_concepts: ['طين الشارع', 'رذاذ المطر والمستنقعات', 'طهارة الملابس'],
    arabic_aliases: [
      'جاني طين بالشارع',
      'وسخ الشارع على ثوبي',
      'رذاذ المطر على ملابسي هل نجس',
      'بقعة طين بالبنطال',
    ],
    common_question_patterns: [
      'جاء على ملابسي طين ورذاذ من الشارع هل هي نجسة',
      'هل يجب غسل ثيابي إذا أصابها طين الشارع للصلة',
    ],
    semantic_description: 'بيان طهارة طين الشارع ورذاذ الطرقات والأصل بقاء طهارة الثياب دون تكلف.',
    learning_concepts: ['tahara_street_mud_purity_principle', 'purity_doubt_inspection'],
  },
  {
    scenario_id: 'SCN_011',
    numeric_id: 11,
    primary_concepts: ['الصلاة في الطائرة', 'الصلاة جالساً', 'الإيماء بالركوع والسجود'],
    arabic_aliases: [
      'كيف اصلي بالطيارة',
      'صلاة الكرسي بالطائرة',
      'الطيارة تطير كيف اسجد',
      'الصلاة في السفر بالطائرة',
    ],
    common_question_patterns: [
      'أنا في الطائرة كيف أصلي وأنا جالس في مقعدي',
      'جالس بالكرسي والطيارة تطير كيف أسجد',
      'هل أصلي بالطائرة أم أؤخر الصلاة حتى الهبوط',
    ],
    semantic_description: 'تطبيق أحكام الصلاة جالساً في الطائرة والتكبير استقبالاً للقبلة والإيماء بالركوع والسجود.',
    learning_concepts: ['prayer_in_airplane_constraints', 'seated_nodding_gestures'],
  },
  {
    scenario_id: 'SCN_012',
    numeric_id: 12,
    primary_concepts: ['الصلاة في القطار والحافلة', 'تحديد القبلة في المتحرك', 'الصلاة في وسائل النقل'],
    arabic_aliases: [
      'صلاة القطار',
      'كيف اصلي بالباص',
      'تحديد القبلة بالقطار المتحرك',
      'الصلاة في الباص السريع',
    ],
    common_question_patterns: [
      'كيف أحدد القبلة وأصلي داخل القطار أو الباص السريع',
      'هل تصح الصلاة في وسائل النقل المتحركة',
    ],
    semantic_description: 'استقبال القبلة عند التكبير والصلاة بحسب الاستطاعة داخل وسائل النقل المتحركة.',
    learning_concepts: ['prayer_in_transit_vehicle', 'qibla_alignment_in_motion'],
  },
  {
    scenario_id: 'SCN_013',
    numeric_id: 13,
    primary_concepts: ['المسبوق في الصلاة', 'الدخول مع الإمام الراكع', 'إدراك الركعة'],
    arabic_aliases: [
      'دخلت والامام راكع',
      'المسبوق مع الجماعة',
      'كيف ادخل مع الامام',
      'هل ادرك الركعة بالركوع',
    ],
    common_question_patterns: [
      'جئت للمسجد والإمام راكع كيف أدخل معه في الصلاة',
      'هل تكفيني تكبيرة الإحرام إذا أدركت الإمام راكعاً',
    ],
    semantic_description: 'طريقة الدخول مع الإمام المسبوق بالتكبير قائماً واللحاق به بالركوع لإدراك الركعة.',
    learning_concepts: ['entering_prayer_with_imam', 'prayer_public_space_sutrah'],
  },
  {
    scenario_id: 'SCN_014',
    numeric_id: 14,
    primary_concepts: ['الصلاة في المطار', 'الصلاة في الأماكن العامة', 'السترة وسجادة الجيب'],
    arabic_aliases: [
      'وين اصلي بالمطار',
      'الصلاة في صالة الانتظار',
      'الصلاة بالمكان العام',
      'سجادة الجيب بالمطار',
    ],
    common_question_patterns: [
      'أنا في المطار وما في مصلى قريب وين أقدر أصلي',
      'كيف أصلي في الأماكن العامة بدون إزعاج الآخرين',
    ],
    semantic_description: 'اختيار المكان الهادئ المناسب للصلاة في المطارات والأماكن العامة ببسط السجادة بسكينة.',
    learning_concepts: ['prayer_airport_transit_management', 'quiet_space_selection'],
  },
  {
    scenario_id: 'SCN_015',
    numeric_id: 15,
    primary_concepts: ['جمع الصلوات للمرض', 'الجمع للجراحة والمستشفى', 'رخصة الجمع لرفع الحرج'],
    arabic_aliases: [
      'جمع الصلاة للمريض',
      'عندي عملية جراحية كيف اصلي',
      'هل اجمع الظهر والعصر بالمستشفى',
      'رخصة جمع الصلاة',
    ],
    common_question_patterns: [
      'عندي عملية جراحية وقت صلاة العصر هل يجوز الجمع',
      'كيف يصلي المريض في المستشفى وهل يجمع الصلوات',
    ],
    semantic_description: 'أحكام رخصة جمع الصلوات (تقديم أو تأخير) للمريض ولظروف العمليات والجراحة المجهدة.',
    learning_concepts: ['combining_prayers_for_hardship', 'prayer_patient_hospital_adaptation'],
  },
  {
    scenario_id: 'SCN_016',
    numeric_id: 16,
    primary_concepts: ['هدية الجار غير المسلم', 'قبول هدايا غير المسلمين', 'الإحسان للجار'],
    arabic_aliases: [
      'جاري غير مسلم جاب لي هدية',
      'هل أقبل هدية غير المسلم',
      'حلويات من جاري الاجنبي',
      'هدية من شخص غير مسلم',
    ],
    common_question_patterns: [
      'جاري غير المسلم أهدى لي طعاماً أو حلوى هل يجوز قبولها',
      'كيف أتعامل مع هدايا الأصدقاء والجيران غير المسلمين',
    ],
    semantic_description: 'جواز قبول هدايا الجيران غير المسلمين والإحسان إليهم ما دامت الهدية خالية من المحرم الصريح.',
    learning_concepts: ['muamalat_gift_neighbor_kindness', 'halal_gift_inspection'],
  },
  {
    scenario_id: 'SCN_017',
    numeric_id: 17,
    primary_concepts: ['العقود المالية الشروط الربوية', 'الفائدة البنكية', 'شطب الشرط الربوي'],
    arabic_aliases: [
      'عقد بنكي فيه فائدة',
      'شرط غرامة تأخير ربوية',
      'عقد فيه ربا كيف اتصرف',
      'توقيع العقد البنكي',
    ],
    common_question_patterns: [
      'لقيت في العقد بند فيه فائدة ربوية عند التأخير وش أسوي',
      'هل يجوز التوقيع على عقد فيه شرط غرامة تأخير إذا سددت بوقتها',
    ],
    semantic_description: 'فحص العقود المالية والامتناع عن الموافقة على الشروط الربوية وتطهير المعاملات.',
    learning_concepts: ['usury_contract_clause_review', 'financial_riba_disposal_ethics'],
  },
  {
    scenario_id: 'SCN_018',
    numeric_id: 18,
    primary_concepts: ['التحقق من الطعام الحلال', 'ذبائح أهل الكتاب', 'المأكولات البحرية'],
    arabic_aliases: [
      'اللحم بالسوبرماركت حلال',
      'ذبائح الغرب واهل الكتاب',
      'كيف اعرف الاكل حلال بالمحل',
      'فحص مكونات الطعام',
    ],
    common_question_patterns: [
      'كيف أتحقق من الطعام واللحوم في السوبرماركت بالخارج',
      'هل أكل ذبائح أهل الكتاب والمأكولات البحرية حلال',
    ],
    semantic_description: 'ضوابط التحقق المعتدل من مكونات الطعام وإباحة ذبائح أهل الكتاب والأغذية البحرية.',
    learning_concepts: ['halal_food_verification_balance', 'ingredient_checking_ethics'],
  },
  {
    scenario_id: 'SCN_019',
    numeric_id: 19,
    primary_concepts: ['مطعم العمل والمشروبات المحرمة', 'الحدود الاجتماعية بالعمل', 'طاولة الطعام النقية'],
    arabic_aliases: [
      'عشاء عمل فيه خمر',
      'مطعم الشركة يبيع كحول',
      'وين اقعد بعشاء العمل',
      'الجلوس على طاولة بها محرم',
    ],
    common_question_patterns: [
      'عندي عشاء عمل مع زملائي والمطعم يقدم كحول كيف أتصرف',
      'هل يجوز الجلوس على طاولة مستقلة خالية من المحرمات',
    ],
    semantic_description: 'التعامل الحكيم في اجتماعات العمل الاجتماعية بالجلوس على طاولة نقية خالية من المنكرات.',
    learning_concepts: ['workplace_social_alcohol_boundary', 'social_dining_purity'],
  },
  {
    scenario_id: 'SCN_020',
    numeric_id: 20,
    primary_concepts: ['نزاهة الكسب في العمل', 'بيع تذاكر القمار والكاشير', 'طلب الانتقال لقسم حلال'],
    arabic_aliases: [
      'اشتغل كاشير ابيع يانصيب',
      'عملي فيه بيع محرم',
      'كيف اغير قسمي بالعمل الحلال',
      'تذاكر اليانصيب بالوظيفة',
    ],
    common_question_patterns: [
      'أعمل في متجر ويطلبون مني بيع تذاكر اليانصيب وش أسوي',
      'كيف أطلب الانتقال لقسم آخر للحفاظ على حلال كسبي',
    ],
    semantic_description: 'التعفف عن بيع القمار والمحرمات في الوظيفة وطلب الانتقال لأقسام المبيعات المباحة.',
    learning_concepts: ['workplace_halal_earnings_integrity', 'avoiding_unlawful_trade'],
  },
  {
    scenario_id: 'SCN_021',
    numeric_id: 21,
    primary_concepts: ['العشاء العائلي والأكل المحرم', 'صلة الرحم مع العائلة', 'تناول الطعام المباح'],
    arabic_aliases: [
      'عشاء مع اهلي فيه خنزير',
      'كيف اكل مع عائلتي غير المسلمة',
      'صلة الرحم بالطعام',
      'الاعتذار اللطيف عن الخنزير',
    ],
    common_question_patterns: [
      'عائلتي غير المسلمة طابخين أكل فيه لحم خنزير كيف أشاركهم',
      'كيف أحافظ على صلة الرحم والأكل المباح مع أهلي',
    ],
    semantic_description: 'حفظ صلة الرحم والمشاركة في العشاء العائلي بالأكل من الطيبات المباحة والاعتذار اللطيف عن المحرم.',
    learning_concepts: ['family_social_dining_harmony', 'salah_travel_qasr_jam_rules'],
  },
  {
    scenario_id: 'SCN_022',
    numeric_id: 22,
    primary_concepts: ['تعزية الأقارب غير المسلمين', 'المواساة الإنسانية', 'التفريق بين التعزية والطقوس'],
    arabic_aliases: [
      'عزاء قريبي غير المسلم',
      'هل اعزز اهلي غير المسلمين',
      'مواساة عائلة غير مسلمة',
      'حضور جنازة غير المسلم',
    ],
    common_question_patterns: [
      'توفي قريب لي غير مسلم هل يجوز لي تعزيته ومواساة أهله',
      'كيف أعزي أهلي غير المسلمين دون المشاركة في طقوسهم الدينية',
    ],
    semantic_description: 'مشروعية تقديم الكلمات الطيبة والمواساة الإنسانية للأقارب غير المسلمين صلةً للرحم.',
    learning_concepts: ['condolence_vs_ritual_distinction', 'prayer_jam_concession_rain'],
  },
  {
    scenario_id: 'SCN_023',
    numeric_id: 23,
    primary_concepts: ['تغيير الاسم بعد الإسلام', 'الهوية والاسم الأصلي', 'التراث الثقافي المباح'],
    arabic_aliases: [
      'هل لازم اغير اسمي بعد الاسلام',
      'اسمي اجنبي هل اغيره',
      'الاسم الاصلي والهوية',
      'تغيير الاسم بالوثائق',
    ],
    common_question_patterns: [
      'هل يجب علي تغيير اسمي الأجنبي الأصلي بعد دخولي الإسلام',
      'متى يلزم تغيير الاسم ومتى يبنى على الإبقاء والمباح',
    ],
    semantic_description: 'جواز الإبقاء على الاسم الأصلي المباح الذي لا يحمل تعبيراً عن معبود غير الله دون تكلف.',
    learning_concepts: ['identity_name_change_principles', 'cultural_heritage_after_islam'],
  },
  {
    scenario_id: 'SCN_024',
    numeric_id: 24,
    primary_concepts: ['سخرية الأصدقاء', 'التعامل مع الضغط الاجتماعي', 'الحلم والإعراض'],
    arabic_aliases: [
      'اصدقائي يستهرءون باسلامي',
      'سخرية زملائي من صلاتي',
      'كيف اتعامل مع الاستهزاء',
      'الضغط الاجتماعي من الاصدقاء',
    ],
    common_question_patterns: [
      'أصدقائي السابقون يسخرون من صلاتي وإسلامي كيف أرد عليهم',
      'كيف أتعامل بثبات وسكينة مع الاستهزاء والضغط الاجتماعي',
    ],
    semantic_description: 'التعامل بحلم وسكينة وإعراض عن سخرية الأصدقاء السابقين والثبات على الهدي النبوي.',
    learning_concepts: ['peer_pressure_resilience', 'qiblah_ijtihad_mistake_ruling'],
  },
  {
    scenario_id: 'SCN_025',
    numeric_id: 25,
    primary_concepts: ['الصلاة مع عائلة غير مسلمة', 'المبيت عند الأصهار والأقارب', 'خصوصية الصلاة والوضوء'],
    arabic_aliases: [
      'اصلي عند اهلي غير المسلمين',
      'انا مسلم جديد اعيش مع عائلة غير مسلمة وين اصلي',
      'الوضوء عند العائلة',
      'كيف اصلي ببيت اهلي',
    ],
    common_question_patterns: [
      'أنا مسلم جديد وأعيش مع عائلة غير مسلمة، وين أقدر أصلي؟',
      'كيف أصلي وأتوضأ بأمان وخصوصية عند المبيت ببيت أهلي',
    ],
    semantic_description: 'ترتيب أداء الصلاة والوضوء بحكمة ورفق وحفظ للخصوصية أثناء الإقامة مع العائلة غير المسلمة.',
    learning_concepts: ['prayer_in_non_muslim_family', 'wudu_khuffayn_wiping_duration'],
  },
  {
    scenario_id: 'SCN_026',
    numeric_id: 26,
    primary_concepts: ['الشعور بالذنب تجاه الماضي', 'الإسلام يهدم ما كان قبله', 'البداية الجديدة النقية'],
    arabic_aliases: [
      'ندمان على ماضي قبل الاسلام',
      'ذنوبي القديمة هل تغتفر',
      'احس بالذنب من ماضي',
      'الاسلام يهدم ما قبله',
    ],
    common_question_patterns: [
      'أشعر بندم شديد وحزن على الذنوب التي فعلتها قبل الإسلام',
      'هل يغفر الله كل الذنوب والأخطاء السابقة بمجرد دخولي الإسلام',
    ],
    semantic_description: 'الاستبشار بقاعدة أن الإسلام يهدم ويغفر كل ما كان قبله وبدء صفحة جديدة نقية مع الله.',
    learning_concepts: ['spiritual_islam_erases_past_sins', 'converting_burden_to_new_start'],
  },
  {
    scenario_id: 'SCN_027',
    numeric_id: 27,
    primary_concepts: ['تضارب الفتاوى الرقمية', 'مصادر الفتوى المعتمدة', 'ترك الجدالات الرقمية'],
    arabic_aliases: [
      'فتاوى متضاربة بالنت',
      'شفت فتوى تشدد بالانترنت',
      'تضارب المصادر',
      'اختلاف الفتاوى على المنتديات',
      'وش هي المصادر المعتمدة',
    ],
    common_question_patterns: [
      'لقيت فتاوى متضاربة ومتشددة في الإنترنت ومواقع التواصل، كيف أصل للحق؟',
      'كيف أتعامل مع تضارب الآراء والمجموعات الرقمية',
    ],
    semantic_description: 'الرجوع للمؤسسات الإفتائية المعتمدة والأخذ بمهيع التيسير والابتعاد عن الشذوذ والجدالات.',
    learning_concepts: ['source_evaluation_credibility', 'fiqh_diversity_tolerance'],
  },
  {
    scenario_id: 'SCN_028',
    numeric_id: 28,
    primary_concepts: ['تنظيم وقت الصلاة في العمل', 'جدول اليوم والصلوات', 'حجز استراحة الصلاة'],
    arabic_aliases: [
      'كيف انظم وقت الصلاة بالعمل',
      'استراحة الصلاة بالتقويم',
      'جدول الصلاة مع الدوام',
      'ترتيب وقت الصلاة باليوم',
    ],
    common_question_patterns: [
      'كيف أنظم وقت الصلاة في جدول عملي الشاق دون تقصير',
      'هل أستطيع حجز استراحة قصيرة في تقويم العمل لصلاة الظهر',
    ],
    semantic_description: 'تنظيم المواعيد اليومية بذكاء وحجز استراحات الصلاة في تقويم العمل بوضوح وسكينة.',
    learning_concepts: ['daily_time_organization_prayer', 'learning_seeking_knowledge_without_shame'],
  },
  {
    scenario_id: 'SCN_029',
    numeric_id: 29,
    primary_concepts: ['التدرج في تعلم الفاتحة', 'صلاة المبتدئ بالذكر البديل', 'التيسير على المسلم الجديد'],
    arabic_aliases: [
      'ما احفظ الفاتحة كيف اصلي',
      'صلاة المسلم الجديد بدون عربي',
      'صعوبة حفظ القران بالصلاة',
      'الذكر البديل للفاتحة',
    ],
    common_question_patterns: [
      'أنا مسلم جديد وما أحفظ سورة الفاتحة بالعربية كيف أصلي',
      'هل تصح صلاتي بالتسبيح والذكر البديل حتى أتعلم الفاتحة',
    ],
    semantic_description: 'إجزاء صلاة المبتدئ بالذكر البديل (التسبيح والتحميد) والتدرج بالرفق حتى حفظ الفاتحة.',
    learning_concepts: ['prayer_beginner_quran_recitation_gradualism', 'gradual_learning_bridge'],
  },
  {
    scenario_id: 'SCN_030',
    numeric_id: 30,
    primary_concepts: ['زكاة الفطر', 'صدقة الفطر', 'حساب الصاع للأسرة', 'زكاة رمضان'],
    arabic_aliases: [
      'زكاة الفطر',
      'صدقة الفطر',
      'الفطرة',
      'زكاة رمضان',
      'زكاه الفطر',
      'زكاة فطر',
      'صدقه الفطر',
      'الفطره',
      'زكاه رمضان',
    ],
    common_question_patterns: [
      'ما هي زكاة الفطر',
      'وش هي زكاة الفطر',
      'ايش هي زكاة الفطر',
      'كم زكاة الفطر',
      'متى تخرج زكاة الفطر',
      'كيف اخرج زكاة الفطر',
      'على من تجب زكاة الفطر',
      'هل اخرجها عن الأسرة',
      'أنا جديد في الإسلام، وش الشيء اللي يطلعه المسلمون في نهاية رمضان؟',
      'طعام نهاية رمضان للمساكين',
    ],
    semantic_description: 'فهم زكاة الفطر وإخراج طعام المساكين ومقدار الصاع النبوي وتوزيعها على المستحقين بنهاية رمضان.',
    learning_concepts: ['zakat_fitr_calculation_distribution', 'zakat_sa_calculation_family'],
  },
];

/**
 * Enhanced Arabic Query Normalizer.
 * Cleans dialectal particles (وش / ايش / ماذا / كيف / متى / يجوز...) without stripping core intent context.
 */
export function normalizeArabicQuery(text: string): {
  normalized: string;
  tokens: string[];
} {
  if (!text) return { normalized: '', tokens: [] };

  const cleaned = text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '') // Strip diacritics
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[^\w\s\u0621-\u064A]/gi, ' ')
    .trim();

  // Normalize common colloquial particles into semantic intention tokens
  const tokenized = cleaned
    .split(/\s+/)
    .filter((t) => t.length > 0)
    .map((t) => {
      if (['وش', 'ايش', 'شنو', 'شو', 'ماذا'].includes(t)) return 'ما';
      if (['نسيت', 'تذكرت', 'ما تذكرت', 'نسي'].includes(t)) return 'نسيان';
      if (['يجوز', 'يصح', 'اقدر', 'استطيع', 'هل'].includes(t)) return 'حكم';
      if (['الخفين', 'الجوارب', 'الجوربين', 'الجورب'].includes(t)) return 'جورب';
      if (['الفطره', 'الفطر', 'صدقه'].includes(t)) return 'فطر';
      return t;
    });

  return {
    normalized: tokenized.join(' '),
    tokens: tokenized,
  };
}

/**
 * Score Scenario Candidates combining Semantic Cosine Similarity + Arabic Concept Match + Pattern Overlap.
 */
export function evaluateCandidateWithArabicNlu(
  query: string,
  profile: ScenarioConceptProfile,
  vectorSimilarityScore: number = 0
): number {
  const norm = normalizeArabicQuery(query);
  const qStr = norm.normalized;
  const qTokens = norm.tokens;

  let patternScore = 0;

  // 1. Exact or Pattern Match against Common Question Patterns
  for (const pattern of profile.common_question_patterns) {
    const normPattern = normalizeArabicQuery(pattern).normalized;
    if (qStr.includes(normPattern) || normPattern.includes(qStr)) {
      patternScore = Math.max(patternScore, 0.95);
      break;
    }

    // Substring / Token Overlap
    const patternTokens = normPattern.split(/\s+/);
    let matchedCount = 0;
    for (const pt of patternTokens) {
      if (pt.length > 2 && qTokens.includes(pt)) {
        matchedCount++;
      }
    }
    const ratio = matchedCount / Math.max(1, patternTokens.length);
    if (ratio >= 0.6) {
      patternScore = Math.max(patternScore, ratio * 0.88);
    }
  }

  // 2. Alias / Concept Match
  let aliasScore = 0;
  for (const alias of profile.arabic_aliases) {
    const normAlias = normalizeArabicQuery(alias).normalized;
    if (qStr.includes(normAlias)) {
      aliasScore = Math.max(aliasScore, 0.90);
    }
  }

  // 3. Descriptive Keyword / Primary Concept Match
  let conceptScore = 0;
  for (const concept of profile.primary_concepts) {
    const normConcept = normalizeArabicQuery(concept).normalized;
    const cTokens = normConcept.split(/\s+/);
    for (const ct of cTokens) {
      if (ct.length > 2 && qTokens.includes(ct)) {
        conceptScore += 0.25;
      }
    }
  }

  conceptScore = Math.min(0.85, conceptScore);

  // Combined score combining signals
  const combinedScore = Math.max(
    vectorSimilarityScore,
    patternScore,
    aliasScore * 0.9,
    vectorSimilarityScore * 0.4 + Math.max(patternScore, aliasScore, conceptScore) * 0.6
  );

  return Number(combinedScore.toFixed(4));
}
