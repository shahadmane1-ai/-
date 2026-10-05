/**
 * AI Behavioral Evaluation Service (Phase 5 Architecture)
 * Strict Gemini-powered behavioral & pedagogical mastery evaluator via direct REST fetch.
 * Strictly forbids faith scores, piety levels, or psychological analysis.
 */

import { getScenarioById } from './scenarioVault';
import { UserLearningState } from '../types/scenarioKnowledge';
import {
  getLearningState,
  saveLearningState,
  recordScenarioAttempt,
} from './learningStateManager';
import { generateContentDirect } from './geminiService';

export interface EvaluationDecision {
  mastered: boolean; // TRUE if the user met the scenario's learning_objectives
  feedback: string; // Brief, encouraging behavioral feedback
  reinforcement_concept: string | null; // The exact concept to reinforce if failed (e.g., "أحكام سجود السهو"), or null if mastered.
}

export const AI_EVALUATION_MODEL = 'gemini-3.8-flash';

/**
 * Evaluates user's action/choice in an interactive scenario against its canonical learning objectives.
 */
export async function evaluateBehavioralCompletion(
  scenarioId: string,
  userActions: {
    actionTaken?: string;
    choicesSelected?: string[];
    isCorrectAction?: boolean;
    explanation?: string;
  }
): Promise<EvaluationDecision> {
  const scenario = getScenarioById(scenarioId);
  const targetConcept =
    scenario?.learning_criteria?.required_concepts?.[0] ||
    scenario?.learning_objective_ar ||
    scenario?.title_ar ||
    'المفهوم الشرعي المستهدف';

  const defaultObjectives = scenario?.learning_objective_ar || 'تطبيق الحكم الشرعي السليم بالسكينة والوقار';

  // Fast-path evaluation if explicit correctness flag is provided
  if (userActions.isCorrectAction === true) {
    return {
      mastered: true,
      feedback: `أحسنت! تم تطبيق مقتضى ${scenario?.title_ar || 'الموقف'} بنجاح واكتساب المفهوم الشرعي المعتمد.`,
      reinforcement_concept: null,
    };
  }

  try {
    const systemInstruction = `You are Rafeeq AI Evaluator. Evaluate the user's action against the scenario's learning_objectives.
Output strictly behavioral/knowledge mastery.
DO NOT output faith scores, piety levels, or psychological analysis.
Return strictly valid JSON:
{
  "mastered": boolean,
  "feedback": string,
  "reinforcement_concept": string | null
}`;

    const prompt = `Scenario Title: ${scenario?.title_ar || scenarioId}
Learning Objectives: ${defaultObjectives}
Required Concepts: ${(scenario?.learning_criteria?.required_concepts || []).join(', ')}

User Action Summary:
- Action Taken: ${userActions.actionTaken || 'تم إنهاء المحاكاة التفاعلية'}
- Choices: ${(userActions.choicesSelected || []).join(' | ')}
- Explanation: ${userActions.explanation || 'لا يوجد'}

Evaluate whether the user demonstrated mastery of this scenario's behavioral/knowledge objectives.`;

    const rawJson = await generateContentDirect({
      prompt,
      systemInstruction,
      model: AI_EVALUATION_MODEL,
      responseMimeType: 'application/json',
    });

    let cleanText = rawJson.trim();
    if (cleanText.startsWith('```json')) cleanText = cleanText.slice(7);
    if (cleanText.startsWith('```')) cleanText = cleanText.slice(3);
    if (cleanText.endsWith('```')) cleanText = cleanText.slice(0, -3);

    const parsed: EvaluationDecision = JSON.parse(cleanText.trim() || '{}');
    return {
      mastered: Boolean(parsed.mastered),
      feedback: parsed.feedback || (parsed.mastered ? 'تم إتمام الموقف بنجاح.' : 'يحتاج هذا المفهوم إلى مراجعة إضافية.'),
      reinforcement_concept: parsed.mastered ? null : (parsed.reinforcement_concept || targetConcept),
    };
  } catch (err) {
    console.warn('[aiEvaluationService:REST] LLM evaluation fallback:', err);
  }

  // Deterministic Fallback
  const passed = userActions.isCorrectAction !== false;
  return {
    mastered: passed,
    feedback: passed
      ? `تم ترسيخ مفهوم «${targetConcept}» وتطبيقه بصورة صحيحة.`
      : `يوصى بإعادة ممارسة مفهوم «${targetConcept}» لتعزيز الاستيعاب العملي.`,
    reinforcement_concept: passed ? null : targetConcept,
  };
}

/**
 * Closes the adaptive loop by updating the learning state and notifying the UI (Adaptive HUD).
 */
export function applyEvaluationToLearningState(
  scenarioId: string,
  evaluation: EvaluationDecision
): UserLearningState {
  const scenario = getScenarioById(scenarioId);
  const concepts = scenario?.learning_criteria?.required_concepts || [scenario?.title_ar || scenarioId];
  const topic = scenario?.topic || 'general';

  let state = getLearningState();

  if (evaluation.mastered) {
    // Record successful attempt & clear from reinforcement queue
    state = recordScenarioAttempt(scenarioId, true, concepts, topic);
  } else {
    // Record failed attempt & add reinforcement concept
    const conceptToReinforce = evaluation.reinforcement_concept || scenario?.title_ar || scenarioId;
    const mistakes = (state.mistakes_by_topic[topic] || 0) + 1;
    const attempts = (state.attempts[scenarioId] || 0) + 1;

    const needsReinforcement = Array.from(
      new Set([conceptToReinforce, ...(state.needs_reinforcement || [])])
    );

    state = {
      ...state,
      attempts: { ...state.attempts, [scenarioId]: attempts },
      mistakes_by_topic: { ...state.mistakes_by_topic, [topic]: mistakes },
      needs_reinforcement: needsReinforcement,
      last_active_timestamp: Date.now(),
    };

    saveLearningState(state);
  }

  // Dispatch custom event to immediately trigger Adaptive HUD re-renders across the app
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('rafic_learning_state_updated', { detail: { scenarioId, evaluation, state } }));
  }

  return state;
}
