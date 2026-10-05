import { MULTICULTURAL_EXPERIENCES, MULTICULTURAL_TASKS } from '../data/multiculturalExperiencesData';
import { isJudgeDemoModeActive } from './demoMode';

/**
 * Checks if a specific day is unlocked based on sequential completion of prior days.
 * When Judge Demo Mode is active, ALL 7 days are unlocked immediately.
 */
export function isDayUnlocked(
  dayNumber: number,
  completedExperiences: string[] = [],
  completedTasks: string[] = []
): boolean {
  if (dayNumber <= 1) return true;
  if (dayNumber > 7) return false;

  // Judge Demo Mode: Force unlock all 7 days for hackathon evaluation
  if (isJudgeDemoModeActive()) {
    return true;
  }

  for (let d = 1; d < dayNumber; d++) {
    const dayExperiences = MULTICULTURAL_EXPERIENCES.filter((e) => e.day === d);
    const dayTask = MULTICULTURAL_TASKS.find((t) => t.day === d);

    const allExperiencesDone = dayExperiences.every((e) =>
      completedExperiences.includes(e.experienceId)
    );
    const taskDone = !dayTask || completedTasks.includes(dayTask.taskId);

    if (!allExperiencesDone || !taskDone) {
      return false;
    }
  }

  return true;
}

/**
 * Returns the highest unlocked day (1 to 7).
 */
export function getHighestUnlockedDay(
  completedExperiences: string[] = [],
  completedTasks: string[] = []
): number {
  if (isJudgeDemoModeActive()) {
    return 7;
  }

  for (let d = 1; d <= 7; d++) {
    if (!isDayUnlocked(d, completedExperiences, completedTasks)) {
      return Math.max(1, d - 1);
    }
  }
  return 7;
}

/**
 * Checks if all requirements for Day d are finished.
 */
export function isDayFullyCompleted(
  dayNumber: number,
  completedExperiences: string[] = [],
  completedTasks: string[] = []
): boolean {
  const dayExperiences = MULTICULTURAL_EXPERIENCES.filter((e) => e.day === dayNumber);
  const dayTask = MULTICULTURAL_TASKS.find((t) => t.day === dayNumber);

  const allExperiencesDone = dayExperiences.every((e) =>
    completedExperiences.includes(e.experienceId)
  );
  const taskDone = !dayTask || completedTasks.includes(dayTask.taskId);

  return allExperiencesDone && taskDone;
}
