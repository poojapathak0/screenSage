import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const SocialScreen = () => {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data
  const leaderboardData = [
    {id: 1, name: 'Alex Chen', score: 1250, streak: 15, avatar: '👨‍💻'},
    {id: 2, name: 'Sarah Johnson', score: 1180, streak: 12, avatar: '👩‍🎨'},
    {id: 3, name: 'Mike Wilson', score: 1120, streak: 10, avatar: '👨‍🚀'},
    {id: 4, name: 'Emma Davis', score: 1080, streak: 8, avatar: '👩‍🔬'},
    {id: 5, name: 'You', score: 950, streak: 7, avatar: '🧙‍♂️'},
  ];

  const friendsData = [
    {id: 1, name: 'Alex Chen', status: 'online', petHealth: 85, avatar: '👨‍💻'},
    {id: 2, name: 'Sarah Johnson', status: 'offline', petHealth: 72, avatar: '👩‍🎨'},
    {id: 3, name: 'Mike Wilson', status: 'online', petHealth: 90, avatar: '👨‍🚀'},
  ];

  const challengesData = [
    {
      id: 1,
      title: 'Weekend Warrior',
      description: 'Stay under 4 hours screen time this weekend',
      participants: 12,
      timeLeft: '2 days',
      reward: '🏆 Golden Pet Collar',
      progress: 65,
    },
    {
      id: 2,
      title: 'Social Media Detox',
      description: 'Limit social media to 30 minutes daily for a week',
      participants: 8,
      timeLeft: '5 days',
      reward: '🎯 Focus Badge',
      progress: 40,
    },
  ];

  const handleInviteFriend = () => {
    Alert.alert(
      'Invite Friends',
      'Share ScreenSage with your friends to start competing together!',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Share', onPress: () => console.log('Share app')},
      ]
    );
  };

  const handleJoinChallenge = (challengeId) => {
    Alert.alert(
      'Join Challenge',
      'Are you ready to take on this challenge?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Join', onPress: () => console.log('Joined challenge', challengeId)},
      ]
    );
  };

  const LeaderboardItem = ({item, rank}) => (
    <View style={[
      styles.leaderboardItem,
      rank <= 3 && styles.topThreeItem,
    ]}>
      <View style={styles.rankContainer}>
        <Text style={[
          styles.rankText,
          rank <= 3 && styles.topThreeRank,
        ]}>
          {rank}
        </Text>
        {rank <= 3 && (
          <Icon
            name={rank === 1 ? 'trophy' : rank === 2 ? 'medal' : 'ribbon'}
            size={16}
            color={rank === 1 ? '#ffd700' : rank === 2 ? '#c0c0c0' : '#cd7f32'}
          />
        )}
      </View>
      
      <Text style={styles.avatar}>{item.avatar}</Text>
      
      <View style={styles.userInfo}>
        <Text style={[
          styles.userName,
          item.name === 'You' && styles.currentUser,
        ]}>
          {item.name}
        </Text>
        <Text style={styles.userStreak}>{item.streak} day streak</Text>
      </View>
      
      <Text style={styles.userScore}>{item.score}</Text>
    </View>
  );

  const FriendItem = ({item}) => (
    <View style={styles.friendItem}>
      <View style={styles.friendAvatar}>
        <Text style={styles.avatar}>{item.avatar}</Text>
        <View style={[
          styles.statusIndicator,
          {backgroundColor: item.status === 'online' ? '#10b981' : '#6b7280'},
        ]} />
      </View>
      
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendStatus}>
          Pet Health: {item.petHealth}%
        </Text>
      </View>
      
      <TouchableOpacity style={styles.challengeButton}>
        <Text style={styles.challengeButtonText}>Challenge</Text>
      </TouchableOpacity>
    </View>
  );

  const ChallengeCard = ({item}) => (
    <View style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <Text style={styles.challengeTitle}>{item.title}</Text>
        <Text style={styles.challengeTimeLeft}>{item.timeLeft}</Text>
      </View>
      
      <Text style={styles.challengeDescription}>{item.description}</Text>
      
      <View style={styles.challengeProgress}>
        <View style={styles.progressBar}>
          <View style={[
            styles.progressFill,
            {width: `${item.progress}%`},
          ]} />
        </View>
        <Text style={styles.progressText}>{item.progress}%</Text>
      </View>
      
      <View style={styles.challengeFooter}>
        <View style={styles.challengeInfo}>
          <Icon name="people-outline" size={16} color="#6b7280" />
          <Text style={styles.participantsText}>
            {item.participants} participants
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => handleJoinChallenge(item.id)}>
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.rewardText}>Reward: {item.reward}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Social Hub</Text>
        <TouchableOpacity
          style={styles.inviteButton}
          onPress={handleInviteFriend}>
          <Icon name="person-add-outline" size={24} color="#6366f1" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigator */}
      <View style={styles.tabContainer}>
        {[
          {key: 'leaderboard', label: 'Leaderboard', icon: 'trophy-outline'},
          {key: 'friends', label: 'Friends', icon: 'people-outline'},
          {key: 'challenges', label: 'Challenges', icon: 'flag-outline'},
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab.key)}>
            <Icon
              name={tab.icon}
              size={20}
              color={activeTab === tab.key ? '#ffffff' : '#6b7280'}
            />
            <Text style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText,
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <View style={styles.content}>
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              style={styles.heroCard}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}>
              <Text style={styles.heroTitle}>Weekly Competition</Text>
              <Text style={styles.heroSubtitle}>
                Compete with friends to reduce screen time
              </Text>
              <Text style={styles.heroStats}>🏆 Your Rank: #5</Text>
            </LinearGradient>

            <View style={styles.leaderboardContainer}>
              {leaderboardData.map((item, index) => (
                <LeaderboardItem
                  key={item.id}
                  item={item}
                  rank={index + 1}
                />
              ))}
            </View>
          </View>
        )}

        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <View style={styles.content}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Icon name="search-outline" size={20} color="#6b7280" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search friends..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <View style={styles.friendsContainer}>
              {friendsData.map((item) => (
                <FriendItem key={item.id} item={item} />
              ))}
            </View>

            <TouchableOpacity
              style={styles.addFriendButton}
              onPress={handleInviteFriend}>
              <Icon name="person-add" size={24} color="#ffffff" />
              <Text style={styles.addFriendText}>Invite More Friends</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Active Challenges</Text>
            
            {challengesData.map((item) => (
              <ChallengeCard key={item.id} item={item} />
            ))}

            <TouchableOpacity style={styles.createChallengeButton}>
              <Icon name="add-circle-outline" size={24} color="#6366f1" />
              <Text style={styles.createChallengeText}>
                Create Custom Challenge
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
  inviteButton: {
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#6366f1',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#ffffff',
  },
  content: {
    paddingHorizontal: 20,
  },
  heroCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 16,
  },
  heroStats: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  leaderboardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  topThreeItem: {
    backgroundColor: '#fef3c7',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 40,
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginRight: 4,
  },
  topThreeRank: {
    color: '#92400e',
  },
  avatar: {
    fontSize: 24,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  currentUser: {
    color: '#6366f1',
  },
  userStreak: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  userScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  friendsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  friendAvatar: {
    position: 'relative',
    marginRight: 12,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  friendStatus: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  challengeButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  challengeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  addFriendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addFriendText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  challengeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  challengeTimeLeft: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
  },
  challengeDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  challengeProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantsText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  joinButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  rewardText: {
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: '600',
    textAlign: 'center',
  },
  createChallengeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#6366f1',
    borderStyle: 'dashed',
  },
  createChallengeText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default SocialScreen;
