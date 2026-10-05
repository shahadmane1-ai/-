/**
 * AI Routing Decision Schema (Phase 3 Architecture)
 * Enforces structured, zero-hallucination routing and strict source grounding.
 */

export interface RoutingDecision {
  intent: string; // The abstracted user intent (e.g., "أداء الصلاة في السفر الجوي")
  scenario_id: string | null; // The exact ID of the chosen scenario from the provided candidates
  confidence: number; // 0.0 to 1.0
  abstain: boolean; // TRUE if the query is out of scope, malicious, or lacks sufficient source grounding
  grounded_guidance: string; // A brief explanation grounded STRICTLY in the provided source text.
  source_reference: string; // The name of the approved source used (e.g., "الدرر السنية")
}
