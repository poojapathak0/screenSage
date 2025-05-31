import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageService from './StorageService';
import ScreenTimeTracker from './ScreenTimeTracker';
import NotificationService from './NotificationService';
import AIPredictor from '../ai/AIPredictor';
import { calculatePetMood, calculatePetNeeds } from '../utils';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({children}) => {
  // User and App State
  const [userId, setUserId] = useState('user_demo_001');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Screen Time Data
  const [screenTimeData, setScreenTimeData] = useState([]);
  const [todaysUsage, setTodaysUsage] = useState({
    totalTime: 0,
    apps: [],
    categories: {},
    hourlyBreakdown: {},
    breaks: 0
  });

  // Pet Data
  const [petData, setPetData] = useState({
    name: 'Sage',
    type: 'dragon',
    level: 1,
    experience: 0,
    happiness: 85,
    energy: 75,
    food: 100,
    health: 85,
    accessories: [],
    unlockedAccessories: ['basic_collar'],
    mood: 'happy',
    lastFed: null,
    lastPlayed: null
  });

  // Goals and Settings
  const [goals, setGoals] = useState({
    dailyLimit: 180, // 3 hours
    weeklyLimit: 1260, // 21 hours
    breakInterval: 60,
    appLimits: {},
    categoryLimits: {},
    focusMode: {
      enabled: false,
      apps: [],
      duration: 30
    }
  });

  const [settings, setSettings] = useState({
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

  // AI Predictions
  const [aiPredictions, setAiPredictions] = useState([]);

  // Social Data
  const [friends, setFriends] = useState([]);
  const [challenges, setChallenges] = useState([]);  
  // Initialize app services
  useEffect(() => {
    initializeApp();
  }, []);

  // Auto-save data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (isInitialized) {
        saveAllData();
      }
    }, 300000); // Save every 5 minutes

    return () => clearInterval(interval);
  }, [isInitialized]);

  // Update pet mood when stats change
  useEffect(() => {
    const mood = calculatePetMood(petData.health, petData.happiness, petData.energy);
    if (mood !== petData.mood) {
      setPetData(prev => ({ ...prev, mood }));
    }
  }, [petData.health, petData.happiness, petData.energy]);

  // Initialize the app
  const initializeApp = async () => {
    try {
      setIsLoading(true);

      // Initialize storage service
      await StorageService.initialize(userId);

      // Initialize notification service
      await NotificationService.initialize();

      // Initialize screen time tracker
      await ScreenTimeTracker.initialize();

      // Load all data from storage
      await loadAllData();

      // Start AI predictions
      await updateAIPredictions();

      setIsInitialized(true);
      console.log('App initialized successfully');
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load all data from storage
  const loadAllData = async () => {
    try {
      // Load pet data
      const petResult = await StorageService.getPetData();
      if (petResult.success) {
        setPetData(petResult.data);
      }

      // Load goals
      const goalsResult = await StorageService.getGoals();
      if (goalsResult.success) {
        setGoals(goalsResult.data);
      }

      // Load settings
      const settingsResult = await StorageService.getSettings();
      if (settingsResult.success) {
        setSettings(settingsResult.data);
        NotificationService.updateSettings(settingsResult.data.notifications);
      }

      // Load screen time data
      const screenTimeResult = await StorageService.getScreenTimeData(7);
      if (screenTimeResult.success) {
        setScreenTimeData(screenTimeResult.data);
        // Get today's data from the array
        const today = screenTimeResult.data.find(day => {
          const dayDate = new Date(day.date);
          const todayDate = new Date();
          return dayDate.toDateString() === todayDate.toDateString();
        });
        if (today) {
          setTodaysUsage(today);
        }
      }

      // Load social data
      const friendsResult = await StorageService.getFriends();
      if (friendsResult.success) {
        setFriends(friendsResult.data);
      }

      const challengesResult = await StorageService.getChallenges();
      if (challengesResult.success) {
        setChallenges(challengesResult.data);
      }

      // Load AI predictions
      const predictionsResult = await StorageService.getPredictions();
      if (predictionsResult.success) {
        setAiPredictions(predictionsResult.data);
      }

    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Save all data to storage
  const saveAllData = async () => {
    try {
      await Promise.all([
        StorageService.savePetData(petData),
        StorageService.saveGoals(goals),
        StorageService.saveSettings(settings),
        StorageService.saveFriends(friends),
        StorageService.saveChallenges(challenges),
        StorageService.savePredictions(aiPredictions)
      ]);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  // Pet management functions
  const feedPet = () => {
    const now = new Date();
    const timeSinceLastFed = petData.lastFed ? now - new Date(petData.lastFed) : Infinity;
    const hoursSinceLastFed = timeSinceLastFed / (1000 * 60 * 60);

    if (hoursSinceLastFed >= 1) { // Can only feed every hour
      const newPetData = {
        ...petData,
        food: Math.min(100, petData.food + 20),
        happiness: Math.min(100, petData.happiness + 15),
        health: Math.min(100, petData.health + 10),
        experience: petData.experience + 10,
        lastFed: now.toISOString()
      };
      
      setPetData(newPetData);
      StorageService.savePetData(newPetData);
      
      // Check for pet needs notification
      const needs = calculatePetNeeds(newPetData);
      if (needs.length === 0) {
        NotificationService.schedulePetNeedsAlert(['happy and well-fed!']);
      }
      
      return { success: true, message: 'Your pet enjoyed the meal!' };
    } else {
      const timeLeft = Math.ceil(1 - hoursSinceLastFed);
      return { 
        success: false, 
        message: `Your pet isn't hungry yet. Try again in ${timeLeft} hour${timeLeft !== 1 ? 's' : ''}.` 
      };
    }
  };

  const playWithPet = () => {
    const now = new Date();
    const timeSinceLastPlayed = petData.lastPlayed ? now - new Date(petData.lastPlayed) : Infinity;
    const minutesSinceLastPlayed = timeSinceLastPlayed / (1000 * 60);

    if (petData.energy >= 20 && minutesSinceLastPlayed >= 30) { // Need 30 minutes between play sessions
      const newPetData = {
        ...petData,
        energy: Math.max(0, petData.energy - 20),
        happiness: Math.min(100, petData.happiness + 20),
        experience: petData.experience + 15,
        lastPlayed: now.toISOString()
      };
      
      setPetData(newPetData);
      StorageService.savePetData(newPetData);
      
      return { success: true, message: 'Your pet had a great time playing!' };
    } else if (petData.energy < 20) {
      return { success: false, message: 'Your pet is too tired to play right now.' };
    } else {
      const timeLeft = Math.ceil(30 - minutesSinceLastPlayed);
      return { 
        success: false, 
        message: `Your pet needs to rest. Try again in ${timeLeft} minutes.` 
      };
    }
        happiness: Math.min(100, petData.happiness + 15),
        experience: petData.experience + 10,
      };
      setPetData(newPetData);
      setPetHealth(Math.min(100, petHealth + 3));
      saveDataToStorage('petData', newPetData);
    }
  };

  const addScreenTime = (appName, minutes) => {
    const today = new Date().toDateString();
    const newScreenTimeData = {
      ...screenTimeData,
      [today]: (screenTimeData[today] || 0) + minutes,
    };
    
    const newAppUsageData = {
      ...appUsageData,
      [appName]: (appUsageData[appName] || 0) + minutes,
    };

    setScreenTimeData(newScreenTimeData);
    setAppUsageData(newAppUsageData);
    
    // Update pet health based on screen time goals
    const todayUsage = newScreenTimeData[today];
    if (todayUsage > dailyGoal) {
      const penalty = Math.floor((todayUsage - dailyGoal) / 30); // Lose health for every 30 minutes over
      updatePetHealth(petHealth - penalty);
    }

    saveDataToStorage('screenTimeData', newScreenTimeData);
  };

  const checkDailyGoal = () => {
    const today = new Date().toDateString();
    const todayUsage = screenTimeData[today] || 0;
    return todayUsage <= dailyGoal;
  };

  const getWeeklyStats = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      days.push({
        date: dateString,
        usage: screenTimeData[dateString] || 0,
        goalMet: (screenTimeData[dateString] || 0) <= dailyGoal,
      });
    }
    return days;
  };

  const generateAIPrediction = (usage, time, patterns) => {
    // Simple AI prediction logic (would be more sophisticated in real app)
    const predictions = [];
    
    if (usage > dailyGoal * 0.7 && new Date().getHours() > 18) {
      predictions.push({
        type: 'warning',
        message: 'You\'re approaching your daily limit. Consider taking a break!',
        confidence: 0.8,
        timestamp: new Date(),
      });
    }

    if (patterns.socialMediaPeak && new Date().getHours() === patterns.socialMediaPeak) {
      predictions.push({
        type: 'suggestion',
        message: 'This is usually when you use social media most. Try a 5-minute mindfulness exercise instead.',
        confidence: 0.75,
        timestamp: new Date(),
      });
    }

    return predictions;
  };

  const value = {
    // Data
    screenTimeData,
    appUsageData,
    petData,
    petHealth,
    aiPredictions,
    userSettings,
    dailyGoal,

    // Functions
    updatePetHealth,
    feedPet,
    playWithPet,
    addScreenTime,
    checkDailyGoal,
    getWeeklyStats,
    generateAIPrediction,
    setDailyGoal,
    setUserSettings: (newSettings) => {
      setUserSettings(newSettings);
      saveDataToStorage('userSettings', newSettings);
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
