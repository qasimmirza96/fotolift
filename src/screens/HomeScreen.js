import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, AppState } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

const coreServices = [
  { id: 1, title: 'Background Remover', icon: 'cut-outline' },
  { id: 2, title: 'Image Enhancer', icon: 'sparkles-outline' },
  { id: 3, title: 'Wrinkled to Ironed', icon: 'shirt-outline' },
  { id: 4, title: 'Centralized Image', icon: 'crop-outline' },
  { id: 5, title: 'AI Model Try-On', icon: 'person-outline' },
  { id: 6, title: 'Try-On Gear', icon: 'glasses-outline' },
  { id: 7, title: 'Image to Video', icon: 'videocam-outline' },
];

const videoSources = [
  'https://pub-e8b5e18b4f264d6ba4fe500f8e6f0f6c.r2.dev/homeScreenVideos/318654_tiny.mp4',
  'https://pub-e8b5e18b4f264d6ba4fe500f8e6f0f6c.r2.dev/homeScreenVideos/42967-434316750_small.mp4',
  'https://pub-e8b5e18b4f264d6ba4fe500f8e6f0f6c.r2.dev/homeScreenVideos/214669_medium.mp4',
];

const HomeScreen = ({ navigation, onServiceSelect }) => {
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

  const handleServicePress = useCallback((serviceId) => {
    onServiceSelect?.(serviceId);
  }, [onServiceSelect]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.videoWrapper}>
            <VideoView player={localPlayer} style={styles.video} contentFit="cover" />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.videoGradient} />
          </View>
          
          <View style={styles.brandingOverlay}>
            <Text style={styles.heroTitle}>FotoLift</Text>
            <Text style={styles.heroSubtitle}>Elevate Your Photography</Text>
          </View>
        </View>
        
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Transform Your Images</Text>
          <Text style={styles.welcomeText}>Professional AI-powered tools at your fingertips</Text>
        </View>
        
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.servicesScroll}>
            {coreServices.map((service) => (
              <TouchableOpacity 
                key={service.id} 
                style={styles.serviceCard}
                onPress={() => handleServicePress(service.id)}
              >
                <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.serviceIconContainer}>
                  <Ionicons name={service.icon} size={28} color="#fff" />
                </LinearGradient>
                <Text style={styles.serviceTitle}>{service.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.ctaSection}>
          <View style={styles.ctaButtonsRow}>
            <TouchableOpacity 
              onPress={() => navigation?.navigate('Home')}
              style={styles.ctaButtonWrapper}
            >
              <LinearGradient 
                colors={['#7c3aed', '#a855f7']} 
                style={styles.startButton} 
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.startButtonText}>Get Started</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => navigation?.navigate('SubscriptionPlans')}
              style={styles.ctaButtonWrapper}
            >
              <LinearGradient 
                colors={['#fef3c7', '#fde68a']} 
                style={styles.proButton} 
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="diamond" size={18} color="#f59e0b" />
                <Text style={styles.proButtonText}>Get PRO</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    height: height * 0.35,
    position: 'relative',
    overflow: 'hidden',
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
    height: '50%',
  },
  brandingOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 24,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 8,
    fontWeight: '400',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  indicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
     display:'none',
  },
  activeIndicator: {
    backgroundColor: '#000',
    width: 24,
    display:'none',
  },
  welcomeSection: {
    padding: 24,
    backgroundColor: '#fff',
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  servicesSection: {
    paddingVertical: 24,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  servicesScroll: {
    paddingHorizontal: 24,
    gap: 16,
  },
  serviceCard: {
    alignItems: 'center',
    width: 100,
  },
  serviceIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  serviceTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: 16,
  },
  ctaSection: {
    padding: 24,
    backgroundColor: '#fff',
    paddingBottom: 40,
  },
  ctaButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  ctaButtonWrapper: {
    flex: 1,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    gap: 6,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  proButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#fbbf24',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  proButtonText: {
    color: '#92400e',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default HomeScreen;
