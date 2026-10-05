/**
 * Central Source Registry (Phase 1 Grounding Truth)
 * Maps source IDs to verified textual content, metadata, and reference URLs.
 * Acts as the Grounding Truth for RAG and zero-hallucination pipelines.
 */

export interface SourceDocument {
  source_id: string;
  source_name_ar: string;
  source_name_en: string;
  category: 'quran' | 'hadith' | 'fiqh' | 'tafsir' | 'dawah' | 'dictionary';
  authority: string;
  base_url: string;
  description_ar: string;
  is_verified_registry: boolean;
}

export const APPROVED_SOURCE_REGISTRY: Record<string, SourceDocument> = {
  Quran: {
    source_id: 'Quran',
    source_name_ar: 'القرآن الكريم وترجماته المعتمدة (Quranpedia)',
    source_name_en: 'Holy Quran & Authenticated Translations',
    category: 'quran',
    authority: 'مجمع الملك فهد لطباعة المصحف الشريف / Quranpedia',
    base_url: 'https://quranpedia.net',
    description_ar: 'النص القرآني الموثق بالرسم العثماني وترجمات معاني الآيات المعتمدة رسمياً دون تحريف أو توليد.',
    is_verified_registry: true,
  },
  Dorar: {
    source_id: 'Dorar',
    source_name_ar: 'موسوعة الدرر السنية الحديثية والفقهية',
    source_name_en: 'Dorar Al-Saniyyah Hadith & Fiqh Encyclopedia',
    category: 'hadith',
    authority: 'مؤسسة الدرر السنية العلمية (إشراف الشيخ علوي بن عبد القادر السقاف)',
    base_url: 'https://dorar.net',
    description_ar: 'التخريج والتحقيق للأحاديث النبوية الشريفة مع حفظ درجة الصحة والموسوعة الفقهية المحررة.',
    is_verified_registry: true,
  },
  DawahVault: {
    source_id: 'DawahVault',
    source_name_ar: 'المستودع الدعوي الرقمي ومكتبة المهتدين',
    source_name_en: 'Digital Dawah Repository & New Muslim Guide',
    category: 'dawah',
    authority: 'المستودع الدعوي الرقمي / دليل المسلم الجديد',
    base_url: 'https://center.dawa.sa',
    description_ar: 'المنصة المركزية المعتمدة للموضوعات الدعوية وتأصيل مفاهيم الإسلام للمسلمين والمهتدين.',
    is_verified_registry: true,
  },
  Jamharah: {
    source_id: 'Jamharah',
    source_name_ar: 'معجم مفردات المحتوى الإسلامي (الجمهرة)',
    source_name_en: 'Encyclopedia of Islamic Terminology (Al-Jamharah)',
    category: 'dictionary',
    authority: 'موسوعة الجمهرة للمصطلحات الإسلامية',
    base_url: 'https://islamic-content.com/dictionary',
    description_ar: 'المعجم المعتمد لترجمة وضبط المصطلحات والمفاهيم الإسلامية بدقة تمنع الالتباس اللغوي.',
    is_verified_registry: true,
  },
  quranpedia: {
    source_id: 'quranpedia',
    source_name_ar: 'موسوعة القرآن الكريم وترجماته (Quranpedia)',
    source_name_en: 'Quranpedia Multi-Language Quran Index',
    category: 'quran',
    authority: 'Quranpedia Verified Digital Index',
    base_url: 'https://quranpedia.net',
    description_ar: 'النصوص القرآنية وتفاسير الآيات الموثقة.',
    is_verified_registry: true,
  },
  dorar_hadith: {
    source_id: 'dorar_hadith',
    source_name_ar: 'الموسوعة الحديثية — الدرر السنية',
    source_name_en: 'Dorar Hadith Database',
    category: 'hadith',
    authority: 'مؤسسة الدرر السنية',
    base_url: 'https://dorar.net/hadith',
    description_ar: 'التحقيق العلمي للأحاديث النبوية في الصحيحين والسنن.',
    is_verified_registry: true,
  },
  dorar_fiqh: {
    source_id: 'dorar_fiqh',
    source_name_ar: 'الموسوعة الفقهية — الدرر السنية',
    source_name_en: 'Dorar Fiqh Encyclopedia',
    category: 'fiqh',
    authority: 'مؤسسة الدرر السنية',
    base_url: 'https://dorar.net/feqhia',
    description_ar: 'الفقه الميسر وضوابط التيسير والرخص الشرعية.',
    is_verified_registry: true,
  },
  dawah_center: {
    source_id: 'dawah_center',
    source_name_ar: 'المستودع الدعوي الرقمي',
    source_name_en: 'Digital Dawah Center',
    category: 'dawah',
    authority: 'وزارة الشؤون الإسلامية والدعوة والإرشاد',
    base_url: 'https://center.dawa.sa',
    description_ar: 'التأصيل الدعوي للمفاهيم الإسلامية المعاصرة.',
    is_verified_registry: true,
  },
  jamhara_dict: {
    source_id: 'jamhara_dict',
    source_name_ar: 'معجم الجمهرة للمصطلحات',
    source_name_en: 'Jamharah Dictionary',
    category: 'dictionary',
    authority: 'مركز أصول للمحتوى الإسلامي',
    base_url: 'https://islamic-content.com/dictionary',
    description_ar: 'ضبط المعاني والمصطلحات الشرعية.',
    is_verified_registry: true,
  },
  new_muslim_guide: {
    source_id: 'new_muslim_guide',
    source_name_ar: 'دليل المسلم الجديد الفقهي',
    source_name_en: 'New Muslim Practical Fiqh Guide',
    category: 'dawah',
    authority: 'مؤسسة دليل المسلم الجديد التعليمية',
    base_url: 'https://www.newmuslimguide.com',
    description_ar: 'الفقه التطبيقي الميسر للحياة اليومية.',
    is_verified_registry: true,
  },
};

export function getSourceById(sourceId: string): SourceDocument | undefined {
  return APPROVED_SOURCE_REGISTRY[sourceId];
}

export function getAllApprovedSources(): SourceDocument[] {
  return Object.values(APPROVED_SOURCE_REGISTRY);
}
