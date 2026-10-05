/**
 * Phase 3 Types: Structured NLU Routing, JSON Schema & Grounded Response Contracts
 */

import { GroundedSourceBinding, ScenarioKnowledgeItem } from './scenarioKnowledge';

export interface ScoredScenarioMatch {
  scenario: ScenarioKnowledgeItem;
  similarityScore: number;
}

export interface NluRoutingOutput {
  selected_scenario_id: string | null; // Must match one of the passed candidate IDs or null
  extracted_intent: string; // Concise representation of user intent
  confidence_score: number; // Model self-reported confidence (0.0 - 1.0)
  fallback_triggered: boolean; // True if no candidate matches safely or input is ambiguous
  routing_rationale_ar: string; // Brief internal Arabic explanation of why this scenario was chosen
}

export interface GroundedInquiryResponse {
  scenario_id: string | null;
  status: 'RESOLVED' | 'REFRAINED' | 'HUMAN_REFERRAL_REQUIRED';
  scenario_title_ar: string | null;
  scenario_title_en: string | null;
  learning_objective: string | null;
  approved_sources: GroundedSourceBinding[]; // Loaded deterministically from vault/registry
  verbatim_evidence_text: string | null; // Exact quote from approved source
  related_city_experience: string | null;
  fallback_message_ar?: string;
  routing_metadata?: NluRoutingOutput;
}
