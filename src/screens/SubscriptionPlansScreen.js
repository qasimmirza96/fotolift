import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlans, createSubscription } from '../store/slices/subscriptionSlice';
import { fetchUserCredits } from '../store/slices/creditsSlice';
import { SUBSCRIPTION_PLANS } from '../services/subscriptionService';

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
      // MOCK: Simulate payment (no real Stripe call)
      console.log('💳 [MOCK] Processing subscription payment...');
      console.log('⚠️ [MOCK] This is a simulated payment - no real charge');
      
      Alert.alert(
        'Mock Payment',
        'This is a mock payment. In production, this would redirect to Stripe checkout.\n\nProceed with mock subscription?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Proceed (Mock)',
            onPress: async () => {
              // MOCK: Create subscription without real payment
              const result = await dispatch(
                createSubscription({
                  planId: selectedPlan,
                  paymentMethodId: 'mock_payment_method', // Mock payment method
                })
              ).unwrap();

              if (result) {
                // Refresh credits
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

      // REAL STRIPE INTEGRATION (commented until backend is ready)
      /*
      // This would be the real flow:
      // 1. Create payment intent on backend
      // 2. Use Stripe SDK to collect payment
      // 3. Confirm payment
      // 4. Create subscription
      
      const result = await dispatch(
        createSubscription({
          planId: selectedPlan,
          paymentMethodId: paymentMethod.id, // From Stripe
        })
      ).unwrap();
      */
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
        activeOpacity={0.8}
      >
        {isPopular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularBadgeText}>Most Popular</Text>
          </View>
        )}
        
        <View style={styles.planHeader}>
          <Text style={styles.planName}>{plan.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${plan.price}</Text>
            <Text style={styles.pricePeriod}>/month</Text>
          </View>
        </View>

        <View style={styles.creditsContainer}>
          <Ionicons name="diamond" size={24} color="#7c3aed" />
          <Text style={styles.creditsAmount}>{plan.credits}</Text>
          <Text style={styles.creditsLabel}>credits/month</Text>
        </View>

        <View style={styles.featuresList}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={18} color="#10b981" />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Ionicons name="checkmark-circle" size={24} color="#7c3aed" />
            <Text style={styles.selectedText}>Selected</Text>
          </View>
        )}
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Your Plan</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Balance */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Your Current Credits</Text>
          <View style={styles.balanceValueContainer}>
            <Ionicons name="diamond" size={28} color="#7c3aed" />
            <Text style={styles.balanceValue}>{balance}</Text>
          </View>
        </View>

        {/* Plans */}
        <Text style={styles.sectionTitle}>Subscription Plans</Text>
        <View style={styles.plansContainer}>
          {Object.values(SUBSCRIPTION_PLANS).map((plan) => renderPlanCard(plan))}
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color="#3b82f6" />
          <Text style={styles.infoText}>
            Credits renew automatically every month. Cancel anytime.
          </Text>
        </View>
      </ScrollView>

      {/* Subscribe Button */}
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
            colors={selectedPlan ? ['#7c3aed', '#a855f7'] : ['#d1d5db', '#9ca3af']}
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
                <Ionicons name="diamond" size={20} color="#fff" />
                <Text style={styles.subscribeButtonText}>
                  {selectedPlan ? 'Subscribe Now' : 'Select a Plan'}
                </Text>
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
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
  },
  balanceCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  balanceValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  plansContainer: {
    gap: 16,
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#7c3aed',
    backgroundColor: '#faf5ff',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: '#7c3aed',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  planHeader: {
    marginBottom: 16,
  },
  planName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  price: {
    fontSize: 32,
    fontWeight: '800',
    color: '#7c3aed',
  },
  pricePeriod: {
    fontSize: 16,
    color: '#6b7280',
  },
  creditsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  creditsAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  creditsLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  featuresList: {
    gap: 12,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  selectedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7c3aed',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  subscribeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
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
});

export default SubscriptionPlansScreen;



