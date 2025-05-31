// AI Prediction Engine for ScreenSage
import { PredictionType, PredictionConfidence, UsageLevel } from '../types';
import { calculateUsageLevel, getTimeOfDay, isToday } from '../utils';

class AIPredictor {
  constructor() {
    this.patterns = new Map();
    this.predictions = [];
    this.learningData = [];
  }

  // Analyze usage patterns and generate predictions
  async analyzeUsagePatterns(usageHistory, currentUsage, userGoals) {
    try {
      const patterns = this.extractPatterns(usageHistory);
      const currentLevel = calculateUsageLevel(currentUsage.totalTime, userGoals.dailyLimit);
      
      // Generate various types of predictions
      const predictions = [];
      
      // Overuse prediction
      const overusePrediction = this.predictOveruse(currentUsage, patterns, userGoals);
      if (overusePrediction) predictions.push(overusePrediction);
      
      // Break suggestion
      const breakPrediction = this.suggestBreak(currentUsage, patterns);
      if (breakPrediction) predictions.push(breakPrediction);
      
      // Goal achievement prediction
      const goalPrediction = this.predictGoalAchievement(currentUsage, userGoals, patterns);
      if (goalPrediction) predictions.push(goalPrediction);
      
      // Habit insights
      const habitInsight = this.generateHabitInsight(patterns, usageHistory);
      if (habitInsight) predictions.push(habitInsight);
      
      // Wellness tips
      const wellnessTip = this.generateWellnessTip(currentLevel, patterns);
      if (wellnessTip) predictions.push(wellnessTip);
      
      this.predictions = predictions;
      return predictions;
    } catch (error) {
      console.error('Error analyzing usage patterns:', error);
      return [];
    }
  }

  // Extract patterns from usage history
  extractPatterns(usageHistory) {
    const patterns = {
      dailyAverages: {},
      hourlyDistribution: {},
      appUsagePatterns: {},
      weeklyTrends: {},
      peakUsageTimes: []
    };

    // Calculate daily averages
    const dayTotals = {};
    usageHistory.forEach(day => {
      const dayName = day.date.toLocaleDateString('en-US', { weekday: 'long' });
      if (!dayTotals[dayName]) dayTotals[dayName] = [];
      dayTotals[dayName].push(day.totalTime);
    });

    Object.keys(dayTotals).forEach(day => {
      patterns.dailyAverages[day] = dayTotals[day].reduce((a, b) => a + b, 0) / dayTotals[day].length;
    });

    // Analyze hourly distribution
    patterns.hourlyDistribution = this.analyzeHourlyUsage(usageHistory);
    
    // App usage patterns
    patterns.appUsagePatterns = this.analyzeAppUsage(usageHistory);
    
    // Weekly trends
    patterns.weeklyTrends = this.analyzeWeeklyTrends(usageHistory);
    
    // Peak usage times
    patterns.peakUsageTimes = this.findPeakUsageTimes(usageHistory);

    return patterns;
  }

  // Predict potential overuse
  predictOveruse(currentUsage, patterns, userGoals) {
    const timeOfDay = getTimeOfDay();
    const currentHour = new Date().getHours();
    
    // Check if current usage is trending towards overuse
    const projectedUsage = this.projectDailyUsage(currentUsage, patterns, currentHour);
    
    if (projectedUsage > userGoals.dailyLimit * 1.2) {
      return {
        id: Date.now().toString(),
        type: PredictionType.OVERUSE_WARNING,
        title: '⚠️ Overuse Alert',
        message: `You're on track to exceed your daily limit by ${Math.round(projectedUsage - userGoals.dailyLimit)} minutes`,
        confidence: PredictionConfidence.HIGH,
        priority: 'high',
        actionSuggestion: 'Consider taking a break or switching to a productivity app',
        timestamp: new Date()
      };
    }

    return null;
  }

  // Suggest break times
  suggestBreak(currentUsage, patterns) {
    const continuousUsageTime = this.calculateContinuousUsage(currentUsage);
    
    if (continuousUsageTime > 60) { // More than 1 hour continuous usage
      const confidence = continuousUsageTime > 120 ? PredictionConfidence.HIGH : PredictionConfidence.MEDIUM;
      
      return {
        id: Date.now().toString(),
        type: PredictionType.BREAK_SUGGESTION,
        title: '💡 Break Time',
        message: `You've been using your device for ${Math.round(continuousUsageTime)} minutes straight. Time for a break!`,
        confidence,
        priority: 'medium',
        actionSuggestion: 'Try the 20-20-20 rule: Look at something 20 feet away for 20 seconds',
        timestamp: new Date()
      };
    }

    return null;
  }

  // Predict goal achievement
  predictGoalAchievement(currentUsage, userGoals, patterns) {
    const progressToGoal = (currentUsage.totalTime / userGoals.dailyLimit) * 100;
    
    if (progressToGoal >= 80 && progressToGoal < 100) {
      return {
        id: Date.now().toString(),
        type: PredictionType.GOAL_ACHIEVEMENT,
        title: '🎯 Goal Almost Reached',
        message: `You're ${Math.round(100 - progressToGoal)}% away from your daily goal!`,
        confidence: PredictionConfidence.HIGH,
        priority: 'low',
        actionSuggestion: 'You can reach your goal with mindful usage for the rest of the day',
        timestamp: new Date()
      };
    }

    return null;
  }

  // Generate habit insights
  generateHabitInsight(patterns, usageHistory) {
    const insights = [
      this.analyzeWeekendVsWeekday(patterns, usageHistory),
      this.analyzeMostUsedApps(patterns),
      this.analyzeUsageConsistency(patterns, usageHistory),
      this.analyzePeakUsagePatterns(patterns)
    ].filter(Boolean);

    if (insights.length > 0) {
      const insight = insights[Math.floor(Math.random() * insights.length)];
      return {
        id: Date.now().toString(),
        type: PredictionType.HABIT_INSIGHT,
        title: '📊 Usage Insight',
        message: insight.message,
        confidence: insight.confidence,
        priority: 'low',
        actionSuggestion: insight.suggestion,
        timestamp: new Date()
      };
    }

    return null;
  }

  // Generate wellness tips
  generateWellnessTip(usageLevel, patterns) {
    const tips = {
      [UsageLevel.LOW]: [
        'Great job maintaining healthy screen time! Your pet is thriving!',
        'You\'re showing excellent digital wellness habits. Keep it up!',
        'Your balanced usage is setting a great example for mindful technology use.'
      ],
      [UsageLevel.MODERATE]: [
        'You\'re doing well! Consider adding a few more breaks to optimize your wellness.',
        'Good balance! Try the Pomodoro technique for even better focus.',
        'You\'re on track! Remember to blink more often to rest your eyes.'
      ],
      [UsageLevel.HIGH]: [
        'High usage detected. Try switching to offline activities for the next hour.',
        'Consider using Do Not Disturb mode to reduce distractions.',
        'Take a 10-minute walk to reset your focus and energy.'
      ],
      [UsageLevel.EXCESSIVE]: [
        'Excessive usage alert! Time for a digital detox break.',
        'Your pet needs attention! Step away from the screen for a while.',
        'Consider setting app time limits to help manage your usage.'
      ]
    };

    const levelTips = tips[usageLevel] || tips[UsageLevel.MODERATE];
    const randomTip = levelTips[Math.floor(Math.random() * levelTips.length)];

    return {
      id: Date.now().toString(),
      type: PredictionType.WELLNESS_TIP,
      title: '💚 Wellness Tip',
      message: randomTip,
      confidence: PredictionConfidence.MEDIUM,
      priority: 'low',
      actionSuggestion: 'Small changes lead to big improvements in digital wellness',
      timestamp: new Date()
    };
  }

  // Helper methods for pattern analysis
  analyzeHourlyUsage(usageHistory) {
    const hourlyData = {};
    for (let i = 0; i < 24; i++) {
      hourlyData[i] = [];
    }

    usageHistory.forEach(day => {
      if (day.hourlyBreakdown) {
        Object.keys(day.hourlyBreakdown).forEach(hour => {
          hourlyData[parseInt(hour)].push(day.hourlyBreakdown[hour]);
        });
      }
    });

    // Calculate averages
    Object.keys(hourlyData).forEach(hour => {
      const values = hourlyData[hour];
      hourlyData[hour] = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    });

    return hourlyData;
  }

  analyzeAppUsage(usageHistory) {
    const appUsage = {};
    
    usageHistory.forEach(day => {
      day.apps.forEach(app => {
        if (!appUsage[app.name]) {
          appUsage[app.name] = [];
        }
        appUsage[app.name].push(app.time);
      });
    });

    // Calculate app statistics
    Object.keys(appUsage).forEach(appName => {
      const times = appUsage[appName];
      appUsage[appName] = {
        average: times.reduce((a, b) => a + b, 0) / times.length,
        total: times.reduce((a, b) => a + b, 0),
        frequency: times.length
      };
    });

    return appUsage;
  }

  analyzeWeeklyTrends(usageHistory) {
    const weekData = usageHistory.slice(-7); // Last 7 days
    const totalThisWeek = weekData.reduce((sum, day) => sum + day.totalTime, 0);
    const avgThisWeek = totalThisWeek / 7;

    const previousWeekData = usageHistory.slice(-14, -7);
    const totalLastWeek = previousWeekData.reduce((sum, day) => sum + day.totalTime, 0);
    const avgLastWeek = totalLastWeek / 7;

    return {
      thisWeek: avgThisWeek,
      lastWeek: avgLastWeek,
      trend: avgThisWeek > avgLastWeek ? 'increasing' : 'decreasing',
      percentChange: ((avgThisWeek - avgLastWeek) / avgLastWeek) * 100
    };
  }

  findPeakUsageTimes(usageHistory) {
    const hourlyTotals = {};
    
    usageHistory.forEach(day => {
      if (day.hourlyBreakdown) {
        Object.keys(day.hourlyBreakdown).forEach(hour => {
          if (!hourlyTotals[hour]) hourlyTotals[hour] = 0;
          hourlyTotals[hour] += day.hourlyBreakdown[hour];
        });
      }
    });

    // Find top 3 peak hours
    const sortedHours = Object.entries(hourlyTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour, usage]) => ({ hour: parseInt(hour), usage }));

    return sortedHours;
  }

  projectDailyUsage(currentUsage, patterns, currentHour) {
    const remainingHours = 24 - currentHour;
    const avgHourlyUsage = patterns.hourlyDistribution[currentHour] || 10;
    return currentUsage.totalTime + (avgHourlyUsage * remainingHours);
  }

  calculateContinuousUsage(currentUsage) {
    // Simplified - in real app this would track actual continuous usage
    return currentUsage.recentActivity?.continuousMinutes || 0;
  }

  // Analysis helper methods
  analyzeWeekendVsWeekday(patterns, usageHistory) {
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const weekends = ['Saturday', 'Sunday'];
    
    const weekdayAvg = weekdays.reduce((sum, day) => sum + (patterns.dailyAverages[day] || 0), 0) / weekdays.length;
    const weekendAvg = weekends.reduce((sum, day) => sum + (patterns.dailyAverages[day] || 0), 0) / weekends.length;
    
    if (Math.abs(weekendAvg - weekdayAvg) > 30) {
      return {
        message: weekendAvg > weekdayAvg 
          ? `You use your device ${Math.round(weekendAvg - weekdayAvg)} minutes more on weekends`
          : `You use your device ${Math.round(weekdayAvg - weekendAvg)} minutes less on weekends`,
        confidence: PredictionConfidence.HIGH,
        suggestion: 'Consider maintaining consistent usage patterns throughout the week'
      };
    }
    return null;
  }

  analyzeMostUsedApps(patterns) {
    const sortedApps = Object.entries(patterns.appUsagePatterns)
      .sort(([,a], [,b]) => b.total - a.total)
      .slice(0, 3);
    
    if (sortedApps.length > 0) {
      const topApp = sortedApps[0];
      return {
        message: `Your most used app is ${topApp[0]} with an average of ${Math.round(topApp[1].average)} minutes per day`,
        confidence: PredictionConfidence.HIGH,
        suggestion: 'Consider setting specific time limits for your most-used apps'
      };
    }
    return null;
  }

  analyzeUsageConsistency(patterns, usageHistory) {
    const recentDays = usageHistory.slice(-7);
    const times = recentDays.map(day => day.totalTime);
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const variance = times.reduce((sum, time) => sum + Math.pow(time - avg, 2), 0) / times.length;
    const standardDeviation = Math.sqrt(variance);
    
    if (standardDeviation > avg * 0.3) {
      return {
        message: 'Your usage patterns vary significantly day-to-day',
        confidence: PredictionConfidence.MEDIUM,
        suggestion: 'Try to establish more consistent daily routines for better digital wellness'
      };
    }
    return null;
  }

  analyzePeakUsagePatterns(patterns) {
    const peakHours = patterns.peakUsageTimes;
    if (peakHours.length > 0) {
      const topHour = peakHours[0].hour;
      const timeLabel = topHour < 12 ? 'morning' : topHour < 17 ? 'afternoon' : topHour < 21 ? 'evening' : 'night';
      
      return {
        message: `Your peak usage time is in the ${timeLabel} around ${topHour}:00`,
        confidence: PredictionConfidence.HIGH,
        suggestion: 'Consider scheduling important tasks during your low-usage periods'
      };
    }
    return null;
  }

  // Get current predictions
  getCurrentPredictions() {
    return this.predictions;
  }

  // Add learning data for future improvements
  addLearningData(prediction, userAction) {
    this.learningData.push({
      prediction,
      userAction,
      timestamp: new Date()
    });
  }
}

export default new AIPredictor();
