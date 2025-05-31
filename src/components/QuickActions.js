import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const QuickActions = () => {
  const actions = [
    {
      id: 1,
      title: 'Start Focus',
      subtitle: 'Block apps',
      icon: 'eye-off-outline',
      color: '#10b981',
    },
    {
      id: 2,
      title: 'Set Goal',
      subtitle: 'Daily limit',
      icon: 'target-outline',
      color: '#6366f1',
    },
    {
      id: 3,
      title: 'Take Break',
      subtitle: '5 min rest',
      icon: 'pause-outline',
      color: '#f59e0b',
    },
    {
      id: 4,
      title: 'Insights',
      subtitle: 'View AI tips',
      icon: 'bulb-outline',
      color: '#8b5cf6',
    },
  ];

  const handleActionPress = (actionId) => {
    console.log(`Quick action ${actionId} pressed`);
    // Implement action logic here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionCard}
            onPress={() => handleActionPress(action.id)}>
            <View style={[styles.iconContainer, {backgroundColor: action.color}]}>
              <Icon name={action.icon} size={24} color="#ffffff" />
            </View>
            <Text style={styles.actionTitle}>{action.title}</Text>
            <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    marginRight: '2%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default QuickActions;
