import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPhotos } from '../store/slices/photoSlice';

console.log('🚀 SimpleTestScreen: Loading...');

const SimpleTestScreen = () => {
  console.log('🧪 SimpleTestScreen: Rendering...');
  
  const dispatch = useDispatch();
  const { photos, isLoading, error } = useSelector(state => state.photos);
  const { isAuthenticated } = useSelector(state => state.auth);

  console.log('📊 Redux State:', { photosCount: photos.length, isLoading, isAuthenticated });

  useEffect(() => {
    console.log('🔄 SimpleTestScreen: useEffect - fetching photos');
    dispatch(fetchPhotos());
  }, [dispatch]);

  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    dispatch(fetchPhotos());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redux Test Screen</Text>
      <Text style={styles.status}>Photos: {photos.length}</Text>
      <Text style={styles.status}>Loading: {isLoading ? 'Yes' : 'No'}</Text>
      <Text style={styles.status}>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</Text>
      
      {error && (
        <Text style={styles.error}>Error: {error.toString()}</Text>
      )}
      
      <TouchableOpacity style={styles.button} onPress={handleRefresh}>
        <Text style={styles.buttonText}>
          {isLoading ? 'Loading...' : 'Test API Call'}
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

console.log('✅ SimpleTestScreen: Created successfully');

export default SimpleTestScreen;