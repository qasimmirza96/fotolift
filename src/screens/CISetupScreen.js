import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { setMode } from '../store/slices/centralizedImageSlice';

const CISetupScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const handleSingleImage = () => {
    dispatch(setMode('single'));
    navigation.navigate('CISingleImage');
  };

  const handleFolder = () => {
    dispatch(setMode('folder'));
    navigation.navigate('CIFolder');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>AI Background Remover</Text>
        <View style={styles.placeholder} />
      </View>

      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.heroSection}>
        <Ionicons name="crop" size={80} color="#fff" />
        <Text style={styles.heroTitle}>Center Your Images</Text>
        <Text style={styles.heroSubtitle}>
          Automatically center and crop images for perfect composition
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Choose Mode</Text>
        
        <TouchableOpacity style={styles.optionCard} onPress={handleSingleImage}>
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.optionGradient}>
            <Ionicons name="image" size={40} color="#fff" />
          </LinearGradient>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Single Image</Text>
            <Text style={styles.optionDescription}>Center one image at a time</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={handleFolder}>
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.optionGradient}>
            <Ionicons name="images" size={40} color="#fff" />
          </LinearGradient>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Multiple Images</Text>
            <Text style={styles.optionDescription}>Center multiple images at once</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
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
    backgroundColor: '#667eea',
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
  heroSection: {
    padding: 40,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 22,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 20,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  optionGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: {
    flex: 1,
    marginLeft: 16,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default CISetupScreen;
