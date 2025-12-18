import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { setClothImage, setModelImage, setClothImages, resetTryOnState, generateTryOnResult } from '../store/slices/aiModelTryOnSlice';

const AIModelTryOnScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { status } = useSelector(state => state.aiModelTryOn);
  
  const [clothImage, setLocalClothImage] = useState(null);
  const [modelImage, setLocalModelImage] = useState(null);
  const [clothImages, setLocalClothImages] = useState([]);

  const pickClothImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const image = {
        uri: result.assets[0].uri,
        name: result.assets[0].fileName || `Cloth_${Date.now()}.jpg`,
      };
      setLocalClothImage(image);
      setLocalClothImages([]);
      dispatch(setClothImage(image));
    }
  };

  const pickModelImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const image = {
        uri: result.assets[0].uri,
        name: result.assets[0].fileName || `Model_${Date.now()}.jpg`,
      };
      setLocalModelImage(image);
      dispatch(setModelImage(image));
    }
  };

  const pickClothFolder = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const images = result.assets.map((asset, index) => ({
        uri: asset.uri,
        name: asset.fileName || `Cloth_${index}.jpg`,
      }));
      setLocalClothImages(images);
      setLocalClothImage(null);
      dispatch(setClothImages(images));
    }
  };

  const handleGenerate = async () => {
    if (!modelImage) {
      Alert.alert('Missing Model', 'Please select a model image.');
      return;
    }

    if (!clothImage && clothImages.length === 0) {
      Alert.alert('Missing Cloth', 'Please select cloth image(s).');
      return;
    }

    try {
      await dispatch(generateTryOnResult({
        clothImage,
        modelImage,
        clothImages,
        mode: clothImages.length > 0 ? 'bulk' : 'single',
      })).unwrap();

      navigation.navigate('AITryOnResult');
    } catch (error) {
      Alert.alert('Error', 'Failed to process. Please try again.');
    }
  };

  const isReady = modelImage && (clothImage || clothImages.length > 0);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>AI Model Try-On</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Virtual Try-On</Text>
          <Text style={styles.heroSubtitle}>
            See how clothes look on AI models. Upload garment and model images.
          </Text>
        </View>

        {/* Cloth Image Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cloth Image</Text>
          {clothImage ? (
            <View style={styles.imagePreview}>
              <Image source={{ uri: clothImage.uri }} style={styles.previewImage} />
              <TouchableOpacity style={styles.changeButton} onPress={pickClothImage}>
                <Ionicons name="refresh" size={18} color="#7c3aed" />
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadCard} onPress={pickClothImage}>
              <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.uploadIcon}>
                <Ionicons name="shirt" size={32} color="#fff" />
              </LinearGradient>
              <Text style={styles.uploadText}>Select Cloth Image</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Model Image Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Model Image <Text style={styles.required}>*</Text>
          </Text>
          {modelImage ? (
            <View style={styles.imagePreview}>
              <Image source={{ uri: modelImage.uri }} style={styles.previewImage} />
              <TouchableOpacity style={styles.changeButton} onPress={pickModelImage}>
                <Ionicons name="refresh" size={18} color="#7c3aed" />
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadCard} onPress={pickModelImage}>
              <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.uploadIcon}>
                <Ionicons name="person" size={32} color="#fff" />
              </LinearGradient>
              <Text style={styles.uploadText}>Select Model Image</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Multiple Cloth Images */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Multiple Cloth Images</Text>
          {clothImages.length > 0 ? (
            <View style={styles.multiplePreview}>
              <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.countBadge}>
                <Ionicons name="images" size={20} color="#fff" />
                <Text style={styles.countText}>{clothImages.length} images</Text>
              </LinearGradient>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                {clothImages.slice(0, 5).map((img, index) => (
                  <Image key={index} source={{ uri: img.uri }} style={styles.thumbImage} />
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.changeButton} onPress={pickClothFolder}>
                <Ionicons name="refresh" size={18} color="#7c3aed" />
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadCard} onPress={pickClothFolder}>
              <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.uploadIcon}>
                <Ionicons name="images" size={32} color="#fff" />
              </LinearGradient>
              <Text style={styles.uploadText}>Select Multiple Images</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.generateButton, !isReady && styles.generateButtonDisabled]}
          onPress={handleGenerate}
          disabled={!isReady || status === 'processing'}
        >
          <LinearGradient
            colors={isReady ? ['#7c3aed', '#a855f7'] : ['#ccc', '#999']}
            style={styles.generateGradient}
          >
            {status === 'processing' ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="sparkles" size={20} color="#fff" />
                <Text style={styles.generateButtonText}>Generate Try-On</Text>
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
  },
  heroSection: {
    padding: 24,
    backgroundColor: '#fff',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  required: {
    color: '#ef4444',
  },
  uploadCard: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#7c3aed',
    borderStyle: 'dashed',
  },
  uploadIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
  },
  imagePreview: {
    gap: 12,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7c3aed',
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7c3aed',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e5e5',
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },
  multiplePreview: {
    gap: 12,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  imageScroll: {
    flexDirection: 'row',
  },
  thumbImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  generateButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  generateGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AIModelTryOnScreen;
