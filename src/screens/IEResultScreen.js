import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { downloadImage, downloadImagesAsZip } from '../utils/downloadUtils';
import { resetImageEnhancerState } from '../store/slices/imageEnhancerSlice';
import ResultFooter from '../components/ResultFooter';

const IEResultScreen = ({ onDownload, onHome, onRepeat }) => {
  const dispatch = useDispatch();
  const { singleImage, folder, mode } = useSelector(state => state.imageEnhancer);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    console.log('📥 Downloading enhanced image/folder...');
    setIsDownloading(true);
    
    try {
      if (mode === 'single' && singleImage) {
        await downloadImage(singleImage.uri, `Enhanced_${singleImage.name}`);
      } else if (mode === 'folder' && folder) {
        const imageUris = folder.files.map(file => file.uri);
        await downloadImagesAsZip(imageUris, `Enhanced_${folder.name}.zip`);
      }
      console.log('✅ Download completed successfully');
    } catch (error) {
      console.error('❌ Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRepeat = () => {
    console.log('🔁 Repeat process');
    dispatch(resetImageEnhancerState());
    onRepeat && onRepeat();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleRepeat} style={styles.backButton}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Enhancement Complete</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={80} color="#198754" />
        </View>

        <Text style={styles.successTitle}>Success! Operation completed.</Text>
        <Text style={styles.successText}>
          {mode === 'single' 
            ? 'Your image has been enhanced and is ready to download.'
            : `${folder?.fileCount || 0} images have been enhanced and are ready to download.`}
        </Text>

        {mode === 'single' && singleImage && (
          <View style={styles.previewSection}>
            <Text style={styles.previewLabel}>Enhanced Image Preview</Text>
            <Image source={{ uri: singleImage.uri }} style={styles.previewImage} />
          </View>
        )}

        {mode === 'folder' && folder && (
          <View style={styles.folderInfo}>
            <Ionicons name="folder" size={48} color="#663399" />
            <Text style={styles.folderName}>{folder.name}</Text>
            <Text style={styles.fileCount}>{folder.fileCount} images enhanced</Text>
          </View>
        )}
      </ScrollView>

      <ResultFooter 
        isDownloading={isDownloading}
        onDownload={handleDownload}
        onRepeat={handleRepeat}
        downloadText="Download Image"
        mode={mode}
      />
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
  },
  successIcon: {
    alignItems: 'center',
    marginVertical: 30,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  successText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  previewSection: {
    marginBottom: 20,
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  previewImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  folderInfo: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  folderName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 15,
  },
  fileCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

export default IEResultScreen;