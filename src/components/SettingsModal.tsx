import React, { useState } from 'react';
import { KeyRound, Volume2, VolumeX, Bell, Check, Sparkles, User, RefreshCw, GraduationCap } from 'lucide-react';
import { AddressingPreference, Language, LearningLevel, UserPersonalizationProfile, UserSettings } from '../types';
import { playSoftTap, playPeaceChime } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSaveSettings: (newSettings: UserSettings) => void;
  onResetScore: () => void;
  lang?: Language;
  personalization?: UserPersonalizationProfile;
  onSavePersonalization?: (profile: UserPersonalizationProfile) => void;
  onResetPersonalization?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetScore,
  lang = 'ar',
  personalization,
  onSavePersonalization,
  onResetPersonalization,
}) => {
  const [apiKey, setApiKey] = useState(settings.geminiApiKey);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [dailyReminder, setDailyReminder] = useState(settings.dailyReminder);
  const [savedAlert, setSavedAlert] = useState(false);

  // User Personalization State
  const [addressing, setAddressing] = useState<AddressingPreference>(
    personalization?.preferredAddressing || 'female'
  );
  const [learningLevel, setLearningLevel] = useState<LearningLevel>(
    personalization?.learningLevel || 'beginner'
  );

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    playSoftTap();
    onSaveSettings({
      ...settings,
      geminiApiKey: apiKey.trim(),
      soundEnabled,
      dailyReminder,
    });

    if (onSavePersonalization && personalization) {
      onSavePersonalization({
        ...personalization,
        preferredAddressing: addressing,
        learningLevel,
      });
    }

    setSavedAlert(true);
    setTimeout(() => {
      setSavedAlert(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#2C483F]/40 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md bg-white/95 backdrop-blur-md rounded-t-3xl sm:rounded-3xl border-t-2 sm:border border-[#D4A373]/40 shadow-soft-lg p-5 sm:p-6 max-h-[88vh] sm:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#D4A373]/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#D4A373]/20 flex items-center justify-center text-[#2C483F]">
              <Sparkles className="w-4 h-4 text-[#2C483F]" />
            </div>
            <h2 className="text-base font-bold text-[#2C483F]">
              {lang === 'ar' ? 'إعدادات رفيق والذكاء الاصطناعي' : 'Rafeeq AI & Preferences'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#FBF9F5] hover:bg-slate-200/60 flex items-center justify-center text-[#2C483F] font-bold text-xs"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-4 text-xs">
          {/* Gemini API Key Configuration */}
          <div>
            <label className="flex items-center justify-between text-[#2C483F] font-bold mb-1.5">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>{lang === 'ar' ? 'مفتاح Gemini API Key' : 'Gemini API Key'}</span>
              </span>
              <span className="text-[10px] text-[#2C483F]/60 font-normal">
                {lang === 'ar' ? 'اختياري (يوجد مفتاح مدمج)' : 'Optional (Default Active)'}
              </span>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#D4A373]/30 rounded-xl font-mono text-[#2C483F] focus:outline-none focus:border-[#2C483F]"
            />
            <p className="text-[11px] text-[#2C483F]/70 mt-1 leading-normal">
              {lang === 'ar'
                ? 'يستخدم لتشغيل محادثات رفيق وتدبر الآيات بنماذج Gemini 2.5 / 3.0.'
                : 'Used to power interactive reflection dialogues via Gemini models.'}
            </p>
          </div>

          {/* Sound Synthesizer Toggle */}
          <div className="p-3 bg-[#FBF9F5] border border-[#D4A373]/20 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#88C947]" />
              ) : (
                <VolumeX className="w-4 h-4 text-gray-400" />
              )}
              <div>
                <span className="font-bold text-[#2C483F] block">
                  {lang === 'ar' ? 'الأصوات والترددات التأملية' : 'Mindful Audio Chimes'}
                </span>
                <span className="text-[10px] text-[#2C483F]/60">
                  {lang === 'ar' ? 'ترددات السكينة عند كسب النقاط' : 'Harmonic tones on tranquility boost'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-11 h-6 rounded-full transition-colors p-1 relative flex items-center ${
                soundEnabled ? 'bg-[#88C947]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  soundEnabled ? (lang === 'ar' ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Daily Mindfulness Reminders */}
          <div className="p-3 bg-[#FBF9F5] border border-[#D4A373]/20 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#D4A373]" />
              <div>
                <span className="font-bold text-[#2C483F] block">
                  {lang === 'ar' ? 'تذكيرات السكينة والأذكار' : 'Daily Peace Reminders'}
                </span>
                <span className="text-[10px] text-[#2C483F]/60">
                  {lang === 'ar' ? 'تنبيه لطيف لمحطات التدبر اليومية' : 'Gentle morning/evening prompts'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDailyReminder(!dailyReminder)}
              className={`w-11 h-6 rounded-full transition-colors p-1 relative flex items-center ${
                dailyReminder ? 'bg-[#88C947]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  dailyReminder ? (lang === 'ar' ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* User Personalization & Addressing Layer (Requirement 1) */}
          <div className="p-3.5 bg-[#FBF9F5] border border-[#D4A373]/30 rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#D4A373]/20 pb-2">
              <span className="flex items-center gap-1.5 font-bold text-[#2C483F]">
                <User className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>{lang === 'ar' ? 'تخصيص أسلوب الخطاب والتعلم' : 'Personalization & Addressing'}</span>
              </span>
              <span className="text-[10px] text-[#2C483F]/60">
                {lang === 'ar' ? 'بيانات صريحة فقط' : 'Explicit only'}
              </span>
            </div>

            {/* Addressing Preference */}
            <div>
              <label className="text-[11px] font-bold text-[#2C483F] block mb-1.5">
                {lang === 'ar' ? 'صيغة الخطاب المفضلة مع رفيق:' : 'Preferred Addressing Style:'}
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    playSoftTap();
                    setAddressing('female');
                  }}
                  className={`py-1.5 px-2 rounded-xl text-center font-bold text-[11px] transition-all border ${
                    addressing === 'female'
                      ? 'bg-[#2C483F] text-white border-[#2C483F] shadow-xs'
                      : 'bg-white text-[#2C483F] border-[#D4A373]/30 hover:bg-stone-50'
                  }`}
                >
                  <span>{lang === 'ar' ? 'مؤنث (أهلًا بكِ)' : 'Female (أهلاً بكِ)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playSoftTap();
                    setAddressing('male');
                  }}
                  className={`py-1.5 px-2 rounded-xl text-center font-bold text-[11px] transition-all border ${
                    addressing === 'male'
                      ? 'bg-[#2C483F] text-white border-[#2C483F] shadow-xs'
                      : 'bg-white text-[#2C483F] border-[#D4A373]/30 hover:bg-stone-50'
                  }`}
                >
                  <span>{lang === 'ar' ? 'مذكر (أهلًا بكَ)' : 'Male (أهلاً بكَ)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playSoftTap();
                    setAddressing('neutral');
                  }}
                  className={`py-1.5 px-2 rounded-xl text-center font-bold text-[11px] transition-all border ${
                    addressing === 'neutral'
                      ? 'bg-[#2C483F] text-white border-[#2C483F] shadow-xs'
                      : 'bg-white text-[#2C483F] border-[#D4A373]/30 hover:bg-stone-50'
                  }`}
                >
                  <span>{lang === 'ar' ? 'حيادي (أهلاً بك)' : 'Neutral (أهلاً بك)'}</span>
                </button>
              </div>
            </div>

            {/* Learning Level */}
            <div>
              <label className="text-[11px] font-bold text-[#2C483F] block mb-1.5 flex items-center justify-between">
                <span>{lang === 'ar' ? 'المستوى التعليمي:' : 'Learning Level:'}</span>
                <span className="text-[10px] text-stone-500 font-normal">
                  {learningLevel === 'beginner'
                    ? (lang === 'ar' ? 'شرح دارج ميسر أولاً' : 'Everyday ease first')
                    : learningLevel === 'intermediate'
                    ? (lang === 'ar' ? 'مصطلح شرعي مباشر' : 'Concise Islamic term')
                    : (lang === 'ar' ? 'تأصيل وتوسع موثق' : 'Deeper sourced details')}
                </span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['beginner', 'intermediate', 'advanced'] as LearningLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      playSoftTap();
                      setLearningLevel(lvl);
                    }}
                    className={`py-1.5 px-2 rounded-xl text-center font-bold text-[11px] transition-all border ${
                      learningLevel === lvl
                        ? 'bg-[#2C483F] text-white border-[#2C483F] shadow-xs'
                        : 'bg-white text-[#2C483F] border-[#D4A373]/30 hover:bg-stone-50'
                    }`}
                  >
                    <span>
                      {lvl === 'beginner'
                        ? (lang === 'ar' ? 'مبتدئ' : 'Beginner')
                        : lvl === 'intermediate'
                        ? (lang === 'ar' ? 'متوسط' : 'Intermediate')
                        : (lang === 'ar' ? 'متقدم' : 'Advanced')}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Personalization Button */}
            {onResetPersonalization && (
              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    playPeaceChime();
                    onResetPersonalization();
                    setAddressing('female');
                    setLearningLevel('beginner');
                  }}
                  className="text-[11px] font-semibold text-stone-500 hover:text-stone-800 underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{lang === 'ar' ? 'إعادة ضبط التخصيص' : 'Reset Personalization'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Reset Score Action */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                onResetScore();
                playSoftTap();
              }}
              className="text-[#D4A373] hover:text-[#B27C5A] underline text-xs font-semibold"
            >
              {lang === 'ar' ? 'إعادة ضبط مقياس السكينة (50%)' : 'Reset Tranquility Index (50%)'}
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-[#2C483F] hover:bg-[#20362f] text-white font-bold rounded-xl shadow-soft transition-all duration-200 flex items-center gap-1.5"
            >
              {savedAlert ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'تم الحفظ!' : 'Saved!'}</span>
                </>
              ) : (
                <span>{lang === 'ar' ? 'حفظ التغييرات' : 'Save Settings'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
