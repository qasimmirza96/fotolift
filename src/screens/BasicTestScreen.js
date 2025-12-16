import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { photosActions } from '../store/simpleStore';

console.log('🧪 BasicTestScreen: Loading...');

const BasicTestScreen = () => {
  console.log('🧪 BasicTestScreen: Rendering...');
  
  const dispatch = useDispatch();
  const { photos, isLoading, error } = useSelector(state => state.photos);
  const { isAuthenticated } = useSelector(state => state.auth);

  console.log('📊 Redux State:', { photosCount: photos.length, isLoading, isAuthenticated });

  const handleTest = () => {
    console.log('🔄 Test button pressed');
    dispatch(photosActions.setLoading(true));
    
    // Simulate API call
    setTimeout(() => {
      const mockPhotos = [
        { id: 1, title: 'Photo 1', url: 'https://picsum.photos/200/300' },
        { id: 2, title: 'Photo 2', url: 'https://picsum.photos/200/301' },
        { id: 3, title: 'Photo 3', url: 'https://picsum.photos/200/302' },
      ];
      dispatch(photosActions.setPhotos(mockPhotos));
      console.log('✅ Mock photos loaded');
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Basic Redux Test</Text>
      <Text style={styles.status}>Photos: {photos.length}</Text>
      <Text style={styles.status}>Loading: {isLoading ? 'Yes' : 'No'}</Text>
      <Text style={styles.status}>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</Text>
      
      {error && (
        <Text style={styles.error}>Error: {error.toString()}</Text>
      )}
      
      <TouchableOpacity style={styles.button} onPress={handleTest}>
        <Text style={styles.buttonText}>
          {isLoading ? 'Loading...' : 'Load Mock Photos'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    marginBottom: 10,
  },
  error: {
    fontSize: 14,
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

console.log('✅ BasicTestScreen: Created successfully');

export default BasicTestScreen;