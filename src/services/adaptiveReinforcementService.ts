/**
 * Adaptive Reinforcement Router
 * Phase 4 Architecture: Deterministic Graph-Based Next-Best-Action Recommendation
 * Strictly guarantees recommendations come from the pre-validated 40-scenario production vault.
 */

import { AdaptiveRecommendation } from '../types/scenarioKnowledge';
import { getLearningState } from './learningStateManager';
import { getProductionScenarios, getScenarioById } from './scenarioVault';

/**
 * Returns a deterministic adaptive recommendation grounded in the user's verified learning state.
 */
export function getAdaptiveRecommendation(): AdaptiveRecommendation | null {
  const state = getLearningState();
  const productionVault = getProductionScenarios();
  const completedSet = new Set(state.completed_scenarios);

  // 1. Primary Strategy: Address immediate items in needs_reinforcement
  if (state.needs_reinforcement && state.needs_reinforcement.length > 0) {
    for (const item of state.needs_reinforcement) {
      // Case A: The item is a scenario ID (e.g., SCN_001)
      if (item.startsWith('SCN_')) {
        const sourceScenario = getScenarioById(item);
        if (sourceScenario && sourceScenario.is_active) {
          // Check related scenarios in graph
          const relatedIds = sourceScenario.related_scenarios || [];
          for (const relId of relatedIds) {
            const relScenario = getScenarioById(relId);
            if (relScenario && relScenario.is_active && !completedSet.has(relScenario.id)) {
              return {
                target_scenario_id: relScenario.id,
                target_title_ar: relScenario.title_ar,
                reason_ar: `بناءً على تدربك على "${sourceScenario.title_ar}"، نوصي بتطبيق هذا الموقف المرتبط لترسيخ الفهم العملي.`,
                related_city_experience: relScenario.related_city_experience,
              };
            }
          }

          // If all related are completed or none exist, recommend the source scenario itself for practice
          return {
            target_scenario_id: sourceScenario.id,
            target_title_ar: sourceScenario.title_ar,
            reason_ar: `يُوصى بإعادة تطبيق هذا الموقف العملي لتثبيت خطواته وإتقان أحكامه.`,
            related_city_experience: sourceScenario.related_city_experience,
          };
        }
      }

      // Case B: The item is a concept tag
      const matchedByConcept = productionVault.find((scen) =>
        scen.learning_criteria?.required_concepts?.includes(item)
      );

      if (matchedByConcept) {
        return {
          target_scenario_id: matchedByConcept.id,
          target_title_ar: matchedByConcept.title_ar,
          reason_ar: `لترسيخ مفهوم "${item}"، نقترح خوض هذا الموقف التعليمي في المدينة.`,
          related_city_experience: matchedByConcept.related_city_experience,
        };
      }
    }
  }

  // 2. Secondary Strategy: Address topics with accumulated mistakes
  const sortedMistakes = Object.entries(state.mistakes_by_topic || {}).sort((a, b) => b[1] - a[1]);
  for (const [topic, count] of sortedMistakes) {
    if (count > 0) {
      const topicScenario = productionVault.find(
        (scen) => scen.topic === topic && !completedSet.has(scen.id)
      );

      if (topicScenario) {
        return {
          target_scenario_id: topicScenario.id,
          target_title_ar: topicScenario.title_ar,
          reason_ar: `لتعزيز إتقان مهارات هذا المجال العملي، يُنصح بتجربة هذا الموقف التطبيقي.`,
          related_city_experience: topicScenario.related_city_experience,
        };
      }
    }
  }

  // 3. Tertiary Strategy: Recommend next uncompleted production scenario in progression order
  const nextUncompleted = productionVault.find((scen) => !completedSet.has(scen.id));
  if (nextUncompleted) {
    return {
      target_scenario_id: nextUncompleted.id,
      target_title_ar: nextUncompleted.title_ar,
      reason_ar: `الموقف المقترح التالي لمواصلة رحلتك التعليمية في المدينة التفاعلية.`,
      related_city_experience: nextUncompleted.related_city_experience,
    };
  }

  // All 40 production scenarios completed
  return null;
}
