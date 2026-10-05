/**
 * Judge Demo Mode Controller (Hackathon Evaluation Utility)
 * Enables instant unlocking of all 7 City Days, Quick Test Chips in Rafeeq Lab,
 * and One-Click Learning State Reset for Judges.
 */

import { useEffect, useState } from 'react';
import { resetLearningState } from '../services/learningStateManager';

export const DEMO_MODE_STORAGE_KEY = 'rafiq_judge_demo_mode_v1';

export function isJudgeDemoModeActive(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(DEMO_MODE_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setJudgeDemoMode(active: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DEMO_MODE_STORAGE_KEY, active ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent('rafic_demo_mode_changed', { detail: { active } }));
    window.dispatchEvent(new CustomEvent('rafic_learning_state_updated'));
  } catch (err) {
    console.warn('[DemoMode] Failed to write localStorage:', err);
  }
}

export function toggleJudgeDemoMode(): boolean {
  const next = !isJudgeDemoModeActive();
  setJudgeDemoMode(next);
  return next;
}

export function resetDemoSession(): void {
  resetLearningState();
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('rafiq_world_memory_v1');
      localStorage.removeItem('rafiq_user_session_v1');
    } catch (e) {
      console.warn('[DemoMode] Error clearing session keys:', e);
    }
    window.dispatchEvent(new CustomEvent('rafic_demo_mode_changed', { detail: { active: isJudgeDemoModeActive() } }));
    window.dispatchEvent(new CustomEvent('rafic_learning_state_updated'));
  }
}

/**
 * React hook to subscribe to Judge Demo Mode state changes.
 */
export function useJudgeDemoMode() {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => isJudgeDemoModeActive());

  useEffect(() => {
    const handleUpdate = () => {
      setIsDemoMode(isJudgeDemoModeActive());
    };

    window.addEventListener('rafic_demo_mode_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('rafic_demo_mode_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return {
    isDemoMode,
    toggleDemoMode: toggleJudgeDemoMode,
    setDemoMode: setJudgeDemoMode,
    resetSession: resetDemoSession,
  };
}
