/**
 * 60-Scenario Production Knowledge Vault
 * Phase 1 Architecture: Reconciliation, Deterministic Isolation & Source-Validated Pool
 */

import { ScenarioKnowledgeItem } from '../types/scenarioKnowledge';
import { SCENARIO_DATA_PART_1 } from './scenarioDataPart1';
import { SCENARIO_DATA_PART_2 } from './scenarioDataPart2';

/**
 * Complete reconciled set of 60 accredited scenarios (SCN_001 through SCN_060)
 */
export const SCENARIO_VAULT: ScenarioKnowledgeItem[] = [
  ...SCENARIO_DATA_PART_1,
  ...SCENARIO_DATA_PART_2,
];

/**
 * Returns ONLY the production-ready pool (40 items).
 * Guaranteed to have is_active === true and source_status === 'SOURCE_VALIDATED'.
 */
export function getProductionScenarios(): ScenarioKnowledgeItem[] {
  return SCENARIO_VAULT.filter(
    (scenario) => scenario.is_active === true && scenario.source_status === 'SOURCE_VALIDATED'
  );
}

/**
 * Returns the review/placeholder scenarios (20 items).
 */
export function getReviewScenarios(): ScenarioKnowledgeItem[] {
  return SCENARIO_VAULT.filter(
    (scenario) =>
      scenario.is_active === false ||
      scenario.source_status === 'NEEDS_REVIEW' ||
      (scenario as any).status === 'needs_review'
  );
}

/**
 * Returns all 60 scenarios for system audit and administrative inspection.
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
