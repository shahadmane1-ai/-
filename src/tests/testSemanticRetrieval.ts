/**
 * Ground-Truth Semantic Retrieval Benchmark Suite
 * Phase 2 Validation: Vector Retrieval Accuracy, Dialect Robustness, Typo Resilience & Out-of-Scope Refrain Gateway
 */

import dotenv from 'dotenv';
import {
  retrieveTopScenarios,
  DEFAULT_SIMILARITY_THRESHOLD,
  validateEmbeddingsCacheIntegrity,
} from '../services/semanticRetrievalService';

dotenv.config();

export interface BenchmarkTestCase {
  id: string;
  category: 'formal_ar' | 'dialect_ar' | 'typos_and_phonetic' | 'out_of_scope';
  query: string;
  expectedTargetId?: string; // SCN_xxx expected to match
  expectedRefrain: boolean; // TRUE for out-of-scope queries
  description: string;
}

export const BENCHMARK_TEST_SUITE: BenchmarkTestCase[] = [
  // 1. الفصحى (Modern Standard Arabic - In-Scope)
  {
    id: 'TC_001',
    category: 'formal_ar',
    query: 'نسيت التشهد الأول وقمت للركعة الثالثة ماذا يجب علي أن أفعل؟',
    expectedTargetId: 'SCN_001',
    expectedRefrain: false,
    description: 'نسيان التشهد الأول والاستمرار للثالثة',
  },
  {
    id: 'TC_002',
    category: 'formal_ar',
    query: 'شككت في صلاتي هل صليت ثلاث ركعات أم أربع ركعات؟',
    expectedTargetId: 'SCN_002',
    expectedRefrain: false,
    description: 'الشك في عدد الركعات والبناء على اليقين',
  },
  {
    id: 'TC_003',
    category: 'formal_ar',
    query: 'كيف أصلي صلاة الفريضة على متن الطائرة عند عدم القدرة على القيام؟',
    expectedTargetId: 'SCN_011',
    expectedRefrain: false,
    description: 'صلاة الفريضة في الطائرة عند تعذر الوقوف',
  },
  {
    id: 'TC_004',
    category: 'formal_ar',
    query: 'ما هي مدة المسح على الخفين والجوربين للمسافر والمقيم في الوضوء؟',
    expectedTargetId: 'SCN_025',
    expectedRefrain: false,
    description: 'مدة المسح على الخفين والجوربين',
  },
  {
    id: 'TC_005',
    category: 'formal_ar',
    query: 'كيف أتعامل مع والديّ غير المسلمين وأبرهما وأصلهما بعد إسلامي؟',
    expectedTargetId: 'SCN_044',
    expectedRefrain: false,
    description: 'صلة وبر الوالدين غير المسلمين',
  },

  // 2. العامية (Dialectal Arabic - In-Scope)
  {
    id: 'TC_006',
    category: 'dialect_ar',
    query: 'يا جماعة توي قمت للثالثة ونسيت التشهد الاول اسجد قبل ولا بعد السلام؟',
    expectedTargetId: 'SCN_001',
    expectedRefrain: false,
    description: 'لهجة خليجية/سعودية: نسيان التشهد وسجود السهو',
  },
  {
    id: 'TC_007',
    category: 'dialect_ar',
    query: 'أنا بالطيارة والوقت هيخرج ومش عارف أصلي إزاي وأنا قاعد في الكرسي',
    expectedTargetId: 'SCN_011',
    expectedRefrain: false,
    description: 'لهجة مصرية/شامية: صلاة الطائرة أثناء الجلوس',
  },
  {
    id: 'TC_008',
    category: 'dialect_ar',
    query: 'مسحت على شرابي الصبح متى تنتهي مدة المسح حقتي بالدوام؟',
    expectedTargetId: 'SCN_025',
    expectedRefrain: false,
    description: 'لهجة دارجة: المسح على الجوارب والشراب',
  },
  {
    id: 'TC_009',
    category: 'dialect_ar',
    query: 'مديري في الدوام طلب مني احضر عشاء رسمي في مطعم يقدم خمور وش اسوي؟',
    expectedTargetId: 'SCN_019',
    expectedRefrain: false,
    description: 'لهجة خليجية: حضور عشاء عمل في مطعم يقدّم خمور',
  },
  {
    id: 'TC_010',
    category: 'dialect_ar',
    query: 'عندي كلب لمس هدومي وهي ناشفة هل تنجست ولازم أغيرها للصلاة؟',
    expectedTargetId: 'SCN_031',
    expectedRefrain: false,
    description: 'لهجة عامية: ملامسة الكلب الجافة للثياب',
  },

  // 3. أخطاء إملائية وتحوير صوتي (Typos & Phonetic Variations - In-Scope)
  {
    id: 'TC_011',
    category: 'typos_and_phonetic',
    query: 'نسيت السجود وسجدة وحده بالركعه ورجعت تذكرتها بالركعه الثانيه',
    expectedTargetId: 'SCN_004',
    expectedRefrain: false,
    description: 'أخطاء إملائية بالتاء المربوطة والهمزات: نسيان سجدة',
  },
  {
    id: 'TC_012',
    category: 'typos_and_phonetic',
    query: 'صلات الفريظه في الطياره وانا جالس وماقدرت اوقف',
    expectedTargetId: 'SCN_011',
    expectedRefrain: false,
    description: 'أخطاء صوتية إملائية فادحة (صلات/الفريظه/الطياره)',
  },
  {
    id: 'TC_013',
    category: 'typos_and_phonetic',
    query: 'حكم المسح علا الجبيره او الظماطه الطبيه فاليد اثناء الوضوء',
    expectedTargetId: 'SCN_006',
    expectedRefrain: false,
    description: 'أخطاء إملائية (علا/الظماطه): المسح على الجبيرة',
  },
  {
    id: 'TC_014',
    category: 'typos_and_phonetic',
    query: 'وسوسة خنزب وشرود الزهن فالصلاة كل شوي اسها واضيع',
    expectedTargetId: 'SCN_005',
    expectedRefrain: false,
    description: 'تحوير إملائي (الزهن/اسها): وسواس الصلاة وخنزب',
  },

  // 4. أسئلة خارج النطاق (Out-of-Scope - Must Trigger Intentional Refrain)
  {
    id: 'TC_015',
    category: 'out_of_scope',
    query: 'كيف أصلح عطل المكيف في السيارة الديزل وأغير الفلتر ومضخة الوقود؟',
    expectedRefrain: true,
    description: 'سؤال تقني وميكانيكي خارج النطاق (تصليح محركات)',
  },
  {
    id: 'TC_016',
    category: 'out_of_scope',
    query: 'ما هي أفضل استراتيجية لتداول الأسهم والمضاربة اليومية في سوق الفوركس؟',
    expectedRefrain: true,
    description: 'سؤال مالي استثماري بحت خارج النطاق (فوركس وأسهم)',
  },
  {
    id: 'TC_017',
    category: 'out_of_scope',
    query: 'طريقة عمل كعكة الشوكولاتة اللذيذة بالمكسرات والكراميل ودرجة حرارة الفرن',
    expectedRefrain: true,
    description: 'وصفة طهي وحلويات منزلية خارج النطاق',
  },
  {
    id: 'TC_018',
    category: 'out_of_scope',
    query: 'شرح معادلات نظرية النسبية العامة لأينشتاين وسرعة الضوء في الفراغ الكوني',
    expectedRefrain: true,
    description: 'فيزياء كونية ونظرية النسبية خارج النطاق',
  },
  {
    id: 'TC_019',
    category: 'out_of_scope',
    query: 'كتابة كود بايثون لتدريب شبكة عصبية لتمييز صور القطط والكلاب باستخدام PyTorch',
    expectedRefrain: true,
    description: 'برمجة ذكاء اصطناعي وتعلم آلة خارج النطاق',
  },
];

export async function runSemanticRetrievalBenchmark() {
  console.log('='.repeat(80));
  console.log('  RAFEEQ AI — PHASE 2 SEMANTIC RETRIEVAL BENCHMARK SUITE');
  console.log('='.repeat(80));

  // Check cache integrity first
  const cacheStatus = validateEmbeddingsCacheIntegrity();
  console.log(`[Cache Verification] Valid: ${cacheStatus.isValid} | Cached: ${cacheStatus.totalCached} / 40 Production Scenarios`);
  if (!cacheStatus.isValid) {
    throw new Error(`Cache integrity failure: ${JSON.stringify(cacheStatus.mismatchedIds)}`);
  }
  console.log(`[Config] Similarity Threshold Gate: ${DEFAULT_SIMILARITY_THRESHOLD}`);
  console.log(`[Test Cases] Running ${BENCHMARK_TEST_SUITE.length} ground-truth evaluation queries...\n`);

  let passedTests = 0;
  let inScopePassed = 0;
  let inScopeTotal = 0;
  let outOfScopePassed = 0;
  let outOfScopeTotal = 0;

  const resultsTable: any[] = [];

  for (let i = 0; i < BENCHMARK_TEST_SUITE.length; i++) {
    const tc = BENCHMARK_TEST_SUITE[i];
    const startTime = Date.now();
    const result = await retrieveTopScenarios(tc.query, {
      similarityThreshold: DEFAULT_SIMILARITY_THRESHOLD,
      topK: 3,
    });
    const durationMs = Date.now() - startTime;

    let isSuccess = false;
    let details = '';

    if (tc.expectedRefrain) {
      outOfScopeTotal++;
      // Out of scope test: shouldRefrain must be true
      if (result.shouldRefrain && result.topCandidates.length === 0) {
        isSuccess = true;
        outOfScopePassed++;
        details = `REFRAIN SUCCESS (Score: ${result.highestScore} < ${DEFAULT_SIMILARITY_THRESHOLD})`;
      } else {
        isSuccess = false;
        details = `FALSE POSITIVE (Top: ${result.topCandidates[0]?.scenario.id} with ${result.highestScore})`;
      }
    } else {
      inScopeTotal++;
      // In scope test: shouldRefrain must be false AND top match must be expectedTargetId
      const topMatch = result.topCandidates[0];
      const matchInTop3 = result.topCandidates.some((c) => c.scenario.id === tc.expectedTargetId);

      if (!result.shouldRefrain && topMatch && topMatch.scenario.id === tc.expectedTargetId) {
        isSuccess = true;
        inScopePassed++;
        details = `EXACT TOP-1 (${topMatch.scenario.id} Score: ${topMatch.similarityScore})`;
      } else if (!result.shouldRefrain && matchInTop3) {
        isSuccess = true;
        inScopePassed++;
        details = `TOP-3 MATCH (Found in candidates, Top-1 was ${topMatch?.scenario.id})`;
      } else {
        isSuccess = false;
        details = result.shouldRefrain
          ? `FALSE REFRAIN (Score: ${result.highestScore})`
          : `WRONG MATCH (Got ${topMatch?.scenario.id}, expected ${tc.expectedTargetId})`;
      }
    }

    if (isSuccess) passedTests++;

    resultsTable.push({
      ID: tc.id,
      Category: tc.category,
      Status: isSuccess ? '✅ PASS' : '❌ FAIL',
      Query: tc.query.length > 40 ? tc.query.slice(0, 37) + '...' : tc.query,
      Expected: tc.expectedRefrain ? 'REFRAIN' : tc.expectedTargetId,
      Result: details,
      Latency: `${durationMs}ms`,
    });

    console.log(
      `[${tc.id}] ${isSuccess ? '✅ PASS' : '❌ FAIL'} | ${tc.category.padEnd(18)} | ` +
      `Exp: ${(tc.expectedRefrain ? 'REFRAIN' : tc.expectedTargetId || '').padEnd(8)} | ` +
      `${details} (${durationMs}ms)`
    );
  }

  console.log('\n' + '='.repeat(80));
  console.log('  BENCHMARK SUMMARY & METRICS');
  console.log('='.repeat(80));
  console.log(`Total Test Queries:           ${BENCHMARK_TEST_SUITE.length}`);
  console.log(`Overall Benchmark Pass Rate:   ${passedTests} / ${BENCHMARK_TEST_SUITE.length} (${((passedTests / BENCHMARK_TEST_SUITE.length) * 100).toFixed(1)}%)`);
  console.log(`In-Scope Retrieval Accuracy:  ${inScopePassed} / ${inScopeTotal} (${((inScopePassed / inScopeTotal) * 100).toFixed(1)}%)`);
  console.log(`Out-of-Scope Refrain Rate:    ${outOfScopePassed} / ${outOfScopeTotal} (${((outOfScopePassed / outOfScopeTotal) * 100).toFixed(1)}%)`);
  console.log('='.repeat(80) + '\n');

  return {
    total: BENCHMARK_TEST_SUITE.length,
    passed: passedTests,
    passRate: Number(((passedTests / BENCHMARK_TEST_SUITE.length) * 100).toFixed(1)),
    inScopeAccuracy: Number(((inScopePassed / inScopeTotal) * 100).toFixed(1)),
    refrainRate: Number(((outOfScopePassed / outOfScopeTotal) * 100).toFixed(1)),
    results: resultsTable,
  };
}

// Direct execution CLI runner
if (process.argv[1]?.endsWith('testSemanticRetrieval.ts')) {
  runSemanticRetrievalBenchmark().catch((err) => {
    console.error('Benchmark execution failed:', err);
    process.exit(1);
  });
}
