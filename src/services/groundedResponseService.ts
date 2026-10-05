/**
 * Deterministic Grounded Response Binder
 * Phase 3 Architecture: Static Binding of Pre-Validated Sacred Evidence from Production Vault
 * Strictly prohibits LLM-generated religious rulings, text modification or hallucinations.
 */

import { GroundedInquiryResponse, NluRoutingOutput } from '../types/routingTypes';
import { getScenarioById } from './scenarioVault';
import { retrieveTopScenarios } from './semanticRetrievalService';
import { routeUserInquiry } from './nluRouterService';
import { SemanticRetrievalConfig } from '../types/scenarioKnowledge';

/**
 * Standard compassionate message for unmapped or out-of-scope inquiries.
 * Refers the user to official human advisory channels without generating rulings.
 */
export const OFFICIAL_HUMAN_REFERRAL_MESSAGE_AR =
  'لم نجد موقفاً تعليمياً مطابقاً تماماً لسؤالك في المستودع المعتمد حالياً. حفظاً لأمانة الفتوى وحرصاً على ضبط الحكم، نوصيك بالتواصل المباشر مع منصات الإفتاء الرسمية المعتمدة (مثل منصة إفتاء، أو الرقم الموحد للإفتاء)، أو مراجعة المشاهد التعليمية التفاعلية المتاحة في المدينة.';

/**
 * Binds the NLU routing decision to the exact, pre-validated scenario knowledge vault.
 * All evidence, titles, and sources are drawn deterministically from the vault without LLM modification.
 */
export function bindGroundedScenarioResponse(
  routingResult: NluRoutingOutput
): GroundedInquiryResponse {
  // 1. Fallback / Refrain Case
  if (routingResult.fallback_triggered || !routingResult.selected_scenario_id) {
    const isOutOfScope = routingResult.extracted_intent === 'out_of_scope_or_low_similarity';

    return {
      scenario_id: null,
      status: isOutOfScope ? 'REFRAINED' : 'HUMAN_REFERRAL_REQUIRED',
      scenario_title_ar: null,
      scenario_title_en: null,
      learning_objective: null,
      approved_sources: [],
      verbatim_evidence_text: null,
      related_city_experience: null,
      fallback_message_ar: OFFICIAL_HUMAN_REFERRAL_MESSAGE_AR,
      routing_metadata: routingResult,
    };
  }

  // 2. Fetch the verified item from the scenario vault
  const scenario = getScenarioById(routingResult.selected_scenario_id);

  // Safety guard: If scenario ID cannot be resolved or is not active
  if (!scenario || !scenario.is_active || scenario.source_status !== 'SOURCE_VALIDATED') {
    console.warn(
      `[GroundedBinder] Scenario ${routingResult.selected_scenario_id} could not be resolved in active vault. Triggering referral.`
    );
    return {
      scenario_id: null,
      status: 'HUMAN_REFERRAL_REQUIRED',
      scenario_title_ar: null,
      scenario_title_en: null,
      learning_objective: null,
      approved_sources: [],
      verbatim_evidence_text: null,
      related_city_experience: null,
      fallback_message_ar: OFFICIAL_HUMAN_REFERRAL_MESSAGE_AR,
      routing_metadata: routingResult,
    };
  }

  // 3. Extract primary verbatim evidence text from approved sources
  const primarySource = scenario.approved_sources && scenario.approved_sources.length > 0
    ? scenario.approved_sources[0]
    : null;

  const verbatim_evidence_text = primarySource?.verbatim_evidence_text || null;

  return {
    scenario_id: scenario.id,
    status: 'RESOLVED',
    scenario_title_ar: scenario.title_ar,
    scenario_title_en: scenario.title_en,
    learning_objective: scenario.learning_objective_ar,
    approved_sources: scenario.approved_sources,
    verbatim_evidence_text,
    related_city_experience: scenario.related_city_experience,
    routing_metadata: routingResult,
  };
}

/**
 * End-to-End Grounded Inquiry Pipeline:
 * Step 1: Semantic Vector Retrieval (Phase 2)
 * Step 2: Structured NLU Candidate Routing & Guard (Phase 3)
 * Step 3: Deterministic Evidence Binding from Source Registry (Phase 3)
 */
export async function executeGroundedInquiryPipeline(
  query: string,
  config?: SemanticRetrievalConfig
): Promise<GroundedInquiryResponse> {
  // Step 1: Retrieve Top candidates
  const retrievalResult = await retrieveTopScenarios(query, config);

  // Step 2: Route user inquiry with candidate bounds and zero-hallucination guard
  const routingOutput = await routeUserInquiry(query, retrievalResult.topCandidates);

  // Step 3: Deterministically bind sacred text and sources from repository
  return bindGroundedScenarioResponse(routingOutput);
}
