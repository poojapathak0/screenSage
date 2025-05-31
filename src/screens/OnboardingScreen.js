import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const OnboardingScreen = ({navigation}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps = [
    {
      title: 'Welcome to ScreenSage! 🧙‍♂️',
      subtitle: 'Your AI-powered companion for digital wellness',
      description: 'Transform your screen time habits with intelligent predictions and a lovable virtual pet that grows with your progress.',
      icon: '🌟',
      color: ['#6366f1', '#8b5cf6'],
    },
    {
      title: 'Meet Your Digital Pet 🐾',
      subtitle: 'A companion that reflects your habits',
      description: 'Your virtual pet thrives when you meet your screen time goals and feels sad when you overuse your devices. Take care of it!',
      icon: '❤️',
      color: ['#ec4899', '#f97316'],
    },
    {
      title: 'AI-Powered Insights 🧠',
      subtitle: 'Smart predictions to keep you on track',
      description: 'Our AI learns your patterns and sends gentle nudges at the perfect moment to prevent screen time binges.',
      icon: '⚡',
      color: ['#10b981', '#059669'],
    },
    {
      title: 'Social Challenges 🏆',
      subtitle: 'Compete and grow with friends',
      description: 'Join challenges, climb leaderboards, and support each other on your digital wellness journey.',
      icon: '🎯',
      color: ['#f59e0b', '#d97706'],
    },
  ];

  const currentStepData = onboardingSteps[currentStep];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate to main app
      navigation.replace('Main');
    }
  };

  const handleSkip = () => {
    navigation.replace('Main');
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={currentStepData.color}
        style={styles.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        
        {/* Skip Button */}
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{currentStepData.icon}</Text>
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{currentStepData.title}</Text>
            <Text style={styles.subtitle}>{currentStepData.subtitle}</Text>
            <Text style={styles.description}>{currentStepData.description}</Text>
          </View>
        </View>

        {/* Progress Indicators */}
        <View style={styles.progressContainer}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentStep && styles.activeDot,
              ]}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={styles.previousButton}
              onPress={handlePrevious}>
              <Icon name="chevron-back" size={24} color="#ffffff" />
            </TouchableOpacity>
          )}
          
          <View style={styles.buttonSpacer} />
          
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <Icon name="chevron-forward" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Features Preview (only on last step) */}
        {currentStep === onboardingSteps.length - 1 && (
          <View style={styles.featuresPreview}>
            <View style={styles.featureItem}>
              <Icon name="analytics-outline" size={20} color="#ffffff" />
              <Text style={styles.featureText}>Smart Analytics</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="heart-outline" size={20} color="#ffffff" />
              <Text style={styles.featureText}>Virtual Pet</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="people-outline" size={20} color="#ffffff" />
              <Text style={styles.featureText}>Social Features</Text>
            </View>
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  skipButton: {
    alignSelf: 'flex-end',
    padding: 12,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    fontSize: 60,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#ffffff',
    width: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previousButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSpacer: {
    flex: 1,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  featuresPreview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
});

export default OnboardingScreen;
