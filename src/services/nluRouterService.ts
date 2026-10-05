/**
 * Structured NLU Routing Service
 * Phase 3 Architecture: Constrained Gemini NLU, Strict Response Schema & Deterministic Post-Validation Guard
 */

import { GoogleGenAI, Type } from '@google/genai';
import { NluRoutingOutput, ScoredScenarioMatch } from '../types/routingTypes';

export const NLU_ROUTING_MODEL = 'gemini-3.8-flash';

/**
 * Strict JSON schema for Gemini responseSchema enforcement.
 */
export const NLU_ROUTING_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    selected_scenario_id: {
      type: Type.STRING,
      description: 'Selected scenario ID matching strictly one of the provided candidate IDs (e.g., SCN_001), or null if none match safely.',
      nullable: true,
    },
    extracted_intent: {
      type: Type.STRING,
      description: 'Concise summary of the core user intent.',
    },
    confidence_score: {
      type: Type.NUMBER,
      description: 'Self-reported confidence score between 0.0 and 1.0.',
    },
    fallback_triggered: {
      type: Type.BOOLEAN,
      description: 'True if no candidate matches safely or input is ambiguous, false otherwise.',
    },
    routing_rationale_ar: {
      type: Type.STRING,
      description: 'Brief Arabic explanation of why this scenario was chosen or why fallback was triggered.',
    },
  },
  required: [
    'selected_scenario_id',
    'extracted_intent',
    'confidence_score',
    'fallback_triggered',
    'routing_rationale_ar',
  ],
};

/**
 * Immediate deterministic fallback object returned when retrieval is empty or refrained.
 * Bypasses LLM API completely.
 */
export const DETERMINISTIC_REFRAIN_OUTPUT: NluRoutingOutput = {
  selected_scenario_id: null,
  extracted_intent: 'out_of_scope_or_low_similarity',
  confidence_score: 0.0,
  fallback_triggered: true,
  routing_rationale_ar: 'الاستفسار خارج نطاق المواقف المعتمدة حالياً.',
};

/**
 * Deterministic Post-Validation Guard:
 * Intercepts LLM output and enforces Zero-Hallucination rules:
 * 1. selected_scenario_id MUST exist in the provided candidate list.
 * 2. If an invalid or hallucinated ID is returned, it is forcibly overridden to null.
 * 3. If fallback_triggered is true, selected_scenario_id is forcibly cleared to null.
 * 4. Confidence score is clamped between 0.0 and 1.0.
 */
export function validateAndSanitizeNluRouting(
  rawOutput: any,
  allowedCandidateIds: string[]
): NluRoutingOutput {
  const allowedSet = new Set(allowedCandidateIds);

  let selected_scenario_id =
    typeof rawOutput?.selected_scenario_id === 'string' && rawOutput.selected_scenario_id.trim()
      ? rawOutput.selected_scenario_id.trim()
      : null;

  let fallback_triggered = Boolean(rawOutput?.fallback_triggered);
  let confidence_score = typeof rawOutput?.confidence_score === 'number' ? rawOutput.confidence_score : 0.0;
  confidence_score = Math.max(0.0, Math.min(1.0, Number(confidence_score.toFixed(2))));

  const extracted_intent =
    typeof rawOutput?.extracted_intent === 'string' && rawOutput.extracted_intent.trim()
      ? rawOutput.extracted_intent.trim()
      : 'unspecified_intent';

  const routing_rationale_ar =
    typeof rawOutput?.routing_rationale_ar === 'string' && rawOutput.routing_rationale_ar.trim()
      ? rawOutput.routing_rationale_ar.trim()
      : 'تمت المعالجة وفق محددات التوجيه المعتمدة.';

  // ZERO-HALLUCINATION GUARD: Check if ID was invented or outside candidate pool
  if (selected_scenario_id !== null && !allowedSet.has(selected_scenario_id)) {
    console.warn(
      `[Zero-Hallucination Guard] Intercepted unauthorized scenario ID "${selected_scenario_id}". Overriding to null and triggering fallback.`
    );
    selected_scenario_id = null;
    fallback_triggered = true;
  }

  // Consistent State: If fallback is triggered, scenario ID must be null
  if (fallback_triggered) {
    selected_scenario_id = null;
  }

  // Consistent State: If no scenario is selected, fallback must be true
  if (selected_scenario_id === null) {
    fallback_triggered = true;
  }

  return {
    selected_scenario_id,
    extracted_intent,
    confidence_score,
    fallback_triggered,
    routing_rationale_ar,
  };
}

/**
 * Main NLU Routing Function:
 * 1. Checks candidates count: If 0, immediately returns deterministic refrain output (Zero LLM calls).
 * 2. If candidates exist, prompts Gemini with strict JSON schema and candidate bounds.
 * 3. Applies post-validation guard to prevent any hallucinated or out-of-pool scenario selection.
 */
export async function routeUserInquiry(
  query: string,
  candidates: ScoredScenarioMatch[]
): Promise<NluRoutingOutput> {
  const trimmed = query.trim();

  // 1. Fast Deterministic Path (Retrieval already refrained or empty)
  if (!trimmed || candidates.length === 0) {
    return DETERMINISTIC_REFRAIN_OUTPUT;
  }

  const allowedCandidateIds = candidates.map((c) => c.scenario.id);

  // 2. Prepare constrained prompt containing ONLY the candidate scenarios
  const candidatesContext = candidates
    .map(
      (c, index) =>
        `[Candidate ${index + 1}]\n- ID: ${c.scenario.id}\n- Title: ${c.scenario.title_ar}\n- Learning Objective: ${c.scenario.learning_objective_ar}\n- Semantic Similarity: ${c.similarityScore}`
    )
    .join('\n\n');

  const systemInstruction = `You are the Structured NLU Router for the Rafeeq AI platform.
Your ONLY responsibility is to determine which single scenario from the provided candidate list best resolves the user inquiry, OR trigger fallback.

STRICT CONSTRAINTS & ZERO-HALLUCINATION RULES:
1. You may ONLY select a scenario ID from this exact list: [${allowedCandidateIds.join(', ')}].
2. You are STRICTLY FORBIDDEN from inventing, guessing, or selecting any ID not in this list.
3. If none of the candidates adequately and directly addresses the core user intent, you MUST set "fallback_triggered": true and "selected_scenario_id": null.
4. Do NOT generate religious rulings, tafsir, or hadiths. Your role is purely intent classification and candidate routing.
5. Return your decision strictly conforming to the requested JSON schema.`;

  const userPrompt = `USER INQUIRY:
"${trimmed}"

CANDIDATE SCENARIOS (Top-${candidates.length}):
${candidatesContext}

Analyze the user inquiry and choose the matching Candidate ID from the list, or trigger fallback if ambiguous or not adequately matched.`;

  const apiKey =
    (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '') ||
    (typeof window !== 'undefined' ? (window as any).__GEMINI_API_KEY__ || (window as any).VITE_GEMINI_API_KEY : '') ||
    '';
  if (!apiKey) {
    console.warn('[NluRouter] GEMINI_API_KEY missing, defaulting to top candidate safely if available.');
    // Safe deterministic fallback to top candidate if high confidence, or refrain
    if (candidates[0] && candidates[0].similarityScore >= 0.75) {
      return {
        selected_scenario_id: candidates[0].scenario.id,
        extracted_intent: candidates[0].scenario.unique_user_intent,
        confidence_score: candidates[0].similarityScore,
        fallback_triggered: false,
        routing_rationale_ar: `توجيه حتمي مباشر لأعلى مرشح دلالي (${candidates[0].scenario.title_ar}).`,
      };
    }
    return DETERMINISTIC_REFRAIN_OUTPUT;
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Try routing with transient retry
  const maxAttempts = 2;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: NLU_ROUTING_MODEL,
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: NLU_ROUTING_RESPONSE_SCHEMA,
        },
      });

      const responseText = response.text?.trim();
      if (!responseText) {
        throw new Error('Empty response received from Gemini NLU Router.');
      }

      const parsedJson = JSON.parse(responseText);
      return validateAndSanitizeNluRouting(parsedJson, allowedCandidateIds);
    } catch (err: any) {
      const isTransient = err?.message?.includes('503') || err?.message?.includes('429') || err?.status === 'UNAVAILABLE';
      if (isTransient && attempt < maxAttempts) {
        console.warn(`[NluRouter] Transient API notice on attempt ${attempt}. Retrying in 600ms...`);
        await new Promise((r) => setTimeout(r, 600));
        continue;
      }

      console.error('[NluRouter] Gemini API error during routing:', err?.message || err);
      // Safe fallback to deterministic top candidate if high similarity
      if (candidates[0] && candidates[0].similarityScore >= 0.75) {
        return {
          selected_scenario_id: candidates[0].scenario.id,
          extracted_intent: candidates[0].scenario.unique_user_intent,
          confidence_score: candidates[0].similarityScore,
          fallback_triggered: false,
          routing_rationale_ar: `توجيه ارتدادي آمن لأعلى مرشح دلالي (${candidates[0].scenario.title_ar}) بعد تعذر الاتصال بالنواة.`,
        };
      }
      return DETERMINISTIC_REFRAIN_OUTPUT;
    }
  }

  return DETERMINISTIC_REFRAIN_OUTPUT;
}
