import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AIInsights = ({predictions}) => {
  const getInsightIcon = (type) => {
    switch (type) {
      case 'warning':
        return 'warning-outline';
      case 'suggestion':
        return 'bulb-outline';
      case 'achievement':
        return 'trophy-outline';
      default:
        return 'information-circle-outline';
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'warning':
        return '#f59e0b';
      case 'suggestion':
        return '#6366f1';
      case 'achievement':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  if (!predictions || predictions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>AI Insights</Text>
        <View style={styles.emptyState}>
          <Icon name="bulb-outline" size={48} color="#d1d5db" />
          <Text style={styles.emptyText}>
            Keep using the app to get personalized insights!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Insights</Text>
      {predictions.slice(0, 2).map((prediction, index) => (
        <TouchableOpacity key={index} style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Icon
              name={getInsightIcon(prediction.type)}
              size={24}
              color={getInsightColor(prediction.type)}
            />
            <View style={styles.confidenceContainer}>
              <Text style={styles.confidenceText}>
                {Math.round(prediction.confidence * 100)}% confident
              </Text>
            </View>
          </View>
          <Text style={styles.insightText}>{prediction.message}</Text>
          <View style={styles.insightFooter}>
            <Text style={styles.timestampText}>
              {prediction.timestamp?.toLocaleTimeString() || 'Just now'}
            </Text>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    marginHorizontal: 20,
  },
  insightCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  confidenceContainer: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  insightText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  insightFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timestampText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  actionButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    marginHorizontal: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
});

export default AIInsights;
