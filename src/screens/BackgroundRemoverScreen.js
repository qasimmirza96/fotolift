import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
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
    marginBottom: 40,
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
    borderRadius: 16,
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
