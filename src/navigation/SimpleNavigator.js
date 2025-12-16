import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BasicTestScreen from '../screens/BasicTestScreen';

console.log('🚀 SimpleNavigator: Loading...');

const Stack = createStackNavigator();

const SimpleNavigator = () => {
  console.log('🧭 SimpleNavigator: Rendering...');
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Test">
        <Stack.Screen name="Test" component={BasicTestScreen} options={{ title: 'Basic Redux Test' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

console.log('✅ SimpleNavigator: Created successfully');

export default SimpleNavigator;