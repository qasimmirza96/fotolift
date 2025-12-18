import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import TabNavigator from './TabNavigator';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

const PlainNavigator = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showSignup, setShowSignup] = useState(false);
  const { isAuthenticated } = useSelector(state => state.auth);
  
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }
  
  // if (!isAuthenticated) {
  //   return showSignup ? (
  //     <SignupScreen onSwitchToLogin={() => setShowSignup(false)} />
  //   ) : (
  //     <LoginScreen onSwitchToSignup={() => setShowSignup(true)} />
  //   );
  // }
  
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
