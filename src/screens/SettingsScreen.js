import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../store/simpleStore';

const SettingsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => dispatch(authActions.logout()) }
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, onPress, rightComponent, showBorder = true }) => (
    <TouchableOpacity 
      style={[styles.settingItem, !showBorder && styles.noBorder]} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={22} color="#7c3aed" />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || <Ionicons name="chevron-forward" size={20} color="#999" />}
    </TouchableOpacity>
  );

  const SettingSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.profileGradient}>
            <View style={styles.profileInfo}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'A'}</Text>
              </View>
              <View>
                <Text style={styles.profileName}>{user?.name || 'User'}</Text>
                <Text style={styles.profileEmail}>{user?.email || 'user@fotolift.com'}</Text>
              </View>
            </View>
            {/* <TouchableOpacity style={styles.editProfileBtn}>
              <Ionicons name="create-outline" size={20} color="#fff" />
            </TouchableOpacity> */}
          </LinearGradient>
        </View>

        <SettingSection title="Preferences">
          <SettingItem
            icon="notifications"
            title="Notifications"
            subtitle="Enable push notifications"
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#e0e0e0', true: '#a855f7' }}
                thumbColor={notifications ? '#7c3aed' : '#f4f3f4'}
              />
            }
          />
          {/* <SettingItem
            icon="moon"
            title="Dark Mode"
            subtitle="Switch to dark theme"
            rightComponent={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#e0e0e0', true: '#a855f7' }}
                thumbColor={darkMode ? '#7c3aed' : '#f4f3f4'}
              />
            }
          /> */}
          <SettingItem
            icon="save"
            title="Auto Save"
            subtitle="Automatically save your work"
            rightComponent={
              <Switch
                value={autoSave}
                onValueChange={setAutoSave}
                trackColor={{ false: '#e0e0e0', true: '#a855f7' }}
                thumbColor={autoSave ? '#7c3aed' : '#f4f3f4'}
              />
            }
            showBorder={false}
          />
        </SettingSection>

        <SettingSection title="Account">
          <SettingItem
            icon="person"
            title="Edit Profile"
            subtitle="Update your personal information"
            onPress={() => console.log('Edit Profile')}
          />
          <SettingItem
            icon="lock-closed"
            title="Privacy & Security"
            subtitle="Manage your privacy settings"
            onPress={() => console.log('Privacy')}
          />
          <SettingItem
            icon="key"
            title="Change Password"
            subtitle="Update your password"
            onPress={() => console.log('Change Password')}
            showBorder={false}
          />
        </SettingSection>

        <SettingSection title="Content">
          <SettingItem
            icon="cloud"
            title="Storage"
            subtitle="Manage your storage space"
            onPress={() => console.log('Storage')}
          />
          <SettingItem
            icon="download"
            title="Download Quality"
            subtitle="High quality"
            onPress={() => console.log('Quality')}
          />
          <SettingItem
            icon="trash"
            title="Clear Cache"
            subtitle="Free up space"
            onPress={() => Alert.alert('Cache Cleared', 'Your cache has been cleared successfully')}
            showBorder={false}
          />
        </SettingSection>

        <SettingSection title="Support">
          <SettingItem
            icon="help-circle"
            title="Help Center"
            subtitle="Get help and support"
            onPress={() => console.log('Help')}
          />
          <SettingItem
            icon="chatbubble"
            title="Contact Us"
            subtitle="Send us a message"
            onPress={() => console.log('Contact')}
          />
          <SettingItem
            icon="star"
            title="Rate App"
            subtitle="Share your feedback"
            onPress={() => console.log('Rate')}
          />
          <SettingItem
            icon="information-circle"
            title="About"
            subtitle="Version 1.0.0"
            onPress={() => console.log('About')}
            showBorder={false}
          />
        </SettingSection>

        <View style={styles.logoutSection}>
          <TouchableOpacity onPress={handleLogout}>
            <LinearGradient colors={['#ef4444', '#dc2626']} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={22} color="#fff" />
              <Text style={styles.logoutText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>FotoLift © 2024</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  profileCard: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  profileGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  editProfileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 20,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#999',
  },
  logoutSection: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    gap: 8,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    textAlign: 'center',
    fontSize: 13,
    color: '#999',
    marginBottom: 32,
  },
});

export default SettingsScreen;
