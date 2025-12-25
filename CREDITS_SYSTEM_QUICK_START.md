# 🚀 Credits & Subscription System - Quick Start

## ✅ What's Been Created

### 1. Implementation Plan
- **File:** `CREDITS_SUBSCRIPTION_IMPLEMENTATION_PLAN.md`
- Comprehensive guide with architecture, database schema, API endpoints, and UI/UX flows

### 2. Redux Slices
- **`src/store/slices/creditsSlice.js`** - Credits state management
- **`src/store/slices/subscriptionSlice.js`** - Subscription state management

### 3. Services
- **`src/services/creditsService.js`** - Credits API calls and cost calculator
- **`src/services/subscriptionService.js`** - Subscription API calls

### 4. Utilities
- **`src/utils/creditValidator.js`** - Credit validation and formatting

### 5. Updated Files
- **`src/screens/HomeScreen.js`** - "Get Started" button now navigates to Home
- **`src/services/apiRoutes.js`** - Added credits and subscription routes

---

## 📦 Next Steps

### Step 1: Install Stripe SDK
```bash
npm install @stripe/stripe-react-native
```

### Step 2: Update Redux Store
Add the new slices to `src/store/simpleStore.js`:

```javascript
import creditsReducer from './slices/creditsSlice';
import subscriptionReducer from './slices/subscriptionSlice';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    photos: photosSlice.reducer,
    credits: creditsReducer,        // Add this
    subscription: subscriptionReducer, // Add this
    // ... other reducers
  },
});
```

### Step 3: Create UI Components

**Priority Components:**
1. `src/components/CreditsDisplay.js` - Show credits in header
2. `src/components/InsufficientCreditsModal.js` - Prompt to subscribe
3. `src/screens/SubscriptionPlansScreen.js` - Plan selection
4. `src/screens/PaymentScreen.js` - Stripe payment

### Step 4: Integrate with Features

Add credit check before each feature:

```javascript
// Example: In TryOnGearScreen.js
import { useSelector, useDispatch } from 'react-redux';
import { deductCredits } from '../store/slices/creditsSlice';
import { validateCredits } from '../utils/creditValidator';
import { calculateCreditsNeeded } from '../services/creditsService';

const { balance } = useSelector((state) => state.credits);
const dispatch = useDispatch();

// Before processing
const creditsNeeded = calculateCreditsNeeded('tryon_gear', mode, inputCount);
const validation = validateCredits(balance, 'tryon_gear', mode, inputCount);

if (!validation.hasSufficientCredits) {
  // Show insufficient credits modal
  return;
}

// After successful processing
await dispatch(deductCredits({
  feature: 'tryon_gear',
  credits: creditsNeeded,
  inputCount: inputCount
}));
```

---

## 🎯 Credit Costs Reference

### How Credits Work
- **Single Image**: Process one image at a time
- **Folder Mode**: Process multiple images in a folder (20% discount per image)
- **Multi-Folder**: Process multiple folders (40% discount per image)

### Credit Costs Per Feature

| Feature | Single Image | Folder Mode | Multi-Folder Mode | Notes |
|---------|--------------|-------------|-------------------|-------|
| **Background Remover** | 1 credit | 0.8 credits/image | Not available | Example: 10 images = 8 credits |
| **Image Enhancer** | 2 credits | 1.5 credits/image | Not available | Example: 5 images = 7.5 credits (rounded to 8) |
| **Wrinkle Remover** | 1 credit | 0.8 credits/image | Not available | Example: 20 images = 16 credits |
| **Centralized Image** | 1 credit | 0.8 credits/image | Not available | Example: 15 images = 12 credits |
| **AI Model Try-On** | 3 credits | Not available | Not available | Complex AI processing |
| **Try-On Gear** | 2 credits | 1.5 credits/image | 1.2 credits/image | Example: 3 folders (50 images) = 60 credits |
| **Image to Video** | 5 credits | Not available | Not available | Most expensive feature |

### 💡 Examples

**Example 1: Background Remover - Single Image**
- Cost: **1 credit**
- Process: 1 image → Deduct 1 credit

**Example 2: Background Remover - Folder with 10 Images**
- Cost: **8 credits** (10 images × 0.8 credits = 8 credits)
- Discount: 20% savings compared to single mode

**Example 3: Try-On Gear - Multi-Folder (3 folders, 20 images each)**
- Total images: 60 images
- Cost: **72 credits** (60 images × 1.2 credits = 72 credits)
- Discount: 40% savings compared to single mode

**Example 4: Image to Video**
- Cost: **5 credits** per video generation
- Most expensive feature due to complex processing

### 📊 Batch Processing Discounts

| Mode | Discount | Best For |
|------|----------|----------|
| Single | No discount | Testing, small jobs |
| Folder | 20% off | Regular batch processing |
| Multi-Folder | 40% off | Large-scale processing |

---

## 💳 Subscription Plans

| Plan | Price | Credits/Month |
|------|-------|---------------|
| Free | $0 | 10 (trial) |
| Basic | $9.99 | 100 |
| Pro | $19.99 | 300 |
| Premium | $39.99 | 1000 |

---

## 🔧 Backend Requirements

You'll need to implement these endpoints:

1. **GET** `/api/user/credits` - Get user credits
2. **POST** `/api/credits/deduct` - Deduct credits
3. **GET** `/api/credits/history` - Get transaction history
4. **GET** `/api/subscriptions/plans` - Get available plans
5. **POST** `/api/subscriptions/create` - Create subscription
6. **GET** `/api/subscriptions/current` - Get current subscription
7. **POST** `/api/subscriptions/cancel` - Cancel subscription
8. **POST** `/api/webhooks/stripe` - Handle Stripe webhooks

---

## 📚 Documentation

- **Full Plan:** `CREDITS_SUBSCRIPTION_IMPLEMENTATION_PLAN.md`
- **This Guide:** `CREDITS_SYSTEM_QUICK_START.md`

---

## 🎨 UI Flow Summary

1. **Credits Display** - Always visible in header
2. **Feature Usage** - Check credits → Process → Deduct
3. **Insufficient Credits** - Show modal → Redirect to subscribe
4. **Subscription** - Select plan → Pay → Get credits
5. **Monthly Renewal** - Auto-renew via Stripe webhook

---

**Status:** Foundation Ready ✅  
**Next:** Create UI Components & Integrate with Features

