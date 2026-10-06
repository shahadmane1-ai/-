/**
 * Semantic Embeddings & Vector Retrieval Service
 * Phase 2 Architecture: Precomputed Static Scenario Index, Cosine Similarity Engine & Threshold Refrain Gateway
 */

import {
  ScenarioKnowledgeItem,
  ScenarioEmbeddingEntry,
  SemanticRetrievalCandidate,
  SemanticRetrievalResult,
  SemanticRetrievalConfig,
} from '../types/scenarioKnowledge';
import { getProductionScenarios, getScenarioById } from './scenarioVault';
import { generateEmbedding, EMBEDDING_DIMENSION, DEFAULT_EMBEDDING_MODEL, FALLBACK_EMBEDDING_MODEL } from './geminiService';
import precomputedCacheData from '../data/scenarioEmbeddingsCache.json';
import { SCENARIO_CONCEPT_PROFILES, evaluateCandidateWithArabicNlu } from './scenarioConceptProfiles';

export { EMBEDDING_DIMENSION, DEFAULT_EMBEDDING_MODEL, FALLBACK_EMBEDDING_MODEL };

/**
 * Default calibrated similarity threshold.
 * Queries with highest cosine similarity below this value trigger intentional refraining.
 */
export const DEFAULT_SIMILARITY_THRESHOLD = 0.65;
export const DEFAULT_TOP_K = 3;

export interface ScenarioResult {
  id: string;
  score: number;
  scenario: ScenarioKnowledgeItem;
}

/**
 * Static precomputed cache containing embeddings for the 40 active production scenarios.
 * Inactive scenarios are strictly excluded.
 */
export const SCENARIO_EMBEDDINGS_CACHE: ScenarioEmbeddingEntry[] = precomputedCacheData as ScenarioEmbeddingEntry[];

/**
 * Validates cache integrity against production vault
 */
export function validateEmbeddingsCacheIntegrity(): {
  isValid: boolean;
  totalCached: number;
  expectedActive: number;
  mismatchedIds: string[];
} {
  const activeScenarios = getProductionScenarios();
  const cachedIds = new Set(SCENARIO_EMBEDDINGS_CACHE.map((e) => e.scenario_id));
  const activeIds = new Set(activeScenarios.map((s) => s.id));

  const mismatchedIds: string[] = [];
  for (const id of activeIds) {
    if (!cachedIds.has(id)) mismatchedIds.push(id);
  }
  for (const id of cachedIds) {
    if (!activeIds.has(id)) mismatchedIds.push(id);
  }

  return {
    isValid: mismatchedIds.length === 0 && SCENARIO_EMBEDDINGS_CACHE.length === 40,
    totalCached: SCENARIO_EMBEDDINGS_CACHE.length,
    expectedActive: activeScenarios.length,
    mismatchedIds,
  };
}

/**
 * Builds the canonical searchable semantic representation for a scenario.
 * Strictly taken EXCLUSIVELY from: (العنوان، الموضوع، السياقات، النية، والكلمات المفتاحية)
 */
export function buildScenarioSearchableRepresentation(scenario: ScenarioKnowledgeItem): string {
  return [
    `العنوان: ${scenario.title_ar} (${scenario.title_en})`,
    `الموضوع: ${scenario.topic}`,
    `النية: ${scenario.unique_user_intent}`,
    `السياق: ${scenario.contexts.join(', ')}`,
    `الكلمات المفتاحية: ${scenario.keywords_ar.join(', ')} | ${scenario.keywords_en.join(', ')}`,
  ].join('\n');
}

/**
 * Pure, deterministic mathematical Cosine Similarity:
 * cos(theta) = (A . B) / (||A|| * ||B||)
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
  if (vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    const a = vecA[i];
    const b = vecB[i];
    dotProduct += a * b;
    normA += a * a;
    normB += b * b;
  }

  if (normA === 0 || normB === 0) return 0;
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
}

/**
 * Standard alias for cosine similarity
 */
export const calculateCosineSimilarity = cosineSimilarity;

/**
 * Normalizes Arabic text for high-accuracy local semantic token matching
 */
function normalizeArabicText(text: string): string {
  return (text || '')
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '') // Remove harakat
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[^\w\s\u0621-\u064A]/gi, ' ')
    .trim();
}

/**
 * Fallback semantic ranker against the 40 production scenarios when remote vector embedding times out
 */
export function rankScenariosLocally(query: string, topK: number = 3): ScenarioResult[] {
  const normQuery = normalizeArabicText(query);
  if (!normQuery) return [];

  const productionScenarios = getProductionScenarios();
  const scored: ScenarioResult[] = [];

  for (const scenario of productionScenarios) {
    const profile = SCENARIO_CONCEPT_PROFILES.find((p) => p.scenario_id === scenario.id || p.numeric_id === scenario.numeric_id);
    let finalScore = 0;

    if (profile) {
      finalScore = evaluateCandidateWithArabicNlu(query, profile, 0);
    } else {
      const titleNorm = normalizeArabicText(scenario.title_ar + ' ' + scenario.title_en);
      const intentNorm = normalizeArabicText(scenario.unique_user_intent);
      const keywordsNorm = normalizeArabicText((scenario.keywords_ar || []).join(' '));

      let matchWeight = 0;
      const tokens = normQuery.split(/\s+/).filter((t) => t.length > 1);
      for (const token of tokens) {
        if (titleNorm.includes(token)) matchWeight += 0.45;
        if (intentNorm.includes(token)) matchWeight += 0.35;
        if (keywordsNorm.includes(token)) matchWeight += 0.3;
      }
      finalScore = Math.min(0.96, matchWeight / Math.max(1, tokens.length * 0.7));
    }

    if (finalScore > 0.15) {
      scored.push({
        id: scenario.id,
        score: Number(finalScore.toFixed(4)),
        scenario,
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

/**
 * Generates an embedding vector for a given query text using Gemini Embeddings API.
 * Uses outputDimensionality: 768 with network resilience and fallback.
 */
export async function generateQueryEmbedding(
  query: string,
  _config?: SemanticRetrievalConfig
): Promise<number[]> {
  return generateEmbedding(query);
}

/**
 * Performs vector similarity retrieval against precomputed cache using an explicit query vector.
 */
export function searchScenariosByVector(
  queryVector: number[],
  config?: SemanticRetrievalConfig
): SemanticRetrievalResult {
  const threshold = config?.similarityThreshold ?? DEFAULT_SIMILARITY_THRESHOLD;
  const topK = config?.topK ?? DEFAULT_TOP_K;

  if (!queryVector || queryVector.length !== EMBEDDING_DIMENSION) {
    return {
      topCandidates: [],
      highestScore: 0,
      thresholdApplied: threshold,
      shouldRefrain: true,
      refrainReason: 'EMBEDDING_FAILED',
    };
  }

  // Calculate similarity against all 40 active cached scenarios
  const scoredItems: { scenario: ScenarioKnowledgeItem; score: number }[] = [];

  for (const entry of SCENARIO_EMBEDDINGS_CACHE) {
    const scenario = getScenarioById(entry.scenario_id);
    if (!scenario || !scenario.is_active || scenario.source_status !== 'SOURCE_VALIDATED') {
      continue; // Strictly enforce production status (40 production only)
    }

    const score = cosineSimilarity(queryVector, entry.embedding);
    scoredItems.push({ scenario, score });
  }

  // Sort descending by similarity score
  scoredItems.sort((a, b) => b.score - a.score);

  const highestScore = scoredItems.length > 0 ? scoredItems[0].score : 0;

  // Threshold Gate: If highest candidate is below threshold, trigger intentional refrain
  if (highestScore < threshold) {
    return {
      topCandidates: [],
      highestScore: Number(highestScore.toFixed(4)),
      thresholdApplied: threshold,
      shouldRefrain: true,
      refrainReason: 'BELOW_SIMILARITY_THRESHOLD',
    };
  }

  const topCandidates: SemanticRetrievalCandidate[] = scoredItems
    .slice(0, topK)
    .map((item) => ({
      scenario: item.scenario,
      similarityScore: Number(item.score.toFixed(4)),
    }));

  return {
    topCandidates,
    highestScore: Number(highestScore.toFixed(4)),
    thresholdApplied: threshold,
    shouldRefrain: false,
  };
}

/**
 * Dedicated Semantic Search function:
 * 1. Generates embedding vector for query via geminiService (with local semantic fallback).
 * 2. Compares vector against all 40 Production scenario vectors in cache.
 * 3. Returns sorted top-K matches with similarity score.
 * Strict Rule: Excludes all 'needs_review' scenarios.
 */
export async function searchScenarios(
  query: string,
  topK: number = 3
): Promise<ScenarioResult[]> {
  if (!query || !query.trim()) {
    return [];
  }

  const productionScenarios = getProductionScenarios();
  let queryVector: number[] | null = null;

  try {
    queryVector = await generateEmbedding(query);
  } catch {
    // Local fallback
  }

  const cacheMap = new Map<string, number[]>();
  for (const entry of SCENARIO_EMBEDDINGS_CACHE) {
    if (entry.scenario_id && entry.embedding) {
      cacheMap.set(entry.scenario_id, entry.embedding);
    }
  }

  const scoredItems: ScenarioResult[] = [];

  for (const scenario of productionScenarios) {
    const cachedVec = cacheMap.get(scenario.id);
    const vecScore = (queryVector && cachedVec && queryVector.length === EMBEDDING_DIMENSION)
      ? calculateCosineSimilarity(queryVector, cachedVec)
      : 0;

    const profile = SCENARIO_CONCEPT_PROFILES.find((p) => p.scenario_id === scenario.id || p.numeric_id === scenario.numeric_id);
    const combinedScore = profile ? evaluateCandidateWithArabicNlu(query, profile, vecScore) : vecScore;

    if (combinedScore > 0.15) {
      scoredItems.push({
        id: scenario.id,
        score: Number(combinedScore.toFixed(4)),
        scenario,
      });
    }
  }

  scoredItems.sort((a, b) => b.score - a.score);
  return scoredItems.slice(0, topK);
}

/**
 * Complete End-to-End Semantic Scenario Retrieval with Thresholding and Refrain logic.
 */
export async function retrieveTopScenarios(
  query: string,
  config?: SemanticRetrievalConfig
): Promise<SemanticRetrievalResult> {
  const threshold = config?.similarityThreshold ?? DEFAULT_SIMILARITY_THRESHOLD;
  const topK = config?.topK ?? DEFAULT_TOP_K;

  if (!query || typeof query !== 'string' || !query.trim()) {
    return {
      topCandidates: [],
      highestScore: 0,
      thresholdApplied: threshold,
      shouldRefrain: true,
      refrainReason: 'EMPTY_QUERY',
    };
  }

  try {
    const queryVector = await generateQueryEmbedding(query, config);
    return searchScenariosByVector(queryVector, config);
  } catch {
    const localRanked = rankScenariosLocally(query, topK);
    const highest = localRanked[0]?.score || 0;

    if (highest < threshold) {
      return {
        topCandidates: [],
        highestScore: highest,
        thresholdApplied: threshold,
        shouldRefrain: true,
        refrainReason: 'BELOW_SIMILARITY_THRESHOLD',
      };
    }

    return {
      topCandidates: localRanked.map((r) => ({
        scenario: r.scenario,
        similarityScore: r.score,
      })),
      highestScore: highest,
      thresholdApplied: threshold,
      shouldRefrain: false,
    };
  }
}
