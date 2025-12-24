import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Dimensions, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { pickFolder, pickImage } from '../utils/folderPicker';
import {
  setSelectedModel,
  setAccessoryImage,
  removeAccessoryImage,
  setFolderImages,
  setMultiFolderImages,
  processInteractiveTryOn,
  processFolderTryOn,
  processMultiFolderTryOn,
  resetTryOnGearState,
} from '../store/slices/tryOnGearSlice';

const { width } = Dimensions.get('window');

// Predefined models (static for now)
const MODELS = [
  { id: 1, name: 'Model 1', uri: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmVhdXRpZnVsJTIwd29tYW58ZW58MHx8MHx8fDA%3D' },
  { id: 2, name: 'Model 2', uri: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400' },
  { id: 3, name: 'Model 3', uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
  { id: 4, name: 'Model 4', uri: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400' },
];

const ACCESSORY_TYPES = [
  { type: 'glasses', label: 'Glasses / Cap / Hat / Bag', icon: 'glasses' },
  { type: 'shoes', label: 'Shoes', icon: 'footsteps' },
  { type: 'pants', label: 'Pants', icon: 'fitness' },
  { type: 'shirt', label: 'Shirt', icon: 'shirt' },
  { type: 'jacket', label: 'Jacket', icon: 'business' },
  { type: 'watch', label: 'Watch', icon: 'watch' },
];

const TryOnGearScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { selectedModel, accessories, folderImages, multiFolderImages, status } = useSelector(
    (state) => state.tryOnGear
  );
  
  const [showFolderGuide, setShowFolderGuide] = useState(false);
  const [showMultiFolderGuide, setShowMultiFolderGuide] = useState(false);
  const [selectedModelIndex, setSelectedModelIndex] = useState(0);

  const handleModelSelect = (model, index) => {
    setSelectedModelIndex(index);
    dispatch(setSelectedModel(model));
  };

  const handleAccessoryPick = async (type) => {
    try {
      const result = await pickImage();
      if (result) {
        dispatch(setAccessoryImage({ type, image: result }));
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleFolderPick = async () => {
    try {
      const folderData = await pickFolder();
      if (folderData) {
        dispatch(setFolderImages(folderData.files));
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick folder images');
    }
  };

  const handleMultiFolderPick = async () => {
    try {
      const folderData = await pickFolder();
      if (folderData) {
        dispatch(setMultiFolderImages([folderData.files]));
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick folders');
    }
  };

  const handleTryAllAccessories = () => {
    if (!selectedModel || !Object.values(accessories).some(a => a)) {
      Alert.alert('Error', 'Please select a model and at least one accessory');
      return;
    }
    
    dispatch(processInteractiveTryOn({ model: selectedModel, accessories }));
  };

  const handleProcessFolder = () => {
    if (folderImages.length === 0) {
      Alert.alert('Error', 'Please select folder images');
      return;
    }
    
    dispatch(processFolderTryOn({ folderImages }));
  };

  const handleProcessMultiFolder = () => {
    if (multiFolderImages.length === 0) {
      Alert.alert('Error', 'Please select multiple folders');
      return;
    }
    
    dispatch(processMultiFolderTryOn({ multiFolderImages }));
  };

  const isInteractiveReady = selectedModel && Object.values(accessories).some(a => a);
  const isFolderReady = folderImages.length > 0 && !isInteractiveReady;
  const isMultiFolderReady = multiFolderImages.length > 0 && !isInteractiveReady;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TRY-ON GEAR</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Interactive Try-On Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interactive Try-On</Text>
          <Text style={styles.sectionSubtitle}>
            Try on glasses, watches, shoes, pants, shirts and more on your model with AI precision.
          </Text>

          {/* Model Selection */}
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Select from Available  Models</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modelSlider}>
              {MODELS.map((model, index) => (
                <TouchableOpacity
                  key={model.id}
                  style={[
                    styles.modelCard,
                    selectedModelIndex === index && styles.modelCardSelected,
                  ]}
                  onPress={() => handleModelSelect(model, index)}
                >
                  <View style={styles.modelImagePlaceholder}>
                    <Ionicons name="person" size={40} color="#999" />
                  </View>
                  <Text style={styles.modelName}>{model.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={styles.modelIndicator}>Model {selectedModelIndex + 1} of {MODELS.length}</Text>
          </View>

          {/* Accessory Upload Grid */}
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Select Accessory Type</Text>
            <View style={styles.accessoryGrid}>
              {ACCESSORY_TYPES.map(({ type, label, icon }) => (
                <View key={type} style={styles.accessoryCard}>
                  <View style={styles.accessoryHeader}>
                    <Ionicons name={icon} size={20} color="#7c3aed" />
                    <Text style={styles.accessoryLabel}>{label}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={() => handleAccessoryPick(type)}
                  >
                    <Ionicons name="cloud-upload-outline" size={20} color="#7c3aed" />
                    <Text style={styles.uploadButtonText}>
                      {accessories[type] ? 'Change' : 'Choose file'}
                    </Text>
                  </TouchableOpacity>
                  {accessories[type] && (
                    <>
                      <Image source={{ uri: accessories[type].uri }} style={styles.accessoryPreview} />
                      <View style={styles.fileInfo}>
                        <Text style={styles.fileName} numberOfLines={1}>
                          {accessories[type].name || 'Selected'}
                        </Text>
                        <TouchableOpacity onPress={() => dispatch(removeAccessoryImage(type))}>
                          <Ionicons name="close-circle" size={18} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.primaryButton, !isInteractiveReady && styles.primaryButtonDisabled]}
            onPress={handleTryAllAccessories}
            disabled={!isInteractiveReady || status === 'processing'}
          >
            <LinearGradient
              colors={isInteractiveReady ? ['#7c3aed', '#a855f7'] : ['#e5e7eb', '#d1d5db']}
              style={styles.buttonGradient}
            >
              <Text style={[styles.buttonText, !isInteractiveReady && styles.buttonTextDisabled]}>
                {status === 'processing' ? 'Processing...' : 'Try All Accessories'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Folder-Based Try-On Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Folder-Based Processing</Text>
          <Text style={styles.sectionSubtitle}>
            Upload folders with structured images for batch processing.
          </Text>

          {/* Folder Upload */}
          <View style={styles.subsection}>
            <View style={styles.subsectionHeader}>
              <Text style={styles.subsectionTitle}>Folder Upload</Text>
              <TouchableOpacity onPress={() => setShowFolderGuide(true)}>
                <Text style={styles.guideButton}>View Guide</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>Select images following the required structure</Text>
            <TouchableOpacity 
              style={[styles.folderButton, isInteractiveReady && styles.folderButtonDisabled]} 
              onPress={handleFolderPick}
              disabled={isInteractiveReady}
            >
              <Ionicons name="folder-open-outline" size={24} color="#7c3aed" />
              <Text style={styles.folderButtonText}>
                {folderImages.length > 0 ? `${folderImages.length} images selected` : 'Select Folder Images'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.secondaryButton, !isFolderReady && styles.secondaryButtonDisabled]}
              onPress={handleProcessFolder}
              disabled={!isFolderReady || status === 'processing'}
            >
              <Text style={[styles.secondaryButtonText, !isFolderReady && styles.secondaryButtonTextDisabled]}>
                Process Folder
              </Text>
            </TouchableOpacity>
          </View>

          {/* Multi-Folder Upload */}
          <View style={styles.subsection}>
            <View style={styles.subsectionHeader}>
              <Text style={styles.subsectionTitle}>Multi-Folder Upload</Text>
              <TouchableOpacity onPress={() => setShowMultiFolderGuide(true)}>
                <Text style={styles.guideButton}>View Guide</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>Select multiple folders for batch processing</Text>
            <TouchableOpacity 
              style={[styles.folderButton, isInteractiveReady && styles.folderButtonDisabled]} 
              onPress={handleMultiFolderPick}
              disabled={isInteractiveReady}
            >
              <Ionicons name="albums-outline" size={24} color="#7c3aed" />
              <Text style={styles.folderButtonText}>
                {multiFolderImages.length > 0
                  ? `${multiFolderImages.length} folders selected`
                  : 'Select Multiple Folders'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.secondaryButton, !isMultiFolderReady && styles.secondaryButtonDisabled]}
              onPress={handleProcessMultiFolder}
              disabled={!isMultiFolderReady || status === 'processing'}
            >
              <Text style={[styles.secondaryButtonText, !isMultiFolderReady && styles.secondaryButtonTextDisabled]}>
                Process Multi-Folder
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Success Message */}
        {status === 'success' && (
          <View style={styles.successMessage}>
            <Ionicons name="checkmark-circle" size={24} color="#34C759" />
            <Text style={styles.successText}>Processing completed successfully.</Text>
          </View>
        )}

        {/* Error Message */}
        {status === 'error' && (
          <View style={styles.errorMessage}>
            <Ionicons name="alert-circle" size={24} color="#ef4444" />
            <Text style={styles.errorText}>Processing failed. Please try again.</Text>
          </View>
        )}
      </ScrollView>

      {/* Folder Guide Modal */}
      <Modal visible={showFolderGuide} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📋 Folder Upload Guide</Text>
              <TouchableOpacity onPress={() => setShowFolderGuide(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.guideTitle}>Folder Structure:</Text>
              <View style={styles.codeBlock}>
                <Text style={styles.codeText}>your_folder/</Text>
                <Text style={styles.codeText}>├── model.jpeg (required)</Text>
                <Text style={styles.codeText}>├── shirt.jpeg (optional)</Text>
                <Text style={styles.codeText}>├── jacket.jpeg (optional)</Text>
                <Text style={styles.codeText}>├── pants.jpeg (optional)</Text>
                <Text style={styles.codeText}>├── shoes.jpeg (optional)</Text>
                <Text style={styles.codeText}>├── glasses.jpeg (optional)</Text>
                <Text style={styles.codeText}>└── watch.jpeg (optional)</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Multi-Folder Guide Modal */}
      <Modal visible={showMultiFolderGuide} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📋 Multi-Folder Upload Guide</Text>
              <TouchableOpacity onPress={() => setShowMultiFolderGuide(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.guideTitle}>Multi-Folder Structure:</Text>
              <View style={styles.codeBlock}>
                <Text style={styles.codeText}>your_parent_folder/</Text>
                <Text style={styles.codeText}>├── folder1/</Text>
                <Text style={styles.codeText}>│   ├── model.jpeg (required)</Text>
                <Text style={styles.codeText}>│   ├── shirt.jpeg (optional)</Text>
                <Text style={styles.codeText}>│   ├── jacket.jpeg (optional)</Text>
                <Text style={styles.codeText}>│   ├── pants.jpeg (optional)</Text>
                <Text style={styles.codeText}>│   ├── shoes.jpeg (optional)</Text>
                <Text style={styles.codeText}>│   ├── glasses.png (optional)</Text>
                <Text style={styles.codeText}>│   └── watch.png (optional)</Text>
                <Text style={styles.codeText}>├── folder2/</Text>
                <Text style={styles.codeText}>│   └── same structure</Text>
                <Text style={styles.codeText}>└── folder3/</Text>
                <Text style={styles.codeText}>    └── same structure</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 24,
  },
  subsection: {
    marginBottom: 24,
  },
  subsectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  guideButton: {
    fontSize: 14,
    color: '#7c3aed',
    fontWeight: '600',
  },
  helperText: {
    fontSize: 13,
    color: '#999',
    marginBottom: 12,
  },
  modelSlider: {
    marginVertical: 12,
  },
  modelCard: {
    width: 100,
    marginRight: 12,
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modelCardSelected: {
    borderColor: '#7c3aed',
    backgroundColor: '#f5f3ff',
  },
  modelImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  modelName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  modelIndicator: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  accessoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  accessoryCard: {
    width: (width - 52) / 2,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fafafa',
  },
  accessoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  accessoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7c3aed',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    fontSize: 12,
    color: '#7c3aed',
    fontWeight: '600',
  },
  accessoryPreview: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginTop: 8,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  fileName: {
    fontSize: 11,
    color: '#666',
    flex: 1,
  },
  primaryButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  buttonTextDisabled: {
    color: '#999',
  },
  divider: {
    height: 8,
    backgroundColor: '#f5f5f5',
  },
  folderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#7c3aed',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    marginBottom: 12,
  },
  folderButtonDisabled: {
    borderColor: '#e5e7eb',
    backgroundColor: '#f5f5f5',
    opacity: 0.5,
  },
  folderButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7c3aed',
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#7c3aed',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  secondaryButtonDisabled: {
    borderColor: '#e5e7eb',
    backgroundColor: '#fafafa',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#7c3aed',
  },
  secondaryButtonTextDisabled: {
    color: '#999',
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#34C759',
  },
  successText: {
    fontSize: 14,
    color: '#166534',
    fontWeight: '600',
  },
  errorMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  errorText: {
    fontSize: 14,
    color: '#991b1b',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  modalBody: {
    padding: 20,
  },
  guideTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  codeBlock: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
  },
});

export default TryOnGearScreen;
