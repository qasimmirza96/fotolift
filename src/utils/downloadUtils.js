import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

/**
 * Download and save image to device storage
 * @param {string} imageUri - URI of the image to download
 * @param {string} fileName - Name for the downloaded file (optional)
 * @param {boolean} showAlert - Whether to show success alert (default: true)
 * @returns {Promise<boolean>} - Success status
 */
export const downloadImage = async (imageUri, fileName = null, showAlert = true) => {
  try {
    console.log('📥 Starting image download...');
    console.log('Image URI:', imageUri);

    // Request permission
    const { status } = await MediaLibrary.requestPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant permission to save images to your gallery.',
        [{ text: 'OK' }]
      );
      return false;
    }

    console.log('💾 Saving to gallery...');

    // Save to gallery 
    await MediaLibrary.createAssetAsync(imageUri);
    
    console.log('✅ Image saved successfully');

    if (showAlert) {
      Alert.alert(
        'Success',
        'Image saved to your gallery!',
        [{ text: 'OK' }]
      );
    }

    return true;
  } catch (error) {
    console.error('❌ Download error:', error);
    if (showAlert) {
      Alert.alert(
        'Error',
        'Failed to save image. Please try again.',
        [{ text: 'OK' }]
      );
    }
    return false;
  }
};

/**
 * Download multiple images
 * @param {Array} imageUris - Array of image URIs
 * @param {string} zipFileName - Name for the ZIP file
 * @returns {Promise<boolean>} - Success status
 */
export const downloadImagesAsZip = async (imageUris, zipFileName = 'FotoLift_Images.zip') => {
  try {
    console.log('📦 Starting multiple image download...');
    console.log('Images count:', imageUris.length);

    let successCount = 0;
    
    for (let i = 0; i < imageUris.length; i++) {
      const success = await downloadImage(imageUris[i], `FotoLift_${i + 1}.jpg`, false);
      if (success) successCount++;
    }

    if (successCount > 0) {
      Alert.alert(
        'Success',
        `${successCount} of ${imageUris.length} images saved to gallery.`,
        [{ text: 'OK' }]
      );
      return true;
    }

    return false;
  } catch (error) {
    console.error('❌ Download error:', error);
    Alert.alert(
      'Error',
      'Failed to save images. Please try again.',
      [{ text: 'OK' }]
    );
    return false;
  }
};

export default {
  downloadImage,
  downloadImagesAsZip,
};
