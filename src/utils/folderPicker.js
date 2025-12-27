import { NativeModules, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const { FolderPicker } = NativeModules;

/**
 * Pick a folder using Android SAF
 */
export const pickFolder = async () => {
  try {
    if (Platform.OS !== 'android') {
      throw new Error('Folder picking only supported on Android');
    }

    if (!FolderPicker) {
      console.error('❌ FolderPicker native module not found!');
      throw new Error('FolderPicker native module not available');
    }

    console.log('🔍 Opening SAF folder picker...');
    
    const result = await FolderPicker.pickFolder();

    const folderData = {
      name: result.name || 'Selected Folder',
      path: result.uri,
      fileCount: result.files.length,
      files: result.files.map(file => ({
        name: file.name,
        uri: file.uri,
        path: file.uri,
        size: file.size,
      })),
    };

    console.log('📁 ===== FOLDER SELECTED =====');
    console.log('📂 Folder name:', folderData.name);
    console.log('📊 Total images:', folderData.fileCount);
    console.log('🖼️ Image files:', folderData.files.map(f => f.name));
    console.log('================================');

    return folderData;
  } catch (error) {
    if (error.code === 'CANCELLED') {
      console.log('❌ Folder selection cancelled');
      return null;
    }
    console.error('❌ Error picking folder:', error);
    throw error;
  }
};

/**
 * Pick a single image file
 */
export const pickImage = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission denied');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const asset = result.assets[0];
    return {
      uri: asset.uri,
      path: asset.uri,
      name: asset.fileName || asset.uri.split('/').pop(),
      width: asset.width,
      height: asset.height,
    };
  } catch (error) {
    console.error('❌ Error picking image:', error);
    throw error;
  }
};
