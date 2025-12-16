import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

// Core services data - minimalist
const coreServices = [
  { id: 1, title: 'Background Remover', icon: 'cut-outline' },
  { id: 2, title: 'Image Enhancer', icon: 'sparkles-outline' },
  { id: 3, title: 'Wrinkled to Ironed', icon: 'shirt-outline' },
  { id: 4, title: 'Centralized Image', icon: 'crop-outline' },
  { id: 5, title: 'AI Model Try-On', icon: 'person-outline' },
  { id: 6, title: 'Try-On Gear', icon: 'glasses-outline' },
  { id: 7, title: 'Image to Video', icon: 'videocam-outline' },
];

// Multiple background sources (images and GIFs)
const backgroundSources = [
  { uri: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
  { uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
  { uri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
  { uri: 'https://media.giphy.com/media/26BRrSvJUa0crqw4E/giphy.gif' },
  { uri: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif' },
];

const HomeScreen = () => {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => 
        (prevIndex + 1) % backgroundSources.length
      );
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const handleStartJourney = () => {
    console.log('🚀 Start Journey pressed');
    // Navigate to journey or next screen
  };

  return (
    <View style={styles.container}>
      {/* Hero Section - 40% of screen height */}
      <View style={styles.heroSection}>
        <ImageBackground
          style={styles.heroBackground}
          source={backgroundSources[currentBgIndex]}
          resizeMode="cover"
        >
          {/* Overlay content */}
          <View style={styles.overlay}>
            <Text style={styles.heroTitle}>FotoLift</Text>
            <Text style={styles.heroSubtitle}>Elevate Your Photography</Text>
          </View>
        </ImageBackground>
      </View>
      
      {/* Content Section */}
      <View style={styles.contentSection}>
          <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Welcome to FotoLift</Text>
          <Text style={styles.infoText}>
            Discover, capture, and share amazing moments with our photography platform.
          </Text>
        </View>
        <TouchableOpacity style={styles.startButton} onPress={handleStartJourney}>
          <Text style={styles.startButtonText}>Start Journey</Text>
        </TouchableOpacity>
        
        {/* Core Services Section */}
        <View style={styles.servicesSection}>
          {/* <Text style={styles.servicesTitle}>Core AI Features</Text> */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesScroll}
          >
            {coreServices.map((service) => (
              <TouchableOpacity key={service.id} style={styles.serviceCard}>
                <View style={styles.serviceIconContainer}>
                  <Ionicons name={service.icon} size={24} color="#663399" />
                </View>
                <Text style={styles.serviceTitle}>{service.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
      
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroSection: {
    height: height * 0.45, // 45% of screen height
    marginTop: -25, // Extend to top
  },
  heroBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 25, // Account for status bar
  },
  overlay: {
    // backgroundColor: 'rgba(102, 51, 153, 0.8)',
    //black overlay
    marginTop: 90,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
  },
  contentSection: {
    flex: 1,
    padding: 10,
    justifyContent: 'flex-start',
  },
  startButton: {
    backgroundColor: '#663399',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 35,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#663399',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  servicesSection: {
    marginBottom: 30,
  },
  servicesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#663399',
    marginBottom: 15,
    textAlign: 'center',
  },
  servicesScroll: {
    paddingHorizontal: 20,
  },
  serviceCard: {
    alignItems: 'center',
    marginHorizontal: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    minWidth: 100,
    borderWidth: 1,
    borderColor: '#e6e6fa',
    shadowColor: '#663399',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceIconContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#663399',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#663399',
    textAlign: 'center',
    lineHeight: 16,
  },
  infoSection: {
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#663399',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#9966cc',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default HomeScreen;