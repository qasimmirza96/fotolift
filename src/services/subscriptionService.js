import axios from 'axios';
import { API_BASE_URL } from './apiRoutes';

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    credits: 100,
    currency: 'usd',
    interval: 'month',
    features: [
      'All AI features',
      '100 credits/month',
      'Email support',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    credits: 300,
    currency: 'usd',
    interval: 'month',
    features: [
      'All AI features',
      '300 credits/month',
      'Priority processing',
      'Email support',
    ],
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 39.99,
    credits: 1000,
    currency: 'usd',
    interval: 'month',
    features: [
      'All AI features',
      '1000 credits/month',
      'Priority processing',
      'API access',
      'Priority support',
    ],
  },
};

// ============================================
// MOCK MODE: Frontend-only implementation
// ============================================
// TODO: When backend is ready, uncomment the real API calls below
// and remove the mock implementations

// Mock subscription state
let mockCurrentSubscription = null;

export const subscriptionAPI = {
  /**
   * Get available subscription plans
   * MOCK: Returns local plan data
   * TODO: Replace with real API call when backend is ready
   */
  getPlans: async () => {
    // MOCK IMPLEMENTATION - Frontend only
    console.log('💳 [MOCK] Fetching subscription plans');
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      plans: Object.values(SUBSCRIPTION_PLANS),
    };

    // REAL API CALL (commented until backend is ready)
    /*
    try {
      const response = await axios.get(`${API_BASE_URL}/subscriptions/plans`);
      return response.data;
    } catch (error) {
      console.error('Error fetching plans:', error);
      throw error;
    }
    */
  },

  /**
   * Create a new subscription
   * MOCK: Simulates subscription creation
   * TODO: Replace with real Stripe integration when backend is ready
   */
  createSubscription: async ({ planId, paymentMethodId }) => {
    // MOCK IMPLEMENTATION - Frontend only
    console.log(`💳 [MOCK] Creating subscription for plan: ${planId}`);
    console.log('⚠️ [MOCK] Payment processing is simulated - no real payment');
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan) {
      throw new Error('Invalid plan ID');
    }

    // Create mock subscription
    mockCurrentSubscription = {
      id: `sub_mock_${Date.now()}`,
      plan_id: planId,
      plan_name: plan.name,
      status: 'active',
      credits_per_month: plan.credits,
      price: plan.price,
      currency: plan.currency,
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      auto_renew: true,
    };

    // Add credits to user account (mock)
    const { creditsAPI } = await import('./creditsService');
    await creditsAPI.addCredits({
      credits: plan.credits,
      source: 'subscription',
      description: `Subscription: ${plan.name} - ${plan.credits} credits`,
    });

    // Update subscription status in credits service
    const creditsService = await import('./creditsService');
    if (creditsService.mockSubscriptionStatus !== undefined) {
      creditsService.mockSubscriptionStatus = 'active';
    }

    return mockCurrentSubscription;

    // REAL API CALL (commented until backend is ready)
    /*
    try {
      const response = await axios.post(`${API_BASE_URL}/subscriptions/create`, {
        plan_id: planId,
        payment_method_id: paymentMethodId,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
    */
  },

  /**
   * Get current user subscription
   * MOCK: Returns local subscription state
   * TODO: Replace with real API call when backend is ready
   */
  getCurrentSubscription: async () => {
    // MOCK IMPLEMENTATION - Frontend only
    console.log('💳 [MOCK] Fetching current subscription');
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockCurrentSubscription;

    // REAL API CALL (commented until backend is ready)
    /*
    try {
      const response = await axios.get(`${API_BASE_URL}/subscriptions/current`);
      return response.data;
    } catch (error) {
      console.error('Error fetching current subscription:', error);
      throw error;
    }
    */
  },

  /**
   * Cancel current subscription
   * MOCK: Simulates cancellation
   * TODO: Replace with real API call when backend is ready
   */
  cancelSubscription: async () => {
    // MOCK IMPLEMENTATION - Frontend only
    console.log('💳 [MOCK] Cancelling subscription');
    
    await new Promise(resolve => setTimeout(resolve, 500));

    if (mockCurrentSubscription) {
      mockCurrentSubscription.status = 'cancelled';
      mockCurrentSubscription.cancelled_at = new Date().toISOString();
    }

    return {
      success: true,
      cancelled_at: new Date().toISOString(),
      access_until: mockCurrentSubscription?.current_period_end,
    };

    // REAL API CALL (commented until backend is ready)
    /*
    try {
      const response = await axios.post(`${API_BASE_URL}/subscriptions/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
    */
  },
};

