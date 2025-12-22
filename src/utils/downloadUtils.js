import * as MediaLibrary from 'expo-media-library';
import RNFS from 'react-native-fs';
import { zip } from 'react-native-zip-archive';
import { Alert, Platform } from 'react-native';
import Share from 'react-native-share';

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

    const { status } = await MediaLibrary.requestPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant permission to save images to your gallery.',
        [{ text: 'OK' }]
      );
      return false;
    }

    // If it's a content URI, copy to cache first
    let localUri = imageUri;
    if (imageUri.startsWith('content://')) {
      console.log('📋 Copying content URI to cache...');
      const fileExtension = imageUri.split('.').pop().split('?')[0] || 'jpg';
      const cacheFileName = `${Date.now()}.${fileExtension}`;
      localUri = `${RNFS.CachesDirectoryPath}/${cacheFileName}`;
      
      await RNFS.copyFile(imageUri, localUri);
      console.log('✅ Copied to:', localUri);
    }

    console.log('💾 Saving to gallery...');
    await MediaLibrary.createAssetAsync(localUri);
    
    // Clean up cache if we created a temp file
    if (localUri !== imageUri) {
      await RNFS.unlink(localUri).catch(() => {});
    }
    
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
 * Download multiple images as ZIP
 * @param {Array} imageUris - Array of image URIs
 * @param {string} zipFileName - Name for the ZIP file
 * @returns {Promise<boolean>} - Success status
 */
export const downloadImagesAsZip = async (imageUris, zipFileName = 'FotoLift_Images.zip') => {
  try {
    console.log('📦 Starting ZIP creation...');
    console.log('Images count:', imageUris.length);

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('❌ Permission denied');
      Alert.alert('Permission Required', 'Please grant permission to save files.');
      return false;
    }

    // Create temp directory for images
    console.log('📁 Creating temp directory...');
    const tempDir = `${RNFS.CachesDirectoryPath}/temp_images`;
    
    if (await RNFS.exists(tempDir)) {
      await RNFS.unlink(tempDir);
    }
    await RNFS.mkdir(tempDir);
    console.log('✅ Temp directory created:', tempDir);

    // Copy all images to temp directory
    console.log('📋 Copying images to temp directory...');
    for (let i = 0; i < imageUris.length; i++) {
      const uri = imageUris[i];
      const fileName = uri.split('/').pop().split('%2F').pop() || `image_${i + 1}.jpg`;
      const destPath = `${tempDir}/${fileName}`;
      
      console.log(`📄 Copying ${i + 1}/${imageUris.length}: ${fileName}`);
      await RNFS.copyFile(uri, destPath);
    }
    console.log('✅ All images copied successfully');

    // Create ZIP file
    console.log('🗜️ Creating ZIP file...');
    const zipPath = `${RNFS.CachesDirectoryPath}/${zipFileName}`;
    await zip(tempDir, zipPath);
    console.log('✅ ZIP created successfully:', zipPath);

    // Share the ZIP file
    console.log('📤 Opening share dialog...');
    await Share.open({
      url: `file://${zipPath}`,
      type: 'application/zip',
      title: 'Save ZIP file',
    });
    console.log('✅ Share dialog opened');

    // Clean up temp files
    console.log('🧹 Cleaning up temp files...');
    await RNFS.unlink(tempDir).catch(() => {});
    await RNFS.unlink(zipPath).catch(() => {});
    console.log('✅ Cleanup complete');

    Alert.alert('Success', `ZIP file with ${imageUris.length} images created!`);
    return true;
  } catch (error) {
    console.error('❌ Failed to create ZIP file');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    Alert.alert('Error', `Failed to create ZIP file: ${error.message}`);
    return false;
  }
};

export default {
  downloadImage,
  downloadImagesAsZip,
};
