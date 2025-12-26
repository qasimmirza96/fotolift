# 💳 Credits & Subscription System - Frontend Implementation

## ✅ What's Been Implemented

This document describes the **frontend-only** implementation of the credits and subscription system. All API calls are **mocked** and work without a backend. Real API integration is commented and ready to be enabled when the backend is ready.

---

## 📦 Installed Packages

- ✅ `@stripe/stripe-react-native` - Stripe SDK (installed, but using mock payments for now)

---

## 🗂️ Files Created/Modified

### **New Components**
1. **`src/components/CreditsDisplay.js`**
   - Displays user's credit balance in the header
   - Color-coded based on balance (red/orange/green)
   - Shows "Pro" badge for active subscriptions
   - Clickable to navigate to subscription plans

2. **`src/components/InsufficientCreditsModal.js`**
   - Modal shown when user doesn't have enough credits
   - Displays credits needed, current balance, and shortfall
   - Prompts user to subscribe
   - Beautiful, user-friendly UI

3. **`src/screens/SubscriptionPlansScreen.js`**
   - Full subscription plans screen
   - Shows all available plans (Basic, Pro, Premium)
   - Mock payment flow (no real Stripe charges)
   - Plan selection and subscription creation

### **Updated Services (Mock Mode)**
1. **`src/services/creditsService.js`**
   - ✅ All API calls are **mocked** (commented real calls ready)
   - Uses local state: `mockCreditsBalance`, `mockCreditHistory`
   - Starts with 10 trial credits
   - Functions:
     - `getCredits()` - Returns mock balance
     - `deductCredits()` - Deducts from mock balance
     - `getHistory()` - Returns mock transaction history
     - `addCredits()` - Adds credits (for subscriptions)

2. **`src/services/subscriptionService.js`**
   - ✅ All API calls are **mocked** (commented real calls ready)
   - Uses local state: `mockCurrentSubscription`
   - Functions:
     - `getPlans()` - Returns subscription plans
     - `createSubscription()` - Creates mock subscription (no real payment)
     - `getCurrentSubscription()` - Returns mock subscription
     - `cancelSubscription()` - Cancels mock subscription

### **Updated Redux Store**
1. **`src/store/simpleStore.js`**
   - ✅ Added `creditsReducer` and `subscriptionReducer` to store

2. **`src/store/slices/creditsSlice.js`**
   - ✅ Initialized with 10 trial credits
   - Manages credits balance, history, and subscription status

3. **`src/store/slices/subscriptionSlice.js`**
   - ✅ Manages subscription plans and current subscription

### **Feature Integration**
1. **`src/screens/TryOnGearScreen.js`**
   - ✅ Integrated credit checks before processing
   - ✅ Shows `CreditsDisplay` in header
   - ✅ Shows `InsufficientCreditsModal` when credits are low
   - ✅ Deducts credits after successful processing
   - ✅ Calculates credits based on mode (single/folder/multi-folder)

2. **`src/navigation/TabNavigator.js`**
   - ✅ Added route for `SubscriptionPlans` screen
   - ✅ Navigation support for subscription flow

---

## 🎯 How It Works (Mock Mode)

### **1. Credit Balance**
- Users start with **10 trial credits**
- Credits are stored in local state (not persisted)
- Balance updates immediately after operations

### **2. Credit Deduction**
When a user processes a feature:
1. System calculates credits needed based on:
   - Feature type (e.g., `tryon_gear`)
   - Mode (single/folder/multi-folder)
   - Number of inputs (images)
2. Checks if user has sufficient credits
3. If insufficient → Shows modal → Redirects to subscribe
4. If sufficient → Processes → Deducts credits → Updates balance

### **3. Subscription Flow (Mock)**
1. User clicks on `CreditsDisplay` or gets insufficient credits modal
2. Navigates to `SubscriptionPlansScreen`
3. Selects a plan (Basic/Pro/Premium)
4. Clicks "Subscribe Now"
5. **Mock Payment Alert** appears (no real charge)
6. User confirms → Subscription created → Credits added
7. Balance updates immediately

### **4. Credit Costs**
Based on `CREDITS_SYSTEM_QUICK_START.md`:
- **Try-On Gear:**
  - Single: 2 credits
  - Folder: 1.5 credits/image
  - Multi-Folder: 1.2 credits/image

---

## 🔄 Switching to Real Backend

When your backend is ready, follow these steps:

### **Step 1: Update `creditsService.js`**
Uncomment the real API calls and remove mock implementations:

```javascript
// Remove mock variables at top
// let mockCreditsBalance = 10;
// let mockCreditHistory = [];

// Uncomment real API calls in each function
getCredits: async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/credits`);
    return response.data;
  } catch (error) {
    console.error('Error fetching credits:', error);
    throw error;
  }
},
```

### **Step 2: Update `subscriptionService.js`**
Uncomment real Stripe integration:

```javascript
createSubscription: async ({ planId, paymentMethodId }) => {
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
},
```

### **Step 3: Integrate Real Stripe**
In `SubscriptionPlansScreen.js`, replace mock payment with real Stripe:

```javascript
// Install: npm install @stripe/stripe-react-native
import { useStripe } from '@stripe/stripe-react-native';

const { initPaymentSheet, presentPaymentSheet } = useStripe();

// Replace mock payment with real Stripe flow
const { error } = await presentPaymentSheet();
```

### **Step 4: Update API Base URL**
In `src/services/apiRoutes.js`:
```javascript
export const API_BASE_URL = 'https://your-backend-url.com/api';
```

---

## 🧪 Testing the Mock System

### **Test Credit Deduction:**
1. Open app → Go to "Try-On Gear"
2. Select model and accessories
3. Click "Process Try-On"
4. Check console logs for credit deduction
5. Check `CreditsDisplay` for updated balance

### **Test Insufficient Credits:**
1. Use all credits (process multiple times)
2. Try to process again
3. Should see `InsufficientCreditsModal`
4. Click "Subscribe Now" → Navigate to plans

### **Test Subscription:**
1. Click on `CreditsDisplay` in header
2. Select a plan
3. Click "Subscribe Now"
4. Confirm mock payment
5. Check balance updates

---

## 📊 Current State

| Component | Status | Notes |
|-----------|--------|-------|
| Credits Display | ✅ Working | Shows in TryOnGearScreen header |
| Credit Checks | ✅ Working | Integrated in TryOnGearScreen |
| Insufficient Credits Modal | ✅ Working | Shows when credits are low |
| Subscription Plans Screen | ✅ Working | Mock payment flow |
| Credit Deduction | ✅ Working | Mock mode |
| Credit History | ✅ Working | Mock mode |
| Real API Calls | ⏸️ Commented | Ready to uncomment |
| Real Stripe Payment | ⏸️ Commented | Ready to integrate |

---

## 🎨 UI Features

- **CreditsDisplay**: Color-coded balance indicator
- **InsufficientCreditsModal**: Beautiful, informative modal
- **SubscriptionPlansScreen**: Modern card-based plan selection
- **Mock Payment Alert**: Clear indication it's a test

---

## 📝 Notes

1. **No Persistence**: Mock credits are not saved between app restarts
2. **No Real Payments**: All payments are simulated
3. **Ready for Backend**: All real API code is commented and ready
4. **Easy Migration**: Just uncomment real code and remove mocks

---

## 🚀 Next Steps

1. ✅ Frontend implementation complete
2. ⏳ Implement backend API endpoints
3. ⏳ Set up Stripe account and webhooks
4. ⏳ Uncomment real API calls
5. ⏳ Test with real backend
6. ⏳ Add credit persistence (AsyncStorage or backend)

---

**Status:** ✅ Frontend Mock System Complete  
**Ready for:** Backend Integration




