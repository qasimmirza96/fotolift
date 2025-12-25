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

    // Check if it's a remote URL (http/https)
    if (imageUri.startsWith('http://') || imageUri.startsWith('https://')) {
      console.log('⚠️ Remote URL detected, cannot save placeholder images');
      if (showAlert) {
        Alert.alert(
          'Info',
          'This is a placeholder image. In production, real processed images will be downloaded.',
          [{ text: 'OK' }]
        );
      }
      return false;
    }

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
 * Download multiple images as ZIP (supports nested folders)
 * @param {Array} imageUris - Array of image URIs or array of folder arrays for nested structure
 * @param {string} zipFileName - Name for the ZIP file
 * @param {boolean} isNestedFolders - Whether the structure is nested folders
 * @returns {Promise<boolean>} - Success status
 */
export const downloadImagesAsZip = async (imageUris, zipFileName = 'FotoLift_Images.zip', isNestedFolders = false) => {
  try {
    console.log('📦 [DownloadUtils] Starting ZIP creation...');
    console.log('📊 [DownloadUtils] Is Nested Folders:', isNestedFolders);
    
    // Handle nested folder structure
    let allImages = [];
    if (isNestedFolders && Array.isArray(imageUris[0]) && Array.isArray(imageUris[0][0])) {
      // Multi-folder structure: [[folder1_files], [folder2_files], ...]
      console.log('📁 [DownloadUtils] Processing nested folder structure');
      console.log('📊 [DownloadUtils] Folder count:', imageUris.length);
      allImages = imageUris.flat();
      console.log('📊 [DownloadUtils] Total images after flattening:', allImages.length);
    } else if (isNestedFolders && Array.isArray(imageUris[0])) {
      // Single nested folder: [folder_files]
      console.log('📁 [DownloadUtils] Processing single nested folder');
      allImages = imageUris.flat();
    } else {
      // Flat structure: [image1, image2, ...]
      console.log('📁 [DownloadUtils] Processing flat image structure');
      allImages = imageUris;
    }
    
    console.log('📊 [DownloadUtils] Total images to process:', allImages.length);
    console.log('📊 [DownloadUtils] Image URIs sample:', allImages.slice(0, 3).map(img => typeof img === 'string' ? img : img.uri || img.path));

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('❌ [DownloadUtils] Permission denied');
      Alert.alert('Permission Required', 'Please grant permission to save files.');
      return false;
    }

    // Create temp directory for images
    console.log('📁 [DownloadUtils] Creating temp directory...');
    const timestamp = Date.now();
    const tempDir = `${RNFS.CachesDirectoryPath}/temp_images_${timestamp}`;
    
    // Clean up old temp directory if exists
    if (await RNFS.exists(tempDir)) {
      await RNFS.unlink(tempDir).catch(() => {});
    }
    await RNFS.mkdir(tempDir);
    console.log('✅ [DownloadUtils] Temp directory created:', tempDir);

    // Handle nested folder structure
    if (isNestedFolders && Array.isArray(imageUris[0]) && Array.isArray(imageUris[0][0])) {
      // Multi-folder: Create folder structure in ZIP
      console.log('📁 [DownloadUtils] Creating nested folder structure in ZIP');
      for (let folderIndex = 0; folderIndex < imageUris.length; folderIndex++) {
        const folder = imageUris[folderIndex];
        const folderName = `folder_${folderIndex + 1}`;
        const folderPath = `${tempDir}/${folderName}`;
        await RNFS.mkdir(folderPath);
        
        console.log(`📂 [DownloadUtils] Processing folder ${folderIndex + 1}/${imageUris.length}: ${folderName}`);
        console.log(`📊 [DownloadUtils] Files in folder: ${folder.length}`);
        
        for (let i = 0; i < folder.length; i++) {
          const file = folder[i];
          const uri = typeof file === 'string' ? file : (file.uri || file.path);
          const fileName = typeof file === 'string' 
            ? uri.split('/').pop().split('%2F').pop() || `image_${i + 1}.jpg`
            : (file.name || uri.split('/').pop().split('%2F').pop() || `image_${i + 1}.jpg`);
          const destPath = `${folderPath}/${fileName}`;
          
          console.log(`📄 [DownloadUtils] Copying ${i + 1}/${folder.length} to ${folderName}/${fileName}`);
          try {
            await RNFS.copyFile(uri, destPath);
          } catch (copyError) {
            console.error(`❌ [DownloadUtils] Error copying file ${fileName}:`, copyError);
            // Continue with other files
          }
        }
      }
    } else {
      // Flat structure: Copy all images to root
      console.log('📋 [DownloadUtils] Copying images to temp directory (flat structure)...');
      for (let i = 0; i < allImages.length; i++) {
        const file = allImages[i];
        const uri = typeof file === 'string' ? file : (file.uri || file.path);
        const fileName = typeof file === 'string'
          ? uri.split('/').pop().split('%2F').pop() || `image_${i + 1}.jpg`
          : (file.name || uri.split('/').pop().split('%2F').pop() || `image_${i + 1}.jpg`);
        const destPath = `${tempDir}/${fileName}`;
        
        console.log(`📄 [DownloadUtils] Copying ${i + 1}/${allImages.length}: ${fileName}`);
        try {
          await RNFS.copyFile(uri, destPath);
        } catch (copyError) {
          console.error(`❌ [DownloadUtils] Error copying file ${fileName}:`, copyError);
          // Continue with other files
        }
      }
    }
    console.log('✅ [DownloadUtils] All images copied successfully');

    // Create ZIP file
    console.log('🗜️ [DownloadUtils] Creating ZIP file...');
    const zipPath = `${RNFS.CachesDirectoryPath}/${zipFileName}`;
    
    // Clean up old ZIP if exists
    if (await RNFS.exists(zipPath)) {
      await RNFS.unlink(zipPath).catch(() => {});
    }
    
    await zip(tempDir, zipPath);
    console.log('✅ [DownloadUtils] ZIP created successfully:', zipPath);

    // Share the ZIP file
    console.log('📤 [DownloadUtils] Opening share dialog...');
    try {
      await Share.open({
        url: `file://${zipPath}`,
        type: 'application/zip',
        title: 'Save ZIP file',
      });
      console.log('✅ [DownloadUtils] Share completed');
    } catch (shareError) {
      if (shareError.message === 'User did not share') {
        console.log('ℹ️ [DownloadUtils] User cancelled share dialog');
      } else {
        console.error('❌ [DownloadUtils] Share error:', shareError);
        throw shareError;
      }
    }

    // Clean up temp files
    console.log('🧹 [DownloadUtils] Cleaning up temp files...');
    await RNFS.unlink(tempDir).catch(() => {
      console.log('⚠️ [DownloadUtils] Could not delete temp directory (may be in use)');
    });
    // Don't delete ZIP immediately as user might be saving it
    console.log('✅ [DownloadUtils] Cleanup complete');

    const imageCount = isNestedFolders && Array.isArray(imageUris[0]) 
      ? imageUris.reduce((sum, folder) => sum + (Array.isArray(folder) ? folder.length : 0), 0)
      : allImages.length;
    
    Alert.alert('Success', `ZIP file with ${imageCount} images ready!`);
    return true;
  } catch (error) {
    console.error('❌ [DownloadUtils] Failed to create ZIP file');
    console.error('❌ [DownloadUtils] Error details:', error);
    Alert.alert('Error', `Failed to create ZIP file: ${error.message}`);
    return false;
  }
};

export default {
  downloadImage,
  downloadImagesAsZip,
};
