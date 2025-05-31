// Utility functions for ScreenSage app
import { AppCategory, UsageLevel, PetMood } from '../types';

// Time formatting utilities
export const formatTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}m`;
};

export const formatDetailedTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${remainingMinutes} minutes`;
};

export const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 21) return 'evening';
  return 'night';
};

// Date utilities
export const getDateRange = (days) => {
  const dates = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date);
  }
  return dates;
};

export const formatDate = (date) => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

export const isToday = (date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isThisWeek = (date) => {
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  return date >= startOfWeek;
};

// App categorization
export const categorizeApp = (appName) => {
  const socialApps = ['facebook', 'instagram', 'twitter', 'snapchat', 'tiktok', 'whatsapp', 'telegram'];
  const gameApps = ['game', 'play', 'clash', 'candy', 'pokemon', 'minecraft'];
  const productivityApps = ['office', 'word', 'excel', 'sheets', 'docs', 'notion', 'slack', 'teams'];
  const entertainmentApps = ['netflix', 'youtube', 'spotify', 'disney', 'hulu', 'amazon prime'];
  const newsApps = ['news', 'cnn', 'bbc', 'reddit', 'medium'];
  const healthApps = ['health', 'fitness', 'meditation', 'headspace', 'calm', 'fitbit'];
  const educationApps = ['duolingo', 'coursera', 'udemy', 'khan', 'education', 'learning'];

  const appLower = appName.toLowerCase();

  if (socialApps.some(app => appLower.includes(app))) return AppCategory.SOCIAL;
  if (gameApps.some(app => appLower.includes(app))) return AppCategory.GAMES;
  if (productivityApps.some(app => appLower.includes(app))) return AppCategory.PRODUCTIVITY;
  if (entertainmentApps.some(app => appLower.includes(app))) return AppCategory.ENTERTAINMENT;
  if (newsApps.some(app => appLower.includes(app))) return AppCategory.NEWS;
  if (healthApps.some(app => appLower.includes(app))) return AppCategory.HEALTH;
  if (educationApps.some(app => appLower.includes(app))) return AppCategory.EDUCATION;

  return AppCategory.OTHER;
};

// Usage level calculation
export const calculateUsageLevel = (minutes, targetMinutes) => {
  const ratio = minutes / targetMinutes;
  if (ratio <= 0.8) return UsageLevel.LOW;
  if (ratio <= 1.0) return UsageLevel.MODERATE;
  if (ratio <= 1.5) return UsageLevel.HIGH;
  return UsageLevel.EXCESSIVE;
};

// Pet health calculations
export const calculatePetMood = (health, happiness, energy) => {
  const average = (health + happiness + energy) / 3;
  if (average >= 90) return PetMood.EXCITED;
  if (average >= 70) return PetMood.HAPPY;
  if (average >= 50) return PetMood.NEUTRAL;
  if (average >= 30) return PetMood.SAD;
  return PetMood.TIRED;
};

export const calculatePetNeeds = (petData) => {
  const needs = [];
  if (petData.food < 30) needs.push('hungry');
  if (petData.happiness < 40) needs.push('lonely');
  if (petData.energy < 20) needs.push('tired');
  if (petData.health < 50) needs.push('sick');
  return needs;
};

// Progress calculations
export const calculateProgress = (current, target) => {
  return Math.min((current / target) * 100, 100);
};

export const calculateWeeklyProgress = (dailyData, weeklyTarget) => {
  const weekTotal = dailyData.reduce((sum, day) => sum + day.totalTime, 0);
  return calculateProgress(weekTotal, weeklyTarget);
};

// Color utilities
export const getUsageColor = (level) => {
  switch (level) {
    case UsageLevel.LOW: return '#4CAF50';
    case UsageLevel.MODERATE: return '#FF9800';
    case UsageLevel.HIGH: return '#FF5722';
    case UsageLevel.EXCESSIVE: return '#F44336';
    default: return '#9E9E9E';
  }
};

export const getPetHealthColor = (health) => {
  if (health >= 80) return '#4CAF50';
  if (health >= 60) return '#8BC34A';
  if (health >= 40) return '#FF9800';
  if (health >= 20) return '#FF5722';
  return '#F44336';
};

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUsername = (username) => {
  return username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username);
};

// Random utilities
export const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Achievement calculations
export const calculateLevel = (experience) => {
  return Math.floor(Math.sqrt(experience / 100)) + 1;
};

export const calculateExperienceForNextLevel = (currentExp) => {
  const currentLevel = calculateLevel(currentExp);
  const nextLevelExp = Math.pow(currentLevel, 2) * 100;
  return nextLevelExp - currentExp;
};

// Storage utilities
export const formatStorageKey = (userId, key) => {
  return `screensage_${userId}_${key}`;
};

// Error handling
export const handleAsyncError = (error, context = '') => {
  console.error(`Error in ${context}:`, error);
  // In production, this would send to crash reporting service
  return {
    success: false,
    error: error.message || 'An unexpected error occurred'
  };
};
