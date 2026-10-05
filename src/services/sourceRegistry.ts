import { ApprovedSourceFamily, ApprovedSourceRegistryItem } from '../types';

/**
 * Competition Approved Central Islamic Source Registry
 * Primary allowlist for all Islamic content in Rafeeq AI.
 */
export const APPROVED_SOURCE_REGISTRY: Record<ApprovedSourceFamily, ApprovedSourceRegistryItem> = {
  dawah_center: {
    family: 'dawah_center',
    nameAr: 'المستودع الدعوي الرقمي',
    nameEn: 'Digital Dawah Center',
    url: 'https://center.dawa.sa/',
    category: 'dawah',
    descriptionAr: 'المنصة المركزية المعتمدة للموضوعات الدعوية وتأصيل مفاهيم الإسلام للمسلمين الجدد والمهتدين.',
    descriptionEn: 'The approved digital repository for Islamic outreach topics, newcomer guidance, and audience adaptation.',
    isOfficialRegistry: true,
  },
  jamhara_dict: {
    family: 'jamhara_dict',
    nameAr: 'موسوعة مفردات المحتوى الإسلامي (الجمهرة)',
    nameEn: 'Encyclopedia of Islamic Terminology (Al-Jamharah)',
    url: 'https://islamic-content.com/dictionary',
    category: 'dictionary',
    descriptionAr: 'المعجم المعتمد لترجمة وضبط المصطلحات والمفاهيم الإسلامية بدقة تمنع الالتباس اللغوي والثقافي.',
    descriptionEn: 'The certified terminology dictionary for defining and translating Islamic concepts with precision.',
    isOfficialRegistry: true,
  },
  quranpedia: {
    family: 'quranpedia',
    nameAr: 'موسوعة القرآن الكريم وترجماته المعتمدة (Quranpedia)',
    nameEn: 'Verified Quranic Text & Translations (Quranpedia)',
    url: 'https://quranpedia.net/',
    category: 'quran',
    descriptionAr: 'النص القرآني الموثق بالرسم العثماني وترجمات معاني الآيات المعتمدة رسمياً دون تحريف أو توليد.',
    descriptionEn: 'Verified Quranic text in Uthmani script with authenticated international translations.',
    isOfficialRegistry: true,
  },
  dorar_tafsir: {
    family: 'dorar_tafsir',
    nameAr: 'موسوعة التفسير — الدرر السنية',
    nameEn: 'Dorar Quranic Tafsir Encyclopedia',
    url: 'https://dorar.net/tafseer',
    category: 'tafsir',
    descriptionAr: 'تفسير معتمد ومحرر لآيات الكتاب العزيز مميز بصرياً عن النص القرآني المنزّل.',
    descriptionEn: 'Scholarly commentary and exegesis of Quranic verses, kept distinct from sacred scripture.',
    isOfficialRegistry: true,
  },
  dorar_hadith: {
    family: 'dorar_hadith',
    nameAr: 'الموسوعة الحديثية — الدرر السنية',
    nameEn: 'Dorar Hadith Database & Authentication',
    url: 'https://dorar.net/hadith',
    category: 'hadith',
    descriptionAr: 'التخريج والتحقيق للأحاديث النبوية الشريفة مع حفظ درجة الصحة ورقم الحديث (البخاري ومسلم وغيرهما).',
    descriptionEn: 'Authenticated Prophetic traditions with verified chain status, book references, and hadith numbers.',
    isOfficialRegistry: true,
  },
  shamela: {
    family: 'shamela',
    nameAr: 'المكتبة الشاملة لتراث السنة النبوية',
    nameEn: 'Shamela Islamic Heritage & Sunnah Library',
    url: 'https://shamela.ws/',
    category: 'hadith',
    descriptionAr: 'أمات الكتب ودواوين السنة النبوية المطهرة ومصادر السلف الصالح.',
    descriptionEn: 'Classic canonical compendia and primary sources of the Prophetic traditions and consensus.',
    isOfficialRegistry: true,
  },
  dorar_aqeedah: {
    family: 'dorar_aqeedah',
    nameAr: 'الموسوعة العقدية — الدرر السنية',
    nameEn: 'Dorar Aqeedah (Islamic Creed) Encyclopedia',
    url: 'https://dorar.net/aqeeda',
    category: 'aqeedah',
    descriptionAr: 'أصول العقيدة الإسلامية الصحيحة وبيان معنى التوحيد وأركان الإيمان بوضوح ويسر.',
    descriptionEn: 'The core tenets of Islamic creed, defining Tawhid (Divine Oneness) and faith foundations.',
    isOfficialRegistry: true,
  },
  dorar_fiqh: {
    family: 'dorar_fiqh',
    nameAr: 'الموسوعة الفقهية — الدرر السنية',
    nameEn: 'Dorar Fiqh (Islamic Jurisprudence) Encyclopedia',
    url: 'https://dorar.net/feqhia',
    category: 'fiqh',
    descriptionAr: 'الأحكام الفقهية التعليمية العامة وضوابط التيسير ورخص الشريعة دون ممارسة الإفتاء المستقل.',
    descriptionEn: 'General educational jurisprudence, principles of ease, and legitimate concessions without issuing private fatwas.',
    isOfficialRegistry: true,
  },
  dorar_history: {
    family: 'dorar_history',
    nameAr: 'موسوعة التاريخ والسيرة النبوية — الدرر السنية',
    nameEn: 'Dorar Islamic History & Seerah Encyclopedia',
    url: 'https://dorar.net/history',
    category: 'history',
    descriptionAr: 'سيرة رسول الله ﷺ ووقائع التاريخ الإسلامي الموثقة بالأسانيد الصحيحة.',
    descriptionEn: 'The authentic biography (Seerah) of the Prophet ﷺ and verified historical events.',
    isOfficialRegistry: true,
  },
  bayyinah_qa: {
    family: 'bayyinah_qa',
    nameAr: 'كتاب بينات: أسئلة وأجوبة عن الإسلام',
    nameEn: 'Bayyinat: Questions & Answers about Islam',
    url: 'https://dawa.center/file/7937',
    category: 'dawah',
    descriptionAr: 'كتاب بينات المعتمد بالمستودع الدعوي الرقمي للإجابة الموضوعية عن تساؤلات وشبهات المسلمين الجدد.',
    descriptionEn: 'Official Bayyinat handbook from the Digital Dawa Center answering newcomer questions and doubts with clarity.',
    isOfficialRegistry: true,
  },
  new_muslim_guide: {
    family: 'new_muslim_guide',
    nameAr: 'كتاب دليل المسلم الجديد (د. فهد باهمام)',
    nameEn: 'The New Muslim Guide (Dr. Fahd BaHammam)',
    url: 'https://www.newmuslimguide.com/',
    category: 'fiqh',
    descriptionAr: 'المنهج العالمي المعتمد للتدرج الحركي والمعرفي للمسلم الجديد وتطبيق الشعائر في البيئات المعاصرة.',
    descriptionEn: 'Globally certified interactive curriculum for new Muslims practicing daily rituals in contemporary settings.',
    isOfficialRegistry: true,
  },
  facilitated_primers: {
    family: 'facilitated_primers',
    nameAr: 'سلسلة المتون الميسرة (الشيخ د. هيثم سرحان)',
    nameEn: 'Facilitated Primer Series (Sheikh Dr. Haytham Sarhan)',
    url: 'https://sarhaan.net/',
    category: 'aqeedah',
    descriptionAr: 'تأصيل منهجي مبسط لأركان الإيمان، شروط الصلاة، أركان الوضوء وسجود السهو وفق المعتقد الأصيل.',
    descriptionEn: 'Facilitated pedagogical primers covering faith pillars, purification steps, prayer conditions, and prostration of forgetfulness.',
    isOfficialRegistry: true,
  },
};

/**
 * Returns metadata of an approved source family
 */
export function getApprovedSourceMeta(family: ApprovedSourceFamily): ApprovedSourceRegistryItem {
  return APPROVED_SOURCE_REGISTRY[family] || APPROVED_SOURCE_REGISTRY.dawah_center;
}
