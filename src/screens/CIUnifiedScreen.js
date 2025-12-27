import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { setSingleImage, setFolder } from '../store/slices/centralizedImageSlice';
import { pickImage, pickFolder as pickFolderUtil } from '../utils/folderPicker';
import AutoSlider from '../components/AutoSlider';

const CIUnifiedScreen = ({ navigation }) => {
  console.log('🎬 CIUnifiedScreen: Component rendered');
  const dispatch = useDispatch();
  const [mode, setMode] = useState(null);
  const [singleImage, setSingleImageState] = useState(null);
  const [folder, setFolderState] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const showcaseImages = [
    { id: '1', uri: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400' },
    { id: '2', uri: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400' },
    { id: '3', uri: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400' },
    { id: '4', uri: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400' },
    { id: '5', uri: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400' },
    { id: '6', uri: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400' },
    { id: '7', uri: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400' },
    { id: '8', uri: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400' },
    { id: '9', uri: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400' },
    { id: '10', uri: 'https://images.unsplash.com/photo-1441986380878-c4248f5b8b5b?w=400' },
  ];

  const pickSingleImage = async () => {
    console.log('📸 CI: Single image picker opened');
    try {
      const image = await pickImage();
      if (image) {
        console.log('✅ CI: Single image selected:', image.name);
        setSingleImageState(image);
        setMode('single');
        setFolderState(null);
        console.log('📊 CI: Mode set to single');
      } else {
        console.log('❌ CI: No image selected');
      }
    } catch (error) {
      console.error('❌ CI: Error picking image:', error);
      Alert.alert('Error', error.message || 'Failed to pick image');
    }
  };

  const handlePickFolder = async () => {
    console.log('📁 CI: Folder picker opened');
    try {
      const folderData = await pickFolderUtil();
      if (folderData) {
        console.log('✅ CI: Folder selected:', folderData.name);
        console.log('📊 CI: Folder file count:', folderData.fileCount);
        setFolderState(folderData);
        setMode('folder');
        setSingleImageState(null);
        console.log('📊 CI: Mode set to folder');
      } else {
        console.log('❌ CI: No folder selected');
      }
    } catch (error) {
      console.error('❌ CI: Error picking folder:', error);
      Alert.alert('Error', error.message || 'Failed to pick folder');
    }
  };

  const handleProcess = () => {
    console.log('🚀 CI: Process button pressed');
    console.log('📊 CI: Current mode:', mode);
    setIsProcessing(true);
    
    if (mode === 'single') {
      console.log('📤 CI: Dispatching single image to Redux');
      dispatch(setSingleImage(singleImage));
    } else {
      console.log('📤 CI: Dispatching folder to Redux');
      dispatch(setFolder(folder));
    }
    
    setTimeout(() => {
      setIsProcessing(false);
      console.log('✅ CI: Processing complete, navigating to CIResult');
      navigation.navigate('CIResult');
    }, 2000);
  };

  const handleReset = () => {
    console.log('🔄 CI: Reset button pressed');
    console.log('🧹 CI: Clearing mode, image, and folder');
    setMode(null);
    setSingleImageState(null);
    setFolderState(null);
    console.log('✅ CI: Reset complete');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>AI Background Remover</Text>
          <Text style={styles.subtitle}>Remove backgrounds instantly</Text>
        </View>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIconContainer}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.heroIconGradient}>
              <Ionicons name="cut" size={40} color="#fff" />
            </LinearGradient>
          </View>
          <Text style={styles.heroTitle}>Perfect Backgrounds</Text>
          <Text style={styles.heroSubtitle}>Remove or replace backgrounds with AI precision</Text>
        </View>

        {/* Showcase Section */}
        <View style={styles.showcaseSection}>
          <View style={styles.showcaseTitleRow}>
            <View>
              <Text style={styles.showcaseTitle}>Latest Work</Text>
              <Text style={styles.showcaseSubtitle}>See what others created</Text>
            </View>
            <View style={styles.showcaseBadge}>
              <Ionicons name="sparkles" size={14} color="#667eea" />
              <Text style={styles.showcaseBadgeText}>AI Powered</Text>
            </View>
          </View>
          <AutoSlider images={showcaseImages} />
        </View>

        {!mode ? (
          <View style={styles.selectionSection}>
            <Text style={styles.sectionTitle}>Choose Your Method</Text>
            <Text style={styles.sectionDescription}>Select how you want to process your images</Text>
            <View style={styles.optionsRow}>
              <TouchableOpacity style={styles.optionCard} onPress={pickSingleImage} activeOpacity={0.8}>
                <LinearGradient colors={['#f0f4ff', '#fff']} style={styles.optionGradient}>
                  <View style={styles.optionIconContainer}>
                    <Ionicons name="image" size={28} color="#667eea" />
                  </View>
                  <Text style={styles.optionTitle}>Single Image</Text>
                  <Text style={styles.optionDesc}>Process one image at a time</Text>
                  <View style={styles.optionArrow}>
                    <Ionicons name="arrow-forward" size={16} color="#667eea" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionCard} onPress={handlePickFolder} activeOpacity={0.8}>
                <LinearGradient colors={['#f0f4ff', '#fff']} style={styles.optionGradient}>
                  <View style={styles.optionIconContainer}>
                    <Ionicons name="folder" size={28} color="#764ba2" />
                  </View>
                  <Text style={styles.optionTitle}>Folder</Text>
                  <Text style={styles.optionDesc}>Batch process multiple images</Text>
                  <View style={styles.optionArrow}>
                    <Ionicons name="arrow-forward" size={16} color="#764ba2" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        ) : mode === 'single' && singleImage ? (
          <View style={styles.previewSection}>
            <View style={styles.previewHeader}>
              <View>
                <Text style={styles.sectionTitle}>Selected Image</Text>
                <Text style={styles.previewSubtitle}>Ready to process</Text>
              </View>
              <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
                <Ionicons name="refresh" size={20} color="#667eea" />
              </TouchableOpacity>
            </View>
            <View style={styles.imageWrapper}>
              <Image source={{ uri: singleImage.uri }} style={styles.previewImage} resizeMode="cover" />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.3)']} style={styles.imageOverlay} />
              <TouchableOpacity onPress={handleReset} style={styles.removeIcon}>
                <Ionicons name="close-circle" size={28} color="#fff" />
              </TouchableOpacity>
              <View style={styles.imageBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.imageBadgeText}>Ready</Text>
              </View>
            </View>
          </View>
        ) : mode === 'folder' && folder ? (
          <View style={styles.previewSection}>
            <View style={styles.previewHeader}>
              <View>
                <Text style={styles.sectionTitle}>{folder.name}</Text>
                <Text style={styles.folderSubtitle}>{folder.fileCount} images selected</Text>
              </View>
              <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
                <Ionicons name="refresh" size={20} color="#667eea" />
              </TouchableOpacity>
            </View>
            <LinearGradient colors={['#f0f4ff', '#fff']} style={styles.folderCard}>
              <View style={styles.folderIconWrapper}>
                <Ionicons name="folder-open" size={64} color="#667eea" />
              </View>
              <View style={styles.folderBadge}>
                <Ionicons name="images" size={16} color="#667eea" />
                <Text style={styles.folderBadgeText}>{folder.fileCount} Files</Text>
              </View>
            </LinearGradient>
          </View>
        ) : null}
      </ScrollView>

      {mode && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.processButton}
            onPress={handleProcess}
            disabled={isProcessing}
            activeOpacity={0.8}
          >
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.processGradient}>
              {isProcessing ? (
                <>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.processButtonText}>Processing...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="cut" size={20} color="#fff" />
                  <Text style={styles.processButtonText}>Remove Background</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
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
    paddingVertical: 20,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
    fontWeight: '500',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  heroIconContainer: {
    marginBottom: 20,
  },
  heroIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  showcaseSection: {
    paddingVertical: 24,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  showcaseTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  showcaseTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  showcaseSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
    fontWeight: '500',
  },
  showcaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#f0f4ff',
  },
  showcaseBadgeText: {
    fontSize: 11,
    color: '#667eea',
    fontWeight: '600',
  },
  selectionSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  sectionDescription: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 20,
    fontWeight: '500',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  optionGradient: {
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
  },
  optionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  optionDesc: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
    fontWeight: '500',
  },
  optionArrow: {
    marginTop: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f4ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewSubtitle: {
    fontSize: 12,
    color: '#10b981',
    marginTop: 2,
    fontWeight: '600',
  },
  resetButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f4ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
    fontWeight: '500',
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  previewImage: {
    width: '100%',
    height: 320,
    backgroundColor: '#f5f5f5',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  removeIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  imageBadgeText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  folderCard: {
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  folderIconWrapper: {
    marginBottom: 16,
  },
  folderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  folderBadgeText: {
    fontSize: 13,
    color: '#667eea',
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 10,
  },
  processButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  processGradient: {
    flexDirection: 'row',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  processButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default CIUnifiedScreen;
