import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setMode } from '../store/slices/bgrSlice';

const BGRSetupScreen = ({ onContinue, onBack }) => {
  const dispatch = useDispatch();
  const { mode } = useSelector(state => state.bgr);

  const handleModeSelect = (selectedMode) => {
    dispatch(setMode(selectedMode));
  };

  const handleContinue = () => {
    if (mode) {
      onContinue(mode);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient
        colors={['#f8f6fc', '#ffffff', '#ffffff']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#663399" />
          </TouchableOpacity>
          <Text style={styles.title}>Background Remover</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.heroSection}>
            <View style={styles.heroImageContainer}>
              <LinearGradient
                colors={['#7c3aed', '#663399', '#9333ea']}
                style={styles.heroGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="images" size={60} color="rgba(255,255,255,0.9)" />
              </LinearGradient>
            </View>
            <Text style={styles.heroTitle}>Remove Backgrounds</Text>
            <Text style={styles.heroDesc}>Instantly remove backgrounds from your images with AI precision</Text>
          </View>

          <Text style={styles.subtitle}>Choose how you want to process your images</Text>

        {/* Single Image Option */}
        <TouchableOpacity
          style={[styles.modeCard, mode === 'single' && styles.modeCardActive]}
          onPress={() => handleModeSelect('single')}
          activeOpacity={0.7}
        >
          <View style={styles.modeHeader}>
            {mode === 'single' ? (
              <LinearGradient
                colors={['#7c3aed', '#663399']}
                style={styles.iconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="image" size={32} color="#fff" />
              </LinearGradient>
            ) : (
              <View style={styles.iconContainer}>
                <Ionicons name="image-outline" size={32} color="#663399" />
              </View>
            )}
            <View style={styles.radioContainer}>
              <View style={[styles.radio, mode === 'single' && styles.radioActive]}>
                {mode === 'single' && <View style={styles.radioDot} />}
              </View>
            </View>
          </View>
          <Text style={styles.modeTitle}>Single Image</Text>
          <Text style={styles.modeDesc}>Upload one image and optionally apply a background</Text>
        </TouchableOpacity>

        {/* Folder Upload Option */}
        <TouchableOpacity
          style={[styles.modeCard, mode === 'folder' && styles.modeCardActive]}
          onPress={() => handleModeSelect('folder')}
          activeOpacity={0.7}
        >
          <View style={styles.modeHeader}>
            {mode === 'folder' ? (
              <LinearGradient
                colors={['#7c3aed', '#663399']}
                style={styles.iconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="folder" size={32} color="#fff" />
              </LinearGradient>
            ) : (
              <View style={styles.iconContainer}>
                <Ionicons name="folder-outline" size={32} color="#663399" />
              </View>
            )}
            <View style={styles.radioContainer}>
              <View style={[styles.radio, mode === 'folder' && styles.radioActive]}>
                {mode === 'folder' && <View style={styles.radioDot} />}
              </View>
            </View>
          </View>
          <Text style={styles.modeTitle}>Folder Upload</Text>
          <Text style={styles.modeDesc}>Upload a folder containing multiple images</Text>
        </TouchableOpacity>
      </ScrollView>

        <View style={styles.footer}>
          {mode ? (
            <TouchableOpacity onPress={handleContinue} activeOpacity={0.8}>
              <LinearGradient
                colors={['#7c3aed', '#663399']}
                style={styles.continueButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.arrowIcon} />
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.continueButtonDisabled}>
              <Text style={styles.continueButtonTextDisabled}>Select an option to continue</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f6fc',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: 0.3,
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 8,
  },
  heroImageContainer: {
    marginBottom: 16,
  },
  heroGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#663399',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  heroDesc: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modeCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e8e4f3',
    shadowColor: '#663399',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  modeCardActive: {
    borderColor: '#7c3aed',
    backgroundColor: '#faf9fc',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    transform: [{ scale: 1.02 }],
  },
  modeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    backgroundColor: '#f3f0f9',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#663399',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  radioContainer: {
    padding: 5,
  },
  radio: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2.5,
    borderColor: '#d4c9e8',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  radioActive: {
    borderColor: '#7c3aed',
  },
  radioDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#7c3aed',
  },
  modeTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  modeDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 21,
  },
  footer: {
    padding: 20,
    paddingBottom: 10,
  },
  continueButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#663399',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonDisabled: {
    backgroundColor: '#e8e4f3',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  continueButtonTextDisabled: {
    color: '#a89fc4',
    fontSize: 16,
    fontWeight: '600',
  },
  arrowIcon: {
    marginLeft: 8,
  },
});

export default BGRSetupScreen;