import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { resetTryOnState } from '../store/slices/aiModelTryOnSlice';
import { downloadImage, downloadImagesAsZip } from '../utils/downloadUtils';
import ResultFooter from '../components/ResultFooter';

const AITryOnResultScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { clothImage, clothFolder, modelImage, mode } = useSelector(state => state.aiModelTryOn);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    console.log('📥 AI: Downloading try-on result...');
    console.log('📊 AI: Mode:', mode);
    setIsDownloading(true);
    
    try {
      if (mode === 'single' && modelImage) {
        console.log('🖼️ AI: Downloading single result');
        await downloadImage(modelImage.uri, `TryOn_Result_${Date.now()}.jpg`);
      } else if (mode === 'folder' && clothFolder) {
        console.log('📁 AI: Downloading folder as ZIP');
        console.log('📊 AI: Folder files count:', clothFolder.files?.length || clothFolder.fileCount);
        const imageUris = clothFolder.files ? clothFolder.files.map(file => file.uri) : [];
        console.log('📊 AI: Image URIs:', imageUris.length);
        await downloadImagesAsZip(imageUris, `TryOn_Results_${Date.now()}.zip`);
      }
      console.log('✅ AI: Download completed');
    } catch (error) {
      console.error('❌ AI: Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRepeat = () => {
    dispatch(resetTryOnState());
    navigation.navigate('AIModelTryOn');
  };

  const handleHome = () => {
    dispatch(resetTryOnState());
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.header}>
        <TouchableOpacity onPress={handleHome} style={styles.backButton}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Try-On Result</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.successSection}>
          <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.successIcon}>
            <Ionicons name="checkmark" size={48} color="#fff" />
          </LinearGradient>
          <Text style={styles.successTitle}>Try-On Complete!</Text>
          <Text style={styles.successText}>
            {mode === 'single' 
              ? 'Your virtual try-on has been generated successfully.'
              : `${clothFolder?.fileCount || 0} try-on results have been generated.`}
          </Text>
        </View>

        {/* Result Preview */}
        {mode === 'single' && modelImage && (
          <View style={styles.resultSection}>
            <Text style={styles.resultLabel}>Result Preview</Text>
            <View style={styles.comparisonContainer}>
              {/* Original Model */}
              {/* <View style={styles.comparisonItem}>
                <Text style={styles.comparisonLabel}>Original</Text>
                <Image source={{ uri: modelImage.uri }} style={styles.comparisonImage} />
              </View> */}
              
              {/* Try-On Result */}
              <View style={styles.comparisonItem}>
                <Text style={styles.comparisonLabel}>Try-On Result</Text>
                <View style={styles.resultImageWrapper}>
                  <Image source={{ uri: modelImage.uri }} style={styles.comparisonImage} />
                  <View style={styles.resultBadge}>
                    <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.badgeGradient}>
                      <Ionicons name="sparkles" size={16} color="#fff" />
                      <Text style={styles.badgeText}>AI Generated</Text>
                    </LinearGradient>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Multiple Results */}
        {mode === 'folder' && clothFolder && clothFolder.fileCount > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.resultLabel}>Generated Results</Text>
            <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.bulkInfo}>
              <Ionicons name="images" size={32} color="#fff" />
              <Text style={styles.bulkText}>{clothFolder.fileCount} try-on results ready</Text>
            </LinearGradient>
            <View style={styles.folderIconContainer}>
              <Ionicons name="folder" size={80} color="#7c3aed" />
              <Text style={styles.folderText}>{clothFolder.name}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <ResultFooter 
        isDownloading={isDownloading}
        onDownload={handleDownload}
        onRepeat={handleRepeat}
        downloadText="Download Result"
        mode={mode}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  resultSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 12,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  comparisonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  comparisonItem: {
    flex: 1,
  },
  comparisonLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  comparisonImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  resultImageWrapper: {
    position: 'relative',
  },
  resultBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  badgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  bulkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  bulkText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  resultsScroll: {
    flexDirection: 'row',
  },
  resultThumb: {
    position: 'relative',
    marginRight: 12,
  },
  thumbImage: {
    width: 120,
    height: 160,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  thumbBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  thumbBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  folderIconContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
  folderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginTop: 12,
  },
});

export default AITryOnResultScreen;
