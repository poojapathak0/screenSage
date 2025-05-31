import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {LineChart, BarChart, PieChart} from 'react-native-chart-kit';
import {useAppContext} from '../services/AppContext';

const {width: screenWidth} = Dimensions.get('window');

const StatsScreen = () => {
  const {screenTimeData, appUsageData, weeklyGoals} = useAppContext();
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Sample data for charts
  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [180, 245, 190, 320, 280, 410, 350],
        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const appUsageChart = [
    {
      name: 'Social Media',
      population: 120,
      color: '#ef4444',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
    {
      name: 'Entertainment',
      population: 90,
      color: '#f59e0b',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
    {
      name: 'Productivity',
      population: 60,
      color: '#10b981',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
    {
      name: 'Games',
      population: 45,
      color: '#8b5cf6',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#6366f1',
    },
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const StatCard = ({title, value, subtitle, icon, color}) => (
    <View style={[styles.statCard, {borderLeftColor: color}]}>
      <View style={styles.statContent}>
        <View style={styles.statText}>
          <Text style={styles.statTitle}>{title}</Text>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statSubtitle}>{subtitle}</Text>
        </View>
        <Icon name={icon} size={32} color={color} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Statistics</Text>
          <TouchableOpacity style={styles.exportButton}>
            <Icon name="download-outline" size={24} color="#6366f1" />
          </TouchableOpacity>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {['week', 'month', 'year'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.selectedPeriod,
              ]}
              onPress={() => setSelectedPeriod(period)}>
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period && styles.selectedPeriodText,
                ]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Daily Average"
            value={formatTime(275)}
            subtitle="This week"
            icon="time-outline"
            color="#6366f1"
          />
          <StatCard
            title="Goal Achieved"
            value="5/7"
            subtitle="Days this week"
            icon="trophy-outline"
            color="#10b981"
          />
          <StatCard
            title="Longest Streak"
            value="12 days"
            subtitle="Personal best"
            icon="flame-outline"
            color="#f59e0b"
          />
          <StatCard
            title="Pet Health"
            value="85%"
            subtitle="Excellent!"
            icon="heart-outline"
            color="#ef4444"
          />
        </View>

        {/* Weekly Trend Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Screen Time Trend</Text>
          <LineChart
            data={weeklyData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* App Usage Breakdown */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>App Category Breakdown</Text>
          <PieChart
            data={appUsageChart}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        </View>

        {/* Detailed Breakdown */}
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>App Usage Details</Text>
          
          {[
            {name: 'Instagram', time: 65, category: 'Social', color: '#e91e63'},
            {name: 'YouTube', time: 45, category: 'Entertainment', color: '#ff5722'},
            {name: 'WhatsApp', time: 35, category: 'Communication', color: '#4caf50'},
            {name: 'TikTok', time: 30, category: 'Social', color: '#9c27b0'},
            {name: 'Slack', time: 25, category: 'Productivity', color: '#2196f3'},
          ].map((app, index) => (
            <View key={index} style={styles.appUsageItem}>
              <View style={styles.appInfo}>
                <View style={[styles.appIcon, {backgroundColor: app.color}]}>
                  <Text style={styles.appIconText}>
                    {app.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.appDetails}>
                  <Text style={styles.appName}>{app.name}</Text>
                  <Text style={styles.appCategory}>{app.category}</Text>
                </View>
              </View>
              <Text style={styles.appTime}>{formatTime(app.time)}</Text>
            </View>
          ))}
        </View>

        {/* Insights */}
        <View style={styles.insightsContainer}>
          <Text style={styles.sectionTitle}>AI Insights</Text>
          
          <View style={styles.insightCard}>
            <Icon name="trending-down" size={24} color="#10b981" />
            <Text style={styles.insightText}>
              Your screen time decreased by 15% this week compared to last week. Great job! 🎉
            </Text>
          </View>
          
          <View style={styles.insightCard}>
            <Icon name="time-outline" size={24} color="#f59e0b" />
            <Text style={styles.insightText}>
              You typically use your phone most between 7-9 PM. Consider setting a reminder during this time.
            </Text>
          </View>
          
          <View style={styles.insightCard}>
            <Icon name="calendar-outline" size={24} color="#6366f1" />
            <Text style={styles.insightText}>
              Weekends are your most challenging days. Try planning offline activities!
            </Text>
          </View>
        </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  exportButton: {
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedPeriod: {
    backgroundColor: '#6366f1',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  selectedPeriodText: {
    color: '#ffffff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    marginRight: '2%',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statText: {
    flex: 1,
  },
  statTitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 11,
    color: '#9ca3af',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 12,
  },
  detailsContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  appUsageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appIconText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  appDetails: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  appCategory: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  appTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  insightsContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  insightText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});

export default StatsScreen;
