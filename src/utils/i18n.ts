import { CityType, Gender, AgeGroup, Language, UserProfile } from '../types';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'rtl' | 'ltr';
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
];

export interface CityTypeDetails {
  id: CityType;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  badge: Record<Language, string>;
  difficulty: Record<Language, string>;
  difficultyLevel: 1 | 2 | 3;
  features: Record<Language, string[]>;
  prayerGuide: Record<Language, string>;
  dietaryTip: Record<Language, string>;
  colorTheme: {
    bgBanner: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    skyGradient: string;
  };
}

export const CITY_TYPES: Record<CityType, CityTypeDetails> = {
  islamic: {
    id: 'islamic',
    title: {
      ar: 'مدينة إسلامية',
      en: 'Islamic City',
      fr: 'Ville Islamique',
      es: 'Ciudad Islámica',
    },
    subtitle: {
      ar: 'بيئة داعمة مع مساجد في كل حي وأذان مسموع',
      en: 'High support environment with abundant mosques and audible Adhan',
      fr: 'Environnement très favorable avec mosquées abondantes et Adhan audible',
      es: 'Entorno de gran apoyo con mezquitas abundantes y llamada audible',
    },
    badge: {
      ar: '🕌 بيئة داعمة وميسرة',
      en: '🕌 High Community Support',
      fr: '🕌 Fort Soutien Communautaire',
      es: '🕌 Alto Apoyo Comunitario',
    },
    difficulty: {
      ar: 'ميسرة ومدعومة',
      en: 'Accessible & Serene',
      fr: 'Accessible & Paisible',
      es: 'Accesible y Apacible',
    },
    difficultyLevel: 1,
    features: {
      ar: [
        'أذان مسموع ينعش النفس 5 مرات يومياً',
        'مساجد قريبة ومصليات متاحة بكل مركز وسوق',
        'طعام حلال وفير ومتوفر تلقائياً',
        'مجتمع مرحب بالمسلم الجديد وتسهيلات واسعة',
      ],
      en: [
        'Audible Adhan echoing peacefully 5 times a day',
        'Accessible mosques in every neighborhood and center',
        'Abundant halal dining options universally available',
        'Welcoming community celebrating your spiritual journey',
      ],
      fr: [
        'Adhan audible résonnant paisiblement 5 fois par jour',
        'Mosquées accessibles dans chaque quartier',
        'Options alimentaires halal universellement disponibles',
        'Communauté accueillante célébrant votre parcours',
      ],
      es: [
        'Llamada a la oración (Adhan) audible 5 veces al día',
        'Mezquitas accesibles en cada barrio y centro',
        'Opciones de comida halal disponibles en todas partes',
        'Comunidad acogedora que apoya tu nuevo camino espiritual',
      ],
    },
    prayerGuide: {
      ar: 'المساجد قريبة ومفتوحة دائماً؛ يمكنك تلبية النداء في المسجد أو الصلاة في مصليات العمل براحة تامة.',
      en: 'Mosques are within walking distance; you can easily pray in congregation or use dedicated quiet rooms.',
      fr: 'Les mosquées sont à proximité immédiate; priez en congrégation ou dans les espaces de prière dédiés.',
      es: 'Las mezquitas están a pocos pasos; puedes orar en congregación o en salas de oración dedicadas.',
    },
    dietaryTip: {
      ar: 'كافة الأطعمة والمطاعم حلال؛ ركز على تناول الطيبات باعتدال وتأمل نعم الله وشكره.',
      en: 'Halal dining is standard everywhere; focus on mindful eating, gratitude, and moderation.',
      fr: 'La nourriture halal est standard partout; concentrez-vous sur la gratitude et la modération.',
      es: 'La comida halal es habitual en todas partes; enfócate en la gratitud y la moderación.',
    },
    colorTheme: {
      bgBanner: 'from-[#2C483F]/90 via-[#20362f] to-[#172822]',
      border: 'border-[#88C947]/40',
      badgeBg: 'bg-[#88C947]/20',
      badgeText: 'text-[#88C947]',
      skyGradient: 'from-emerald-950/60 via-teal-900/40 to-[#FBF9F5]',
    },
  },

  multicultural: {
    id: 'multicultural',
    title: {
      ar: 'مدينة متعددة الثقافات',
      en: 'Multicultural Metropolis',
      fr: 'Métropole Multiculturelle',
      es: 'Metrópoli Multicultural',
    },
    subtitle: {
      ar: 'أقلية مسلمة، وتحديات العمل والاندماج الاجتماعي المتنوع',
      en: 'Minority context with modern corporate & social navigation',
      fr: 'Contexte minoritaire avec navigation professionnelle et sociale',
      es: 'Contexto minoritario con navegación laboral y social moderna',
    },
    badge: {
      ar: '🏙️ بيئة عمل وتنوع',
      en: '🏙️ Workplace & Diverse Society',
      fr: '🏙️ Milieu Professionnel & Diversité',
      es: '🏙️ Entorno Laboral y Diversidad',
    },
    difficulty: {
      ar: 'متوازنة وواقعية',
      en: 'Balanced & Realistic',
      fr: 'Équilibrée & Réaliste',
      es: 'Equilibrada y Realista',
    },
    difficultyLevel: 2,
    features: {
      ar: [
        'بيئة مكتبية سريعة تتطلب جدولة ذكية للصلاة',
        'رخص التيسير مثل المسح على الجوارب واستخدام غرف الأرشيف',
        'مشاركة الزملاء في موائد الغداء واختيار البدائل الحلال بلباقة',
        'بناء جسور الاحترام المتبادل وعكس الصورة المشرقة',
      ],
      en: [
        'Fast-paced corporate setting requiring thoughtful prayer planning',
        'Concessions like wiping over socks and quiet meeting rooms',
        'Diplomatic navigation of team lunches and halal selections',
        'Building bridges of mutual warmth and reflecting noble values',
      ],
      fr: [
        'Cadre d’entreprise dynamique nécessitant une planification de la prière',
        'Facilités comme l’essuyage des chaussettes et salles de réunion calmes',
        'Déjeuners d’équipe avec sélection diplomatique de plats halal',
        'Création de ponts de respect mutuel et nobles valeurs',
      ],
      es: [
        'Entorno laboral dinámico que requiere planificar los momentos de rezo',
        'Concesiones como pasar las manos sobre los calcetines y salas tranquilas',
        'Comidas de equipo navegando opciones halal con cortesía',
        'Construcción de puentes de respeto mutuo y nobleza de carácter',
      ],
    },
    prayerGuide: {
      ar: 'استخدم رخصة المسح على الجوارب، واحجز غرفة اجتماعات هادئة لمدة 8 دقائق لأداء الصلاة بسكينة دون لفت الأنظار.',
      en: 'Wipe over regular clean socks during wudu, and discreetly take 8 minutes in a quiet archive or meeting room.',
      fr: 'Utilisez la facilité d’essuyage sur chaussettes et réservez 8 minutes dans une salle d’archives ou de repos.',
      es: 'Aplica la concesión de frotar sobre calcetines limpios y toma 8 minutos en una sala tranquila para orar.',
    },
    dietaryTip: {
      ar: 'اختر المأكولات البحرية أو النباتية اللذيذة، واستفسر بلطف وثقة: "هل يحتوي هذا الطبق على أي كحول أو لحم خنزير؟"',
      en: 'Opt for seafood or vibrant vegetarian dishes, asking warmly: "Does this contain any alcohol or pork products?"',
      fr: 'Optez pour du poisson ou des plats végétariens, en demandant avec courtoisie: "Ce plat contient-il de l’alcool ou du porc?"',
      es: 'Elige pescado o platos vegetarianos, preguntando amablemente: "¿Este plato contiene alcohol o derivados de cerdo?"',
    },
    colorTheme: {
      bgBanner: 'from-[#2C483F] via-[#3d5a45] to-[#20362f]',
      border: 'border-[#D4A373]/40',
      badgeBg: 'bg-[#D4A373]/20',
      badgeText: 'text-[#D4A373]',
      skyGradient: 'from-amber-950/40 via-stone-800/30 to-[#FBF9F5]',
    },
  },

  isolated: {
    id: 'isolated',
    title: {
      ar: 'مدينة معزولة أو محدودة الموارد',
      en: 'Isolated / Low-Resource Town',
      fr: 'Ville Isolée / Faibles Ressources',
      es: 'Ciudad Aislada / Pocos Recursos',
    },
    subtitle: {
      ar: 'موارد إسلامية محلية شحيحة، والاعتماد الأكبر على الروح الفردية والمجتمع الرقمي',
      en: 'Scarce local Muslim presence; relying on personal sanctuary and online brotherhood',
      fr: 'Présence musulmane locale rare; reposant sur le sanctuaire personnel et la fraternité en ligne',
      es: 'Presencia musulmana local escasa; apoyándose en santuario propio y comunidad online',
    },
    badge: {
      ar: '🌌 عزيمة رِيادية واستقلال',
      en: '🌌 Pioneer Spiritual Resilience',
      fr: '🌌 Résilience Spirituelle Pionnière',
      es: '🌌 Resiliencia Espiritual Pionera',
    },
    difficulty: {
      ar: 'تحدٍ رِيادي ومثابرة',
      en: 'Pioneer Challenge & Grit',
      fr: 'Défi Pionnier & Courage',
      es: 'Desafío Pionero y Firmeza',
    },
    difficultyLevel: 3,
    features: {
      ar: [
        'تأسيس محراب وسكينة في زاوية المنزل الهادئة',
        'الاعتماد على تطبيقات القبلة الدقيقة والمواقيت الحسابية',
        'حلقات ذكر ودروس افتراضية مع رفقاء في مدن شتى',
        'فحص رموز المكونات الغذائية (E-Numbers) والطلب عبر البريد',
      ],
      en: [
        'Establishing a sacred peaceful prayer corner at home',
        'Relying on digital Qibla compasses and accurate offline prayer charts',
        'Joining live online halaqas and virtual community study circles',
        'Checking ingredient codes (E-numbers) and ordering specialty halal goods',
      ],
      fr: [
        'Création d’un coin de prière apaisant à la maison',
        'Utilisation d’une boussole Qibla numérique et d’horaires précis',
        'Participation à des cercles d’étude en ligne et fraternité virtuelle',
        'Vérification des codes d’ingrédients (codes E) et commandes en ligne',
      ],
      es: [
        'Crear un rincón de oración y paz en tu propio hogar',
        'Uso de brújula digital para la Qibla y tablas horarias precisas',
        'Conexión con círculos de estudio online y hermandad virtual',
        'Revisión de códigos de aditivos (números E) y pedidos halal por correo',
      ],
    },
    prayerGuide: {
      ar: 'هيّئ ركناً في غرفتك مع سجادة مريحة ومصحف وعطر طيب؛ صلاتك وحدك في أرض بعيدة أجرها مضاعف عند الله.',
      en: 'Dedicate a serene corner at home with your mat and fragrance; worshipping in solitary spaces holds deep divine reward.',
      fr: 'Aménagez un coin serein chez vous avec tapis et parfum; prier dans la solitude porte une immense récompense.',
      es: 'Prepara un rincón apacible con tu alfombra y perfume; orar en soledad en lugares remotos tiene gran recompensa divina.',
    },
    dietaryTip: {
      ar: 'اعتمد على الخضار، البقوليات، البيض، الأسماك، والطلب الإلكتروني للمنتجات الحلال المعتمدة من مدن قريبة.',
      en: 'Rely on wholesome fish, eggs, legumes, and trusted online deliveries of halal staples from larger hubs.',
      fr: 'Misez sur le poisson, les œufs, les légumineuses et les livraisons en ligne certifiées halal.',
      es: 'Apóyate en pescado, legumbres, huevos y envíos a domicilio de carnes y productos halal certificados.',
    },
    colorTheme: {
      bgBanner: 'from-[#172822] via-[#101e19] to-[#0a1410]',
      border: 'border-indigo-400/40',
      badgeBg: 'bg-indigo-950/40',
      badgeText: 'text-indigo-300',
      skyGradient: 'from-slate-950/80 via-indigo-950/50 to-[#FBF9F5]',
    },
  },
};

// UI Translations dictionary
export const UI_TRANSLATIONS: Record<Language, Record<string, string>> = {
  ar: {
    // Top Navbar & Branding
    'app.title': 'رفيق',
    'app.subtitle': 'المرشد النفسي والروحي للمسلمين الجدد',
    'nav.human_counselor': 'مختص بشري',
    'nav.profile': 'الملف الشخصي',
    'nav.settings': 'الإعدادات',
    'nav.lang': 'اللغة',
    'nav.tranquility': 'مؤشر السكينة التراكمي',
    
    // Onboarding
    'onboarding.badge': 'تهيئة رحلتك الشخصية',
    'onboarding.title': 'مرحباً بك في رفيق، رفيقك الروحي والنفسي',
    'onboarding.subtitle': 'أجب عن بضعة أسئلة بسيطة لتهيئة بيئة المحاكاة، لغة التخاطب، ورخص التيسير المناسبة لواقعك اليومي.',
    'onboarding.gender_title': 'الجنس',
    'onboarding.gender_subtitle': 'لتخصيص خطاب رفيق والنصائح الأخوية الأنسب لك',
    'onboarding.male': 'أخ (ذكر)',
    'onboarding.male_desc': 'خطاب وتوجيهات تناسب خصوصية الإخوة',
    'onboarding.female': 'أخت (أنثى)',
    'onboarding.female_desc': 'خطاب وتوجيهات تناسب خصوصية الأخوات',
    'onboarding.age_title': 'الفئة العمرية',
    'onboarding.age_subtitle': 'لتكييف أسلوب الحوار بين تحديات الدراسة أو بيئة العمل والأسرة',
    'onboarding.teen': 'ناشئ / يافع (13 - 19)',
    'onboarding.teen_desc': 'تحديات المدرسة، الأصدقاء، والهوية في سن مبكرة',
    'onboarding.adult': 'بالغ (20+ سنة)',
    'onboarding.adult_desc': 'مسؤوليات العمل، الالتزامات الاجتماعية، والاستقلال',
    'onboarding.country_title': 'المنطقة الجغرافية أو الدولة',
    'onboarding.country_subtitle': 'اختر منطقتك أو اكتب اسم بلدك',
    'onboarding.country_placeholder': 'مثال: مصر، كندا، فرنسا، إسبانيا، المغرب...',
    'onboarding.city_title': 'نوع المدينة والبيئة التي تعيش فيها',
    'onboarding.city_subtitle': 'هذا الخيار يُغيّر طابع خريطة المحاكاة وتفاصيل المواقف اليومية ومستوى الدعم:',
    'onboarding.save_btn': 'حفظ والانطلاق في الرحلة المباركة',
    'onboarding.edit_btn': 'تحديث بيانات الملف',
    'onboarding.current_profile': 'الملف الحالي',
    'onboarding.difficulty_label': 'طابع التحدي',

    // Hero Section
    'hero.badge': 'اليوم الأول • بداية هادئة بتدرج مبارك',
    'hero.title_pre': 'ابدأ خطوتك الأولى في الإسلام',
    'hero.title_highlight': 'بسكينة وتدرج',
    'hero.title_post': 'دون حيرة أو شتات',
    'hero.quote': '«إن هذا الدين يسر، ولن يشاد الدين أحد إلا غلبه، فسددوا وقاربوا وأبشروا»',
    'hero.quote_ref': 'صحيح البخاري • وصية النبي ﷺ في الرفق والتدرج',
    'hero.how_are_you': 'كيف تجد قلبك الآن؟ شاركني شعورك لنضبط إيقاع يومك:',
    'hero.explore_btn': 'خوض مواقف اليوم على الخريطة',
    'hero.anas_greet': 'السلام عليكم ورحمة الله وبركاته! أنا رفيق، جئت لأمسك بيدك خطوة بخطوة في رحلتك.',

    // Stepper
    'stepper.badge': 'مسار التمكين التراكمي',
    'stepper.title': 'رحلة السكينة في 7 أيام',
    'stepper.subtitle': 'تدرج عملي مدروس يعالج أهم مخاوف البدايات، وينتقل بك من التردد إلى الطمأنينة والرسوخ',
    'stepper.day': 'اليوم',
    'stepper.completed': 'مكتمل',
    'stepper.in_progress': 'قيد المعايشة',
    'stepper.locked': 'مرحلة قادمة',
    'stepper.world_memory_btn': 'سجل القرارات والذاكرة الحية',

    // Map
    'map.interactive_title': 'خريطة المحاكاة التفاعلية 2.5D',
    'map.interactive_subtitle': 'اضغط على أي مَعلَم لخوض موقفه الواقعي واتخاذ قرارك التدرجي مع رفيق',
    'map.city_profile_badge': 'نمط البيئة المختارة',
    'map.prayer_tip_header': 'توجيه الصلاة في هذه البيئة',
    'map.dietary_tip_header': 'توجيه الطعام في هذه البيئة',
    'map.click_to_explore': 'اضغط للمحاكاة',

    // Common Buttons
    'common.close': 'إغلاق',
    'common.next': 'التالي',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.retry': 'إعادة المحاولة',
    'common.peace': 'سكينة',
    'common.stress': 'توتر',
  },

  en: {
    // Top Navbar & Branding
    'app.title': 'Rafeeq',
    'app.subtitle': 'Emotional & Spiritual Companion for New Muslims',
    'nav.human_counselor': 'Human Counselor',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.lang': 'Language',
    'nav.tranquility': 'Cumulative Tranquility Index',

    // Onboarding
    'onboarding.badge': 'Personalize Your Journey',
    'onboarding.title': 'Welcome to Rafeeq, Your Calming Companion',
    'onboarding.subtitle': 'Answer a few thoughtful questions to calibrate your city map simulation, speech style, and practical faith concessions to your reality.',
    'onboarding.gender_title': 'Gender',
    'onboarding.gender_subtitle': 'To tailor Rafiq’s respectful address and personalized guidance',
    'onboarding.male': 'Brother (Male)',
    'onboarding.male_desc': 'Personalized fraternal encouragement and advice',
    'onboarding.female': 'Sister (Female)',
    'onboarding.female_desc': 'Gentle sisterhood guidance and relevant insights',
    'onboarding.age_title': 'Age Group',
    'onboarding.age_subtitle': 'Adapting dialogue to study dynamics or workplace and family realities',
    'onboarding.teen': 'Teen (13 - 19 yrs)',
    'onboarding.teen_desc': 'Navigating school, peer relations, and early self-identity',
    'onboarding.adult': 'Adult (20+ yrs)',
    'onboarding.adult_desc': 'Balancing corporate work, social obligations, and autonomy',
    'onboarding.country_title': 'Geographic Region or Country',
    'onboarding.country_subtitle': 'Select your region or enter your country name',
    'onboarding.country_placeholder': 'e.g., USA, UK, Canada, France, Spain, Egypt...',
    'onboarding.city_title': 'City Type & Surrounding Environment',
    'onboarding.city_subtitle': 'This selection dynamically alters your map visual theme, scenario challenges, and accessible concessions:',
    'onboarding.save_btn': 'Save & Begin Blessed Journey',
    'onboarding.edit_btn': 'Update Profile Settings',
    'onboarding.current_profile': 'Current Profile',
    'onboarding.difficulty_label': 'Simulation Theme',

    // Hero Section
    'hero.badge': 'Day 1 • Gentle Step-by-Step Foundation',
    'hero.title_pre': 'Take Your First Steps in Islam',
    'hero.title_highlight': 'With Serenity & Grace',
    'hero.title_post': 'Free from Overwhelm or Confusion',
    'hero.quote': '"Indeed, this religion is ease; no one overburdens themselves with it but it will overcome them. So be moderate, do your best, and take glad tidings."',
    'hero.quote_ref': 'Sahih al-Bukhari • The Prophetic Principle of Gentleness',
    'hero.how_are_you': 'How does your heart feel right now? Tap a mood to tune our rhythm:',
    'hero.explore_btn': 'Experience Today’s Scenario on the Map',
    'hero.anas_greet': 'Peace be upon you! I am Rafiq, your warm companion here to walk by your side every single day.',

    // Stepper
    'stepper.badge': 'Cumulative Empowerment Pathway',
    'stepper.title': 'The 7-Day Serenity Journey',
    'stepper.subtitle': 'A structured progression resolving early fears, moving you from hesitation to steadfast inner peace',
    'stepper.day': 'Day',
    'stepper.completed': 'Completed',
    'stepper.in_progress': 'In Progress',
    'stepper.locked': 'Upcoming',
    'stepper.world_memory_btn': 'Living Memory & Decision Ledger',

    // Map
    'map.interactive_title': '2.5D Isometric Simulation City',
    'map.interactive_subtitle': 'Click any landmark hub to face its realistic scenario and make decisions with Rafiq',
    'map.city_profile_badge': 'Active Environment Mode',
    'map.prayer_tip_header': 'Prayer Guidance for this Setting',
    'map.dietary_tip_header': 'Dietary Guidance for this Setting',
    'map.click_to_explore': 'Click to Simulate',

    // Common Buttons
    'common.close': 'Close',
    'common.next': 'Next',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.retry': 'Retry',
    'common.peace': 'Peace',
    'common.stress': 'Stress',
  },

  fr: {
    // Top Navbar & Branding
    'app.title': 'Rafeeq',
    'app.subtitle': 'Compagnon Émotionnel et Spirituel pour Nouveaux Musulmans',
    'nav.human_counselor': 'Conseiller Humain',
    'nav.profile': 'Profil',
    'nav.settings': 'Paramètres',
    'nav.lang': 'Langue',
    'nav.tranquility': 'Indice de Sérénité Cumulé',

    // Onboarding
    'onboarding.badge': 'Personnalisez Votre Parcours',
    'onboarding.title': 'Bienvenue sur Rafeeq, Votre Compagnon Bienveillant',
    'onboarding.subtitle': 'Répondez à quelques questions pour adapter la carte de simulation, le ton de Rafiq et les facilités religieuses à votre quotidien.',
    'onboarding.gender_title': 'Genre',
    'onboarding.gender_subtitle': 'Pour adapter les salutations et les conseils personnalisés de Rafiq',
    'onboarding.male': 'Frère (Homme)',
    'onboarding.male_desc': 'Conseils fraternels et bienveillants adaptés aux frères',
    'onboarding.female': 'Sœur (Femme)',
    'onboarding.female_desc': 'Accompagnement chaleureux adapté aux sœurs',
    'onboarding.age_title': 'Tranche d’Âge',
    'onboarding.age_subtitle': 'Pour adapter le dialogue aux études ou au monde professionnel et familial',
    'onboarding.teen': 'Adolescent (13 - 19 ans)',
    'onboarding.teen_desc': 'Défis scolaires, entourage amical et affirmation de soi',
    'onboarding.adult': 'Adulte (20+ ans)',
    'onboarding.adult_desc': 'Responsabilités professionnelles, vie sociale et autonomie',
    'onboarding.country_title': 'Région Géographique ou Pays',
    'onboarding.country_subtitle': 'Sélectionnez votre région ou saisissez votre pays',
    'onboarding.country_placeholder': 'ex: France, Belgique, Canada, Maroc, Algérie...',
    'onboarding.city_title': 'Type de Ville et Environnement',
    'onboarding.city_subtitle': 'Ce choix personnalise l’ambiance de la carte, la difficulté des scénarios et les facilités disponibles:',
    'onboarding.save_btn': 'Enregistrer & Débuter le Parcours Béni',
    'onboarding.edit_btn': 'Mettre à jour le Profil',
    'onboarding.current_profile': 'Profil Actuel',
    'onboarding.difficulty_label': 'Ambiance du Défi',

    // Hero Section
    'hero.badge': 'Jour 1 • Fondations Douces et Gradualité',
    'hero.title_pre': 'Faites Vos Premiers Pas dans l’Islam',
    'hero.title_highlight': 'Avec Sérénité et Douceur',
    'hero.title_post': 'Sans Confusion ni Surcharge',
    'hero.quote': '« En vérité, cette religion est facilité ; quiconque s’y montre trop rigide sera submergé. Visez la justesse, rapprochez-vous et réjouissez-vous. »',
    'hero.quote_ref': 'Sahih al-Bukhari • Principe Prophétique de la Douceur',
    'hero.how_are_you': 'Comment va votre cœur en cet instant ? Partagez votre état d’esprit :',
    'hero.explore_btn': 'Explorer le Scénario du Jour sur la Carte',
    'hero.anas_greet': 'Que la paix soit sur vous ! Je suis Rafiq, votre compagnon dévoué pour vous accompagner pas à pas.',

    // Stepper
    'stepper.badge': 'Parcours d’Autonomie Échelonné',
    'stepper.title': 'Le Voyage de Sérénité en 7 Jours',
    'stepper.subtitle': 'Une progression méthodique dissipant les inquiétudes initiales pour atteindre une paix solide',
    'stepper.day': 'Jour',
    'stepper.completed': 'Terminé',
    'stepper.in_progress': 'En Cours',
    'stepper.locked': 'À Venir',
    'stepper.world_memory_btn': 'Mémoire Vivante & Décisions',

    // Map
    'map.interactive_title': 'Ville de Simulation Isométrique 2.5D',
    'map.interactive_subtitle': 'Cliquez sur un lieu clé pour vivre sa situation quotidienne et choisir avec Rafiq',
    'map.city_profile_badge': 'Mode Environnement Actif',
    'map.prayer_tip_header': 'Conseil Prière pour cet Environnement',
    'map.dietary_tip_header': 'Conseil Alimentaire pour cet Environnement',
    'map.click_to_explore': 'Cliquer pour Simuler',

    // Common Buttons
    'common.close': 'Fermer',
    'common.next': 'Suivant',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.retry': 'Réessayer',
    'common.peace': 'Sérénité',
    'common.stress': 'Stress',
  },

  es: {
    // Top Navbar & Branding
    'app.title': 'Rafeeq',
    'app.subtitle': 'Compañero Emocional y Espiritual para Nuevos Musulmanes',
    'nav.human_counselor': 'Consejero Humano',
    'nav.profile': 'Perfil',
    'nav.settings': 'Ajustes',
    'nav.lang': 'Idioma',
    'nav.tranquility': 'Índice de Serenidad Acumulado',

    // Onboarding
    'onboarding.badge': 'Personaliza Tu Camino',
    'onboarding.title': 'Bienvenido a Rafeeq, Tu Compañero de Paz',
    'onboarding.subtitle': 'Responde unas breves preguntas para calibrar el mapa de simulación, el tono de Rafiq y las facilidades religiosas según tu realidad cotidiana.',
    'onboarding.gender_title': 'Género',
    'onboarding.gender_subtitle': 'Para adaptar el trato respetuoso y los consejos fraternos de Rafiq',
    'onboarding.male': 'Hermano (Hombre)',
    'onboarding.male_desc': 'Guía cercana y consejos fraternos para hermanos',
    'onboarding.female': 'Hermana (Mujer)',
    'onboarding.female_desc': 'Acompañamiento cálido adaptado a hermanas',
    'onboarding.age_title': 'Grupo de Edad',
    'onboarding.age_subtitle': 'Adaptando el diálogo a la etapa estudiantil, laboral o familiar',
    'onboarding.teen': 'Adolescente (13 - 19 años)',
    'onboarding.teen_desc': 'Desafíos en la escuela, amistades e identidad temprana',
    'onboarding.adult': 'Adulto (20+ años)',
    'onboarding.adult_desc': 'Responsabilidades de trabajo, compromisos y autonomía',
    'onboarding.country_title': 'Región Geográfica o País',
    'onboarding.country_subtitle': 'Elige tu región o escribe el nombre de tu país',
    'onboarding.country_placeholder': 'ej: España, México, Colombia, Argentina, EE.UU...',
    'onboarding.city_title': 'Tipo de Ciudad y Entorno',
    'onboarding.city_subtitle': 'Esta opción modifica el tema visual del mapa, la dificultad de los escenarios y las facilidades accesibles:',
    'onboarding.save_btn': 'Guardar y Comenzar el Bendito Camino',
    'onboarding.edit_btn': 'Actualizar Datos del Perfil',
    'onboarding.current_profile': 'Perfil Actual',
    'onboarding.difficulty_label': 'Tono del Desafío',

    // Hero Section
    'hero.badge': 'Día 1 • Cimientos Suaves y Gradualidad',
    'hero.title_pre': 'Da Tus Primeros Pasos en el Islam',
    'hero.title_highlight': 'Con Serenidad y Calma',
    'hero.title_post': 'Sin Confusión ni Agobio',
    'hero.quote': '«En verdad, esta religión es facilidad; nadie que intente ser excesivamente riguroso podrá continuar sin verse abrumado. Buscad el equilibrio y alegraos.»',
    'hero.quote_ref': 'Sahih al-Bujari • Sabiduría Profética de la Suavidad',
    'hero.how_are_you': '¿Cómo sientes tu corazón ahora? Elige un estado para armonizar el día:',
    'hero.explore_btn': 'Experimentar el Escenario de Hoy en el Mapa',
    'hero.anas_greet': '¡La paz sea contigo! Soy Rafiq, tu compañero devoto para caminar a tu lado paso a paso.',

    // Stepper
    'stepper.badge': 'Ruta de Empoderamiento Gradual',
    'stepper.title': 'El Viaje de Serenidad en 7 Días',
    'stepper.subtitle': 'Una progresión práctica que disipa los temores iniciales y fortalece tu tranquilidad interior',
    'stepper.day': 'Día',
    'stepper.completed': 'Completado',
    'stepper.in_progress': 'En Proceso',
    'stepper.locked': 'Próximo',
    'stepper.world_memory_btn': 'Memoria Viva y Registro de Decisiones',

    // Map
    'map.interactive_title': 'Ciudad de Simulación Isométrica 2.5D',
    'map.interactive_subtitle': 'Haz clic en cualquier punto para vivir un dilema cotidiano y decidir junto a Rafiq',
    'map.city_profile_badge': 'Modo de Entorno Activo',
    'map.prayer_tip_header': 'Guía de Oración para este Entorno',
    'map.dietary_tip_header': 'Guía de Alimentación para este Entorno',
    'map.click_to_explore': 'Clic para Simular',

    // Common Buttons
    'common.close': 'Cerrar',
    'common.next': 'Siguiente',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.retry': 'Reintentar',
    'common.peace': 'Paz',
    'common.stress': 'Estrés',
  },
};

export function t(key: string, lang: Language): string {
  const dict = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS['en'];
  if (dict[key]) return dict[key];
  if (UI_TRANSLATIONS['en'][key]) return UI_TRANSLATIONS['en'][key];
  if (UI_TRANSLATIONS['ar'][key]) return UI_TRANSLATIONS['ar'][key];
  return key;
}

export function getAnasSalutation(profile: UserProfile, lang: Language): string {
  const isFemale = profile.gender === 'female';
  const isTeen = profile.ageGroup === 'teen';

  switch (lang) {
    case 'ar':
      if (isFemale) {
        return isTeen ? 'يا بنيتي وأختي الغالية' : 'أختي الكريمة الغالية';
      }
      return isTeen ? 'يا بني وأخي الشاب الطيب' : 'أخي الحبيب الكريم';
    case 'fr':
      if (isFemale) {
        return isTeen ? 'Chère jeune sœur' : 'Chère sœur bien-aimée';
      }
      return isTeen ? 'Cher jeune frère' : 'Cher frère bien-aimé';
    case 'es':
      if (isFemale) {
        return isTeen ? 'Querida joven hermana' : 'Estimada hermana';
      }
      return isTeen ? 'Querido joven hermano' : 'Estimado hermano';
    case 'en':
    default:
      if (isFemale) {
        return isTeen ? 'Dear young sister' : 'Dear sister';
      }
      return isTeen ? 'Dear young brother' : 'Dear brother';
  }
}

export const LANDMARK_TRANSLATIONS: Record<string, Record<Language, { name: string; subtitle: string; teaser: string }>> = {
  office: {
    ar: { name: 'مقر العمل والشركات', subtitle: 'بيئة مهنية حديثة ومزدحمة بزملاء متنوعين', teaser: 'تحدي الصلاة بهدوء وتنظيم الوقت وسط مهام العمل اليومية' },
    en: { name: 'Corporate Office Hub', subtitle: 'Modern busy workplace with diverse colleagues', teaser: 'Navigating quiet prayer and busy work deadlines with grace' },
    fr: { name: 'Centre d’Affaires & Bureaux', subtitle: 'Cadre professionnel moderne avec collègues diversifiés', teaser: 'Prier au calme et gérer son temps au milieu des tâches' },
    es: { name: 'Sede Laboral y Corporativa', subtitle: 'Entorno profesional moderno con colegas diversos', teaser: 'Rezar en calma y gestionar los tiempos con serenidad' },
  },
  apartment: {
    ar: { name: 'بيت العائلة والسكينة', subtitle: 'ملاذك الدافئ وشرفة التواصل مع الوالدين', teaser: 'بر الوالدين بالمعاملة الحسنة والهدايا وطمأنة قلوبهم باللطف' },
    en: { name: 'Family Apartment', subtitle: 'Warm home haven & gentle family reassurance', teaser: 'Honoring parents with profound kindness, gifts, and reassuring love' },
    fr: { name: 'Foyer Familial & Sérénité', subtitle: 'Refuge chaleureux et bienveillance envers les parents', teaser: 'Patience, cadeaux et réconfort filial avec délicatesse' },
    es: { name: 'Hogar Familiar y Sosiego', subtitle: 'Tu refugio cálido y tranquilidad con los padres', teaser: 'Amor hacia los padres con regalos y afecto sincero' },
  },
  cafe: {
    ar: { name: 'المقهى والمجتمع', subtitle: 'جلسات خارجية حيوية واجتماع الزملاء والأصدقاء', teaser: 'طلب الطعام الحلال بلباقة دون إحراج أو تكلف' },
    en: { name: 'Downtown Café', subtitle: 'Lively outdoor social space with friends and colleagues', teaser: 'Gracefully navigating social lunches and dietary choices' },
    fr: { name: 'Café & Espace Social', subtitle: 'Terrasse conviviale entre collègues et amis', teaser: 'Choisir des repas halal avec aisance et tact' },
    es: { name: 'Cafetería y Comunidad', subtitle: 'Espacio social distendido con colegas y amigos', teaser: 'Elegir opciones halal con elegancia y confianza' },
  },
  mosque: {
    ar: { name: 'المسجد والحي الآمن', subtitle: 'منارة الهداية بقبة ذهبية ومئذنة هلالية وارفة', teaser: 'كسر رهبة الخطوة الأولى ولقاء الإمام والمصلين بقلب مطمئن' },
    en: { name: 'Community Mosque', subtitle: 'Sanctuary of peace with warm crescent minaret', teaser: 'Overcoming first-step hesitation and feeling the warmth of brotherhood' },
    fr: { name: 'Mosquée Communautaire', subtitle: 'Sanctuaire de paix au minaret croissant doré', teaser: 'Franchir le pas de la porte et découvrir la fraternité' },
    es: { name: 'Mezquita Comunitaria', subtitle: 'Santuario de paz con cúpula y minarete de luna', teaser: 'Superar la timidez del primer paso y sentir la hermandad' },
  },
  market: {
    ar: { name: 'السوق والمعرفة', subtitle: 'أزقة تجارية وثقافية حافلة بالكتب والمنتجات الطيبة', teaser: 'التمييز بين الفتوى الموثوقة والتشدد الرقمي المنفر' },
    en: { name: 'Market & Wisdom Library', subtitle: 'Bustling alleyways with books and pure provisions', teaser: 'Discerning authentic scholarly ease from noisy online extremes' },
    fr: { name: 'Marché & Bibliothèque de Sagesse', subtitle: 'Rues vivantes de livres et de produits sains', teaser: 'Distinguer la facilité légale des polémiques en ligne' },
    es: { name: 'Mercado y Sabiduría', subtitle: 'Callejones con libros y alimentos puros', teaser: 'Distinguir la sabiduría auténtica de los debates virtuales' },
  },
  gym: {
    ar: { name: 'النادي الرياضي والصحة', subtitle: 'مركز اللياقة البدنية والرياضة المتكاملة', teaser: 'الرياضة قوة للمؤمن: غض البصر، الحشمة، والتركيز الهادئ' },
    en: { name: 'The Fitness Gym', subtitle: 'Modern athletic fitness hub & workout zones', teaser: 'Physical vitality: respectful modesty, lowering gaze, and focused training' },
    fr: { name: 'Club de Sport & Santé', subtitle: 'Salle de fitness moderne et zones d’entraînement', teaser: 'Force et vitalité : pudeur sportive, regard préservé et sérénité' },
    es: { name: 'Gimnasio y Bienestar', subtitle: 'Centro deportivo moderno y zonas de ejercicio', teaser: 'Vitalidad física: pudor respetuoso, bajar la mirada y concentración' },
  },
  school: {
    ar: { name: 'المدرسة والجامعة', subtitle: 'الحرم الأكاديمي، المكتبة، وقاعات الاستذكار الهادئة', teaser: 'طلب العلم فريضة: البحث عن مكان هادئ للصلاة بين المحاضرات بلباقة' },
    en: { name: 'School & Campus', subtitle: 'Academic campus, quiet library & study halls', teaser: 'Seeking knowledge: finding a 5-min quiet prayer sanctuary between lectures' },
    fr: { name: 'École & Université', subtitle: 'Campus académique, bibliothèque et salles d’étude', teaser: 'Quête du savoir : trouver un recoin paisible pour prier entre les cours' },
    es: { name: 'Escuela y Universidad', subtitle: 'Campus académico, biblioteca y salas de estudio', teaser: 'Buscar el saber: hallar un espacio tranquilo para orar entre clases' },
  },
};

export const JOURNEY_DAY_TRANSLATIONS: Record<number, Record<Language, { title: string; theme: string; prompt: string }>> = {
  1: {
    ar: {
      title: 'الوصول وتفريغ الحقائب',
      theme: 'التخلص من الخوف والارتباك',
      prompt: 'أهلاً بك يا صاحبي! البدايات الجميلة تبدأ بخطوة هادئة.. دعنا نفرغ أحمال القلق معاً.'
    },
    en: {
      title: 'Arrival & Baggage Unpacking',
      theme: 'Releasing Fear & Emotional Overload',
      prompt: 'Welcome, dear friend! Great journeys begin with gentle steps.. let us unpack the heavy stones of worry together.'
    },
    fr: {
      title: 'L’Arrivée & Déballage des Valises',
      theme: 'Se libérer de la peur et de la surcharge',
      prompt: 'Bienvenue, cher ami ! Les beaux chemins débutent avec douceur.. déchargeons ensemble les fardeaux de l’anxiété.'
    },
    es: {
      title: 'La Llegada y Deshacer el Equipaje',
      theme: 'Liberar el miedo y la sobrecarga emocional',
      prompt: '¡Bienvenido, querido amigo! Los caminos hermosos inician con serenidad.. descarguemos juntos el peso de la inquietud.'
    },
  },
  2: {
    ar: {
      title: 'الصلاة الأولى في العمل',
      theme: 'رخص التيسير ومكان طاهر',
      prompt: 'أذان الظهر حان وسط ضجيج العمل.. لا تقلق يا صاحبي، ديننا مبني على الرخص واليسر.'
    },
    en: {
      title: 'First Workplace Prayer',
      theme: 'Concessions & Finding a Clean Sanctuary',
      prompt: 'Dhuhr time in a bustling office.. do not fret, friend, faith is built upon ease and concessions.'
    },
    fr: {
      title: 'Première Prière au Travail',
      theme: 'Facilités et lieu de prière paisible',
      prompt: 'L’heure de Dhohr au milieu du bureau.. pas d’inquiétude, notre foi est faite de facilité et de sagesse.'
    },
    es: {
      title: 'Primera Oración en el Trabajo',
      theme: 'Concesiones y hallar un espacio limpio',
      prompt: 'Llegó el Dhuhr en plena oficina.. calma, amigo, la fe nos ofrece amplias facilidades y serenidad.'
    },
  },
  3: {
    ar: {
      title: 'غداء العمل والمائدة المشتركة',
      theme: 'الطعام الطيب واللباقة الاجتماعية',
      prompt: 'الجلوس مع الزملاء على مائدة واحدة فرصة للألفة.. دعنا نختر الطيبات بلطف وثقة.'
    },
    en: {
      title: 'Work Team Lunch & Mindful Plate',
      theme: 'Pure Dining & Social Diplomacy',
      prompt: 'Dining together builds friendship.. let us choose wholesome dishes with warmth and confidence.'
    },
    fr: {
      title: 'Déjeuner d’Équipe & Assiette Conscience',
      theme: 'Alimentation pure et diplomatie sociale',
      prompt: 'Partager un repas renforce les liens.. choisissons des plats purs avec tact et assurance.'
    },
    es: {
      title: 'Almuerzo de Equipo y Mesa Consciente',
      theme: 'Alimentos puros y cortesía social',
      prompt: 'Compartir la mesa crea cercanía.. elijamos alimentos puros con naturalidad y cordialidad.'
    },
  },
  4: {
    ar: {
      title: 'عاصفة الفتاوى والإنترنت',
      theme: 'بوصلة الفتوى والتمييز',
      prompt: 'عالم الإنترنت مليء بالآراء المتطرفة والجدالات القاسية.. تذكر يا صاحبي: ديننا بُني على الرحمة والتيسير.'
    },
    en: {
      title: 'Online Fatwa Storm & Discernment',
      theme: 'The Core Pillars vs Noisy Arguments',
      prompt: 'The internet is loud with confusing debates. Remember: our faith was revealed as an expansive mercy.'
    },
    fr: {
      title: 'Tempête de Fatwas en Ligne & Discernement',
      theme: 'Piliers essentiels contre polémiques bruyantes',
      prompt: 'Internet déborde d’avis excessifs.. gardez en mémoire que notre foi repose sur la miséricorde.'
    },
    es: {
      title: 'Tormenta de Fatwas en Internet y Discernimiento',
      theme: 'Pilares esenciales frente al ruido virtual',
      prompt: 'Las redes están llenas de debates confusos.. recuerda siempre que la fe es misericordia y cordura.'
    },
  },
  5: {
    ar: {
      title: 'عتبة المسجد والخطوة الأولى',
      theme: 'كسر الرهبة والسكينة الجماعية',
      prompt: 'خطوة المسجد الأولى لها هيبة في القلب.. كل من بالداخل سيفرح برؤيتك وسيرحب بك كأخ حبيب.'
    },
    en: {
      title: 'Mosque Threshold & First Step',
      theme: 'Overcoming Hesitation & Communal Peace',
      prompt: 'The first step into the mosque carries awe.. everyone inside will warmly rejoice to embrace you.'
    },
    fr: {
      title: 'Le Seuil de la Mosquée & Premier Pas',
      theme: 'Vaincre l’hésitation et paix collective',
      prompt: 'Franchir la porte de la mosquée inspire le respect.. tous seront heureux de vous accueillir fraternellement.'
    },
    es: {
      title: 'El Umbral de la Mezquita y Primer Paso',
      theme: 'Vencer la timidez y paz comunitaria',
      prompt: 'El primer paso en la mezquita impone respeto.. todos se alegrarán sinceramente de darte la bienvenida.'
    },
  },
  6: {
    ar: {
      title: 'مكالمة العائلة وبر الوالدين',
      theme: 'الإحسان وطمأنة القلوب',
      prompt: 'رنين هاتف الوالدين يحمل محبة وقلقاً.. الإسلام جاء ليزيدك براً وإحساناً وحناناً بهما.'
    },
    en: {
      title: 'Family Call & Honoring Parents',
      theme: 'Profound Filial Piety & Reassurance',
      prompt: 'Your parents’ call carries love and worry.. faith came to increase your devotion, kindness, and gentle care.'
    },
    fr: {
      title: 'Appel Familial & Piété Filiale',
      theme: 'Bienveillance profonde et réconfort',
      prompt: 'L’appel de vos parents porte amour et inquiétude.. la foi vient décupler votre douceur et tendresse envers eux.'
    },
    es: {
      title: 'Llamada Familiar y Honrar a los Padres',
      theme: 'Piedad filial profunda y afecto',
      prompt: 'La llamada de tus padres trae cariño y dudas.. la fe llega para multiplicar tu afecto y cuidado hacia ellos.'
    },
  },
  7: {
    ar: {
      title: 'قبة الحصاد وأفق الـ 30 يوماً',
      theme: 'التمكين والاستدامة والشهادة',
      prompt: 'مبارك يا صاحبي! أتممت أسبوعك الأول بنجاح وثبات.. انظر كم تراجعت الحيرة وأزهرت السكينة.'
    },
    en: {
      title: 'Harvest Dome & 30-Day Horizon',
      theme: 'Empowerment, Steadfastness & Milestone Award',
      prompt: 'Congratulations, my friend! You completed your first week with poise.. see how anxiety gave way to peace.'
    },
    fr: {
      title: 'Dôme de la Récolte & Horizon 30 Jours',
      theme: 'Autonomie, Constance & Certificat de Mérite',
      prompt: 'Félicitations, mon ami ! Première semaine accomplie avec brio.. l’angoisse a cédé la place à la quiétude.'
    },
    es: {
      title: 'Cúpula de la Cosecha y Horizonte a 30 Días',
      theme: 'Empoderamiento, Firmeza y Reconocimiento',
      prompt: '¡Felicidades, amigo mío! Concluiste tu primera semana con éxito.. mira cómo la inquietud floreció en paz.'
    },
  },
};

