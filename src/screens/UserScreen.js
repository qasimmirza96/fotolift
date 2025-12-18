import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, Image, Dimensions, StatusBar, Animated, Modal, TextInput, Share, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { authActions } from '../store/simpleStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { LOCAL_IMAGES } from '../constants';

const { height, width } = Dimensions.get('window');

const UserScreen = ({ navigation, onNavigate }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('projects');
  const [showTopBar, setShowTopBar] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const defaultProfileImage = LOCAL_IMAGES.qasim;
  const defaultCoverImage = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=300&fit=crop';
  
  const [editName, setEditName] = useState('');
  const [editProfileImage, setEditProfileImage] = useState('');
  const [editCoverImage, setEditCoverImage] = useState('');
  
  useEffect(() => {
    setEditName(user?.name || 'Alexandra Chen');
    setEditProfileImage(user?.profileImage || defaultProfileImage);
    setEditCoverImage(user?.coverImage || defaultCoverImage);
  }, [user]);

  console.log('User Data:', user);
  
  const COVER_HEIGHT = height * 0.2;
  const SCROLL_THRESHOLD = COVER_HEIGHT * 0.3;

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

  const handleEditProfile = () => {
    setEditModalVisible(true);
  };
  
  const handleSaveProfile = () => {
    dispatch(authActions.updateProfile({
      name: editName,
      profileImage: editProfileImage,
      coverImage: editCoverImage,
    }));
    setEditModalVisible(false);
  };
  
  const pickProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setEditProfileImage(result.assets[0].uri);
    }
  };
  
  const pickCoverImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    if (!result.canceled) {
      setEditCoverImage(result.assets[0].uri);
    }
  };
  
  const handleShare = () => {
    setShareModalVisible(true);
  };
  
  const shareToSocial = async (platform) => {
    const profileUrl = `https://fotolift.app/profile/${userData.name.replace(/\s+/g, '-').toLowerCase()}`;
    
    if (platform === 'copy') {
      await Clipboard.setStringAsync(profileUrl);
      Alert.alert('Copied!', 'Profile link copied to clipboard');
      setShareModalVisible(false);
    } else {
      try {
        await Share.share({
          message: `Check out my FotoLift profile: ${profileUrl}`,
        });
        setShareModalVisible(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEditCover = () => {
    pickCoverImage();
  };

  const userData = {
    name: user?.name || 'Alexandra Chen',
    email: user?.email || 'alexandra.chen@fotolift.com',
    loginMethod: user?.loginMethod || 'google',
    bio: user?.bio || 'Professional photographer & visual storyteller. Capturing moments that matter.',
    location: user?.location || 'San Francisco, CA',
    website: user?.website || 'www.alexchen.photo',
    joinDate: user?.joinDate || 'March 2023',
    verified: user?.verified !== undefined ? user.verified : true,
    profileImage: user?.profileImage || defaultProfileImage,
    coverImage: user?.coverImage || defaultCoverImage,
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
      { icon: 'emoji-events', title: 'Top Creator 2024', color: '#FFD700' },
      { icon: 'camera', title: '50+ Projects', color: '#8B5CF6' },
      { icon: 'photo', title: '100+ Photos', color: '#FF3B30' },
      { icon: 'folder', title: '20+ Albums', color: '#34C759' }
    ]
  };

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowTopBar(scrollY > SCROLL_THRESHOLD);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {showTopBar && (
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>{userData.name}</Text>
          <View style={styles.topBarActions}>
            <TouchableOpacity style={styles.topBarButton} onPress={() => onNavigate && onNavigate('Settings')}>
              <Ionicons name="settings-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.topBarButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      <ScrollView showsVerticalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16}>
        <View style={styles.coverSection}>
          <ImageBackground source={{ uri: userData.coverImage }} style={styles.coverImage} resizeMode="cover">
            <View style={styles.gradientOverlay} />
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton} onPress={() => onNavigate && onNavigate('Settings')}>
                <Ionicons name="settings-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
                <Ionicons name="share-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.editCoverButton} onPress={handleEditCover}>
              <Ionicons name="camera" size={18} color="#fff" />
              <Text style={styles.editCoverText}>Edit Cover</Text>
            </TouchableOpacity>
          </ImageBackground>
          
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
          
          <View style={styles.badgesContainer}>
            {userData.badges.map((badge, index) => (
              <View key={index} style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}
          </View>
          
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

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleEditProfile}>
              <Ionicons name="create-outline" size={18} color="#fff" />
              <Text style={styles.primaryButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={18} color="#8B5CF6" />
              <Text style={styles.secondaryButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
          
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
      
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity style={styles.imagePickerButton} onPress={pickProfileImage}>
                <Image source={{ uri: editProfileImage }} style={styles.editImage} />
                <View style={styles.imagePickerOverlay}>
                  <Ionicons name="camera" size={24} color="#fff" />
                  <Text style={styles.imagePickerText}>Change Photo</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.coverPickerButton} onPress={pickCoverImage}>
                <Image source={{ uri: editCoverImage }} style={styles.editCoverImg} />
                <View style={styles.imagePickerOverlay}>
                  <Ionicons name="camera" size={24} color="#fff" />
                  <Text style={styles.imagePickerText}>Change Cover</Text>
                </View>
              </TouchableOpacity>
              
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter your name"
              />
              
              <TouchableOpacity onPress={handleSaveProfile}>
                <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      <Modal visible={shareModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.shareModal}>
            <Text style={styles.shareTitle}>Share Profile</Text>
            <View style={styles.shareOptions}>
              <TouchableOpacity style={styles.shareOption} onPress={() => shareToSocial('whatsapp')}>
                <FontAwesome5 name="whatsapp" size={32} color="#25D366" />
                <Text style={styles.shareOptionText}>WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareOption} onPress={() => shareToSocial('facebook')}>
                <FontAwesome5 name="facebook" size={32} color="#1877F2" />
                <Text style={styles.shareOptionText}>Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareOption} onPress={() => shareToSocial('instagram')}>
                <FontAwesome5 name="instagram" size={32} color="#E4405F" />
                <Text style={styles.shareOptionText}>Instagram</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareOption} onPress={() => shareToSocial('copy')}>
                <Ionicons name="copy" size={32} color="#7c3aed" />
                <Text style={styles.shareOptionText}>Copy Link</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShareModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  topBarTitle: { fontSize: 20, fontWeight: '700', color: '#333' },
  topBarActions: { flexDirection: 'row', gap: 12 },
  topBarButton: { padding: 8 },
  coverSection: { height: height * 0.25, position: 'relative' },
  coverImage: { width: '100%', height: height * 0.2, justifyContent: 'space-between' },
  gradientOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.3)' },
  headerActions: { flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 20, paddingHorizontal: 20 },
  headerButton: { backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: 8, borderRadius: 20, marginLeft: 10 },
  editCoverButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, alignSelf: 'flex-end', margin: 15 },
  editCoverText: { color: '#fff', fontSize: 12, fontWeight: '600', marginLeft: 5 },
  profileImageContainer: { position: 'absolute', bottom: 0, alignSelf: 'center', alignItems: 'center' },
  profileImageWrapper: { position: 'relative' },
  profileImage: { width: 130, height: 130, borderRadius: 65, borderWidth: 5, borderColor: '#fff' },
  verifiedBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#8B5CF6', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  editProfileButton: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#8B5CF6', padding: 8, borderRadius: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  userInfoSection: { paddingHorizontal: 20, paddingTop: 75, paddingBottom: 30 },
  userNameRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  userName: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  verifiedIcon: { marginLeft: 8 },
  userBio: { fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 20, lineHeight: 22 },
  userDetails: { marginBottom: 20 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, justifyContent: 'center' },
  detailText: { fontSize: 14, color: '#666', marginLeft: 8 },
  badgesContainer: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 25 },
  badge: { backgroundColor: '#8B5CF6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, margin: 4 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', paddingVertical: 25, borderRadius: 20, marginBottom: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 8 },
  statItem: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4, fontWeight: '500' },
  actionButtons: { flexDirection: 'row', marginBottom: 30, gap: 12 },
  primaryButton: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#8B5CF6', paddingVertical: 14, borderRadius: 25, shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 6 },
  secondaryButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', paddingVertical: 14, borderRadius: 25, borderWidth: 1.5, borderColor: '#8B5CF6' },
  secondaryButtonText: { color: '#8B5CF6', fontSize: 14, fontWeight: '600', marginLeft: 4 },
  achievementsSection: { marginBottom: 30 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  achievementCard: { width: '48%', backgroundColor: '#fff', padding: 20, borderRadius: 15, alignItems: 'center', marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  achievementIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  achievementTitle: { fontSize: 12, fontWeight: '600', color: '#333', textAlign: 'center' },
  tabNavigation: { flexDirection: 'row', backgroundColor: '#f0f0f0', borderRadius: 25, padding: 4, marginBottom: 25 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 20 },
  activeTab: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#666' },
  activeTabText: { color: '#8B5CF6' },
  projectsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  projectCard: { width: '48%', height: 120, borderRadius: 15, marginBottom: 15, overflow: 'hidden' },
  projectCardImage: { width: '100%', height: '100%' },
  projectCardOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', padding: 10 },
  projectCardTitle: { color: '#fff', fontSize: 12, fontWeight: '600', marginBottom: 5 },
  projectStats: { flexDirection: 'row' },
  projectStat: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
  projectStatText: { color: '#fff', fontSize: 10, marginLeft: 3 },
  aboutSection: { marginBottom: 20 },
  aboutCard: { backgroundColor: '#fff', borderRadius: 15, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  aboutItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  aboutContent: { marginLeft: 15, flex: 1 },
  aboutLabel: { fontSize: 14, color: '#666', marginBottom: 4 },
  aboutValue: { fontSize: 16, color: '#333', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 24, fontWeight: '700', color: '#333' },
  imagePickerButton: { width: 120, height: 120, borderRadius: 60, alignSelf: 'center', marginBottom: 20, overflow: 'hidden', position: 'relative' },
  editImage: { width: '100%', height: '100%' },
  coverPickerButton: { width: '100%', height: 150, borderRadius: 16, marginBottom: 20, overflow: 'hidden', position: 'relative' },
  editCoverImg: { width: '100%', height: '100%' },
  imagePickerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: 'center', justifyContent: 'center' },
  imagePickerText: { color: '#fff', fontSize: 12, fontWeight: '600', marginTop: 4 },
  inputLabel: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { backgroundColor: '#f8f9fa', borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 24, borderWidth: 1, borderColor: '#e0e0e0' },
  saveButton: { paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginBottom: 20 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  shareModal: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  shareTitle: { fontSize: 22, fontWeight: '700', color: '#333', marginBottom: 24, textAlign: 'center' },
  shareOptions: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24 },
  shareOption: { alignItems: 'center', gap: 8 },
  shareOptionText: { fontSize: 12, fontWeight: '600', color: '#666' },
  cancelButton: { paddingVertical: 16, borderRadius: 16, backgroundColor: '#f8f9fa', alignItems: 'center' },
  cancelButtonText: { fontSize: 16, fontWeight: '600', color: '#666' },
});

export default UserScreen;
