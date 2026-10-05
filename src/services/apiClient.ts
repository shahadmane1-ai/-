import {
  AiMiniGame,
  ContentTier,
  CognitiveLoadMetrics,
  Language,
  LearningLevel,
  RafiqExperiencePayload,
  RafiqIntent,
  RafiqStructuredDecision,
  UserPersonalizationProfile,
} from '../types';
import { KnowledgeChunk } from './knowledgeBase';
import { retrieveKnowledge, AnasAiHelpSummary } from './ragEngine';
import { generateAiMiniGame } from './miniGameGenerator';

export interface AnasChatApiResponse {
  replyAr: string;
  replyEn: string;
  shortAnswer?: string;
  retrievedChunks: KnowledgeChunk[];
  confidence: number;
  hasDirectEvidence: boolean;
  contextMatched: boolean;
  aiHelpSummary?: AnasAiHelpSummary;
  suggestedAction?: any;
  contentTier?: ContentTier;
  isTierDRefusal?: boolean;
  cognitiveMetrics?: CognitiveLoadMetrics;
  structuredDecision?: RafiqStructuredDecision;
  intent?: RafiqIntent;
  experiencePayload?: RafiqExperiencePayload | null;
  sourceReference?: string;
}

export async function askAnasWithRag(params: {
  message: string;
  activeDay?: number;
  activeExperienceId?: string;
  activeExperienceName?: string;
  environmentTitle?: string;
  lang?: Language;
  conversationHistory?: Array<{ sender: 'user' | 'anas'; text: string }>;
  lastTopic?: string;
  userProfile?: UserPersonalizationProfile;
}): Promise<AnasChatApiResponse> {
  const {
    message,
    activeDay = 1,
    activeExperienceId,
    activeExperienceName,
    environmentTitle,
    lang = 'ar',
    conversationHistory = [],
    lastTopic,
    userProfile,
  } = params;

  try {
    const response = await fetch('/api/anas/rag-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        activeDay,
        activeExperienceId,
        activeExperienceName,
        environmentTitle,
        lang,
        conversationHistory,
        lastTopic,
        userProfile,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch {
    // Graceful offline fallback
  }

  // Client-Side Deterministic RAG Fallback
  const retrieval = retrieveKnowledge(message, {
    activeDay,
    activeExperienceId,
    topK: 2,
    userProfile,
    conversationHistory,
    lastTopic,
  });

  const isFemale = userProfile?.preferredAddressing === 'female' || (userProfile as any)?.gender === 'female';
  const vocativeAr = isFemale ? 'يا أختي' : 'يا أخي';
  const vocativeEn = isFemale ? 'my sister' : 'my brother';

  let replyAr = '';
  let replyEn = '';

  if (retrieval.groundedAnswerSynthesisAr) {
    replyAr = retrieval.groundedAnswerSynthesisAr;
    replyEn = retrieval.groundedAnswerSynthesisEn || retrieval.groundedAnswerSynthesisAr;
  } else if (retrieval.hasDirectEvidence && retrieval.chunks.length > 0) {
    const primary = retrieval.chunks[0];
    replyAr = isFemale
      ? `أهلاً بكِ ${vocativeAr} 🌿 بخصوص سؤالكِ، فإن ديننا الحنيف مبني على التيسير والرفق. ${primary.text} نسأل الله أن يملأ قلبكِ بالسكينة والاطمئنان.`
      : `أهلاً بكَ ${vocativeAr} 🌿 بخصوص سؤالك، فإن ديننا الحنيف مبني على التيسير والرفق. ${primary.text} نسأل الله أن يملأ قلبك بالسكينة والاطمئنان.`;
    replyEn = `Welcome, ${vocativeEn} 🌿 Regarding your question, our faith is built upon ease and gentleness. ${primary.text} May your heart be filled with serenity and contentment.`;
  } else {
    replyAr = isFemale
      ? `سؤال طيب ومهم ${vocativeAr} 🌿 الأصل العام في الشريعة هو التيسير ورفع الحرج، وإذا اشتبه عليكِ أمر فاستفتِ قلبكِ وننصحكِ بمراجعة أهل العلم المعتمدين.`
      : `سؤال طيب ومهم ${vocativeAr} 🌿 الأصل العام في الشريعة هو التيسير ورفع الحرج، وإذا اشتبه عليك أمر فاستفتِ قلبك وننصحك بمراجعة أهل العلم المعتمدين.`;
    replyEn = `A thoughtful question, ${vocativeEn} 🌿 The fundamental principle is ease and lifting hardship. Consulting verified scholars for specific rulings is recommended.`;
  }

  return {
    replyAr: retrieval.groundedAnswerSynthesisAr || replyAr,
    replyEn: retrieval.groundedAnswerSynthesisEn || replyEn,
    retrievedChunks: retrieval.chunks,
    confidence: retrieval.confidence,
    hasDirectEvidence: retrieval.hasDirectEvidence,
    contextMatched: retrieval.contextMatched,
    aiHelpSummary: retrieval.aiHelpSummary,
    suggestedAction: retrieval.suggestedAction,
    structuredDecision: retrieval.structuredDecision,
    intent: retrieval.intent || retrieval.structuredDecision?.intent,
    experiencePayload: retrieval.experiencePayload || retrieval.structuredDecision?.experiencePayload,
    sourceReference: retrieval.sourceReference || retrieval.structuredDecision?.sourceReference,
    contentTier: retrieval.contentTier,
    isTierDRefusal: retrieval.isTierDRefusal,
    cognitiveMetrics: retrieval.cognitiveMetrics,
  };
}

export async function requestMiniGameGeneration(params: {
  userQuery?: string;
  topic?: string;
  userProfile?: UserPersonalizationProfile;
  difficulty?: LearningLevel;
}): Promise<AiMiniGame> {
  try {
    const res = await fetch('/api/anas/generate-minigame', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback to client generator
  }
  return generateAiMiniGame(params);
}
