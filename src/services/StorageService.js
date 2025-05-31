// Data Storage Service for ScreenSage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatStorageKey, handleAsyncError } from '../utils';

class StorageService {
  constructor() {
    this.userId = null;
    this.cache = new Map();
    this.isInitialized = false;
  }

  // Initialize storage service with user ID
  async initialize(userId) {
    try {
      this.userId = userId;
      this.isInitialized = true;
      console.log('Storage service initialized for user:', userId);
      return true;
    } catch (error) {
      return handleAsyncError(error, 'StorageService.initialize');
    }
  }

  // Generic storage methods
  async store(key, data) {
    try {
      if (!this.isInitialized) {
        throw new Error('Storage service not initialized');
      }

      const storageKey = formatStorageKey(this.userId, key);
      const jsonData = JSON.stringify(data);
      
      await AsyncStorage.setItem(storageKey, jsonData);
      this.cache.set(key, data);
      
      return { success: true };
    } catch (error) {
      return handleAsyncError(error, `StorageService.store(${key})`);
    }
  }

  async retrieve(key, defaultValue = null) {
    try {
      if (!this.isInitialized) {
        throw new Error('Storage service not initialized');
      }

      // Check cache first
      if (this.cache.has(key)) {
        return { success: true, data: this.cache.get(key) };
      }

      const storageKey = formatStorageKey(this.userId, key);
      const jsonData = await AsyncStorage.getItem(storageKey);
      
      if (jsonData === null) {
        return { success: true, data: defaultValue };
      }

      const data = JSON.parse(jsonData);
      this.cache.set(key, data);
      
      return { success: true, data };
    } catch (error) {
      return handleAsyncError(error, `StorageService.retrieve(${key})`);
    }
  }

  async remove(key) {
    try {
      if (!this.isInitialized) {
        throw new Error('Storage service not initialized');
      }

      const storageKey = formatStorageKey(this.userId, key);
      await AsyncStorage.removeItem(storageKey);
      this.cache.delete(key);
      
      return { success: true };
    } catch (error) {
      return handleAsyncError(error, `StorageService.remove(${key})`);
    }
  }

  // User profile methods
  async saveUserProfile(profile) {
    return this.store('user_profile', profile);
  }

  async getUserProfile() {
    return this.retrieve('user_profile', {
      username: '',
      email: '',
      dailyGoal: 180, // 3 hours default
      weeklyGoal: 1260, // 21 hours default
      onboardingCompleted: false,
      createdAt: new Date().toISOString()
    });
  }

  // Pet data methods
  async savePetData(petData) {
    return this.store('pet_data', petData);
  }

  async getPetData() {
    return this.retrieve('pet_data', {
      name: 'Pixel',
      health: 100,
      happiness: 100,
      energy: 100,
      food: 100,
      level: 1,
      experience: 0,
      lastFed: null,
      lastPlayed: null,
      accessories: [],
      unlockedAccessories: ['basic_collar'],
      mood: 'happy'
    });
  }

  // Screen time data methods
  async saveScreenTimeData(date, data) {
    try {
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      const existingData = await this.retrieve('screen_time_data', {});
      
      if (existingData.success) {
        existingData.data[dateKey] = data;
        return this.store('screen_time_data', existingData.data);
      }
      
      return existingData;
    } catch (error) {
      return handleAsyncError(error, 'StorageService.saveScreenTimeData');
    }
  }

  async getScreenTimeData(days = 30) {
    try {
      const result = await this.retrieve('screen_time_data', {});
      
      if (result.success) {
        // Convert back to array format and filter by days
        const dataMap = result.data;
        const screenTimeArray = [];
        
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateKey = date.toISOString().split('T')[0];
          
          if (dataMap[dateKey]) {
            screenTimeArray.push({
              ...dataMap[dateKey],
              date: new Date(dateKey)
            });
          } else {
            // Create default data for missing days
            screenTimeArray.push({
              date,
              totalTime: 0,
              apps: [],
              categories: {},
              hourlyBreakdown: {},
              breaks: 0
            });
          }
        }
        
        return { success: true, data: screenTimeArray };
      }
      
      return result;
    } catch (error) {
      return handleAsyncError(error, 'StorageService.getScreenTimeData');
    }
  }

  // Goals and settings methods
  async saveGoals(goals) {
    return this.store('user_goals', goals);
  }

  async getGoals() {
    return this.retrieve('user_goals', {
      dailyLimit: 180, // 3 hours
      weeklyLimit: 1260, // 21 hours
      breakInterval: 60, // 1 hour
      appLimits: {},
      categoryLimits: {},
      bedtime: null,
      focusMode: {
        enabled: false,
        apps: [],
        duration: 30
      }
    });
  }

  async saveSettings(settings) {
    return this.store('app_settings', settings);
  }

  async getSettings() {
    return this.retrieve('app_settings', {
      theme: 'auto',
      notifications: {
        enabled: true,
        overuseAlerts: true,
        breakReminders: true,
        goalReminders: true,
        petNeeds: true,
        socialUpdates: true,
        aiInsights: true,
        quietHours: {
          enabled: false,
          start: 22,
          end: 8
        }
      },
      privacy: {
        dataSharing: false,
        analytics: true,
        socialVisibility: 'friends'
      },
      ai: {
        enabled: true,
        predictionLevel: 'medium',
        learningEnabled: true
      }
    });
  }

  // Social data methods
  async saveFriends(friends) {
    return this.store('friends_list', friends);
  }

  async getFriends() {
    return this.retrieve('friends_list', []);
  }

  async saveChallenges(challenges) {
    return this.store('challenges', challenges);
  }

  async getChallenges() {
    return this.retrieve('challenges', []);
  }

  // AI predictions cache
  async savePredictions(predictions) {
    return this.store('ai_predictions', {
      predictions,
      lastUpdated: new Date().toISOString()
    });
  }

  async getPredictions() {
    const result = await this.retrieve('ai_predictions', {
      predictions: [],
      lastUpdated: null
    });
    
    if (result.success) {
      // Check if predictions are still fresh (less than 1 hour old)
      const lastUpdated = result.data.lastUpdated ? new Date(result.data.lastUpdated) : null;
      const now = new Date();
      const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      
      if (lastUpdated && lastUpdated > hourAgo) {
        return { success: true, data: result.data.predictions };
      } else {
        return { success: true, data: [] }; // Return empty if stale
      }
    }
    
    return result;
  }

  // Statistics and achievements
  async saveAchievements(achievements) {
    return this.store('achievements', achievements);
  }

  async getAchievements() {
    return this.retrieve('achievements', []);
  }

  async saveStatistics(stats) {
    return this.store('user_statistics', stats);
  }

  async getStatistics() {
    return this.retrieve('user_statistics', {
      totalDaysTracked: 0,
      averageDailyUsage: 0,
      longestStreak: 0,
      currentStreak: 0,
      totalBreaksTaken: 0,
      goalsAchieved: 0,
      petInteractions: 0,
      challengesCompleted: 0,
      lastUpdated: new Date().toISOString()
    });
  }

  // Backup and restore methods
  async createBackup() {
    try {
      if (!this.isInitialized) {
        throw new Error('Storage service not initialized');
      }

      const backup = {};
      const keys = [
        'user_profile', 'pet_data', 'screen_time_data', 'user_goals',
        'app_settings', 'friends_list', 'challenges', 'achievements',
        'user_statistics'
      ];

      for (const key of keys) {
        const result = await this.retrieve(key);
        if (result.success && result.data !== null) {
          backup[key] = result.data;
        }
      }

      backup.createdAt = new Date().toISOString();
      backup.version = '1.0';

      return { success: true, data: backup };
    } catch (error) {
      return handleAsyncError(error, 'StorageService.createBackup');
    }
  }

  async restoreBackup(backup) {
    try {
      if (!backup || !backup.version) {
        throw new Error('Invalid backup data');
      }

      const keys = Object.keys(backup).filter(key => key !== 'createdAt' && key !== 'version');
      
      for (const key of keys) {
        await this.store(key, backup[key]);
      }

      return { success: true };
    } catch (error) {
      return handleAsyncError(error, 'StorageService.restoreBackup');
    }
  }

  // Clear all data
  async clearAllData() {
    try {
      if (!this.isInitialized) {
        throw new Error('Storage service not initialized');
      }

      // Get all keys for this user
      const allKeys = await AsyncStorage.getAllKeys();
      const userKeys = allKeys.filter(key => key.includes(`screensage_${this.userId}_`));
      
      await AsyncStorage.multiRemove(userKeys);
      this.cache.clear();
      
      return { success: true };
    } catch (error) {
      return handleAsyncError(error, 'StorageService.clearAllData');
    }
  }

  // Get storage info
  async getStorageInfo() {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const userKeys = allKeys.filter(key => key.includes(`screensage_${this.userId}_`));
      
      let totalSize = 0;
      for (const key of userKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }

      return {
        success: true,
        data: {
          totalKeys: userKeys.length,
          estimatedSize: Math.round(totalSize / 1024), // KB
          lastAccessed: new Date().toISOString()
        }
      };
    } catch (error) {
      return handleAsyncError(error, 'StorageService.getStorageInfo');
    }
  }
}

export default new StorageService();
