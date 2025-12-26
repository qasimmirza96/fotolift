import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const coreServices = [
  { id: 1, title: 'Background Remover', icon: 'cut-outline', description: 'Remove backgrounds instantly with AI precision', color: '#7c3aed' },
  { id: 2, title: 'Image Enhancer', icon: 'sparkles-outline', description: 'Enhance image quality and clarity', color: '#a855f7' },
  { id: 3, title: 'Wrinkled to Ironed', icon: 'shirt-outline', description: 'Remove wrinkles from clothes automatically', color: '#ec4899' },
  { id: 4, title: 'Centralized Image', icon: 'crop-outline', description: 'Center and align your images perfectly', color: '#f59e0b' },
  { id: 5, title: 'AI Model Try-On', icon: 'person-outline', description: 'Try on clothes with virtual models', color: '#10b981' },
  { id: 6, title: 'Try-On Gear', icon: 'glasses-outline', description: 'Try on glasses and accessories', color: '#3b82f6' },
  { id: 7, title: 'Image to Video', icon: 'videocam-outline', description: 'Transform images into stunning videos', color: '#ef4444' },
];

const ServicesScreen = ({ navigation, onServiceSelect }) => {
  const insets = useSafeAreaInsets();

  const handleServicePress = (serviceId) => {
    if (onServiceSelect) {
      onServiceSelect(serviceId);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Services</Text>
          <Text style={styles.headerSubtitle}>AI-powered tools for your images</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={['#7c3aed', '#a855f7', '#ec4899']}
          style={styles.heroSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroContent}>
            <Ionicons name="sparkles" size={48} color="#fff" style={styles.heroIcon} />
            <Text style={styles.heroTitle}>Transform Your Images</Text>
            <Text style={styles.heroSubtitle}>
              Professional AI tools at your fingertips
            </Text>
          </View>
        </LinearGradient>

        {/* Services Grid */}
        <View style={styles.servicesGrid}>
          {coreServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceCard}
              onPress={() => handleServicePress(service.id)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[service.color, `${service.color}dd`]}
                style={styles.serviceIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name={service.icon} size={32} color="#fff" />
              </LinearGradient>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <LinearGradient
            colors={['#fef3c7', '#fde68a']}
            style={styles.ctaCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.ctaContent}>
              <Ionicons name="diamond" size={32} color="#f59e0b" />
              <Text style={styles.ctaTitle}>Unlock Premium Features</Text>
              <Text style={styles.ctaText}>
                Get access to advanced AI tools and priority processing
              </Text>
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => navigation?.navigate('SubscriptionPlans')}
                activeOpacity={0.8}
              >
                <Text style={styles.ctaButtonText}>Upgrade to PRO</Text>
                <Ionicons name="arrow-forward" size={18} color="#92400e" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

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
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  heroSection: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    borderRadius: 24,
    padding: 32,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroIcon: {
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  servicesGrid: {
    paddingHorizontal: 20,
    gap: 12,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  serviceIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  ctaSection: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  ctaCard: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#92400e',
    marginTop: 12,
    marginBottom: 8,
  },
  ctaText: {
    fontSize: 14,
    color: '#92400e',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
    opacity: 0.9,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400e',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default ServicesScreen;

