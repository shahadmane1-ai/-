/**
 * Objective Reasoning Evaluator Service
 * Phase 4 Architecture: Strict Concept Verification, Response Schema Enforcement & Policy Guard
 * Strictly forbids moralizing, faith scoring, sentiment diagnostics, or psychological judgment.
 */

import { GoogleGenAI, Type } from '@google/genai';
import { ConceptEvaluationResult } from '../types/scenarioKnowledge';
import { getScenarioById } from './scenarioVault';
import {
  recordScenarioAttempt,
  addReinforcementNeed,
  clearReinforcementNeed,
} from './learningStateManager';

export const EVALUATION_MODEL = 'gemini-3.5-flash-lite';

/**
 * Strict JSON schema for Gemini responseSchema enforcement during concept evaluation.
 */
export const CONCEPT_EVALUATION_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    scenario_id: {
      type: Type.STRING,
      description: 'The exact scenario ID being evaluated (e.g., SCN_001).',
    },
    passed: {
      type: Type.BOOLEAN,
      description: 'True if all required concepts were adequately explained and understood, false otherwise.',
    },
    concepts_understood: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Subset of required concepts that were correctly identified or explained in user input.',
    },
    missing_concepts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Subset of required concepts that were missed, misunderstood, or omitted.',
    },
    evaluation_feedback_ar: {
      type: Type.STRING,
      description: 'Objective, educational Arabic feedback focusing strictly on the practical concepts without any moral or faith judgment.',
    },
  },
  required: [
    'scenario_id',
    'passed',
    'concepts_understood',
    'missing_concepts',
    'evaluation_feedback_ar',
  ],
};

/**
 * Normalizes Arabic text for flexible root and stem comparison.
 */
function normalizeArabicText(text: string): string {
  return text
    .replace(/[\u064B-\u0652\u0670\u0640]/g, '') // Tashkeel and Tatweel
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[^\u0621-\u064A\w\s]/g, ' ')
    .toLowerCase()
    .trim();
}

/**
 * Extracts normalized tokens and stems from Arabic text.
 */
function extractStemmedTokens(text: string): string[] {
  const normalized = normalizeArabicText(text);
  const words = normalized.split(/\s+/).filter((w) => w.length > 1);

  const stems: string[] = [];
  for (const word of words) {
    stems.push(word);

    // Strip common prefixes: ال، و، ف، ب، ل، ك
    let stripped = word;
    if (stripped.startsWith('ال') && stripped.length > 3) {
      stripped = stripped.slice(2);
      stems.push(stripped);
    }
    if ((stripped.startsWith('و') || stripped.startsWith('ف') || stripped.startsWith('ب') || stripped.startsWith('ل') || stripped.startsWith('ك')) && stripped.length > 3) {
      stems.push(stripped.slice(1));
    }
  }

  return Array.from(new Set(stems));
}

/**
 * Semantic synonym mapping for common ritual terms.
 */
const SYNONYM_MAP: Record<string, string[]> = {
  استمرار: ['واصل', 'مواصله', 'اكمل', 'اكمال', 'استمر'],
  واصل: ['استمر', 'استمرار', 'اكمل'],
  سجدتا: ['سجدتي', 'سجود', 'سجدتان', 'سجدتين'],
  سجدتي: ['سجدتا', 'سجود', 'سجدتان', 'سجدتين'],
  سهو: ['السهو', 'نسيان', 'ساهي'],
  يقين: ['الاقل', 'اليقين', 'اقل', 'متاكد'],
  ثالثه: ['الثالثه', 'ركعه', 'ثلاث', 'الركعه'],
};

/**
 * Deterministic local concept matcher for offline fallback or test execution.
 */
export function evaluateConceptsLocally(
  scenarioId: string,
  userText: string,
  requiredConcepts: string[]
): ConceptEvaluationResult {
  const userStems = extractStemmedTokens(userText);
  const normalizedUserText = normalizeArabicText(userText);
  const understood: string[] = [];
  const missing: string[] = [];

  for (const concept of requiredConcepts) {
    const conceptStems = extractStemmedTokens(concept);
    let matchCount = 0;

    for (const cStem of conceptStems) {
      if (cStem.length <= 1) continue;

      // Direct stem match
      if (userStems.includes(cStem) || normalizedUserText.includes(cStem)) {
        matchCount++;
        continue;
      }

      // Check synonym expansion
      const synonyms = SYNONYM_MAP[cStem] || [];
      const hasSynonymMatch = synonyms.some(
        (syn) => userStems.includes(syn) || normalizedUserText.includes(syn)
      );

      if (hasSynonymMatch) {
        matchCount++;
      }
    }

    const ratio = conceptStems.length > 0 ? matchCount / conceptStems.length : 0;

    if (ratio >= 0.33 || matchCount >= 1) {
      understood.push(concept);
    } else {
      missing.push(concept);
    }
  }

  const passed = missing.length === 0 && understood.length === requiredConcepts.length;
  const feedback = passed
    ? 'أحسنت! إجابتك استوفت كافة المفاهيم والخطوات العملية المطلوبة للموقف بدقة.'
    : `استيعاب جزئي: تم استيفاء (${understood.length}/${requiredConcepts.length}) من المفاهيم المطلوبة. يُرجى مراجعة الخطوات المتبقية للتثبيت.`;

  return {
    scenario_id: scenarioId,
    passed,
    concepts_understood: understood,
    missing_concepts: missing,
    evaluation_feedback_ar: feedback,
  };
}

/**
 * Objective Evaluator: Evaluates user's free-text reasoning against pre-validated scenario learning criteria.
 */
export async function evaluateFreeTextExplanation(
  scenarioId: string,
  userText: string
): Promise<ConceptEvaluationResult> {
  const scenario = getScenarioById(scenarioId);

  if (!scenario || !scenario.is_active) {
    throw new Error(`[LearningEvaluator] Scenario ${scenarioId} not found or inactive in production vault.`);
  }

  const requiredConcepts = scenario.learning_criteria?.required_concepts || [];
  const commonMisconceptions = scenario.learning_criteria?.common_misconceptions || [];

  if (!userText || !userText.trim()) {
    const emptyResult: ConceptEvaluationResult = {
      scenario_id: scenario.id,
      passed: false,
      concepts_understood: [],
      missing_concepts: [...requiredConcepts],
      evaluation_feedback_ar: 'لم يتم تقديم شرح للمراجعة. يُرجى كتابة خطواتك العملية بوضوح.',
    };
    recordScenarioAttempt(scenario.id, false, [], scenario.topic);
    for (const c of requiredConcepts) {
      addReinforcementNeed(c);
    }
    return emptyResult;
  }

  const apiKey =
    (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '') ||
    (typeof window !== 'undefined' ? (window as unknown as { __GEMINI_API_KEY__?: string }).__GEMINI_API_KEY__ : '') ||
    '';

  let rawResult: ConceptEvaluationResult;

  if (!apiKey) {
    rawResult = evaluateConceptsLocally(scenario.id, userText, requiredConcepts);
  } else {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
            'X-Goog-Api-Client': 'aistudio-build',
          },
        },
      });

      const systemInstruction = `
You are an objective, pedagogically grounded evaluation engine for practical scenario training.
Your ONLY mission is to check whether the user's free-text explanation contains the required practical concepts.

CRITICAL POLICY RESTRICTIONS:
1. You are strictly FORBIDDEN from evaluating, judging, or scoring the user's faith, piety, religiosity, morality, or psychological state.
2. Provide feedback strictly on the practical and structural steps outlined in the concepts.
3. You must select concepts_understood and missing_concepts ONLY from the exact list of REQUIRED CONCEPTS provided.
4. Do NOT invent new concept names.
5. If the user successfully articulates all required concepts, passed must be true.
6. Feedback must be in gentle, professional, educational Arabic (فصحى ميسرة).
`;

      const promptPayload = `
SCENARIO ID: ${scenario.id}
SCENARIO TITLE: ${scenario.title_ar}
LEARNING OBJECTIVE: ${scenario.learning_objective_ar}

REQUIRED CONCEPTS (Strict Whitelist):
${JSON.stringify(requiredConcepts, null, 2)}

COMMON MISCONCEPTIONS TO WATCH FOR:
${JSON.stringify(commonMisconceptions, null, 2)}

USER FREE-TEXT EXPLANATION:
"""${userText.trim()}"""

Evaluate whether the user understood the required concepts. Return the strict JSON object.
`;

      const response = await ai.models.generateContent({
        model: EVALUATION_MODEL,
        contents: promptPayload,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: CONCEPT_EVALUATION_RESPONSE_SCHEMA,
          temperature: 0.1,
        },
      });

      const responseText = response.text?.trim() || '{}';
      rawResult = JSON.parse(responseText) as ConceptEvaluationResult;
    } catch (err) {
      console.warn('[LearningEvaluator] LLM evaluation error, falling back to local evaluation:', err);
      rawResult = evaluateConceptsLocally(scenario.id, userText, requiredConcepts);
    }
  }

  // --- DETERMINISTIC POST-VALIDATION GUARD (Zero-Hallucination Concept Whitelist) ---
  const validUnderstood = (rawResult.concepts_understood || []).filter((c) =>
    requiredConcepts.includes(c)
  );

  const missingConcepts = requiredConcepts.filter((c) => !validUnderstood.includes(c));
  const isPassed = missingConcepts.length === 0 && validUnderstood.length === requiredConcepts.length;

  const validatedResult: ConceptEvaluationResult = {
    scenario_id: scenario.id,
    passed: isPassed,
    concepts_understood: validUnderstood,
    missing_concepts: missingConcepts,
    evaluation_feedback_ar:
      rawResult.evaluation_feedback_ar?.trim() ||
      (isPassed
        ? 'تم استيعاب جميع المفاهيم والخطوات العملية بنجاح.'
        : 'يرجى مراجعة المفاهيم المتبقية لضبط الموقف العملي.'),
  };

  // --- AUTOMATIC STATE SYNCHRONIZATION ---
  recordScenarioAttempt(scenario.id, isPassed, validUnderstood, scenario.topic);

  if (isPassed) {
    clearReinforcementNeed(scenario.id);
    for (const c of validUnderstood) {
      clearReinforcementNeed(c);
    }
  } else {
    addReinforcementNeed(scenario.id);
    for (const c of missingConcepts) {
      addReinforcementNeed(c);
    }
  }

  return validatedResult;
}
