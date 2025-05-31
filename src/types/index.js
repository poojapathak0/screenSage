// Type definitions for ScreenSage app

// User and Pet Types
export const PetMood = {
  HAPPY: 'happy',
  NEUTRAL: 'neutral',
  SAD: 'sad',
  EXCITED: 'excited',
  TIRED: 'tired'
};

export const PetAccessoryType = {
  HAT: 'hat',
  COLLAR: 'collar',
  TOY: 'toy',
  BACKGROUND: 'background'
};

export const PetActivityType = {
  FEEDING: 'feeding',
  PLAYING: 'playing',
  SLEEPING: 'sleeping',
  EXERCISING: 'exercising'
};

// Screen Time Types
export const AppCategory = {
  SOCIAL: 'social',
  GAMES: 'games',
  PRODUCTIVITY: 'productivity',
  ENTERTAINMENT: 'entertainment',
  NEWS: 'news',
  HEALTH: 'health',
  EDUCATION: 'education',
  OTHER: 'other'
};

export const UsageLevel = {
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high',
  EXCESSIVE: 'excessive'
};

// AI Prediction Types
export const PredictionType = {
  OVERUSE_WARNING: 'overuse_warning',
  BREAK_SUGGESTION: 'break_suggestion',
  GOAL_ACHIEVEMENT: 'goal_achievement',
  HABIT_INSIGHT: 'habit_insight',
  WELLNESS_TIP: 'wellness_tip'
};

export const PredictionConfidence = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

// Social Features Types
export const ChallengeType = {
  DAILY_LIMIT: 'daily_limit',
  BREAK_FREQUENCY: 'break_frequency',
  APP_SPECIFIC: 'app_specific',
  MINDFUL_USAGE: 'mindful_usage'
};

export const ChallengeStatus = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  FAILED: 'failed',
  PENDING: 'pending'
};

// Notification Types
export const NotificationType = {
  OVERUSE_ALERT: 'overuse_alert',
  BREAK_REMINDER: 'break_reminder',
  GOAL_REMINDER: 'goal_reminder',
  PET_NEEDS: 'pet_needs',
  SOCIAL_UPDATE: 'social_update',
  AI_INSIGHT: 'ai_insight'
};

// Settings Types
export const ThemeMode = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

export const PrivacyLevel = {
  PUBLIC: 'public',
  FRIENDS: 'friends',
  PRIVATE: 'private'
};

// Data validation helpers
export const isValidUsageData = (data) => {
  return data && 
         typeof data.totalTime === 'number' && 
         Array.isArray(data.apps) &&
         data.date instanceof Date;
};

export const isValidPetData = (data) => {
  return data &&
         typeof data.health === 'number' &&
         typeof data.happiness === 'number' &&
         typeof data.energy === 'number' &&
         data.health >= 0 && data.health <= 100 &&
         data.happiness >= 0 && data.happiness <= 100 &&
         data.energy >= 0 && data.energy <= 100;
};

export const isValidGoal = (goal) => {
  return goal &&
         typeof goal.target === 'number' &&
         goal.target > 0 &&
         ['daily', 'weekly', 'monthly'].includes(goal.period);
};
