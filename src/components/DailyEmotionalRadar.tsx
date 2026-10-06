import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import { Language, UserPersonalizationProfile, UserProfile } from '../types';
import { playSoftTap } from '../utils/audio';

export type DailySituationType =
  | 'confused'
  | 'guilt'
  | 'fear'
  | 'sadness'
  | 'anger'
  | 'hesitant'
  | 'longing'
  | 'lonely'
  | 'tired'
  | 'peaceful';

interface DailyEmotionalRadarProps {
  score: number;
  onAdjustScore: (delta: number, label: string, type: 'peace' | 'stress') => void;
  lang: Language;
  userProfile?: UserProfile;
  personalization?: UserPersonalizationProfile;
  onOpenMiniGameLab?: (topic?: string, query?: string) => void;
}

interface SituationItem {
  id: DailySituationType;
  emoji: string;
  labelArMale: string;
  labelArFemale: string;
  labelEn: string;
  subLabelAr: string;
  subLabelEn: string;
  quoteAr: string;
  quoteEn: string;
  sourceAr: string;
  sourceEn: string;
  adviceAr: (isFemale: boolean) => string;
  adviceEn: (isFemale: boolean) => string;
}

export const DailyEmotionalRadar: React.FC<DailyEmotionalRadarProps> = ({
  lang,
  userProfile,
  personalization,
}) => {
  const [selectedSituation, setSelectedSituation] = useState<DailySituationType>('confused');

  const isFemale =
    personalization?.preferredAddressing === 'female' ||
    userProfile?.gender === 'female';

  const isAr = lang === 'ar';

  const situations: SituationItem[] = [
    {
      id: 'confused',
      emoji: '🌪️',
      labelArMale: 'حائر',
      labelArFemale: 'حائرة',
      labelEn: 'Confused',
      subLabelAr: 'تزاحم البدايات والخطوات',
      subLabelEn: 'Information overload in beginnings',
      quoteAr: '«إِنَّ هَذَا الدِّينَ يُسْرٌ، وَلَنْ يُشَادَّ الدِّينَ أَحَدٌ إِلَّا غَلَبَهُ، فَسَدِّدُوا وَقَارِبُوا وَأَبْشِرُوا»',
      quoteEn: '"Indeed, this religion is easy, and no one overburdens themselves in religion except that it overcomes them. So adhere to moderation and receive good news."',
      sourceAr: 'صحيح البخاري — كتاب الإيمان (حديث 39)',
      sourceEn: 'Sahih al-Bukhari (39)',
      adviceAr: (female) =>
        female
          ? 'يا أختي الكريمة، لا تُكلفي نفسكِ ما لا تطيقين؛ خذي العبادات خطوة بخطوة بالتدريج، وركزي اليوم على تثبيت الأساسيات بقلب مطمئن.'
          : 'يا أخي الكريم، لا تُكلف نفسك ما لا تطيق؛ خذ العبادات خطوة بخطوة بالتدريج، وركز اليوم على تثبيت الأساسيات بقلب مطمئن.',
      adviceEn: (female) =>
        female
          ? 'Dear sister, do not overburden yourself; take your learning step by step and anchor the basics with serenity.'
          : 'Dear brother, do not overburden yourself; take your learning step by step and anchor the basics with serenity.',
    },
    {
      id: 'fear',
      emoji: '🛡️',
      labelArMale: 'خائف',
      labelArFemale: 'خائفة',
      labelEn: 'Fearful',
      subLabelAr: 'الخوف من التقصير أو المستقبل',
      subLabelEn: 'Fear of shortcomings or future',
      quoteAr: '«احْفَظِ اللَّهَ يَحْفَظْكَ، احْفَظِ اللَّهَ تَجِدْهُ تُجَاهَكَ، إِذَا سَأَلْتَ فَاسْأَلِ اللَّهَ، وَإِذَا اسْتَعَنْتَ فَاسْتَعِنْ بِاللَّهِ»',
      quoteEn: '"Be mindful of Allah and He will protect you. Be mindful of Allah and you will find Him before you. If you ask, ask Allah; and if you seek help, seek help from Allah."',
      sourceAr: 'جامع الترمذي (2516) — وصححه الألباني في الدرر السنية',
      sourceEn: 'Jami` at-Tirmidhi (2516) — Sahih (Dorar.net)',
      adviceAr: (female) =>
        female
          ? 'اطمئني وتوكلي على الله، فكل ما يصيبك مقدر بحكمة بالغة، واستعيني بالدعاء والاستغفار في كل وقت.'
          : 'اطمئن وتوكل على الله، فكل ما يصيبك مقدر بحكمة بالغة، واستعن بالدعاء والاستغفار في كل وقت.',
      adviceEn: () =>
        'Place your trust in Allah; seek His continuous support through prayer and remembrance.',
    },
    {
      id: 'sadness',
      emoji: '🌧️',
      labelArMale: 'حزين',
      labelArFemale: 'حزينة',
      labelEn: 'Sad',
      subLabelAr: 'ضيق في الصدر أو حزن',
      subLabelEn: 'Grief or heavy heart',
      quoteAr: '«مَا يُصِيبُ الْمُسْلِمَ مِنْ نَصَبٍ وَلَا وَصَبٍ، وَلَا هَمٍّ وَلَا حُزْنٍ، وَلَا أَذًى وَلَا غَمٍّ، حَتَّى الشَّوْكَةِ يُشَاكُهَا، إِلَّا كَفَّرَ اللَّهُ بِهَا مِنْ خَطَايَاهُ»',
      quoteEn: '"No fatigue, disease, sorrow, sadness, hurt, or distress befalls a Muslim, even if it were the prick of a thorn, but that Allah expiates some of their sins for that."',
      sourceAr: 'صحيح البخاري (5641) ومسلم (2573)',
      sourceEn: 'Sahih al-Bukhari (5641) & Sahih Muslim (2573)',
      adviceAr: (female) =>
        female
          ? 'صبركِ وحزنكِ مأجور، وأمر المؤمنة كله لها خير، فاستقبلي الأيام بالدعاء والرجاء في رحمة الله.'
          : 'صبرك وحزنك مأجور، وأمر المؤمن كله له خير، فاستقبل الأيام بالدعاء والرجاء في رحمة الله.',
      adviceEn: () =>
        'Your patience during sadness is rewarded by Allah, for all circumstances of a believer hold good.',
    },
    {
      id: 'anger',
      emoji: '🔥',
      labelArMale: 'غاضب',
      labelArFemale: 'غاضبة',
      labelEn: 'Angry',
      subLabelAr: 'انفعال أو توتر مع الآخرين',
      subLabelEn: 'Frustration or anger in daily interactions',
      quoteAr: '«إِذَا غَضِبَ أَحَدُكُمْ وَهُوَ قَائِمٌ فَلْيَجْلِسْ، فَإِنْ ذَهَبَ عَنْهُ الْغَضَبُ وَإِلَّا فَلْيَضْطَجِعْ» وقال ﷺ: «لَا تَغْضَبْ»',
      quoteEn: '"When one of you becomes angry while standing, let them sit down. If anger leaves, well and good; otherwise let them lie down." And he ﷺ said: "Do not get angry."',
      sourceAr: 'سنن أبي داود (4782) وصحيح البخاري (6116)',
      sourceEn: 'Sunan Abi Dawud (4782) & Sahih al-Bukhari (6116)',
      adviceAr: (female) =>
        female
          ? 'تعوذي بالله من الشيطان الرجيم، وتوضئي، واصبري؛ فالشديد من يملك نفسه عند الغضب.'
          : 'تعوذ بالله من الشيطان الرجيم، وتوضأ، واصبر؛ فالشديد من يملك نفسه عند الغضب.',
      adviceEn: () =>
        'Seek refuge with Allah from Satan, perform wudu, and practice restraint.',
    },
    {
      id: 'hesitant',
      emoji: '⚖️',
      labelArMale: 'متردد',
      labelArFemale: 'مترددة',
      labelEn: 'Hesitant',
      subLabelAr: 'تردد في اتخاذ قرار أو خطوة',
      subLabelEn: 'Doubt or hesitation in decisions',
      quoteAr: '«دَعْ مَا يَرِيبُكَ إِلَى مَا لَا يَرِيبُكَ، فَإِنَّ الصِّدْقَ طُمَأْنِينَةٌ، وَإِنَّ الْكَذِبَ رِيبَةٌ»',
      quoteEn: '"Leave that which makes you doubt for that which does not make you doubt."',
      sourceAr: 'جامع الترمذي (2518) — وصححه الألباني (الدرر السنية)',
      sourceEn: 'Jami` at-Tirmidhi (2518) — Sahih',
      adviceAr: (female) =>
        female
          ? 'استخيري الله بالدعاء وصلاة الاستخارة، واستشيري أهل العلم الثقات، وامضي فيما تطمئن إليه نفسكِ.'
          : 'استخر الله بالدعاء وصلاة الاستخارة، واستشر أهل العلم الثقات، وامضِ فيما يطمئن إليه قلبك.',
      adviceEn: () =>
        'Pray Istikhara (guidance prayer), seek trustworthy advice, and proceed with clarity.',
    },
    {
      id: 'longing',
      emoji: '🕊️',
      labelArMale: 'مشتاق',
      labelArFemale: 'مشتاقة',
      labelEn: 'Longing',
      subLabelAr: 'شوق إلى القرب من الله والعبادة',
      subLabelEn: 'Yearning for spiritual closeness',
      quoteAr: '«يَقُولُ اللَّهُ تَعَالَى: أَنَا عِنْدَ ظَنِّ عَبْدِي بِي، وَأَنَا مَعَهُ إِذَا ذَكَرَنِي، فَإِنْ ذَكَرَنِي فِي نَفْسِهِ ذَكَرْتُهُ فِي نَفْسِي، وَإِنْ تَقَرَّبَ إِلَيَّ شِبْرًا تَقَرَّبْتُ إِلَيْهِ ذِرَاعًا»',
      quoteEn: '"Allah says: I am as My servant thinks of Me, and I am with him when he remembers Me. If he draws near to Me a handspan, I draw near to him an arm’s length."',
      sourceAr: 'صحيح البخاري (7405) وصحيح مسلم (2675)',
      sourceEn: 'Sahih al-Bukhari (7405) & Sahih Muslim (2675)',
      adviceAr: (female) =>
        female
          ? 'أكثري من ذكر الله والصلاة على النبي ﷺ والعمل الصالح الخفي، فالله قريب مجيب دعوة الداع.'
          : 'أكثر من ذكر الله والصلاة على النبي ﷺ والعمل الصالح الخفي، فالله قريب مجيب دعوة الداع.',
      adviceEn: () =>
        'Engage in frequent dhikr, charity, and sincere supplication; Allah is ever near.',
    },
    {
      id: 'lonely',
      emoji: '🍂',
      labelArMale: 'وحيد',
      labelArFemale: 'وحيدة',
      labelEn: 'Lonely',
      subLabelAr: 'شعور بالغربة أو الوحدة',
      subLabelEn: 'Feeling alone or isolated',
      quoteAr: '«مَا ظَنُّكَ يَا أَبَا بَكْرٍ بِاثْنَيْنِ اللَّهُ ثَالِثُهُمَا؟» وقوله تعالى: ﴿إِنَّ اللَّهَ مَعَنَا﴾',
      quoteEn: '"What do you think, O Abu Bakr, of two whose third is Allah?" And the verse: {Indeed, Allah is with us}.',
      sourceAr: 'صحيح البخاري (3653) وصحيح مسلم (2381)',
      sourceEn: 'Sahih al-Bukhari (3653) & Sahih Muslim (2381)',
      adviceAr: (female) =>
        female
          ? 'لستِ وحدكِ أبداً؛ فالله معكِ يسمعكِ ويراكِ، واحرصي على التواصل مع الأخوات الصالحات في بيئتكِ.'
          : 'لست وحدك أبداً؛ فالله معك يسمعك ويراك، واحرص على ارتياد المسجد وصحبة الصالحين في بيئتك.',
      adviceEn: () =>
        'You are never alone; Allah is with you, and connecting with a supportive community brings lasting warmth.',
    },
    {
      id: 'tired',
      emoji: '🌿',
      labelArMale: 'متعب',
      labelArFemale: 'متعبة',
      labelEn: 'Tired',
      subLabelAr: 'إجهاد بدني أو مشقة في اليوم',
      subLabelEn: 'Physical exhaustion or fatigue',
      quoteAr: '«عَلَيْكُمْ مِنَ الأَعْمَالِ مَا تُطِيقُونَ، فَإِنَّ اللَّهَ لاَ يَمَلُّ حَتَّى تَمَلُّوا، وَإِنَّ أَحَبَّ الأَعْمَالِ إِلَى اللَّهِ مَا دُووِمَ عَلَيْهِ وَإِنْ قَلَّ»',
      quoteEn: '"Do only those deeds which you are capable of doing, for Allah does not weary until you weary, and the best deeds to Allah are those done consistently even if small."',
      sourceAr: 'صحيح البخاري (43) وصحيح مسلم (782)',
      sourceEn: 'Sahih al-Bukhari (43) & Sahih Muslim (782)',
      adviceAr: (female) =>
        female
          ? 'خذي قسطاً من الراحة والنوم، فإن لجسدكِ عليكِ حقاً، وداومي على القليل المستمر من الطاعات.'
          : 'خذ قسطاً من الراحة والنوم، فإن لجسدك عليك حقاً، وداوم على القليل المستمر من الطاعات.',
      adviceEn: () =>
        'Rest your body and mind; consistency in small worship is cherished by Allah.',
    },
    {
      id: 'guilt',
      emoji: '🤍',
      labelArMale: 'نادم / مذنب',
      labelArFemale: 'نادمة / مذنبة',
      labelEn: 'Repentant',
      subLabelAr: 'تذكر أخطاء ماضية أو زلة',
      subLabelEn: 'Remorse over past mistakes',
      quoteAr: '«أَمَا عَلِمْتَ أَنَّ الْإِسْلَامَ يَهْدِمُ مَا كَانَ قَبْلَهُ، وَأَنَّ الْهِجْرَةَ تَهْدِمُ مَا كَانَ قَبْلَهَا؟»',
      quoteEn: '"Did you not know that entering Islam wipes away completely whatever came before it?"',
      sourceAr: 'صحيح مسلم — حديث عمرو بن العاص (الدرر السنية)',
      sourceEn: 'Sahih Muslim — Hadith of Amr ibn al-Aas',
      adviceAr: (female) =>
        female
          ? 'صفحتكِ بيضاء نقية، وما مضى محاه الله برحمته وأبدله حسنات، فاستبشري برحمة الله ومغفرته.'
          : 'صفحتك بيضاء نقية، وما مضى محاه الله برحمته وأبدله حسنات، فاستبشر برحمة الله ومغفرته.',
      adviceEn: () =>
        'Your slate is completely clean and pure. Past sins are wiped away by Allah’s vast mercy.',
    },
    {
      id: 'peaceful',
      emoji: '☀️',
      labelArMale: 'مطمئن',
      labelArFemale: 'مطمئنة',
      labelEn: 'Content',
      subLabelAr: 'رضا وسكينة وشكر لله',
      subLabelEn: 'Peace of mind and gratitude',
      quoteAr: '«عَجَبًا لِأَمْرِ الْمُؤْمِنِ، إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ، وَلَيْسَ ذَاكَ لِأَحَدٍ إِلَّا لِلْمُؤْمِنِ، إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْرًا لَهُ»',
      quoteEn: '"How wonderful is the affair of the believer, for his affairs are all good, and that does not belong to anyone but the believer: if prosperity befalls him, he is thankful and it is good for him."',
      sourceAr: 'صحيح مسلم (2999) — كتاب الزهد والرقائق',
      sourceEn: 'Sahih Muslim (2999)',
      adviceAr: (female) =>
        female
          ? 'احمدي الله واشكريه على نعمة الهداية والسكينة، وداومي على الشكر لتدوم النعم.'
          : 'احمد الله واشكره على نعمة الهداية والسكينة، وداوم على الشكر لتدوم النعم.',
      adviceEn: () =>
        'Praise Allah and remain grateful for the blessing of faith and tranquility.',
    },
  ];

  const currentItem =
    situations.find((s) => s.id === selectedSituation) || situations[0];

  const handleSelect = (id: DailySituationType) => {
    playSoftTap();
    setSelectedSituation(id);
  };

  const getSituationLabel = (item: SituationItem) => {
    if (!isAr) return item.labelEn;
    return isFemale ? item.labelArFemale : item.labelArMale;
  };

  return (
    <section className="py-6 bg-gradient-to-b from-[#FAF6F0]/80 via-white to-[#FBF9F5] border-y border-[#D4A373]/20 relative select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 text-start">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-[#2C483F] tracking-tight">
              {isAr
                ? (isFemale ? 'اختاري الموقف الذي يمر بكِ لتصلي إلى التوجيه المسند:' : 'اختر الموقف الذي يمر بك لتصل إلى التوجيه المسند:')
                : 'Select a situation to read authentic guidance:'}
            </h2>
          </div>
        </div>

        {/* 10 Navigation Situation Buttons (Responsive Circular Grid) */}
        <div className="grid grid-cols-5 sm:grid-cols-5 lg:grid-cols-10 gap-2.5 sm:gap-3 items-center justify-items-center">
          {situations.map((item) => {
            const isSelected = selectedSituation === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-2 transition-all flex flex-col items-center justify-center p-1 cursor-pointer gap-0.5 sm:gap-1 shadow-xs ${
                  isSelected
                    ? 'bg-[#2C483F] border-[#88C947] text-white shadow-soft scale-105 ring-4 ring-[#88C947]/20'
                    : 'bg-white border-[#D4A373]/30 hover:border-[#D4A373] text-[#2C483F] hover:bg-[#FAF7F0] hover:scale-105'
                }`}
                title={getSituationLabel(item)}
              >
                <span className="text-lg sm:text-2xl leading-none">{item.emoji}</span>
                <span className={`text-[10px] sm:text-xs font-black truncate max-w-[55px] sm:max-w-[72px] text-center ${isSelected ? 'text-white' : 'text-[#2C483F]'}`}>
                  {getSituationLabel(item)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Prophetic Guidance Display Card */}
        {currentItem && (
          <div className="bg-white rounded-3xl border border-[#D4A373]/40 p-5 sm:p-7 shadow-soft text-start space-y-4 animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-[#D4A373] to-emerald-600" />

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{currentItem.emoji}</span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#2C483F] mt-0.5">
                    {getSituationLabel(currentItem)}
                  </h3>
                </div>
              </div>
            </div>

            {/* Hadith Canonical Text */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300/60 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>{isAr ? 'النص النبوي الصحيح المعتمد:' : 'Authentic Prophetic Text:'}</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-amber-950 leading-relaxed font-arabic">
                {isAr ? currentItem.quoteAr : currentItem.quoteEn}
              </p>
              <div className="pt-1 flex items-center justify-between text-[11px] text-amber-900 font-mono">
                <span>{isAr ? currentItem.sourceAr : currentItem.sourceEn}</span>
              </div>
            </div>

            {/* Practical Advice */}
            <div className="p-3.5 rounded-2xl bg-[#FBF9F5] border border-[#D4A373]/30 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#88C947] shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-[#2C483F] leading-relaxed">
                {isAr ? currentItem.adviceAr(isFemale) : currentItem.adviceEn(isFemale)}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
