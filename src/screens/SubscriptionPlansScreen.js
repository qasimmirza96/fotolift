import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlans, createSubscription } from '../store/slices/subscriptionSlice';
import { fetchUserCredits } from '../store/slices/creditsSlice';
import { SUBSCRIPTION_PLANS } from '../services/subscriptionService';

const { width } = Dimensions.get('window');

const SubscriptionPlansScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { plans, isLoading, paymentProcessing } = useSelector((state) => state.subscription);
  const { balance } = useSelector((state) => state.credits);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      Alert.alert('Select a Plan', 'Please select a subscription plan first');
      return;
    }

    try {
      console.log('💳 [MOCK] Processing subscription payment...');
      
      Alert.alert(
        'Mock Payment',
        'This is a mock payment. In production, this would redirect to Stripe checkout.\n\nProceed with mock subscription?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Proceed (Mock)',
            onPress: async () => {
              const result = await dispatch(
                createSubscription({
                  planId: selectedPlan,
                  paymentMethodId: 'mock_payment_method',
                })
              ).unwrap();

              if (result) {
                await dispatch(fetchUserCredits());
                
                Alert.alert(
                  '✅ Subscription Active!',
                  `You now have ${result.credits_per_month} credits per month.`,
                  [
                    {
                      text: 'Great!',
                      onPress: () => navigation.goBack(),
                    },
                  ]
                );
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create subscription');
    }
  };

  const renderPlanCard = (plan) => {
    const isSelected = selectedPlan === plan.id;
    const isPopular = plan.id === 'pro';

    return (
      <TouchableOpacity
        key={plan.id}
        onPress={() => handleSelectPlan(plan.id)}
        style={[styles.planCard, isSelected && styles.planCardSelected]}
        activeOpacity={0.7}
      >
        {isPopular && (
          <LinearGradient
            colors={['#f59e0b', '#d97706']}
            style={styles.popularBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="star" size={12} color="#fff" />
            <Text style={styles.popularBadgeText}>Most Popular</Text>
          </LinearGradient>
        )}
        
        <View style={styles.planHeader}>
          <View style={styles.planNameContainer}>
            <Text style={styles.planName}>{plan.name}</Text>
            {isSelected && (
              <View style={styles.selectedCheckmark}>
                <Ionicons name="checkmark-circle" size={20} color="#7c3aed" />
              </View>
            )}
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceSymbol}>$</Text>
            <Text style={styles.price}>{plan.price}</Text>
            <Text style={styles.pricePeriod}>/month</Text>
          </View>
        </View>

        <View style={styles.creditsSection}>
          <LinearGradient
            colors={isSelected ? ['#faf5ff', '#f3e8ff'] : ['#f9fafb', '#f3f4f6']}
            style={styles.creditsCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.creditsIconContainer}>
              <Ionicons name="diamond" size={20} color="#7c3aed" />
            </View>
            <View style={styles.creditsInfo}>
              <Text style={styles.creditsAmount}>{plan.credits}</Text>
              <Text style={styles.creditsLabel}>credits per month</Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.featuresList}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="checkmark" size={14} color="#10b981" />
              </View>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading && plans.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7c3aed" />
          <Text style={styles.loadingText}>Loading plans...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Upgrade to PRO</Text>
          <Text style={styles.headerSubtitle}>Choose your plan</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Balance Card */}
        <LinearGradient
          colors={['#7c3aed', '#a855f7']}
          style={styles.balanceCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.balanceHeader}>
            <Ionicons name="diamond" size={24} color="#fff" />
            <Text style={styles.balanceLabel}>Current Balance</Text>
          </View>
          <Text style={styles.balanceValue}>{balance}</Text>
          <Text style={styles.balanceSubtext}>credits available</Text>
        </LinearGradient>

        {/* Plans Section */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Subscription Plans</Text>
          <Text style={styles.sectionSubtitle}>Select the plan that works best for you</Text>
          
          <View style={styles.plansContainer}>
            {Object.values(SUBSCRIPTION_PLANS).map((plan) => renderPlanCard(plan))}
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="information-circle-outline" size={20} color="#3b82f6" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Flexible & Transparent</Text>
            <Text style={styles.infoText}>
              Credits renew automatically every month. Cancel anytime with no hidden fees.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Subscribe Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleSubscribe}
          disabled={!selectedPlan || paymentProcessing}
          style={[
            styles.subscribeButton,
            (!selectedPlan || paymentProcessing) && styles.subscribeButtonDisabled,
          ]}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={selectedPlan ? ['#7c3aed', '#a855f7'] : ['#e5e7eb', '#d1d5db']}
            style={styles.subscribeGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {paymentProcessing ? (
              <>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.subscribeButtonText}>Processing...</Text>
              </>
            ) : (
              <>
                <Ionicons name="diamond" size={18} color="#fff" />
                <Text style={styles.subscribeButtonText}>
                  {selectedPlan ? 'Subscribe Now' : 'Select a Plan'}
                </Text>
                {selectedPlan && (
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                )}
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
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
    padding: 4,
    borderRadius: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  balanceCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  balanceValue: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  plansSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
    fontWeight: '500',
  },
  plansContainer: {
    gap: 16,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  planCardSelected: {
    borderColor: '#7c3aed',
    backgroundColor: '#fff',
    shadowColor: '#7c3aed',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  popularBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  planHeader: {
    marginBottom: 20,
  },
  planNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  planName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: 0.3,
  },
  selectedCheckmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f5f3ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  priceSymbol: {
    fontSize: 20,
    fontWeight: '700',
    color: '#7c3aed',
  },
  price: {
    fontSize: 36,
    fontWeight: '800',
    color: '#7c3aed',
    letterSpacing: -0.5,
  },
  pricePeriod: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '500',
  },
  creditsSection: {
    marginBottom: 20,
  },
  creditsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  creditsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  creditsInfo: {
    flex: 1,
  },
  creditsAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  creditsLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  featuresList: {
    gap: 14,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    lineHeight: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginTop: 8,
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#1e40af',
    lineHeight: 18,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 10,
  },
  subscribeButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
  },
  subscribeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default SubscriptionPlansScreen;
