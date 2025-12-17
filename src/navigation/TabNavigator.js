import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import UserScreen from '../screens/UserScreen';

const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen />;
      case 'Explore':
        return <ExploreScreen />;
      case 'User':
        return <UserScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const TabButton = ({ iconName, label, isActive, onPress }) => (
    <TouchableOpacity
      style={styles.tabButton}
      onPress={onPress}
    >
      <Ionicons 
        name={iconName} 
        size={24} 
        color={isActive ? '#663399' : '#9966cc'} 
      />
      <Text style={[styles.tabLabel, { color: isActive ? '#663399' : '#9966cc' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>
      
      <View style={[styles.tabBar, { paddingBottom: insets.bottom + 8 }]}>
        <TabButton
          iconName="home"
          label="Home"
          isActive={activeTab === 'Home'}
          onPress={() => setActiveTab('Home')}
        />
        <TabButton
          iconName="compass"
          label="Explore"
          isActive={activeTab === 'Explore'}
          onPress={() => setActiveTab('Explore')}
        />
        <TabButton
          iconName="person"
          label="Profile"
          isActive={activeTab === 'User'}
          onPress={() => setActiveTab('User')}
        />
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
    borderTopColor: '#e6e6fa',
    paddingVertical: 8,
    shadowColor: '#663399',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
});

export default TabNavigator;