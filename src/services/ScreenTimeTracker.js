// Screen Time Tracker Service for ScreenSage
import { Platform, AppState } from 'react-native';
import { categorizeApp, formatTime } from '../utils';
import StorageService from './StorageService';
import NotificationService from './NotificationService';

class ScreenTimeTracker {
  constructor() {
    this.isTracking = false;
    this.currentSessionStart = null;
    this.currentApp = null;
    this.todaysData = {
      totalTime: 0,
      apps: [],
      categories: {},
      hourlyBreakdown: {},
      breaks: 0,
      lastUpdate: new Date()
    };
    this.sessionData = [];
    this.appStateSubscription = null;
    this.trackingInterval = null;
  }

  // Initialize the tracker
  async initialize() {
    try {
      console.log('Initializing Screen Time Tracker...');
      
      // Load today's data from storage
      await this.loadTodaysData();
      
      // Set up app state monitoring
      this.setupAppStateMonitoring();
      
      // Start tracking if not already
      this.startTracking();
      
      console.log('Screen Time Tracker initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Screen Time Tracker:', error);
      return false;
    }
  }

  // Start tracking screen time
  startTracking() {
    if (this.isTracking) {
      console.log('Tracking already active');
      return;
    }

    this.isTracking = true;
    this.currentSessionStart = new Date();
    
    // Set up periodic data collection
    this.trackingInterval = setInterval(() => {
      this.collectUsageData();
    }, 60000); // Collect data every minute

    console.log('Screen time tracking started');
  }

  // Stop tracking screen time
  stopTracking() {
    if (!this.isTracking) {
      return;
    }

    this.isTracking = false;
    
    // End current session
    if (this.currentSessionStart) {
      this.endCurrentSession();
    }

    // Clear interval
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }

    console.log('Screen time tracking stopped');
  }

  // Set up app state monitoring
  setupAppStateMonitoring() {
    this.appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      console.log('App state changed to:', nextAppState);
      
      if (nextAppState === 'active') {
        // App became active
        this.onAppBecameActive();
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        // App went to background
        this.onAppWentToBackground();
      }
    });
  }

  // Handle app becoming active
  onAppBecameActive() {
    if (this.isTracking) {
      this.currentSessionStart = new Date();
      console.log('New session started');
    }
  }

  // Handle app going to background
  onAppWentToBackground() {
    if (this.isTracking && this.currentSessionStart) {
      this.endCurrentSession();
    }
  }

  // End current session and record data
  endCurrentSession() {
    if (!this.currentSessionStart) {
      return;
    }

    const sessionEnd = new Date();
    const sessionDuration = Math.round((sessionEnd - this.currentSessionStart) / 60000); // minutes
    
    if (sessionDuration > 0) {
      this.recordAppUsage('ScreenSage', sessionDuration);
      
      // Check if this was a break (session ended and resumed quickly)
      if (sessionDuration < 5) { // Less than 5 minutes could be a break
        this.todaysData.breaks++;
      }
    }

    this.currentSessionStart = null;
  }

  // Collect usage data (simulated for demo)
  async collectUsageData() {
    try {
      // In a real app, this would interface with:
      // - iOS: Screen Time API (requires special entitlements)
      // - Android: UsageStatsManager API (requires usage access permission)
      
      // For demo, generate realistic usage data
      const simulatedData = this.generateSimulatedUsageData();
      
      // Process the simulated data
      this.processUsageData(simulatedData);
      
      // Save data periodically
      await this.saveTodaysData();
      
    } catch (error) {
      console.error('Error collecting usage data:', error);
    }
  }

  // Generate simulated usage data for demo
  generateSimulatedUsageData() {
    const commonApps = [
      { name: 'Instagram', category: 'social', baseUsage: 45 },
      { name: 'WhatsApp', category: 'social', baseUsage: 30 },
      { name: 'YouTube', category: 'entertainment', baseUsage: 60 },
      { name: 'Chrome', category: 'productivity', baseUsage: 25 },
      { name: 'TikTok', category: 'entertainment', baseUsage: 35 },
      { name: 'Gmail', category: 'productivity', baseUsage: 15 },
      { name: 'Spotify', category: 'entertainment', baseUsage: 40 },
      { name: 'Twitter', category: 'social', baseUsage: 20 },
      { name: 'Netflix', category: 'entertainment', baseUsage: 90 },
      { name: 'Slack', category: 'productivity', baseUsage: 30 }
    ];

    const currentHour = new Date().getHours();
    const timeMultiplier = this.getTimeMultiplier(currentHour);
    
    return commonApps.map(app => ({
      ...app,
      usage: Math.round(app.baseUsage * timeMultiplier * (0.5 + Math.random() * 1.5)),
      lastUsed: new Date()
    }));
  }

  // Get time-based usage multiplier
  getTimeMultiplier(hour) {
    // Peak usage during evening hours (6-10 PM)
    if (hour >= 18 && hour <= 22) return 1.5;
    // High usage during lunch (12-2 PM) and evening (8-9 PM)
    if (hour >= 12 && hour <= 14) return 1.3;
    if (hour >= 20 && hour <= 21) return 1.4;
    // Lower usage during work hours (9 AM - 5 PM)
    if (hour >= 9 && hour <= 17) return 0.8;
    // Very low usage during sleep hours (11 PM - 7 AM)
    if (hour >= 23 || hour <= 7) return 0.3;
    // Normal usage other times
    return 1.0;
  }

  // Process collected usage data
  processUsageData(usageData) {
    const currentHour = new Date().getHours();
    
    usageData.forEach(app => {
      if (app.usage > 0) {
        this.recordAppUsage(app.name, app.usage);
        this.recordHourlyUsage(currentHour, app.usage);
        this.recordCategoryUsage(app.category, app.usage);
      }
    });

    this.todaysData.lastUpdate = new Date();
  }

  // Record app usage
  recordAppUsage(appName, minutes) {
    let existingApp = this.todaysData.apps.find(app => app.name === appName);
    
    if (existingApp) {
      existingApp.time += minutes;
      existingApp.lastUsed = new Date();
    } else {
      const category = categorizeApp(appName);
      this.todaysData.apps.push({
        name: appName,
        time: minutes,
        category,
        icon: this.getAppIcon(appName),
        lastUsed: new Date()
      });
    }

    this.todaysData.totalTime += minutes;
  }

  // Record hourly usage breakdown
  recordHourlyUsage(hour, minutes) {
    if (!this.todaysData.hourlyBreakdown[hour]) {
      this.todaysData.hourlyBreakdown[hour] = 0;
    }
    this.todaysData.hourlyBreakdown[hour] += minutes;
  }

  // Record category usage
  recordCategoryUsage(category, minutes) {
    if (!this.todaysData.categories[category]) {
      this.todaysData.categories[category] = 0;
    }
    this.todaysData.categories[category] += minutes;
  }

  // Get app icon (placeholder for demo)
  getAppIcon(appName) {
    const iconMap = {
      'Instagram': '📷',
      'WhatsApp': '💬',
      'YouTube': '📺',
      'Chrome': '🌐',
      'TikTok': '🎵',
      'Gmail': '📧',
      'Spotify': '🎵',
      'Twitter': '🐦',
      'Netflix': '🎬',
      'Slack': '💼',
      'ScreenSage': '🐾'
    };
    
    return iconMap[appName] || '📱';
  }

  // Load today's data from storage
  async loadTodaysData() {
    try {
      const today = new Date();
      const result = await StorageService.getScreenTimeData(1);
      
      if (result.success && result.data.length > 0) {
        const todayData = result.data[0];
        if (this.isToday(todayData.date)) {
          this.todaysData = { ...todayData };
          console.log('Loaded today\'s data:', formatTime(this.todaysData.totalTime));
        }
      }
    } catch (error) {
      console.error('Error loading today\'s data:', error);
    }
  }

  // Save today's data to storage
  async saveTodaysData() {
    try {
      const today = new Date();
      await StorageService.saveScreenTimeData(today, this.todaysData);
    } catch (error) {
      console.error('Error saving today\'s data:', error);
    }
  }

  // Check if date is today
  isToday(date) {
    const today = new Date();
    const compareDate = new Date(date);
    return today.toDateString() === compareDate.toDateString();
  }

  // Get current usage data
  getTodaysData() {
    return { ...this.todaysData };
  }

  // Get usage data for specific app
  getAppUsage(appName) {
    const app = this.todaysData.apps.find(app => app.name === appName);
    return app ? app.time : 0;
  }

  // Get usage data for category
  getCategoryUsage(category) {
    return this.todaysData.categories[category] || 0;
  }

  // Get top apps by usage
  getTopApps(limit = 5) {
    return this.todaysData.apps
      .sort((a, b) => b.time - a.time)
      .slice(0, limit);
  }

  // Check if user is approaching limits
  async checkLimits() {
    try {
      const goalsResult = await StorageService.getGoals();
      if (!goalsResult.success) return;
      
      const goals = goalsResult.data;
      const usage = this.todaysData.totalTime;
      
      // Check daily limit
      if (usage > goals.dailyLimit) {
        const overTime = usage - goals.dailyLimit;
        NotificationService.scheduleOveruseAlert(overTime);
      } else if (usage > goals.dailyLimit * 0.8) {
        // 80% warning
        const remaining = goals.dailyLimit - usage;
        console.log(`Approaching daily limit: ${remaining} minutes remaining`);
      }

      // Check app-specific limits
      Object.keys(goals.appLimits).forEach(appName => {
        const appUsage = this.getAppUsage(appName);
        const appLimit = goals.appLimits[appName];
        
        if (appUsage > appLimit) {
          const overTime = appUsage - appLimit;
          NotificationService.scheduleOveruseAlert(overTime, appName);
        }
      });

    } catch (error) {
      console.error('Error checking limits:', error);
    }
  }

  // Get usage statistics
  getUsageStatistics() {
    const apps = this.todaysData.apps;
    const totalTime = this.todaysData.totalTime;
    
    if (totalTime === 0) {
      return {
        totalTime: 0,
        appCount: 0,
        averageSessionLength: 0,
        mostUsedCategory: null,
        peakHour: null
      };
    }

    // Most used category
    const categoryEntries = Object.entries(this.todaysData.categories);
    const mostUsedCategory = categoryEntries.length > 0 
      ? categoryEntries.reduce((a, b) => a[1] > b[1] ? a : b)[0]
      : null;

    // Peak hour
    const hourlyEntries = Object.entries(this.todaysData.hourlyBreakdown);
    const peakHour = hourlyEntries.length > 0
      ? parseInt(hourlyEntries.reduce((a, b) => a[1] > b[1] ? a : b)[0])
      : null;

    // Average session length (estimated)
    const appCount = apps.length;
    const averageSessionLength = appCount > 0 ? Math.round(totalTime / appCount) : 0;

    return {
      totalTime,
      appCount,
      averageSessionLength,
      mostUsedCategory,
      peakHour,
      breaks: this.todaysData.breaks
    };
  }

  // Reset tracking for new day
  resetForNewDay() {
    this.todaysData = {
      totalTime: 0,
      apps: [],
      categories: {},
      hourlyBreakdown: {},
      breaks: 0,
      lastUpdate: new Date()
    };
    
    console.log('Screen time data reset for new day');
  }

  // Cleanup method
  cleanup() {
    this.stopTracking();
    
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
    
    console.log('Screen Time Tracker cleaned up');
  }

  // Manual app usage recording (for testing)
  recordManualUsage(appName, minutes, category = null) {
    const appCategory = category || categorizeApp(appName);
    this.recordAppUsage(appName, minutes);
    this.recordCategoryUsage(appCategory, minutes);
    
    const currentHour = new Date().getHours();
    this.recordHourlyUsage(currentHour, minutes);
    
    console.log(`Manually recorded ${minutes} minutes for ${appName}`);
  }
}

export default new ScreenTimeTracker();
