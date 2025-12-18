import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { resetWrinkleRemover } from '../store/slices/wrinkleRemoverSlice';
import { downloadImage, downloadImagesAsZip } from '../utils/downloadUtils';

const WRResultScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const wrinkleRemover = useSelector(state => state.wrinkleRemover);
  const { singleImage, folder, mode } = wrinkleRemover || {};
  const [isDownloading, setIsDownloading] = useState(false);

  console.log('WR Result - Mode:', mode);
  console.log('WR Result - Single Image:', singleImage);
  console.log('WR Result - Folder:', folder);

  const handleDownload = async () => {
    console.log('📥 Downloading wrinkle-free image/folder...');
    setIsDownloading(true);
    
    try {
      if (mode === 'single' && singleImage) {
        await downloadImage(singleImage.uri, `WrinkleFree_${singleImage.name}`);
      } else if (mode === 'folder' && folder) {
        const imageUris = folder.images.map(img => img.uri);
        await downloadImagesAsZip(imageUris, `WrinkleFree_${folder.name}.zip`);
      }
    } catch (error) {
      console.error('❌ Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleHome = () => {
    console.log('Resetting wrinkle remover state');
    dispatch(resetWrinkleRemover());
    navigation.navigate('Home');
  };

  const handleDownloadComplete = async () => {
    await handleDownload();
    console.log('Download complete, resetting state');
    dispatch(resetWrinkleRemover());
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleHome} style={styles.backButton}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Wrinkles Removed</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={64} color="#198754" />
        </View>

        <Text style={styles.successTitle}>Success!</Text>
        <Text style={styles.successText}>
          {mode === 'single' 
            ? 'Your image has been processed and is ready to download.'
            : `${folder?.fileCount || 0} images have been processed and are ready to download.`}
        </Text>

        {singleImage && (
          <View style={styles.previewSection}>
            <Text style={styles.previewLabel}>Processed Image</Text>
            <Image source={{ uri: singleImage.uri }} style={styles.previewImage} resizeMode="cover" />
          </View>
        )}

        {folder && (
          <View style={styles.folderInfo}>
            <Ionicons name="images" size={40} color="#663399" />
            <Text style={styles.folderName}>{folder.fileCount} images processed</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.downloadButton} 
          onPress={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="download-outline" size={20} color="#fff" />
          )}
          <Text style={styles.downloadButtonText}>
            {isDownloading ? 'Downloading...' : mode === 'folder' ? 'Download All' : 'Download Image'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeButton} onPress={handleHome}>
          <Text style={styles.homeButtonText}>Back to Home</Text>
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
  },
  successIcon: {
    alignItems: 'center',
    marginVertical: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  successText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  previewSection: {
    marginBottom: 20,
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  folderInfo: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  folderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginTop: 12,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  downloadButton: {
    flexDirection: 'row',
    backgroundColor: '#663399',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 8,
  },
  downloadButtonDisabled: {
    backgroundColor: '#9966cc',
    opacity: 0.7,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#663399',
  },
  homeButtonText: {
    color: '#663399',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WRResultScreen;
