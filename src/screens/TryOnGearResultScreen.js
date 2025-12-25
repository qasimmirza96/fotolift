import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { downloadImage, downloadImagesAsZip } from '../utils/downloadUtils';
import { resetTryOnGearState } from '../store/slices/tryOnGearSlice';

const TryOnGearResultScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { 
    selectedModel, 
    accessories, 
    folderImages, 
    multiFolderImages, 
    mode,
    resultData 
  } = useSelector((state) => state.tryOnGear);
  
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    console.log('📥 [TryOnGearResult] Download Started');
    console.log('📊 [TryOnGearResult] Mode:', mode);
    setIsDownloading(true);
    
    try {
      if (mode === 'interactive') {
        console.log('🖼️ [TryOnGearResult] Downloading single image');
        // Download single result image
        if (resultData?.resultUrl) {
          console.log('✅ [TryOnGearResult] Result URL found:', resultData.resultUrl);
          await downloadImage(resultData.resultUrl, `TryOnGear_${Date.now()}.jpg`);
          console.log('✅ [TryOnGearResult] Single image downloaded');
        } else {
          console.warn('⚠️ [TryOnGearResult] No result URL available');
          Alert.alert('Info', 'Result image will be available after processing');
        }
      } else if (mode === 'folder') {
        console.log('📁 [TryOnGearResult] Downloading folder as ZIP');
        // Download folder as ZIP
        if (folderImages.length > 0) {
          console.log('📊 [TryOnGearResult] Folder images count:', folderImages.length);
          const imageUris = folderImages.map(file => file.uri || file.path);
          console.log('📋 [TryOnGearResult] Image URIs prepared:', imageUris.length);
          await downloadImagesAsZip(imageUris, `TryOnGear_Folder_${Date.now()}.zip`, false);
          console.log('✅ [TryOnGearResult] Folder ZIP downloaded');
        } else {
          console.warn('⚠️ [TryOnGearResult] No folder images to download');
          Alert.alert('Info', 'No images to download');
        }
      } else if (mode === 'multi-folder') {
        console.log('📁 [TryOnGearResult] Downloading multi-folder as ZIP');
        // Download all folders as ZIP with nested structure
        if (multiFolderImages.length > 0) {
          console.log('📊 [TryOnGearResult] Multi-folder count:', multiFolderImages.length);
          console.log('📊 [TryOnGearResult] Total images:', multiFolderImages.reduce((sum, folder) => sum + folder.length, 0));
          
          // Preserve folder structure: each folder becomes a subfolder in ZIP
          const nestedStructure = multiFolderImages.map((folder, index) => {
            console.log(`📂 [TryOnGearResult] Folder ${index + 1}: ${folder.length} images`);
            return folder.map(file => ({
              uri: file.uri || file.path,
              name: file.name || `image_${index + 1}.jpg`
            }));
          });
          
          console.log('📋 [TryOnGearResult] Nested structure prepared');
          // Flatten for download but pass isNestedFolders flag
          const allImages = multiFolderImages.map((folder, folderIndex) => 
            folder.map((file, fileIndex) => ({
              ...file,
              folderIndex,
              fileIndex
            }))
          );
          
          await downloadImagesAsZip(allImages, `TryOnGear_MultiFolder_${Date.now()}.zip`, true);
          console.log('✅ [TryOnGearResult] Multi-folder ZIP downloaded');
        } else {
          console.warn('⚠️ [TryOnGearResult] No multi-folders to download');
          Alert.alert('Info', 'No folders to download');
        }
      }
    } catch (error) {
      console.error('❌ [TryOnGearResult] Download error:', error);
      Alert.alert('Error', 'Failed to download. Please try again.');
    } finally {
      setIsDownloading(false);
      console.log('🏁 [TryOnGearResult] Download process completed');
    }
  };

  const handleRepeat = () => {
    dispatch(resetTryOnGearState());
    navigation.navigate('TryOnGear');
  };

  const handleHome = () => {
    dispatch(resetTryOnGearState());
    navigation.navigate('Home');
  };

  const getResultTitle = () => {
    if (mode === 'interactive') return 'Try-On Complete!';
    if (mode === 'folder') return 'Folder Processed!';
    if (mode === 'multi-folder') return 'Multi-Folder Processed!';
    return 'Processing Complete!';
  };

  const getResultDescription = () => {
    if (mode === 'interactive') {
      return 'Your accessories have been successfully tried on the model.';
    } else if (mode === 'folder') {
      return `${folderImages.length} image${folderImages.length > 1 ? 's' : ''} from your folder have been processed.`;
    } else if (mode === 'multi-folder') {
      return `${multiFolderImages.length} folder${multiFolderImages.length > 1 ? 's' : ''} have been processed successfully.`;
    }
    return 'Your images are ready to download.';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleHome} style={styles.backButton}>
          <Ionicons name="close" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Result</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <LinearGradient
            colors={['#7c3aed', '#a855f7']}
            style={styles.successIconGradient}
          >
            <Ionicons name="checkmark" size={48} color="#fff" />
          </LinearGradient>
        </View>

        {/* Success Message */}
        <Text style={styles.successTitle}>{getResultTitle()}</Text>
        <Text style={styles.successText}>{getResultDescription()}</Text>

        {/* Result Preview */}
        {mode === 'interactive' && selectedModel && (
          <View style={styles.previewSection}>
            <Text style={styles.previewLabel}>Model with Accessories</Text>
            <View style={styles.previewContainer}>
              <Image 
                source={{ uri: selectedModel.uri }} 
                style={styles.previewImage}
                defaultSource={require('../../assets/icon.png')}
              />
              {resultData?.resultUrl ? (
                <View style={styles.resultBadge}>
                  <Ionicons name="sparkles" size={16} color="#7c3aed" />
                  <Text style={styles.resultBadgeText}>Processed</Text>
                </View>
              ) : (
                <View style={styles.placeholderBadge}>
                  <Text style={styles.placeholderBadgeText}>Preview</Text>
                </View>
              )}
            </View>
            
            {/* Accessories List */}
            <View style={styles.accessoriesList}>
              <Text style={styles.accessoriesListTitle}>Accessories Used:</Text>
              {Object.entries(accessories).map(([type, image]) => {
                if (!image) return null;
                return (
                  <View key={type} style={styles.accessoryItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#34C759" />
                    <Text style={styles.accessoryItemText}>
                      {ACCESSORY_LABELS[type] || type}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Folder Info */}
        {mode === 'folder' && folderImages.length > 0 && (
          <View style={styles.folderInfoSection}>
            <View style={styles.folderIconContainer}>
              <Ionicons name="folder" size={48} color="#10b981" />
            </View>
            <Text style={styles.folderCount}>{folderImages.length}</Text>
            <Text style={styles.folderLabel}>
              image{folderImages.length > 1 ? 's' : ''} processed
            </Text>
          </View>
        )}

        {/* Multi-Folder Info */}
        {mode === 'multi-folder' && multiFolderImages.length > 0 && (
          <View style={styles.folderInfoSection}>
            <View style={styles.folderIconContainer}>
              <Ionicons name="albums" size={48} color="#f59e0b" />
            </View>
            <Text style={styles.folderCount}>{multiFolderImages.length}</Text>
            <Text style={styles.folderLabel}>
              folder{multiFolderImages.length > 1 ? 's' : ''} processed
            </Text>
            <Text style={styles.folderSubtext}>
              Total: {multiFolderImages.reduce((sum, folder) => sum + folder.length, 0)} images
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.downloadButton, isDownloading && styles.downloadButtonDisabled]} 
          onPress={handleDownload}
          disabled={isDownloading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#7c3aed', '#a855f7']}
            style={styles.downloadButtonGradient}
          >
            {isDownloading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="download-outline" size={20} color="#fff" />
                <Text style={styles.downloadButtonText}>
                  {mode === 'folder' || mode === 'multi-folder' ? 'Download ZIP' : 'Download Image'}
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.repeatButton}
          onPress={handleRepeat}
          activeOpacity={0.8}
        >
          <Ionicons name="repeat-outline" size={20} color="#7c3aed" />
          <Text style={styles.repeatButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const ACCESSORY_LABELS = {
  glasses: 'Glasses / Cap / Hat / Bag',
  shoes: 'Shoes',
  pants: 'Pants',
  shirt: 'Shirt',
  jacket: 'Jacket',
  watch: 'Watch',
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  successIconContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  successIconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  successText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  previewSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  previewLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  previewContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  previewImage: {
    width: '100%',
    height: 400,
    backgroundColor: '#f5f5f5',
  },
  resultBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(124, 58, 237, 0.9)',
  },
  resultBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  placeholderBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  placeholderBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  accessoriesList: {
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  accessoriesListTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  accessoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  accessoryItemText: {
    fontSize: 14,
    color: '#666',
  },
  folderInfoSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  folderIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  folderCount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  folderLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  folderSubtext: {
    fontSize: 14,
    color: '#999',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  downloadButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  downloadButtonDisabled: {
    opacity: 0.6,
  },
  downloadButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  repeatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#7c3aed',
    backgroundColor: '#fff',
  },
  repeatButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7c3aed',
  },
});

export default TryOnGearResultScreen;

