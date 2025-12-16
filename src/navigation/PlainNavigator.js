import React from 'react';
import { View, StyleSheet } from 'react-native';
import TabNavigator from './TabNavigator';

console.log('🚀 PlainNavigator: Loading with TabNavigator...');

const PlainNavigator = () => {
  console.log('🧭 PlainNavigator: Rendering with bottom tabs...');
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