import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {useAppContext} from '../services/AppContext';
import PetAvatar from '../components/PetAvatar';
import PetStats from '../components/PetStats';
import PetAccessories from '../components/PetAccessories';

const PetScreen = () => {
  const {
    petData,
    petHealth,
    screenTimeGoals,
    updatePetHealth,
    feedPet,
    playWithPet,
  } = useAppContext();
  
  const [petAnimation] = useState(new Animated.Value(1));
  const [selectedAction, setSelectedAction] = useState(null);

  useEffect(() => {
    // Animate pet based on health
    const animatePet = () => {
      Animated.sequence([
        Animated.timing(petAnimation, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(petAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => animatePet());
    };

    if (petHealth > 70) {
      animatePet();
    }
  }, [petHealth, petAnimation]);

  const handleFeedPet = () => {
    if (petData.food > 0) {
      feedPet();
      setSelectedAction('feed');
      Alert.alert('Yummy! 🍎', 'Your pet enjoyed the healthy snack!');
    } else {
      Alert.alert(
        'No Food Available',
        'Meet your screen time goals to earn more food for your pet!'
      );
    }
  };

  const handlePlayWithPet = () => {
    if (petData.energy > 20) {
      playWithPet();
      setSelectedAction('play');
      Alert.alert('Fun Time! 🎾', 'Your pet loved playing with you!');
    } else {
      Alert.alert(
        'Pet is Tired',
        'Your pet needs rest. Reduce screen time to restore energy!'
      );
    }
  };

  const getPetMood = () => {
    if (petHealth >= 80) return {mood: 'Ecstatic', emoji: '😍', color: '#10b981'};
    if (petHealth >= 60) return {mood: 'Happy', emoji: '😊', color: '#059669'};
    if (petHealth >= 40) return {mood: 'Okay', emoji: '😐', color: '#f59e0b'};
    if (petHealth >= 20) return {mood: 'Sad', emoji: '😢', color: '#ef4444'};
    return {mood: 'Very Sad', emoji: '😭', color: '#dc2626'};
  };

  const mood = getPetMood();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Digital Pet</Text>
        <TouchableOpacity style={styles.shopButton}>
          <Icon name="storefront-outline" size={24} color="#6366f1" />
        </TouchableOpacity>
      </View>

      {/* Pet Container */}
      <LinearGradient
        colors={['#ddd6fe', '#e0e7ff']}
        style={styles.petContainer}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        
        {/* Pet Avatar */}
        <Animated.View
          style={[
            styles.petAvatarContainer,
            {transform: [{scale: petAnimation}]},
          ]}>
          <PetAvatar
            type={petData.type}
            health={petHealth}
            accessories={petData.accessories}
            mood={mood.mood}
          />
        </Animated.View>

        {/* Pet Name & Mood */}
        <Text style={styles.petName}>{petData.name || 'Sage'}</Text>
        <Text style={[styles.petMood, {color: mood.color}]}>
          {mood.emoji} {mood.mood}
        </Text>

        {/* Pet Level */}
        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>Level {petData.level}</Text>
          <View style={styles.expBar}>
            <View
              style={[
                styles.expFill,
                {width: `${(petData.experience % 100)}%`},
              ]}
            />
          </View>
          <Text style={styles.expText}>
            {petData.experience % 100}/100 XP
          </Text>
        </View>
      </LinearGradient>

      {/* Pet Stats */}
      <PetStats
        health={petHealth}
        happiness={petData.happiness}
        energy={petData.energy}
        food={petData.food}
      />

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            selectedAction === 'feed' && styles.selectedAction,
          ]}
          onPress={handleFeedPet}>
          <Icon name="nutrition-outline" size={32} color="#ffffff" />
          <Text style={styles.actionText}>Feed</Text>
          <Text style={styles.actionSubtext}>Food: {petData.food}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            selectedAction === 'play' && styles.selectedAction,
          ]}
          onPress={handlePlayWithPet}>
          <Icon name="football-outline" size={32} color="#ffffff" />
          <Text style={styles.actionText}>Play</Text>
          <Text style={styles.actionSubtext}>
            Energy: {petData.energy}%
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="shirt-outline" size={32} color="#ffffff" />
          <Text style={styles.actionText}>Dress Up</Text>
          <Text style={styles.actionSubtext}>Customize</Text>
        </TouchableOpacity>
      </View>

      {/* Pet Accessories */}
      <PetAccessories
        accessories={petData.accessories}
        unlockedAccessories={petData.unlockedAccessories}
      />

      {/* Tips */}
      <View style={styles.tipsContainer}>
        <Icon name="bulb-outline" size={20} color="#6366f1" />
        <Text style={styles.tipsText}>
          💡 Tip: Meet your daily screen time goals to keep your pet healthy and unlock new accessories!
        </Text>
      </View>
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
  shopButton: {
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  petContainer: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  petAvatarContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  petName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  petMood: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  levelContainer: {
    alignItems: 'center',
    width: '100%',
  },
  levelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  expBar: {
    width: '80%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 4,
    marginBottom: 8,
  },
  expFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },
  expText: {
    fontSize: 12,
    color: '#6b7280',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedAction: {
    backgroundColor: '#8b5cf6',
    transform: [{scale: 1.05}],
  },
  actionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  actionSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  tipsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});

export default PetScreen;
