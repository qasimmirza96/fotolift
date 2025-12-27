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
  const { clothImage, modelImage, clothImages, mode } = useSelector(state => state.aiModelTryOn);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    console.log('📥 Downloading try-on result...');
    setIsDownloading(true);
    
    try {
      if (mode === 'single' && clothImage && modelImage) {
        await downloadImage(modelImage.uri, `TryOn_Result_${Date.now()}.jpg`);
      } else if (mode === 'bulk' && clothImages.length > 0) {
        const imageUris = clothImages.map(img => img.uri);
        await downloadImagesAsZip(imageUris, `TryOn_Results_${Date.now()}.zip`);
      }
    } catch (error) {
      console.error('❌ Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRepeat = () => {
    dispatch(resetTryOnState());
    navigation.goBack();
  };

  const handleClose = () => {
    navigation.goBack();
  };

  

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.backButton}>
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
              : `${clothImages?.length || 0} try-on results have been generated.`}
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
        {mode === 'bulk' && clothImages && clothImages.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.resultLabel}>Generated Results</Text>
            <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.bulkInfo}>
              <Ionicons name="images" size={32} color="#fff" />
              <Text style={styles.bulkText}>{clothImages.length} try-on results ready</Text>
            </LinearGradient>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.resultsScroll}>
              {clothImages.map((img, index) => (
                <View key={index} style={styles.resultThumb}>
                  <Image source={{ uri: img.uri }} style={styles.thumbImage} />
                  <View style={styles.thumbBadge}>
                    <Text style={styles.thumbBadgeText}>#{index + 1}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.downloadButton} 
          onPress={handleDownload}
          disabled={isDownloading}
        >
          <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.downloadGradient}>
            {isDownloading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="download" size={20} color="#fff" />
            )}
            <Text style={styles.downloadButtonText}>
              {isDownloading ? 'Downloading...' : mode === 'bulk' ? 'Download All' : 'Download Result'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeButton} onPress={handleHome}>
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View> */}
      <ResultFooter 
        isDownloading={isDownloading}
        onDownload={handleDownload}
        onRepeat={handleRepeat}
        downloadText={mode === 'bulk' ? 'Download All' : 'Download'}
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
  footer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  downloadButton: {
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 12,
  },
  downloadGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#7c3aed',
  },
  homeButtonText: {
    color: '#7c3aed',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AITryOnResultScreen;
