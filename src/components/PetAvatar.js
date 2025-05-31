import React from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';

const PetAvatar = ({type, health, accessories, mood}) => {
  const getPetEmoji = () => {
    const petTypes = {
      dragon: health > 70 ? '🐉' : health > 40 ? '🐲' : '😴',
      cat: health > 70 ? '😸' : health > 40 ? '😺' : '😿',
      dog: health > 70 ? '🐕' : health > 40 ? '🐶' : '😔',
      plant: health > 70 ? '🌱' : health > 40 ? '🌿' : '🥀',
      robot: health > 70 ? '🤖' : health > 40 ? '⚙️' : '🔋',
    };
    return petTypes[type] || '🐉';
  };

  const getHealthIndicator = () => {
    if (health > 80) return {color: '#10b981', text: 'Excellent'};
    if (health > 60) return {color: '#f59e0b', text: 'Good'};
    if (health > 40) return {color: '#ef4444', text: 'Poor'};
    return {color: '#7f1d1d', text: 'Critical'};
  };

  const healthIndicator = getHealthIndicator();

  return (
    <View style={styles.container}>
      {/* Pet Avatar */}
      <View style={styles.petContainer}>
        <Text style={styles.petEmoji}>{getPetEmoji()}</Text>
        
        {/* Accessories */}
        {accessories.includes('hat') && (
          <Text style={[styles.accessory, styles.hat]}>🎩</Text>
        )}
        {accessories.includes('collar') && (
          <Text style={[styles.accessory, styles.collar]}>💎</Text>
        )}
        {accessories.includes('toy') && (
          <Text style={[styles.accessory, styles.toy]}>🎾</Text>
        )}
      </View>

      {/* Health Bar */}
      <View style={styles.healthBarContainer}>
        <View style={styles.healthBar}>
          <View
            style={[
              styles.healthFill,
              {
                width: `${health}%`,
                backgroundColor: healthIndicator.color,
              },
            ]}
          />
        </View>
        <Text style={[styles.healthText, {color: healthIndicator.color}]}>
          {health}% - {healthIndicator.text}
        </Text>
      </View>

      {/* Mood Indicator */}
      {mood && (
        <View style={styles.moodContainer}>
          <Text style={styles.moodText}>Feeling {mood.toLowerCase()}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  petContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 60,
    marginBottom: 16,
  },
  petEmoji: {
    fontSize: 80,
  },
  accessory: {
    position: 'absolute',
    fontSize: 24,
  },
  hat: {
    top: -10,
    left: '50%',
    marginLeft: -12,
  },
  collar: {
    bottom: 20,
    left: '50%',
    marginLeft: -12,
  },
  toy: {
    right: -5,
    bottom: 10,
  },
  healthBarContainer: {
    alignItems: 'center',
    width: '100%',
  },
  healthBar: {
    width: '80%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 8,
  },
  healthFill: {
    height: '100%',
    borderRadius: 4,
  },
  healthText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  moodContainer: {
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moodText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
});

export default PetAvatar;
