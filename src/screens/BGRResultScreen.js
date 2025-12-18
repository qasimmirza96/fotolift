import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { downloadImage, downloadImagesAsZip } from '../utils/downloadUtils';

const BGRResultScreen = ({ onDownload, onHome }) => {
  const { mainImage, backgroundImage, folder, mode } = useSelector(state => state.bgr);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    console.log('📥 Downloading processed image/folder...');
    setIsDownloading(true);
    
    try {
      if (mode === 'single' && mainImage) {
        // Download single processed image
        await downloadImage(mainImage.uri, `BGR_${mainImage.name}`);
      } else if (mode === 'folder' && folder) {
        // Download folder as ZIP
        const mockImageUris = Array(folder.fileCount).fill(mainImage?.uri || 'https://via.placeholder.com/500');
        await downloadImagesAsZip(mockImageUris, `BGR_${folder.name}.zip`);
      }
      onDownload && onDownload();
    } catch (error) {
      console.error('❌ Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onHome} style={styles.backButton}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Processing Complete</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={80} color="#663399" />
        </View>

        <Text style={styles.successTitle}>Background Removed Successfully!</Text>
        <Text style={styles.successText}>
          {mode === 'single' 
            ? 'Your image has been processed and is ready to download.'
            : `${folder?.fileCount || 0} images have been processed and are ready to download.`}
        </Text>

        {mode === 'single' && mainImage && (
          <View style={styles.previewSection}>
            <Text style={styles.previewLabel}>Preview</Text>
            <Image source={{ uri: mainImage.uri }} style={styles.previewImage} />
          </View>
        )}

        {mode === 'folder' && folder && (
          <View style={styles.folderInfo}>
            <Ionicons name="folder" size={48} color="#663399" />
            <Text style={styles.folderName}>{folder.name}</Text>
            <Text style={styles.fileCount}>{folder.fileCount} images processed</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.downloadButton, isDownloading && styles.downloadButtonDisabled]} 
          onPress={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="download-outline" size={20} color="#fff" />
          )}
          <Text style={styles.downloadButtonText}>
            {isDownloading ? 'Downloading...' : mode === 'folder' ? 'Download ZIP' : 'Download Image'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeButton} onPress={onHome}>
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
    borderBottomColor: '#e6e6fa',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
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
    color: '#000',
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
  },
  folderInfo: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f9f7fc',
    borderRadius: 12,
  },
  folderName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 15,
  },
  fileCount: {
    fontSize: 14,
    color: '#000',
    marginTop: 5,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e6e6fa',
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
  },
});

export default BGRResultScreen;