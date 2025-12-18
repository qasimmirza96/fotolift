import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { resetCentralizedImage } from '../store/slices/centralizedImageSlice';
import { downloadImage, downloadImagesAsZip } from '../utils/downloadUtils';

const CIResultScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const centralizedImage = useSelector(state => state.centralizedImage);
  const { singleImage, folder, mode } = centralizedImage || {};
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    console.log('📥 Downloading centralized image/folder...');
    setIsDownloading(true);
    
    try {
      if (mode === 'single' && singleImage) {
        await downloadImage(singleImage.uri, `Centralized_${singleImage.name}`);
      } else if (mode === 'folder' && folder) {
        const imageUris = folder.images.map(img => img.uri);
        await downloadImagesAsZip(imageUris, `Centralized_${folder.name}.zip`);
      }
    } catch (error) {
      console.error('❌ Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleHome = () => {
    dispatch(resetCentralizedImage());
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <TouchableOpacity onPress={handleHome} style={styles.backButton}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Centralized</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.successSection}>
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.successIcon}>
            <Ionicons name="checkmark" size={48} color="#fff" />
          </LinearGradient>
          <Text style={styles.successTitle}>Success!</Text>
          <Text style={styles.successText}>
            {mode === 'single' 
              ? 'Your image has been centralized and is ready to download.'
              : `${folder?.fileCount || 0} images have been centralized and are ready to download.`}
          </Text>
        </View>

        {singleImage && (
          <View style={styles.previewSection}>
            <Text style={styles.previewLabel}>Centralized Image</Text>
            <View style={styles.imageWrapper}>
              <Image source={{ uri: singleImage.uri }} style={styles.previewImage} resizeMode="cover" />
            </View>
          </View>
        )}

        {folder && (
          <View style={styles.folderInfo}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.folderIcon}>
              <Ionicons name="images" size={32} color="#fff" />
            </LinearGradient>
            <Text style={styles.folderName}>{folder.fileCount} images centralized</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.downloadButton} 
          onPress={handleDownload}
          disabled={isDownloading}
        >
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.downloadGradient}>
            {isDownloading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="download" size={20} color="#fff" />
            )}
            <Text style={styles.downloadButtonText}>
              {isDownloading ? 'Downloading...' : mode === 'folder' ? 'Download All' : 'Download Image'}
            </Text>
          </LinearGradient>
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
  },
  successSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  successText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
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
  imageWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  previewImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#fff',
  },
  folderInfo: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  folderIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  folderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  footer: {
    padding: 20,
  },
  downloadButton: {
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 12,
  },
  downloadGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#667eea',
  },
  homeButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CIResultScreen;
