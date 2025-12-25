import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const CreditsDisplay = ({ onPress, style }) => {
  const { balance, subscriptionStatus } = useSelector((state) => state.credits);

  // Determine color based on balance
  const getCreditColor = () => {
    if (balance === 0) return '#ef4444'; // Red
    if (balance < 5) return '#f59e0b'; // Orange
    return '#10b981'; // Green
  };

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[styles.container, style]}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Ionicons 
          name="diamond" 
          size={18} 
          color={getCreditColor()} 
          style={styles.icon}
        />
        <Text style={[styles.balance, { color: getCreditColor() }]}>
          {balance}
        </Text>
        <Text style={styles.label}>Credits</Text>
      </View>
      {subscriptionStatus === 'active' && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Pro</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    marginRight: 2,
  },
  balance: {
    fontSize: 16,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  badge: {
    marginLeft: 8,
    backgroundColor: '#7c3aed',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default CreditsDisplay;



