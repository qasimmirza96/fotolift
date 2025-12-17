import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ProButton from '../components/ProButton';

const ExploreScreen = () => {
  const insets = useSafeAreaInsets();
  const services = [
    {
      id: 1,
      title: 'Background Remover',
      icon: 'cut-outline',
      images: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=150&fit=crop'
      ]
    },
    {
      id: 2,
      title: 'Image Enhancer',
      icon: 'sparkles-outline',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200&h=150&fit=crop'
      ]
    },
    {
      id: 3,
      title: 'Wrinkled to Ironed',
      icon: 'shirt-outline',
      images: [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop'
      ]
    },
    {
      id: 4,
      title: 'Centralized Image',
      icon: 'crop-outline',
      images: [
        'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=150&fit=crop'
      ]
    },
    {
      id: 5,
      title: 'AI Model Try-On',
      icon: 'person-outline',
      images: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=150&fit=crop'
      ]
    },
    {
      id: 6,
      title: 'Try-On Gear',
      icon: 'glasses-outline',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200&h=150&fit=crop'
      ]
    },
    {
      id: 7,
      title: 'Image to Video',
      icon: 'videocam-outline',
      images: [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop'
      ]
    }
  ];

  const ServiceSection = ({ service }) => (
    <View style={styles.serviceSection}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.iconContainer}>
            <Ionicons name={service.icon} size={24} color="#8B5CF6" />
          </View>
          <Text style={styles.sectionTitle}>{service.title}</Text>
        </View>
        <ProButton 
          size="small" 
          onPress={() => console.log(`${service.title} PRO pressed`)}
        />
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.imageScrollContainer}
      >
        {service.images.map((image, index) => (
          <TouchableOpacity key={index} style={styles.imageCard}>
            <Image source={{ uri: image }} style={styles.serviceImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 20 }]}>
        <View style={styles.topBarContent}>
          <Text style={styles.topBarTitle}>Explore</Text>
          <Text style={styles.topBarSubtitle}>Discover AI-powered photo tools</Text>
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search-outline" size={24} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>AI-Powered Photo Magic</Text>
            <Text style={styles.heroSubtitle}>Transform, enhance, and create stunning visuals with professional-grade AI tools</Text>
            <View style={styles.heroStats}>
              <View style={styles.statBadge}>
                <Text style={styles.statNumber}>7</Text>
                <Text style={styles.statLabel}>AI Tools</Text>
              </View>
              <View style={styles.statBadge}>
                <Text style={styles.statNumber}>1M+</Text>
                <Text style={styles.statLabel}>Photos Processed</Text>
              </View>
              <View style={styles.statBadge}>
                <Text style={styles.statNumber}>99%</Text>
                <Text style={styles.statLabel}>Accuracy</Text>
              </View>
            </View>
            <ProButton 
              title="Get PRO Access" 
              onPress={() => console.log('Get PRO Access pressed')}
              style={styles.heroButton}
            />
          </View>
        </View>

        {/* Services Sections */}
        {services.map((service) => (
          <ServiceSection key={service.id} service={service} />
        ))}

        {/* Bottom Spacing */}
        <View style={[styles.bottomSpacing, { height: insets.bottom + 20 }]} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  topBarContent: {
    flex: 1,
  },
  topBarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  topBarSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  heroContent: {
    padding: 25,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 25,
  },
  statBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 15,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  heroButton: {
    paddingHorizontal: 35,
  },
  serviceSection: {
    backgroundColor: '#fff',
    marginBottom: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  imageScrollContainer: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  imageCard: {
    marginRight: 15,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  serviceImage: {
    width: 140,
    height: 100,
    borderRadius: 12,
  },

  bottomSpacing: {
    height: 20,
  },
});

export default ExploreScreen;