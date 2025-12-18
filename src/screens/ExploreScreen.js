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
        'data:image/jpeg;base64,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',
        'https://images.unsplash.com/photo-1701615004837-40d8573b6652?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
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
    'https://images.unsplash.com/flagged/photo-1585052201332-b8c0ce30972f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHJlc3N8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZHJlc3N8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1605763240000-7e93b172d754?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGRyZXNzfGVufDB8fDB8fHww'
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
        'https://images.unsplash.com/photo-1728996777224-1ab8b33b0a19?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YWxleCUyMHN0YXJ8ZW58MHx8MHx8fDA%3D',
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
        'https://images.unsplash.com/photo-1765470383207-c4396a7a8b35?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8',
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Top Bar */}
      <View style={[styles.topBar]}>
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
    paddingVertical: 15,
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