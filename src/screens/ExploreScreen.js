import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ExploreScreen = ({ navigation, onServiceSelect }) => {
  const insets = useSafeAreaInsets();
  
  const services = [
    {
      id: 1,
      title: 'Background Remover',
      icon: 'cut-outline',
      images: [
        'https://images.unsplash.com/photo-1766469284258-11bf4223e2af?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1NXx8fGVufDB8fHx8fA%3D%3D',
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
        'https://images.unsplash.com/photo-1585052201332-b8c0ce30972f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHJlc3N8ZW58MHx8MHx8fDA%3D',
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

  const handleServicePress = (serviceId) => {
    if (onServiceSelect) {
      onServiceSelect(serviceId);
    }
  };

  const ServiceSection = ({ service }) => (
    <View style={styles.serviceSection}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.iconContainer}>
            <Ionicons name={service.icon} size={20} color="#7c3aed" />
          </View>
          <Text style={styles.sectionTitle}>{service.title}</Text>
        </View>
        <TouchableOpacity
          style={styles.serviceButton}
          onPress={() => handleServicePress(service.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.serviceButtonText}>Try Now</Text>
          <Ionicons name="arrow-forward" size={14} color="#7c3aed" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.imageScrollContainer}
      >
        {service.images.map((image, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.imageCard}
            onPress={() => handleServicePress(service.id)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: image }} style={styles.serviceImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Explore</Text>
          <Text style={styles.headerSubtitle}>Discover AI-powered tools</Text>
        </View>
        <TouchableOpacity
          style={styles.proButton}
          onPress={() => navigation?.navigate('SubscriptionPlans')}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['#fef3c7', '#fde68a']}
            style={styles.proButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="diamond" size={16} color="#f59e0b" />
            <Text style={styles.proButtonText}>PRO</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={['#7c3aed', '#a855f7']}
          style={styles.heroSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>AI-Powered Photo Magic</Text>
            <Text style={styles.heroSubtitle}>
              Transform, enhance, and create stunning visuals with professional-grade AI tools
            </Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>7</Text>
                <Text style={styles.statLabel}>AI Tools</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>1M+</Text>
                <Text style={styles.statLabel}>Processed</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>99%</Text>
                <Text style={styles.statLabel}>Accuracy</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.heroButton}
              onPress={() => navigation?.navigate('SubscriptionPlans')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#fff', '#f9fafb']}
                style={styles.heroButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="diamond" size={18} color="#7c3aed" />
                <Text style={styles.heroButtonText}>Upgrade to PRO</Text>
                <Ionicons name="arrow-forward" size={18} color="#7c3aed" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

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
    backgroundColor: '#fafafa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  proButton: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#fbbf24',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  proButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 4,
  },
  proButtonText: {
    color: '#92400e',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    borderRadius: 24,
    padding: 28,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  heroButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  heroButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  heroButtonText: {
    color: '#7c3aed',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  serviceSection: {
    backgroundColor: '#fff',
    marginBottom: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f5f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
  },
  serviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f5f3ff',
    gap: 6,
  },
  serviceButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7c3aed',
  },
  imageScrollContainer: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  imageCard: {
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  serviceImage: {
    width: 160,
    height: 120,
    borderRadius: 16,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default ExploreScreen;
