import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

console.log('🧪 PlainTestScreen: Loading...');

const PlainTestScreen = () => {
  console.log('🧪 PlainTestScreen: Rendering...');

  const handleTest = () => {
    console.log('🔄 Test button pressed - Redux/API disabled');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plain Test Screen</Text>
      <Text style={styles.subtitle}>Redux & API Disabled</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleTest}>
        <Text style={styles.buttonText}>Test Button</Text>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PlainTestScreen;