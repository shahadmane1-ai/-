import { DailyTask, WeekMilestone } from '../types';

// Reset all old daily tasks. No fake content.
export const dailyTasks: DailyTask[] = [];

export const WEEK_MILESTONES: WeekMilestone[] = [
  {
    weekNumber: 1,
    titleAr: 'الأسبوع 1 (الأيام 1-7): الأسبوع التأسيسي',
    titleEn: 'Week 1 (Days 1-7): Foundational Week',
    themeAr: 'السكينة والبدايات: تفريغ القلق وبناء الطمأنينة',
    themeEn: 'Foundations & Serenity: Building inner peace step-by-step',
    daysRange: [1, 7],
    icon: '🌱',
    badgeLabelAr: 'وسام الأسبوع التأسيسي',
    badgeLabelEn: 'Foundational Week Medal',
    isLocked: false,
  },
  {
    weekNumber: 2,
    titleAr: 'الأسبوع 2 (الأيام 8-14): مرحلة متقدمة',
    titleEn: 'Week 2 (Days 8-14): Advanced Phase',
    themeAr: 'مرحلة متقدمة — تفتح في التحديث القادم بعد إتمام الأسبوع التأسيسي',
    themeEn: 'Advanced Stage — Unlocks in the upcoming update after completing the foundational week',
    daysRange: [8, 14],
    icon: '🔒',
    badgeLabelAr: 'مغلق',
    badgeLabelEn: 'Locked',
    isLocked: true,
  },
  {
    weekNumber: 3,
    titleAr: 'الأسبوع 3 (الأيام 15-21): مرحلة متقدمة',
    titleEn: 'Week 3 (Days 15-21): Advanced Phase',
    themeAr: 'مرحلة متقدمة — تفتح في التحديث القادم بعد إتمام الأسبوع التأسيسي',
    themeEn: 'Advanced Stage — Unlocks in the upcoming update after completing the foundational week',
    daysRange: [15, 21],
    icon: '🔒',
    badgeLabelAr: 'مغلق',
    badgeLabelEn: 'Locked',
    isLocked: true,
  },
  {
    weekNumber: 4,
    titleAr: 'الأسبوع 4 (الأيام 22-30): مرحلة متقدمة',
    titleEn: 'Week 4 (Days 22-30): Advanced Phase',
    themeAr: 'مرحلة متقدمة — تفتح في التحديث القادم بعد إتمام الأسبوع التأسيسي',
    themeEn: 'Advanced Stage — Unlocks in the upcoming update after completing the foundational week',
    daysRange: [22, 30],
    icon: '🔒',
    badgeLabelAr: 'مغلق',
    badgeLabelEn: 'Locked',
    isLocked: true,
  },
];
