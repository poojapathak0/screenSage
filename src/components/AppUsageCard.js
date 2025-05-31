// App Usage Card Component for ScreenSage
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { formatTime, getUsageColor, calculateProgress } from '../utils';

const AppUsageCard = ({ apps, goals, onAppPress }) => {
  const topApps = apps.slice(0, 5); // Show top 5 apps

  const getAppProgress = (appTime, appName) => {
    const appLimit = goals?.appLimits?.[appName];
    if (!appLimit) return null;
    return calculateProgress(appTime, appLimit);
  };

  const getProgressColor = (progress) => {
    if (!progress) return '#E0E0E0';
    if (progress <= 70) return '#4CAF50';
    if (progress <= 90) return '#FF9800';
    return '#F44336';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📱 Top Apps</Text>
        <Text style={styles.subtitle}>Today's usage</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {topApps.map((app, index) => {
          const progress = getAppProgress(app.time, app.name);
          const progressColor = getProgressColor(progress);
          
          return (
            <TouchableOpacity
              key={app.name}
              style={styles.appItem}
              onPress={() => onAppPress?.(app)}
              activeOpacity={0.7}
            >
              <View style={styles.appInfo}>
                <View style={styles.appIconContainer}>
                  <Text style={styles.appIcon}>{app.icon || '📱'}</Text>
                  <View style={[styles.rankBadge, { backgroundColor: getRankColor(index) }]}>
                    <Text style={styles.rankText}>{index + 1}</Text>
                  </View>
                </View>
                
                <View style={styles.appDetails}>
                  <Text style={styles.appName}>{app.name}</Text>
                  <Text style={styles.appCategory}>{app.category}</Text>
                  {app.lastUsed && (
                    <Text style={styles.lastUsed}>
                      Last used: {formatLastUsed(app.lastUsed)}
                    </Text>
                  )}
                </View>
              </View>
              
              <View style={styles.usageInfo}>
                <Text style={styles.usageTime}>{formatTime(app.time)}</Text>
                {progress && (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBackground}>
                      <View 
                        style={[
                          styles.progressBar,
                          { 
                            width: `${Math.min(progress, 100)}%`,
                            backgroundColor: progressColor
                          }
                        ]}
                      />
                    </View>
                    <Text style={[styles.progressText, { color: progressColor }]}>
                      {Math.round(progress)}%
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      {apps.length > 5 && (
        <TouchableOpacity style={styles.seeAllButton} onPress={() => onAppPress?.({ showAll: true })}>
          <Text style={styles.seeAllText}>See all {apps.length} apps →</Text>
        </TouchableOpacity>
      )}
      
      {apps.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📱</Text>
          <Text style={styles.emptyText}>No app usage today</Text>
          <Text style={styles.emptySubtext}>Start using your device to see data here</Text>
        </View>
      )}
    </View>
  );
};

const formatLastUsed = (lastUsed) => {
  const now = new Date();
  const diff = now - new Date(lastUsed);
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const getRankColor = (index) => {
  const colors = ['#FFD700', '#C0C0C0', '#CD7F32', '#4CAF50', '#2196F3'];
  return colors[index] || '#9E9E9E';
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  appItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appIconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  appIcon: {
    fontSize: 24,
  },
  rankBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFF',
  },
  appDetails: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  appCategory: {
    fontSize: 12,
    color: '#888',
    textTransform: 'capitalize',
    marginBottom: 2,
  },
  lastUsed: {
    fontSize: 11,
    color: '#AAA',
  },
  usageInfo: {
    alignItems: 'flex-end',
  },
  usageTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBackground: {
    width: 60,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginRight: 6,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '600',
  },
  seeAllButton: {
    marginTop: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#AAA',
    textAlign: 'center',
  },
});

export default AppUsageCard;
