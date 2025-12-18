import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import { setFolder } from '../store/slices/centralizedImageSlice';

const CIFolderScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const pickFolder = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const folder = {
        name: `Folder_${Date.now()}`,
        fileCount: result.assets.length,
        images: result.assets.map(asset => ({
          uri: asset.uri,
          name: asset.fileName || `Image_${Date.now()}.jpg`,
        })),
      };
      setSelectedFolder(folder);
      console.log('Folder:', folder.name, 'Files:', folder.fileCount);
    }
  };

  const handleProcess = () => {
    if (!selectedFolder) {
      Alert.alert('No Images', 'Please select images first.');
      return;
    }

    setIsProcessing(true);
    dispatch(setFolder(selectedFolder));
    
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
        <Text style={styles.title}>Select Multiple Images</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <View style={styles.content}>
        {selectedFolder ? (
          <View style={styles.folderContainer}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.folderHeader}>
              <Ionicons name="images" size={32} color="#fff" />
              <Text style={styles.folderCount}>{selectedFolder.fileCount} images selected</Text>
            </LinearGradient>
            
            <ScrollView style={styles.imageGrid} showsVerticalScrollIndicator={false}>
              <View style={styles.gridContainer}>
                {selectedFolder.images.slice(0, 9).map((img, index) => (
                  <View key={index} style={styles.gridImageWrapper}>
                    <Image source={{ uri: img.uri }} style={styles.gridImage} />
                  </View>
                ))}
              </View>
              {selectedFolder.fileCount > 9 && (
                <Text style={styles.moreText}>+{selectedFolder.fileCount - 9} more images</Text>
              )}
            </ScrollView>

            <TouchableOpacity style={styles.changeButton} onPress={pickFolder}>
              <Ionicons name="refresh" size={20} color="#667eea" />
              <Text style={styles.changeButtonText}>Change Selection</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.uploadArea} onPress={pickFolder}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.uploadIcon}>
              <Ionicons name="images" size={48} color="#fff" />
            </LinearGradient>
            <Text style={styles.uploadText}>Tap to Select Images</Text>
            <Text style={styles.uploadHint}>Choose multiple images from gallery</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.processButton, !selectedFolder && styles.processButtonDisabled]}
          onPress={handleProcess}
          disabled={!selectedFolder || isProcessing}
        >
          <LinearGradient
            colors={selectedFolder ? ['#667eea', '#764ba2'] : ['#ccc', '#999']}
            style={styles.processGradient}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="crop" size={20} color="#fff" />
                <Text style={styles.processButtonText}>Centralize All</Text>
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
  folderContainer: {
    flex: 1,
    gap: 15,
  },
  folderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
  folderCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  imageGrid: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridImageWrapper: {
    width: '31.5%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  moreText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    fontWeight: '500',
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

export default CIFolderScreen;
