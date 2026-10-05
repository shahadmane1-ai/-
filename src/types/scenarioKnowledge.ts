/**
 * Unified Scenario Knowledge Schema & Policy Guards
 * Phase 1 Architecture: Deterministic Grounding & Policy Guarded Scenario Types
 */

export type KnowledgeSourceStatus = 'SOURCE_VALIDATED' | 'NEEDS_REVIEW';

export interface GroundedSourceBinding {
  registry_source_id: string; // Must resolve exactly to an existing ID in sourceRegistry.ts
  reference_title: string;
  source_page_url: string;
  verbatim_evidence_text: string;
}

export interface ScenarioLearningCriteria {
  required_concepts: string[]; // Minimum 1 concept required for validated items
  common_misconceptions: string[];
}

export interface ScenarioKnowledgeItem {
  id: string; // Unique string ID: SCN_001 to SCN_060
  numeric_id?: number; // Maintained for backward compatibility with existing components
  status?: 'production' | 'needs_review'; // Phase 1 status split
  title_ar: string;
  title_en: string;
  topic: 'prayer' | 'purity' | 'travel' | 'food' | 'social' | 'mindset';
  unique_user_intent: string;
  contexts: string[];
  context?: string; // Single primary context string alias
  learning_objective_ar: string;
  learning_objective_en: string;
  learning_objectives?: string[]; // Phase 1 learning objectives list
  difficulty: 'beginner' | 'intermediate';
  interaction_engine: 'decision' | 'sequence' | 'inspection' | 'transfer';
  keywords_ar: string[];
  keywords_en: string[];
  tags?: string[]; // Phase 1 tags alias
  approved_sources: GroundedSourceBinding[];
  approved_source_ids?: string[]; // Phase 1 approved source ID list
  learning_criteria: ScenarioLearningCriteria;
  related_scenarios: string[]; // References to other valid SCN_xxx IDs
  related_city_experience: string; // Mapping to existing City experiences (e.g., 'home-prayer-room')
  source_status: KnowledgeSourceStatus;
  is_active: boolean; // TRUE for SOURCE_VALIDATED (Production), FALSE for NEEDS_REVIEW (Excluded)
}

/**
 * Phase 2 Types: Semantic Embeddings & Vector Retrieval
 */
export interface ScenarioEmbeddingEntry {
  scenario_id: string; // Resolves to SCN_xxx
  searchable_representation: string;
  embedding: number[];
}

export interface SemanticRetrievalCandidate {
  scenario: ScenarioKnowledgeItem;
  similarityScore: number;
}

export interface SemanticRetrievalResult {
  topCandidates: SemanticRetrievalCandidate[];
  highestScore: number;
  thresholdApplied: number;
  shouldRefrain: boolean;
  refrainReason?: 'BELOW_SIMILARITY_THRESHOLD' | 'EMPTY_QUERY' | 'EMBEDDING_FAILED';
}

export interface SemanticRetrievalConfig {
  similarityThreshold?: number; // Configurable threshold (e.g. 0.65)
  topK?: number; // Default 3
  model?: string;
  outputDimensionality?: number;
}

/**
 * Phase 4 Types: Deterministic Learning State, Objective Evaluation & Adaptive Reinforcement
 */
export interface UserLearningState {
  completed_scenarios: string[]; // List of SCN_xxx IDs passed
  attempts: Record<string, number>; // scenario_id -> attempt count
  mistakes_by_topic: Record<string, number>; // topic -> count of incorrect attempts/evaluations
  mastered_concepts: string[]; // List of validated concept tags
  needs_reinforcement: string[]; // List of concept tags or scenario IDs requiring practice
  last_active_timestamp: number;
}

export interface ConceptEvaluationResult {
  scenario_id: string;
  passed: boolean;
  concepts_understood: string[];
  missing_concepts: string[];
  evaluation_feedback_ar: string;
}

export interface AdaptiveRecommendation {
  target_scenario_id: string; // Must be a valid active SCN_xxx ID
  target_title_ar: string;
  reason_ar: string;
  related_city_experience: string;
}
