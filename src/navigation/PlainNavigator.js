import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import TabNavigator from './TabNavigator';
import SplashScreen from '../screens/SplashScreen';

console.log('🚀 PlainNavigator: Loading with splash and tabs...');

const PlainNavigator = () => {
  const [showSplash, setShowSplash] = useState(true);
  
  console.log('🧭 PlainNavigator: Rendering...', { showSplash });
  
  if (showSplash) {
    return (
      <SplashScreen onFinish={() => setShowSplash(false)} />
    );
  }
  
  return (
    <View style={styles.container}>
      <TabNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PlainNavigator;