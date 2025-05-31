// Focus Mode Component for ScreenSage
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { AppContext } from '../services/AppContext';
import { formatTime } from '../utils';

const FocusMode = ({ visible, onClose }) => {
  const { goals, updateGoals } = useContext(AppContext);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [timer, setTimer] = useState(null);

  const durations = [15, 30, 45, 60, 90, 120];

  useEffect(() => {
    if (goals?.focusMode?.enabled) {
      setIsActive(true);
      const endTime = new Date(goals.focusMode.endTime);
      const now = new Date();
      const remaining = Math.max(0, Math.floor((endTime - now) / 60000));
      setTimeRemaining(remaining);
    }
  }, [goals]);

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            endFocusMode();
            return 0;
          }
          return prev - 1;
        });
      }, 60000);

      setTimer(interval);
      return () => clearInterval(interval);
    }
  }, [isActive, timeRemaining]);

  const startFocusMode = () => {
    const endTime = new Date();
    endTime.setMinutes(endTime.getMinutes() + selectedDuration);

    const focusModeData = {
      ...goals.focusMode,
      enabled: true,
      duration: selectedDuration,
      startTime: new Date().toISOString(),
      endTime: endTime.toISOString(),
      apps: goals.focusMode?.apps || []
    };

    updateGoals({
      ...goals,
      focusMode: focusModeData
    });

    setIsActive(true);
    setTimeRemaining(selectedDuration);
    
    Alert.alert(
      '🎯 Focus Mode Activated',
      `Focus mode is now active for ${selectedDuration} minutes. Distracting apps will be limited.`,
      [{ text: 'Got it!' }]
    );
  };

  const endFocusMode = () => {
    const focusModeData = {
      ...goals.focusMode,
      enabled: false,
      endTime: new Date().toISOString()
    };

    updateGoals({
      ...goals,
      focusMode: focusModeData
    });

    setIsActive(false);
    setTimeRemaining(0);
    
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }

    Alert.alert(
      '✅ Focus Session Complete',
      'Great job! You completed your focus session. Your pet is proud of you!',
      [{ text: 'Awesome!' }]
    );
  };

  const confirmEndFocusMode = () => {
    Alert.alert(
      'End Focus Mode?',
      'Are you sure you want to end your focus session early?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'End Session', style: 'destructive', onPress: endFocusMode }
      ]
    );
  };

  const renderTimerDisplay = () => {
    const hours = Math.floor(timeRemaining / 60);
    const minutes = timeRemaining % 60;
    
    return (
      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Time Remaining</Text>
        <Text style={styles.timerDisplay}>
          {hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}` : `${minutes}m`}
        </Text>
        <View style={styles.progressRing}>
          <View style={styles.progressBackground} />
          <View 
            style={[
              styles.progressFill,
              { 
                transform: [{ 
                  rotate: `${(1 - timeRemaining / selectedDuration) * 360}deg` 
                }] 
              }
            ]} 
          />
        </View>
      </View>
    );
  };

  const renderDurationSelector = () => (
    <View style={styles.durationContainer}>
      <Text style={styles.sectionTitle}>Select Duration</Text>
      <View style={styles.durationGrid}>
        {durations.map(duration => (
          <TouchableOpacity
            key={duration}
            style={[
              styles.durationButton,
              selectedDuration === duration && styles.selectedDuration
            ]}
            onPress={() => setSelectedDuration(duration)}
          >
            <Text style={[
              styles.durationText,
              selectedDuration === duration && styles.selectedDurationText
            ]}>
              {duration}m
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🎯 Focus Mode</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {isActive ? (
            <View style={styles.activeSession}>
              <Text style={styles.statusText}>Focus Mode Active</Text>
              {renderTimerDisplay()}
              
              <View style={styles.benefitsContainer}>
                <Text style={styles.benefitsTitle}>What's happening:</Text>
                <Text style={styles.benefitItem}>• Distracting apps are limited</Text>
                <Text style={styles.benefitItem}>• Notifications are minimized</Text>
                <Text style={styles.benefitItem}>• Your pet is gaining extra happiness</Text>
                <Text style={styles.benefitItem}>• Productivity apps remain available</Text>
              </View>

              <TouchableOpacity
                style={styles.endButton}
                onPress={confirmEndFocusMode}
              >
                <Text style={styles.endButtonText}>End Session</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.setupSession}>
              <View style={styles.descriptionContainer}>
                <Text style={styles.description}>
                  Focus Mode helps you stay productive by limiting access to distracting apps 
                  while keeping productivity tools available.
                </Text>
              </View>

              {renderDurationSelector()}

              <View style={styles.benefitsContainer}>
                <Text style={styles.benefitsTitle}>During Focus Mode:</Text>
                <Text style={styles.benefitItem}>✅ Work & productivity apps stay accessible</Text>
                <Text style={styles.benefitItem}>⏰ Social media apps are time-limited</Text>
                <Text style={styles.benefitItem}>🔔 Only important notifications come through</Text>
                <Text style={styles.benefitItem}>🐾 Your pet gains extra happiness points</Text>
              </View>

              <TouchableOpacity
                style={styles.startButton}
                onPress={startFocusMode}
              >
                <Text style={styles.startButtonText}>
                  Start {selectedDuration}min Focus Session
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  activeSession: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 30,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  timerLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  timerDisplay: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  progressRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    top: -10,
  },
  progressBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#E0E0E0',
  },
  progressFill: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#4CAF50',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
  setupSession: {
    flex: 1,
  },
  descriptionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlign: 'center',
  },
  durationContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  durationButton: {
    width: '30%',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedDuration: {
    borderColor: '#4A90E2',
    backgroundColor: '#F0F7FF',
  },
  durationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  selectedDurationText: {
    color: '#4A90E2',
  },
  benefitsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  benefitItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  endButton: {
    backgroundColor: '#FF5722',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  endButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default FocusMode;
