import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { setSingleImage, setFolder } from '../store/slices/wrinkleRemoverSlice';
import { pickImage, pickFolder as pickFolderUtil } from '../utils/folderPicker';

const WRUnifiedScreen = ({ navigation }) => {
  console.log('🎬 WRUnifiedScreen: Component rendered');
  const dispatch = useDispatch();
  const [mode, setMode] = useState(null); // 'single' | 'folder'
  const [singleImage, setSingleImageState] = useState(null);
  const [folder, setFolderState] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
                <Text style={styles.optionTitle}>Folder </Text>
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
              <View>
                <Text style={styles.sectionTitle}>{folder.name}</Text>
                <Text style={styles.folderSubtitle}>{folder.fileCount} images</Text>
              </View>
              <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.folderIconContainer}>
              <Ionicons name="folder" size={80} color="#663399" />
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
  heroSubtitle: {
    fontSize: 14,
    color: '#8b5cf6',
    marginTop: 4,
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
    marginTop: 2,
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
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  processButton: {
    flexDirection: 'row',
    backgroundColor: '#663399',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#663399',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  processButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WRUnifiedScreen;
