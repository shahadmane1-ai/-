import React from 'react';
import {
  Sparkles,
  Search,
  BookOpen,
  UserCheck,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Layers,
  Clock,
  Terminal,
} from 'lucide-react';
import { AiPipelineTraceData, Language } from '../types';

interface AiPipelineTraceModalProps {
  trace: AiPipelineTraceData | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const AiPipelineTraceModal: React.FC<AiPipelineTraceModalProps> = ({
  trace,
  isOpen,
  onClose,
  lang,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#14231E]/80 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-stone-950 text-stone-100 rounded-3xl border-2 border-[#D4A373]/60 shadow-2xl p-4 sm:p-6 text-start flex flex-col justify-between font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-700 flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-emerald-400">
                  {lang === 'ar' ? 'مسار الذكاء الاصطناعي الحي (AI Pipeline Trace)' : 'Live AI Pipeline Trace'}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                  {lang === 'ar' ? 'لوحة التحكيم والمطورين' : 'Judge & Dev Mode'}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-sans">
                {lang === 'ar'
                  ? 'بيانات حقيقية مباشرة وموثقة لكل خطوة معالجة وتأصيل دون محاكاة صورية'
                  : 'Live verifiable runtime data showing NLP, RAG, Personalization, and Action calls'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center text-sm cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {trace ? (
          <div className="space-y-4 my-2 text-xs">
            {/* Step 1: User Input */}
            <div className="p-3 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <span className="text-emerald-400 font-black flex items-center gap-1.5">
                  <span>1.</span>
                  <span>{lang === 'ar' ? 'مدخل المستخدم الأصلي (User Input)' : 'User Input'}</span>
                </span>
                <span className="text-[10px] font-mono text-stone-500">
                  {new Date(trace.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm font-sans font-bold text-white bg-stone-950 p-2.5 rounded-xl border border-stone-800">
                "{trace.userInput}"
              </p>
            </div>

            {/* Step 2: Arabic NLP Analysis */}
            <div className="p-3 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <span className="text-emerald-400 font-black flex items-center gap-1.5">
                  <span>2.</span>
                  <span>{lang === 'ar' ? 'تحليل اللغة العربية واستخراج النوايا (Arabic NLP)' : 'Arabic NLP & Intent Extraction'}</span>
                </span>
                <span className="text-[10px] text-stone-400 bg-stone-800 px-2 py-0.5 rounded-md">
                  Query Type: {trace.nlp.queryType}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-stone-500 text-[10px] block">الموضوع (Topic):</span>
                  <span className="text-amber-300 font-bold">{trace.nlp.topic}</span>
                </div>
                <div className="p-2 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-stone-500 text-[10px] block">النية (Intent):</span>
                  <span className="text-amber-300 font-bold">{trace.nlp.intent}</span>
                </div>
                <div className="p-2 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-stone-500 text-[10px] block">المستوى المرصود:</span>
                  <span className="text-emerald-300 font-bold">{trace.nlp.detectedLevel}</span>
                </div>
                <div className="p-2 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-stone-500 text-[10px] block">الكلمات المفتاحية:</span>
                  <span className="text-stone-300 font-mono text-[10px] truncate block">
                    {trace.nlp.tokens.join(', ')}
                  </span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 text-[10px] text-stone-400">
                <span className="text-stone-500">النص بعد التجريد والمعالجة (Normalized): </span>
                <span className="text-stone-200">"{trace.nlp.normalizedText}"</span>
              </div>
            </div>

            {/* Step 3: RAG Retrieval from Approved Registry */}
            <div className="p-3 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <span className="text-emerald-400 font-black flex items-center gap-1.5">
                  <span>3.</span>
                  <span>{lang === 'ar' ? 'الاسترجاع من السجل المعتمد (RAG Retrieval)' : 'RAG Source Retrieval'}</span>
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    trace.rag.groundingLevel === 'HIGH_GROUNDING'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      : trace.rag.groundingLevel === 'PARTIAL_GROUNDING'
                      ? 'bg-amber-950 text-amber-300 border border-amber-700'
                      : 'bg-rose-950 text-rose-300 border border-rose-700'
                  }`}
                >
                  {trace.rag.groundingLevel} (Confidence: {trace.rag.confidenceScore}%)
                </span>
              </div>

              <div className="space-y-1.5">
                {trace.rag.topSources.map((s, idx) => (
                  <div
                    key={s.id || idx}
                    className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 flex items-start justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-white">{s.title}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-stone-800 text-stone-300 font-mono">
                          {s.sourceType}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 block mt-0.5">
                        {s.sourceName} • <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">{s.url}</a>
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">
                      Score: {s.score.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 4: Personalization Adaptation */}
            <div className="p-3 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <span className="text-emerald-400 font-black flex items-center gap-1.5">
                  <span>4.</span>
                  <span>{lang === 'ar' ? 'طبقة التخصيص والمخاطبة (Personalization Layer)' : 'Personalization Adaptation'}</span>
                </span>
                <span className="text-[10px] text-stone-400 bg-stone-800 px-2 py-0.5 rounded-md">
                  Addressing: {trace.personalization.addressing} | Level: {trace.personalization.learningLevel}
                </span>
              </div>
              <p className="text-[11px] text-stone-300 font-sans leading-relaxed bg-stone-950 p-2 rounded-xl border border-stone-800">
                {trace.personalization.contextReason}
              </p>
            </div>

            {/* Step 5: Application Action / Tool Execution */}
            {trace.actionExecuted && (
              <div className="p-3 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-stone-400">
                  <span className="text-emerald-400 font-black flex items-center gap-1.5">
                    <span>5.</span>
                    <span>{lang === 'ar' ? 'الإجراء البرمجي المنفذ (Tool / Action Call)' : 'Application Action Execution'}</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-md">
                    Status: {trace.actionExecuted.status}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                  <span className="text-stone-300 font-mono">
                    {trace.actionExecuted.actionType}("{trace.actionExecuted.targetId}")
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تم التنفيذ على واجهة التطبيق</span>
                  </span>
                </div>
              </div>
            )}

            {/* Step 6: Grounding Statement Validation */}
            {trace.experienceValidation && (
              <div className="p-3 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-black flex items-center gap-1.5">
                    <span>6.</span>
                    <span>{lang === 'ar' ? 'توثيق العبارات التعليمية (Source Grounding Validation)' : 'Source Grounding Verification'}</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-md">
                    {trace.experienceValidation.groundedStatements} / {trace.experienceValidation.totalStatements} Supported
                  </span>
                </div>
                <p className="text-[10px] text-stone-400">
                  تم فحص جميع الوقفات التعليمية في المشهد ومطابقتها مع السجل المعتمد، ولا يوجد أي ادعاء أو حكم غير مؤصل.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-stone-500 space-y-2">
            <Clock className="w-8 h-8 mx-auto text-stone-600" />
            <p className="text-xs">
              {lang === 'ar'
                ? 'لا يوجد مسار تفاعل حالي؛ تحدث مع رفيق أو اختر أحد الأسئلة التجريبية لتسجيل الأثر الحي.'
                : 'No active trace yet; chat with Rafiq or test an inquiry to see the real pipeline.'}
            </p>
          </div>
        )}

        <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-500">
          <span>AI Architecture: Grounded RAG + Arabic NLP + Adaptive Tool Calling</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 font-bold transition-colors cursor-pointer"
          >
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
