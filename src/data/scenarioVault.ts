/**
 * Scenario Knowledge Vault (Phase 1 Reconciled Vault)
 * Strict 40/20 Partition: Exactly 40 production-validated scenarios & 20 needs-review placeholders.
 */

import { ScenarioKnowledgeItem } from '../types/scenarioKnowledge';
import { Scenario } from '../types/scenario';
import { SCENARIO_DATA_PART_1 } from '../services/scenarioDataPart1';
import { SCENARIO_DATA_PART_2 } from '../services/scenarioDataPart2';

/**
 * All 60 Reconciled Scenarios (SCN_001 through SCN_060)
 */
export const SCENARIO_VAULT: ScenarioKnowledgeItem[] = [
  ...SCENARIO_DATA_PART_1,
  ...SCENARIO_DATA_PART_2,
];

/**
 * Returns EXACTLY the 40 production-ready validated scenarios.
 */
export function getProductionScenarios(): ScenarioKnowledgeItem[] {
  return SCENARIO_VAULT.filter(
    (scenario) =>
      scenario.is_active === true &&
      (scenario.source_status === 'SOURCE_VALIDATED' || scenario.status === 'production')
  );
}

/**
 * Returns EXACTLY the 20 review/placeholder scenarios.
 */
export function getReviewScenarios(): ScenarioKnowledgeItem[] {
  return SCENARIO_VAULT.filter(
    (scenario) =>
      scenario.is_active === false ||
      scenario.source_status === 'NEEDS_REVIEW' ||
      scenario.status === 'needs_review'
  );
}

/**
 * Returns all 60 scenarios.
 */
export function getAllScenarios(): ScenarioKnowledgeItem[] {
  return [...SCENARIO_VAULT];
}

/**
 * Retrieves a single scenario by its unique SCN_xxx ID or numeric ID.
 */
export function getScenarioById(id: string | number): ScenarioKnowledgeItem | undefined {
  if (typeof id === 'number') {
    return SCENARIO_VAULT.find((s) => s.numeric_id === id);
  }
  return SCENARIO_VAULT.find((s) => s.id === id);
}
