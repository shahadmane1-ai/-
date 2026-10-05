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
      return <TaskDay1Shahadah task={task} lang={lang} isCompleted={isCompleted} onComplete={onComplete} />;
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
// DAY 1 TASK: نطق الشهادتين وتثبيت اليقين
// =========================================================================
const TaskDay1Shahadah: React.FC<TaskContentProps> = ({ task, lang, isCompleted, onComplete }) => {
  const [part1Recited, setPart1Recited] = useState(false);
  const [part2Recited, setPart2Recited] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const speakArabic = (text: string) => {
    playPeaceChime();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleTogglePart1 = () => {
    playSoftTap();
    setPart1Recited(!part1Recited);
  };

  const handleTogglePart2 = () => {
    playSoftTap();
    setPart2Recited(!part2Recited);
  };

  return (
    <div className="space-y-4">
      {/* Introduction Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-[#FBF9F5] border border-emerald-300/60 text-xs text-[#2C483F] leading-relaxed space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-emerald-800">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{lang === 'ar' ? 'مفتاح الإسلام وبوابة النور والسكينة' : 'The Gateway of Faith & Serenity'}</span>
        </div>
        <p className="text-stone-600">
          {lang === 'ar'
            ? 'الشهادتان هما أعظم كلمة ينطق بها القلب واللسان. استمع لنطقهما بوضوح ورددهما بيقين وطمأنينة:'
            : 'The Shahadah is the foundational testimony of faith. Listen to the clear pronunciation and recite with peace of heart:'}
        </p>
      </div>

      {/* Two Testimonies Interactive Cards */}
      <div className="space-y-3">
        {/* Part 1: Tawheed */}
        <div
          className={`p-4 rounded-2xl border-2 transition-all duration-300 space-y-2.5 ${
            part1Recited
              ? 'bg-emerald-50/80 border-emerald-400 shadow-soft'
              : 'bg-white border-stone-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
              {lang === 'ar' ? 'الشهادة الأولى: التوحيد' : '1st Testimony: Monotheism'}
            </span>
            <button
              type="button"
              onClick={() => speakArabic('أشهد أن لا إله إلا الله')}
              className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-xl transition-all cursor-pointer"
              title={lang === 'ar' ? 'استمع للنطق' : 'Listen'}
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'ar' ? 'استمع' : 'Listen'}</span>
            </button>
          </div>

          <div className="text-center py-1">
            <h5 className="text-lg sm:text-xl font-black text-[#2C483F] font-arabic tracking-wide">
              « أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللهُ »
            </h5>
            <p className="text-[11px] font-mono text-stone-500 mt-1">
              "Ash-hadu an la ilaha illa Allah"
            </p>
            <p className="text-xs text-stone-700 mt-0.5 font-medium">
              {lang === 'ar'
                ? 'أي: لا معبود بحق إلا الله وحده لا شريك له'
                : 'Meaning: I bear witness that there is no deity worthy of worship except Allah'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleTogglePart1}
            className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              part1Recited
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${part1Recited ? 'text-white' : 'text-stone-400'}`} />
            <span>
              {part1Recited
                ? lang === 'ar'
                  ? 'تم النطق والتدبر بفضل الله'
                  : 'Recited & Reflected'
                : lang === 'ar'
                ? 'انقر لتأكيد نطق الشهادة الأولى'
                : 'Click to confirm reciting 1st testimony'}
            </span>
          </button>
        </div>

        {/* Part 2: Prophethood */}
        <div
          className={`p-4 rounded-2xl border-2 transition-all duration-300 space-y-2.5 ${
            part2Recited
              ? 'bg-emerald-50/80 border-emerald-400 shadow-soft'
              : 'bg-white border-stone-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
              {lang === 'ar' ? 'الشهادة الثانية: الرسالة' : '2nd Testimony: Prophethood'}
            </span>
            <button
              type="button"
              onClick={() => speakArabic('وأشهد أن محمداً رسول الله')}
              className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-xl transition-all cursor-pointer"
              title={lang === 'ar' ? 'استمع للنطق' : 'Listen'}
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'ar' ? 'استمع' : 'Listen'}</span>
            </button>
          </div>

          <div className="text-center py-1">
            <h5 className="text-lg sm:text-xl font-black text-[#2C483F] font-arabic tracking-wide">
              « وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللهِ »
            </h5>
            <p className="text-[11px] font-mono text-stone-500 mt-1">
              "Wa ash-hadu anna Muhammadan Rasool Allah"
            </p>
            <p className="text-xs text-stone-700 mt-0.5 font-medium">
              {lang === 'ar'
                ? 'أي: نبي الرحمة وخاتم النبيين المرسل للناس كافة'
                : 'Meaning: And I bear witness that Muhammad is the Messenger of Allah'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleTogglePart2}
            className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              part2Recited
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${part2Recited ? 'text-white' : 'text-stone-400'}`} />
            <span>
              {part2Recited
                ? lang === 'ar'
                  ? 'تم النطق والتدبر بفضل الله'
                  : 'Recited & Reflected'
                : lang === 'ar'
                ? 'انقر لتأكيد نطق الشهادة الثانية'
                : 'Click to confirm reciting 2nd testimony'}
            </span>
          </button>
        </div>
      </div>

      {/* Grounded Citation Note */}
      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
        <BookOpen className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">
            {lang === 'ar' ? 'بيان نبوي مطمئن: ' : 'Prophetic Guidance: '}
          </span>
          <span>
            {lang === 'ar'
              ? '«بُنِيَ الإِسْلامُ عَلى خَمْسٍ: شَهادَةِ أَنْ لا إِلهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ...» [متفق عليه]'
              : '"Islam is built upon five pillars: testifying that there is no god but Allah and that Muhammad is the Messenger of Allah..." [Agreed Upon]'}
          </span>
        </div>
      </div>

      {/* Completion Button */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={onComplete}
          className={`w-full py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-soft cursor-pointer flex items-center justify-center gap-2 ${
            isCompleted
              ? 'bg-stone-100 text-stone-500 cursor-default'
              : 'bg-gradient-to-r from-[#2C483F] to-[#1e342d] hover:from-[#1e342d] hover:to-[#14231E] text-white hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'ar' ? '✓ تم إنجاز مهمة نطق الشهادتين بنجاح' : '✓ Shahadah Task Completed'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                {lang === 'ar'
                  ? 'تأكيد نطق الشهادتين واستشعار السكينة 🌿'
                  : 'Confirm Shahadah Recitation & Embrace Serenity 🌿'}
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
