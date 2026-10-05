import dotenv from 'dotenv';
import { searchScenarios, calculateCosineSimilarity } from '../services/semanticRetrievalService';
import { generateEmbedding } from '../services/geminiService';

dotenv.config();

async function runProof() {
  console.log('--- PHASE 2 SEMANTIC RETRIEVAL PROOF ---');
  const query = 'خايفة تروح علي الصلاة في الطيارة';
  console.log(`Query: "${query}"`);

  const results = await searchScenarios(query, 3);
  console.log(`Retrieved ${results.length} results:`);
  results.forEach((r, idx) => {
    console.log(`[Rank ${idx + 1}] ID: ${r.id} | Score: ${r.score} | Title: ${r.scenario.title_ar}`);
  });

  if (results.length > 0 && results[0].id === 'SCN_011') {
    console.log('✅ PROOF PASSED: SCN_011 (صلاة الفريضة في الطائرة عند تعذر الوقوف) was retrieved as the TOP-1 match!');
  } else {
    console.log('Result top item:', results[0]);
  }
}

runProof().catch(console.error);
