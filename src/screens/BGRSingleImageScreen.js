import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { setMainImage, setBackgroundImage, setError } from '../store/slices/bgrSlice';

const BGRSingleImageScreen = ({ onProcess, onBack }) => {
  const dispatch = useDispatch();
  const { mainImage, backgroundImage, error } = useSelector(state => state.bgr);
  const [mainImageError, setMainImageError] = useState('');

  const handleMainImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant storage permission to upload images. You can change this in Settings.',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const image = {
        uri: result.assets[0].uri,
        name: result.assets[0].fileName || 'main-image.jpg',
        type: result.assets[0].type || 'image/jpeg',
      };
      dispatch(setMainImage(image));
      setMainImageError('');
      console.log('📸 Main image selected:', image.name);
    }
  };

  const handleBackgroundImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant storage permission to upload images. You can change this in Settings.',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const image = {
        uri: result.assets[0].uri,
        name: result.assets[0].fileName || 'background-image.jpg',
        type: result.assets[0].type || 'image/jpeg',
      };
      dispatch(setBackgroundImage(image));
      console.log('🖼️ Background image selected:', image.name);
    }
  };

  const handleRemoveMainImage = () => {
    dispatch(setMainImage(null));
  };

  const handleRemoveBackgroundImage = () => {
    dispatch(setBackgroundImage(null));
  };

  const handleProcess = () => {
    if (!mainImage) {
      setMainImageError('Main image is required');
      return;
    }

    console.log('🚀 Processing single image...');
    console.log('Main Image:', mainImage);
    console.log('Background Image:', backgroundImage || 'None');
    
    // TODO: API call placeholder
    // const result = await bgrAPI.processSingleImage({ mainImage, backgroundImage });
    
    onProcess();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#663399" />
        </TouchableOpacity>
        <Text style={styles.title}>Single Image</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Image Upload */}
        <View style={styles.uploadSection}>
          <Text style={styles.label}>
            Main Image <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.helperText}>Upload the image whose background will be removed</Text>
          
          {mainImage ? (
            <View style={styles.imagePreview}>
              <Image source={{ uri: mainImage.uri }} style={styles.previewImage} />
              <TouchableOpacity style={styles.removeButton} onPress={handleRemoveMainImage}>
                <Ionicons name="close-circle" size={24} color="#FF3B30" />
              </TouchableOpacity>
              <Text style={styles.imageName}>{mainImage.name}</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadBox} onPress={handleMainImageUpload}>
              <Ionicons name="cloud-upload-outline" size={48} color="#663399" />
              <Text style={styles.uploadText}>Tap to upload image</Text>
            </TouchableOpacity>
          )}
          
          {mainImageError && <Text style={styles.errorText}>{mainImageError}</Text>}
        </View>

        {/* Background Image Upload (Optional) */}
        <View style={styles.uploadSection}>
          <Text style={styles.label}>
            Background Image <Text style={styles.optional}>(Optional)</Text>
          </Text>
          <Text style={styles.helperText}>Upload an image to use as background</Text>
          
          {backgroundImage ? (
            <View style={styles.imagePreview}>
              <Image source={{ uri: backgroundImage.uri }} style={styles.previewImage} />
              <TouchableOpacity style={styles.removeButton} onPress={handleRemoveBackgroundImage}>
                <Ionicons name="close-circle" size={24} color="#FF3B30" />
              </TouchableOpacity>
              <Text style={styles.imageName}>{backgroundImage.name}</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadBox} onPress={handleBackgroundImageUpload}>
              <Ionicons name="cloud-upload-outline" size={48} color="#9966cc" />
              <Text style={styles.uploadText}>Tap to upload background</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onBack}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.processButton, !mainImage && styles.processButtonDisabled]}
          onPress={handleProcess}
          disabled={!mainImage}
        >
          <Text style={styles.processButtonText}>Process</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6fa',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  uploadSection: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 5,
  },
  required: {
    color: '#FF3B30',
  },
  optional: {
    color: '#9966cc',
    fontWeight: 'normal',
  },
  helperText: {
    fontSize: 13,
    color: '#000',
    marginBottom: 15,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#e6e6fa',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#f9f7fc',
  },
  uploadText: {
    marginTop: 10,
    fontSize: 14,
    color: '#000',
  },
  imagePreview: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e6e6fa',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  imageName: {
    padding: 10,
    fontSize: 13,
    color: '#000',
    backgroundColor: '#f9f7fc',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 13,
    marginTop: 5,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e6e6fa',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#663399',
  },
  cancelButtonText: {
    color: '#663399',
    fontSize: 16,
    fontWeight: 'bold',
  },
  processButton: {
    flex: 1,
    backgroundColor: '#663399',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  processButtonDisabled: {
    backgroundColor: '#e6e6fa',
  },
  processButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BGRSingleImageScreen;