import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [aiPredictions, setAiPredictions] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your data will be exported as a CSV file. Continue?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Export', onPress: () => console.log('Exporting data...')},
      ]
    );
  };

  const handleDeleteData = () => {
    Alert.alert(
      'Delete All Data',
      'This action cannot be undone. Are you sure you want to delete all your data?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => console.log('Deleting data...'),
        },
      ]
    );
  };

  const SettingItem = ({
    title,
    subtitle,
    icon,
    onPress,
    showArrow = true,
    children,
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}>
      <View style={styles.settingContent}>
        <Icon name={icon} size={24} color="#6366f1" style={styles.settingIcon} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
        {children}
        {showArrow && onPress && (
          <Icon name="chevron-forward" size={20} color="#9ca3af" />
        )}
      </View>
    </TouchableOpacity>
  );

  const SettingSection = ({title, children}) => (
    <View style={styles.settingSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Profile Section */}
        <SettingSection title="Profile">
          <SettingItem
            title="Edit Profile"
            subtitle="Change your name, avatar, and preferences"
            icon="person-outline"
            onPress={() => console.log('Edit profile')}
          />
          <SettingItem
            title="Account Settings"
            subtitle="Privacy, security, and account management"
            icon="shield-outline"
            onPress={() => console.log('Account settings')}
          />
        </SettingSection>

        {/* Notifications Section */}
        <SettingSection title="Notifications">
          <SettingItem
            title="Push Notifications"
            subtitle="Receive reminders and updates"
            icon="notifications-outline"
            showArrow={false}>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{false: '#e5e7eb', true: '#6366f1'}}
              thumbColor={notifications ? '#ffffff' : '#9ca3af'}
            />
          </SettingItem>
          <SettingItem
            title="Weekly Reports"
            subtitle="Get weekly progress summaries"
            icon="mail-outline"
            showArrow={false}>
            <Switch
              value={weeklyReports}
              onValueChange={setWeeklyReports}
              trackColor={{false: '#e5e7eb', true: '#6366f1'}}
              thumbColor={weeklyReports ? '#ffffff' : '#9ca3af'}
            />
          </SettingItem>
        </SettingSection>

        {/* AI & Predictions Section */}
        <SettingSection title="AI & Predictions">
          <SettingItem
            title="Smart Predictions"
            subtitle="Let AI predict and prevent screen time binges"
            icon="bulb-outline"
            showArrow={false}>
            <Switch
              value={aiPredictions}
              onValueChange={setAiPredictions}
              trackColor={{false: '#e5e7eb', true: '#6366f1'}}
              thumbColor={aiPredictions ? '#ffffff' : '#9ca3af'}
            />
          </SettingItem>
          <SettingItem
            title="AI Training"
            subtitle="Help improve predictions by sharing anonymous data"
            icon="analytics-outline"
            onPress={() => console.log('AI training settings')}
          />
        </SettingSection>

        {/* App Preferences Section */}
        <SettingSection title="App Preferences">
          <SettingItem
            title="Dark Mode"
            subtitle="Switch to dark theme"
            icon="moon-outline"
            showArrow={false}>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{false: '#e5e7eb', true: '#6366f1'}}
              thumbColor={darkMode ? '#ffffff' : '#9ca3af'}
            />
          </SettingItem>
          <SettingItem
            title="Screen Time Goals"
            subtitle="Set and customize your daily limits"
            icon="time-outline"
            onPress={() => console.log('Screen time goals')}
          />
          <SettingItem
            title="App Blocking"
            subtitle="Configure which apps to limit"
            icon="lock-closed-outline"
            onPress={() => console.log('App blocking')}
          />
        </SettingSection>

        {/* Pet Customization Section */}
        <SettingSection title="Pet Customization">
          <SettingItem
            title="Pet Type"
            subtitle="Choose your virtual companion"
            icon="heart-outline"
            onPress={() => console.log('Pet type selection')}
          />
          <SettingItem
            title="Accessories Shop"
            subtitle="Browse and purchase pet accessories"
            icon="storefront-outline"
            onPress={() => console.log('Accessories shop')}
          />
        </SettingSection>

        {/* Social Section */}
        <SettingSection title="Social">
          <SettingItem
            title="Privacy Settings"
            subtitle="Control who can see your progress"
            icon="eye-outline"
            onPress={() => console.log('Privacy settings')}
          />
          <SettingItem
            title="Friend Requests"
            subtitle="Manage incoming friend requests"
            icon="people-outline"
            onPress={() => console.log('Friend requests')}
          />
        </SettingSection>

        {/* Data & Backup Section */}
        <SettingSection title="Data & Backup">
          <SettingItem
            title="Export Data"
            subtitle="Download your screen time data"
            icon="download-outline"
            onPress={handleExportData}
          />
          <SettingItem
            title="Backup to Cloud"
            subtitle="Sync your data across devices"
            icon="cloud-upload-outline"
            onPress={() => console.log('Cloud backup')}
          />
          <SettingItem
            title="Delete All Data"
            subtitle="Permanently remove all your data"
            icon="trash-outline"
            onPress={handleDeleteData}
          />
        </SettingSection>

        {/* Support Section */}
        <SettingSection title="Support">
          <SettingItem
            title="Help Center"
            subtitle="Get help and find answers"
            icon="help-circle-outline"
            onPress={() => console.log('Help center')}
          />
          <SettingItem
            title="Contact Support"
            subtitle="Reach out to our support team"
            icon="mail-outline"
            onPress={() => console.log('Contact support')}
          />
          <SettingItem
            title="Rate App"
            subtitle="Leave a review in the app store"
            icon="star-outline"
            onPress={() => console.log('Rate app')}
          />
        </SettingSection>

        {/* About Section */}
        <SettingSection title="About">
          <SettingItem
            title="Version"
            subtitle="1.0.0"
            icon="information-circle-outline"
            showArrow={false}
          />
          <SettingItem
            title="Privacy Policy"
            subtitle="Read our privacy policy"
            icon="document-text-outline"
            onPress={() => console.log('Privacy policy')}
          />
          <SettingItem
            title="Terms of Service"
            subtitle="Read our terms of service"
            icon="document-outline"
            onPress={() => console.log('Terms of service')}
          />
        </SettingSection>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Icon name="log-out-outline" size={24} color="#ef4444" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for digital wellness
          </Text>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  settingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    marginHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#fecaca',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#9ca3af',
  },
});

export default SettingsScreen;
