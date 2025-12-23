import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, ActivityIndicator, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { setSourceImage, setPrompt, generateVideo, resetImageToVideo } from '../store/slices/imageToVideoSlice';
import { pickImage } from '../utils/folderPicker';

const ImageToVideoScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { sourceImage, prompt, status, progress } = useSelector(state => state.imageToVideo);
  
  const [localPrompt, setLocalPrompt] = useState(prompt || '');
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (status === 'generating') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [status]);

  const handlePickImage = async () => {
    try {
      const image = await pickImage();
      if (image) {
        dispatch(setSourceImage(image));
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to pick image');
    }
  };

  const handlePromptChange = (text) => {
    setLocalPrompt(text);
  };

  const updateReduxPrompt = () => {
    if (localPrompt !== prompt) {
      dispatch(setPrompt(localPrompt));
    }
  };

  const handleGenerate = async () => {
    if (!sourceImage) {
      Alert.alert('Missing Image', 'Please select an image first.');
      return;
    }

    if (!localPrompt.trim()) {
      Alert.alert('Missing Prompt', 'Please enter a prompt to describe the video.');
      return;
    }

    try {
      await dispatch(generateVideo({ sourceImage, prompt: localPrompt })).unwrap();
      navigation.navigate('ImageToVideoResult');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate video. Please try again.');
    }
  };

  const handleReset = () => {
    setLocalPrompt('');
    dispatch(resetImageToVideo());
  };

  const isReady = sourceImage && localPrompt.trim().length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Image to Video</Text>
        <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
          <Ionicons name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient colors={['#ede9fe', '#fff']} style={styles.heroSection}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.heroIcon}>
              <Ionicons name="videocam" size={40} color="#fff" />
            </LinearGradient>
          </Animated.View>
          <Text style={styles.heroTitle}>Bring Images to Life</Text>
          <Text style={styles.heroSubtitle}>
            Transform static images into dynamic videos with AI
          </Text>
        </LinearGradient>

        {/* Image Upload Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="image" size={20} color="#7c3aed" />
            <Text style={styles.sectionTitle}>Source Image</Text>
          </View>
          
          {sourceImage ? (
            <View style={styles.imagePreview}>
              <Image source={{ uri: sourceImage.uri }} style={styles.previewImage} />
              <TouchableOpacity onPress={handleReset} style={styles.removeIcon}>
                <Ionicons name="close-circle" size={32} color="#FF3B30" />
              </TouchableOpacity>
              <View style={styles.imageBadge}>
                <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.badgeGradient}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                  <Text style={styles.badgeText}>Selected</Text>
                </LinearGradient>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadCard} onPress={handlePickImage}>
              <LinearGradient colors={['#ede9fe', '#fff']} style={styles.uploadIconWrapper}>
                <Ionicons name="cloud-upload" size={48} color="#7c3aed" />
              </LinearGradient>
              <Text style={styles.uploadTitle}>Upload Image</Text>
              <Text style={styles.uploadSubtitle}>Tap to select from gallery</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Prompt Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="create" size={20} color="#7c3aed" />
            <Text style={styles.sectionTitle}>Video Prompt</Text>
          </View>
          
          <View style={styles.promptCard}>
            <TextInput
              style={styles.promptInput}
              placeholder="Describe the video you want to create...&#10;&#10;Example: Make the person smile and wave at the camera"
              placeholderTextColor="#999"
              multiline
              numberOfLines={6}
              value={localPrompt}
              onChangeText={handlePromptChange}
              onBlur={updateReduxPrompt}
              textAlignVertical="top"
            />
            <View style={styles.promptFooter}>
              <Text style={styles.charCount}>{localPrompt.length} characters</Text>
              {localPrompt.length > 0 && (
                <TouchableOpacity onPress={() => handlePromptChange('')}>
                  <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Prompt Suggestions */}
          <View style={styles.suggestions}>
            <Text style={styles.suggestionsTitle}>Quick Prompts:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                'Make the person smile',
                'Add gentle movement',
                'Create a cinematic effect',
                'Add wind effect to hair',
              ].map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionChip}
                  onPress={() => handlePromptChange(suggestion)}
                >
                  <LinearGradient colors={['#ede9fe', '#fff']} style={styles.chipGradient}>
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Progress Section */}
        {status === 'generating' && (
          <View style={styles.section}>
            <LinearGradient colors={['#ede9fe', '#fff']} style={styles.progressCard}>
              <ActivityIndicator size="large" color="#7c3aed" />
              <Text style={styles.progressTitle}>Generating Video...</Text>
              <Text style={styles.progressSubtitle}>This may take a few moments</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressText}>{progress}%</Text>
            </LinearGradient>
          </View>
        )}
      </ScrollView>

      {/* Generate Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.generateButton, !isReady && styles.generateButtonDisabled]}
          onPress={handleGenerate}
          disabled={!isReady || status === 'generating'}
        >
          <LinearGradient
            colors={isReady ? ['#7c3aed', '#a855f7'] : ['#ccc', '#999']}
            style={styles.generateGradient}
          >
            {status === 'generating' ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="play-circle" size={24} color="#fff" />
                <Text style={styles.generateButtonText}>Generate Video</Text>
              </>
            )}
          </LinearGradient>
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
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  resetButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    padding: 32,
    alignItems: 'center',
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  uploadCard: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ede9fe',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
  },
  uploadIconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  imagePreview: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  removeIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  imageBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  badgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  promptCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ede9fe',
    backgroundColor: '#fafafa',
    overflow: 'hidden',
  },
  promptInput: {
    padding: 16,
    fontSize: 15,
    color: '#000',
    minHeight: 150,
  },
  promptFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ede9fe',
  },
  charCount: {
    fontSize: 13,
    color: '#999',
  },
  suggestions: {
    marginTop: 16,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  suggestionChip: {
    marginRight: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  chipGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ede9fe',
  },
  suggestionText: {
    fontSize: 13,
    color: '#7c3aed',
    fontWeight: '500',
  },
  progressCard: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 16,
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#ede9fe',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7c3aed',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7c3aed',
    marginTop: 8,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ede9fe',
  },
  generateButton: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  generateButtonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  generateGradient: {
    flexDirection: 'row',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default ImageToVideoScreen;
