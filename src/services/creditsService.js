import axios from 'axios';
import { API_BASE_URL } from './apiRoutes';

// Credit costs per feature
export const CREDIT_COSTS = {
  background_remover: {
    single: 1,
    folder: 0.8, // per image with discount
  },
  image_enhancer: {
    single: 2,
    folder: 1.5,
  },
  wrinkle_remover: {
    single: 1,
    folder: 0.8,
  },
  centralized_image: {
    single: 1,
    folder: 0.8,
  },
  ai_model_tryon: {
    single: 3,
  },
  tryon_gear: {
    single: 2,
    folder: 1.5,
    multi_folder: 1.2,
  },
  image_to_video: {
    single: 5,
  },
};

/**
 * Calculate credits needed for a feature
 * @param {string} feature - Feature name
 * @param {string} mode - 'single', 'folder', 'multi_folder'
 * @param {number} inputCount - Number of inputs (images)
 * @returns {number} Credits needed
 */
export function calculateCreditsNeeded(feature, mode, inputCount = 1) {
  const featureCosts = CREDIT_COSTS[feature];
  if (!featureCosts) {
    console.warn(`Unknown feature: ${feature}`);
    return 0;
  }

  const costPerItem = featureCosts[mode] || featureCosts.single || 0;
  return Math.ceil(costPerItem * inputCount);
}

// ============================================
// MOCK MODE: Frontend-only implementation
// ============================================
// TODO: When backend is ready, uncomment the real API calls below
// and remove the mock implementations

// Mock storage for credits (using AsyncStorage in production)
let mockCreditsBalance = 10; // Start with trial credits
let mockCreditHistory = [];
let mockSubscriptionStatus = 'free';

export const creditsAPI = {
  /**
   * Get user's current credits balance
   * MOCK: Returns local state
   * TODO: Replace with real API call when backend is ready
   */
  getCredits: async () => {
    // MOCK IMPLEMENTATION - Frontend only
    console.log('💳 [MOCK] Fetching credits from local state');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      balance: mockCreditsBalance,
      subscription_status: mockSubscriptionStatus,
      plan: mockSubscriptionStatus === 'free' ? null : mockSubscriptionStatus,
      next_renewal: mockSubscriptionStatus !== 'free' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() 
        : null,
    };

    // REAL API CALL (commented until backend is ready)
    /*
    try {
      const response = await axios.get(`${API_BASE_URL}/user/credits`);
      return response.data;
    } catch (error) {
      console.error('Error fetching credits:', error);
      throw error;
    }
    */
  },

  /**
   * Deduct credits for a feature usage
   * MOCK: Deducts from local state
   * TODO: Replace with real API call when backend is ready
   */
  deductCredits: async ({ feature, credits, inputCount }) => {
    // MOCK IMPLEMENTATION - Frontend only
    console.log(`💳 [MOCK] Deducting ${credits} credits for ${feature}`);
    
    // Check if sufficient credits
    if (mockCreditsBalance < credits) {
      throw new Error('Insufficient credits');
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const balanceBefore = mockCreditsBalance;
    mockCreditsBalance -= credits;
    const balanceAfter = mockCreditsBalance;

    // Add to history
    mockCreditHistory.unshift({
      id: Date.now().toString(),
      type: 'deduction',
      amount: credits,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      source: 'feature_usage',
      feature_used: feature,
      description: `Used ${credits} credits for ${feature}`,
      created_at: new Date().toISOString(),
    });

    return {
      success: true,
      new_balance: balanceAfter,
      transaction_id: Date.now().toString(),
    };

    // REAL API CALL (commented until backend is ready)
    /*
    try {
      const response = await axios.post(`${API_BASE_URL}/credits/deduct`, {
        feature,
        credits,
        input_count: inputCount,
      });
      return response.data;
    } catch (error) {
      console.error('Error deducting credits:', error);
      throw error;
    }
    */
  },

  /**
   * Get credit transaction history
   * MOCK: Returns local history
   * TODO: Replace with real API call when backend is ready
   */
  getHistory: async ({ page = 1, limit = 20 }) => {
    // MOCK IMPLEMENTATION - Frontend only
    console.log(`💳 [MOCK] Fetching credit history - page ${page}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const start = (page - 1) * limit;
    const end = start + limit;
    const transactions = mockCreditHistory.slice(start, end);

    return {
      transactions,
      total: mockCreditHistory.length,
      page,
      limit,
    };

    // REAL API CALL (commented until backend is ready)
    /*
    try {
      const response = await axios.get(`${API_BASE_URL}/credits/history`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching credit history:', error);
      throw error;
    }
    */
  },

  /**
   * Add credits (for subscription or testing)
   * MOCK: Adds to local state
   */
  addCredits: async ({ credits, source = 'subscription', description }) => {
    console.log(`💳 [MOCK] Adding ${credits} credits from ${source}`);
    
    await new Promise(resolve => setTimeout(resolve, 200));

    const balanceBefore = mockCreditsBalance;
    mockCreditsBalance += credits;
    const balanceAfter = mockCreditsBalance;

    mockCreditHistory.unshift({
      id: Date.now().toString(),
      type: 'addition',
      amount: credits,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      source,
      description: description || `Added ${credits} credits`,
      created_at: new Date().toISOString(),
    });

    return {
      success: true,
      new_balance: balanceAfter,
    };
  },
};

