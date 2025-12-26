import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Dimensions, Alert, Image, ActivityIndicator, Animated } from 'react-native';
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
  setMode,
  processInteractiveTryOn,
  processFolderTryOn,
  processMultiFolderTryOn,
  resetTryOnGearState,
} from '../store/slices/tryOnGearSlice';
// Credits integration
import { deductCredits, fetchUserCredits } from '../store/slices/creditsSlice';
import { calculateCreditsNeeded } from '../services/creditsService';
import { validateCredits } from '../utils/creditValidator';
import CreditsDisplay from '../components/CreditsDisplay';
import InsufficientCreditsModal from '../components/InsufficientCreditsModal';

const { width } = Dimensions.get('window');

// Predefined models
const MODELS = [
  { id: 1, name: 'Model 1', uri: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmVhdXRpZnVsJTIwd29tYW58ZW58MHx8MHx8fDA%3D' },
  { id: 2, name: 'Model 2', uri: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400' },
  { id: 3, name: 'Model 3', uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
  { id: 4, name: 'Model 4', uri: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400' },
];

const ACCESSORY_TYPES = [
  { type: 'glasses', label: 'Glasses / Cap / Hat / Bag', icon: 'glasses-outline' },
  { type: 'shoes', label: 'Shoes', icon: 'footsteps-outline' },
  { type: 'pants', label: 'Pants', icon: 'fitness-outline' },
  { type: 'shirt', label: 'Shirt', icon: 'shirt-outline' },
  { type: 'jacket', label: 'Jacket', icon: 'business-outline' },
  { type: 'watch', label: 'Watch', icon: 'watch-outline' },
];

const MODE_OPTIONS = [
  {
    id: 'interactive',
    title: 'Single Image with Accessories',
    subtitle: 'Select a model and upload accessory images',
    icon: 'image-outline',
    color: '#7c3aed',
  },
  {
    id: 'folder',
    title: 'Single Folder Upload',
    subtitle: 'Upload a folder with structured images',
    icon: 'folder-outline',
    color: '#10b981',
  },
  {
    id: 'multi-folder',
    title: 'Multiple Folders Upload',
    subtitle: 'Upload multiple folders for batch processing',
    icon: 'albums-outline',
    color: '#f59e0b',
  },
];

const TryOnGearScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { 
    selectedModel, 
    accessories, 
    folderImages, 
    multiFolderImages, 
    mode, 
    status 
  } = useSelector((state) => state.tryOnGear);
  
  // Credits state
  const { balance } = useSelector((state) => state.credits);
  const [showInsufficientCredits, setShowInsufficientCredits] = useState(false);
  const [creditsNeeded, setCreditsNeeded] = useState(0);

  // Set first accordion (interactive) as default
  const [expandedMode, setExpandedMode] = useState('interactive');
  const [showFolderGuide, setShowFolderGuide] = useState(false);
  const [showMultiFolderGuide, setShowMultiFolderGuide] = useState(false);
  const [selectedModelIndex, setSelectedModelIndex] = useState(0);
  const [animations] = useState({
    interactive: new Animated.Value(1), // Start at 1 (expanded) for first accordion
    folder: new Animated.Value(0),
    'multi-folder': new Animated.Value(0),
  });

  // Initialize first accordion on mount
  useEffect(() => {
    console.log('🎬 [TryOnGear] Component Mounted');
    console.log('📊 [TryOnGear] Initial State:', {
      mode,
      expandedMode,
      selectedModel: selectedModel?.name,
      accessoriesCount: Object.values(accessories).filter(a => a).length,
      folderImagesCount: folderImages.length,
      multiFolderImagesCount: multiFolderImages.length,
      status,
      creditsBalance: balance,
    });
    
    // Set first mode (interactive) as default and save to state
    if (mode === 'idle' || !mode) {
      console.log('✅ [TryOnGear] Setting default mode to interactive');
      dispatch(setMode('interactive'));
    }

    // Fetch credits on mount
    dispatch(fetchUserCredits());
  }, []);

  useEffect(() => {
    console.log('🔄 [TryOnGear] State Updated:', {
      mode,
      expandedMode,
      selectedModel: selectedModel?.name,
      accessories: Object.keys(accessories).filter(key => accessories[key]),
      folderImagesCount: folderImages.length,
      multiFolderImagesCount: multiFolderImages.length,
      status
    });
  }, [mode, expandedMode, selectedModel, accessories, folderImages, multiFolderImages, status]);

  // Expand/collapse animation
  const toggleAccordion = (modeId) => {
    console.log('🎯 [TryOnGear] Toggle Accordion:', modeId);
    const isExpanding = expandedMode !== modeId;
    console.log('📊 [TryOnGear] Is Expanding:', isExpanding);
    setExpandedMode(isExpanding ? modeId : null);
    
    // Animate all accordions
    MODE_OPTIONS.forEach((option) => {
      const animKey = option.id === 'multi-folder' ? 'multi-folder' : option.id;
      const targetValue = option.id === modeId && isExpanding ? 1 : 0;
      if (animations[animKey]) {
        Animated.spring(animations[animKey], {
          toValue: targetValue,
          useNativeDriver: false,
          tension: 65,
          friction: 10,
        }).start();
      }
    });

    if (isExpanding) {
      console.log('✅ [TryOnGear] Setting mode to:', modeId);
      dispatch(setMode(modeId));
    } else {
      console.log('🔄 [TryOnGear] Collapsing accordion');
    }
  };

  // Validation checks
  const isInteractiveReady = selectedModel && Object.values(accessories).some(a => a);
  const isFolderReady = folderImages.length > 0;
  const isMultiFolderReady = multiFolderImages.length > 0;

  const handleModelSelect = (model, index) => {
    console.log('👤 [TryOnGear] Model Selected:', { modelId: model.id, modelName: model.name, index });
    setSelectedModelIndex(index);
    dispatch(setSelectedModel(model));
    console.log('✅ [TryOnGear] Model set in Redux state');
  };

  const handleAccessoryPick = async (type) => {
    console.log('📸 [TryOnGear] Accessory Pick Started:', type);
    try {
      const result = await pickImage();
      console.log('📥 [TryOnGear] Image Picker Result:', result ? { name: result.name, uri: result.uri?.substring(0, 50) + '...' } : 'Cancelled');
      if (result) {
        console.log('✅ [TryOnGear] Dispatching setAccessoryImage:', { type, imageName: result.name });
        dispatch(setAccessoryImage({ type, image: result }));
        console.log('✅ [TryOnGear] Accessory image set successfully');
      } else {
        console.log('ℹ️ [TryOnGear] Image picker cancelled by user');
      }
    } catch (err) {
      console.error('❌ [TryOnGear] Error picking accessory image:', err);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleFolderPick = async () => {
    console.log('📁 [TryOnGear] Folder Pick Started (Single Folder)');
    try {
      const folderData = await pickFolder();
      console.log('📦 [TryOnGear] Folder Picker Result:', folderData ? { 
        name: folderData.name, 
        fileCount: folderData.fileCount,
        files: folderData.files?.map(f => f.name)
      } : 'Cancelled');
      if (folderData) {
        console.log('✅ [TryOnGear] Dispatching setFolderImages:', { fileCount: folderData.files.length });
        dispatch(setFolderImages(folderData.files));
        console.log('✅ [TryOnGear] Folder images set successfully');
      } else {
        console.log('ℹ️ [TryOnGear] Folder picker cancelled by user');
      }
    } catch (err) {
      console.error('❌ [TryOnGear] Error picking folder:', err);
      Alert.alert('Error', 'Failed to pick folder images');
    }
  };

  const handleMultiFolderPick = async () => {
    console.log('📁 [TryOnGear] Multi-Folder Pick Started');
    console.log('📊 [TryOnGear] Current folders count:', multiFolderImages.length);
    try {
      const folderData = await pickFolder();
      console.log('📦 [TryOnGear] Folder Picker Result:', folderData ? { 
        name: folderData.name, 
        fileCount: folderData.fileCount,
        files: folderData.files?.map(f => f.name)
      } : 'Cancelled');
      if (folderData) {
        const currentFolders = multiFolderImages.length > 0 ? multiFolderImages : [];
        const newFolders = [...currentFolders, folderData.files];
        console.log('✅ [TryOnGear] Dispatching setMultiFolderImages:', { 
          totalFolders: newFolders.length,
          currentFolderFiles: folderData.files.length
        });
        dispatch(setMultiFolderImages(newFolders));
        console.log('✅ [TryOnGear] Multi-folder images updated successfully');
      } else {
        console.log('ℹ️ [TryOnGear] Folder picker cancelled by user');
      }
    } catch (err) {
      console.error('❌ [TryOnGear] Error picking multi-folder:', err);
      Alert.alert('Error', 'Failed to pick folders');
    }
  };

  const handleProcess = async () => {
    console.log('🚀 [TryOnGear] Process Started');
    console.log('📊 [TryOnGear] Current Mode:', expandedMode);
    console.log('📊 [TryOnGear] Validation Status:', {
      interactive: isInteractiveReady,
      folder: isFolderReady,
      multiFolder: isMultiFolderReady
    });
    
    // Calculate credits needed based on mode
    let creditsNeeded = 0;
    let inputCount = 1;
    let featureMode = 'single';

    if (expandedMode === 'interactive') {
      if (!isInteractiveReady) {
        console.warn('⚠️ [TryOnGear] Validation failed: Missing model or accessories');
        Alert.alert('Missing Information', 'Please select a model and at least one accessory');
        return;
      }
      inputCount = 1;
      featureMode = 'single';
      creditsNeeded = calculateCreditsNeeded('tryon_gear', featureMode, inputCount);
    } else if (expandedMode === 'folder') {
      if (!isFolderReady) {
        console.warn('⚠️ [TryOnGear] Validation failed: No folder images selected');
        Alert.alert('Error', 'Please select folder images');
        return;
      }
      inputCount = folderImages.length;
      featureMode = 'folder';
      creditsNeeded = calculateCreditsNeeded('tryon_gear', featureMode, inputCount);
    } else if (expandedMode === 'multi-folder') {
      if (!isMultiFolderReady) {
        console.warn('⚠️ [TryOnGear] Validation failed: No folders selected');
        Alert.alert('Error', 'Please select at least one folder');
        return;
      }
      const totalImages = multiFolderImages.reduce((sum, folder) => sum + folder.length, 0);
      inputCount = totalImages;
      featureMode = 'multi_folder';
      creditsNeeded = calculateCreditsNeeded('tryon_gear', featureMode, inputCount);
    }

    console.log(`💳 [TryOnGear] Credits needed: ${creditsNeeded} (mode: ${featureMode}, inputs: ${inputCount})`);
    console.log(`💳 [TryOnGear] Current balance: ${balance}`);

    // Check if user has sufficient credits
    const validation = validateCredits(balance, 'tryon_gear', featureMode, inputCount);
    
    if (!validation.hasSufficientCredits) {
      console.warn('⚠️ [TryOnGear] Insufficient credits');
      setCreditsNeeded(creditsNeeded);
      setShowInsufficientCredits(true);
      return;
    }
    
    let result;
    try {
      if (expandedMode === 'interactive') {
        console.log('🎯 [TryOnGear] Processing Interactive Try-On');
        console.log('📋 [TryOnGear] Selected Model:', selectedModel?.name);
        console.log('📋 [TryOnGear] Accessories:', Object.keys(accessories).filter(key => accessories[key]));
        result = await dispatch(processInteractiveTryOn({ model: selectedModel, accessories })).unwrap();
        console.log('✅ [TryOnGear] Interactive Try-On processed:', result);
      } else if (expandedMode === 'folder') {
        console.log('📁 [TryOnGear] Processing Folder Try-On');
        console.log('📋 [TryOnGear] Folder Images Count:', folderImages.length);
        result = await dispatch(processFolderTryOn({ folderImages })).unwrap();
        console.log('✅ [TryOnGear] Folder Try-On processed:', result);
      } else if (expandedMode === 'multi-folder') {
        console.log('📁 [TryOnGear] Processing Multi-Folder Try-On');
        console.log('📋 [TryOnGear] Multi-Folder Count:', multiFolderImages.length);
        console.log('📋 [TryOnGear] Total Images:', multiFolderImages.reduce((sum, folder) => sum + folder.length, 0));
        result = await dispatch(processMultiFolderTryOn({ multiFolderImages })).unwrap();
        console.log('✅ [TryOnGear] Multi-Folder Try-On processed:', result);
      }

      // Deduct credits after successful processing
      if (result) {
        console.log(`💳 [TryOnGear] Deducting ${creditsNeeded} credits...`);
        try {
          await dispatch(deductCredits({
            feature: 'tryon_gear',
            credits: creditsNeeded,
            inputCount: inputCount,
          })).unwrap();
          console.log(`✅ [TryOnGear] Credits deducted successfully. New balance will be updated.`);
          
          // Refresh credits balance
          await dispatch(fetchUserCredits());
        } catch (creditError) {
          console.error('❌ [TryOnGear] Credit deduction failed:', creditError);
          // Still navigate to result even if credit deduction fails (for mock mode)
        }

        console.log('🎉 [TryOnGear] Processing successful, navigating to result screen');
        navigation.navigate('TryOnGearResult');
      }
    } catch (error) {
      console.error('❌ [TryOnGear] Processing failed:', error);
      Alert.alert('Error', 'Processing failed. Please try again.');
    }
  };

  const handleReset = () => {
    console.log('🔄 [TryOnGear] Reset requested');
    Alert.alert(
      'Reset All',
      'Are you sure you want to reset all selections?',
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: () => console.log('❌ [TryOnGear] Reset cancelled')
        },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            console.log('🧹 [TryOnGear] Resetting all state...');
            dispatch(resetTryOnGearState());
            setExpandedMode('interactive'); // Reset to first accordion
            setSelectedModelIndex(0);
            MODE_OPTIONS.forEach((option) => {
              const animKey = option.id === 'multi-folder' ? 'multi-folder' : option.id;
              if (animations[animKey]) {
                // Reset to default: interactive expanded (1), others collapsed (0)
                animations[animKey].setValue(option.id === 'interactive' ? 1 : 0);
              }
            });
            // Set mode back to interactive after reset
            setTimeout(() => {
              dispatch(setMode('interactive'));
            }, 100);
            console.log('✅ [TryOnGear] State reset complete');
          }
        },
      ]
    );
  };

  const renderAccordionContent = (modeId) => {
    const contentHeight = animations[modeId].interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    if (expandedMode !== modeId) return null;

    if (modeId === 'interactive') {
      return (
        <View style={styles.accordionContent}>
          <Text style={styles.contentDescription}>
            Select a model from the available options and upload accessory images to try them on virtually.
          </Text>

          {/* Model Selection */}
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Select Model</Text>
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
                  <Image 
                    source={{ uri: model.uri }} 
                    style={styles.modelImage}
                    defaultSource={require('../../assets/icon.png')}
                  />
                  <Text style={styles.modelName}>{model.name}</Text>
                  {selectedModelIndex === index && (
                    <View style={styles.selectedIndicator}>
                      <Ionicons name="checkmark-circle" size={20} color="#7c3aed" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Accessory Upload Grid */}
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Upload Accessories</Text>
            <View style={styles.accessoryGrid}>
              {ACCESSORY_TYPES.map(({ type, label, icon }) => (
                <View key={type} style={styles.accessoryCard}>
                  <View style={styles.accessoryHeader}>
                    <Ionicons name={icon} size={18} color="#7c3aed" />
                    <Text style={styles.accessoryLabel}>{label}</Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.uploadButton,
                      accessories[type] && styles.uploadButtonActive
                    ]}
                    onPress={() => handleAccessoryPick(type)}
                  >
                    <Ionicons 
                      name={accessories[type] ? "checkmark-circle" : "cloud-upload-outline"} 
                      size={18} 
                      color={accessories[type] ? "#34C759" : "#7c3aed"} 
                    />
                    <Text style={[
                      styles.uploadButtonText,
                      accessories[type] && styles.uploadButtonTextActive
                    ]}>
                      {accessories[type] ? 'Uploaded' : 'Upload'}
                    </Text>
                  </TouchableOpacity>
                  {accessories[type] && (
                    <View style={styles.uploadedImageContainer}>
                      <Image 
                        source={{ uri: accessories[type].uri }} 
                        style={styles.accessoryPreview} 
                      />
                      <View style={styles.fileInfo}>
                        <Text style={styles.fileName} numberOfLines={1}>
                          {accessories[type].name || 'Selected'}
                        </Text>
                  <TouchableOpacity 
                    onPress={() => {
                      console.log('🗑️ [TryOnGear] Removing accessory:', type);
                      dispatch(removeAccessoryImage(type));
                      console.log('✅ [TryOnGear] Accessory removed');
                    }}
                    style={styles.removeButton}
                  >
                    <Ionicons name="close-circle" size={18} color="#ef4444" />
                  </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Process Button */}
          <TouchableOpacity
            style={[styles.processButton, !isInteractiveReady && styles.processButtonDisabled]}
            onPress={handleProcess}
            disabled={!isInteractiveReady || status === 'processing'}
          >
            <LinearGradient
              colors={isInteractiveReady ? ['#7c3aed', '#a855f7'] : ['#e5e7eb', '#d1d5db']}
              style={styles.buttonGradient}
            >
              {status === 'processing' ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={[styles.processButtonText, !isInteractiveReady && styles.processButtonTextDisabled]}>
                    Process Try-On
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color={isInteractiveReady ? "#fff" : "#999"} />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      );
    }

    if (modeId === 'folder') {
      return (
        <View style={styles.accordionContent}>
          <Text style={styles.contentDescription}>
            Upload a folder with structured images. Follow the guide for proper folder structure.
          </Text>

          <View style={styles.subsection}>
            <View style={styles.subsectionHeader}>
              <Text style={styles.subsectionTitle}>Select Folder</Text>
              <TouchableOpacity onPress={() => setShowFolderGuide(true)}>
                <View style={styles.guideButton}>
                  <Ionicons name="information-circle-outline" size={18} color="#10b981" />
                  <Text style={styles.guideButtonText}>Guide</Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>
              Folder must contain a model image (required) and accessory images (optional).
            </Text>
            <TouchableOpacity 
              style={styles.folderButton} 
              onPress={handleFolderPick}
            >
              <Ionicons name="folder-open-outline" size={24} color="#10b981" />
              <Text style={styles.folderButtonText}>
                {folderImages.length > 0 
                  ? `${folderImages.length} images selected` 
                  : 'Select Folder Images'}
              </Text>
            </TouchableOpacity>
            
            {folderImages.length > 0 && (
              <View style={styles.folderInfo}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.folderInfoText}>
                  {folderImages.length} image{folderImages.length > 1 ? 's' : ''} ready
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.processButton, !isFolderReady && styles.processButtonDisabled]}
              onPress={handleProcess}
              disabled={!isFolderReady || status === 'processing'}
            >
              <LinearGradient
                colors={isFolderReady ? ['#10b981', '#059669'] : ['#e5e7eb', '#d1d5db']}
                style={styles.buttonGradient}
              >
                {status === 'processing' ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={[styles.processButtonText, !isFolderReady && styles.processButtonTextDisabled]}>
                      Process Folder
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color={isFolderReady ? "#fff" : "#999"} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (modeId === 'multi-folder') {
      return (
        <View style={styles.accordionContent}>
          <Text style={styles.contentDescription}>
            Upload multiple folders for batch processing. Each folder will be processed independently.
          </Text>

          <View style={styles.subsection}>
            <View style={styles.subsectionHeader}>
              <Text style={styles.subsectionTitle}>Select Folders</Text>
              <TouchableOpacity onPress={() => setShowMultiFolderGuide(true)}>
                <View style={styles.guideButton}>
                  <Ionicons name="information-circle-outline" size={18} color="#f59e0b" />
                  <Text style={styles.guideButtonText}>Guide</Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>
              Select folders one by one. Each folder must follow the required structure.
            </Text>
            <TouchableOpacity 
              style={styles.folderButton} 
              onPress={handleMultiFolderPick}
            >
              <Ionicons name="albums-outline" size={24} color="#f59e0b" />
              <Text style={styles.folderButtonText}>
                {multiFolderImages.length > 0
                  ? `${multiFolderImages.length} folder${multiFolderImages.length > 1 ? 's' : ''} selected`
                  : 'Select Multiple Folders'}
              </Text>
            </TouchableOpacity>
            
            {multiFolderImages.length > 0 && (
              <View style={styles.folderInfo}>
                <Ionicons name="checkmark-circle" size={20} color="#f59e0b" />
                <Text style={styles.folderInfoText}>
                  {multiFolderImages.length} folder{multiFolderImages.length > 1 ? 's' : ''} ready
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.processButton, !isMultiFolderReady && styles.processButtonDisabled]}
              onPress={handleProcess}
              disabled={!isMultiFolderReady || status === 'processing'}
            >
              <LinearGradient
                colors={isMultiFolderReady ? ['#f59e0b', '#d97706'] : ['#e5e7eb', '#d1d5db']}
                style={styles.buttonGradient}
              >
                {status === 'processing' ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={[styles.processButtonText, !isMultiFolderReady && styles.processButtonTextDisabled]}>
                      Process Multi-Folder
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color={isMultiFolderReady ? "#fff" : "#999"} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TRY-ON GEAR</Text>
        <View style={styles.headerRight}>
          <CreditsDisplay 
            onPress={() => {
              // Show credits info only
            }}
            style={styles.creditsDisplay}
          />
          <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
            <Ionicons name="refresh-outline" size={24} color="#7c3aed" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>Choose Your Processing Mode</Text>
          <Text style={styles.introSubtitle}>
            Select how you want to try on accessories with AI-powered virtual fitting
          </Text>
        </View>

        {/* Accordion Options */}
        <View style={styles.accordionContainer}>
          {MODE_OPTIONS.map((option) => {
            const isExpanded = expandedMode === option.id;
            const rotate = animations[option.id].interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '180deg'],
            });

            return (
              <View key={option.id} style={styles.accordionItem}>
                <TouchableOpacity
                  style={[
                    styles.accordionHeader,
                    isExpanded && { backgroundColor: `${option.color}15` }
                  ]}
                  onPress={() => toggleAccordion(option.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.accordionHeaderLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: `${option.color}20` }]}>
                      <Ionicons name={option.icon} size={24} color={option.color} />
                    </View>
                    <View style={styles.accordionTextContainer}>
                      <Text style={styles.accordionTitle}>{option.title}</Text>
                      <Text style={styles.accordionSubtitle}>{option.subtitle}</Text>
                    </View>
                  </View>
                  <Animated.View style={{ transform: [{ rotate }] }}>
                    <Ionicons name="chevron-down" size={24} color={option.color} />
                  </Animated.View>
                </TouchableOpacity>
                
                {isExpanded && renderAccordionContent(option.id)}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Folder Guide Modals */}
      <Modal visible={showFolderGuide} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📋 Folder Structure Guide</Text>
              <TouchableOpacity onPress={() => setShowFolderGuide(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.codeBlock}>
                <Text style={styles.codeText}>your_folder/</Text>
                <Text style={styles.codeText}>├── model.jpeg (REQUIRED)</Text>
                <Text style={styles.codeText}>├── shirt.jpeg (optional)</Text>
                <Text style={styles.codeText}>├── jacket.jpeg (optional)</Text>
                <Text style={styles.codeText}>├── pants.jpeg (optional)</Text>
                <Text style={styles.codeText}>├── shoes.jpeg (optional)</Text>
                <Text style={styles.codeText}>├── glasses.jpeg (optional)</Text>
                <Text style={styles.codeText}>└── watch.jpeg (optional)</Text>
              </View>
              <View style={styles.guideRules}>
                <Text style={styles.guideRulesTitle}>Important:</Text>
                <Text style={styles.guideRuleItem}>• Model image is REQUIRED</Text>
                <Text style={styles.guideRuleItem}>• Follow exact naming convention</Text>
                <Text style={styles.guideRuleItem}>• Supported: JPEG, PNG, JPG</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={showMultiFolderGuide} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📋 Multi-Folder Guide</Text>
              <TouchableOpacity onPress={() => setShowMultiFolderGuide(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.codeBlock}>
                <Text style={styles.codeText}>parent_folder/</Text>
                <Text style={styles.codeText}>├── folder1/</Text>
                <Text style={styles.codeText}>│   ├── model.jpeg (REQUIRED)</Text>
                <Text style={styles.codeText}>│   └── accessories...</Text>
                <Text style={styles.codeText}>├── folder2/</Text>
                <Text style={styles.codeText}>│   └── (same structure)</Text>
                <Text style={styles.codeText}>└── folder3/</Text>
                <Text style={styles.codeText}>    └── (same structure)</Text>
              </View>
              <View style={styles.guideRules}>
                <Text style={styles.guideRulesTitle}>Important:</Text>
                <Text style={styles.guideRuleItem}>• Each folder needs a model image</Text>
                <Text style={styles.guideRuleItem}>• Folders processed independently</Text>
                <Text style={styles.guideRuleItem}>• Select folders one by one</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Insufficient Credits Modal */}
      <InsufficientCreditsModal
        visible={showInsufficientCredits}
        onClose={() => setShowInsufficientCredits(false)}
        onSubscribe={() => {
          setShowInsufficientCredits(false);
          // User can navigate to subscription from home screen
          Alert.alert(
            'Upgrade to PRO',
            'Visit the home screen to upgrade to PRO and get more credits.',
            [
              { text: 'OK', onPress: () => navigation.goBack() }
            ]
          );
        }}
        creditsNeeded={creditsNeeded}
        currentBalance={balance}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
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
  resetButton: {
    padding: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  creditsDisplay: {
    marginRight: 0,
  },
  scrollView: {
    flex: 1,
  },
  introSection: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  introTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  introSubtitle: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  accordionContainer: {
    padding: 20,
    gap: 16,
  },
  accordionItem: {
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
  },
  accordionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accordionTextContainer: {
    flex: 1,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  accordionSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  accordionContent: {
    padding: 20,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  contentDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  subsection: {
    marginBottom: 20,
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
    color: '#1a1a1a',
    marginBottom: 12,
  },
  guideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  guideButtonText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  helperText: {
    fontSize: 13,
    color: '#999',
    marginBottom: 12,
    lineHeight: 18,
  },
  modelSlider: {
    marginVertical: 8,
  },
  modelCard: {
    width: 100,
    marginRight: 12,
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  modelCardSelected: {
    borderColor: '#7c3aed',
    backgroundColor: '#f5f3ff',
  },
  modelImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
  },
  modelName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  accessoryGrid: {
    // two columns
   
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    width: '100%',
  },
  accessoryCard: {
    width: '48%', // Two columns: 48% width with gap between
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fafafa',
  },
  accessoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  accessoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#7c3aed',
    borderStyle: 'dashed',
    backgroundColor: '#fff',
  },
  uploadButtonActive: {
    borderColor: '#34C759',
    borderStyle: 'solid',
    backgroundColor: '#f0fdf4',
  },
  uploadButtonText: {
    fontSize: 12,
    color: '#7c3aed',
    fontWeight: '600',
  },
  uploadButtonTextActive: {
    color: '#34C759',
  },
  uploadedImageContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  accessoryPreview: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginBottom: 6,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fileName: {
    fontSize: 11,
    color: '#666',
    flex: 1,
  },
  removeButton: {
    padding: 4,
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
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    marginBottom: 12,
  },
  folderButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  folderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  folderInfoText: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '600',
  },
  processButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  processButtonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  processButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  processButtonTextDisabled: {
    color: '#999',
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
    maxHeight: '80%',
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
  codeBlock: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#333',
    lineHeight: 20,
  },
  guideRules: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  guideRulesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 8,
  },
  guideRuleItem: {
    fontSize: 13,
    color: '#78350f',
    lineHeight: 20,
    marginBottom: 4,
  },
});

export default TryOnGearScreen;
