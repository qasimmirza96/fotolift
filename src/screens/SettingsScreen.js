import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { logout } from '../store/slices/authSlice';

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const SettingItem = ({ icon, title, subtitle, onPress, showArrow = true, rightComponent }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={20} color="#8B5CF6" />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
        {showArrow && <Ionicons name="chevron-forward" size={16} color="#999" />}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Manage your account and preferences</Text>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.sectionCard}>
          <SettingItem
            icon="person-outline"
            title="Edit Profile"
            subtitle="Update your personal information"
            onPress={() => console.log('Edit Profile')}
          />
          <SettingItem
            icon="key-outline"
            title="Change Password"
            subtitle="Update your password"
            onPress={() => console.log('Change Password')}
          />
          <SettingItem
            icon="shield-checkmark-outline"
            title="Privacy & Security"
            subtitle="Manage your privacy settings"
            onPress={() => console.log('Privacy & Security')}
          />
        </View>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.sectionCard}>
          <SettingItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Push notifications, email alerts"
            onPress={() => console.log('Notifications')}
          />
          <SettingItem
            icon="moon-outline"
            title="Dark Mode"
            subtitle="Switch to dark theme"
            showArrow={false}
            rightComponent={<Switch value={false} onValueChange={() => {}} thumbColor="#8B5CF6" />}
          />
          <SettingItem
            icon="language-outline"
            title="Language"
            subtitle="English"
            onPress={() => console.log('Language')}
          />
          <SettingItem
            icon="cloud-download-outline"
            title="Auto Backup"
            subtitle="Automatically backup your photos"
            showArrow={false}
            rightComponent={<Switch value={true} onValueChange={() => {}} thumbColor="#8B5CF6" />}
          />
        </View>
      </View>

      {/* Storage Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Storage & Data</Text>
        <View style={styles.sectionCard}>
          <SettingItem
            icon="folder-outline"
            title="Storage Usage"
            subtitle="2.3 GB of 15 GB used"
            onPress={() => console.log('Storage Usage')}
          />
          <SettingItem
            icon="download-outline"
            title="Download Quality"
            subtitle="High quality"
            onPress={() => console.log('Download Quality')}
          />
          <SettingItem
            icon="trash-outline"
            title="Clear Cache"
            subtitle="Free up storage space"
            onPress={() => console.log('Clear Cache')}
          />
        </View>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.sectionCard}>
          <SettingItem
            icon="help-circle-outline"
            title="Help Center"
            subtitle="Get help and support"
            onPress={() => console.log('Help Center')}
          />
          <SettingItem
            icon="chatbubble-outline"
            title="Contact Us"
            subtitle="Send feedback or report issues"
            onPress={() => console.log('Contact Us')}
          />
          <SettingItem
            icon="star-outline"
            title="Rate App"
            subtitle="Rate FotoLift on app store"
            onPress={() => console.log('Rate App')}
          />
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.sectionCard}>
          <SettingItem
            icon="information-circle-outline"
            title="App Version"
            subtitle="1.0.0"
            showArrow={false}
          />
          <SettingItem
            icon="document-text-outline"
            title="Terms of Service"
            onPress={() => console.log('Terms of Service')}
          />
          <SettingItem
            icon="shield-outline"
            title="Privacy Policy"
            onPress={() => console.log('Privacy Policy')}
          />
        </View>
      </View>

      {/* Logout Section */}
      <View style={styles.section}>
        <View style={styles.sectionCard}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* User Info Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Logged in as {user?.email}</Text>
        <Text style={styles.footerSubtext}>FotoLift © 2024</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#8B5CF6',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 10,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999',
  },
});

export default SettingsScreen;