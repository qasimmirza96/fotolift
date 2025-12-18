import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { setMode } from '../store/slices/wrinkleRemoverSlice';

const WRSetupScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const handleSingleImage = () => {
    dispatch(setMode('single'));
    navigation.navigate('WRSingleImage');
  };

  const handleFolder = () => {
    dispatch(setMode('folder'));
    navigation.navigate('WRFolder');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Wrinkle Remover</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="shirt-outline" size={64} color="#663399" />
        </View>

        <Text style={styles.heading}>Remove Wrinkles</Text>
        <Text style={styles.description}>
          Make clothes look neat and wrinkle-free. Process one or multiple images at once.
        </Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionCard} onPress={handleSingleImage}>
            <Ionicons name="image" size={32} color="#663399" />
            <Text style={styles.optionTitle}>Single Image</Text>
            <Text style={styles.optionDescription}>Process one image</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard} onPress={handleFolder}>
            <Ionicons name="images" size={32} color="#663399" />
            <Text style={styles.optionTitle}>Multiple Images</Text>
            <Text style={styles.optionDescription}>Select multiple images</Text>
          </TouchableOpacity>
        </View>
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
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  optionCard: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginTop: 12,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
});

export default WRSetupScreen;
