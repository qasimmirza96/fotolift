import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import { setFolder } from '../store/slices/wrinkleRemoverSlice';

const WRFolderScreen = ({ navigation }) => {
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
      navigation.navigate('WRResult');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Select Multiple Images</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {selectedFolder ? (
          <View style={styles.folderContainer}>
            <View style={styles.folderHeader}>
              <Ionicons name="images" size={32} color="#663399" />
              <Text style={styles.folderCount}>{selectedFolder.fileCount} images selected</Text>
            </View>
            
            <ScrollView style={styles.imageGrid} showsVerticalScrollIndicator={false}>
              <View style={styles.gridContainer}>
                {selectedFolder.images.slice(0, 6).map((img, index) => (
                  <Image key={index} source={{ uri: img.uri }} style={styles.gridImage} />
                ))}
              </View>
              {selectedFolder.fileCount > 6 && (
                <Text style={styles.moreText}>+{selectedFolder.fileCount - 6} more</Text>
              )}
            </ScrollView>

            <TouchableOpacity style={styles.changeButton} onPress={pickFolder}>
              <Ionicons name="refresh" size={20} color="#663399" />
              <Text style={styles.changeButtonText}>Change Selection</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.uploadArea} onPress={pickFolder}>
            <View style={styles.uploadIcon}>
              <Ionicons name="images-outline" size={48} color="#663399" />
            </View>
            <Text style={styles.uploadText}>Select Multiple Images</Text>
            <Text style={styles.uploadHint}>Tap to choose from gallery</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.processButton, !selectedFolder && styles.processButtonDisabled]}
          onPress={handleProcess}
          disabled={!selectedFolder || isProcessing}
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
    padding: 20,
    justifyContent: 'center',
  },
  uploadArea: {
    height: 280,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderStyle: 'dashed',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  uploadIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0e6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
    backgroundColor: '#f0e6ff',
    borderRadius: 12,
  },
  folderCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#663399',
  },
  imageGrid: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridImage: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  moreText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginTop: 12,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#663399',
  },
  changeButtonText: {
    fontSize: 16,
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
  },
  processButtonDisabled: {
    backgroundColor: '#ccc',
  },
  processButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WRFolderScreen;
