console.log('🚀 TestScreen.js: Starting imports...');

try {
  console.log('🚀 TestScreen.js: Importing React...');
  const React = require('react');
  const { useEffect } = React;
  console.log('✅ TestScreen.js: React imported');
  
  console.log('🚀 TestScreen.js: Importing React Native...');
  const { View, Text, StyleSheet, TouchableOpacity } = require('react-native');
  console.log('✅ TestScreen.js: React Native imported');
  
  console.log('🚀 TestScreen.js: Importing Redux...');
  const { useSelector, useDispatch } = require('react-redux');
  console.log('✅ TestScreen.js: Redux imported');
  
  console.log('🚀 TestScreen.js: Importing slice...');
  const { fetchPhotos } = require('../store/slices/photoSlice');
  console.log('✅ TestScreen.js: Slice imported');
  
  const TestScreen = () => {
    console.log('🧭 TestScreen: Component rendering...');
  const dispatch = useDispatch();
  const { photos, isLoading, error } = useSelector(state => state.photos);
  const { isAuthenticated } = useSelector(state => state.auth);

  console.log('🧪 TestScreen rendered');
  console.log('📊 Redux State:', { photosCount: photos.length, isLoading, isAuthenticated });

  useEffect(() => {
    console.log('🔄 TestScreen useEffect - fetching photos');
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

  console.log('✅ TestScreen.js: Component created successfully');
  
  // Export both ways to ensure compatibility
  module.exports = TestScreen;
  module.exports.default = TestScreen;
  
} catch (error) {
  console.error('❌ TestScreen.js: Error:', error.message);
  console.error('❌ TestScreen.js: Full error:', error);
  
  // Fallback component
  const React = require('react');
  const { View, Text } = require('react-native');
  
  const ErrorScreen = () => {
    return React.createElement(
      View,
      { style: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' } },
      React.createElement(Text, { style: { color: 'white', fontSize: 20 } }, 'TestScreen Error')
    );
  };
  
  module.exports = ErrorScreen;
  module.exports.default = ErrorScreen;
}