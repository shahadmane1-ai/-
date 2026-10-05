/**
 * AI Router Service (Phase 3 Grounded RAG & Structured Routing Engine)
 * Transforms Gemini into a deterministic, secure, and source-grounded routing engine via direct REST fetch.
 */

import { RoutingDecision } from '../types/aiRouting';
import { searchScenarios } from './semanticRetrievalService';
import { APPROVED_SOURCE_REGISTRY } from '../data/sourceRegistry';
import { getScenarioById } from './scenarioVault';
import { generateContentDirect } from './geminiService';

export const AI_ROUTING_MODEL = 'gemini-3.5-flash-lite';

export const FALLBACK_UNMATCHED_MESSAGE =
  'هذا السؤال يحتاج لمراجعة مصدر متخصص، ولم يتم إدراجه ضمن الحالات التفاعلية الحالية.';

/**
 * Executes the full Grounded RAG routing pipeline for a user query via direct REST.
 */
export async function routeUserQuery(userQuery: string): Promise<RoutingDecision> {
  const trimmedQuery = userQuery?.trim();
  console.log('[aiRouterService:REST] 🚀 Starting routeUserQuery for query:', `"${trimmedQuery}"`);

  if (!trimmedQuery) {
    console.log('[aiRouterService:REST] Empty query received, returning empty_query abstain.');
    return {
      intent: 'empty_query',
      scenario_id: null,
      confidence: 0.0,
      abstain: true,
      grounded_guidance: FALLBACK_UNMATCHED_MESSAGE,
      source_reference: 'غير محدد',
    };
  }

  // 1. RETRIEVE: Top 3 semantic candidates from 40 Production Scenarios via direct REST embeddings / semantic ranker
  console.log('[aiRouterService:REST] Step 1: Performing semantic search via searchScenarios...');
  let topCandidates: any[] = [];
  try {
    topCandidates = await searchScenarios(trimmedQuery, 3);
    console.log(
      '[aiRouterService:REST] Step 1 complete. Retrieved candidates:',
      topCandidates.map((c) => `${c.id} (score: ${c.score})`)
    );
  } catch (err: any) {
    console.warn('[aiRouterService:REST] Step 1 semantic search warning:', err);
  }

  if (!topCandidates || topCandidates.length === 0) {
    console.log('[aiRouterService:REST] No candidates retrieved, abstaining.');
    return {
      intent: 'no_retrieval_matches',
      scenario_id: null,
      confidence: 0.0,
      abstain: true,
      grounded_guidance: FALLBACK_UNMATCHED_MESSAGE,
      source_reference: 'غير محدد',
    };
  }

  // 2. AUGMENT: Fetch verified source texts and metadata for the Top 3 candidates
  console.log('[aiRouterService:REST] Step 2: Augmenting candidate payload with verified sources...');
  const candidatePayload = topCandidates.map((c) => {
    const fullScenario = getScenarioById(c.id) || c.scenario;
    const sourcesData = (fullScenario?.approved_sources || []).map((src: any) => {
      const regDoc = APPROVED_SOURCE_REGISTRY[src.source_id];
      return {
        source_id: src.source_id,
        source_name: regDoc?.source_name_ar || src.source_name_ar || 'موسوعة الدرر السنية',
        reference_text: src.verbatim_evidence_text || src.citation_url || '',
        url: src.canonical_url || regDoc?.base_url || '',
      };
    });

    return {
      id: c.id,
      title_ar: fullScenario.title_ar,
      context: fullScenario.contexts?.join(', ') || fullScenario.context || '',
      similarity_score: c.score,
      learning_objective: fullScenario.learning_objective_ar || '',
      verified_sources: sourcesData,
    };
  });

  const validCandidateIds = topCandidates.map((c) => c.id);

  // 3. PROMPT CONSTRUCTION & DIRECT REST FETCH (JSON ENFORCED)
  console.log('[aiRouterService:REST] Step 3: Constructing prompt for model:', AI_ROUTING_MODEL);
  const systemInstruction = `You are Rafeeq AI, an intelligent, deterministic Islamic scenario routing engine.
Your task is to analyze the user query and select the single most appropriate scenario STRICTLY from the provided candidate list.

Rules:
1. You MUST select scenario_id strictly from the provided candidates: [${validCandidateIds.join(', ')}]. Never invent an ID.
2. Your "grounded_guidance" must be grounded STRICTLY in the provided source texts. Do NOT make up, assume, or invent rulings.
3. If none of the candidates match the user's situation, or if the question is out of scope (e.g. secular, mechanical, speculative, or controversial fatwa not in the candidates), set "abstain": true, "scenario_id": null, and provide a polite guidance.
4. "source_reference" must be the name of the approved source (e.g., "الدرر السنية", "مجمع الملك فهد (Quranpedia)", "المستودع الدعوي").
5. Return strictly a valid JSON object matching this TypeScript format:
{
  "intent": string,
  "scenario_id": string | null,
  "confidence": number,
  "abstain": boolean,
  "grounded_guidance": string,
  "source_reference": string
}`;

  const userPrompt = `User Query: "${trimmedQuery}"

Top 3 Semantic Candidates:
${JSON.stringify(candidatePayload, null, 2)}

Output strictly valid JSON with the structured routing decision.`;

  try {
    console.log('[aiRouterService:REST] Sending direct REST request to Gemini API...');
    const rawJsonText = await generateContentDirect({
      prompt: userPrompt,
      systemInstruction,
      model: AI_ROUTING_MODEL,
      responseMimeType: 'application/json',
    });

    // Clean JSON formatting if enclosed in code blocks
    let cleanText = rawJsonText.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.slice(7);
    }
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.slice(3);
    }
    if (cleanText.endsWith('```')) {
      cleanText = cleanText.slice(0, -3);
    }
    cleanText = cleanText.trim();

    const parsed: RoutingDecision = JSON.parse(cleanText || '{}');
    console.log('[aiRouterService:REST] Parsed structured routing decision:', parsed);

    // Post-Validation Zero-Hallucination Guard
    if (parsed.scenario_id && !validCandidateIds.includes(parsed.scenario_id)) {
      console.warn(`[aiRouterService:REST] Overriding hallucinated ID "${parsed.scenario_id}" to null`);
      parsed.scenario_id = null;
      parsed.abstain = true;
    }

    if (parsed.abstain || !parsed.scenario_id) {
      if (!parsed.grounded_guidance || parsed.grounded_guidance.length < 5) {
        parsed.grounded_guidance = FALLBACK_UNMATCHED_MESSAGE;
      }
    }

    return {
      intent: parsed.intent || 'استفسار فقهي سلوكي',
      scenario_id: parsed.abstain ? null : parsed.scenario_id,
      confidence: Number((parsed.confidence || 0.85).toFixed(2)),
      abstain: Boolean(parsed.abstain),
      grounded_guidance: parsed.grounded_guidance || FALLBACK_UNMATCHED_MESSAGE,
      source_reference: parsed.source_reference || 'الدرر السنية',
    };
  } catch (error: any) {
    console.warn('[aiRouterService:REST] Direct LLM call failed or timed out, activating deterministic source grounding fallback:', error?.message || error);

    const topCandidate = topCandidates[0];
    if (topCandidate && topCandidate.score >= 0.25) {
      const fullScenario = getScenarioById(topCandidate.id) || topCandidate.scenario;
      const firstSource = fullScenario?.approved_sources?.[0];
      const sourceName = firstSource?.reference_title || firstSource?.source_name_ar || 'موسوعة الدرر السنية';
      const evidenceText = firstSource?.verbatim_evidence_text || fullScenario?.learning_objective_ar || '';

      return {
        intent: fullScenario.title_ar,
        scenario_id: topCandidate.id,
        confidence: Number(Math.min(0.95, Math.max(0.82, topCandidate.score)).toFixed(2)),
        abstain: false,
        grounded_guidance: evidenceText || `يرتبط استفسارك بتوجيه: ${fullScenario.title_ar}.`,
        source_reference: sourceName,
      };
    }

    return {
      intent: 'unmatched_inquiry',
      scenario_id: null,
      confidence: 0.0,
      abstain: true,
      grounded_guidance: FALLBACK_UNMATCHED_MESSAGE,
      source_reference: 'غير محدد',
    };
  }
}
