import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

const FEATURES = [
  { icon: 'flash', title: 'Instant', desc: 'AI-powered removal in seconds' },
  { icon: 'color-wand', title: 'Precise', desc: 'Perfect edge detection' },
  { icon: 'shield-checkmark', title: 'Quality', desc: 'High-resolution output' },
];

const USE_CASES = [
  { icon: 'cart', title: 'E-commerce', color: '#7c3aed' },
  { icon: 'person', title: 'Portraits', color: '#ec4899' },
  { icon: 'briefcase', title: 'Business', color: '#f59e0b' },
  { icon: 'camera', title: 'Photography', color: '#10b981' },
];

const BackgroundRemoverScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const pickImage = async (source) => {
    let result;
    if (source === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
    }

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setProcessedImage(null);
    }
  };

  const processImage = async () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setProcessedImage(selectedImage);
      setIsProcessing(false);
    }, 2000);
  };

  const resetScreen = () => {
    setSelectedImage(null);
    setProcessedImage(null);
    setIsProcessing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Background Remover</Text>
        <TouchableOpacity onPress={resetScreen} style={styles.resetButton}>
          <Ionicons name="refresh" size={24} color="#7c3aed" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {!selectedImage ? (
        <View style={styles.emptyState}>
          <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.iconCircle}>
            <Ionicons name="cut" size={48} color="#fff" />
          </LinearGradient>
          <Text style={styles.emptyTitle}>Remove Background</Text>
          <Text style={styles.emptyText}>Upload an image to remove its background instantly with AI</Text>
          
          <View style={styles.uploadButtons}>
            <TouchableOpacity onPress={() => pickImage('gallery')} style={styles.uploadButton}>
              <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.uploadButtonGradient}>
                <Ionicons name="images" size={24} color="#fff" />
                <Text style={styles.uploadButtonText}>Choose Photo</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => pickImage('camera')} style={styles.uploadButton}>
              <View style={styles.uploadButtonOutline}>
                <Ionicons name="camera" size={24} color="#7c3aed" />
                <Text style={styles.uploadButtonTextOutline}>Take Photo</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Features Section */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Why Choose Us?</Text>
            <View style={styles.featuresGrid}>
              {FEATURES.map((feature, index) => (
                <View key={index} style={styles.featureCard}>
                  <View style={styles.featureIcon}>
                    <Ionicons name={feature.icon} size={24} color="#7c3aed" />
                  </View>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDesc}>{feature.desc}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Use Cases */}
          <View style={styles.useCasesSection}>
            <Text style={styles.sectionTitle}>Perfect For</Text>
            <View style={styles.useCasesGrid}>
              {USE_CASES.map((useCase, index) => (
                <View key={index} style={styles.useCaseCard}>
                  <LinearGradient 
                    colors={[useCase.color, `${useCase.color}dd`]} 
                    style={styles.useCaseIcon}
                  >
                    <Ionicons name={useCase.icon} size={20} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.useCaseTitle}>{useCase.title}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.imageContainer}>
          {/* Image Preview */}
          <View style={styles.imagePreview}>
            <Image source={{ uri: processedImage || selectedImage }} style={styles.image} />
            {isProcessing && (
              <View style={styles.processingOverlay}>
                <ActivityIndicator size="large" color="#7c3aed" />
                <Text style={styles.processingText}>Removing background...</Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {!processedImage && !isProcessing && (
              <TouchableOpacity onPress={processImage} style={styles.processButton}>
                <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.processButtonGradient}>
                  <Ionicons name="cut" size={20} color="#fff" />
                  <Text style={styles.processButtonText}>Remove Background</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            {processedImage && (
              <View style={styles.resultActions}>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Ionicons name="download" size={20} color="#7c3aed" />
                  <Text style={styles.secondaryButtonText}>Download</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.secondaryButton}>
                  <Ionicons name="share-social" size={20} color="#7c3aed" />
                  <Text style={styles.secondaryButtonText}>Share</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={resetScreen} style={styles.secondaryButton}>
                  <Ionicons name="add" size={20} color="#7c3aed" />
                  <Text style={styles.secondaryButtonText}>New</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  scrollView: {
    flex: 1,
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  resetButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  uploadButtons: {
    width: '100%',
    gap: 16,
  },
  uploadButton: {
    width: '100%',
  },
  uploadButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    gap: 12,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  uploadButtonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    gap: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#7c3aed',
  },
  uploadButtonTextOutline: {
    color: '#7c3aed',
    fontSize: 16,
    fontWeight: '700',
  },
  featuresSection: {
    marginTop: 48,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f3ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  useCasesSection: {
    marginTop: 32,
    marginBottom: 40,
    width: '100%',
  },
  useCasesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  useCaseCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  useCaseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  useCaseTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  imageContainer: {
    flex: 1,
    padding: 20,
  },
  imagePreview: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#7c3aed',
  },
  actionButtons: {
    marginTop: 20,
  },
  processButton: {
    width: '100%',
  },
  processButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  processButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#7c3aed',
    gap: 6,
  },
  secondaryButtonText: {
    color: '#7c3aed',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default BackgroundRemoverScreen;
