/**
 * Phase 4 Verification Test Suite:
 * Deterministic Learning State, Objective Evaluation & Adaptive Reinforcement Engine
 *
 * Validates:
 * 1. Policy Guard & Sanitization: Absolute stripping of unauthorized faith/sentiment/mood fields.
 * 2. Deterministic State Progression: Attempts, mistakes by topic, and mastered concepts.
 * 3. Objective Reasoning Evaluator: Concept coverage verification with strict schema & zero hallucination guard.
 * 4. Adaptive Reinforcement Router: Graph-based next-best-action recommendation from the 40-scenario production vault.
 */

import dotenv from 'dotenv';
dotenv.config();

import {
  getLearningState,
  saveLearningState,
  recordScenarioAttempt,
  addReinforcementNeed,
  clearReinforcementNeed,
  resetLearningState,
  sanitizeLearningState,
  FORBIDDEN_STATE_FIELDS,
} from '../services/learningStateManager';
import { evaluateFreeTextExplanation } from '../services/learningEvaluatorService';
import { getAdaptiveRecommendation } from '../services/adaptiveReinforcementService';
import { getProductionScenarios, getScenarioById } from '../services/scenarioVault';

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, suite: string, name: string, details?: string) {
  if (condition) {
    results.push({ suite, name, passed: true, details });
    console.log(`  ✅ [PASS] ${suite} -> ${name}`);
  } else {
    results.push({ suite, name, passed: false, details });
    console.error(`  ❌ [FAIL] ${suite} -> ${name} | ${details || ''}`);
  }
}

async function runTestSuite() {
  console.log('\n================================================================================');
  console.log('🧪 RAFEEQ PHASE 4 VALIDATION: LEARNING STATE, EVALUATION & ADAPTATION ENGINE');
  console.log('================================================================================\n');

  // ---------------------------------------------------------------------------
  // TEST SUITE 1: Policy Guard & Sanitization (Strict Ethical Guard)
  // ---------------------------------------------------------------------------
  console.log('--- TEST SUITE 1: Policy Guard & Ethical Sanitization ---');
  resetLearningState();

  const taintedInput = {
    completed_scenarios: ['SCN_001'],
    attempts: { SCN_001: 2 },
    mistakes_by_topic: { prayer: 1 },
    mastered_concepts: ['سجود السهو قبل السلام'],
    needs_reinforcement: [],
    last_active_timestamp: Date.now(),
    // FORBIDDEN FIELDS INJECTED
    faith_level: 'high',
    piety: 95,
    sentiment: 'positive',
    psychological_state: 'anxious',
    mood: 'peaceful',
    morality_score: 100,
    iman_level: 10,
  };

  const sanitized = sanitizeLearningState(taintedInput);

  let hasForbiddenKey = false;
  for (const forbidden of FORBIDDEN_STATE_FIELDS) {
    if (forbidden in sanitized || (sanitized as any)[forbidden] !== undefined) {
      hasForbiddenKey = true;
      break;
    }
  }

  assert(
    !hasForbiddenKey,
    'PolicyGuard',
    'Forbidden fields (faith_level, piety, mood, etc.) are strictly stripped',
    JSON.stringify(sanitized)
  );

  assert(
    sanitized.completed_scenarios.includes('SCN_001') && sanitized.attempts['SCN_001'] === 2,
    'PolicyGuard',
    'Valid authorized learning fields are preserved intact'
  );

  // ---------------------------------------------------------------------------
  // TEST SUITE 2: Deterministic State Progression & Mastery
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST SUITE 2: Deterministic State Progression ---');
  resetLearningState();

  // Record an initial failed attempt
  const stateAfterFail = recordScenarioAttempt('SCN_002', false, [], 'prayer');
  assert(
    stateAfterFail.attempts['SCN_002'] === 1 &&
      stateAfterFail.mistakes_by_topic['prayer'] === 1 &&
      stateAfterFail.needs_reinforcement.includes('SCN_002'),
    'StateProgression',
    'Failed attempt increments attempts, topic mistakes, and records reinforcement need'
  );

  // Record a passed attempt with concepts
  const stateAfterPass = recordScenarioAttempt(
    'SCN_002',
    true,
    ['البناء على اليقين', 'سجود السهو قبل السلام'],
    'prayer'
  );
  assert(
    stateAfterPass.completed_scenarios.includes('SCN_002') &&
      stateAfterPass.attempts['SCN_002'] === 2 &&
      stateAfterPass.mastered_concepts.includes('البناء على اليقين') &&
      !stateAfterPass.needs_reinforcement.includes('SCN_002'),
    'StateProgression',
    'Passed attempt marks scenario completed, records mastered concepts, and clears reinforcement need'
  );

  // ---------------------------------------------------------------------------
  // TEST SUITE 3: Objective Reasoning Evaluator (Concept Whitelist & No Moralizing)
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST SUITE 3: Objective Reasoning Evaluator ---');
  resetLearningState();

  const scn1 = getScenarioById('SCN_001');
  assert(!!scn1, 'Evaluator', 'SCN_001 exists in production vault');
  const requiredConceptsScn1 = scn1?.learning_criteria?.required_concepts || [];

  // Scenario SCN_001: Forgetting first tashahhud
  const fullExplanation =
    'إذا قمت للركعة الثالثة ونسيت التشهد الأول واستتممت قائماً، فلا أرجع للتشهد بل أواصل صلاتي، ثم أسجد سجدتي السهو قبل السلام لجبر الواجب.';

  const evalResultPass = await evaluateFreeTextExplanation('SCN_001', fullExplanation);

  assert(
    evalResultPass.passed === true,
    'Evaluator',
    'Adequate concept explanation passes evaluation',
    `Understood: ${evalResultPass.concepts_understood.join(', ')}`
  );

  assert(
    evalResultPass.concepts_understood.every((c) => requiredConceptsScn1.includes(c)),
    'Evaluator',
    'Concepts understood strictly constrained to pre-validated scenario whitelist (zero hallucination)'
  );

  // Test Partial / Incomplete Explanation
  const partialExplanation = 'أواصل صلاتي فقط.';
  const evalResultPartial = await evaluateFreeTextExplanation('SCN_001', partialExplanation);

  assert(
    evalResultPartial.passed === false && evalResultPartial.missing_concepts.length > 0,
    'Evaluator',
    'Incomplete explanation flags missing concepts and does not pass',
    `Missing: ${evalResultPartial.missing_concepts.join(', ')}`
  );

  const stateAfterPartial = getLearningState();
  assert(
    stateAfterPartial.needs_reinforcement.length > 0,
    'Evaluator',
    'Missing concepts or scenario ID are automatically synced to needs_reinforcement'
  );

  // ---------------------------------------------------------------------------
  // TEST SUITE 4: Adaptive Reinforcement Router
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST SUITE 4: Adaptive Reinforcement Router ---');
  resetLearningState();

  // Test Case A: When needs_reinforcement contains SCN_001
  addReinforcementNeed('SCN_001');
  const recommendation1 = getAdaptiveRecommendation();

  assert(
    recommendation1 !== null,
    'AdaptiveRouter',
    'Generates adaptive recommendation when reinforcement is needed'
  );

  if (recommendation1) {
    const recommendedScenario = getScenarioById(recommendation1.target_scenario_id);
    assert(
      !!recommendedScenario && recommendedScenario.is_active,
      'AdaptiveRouter',
      `Target scenario ${recommendation1.target_scenario_id} strictly exists in production vault`
    );

    assert(
      recommendation1.target_title_ar.length > 0 && recommendation1.reason_ar.length > 0,
      'AdaptiveRouter',
      'Recommendation includes Arabic title and pedagogical rationale'
    );
  }

  // Test Case B: Clean state with progression
  resetLearningState();
  const prodScenarios = getProductionScenarios();
  const recommendationInitial = getAdaptiveRecommendation();

  assert(
    recommendationInitial !== null &&
      recommendationInitial.target_scenario_id === prodScenarios[0].id,
    'AdaptiveRouter',
    'Recommends first uncompleted scenario for new user in progression order'
  );

  // ---------------------------------------------------------------------------
  // SUMMARY REPORT
  // ---------------------------------------------------------------------------
  console.log('\n================================================================================');
  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;
  const passRate = ((passedCount / totalCount) * 100).toFixed(1);

  console.log(`📊 PHASE 4 TEST SUMMARY: ${passedCount}/${totalCount} tests passed (${passRate}%)`);
  console.log('================================================================================\n');

  if (passedCount < totalCount) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Test suite failed with unexpected error:', err);
  process.exit(1);
});
