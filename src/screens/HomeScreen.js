import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, AppState, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { LOCAL_IMAGES } from '../constants';

const { height } = Dimensions.get('window');

const videoSources = [
  'https://pub-e8b5e18b4f264d6ba4fe500f8e6f0f6c.r2.dev/homeScreenVideos/318654_tiny.mp4',
  'https://pub-e8b5e18b4f264d6ba4fe500f8e6f0f6c.r2.dev/homeScreenVideos/42967-434316750_small.mp4',
  'https://pub-e8b5e18b4f264d6ba4fe500f8e6f0f6c.r2.dev/homeScreenVideos/214669_medium.mp4',
];

const HomeScreen = ({ navigation, onServiceSelect }) => {
  const { user } = useSelector(state => state.auth);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  const localPlayer = useVideoPlayer(videoSources[0], (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        localPlayer?.play();
      } else {
        localPlayer?.pause();
      }
    });
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videoSources.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const userName = user?.name?.split(' ')[0] || 'Guest';
  const userProfileImage = user?.profileImage || LOCAL_IMAGES.qasim;

  const quickActions = [
    { id: 1, title: 'Background Remover', icon: 'cut-outline', color: '#7c3aed' },
    { id: 2, title: 'Image Enhancer', icon: 'sparkles-outline', color: '#a855f7' },
    { id: 3, title: 'Try-On Gear', icon: 'glasses-outline', color: '#ec4899' },
    { id: 4, title: 'Image to Video', icon: 'videocam-outline', color: '#f59e0b' },
  ];

  const stats = [
    { label: 'Projects', value: '47', icon: 'folder-outline' },
    { label: 'Photos', value: '156', icon: 'images-outline' },
    { label: 'Credits', value: '1.2K', icon: 'diamond-outline' },
  ];

  const handleQuickAction = useCallback((serviceId) => {
    onServiceSelect?.(serviceId);
  }, [onServiceSelect]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Bar with Profile */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{userName} 👋</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation?.navigate('User')}
          activeOpacity={0.7}
        >
          <Image 
            source={typeof userProfileImage === 'string' ? { uri: userProfileImage } : userProfileImage} 
            style={styles.profileImage} 
          />
          <View style={styles.profileBadge}>
            <Ionicons name="checkmark" size={10} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Video Section */}
        <View style={styles.heroSection}>
          <View style={styles.videoWrapper}>
            <VideoView player={localPlayer} style={styles.video} contentFit="cover" />
            <LinearGradient 
              colors={['transparent', 'rgba(0,0,0,0.8)']} 
              style={styles.videoGradient} 
            />
          </View>
          
          <View style={styles.brandingOverlay}>
            <Text style={styles.heroTitle}>FotoLift</Text>
            <Text style={styles.heroSubtitle}>Elevate Your Photography</Text>
            <Text style={styles.heroDescription}>
              Transform your images with AI-powered professional tools
            </Text>
          </View>
        </View>
        
        {/* Stats Section */}
        <View style={styles.statsSection}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name={stat.icon} size={20} color="#7c3aed" />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <TouchableOpacity 
              onPress={() => navigation?.navigate('Services')}
              activeOpacity={0.7}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                onPress={() => handleQuickAction(action.id)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[action.color, `${action.color}dd`]}
                  style={styles.quickActionIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name={action.icon} size={24} color="#fff" />
                </LinearGradient>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <LinearGradient
            colors={['#7c3aed', '#a855f7', '#ec4899']}
            style={styles.ctaCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.ctaContent}>
              <Ionicons name="sparkles" size={32} color="#fff" />
              <Text style={styles.ctaTitle}>Unlock Premium Features</Text>
              <Text style={styles.ctaText}>
                Get access to advanced AI tools, priority processing, and exclusive features
              </Text>
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => navigation?.navigate('SubscriptionPlans')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#fff', '#f9fafb']}
                  style={styles.ctaButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Ionicons name="diamond" size={18} color="#7c3aed" />
                  <Text style={styles.ctaButtonText}>Upgrade to PRO</Text>
                  <Ionicons name="arrow-forward" size={18} color="#7c3aed" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Explore Section */}
        <View style={styles.exploreSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Discover</Text>
            <TouchableOpacity 
              onPress={() => navigation?.navigate('Explore')}
              activeOpacity={0.7}
            >
              <Text style={styles.seeAllText}>Explore</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.exploreCard}
            onPress={() => navigation?.navigate('Explore')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#f5f3ff', '#ede9fe']}
              style={styles.exploreCardGradient}
            >
              <Ionicons name="compass" size={32} color="#7c3aed" />
              <Text style={styles.exploreCardTitle}>Explore AI Tools</Text>
              <Text style={styles.exploreCardText}>
                Discover all our powerful AI-powered image transformation tools
              </Text>
              <View style={styles.exploreCardArrow}>
                <Ionicons name="arrow-forward" size={20} color="#7c3aed" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  topBarLeft: {
    flex: 1,
  },
  greetingContainer: {
    flexDirection: 'column',
  },
  greeting: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.3,
  },
  profileButton: {
    position: 'relative',
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  profileBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#7c3aed',
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  heroSection: {
    height: height * 0.4,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 24,
  },
  videoWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  brandingOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  heroDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '400',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f5f3ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  seeAllText: {
    fontSize: 14,
    color: '#7c3aed',
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: (Dimensions.get('window').width - 52) / 2,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  ctaSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  ctaCard: {
    borderRadius: 24,
    padding: 28,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginTop: 12,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  ctaText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
    fontWeight: '400',
  },
  ctaButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7c3aed',
  },
  exploreSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  exploreCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  exploreCardGradient: {
    padding: 24,
    position: 'relative',
  },
  exploreCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 12,
    marginBottom: 8,
  },
  exploreCardText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  exploreCardArrow: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default HomeScreen;
