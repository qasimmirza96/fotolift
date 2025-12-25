import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';

const InsufficientCreditsModal = ({ visible, onClose, onSubscribe, creditsNeeded, currentBalance }) => {
  const shortfall = creditsNeeded - currentBalance;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons name="diamond-outline" size={32} color="#f59e0b" />
              </View>
              <Text style={styles.title}>Insufficient Credits</Text>
              <Text style={styles.subtitle}>
                You need more credits to use this feature
              </Text>
            </View>

            {/* Credit Info */}
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Credits Needed:</Text>
                <Text style={styles.infoValue}>{creditsNeeded} credits</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Your Balance:</Text>
                <Text style={[styles.infoValue, styles.lowBalance]}>
                  {currentBalance} credits
                </Text>
              </View>
              <View style={[styles.infoRow, styles.shortfallRow]}>
                <Text style={styles.infoLabel}>Shortfall:</Text>
                <Text style={[styles.infoValue, styles.shortfallValue]}>
                  {shortfall} credits
                </Text>
              </View>
            </View>

            {/* Benefits */}
            <View style={styles.benefitsSection}>
              <Text style={styles.benefitsTitle}>Subscribe to get:</Text>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.benefitText}>Monthly credits</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.benefitText}>All AI features</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.benefitText}>Priority processing</Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={onSubscribe}
                style={styles.subscribeButton}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#7c3aed', '#a855f7']}
                  style={styles.subscribeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Ionicons name="diamond" size={20} color="#fff" />
                  <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                style={styles.cancelButton}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Maybe Later</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  shortfallRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  lowBalance: {
    color: '#ef4444',
  },
  shortfallValue: {
    color: '#f59e0b',
    fontSize: 18,
  },
  benefitsSection: {
    marginBottom: 24,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  benefitText: {
    fontSize: 14,
    color: '#374151',
  },
  actions: {
    gap: 12,
  },
  subscribeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  subscribeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
});

export default InsufficientCreditsModal;



