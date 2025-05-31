import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const PetStats = ({health, happiness, energy, food}) => {
  const StatBar = ({icon, label, value, maxValue = 100, color}) => (
    <View style={styles.statItem}>
      <View style={styles.statHeader}>
        <Icon name={icon} size={20} color={color} />
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}/{maxValue}</Text>
      </View>
      <View style={styles.statBar}>
        <View
          style={[
            styles.statFill,
            {
              width: `${(value / maxValue) * 100}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet Stats</Text>
      
      <StatBar
        icon="heart"
        label="Health"
        value={health}
        color="#ef4444"
      />
      
      <StatBar
        icon="happy"
        label="Happiness"
        value={happiness}
        color="#f59e0b"
      />
      
      <StatBar
        icon="flash"
        label="Energy"
        value={energy}
        color="#10b981"
      />
      
      <StatBar
        icon="restaurant"
        label="Food"
        value={food}
        maxValue={10}
        color="#6366f1"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  statItem: {
    marginBottom: 16,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  statValue: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  statBar: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
  },
  statFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default PetStats;
