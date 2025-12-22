import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import { setSingleImage, setFolder } from '../store/slices/wrinkleRemoverSlice';

const WRUnifiedScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [mode, setMode] = useState(null); // 'single' | 'folder'
  const [singleImage, setSingleImageState] = useState(null);
  const [folder, setFolderState] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const pickSingleImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const image = {
        uri: result.assets[0].uri,
        name: result.assets[0].fileName || `Image_${Date.now()}.jpg`,
      };
      setSingleImageState(image);
      setMode('single');
      setFolderState(null);
    }
  };

  const pickFolder = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const folderData = {
        name: `Folder_${Date.now()}`,
        fileCount: result.assets.length,
        images: result.assets.map(asset => ({
          uri: asset.uri,
          name: asset.fileName || `Image_${Date.now()}.jpg`,
        })),
      };
      setFolderState(folderData);
      setMode('folder');
      setSingleImageState(null);
    }
  };

  const handleProcess = () => {
    setIsProcessing(true);
    
    if (mode === 'single') {
      dispatch(setSingleImage(singleImage));
    } else {
      dispatch(setFolder(folder));
    }
    
    setTimeout(() => {
      setIsProcessing(false);
      navigation.navigate('WRResult');
    }, 2000);
  };

  const handleReset = () => {
    setMode(null);
    setSingleImageState(null);
    setFolderState(null);
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

              <TouchableOpacity style={styles.optionCard} onPress={pickFolder}>
                <View style={styles.optionIcon}>
                  <Ionicons name="images" size={32} color="#663399" />
                </View>
                <Text style={styles.optionTitle}>Multiple  Images</Text>
                <Text style={styles.optionDesc}>Batch processing</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : mode === 'single' && singleImage ? (
          <View style={styles.previewSection}>
            <View style={styles.previewHeader}>
              <Text style={styles.sectionTitle}>Selected Image</Text>
              <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <Image source={{ uri: singleImage.uri }} style={styles.previewImage} />
            <TouchableOpacity style={styles.changeButton} onPress={pickSingleImage}>
              <Ionicons name="refresh" size={18} color="#663399" />
              <Text style={styles.changeButtonText}>Change Image</Text>
            </TouchableOpacity>
          </View>
        ) : mode === 'folder' && folder ? (
          <View style={styles.previewSection}>
            <View style={styles.previewHeader}>
              <Text style={styles.sectionTitle}>{folder.fileCount} Images Selected</Text>
              <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.gridContainer}>
              {folder.images.slice(0, 6).map((img, index) => (
                <Image key={index} source={{ uri: img.uri }} style={styles.gridImage} />
              ))}
            </View>
            {folder.fileCount > 6 && (
              <Text style={styles.moreText}>+{folder.fileCount - 6} more images</Text>
            )}
            <TouchableOpacity style={styles.changeButton} onPress={pickFolder}>
              <Ionicons name="refresh" size={18} color="#663399" />
              <Text style={styles.changeButtonText}>Change Selection</Text>
            </TouchableOpacity>
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
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  gridImage: {
    width: '31.5%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  moreText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#663399',
    backgroundColor: '#fff',
  },
  changeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#663399',
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
