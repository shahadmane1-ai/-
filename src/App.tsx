/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { TopNavbar } from './components/TopNavbar';
import { HeroCompanionSection } from './components/HeroCompanionSection';
import { SevenDayJourneyStepper } from './components/SevenDayJourneyStepper';
import { IsometricCityMap } from './components/IsometricCityMap';
import { ActiveScenarioModal } from './components/ActiveScenarioModal';
import { ProactiveCompanionHUD } from './components/ProactiveCompanionHUD';
import { WorldMemoryModal } from './components/WorldMemoryModal';
import { InteractiveTranquilityStation } from './components/InteractiveTranquilityStation';
import { DailyEmotionalRadar } from './components/DailyEmotionalRadar';
import { HumanReferralModal } from './components/HumanReferralModal';
import { SettingsModal } from './components/SettingsModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ClarityFatwaSanctuaryModal } from './components/ClarityFatwaSanctuaryModal';
import { JudgeTourModal } from './components/JudgeTourModal';
import { SystemGovernanceModal } from './components/SystemGovernanceModal';
import { HubExperienceModal } from './components/HubExperienceModal';
import { ExperiencePlayerModal } from './components/ExperiencePlayerModal';
import { DailyTaskModal } from './components/DailyTaskModal';
import { AiPipelineTraceModal } from './components/AiPipelineTraceModal';
import { AnasMiniGameLabModal } from './components/AnasMiniGameLabModal';
import { ToastContainer, ToastMessage } from './components/ToastContainer';
import { Footer } from './components/Footer';
import {
  AnasEmotion,
  FloatingBadge,
  LandmarkId,
  Language,
  UserProfile,
  UserSettings,
  WorldMemoryState,
  Experience,
  DailyTask,
  AiPipelineTraceData,
  UserPersonalizationProfile,
  AddressingPreference,
} from './types';
import { loadUserPersonalization, saveUserPersonalization, resetUserPersonalization } from './services/userAdaptation';
import { generateStructuredExperience } from './services/experienceGenerator';
import {
  loadRafiqDynamicSession,
  updateSessionTranquility,
  EVENT_SESSION_UPDATED,
} from './services/sessionStore';
import {
  CITY_LANDMARKS,
  JOURNEY_DAYS,
  THIRTY_DAY_JOURNEY,
  WEEK_MILESTONES,
  experiences,
  dailyTasks,
} from './data/simulationData';
import { playPeaceChime, playSoftTap } from './utils/audio';
import { UmrahInteractiveSimModal } from './components/UmrahInteractiveSimModal';
import { HajjInteractiveSimModal } from './components/HajjInteractiveSimModal';
import { UmrahLauncherCard } from './components/UmrahLauncherCard';

export default function App() {
  // Arabic-first default or from localStorage
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('rafeeq_lang') as Language;
    if (saved && (saved === 'ar' || saved === 'en')) {
      return saved;
    }
    return 'ar';
  });

  // User Profile State & Onboarding Questionnaire
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('rafeeq_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.cityType === 'islamic' || parsed.cityType === 'isolated') {
          parsed.cityType = 'multicultural';
          localStorage.setItem('rafeeq_user_profile', JSON.stringify(parsed));
        }
        return parsed;
      } catch {
        // Fallback
      }
    }
    return {
      gender: 'male',
      ageGroup: 'adult',
      country: 'المملكة العربية السعودية',
      cityType: 'multicultural',
      completedOnboarding: false,
    };
  });

  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem('rafeeq_user_profile');
    if (!saved) return true; // Auto-open for first-time visitors!
    try {
      const parsed = JSON.parse(saved);
      return !parsed.completedOnboarding;
    } catch {
      return true;
    }
  });

  // Real-time dynamic tranquility score (starts from baseline ~45%, updated by session store)
  const [score, setScore] = useState<number>(() => loadRafiqDynamicSession().tranquilityScore);
  const [recentBadges, setRecentBadges] = useState<FloatingBadge[]>([]);

  // Synchronize score whenever any module or Gemini action updates the dynamic session
  useEffect(() => {
    const handleSessionUpdated = (e: any) => {
      if (e?.detail?.tranquilityScore !== undefined) {
        setScore(e.detail.tranquilityScore);
      }
    };
    window.addEventListener(EVENT_SESSION_UPDATED, handleSessionUpdated);
    return () => window.removeEventListener(EVENT_SESSION_UPDATED, handleSessionUpdated);
  }, []);

  // Simulation World State
  const [activeDayNumber, setActiveDayNumber] = useState<number>(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [activeLandmarkId, setActiveLandmarkId] = useState<LandmarkId | null>(null);
  const [completedLandmarks, setCompletedLandmarks] = useState<LandmarkId[]>([]);
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState<boolean>(false);
  const [isWorldMemoryOpen, setIsWorldMemoryOpen] = useState<boolean>(false);
  const [isFatwaSanctuaryOpen, setIsFatwaSanctuaryOpen] = useState<boolean>(false);
  const [isJudgeTourOpen, setIsJudgeTourOpen] = useState<boolean>(false);
  const [isGovernanceOpen, setIsGovernanceOpen] = useState<boolean>(false);

  // Living Proactive Companion HUD State
  const [anasEmotion, setAnasEmotion] = useState<AnasEmotion>('smiling');
  const [proactiveSpeechAr, setProactiveSpeechAr] = useState<string>(
    'مرحباً بك يا صاحبي في رفيق! الأسبوع التأسيسي متاح بالكامل (الأيام 1-7) تمهيداً لبناء التجارب والمهام الجديدة المربوطة بمعالم المدينة.'
  );
  const [proactiveSpeechEn, setProactiveSpeechEn] = useState<string>(
    'Welcome, dear companion, to Rafeeq! Foundational Week (Days 1-7) is ready in preparation for new building-owned learning experiences.'
  );

  // World Memory Engine State & LocalStorage Migration (Requirement 8)
  const [worldMemory, setWorldMemory] = useState<WorldMemoryState>(() => {
    // Purge obsolete experience/task state from LocalStorage
    localStorage.removeItem('rafeeq_completed_scenarios');
    localStorage.removeItem('rafeeq_completed_quests');
    localStorage.removeItem('rafeeq_active_scenario');
    localStorage.removeItem('rafeeq_completed_experiences');
    localStorage.removeItem('rafeeq_completed_tasks');

    const saved = localStorage.getItem('rafeeq_world_memory');
    let baseMemory: WorldMemoryState = {
      currentDay: 1,
      week1Completed: false,
      completedExperiences: [],
      completedTasks: [],
      milestonesUnlocked: [],
      totalPeaceEarned: 0,
      totalStressAlleviated: 0,
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Safely migrate/reset:
        // completedExperiences = []
        // completedTasks = []
        // currentDay = 1
        // week1Completed = false
        baseMemory = {
          ...baseMemory,
          totalPeaceEarned: typeof parsed.totalPeaceEarned === 'number' ? parsed.totalPeaceEarned : 0,
          totalStressAlleviated:
            typeof parsed.totalStressAlleviated === 'number' ? parsed.totalStressAlleviated : 0,
        };
      } catch {
        // Fallback
      }
    }
    localStorage.setItem('rafeeq_world_memory', JSON.stringify(baseMemory));
    return baseMemory;
  });

  // Modals state
  const [isHumanReferralOpen, setIsHumanReferralOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeHubExperienceId, setActiveHubExperienceId] = useState<LandmarkId | null>(null);
  const [playingExperience, setPlayingExperience] = useState<Experience | null>(null);
  const [playingTask, setPlayingTask] = useState<DailyTask | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // User Personalization Profile & Live AI Trace State (Requirement 1 & 19)
  const [personalization, setPersonalization] = useState<UserPersonalizationProfile>(() =>
    loadUserPersonalization()
  );
  const [liveAiTrace, setLiveAiTrace] = useState<AiPipelineTraceData | null>(null);
  const [isTraceModalOpen, setIsTraceModalOpen] = useState<boolean>(false);
  const [isMiniGameLabOpen, setIsMiniGameLabOpen] = useState<boolean>(false);
  const [isUmrahSimOpen, setIsUmrahSimOpen] = useState<boolean>(false);
  const [isHajjSimOpen, setIsHajjSimOpen] = useState<boolean>(false);
  const [miniGameLabTopic, setMiniGameLabTopic] = useState<string | undefined>(undefined);
  const [miniGameLabQuery, setMiniGameLabQuery] = useState<string | undefined>(undefined);

  const handleOpenMiniGameLab = (topic?: string, query?: string) => {
    setMiniGameLabTopic(topic);
    setMiniGameLabQuery(query);
    setIsMiniGameLabOpen(true);
  };

  // Dynamic Opener for any Experience (by ID or Generative 2.5D)
  const handleOpenExperienceById = (expId: string) => {
    const target = experiences.find((e) => e.experienceId === expId);
    if (target) {
      setPlayingExperience(target);
    } else {
      const genExp = generateStructuredExperience({
        topic: expId.includes('university') ? 'university_campus' : 'family_parents',
        userProfile: personalization,
        customLocation: expId.includes('university') ? 'university' : 'apartment',
      });
      setPlayingExperience(genExp as unknown as Experience);
    }
  };

  const showToast = (message: string, type: 'success' | 'info' | 'peace' | 'warning' = 'peace', title?: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type, title }]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Handle Completing an Experience (14 Real-Life Playable Mini-Games)
  const handleCompleteExperience = (experienceId: string) => {
    setWorldMemory((prev) => {
      const alreadyCompleted = prev.completedExperiences.includes(experienceId);
      const newCompleted = alreadyCompleted
        ? prev.completedExperiences
        : [...prev.completedExperiences, experienceId];

      const exp = experiences.find((e) => e.experienceId === experienceId);
      const updatedMemory: WorldMemoryState = {
        ...prev,
        completedExperiences: newCompleted,
        totalPeaceEarned: (prev.totalPeaceEarned || 0) + (alreadyCompleted ? 5 : 20),
      };

      if (exp) {
        const dayExps = experiences.filter((e) => e.day === exp.day);
        const dayTask = dailyTasks.find((t) => t.day === exp.day);
        const allDayExpsDone = dayExps.every((e) => newCompleted.includes(e.experienceId));
        const dayTaskDone = !dayTask || prev.completedTasks.includes(dayTask.taskId);

        if (allDayExpsDone && dayTaskDone) {
          setCompletedDays((cd) => (cd.includes(exp.day) ? cd : [...cd, exp.day]));
        }
      }

      localStorage.setItem('rafeeq_world_memory', JSON.stringify(updatedMemory));
      return updatedMemory;
    });

    handleAdjustScore(
      15,
      lang === 'ar' ? '+15 سكينة: إتمام تجربة واقعية' : '+15 Serenity: Real Experience Done',
      'peace'
    );
    showToast(
      lang === 'ar' ? 'أحسنت! أتممت التجربة بنجاح واكتسبت فهماً وسكينة.' : 'Well done! Experience completed with tranquility.',
      'peace'
    );
    setPlayingExperience(null);
  };

  // Handle Completing a Daily Task (7 Real-Life Practical Tasks)
  const handleCompleteTask = (taskId: string) => {
    setWorldMemory((prev) => {
      const alreadyCompleted = prev.completedTasks.includes(taskId);
      const newCompleted = alreadyCompleted
        ? prev.completedTasks
        : [...prev.completedTasks, taskId];

      const task = dailyTasks.find((t) => t.taskId === taskId);
      const updatedMemory: WorldMemoryState = {
        ...prev,
        completedTasks: newCompleted,
        totalPeaceEarned: (prev.totalPeaceEarned || 0) + (alreadyCompleted ? 5 : 15),
      };

      if (task) {
        const dayExps = experiences.filter((e) => e.day === task.day);
        const allDayExpsDone = dayExps.every((e) => prev.completedExperiences.includes(e.experienceId));
        if (allDayExpsDone) {
          setCompletedDays((cd) => (cd.includes(task.day) ? cd : [...cd, task.day]));
        }
      }

      localStorage.setItem('rafeeq_world_memory', JSON.stringify(updatedMemory));
      return updatedMemory;
    });

    handleAdjustScore(
      10,
      lang === 'ar' ? '+10 سكينة: إنجاز مهمة واقعية' : '+10 Serenity: Real Task Done',
      'peace'
    );
    showToast(
      lang === 'ar' ? 'مبارك! أنجزت مهمتك التطبيقية في الحياة.' : 'Congratulations! Real-life daily task completed.',
      'peace'
    );
    setPlayingTask(null);
  };

  // Settings
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('rafeeq_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return {
      geminiApiKey: '',
      soundEnabled: true,
      dailyReminder: true,
      voiceGender: 'anas',
    };
  });

  // Sync RTL / LTR document attributes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  }, [lang]);

  // Adjust live Tranquility Index score with floating change badges & session sync
  const handleAdjustScore = (delta: number, label: string, type: 'peace' | 'stress') => {
    setScore((prev) => Math.min(100, Math.max(0, prev + delta)));
    updateSessionTranquility(delta, label);

    const newBadge: FloatingBadge = {
      id: `${Date.now()}-${Math.random()}`,
      text: label,
      type,
      value: delta,
      timestamp: Date.now(),
    };

    setRecentBadges((prev) => [...prev, newBadge]);

    // Auto remove badge after animation
    setTimeout(() => {
      setRecentBadges((prev) => prev.filter((b) => b.id !== newBadge.id));
    }, 2800);
  };

  const handleSelectLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('rafeeq_lang', newLang);
  };

  const handleToggleLang = () => {
    const cycle: Language[] = ['ar', 'en', 'fr', 'es'];
    const nextIdx = (cycle.indexOf(lang) + 1) % cycle.length;
    handleSelectLang(cycle[nextIdx]);
  };

  const handleSaveProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem('rafeeq_user_profile', JSON.stringify(newProfile));

    // Ensure personalization addressing matches the explicitly saved gender
    setPersonalization((prev) => {
      const updated: UserPersonalizationProfile = {
        ...prev,
        preferredAddressing: (newProfile.gender === 'female' ? 'female' : 'male') as AddressingPreference,
      };
      saveUserPersonalization(updated);
      return updated;
    });

    if (newProfile.cityType === 'islamic') {
      handleAdjustScore(10, lang === 'ar' ? '+10 سكينة بيئة داعمة' : '+10 Islamic City Serenity', 'peace');
    } else if (newProfile.cityType === 'isolated') {
      handleAdjustScore(15, lang === 'ar' ? '+15 أجر العزيمة والصبر' : '+15 Pioneer Resilience', 'peace');
    }
  };

  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    localStorage.setItem('rafeeq_settings', JSON.stringify(newSettings));
  };

  const handleResetScore = () => {
    setScore(50);
    setRecentBadges([]);
  };

  const handleSavePersonalization = (newProfile: UserPersonalizationProfile) => {
    setPersonalization(newProfile);
    saveUserPersonalization(newProfile);

    // Sync userProfile gender with the chosen addressing
    if (newProfile.preferredAddressing === 'female' || newProfile.preferredAddressing === 'male') {
      setUserProfile((prev) => {
        const updated = {
          ...prev,
          gender: newProfile.preferredAddressing as 'male' | 'female',
        };
        localStorage.setItem('rafeeq_user_profile', JSON.stringify(updated));
        return updated;
      });
    }

    showToast(
      lang === 'ar' ? 'تم حفظ تفضيلات الخطاب والتعلم بنجاح 🌿' : 'Personalization saved successfully 🌿',
      'peace'
    );
  };

  const handleResetPersonalization = () => {
    const fresh = resetUserPersonalization();
    setPersonalization(fresh);
    showToast(
      lang === 'ar' ? 'تمت إعادة ضبط التفضيلات إلى الحالة الأولية' : 'Personalization reset to default',
      'info'
    );
  };

  // Requirement 5: BUILDINGS WILL OWN THE EXPERIENCES
  // CITY -> User clicks an actual building -> Building details/context -> Experiences associated with THAT building -> User starts the experience
  const handleSelectLandmark = (landmarkId: LandmarkId) => {
    setActiveLandmarkId(landmarkId);
    setActiveHubExperienceId(landmarkId);

    const landmark = CITY_LANDMARKS.find((lm) => lm.id === landmarkId);
    if (landmark) {
      setAnasEmotion('holding_lantern');
      setProactiveSpeechAr(
        `أهلاً بك في ${landmark.nameAr}.. استكشف تفاصيل هذا المعلم والتجارب المرتبطة به.`
      );
      setProactiveSpeechEn(
        `Welcome to ${landmark.nameEn}.. Explore this landmark context and its experiences.`
      );
    }
  };

  // Day Stepper Selection Handler (Days 1–7 available, Days 8–30 locked)
  const handleSelectDay = (dayNum: number) => {
    if (dayNum > 7) {
      // Days 8–30 completely locked (Requirement 7)
      setActiveDayNumber(1);
      return;
    }
    setActiveDayNumber(dayNum);
  };

  const handleResetWorldMemory = () => {
    const freshMemory: WorldMemoryState = {
      currentDay: 1,
      week1Completed: false,
      completedExperiences: [],
      completedTasks: [],
      milestonesUnlocked: [],
      totalPeaceEarned: 0,
      totalStressAlleviated: 0,
    };
    setWorldMemory(freshMemory);
    setActiveDayNumber(1);
    setCompletedDays([]);
    setCompletedLandmarks([]);
    localStorage.setItem('rafeeq_world_memory', JSON.stringify(freshMemory));
  };

  const activeDay = useMemo(() => {
    return JOURNEY_DAYS.find((d) => d.dayNumber === activeDayNumber) || JOURNEY_DAYS[0];
  }, [activeDayNumber]);

  const scrollToSimulation = () => {
    const el = document.getElementById('city-simulation-stage');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#2C483F] font-arabic antialiased selection:bg-[#D4A373]/25 selection:text-[#2C483F]">
      {/* Top Navigation Bar with strict 3-zone contract */}
      <TopNavbar
        score={score}
        recentBadges={recentBadges}
        onAdjustScore={handleAdjustScore}
        lang={lang}
        onSelectLang={handleSelectLang}
        onToggleLang={handleToggleLang}
        currentProfile={userProfile}
        onOpenProfile={() => setIsOnboardingOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHumanReferral={() => setIsHumanReferralOpen(true)}
        onOpenFatwaSanctuary={() => setIsFatwaSanctuaryOpen(true)}
        onOpenJudgeTour={() => setIsJudgeTourOpen(true)}
        onOpenGovernance={() => setIsGovernanceOpen(true)}
        onOpenMiniGameLab={() => handleOpenMiniGameLab()}
        onOpenUmrah={() => setIsUmrahSimOpen(true)}
        onOpenHajj={() => setIsHajjSimOpen(true)}
      />

      {/* Main Content Canvas */}
      <main className="relative space-y-6">
        {/* 1. Hero Welcome Section & Large Conversational Rafeeq Lab Entry Panel */}
        <HeroCompanionSection
          score={score}
          onAdjustScore={handleAdjustScore}
          lang={lang}
          onOpenJourney={scrollToSimulation}
          onOpenMiniGameLab={() => handleOpenMiniGameLab()}
          userProfile={userProfile}
        />

        {/* 2. Daily Guidance — Prophetic Guidance for Everyday Situations */}
        <DailyEmotionalRadar
          score={score}
          onAdjustScore={handleAdjustScore}
          lang={lang}
          userProfile={userProfile}
          personalization={personalization}
          onOpenMiniGameLab={handleOpenMiniGameLab}
        />

        {/* 3. 2.5D Simulation World: Interactive City Map & 7-Day Empowerment Stepper */}
        <section id="city-simulation-stage" className="py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Days 1-7 Progression Stepper (Requirement 6 & 7) */}
            <SevenDayJourneyStepper
              activeDay={activeDayNumber}
              completedDays={completedDays}
              onSelectDay={handleSelectDay}
              worldMemory={worldMemory}
              onOpenMemoryModal={() => setIsWorldMemoryOpen(true)}
              lang={lang}
              onOpenScenarioModal={() => setIsScenarioModalOpen(true)}
              onStartExperience={(exp) => setPlayingExperience(exp)}
              onOpenTaskModal={(task) => setPlayingTask(task)}
            />

            {/* Interactive 2.5D Isometric City Map with Preserved City Visual Design (Requirement 9) */}
            <IsometricCityMap
              activeLandmarkId={activeLandmarkId}
              onSelectLandmark={handleSelectLandmark}
              completedLandmarks={completedLandmarks}
              activeDayNumber={activeDayNumber}
              lang={lang}
              userProfile={userProfile}
              onOpenProfile={() => setIsOnboardingOpen(true)}
              onOpenHubExperience={(expOrLandmarkId) => {
                const matchedExp = experiences.find((e) => e.experienceId === expOrLandmarkId);
                if (matchedExp) {
                  setPlayingExperience(matchedExp);
                  return;
                }
                const isLandmark = CITY_LANDMARKS.some((lm) => lm.id === expOrLandmarkId);
                if (isLandmark) {
                  setActiveHubExperienceId(expOrLandmarkId as LandmarkId);
                } else {
                  handleOpenExperienceById(expOrLandmarkId);
                }
              }}
            />
          </div>
        </section>

        {/* 4. Interactive Umrah & Hajj Rituals Section */}
        <section className="py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <UmrahLauncherCard
              onOpenUmrah={() => setIsUmrahSimOpen(true)}
              onOpenHajj={() => setIsHajjSimOpen(true)}
              lang={lang}
            />
          </div>
        </section>

        {/* 5. Live Interactive Tranquility Station (Mosque Gate Pulse, Sunnah Wudu Gauge, Thought Offloading) */}
        <InteractiveTranquilityStation
          onAdjustScore={handleAdjustScore}
          lang={lang}
        />
      </main>

      {/* Living Proactive Companion HUD featuring 'Anas' */}
      <ProactiveCompanionHUD
        currentEmotion={anasEmotion}
        proactiveSpeechAr={proactiveSpeechAr}
        proactiveSpeechEn={proactiveSpeechEn}
        lang={lang}
        onAdjustScore={handleAdjustScore}
        userProfile={userProfile}
        activeDayNumber={activeDayNumber}
        dailyTasks={dailyTasks}
        completedTaskIds={worldMemory.completedTasks || []}
        onOpenTaskModal={(task) => setPlayingTask(task)}
        onOpenExperience={handleOpenExperienceById}
        completedDays={completedDays}
        tranquilityScore={score}
      />

      {/* Day Progression Details Modal */}
      <ActiveScenarioModal
        day={activeDay}
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
        worldMemory={worldMemory}
        score={score}
        lang={lang}
        onStartExperience={(exp) => setPlayingExperience(exp)}
        onOpenTaskModal={(task) => setPlayingTask(task)}
      />

      {/* World Memory & Active Recall Modal */}
      <WorldMemoryModal
        isOpen={isWorldMemoryOpen}
        onClose={() => setIsWorldMemoryOpen(false)}
        worldMemory={worldMemory}
        score={score}
        onResetMemory={handleResetWorldMemory}
        lang={lang}
      />

      {/* Onboarding & Profile Customization Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        currentProfile={userProfile}
        onSaveProfile={handleSaveProfile}
        lang={lang}
        onSelectLang={handleSelectLang}
      />

      {/* Footer */}
      <Footer
        lang={lang}
        onOpenHumanReferral={() => setIsHumanReferralOpen(true)}
      />

      {/* Human Specialist Referral Modal */}
      <HumanReferralModal
        isOpen={isHumanReferralOpen}
        onClose={() => setIsHumanReferralOpen(false)}
        lang={lang}
      />

      {/* Settings Modal (Gemini API Key, sound, daily reminder, personalization) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onResetScore={handleResetScore}
        lang={lang}
        personalization={personalization}
        onSavePersonalization={handleSavePersonalization}
        onResetPersonalization={handleResetPersonalization}
      />

      {/* Persistent Clarity & Fatwa Sanctuary Modal */}
      <ClarityFatwaSanctuaryModal
        isOpen={isFatwaSanctuaryOpen}
        onClose={() => setIsFatwaSanctuaryOpen(false)}
        lang={lang}
      />

      {/* Judge Tour & Quick Teleport Modal */}
      <JudgeTourModal
        isOpen={isJudgeTourOpen}
        onClose={() => setIsJudgeTourOpen(false)}
        lang={lang}
        onSelectDay={(dayNum) => {
          handleSelectDay(dayNum);
        }}
        currentDay={activeDayNumber}
        onSwitchCityType={(cityType) => {
          handleSaveProfile({ ...userProfile, cityType });
        }}
        currentProfile={userProfile}
        onAdjustScore={handleAdjustScore}
        currentScore={score}
        onOpenHubExperience={(hubId) => setActiveHubExperienceId(hubId)}
        onOpenTraceModal={() => setIsTraceModalOpen(true)}
      />

      {/* Sources, Transparency & System Governance Modal */}
      <SystemGovernanceModal
        isOpen={isGovernanceOpen}
        onClose={() => setIsGovernanceOpen(false)}
        lang={lang}
      />

      {/* Building Details & Associated Experiences Modal (Requirement 4 & 5) */}
      <HubExperienceModal
        landmarkId={activeHubExperienceId}
        isOpen={activeHubExperienceId !== null}
        onClose={() => setActiveHubExperienceId(null)}
        onAdjustScore={(delta, label, type) => {
          handleAdjustScore(delta, label, type);
          showToast(label, 'peace');
        }}
        lang={lang}
        onStartExperience={(exp) => setPlayingExperience(exp)}
        completedExperiences={worldMemory.completedExperiences || []}
        completedTasks={worldMemory.completedTasks || []}
      />

      {/* 14 Playable Mini-Games Experience Player Modal */}
      <ExperiencePlayerModal
        experience={playingExperience}
        isOpen={playingExperience !== null}
        onClose={() => setPlayingExperience(null)}
        onComplete={handleCompleteExperience}
        lang={lang}
      />

      {/* 7 Daily Practical Tasks Modal */}
      <DailyTaskModal
        task={playingTask}
        isOpen={playingTask !== null}
        onClose={() => setPlayingTask(null)}
        onComplete={handleCompleteTask}
        isCompleted={playingTask ? (worldMemory.completedTasks || []).includes(playingTask.taskId) : false}
        lang={lang}
      />

      {/* Developer / Judge Live AI Trace Modal (Requirement 19) */}
      <AiPipelineTraceModal
        trace={liveAiTrace}
        isOpen={isTraceModalOpen}
        onClose={() => setIsTraceModalOpen(false)}
        lang={lang}
      />

      {/* Anas AI Mini-Game Lab Modal (مختبر أنس للذكاء الاصطناعي - ألعاب تفاعلية 2D) */}
      <AnasMiniGameLabModal
        isOpen={isMiniGameLabOpen}
        onClose={() => setIsMiniGameLabOpen(false)}
        lang={lang}
        initialTopic={miniGameLabTopic}
        initialQuery={miniGameLabQuery}
        userProfile={personalization}
        onAdjustScore={handleAdjustScore}
        onOpenUmrah={() => setIsUmrahSimOpen(true)}
        onOpenHajj={() => setIsHajjSimOpen(true)}
      />

      {/* Interactive Umrah Rituals & Final Quiz Simulator Modal */}
      <UmrahInteractiveSimModal
        isOpen={isUmrahSimOpen}
        onClose={() => setIsUmrahSimOpen(false)}
        lang={lang}
        onAdjustScore={handleAdjustScore}
        userGender={userProfile.gender}
      />

      {/* Interactive Hajj & Tamattu' Rituals & Final Quiz Simulator Modal */}
      <HajjInteractiveSimModal
        isOpen={isHajjSimOpen}
        onClose={() => setIsHajjSimOpen(false)}
        lang={lang}
        onAdjustScore={handleAdjustScore}
        userGender={userProfile.gender}
      />

      {/* Zero-Dependency Mobile-Friendly Toast System */}
      <ToastContainer
        toasts={toasts}
        onDismiss={handleDismissToast}
        lang={lang}
      />
    </div>
  );
}
