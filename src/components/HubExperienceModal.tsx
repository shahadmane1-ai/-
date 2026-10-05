import React from 'react';
import { LandmarkId, Language, Experience } from '../types';
import { CITY_LANDMARKS } from '../data/simulationData';
import { BuildingDetailModal } from './BuildingDetailModal';

interface HubExperienceModalProps {
  landmarkId: LandmarkId | null;
  isOpen: boolean;
  onClose: () => void;
  onAdjustScore?: (delta: number, label: string, type: 'peace' | 'stress') => void;
  lang: Language;
  onStartExperience?: (exp: Experience) => void;
  completedExperiences?: string[];
  completedTasks?: string[];
}

export const HubExperienceModal: React.FC<HubExperienceModalProps> = ({
  landmarkId,
  isOpen,
  onClose,
  lang,
  onStartExperience,
  completedExperiences = [],
  completedTasks = [],
}) => {
  if (!isOpen || !landmarkId) return null;

  const currentLandmark = CITY_LANDMARKS.find((lm) => lm.id === landmarkId) || null;

  return (
    <BuildingDetailModal
      landmark={currentLandmark}
      isOpen={isOpen}
      onClose={onClose}
      lang={lang}
      onStartExperience={onStartExperience}
      completedExperiences={completedExperiences}
      completedTasks={completedTasks}
    />
  );
};
