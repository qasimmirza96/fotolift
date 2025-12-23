import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Video } from 'expo-av';
import { useSelector, useDispatch } from 'react-redux';
import { resetImageToVideo } from '../store/slices/imageToVideoSlice';
import ResultFooter from '../components/ResultFooter';

const ImageToVideoResultScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { generatedVideo, sourceImage, prompt } = useSelector(state => state.imageToVideo);
  const [isDownloading, setIsDownloading] = useState(false);
  const [videoStatus, setVideoStatus] = useState({});

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // TODO: Implement actual video download
      // For now, show info about placeholder
      if (generatedVideo?.videoUrl.includes('w3schools')) {
        Alert.alert(
          'Info',
          'This is a placeholder video. In production, your generated video will be downloaded.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to download video');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRepeat = () => {
    dispatch(resetImageToVideo());
    navigation.navigate('ImageToVideo');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.header}>
        <TouchableOpacity onPress={handleRepeat} style={styles.backButton}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Video Generated</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Success Section */}
        <View style={styles.successSection}>
          <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.successIcon}>
            <Ionicons name="checkmark" size={48} color="#fff" />
          </LinearGradient>
          <Text style={styles.successTitle}>Video Ready!</Text>
          <Text style={styles.successText}>
            Your AI-generated video has been created successfully
          </Text>
        </View>

        {/* Video Player */}
        <View style={styles.videoSection}>
          <View style={styles.videoHeader}>
            <Ionicons name="videocam" size={20} color="#7c3aed" />
            <Text style={styles.sectionTitle}>Generated Video</Text>
          </View>
          
          <View style={styles.videoWrapper}>
            <Video
              source={{ uri: generatedVideo?.videoUrl }}
              style={styles.video}
              useNativeControls
              resizeMode="contain"
              isLooping
              onPlaybackStatusUpdate={setVideoStatus}
            />
            <View style={styles.videoBadge}>
              <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.badgeGradient}>
                <Ionicons name="sparkles" size={14} color="#fff" />
                <Text style={styles.badgeText}>AI Generated</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Video Info */}
          <View style={styles.videoInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="time" size={18} color="#666" />
              <Text style={styles.infoText}>Duration: {generatedVideo?.duration || 5}s</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="film" size={18} color="#666" />
              <Text style={styles.infoText}>Format: MP4</Text>
            </View>
          </View>
        </View>

        {/* Prompt Used */}
        <View style={styles.promptSection}>
          <View style={styles.promptHeader}>
            <Ionicons name="create" size={20} color="#7c3aed" />
            <Text style={styles.sectionTitle}>Prompt Used</Text>
          </View>
          <View style={styles.promptCard}>
            <Text style={styles.promptText}>{prompt}</Text>
          </View>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <LinearGradient colors={['#ede9fe', '#fff']} style={styles.featureCard}>
            <Ionicons name="flash" size={32} color="#7c3aed" />
            <Text style={styles.featureTitle}>High Quality</Text>
            <Text style={styles.featureText}>AI-powered video generation</Text>
          </LinearGradient>
          <LinearGradient colors={['#ede9fe', '#fff']} style={styles.featureCard}>
            <Ionicons name="color-wand" size={32} color="#7c3aed" />
            <Text style={styles.featureTitle}>Realistic Motion</Text>
            <Text style={styles.featureText}>Natural movement effects</Text>
          </LinearGradient>
        </View>
      </ScrollView>

      <ResultFooter 
        isDownloading={isDownloading}
        onDownload={handleDownload}
        onRepeat={handleRepeat}
        downloadText="Download Video"
        mode="single"
      />
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
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
  },
  successSection: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  successText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  videoSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 12,
  },
  videoHeader: {
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
  videoWrapper: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: 300,
  },
  videoBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  badgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  videoInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fafafa',
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  promptSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 12,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  promptCard: {
    padding: 16,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ede9fe',
  },
  promptText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  featuresSection: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  featureCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ede9fe',
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginTop: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default ImageToVideoResultScreen;
