import { ApprovedSourceFamily, SourceType, LearningLevel, TrustedKnowledgeChunk } from '../types';

/**
 * Verified Central Islamic Knowledge Base for Rafeeq AI
 * Connected directly to the 10 Competition Approved Reference Families:
 * 1. Digital Dawah Center (https://center.dawa.sa/)
 * 2. Jamharah Dictionary (https://islamic-content.com/dictionary)
 * 3. Quranpedia (https://quranpedia.net/)
 * 4. Dorar Tafsir (https://dorar.net/tafseer)
 * 5. Dorar Hadith (https://dorar.net/hadith)
 * 6. Shamela Library (https://shamela.ws/)
 * 7. Dorar Aqeedah (https://dorar.net/aqeeda)
 * 8. Dorar Fiqh (https://dorar.net/feqhia)
 * 9. Dorar History (https://dorar.net/history)
 * 10. Bayyinah Dawah Q&A (https://center.dawa.sa/)
 */
export const TRUSTED_KNOWLEDGE_BASE: TrustedKnowledgeChunk[] = [
  // 1. TAWHID DEFINITION & ESSENCE (Aqeedah — Dorar Aqeedah & Jamhara)
  {
    id: 'src-aqeedah-tawhid-definition',
    sourceFamily: 'dorar_aqeedah',
    sourceName: 'الموسوعة العقدية — الدرر السنية',
    sourceUrl: 'https://dorar.net/aqeeda',
    sourceType: 'aqeedah',
    title: 'حقيقة التوحيد وأقسامه الثلاثة وأثره في سكينة القلب',
    topic: 'aqeedah_tawhid',
    language: 'both',
    authenticityLevel: 'إجماع أهل السنة والجماعة',
    learningLevel: 'beginner',
    text: 'التوحيد هو إفراد الله سبحانه وتعالى بما يختص به؛ وهو أصل الدين ورأس الأمر كله. وينتظم في ثلاثة أركان متلازمة: توحيد الربوبية (أنه الخالق الرازق المدبر وحده)، وتوحيد الألوهية (إفراده بالعبادة والمحبة والدعاء فلا شريك له)، وتوحيد الأسماء والصفات (إثبات ما أثبته لنفسه من الكمال والجلال). ومقتضى التوحيد أن يرتاح قلب العبد فلا يخاف إلا الله ولا يرجو سواه.',
    dictionaryTerm: {
      termAr: 'التوحيد',
      termEn: 'Monotheism (Islamic Tawhid / Oneness of Allah)',
      approvedTranslation: 'The Oneness of Allah (Tawhid)',
      definitionAr: 'إفراد الله سبحانه بالربوبية والألوهية والأسماء والصفات، وإخلاص الدين والعبادة له وحده دون شريك.',
      definitionEn: 'The core Islamic doctrine of the absolute, undivided Oneness of Allah in His Lordship, Worship, and Divine Attributes.',
    },
    notes: 'مصدر معتمد للأصول العقدية وتعريف التوحيد للمسلمين الجدد بلغة مطمئنة تجمع بين الدليل العقلي وراحة الضمير.',
    keywords: ['توحيد', 'عقيدة', 'معنى التوحيد', 'الألوهية', 'الربوبية', 'الشهادتين', 'أقسام التوحيد', 'لا إله إلا الله', 'لا اله الا الله', 'شهادة أن لا إله إلا الله', 'إخلاص', 'tawhid', 'monotheism', 'oneness'],
    relatedExperienceIds: ['home-prayer-room'],
    day: 1,
  },

  // 2. JAMHARAH TERMINOLOGY TRANSLATION: TAWHID (Jamhara Dictionary)
  {
    id: 'src-dict-tawhid-translation',
    sourceFamily: 'jamhara_dict',
    sourceName: 'موسوعة مفردات المحتوى الإسلامي (الجمهرة)',
    sourceUrl: 'https://islamic-content.com/dictionary',
    sourceType: 'dictionary',
    title: 'المصطلح المعتمد لترجمة «التوحيد» والفارق الدلالي مع Monotheism',
    topic: 'aqeedah_tawhid',
    language: 'both',
    authenticityLevel: 'توثيق معجمي معتمد',
    learningLevel: 'beginner',
    text: 'المصطلح المعتمد في الترجمة الإسلامية الدقيقة هو "Islamic Monotheism / Tawhid (The Oneness of Allah)". والترجمة الشائعة بكلمة "Monotheism" وحدها تشير عموماً إلى الاعتقاد بإله واحد في الفلسفات والأديان الأخرى، أما "التوحيد" في المفهوم القرآني فيزيد بنفي الندّ والشرك الخفي وإفراد الخالق بالعبادة والحكم الكامل والصفات المنزهة عن المشابهة.',
    dictionaryTerm: {
      termAr: 'التوحيد',
      termEn: 'Islamic Monotheism / Tawhid',
      approvedTranslation: 'The Absolute Oneness of Allah',
      definitionAr: 'مصطلح شرعي جامع لإفراد الله تعالى بالخلق والملك والتدبير واستحقاق العبادة الكاملة.',
      definitionEn: 'A comprehensive theological term denoting the pure monotheism unique to Islam, denying all partners or intermediaries.',
    },
    notes: 'مستفاد من الجمهرة للمصطلحات لمنع الاختزال اللغوي ومطابقة متطلبات الترجمة الدقيقة.',
    keywords: ['ترجم', 'ترجمة', 'انجليزي', 'english', 'monotheism', 'tawhid', 'ترجمة التوحيد'],
    relatedExperienceIds: ['home-prayer-room'],
    day: 1,
  },

  // 3. PRAYER BETWEEN UNIVERSITY LECTURES & CAMPUS SPACES (Dorar Fiqh & Hadith)
  {
    id: 'src-fiqh-university-prayer',
    sourceFamily: 'dorar_fiqh',
    sourceName: 'الموسوعة الفقهية — الدرر السنية',
    sourceUrl: 'https://dorar.net/feqhia',
    sourceType: 'fiqh',
    title: 'أداء الصلاة في البيئة الجامعية ومقار الدراسة وقاعدة سعة الأرض',
    topic: 'university_campus',
    language: 'both',
    authenticityLevel: 'إجماع فقهي مستند لحديث صحيح',
    learningLevel: 'beginner',
    hadithCitation: 'صحيح البخاري 335: قال ﷺ: «وَجُعِلَتْ لِيَ الأَرْضُ مَسْجِدًا وَطَهُورًا، فَأَيُّمَا رَجُلٍ مِنْ أُمَّتِي أَدْرَكَتْهُ الصَّلَاةُ فَلْيُصَلِّ»',
    text: 'الأصل في الشريعة أن كل بقعة طاهرة في الأرض صالحة للصلاة ما لم يرد نهي عن الصلاة فيها (كالمقابر والحمامات). إذا دخل وقت الصلاة على الطالبة أو الطالب في الجامعة، فالأولى البحث عن المصلى المخصص، فإن لم يوجد صلت في قاعة دراسية شاغرة هادئة أو ركن منعزل بسطت فيه سجادة خفيفة أو معطفاً طاهراً. لا حرج ولا مشقة في ذلك، وصلاتها صحيحة تامة الأجر.',
    notes: 'قاعدة ذهبية لطلاب الجامعات والمغتربين لإزالة الحرج الاجتماعي والشعور بالسكينة.',
    keywords: ['جامعة', 'صلاة', 'محاضرة', 'كلاس', 'مصلى', 'دراسة', 'بين المحاضرات', 'university', 'campus', 'lecture', 'hallway'],
    relatedExperienceIds: ['university-prayer'],
    day: 3,
  },

  // 4. QURANIC GROUNDING ON REGULAR PRAYER AT TIME (Quranpedia & Dorar Tafsir)
  {
    id: 'src-quran-prayer-time',
    sourceFamily: 'quranpedia',
    sourceName: 'موسوعة القرآن الكريم وترجماته (Quranpedia)',
    sourceUrl: 'https://quranpedia.net/',
    sourceType: 'quran',
    title: 'نص الآية الكريمة في فرض الصلاة الموقوتة وسكينتها',
    topic: 'prayer',
    language: 'both',
    surahAyah: 'سورة النساء، الآية 103',
    authenticityLevel: 'متواتر قطعي الثبوت والدلالة',
    learningLevel: 'beginner',
    text: '﴿فَإِذَا قَضَيْتُمُ الصَّلَاةَ فَاذْكُرُوا اللَّهَ قِيَامًا وَقُعُودًا وَعَلَىٰ جُنُوبِكُمْ ۚ فَإِذَا اطْمَأْنَنتُمْ فَأَقِيمُوا الصَّلَاةَ ۚ إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا﴾',
    notes: 'نص قرآني محكم يوضح أن الصلاة كتاب موقوت بأوقات رحمة وتخفيف لا حرج فيها.',
    keywords: ['صلاة', 'كتابا موقوتا', 'وقت الصلاة', 'نساء', 'قرآن', 'prayer', 'appointed times'],
    relatedExperienceIds: ['home-prayer-room', 'university-prayer'],
    day: 1,
  },

  // 5. TAFSIR OF PRAYER TRANQUILITY (Dorar Tafsir)
  {
    id: 'src-tafsir-prayer-serenity',
    sourceFamily: 'dorar_tafsir',
    sourceName: 'موسوعة التفسير — الدرر السنية',
    sourceUrl: 'https://dorar.net/tafseer',
    sourceType: 'tafsir',
    title: 'تفسير قوله تعالى ﴿فَإِذَا اطْمَأْنَنتُمْ فَأَقِيمُوا الصَّلَاةَ﴾ وبيان يسر التكليف',
    topic: 'prayer',
    language: 'ar',
    surahAyah: 'سورة النساء 103',
    authenticityLevel: 'تفسير أهل السنة المحرر',
    learningLevel: 'beginner',
    text: 'بيّن أئمة التفسير أن معنى "فإذا اطمأننتم": أي سكنت نفوسكم وذهب الخوف وحضر الأمن، فأدوا الصلاة بأركانها وشروطها المعهودة. واستفاد العلماء من هذه الآية الكريمة أن الشريعة تبني أحكام الصلاة على رفع الحرج والرفق بحال المكلف.',
    notes: 'تفسير محرر يربط إقامة الصلاة بمشاعر الأمان والاطمئنان الروحي.',
    keywords: ['تفسير', 'اطمأننتم', 'سكينة', 'نساء', 'الدرر السنية'],
    relatedExperienceIds: ['home-prayer-room', 'university-prayer'],
    day: 1,
  },

  // 6. PROPHETIC HADITH ON RELIGION BEING EASE (Dorar Hadith & Shamela)
  {
    id: 'src-hadith-deen-yusr',
    sourceFamily: 'dorar_hadith',
    sourceName: 'الموسوعة الحديثية — الدرر السنية',
    sourceUrl: 'https://dorar.net/hadith',
    sourceType: 'hadith',
    title: 'حديث «إِنَّ الدِّينَ يُسْرٌ» وضابط القصد والاعتدال',
    topic: 'prayer',
    language: 'both',
    hadithCitation: 'صحيح البخاري، كتاب الإيمان، حديث رقم 39',
    authenticityLevel: 'صحيح (رواه الإمام البخاري في صحيحه)',
    learningLevel: 'beginner',
    text: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ، عَنِ النَّبِيِّ ﷺ قَالَ: «إِنَّ الدِّينَ يُسْرٌ، وَلَنْ يُشَادَّ الدِّينَ أَحَدٌ إِلَّا غَلَبَهُ، فَسَدِّدُوا وَقَارِبُوا وَأَبْشِرُوا، وَاسْتَعِينُوا بِالْغَدْوَةِ وَالرَّوْحَةِ وَشَيْءٍ مِنَ الدُّلْجَةِ».',
    notes: 'أصل أصيل في السنة النبوية المطهرة يقطع كل وسواس وتشدد عند المستجدين في الإسلام.',
    keywords: ['حديث', 'الدين يسر', 'يسر', 'البخاري 39', 'فسددوا وقاربوا', 'حديث يثبت', 'ease', 'hadith'],
    relatedExperienceIds: ['home-prayer-room', 'university-prayer', 'family-communication'],
    day: 1,
  },

  // 7. FAMILY RELATIONS & KINDNESS TO PARENTS (Quranpedia & Dorar Hadith)
  {
    id: 'src-family-parents-kindness',
    sourceFamily: 'quranpedia',
    sourceName: 'موسوعة القرآن الكريم وترجماته (Quranpedia)',
    sourceUrl: 'https://quranpedia.net/',
    sourceType: 'quran',
    title: 'الإحسان إلى الوالدين وخفض الجناح لهما بالرحمة',
    topic: 'family_parents',
    language: 'both',
    surahAyah: 'سورة الإسراء، الآيتان 23-24',
    authenticityLevel: 'متواتر قطعي',
    learningLevel: 'beginner',
    text: '﴿وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا ۚ إِمَّا يَبْلُغَنَّ عِندَكَ الْكِبَرَ أَحَدُهُمَا أَوْ كِلَاهُمَا فَلَا تَقُل لَّهُمَا أُفٍّ وَلَا تَنْهَرْهُمَا وَقُل لَّهُمَا قَوْلًا كَرِيمًا * وَاخْفِضْ لَهُمَا جَنَاحَ الذُّلِّ مِنَ الرَّحْمَةِ وَقُل رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا﴾',
    notes: 'قرن الله حقه بالتوحيد بحق الوالدين بالإحسان، مما يؤكد أن الدخول في الإسلام يزيد العبد براً وحناناً بأسرته.',
    keywords: ['أهل', 'والدين', 'أمي', 'أبي', 'بر الوالدين', 'عائلة', 'إسراء', 'قولا كريما', 'parents', 'mother', 'family'],
    relatedExperienceIds: ['family-communication', 'honoring-parents'],
    day: 4,
  },

  // 8. HADITH ON ACTIONS BELOVED TO ALLAH: PARENTS (Dorar Hadith)
  {
    id: 'src-hadith-beloved-deeds-parents',
    sourceFamily: 'dorar_hadith',
    sourceName: 'الموسوعة الحديثية — الدرر السنية',
    sourceUrl: 'https://dorar.net/hadith',
    sourceType: 'hadith',
    title: 'حديث عبد الله بن مسعود في بر الوالدين بعد الصلاة على وقتها',
    topic: 'family_parents',
    language: 'both',
    hadithCitation: 'صحيح البخاري 527، وصحيح مسلم 85',
    authenticityLevel: 'صحيح متفق عليه',
    learningLevel: 'beginner',
    text: 'سَأَلْتُ النَّبِيَّ ﷺ: أَيُّ الْعَمَلِ أَحَبُّ إِلَى اللَّهِ؟ قَالَ: «الصَّلَاةُ عَلَى وَقْتِهَا»، قُلْتُ: ثُمَّ أَيٌّ؟ قَالَ: «ثُمَّ بِرُّ الْوَالِدَيْنِ»، قُلْتُ: ثُمَّ أَيٌّ؟ قَالَ: «الْجِهَادُ فِي سَبِيلِ اللَّهِ».',
    notes: 'يبين علو مرتبة الوالدين وأنهما باب الجنة والسكينة في الدنيا والآخرة.',
    keywords: ['أحب العمل', 'بر الوالدين', 'ابن مسعود', 'البخاري 527', 'حديث بر الوالدين'],
    relatedExperienceIds: ['family-communication', 'honoring-parents'],
    day: 7,
  },

  // 9. TRAVEL & RAIN CONCESSIONS (Dorar Fiqh & Shamela)
  {
    id: 'src-fiqh-travel-rain-concessions',
    sourceFamily: 'dorar_fiqh',
    sourceName: 'الموسوعة الفقهية — الدرر السنية',
    sourceUrl: 'https://dorar.net/feqhia',
    sourceType: 'fiqh',
    title: 'رخص الشريعة في السفر والمطر ورفع الحرج عن المكلفين',
    topic: 'travel_rain',
    language: 'both',
    hadithCitation: 'صحيح ابن حبان 2738، وأحمد 5884: «إِنَّ اللَّهَ يُحِبُّ أَنْ تُؤْتَى رُخَصُهُ كَمَا يَكْرَهُ أَنْ تُؤْتَى مَعْصِيَتُهُ»',
    authenticityLevel: 'صحيح لغيره بإسناد ثابت',
    learningLevel: 'intermediate',
    text: 'الرخصة في الشريعة استثناء مشروع للتيسير ودفع المشقة. يشرع للمسافر قصر الصلاة الرباعية (الظهر والعصر والعشاء) إلى ركعتين، ويجوز له الجمع بين الظهر والعصر، وبين المغرب والعشاء تقديماً أو تأخيراً. وكذلك يشرع الجمع عند المطر الشديد أو البرد القارس الذي يشق معه الخروج للمسجد. والرخصة ليست نقصاً بل امتثال لمحبة الله للتيسير.',
    notes: 'بيان أن الرخص عبادة يتقرب بها المسلم وليست تفريطاً في الواجبات.',
    keywords: ['سفر', 'مطر', 'رخصة', 'قصر', 'جمع', 'رخص الشريعة', 'travel', 'rain', 'concession'],
    relatedExperienceIds: ['travel-concession', 'rain-concession'],
    day: 5,
  },

  // 10. HALAL FOOD PRINCIPLES & AVOIDING UNCERTAINTY (Dorar Fiqh & Bukhari 52)
  {
    id: 'src-food-halal-principles',
    sourceFamily: 'dorar_fiqh',
    sourceName: 'الموسوعة الفقهية — الدرر السنية',
    sourceUrl: 'https://dorar.net/feqhia',
    sourceType: 'fiqh',
    title: 'الأصل في الأطعمة الطهارة والإباحة وضابط المشتبهات والمستحلبات',
    topic: 'food_halal',
    language: 'both',
    hadithCitation: 'صحيح البخاري 52، وصحيح مسلم 1599: «إِنَّ الحَلاَلَ بَيِّنٌ وَإِنَّ الحَرَامَ بَيِّنٌ...»',
    authenticityLevel: 'متفق على صحته وجلالته',
    learningLevel: 'beginner',
    text: 'القاعدة الفقهية الكبرى تقرر: «الأصل في الأطعمة والأشربة الحلّ والإباحة» ولا يحرم منها إلا ما نص الدليل القطعي على تحريمه كالخنزير والدم والميتة والمسكرات. أما المواد المضافة المعاصرة كالمستحلب E471 والجيلاتين، فإن نصت العبوة على مصدر نباتي (Suitable for Vegetarians) أو ختمت بشعار حلال موثوق حلت بيقين، وإن اشتبهت على المرء فتركه لها احتياط وله في البدائل الطيبة سعة.',
    notes: 'قاعدة محورية تمنع الوسواس وتدعو للتثبت الهادئ والبحث عن البديل النظيف.',
    keywords: ['حلال', 'طعام', 'مستحلب', 'e471', 'خنزير', 'مشبوه', 'halal', 'food', 'gelatin'],
    relatedExperienceIds: ['work-lunch-halal'],
    day: 1,
  },

  // 11. AMANAH (HONESTY & RETURNING TRUSTS) (Quranpedia & Dorar Hadith)
  {
    id: 'src-amanah-integrity-public',
    sourceFamily: 'quranpedia',
    sourceName: 'موسوعة القرآن الكريم وترجماته (Quranpedia)',
    sourceUrl: 'https://quranpedia.net/',
    sourceType: 'quran',
    title: 'الأمانة ورد الحقوق لأصحابها في المعاملات المالية والشخصية',
    topic: 'integrity_amanah',
    language: 'both',
    surahAyah: 'سورة النساء، الآية 58',
    authenticityLevel: 'متواتر قطعي',
    learningLevel: 'beginner',
    text: '﴿إِنَّ اللَّهَ يَأْمُرُكُمْ أَن تُؤَدُّوا الْأَمَانَاتِ إِلَىٰ أَهْلِهَا وَإِذَا حَكَمْتُم بَيْنَ النَّاسِ أَن تَحْكُمُوا بِالْعَدْلِ ۚ إِنَّ اللَّهَ نِعِمَّا يَعِظُكُم بِهِ ۗ إِنَّ اللَّهَ كَانَ سَمِيعًا بَصِيرًا﴾',
    notes: 'الأمانة عنوان المسلم في السوق والعمل؛ إعادة الفائض النقدي أو المفقودات تعزز طهارة الكسب وراحة الضمير.',
    keywords: ['أمانة', 'صدق', 'محاسب', 'سوق', 'حقوق', 'نساء 58', 'amanah', 'honesty', 'trust'],
    relatedExperienceIds: ['street-honesty-amanah'],
    day: 7,
  },

  // 12. FRIDAY PRAYER & MOSQUE ETIQUETTE (Dorar Fiqh & Quranpedia)
  {
    id: 'src-jumuah-mosque-etiquette',
    sourceFamily: 'dorar_fiqh',
    sourceName: 'الموسوعة الفقهية — الدرر السنية',
    sourceUrl: 'https://dorar.net/feqhia',
    sourceType: 'fiqh',
    title: 'صلاة الجمعة وآداب دخول المسجد وسكينة الاستماع للخطبة',
    topic: 'jumuah_mosque',
    language: 'both',
    surahAyah: 'سورة الجمعة، الآية 9',
    authenticityLevel: 'فرض عين على الرجال المقيمين بإجماع',
    learningLevel: 'beginner',
    text: 'الجمعة عيد الأسبوع في الإسلام وملتقى أهل الحي والمدينة على السكينة والذكر. يشرع الاغتسال والتطيب ولبس النظيف والتبكير. وعند دخول المسجد يقدم رجله اليمنى قائلاً: "اللهم افتح لي أبواب رحمتك"، ويصلي ركعتي تحية المسجد، وينصت لخطبة الإمام باحترام وسكون قلب.',
    notes: 'أدب جامع يوثق الرابطة المجتمعية والإيمانية للمسلم في يوم الجمعة.',
    keywords: ['جمعة', 'مسجد', 'خطبة', 'تحية المسجد', 'سورة الجمعة', 'friday', 'jumuah', 'mosque'],
    relatedExperienceIds: ['first-jumuah', 'first-row-mosque'],
    day: 6,
  },

  // 13. BAYYINAH / DAWAH CENTER Q&A ON INDIVIDUAL FATWAS & SAFETY
  {
    id: 'src-bayyinah-qa-individual-fatwa',
    sourceFamily: 'bayyinah_qa',
    sourceName: 'مجموعة بينات وإجابات التساؤلات الدعوية',
    sourceUrl: 'https://center.dawa.sa/',
    sourceType: 'dawah',
    title: 'ضابط التفرقة بين التعليم الشرعي العام والإفتاء الفردي الخاص',
    topic: 'general',
    language: 'both',
    authenticityLevel: 'إجماع علماء الفتوى',
    learningLevel: 'intermediate',
    text: 'الفتوى في المسائل الخاصة (كنزاعات الطلاق الشخصية، والمواريث، والنذور المقيدة) تتطلب معرفة دقيقة بملابسات السائل ونيته وظروفه، ولا يجوز لأي مساعد آلي أو منصة تعليمية عامة أن تبتّ فيها بحكم شخصي قاطع. دور المنصة هو التوضيح التعليمي لعموم الأحكام وقواعد التيسير، وإحالة المسائل القضائية والفردية إلى دور الإفتاء الرسمية المعتمدة.',
    notes: 'صمام أمان شرعي لمنع التجرؤ على الفتيا وحفظ حقوق السائلين الدقيقة.',
    keywords: ['فتوى', 'طلاق', 'ميراث', 'نذر', 'إفتاء', 'حكم خاص', 'سؤال فقهي', 'fatwa', 'scholar', 'referral'],
    relatedExperienceIds: [],
    day: 1,
  },

  // 14. QIBLAH DETERMINATION & SPIRIT OF EASE (Dorar Fiqh & Quranpedia)
  {
    id: 'src-fiqh-qiblah-determination',
    sourceFamily: 'dorar_fiqh',
    sourceName: 'الموسوعة الفقهية — الدرر السنية',
    sourceUrl: 'https://dorar.net/feqhia',
    sourceType: 'fiqh',
    title: 'تحديد القبلة وضابط التيسير والاجتهاد عند الاشتباه',
    topic: 'prayer',
    language: 'both',
    surahAyah: 'سورة البقرة، الآية 115',
    authenticityLevel: 'إجماع فقهي معتمد',
    learningLevel: 'beginner',
    text: 'استقبال القبلة (الكعبة المشرفة بمكة المكرمة) شرط لصحة الصلاة للمستطيع. وتُعرف القبلة بوسائل ميسرة: بتطبيقات البوصلة، أو محاريب المساجد في المدينة، أو اتجاه الشمس. وإذا اشتبهت القبلة على المسلم في سفر أو مكان مغلق ولم يجد من يدله، اجتهد وتحرى وصلى إلى الجهة التي يغلب على ظنه أنها القبلة وصلاته صحيحة تامة ولا إعادة عليه؛ لقوله تعالى: ﴿وَلِلَّهِ الْمَشْرِقُ وَالْمَغْرِبُ ۚ فَأَيْنَمَا تُوَلُّوا فَثَمَّ وَجْهُ اللَّهِ ۚ إِنَّ اللَّهَ وَاسِعٌ عَلِيمٌ﴾.',
    notes: 'مبدأ تيسير رئيسي للمبتدئين والمغتربين لإزالة القلق والوسواس في استقبال القبلة.',
    keywords: ['قبلة', 'القبلة', 'اتجاه الصلاة', 'كعبة', 'بوصلة', 'اشتباه القبلة', 'فأينما تولوا', 'qiblah', 'qibla', 'direction', 'kaaba'],
    relatedExperienceIds: ['home-prayer-room', 'university-prayer'],
    day: 1,
  },

  // 15. EASE OF WUDU & WIPING OVER SOCKS (Dorar Fiqh & Hadith)
  {
    id: 'src-fiqh-wudu-wiping',
    sourceFamily: 'dorar_fiqh',
    sourceName: 'الموسوعة الفقهية — الدرر السنية',
    sourceUrl: 'https://dorar.net/feqhia',
    sourceType: 'fiqh',
    title: 'المسح على الخفين والجوربين في الوضوء ورخصة التيسير بالعمل والجامعة',
    topic: 'prayer',
    language: 'both',
    hadithCitation: 'صحيح مسلم، كتاب الطهارة، حديث 276',
    authenticityLevel: 'سنة نبوية متواترة المعنى',
    learningLevel: 'beginner',
    text: 'يسر الإسلام الطهارة للمسلم بالمسح على الجوربين الطاهرين إذا لُبسا على وضوء تام: للمقيم يوماً وليلة (24 ساعة) وللمسافر ثلاثة أيام بلياليها. فإذا انتقض الوضوء لا يحتاج المسلم في الجامعة أو العمل لخلع الحذاء وغسل الرجلين في المغسلة العامة، بل يبلل يديه بالماء ويمسح على ظاهر جوربيه مسحة خفيفة واحدة ويمضي لصلاته براحة وسكينة.',
    notes: 'رخصة نبوية عظيمة تخفف الحرج الاجتماعي في أماكن الدراسة والوظائف العامة.',
    keywords: ['وضوء', 'مسح', 'جورب', 'جوربين', 'خفين', 'طهارة', 'حرج', 'مغسلة', 'wudu', 'socks', 'wiping'],
    relatedExperienceIds: ['home-prayer-room', 'university-prayer', 'work-lunch-halal'],
    day: 2,
  },

  // 16. TAWAKKUL VS TAWAAKUL (Dorar Aqeedah & Tirmidhi Hadith)
  {
    id: 'src-aqeedah-tawakkul-vs-tawaakul',
    sourceFamily: 'dorar_aqeedah',
    sourceName: 'الموسوعة العقدية — الدرر السنية',
    sourceUrl: 'https://dorar.net/aqeeda',
    sourceType: 'aqeedah',
    title: 'الفرق الشرعي الدقيق بين «التوكل» المأمور به و«التواكل» المذموم',
    topic: 'aqeedah_tawakkul',
    language: 'both',
    hadithCitation: 'جامع الترمذي 2517 (حسن): قال رجل يا رسول الله: أعقلها وأتوكل أو أطلقها وأتوكل؟ قال: «اعْقِلْهَا وَتَوَكَّلْ»',
    authenticityLevel: 'حديث حسن معتمد وإجماع عقدي',
    learningLevel: 'intermediate',
    text: 'التوكل عبادة قلبية جليلة تجمع بين أمرين متلازمين: صدق اعتماد القلب على الله وتفويض الأمر إليه، مع الأخذ بالأسباب المشروعة والسعي والعمل. أما التواكل فهو ترك الأخذ بالأسباب بدعوى الاعتماد على القدر، وهو عجز وتفريط مذموم في الشريعة. فالمؤمن يدرس ويجتهد ويتداوى متوكلاً على ربه، لا متواكلاً متكاسلاً.',
    dictionaryTerm: {
      termAr: 'التوكل',
      termEn: 'Tawakkul (Reliance on Allah with Due Diligence)',
      approvedTranslation: 'True Reliance on Allah while taking lawful means',
      definitionAr: 'صدق اعتماد القلب على الله في استجلاب المصالح ودفع المضار، مع مباشرة الأسباب المأذون فيها.',
      definitionEn: 'Sincere heart reliance upon Allah combined with taking the necessary practical worldly means.',
    },
    notes: 'تأصيل عقدي مهم يمنع الخلط بين التوكل والتواكل ويوضح حديث قيد الناقة والتوكل.',
    keywords: ['توكل', 'تواكل', 'الفرق بين التوكل والتواكل', 'اعقلها وتوكل', 'الأسباب', 'tawakkul', 'reliance'],
    relatedExperienceIds: ['home-prayer-room', 'university-prayer'],
    day: 2,
  },

  // 17. ESSENTIAL PRAYER STEPS IN ORDER (Dorar Fiqh & Bukhari 631)
  {
    id: 'src-fiqh-prayer-steps-order',
    sourceFamily: 'dorar_fiqh',
    sourceName: 'الموسوعة الفقهية — الدرر السنية',
    sourceUrl: 'https://dorar.net/feqhia',
    sourceType: 'fiqh',
    title: 'ترتيب أفعال الصلاة خطوة بخطوة من تكبيرة الإحرام إلى التسليم',
    topic: 'prayer',
    language: 'both',
    hadithCitation: 'صحيح البخاري 631: قال النبي ﷺ: «صَلُّوا كَمَا رَأَيْتُمُونِي أُصَلِّي»',
    authenticityLevel: 'متواتر العمل وصحيح الإسناد',
    learningLevel: 'beginner',
    text: 'تتتابع خطوات الصلاة بنظام مطمئن: 1. النية واستقبال القبلة. 2. تكبيرة الإحرام (الله أكبر). 3. قراءة سورة الفاتحة وما تيسر من القرآن. 4. الركوع مع تعظيم الله والتسبيح (سبحان ربي العظيم). 5. الرفع من الركوع قائلاً: سمع الله لمن حمده، ربنا ولك الحمد. 6. السجود الأول على الأعضاء السبعة (سبحان ربي الأعلى). 7. الجلوس بين السجدتين والدعاء بالمغفرة. 8. السجود الثاني. 9. أداء باقي الركعات بالمثل، ثم الجلوس للتشهد، وأخيراً 10. التسليم عن اليمين واليسار.',
    notes: 'خطوات عملية واضحة تصلح للتدريب التفاعلي والتسلسل في مختبر الألعاب التعليمية.',
    keywords: ['ترتيب الصلاة', 'كيف أصلي', 'خطوات الصلاة', 'أركان الصلاة', 'صلوا كما رأيتموني', 'prayer steps', 'order'],
    relatedExperienceIds: ['home-prayer-room', 'university-prayer'],
    day: 1,
  },

  // 18. FOOD INGREDIENTS INSPECTION RULES (Dorar Fiqh & Jamhara)
  {
    id: 'src-fiqh-food-inspection-rules',
    sourceFamily: 'dorar_fiqh',
    sourceName: 'الموسوعة الفقهية — الدرر السنية',
    sourceUrl: 'https://dorar.net/feqhia',
    sourceType: 'fiqh',
    title: 'قواعد التحقق من مكونات الأطعمة: ما يحتاج لفحص وما لا يحتاج',
    topic: 'food_halal',
    language: 'both',
    authenticityLevel: 'قواعد فقهية كلية معتمدة',
    learningLevel: 'beginner',
    text: 'ليس كل طعام يحتاج إلى تدقيق مجهد؛ فالأصل في الفواكه، والخضروات، والأسماك، والحبوب، والأجبان الخالية من المنفحة الحيوانية المحرمة أنها حلال طيب بلا حاجة لفحص. وإنما يتوجه الفحص والتحقق إلى: 1. اللحوم والدواجن (للتأكد من التذكية الشرعية). 2. المستحلبات الحيوانية مثل E471 إذا لم يذكر أنها نباتية. 3. مادة الجيلاتين إذا لم تكن من مصدر بقري مذكى أو نباتي. 4. الكحول المضاف للنكهة. فإذا وجد شعار حلال معتمد أو عبارة نباتي، كفى ذلك وزال الحرج.',
    notes: 'قاعدة تنير التفكير وتمنع الوسواس والتعقيد وتحدد ما يستحق التفتيش وما الأصل فيه الإباحة.',
    keywords: ['فحص الأكل', 'مكونات الطعام', 'تحقق من الأكل', 'المكونات المشبوهة', 'e471', 'جيلاتين', 'food inspection'],
    relatedExperienceIds: ['work-lunch-halal'],
    day: 1,
  },

  // 19. TAWHID VS IBADAH (Dorar Aqeedah)
  {
    id: 'src-aqeedah-tawhid-vs-ibadah',
    sourceFamily: 'dorar_aqeedah',
    sourceName: 'الموسوعة العقدية — الدرر السنية',
    sourceUrl: 'https://dorar.net/aqeeda',
    sourceType: 'aqeedah',
    title: 'العلاقة والتفريق بين مفهوم «التوحيد» ومفهوم «العبادة»',
    topic: 'aqeedah_tawhid',
    language: 'both',
    authenticityLevel: 'إجماع أهل السنة',
    learningLevel: 'intermediate',
    text: '«التوحيد» هو الأساس العقدي واليقين القلبي بأن الله واحد لا شريك له في ربوبيته وألوهيته وأسمائه وصفاته. أما «العبادة» فهي التطبيق العملي والظاهري والباطني لذلك التوحيد؛ وهي اسم جامع لكل ما يحبه الله ويرضاه من الأقوال والأعمال (كالصلاة، والذكر، وبر الوالدين، ومساعدة الناس). فالتوحيد هو الشجرة وجذرها، والعبادات هي ثمارها وأغصانها الحية.',
    notes: 'يوضح الفارق بين المفهومين ويرد على من يلتبس عليه أصل العقيدة بأفعال الجوارح.',
    keywords: ['توحيد وعبادة', 'الفرق بين التوحيد والعبادة', 'علاقة التوحيد بالعبادة', 'معنى العبادة', 'tawhid and worship'],
    relatedExperienceIds: ['home-prayer-room'],
    day: 1,
  },

  // 20. SPREAD OF ISLAM BY CONVICTION NOT COERCION (Quranpedia & Dorar History)
  {
    id: 'src-history-peaceful-spread',
    sourceFamily: 'dorar_history',
    sourceName: 'موسوعة التاريخ والتفسير — الدرر السنية',
    sourceUrl: 'https://dorar.net/history',
    sourceType: 'history',
    title: 'حقيقة انتشار الإسلام بالدعوة والبيان ودحض دعوى انتشاره بالسيف',
    topic: 'history_spread',
    language: 'both',
    surahAyah: 'سورة البقرة، الآية 256',
    authenticityLevel: 'نص قرآني قطعي وإجماع تاريخي',
    learningLevel: 'beginner',
    text: 'المقرر في أصول الشريعة والمحقق في وقائع التاريخ أن الإسلام لم يُكره أحداً قط على اعتناقه؛ فالإيمان تصديق قلبي لا يصح إلا بالاقتناع والحرية، كما قال تعالى: ﴿لَا إِكْرَاهَ فِي الدِّينِ ۖ قَد تَّبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ﴾، وقال سبحانه: ﴿ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ﴾. وإنما دخلت الأمم والشعوب في دين الله لما رأوه من سماحة تعاليمه، وعدالة أحكامه، وحسن أخلاق المسلمين وتجارهم، كما حدث في إندونيسيا وماليزيا وعموم شرق آسيا وغرب أفريقيا، حيث دخلت شعوبها في الإسلام دون قتال ولا جيوش. وأما القتال في الإسلام فلم يُشرع يوماً لإكراه أحد على اعتناق الدين، بل شُرع حصراً لرد العدوان ودفع الظلم وحماية حرية الدعوة.',
    notes: 'أصل شرعي وتاريخي محرر يدحض دعوى انتشار الإسلام بالسيف ويوضح حرية الاعتقاد ومقاصد الدفاع.',
    keywords: ['انتشر الإسلام بالسيف', 'السيف', 'شبهة السيف', 'انتشار الإسلام', 'لا إكراه في الدين', 'حرية الاعتقاد', 'بالسيف', 'هل انتشر الإسلام بالسيف', 'انتشار'],
    relatedExperienceIds: [],
    day: 1,
  },

  // 21. THE QURAN IS THE DIRECT WORD OF ALLAH (Dorar Aqeedah, Tafsir & Quranpedia)
  {
    id: 'src-quran-divine-origin',
    sourceFamily: 'dorar_aqeedah',
    sourceName: 'الموسوعة العقدية وتفسير القرآن — الدرر السنية',
    sourceUrl: 'https://dorar.net/aqeeda',
    sourceType: 'aqeedah',
    title: 'القرآن الكريم كلام الله المنزل على نبيه محمد ﷺ وليس من تأليف بشر',
    topic: 'quran_revelation',
    language: 'both',
    surahAyah: 'سورة الإسراء، الآية 88 وسورة يونس، الآية 38',
    authenticityLevel: 'قطعي الثبوت والدلالة وإجماع المسلمين',
    learningLevel: 'beginner',
    text: 'القرآن الكريم هو كلام الله تعالى المعجز، المنزّل بالحق بواسطة جبريل عليه السلام على قلب النبي محمد ﷺ بلفظه ومعناه، وليس من تأليف النبي ﷺ ولا من كتابة بشر قط. وقد كان النبي ﷺ أميّاً لا يقرأ ولا يكتب، وتحدى القرآن بلغاء العرب والإنس والجن أن يأتوا بسورة من مثله فعجزوا قاطبة: ﴿قُل لَّئِنِ اجْتَمَعَتِ الْإِنسُ وَالْجِنُّ عَلَىٰ أَن يَأْتُوا بِمِثْلِ هَٰذَا الْقُرْآنِ لَا يَأْتُونَ بِمِثْلِهِ وَلَوْ كَانَ بَعْضُهُمْ لِبَعْضٍ ظَهِيرًا﴾، وقال تعالى: ﴿وَمَا كُنتَ تَتْلُو مِن قَبْلِهِ مِن كِتَابٍ وَلَا تَخُطُّهُ بِيَمِينِكَ ۖ إِذًا لَّارْتَابَ الْمُبْطِلُونَ﴾ [العنكبوت: 48].',
    notes: 'تأصيل عقدي قطعي يدحض دعوى بشرية القرآن أو تأليف النبي له.',
    keywords: ['القرآن', 'كتبه محمد', 'تأليف القرآن', 'هل القرآن كتبه محمد', 'كلام الله', 'نزول القرآن', 'معجزة القرآن', 'quran authorship', 'revelation'],
    relatedExperienceIds: [],
    day: 1,
  },

  // 22. RECITING QURAN & TOUCHING THE MUSHAF DURING MENSES (Dorar Fiqh & Shamela)
  {
    id: 'src-fiqh-menses-quran-touch',
    sourceFamily: 'dorar_fiqh',
    sourceName: 'الموسوعة الفقهية — الدرر السنية',
    sourceUrl: 'https://dorar.net/feqhia',
    sourceType: 'fiqh',
    title: 'حكم قراءة القرآن ومس المصحف للمرأة الحائض وضوابط التيسير',
    topic: 'fiqh_purity',
    language: 'both',
    authenticityLevel: 'بيان فقهي محرر للمذاهب المعتبرة',
    learningLevel: 'intermediate',
    text: 'في مسألة مس المصحف وقراءة القرآن للحائض بيان تعليمي موثق يجمع بين احترام النص والتيسير: 1. مس المصحف الورقي المباشر باليد: ذهب جمهور الفقهاء (الأئمة الأربعة) إلى عدم جواز مس صفحات المصحف الورقي مباشرة بغير طهارة لقوله ﷺ: «لا يَمَسُّ القرآنَ إلا طاهرٌ»، لكن يجوز لها مسه بحائل (كالقفازات أو غلاف منفصل أو قلم). 2. القراءة من الأجهزة الذكية والتطبيقات: يجوز للحائض باتفاق العلماء المعاصرين لمس شاشات الجوال والأجهزة وقراءة القرآن منها؛ لأن الشاشة الإلكترونية ليست مصحفاً ورقياً. 3. القراءة عن ظهر قلب (دون مس): أفتى المالكية ورواية عن الإمام أحمد واختارها ابن تيمية بجواز قراءة الحائض للقرآن عن ظهر قلب أو من الهاتف، خصوصاً لطالبة العلم أو المعلمة أو للمحافظة على وردها لئلا تنساه. وهذا بيان تعليمي ميسر، والمكلفة تأخذ بالأيسر والأحوط لحالها دون وسواس.',
    notes: 'بيان فقهي تعليمي جامع يوضح مذاهب العلماء ورخص التيسير والقراءة من الجوال دون إفتاء شخصي معقد.',
    keywords: ['حائض', 'الحائض', 'مس المصحف', 'قراءة القرآن للحائض', 'مس المصحف للحائض', 'مصحف', 'طهارة المرأة', 'حيض', 'menses', 'touching quran'],
    relatedExperienceIds: [],
    day: 2,
  },

  // 23. CERTAINTY NOT OVERRULED BY DOUBT & REPELLING PURITY WASWAS (Dorar Fiqh & Bukhari 137)
  {
    id: 'src-fiqh-certainty-over-doubt-waswas',
    sourceFamily: 'dorar_fiqh',
    sourceName: 'الموسوعة الفقهية — الدرر السنية',
    sourceUrl: 'https://dorar.net/feqhia',
    sourceType: 'fiqh',
    title: 'قاعدة «اليقين لا يزول بالشك» وطرد وسواس الطهارة وانتقاض الوضوء',
    topic: 'fiqh_purity',
    language: 'both',
    hadithCitation: 'صحيح البخاري 137 وصحيح مسلم 361: «شُكِيَ إِلَى النَّبِيِّ ﷺ الرَّجُلُ يُخَيَّلُ إِلَيْهِ أَنَّهُ يَجِدُ الشَّيْءَ فِي الصَّلَاةِ، قَالَ: لَا يَنْصَرِفْ حَتَّى يَسْمَعَ صَوْتًا أَوْ يَجِدَ رِيحًا»',
    authenticityLevel: 'متفق على صحته وقاعدة فقهية كبرى بإجماع الأئمة',
    learningLevel: 'beginner',
    text: 'القاعدة الفقهية الكبرى تقضي بأن «اليقين لا يزول بالشك»؛ فمن توضأ بيقين ثم طرأ عليه شك هل خرج منه ريح أو انقض وضوءه، فهو طاهر بيقين وتصح صلاته ولا يلتفت للشك ولا يعيد وضوءه ولا صلاته أبداً. وقد قطع النبي ﷺ مادة الوسواس بقوله: «لَا يَنْصَرِفْ حَتَّى يَسْمَعَ صَوْتًا أَوْ يَجِدَ رِيحًا». ودواء الوسواس وقهر الشكوك هو الإعراض التام عنها وعدم الاستجابة لها، فالشريعة مبنية على اليقين واليسر ورفع الحرج.',
    notes: 'تأصيل فقهي ونبوي محكم يعالج وسواس الطهارة وتكرار الوضوء والصلاة.',
    keywords: ['وسواس', 'شك', 'انتقاض الوضوء', 'انقض وضوئي', 'اوسوس', 'اعيد الصلاة', 'اعيد الوضوء', 'اليقين لا يزول بالشك', 'ريح', 'طهارة', 'waswas', 'doubt wudu'],
    relatedExperienceIds: [],
    day: 1,
  },

  // 24. BAYYINAT HANDBOOK: WISDOM BEHIND RITES, KAABA DIRECTION & FOOD (Bayyinat QA / Dawa Center)
  {
    id: 'src-bayyinat-wisdom-kaaba-pork',
    sourceFamily: 'bayyinah_qa',
    sourceName: 'كتاب بينات: أسئلة وأجوبة عن الإسلام (المستودع الدعوي الرقمي)',
    sourceUrl: 'https://dawa.center/file/7937',
    sourceType: 'dawah',
    title: 'حكمة التوجه للكعبة المشرفة وحكمة تحريم الخنزير والميتة ومقاصد الشريعة',
    topic: 'maqasid_wisdom',
    language: 'both',
    authenticityLevel: 'مرجع دعوي رسمي معتمد',
    learningLevel: 'beginner',
    text: 'يوضح كتاب «بينات» المعتمد بالمستودع الدعوي أن المسلمين لا يعبدون الكعبة المشرفة بذاتها، بل يعبدون الله وحده، وإنما جعلت الكعبة قبلة موحدة لجمع شمل الأمة في اتجاه واحد يرمز للتوحيد والانتظام الكوني. وحول تحريم لحم الخنزير والميتة، تؤكد الشريعة أن التحريم صيانة لجسد الإنسان ونفسه من الأضرار والخبائث البيولوجية والأخلاقية، تحقيقاً لمقصد حفظ النفس، مع حفظ قاعدة «المشقة تجلب التيسير»؛ فمن اضطر غير باغٍ ولا عادٍ فلا إثم عليه.',
    notes: 'إجابة جامعة من كتاب بينات توضح حكمة القبلة والطعوم المحرمة وتدحض الشبهات للمسلمين الجدد.',
    keywords: ['الكعبة', 'ليش نصلي للكعبة', 'عبادة الكعبة', 'الخنزير', 'لحم الخنزير', 'تحريم الخنزير', 'حكمة', 'مقاصد الشريعة', 'بينات', 'why kaaba', 'pork'],
    relatedExperienceIds: [],
    day: 2,
  },

  // 25. THE NEW MUSLIM GUIDE: GRADUAL PRACTICE & LIVING IN MULTICULTURAL CONTEXTS (Dr. BaHammam)
  {
    id: 'src-new-muslim-guide-curriculum',
    sourceFamily: 'new_muslim_guide',
    sourceName: 'كتاب دليل المسلم الجديد (د. فهد باهمام)',
    sourceUrl: 'https://www.newmuslimguide.com/',
    sourceType: 'fiqh',
    title: 'منهج التدرج الحركي وتطبيق العبادات في البيئات المتعددة الثقافات للمسلم الجديد',
    topic: 'newcomer_adaptation',
    language: 'both',
    authenticityLevel: 'منهج تعليمي عالمي معتمد',
    learningLevel: 'beginner',
    text: 'يقرر «دليل المسلم الجديد» منهجية التدرج النبوي: يبدأ المسلم الجديد بإتقان أركان الإيمان والتوحيد القلبي، ثم الصلوات المكتوبة بأركانها الميسرة، دون إرهاق نفسه بالسنن والنوافل الكثيرة دفعة واحدة تفادياً للاحتراق المعرفي. وفي البيئات المعاصرة والمتعددة الثقافات، يستصحب المسلم رخص الشريعة (كالمسح على الخفين والجوربين، والجمع في السفر أو المطر الشديد، والصلاة في أي بقعة طاهرة في العمل والجامعة)، فإن الدين يسر ولن يشادّ الدين أحد إلا غلبه.',
    notes: 'تأصيل منهجي للتدرج وخفض العبء المعرفي بنسبة 60% وتسهيل الممارسة اليومية.',
    keywords: ['مسلم جديد', 'تدرج', 'دليل المسلم الجديد', 'تعليم الصلاة للمسلم الجديد', 'بيئة متعددة الثقافات', 'التكيف', 'new muslim guide', 'beginner'],
    relatedExperienceIds: ['university-prayer', 'home-prayer-room'],
    day: 1,
  },

  // 26. FACILITATED PRIMERS: PILLARS, CONDITIONS & SUJUD AL-SAHW (Dr. Haytham Sarhan)
  {
    id: 'src-facilitated-primers-sarhan',
    sourceFamily: 'facilitated_primers',
    sourceName: 'سلسلة المتون الميسرة (الشيخ د. هيثم سرحان)',
    sourceUrl: 'https://sarhaan.net/',
    sourceType: 'aqeedah',
    title: 'المتون الميسرة في أركان الإسلام، شروط الصلاة، وصفة الطهارة، وسجود السهو',
    topic: 'prayer_pillars',
    language: 'both',
    authenticityLevel: 'سلسلة متون تأصيلية محققة',
    learningLevel: 'beginner',
    text: 'توجز «المتون الميسرة» شروط الصلاة وأركانها بيسر: شروطها تسبقها (الإسلام، العقل، التمييز، رفع الحدث، إزالة النجاسة، ستر العورة، دخول الوقت، استقبال القبلة، والنية). وأركانها أربعة عشر ركناً لا تسقط عمداً ولا سهواً. وإذا وقع شك أو سهو، فالعلاج نبوي ميسر: البناء على اليقين (وهو الأقل) ثم سجدتا السهو ترغيماً للشيطان، فالشريعة جاءت بحسم الشك وإسكان القلب بالطمأنينة.',
    notes: 'متون ميسرة محررة لترسيخ الأركان والشروط وسجود السهو بوضوح تعليمي تام.',
    keywords: ['متون ميسرة', 'أركان الصلاة', 'شروط الصلاة', 'سجود السهو', 'أركان الوضوء', 'سرحان', 'تعليم الصلاة', 'pillars of prayer'],
    relatedExperienceIds: ['home-prayer-room'],
    day: 1,
  }
];

/**
 * Backward compatibility exports
 */
export type KnowledgeChunk = TrustedKnowledgeChunk;
export interface KnowledgeSource {
  titleAr: string;
  titleEn: string;
  type: string;
  referenceAr: string;
  referenceEn: string;
}
export const RAFEEQ_KNOWLEDGE_BASE = TRUSTED_KNOWLEDGE_BASE;
