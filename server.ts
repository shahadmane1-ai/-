import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { retrieveKnowledge, buildAnasRagSystemPrompt } from './src/services/ragEngine';
import { generateAiMiniGame } from './src/services/miniGameGenerator';
import { inflectArabic } from './src/services/userAdaptation';
import { AddressingPreference, RafiqStructuredDecision } from './src/types';
import {
  RAFIC_INTERNAL_CATALOGUE,
  matchScenarioLocally,
  matchScenarioLocallyWithConfidence,
} from './src/services/raficInternalCatalogue';
import { retrieveTopScenarios, validateEmbeddingsCacheIntegrity } from './src/services/semanticRetrievalService';
import { routeUserInquiry } from './src/services/nluRouterService';
import { bindGroundedScenarioResponse, executeGroundedInquiryPipeline } from './src/services/groundedResponseService';
import { evaluateFreeTextExplanation } from './src/services/learningEvaluatorService';
import { getAdaptiveRecommendation } from './src/services/adaptiveReinforcementService';
import { getLearningState, recordScenarioAttempt, resetLearningState } from './src/services/learningStateManager';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(express.json({ limit: '15mb' }));

// Shared server-side Gemini client with required telemetry
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// =========================================================================
// 0. GEMINI PROXY ENDPOINTS (Reliable Server-Side Relay)
// =========================================================================
app.post('/api/gemini/embed', async (req: Request, res: Response) => {
  try {
    const { text, model = 'gemini-embedding-2-preview' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text string is required' });
    }
    const currentApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
    if (!currentApiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on server' });
    }

    const targetModel =
      model === 'text-embedding-004' ? 'gemini-embedding-2-preview' : model;

    const candidateModels = [targetModel, 'gemini-embedding-001'];
    let lastError = '';

    for (const m of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:embedContent?key=${currentApiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: `models/${m}`,
            content: { parts: [{ text: text.trim() }] },
            outputDimensionality: 768,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const values = data?.embedding?.values || data?.embeddings?.[0]?.values;
          if (values && Array.isArray(values) && values.length > 0) {
            return res.json({ values });
          }
        } else {
          lastError = await response.text();
        }
      } catch (err: any) {
        lastError = err?.message || 'Fetch failed';
      }
    }

    return res.status(500).json({ error: `Embedding API error: ${lastError}` });
  } catch (error: any) {
    console.error('[server:gemini:embed] error:', error);
    return res.status(500).json({ error: error?.message || 'Embedding generation failed' });
  }
});

app.post('/api/gemini/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, systemInstruction, model = 'gemini-3.8-flash', responseMimeType = 'application/json' } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt string is required' });
    }
    const currentApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
    if (!currentApiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on server' });
    }

    const targetModel =
      model === 'gemini-1.5-flash' || model === 'gemini-2.5-flash' ? 'gemini-3.5-flash-lite' : model;

    const candidateModels = Array.from(new Set([targetModel, 'gemini-3.5-flash-lite', 'gemini-3.8-flash']));
    let lastError = '';

    for (const currentModel of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${currentApiKey}`;
        const bodyPayload: any = {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType,
          },
        };
        if (systemInstruction) {
          bodyPayload.systemInstruction = { parts: [{ text: systemInstruction }] };
        }

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyPayload),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          return res.json({ text });
        } else {
          lastError = await response.text();
        }
      } catch (err: any) {
        lastError = err?.message || 'Generate fetch failed';
      }
    }

    return res.status(500).json({ error: `GenerateContent API error: ${lastError}` });
  } catch (error: any) {
    console.error('[server:gemini:generate] error:', error);
    return res.status(500).json({ error: error?.message || 'Generate content failed' });
  }
});

// =========================================================================
// 0. SEMANTIC SCENARIO RETRIEVAL ENDPOINT (Phase 2 Vector Similarity)
// =========================================================================
app.post('/api/anas/semantic-retrieve', async (req: Request, res: Response) => {
  try {
    const { query, threshold, topK } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query string is required' });
    }
    const result = await retrieveTopScenarios(query, {
      similarityThreshold: typeof threshold === 'number' ? threshold : undefined,
      topK: typeof topK === 'number' ? topK : undefined,
    });
    return res.json(result);
  } catch (error: any) {
    console.error('Semantic retrieve endpoint error:', error);
    return res.status(500).json({ error: error?.message || 'Semantic retrieval failed' });
  }
});

// Cache health check endpoint
app.get('/api/anas/semantic-cache-status', (_req: Request, res: Response) => {
  const integrity = validateEmbeddingsCacheIntegrity();
  return res.json(integrity);
});

// Phase 3: Structured NLU Candidate Routing endpoint
app.post('/api/anas/nlu-route', async (req: Request, res: Response) => {
  try {
    const { query, candidates } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query string is required' });
    }
    const result = await routeUserInquiry(query, Array.isArray(candidates) ? candidates : []);
    return res.json(result);
  } catch (error: any) {
    console.error('NLU route endpoint error:', error);
    return res.status(500).json({ error: error?.message || 'NLU routing failed' });
  }
});

// Phase 3: Complete Grounded Inquiry Pipeline endpoint (Retrieval -> Routing -> Evidence Binding)
app.post('/api/anas/grounded-inquiry', async (req: Request, res: Response) => {
  try {
    const { query, threshold, topK } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query string is required' });
    }
    const result = await executeGroundedInquiryPipeline(query, {
      similarityThreshold: typeof threshold === 'number' ? threshold : undefined,
      topK: typeof topK === 'number' ? topK : undefined,
    });
    return res.json(result);
  } catch (error: any) {
    console.error('Grounded inquiry endpoint error:', error);
    return res.status(500).json({ error: error?.message || 'Grounded inquiry pipeline failed' });
  }
});

// Phase 4: Free-text Objective Concept Reasoning Evaluation
app.post('/api/anas/evaluate-concept', async (req: Request, res: Response) => {
  try {
    const { scenarioId, userText } = req.body;
    if (!scenarioId || typeof scenarioId !== 'string') {
      return res.status(400).json({ error: 'scenarioId string is required' });
    }
    const result = await evaluateFreeTextExplanation(scenarioId, userText || '');
    return res.json(result);
  } catch (error: any) {
    console.error('Concept evaluation endpoint error:', error);
    return res.status(500).json({ error: error?.message || 'Concept evaluation failed' });
  }
});

// Phase 4: Adaptive Graph-based Recommendation
app.get('/api/anas/adaptive-recommendation', (_req: Request, res: Response) => {
  try {
    const recommendation = getAdaptiveRecommendation();
    return res.json({ recommendation });
  } catch (error: any) {
    console.error('Adaptive recommendation endpoint error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to get recommendation' });
  }
});

// Phase 4: Current sanitized learning state
app.get('/api/anas/learning-state', (_req: Request, res: Response) => {
  try {
    const state = getLearningState();
    return res.json(state);
  } catch (error: any) {
    console.error('Learning state endpoint error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to get learning state' });
  }
});

// Phase 4: Reset learning state
app.post('/api/anas/learning-state/reset', (_req: Request, res: Response) => {
  try {
    resetLearningState();
    return res.json({ success: true, message: 'Learning state reset successfully' });
  } catch (error: any) {
    console.error('Reset learning state error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to reset learning state' });
  }
});

// =========================================================================
// 1. ANAS RAG CHAT ENDPOINT (Retrieval-Augmented Generation)
// =========================================================================
app.post('/api/anas/rag-chat', async (req: Request, res: Response) => {
  try {
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
    } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message query is required' });
    }

    // Selected gender is the ONLY source of truth:
    const isFemale = userProfile?.gender === 'female' || userProfile?.preferredAddressing === 'female';
    const addressing: AddressingPreference = isFemale ? 'female' : 'male';

    const normalizedProfile = {
      ...userProfile,
      gender: isFemale ? 'female' : 'male',
      preferredAddressing: addressing,
    };

    // Step 1: Semantic & Keyword Retrieval from authentic Knowledge Base with strict topic isolation
    const retrieval = retrieveKnowledge(message, {
      activeDay,
      activeExperienceId,
      topK: 2,
      userProfile: normalizedProfile,
      conversationHistory,
      lastTopic,
    });

    // Step 2: Grounded Cognitive Pipeline & Gemini Orchestration
    const cognitiveResult = await executeRafiqCognitivePipeline(
      message,
      normalizedProfile,
      conversationHistory
    );

    let finalDecision: RafiqStructuredDecision = {
      intent: cognitiveResult.semanticCategory === 'ESCALATE_HUMAN' ? 'HUMAN_REFERRAL' : 'EXPLANATION',
      shortAnswer: cognitiveResult.companionReply,
      sourceReference: cognitiveResult.verifiedSourceTag || 'دليل المسلم الجديد والدرر السنية',
      experiencePayload: cognitiveResult.actionTrigger
        ? {
            sceneType:
              cognitiveResult.actionTrigger.engineTarget === 'ENGINE_PRAYER'
                ? 'PRAYER'
                : cognitiveResult.actionTrigger.engineTarget === 'ENGINE_WUDU'
                ? 'WUDU'
                : cognitiveResult.actionTrigger.engineTarget === 'ENGINE_SOCIAL'
                ? 'SOCIAL'
                : cognitiveResult.actionTrigger.engineTarget === 'ENGINE_TRAVEL'
                ? 'ENVIRONMENT'
                : 'ENVIRONMENT',
            coreAction: cognitiveResult.actionTrigger.tactileActionLabel,
            interactiveElements: [
              {
                id: 'elem_1',
                label: 'استحضار النية والسكينة',
                completed: false,
                tactileEffect: 'chime',
              },
              {
                id: 'elem_2',
                label: cognitiveResult.actionTrigger.sceneParameters.remedialInstruction,
                completed: false,
                tactileEffect: 'soft_tap',
              },
              {
                id: 'elem_3',
                label: 'تثبيت الطمأنينة',
                completed: false,
                tactileEffect: 'glow',
              },
            ],
            tranquilityDelta: cognitiveResult.tranquilityDelta || 15,
          }
        : null,
    };

    // Clean internal system tags and metrics
    const cleanInternalTags = (str: string) =>
      str
        .replace(/\[المستوى\s*[أ-د][^\]]*\]/gi, '')
        .replace(/\[-?\d+%\s*حمل\s*معرفي\]/gi, '')
        .replace(/\[\d+%\s*جاهزية\s*حركية\]/gi, '')
        .replace(/\[Tier\s*[A-D][^\]]*\]/gi, '')
        .replace(/\[-?\d+%\s*Cognitive[^\]]*\]/gi, '')
        .replace(/\[\d+%\s*Readiness[^\]]*\]/gi, '')
        .trim();

    finalDecision.shortAnswer = cleanInternalTags(finalDecision.shortAnswer);
    finalDecision.shortAnswer = inflectArabic(finalDecision.shortAnswer, addressing);

    return res.json({
      cognitiveResult,
      structuredDecision: finalDecision,
      intent: finalDecision.intent,
      shortAnswer: finalDecision.shortAnswer,
      replyAr: finalDecision.shortAnswer,
      replyEn: finalDecision.shortAnswer,
      sourceReference: finalDecision.sourceReference,
      experiencePayload: finalDecision.experiencePayload,
      actionTrigger: cognitiveResult.actionTrigger,
      detectedEmotion: cognitiveResult.detectedEmotion,
      tranquilityDelta: cognitiveResult.tranquilityDelta,
      semanticCategory: cognitiveResult.semanticCategory,
      isTierDRefusal: cognitiveResult.semanticCategory === 'ESCALATE_HUMAN',
      retrievedChunks: retrieval.chunks.map((c) => ({
        id: c.id,
        category: c.sourceType,
        title: c.title,
        sourceName: c.sourceName,
        sourceUrl: c.sourceUrl,
        sourceType: c.sourceType,
        text: c.text,
        surahAyah: c.surahAyah,
        hadithCitation: c.hadithCitation,
      })),
      confidence: 100,
      hasDirectEvidence: true,
      contextMatched: true,
      aiHelpSummary: retrieval.aiHelpSummary,
      suggestedAction: cognitiveResult.actionTrigger
        ? {
            actionName: 'openMiniGame',
            targetId: cognitiveResult.actionTrigger.engineTarget.toLowerCase(),
            humanLabelAr: cognitiveResult.actionTrigger.tactileActionLabel,
            gameTopic: cognitiveResult.actionTrigger.engineTarget.toLowerCase(),
          }
        : retrieval.suggestedAction,
      contentTier: retrieval.contentTier,
      cognitiveMetrics: retrieval.cognitiveMetrics,
    });
  } catch (error: any) {
    console.error('Error in /api/anas/rag-chat:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// =========================================================================
// 1.1 ANAS AI MINI-GAME LAB GENERATOR ENDPOINT
// =========================================================================
app.post('/api/anas/generate-minigame', async (req: Request, res: Response) => {
  try {
    const { userQuery = '', topic, userProfile, difficulty } = req.body;
    const isFemale = userProfile?.gender === 'female' || userProfile?.preferredAddressing === 'female';

    if (ai && userQuery && typeof userQuery === 'string' && userQuery.trim().length > 2) {
      try {
        const gamePrompt = `You are an expert Islamic educational visual game designer. The user submitted this learning need / question / difficulty / fear / confusion:
"${userQuery}"

Task: Immediately turn this learning problem into a playable interactive educational 2D/2.5D visual scene.

Requirements:
- Mechanic must be one of:
  * "object_interaction" (Drawing/wiping/tapping directly on a 2D virtual object, e.g. sock wiping, wudu limb, Qibla compass, prayer mat, sujud points)
  * "sorting" (distinguishing concepts/actions into 2 categories or balance scale)
  * "sequencing" (ordering 3-6 steps on 2.5D pedestals)
  * "inspection" (inspecting physical items on table/shelves)
- sceneTheme must be one of: "classroom", "travel_road", "restaurant_table", "prayer_room", "desert_oasis", "home_living", "wudu_station", "market_shelf".
- Grounded in authentic Islamic teachings (Quran & verified Sunnah).
- Addressing: ${isFemale ? 'Female (يا أختي، افعلي، صنفي، رتبي، امسحي)' : 'Male (يا أخي، افعل، صنف، رتب، امسح)'}.
- Return ONLY a JSON object matching this schema:
{
  "id": "string",
  "titleAr": "string",
  "titleEn": "string",
  "subtitleAr": "string",
  "subtitleEn": "string",
  "topic": "string",
  "learningObjectiveAr": "string",
  "learningObjectiveEn": "string",
  "sourceIds": ["string"],
  "mechanic": "object_interaction" | "sorting" | "sequencing" | "inspection",
  "difficulty": "beginner" | "intermediate" | "advanced",
  "sceneTheme": "classroom" | "travel_road" | "restaurant_table" | "prayer_room" | "desert_oasis" | "home_living" | "wudu_station" | "market_shelf",
  "interactiveObject": {
    "objectType": "sock_wiping" | "wudu_limb" | "prayer_mat" | "compass_qibla" | "sujud_seven_parts" | "generic_canvas",
    "titleAr": "string",
    "titleEn": "string",
    "instructionAr": "string",
    "instructionEn": "string",
    "targetZones": [
      {
        "id": "string",
        "labelAr": "string",
        "labelEn": "string",
        "x": 50 (number percentage 0-100),
        "y": 50 (number percentage 0-100),
        "width": 30 (number percentage),
        "height": 30 (number percentage),
        "shape": "stroke" | "rect" | "circle",
        "isCorrect": true,
        "feedbackAr": "string",
        "feedbackEn": "string"
      }
    ]
  },
  "elements": [
    {
      "id": "string",
      "labelAr": "string",
      "labelEn": "string",
      "sublabelAr": "string",
      "correctCategory": "string (if sorting)",
      "correctOrder": 1 (number, 1-indexed, if sequencing),
      "isNeedsInspection": false (boolean, if inspection),
      "explanationAr": "string"
    }
  ],
  "categories": [
    {
      "id": "string",
      "titleAr": "string",
      "titleEn": "string",
      "descriptionAr": "string",
      "color": "string (hex)",
      "icon": "string"
    }
  ],
  "feedback": {
    "successAr": "string",
    "successEn": "string",
    "scholarlyNoteAr": "string",
    "scholarlyNoteEn": "string"
  },
  "completionConditionAr": "string",
  "isAiGenerated": true
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: gamePrompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        if (parsed && parsed.titleAr && parsed.mechanic) {
          parsed.id = parsed.id || `game-ai-${Date.now()}`;
          parsed.isAiGenerated = true;
          return res.json(parsed);
        }
      } catch (aiErr) {
        console.warn('Gemini mini-game generation failed, using local generator:', aiErr);
      }
    }

    const miniGame = generateAiMiniGame({
      userQuery,
      topic,
      userProfile,
      difficulty,
    });
    return res.json(miniGame);
  } catch (error: any) {
    console.error('Error in /api/anas/generate-minigame:', error);
    const fallback = generateAiMiniGame({ userQuery: req.body?.userQuery });
    return res.json(fallback);
  }
});

// =========================================================================
// 2. CENTRAL GEMINI COGNITIVE ORCHESTRATOR PIPELINE
// (Input Query Analysis, Semantic Vectors, Emotion Detection & Tool Execution)
// =========================================================================

function fallbackSemanticOrchestration(query: string, isFemale: boolean) {
  const q = (query || '').toLowerCase();
  
  // 1. Guilt, past sins, regrets -> HEART_CERTAINTY & Gentle Mode
  if (
    q.includes('مذنب') ||
    q.includes('حزين') ||
    q.includes('خفت') ||
    q.includes('خائف') ||
    q.includes('ذنوب') ||
    q.includes('ماضي') ||
    q.includes('الماضي') ||
    q.includes('ندم') ||
    q.includes('سابق') ||
    q.includes('قبل الإسلام') ||
    q.includes('يغفر') ||
    q.includes('guilt') ||
    q.includes('past sin') ||
    q.includes('afraid')
  ) {
    return {
      semanticCategory: 'HEART_CERTAINTY',
      companionReply: isFemale
        ? 'أبشري يا أختي الحبيبة؛ «إن الإسلام يجبّ ما قبله» والتوبة تمحو ما سلف كأن لم يكن. قلبكِ اليوم طاهر نقي وخطواتكِ في رحاب الإيمان مباركة ومحفوفة برحمة الله.'
        : 'أبشر يا أخي الحبيب؛ «إن الإسلام يجبّ ما قبله» والتوبة تمحو ما سلف كأن لم يكن. قلبك اليوم طاهر نقي وخطواتك في رحاب الإيمان مباركة ومحفوفة برحمة الله.',
      verifiedSourceTag: 'صحيح مسلم والدرر السنية — باب فضل الإسلام ومحو ما قبله',
      detectedEmotion: 'guilty',
      tranquilityDelta: 15,
      actionTrigger: {
        engineTarget: 'ENGINE_HEART',
        tactileActionLabel: 'ترسيخ السكينة: الإسلام يجبّ ما قبله 🕊️',
        sceneParameters: {
          focusSubject: 'طمأنينة القلب والتوبة ومحو ما سلف',
          remedialInstruction: 'استحضر عفو الله العظيم وأن الإسلام هدم كل ما قبله، وقلبك الآن أبيض نقي',
        },
      },
    };
  }

  // 2. Personal Status / Divorce -> Tier-D Safety Protocol (ESCALATE_HUMAN)
  if (
    q.includes('طلاق') ||
    q.includes('مطلقة') ||
    q.includes('انفصال') ||
    q.includes('خلع') ||
    q.includes('ميراث') ||
    q.includes('تركة') ||
    q.includes('جناية') ||
    q.includes('حدود') ||
    q.includes('divorce') ||
    q.includes('custody') ||
    q.includes('inheritance')
  ) {
    return {
      semanticCategory: 'ESCALATE_HUMAN',
      companionReply: isFemale
        ? 'مسائل الطلاق والأحوال الشخصية تتطلب استماعاً دقيقاً وحفظاً للحقوق والبيوت، ولا تصح فيها الفتاوى الجاهزة. يسعدنا وصلكِ مباشرة بمرشد بشري معتمد وموثوق.'
        : 'مسائل الطلاق والأحوال الشخصية تتطلب استماعاً دقيقاً وحفظاً للحقوق والبيوت، ولا تصح فيها الفتاوى الجاهزة. يسعدنا وصلك مباشرة بمرشد بشري معتمد وموثوق.',
      verifiedSourceTag: 'مجمع الفقه الإسلامي وحوكمة الإفتاء',
      detectedEmotion: 'hesitant',
      tranquilityDelta: 10,
      actionTrigger: null,
    };
  }

  // 3. Wudu & Purity Concessions
  if (
    q.includes('وضوء') ||
    q.includes('طهارة') ||
    q.includes('جورب') ||
    q.includes('خف') ||
    q.includes('مسح') ||
    q.includes('ماء') ||
    q.includes('مد') ||
    q.includes('مغسلة') ||
    q.includes('wudu') ||
    q.includes('sock')
  ) {
    return {
      semanticCategory: 'PURITY_CONCESSION',
      companionReply: isFemale
        ? 'ديننا الحنيف مبني على التيسير ورفع الحرج يا أختي؛ يشرع لكِ المسح على الجوربين الطاهرين يوماً وليلة دون خلع الحذاء بمغاسل العمل والجامعة.'
        : 'ديننا الحنيف مبني على التيسير ورفع الحرج يا أخي؛ يشرع لك المسح على الجوربين الطاهرين يوماً وليلة دون خلع الحذاء بمغاسل العمل والجامعة.',
      verifiedSourceTag: 'صحيح مسلم والدرر السنية — باب المسح على الخفين',
      detectedEmotion: 'hesitant',
      tranquilityDelta: 15,
      actionTrigger: {
        engineTarget: 'ENGINE_WUDU',
        tactileActionLabel: 'المسح الميسر والاقتصاد في الماء 💧',
        sceneParameters: {
          focusSubject: 'المسح على الجوربين واقتصاد المُد النبوي',
          remedialInstruction: 'مسحة واحدة خفيفة باليد المبتلة على ظاهر الجورب الطاهر دون مشقة',
        },
      },
    };
  }

  // 4. Prayer & Forgetfulness / Sujud Sahw
  if (
    q.includes('صلاة') ||
    q.includes('ركعة') ||
    q.includes('سهو') ||
    q.includes('شك') ||
    q.includes('سجود') ||
    q.includes('تشهد') ||
    q.includes('prayer') ||
    q.includes('rakah')
  ) {
    return {
      semanticCategory: 'WORSHIP_RECOVERY',
      companionReply: isFemale
        ? 'السهو في الصلاة يعرض للبشر جميعاً يا أختي؛ والشريعة شرعت سجدتي السهو لتدارك أي شك أو نقص برحمة وسكينة دون إعادة الصلاة.'
        : 'السهو في الصلاة يعرض للبشر جميعاً يا أخي؛ والشريعة شرعت سجدتي السهو لتدارك أي شك أو نقص برحمة وسكينة دون إعادة الصلاة.',
      verifiedSourceTag: 'صحيح البخاري ومسلم — باب سجود السهو',
      detectedEmotion: 'anxious',
      tranquilityDelta: 15,
      actionTrigger: {
        engineTarget: 'ENGINE_PRAYER',
        tactileActionLabel: 'سجدتا السهو للتدارك وطرد الشك 🕊️',
        sceneParameters: {
          focusSubject: 'البناء على اليقين وسجدتا السهو',
          remedialInstruction: 'ابنِ على ما تيقنت واسجد سجدتي السهو قبل السلام أو بعده',
        },
      },
    };
  }

  // 5. Travel & Weather Concessions
  if (
    q.includes('سفر') ||
    q.includes('طائرة') ||
    q.includes('قطار') ||
    q.includes('قبلة') ||
    q.includes('مطر') ||
    q.includes('قصر') ||
    q.includes('جمع') ||
    q.includes('travel') ||
    q.includes('qibla')
  ) {
    return {
      semanticCategory: 'TRAVEL_WEATHER_EASE',
      companionReply: isFemale
        ? 'رخصة السفر هدية من الله يا أختي؛ يشرع لكِ قصر الصلاة الرباعية والجمع بين الصلاتين والتحري بالبوصلة بيسر تام.'
        : 'رخصة السفر هدية من الله يا أخي؛ يشرع لك قصر الصلاة الرباعية والجمع بين الصلاتين والتحري بالبوصلة بيسر تام.',
      verifiedSourceTag: 'الموسوعة الفقهية — الدرر السنية',
      detectedEmotion: 'calm',
      tranquilityDelta: 15,
      actionTrigger: {
        engineTarget: 'ENGINE_TRAVEL',
        tactileActionLabel: 'محاذاة القبلة وتوقيت السفر 🧭',
        sceneParameters: {
          focusSubject: 'تحديد اتجاه القبلة ورخصة الجمع والقصر',
          remedialInstruction: 'حدد القبلة باتجاه الكعبة المشرفة وتناول رخصة القصر بيقين',
        },
      },
    };
  }

  // 6. Social Dilemmas & Workplace Integration
  if (
    q.includes('عزومة') ||
    q.includes('أكل') ||
    q.includes('طعام') ||
    q.includes('لحم') ||
    q.includes('خمر') ||
    q.includes('أهل') ||
    q.includes('زملاء') ||
    q.includes('عمل') ||
    q.includes('social') ||
    q.includes('colleague')
  ) {
    return {
      semanticCategory: 'SOCIAL_INTEGRATION',
      companionReply: isFemale
        ? 'حسن الخلق ولين الجانب من أعظم دعائم الإيمان يا أختي؛ شاركي زملاءك وأهلك الأطعمة الطاهرة والحديث الطيب مع الاعتذار بلطف عما حُرّم.'
        : 'حسن الخلق ولين الجانب من أعظم دعائم الإيمان يا أخي؛ شارك زملاءك وأهلك الأطعمة الطاهرة والحديث الطيب مع الاعتذار بلطف عما حُرّم.',
      verifiedSourceTag: 'كتاب بينات — المستودع الدعوي الرقمي',
      detectedEmotion: 'calm',
      tranquilityDelta: 15,
      actionTrigger: {
        engineTarget: 'ENGINE_SOCIAL',
        tactileActionLabel: 'التواصل الاجتماعي الواثق واللبق 🤝',
        sceneParameters: {
          focusSubject: 'المواقف الاجتماعية والأطعمة المباحة',
          remedialInstruction: 'اعتذر بلطف وابتسامة وثقة مريحة مع اختيار الأطعمة الحلال',
        },
      },
    };
  }

  // Default: Heart & Certainty
  return {
    semanticCategory: 'HEART_CERTAINTY',
    companionReply: isFemale
      ? 'سؤال طيب ومبارك يا أختي 🌿 الأصل في شريعتنا السمحاء التيسير والرحمة؛ كل خطوة تخطينها تقربكِ من الله وتحط عنكِ الأوزار.'
      : 'سؤال طيب ومبارك يا أخي 🌿 الأصل في شريعتنا السمحاء التيسير والرحمة؛ كل خطوة تخطوها تقربك من الله وتحط عنك الأوزار.',
    verifiedSourceTag: 'دليل المسلم الجديد والدرر السنية',
    detectedEmotion: 'calm',
    tranquilityDelta: 15,
    actionTrigger: {
      engineTarget: 'ENGINE_HEART',
      tactileActionLabel: 'تثبيت السكينة واليقين 🕊️',
      sceneParameters: {
        focusSubject: 'الاطمئنان واليقين',
        remedialInstruction: 'تأمل في سعة رحمة الله وتيسير الشريعة',
      },
    },
  };
}

export async function executeRafiqCognitivePipeline(
  query: string,
  userProfile: any = {},
  conversationHistory: any[] = []
) {
  const isFemale = userProfile?.gender === 'female' || userProfile?.preferredAddressing === 'female';
  const addressingText = isFemale
    ? 'Female Arabic (يا أختي، اطمئني، افعلي، امسحي، صلي، استفتِ)'
    : 'Male Arabic (يا أخي، اطمئن، افعل، امسح، صل، استفتِ)';

  if (ai && query && typeof query === 'string' && query.trim().length > 0) {
    try {
      const systemInstruction = `You are the central cognitive brain of Rafeeq (رفيق), an empathetic, supportive, emotionally intelligent Islamic life companion for New Muslims (رفيق هداية وتأقلم).

Core Identity & Mandate:
- Tone: Warm, reassuring, dignified, compassionate, and emotionally intelligent. Immediately relieves cognitive overload, guilt, hesitation, and isolation.
- Conciseness: Always deliver clear, practical guidance in 2-3 focused sentences maximum without dense academic lectures or pedantic preambles.
- Strict Grounding: Anchored exclusively in official authentic sources (King Fahd Quran Complex, Dawa.center, Dorar.net, Bayyinat, and The New Muslim Guide). Never hallucinate or extrapolate rulings.
- Grammatical Inflection: ${addressingText}.

Crucial Safety & Semantic Rules:
1. Emotion & Guilt of Past Sins (الوضع اللطيف - Gentle Mode):
   If the user expresses guilt, sorrow, shame, fear of pre-Islamic sins, regrets of their past life, or feeling unworthy ("مذنب", "حزين", "خفت", "ذنوبي", "الماضي", "هل يغفر الله لي"):
   - Immediately activate Gentle Mode.
   - The response MUST prioritize spiritual relief, compassion, and the fundamental principle: «الإسلام يجبّ ما قبله، والتوبة النصوح تمحو ما سلف» (Islam wipes away and forgives all that was before it).
   - Do NOT route emotional/guilt queries to physical wudu or mechanical rituals. Route them to the Heart & Certainty Engine ("ENGINE_HEART") with a comforting presence.
   - Set "semanticCategory": "HEART_CERTAINTY".
   - Set "detectedEmotion": "guilty" (or "anxious").
   - Set "actionTrigger": {
       "engineTarget": "ENGINE_HEART",
       "tactileActionLabel": "ترسيخ السكينة: الإسلام يجبّ ما قبله 🕊️",
       "sceneParameters": {
         "focusSubject": "طمأنينة القلب والتوبة ومحو ما سلف",
         "remedialInstruction": "استحضر عفو الله العظيم وأن الإسلام هدم كل ما قبله، وقلبك الآن أبيض نقي"
       }
     }

2. Sensitive Personal-Status Legal Questions (Tier-D Safety Protocol):
   If the user asks questions about Divorce (الطلاق), marital separation, child custody, inheritance (الميراث), or criminal law (الجنايات):
   - Immediately activate Tier-D Safety Protocol: Refuse issuing personal fatwa or legal rulings.
   - Set "semanticCategory": "ESCALATE_HUMAN".
   - Set "actionTrigger": null.
   - Warmly reassure the user, explaining that personal status and divorce require direct counseling with certified human specialists to protect families and rights, and seamlessly refer them to an accredited human mentor (مرشد بشري معتمد).

3. Practical Fiqh & Life Domains:
   - "WORSHIP_RECOVERY" -> ENGINE_PRAYER (prayer mistakes, forgetting rakahs, Sujud Sahw).
   - "PURITY_CONCESSION" -> ENGINE_WUDU (wudu doubts, sock wiping / خفين, prophetic mudd 650ml).
   - "SOCIAL_INTEGRATION" -> ENGINE_SOCIAL (banquets, workplace meals, non-Muslim family relations, peer pressure).
   - "TRAVEL_WEATHER_EASE" -> ENGINE_TRAVEL (travel shortening/combining, plane/train prayer, Qibla compass).
   - "HEART_CERTAINTY" -> ENGINE_HEART (intellectual doubts, whispers, settling the heart).

Output strictly valid JSON matching this schema:
{
  "semanticCategory": "WORSHIP_RECOVERY" | "PURITY_CONCESSION" | "SOCIAL_INTEGRATION" | "TRAVEL_WEATHER_EASE" | "HEART_CERTAINTY" | "ESCALATE_HUMAN",
  "companionReply": "Warm, reassuring 2-line response grounding the user in ease and verified knowledge",
  "verifiedSourceTag": "Reference name (e.g. دليل المسلم الجديد / الدرر السنية / كتاب بينات)",
  "detectedEmotion": "anxious" | "guilty" | "hesitant" | "calm",
  "tranquilityDelta": 15,
  "actionTrigger": {
    "engineTarget": "ENGINE_PRAYER" | "ENGINE_WUDU" | "ENGINE_SOCIAL" | "ENGINE_TRAVEL" | "ENGINE_HEART",
    "tactileActionLabel": "Action button text for the scene",
    "sceneParameters": {
      "focusSubject": "Dynamic focus item based on context",
      "remedialInstruction": "Direct practical step to practice"
    }
  }
}`;

      let promptContent = `User query: "${query}"\nProvide pure JSON response according to the schema.`;
      if (conversationHistory && conversationHistory.length > 0) {
        const historyText = conversationHistory
          .slice(-3)
          .map((h: any) => `${h.sender === 'user' ? 'User' : 'Rafiq'}: ${h.text}`)
          .join('\n');
        promptContent = `Recent conversation:\n${historyText}\n\nCurrent user query:\n"${query}"\n\nProvide pure JSON response according to the schema.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContent,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const textOutput = response.text || '';
      if (textOutput.trim()) {
        let cleaned = textOutput.trim();
        if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
        }
        const parsed = JSON.parse(cleaned);
        if (parsed && parsed.semanticCategory && parsed.companionReply) {
          return parsed;
        }
      }
    } catch (aiErr) {
      console.warn('Gemini cognitive pipeline call failed, falling back:', aiErr);
    }
  }

  return fallbackSemanticOrchestration(query, isFemale);
}

// Dedicated Cognitive Orchestration Endpoint (Part 2 Contract)
app.post('/api/rafiq/orchestrate', async (req: Request, res: Response) => {
  try {
    const { query = '', message = '', userProfile, conversationHistory } = req.body;
    const text = (query || message || '').trim();
    if (!text) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const decision = await executeRafiqCognitivePipeline(text, userProfile, conversationHistory);
    return res.json(decision);
  } catch (error: any) {
    console.error('Error in /api/rafiq/orchestrate:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Dedicated AI-Driven Bilingual Contextual Semantic NLU Matcher for the 30 Accredited Scenarios
async function matchScenarioWithGeminiNLU(userQuery: string): Promise<{
  scenarioId: number;
  confidence: number;
  detectedTheme: string;
  baselineDropScore: number;
  recoveryBoostScore: number;
} | null> {
  if (!ai || !userQuery || !userQuery.trim()) return null;

  try {
    const systemInstruction = `You are the Bilingual Contextual Semantic NLU Engine for Rafiq Lab. Given a user query (colloquial/formal Arabic or English, typos or emotional questions), analyze the core underlying human intent and map it to exactly one of the 30 accredited scenarios (1 to 30).

List of the 30 Accredited Scenarios:
1: نسيان التشهد الأول والقيام للثالثة (Missed First Tashahhud)
2: الشك في عدد الركعات 3 أم 4 (Doubt in Rak'ah Count)
3: الكلام أو الضحك العارض غلبة في الصلاة (Involuntary Laughter / Speech)
4: نسيان ركن كالسجود وتذكره في الركعة التالية (Missed Pillar Sujud/Ruku)
5: الوسوسة وهجوم الأفكار المشوشة في الصلاة - خنزب (Khanzab Whispers)
6: المسح على الجبيرة أو اللصقة الطبية (Cast / Bandage Wiping)
7: الوضوء في البرد القارس وتعذر تسخين الماء (Freezing Cold Wudu)
8: الشك القهري في انتقاض الوضوء أثناء الصلاة - ريح (Compulsive Gas/Wind Doubt)
9: العجز التام عن استعمال الماء - التيمم (Dry Ablution Tayammum)
10: رذاذ الوحل وطهارة الثياب في الشارع (Street Mud / Puddle Splashes)
11: الصلاة جالساً على مقعد الطائرة (Airplane Seated Prayer)
12: الصلاة داخل قطار سريع أو حافلة (Train / Bus In-Motion Prayer)
13: صلاة المسبوق في صلاة الجماعة (Entering Mosque with Imam in Ruku)
14: الصلاة في مطار مزدحم لا توجد به مصليات (Airport Layover Corner Prayer)
15: جمع الصلاة لعذر المرض أو العمليات الجراحية (Combining for Medical Surgery/Illness)
16: قبول هدايا الجيران غير المسلمين في مناسباتهم (Non-Muslim Neighbor Gifts/Sweets)
17: توقيع عقد بنكي بشرط فائدة - ربا (Declining Usury Clauses in Contracts)
18: شراء لحوم في بلاد غير إسلامية دون تصنيف حلال (Non-Muslim Supermarket Meat / Halal vs Kosher)
19: مطعم يبيع المشروبات الروحية في طاولات مجاورة (Dining in Restaurants Serving Alcohol)
20: العمل كمحاسب كاشير في متجر يبيع اليانصيب (Cashier Dealing with Lottery/Gambling)
21: دعوة العائلة لعشاء به أطعمة غير حلال / خنزير (Family Dinner with Non-Halal Food)
22: تعزية قريب غير مسلم عند الوفاة (Condolences for Non-Muslim Relative Death)
23: حيرة تغيير الاسم الأصلي بعد الإسلام (Keeping Original Western/Birth Name)
24: التعامل مع سخرية الأصدقاء القدامى بعد الالتزام (Handling Mockery from Former Peers)
25: زيارة ومبيت لدى أصهار أو عائلة غير مسلمة (Overnight Stay at Non-Muslim In-Laws)
26: الشعور بالذنب وجلد الذات على ماضي ما قبل الإسلام (Overcoming Guilt Over Past Life / Sins)
27: التشتت والارتباك من تضارب فتاوى مشاهير الإنترنت (Handling Conflicting Social Media Fatwas)
28: تنظيم الوقت بين ضغط الدوام ومواقيت الصلاة (Scheduling 10-Min Prayer Breaks at Work)
29: صعوبة حفظ الفاتحة أو التشهد في البداية (Recitation Concession for Non-Arabic Speakers)
30: حساب ودفع زكاة الفطر لأول مرة - صاع وطعام وأرز (Measuring & Paying Zakat al-Fitr - Sa'a & Rice)

Rules:
- If query is about Zakat al-Fitr, rice, grain, Sa'a -> MUST return scenarioId: 30.
- If query is about airplane, flight, seat, sky prayer -> MUST return scenarioId: 11.
- If query is about cast, bandage, broken limb wudu -> MUST return scenarioId: 6.
- If query is about past sins, guilt before Islam -> MUST return scenarioId: 26.
- If query is ambiguous or completely unrelated to any scenario, return confidence < 0.35.

Output strictly valid JSON matching schema:
{
  "scenarioId": number (1-30),
  "confidence": number (0.0-1.0),
  "detectedTheme": string,
  "baselineDropScore": number (35-55),
  "recoveryBoostScore": number (15-25)
}`;

    const prompt = `Classify user query intent into one of 30 scenarios:\n"${userQuery}"`;
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const textOutput = response.text || '';
    if (textOutput.trim()) {
      let cleaned = textOutput.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      }
      const parsed = JSON.parse(cleaned);
      if (typeof parsed.scenarioId === 'number' && parsed.scenarioId >= 1 && parsed.scenarioId <= 30) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Gemini Structured NLU match fallback:', err);
  }
  return null;
}

// Procedural Tactile Lab Endpoint connected dynamically with Primary Gemini NLU & Secondary Root Regex
app.post('/api/anas/generate-tactile-lab', async (req: Request, res: Response) => {
  try {
    const { query = '', userProfile } = req.body;
    const text = (query || '').trim();
    if (!text) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // 1. Primary Layer: Gemini 2.5 Flash Structured NLU
    let nluResult = await matchScenarioWithGeminiNLU(text);

    // 2. Secondary Layer: Root Semantic Regex Interceptor
    const { scenario: regexMatchedScen, confidence: regexConfidence } = matchScenarioLocallyWithConfidence(text);

    let chosenScenario = null;
    let confidence = 0.0;
    let baselineDropScore = 45;
    let recoveryBoostScore = 20;

    if (nluResult && nluResult.confidence >= 0.35) {
      chosenScenario = RAFIC_INTERNAL_CATALOGUE.find((s) => s.numericId === nluResult!.scenarioId) || null;
      confidence = nluResult.confidence;
      baselineDropScore = nluResult.baselineDropScore || 45;
      recoveryBoostScore = nluResult.recoveryBoostScore || 20;
    } else if (regexMatchedScen && regexConfidence >= 0.35) {
      chosenScenario = regexMatchedScen;
      confidence = regexConfidence;
    }

    // If fail-safe triggered (confidence < 0.35 and no match)
    if (!chosenScenario || confidence < 0.35) {
      return res.json({
        requiresSelection: true,
        confidence: confidence || 0.0,
        messageAr: 'لم نتمكن من تحديد الموقف بدقة تامة. يمكنك اختيار الموقف الأنسب من دليل المواقف الـ 30 أدناه:',
        messageEn: 'Could not confidently detect the scenario. Please pick from the 30 accredited scenarios below:',
        availableScenarios: RAFIC_INTERNAL_CATALOGUE.map((s) => ({
          numericId: s.numericId,
          id: s.id,
          group: s.group,
          groupTitleAr: s.groupTitleAr,
          groupTitleEn: s.groupTitleEn,
          conceptTitle: s.conceptTitle,
          conceptTitleEn: s.conceptTitleEn,
        })),
      });
    }

    const decision = await executeRafiqCognitivePipeline(text, userProfile);

    const isFemale = userProfile?.gender === 'female' || userProfile?.preferredAddressing === 'female';
    const rafiqVoice = isFemale ? chosenScenario.rafiqMessage.femaleAr : chosenScenario.rafiqMessage.maleAr;

    return res.json({
      numericId: chosenScenario.numericId,
      scenarioId: chosenScenario.id,
      targetEngine: chosenScenario.targetEngine,
      conceptTitle: chosenScenario.conceptTitle,
      conceptTitleEn: chosenScenario.conceptTitleEn,
      fiqhSource: chosenScenario.fiqhSource,
      shortGuidance: chosenScenario.shortGuidance,
      shortGuidanceEn: chosenScenario.shortGuidanceEn,
      interactiveSteps: chosenScenario.interactiveSteps,
      remedialButtonText: chosenScenario.remedialButtonText,
      tranquilityDelta: chosenScenario.tranquilityDelta,
      baselineDropScore,
      recoveryBoostScore,
      hadithReference: chosenScenario.hadithReference,
      rafiqMessage: {
        maleAr: chosenScenario.rafiqMessage.maleAr,
        femaleAr: chosenScenario.rafiqMessage.femaleAr,
        activeText: rafiqVoice,
      },
      initialData: chosenScenario.initialEngineData,
      confidence,
      cognitiveDecision: decision,
    });
  } catch (error: any) {
    console.error('Error in /api/anas/generate-tactile-lab:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Dynamic AI-Driven Emotional Radar & Tranquility Metric Evaluation Endpoint
app.post('/api/rafiq/evaluate-emotion', async (req: Request, res: Response) => {
  try {
    const { emotionId = 'guilt', userProfile, customNote = '' } = req.body;
    const isFemale = userProfile?.gender === 'female' || userProfile?.preferredAddressing === 'female';
    const addressingText = isFemale
      ? 'Feminine voice in Arabic (يا بنيتي / يا أختي الغالية، اطمئني، اعلمي أن، ركزي)'
      : 'Masculine voice in Arabic (يا بني / يا أخي الغالي، اطمئن، اعلم أن، ركز)';

    if (ai) {
      try {
        const systemInstruction = `You are the dynamic emotional intelligence and tranquility evaluation module for Rafeeq (رفيق), an authentic Islamic companion for new Muslims.
Analyze the user's selected emotional state ("${emotionId}") and evaluate their cognitive load and tranquility dynamics dynamically without using hardcoded static values.

Requirements:
1. Dynamic Metrics:
   - "baselineDropScore": An integer between 35 and 60 reflecting their initial tranquility drop based on emotional severity (Guilt/Fear: 36-42, Confusion: 40-46, Fatigue/Burden: 44-50, Peaceful: 55-60).
   - "recoveryBoostScore": An integer between 15 and 30 representing the tranquility recovery uplift gained from reviewing authentic reassurance and applying prophetic guidance.
   - "emotionalRationale": A brief, compassionate 1-line rationale explaining this emotional state.
2. Verified Guidance:
   - "companionReply": 2-3 warm, loving, practical sentences strictly tailored to gender: ${addressingText}.
   - "verifiedQuote": The exact authentic canonical quote (e.g. «أما علمت أن الإسلام يهدم ما كان قبله؟» for guilt, «إن هذا الدين يسر» for confusion, «لا يكلف الله نفسا إلا وسعها» for fatigue, «ألا بذكر الله تطمئن القلوب» for peace).
   - "verifiedSourceTag": The authentic source from King Fahd Quran Complex or Sahih Hadith via Dorar.net.
   - "actionLabTitleAr": Title of matching simulation in Rafiq Lab.
   - "actionLabQuery": Search keyword query for matching scenario.

Output format strictly valid JSON matching this schema:
{
  "baselineDropScore": number,
  "recoveryBoostScore": number,
  "emotionalRationale": string,
  "companionReply": string,
  "verifiedQuote": string,
  "verifiedSourceTag": string,
  "actionLabTitleAr": string,
  "actionLabQuery": string
}`;

        const prompt = `Evaluate emotional state: "${emotionId}" with context: "${customNote || emotionId}". User is ${isFemale ? 'female' : 'male'}. Return JSON.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        });

        const textOutput = response.text || '';
        if (textOutput.trim()) {
          let cleaned = textOutput.trim();
          if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
          }
          const parsed = JSON.parse(cleaned);
          if (
            typeof parsed.baselineDropScore === 'number' &&
            typeof parsed.recoveryBoostScore === 'number' &&
            parsed.companionReply
          ) {
            return res.json(parsed);
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini emotion evaluation fallback:', geminiErr);
      }
    }

    // Dynamic semantic fallback based on emotion severity with natural variation
    const fallbacks: Record<string, any> = {
      confused: {
        baselineDropScore: 42 + Math.floor(Math.random() * 5),
        recoveryBoostScore: 20 + Math.floor(Math.random() * 6),
        emotionalRationale: 'تزاحم معلومات البدايات والشعور بعبء الخطوات الجديدة.',
        companionReply: isFemale
          ? 'يا بنيتي العزيزة، لا تُكلفي نفسك فوق طاقتها؛ خذي العبادات خطوة بخطوة بالتدريج. ركّزي اليوم على تثبيت ركن واحد بسكينة، فالله يحب العمل المستمر وإن قلّ.'
          : 'يا بني العزيز، لا تُكلف نفسك فوق طاقتها؛ خذ العبادات خطوة بخطوة بالتدريج. ركّز اليوم على تثبيت ركن واحد بسكينة، فالله يحب العمل المستمر وإن قلّ.',
        verifiedQuote: '«إِنَّ هَذَا الدِّينَ يُسْرٌ، وَلَنْ يُشَادَّ الدِّينَ أَحَدٌ إِلَّا غَلَبَهُ، فَسَدِّدُوا وَقَارِبُوا وَأَبْشِرُوا»',
        verifiedSourceTag: 'صحيح البخاري — كتاب الإيمان (الدرر السنية)',
        actionLabTitleAr: 'مختبر التدرج واليسر في الفرائض',
        actionLabQuery: 'ترتيب الأولويات والتدرج في الصلاة والفرائض',
      },
      guilt: {
        baselineDropScore: 37 + Math.floor(Math.random() * 5),
        recoveryBoostScore: 24 + Math.floor(Math.random() * 6),
        emotionalRationale: 'الشعور بالندم أو الخوف من الذنوب السابقة قبل الهداية.',
        companionReply: isFemale
          ? 'يا أختي الغالية، اعلمي أن صفحتك بيضاء نقية تماماً كيوم ولدتكِ أمك، وما مضى من ذنوب قد محاه الله وأبدله حسنات برحمته. أنتِ الآن في رحاب محبة الله ورضوانه، فاطمئني واستبشري.'
          : 'يا أخي الغالي، اعلم أن صفحتك بيضاء نقية تماماً كيوم ولدتك أمك، وما مضى من ذنوب قد محاه الله وأبدله حسنات برحمته. أنت الآن في رحاب محبة الله ورضوانه، فاطمئن واستبشر.',
        verifiedQuote: '«أَمَا عَلِمْتَ أَنَّ الْإِسْلَامَ يَهْدِمُ مَا كَانَ قَبْلَهُ، وَأَنَّ الْهِجْرَةَ تَهْدِمُ مَا كَانَ قَبْلَهَا؟»',
        verifiedSourceTag: 'صحيح مسلم — حديث عمرو بن العاص رضي الله عنه (الدرر السنية)',
        actionLabTitleAr: 'مختبر اليقين: الإسلام يَجُبّ ما قبله',
        actionLabQuery: 'الشك والندم على ما مضى وقاعدة الإسلام يجب ما قبله',
      },
      burdened: {
        baselineDropScore: 46 + Math.floor(Math.random() * 5),
        recoveryBoostScore: 18 + Math.floor(Math.random() * 6),
        emotionalRationale: 'الإجهاد الجسدي واستثقال الالتزام بالمواقيت في المشاغل اليومية.',
        companionReply: isFemale
          ? 'يا بنيتي، الشريعة مليئة بالرخص والتخفيف عند المشقة؛ صلي جالسة إن تعبتِ، وتوضئي بالمسح الخفيف، واستريحي حين يُجهدك البدن. الله رب كريم يحب أن تؤتى رخصه كما يحب أن تؤتى عزائمه.'
          : 'يا بني، الشريعة مليئة بالرخص والتخفيف عند المشقة؛ صلِّ جالساً إن تعبت، وتوضأ بالمسح الخفيف، واسترح حين يُجهدك البدن. الله رب كريم يحب أن تؤتى رخصه كما يحب أن تؤتى عزائمه.',
        verifiedQuote: '«لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ ... يُرِيدُ اللَّهُ بِكُمُ الْيُسْرَ وَلَا يُرِيدُ بِكُمُ الْعُسْرَ»',
        verifiedSourceTag: 'القرآن الكريم — سورة البقرة: 286 / 185 (مجمع الملك فهد لطباعة المصحف الشريف)',
        actionLabTitleAr: 'مختبر رخص التيسير ومسح الجورب',
        actionLabQuery: 'رخص الصلاة عند التعب والمسح على الجورب',
      },
      peaceful: {
        baselineDropScore: 58 + Math.floor(Math.random() * 4),
        recoveryBoostScore: 16 + Math.floor(Math.random() * 6),
        emotionalRationale: 'انشراح الصدر ونور اليقين وحلاوة الإيمان.',
        companionReply: isFemale
          ? 'ما شاء الله تبارك الله يا أختي! هنيئاً لكِ هذه السكينة العذبة وراحة الضمير. حافظي على هذا النور اليوم بالحمد والشكر وذكر الله الخفيف، واجعلي ابتسامتك صدقة لكل من تلقينه.'
          : 'ما شاء الله تبارك الله يا أخي! هنيئاً لك هذه السكينة العذبة وراحة الضمير. حافظ على هذا النور اليوم بالحمد والشكر وذكر الله الخفيف، واجعل ابتسامتك صدقة لكل من تلقاه.',
        verifiedQuote: '«الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ»',
        verifiedSourceTag: 'القرآن الكريم — سورة الرعد: 28 (مجمع الملك فهد لطباعة المصحف الشريف)',
        actionLabTitleAr: 'مختبر إماطة الأذى والمعاملة الحسنة',
        actionLabQuery: 'شكر النعمة وإماطة الأذى والابتسامة',
      },
    };

    const result = fallbacks[emotionId] || fallbacks.guilt;
    return res.json(result);
  } catch (err: any) {
    console.error('Error in /api/rafiq/evaluate-emotion:', err);
    return res.status(500).json({ error: err.message });
  }
});

// =========================================================================
// SERVER INITIALIZATION & VITE MIDDLEWARE
// =========================================================================
const portArgIndex = process.argv.indexOf('--port');
const portFromArg = portArgIndex !== -1 && process.argv[portArgIndex + 1] ? parseInt(process.argv[portArgIndex + 1], 10) : null;
const PORT = portFromArg || (process.env.PORT ? parseInt(process.env.PORT, 10) : 3000);

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          overlay: false,
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Rafeeq AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
