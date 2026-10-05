/**
 * Strict Scenario Schema (Phase 1 Architecture)
 * Enforces data integrity, approved sources allowlist, and 40/20 production/review split.
 */

export type ScenarioStatus = 'production' | 'needs_review';

export type ApprovedSourceId =
  | 'Quran'
  | 'Dorar'
  | 'DawahVault'
  | 'Jamharah'
  | 'quranpedia'
  | 'dorar_hadith'
  | 'dorar_fiqh'
  | 'dorar_tafsir'
  | 'dorar_aqeedah'
  | 'dawah_center'
  | 'jamhara_dict'
  | 'new_muslim_guide';

export type InteractionEngineType = 'decision' | 'sequence' | 'inspection' | 'transfer';

export interface Scenario {
  id: string; // Unique identifier: SCN_001 to SCN_060
  status: ScenarioStatus; // 'production' (40 active items) | 'needs_review' (20 review items)
  title_ar: string;
  context: string;
  learning_objectives: string[];
  approved_source_ids: ApprovedSourceId[];
  interaction_engine: InteractionEngineType;
  tags: string[];
  title_en?: string;
  contexts?: string[];
  difficulty?: 'beginner' | 'intermediate';
  related_scenarios?: string[];
  related_city_experience?: string;
}
