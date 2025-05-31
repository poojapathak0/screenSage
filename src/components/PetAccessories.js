import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const PetAccessories = ({accessories, unlockedAccessories}) => {
  const allAccessories = [
    {
      id: 'basic_collar',
      name: 'Basic Collar',
      icon: 'ellipse-outline',
      price: 0,
      unlocked: true,
      equipped: accessories.includes('basic_collar'),
    },
    {
      id: 'gold_collar',
      name: 'Gold Collar',
      icon: 'ellipse',
      price: 100,
      unlocked: unlockedAccessories.includes('gold_collar'),
      equipped: accessories.includes('gold_collar'),
    },
    {
      id: 'party_hat',
      name: 'Party Hat',
      icon: 'triangle-outline',
      price: 150,
      unlocked: unlockedAccessories.includes('party_hat'),
      equipped: accessories.includes('party_hat'),
    },
    {
      id: 'sunglasses',
      name: 'Cool Sunglasses',
      icon: 'glasses-outline',
      price: 200,
      unlocked: unlockedAccessories.includes('sunglasses'),
      equipped: accessories.includes('sunglasses'),
    },
    {
      id: 'bow_tie',
      name: 'Bow Tie',
      icon: 'ribbon-outline',
      price: 120,
      unlocked: unlockedAccessories.includes('bow_tie'),
      equipped: accessories.includes('bow_tie'),
    },
    {
      id: 'crown',
      name: 'Royal Crown',
      icon: 'diamond-outline',
      price: 500,
      unlocked: unlockedAccessories.includes('crown'),
      equipped: accessories.includes('crown'),
    },
  ];

  const handleAccessoryPress = (accessory) => {
    if (!accessory.unlocked) {
      console.log('Accessory not unlocked yet');
      return;
    }
    
    if (accessory.equipped) {
      console.log('Unequipping accessory:', accessory.id);
      // Remove from equipped accessories
    } else {
      console.log('Equipping accessory:', accessory.id);
      // Add to equipped accessories
    }
  };

  const AccessoryItem = ({accessory}) => (
    <TouchableOpacity
      style={[
        styles.accessoryItem,
        accessory.equipped && styles.equippedItem,
        !accessory.unlocked && styles.lockedItem,
      ]}
      onPress={() => handleAccessoryPress(accessory)}>
      <View style={styles.accessoryIcon}>
        <Icon
          name={accessory.icon}
          size={24}
          color={
            !accessory.unlocked
              ? '#d1d5db'
              : accessory.equipped
              ? '#10b981'
              : '#6366f1'
          }
        />
      </View>
      <Text
        style={[
          styles.accessoryName,
          !accessory.unlocked && styles.lockedText,
          accessory.equipped && styles.equippedText,
        ]}>
        {accessory.name}
      </Text>
      {!accessory.unlocked && (
        <View style={styles.priceContainer}>
          <Icon name="diamond-outline" size={12} color="#f59e0b" />
          <Text style={styles.priceText}>{accessory.price}</Text>
        </View>
      )}
      {accessory.equipped && (
        <Icon name="checkmark-circle" size={20} color="#10b981" />
      )}
      {!accessory.unlocked && (
        <Icon name="lock-closed" size={16} color="#d1d5db" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accessories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.accessoriesContainer}>
        {allAccessories.map((accessory) => (
          <AccessoryItem key={accessory.id} accessory={accessory} />
        ))}
      </ScrollView>
      
      <View style={styles.hint}>
        <Icon name="information-circle-outline" size={16} color="#6b7280" />
        <Text style={styles.hintText}>
          Unlock accessories by completing challenges and maintaining good habits!
        </Text>
      </View>
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
  accessoriesContainer: {
    paddingHorizontal: 4,
  },
  accessoryItem: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 80,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  equippedItem: {
    backgroundColor: '#ecfdf5',
    borderColor: '#10b981',
  },
  lockedItem: {
    backgroundColor: '#f3f4f6',
    opacity: 0.7,
  },
  accessoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  accessoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 4,
  },
  equippedText: {
    color: '#10b981',
  },
  lockedText: {
    color: '#9ca3af',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
  },
  priceText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#92400e',
    marginLeft: 2,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  hintText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
});

export default PetAccessories;
