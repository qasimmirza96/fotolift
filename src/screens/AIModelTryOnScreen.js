import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { setClothImage, setModelImage, setClothFolder, resetTryOnState, generateTryOnResult } from '../store/slices/aiModelTryOnSlice';
import { pickImage, pickFolder as pickFolderUtil } from '../utils/folderPicker';

// Predefined model images
const MODELS = [
  { id: 1, uri: 'https://via.placeholder.com/300x400/7c3aed/fff?text=Model+1', name: 'Model 1' },
  { id: 2, uri: 'https://via.placeholder.com/300x400/a855f7/fff?text=Model+2', name: 'Model 2' },
  { id: 3, uri: 'https://via.placeholder.com/300x400/9333ea/fff?text=Model+3', name: 'Model 3' },
  { id: 4, uri: 'https://via.placeholder.com/300x400/8b5cf6/fff?text=Model+4', name: 'Model 4' },
];

const AIModelTryOnScreen = ({ navigation }) => {
  console.log('🎬 AIModelTryOn: Component rendered');
  const dispatch = useDispatch();
  const { status } = useSelector(state => state.aiModelTryOn);
  
  const [clothMode, setClothMode] = useState(null); // 'single' | 'folder'
  const [modelMode, setModelMode] = useState(null); // 'slider' | 'upload'
  const [clothImage, setLocalClothImage] = useState(null);
  const [clothFolder, setLocalClothFolder] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [uploadedModel, setUploadedModel] = useState(null);

  const handleSelectSliderModel = (model) => {
    console.log('✅ AI: Slider model selected:', model.name);
    setSelectedModel(model);
    setUploadedModel(null);
    setModelMode('slider');
    dispatch(setModelImage(model));
  };

  const handlePickClothImage = async () => {
    console.log('📸 AI: Cloth image picker opened');
    try {
      const image = await pickImage();
      if (image) {
        console.log('✅ AI: Cloth image selected:', image.name);
        setLocalClothImage(image);
        setLocalClothFolder(null);
        setClothMode('single');
        dispatch(setClothImage(image));
      }
    } catch (error) {
      console.error('❌ AI: Error picking cloth image:', error);
      Alert.alert('Error', error.message || 'Failed to pick image');
    }
  };

  const handlePickClothFolder = async () => {
    console.log('📁 AI: Cloth folder picker opened');
    try {
      const folderData = await pickFolderUtil();
      if (folderData) {
        console.log('✅ AI: Cloth folder selected:', folderData.name);
        console.log('📊 AI: Folder file count:', folderData.fileCount);
        
        setLocalClothFolder(folderData);
        setLocalClothImage(null);
        setClothMode('folder');
        dispatch(setClothFolder(folderData));
      }
    } catch (error) {
      console.error('❌ AI: Error picking folder:', error);
      Alert.alert('Error', error.message || 'Failed to pick folder');
    }
  };

  const handlePickModelImage = async () => {
    console.log('📸 AI: Model image picker opened');
    try {
      const image = await pickImage();
      if (image) {
        console.log('✅ AI: Model image selected:', image.name);
        setUploadedModel(image);
        setSelectedModel(null);
        setModelMode('upload');
        dispatch(setModelImage(image));
      }
    } catch (error) {
      console.error('❌ AI: Error picking model image:', error);
      Alert.alert('Error', error.message || 'Failed to pick image');
    }
  };

  const handleReset = () => {
    console.log('🔄 AI: Reset button pressed');
    setClothMode(null);
    setModelMode(null);
    setLocalClothImage(null);
    setLocalClothFolder(null);
    setSelectedModel(null);
    setUploadedModel(null);
    dispatch(resetTryOnState());
    console.log('✅ AI: Reset complete');
  };

  const handleGenerate = async () => {
    console.log('🚀 AI: Generate button pressed');
    
    if (!selectedModel && !uploadedModel) {
      Alert.alert('Missing Model', 'Please select or upload a model image.');
      return;
    }

    if (!clothImage && !clothFolder) {
      Alert.alert('Missing Cloth', 'Please select cloth image or folder.');
      return;
    }

    console.log('📊 AI: Cloth mode:', clothMode);
    console.log('📊 AI: Model mode:', modelMode);

    try {
      await dispatch(generateTryOnResult({
        clothImage,
        clothFolder,
        modelImage: selectedModel || uploadedModel,
        mode: clothMode,
      })).unwrap();

      console.log('✅ AI: Generation complete, navigating to result');
      navigation.navigate('AITryOnResult');
    } catch (error) {
      console.error('❌ AI: Generation error:', error);
      Alert.alert('Error', 'Failed to process. Please try again.');
    }
  };

  const isReady = (selectedModel || uploadedModel) && (clothImage || clothFolder);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>AI Model Try-On</Text>
        <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
          <Ionicons name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Virtual Try-On</Text>
          <Text style={styles.heroSubtitle}>
            See how clothes look on models. Select model and upload garment.
          </Text>
        </View>

        {/* Model Selection Slider */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Model</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modelSlider}>
            {MODELS.map((model) => (
              <TouchableOpacity
                key={model.id}
                style={[
                  styles.modelCard,
                  selectedModel?.id === model.id && styles.modelCardSelected,
                ]}
                onPress={() => handleSelectSliderModel(model)}
              >
                <Image source={{ uri: model.uri }} style={styles.modelImage} />
                {selectedModel?.id === model.id && (
                  <View style={styles.selectedBadge}>
                    <Ionicons name="checkmark-circle" size={24} color="#7c3aed" />
                  </View>
                )}
                <Text style={styles.modelName}>{model.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* OR Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Upload Model */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Model Image</Text>
          {uploadedModel ? (
            <View style={styles.imagePreview}>
              <Image source={{ uri: uploadedModel.uri }} style={styles.previewImage} />
              <TouchableOpacity onPress={() => {
                setUploadedModel(null);
                setModelMode(null);
              }} style={styles.removeIcon}>
                <Ionicons name="close-circle" size={32} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadCard} onPress={handlePickModelImage}>
              <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.uploadIcon}>
                <Ionicons name="person" size={32} color="#fff" />
              </LinearGradient>
              <Text style={styles.uploadText}>Upload Model</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Cloth Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cloth Selection</Text>
          <View style={styles.clothOptions}>
            <TouchableOpacity style={styles.clothOption} onPress={handlePickClothImage}>
              <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.clothIcon}>
                <Ionicons name="shirt" size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.clothOptionText}>Single Image</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clothOption} onPress={handlePickClothFolder}>
              <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.clothIcon}>
                <Ionicons name="folder" size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.clothOptionText}>Folder</Text>
            </TouchableOpacity>
          </View>

          {clothImage && (
            <View style={styles.selectedCloth}>
              <Image source={{ uri: clothImage.uri }} style={styles.clothPreview} />
              <View style={styles.clothInfo}>
                <Text style={styles.clothLabel}>Single Cloth</Text>
                <Text style={styles.clothName}>{clothImage.name}</Text>
              </View>
              <TouchableOpacity onPress={() => {
                setLocalClothImage(null);
                setClothMode(null);
              }}>
                <Ionicons name="close-circle" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          )}

          {clothFolder && (
            <View style={styles.selectedCloth}>
              <View style={styles.folderIconWrapper}>
                <Ionicons name="folder" size={40} color="#7c3aed" />
              </View>
              <View style={styles.clothInfo}>
                <Text style={styles.clothLabel}>{clothFolder.name}</Text>
                <Text style={styles.clothName}>{clothFolder.fileCount} images</Text>
              </View>
              <TouchableOpacity onPress={() => {
                setLocalClothFolder(null);
                setClothMode(null);
              }}>
                <Ionicons name="close-circle" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
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
  resetButton: {
    padding: 5,
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
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  modelSlider: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  modelCard: {
    width: 120,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modelCardSelected: {
    borderColor: '#7c3aed',
  },
  modelCardDisabled: {
    opacity: 0.4,
  },
  modelImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#f0f0f0',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  modelName: {
    padding: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
  },
  restrictionText: {
    marginTop: 12,
    fontSize: 13,
    color: '#ff6b6b',
    fontStyle: 'italic',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e5e5',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  uploadCard: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
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
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  imagePreview: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  removeIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  clothOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  clothOption: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  clothIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  clothOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  selectedCloth: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#7c3aed',
  },
  clothPreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  folderIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f4ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clothInfo: {
    flex: 1,
    marginLeft: 12,
  },
  clothLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  clothName: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  generateButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  generateButtonDisabled: {
    opacity: 0.6,
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
