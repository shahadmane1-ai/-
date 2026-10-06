import { Experience, DailyTask } from '../types';

/**
 * 14 REAL-LIFE PLAYABLE EXPERIENCES
 * Exclusive to: environmentId: "multicultural"
 * Exactly 7 days × 2 experiences = 14 experiences
 * Interaction comes FIRST, gentle explanation comes SECOND.
 */
export const MULTICULTURAL_EXPERIENCES: Experience[] = [
  // ==========================================
  // DAY 1 — "أنا أعيش إسلامي في حياتي اليومية"
  // ==========================================
  {
    experienceId: 'home-prayer-room',
    environmentId: 'multicultural',
    day: 1,
    buildingId: 'apartment',
    title: {
      ar: 'الصلاة في غرفتي',
      en: 'Prayer in My Bedroom',
    },
    description: {
      ar: 'حان وقت الصلاة في غرفتك الطبيعية.. رتّب سجادتك ومساحتك الهادئة بثقة دون خجل أو افتعال صدام.',
      en: 'Prayer time arrives in your normal bedroom.. prepare your mat and serene corner with quiet confidence.',
    },
    type: 'interactive',
    objectiveAr: 'الصلاة جزء طبيعي ومركزي من حياة المسلم اليومية دون خجل أو إحراج.',
    objectiveEn: 'Salah is an organic, central part of normal Muslim life with dignity and ease.',
  },
  {
    experienceId: 'work-lunch-halal',
    environmentId: 'multicultural',
    day: 1,
    buildingId: 'office',
    title: {
      ar: 'غداء زملاء العمل',
      en: 'Work Colleagues Lunch',
    },
    description: {
      ar: 'جلسة غداء مشتركة مع زملاء العمل في مقر العمل.. تفقّد أطباق المائدة ومكوّناتها واختر طعامك براحة ووعي.',
      en: 'A lunch table with colleagues at work.. inspect the food items and ingredients calmly and choose with peace of mind.',
    },
    type: 'interactive',
    objectiveAr: 'التحقق الهادئ من مكوّنات الأطعمة دون وسوسة، وقاعدة: «إذا لم تعرف، تحقق قبل أن تحكم».',
    objectiveEn: 'Checking food ingredients with calm clarity: "If uncertain, verify before you judge."',
  },

  // ==========================================
  // DAY 2 — "الصلاة وسط المجتمع"
  // ==========================================
  {
    experienceId: 'university-prayer',
    environmentId: 'multicultural',
    day: 2,
    buildingId: 'school',
    title: {
      ar: 'الصلاة في الجامعة',
      en: 'Prayer at University',
    },
    description: {
      ar: 'بين المحاضرات ومقاعد الدراسة.. نظّم جدولك واختر ركناً هادئاً لأداء صلاتك دون تعطيل لدراستك.',
      en: 'Between lectures and study.. manage your schedule, find an available quiet alcove, and pray on time.',
    },
    type: 'interactive',
    objectiveAr: 'دمج الصلاة في الالتزامات اليومية والدراسية بالتنظيم ووضوح الأولويات.',
    objectiveEn: 'Integrating prayer smoothly into academic duties through schedule planning and prioritization.',
  },
  {
    experienceId: 'street-honesty-amanah',
    environmentId: 'multicultural',
    day: 2,
    buildingId: 'market',
    title: {
      ar: 'أمانة الكاشير والشارع',
      en: 'Honesty & Street Amanah',
    },
    description: {
      ar: 'أثناء تعاملك اليومي في الشارع والسوق.. حافظ على الأمانة والصدق وإرجاع الحقوق لأصحابها حتى وإن لم يرك أحد.',
      en: 'In everyday street and market dealings.. uphold trustworthiness and honesty, doing the right thing when unobserved.',
    },
    type: 'interactive',
    objectiveAr: 'الأمانة والصدق وإرجاع الحقوق لأصحابها بدافع ذاتي: «أد الأمانة إلى من ائتمنك».',
    objectiveEn: 'Amanah (trustworthiness) and returning rights conscientiously.',
  },

  // ==========================================
  // DAY 3 — "الإسلام مع الناس"
  // ==========================================
  {
    experienceId: 'family-communication',
    environmentId: 'multicultural',
    day: 3,
    buildingId: 'apartment',
    title: {
      ar: 'مصارحة الأهل',
      en: 'Opening Up to Family',
    },
    description: {
      ar: 'حوار هادئ مع أسرتك في البيت حول رغبتك بالالتزام بالصلاة والذهاب للمسجد.. اختر أسلوب الحوار الأكثر برّاً واحتراماً.',
      en: 'A calm conversation with your family at home about your prayer and mosque attendance.. choose the most respectful dialogue approach.',
    },
    type: 'interactive',
    objectiveAr: 'مصارحة الأهل بالبر والاحترام والتواصل الهادئ بعيداً عن الحدة أو الدراما.',
    objectiveEn: 'Honest communication with parents through gentle filial respect and clear warmth.',
  },
  {
    experienceId: 'encourage-goodness',
    environmentId: 'multicultural',
    day: 3,
    buildingId: 'apartment',
    title: {
      ar: 'التشجيع على البر',
      en: 'Encouraging Goodness',
    },
    description: {
      ar: 'أحد أفراد عائلتك يبادر بخدمة الوالدين وإسعادهما.. اختر كيف تشجعه وتسنده باللطف بدلاً من السخرية أو التثبيط.',
      en: 'A family member initiatives a kind act for the parents.. choose how to encourage and support them with warmth.',
    },
    type: 'interactive',
    objectiveAr: '«نساعد بعضنا على الخير بلطف» وتجنب الإحراج أو التعالي.',
    objectiveEn: 'Supporting one another in doing good with gentleness rather than pressure or criticism.',
  },

  // ==========================================
  // DAY 4 — "الحشمة في الحياة الطبيعية"
  // ==========================================
  {
    experienceId: 'gym-attire-modesty',
    environmentId: 'multicultural',
    day: 4,
    buildingId: 'gym',
    title: {
      ar: 'ملابس النادي',
      en: 'Gym Workout Attire',
    },
    description: {
      ar: 'في غرفة تبديل الملابس بالنادي.. نسّق لباساً رياضياً عملياً ومريحاً يحقق الحركة والحشمة والستر المناسب.',
      en: 'In the gym locker room.. choose athletic clothing that balances flexibility, comfort, and modest coverage.',
    },
    type: 'interactive',
    objectiveAr: 'الحشمة قيمة محبوبة تجمع بين الراحة والنشاط والستر اللائق دون تشدد أو تعقيد.',
    objectiveEn: 'Modesty as a valued personal standard harmonizing comfort, movement, and dignity.',
  },
  {
    experienceId: 'gym-mindful-gaze',
    environmentId: 'multicultural',
    day: 4,
    buildingId: 'gym',
    title: {
      ar: 'غض البصر',
      en: 'Mindful Gaze in the Gym',
    },
    description: {
      ar: 'أثناء أدائك للتمرين بين الأجهزة.. تدرّب على توجيه انتباهك وتركيز بصرك نحو تمرينك وجدولك واحترام خصوصية الآخرين.',
      en: 'While exercising in a modern gym.. practice redirecting your gaze toward your workout and equipment with calm discipline.',
    },
    type: 'interactive',
    objectiveAr: 'غض البصر تدريب هادئ على ضبط النظر واحترام الآخرين وصيانة السكينة الذاتية.',
    objectiveEn: 'Mindful gaze is quiet self-control and dignity, respecting others and safeguarding inner peace.',
  },

  // ==========================================
  // DAY 5 — "الإسلام يراعي ظروف الإنسان"
  // ==========================================
  {
    experienceId: 'rain-concession',
    environmentId: 'multicultural',
    day: 5,
    buildingId: 'market',
    title: {
      ar: 'رخصة المطر',
      en: 'Concession in the Rain',
    },
    description: {
      ar: 'أجواء ماطرة غزيرة ورياح في طريقك للمسجد.. اكتشف كيف يراعي الدين المشقة الحقيقية برخص التيسير والجمع أو الصلاة في الرحال.',
      en: 'Heavy rain and wind on the city street.. discover how Islamic principles offer concessions in times of genuine hardship.',
    },
    type: 'interactive',
    objectiveAr: 'فهم مراعاة الشريعة للظروف الطارئة والمشقة: «إن الدين يسر».',
    objectiveEn: 'Understanding that Islamic practice embraces concessions and ease during genuine hardship.',
  },
  {
    experienceId: 'travel-concession',
    environmentId: 'multicultural',
    day: 5,
    buildingId: 'market',
    title: {
      ar: 'رخصة السفر',
      en: 'Travel Concession',
    },
    description: {
      ar: 'في محطة القطار والمطار أثناء السفر.. نظّم مسارك واستفد من رخصة قصر الصلاة والجمع للتخفيف ومواصلة رحلتك باطمئنان.',
      en: 'At the transit hub during travel.. plan your timeline and utilize travel concessions (shortening and combining) with serenity.',
    },
    type: 'interactive',
    objectiveAr: 'رخص السفر في الإسلام هدية للتخفيف عن المسافر، وفقه التيسير عند التنقل.',
    objectiveEn: 'Travel concessions are divine gifts easing long journeys and maintaining regular worship without strain.',
  },

  // ==========================================
  // DAY 6 — "المسجد والمجتمع"
  // ==========================================
  {
    experienceId: 'first-jumuah',
    environmentId: 'multicultural',
    day: 6,
    buildingId: 'mosque',
    title: {
      ar: 'أول صلاة جمعة',
      en: 'First Friday Prayer',
    },
    description: {
      ar: 'تجربة صلاة الجمعة الأولى في رحاب المسجد.. استشعر روح الجماعة، استمع للموعظة الهادفة، وصلّ مع جموع المصلين.',
      en: 'Experiencing your first Friday congregational prayer.. feel the warmth of the community, listen attentively, and pray together.',
    },
    type: 'interactive',
    objectiveAr: 'معنى يوم الجمعة وأهمية صلاة الجماعة ورسالة المسجد الجامعة للألفة والمحبة.',
    objectiveEn: 'The significance of Jumu’ah, communal harmony, and the mosque as a sanctuary of unity.',
  },
  {
    experienceId: 'helping-neighbor',
    environmentId: 'multicultural',
    day: 6,
    buildingId: 'market',
    title: {
      ar: 'إرجاع الأمانة',
      en: 'Returning Lost Property',
    },
    description: {
      ar: 'في حديقة السوق المركزي.. لاحظت محفظة مفقودة ملقاة على مقعد الحديقة، تصرّف بأمانة ومسؤولية لتسليمها للأمانات.',
      en: 'In the market plaza.. you notice a lost wallet on the bench; act with integrity to return it safely to security.',
    },
    type: 'interactive',
    objectiveAr: 'حق الأمانة وحفظ أموال الناس وإرجاع الحقوق لأصحابها بدافع إيماني ذاتي.',
    objectiveEn: 'Amanah (trustworthiness) and returning rights conscientiously.',
  },

  // ==========================================
  // DAY 7 — "الإسلام في العلاقات اليومية"
  // ==========================================
  {
    experienceId: 'honoring-parents',
    environmentId: 'multicultural',
    day: 7,
    buildingId: 'apartment',
    title: {
      ar: 'بر الوالدين',
      en: 'Kindness to Parents',
    },
    description: {
      ar: 'أمسية أسرية في البيت.. والداك منشغلان بأعمال المنزل، اختر تفاصيل صغيرة تعبر بها عن محبّتك وعونك لهما دون أن يُطلب منك.',
      en: 'A quiet family evening at home.. parents are busy with chores; choose small, thoughtful gestures to help and bring joy to them.',
    },
    type: 'interactive',
    objectiveAr: 'بر الوالدين يظهر في تفاصيل الحياة اليومية والمبادرة باللطف والمساعدة.',
    objectiveEn: 'Filial kindness shines in small, everyday actions of spontaneous care and loving attentiveness.',
  },
  {
    experienceId: 'first-row-mosque',
    environmentId: 'multicultural',
    day: 7,
    buildingId: 'mosque',
    title: {
      ar: 'الصف الأول بالمسجد',
      en: 'First Row in Mosque',
    },
    description: {
      ar: 'التبكير لصلاة الجماعة في المسجد والحرص على الصف الأول وسد الفرج بهدوء ووقار دون مزاحمة.',
      en: 'Arriving early for congregational prayer, joining the front row peacefully with dignity.',
    },
    type: 'interactive',
    objectiveAr: 'فضل الصف الأول والتبكير للمسجد مع السكينة والوقار التام.',
    objectiveEn: 'Virtue of the first row and early arrival with complete composure and peace.',
  },
];

/**
 * 7 DAILY TASKS
 * Exactly one task per day (Day 1 to 7).
 * Real-life practical connections, not quizzes.
 */
export const MULTICULTURAL_TASKS: DailyTask[] = [
  {
    taskId: 'task-day-1',
    environmentId: 'multicultural',
    day: 1,
    title: {
      ar: 'لاحظ الصلاة في يومك',
      en: 'Notice Prayer in Your Day',
    },
    description: {
      ar: 'تأمل جدول يومك العادي، وحدد أين تتناغم أوقات الصلاة مع روتينك اليومي بكل سلاسة ويسر',
      en: 'Observe your daily routine and note where prayer times naturally and peacefully integrate into your day.',
    },
    promptAr: 'حدّد الفترات اليومية (الصباح، الظهر، العصر، المغرب، العشاء) التي تمنحك استراحة سكينة.',
    promptEn: 'Identify the daily pauses (Morning, Noon, Afternoon, Sunset, Night) that offer you moments of serenity.',
  },
  {
    taskId: 'task-day-2',
    environmentId: 'multicultural',
    day: 2,
    title: {
      ar: 'تعرّف على القبلة',
      en: 'Discover the Qiblah',
    },
    description: {
      ar: 'تعلّم كيف يحدد المسلمون اتجاه القبلة (الكعبة المشرفة) في بيئاتهم ووسائل معرفتها بالبوصلة والتطبيقات.',
      en: 'Learn how Muslims determine the direction of the Qiblah (Kaaba) and the gentle methods used to orient oneself.',
    },
    promptAr: 'تعرف على اتجاه الكعبة المشرفة من موقعك وافهم كيف تتوحد قلوب المصلين حول العالم نحو وجهة واحدة.',
    promptEn: 'Understand the Qiblah direction from your city and appreciate how hearts unite toward one sacred direction.',
  },
  {
    taskId: 'task-day-3',
    environmentId: 'multicultural',
    day: 3,
    title: {
      ar: 'تحقق قبل أن تحكم',
      en: 'Check Before You Judge',
    },
    description: {
      ar: 'اختر منتجاً أو طعاماً واحداً في يومك الواقعي، واقرأ قائمة مكوناته بوعي وتثبّت بدلاً من الافتراض المسبق.',
      en: 'Pick one grocery item in real life, read its ingredient label attentively instead of assuming.',
    },
    promptAr: 'تطبيق عملي: اقرأ ملصق منتج غذائي اليوم، وتأكد من مصدر دهونه أو خلوه من المحرمات الصريحة.',
    promptEn: 'Practical task: Inspect one real-life food label today and confirm its plant/pure origin calmly.',
  },
  {
    taskId: 'task-day-4',
    environmentId: 'multicultural',
    day: 4,
    title: {
      ar: 'كلمة تشجيع',
      en: 'A Word of Encouragement',
    },
    description: {
      ar: 'وجّه لأحد أفراد عائلتك أو المقربين منك كلمة تشجيع صادقة على فعل الخير وإسعاد من حوله.',
      en: 'Share a sincere word of encouragement with a family member or friend doing something good.',
    },
    promptAr: 'الكلمة الطيبة صدقة: ادعم مبادرة جميلة لاحظتها في منزلك أو محيطك بكلمة تقدير لطيفة.',
    promptEn: 'A good word is charity: affirm a kind gesture you witnessed in your home with gentle appreciation.',
  },
  {
    taskId: 'task-day-5',
    environmentId: 'multicultural',
    day: 5,
    title: {
      ar: 'تعلّم رخصة',
      en: 'Learn an Islamic Concession',
    },
    description: {
      ar: 'اقرأ عن إحدى رخص الشريعة الإسلامية في السفر أو المطر أو المرض وكيف ترفع الحرج عن الإنسان.',
      en: 'Read about an Islamic concession regarding travel, rain, or illness, and how it lifts human hardship.',
    },
    promptAr: 'اطّلع على مفهوم «الرخصة الشرعية» واستشعر رحمة الشريعة في مراعاة طاقة الإنسان وظروفه.',
    promptEn: 'Explore the concept of legal concessions (Rukhsah) and feel the divine mercy embracing human circumstances.',
  },
  {
    taskId: 'task-day-6',
    environmentId: 'multicultural',
    day: 6,
    title: {
      ar: 'جمعة',
      en: 'Friday Reflection',
    },
    description: {
      ar: 'إن كنت قادراً على حضور صلاة الجمعة فجرّب حضورها، أو اطّلع على بديلها التعليمي واستشعر فضل اليوم.',
      en: 'If able, experience attending Friday prayer at a mosque, or explore the educational reflection on Jumu’ah.',
    },
    promptAr: 'استشعر روح يوم الجمعة كعيد أسبوعي واقرأ سورة الكهف أو تأمل في فضل الصلاة على النبي ﷺ.',
    promptEn: 'Embrace the serene Friday spirit, reflect upon its blessings, and send peace upon the Messenger ﷺ.',
  },
  {
    taskId: 'task-day-7',
    environmentId: 'multicultural',
    day: 7,
    title: {
      ar: 'عمل بر صغير',
      en: 'A Small Act of Kindness',
    },
    description: {
      ar: 'قدّم عملاً بسيطاً يعبر عن الإحسان والبر لأحد والديك أو أفراد أسرتك اليوم دون انتظار مقابل.',
      en: 'Perform one small act of kindness or service toward a parent or family member today.',
    },
    promptAr: 'صنع كوب شاي، ترتيب زاوية في المنزل، أو سؤال حنون عن صحة الوالدين يصنع أثراً عميقاً.',
    promptEn: 'Making tea, tidying a room, or asking gently about your parents’ wellbeing carries immense value.',
  },
];

// Aliases for export compatibility
export const experiences: Experience[] = MULTICULTURAL_EXPERIENCES;
export const dailyTasks: DailyTask[] = MULTICULTURAL_TASKS;
