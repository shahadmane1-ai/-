import { Experience, JourneyDay } from '../types';

// Conceptually: experiences = []
export const experiences: Experience[] = [];

// Days 1–7 are available.
// Days 8–30 are locked: "مرحلة متقدمة — تفتح في التحديث القادم بعد إتمام الأسبوع التأسيسي"
export const JOURNEY_DAYS: JourneyDay[] = Array.from({ length: 30 }, (_, index) => {
  const dayNumber = index + 1;
  const isLocked = dayNumber > 7;
  const weekNumber = (dayNumber <= 7 ? 1 : dayNumber <= 14 ? 2 : dayNumber <= 21 ? 3 : 4) as 1 | 2 | 3 | 4;

  return {
    dayNumber,
    weekNumber,
    title: {
      ar: `اليوم ${dayNumber}`,
      en: `Day ${dayNumber}`,
    },
    isLocked,
  };
});

export const THIRTY_DAY_JOURNEY = JOURNEY_DAYS;
export const SEVEN_DAY_JOURNEY = JOURNEY_DAYS.slice(0, 7);
