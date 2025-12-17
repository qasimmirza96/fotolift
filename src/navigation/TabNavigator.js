import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import UserScreen from '../screens/UserScreen';
import BackgroundRemoverScreen from '../screens/BackgroundRemoverScreen';

const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Home');
  const [currentScreen, setCurrentScreen] = useState('Home');
  
  const navigation = {
    navigate: (screen) => setCurrentScreen(screen),
    goBack: () => setCurrentScreen('Home'),
  };

  const renderScreen = () => {
    if (currentScreen === 'BackgroundRemover') {
      return <BackgroundRemoverScreen navigation={navigation} />;
    }
    
    switch (activeTab) {
      case 'Home':
        return <HomeScreen navigation={navigation} />;
      case 'Explore':
        return <ExploreScreen />;
      case 'User':
        return <UserScreen />;
      default:
        return <HomeScreen navigation={navigation} />;
    }
  };

  const TabButton = ({ iconName, label, isActive, onPress }) => (
    <TouchableOpacity style={styles.tabButton} onPress={onPress}>
      <Ionicons name={iconName} size={24} color={isActive ? '#7c3aed' : '#9ca3af'} />
      <Text style={[styles.tabLabel, { color: isActive ? '#7c3aed' : '#9ca3af' }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>
      
      <View style={[styles.tabBar, { paddingBottom: insets.bottom + 8 }]}>
        <TabButton iconName="home" label="Home" isActive={activeTab === 'Home'} onPress={() => setActiveTab('Home')} />
        <TabButton iconName="compass" label="Explore" isActive={activeTab === 'Explore'} onPress={() => setActiveTab('Explore')} />
        
        {/* <View style={styles.centerButtonWrapper}>
          <TouchableOpacity style={styles.centerButtonContainer} onPress={() => console.log('Camera pressed')}>
            <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.centerButton}>
              <Ionicons name="camera" size={28} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View> */}

        
        
        {/* <View style={styles.spacer} /> */}
        {/* <TabButton iconName="camera" label="Camera" onPress={() => console.log('Camera pressed')} /> */}
            {/* <View style={styles.spacer} /> */}
        <TabButton iconName="person" label="Profile" isActive={activeTab === 'User'} onPress={() => setActiveTab('User')} />
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  centerButtonWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButtonContainer: {
    position: 'absolute',
    top: -28,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    flex: 1,
  },
});

export default TabNavigator;
