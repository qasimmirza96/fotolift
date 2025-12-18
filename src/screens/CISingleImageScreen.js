import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import { setSingleImage } from '../store/slices/centralizedImageSlice';

const CISingleImageScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const image = {
        uri: result.assets[0].uri,
        name: result.assets[0].fileName || `Image_${Date.now()}.jpg`,
        size: result.assets[0].fileSize,
      };
      setSelectedImage(image);
      console.log('Image:', image.name);
    }
  };

  const handleProcess = () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first.');
      return;
    }

    setIsProcessing(true);
    dispatch(setSingleImage(selectedImage));
    
    setTimeout(() => {
      setIsProcessing(false);
      navigation.navigate('CIResult');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Select Image</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <View style={styles.content}>
        {selectedImage ? (
          <View style={styles.imageContainer}>
            <View style={styles.imageWrapper}>
              <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
              <View style={styles.imageOverlay}>
                <Ionicons name="checkmark-circle" size={48} color="#fff" />
              </View>
            </View>
            <TouchableOpacity style={styles.changeButton} onPress={pickImage}>
              <Ionicons name="refresh" size={20} color="#667eea" />
              <Text style={styles.changeButtonText}>Change Image</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.uploadIcon}>
              <Ionicons name="cloud-upload" size={48} color="#fff" />
            </LinearGradient>
            <Text style={styles.uploadText}>Tap to Select Image</Text>
            <Text style={styles.uploadHint}>Choose from your gallery</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.processButton, !selectedImage && styles.processButtonDisabled]}
          onPress={handleProcess}
          disabled={!selectedImage || isProcessing}
        >
          <LinearGradient
            colors={selectedImage ? ['#667eea', '#764ba2'] : ['#ccc', '#999']}
            style={styles.processGradient}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="crop" size={20} color="#fff" />
                <Text style={styles.processButtonText}>Centralize Image</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  uploadArea: {
    height: 300,
    borderWidth: 2,
    borderColor: '#667eea',
    borderStyle: 'dashed',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  uploadIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  uploadHint: {
    fontSize: 14,
    color: '#999',
  },
  imageContainer: {
    gap: 20,
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  selectedImage: {
    width: '100%',
    height: 400,
    backgroundColor: '#f5f5f5',
  },
  imageOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(102, 126, 234, 0.9)',
    borderRadius: 24,
    padding: 8,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#667eea',
  },
  changeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
  },
  footer: {
    padding: 20,
  },
  processButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  processButtonDisabled: {
    opacity: 0.5,
  },
  processGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  processButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CISingleImageScreen;
