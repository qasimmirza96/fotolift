import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#663399" />
        </TouchableOpacity>
        <Text style={styles.title}>Background Remover</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Choose how you want to process your images</Text>

        {/* Single Image Option */}
        <TouchableOpacity
          style={[styles.modeCard, mode === 'single' && styles.modeCardActive]}
          onPress={() => handleModeSelect('single')}
        >
          <View style={styles.modeHeader}>
            <View style={[styles.iconContainer, mode === 'single' && styles.iconContainerActive]}>
              <Ionicons name="image-outline" size={32} color={mode === 'single' ? '#fff' : '#663399'} />
            </View>
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
        >
          <View style={styles.modeHeader}>
            <View style={[styles.iconContainer, mode === 'folder' && styles.iconContainerActive]}>
              <Ionicons name="folder-outline" size={32} color={mode === 'folder' ? '#fff' : '#663399'} />
            </View>
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
        <TouchableOpacity
          style={[styles.continueButton, !mode && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!mode}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
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
  subtitle: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 30,
  },
  modeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#e6e6fa',
  },
  modeCardActive: {
    borderColor: '#663399',
    backgroundColor: '#f9f7fc',
  },
  modeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    backgroundColor: '#f9f7fc',
    borderRadius: 16,
    padding: 15,
  },
  iconContainerActive: {
    backgroundColor: '#663399',
  },
  radioContainer: {
    padding: 5,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e6e6fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: '#663399',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#663399',
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  modeDesc: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e6e6fa',
  },
  continueButton: {
    backgroundColor: '#663399',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#e6e6fa',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BGRSetupScreen;