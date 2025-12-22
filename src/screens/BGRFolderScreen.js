import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { pickFolder } from '../utils/folderPicker';
import { setFolder, setError } from '../store/slices/bgrSlice';

const BGRFolderScreen = ({ onProcess, onBack }) => {
  const dispatch = useDispatch();
  const { folder } = useSelector(state => state.bgr);
  const [folderError, setFolderError] = useState('');

  // Log Redux state changes
  useEffect(() => {
    console.log('📦 Redux State Updated - BGR Folder:');
    console.log('  - Folder exists:', !!folder);
    if (folder) {
      console.log('  - Folder name:', folder.name);
      console.log('  - Image count:', folder.fileCount);
      console.log('  - Files array length:', folder.files?.length || 0);
    }
  }, [folder]);

  const handleFolderUpload = async () => {
    try {
      const folderData = await pickFolder();
      
      if (!folderData) {
        console.log('❌ Folder selection cancelled');
        return;
      }

      if (folderData.fileCount === 0) {
        Alert.alert('No Images', 'No image files found in the selected folder');
        return;
      }
      
      dispatch(setFolder(folderData));
      setFolderError('');
      
      console.log('💾 Redux State - BGR Folder:', JSON.stringify(folderData, null, 2));
    } catch (err) {
      console.error('❌ Error picking folder:', err);
      Alert.alert('Error', 'Failed to select folder: ' + err.message);
    }
  };

  const handleRemoveFolder = () => {
    dispatch(setFolder(null));
  };

  const handleProcess = () => {
    if (!folder) {
      setFolderError('Folder upload is required');
      return;
    }

    console.log('🚀 ===== PROCESSING FOLDER =====');
    console.log('📂 Folder name:', folder.name);
    console.log('📊 Total images to process:', folder.fileCount);
    console.log('🖼️ Image files:', folder.files.length);
    console.log('💾 Full Redux State:', folder);
    console.log('================================');
    
    // TODO: API call placeholder
    // const result = await bgrAPI.processFolderImages({ folder });
    
    onProcess();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#663399" />
        </TouchableOpacity>
        <Text style={styles.title}>Folder Upload</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.uploadSection}>
          <Text style={styles.label}>
            Upload Folder <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.helperText}>Only folders are supported</Text>
          
          {folder ? (
            <View style={styles.folderPreview}>
              <View style={styles.folderIcon}>
                <Ionicons name="folder" size={48} color="#663399" />
              </View>
              <View style={styles.folderInfo}>
                <Text style={styles.folderName}>{folder.name}</Text>
                <Text style={styles.fileCount}>{folder.fileCount} files</Text>
              </View>
              <TouchableOpacity style={styles.removeButton} onPress={handleRemoveFolder}>
                <Ionicons name="close-circle" size={28} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadBox} onPress={handleFolderUpload}>
              <Ionicons name="folder-open-outline" size={64} color="#663399" />
              <Text style={styles.uploadText}>Tap to select folder</Text>
              <Text style={styles.uploadSubtext}>Individual images will be rejected</Text>
            </TouchableOpacity>
          )}
          
          {folderError && <Text style={styles.errorText}>{folderError}</Text>}
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={24} color="#663399" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Folder Upload Requirements</Text>
            <Text style={styles.infoText}>• Only folder selection is allowed</Text>
            <Text style={styles.infoText}>• Individual image files will be rejected</Text>
            <Text style={styles.infoText}>• All images in folder will be processed</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onBack}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.processButton, !folder && styles.processButtonDisabled]}
          onPress={handleProcess}
          disabled={!folder}
        >
          <Text style={styles.processButtonText}>Process</Text>
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
  uploadSection: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 5,
  },
  required: {
    color: '#FF3B30',
  },
  helperText: {
    fontSize: 13,
    color: '#000',
    marginBottom: 15,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#e6e6fa',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 50,
    alignItems: 'center',
    backgroundColor: '#f9f7fc',
  },
  uploadText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  uploadSubtext: {
    marginTop: 5,
    fontSize: 13,
    color: '#000',
  },
  folderPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e6e6fa',
    backgroundColor: '#f9f7fc',
  },
  folderIcon: {
    marginRight: 15,
  },
  folderInfo: {
    flex: 1,
  },
  folderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 5,
  },
  fileCount: {
    fontSize: 14,
    color: '#000',
  },
  removeButton: {
    padding: 5,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 13,
    marginTop: 10,
  },
  infoBox: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#f9f7fc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e6e6fa',
  },
  infoContent: {
    flex: 1,
    marginLeft: 10,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#000',
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e6e6fa',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#663399',
  },
  cancelButtonText: {
    color: '#663399',
    fontSize: 16,
    fontWeight: 'bold',
  },
  processButton: {
    flex: 1,
    backgroundColor: '#663399',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  processButtonDisabled: {
    backgroundColor: '#e6e6fa',
  },
  processButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BGRFolderScreen;