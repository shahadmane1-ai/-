/**
 * Single Real-Time Dynamic State Store (RAFIQ_DYNAMIC_SESSION)
 * Fulfills Part 4: Dynamic State & "سجل رحلتي وطمأنينتي" Orchestration.
 * Replaces static numbers with dynamic calculations from baseline (~45%) to 100%.
 */

import {
  DetectedEmotion,
  JourneyLogEntry,
  RafiqDynamicSession,
  UnlockedBadge,
} from '../types';

export const STORAGE_KEY_DYNAMIC_SESSION = 'RAFIQ_DYNAMIC_SESSION';
export const EVENT_SESSION_UPDATED = 'rafiq-session-updated';

export const INITIAL_DYNAMIC_BADGES: UnlockedBadge[] = [
  {
    id: 'badge_initial_step',
    titleAr: 'خطوة البداية المباركة',
    titleEn: 'Blessed First Step',
    icon: '🌱',
    unlockedAt: 'اليوم الأول',
    category: 'الهداية والتأقلم',
    descriptionAr: 'الانطلاق في رحلة التعلم والتأقلم بطمأنينة ويقين.',
  },
  {
    id: 'badge_sock_wiping',
    titleAr: 'رخصة المسح على الجوربين',
    titleEn: 'Sock Wiping Concession',
    icon: '🧦',
    unlockedAt: 'اليوم الثاني',
    category: 'الطهارة الميسرة',
    descriptionAr: 'تطبيق رخصة المسح في العمل وتجاوز الحرج الاجتماعي.',
  },
  {
    id: 'badge_sujud_sahw',
    titleAr: 'تدارك السهو وطرد الوسواس',
    titleEn: 'Sujud Sahw Healing',
    icon: '🕊️',
    unlockedAt: 'اليوم الثالث',
    category: 'الصلاة والخشوع',
    descriptionAr: 'البناء على اليقين وتدارك النقص بسجدتي السهو.',
  },
];

export const INITIAL_DYNAMIC_SESSION: RafiqDynamicSession = {
  tranquilityScore: 45, // Baseline starting dynamically from ~45%
  journeyLog: [
    {
      id: 'log_init_1',
      timestamp: Date.now() - 86400000 * 2,
      dateStr: 'اليوم الأول',
      contextTag: 'تهيئة البيئة والتطهر',
      titleAr: 'التعرف على رفيق واستكشاف معالم التيسير',
      titleEn: 'Meeting Rafiq & Discovering Ease',
      delta: 10,
      scoreAfter: 45,
      emotion: 'calm',
      verifiedSource: 'دليل المسلم الجديد',
    },
  ],
  unlockedBadges: INITIAL_DYNAMIC_BADGES,
  tranquilityHistory: [
    { day: 1, date: 'اليوم 1', score: 45, eventAr: 'الانطلاق والبداية' },
    { day: 2, date: 'اليوم 2', score: 55, eventAr: 'رخصة وضوء العمل' },
    { day: 3, date: 'اليوم 3', score: 65, eventAr: 'إتقان سجدتي السهو' },
  ],
  lastEmotionalState: 'calm',
  gentleModeActive: false,
  totalCompletedActions: 3,
};

/**
 * Loads dynamic session from localStorage
 */
export function loadRafiqDynamicSession(): RafiqDynamicSession {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DYNAMIC_SESSION);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...INITIAL_DYNAMIC_SESSION,
        ...parsed,
        tranquilityScore:
          typeof parsed.tranquilityScore === 'number'
            ? Math.min(100, Math.max(20, parsed.tranquilityScore))
            : INITIAL_DYNAMIC_SESSION.tranquilityScore,
        journeyLog: Array.isArray(parsed.journeyLog) && parsed.journeyLog.length > 0
          ? parsed.journeyLog
          : INITIAL_DYNAMIC_SESSION.journeyLog,
        unlockedBadges: Array.isArray(parsed.unlockedBadges) && parsed.unlockedBadges.length > 0
          ? parsed.unlockedBadges
          : INITIAL_DYNAMIC_SESSION.unlockedBadges,
        tranquilityHistory: Array.isArray(parsed.tranquilityHistory) && parsed.tranquilityHistory.length > 0
          ? parsed.tranquilityHistory
          : INITIAL_DYNAMIC_SESSION.tranquilityHistory,
      };
    }
  } catch (err) {
    console.warn('Error reading RAFIQ_DYNAMIC_SESSION:', err);
  }
  return { ...INITIAL_DYNAMIC_SESSION };
}

/**
 * Persists dynamic session to localStorage
 */
export function saveRafiqDynamicSession(session: RafiqDynamicSession): void {
  try {
    localStorage.setItem(STORAGE_KEY_DYNAMIC_SESSION, JSON.stringify(session));
  } catch (err) {
    console.warn('Error saving RAFIQ_DYNAMIC_SESSION:', err);
  }
}

/**
 * Direct Dynamic State Setter: Sets tranquility score to an absolute dynamic baseline
 * (computed by Gemini NLU) and dispatches real-time session update.
 */
export function setSessionTranquilityScore(
  absoluteScore: number,
  contextTag: string,
  meta?: {
    titleAr?: string;
    titleEn?: string;
    emotion?: DetectedEmotion;
    emotionalRationale?: string;
    engineTarget?: string;
    verifiedSource?: string;
  }
): RafiqDynamicSession {
  const current = loadRafiqDynamicSession();
  const clampedScore = Math.min(100, Math.max(20, Math.round(absoluteScore)));

  const newLogEntry: JourneyLogEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
    dateStr: 'اليوم',
    contextTag: contextTag || 'رادار المشاعر واليقين',
    titleAr: meta?.titleAr || contextTag || 'تشخيص السكينة عبر الذكاء الاصطناعي',
    titleEn: meta?.titleEn || 'AI-Evaluated Tranquility State',
    delta: clampedScore - current.tranquilityScore,
    scoreAfter: clampedScore,
    emotion: meta?.emotion || 'calm',
    engineTarget: meta?.engineTarget,
    verifiedSource: meta?.verifiedSource || 'دليل المسلم الجديد والدرر السنية',
  };

  const updatedHistory = [...current.tranquilityHistory];
  if (updatedHistory.length > 0) {
    const last = updatedHistory[updatedHistory.length - 1];
    updatedHistory[updatedHistory.length - 1] = {
      ...last,
      score: clampedScore,
      eventAr: contextTag || last.eventAr,
    };
  } else {
    updatedHistory.push({
      day: 1,
      date: 'اليوم 1',
      score: clampedScore,
      eventAr: contextTag,
    });
  }

  const updatedSession: RafiqDynamicSession = {
    ...current,
    tranquilityScore: clampedScore,
    journeyLog: [newLogEntry, ...current.journeyLog.slice(0, 49)],
    tranquilityHistory: updatedHistory,
    lastEmotionalState: meta?.emotion || current.lastEmotionalState,
    gentleModeActive: meta?.emotion === 'guilty' || meta?.emotion === 'anxious' || clampedScore < 45,
  };

  saveRafiqDynamicSession(updatedSession);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(EVENT_SESSION_UPDATED, {
        detail: updatedSession,
      })
    );
  }

  return updatedSession;
}

/**
 * Core Orchestrator: Updates live tranquility, appends to journeyLog,
 * adds milestone badges when appropriate, and dispatches global event.
 */
export function updateSessionTranquility(
  delta: number,
  contextTag: string,
  meta?: {
    titleAr?: string;
    titleEn?: string;
    emotion?: DetectedEmotion;
    engineTarget?: string;
    concessionUnlocked?: string;
    verifiedSource?: string;
    badgeAwarded?: UnlockedBadge;
  }
): RafiqDynamicSession {
  const current = loadRafiqDynamicSession();
  const safeDelta = Number(delta) || 10;
  const newScore = Math.min(100, Math.max(20, current.tranquilityScore + safeDelta));

  const newLogEntry: JourneyLogEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
    dateStr: 'اليوم',
    contextTag: contextTag || 'تطبيق عملي',
    titleAr: meta?.titleAr || contextTag || 'إنجاز تطبيقي ميسر',
    titleEn: meta?.titleEn || 'Practical Milestone Completed',
    delta: safeDelta,
    scoreAfter: newScore,
    emotion: meta?.emotion || 'calm',
    engineTarget: meta?.engineTarget,
    concessionUnlocked: meta?.concessionUnlocked,
    verifiedSource: meta?.verifiedSource || 'دليل المسلم الجديد',
  };

  const updatedBadges = [...current.unlockedBadges];
  if (meta?.badgeAwarded && !updatedBadges.some((b) => b.id === meta.badgeAwarded?.id)) {
    updatedBadges.push(meta.badgeAwarded);
  }

  // Update history curve dynamically
  const updatedHistory = [...current.tranquilityHistory];
  if (updatedHistory.length > 0) {
    const last = updatedHistory[updatedHistory.length - 1];
    if (last.date === 'اليوم' || last.day === updatedHistory.length) {
      updatedHistory[updatedHistory.length - 1] = {
        ...last,
        score: newScore,
        eventAr: contextTag || last.eventAr,
      };
    } else {
      updatedHistory.push({
        day: updatedHistory.length + 1,
        date: `اليوم ${updatedHistory.length + 1}`,
        score: newScore,
        eventAr: contextTag,
      });
    }
  } else {
    updatedHistory.push({
      day: 1,
      date: 'اليوم 1',
      score: newScore,
      eventAr: contextTag,
    });
  }

  const updatedSession: RafiqDynamicSession = {
    ...current,
    tranquilityScore: newScore,
    totalCompletedActions: current.totalCompletedActions + 1,
    journeyLog: [newLogEntry, ...current.journeyLog.slice(0, 49)],
    unlockedBadges: updatedBadges,
    tranquilityHistory: updatedHistory,
    lastEmotionalState: meta?.emotion || current.lastEmotionalState,
    gentleModeActive: meta?.emotion === 'guilty' || meta?.emotion === 'anxious' || newScore < 40,
  };

  saveRafiqDynamicSession(updatedSession);

  // Dispatch global custom event for live multi-component synchronization
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(EVENT_SESSION_UPDATED, {
        detail: updatedSession,
      })
    );
  }

  return updatedSession;
}
