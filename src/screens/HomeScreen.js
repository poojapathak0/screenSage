import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {useAppContext} from '../services/AppContext';
import ScreenTimeChart from '../components/ScreenTimeChart';
import QuickActions from '../components/QuickActions';
import AIInsights from '../components/AIInsights';

const HomeScreen = () => {
  const {screenTimeData, petHealth, aiPredictions} = useAppContext();
  const [todayUsage, setTodayUsage] = useState(0);
  const [goalProgress, setGoalProgress] = useState(0);

  useEffect(() => {
    // Calculate today's usage and goal progress
    const today = new Date().toDateString();
    const usage = screenTimeData[today] || 0;
    setTodayUsage(usage);
    setGoalProgress((usage / 480) * 100); // 8 hours = 480 minutes goal
  }, [screenTimeData]);

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getMotivationalMessage = () => {
    if (goalProgress < 50) {
      return "🌟 Great job! You're on track for a healthy day!";
    } else if (goalProgress < 80) {
      return "⚠️ Getting close to your limit. Time for a break?";
    } else {
      return "🚨 Consider taking a longer break for your wellbeing!";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning! 👋</Text>
            <Text style={styles.subtitle}>Let's check your digital wellness</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="notifications-outline" size={24} color="#6366f1" />
          </TouchableOpacity>
        </View>

        {/* Today's Overview Card */}
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.overviewCard}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}>
          <View style={styles.overviewContent}>
            <Text style={styles.overviewTitle}>Today's Screen Time</Text>
            <Text style={styles.overviewTime}>{formatTime(todayUsage)}</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {width: `${Math.min(goalProgress, 100)}%`},
                ]}
              />
            </View>
            <Text style={styles.overviewSubtext}>
              {Math.max(0, 480 - todayUsage)} minutes left until goal
            </Text>
          </View>
        </LinearGradient>

        {/* Motivational Message */}
        <View style={styles.messageCard}>
          <Text style={styles.messageText}>{getMotivationalMessage()}</Text>
        </View>

        {/* Pet Health Indicator */}
        <TouchableOpacity style={styles.petHealthCard}>
          <View style={styles.petHealthContent}>
            <Icon
              name={petHealth > 70 ? 'happy-outline' : 'sad-outline'}
              size={32}
              color={petHealth > 70 ? '#10b981' : '#f59e0b'}
            />
            <View style={styles.petHealthText}>
              <Text style={styles.petHealthTitle}>Your Pet's Mood</Text>
              <Text
                style={[
                  styles.petHealthStatus,
                  {color: petHealth > 70 ? '#10b981' : '#f59e0b'},
                ]}>
                {petHealth > 70 ? 'Happy & Healthy' : 'Needs Attention'}
              </Text>
            </View>
            <Icon name="chevron-forward" size={24} color="#9ca3af" />
          </View>
        </TouchableOpacity>

        {/* Quick Actions */}
        <QuickActions />

        {/* AI Insights */}
        <AIInsights predictions={aiPredictions} />

        {/* Screen Time Chart */}
        <ScreenTimeChart data={screenTimeData} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  notificationButton: {
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overviewCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  overviewContent: {
    alignItems: 'center',
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  overviewTime: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 4,
  },
  overviewSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  messageCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
  },
  petHealthCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  petHealthContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petHealthText: {
    flex: 1,
    marginLeft: 16,
  },
  petHealthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  petHealthStatus: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default HomeScreen;
