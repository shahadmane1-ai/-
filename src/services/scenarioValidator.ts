/**
 * Deterministic Scenario Vault Ingestion & Policy Validator
 * Phase 1 Architecture: Strict Schema Enforcer & Grounded Source Registry Validator
 */

import { ScenarioKnowledgeItem } from '../types/scenarioKnowledge';

export interface ValidationIssue {
  scenarioId: string;
  field?: string;
  rule: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationReport {
  isValid: boolean;
  totalScenarios: number;
  validatedCount: number;
  needsReviewCount: number;
  activeCount: number;
  inactiveCount: number;
  duplicateIds: string[];
  invalidSourceIds: Array<{ scenarioId: string; sourceId: string }>;
  unresolvedRelatedScenarios: Array<{ scenarioId: string; relatedId: string }>;
  missingRequiredConcepts: string[];
  policyViolations: Array<{ scenarioId: string; violation: string }>;
  issues: ValidationIssue[];
}

const FORBIDDEN_POLICY_KEYS = [
  'faith_score',
  'faith_level',
  'piety',
  'piety_score',
  'sentiment',
  'sentiment_score',
  'psychological_state',
  'psychological_diagnosis',
  'mood_score',
  'spiritual_rank',
  'iman_level',
  'piety_index',
];

/**
 * Deterministically validates an array of ScenarioKnowledgeItems against strict schemas,
 * policy guardrails, and the source registry allowlist.
 *
 * @param scenarios Array of ScenarioKnowledgeItem to validate
 * @param registeredSourceIds List of valid approved source IDs from sourceRegistry.ts
 * @returns ValidationReport detailing exact pass/fail status and any specific issues
 */
export function validateScenarioVault(
  scenarios: ScenarioKnowledgeItem[],
  registeredSourceIds: string[]
): ValidationReport {
  const issues: ValidationIssue[] = [];
  const seenIds = new Set<string>();
  const duplicateIds: string[] = [];
  const invalidSourceIds: Array<{ scenarioId: string; sourceId: string }> = [];
  const unresolvedRelatedScenarios: Array<{ scenarioId: string; relatedId: string }> = [];
  const missingRequiredConcepts: string[] = [];
  const policyViolations: Array<{ scenarioId: string; violation: string }> = [];

  let validatedCount = 0;
  let needsReviewCount = 0;
  let activeCount = 0;
  let inactiveCount = 0;

  const validSourceSet = new Set(registeredSourceIds);
  const allScenarioIdSet = new Set(scenarios.map((s) => s.id));

  // 1. Total Scenario Count Enforcement (Exactly 60 expected)
  if (scenarios.length !== 60) {
    issues.push({
      scenarioId: 'GLOBAL',
      rule: 'EXACT_COUNT_60',
      message: `Expected exactly 60 scenarios in vault, found ${scenarios.length}`,
      severity: 'error',
    });
  }

  // 2. Individual Scenario Inspection
  for (const scenario of scenarios) {
    // Unique ID check
    if (!scenario.id || !scenario.id.trim()) {
      issues.push({
        scenarioId: scenario.id || 'UNKNOWN',
        field: 'id',
        rule: 'NON_EMPTY_ID',
        message: 'Scenario ID must not be empty',
        severity: 'error',
      });
    } else if (seenIds.has(scenario.id)) {
      duplicateIds.push(scenario.id);
      issues.push({
        scenarioId: scenario.id,
        field: 'id',
        rule: 'UNIQUE_ID',
        message: `Duplicate scenario ID detected: ${scenario.id}`,
        severity: 'error',
      });
    } else {
      seenIds.add(scenario.id);
    }

    // ID Format check (SCN_001 to SCN_060)
    if (!/^SCN_\d{3}$/.test(scenario.id)) {
      issues.push({
        scenarioId: scenario.id,
        field: 'id',
        rule: 'ID_FORMAT',
        message: `Scenario ID ${scenario.id} does not match required format SCN_xxx`,
        severity: 'error',
      });
    }

    // Counters
    if (scenario.source_status === 'SOURCE_VALIDATED') {
      validatedCount++;
    } else if (scenario.source_status === 'NEEDS_REVIEW') {
      needsReviewCount++;
    }

    if (scenario.is_active) {
      activeCount++;
    } else {
      inactiveCount++;
    }

    // Production Isolation Guard: NEEDS_REVIEW MUST be is_active === false
    if (scenario.source_status === 'NEEDS_REVIEW' && scenario.is_active) {
      issues.push({
        scenarioId: scenario.id,
        field: 'is_active',
        rule: 'PRODUCTION_ISOLATION_GUARD',
        message: `Scenario ${scenario.id} is marked NEEDS_REVIEW but has is_active === true. Must be isolated (false).`,
        severity: 'error',
      });
    }

    // SOURCE_VALIDATED MUST have is_active === true
    if (scenario.source_status === 'SOURCE_VALIDATED' && !scenario.is_active) {
      issues.push({
        scenarioId: scenario.id,
        field: 'is_active',
        rule: 'PRODUCTION_VALIDATED_ACTIVE',
        message: `Scenario ${scenario.id} is SOURCE_VALIDATED but has is_active === false.`,
        severity: 'error',
      });
    }

    // Strict Policy Check: Forbidden fields related to faith scoring, emotion diagnosis, etc.
    const scenarioKeys = Object.keys(scenario);
    for (const key of scenarioKeys) {
      const lowerKey = key.toLowerCase();
      for (const forbidden of FORBIDDEN_POLICY_KEYS) {
        if (lowerKey === forbidden || lowerKey.includes(forbidden)) {
          policyViolations.push({
            scenarioId: scenario.id,
            violation: `Forbidden policy attribute detected on scenario: ${key}`,
          });
          issues.push({
            scenarioId: scenario.id,
            field: key,
            rule: 'POLICY_GUARD_NO_FAITH_SCORING',
            message: `Forbidden field "${key}" detected. Piety/sentiment/psychological profiling is strictly prohibited.`,
            severity: 'error',
          });
        }
      }
    }

    // Criteria Completeness: For SOURCE_VALIDATED, required_concepts must have at least 1 non-empty concept
    if (scenario.source_status === 'SOURCE_VALIDATED') {
      const concepts = scenario.learning_criteria?.required_concepts || [];
      const validConcepts = concepts.filter((c) => c && typeof c === 'string' && c.trim().length > 0);
      if (validConcepts.length === 0) {
        missingRequiredConcepts.push(scenario.id);
        issues.push({
          scenarioId: scenario.id,
          field: 'learning_criteria.required_concepts',
          rule: 'CRITERIA_COMPLETENESS',
          message: `SOURCE_VALIDATED scenario ${scenario.id} requires at least one non-empty concept in required_concepts`,
          severity: 'error',
        });
      }

      // Approved Sources Integrity for SOURCE_VALIDATED
      if (!scenario.approved_sources || scenario.approved_sources.length === 0) {
        issues.push({
          scenarioId: scenario.id,
          field: 'approved_sources',
          rule: 'APPROVED_SOURCES_REQUIRED',
          message: `SOURCE_VALIDATED scenario ${scenario.id} must have at least one approved source binding`,
          severity: 'error',
        });
      } else {
        for (const source of scenario.approved_sources) {
          if (!source.registry_source_id || !validSourceSet.has(source.registry_source_id)) {
            invalidSourceIds.push({
              scenarioId: scenario.id,
              sourceId: source.registry_source_id || 'EMPTY',
            });
            issues.push({
              scenarioId: scenario.id,
              field: 'approved_sources.registry_source_id',
              rule: 'SOURCE_REGISTRY_INTEGRITY',
              message: `Source ID "${source.registry_source_id}" in ${scenario.id} does not match any official registry item in sourceRegistry.ts`,
              severity: 'error',
            });
          }

          if (!source.reference_title || !source.reference_title.trim()) {
            issues.push({
              scenarioId: scenario.id,
              field: 'approved_sources.reference_title',
              rule: 'SOURCE_TITLE_REQUIRED',
              message: `Source in ${scenario.id} is missing reference_title`,
              severity: 'error',
            });
          }

          if (!source.verbatim_evidence_text || !source.verbatim_evidence_text.trim()) {
            issues.push({
              scenarioId: scenario.id,
              field: 'approved_sources.verbatim_evidence_text',
              rule: 'VERBATIM_EVIDENCE_REQUIRED',
              message: `Source in ${scenario.id} is missing verbatim_evidence_text`,
              severity: 'error',
            });
          }
        }
      }
    }

    // Relationship Integrity: Every ID in related_scenarios must exist in the 60 items
    if (scenario.related_scenarios && scenario.related_scenarios.length > 0) {
      for (const relId of scenario.related_scenarios) {
        if (!allScenarioIdSet.has(relId)) {
          unresolvedRelatedScenarios.push({
            scenarioId: scenario.id,
            relatedId: relId,
          });
          issues.push({
            scenarioId: scenario.id,
            field: 'related_scenarios',
            rule: 'RELATIONSHIP_INTEGRITY',
            message: `Related scenario ID "${relId}" does not exist in the 60 vault items`,
            severity: 'error',
          });
        }
      }
    }
  }

  const errorCount = issues.filter((i) => i.severity === 'error').length;

  return {
    isValid: errorCount === 0,
    totalScenarios: scenarios.length,
    validatedCount,
    needsReviewCount,
    activeCount,
    inactiveCount,
    duplicateIds,
    invalidSourceIds,
    unresolvedRelatedScenarios,
    missingRequiredConcepts,
    policyViolations,
    issues,
  };
}
