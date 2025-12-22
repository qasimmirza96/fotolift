import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import UserScreen from '../screens/UserScreen';
import BGRSetupScreen from '../screens/BGRSetupScreen';
import BGRSingleImageScreen from '../screens/BGRSingleImageScreen';
import BGRFolderScreen from '../screens/BGRFolderScreen';
import BGRResultScreen from '../screens/BGRResultScreen';
import ImageEnhancerScreen from '../screens/ImageEnhancerScreen';
import IEResultScreen from '../screens/IEResultScreen';
import WRUnifiedScreen from '../screens/WRUnifiedScreen';
import WRResultScreen from '../screens/WRResultScreen';
import CISetupScreen from '../screens/CISetupScreen';
import CISingleImageScreen from '../screens/CISingleImageScreen';
import CIFolderScreen from '../screens/CIFolderScreen';
import CIResultScreen from '../screens/CIResultScreen';
import AIModelTryOnScreen from '../screens/AIModelTryOnScreen';
import AITryOnResultScreen from '../screens/AITryOnResultScreen';
import TryOnGearScreen from '../screens/TryOnGearScreen';
import SettingsScreen from '../screens/SettingsScreen';

const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Home');
  const [currentScreen, setCurrentScreen] = useState('Home');
  
  const navigation = {
    navigate: (screen) => {
      console.log('Navigating to:', screen);
      setCurrentScreen(screen);
    },
    goBack: () => {
      console.log('Going back from:', currentScreen);
      if (currentScreen === 'WRSingleImage' || currentScreen === 'WRFolder') {
        setCurrentScreen('WRSetup');
      } else if (currentScreen === 'WRResult') {
        setCurrentScreen('Home');
      } else {
        setCurrentScreen('Home');
      }
    },
  };

  const handleServiceSelect = (serviceId) => {
    if (serviceId === 1) {
      setCurrentScreen('BGRSetup');
    } else if (serviceId === 2) {
      setCurrentScreen('ImageEnhancer');
    } else if (serviceId === 3) {
      setCurrentScreen('WRSetup');
    } else if (serviceId === 4) {
      setCurrentScreen('CISetup');
    } else if (serviceId === 5) {
      setCurrentScreen('AIModelTryOn');
    } else if (serviceId === 6) {
      setCurrentScreen('TryOnGear');
    }
  };

  const handleBGRContinue = (mode) => {
    if (mode === 'single') {
      setCurrentScreen('BGRSingle');
    } else if (mode === 'folder') {
      setCurrentScreen('BGRFolder');
    }
  };

  const handleBGRProcess = () => {
    console.log('✅ BGR Processing complete');
    setCurrentScreen('BGRResult');
  };

  const handleBGRDownload = () => {
    console.log('📥 Download initiated');
  };

  const handleBGRHome = () => {
    console.log('🏠 handleBGRHome called in TabNavigator');
    console.log('🔄 Setting currentScreen to: Home');
    console.log('🔄 Setting activeTab to: Home');
    setCurrentScreen('Home');
    setActiveTab('Home');
    console.log('✅ Navigation complete');
  };

  const handleBGRRepeat = () => {
    console.log('🔁 handleBGRRepeat called in TabNavigator');
    console.log('🔄 Setting currentScreen to: BGRSetup');
    setCurrentScreen('BGRSetup');
    console.log('✅ Repeat navigation complete');
  };

  const handleIEDownload = () => {
    console.log('📥 IE Download initiated');
  };

  const handleIEHome = () => {
    setCurrentScreen('Home');
    setActiveTab('Home');
  };

  const handleIERepeat = () => {
    setCurrentScreen('ImageEnhancer');
  };

  const handleWRHome = () => {
    setCurrentScreen('Home');
    setActiveTab('Home');
  };

  const renderScreen = () => {
    if (currentScreen === 'BGRSetup') {
      return <BGRSetupScreen onContinue={handleBGRContinue} onBack={() => setCurrentScreen('Home')} />;
    }
    if (currentScreen === 'BGRSingle') {
      return <BGRSingleImageScreen onProcess={handleBGRProcess} onBack={() => setCurrentScreen('BGRSetup')} />;
    }
    if (currentScreen === 'BGRFolder') {
      return <BGRFolderScreen onProcess={handleBGRProcess} onBack={() => setCurrentScreen('BGRSetup')} />;
    }
    if (currentScreen === 'BGRResult') {
      return <BGRResultScreen onDownload={handleBGRDownload} onHome={handleBGRHome} onRepeat={handleBGRRepeat} />;
    }
    if (currentScreen === 'ImageEnhancer') {
      return <ImageEnhancerScreen 
        onBack={() => setCurrentScreen('Home')} 
        onSuccess={() => setCurrentScreen('IEResult')}
      />;
    }
    if (currentScreen === 'IEResult') {
      return <IEResultScreen onDownload={handleIEDownload} onHome={handleIEHome} onRepeat={handleIERepeat} />;
    }
    if (currentScreen === 'WRSetup') {
      return <WRUnifiedScreen navigation={navigation} />;
    }
    if (currentScreen === 'WRResult') {
      return <WRResultScreen navigation={navigation} />;
    }
    if (currentScreen === 'CISetup') {
      return <CISetupScreen navigation={navigation} />;
    }
    if (currentScreen === 'CISingleImage') {
      return <CISingleImageScreen navigation={navigation} />;
    }
    if (currentScreen === 'CIFolder') {
      return <CIFolderScreen navigation={navigation} />;
    }
    if (currentScreen === 'CIResult') {
      return <CIResultScreen navigation={navigation} />;
    }
    if (currentScreen === 'AIModelTryOn') {
      return <AIModelTryOnScreen navigation={navigation} />;
    }
    if (currentScreen === 'AITryOnResult') {
      return <AITryOnResultScreen navigation={navigation} />;
    }
    if (currentScreen === 'TryOnGear') {
      return <TryOnGearScreen navigation={navigation} />;
    }
    
    if (currentScreen === 'Settings') {
      return <SettingsScreen navigation={navigation} />;
    }
    
    switch (activeTab) {
      case 'Home':
        return <HomeScreen onServiceSelect={handleServiceSelect} />;
      case 'Explore':
        return <ExploreScreen />;
      case 'User':
        return <UserScreen navigation={navigation} onNavigate={(screen) => setCurrentScreen(screen)} />;
      default:
        return <HomeScreen onServiceSelect={handleServiceSelect} />;
    }
  };

  const TabButton = ({ iconName, label, isActive, onPress }) => (
    <TouchableOpacity style={styles.tabButton} onPress={onPress}>
      <Ionicons name={iconName} size={24} color={isActive ? '#7c3aed' : '#9ca3af'} />
      <Text style={[styles.tabLabel, { color: isActive ? '#7c3aed' : '#9ca3af' }]}>{label}</Text>
    </TouchableOpacity>
  );

  const shouldShowTabBar = !['BGRSetup', 'BGRSingle', 'BGRFolder', 'BGRResult', 'ImageEnhancer', 'IEResult', 'WRSetup', 'WRResult', 'CISetup', 'CISingleImage', 'CIFolder', 'CIResult', 'AIModelTryOn', 'AITryOnResult', 'TryOnGear', 'Settings'].includes(currentScreen);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>
      
      {shouldShowTabBar && (
        <View style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
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
      )}
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
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 8,
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
