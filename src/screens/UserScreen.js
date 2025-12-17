import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, Image, Dimensions, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { logout } from '../store/slices/authSlice';

const { height, width } = Dimensions.get('window');

const UserScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('projects');

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleEditProfile = () => {
    console.log('✏️ Edit profile pressed');
  };

  const handleEditCover = () => {
    console.log('📸 Edit cover pressed');
  };

  // Enhanced user data
  const userData = {
    name: user?.name || 'Alexandra Chen',
    email: user?.email || 'alexandra.chen@fotolift.com',
    loginMethod: user?.loginMethod || 'google',
    bio: 'Professional photographer & visual storyteller. Capturing moments that matter.',
    location: 'San Francisco, CA',
    website: 'www.alexchen.photo',
    joinDate: 'March 2023',
    verified: true,
    profileImage: 'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
    coverImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=300&fit=crop',
    projectsCount: 47,
    badges: ['Pro', 'Featured Artist', 'Top Creator'],
    recentProjects: [
      {
        id: 1,
        title: 'Golden Hour Portraits',
        date: '2 hours ago',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'
      },
      {
        id: 2,
        title: 'Urban Architecture',
        date: '1 day ago',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop'
      },
      {
        id: 3,
        title: 'Nature Landscapes',
        date: '3 days ago',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'
      }
    ],
    achievements: [
      { icon: 'trophy', title: 'Top Creator 2024', color: '#FFD700' },
      { icon: 'camera', title: '50+ Projects', color: '#8B5CF6' },
      { icon: 'photo', title: '100+ Photos', color: '#FF3B30' },
      { icon: 'folder', title: '20+ Albums', color: '#34C759' }
    ]
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Enhanced Cover Section */}
        <View style={styles.coverSection}>
          <ImageBackground
            source={{ uri: userData.coverImage }}
            style={styles.coverImage}
            resizeMode="cover"
          >
            {/* Gradient Overlay */}
            <View style={styles.gradientOverlay} />
            
            {/* Header Actions */}
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="settings-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="share-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.editCoverButton} onPress={handleEditCover}>
              <Ionicons name="camera" size={18} color="#fff" />
              <Text style={styles.editCoverText}>Edit Cover</Text>
            </TouchableOpacity>
          </ImageBackground>
          
          {/* Enhanced Profile Image */}
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImageWrapper}>
              <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
              {userData.verified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark" size={12} color="#fff" />
                </View>
              )}
            </View>
            <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
              <Ionicons name="camera" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Enhanced User Info */}
        <View style={styles.userInfoSection}>
          <View style={styles.userNameRow}>
            <Text style={styles.userName}>{userData.name}</Text>
            {userData.verified && (
              <Ionicons name="checkmark-circle" size={20} color="#8B5CF6" style={styles.verifiedIcon} />
            )}
          </View>
          
          <Text style={styles.userBio}>{userData.bio}</Text>
          
          <View style={styles.userDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="mail-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{userData.email}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="globe-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{userData.website}</Text>
            </View>
          </View>
          
          {/* Badges */}
          <View style={styles.badgesContainer}>
            {userData.badges.map((badge, index) => (
              <View key={index} style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}
          </View>
          
          {/* Enhanced Stats */}
          <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>{userData.projectsCount}</Text>
              <Text style={styles.statLabel}>Projects</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Photos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>23</Text>
              <Text style={styles.statLabel}>Albums</Text>
            </TouchableOpacity>
          </View>

          {/* Enhanced Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleEditProfile}>
              <Ionicons name="create-outline" size={18} color="#fff" />
              <Text style={styles.primaryButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton}>
              <Ionicons name="settings-outline" size={18} color="#8B5CF6" />
              <Text style={styles.secondaryButtonText}>Settings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="share-outline" size={18} color="#8B5CF6" />
            </TouchableOpacity>
          </View>
          
          {/* Achievements Section */}
          <View style={styles.achievementsSection}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={styles.achievementsGrid}>
              {userData.achievements.map((achievement, index) => (
                <View key={index} style={styles.achievementCard}>
                  <View style={[styles.achievementIcon, { backgroundColor: achievement.color }]}>
                    <MaterialIcons name={achievement.icon} size={20} color="#fff" />
                  </View>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Tab Navigation */}
          <View style={styles.tabNavigation}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'projects' && styles.activeTab]}
              onPress={() => setActiveTab('projects')}
            >
              <Text style={[styles.tabText, activeTab === 'projects' && styles.activeTabText]}>Projects</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'about' && styles.activeTab]}
              onPress={() => setActiveTab('about')}
            >
              <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>About</Text>
            </TouchableOpacity>
          </View>
          
          {/* Tab Content */}
          {activeTab === 'projects' && (
            <View style={styles.projectsGrid}>
              {userData.recentProjects.map((project) => (
                <TouchableOpacity key={project.id} style={styles.projectCard}>
                  <Image source={{ uri: project.image }} style={styles.projectCardImage} />
                  <View style={styles.projectCardOverlay}>
                    <Text style={styles.projectCardTitle}>{project.title}</Text>
                    <View style={styles.projectStats}>
                      <View style={styles.projectStat}>
                        <Ionicons name="time" size={12} color="#fff" />
                        <Text style={styles.projectStatText}>{project.date}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {activeTab === 'about' && (
            <View style={styles.aboutSection}>
              <View style={styles.aboutCard}>
                <View style={styles.aboutItem}>
                  <Ionicons name="location-outline" size={20} color="#8B5CF6" />
                  <View style={styles.aboutContent}>
                    <Text style={styles.aboutLabel}>Location</Text>
                    <Text style={styles.aboutValue}>{userData.location}</Text>
                  </View>
                </View>
                <View style={styles.aboutItem}>
                  <Ionicons name="calendar-outline" size={20} color="#8B5CF6" />
                  <View style={styles.aboutContent}>
                    <Text style={styles.aboutLabel}>Joined</Text>
                    <Text style={styles.aboutValue}>{userData.joinDate}</Text>
                  </View>
                </View>
                <View style={styles.aboutItem}>
                  <Ionicons name="person-outline" size={20} color="#8B5CF6" />
                  <View style={styles.aboutContent}>
                    <Text style={styles.aboutLabel}>Login Method</Text>
                    <Text style={styles.aboutValue}>{userData.loginMethod}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  coverSection: {
    height: height * 0.45,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: height * 0.4,
    justifyContent: 'space-between',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  editCoverButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-end',
    margin: 15,
  },
  editCoverText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
  },
  profileImageContainer: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    alignItems: 'center',
  },
  profileImageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 5,
    borderColor: '#fff',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#8B5CF6',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  editProfileButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#8B5CF6',
    padding: 8,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfoSection: {
    paddingHorizontal: 20,
    paddingTop: 75,
    paddingBottom: 30,
  },
  userNameRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  verifiedIcon: {
    marginLeft: 8,
  },
  userBio: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  userDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 25,
  },
  badge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    margin: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 25,
    borderRadius: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 30,
    gap: 12,
  },
  primaryButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 14,
    borderRadius: 25,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#8B5CF6',
  },
  secondaryButtonText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  iconButton: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#8B5CF6',
  },
  achievementsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    padding: 4,
    marginBottom: 25,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#8B5CF6',
  },
  projectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  projectCard: {
    width: '48%',
    height: 120,
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  projectCardImage: {
    width: '100%',
    height: '100%',
  },
  projectCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
  },
  projectCardTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
  },
  projectStats: {
    flexDirection: 'row',
  },
  projectStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  projectStatText: {
    color: '#fff',
    fontSize: 10,
    marginLeft: 3,
  },
  aboutSection: {
    marginBottom: 20,
  },
  aboutCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  aboutContent: {
    marginLeft: 15,
    flex: 1,
  },
  aboutLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  aboutValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
});

export default UserScreen;