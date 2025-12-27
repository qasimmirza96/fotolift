import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { pickFolder, pickImage } from '../utils/folderPicker';
import {
  setTileSize,
  setTilePadding,
  setSingleImage,
  setFolder,
  enhanceSingleImage,
  enhanceFolderImages,
  resetImageEnhancerState,
} from '../store/slices/imageEnhancerSlice';

const ImageEnhancerScreen = ({ onBack, onSuccess }) => {
  const dispatch = useDispatch();
  const {
    tileSize,
    tilePadding,
    singleImage,
    folder,
    mode,
    status,
  } = useSelector((state) => state.imageEnhancer);

  const [showTileSizeDropdown, setShowTileSizeDropdown] = useState(false);
  const [showTilePaddingDropdown, setShowTilePaddingDropdown] = useState(false);

  const tileSizeOptions = [256, 512, 778, 1024];
  const tilePaddingOptions = [32, 64];

  // Handle single image selection
  const handleSingleImageUpload = async () => {
    try {
      const image = await pickImage();
      if (image) {
        dispatch(setSingleImage(image));
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to pick image');
    }
  };

  // Handle folder selection
  const handleFolderUpload = async () => {
    try {
      const folderData = await pickFolder();
      if (folderData) {
        dispatch(setFolder(folderData));
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to pick folder');
    }
  };

  // Handle remove single image
  const handleRemoveSingleImage = () => {
    console.log('🗑️ Removing single image');
    dispatch(setSingleImage(null));
  };

  // Handle remove folder
  const handleRemoveFolder = () => {
    console.log('🗑️ Removing folder');
    dispatch(setFolder(null));
  };

  // Handle enhance single image
  const handleEnhanceSingle = async () => {
    if (singleImage) {
      const result = await dispatch(enhanceSingleImage({ image: singleImage, tileSize, tilePadding }));
      if (result.meta.requestStatus === 'fulfilled') {
        onSuccess && onSuccess();
      }
    }
  };

  // Handle enhance folder
  const handleEnhanceFolder = async () => {
    if (folder) {
      const result = await dispatch(enhanceFolderImages({ folder, tileSize, tilePadding }));
      if (result.meta.requestStatus === 'fulfilled') {
        onSuccess && onSuccess();
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Image Enhancer</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Automatically improve colors, sharpness, and clarity. Upload a single image or a folder of images to enhance them all.
        </Text>

        {/* Enhancement Settings Card */}
        <View style={styles.settingsCard}>
          <Text style={styles.cardTitle}>Enhancement Settings</Text>

          {/* Tile Size Dropdown */}
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Tile Size</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowTileSizeDropdown(!showTileSizeDropdown)}
            >
              <Text style={styles.dropdownText}>{tileSize}</Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            {showTileSizeDropdown && (
              <View style={styles.dropdownMenu}>
                {tileSizeOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.dropdownItem}
                    onPress={() => {
                      dispatch(setTileSize(option));
                      setShowTileSizeDropdown(false);
                    }}
                  >
                    <Text style={[styles.dropdownItemText, option === tileSize && styles.dropdownItemTextActive]}>
                      {option}
                    </Text>
                    {option === tileSize && <Ionicons name="checkmark" size={20} color="#663399" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Tile Padding Dropdown */}
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Tile Padding</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowTilePaddingDropdown(!showTilePaddingDropdown)}
            >
              <Text style={styles.dropdownText}>{tilePadding}</Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            {showTilePaddingDropdown && (
              <View style={styles.dropdownMenu}>
                {tilePaddingOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.dropdownItem}
                    onPress={() => {
                      dispatch(setTilePadding(option));
                      setShowTilePaddingDropdown(false);
                    }}
                  >
                    <Text style={[styles.dropdownItemText, option === tilePadding && styles.dropdownItemTextActive]}>
                      {option}
                    </Text>
                    {option === tilePadding && <Ionicons name="checkmark" size={20} color="#663399" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Helper Text */}
          <Text style={styles.helperText}>
            Larger tile sizes may improve quality but require more memory and processing time.
          </Text>
        </View>

        {/* Upload Section */}
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>Upload Images</Text>

          {/* Single Image Upload */}
          <View style={styles.uploadOption}>
            <Text style={styles.optionLabel}>Single Image</Text>
            {singleImage ? (
              <View style={styles.imagePreview}>
                <Image source={{ uri: singleImage.uri }} style={styles.previewImage} />
                <TouchableOpacity style={styles.removeButton} onPress={handleRemoveSingleImage}>
                  <Ionicons name="close-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
                <Text style={styles.imageName}>{singleImage.name}</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadButton} onPress={handleSingleImageUpload}>
                <Ionicons name="image-outline" size={24} color="#666" />
                <Text style={styles.uploadButtonText}>Choose file</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Folder Upload */}
          <View style={styles.uploadOption}>
            <Text style={styles.optionLabel}>Folder of Images</Text>
            {folder ? (
              <View style={styles.folderPreview}>
                <View style={styles.folderIcon}>
                  <Ionicons name="folder" size={40} color="#663399" />
                </View>
                <View style={styles.folderInfo}>
                  <Text style={styles.folderName}>{folder.name}</Text>
                  <Text style={styles.fileCount}>{folder.fileCount} files</Text>
                </View>
                <TouchableOpacity style={styles.removeButtonSmall} onPress={handleRemoveFolder}>
                  <Ionicons name="close-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadButton} onPress={handleFolderUpload}>
                <Ionicons name="folder-outline" size={24} color="#666" />
                <Text style={styles.uploadButtonText}>Choose folder</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          {/* Dynamic Enhance Button */}
          <TouchableOpacity
            style={[styles.actionButton, (status === 'idle' || status === 'processing') && styles.actionButtonDisabled]}
            onPress={mode === 'single' ? handleEnhanceSingle : handleEnhanceFolder}
            disabled={status === 'idle' || status === 'processing'}
          >
            <Text style={styles.actionButtonText}>
              {status === 'processing' 
                ? 'Processing...' 
                : mode === 'single' 
                  ? 'Enhance Image' 
                  : mode === 'folder' 
                    ? 'Enhance Folder'
                    : 'Choose Source'}
            </Text>
          </TouchableOpacity>

          {/* Back to Home Button */}
          <TouchableOpacity style={styles.homeButton} onPress={onBack}>
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  headerTitle: {
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
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 24,
  },
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    padding: 20,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  settingItem: {
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 14,
    color: '#000',
  },
  dropdownMenu: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#000',
  },
  dropdownItemTextActive: {
    color: '#663399',
    fontWeight: '600',
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    lineHeight: 18,
    marginTop: 8,
  },
  uploadSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  uploadOption: {
    marginBottom: 20,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  uploadButtonText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  imagePreview: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  imageName: {
    padding: 10,
    fontSize: 13,
    color: '#000',
    backgroundColor: '#f9f9f9',
  },
  folderPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    backgroundColor: '#f9f9f9',
  },
  folderIcon: {
    marginRight: 12,
  },
  folderInfo: {
    flex: 1,
  },
  folderName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  fileCount: {
    fontSize: 13,
    color: '#666',
  },
  removeButtonSmall: {
    padding: 4,
  },
  actionSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#663399',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  actionButtonDisabled: {
    backgroundColor: '#e5e5e5',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  homeButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#663399',
  },
  homeButtonText: {
    color: '#663399',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ImageEnhancerScreen;