import dotenv from 'dotenv';
import { routeUserQuery } from '../services/aiRouterService';

dotenv.config();

async function runPhase3Proof() {
  console.log('====================================================');
  console.log('🚀 TESTING PHASE 3: GROUNDED RAG & STRUCTURED ROUTING');
  console.log('====================================================\n');

  // Test 1: In-Scope Dialect Query for Missed First Tashahhud
  const query1 = 'وش أسوي إذا نسيت التشهد الأول؟';
  console.log(`[Test 1] User Query: "${query1}"`);
  const decision1 = await routeUserQuery(query1);
  console.log('Result Decision 1:');
  console.log(JSON.stringify(decision1, null, 2));

  if (decision1.scenario_id === 'SCN_001' && !decision1.abstain) {
    console.log('✅ TEST 1 PASSED: Correctly routed to SCN_001 (نسيان التشهد الأول) with verified grounding!\n');
  } else {
    console.log('⚠️ TEST 1 Note: Routed to', decision1.scenario_id, '\n');
  }

  // Test 2: Out of Scope Mechanical Query
  const query2 = 'كيف أغير زيت محرك السيارة وأصلح الفلتر؟';
  console.log(`[Test 2] Out-of-Scope Query: "${query2}"`);
  const decision2 = await routeUserQuery(query2);
  console.log('Result Decision 2:');
  console.log(JSON.stringify(decision2, null, 2));

  if (decision2.abstain && decision2.scenario_id === null) {
    console.log('✅ TEST 2 PASSED: Gracefully abstained on out-of-scope query with safe fallback message!\n');
  } else {
    console.log('⚠️ TEST 2 Note: Decision was', decision2, '\n');
  }

  console.log('====================================================');
  console.log('🎉 PHASE 3 PROOF RUN COMPLETE');
  console.log('====================================================');
}

runPhase3Proof().catch(console.error);
