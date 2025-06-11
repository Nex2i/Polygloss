import { LessonPlan } from '@/types/LessonPlan';
import level1 from './lesson-plans/level-1.json';
import level2 from './lesson-plans/level-2.json';
import level3 from './lesson-plans/level-3.json';
import level4 from './lesson-plans/level-4.json';
import level5 from './lesson-plans/level-5.json';

// Dictionary of lesson plans indexed by skill level
export const lessonPlansDict: Record<number, LessonPlan> = {
  1: level1 as LessonPlan,
  2: level2 as LessonPlan,
  3: level3 as LessonPlan,
  4: level4 as LessonPlan,
  5: level5 as LessonPlan,
};

// Helper function to get all available skill levels
export const getAvailableSkillLevels = (): number[] => {
  return Object.keys(lessonPlansDict)
    .map(Number)
    .sort((a, b) => a - b);
};

// Helper function to get lesson plan by skill level
export const getLessonPlanBySkillLevel = (skillLevel: number): LessonPlan | undefined => {
  return lessonPlansDict[skillLevel] ?? lessonPlansDict[5];
};
