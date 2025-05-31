// Notification Service for ScreenSage
import { Platform } from 'react-native';
import { NotificationType } from '../types';

class NotificationService {
  constructor() {
    this.isInitialized = false;
    this.scheduledNotifications = new Map();
    this.settings = {
      enabled: true,
      overuseAlerts: true,
      breakReminders: true,
      goalReminders: true,
      petNeeds: true,
      socialUpdates: true,
      aiInsights: true,
      quietHours: {
        enabled: false,
        start: 22, // 10 PM
        end: 8    // 8 AM
      }
    };
  }

  // Initialize notification service
  async initialize() {
    try {
      // Request permissions
      const permission = await this.requestPermission();
      if (!permission) {
        console.warn('Notification permission denied');
        return false;
      }

      this.isInitialized = true;
      console.log('Notification service initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
      return false;
    }
  }

  // Request notification permissions
  async requestPermission() {
    try {
      if (Platform.OS === 'ios') {
        // iOS permission request would go here
        // For now, assume granted
        return true;
      } else if (Platform.OS === 'android') {
        // Android permission request would go here
        // For now, assume granted
        return true;
      }
      return true;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }

  // Schedule a notification
  async scheduleNotification(notification) {
    if (!this.isInitialized || !this.settings.enabled) {
      return false;
    }

    // Check if notification type is enabled
    if (!this.isNotificationTypeEnabled(notification.type)) {
      return false;
    }

    // Check quiet hours
    if (this.isQuietHours()) {
      console.log('Notification suppressed due to quiet hours');
      return false;
    }

    try {
      const notificationId = this.generateNotificationId();
      
      const scheduledNotification = {
        id: notificationId,
        ...notification,
        scheduledAt: new Date()
      };

      // In a real app, this would use expo-notifications or react-native-push-notification
      console.log('Scheduling notification:', scheduledNotification);
      
      this.scheduledNotifications.set(notificationId, scheduledNotification);
      
      // Simulate immediate delivery for demo
      setTimeout(() => {
        this.deliverNotification(scheduledNotification);
      }, notification.delay || 0);

      return notificationId;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      return false;
    }
  }

  // Deliver notification (simulate for demo)
  deliverNotification(notification) {
    console.log('📱 Notification Delivered:', notification.title, '-', notification.body);
    
    // In a real app, this would trigger the actual system notification
    // For demo purposes, we'll just log it
    
    // Remove from scheduled notifications
    this.scheduledNotifications.delete(notification.id);
  }

  // Cancel a scheduled notification
  async cancelNotification(notificationId) {
    try {
      if (this.scheduledNotifications.has(notificationId)) {
        this.scheduledNotifications.delete(notificationId);
        console.log('Notification cancelled:', notificationId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to cancel notification:', error);
      return false;
    }
  }

  // Cancel all notifications
  async cancelAllNotifications() {
    try {
      this.scheduledNotifications.clear();
      console.log('All notifications cancelled');
      return true;
    } catch (error) {
      console.error('Failed to cancel all notifications:', error);
      return false;
    }
  }

  // Schedule overuse alert
  scheduleOveruseAlert(minutesOver, appName = null) {
    const notification = {
      type: NotificationType.OVERUSE_ALERT,
      title: '⚠️ Screen Time Alert',
      body: appName 
        ? `You've exceeded your limit for ${appName} by ${minutesOver} minutes`
        : `You've exceeded your daily screen time goal by ${minutesOver} minutes`,
      data: {
        type: NotificationType.OVERUSE_ALERT,
        minutesOver,
        appName
      },
      priority: 'high'
    };

    return this.scheduleNotification(notification);
  }

  // Schedule break reminder
  scheduleBreakReminder(continuousMinutes) {
    const notification = {
      type: NotificationType.BREAK_REMINDER,
      title: '💡 Take a Break',
      body: `You've been using your device for ${continuousMinutes} minutes. Time for a break!`,
      data: {
        type: NotificationType.BREAK_REMINDER,
        continuousMinutes
      },
      priority: 'medium'
    };

    return this.scheduleNotification(notification);
  }

  // Schedule goal reminder
  scheduleGoalReminder(goalType, progress) {
    const notification = {
      type: NotificationType.GOAL_REMINDER,
      title: '🎯 Goal Check-in',
      body: `You're ${progress}% towards your ${goalType} goal. Keep it up!`,
      data: {
        type: NotificationType.GOAL_REMINDER,
        goalType,
        progress
      },
      priority: 'low'
    };

    return this.scheduleNotification(notification);
  }

  // Schedule pet needs notification
  schedulePetNeedsAlert(needs) {
    const needsList = needs.join(', ');
    const notification = {
      type: NotificationType.PET_NEEDS,
      title: '🐾 Your Pet Needs Attention',
      body: `Your pet is ${needsList}. Take care of them to improve their health!`,
      data: {
        type: NotificationType.PET_NEEDS,
        needs
      },
      priority: 'medium'
    };

    return this.scheduleNotification(notification);
  }

  // Schedule social update notification
  scheduleSocialUpdate(message, friend = null) {
    const notification = {
      type: NotificationType.SOCIAL_UPDATE,
      title: '👥 Social Update',
      body: friend ? `${friend}: ${message}` : message,
      data: {
        type: NotificationType.SOCIAL_UPDATE,
        friend,
        message
      },
      priority: 'low'
    };

    return this.scheduleNotification(notification);
  }

  // Schedule AI insight notification
  scheduleAIInsight(insight) {
    const notification = {
      type: NotificationType.AI_INSIGHT,
      title: '🤖 AI Insight',
      body: insight.message,
      data: {
        type: NotificationType.AI_INSIGHT,
        insight
      },
      priority: 'low',
      delay: 5000 // Delay AI insights slightly
    };

    return this.scheduleNotification(notification);
  }

  // Schedule recurring notifications
  scheduleRecurringBreakReminders(intervalMinutes = 60) {
    // This would set up recurring break reminders
    console.log(`Setting up break reminders every ${intervalMinutes} minutes`);
    
    // In a real app, this would use a background task or scheduled notifications
    const reminderId = setInterval(() => {
      if (this.settings.breakReminders) {
        this.scheduleBreakReminder(intervalMinutes);
      }
    }, intervalMinutes * 60 * 1000);

    return reminderId;
  }

  // Update notification settings
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    console.log('Notification settings updated:', this.settings);
  }

  // Get current settings
  getSettings() {
    return { ...this.settings };
  }

  // Check if notification type is enabled
  isNotificationTypeEnabled(type) {
    switch (type) {
      case NotificationType.OVERUSE_ALERT:
        return this.settings.overuseAlerts;
      case NotificationType.BREAK_REMINDER:
        return this.settings.breakReminders;
      case NotificationType.GOAL_REMINDER:
        return this.settings.goalReminders;
      case NotificationType.PET_NEEDS:
        return this.settings.petNeeds;
      case NotificationType.SOCIAL_UPDATE:
        return this.settings.socialUpdates;
      case NotificationType.AI_INSIGHT:
        return this.settings.aiInsights;
      default:
        return true;
    }
  }

  // Check if currently in quiet hours
  isQuietHours() {
    if (!this.settings.quietHours.enabled) {
      return false;
    }

    const now = new Date();
    const currentHour = now.getHours();
    const { start, end } = this.settings.quietHours;

    if (start < end) {
      // Same day quiet hours (e.g., 22:00 to 08:00 next day)
      return currentHour >= start || currentHour < end;
    } else {
      // Cross-midnight quiet hours (e.g., 10 PM to 8 AM)
      return currentHour >= start && currentHour < end;
    }
  }

  // Generate unique notification ID
  generateNotificationId() {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get notification history (for testing/debugging)
  getNotificationHistory() {
    return Array.from(this.scheduledNotifications.values());
  }

  // Test notification (for development)
  async testNotification() {
    const testNotification = {
      type: NotificationType.AI_INSIGHT,
      title: '🧪 Test Notification',
      body: 'This is a test notification from ScreenSage!',
      data: { test: true },
      priority: 'normal'
    };

    return this.scheduleNotification(testNotification);
  }
}

export default new NotificationService();
