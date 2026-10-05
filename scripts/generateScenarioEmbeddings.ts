/**
 * Script to precompute static embeddings for the 40 active production scenarios.
 * Uses Gemini Embeddings API (gemini-embedding-2-preview with outputDimensionality: 768).
 * Strictly filters out all 20 inactive scenarios.
 */
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { getProductionScenarios } from '../src/services/scenarioVault';
import { ScenarioKnowledgeItem, ScenarioEmbeddingEntry } from '../src/types/scenarioKnowledge';

dotenv.config();

export function buildScenarioSearchableRepresentation(scenario: ScenarioKnowledgeItem): string {
  return [
    `العنوان: ${scenario.title_ar} (${scenario.title_en})`,
    `الموضوع: ${scenario.topic}`,
    `النية: ${scenario.unique_user_intent}`,
    `السياق: ${scenario.contexts.join(', ')}`,
    `الكلمات المفتاحية: ${scenario.keywords_ar.join(', ')} | ${scenario.keywords_en.join(', ')}`,
  ].join('\n');
}

async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const productionScenarios = getProductionScenarios();
  console.log(`Starting precomputed embeddings generation for ${productionScenarios.length} active scenarios...`);

  if (productionScenarios.length !== 40) {
    throw new Error(`Expected exactly 40 active scenarios, but got ${productionScenarios.length}`);
  }

  const cacheEntries: ScenarioEmbeddingEntry[] = [];

  for (let i = 0; i < productionScenarios.length; i++) {
    const scenario = productionScenarios[i];
    if (!scenario.is_active || scenario.source_status !== 'SOURCE_VALIDATED') {
      throw new Error(`Policy violation: Non-validated scenario ${scenario.id} detected in production pool!`);
    }

    const searchable_representation = buildScenarioSearchableRepresentation(scenario);

    // Call Gemini Embeddings API
    let values: number[] | undefined;
    for (const model of ['gemini-embedding-2-preview', 'gemini-embedding-001']) {
      try {
        const response = await ai.models.embedContent({
          model,
          contents: searchable_representation,
          config: { outputDimensionality: 768 },
        });
        values = response.embeddings?.[0]?.values;
        if (values && values.length === 768) {
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} failed for ${scenario.id}: ${err.message}. Retrying fallback...`);
      }
    }

    if (!values || values.length !== 768) {
      throw new Error(`Failed to generate 768-dim embedding for scenario ${scenario.id}`);
    }

    cacheEntries.push({
      scenario_id: scenario.id,
      searchable_representation,
      embedding: values,
    });

    console.log(`[${i + 1}/40] Successfully embedded ${scenario.id} (${scenario.title_ar})`);
    // Brief 50ms pause to respect rate limits
    await new Promise((r) => setTimeout(r, 60));
  }

  const outputPath = path.resolve(process.cwd(), 'src/data/scenarioEmbeddingsCache.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(cacheEntries, null, 2), 'utf-8');

  console.log(`\nDONE! Saved ${cacheEntries.length} precomputed embeddings to ${outputPath}`);
}

run().catch((err) => {
  console.error('Fatal error during scenario embeddings generation:', err);
  process.exit(1);
});
