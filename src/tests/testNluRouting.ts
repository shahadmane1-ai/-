/**
 * Phase 3 Verification Test Suite: Structured NLU Routing & Deterministic Grounded Binding
 * Tests:
 * 1. Normal In-Scope Query (SCN_001 selection & verbatim evidence loading)
 * 2. Confusing / Boundary Query (Reasoning between close candidates)
 * 3. Out-of-Scope Query (Deterministic zero-LLM fallback & referral)
 * 4. Tampering & Zero-Hallucination Guard (Intercepting unauthorized/mocked IDs)
 * 5. Full End-to-End Pipeline Verification
 */

import dotenv from 'dotenv';
import {
  routeUserInquiry,
  validateAndSanitizeNluRouting,
  DETERMINISTIC_REFRAIN_OUTPUT,
} from '../services/nluRouterService';
import {
  bindGroundedScenarioResponse,
  executeGroundedInquiryPipeline,
} from '../services/groundedResponseService';
import { retrieveTopScenarios } from '../services/semanticRetrievalService';
import { getScenarioById } from '../services/scenarioVault';
import { ScoredScenarioMatch } from '../types/routingTypes';

dotenv.config();

export async function runNluRoutingTestSuite() {
  console.log('='.repeat(80));
  console.log('  RAFEEQ AI — PHASE 3 STRUCTURED NLU ROUTING & GROUNDED BINDING TEST SUITE');
  console.log('='.repeat(80));

  let totalTests = 0;
  let passedTests = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`✅ [PASS] ${testName}`);
    } else {
      console.error(`❌ [FAIL] ${testName}${details ? ` -> ${details}` : ''}`);
    }
  }

  // =========================================================================
  // TEST 1: Normal In-Scope Query (Forgetting First Tashahhud)
  // =========================================================================
  console.log('\n--- TEST 1: Normal In-Scope Query (SCN_001) ---');
  try {
    const query = 'نسيت التشهد الأول وقمت للركعة الثالثة ماذا أفعل؟';
    const retrieval = await retrieveTopScenarios(query);
    assert(retrieval.topCandidates.length > 0, 'Retrieval returned candidates for in-scope query');

    const routing = await routeUserInquiry(query, retrieval.topCandidates);
    assert(routing.selected_scenario_id === 'SCN_001', 'NLU correctly selected SCN_001', `Got: ${routing.selected_scenario_id}`);
    assert(routing.fallback_triggered === false, 'Fallback was NOT triggered for valid scenario');
    assert(routing.confidence_score >= 0.7, 'Model confidence score is high (>= 0.7)', `Confidence: ${routing.confidence_score}`);

    const grounded = bindGroundedScenarioResponse(routing);
    assert(grounded.status === 'RESOLVED', 'Grounded status is RESOLVED');
    assert(grounded.scenario_id === 'SCN_001', 'Grounded scenario_id matches SCN_001');
    assert(grounded.approved_sources.length > 0, 'Approved sources attached deterministically');
    assert(
      typeof grounded.verbatim_evidence_text === 'string' && grounded.verbatim_evidence_text.includes('السهو'),
      'Verbatim evidence text loaded from approved source without modification'
    );
  } catch (err: any) {
    assert(false, 'TEST 1 threw unexpected error', err.message);
  }

  // =========================================================================
  // TEST 2: Confusing / Boundary Query (Reasoning Between Close Candidates)
  // =========================================================================
  console.log('\n--- TEST 2: Confusing Boundary Query (SCN_002 vs SCN_001 & SCN_004) ---');
  try {
    const query = 'شككت في صلاتي هل صليت ركعتين أم ثلاث ركعات في صلاة العصر';
    const candidateScenarios = [
      getScenarioById('SCN_002')!, // الشك في عدد الركعات
      getScenarioById('SCN_001')!, // نسيان التشهد الأول
      getScenarioById('SCN_004')!, // نسيان سجدة أو ركوع
    ].filter(Boolean);

    const mockCandidates: ScoredScenarioMatch[] = [
      { scenario: candidateScenarios[0], similarityScore: 0.88 },
      { scenario: candidateScenarios[1], similarityScore: 0.82 },
      { scenario: candidateScenarios[2], similarityScore: 0.81 },
    ];

    const routing = await routeUserInquiry(query, mockCandidates);
    assert(
      routing.selected_scenario_id === 'SCN_002',
      'NLU reasoned accurately between candidates and chose SCN_002 (Doubt in Rak\'ah count)',
      `Selected: ${routing.selected_scenario_id}`
    );
    assert(routing.fallback_triggered === false, 'Fallback was not triggered for valid boundary match');

    const grounded = bindGroundedScenarioResponse(routing);
    assert(grounded.status === 'RESOLVED', 'Boundary scenario grounded successfully');
    assert(grounded.verbatim_evidence_text !== null, 'Evidence text present for SCN_002');
  } catch (err: any) {
    assert(false, 'TEST 2 threw unexpected error', err.message);
  }

  // =========================================================================
  // TEST 3: Out-of-Scope Query (Deterministic Fallback with Zero LLM Call)
  // =========================================================================
  console.log('\n--- TEST 3: Out-of-Scope Query (Deterministic Fallback) ---');
  try {
    const query = 'كيف أصلح عطل المكيف في السيارة الديزل وأغير الفلتر؟';
    const retrieval = await retrieveTopScenarios(query);
    assert(retrieval.shouldRefrain === true, 'Retrieval refrained due to low similarity threshold');
    assert(retrieval.topCandidates.length === 0, 'Retrieval returned empty candidate list');

    // Passing empty candidates directly invokes deterministic fast path
    const routing = await routeUserInquiry(query, retrieval.topCandidates);
    assert(routing.selected_scenario_id === null, 'Selected scenario ID is strictly null');
    assert(routing.fallback_triggered === true, 'Fallback triggered is true');
    assert(
      routing.extracted_intent === DETERMINISTIC_REFRAIN_OUTPUT.extracted_intent,
      'Extracted intent indicates out_of_scope_or_low_similarity'
    );

    const grounded = bindGroundedScenarioResponse(routing);
    assert(
      grounded.status === 'REFRAINED' || grounded.status === 'HUMAN_REFERRAL_REQUIRED',
      'Grounded status triggers REFRAINED or HUMAN_REFERRAL_REQUIRED'
    );
    assert(grounded.scenario_id === null, 'Grounded scenario_id is null');
    assert(grounded.verbatim_evidence_text === null, 'No religious evidence hallucinated');
    assert(
      typeof grounded.fallback_message_ar === 'string' && grounded.fallback_message_ar.includes('منصات الإفتاء الرسمية'),
      'Compassionate official referral guidance provided'
    );
  } catch (err: any) {
    assert(false, 'TEST 3 threw unexpected error', err.message);
  }

  // =========================================================================
  // TEST 4: Tampering & Zero-Hallucination Post-Validation Guard
  // =========================================================================
  console.log('\n--- TEST 4: Tampering & Zero-Hallucination Guard Interception ---');
  try {
    const allowedIds = ['SCN_001', 'SCN_002'];

    // Subtest 4.1: Model invents a non-existent ID
    const hallucinatedMockOutput = {
      selected_scenario_id: 'SCN_999_HALLUCINATED',
      extracted_intent: 'invented_ruling',
      confidence_score: 0.99,
      fallback_triggered: false,
      routing_rationale_ar: 'اخترت حكماً غير موجود',
    };
    const sanitized1 = validateAndSanitizeNluRouting(hallucinatedMockOutput, allowedIds);
    assert(
      sanitized1.selected_scenario_id === null,
      'Guard intercepted hallucinated SCN_999 and reset to null'
    );
    assert(
      sanitized1.fallback_triggered === true,
      'Guard forced fallback_triggered to true when unauthorized ID was intercepted'
    );

    // Subtest 4.2: Model selects an ID not in candidate pool (e.g. SCN_050 when only SCN_001, SCN_002 provided)
    const outOfPoolMockOutput = {
      selected_scenario_id: 'SCN_050',
      extracted_intent: 'prayer_concession',
      confidence_score: 0.85,
      fallback_triggered: false,
      routing_rationale_ar: 'توجيه لسيناريو غير متاح في قائمة المرشحين',
    };
    const sanitized2 = validateAndSanitizeNluRouting(outOfPoolMockOutput, allowedIds);
    assert(
      sanitized2.selected_scenario_id === null,
      'Guard intercepted out-of-candidate-pool ID (SCN_050) and reset to null'
    );
    assert(sanitized2.fallback_triggered === true, 'Fallback set to true for out-of-pool candidate');

    // Subtest 4.3: Contradictory output (fallback_triggered: true but scenario ID non-null)
    const contradictoryMockOutput = {
      selected_scenario_id: 'SCN_001',
      extracted_intent: 'ambiguous_query',
      confidence_score: 0.3,
      fallback_triggered: true,
      routing_rationale_ar: 'موقف غير مؤكد',
    };
    const sanitized3 = validateAndSanitizeNluRouting(contradictoryMockOutput, allowedIds);
    assert(
      sanitized3.selected_scenario_id === null,
      'Guard cleared scenario ID when fallback_triggered was true'
    );

    // Subtest 4.4: Grounding guard with invalid ID
    const groundedTampered = bindGroundedScenarioResponse({
      selected_scenario_id: 'SCN_INVALID_404',
      extracted_intent: 'test',
      confidence_score: 0.9,
      fallback_triggered: false,
      routing_rationale_ar: 'test',
    });
    assert(
      groundedTampered.status === 'HUMAN_REFERRAL_REQUIRED' && groundedTampered.scenario_id === null,
      'Binder securely refused unresolved scenario ID and redirected to referral'
    );
  } catch (err: any) {
    assert(false, 'TEST 4 threw unexpected error', err.message);
  }

  // =========================================================================
  // TEST 5: Full End-to-End Pipeline Execution
  // =========================================================================
  console.log('\n--- TEST 5: Full End-to-End Pipeline Execution ---');
  try {
    const query = 'ما هي رخصة المسح على الخفين والشراب للمسافر وكم مدتها الشرعية؟';
    const pipelineResponse = await executeGroundedInquiryPipeline(query);

    assert(pipelineResponse.status === 'RESOLVED', 'Pipeline resolved query end-to-end');
    assert(pipelineResponse.scenario_id === 'SCN_025', 'Pipeline routed to SCN_025 (المسح على الخفين)');
    assert(
      typeof pipelineResponse.scenario_title_ar === 'string' && pipelineResponse.scenario_title_ar.includes('المسح على الخفين'),
      'Arabic scenario title populated from vault'
    );
    assert(
      pipelineResponse.approved_sources.some((s) => s.registry_source_id === 'dorar_hadith'),
      'Authentic Hadith source from Dorar Al-Sunnah bound deterministically'
    );
    assert(
      typeof pipelineResponse.verbatim_evidence_text === 'string' &&
        pipelineResponse.verbatim_evidence_text.includes('ثلاثة أيام ولياليهن'),
      'Verbatim authentic Prophetic tradition correctly extracted'
    );
  } catch (err: any) {
    assert(false, 'TEST 5 threw unexpected error', err.message);
  }

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log('\n' + '='.repeat(80));
  console.log('  TEST SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Assertions: ${totalTests}`);
  console.log(`Passed:           ${passedTests}`);
  console.log(`Failed:           ${totalTests - passedTests}`);
  console.log(`Success Rate:     ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  console.log('='.repeat(80) + '\n');

  if (passedTests !== totalTests) {
    throw new Error(`Test suite failed: ${totalTests - passedTests} assertions failed.`);
  }

  return { totalTests, passedTests };
}

// CLI runner
if (process.argv[1]?.endsWith('testNluRouting.ts')) {
  runNluRoutingTestSuite().catch((err) => {
    console.error('Test suite failed:', err);
    process.exit(1);
  });
}
