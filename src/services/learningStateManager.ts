/**
 * Deterministic Learning State Manager
 * Phase 4 Architecture: Robust Local Persistence, Concept Tracking & Strict Policy Guard
 * Strictly forbids faith scoring, psychological profiling, mood tracking, or sentiment diagnostic fields.
 */

import { UserLearningState } from '../types/scenarioKnowledge';

const STORAGE_KEY = 'rafic_user_learning_state_v1';

/**
 * Unauthorized field names that MUST be stripped to prevent ethical violations.
 */
export const FORBIDDEN_STATE_FIELDS = [
  'faith_level',
  'piety',
  'sentiment',
  'psychological_state',
  'mood',
  'religiosity',
  'morality_score',
  'spiritual_score',
  'iman_level',
  'emotional_state',
];

/**
 * Factory for a clean, deterministic initial learning state.
 */
export function getInitialLearningState(): UserLearningState {
  return {
    completed_scenarios: [],
    attempts: {},
    mistakes_by_topic: {},
    mastered_concepts: [],
    needs_reinforcement: [],
    last_active_timestamp: Date.now(),
  };
}

// In-memory fallback for SSR or Node.js test runner environments
let memoryState: UserLearningState | null = null;

/**
 * Strict Policy Guard: Strips unauthorized fields and guarantees schema integrity.
 */
export function sanitizeLearningState(rawState: unknown): UserLearningState {
  const initial = getInitialLearningState();
  if (!rawState || typeof rawState !== 'object') {
    return initial;
  }

  const raw = rawState as Record<string, unknown>;

  // Check and sanitize completed_scenarios (Array of strings)
  const completed_scenarios = Array.isArray(raw.completed_scenarios)
    ? Array.from(new Set(raw.completed_scenarios.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)))
    : [];

  // Check and sanitize attempts (Record<string, number>)
  const attempts: Record<string, number> = {};
  if (raw.attempts && typeof raw.attempts === 'object') {
    for (const [key, val] of Object.entries(raw.attempts as Record<string, unknown>)) {
      if (typeof val === 'number' && Number.isFinite(val) && val >= 0) {
        attempts[key] = Math.floor(val);
      }
    }
  }

  // Check and sanitize mistakes_by_topic (Record<string, number>)
  const mistakes_by_topic: Record<string, number> = {};
  if (raw.mistakes_by_topic && typeof raw.mistakes_by_topic === 'object') {
    for (const [key, val] of Object.entries(raw.mistakes_by_topic as Record<string, unknown>)) {
      if (typeof val === 'number' && Number.isFinite(val) && val >= 0) {
        mistakes_by_topic[key] = Math.floor(val);
      }
    }
  }

  // Check and sanitize mastered_concepts (Array of strings)
  const mastered_concepts = Array.isArray(raw.mastered_concepts)
    ? Array.from(new Set(raw.mastered_concepts.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)))
    : [];

  // Check and sanitize needs_reinforcement (Array of strings)
  const needs_reinforcement = Array.isArray(raw.needs_reinforcement)
    ? Array.from(new Set(raw.needs_reinforcement.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)))
    : [];

  // Check timestamp
  const last_active_timestamp =
    typeof raw.last_active_timestamp === 'number' && Number.isFinite(raw.last_active_timestamp)
      ? raw.last_active_timestamp
      : Date.now();

  // Strict output object: explicitly exclude any unauthorized fields
  return {
    completed_scenarios,
    attempts,
    mistakes_by_topic,
    mastered_concepts,
    needs_reinforcement,
    last_active_timestamp,
  };
}

/**
 * Retrieves the current sanitized user learning state from localStorage or in-memory fallback.
 */
export function getLearningState(): UserLearningState {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const sanitized = sanitizeLearningState(parsed);
        memoryState = sanitized;
        return sanitized;
      }
    } catch (e) {
      console.warn('[LearningStateManager] Failed to parse localStorage state:', e);
    }
  }

  if (!memoryState) {
    memoryState = getInitialLearningState();
  }
  return memoryState;
}

/**
 * Saves the sanitized user learning state to localStorage and memory.
 */
export function saveLearningState(state: UserLearningState): void {
  const sanitized = sanitizeLearningState(state);
  sanitized.last_active_timestamp = Date.now();
  memoryState = sanitized;

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
      window.dispatchEvent(new CustomEvent('rafic_learning_state_updated', { detail: sanitized }));
    } catch (e) {
      console.warn('[LearningStateManager] Failed to write to localStorage:', e);
    }
  }
}

/**
 * Records an attempt for a scenario, updating mastery, counts, mistakes, and reinforcement needs.
 */
export function recordScenarioAttempt(
  scenarioId: string,
  passed: boolean,
  conceptsCovered: string[] = [],
  topic?: string
): UserLearningState {
  const state = getLearningState();

  // Update attempt count
  const currentAttempts = state.attempts[scenarioId] || 0;
  state.attempts[scenarioId] = currentAttempts + 1;

  if (passed) {
    // Add to completed scenarios if not already present
    if (!state.completed_scenarios.includes(scenarioId)) {
      state.completed_scenarios.push(scenarioId);
    }

    // Add covered concepts to mastered_concepts
    for (const concept of conceptsCovered) {
      if (concept && !state.mastered_concepts.includes(concept)) {
        state.mastered_concepts.push(concept);
      }
      // Remove passed concepts or scenario ID from needs_reinforcement
      state.needs_reinforcement = state.needs_reinforcement.filter(
        (item) => item !== concept && item !== scenarioId
      );
    }
    // Also remove scenarioId directly from reinforcement
    state.needs_reinforcement = state.needs_reinforcement.filter((item) => item !== scenarioId);
  } else {
    // Increment mistake counter for topic
    if (topic) {
      state.mistakes_by_topic[topic] = (state.mistakes_by_topic[topic] || 0) + 1;
    }

    // Add scenarioId to reinforcement needs if not present
    if (!state.needs_reinforcement.includes(scenarioId)) {
      state.needs_reinforcement.push(scenarioId);
    }
  }

  saveLearningState(state);
  return state;
}

/**
 * Adds a concept tag or scenario ID to needs_reinforcement list.
 */
export function addReinforcementNeed(conceptOrScenarioId: string): void {
  if (!conceptOrScenarioId || typeof conceptOrScenarioId !== 'string') return;
  const state = getLearningState();
  if (!state.needs_reinforcement.includes(conceptOrScenarioId)) {
    state.needs_reinforcement.push(conceptOrScenarioId);
    saveLearningState(state);
  }
}

/**
 * Clears a concept tag or scenario ID from needs_reinforcement list.
 */
export function clearReinforcementNeed(conceptOrScenarioId: string): void {
  if (!conceptOrScenarioId || typeof conceptOrScenarioId !== 'string') return;
  const state = getLearningState();
  const filtered = state.needs_reinforcement.filter((item) => item !== conceptOrScenarioId);
  if (filtered.length !== state.needs_reinforcement.length) {
    state.needs_reinforcement = filtered;
    saveLearningState(state);
  }
}

/**
 * Resets the entire learning state to pristine factory defaults.
 */
export function resetLearningState(): void {
  const initial = getInitialLearningState();
  memoryState = initial;
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('[LearningStateManager] Failed to clear localStorage:', e);
    }
  }
}
