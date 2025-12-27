import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { setSingleImage, setFolder } from '../store/slices/wrinkleRemoverSlice';
import { pickImage, pickFolder as pickFolderUtil } from '../utils/folderPicker';
import AutoSlider from '../components/AutoSlider';

const WRUnifiedScreen = ({ navigation }) => {
  console.log('🎬 WRUnifiedScreen: Component rendered');
  const dispatch = useDispatch();
  const [mode, setMode] = useState(null);
  const [singleImage, setSingleImageState] = useState(null);
  const [folder, setFolderState] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const showcaseImages = [
    { id: '1', uri: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400' },
    { id: '2', uri: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400' },
    { id: '3', uri: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400' },
    { id: '4', uri: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=400' },
    { id: '5', uri: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400' },
    { id: '6', uri: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400' },
    { id: '7', uri: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=400' },
    { id: '8', uri: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400' },
    { id: '9', uri: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400' },
    { id: '10', uri: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400' },
  ];

  const pickSingleImage = async () => {
    console.log('📸 WR: Single image picker opened');
    try {
      const image = await pickImage();
      if (image) {
        console.log('✅ WR: Single image selected:', image.name);
        setSingleImageState(image);
        setMode('single');
        setFolderState(null);
        console.log('📊 WR: Mode set to single');
      } else {
        console.log('❌ WR: No image selected');
      }
    } catch (error) {
      console.error('❌ WR: Error picking image:', error);
      Alert.alert('Error', error.message || 'Failed to pick image');
    }
  };

  const handlePickFolder = async () => {
    console.log('📁 WR: Folder picker opened');
    try {
      const folderData = await pickFolderUtil();
      if (folderData) {
        console.log('✅ WR: Folder selected:', folderData.name);
        console.log('📊 WR: Folder file count:', folderData.fileCount);
        setFolderState(folderData);
        setMode('folder');
        setSingleImageState(null);
        console.log('📊 WR: Mode set to folder');
      } else {
        console.log('❌ WR: No folder selected');
      }
    } catch (error) {
      console.error('❌ WR: Error picking folder:', error);
      Alert.alert('Error', error.message || 'Failed to pick folder');
    }
  };

  const handleProcess = () => {
    console.log('🚀 WR: Process button pressed');
    console.log('📊 WR: Current mode:', mode);
    setIsProcessing(true);
    
    if (mode === 'single') {
      console.log('📤 WR: Dispatching single image to Redux');
      dispatch(setSingleImage(singleImage));
    } else {
      console.log('📤 WR: Dispatching folder to Redux');
      dispatch(setFolder(folder));
    }
    
    setTimeout(() => {
      setIsProcessing(false);
      console.log('✅ WR: Processing complete, navigating to WRResult');
      navigation.navigate('WRResult');
    }, 2000);
  };

  const handleReset = () => {
    console.log('🔄 WR: Reset button pressed');
    console.log('🧹 WR: Clearing mode, image, and folder');
    setMode(null);
    setSingleImageState(null);
    setFolderState(null);
    console.log('✅ WR: Reset complete');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Wrinkle Remover</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <LinearGradient colors={['#f0e6ff', '#faf5ff']} style={styles.heroGradient}>
            <Ionicons name="sparkles" size={48} color="#663399" />
            <Text style={styles.heroTitle}>Remove Wrinkles</Text>
            <Text style={styles.heroSubtitle}>Make clothes look neat and professional</Text>
          </LinearGradient>
        </View>

        <View style={styles.showcaseSection}>
          <Text style={styles.showcaseTitle}>Our Previous Work</Text>
          <AutoSlider images={showcaseImages} />
        </View>

        {!mode ? (
          <View style={styles.selectionSection}>
            <Text style={styles.sectionTitle}>Choose Upload Type</Text>
            <View style={styles.optionsRow}>
              <TouchableOpacity style={styles.optionCard} onPress={pickSingleImage}>
                <View style={styles.optionIcon}>
                  <Ionicons name="image" size={32} color="#663399" />
                </View>
                <Text style={styles.optionTitle}>Single Image</Text>
                <Text style={styles.optionDesc}>Process one image</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionCard} onPress={handlePickFolder}>
                <View style={styles.optionIcon}>
                  <Ionicons name="folder" size={32} color="#663399" />
                </View>
                <Text style={styles.optionTitle}>Folder</Text>
                <Text style={styles.optionDesc}>Select entire folder</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : mode === 'single' && singleImage ? (
          <View style={styles.previewSection}>
            <Text style={styles.sectionTitle}>Selected Image</Text>
            <View style={styles.imageWrapper}>
              <Image source={{ uri: singleImage.uri }} style={styles.previewImage} />
              <TouchableOpacity onPress={handleReset} style={styles.removeIcon}>
                <Ionicons name="close-circle" size={32} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        ) : mode === 'folder' && folder ? (
          <View style={styles.previewSection}>
            <View style={styles.previewHeader}>
              <View style={styles.folderContainer}>
                <Text style={styles.sectionTitle}>Selected Folder</Text>
                <Text style={styles.folderSubtitle}>{folder.fileCount} images</Text>
              </View>
              <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.folderIconContainer}>
              <Ionicons name="folder" size={80} color="#663399" />
              <Text style={styles.optionTitle}>{folder.name}</Text>
              <Text style={styles.optionDesc}>{folder.fileCount} images</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>

      {mode && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.processButton}
            onPress={handleProcess}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="sparkles" size={20} color="#fff" />
                <Text style={styles.processButtonText}>Remove Wrinkles</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
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
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    padding: 20,
  },
  heroGradient: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#663399',
    marginTop: 12,
  },
  folderContainer:{
    // borderWidth:1,
    // borderColor:'#e5e5e5',
    // padding:8,
    // borderRadius:8,
},
  heroSubtitle: {
    fontSize: 14,
    color: '#8b5cf6',
    marginTop: 4,
  },
  showcaseSection: {
    paddingVertical: 20,
  },
  showcaseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  selectionSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionCard: {
    flex: 1,
    backgroundColor: '#fafafa',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  optionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0e6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  previewSection: {
    padding: 20,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resetButton: {
    padding: 4,
  },
  folderSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 0,
  },
  imageWrapper: {
    position: 'relative',
  },
  removeIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  folderIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: '#fafafa',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  previewImage: {
    width: '100%',
    height: 400,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  processButton: {
    backgroundColor: '#663399',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  processButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default WRUnifiedScreen;
