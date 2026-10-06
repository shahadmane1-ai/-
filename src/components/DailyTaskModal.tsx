import React, { useState } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  Compass,
  Search,
  Heart,
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Volume2,
} from 'lucide-react';
import { DailyTask, Language } from '../types';
import { playPeaceChime, playSoftTap } from '../utils/audio';

interface DailyTaskModalProps {
  task: DailyTask | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (taskId: string) => void;
  isCompleted: boolean;
  lang: Language;
}

export const DailyTaskModal: React.FC<DailyTaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onComplete,
  isCompleted,
  lang,
}) => {
  if (!isOpen || !task) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#14231E]/80 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white/98 backdrop-blur-md rounded-3xl border-2 border-[#D4A373]/50 shadow-2xl p-5 sm:p-6 text-start flex flex-col justify-between max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D4A373]/25 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#88C947]/20 text-[#2C483F] border border-[#88C947]/40 flex items-center gap-1 font-mono">
              <CheckSquare className="w-3.5 h-3.5 text-[#2C483F]" />
              <span>{lang === 'ar' ? `مهمة اليوم ${task.day}` : `Day ${task.day} Task`}</span>
            </span>
          </div>

          <h4 className="text-sm sm:text-base font-black text-[#2C483F]">
            {lang === 'ar' ? task.title.ar : task.title.en}
          </h4>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Task Specific Interactive Content */}
        <div className="my-4">
          <TaskContentDispatcher
            task={task}
            lang={lang}
            isCompleted={isCompleted}
            onComplete={() => {
              playPeaceChime();
              onComplete(task.taskId);
            }}
          />
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// TASK CONTENT DISPATCHER
// =========================================================================
interface TaskContentProps {
  task: DailyTask;
  lang: Language;
  isCompleted: boolean;
  onComplete: () => void;
}

const TaskContentDispatcher: React.FC<TaskContentProps> = ({
  task,
  lang,
  isCompleted,
  onComplete,
}) => {
  switch (task.taskId) {
    case 'task-day-1':
      return <TaskDay1NoticePrayer task={task} lang={lang} isCompleted={isCompleted} onComplete={onComplete} />;
    case 'task-day-2':
      return <TaskDay2Qiblah task={task} lang={lang} isCompleted={isCompleted} onComplete={onComplete} />;
    case 'task-day-3':
      return <TaskDay3VerifyProduct task={task} lang={lang} isCompleted={isCompleted} onComplete={onComplete} />;
    case 'task-day-4':
      return <TaskDay4Encouragement task={task} lang={lang} isCompleted={isCompleted} onComplete={onComplete} />;
    case 'task-day-5':
      return <TaskDay5LearnConcession task={task} lang={lang} isCompleted={isCompleted} onComplete={onComplete} />;
    case 'task-day-6':
      return <TaskDay6FridayPrayer task={task} lang={lang} isCompleted={isCompleted} onComplete={onComplete} />;
    case 'task-day-7':
      return <TaskDay7KindnessParent task={task} lang={lang} isCompleted={isCompleted} onComplete={onComplete} />;
    default:
      return (
        <div className="p-4 text-center space-y-3">
          <p className="text-xs text-stone-600">{lang === 'ar' ? task.description.ar : task.description.en}</p>
          <button
            type="button"
            onClick={onComplete}
            className="px-6 py-2 rounded-xl bg-[#2C483F] text-white text-xs font-bold"
          >
            {lang === 'ar' ? 'إتمام المهمة' : 'Complete Task'}
          </button>
        </div>
      );
  }
};

// =========================================================================
// DAY 1 TASK: لاحظ الصلاة في يومك
// =========================================================================
const TaskDay1NoticePrayer: React.FC<TaskContentProps> = ({ task, lang, isCompleted, onComplete }) => {
  const [routines, setRoutines] = useState<Record<string, string>>({
    fajr: '',
    dhuhr: '',
    asr: '',
    maghrib: '',
    isha: '',
  });

  const prayers = [
    {
      id: 'fajr',
      nameAr: 'صلاة الفجر (الفجر)',
      nameEn: 'Fajr Prayer (Dawn)',
      optionsAr: ['الاستيقاظ والبدء بنشاط', 'النوم والراحة العميقة', 'الهدوء والسكينة الباكرة'],
      optionsEn: ['Waking up & active start', 'Deep rest & sleep', 'Early morning quietude'],
      tipsAr: '✨ استراحة الفجر تمنح يومك طاقة مباركة وسكينة تبدأ بها صباحك بنور وطمأنينة.',
      tipsEn: '✨ The dawn prayer instills early barakah (blessing) and serene energy to start your day beautifully.',
    },
    {
      id: 'dhuhr',
      nameAr: 'صلاة الظهر (الظهر)',
      nameEn: 'Dhuhr Prayer (Noon)',
      optionsAr: ['العمل المتواصل أو الدراسة', 'التواجد في المنزل', 'الاستراحة من مشاغل النهار'],
      optionsEn: ['Active work / Study', 'Staying at home', 'Midday relaxation break'],
      tipsAr: '✨ صلاة الظهر واحة في منتصف النهار تفصلك عن ضغوط العمل والدراسة لتستعيد هدوءك النفسي.',
      tipsEn: '✨ Dhuhr is a serene oasis in the middle of busy hours, disconnecting you from work stress to restore clarity.',
    },
    {
      id: 'asr',
      nameAr: 'صلاة العصر (العصر)',
      nameEn: 'Asr Prayer (Afternoon)',
      optionsAr: ['العودة من العمل / الدراسة', 'إتمام الأعمال المنزلية', 'الجلوس والاسترخاء والقهوة'],
      optionsEn: ['Commuting home / End of study', 'Finishing home chores', 'Relaxing afternoon downtime'],
      tipsAr: '✨ صلاة العصر تشحن روحك في فترة التعب اليومية لتواصل يومك بذهن صافٍ ونفس مطمئنة.',
      tipsEn: '✨ Asr provides a vital spiritual recharge during afternoon fatigue, keeping your mind alert and peaceful.',
    },
    {
      id: 'maghrib',
      nameAr: 'صلاة المغرب (المغرب)',
      nameEn: 'Maghrib Prayer (Sunset)',
      optionsAr: ['أمسية دافئة مع العائلة', 'إعداد وجبة العشاء والراحة', 'ممارسة هواية أو نشاط خفيف'],
      optionsEn: ['Warm family evening', 'Preparing dinner & resting', 'Hobby or light activities'],
      tipsAr: '✨ صلاة المغرب تجمع بين بركة الغروب وهدوء المساء بقلب خاشع وممتن لنعم الله.',
      tipsEn: '✨ Maghrib marks the transition of sunset, wrapping your evening in deep gratitude and tranquility.',
    },
    {
      id: 'isha',
      nameAr: 'صلاة العشاء (العشاء)',
      nameEn: 'Isha Prayer (Night)',
      optionsAr: ['الاسترخاء التام وتصفح المعرفة', 'الاستعداد للنوم والراحة', 'الحديث اللطيف مع الأحباء'],
      optionsEn: ['Deep relaxation & reading', 'Preparing for bed & sleep', 'Gentle conversation with loved ones'],
      tipsAr: '✨ صلاة العشاء هي مسك ختام يومك، تطوي بها هموم المشاغل لتنام بسلام وأمان يحيط بقلبك.',
      tipsEn: '✨ Isha is the perfect closing of your day, folding away all worries so you can rest in profound safety.',
    },
  ];

  const handleSelect = (prayerId: string, option: string) => {
    playSoftTap();
    setRoutines((prev) => ({ ...prev, [prayerId]: option }));
  };

  const allSelected = Object.values(routines).every((val) => val !== '');

  return (
    <div className="space-y-4">
      {/* Introduction Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-[#FBF9F5] border border-emerald-300/60 text-xs text-[#2C483F] leading-relaxed space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-emerald-800">
          <Clock className="w-4 h-4 text-[#88C947]" />
          <span>{lang === 'ar' ? 'انسجام الصلاة مع روتينك اليومي' : 'Integrating Prayer into Your Routine'}</span>
        </div>
        <p className="text-stone-600">
          {lang === 'ar'
            ? 'الصلاة ليست عبئاً يقطع يومك، بل هي محطة سكينة تزيدك بركة وتمنحك استراحة نفسية هادئة. اختر روتينك المعتاد في كل وقت صلاة لتكتشف كيف تتناغم مع جدولك:'
            : 'Prayer is not an interruption, but a serene pause that blesses your time. Match your typical schedule at each prayer time to see the harmony:'}
        </p>
      </div>

      {/* 5 Prayers Selector */}
      <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
        {prayers.map((p) => {
          const selectedVal = routines[p.id];
          return (
            <div
              key={p.id}
              className={`p-3.5 rounded-2xl border-2 transition-all duration-300 space-y-3 ${
                selectedVal
                  ? 'bg-emerald-50/50 border-emerald-300'
                  : 'bg-white border-stone-100 hover:border-emerald-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <h5 className="text-xs font-black text-[#2C483F] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>{lang === 'ar' ? p.nameAr : p.nameEn}</span>
                </h5>
                {selectedVal && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    {lang === 'ar' ? 'تم الاختيار ✓' : 'Selected ✓'}
                  </span>
                )}
              </div>

              {/* Options buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(lang === 'ar' ? p.optionsAr : p.optionsEn).map((option, idx) => {
                  const isChosen = selectedVal === option;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelect(p.id, option)}
                      className={`py-1.5 px-2.5 rounded-xl text-[11px] font-bold transition-all text-center select-none cursor-pointer ${
                        isChosen
                          ? 'bg-[#2C483F] text-white shadow-soft'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/65'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic feedback tip */}
              {selectedVal && (
                <div className="p-2.5 rounded-xl bg-[#88C947]/10 text-[11px] text-[#2C483F] leading-relaxed border border-[#88C947]/20 transition-all duration-300 animate-fade-in">
                  {lang === 'ar' ? p.tipsAr : p.tipsEn}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion Button */}
      <div className="pt-2 text-center">
        <button
          type="button"
          disabled={!allSelected && !isCompleted}
          onClick={onComplete}
          className={`w-full py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-soft flex items-center justify-center gap-2 ${
            isCompleted
              ? 'bg-stone-100 text-stone-500 cursor-default border border-stone-200'
              : allSelected
              ? 'bg-gradient-to-r from-[#2C483F] to-[#1e342d] hover:from-[#1e342d] hover:to-[#14231E] text-white cursor-pointer hover:scale-[1.01] active:scale-[0.99]'
              : 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'ar' ? '✓ تم إنجاز مهمة جدول السكينة بنجاح' : '✓ Serenity Timeline Task Completed'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                {allSelected
                  ? lang === 'ar'
                    ? 'تأكيد جدول السكينة وإتمام المهمة 🌿'
                    : 'Confirm Serenity Schedule & Complete Task 🌿'
                  : lang === 'ar'
                  ? 'يرجى اختيار روتينك لجميع الصلوات الـ 5 لتفعيل المهمة'
                  : 'Please select routine for all 5 prayers to complete'}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// DAY 2 TASK: تعرّف على القبلة
// =========================================================================
const TaskDay2Qiblah: React.FC<TaskContentProps> = ({ task, lang, isCompleted, onComplete }) => {
  const [learned, setLearned] = useState(false);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-gradient-to-b from-[#FAF7F0] to-[#EBE3D3] border border-[#D4A373]/40 text-start space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-[#2C483F]">
          <Compass className="w-5 h-5 text-[#88C947]" />
          <span>{lang === 'ar' ? 'ما هي القبلة؟ وكيف يحددها المسلمون؟' : 'What is the Qiblah and how is it determined?'}</span>
        </div>
        <p className="text-xs text-stone-700 leading-relaxed">
          {lang === 'ar'
            ? 'القبلة هي وجهة الكعبة المشرفة في مكة المكرمة؛ ليست عبادة للحجر وإنما هي رمز إيماني لوحدة أمة الإسلام وتوجه قلوبهم نحو مركز روحي واحد. يحددها المسلم في مدينته عبر بوصلة الهاتف أو التطبيقات أو اتجاه محاريب المساجد بيسر تام.'
            : 'The Qiblah points towards the Kaaba in Mecca, symbolizing unity among worshippers worldwide. Determined simply using compass apps, phone sensors, or local mosque orientation.'}
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          setLearned(true);
          onComplete();
        }}
        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
          isCompleted || learned
            ? 'bg-stone-100 text-stone-500'
            : 'bg-[#2C483F] hover:bg-[#1e342d] text-white shadow-soft'
        }`}
      >
        {isCompleted || learned
          ? lang === 'ar'
            ? '✓ تم استيعاب مفهوم القبلة'
            : '✓ Qiblah concept completed'
          : lang === 'ar'
          ? 'فهمت المعنى وأحدد اتجاه القبلة في بيئتي'
          : 'I understand and observe Qiblah in my space'}
      </button>
    </div>
  );
};

// =========================================================================
// DAY 3 TASK: تحقق قبل أن تحكم
// =========================================================================
const TaskDay3VerifyProduct: React.FC<TaskContentProps> = ({ task, lang, isCompleted, onComplete }) => {
  const [verified, setVerified] = useState(false);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#D4A373]/30 text-start space-y-2">
        <h5 className="text-xs font-black text-[#2C483F]">
          {lang === 'ar' ? 'تطبيق واقعي اليوم:' : 'Real-Life Action Today:'}
        </h5>
        <p className="text-xs text-stone-600 leading-relaxed">
          {lang === 'ar'
            ? 'اختر طعاماً أو منتجاً واحداً تشتريه في يومك العادي (بسكويت، عصير، وجبة خفيفة)، واقرأ قائمة المكونات المطبوعة على الغلاف لتتأكد من مصدرها بنفسك بدلاً من التخمين.'
            : 'Pick one real product in your groceries today, read its ingredients label consciously, and verify its origin instead of guessing.'}
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          setVerified(true);
          onComplete();
        }}
        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
          isCompleted || verified
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-[#2C483F] hover:bg-[#1e342d] text-white shadow-soft'
        }`}
      >
        {isCompleted || verified
          ? lang === 'ar'
            ? '✓ تحققت من منتج واقعي اليوم'
            : '✓ Verified a product today'
          : lang === 'ar'
          ? 'تحققت من منتج في يومي الواقعي'
          : 'I checked a product in real life'}
      </button>
    </div>
  );
};

// =========================================================================
// DAY 4 TASK: كلمة تشجيع
// =========================================================================
const TaskDay4Encouragement: React.FC<TaskContentProps> = ({ task, lang, isCompleted, onComplete }) => {
  const [encouraged, setEncouraged] = useState(false);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#D4A373]/30 text-start space-y-2">
        <h5 className="text-xs font-black text-[#2C483F]">
          {lang === 'ar' ? 'الكلمة الطيبة صدقة:' : 'A Kind Word is Charity:'}
        </h5>
        <p className="text-xs text-stone-600 leading-relaxed">
          {lang === 'ar'
            ? 'وجّه لأحد أفراد عائلتك أو أصدقائك المقربين اليوم كلمة ثناء وتقدير صادقة على مبادرة جميلة قام بها، لتبني ثقافة التشجيع على الخير باللطف.'
            : 'Offer someone in your family or close circle a sincere word of encouragement toward something good today.'}
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          setEncouraged(true);
          onComplete();
        }}
        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
          isCompleted || encouraged
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-[#2C483F] hover:bg-[#1e342d] text-white shadow-soft'
        }`}
      >
        {isCompleted || encouraged
          ? lang === 'ar'
            ? '✓ وجّهت كلمة تشجيع صادقة'
            : '✓ Encouragement shared'
          : lang === 'ar'
          ? 'تم: وجّهت كلمة تشجيع صادقة'
          : 'Done: I shared an encouraging word'}
      </button>
    </div>
  );
};

// =========================================================================
// DAY 5 TASK: تعلّم رخصة
// =========================================================================
const TaskDay5LearnConcession: React.FC<TaskContentProps> = ({ task, lang, isCompleted, onComplete }) => {
  const [readConcession, setReadConcession] = useState(false);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-gradient-to-b from-[#F7F9FB] to-[#E9EFF5] border border-sky-200 text-start space-y-2">
        <h5 className="text-xs font-black text-[#2C483F]">
          {lang === 'ar' ? 'فقه التيسير في الإسلام (الرخصة الشرعية):' : 'Legal Concessions (Rukhsah) in Islamic Fiqh:'}
        </h5>
        <p className="text-xs text-stone-700 leading-relaxed">
          {lang === 'ar'
            ? 'الرخصة هي حكم شرعي شُرع للتخفيف عند وجود عذر حقيقي؛ مثل قصر الصلاة والجمع للمسافر، والتيمم عند فقد الماء أو المرض، والمسح على الجوربين، والإفطار للمريض في رمضان. كلها دلائل ناطقة بأن هذا الدين متين ويسير لا مشقة فيه.'
            : 'A concession (Rukhsah) eases worship during genuine hardship: shortening travel prayers, dry ablution (Tayammum) when water is absent or harmful, and wiping over socks.'}
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          setReadConcession(true);
          onComplete();
        }}
        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
          isCompleted || readConcession
            ? 'bg-stone-100 text-stone-500'
            : 'bg-[#2C483F] hover:bg-[#1e342d] text-white shadow-soft'
        }`}
      >
        {isCompleted || readConcession
          ? lang === 'ar'
            ? '✓ تم الاطلاع على رخص التيسير'
            : '✓ Concession insight read'
          : lang === 'ar'
          ? 'اطلعت واستوعبت رخص التيسير'
          : 'I read and understood legal concessions'}
      </button>
    </div>
  );
};

// =========================================================================
// DAY 6 TASK: جمعة
// =========================================================================
const TaskDay6FridayPrayer: React.FC<TaskContentProps> = ({ task, lang, isCompleted, onComplete }) => {
  const [participated, setParticipated] = useState(false);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#D4A373]/30 text-start space-y-2">
        <h5 className="text-xs font-black text-[#2C483F]">
          {lang === 'ar' ? 'تجربة الجمعة الأسبوعية:' : 'Friday Weekly Reflection:'}
        </h5>
        <p className="text-xs text-stone-600 leading-relaxed">
          {lang === 'ar'
            ? 'إن تيسر لك حضور صلاة الجمعة في المسجد فعش التجربة بقلب حاضر؛ وإن لم تستطع فاسمع لموعظة نافعة وصلّ الظهر في وقتها واستشعر فضل هذا اليوم المبارك.'
            : 'If able, attend Friday prayer in a local mosque; if unable, listen to an uplifting lecture and pray Dhuhr peacefully.'}
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          setParticipated(true);
          onComplete();
        }}
        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
          isCompleted || participated
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-[#2C483F] hover:bg-[#1e342d] text-white shadow-soft'
        }`}
      >
        {isCompleted || participated
          ? lang === 'ar'
            ? '✓ عشت معنى الجمعة اليوم'
            : '✓ Friday meaning embraced'
          : lang === 'ar'
          ? 'تم: عشت معنى الجمعة اليوم'
          : 'Done: I experienced Friday today'}
      </button>
    </div>
  );
};

// =========================================================================
// DAY 7 TASK: عمل بر صغير
// =========================================================================
const TaskDay7KindnessParent: React.FC<TaskContentProps> = ({ task, lang, isCompleted, onComplete }) => {
  const [performed, setPerformed] = useState(false);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#D4A373]/30 text-start space-y-2">
        <h5 className="text-xs font-black text-[#2C483F]">
          {lang === 'ar' ? 'عمل بر وإحسان واقعي:' : 'Real-life Act of Kindness:'}
        </h5>
        <p className="text-xs text-stone-600 leading-relaxed">
          {lang === 'ar'
            ? 'اختر عملاً بسيطاً اليوم في بيتك يُدخل السرور على والديك أو أسرتك (إعداد طعام، ترتيب زاوية، قبلة على الرأس، أو كلمة شكر حنونة).'
            : 'Perform one small act bringing joy to your parents or family today (making tea, cleaning a corner, or expressing warm gratitude).'}
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          setPerformed(true);
          onComplete();
        }}
        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
          isCompleted || performed
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-[#2C483F] hover:bg-[#1e342d] text-white shadow-soft'
        }`}
      >
        {isCompleted || performed
          ? lang === 'ar'
            ? '✓ أنجزت عمل بر صغير اليوم'
            : '✓ Kind act performed'
          : lang === 'ar'
          ? 'تم: أنجزت عمل بر صغير اليوم'
          : 'Done: I performed a small act of kindness'}
      </button>
    </div>
  );
};
