import React from 'react';
import { Experience, Language } from '../types';
import { Interactive2D5StageEngine } from './Interactive2D5StageEngine';

interface ExperiencePlayerModalProps {
  experience: Experience | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (experienceId: string) => void;
  onNextExperience?: () => void;
  lang: Language;
}

export const ExperiencePlayerModal: React.FC<ExperiencePlayerModalProps> = ({
  experience,
  isOpen,
  onClose,
  onComplete,
  onNextExperience,
  lang,
}) => {
  if (!isOpen || !experience) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#14231E]/80 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[96vh] overflow-y-auto bg-white/98 backdrop-blur-md rounded-3xl border-2 border-[#D4A373]/50 shadow-2xl p-3 sm:p-5 text-start"
        onClick={(e) => e.stopPropagation()}
      >
        <Interactive2D5StageEngine
          experience={experience}
          lang={lang}
          onClose={onClose}
          onFinish={() => onComplete(experience.experienceId)}
          onNextExperience={onNextExperience}
        />
      </div>
    </div>
  );
};
