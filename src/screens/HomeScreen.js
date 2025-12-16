import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';

const { height } = Dimensions.get('window');

const HomeScreen = () => {
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
          source={{
            uri: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
          }}
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
        <TouchableOpacity style={styles.startButton} onPress={handleStartJourney}>
          <Text style={styles.startButtonText}>Start Journey</Text>
        </TouchableOpacity>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Welcome to FotoLift</Text>
          <Text style={styles.infoText}>
            Discover, capture, and share amazing moments with our photography platform.
          </Text>
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
    height: height * 0.4, // 40% of screen height
  },
  heroBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
    padding: 20,
    justifyContent: 'flex-start',
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#000',
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
  infoSection: {
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default HomeScreen;