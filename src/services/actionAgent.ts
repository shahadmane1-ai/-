import { LandmarkId, UserPersonalizationProfile } from '../types';
import { NlpAnalysisResult } from './arabicNlp';

export type AgentActionType =
  | 'getCurrentJourneyState'
  | 'getRecommendedExperience'
  | 'getRecommendedTask'
  | 'openExperience'
  | 'openBuilding'
  | 'openTask'
  | 'retrieveKnowledge'
  | 'saveUserPreference'
  | 'markExperienceComplete';

export interface AgentActionCall {
  actionName: AgentActionType;
  payload: Record<string, any>;
  reasonAr: string;
  reasonEn: string;
  autoExecute: boolean;
}

export interface AgentActionHandlers {
  onOpenExperience?: (experienceId: string) => void;
  onOpenBuilding?: (buildingId: LandmarkId) => void;
  onOpenTask?: (taskId: string) => void;
  onUpdatePreference?: (key: string, value: any) => void;
  onMarkComplete?: (experienceId: string) => void;
}

/**
 * Intelligent Action & Tool Decision Engine
 * Parses natural language and NLP intent into executable product commands
 */
export function decideAgentAction(
  query: string,
  nlp: NlpAnalysisResult,
  profile: UserPersonalizationProfile
): AgentActionCall | null {
  // 1. Explicit Direct Requests to Open an Experience (TEST 3)
  // "افتح لي تجربة الجامعة", "افتح تجربة الصلاة في الجامعة", "ابدئي تجربة الجامعة"
  if (nlp.extractedAction && nlp.extractedAction.actionName === 'openExperience') {
    return {
      actionName: 'openExperience',
      payload: { experienceId: nlp.extractedAction.targetId },
      reasonAr: `استجابة لطلبكِ المباشر بفتح ${nlp.extractedAction.humanLabelAr}`,
      reasonEn: `Executing your direct request to open ${nlp.extractedAction.targetId}`,
      autoExecute: true,
    };
  }

  // 2. University / Campus prayer situation inquiries (TEST 2)
  // "أنا في الجامعة ووقت الصلاة قرب، وش أسوي؟"
  if (nlp.intent === 'practical_guidance' && nlp.topic === 'university_campus') {
    const isCompleted = profile.completedExperiences.includes('university-prayer');
    return {
      actionName: 'openExperience',
      payload: { experienceId: 'university-prayer' },
      reasonAr: isCompleted
        ? 'بما أنكِ سألتِ عن وضع الصلاة بالجامعة، يمكنكِ تكرار المحاكاة لترسيخ السكينة.'
        : 'بما أنكِ في بيئة الجامعة ووقت الصلاة اقترب، أعددتُ لكِ تجربة تفاعلية لمحاكاة الصلاة بين المحاضرات.',
      reasonEn: 'Suggesting the University Prayer interactive experience to practice prayer on campus.',
      autoExecute: false, // Offers an interactive button so user can review the answer first or auto-open
    };
  }

  // 3. Asking about Daily Next Steps: "وش أقدر أسوي اليوم؟"
  if (
    query.includes('وش اقدر اسوي') ||
    query.includes('وش اسوي اليوم') ||
    query.includes('ماذا افعل اليوم') ||
    query.includes('وين اروح') ||
    query.includes('ما هي خطوتي')
  ) {
    return {
      actionName: 'getRecommendedExperience',
      payload: { day: profile.currentDay },
      reasonAr: `فحص مسار اليوم ${profile.currentDay} واستخراج المحطة الأنسب لرحلتك.`,
      reasonEn: `Inspecting Day ${profile.currentDay} progression to present the ideal next step.`,
      autoExecute: false,
    };
  }

  // 4. Repeated Family Inquiries after University Prayer (TEST 7)
  if (nlp.topic === 'family_parents') {
    const isFamilyCompleted = profile.completedExperiences.includes('family-communication');
    const targetId = isFamilyCompleted ? 'honoring-parents' : 'family-communication';
    return {
      actionName: 'openExperience',
      payload: { experienceId: targetId },
      reasonAr: 'بما أنكِ مهتمة بحسن التواصل مع أسرتكِ وبر والديكِ، أقترح خوض هذه التجربة الوجدانية.',
      reasonEn: 'Recommending the Family Communication experience based on your recent interest in parental relations.',
      autoExecute: false,
    };
  }

  return null;
}

/**
 * Executes the determined agent action against live application handlers
 */
export function executeAgentAction(
  action: AgentActionCall,
  handlers: AgentActionHandlers
): { executed: boolean; messageAr: string; messageEn: string } {
  switch (action.actionName) {
    case 'openExperience': {
      const expId = action.payload.experienceId;
      if (expId && handlers.onOpenExperience) {
        handlers.onOpenExperience(expId);
        return {
          executed: true,
          messageAr: `تم فتح التجربة بنجاح: ${expId}`,
          messageEn: `Successfully opened experience: ${expId}`,
        };
      }
      break;
    }
    case 'openBuilding': {
      const bId = action.payload.buildingId as LandmarkId;
      if (bId && handlers.onOpenBuilding) {
        handlers.onOpenBuilding(bId);
        return {
          executed: true,
          messageAr: `تم الانتقال إلى المعلم: ${bId}`,
          messageEn: `Navigated to building: ${bId}`,
        };
      }
      break;
    }
    case 'openTask': {
      const tId = action.payload.taskId;
      if (tId && handlers.onOpenTask) {
        handlers.onOpenTask(tId);
        return {
          executed: true,
          messageAr: `تم فتح تفاصيل المهمة: ${tId}`,
          messageEn: `Opened task details: ${tId}`,
        };
      }
      break;
    }
    default:
      break;
  }

  return {
    executed: false,
    messageAr: 'لم يتمكن الوكيل من تنفيذ الإجراء لعدم توفر المنفذ المناسب.',
    messageEn: 'Unable to execute action: handler missing.',
  };
}
