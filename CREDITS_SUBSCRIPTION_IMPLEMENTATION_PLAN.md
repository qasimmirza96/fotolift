# 💳 FotoLift - Credits & Subscription System Implementation Plan

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Design](#architecture-design)
3. [Database Schema](#database-schema)
4. [Subscription Plans](#subscription-plans)
5. [Credits System](#credits-system)
6. [Stripe Integration](#stripe-integration)
7. [Implementation Steps](#implementation-steps)
8. [Code Structure](#code-structure)
9. [UI/UX Flow](#uiux-flow)
10. [API Endpoints](#api-endpoints)
11. [Security Considerations](#security-considerations)

---

## 🎯 System Overview

### Core Concept
- **Credits-Based System**: Every feature uses credits
- **Subscription Plans**: Users subscribe to get monthly credits
- **Payment Gateway**: Stripe for secure payments
- **Credit Deduction**: Automatic deduction per feature usage

### User Flow
1. User signs up → Gets free trial credits (e.g., 10 credits)
2. User uses features → Credits deducted per operation
3. User runs out → Prompted to subscribe
4. User subscribes → Gets monthly credits based on plan
5. Credits renew monthly → Auto-renewal via Stripe

---

## 🏗️ Architecture Design

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React Native)              │
├─────────────────────────────────────────────────────────┤
│  • Credits Display Component                            │
│  • Subscription Plans Screen                            │
│  • Payment Screen (Stripe)                              │
│  • Credit Check Middleware                              │
│  • Usage History Screen                                 │
└─────────────────────────────────────────────────────────┘
                          ↕ API Calls
┌─────────────────────────────────────────────────────────┐
│                    Backend API                           │
├─────────────────────────────────────────────────────────┤
│  • User Credits Management                               │
│  • Subscription Management                               │
│  • Stripe Webhook Handler                                │
│  • Credit Deduction Service                              │
│  • Usage Tracking                                        │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                    Database                              │
├─────────────────────────────────────────────────────────┤
│  • Users (credits, subscription_status)                 │
│  • Subscriptions (plan, stripe_subscription_id)          │
│  • Credit Transactions (deductions, additions)          │
│  • Usage Logs (feature, credits_used, timestamp)         │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                    Stripe                                │
├─────────────────────────────────────────────────────────┤
│  • Customer Management                                   │
│  • Subscription Management                               │
│  • Payment Processing                                    │
│  • Webhooks (payment_succeeded, subscription_updated)     │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### Users Table (Extended)
```sql
users {
  id: UUID
  email: string
  name: string
  credits_balance: integer (default: 0)
  subscription_status: enum ('free', 'active', 'cancelled', 'expired')
  stripe_customer_id: string (nullable)
  trial_credits_used: boolean (default: false)
  created_at: timestamp
  updated_at: timestamp
}
```

### Subscriptions Table
```sql
subscriptions {
  id: UUID
  user_id: UUID (foreign key)
  plan_id: string ('basic', 'pro', 'premium')
  stripe_subscription_id: string
  status: enum ('active', 'cancelled', 'past_due', 'unpaid')
  current_period_start: timestamp
  current_period_end: timestamp
  credits_per_month: integer
  price: decimal
  currency: string (default: 'usd')
  created_at: timestamp
  updated_at: timestamp
}
```

### Credit Transactions Table
```sql
credit_transactions {
  id: UUID
  user_id: UUID (foreign key)
  type: enum ('deduction', 'addition', 'refund')
  amount: integer
  balance_before: integer
  balance_after: integer
  source: string ('subscription', 'trial', 'feature_usage', 'refund')
  feature_used: string (nullable) -- e.g., 'background_remover'
  description: text
  created_at: timestamp
}
```

### Usage Logs Table
```sql
usage_logs {
  id: UUID
  user_id: UUID (foreign key)
  feature_name: string
  credits_used: integer
  input_count: integer (e.g., number of images)
  status: enum ('success', 'failed', 'insufficient_credits')
  metadata: jsonb (additional info)
  created_at: timestamp
}
```

---

## 💎 Subscription Plans

### Plan Structure

| Plan | Price/Month | Credits/Month | Features | Best For |
|------|-------------|---------------|----------|----------|
| **Free** | $0 | 10 (one-time trial) | All features (limited) | Trying out |
| **Basic** | $9.99 | 100 credits | All features | Casual users |
| **Pro** | $19.99 | 300 credits | All features + Priority | Professionals |
| **Premium** | $39.99 | 1000 credits | All features + Priority + API | Power users |

### Credit Costs Per Feature

| Feature | Credits Per Operation | Notes |
|---------|----------------------|-------|
| Background Remover | 1 credit/image | Single image |
| Background Remover (Folder) | 0.8 credits/image | Batch discount |
| Image Enhancer | 2 credits/image | Higher processing cost |
| Image Enhancer (Folder) | 1.5 credits/image | Batch discount |
| Wrinkle Remover | 1 credit/image | |
| Wrinkle Remover (Folder) | 0.8 credits/image | |
| Centralized Image | 1 credit/image | |
| AI Model Try-On | 3 credits/operation | Complex AI processing |
| Try-On Gear (Single) | 2 credits/operation | |
| Try-On Gear (Folder) | 1.5 credits/image | |
| Try-On Gear (Multi-Folder) | 1.2 credits/image | Bulk discount |
| Image to Video | 5 credits/operation | Most expensive |

---

## 💰 Credits System Logic

### Credit Deduction Flow

```
User Action → Check Credits → Deduct → Process → Log
     ↓              ↓            ↓        ↓       ↓
  Feature      Sufficient?    Update   Execute  Record
  Selected     Yes/No         Balance  Feature  Usage
```

### Credit Addition Flow

```
Subscription → Stripe Webhook → Add Credits → Update Balance
   Payment      Payment Success    Monthly      User Account
```

### Credit Check Middleware

```javascript
// Pseudo-code
async function checkAndDeductCredits(userId, feature, creditsNeeded) {
  // 1. Get user's current balance
  const user = await getUser(userId);
  
  // 2. Check if sufficient credits
  if (user.credits_balance < creditsNeeded) {
    throw new InsufficientCreditsError();
  }
  
  // 3. Deduct credits (atomic operation)
  const transaction = await createTransaction({
    user_id: userId,
    type: 'deduction',
    amount: creditsNeeded,
    balance_before: user.credits_balance,
    balance_after: user.credits_balance - creditsNeeded,
    source: 'feature_usage',
    feature_used: feature
  });
  
  // 4. Update user balance
  await updateUserBalance(userId, transaction.balance_after);
  
  // 5. Return success
  return { success: true, new_balance: transaction.balance_after };
}
```

---

## 💳 Stripe Integration

### Setup Steps

1. **Install Stripe SDK**
   ```bash
   npm install @stripe/stripe-react-native
   ```

2. **Stripe Products & Prices**
   - Create products in Stripe Dashboard
   - Set up recurring prices (monthly)
   - Get Price IDs for each plan

3. **Backend Integration**
   - Create Stripe customer on user signup
   - Create subscription when user subscribes
   - Handle webhooks for payment events

### Stripe Flow

```
1. User selects plan
   ↓
2. Frontend calls backend: POST /api/subscriptions/create
   ↓
3. Backend creates Stripe Checkout Session
   ↓
4. Frontend redirects to Stripe Checkout
   ↓
5. User completes payment
   ↓
6. Stripe sends webhook: payment_succeeded
   ↓
7. Backend adds credits to user account
   ↓
8. Frontend updates UI with new credits
```

### Webhook Events to Handle

- `checkout.session.completed` - Initial subscription
- `invoice.payment_succeeded` - Monthly renewal
- `invoice.payment_failed` - Payment failed
- `customer.subscription.updated` - Plan changed
- `customer.subscription.deleted` - Cancelled

---

## 📝 Implementation Steps

### Phase 1: Backend Setup (Week 1)

1. **Database Migration**
   - Add credits fields to users table
   - Create subscriptions table
   - Create credit_transactions table
   - Create usage_logs table

2. **API Endpoints**
   - `GET /api/user/credits` - Get user credits
   - `POST /api/credits/deduct` - Deduct credits
   - `GET /api/subscriptions/plans` - Get available plans
   - `POST /api/subscriptions/create` - Create subscription
   - `POST /api/subscriptions/cancel` - Cancel subscription
   - `GET /api/usage/history` - Get usage history

3. **Stripe Integration**
   - Set up Stripe account
   - Create products and prices
   - Implement webhook handler
   - Test webhook locally (Stripe CLI)

### Phase 2: Frontend - Credits System (Week 2)

1. **Redux Slice**
   - `creditsSlice.js` - Manage credits state
   - `subscriptionSlice.js` - Manage subscription state

2. **Components**
   - `CreditsDisplay.js` - Show credits in header
   - `CreditsModal.js` - Show credits info
   - `InsufficientCreditsModal.js` - Prompt to subscribe

3. **Middleware**
   - Credit check before feature execution
   - Automatic deduction after success

### Phase 3: Frontend - Subscription Flow (Week 3)

1. **Screens**
   - `SubscriptionPlansScreen.js` - Show plans
   - `PaymentScreen.js` - Stripe payment
   - `SubscriptionStatusScreen.js` - Current subscription

2. **Stripe Integration**
   - Install Stripe React Native SDK
   - Implement payment flow
   - Handle payment success/failure

### Phase 4: Integration & Testing (Week 4)

1. **Feature Integration**
   - Add credit checks to all 7 services
   - Implement credit deduction
   - Add usage logging

2. **Testing**
   - Test credit deduction
   - Test subscription flow
   - Test webhook handling
   - Test edge cases (insufficient credits, failed payments)

---

## 📁 Code Structure

### Frontend Structure

```
src/
├── store/
│   ├── slices/
│   │   ├── creditsSlice.js          # Credits state management
│   │   └── subscriptionSlice.js     # Subscription state
│   └── simpleStore.js               # Updated with new slices
│
├── screens/
│   ├── SubscriptionPlansScreen.js   # Plan selection
│   ├── PaymentScreen.js             # Stripe payment
│   ├── SubscriptionStatusScreen.js  # Current subscription
│   └── CreditsHistoryScreen.js     # Usage history
│
├── components/
│   ├── CreditsDisplay.js            # Header credits display
│   ├── CreditsModal.js              # Credits info modal
│   ├── InsufficientCreditsModal.js  # Subscribe prompt
│   ├── PlanCard.js                  # Subscription plan card
│   └── CreditDeductionBadge.js      # Show deduction amount
│
├── services/
│   ├── creditsService.js            # Credits API calls
│   ├── subscriptionService.js       # Subscription API calls
│   └── stripeService.js            # Stripe integration
│
└── utils/
    ├── creditCalculator.js          # Calculate credits needed
    └── creditValidator.js           # Validate before action
```

### Backend Structure (Reference)

```
backend/
├── models/
│   ├── User.js                      # Extended with credits
│   ├── Subscription.js              # Subscription model
│   ├── CreditTransaction.js         # Transaction model
│   └── UsageLog.js                  # Usage log model
│
├── routes/
│   ├── credits.js                   # Credits endpoints
│   ├── subscriptions.js             # Subscription endpoints
│   └── webhooks.js                  # Stripe webhooks
│
├── services/
│   ├── creditsService.js            # Credit logic
│   ├── subscriptionService.js       # Subscription logic
│   └── stripeService.js             # Stripe integration
│
└── middleware/
    └── checkCredits.js              # Credit check middleware
```

---

## 🎨 UI/UX Flow

### 1. Credits Display (Header)

```
┌─────────────────────────────────────┐
│  FotoLift    [👤]  Credits: 45  [💎]│
└─────────────────────────────────────┘
```

- Always visible in header
- Tap to see details
- Color changes when low (< 10 credits)

### 2. Feature Usage Flow

```
User taps service
    ↓
Check credits (middleware)
    ↓
┌─────────────────────────┐
│  Sufficient Credits?     │
└─────────────────────────┘
    ↓ Yes              ↓ No
Process Feature    Show Modal
    ↓                  ↓
Deduct Credits    ┌──────────────────────┐
    ↓              │ Insufficient Credits │
Show Success      │                      │
                  │  You need 5 credits  │
                  │  Current: 2 credits  │
                  │                      │
                  │  [Subscribe Now]     │
                  │  [Cancel]            │
                  └──────────────────────┘
```

### 3. Subscription Flow

```
Home Screen
    ↓
[Get Started] or [Subscribe] button
    ↓
Subscription Plans Screen
┌─────────────────────────────────────┐
│  Choose Your Plan                    │
│                                      │
│  ┌──────────┐  ┌──────────┐         │
│  │  Basic   │  │   Pro    │  ←───   │
│  │  $9.99   │  │  $19.99  │         │
│  │  100/mo  │  │  300/mo  │         │
│  └──────────┘  └──────────┘         │
│                                      │
│  [Select Plan]                       │
└─────────────────────────────────────┘
    ↓
Payment Screen (Stripe)
┌─────────────────────────────────────┐
│  Complete Payment                    │
│                                      │
│  [Stripe Payment Form]              │
│                                      │
│  [Pay $19.99/month]                 │
└─────────────────────────────────────┘
    ↓
Success Screen
┌─────────────────────────────────────┐
│  ✅ Subscription Active!             │
│                                      │
│  You now have 300 credits            │
│  Credits renew monthly               │
│                                      │
│  [Start Using Features]              │
└─────────────────────────────────────┘
```

### 4. Credit Deduction Feedback

```
After processing:
┌─────────────────────────────────────┐
│  ✅ Background Removed!              │
│                                      │
│  Credits used: 1                    │
│  Remaining: 44 credits               │
│                                      │
│  [Download]  [Try Again]             │
└─────────────────────────────────────┘
```

---

## 🔌 API Endpoints

### Credits Endpoints

```javascript
// Get user credits
GET /api/user/credits
Response: {
  balance: 45,
  subscription_status: 'active',
  plan: 'pro',
  next_renewal: '2025-02-27'
}

// Deduct credits (internal, called by features)
POST /api/credits/deduct
Body: {
  feature: 'background_remover',
  credits: 1,
  input_count: 1
}
Response: {
  success: true,
  new_balance: 44,
  transaction_id: 'uuid'
}

// Get credit history
GET /api/credits/history?page=1&limit=20
Response: {
  transactions: [...],
  total: 150,
  page: 1
}
```

### Subscription Endpoints

```javascript
// Get available plans
GET /api/subscriptions/plans
Response: {
  plans: [
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      credits: 100,
      features: [...]
    },
    ...
  ]
}

// Create subscription
POST /api/subscriptions/create
Body: {
  plan_id: 'pro',
  payment_method_id: 'pm_xxx' // From Stripe
}
Response: {
  subscription_id: 'sub_xxx',
  client_secret: 'pi_xxx', // For Stripe payment
  status: 'pending'
}

// Get current subscription
GET /api/subscriptions/current
Response: {
  plan: 'pro',
  status: 'active',
  credits_per_month: 300,
  current_period_end: '2025-02-27',
  auto_renew: true
}

// Cancel subscription
POST /api/subscriptions/cancel
Response: {
  success: true,
  cancelled_at: '2025-01-27',
  access_until: '2025-02-27'
}
```

### Usage Endpoints

```javascript
// Get usage history
GET /api/usage/history?feature=background_remover&limit=50
Response: {
  logs: [
    {
      feature: 'background_remover',
      credits_used: 1,
      timestamp: '2025-01-27T10:30:00Z',
      status: 'success'
    },
    ...
  ],
  total_credits_used: 150,
  total_operations: 120
}
```

---

## 🔒 Security Considerations

### 1. Credit Deduction Security
- **Never trust frontend**: Always verify credits on backend
- **Atomic operations**: Use database transactions
- **Race condition prevention**: Use row-level locking

### 2. Payment Security
- **Never store card details**: Use Stripe tokens
- **Webhook verification**: Verify Stripe webhook signatures
- **Idempotency**: Handle duplicate webhook events

### 3. API Security
- **Authentication**: Require JWT tokens
- **Rate limiting**: Prevent abuse
- **Input validation**: Validate all inputs

### 4. Credit Balance Security
- **Server-side validation**: Always check on backend
- **Transaction logging**: Log all credit changes
- **Audit trail**: Keep history of all transactions

---

## 📊 Credit Calculation Examples

### Single Image Processing
```javascript
// Background Remover - Single Image
creditsNeeded = 1 * 1 = 1 credit

// Image Enhancer - Single Image
creditsNeeded = 1 * 2 = 2 credits
```

### Folder Processing
```javascript
// Background Remover - Folder with 10 images
creditsNeeded = 10 * 0.8 = 8 credits (20% discount)

// Try-On Gear - Multi-Folder (3 folders, 20 images each)
creditsNeeded = 60 * 1.2 = 72 credits (bulk discount)
```

### Complex Operations
```javascript
// Image to Video
creditsNeeded = 1 * 5 = 5 credits

// AI Model Try-On
creditsNeeded = 1 * 3 = 3 credits
```

---

## 🚀 Quick Start Implementation

### Step 1: Install Dependencies
```bash
npm install @stripe/stripe-react-native
```

### Step 2: Create Redux Slices
- `src/store/slices/creditsSlice.js`
- `src/store/slices/subscriptionSlice.js`

### Step 3: Create API Services
- `src/services/creditsService.js`
- `src/services/subscriptionService.js`

### Step 4: Create UI Components
- Credits display component
- Subscription plans screen
- Payment screen

### Step 5: Integrate with Features
- Add credit check before processing
- Deduct credits after success
- Show insufficient credits modal

---

## 📈 Future Enhancements

1. **Credit Packages**: One-time credit purchases
2. **Referral System**: Earn credits for referrals
3. **Credit Gifting**: Gift credits to other users
4. **Loyalty Program**: Bonus credits for long-term subscribers
5. **Credit Sharing**: Share credits within team accounts
6. **Usage Analytics**: Detailed usage reports
7. **Credit Alerts**: Notifications when credits are low

---

## ✅ Implementation Checklist

### Backend
- [ ] Database schema created
- [ ] API endpoints implemented
- [ ] Stripe integration complete
- [ ] Webhook handler working
- [ ] Credit deduction logic tested
- [ ] Security measures in place

### Frontend
- [ ] Redux slices created
- [ ] Credits display component
- [ ] Subscription plans screen
- [ ] Payment screen (Stripe)
- [ ] Credit check middleware
- [ ] Insufficient credits modal
- [ ] Usage history screen
- [ ] All 7 services integrated

### Testing
- [ ] Credit deduction tested
- [ ] Subscription flow tested
- [ ] Payment processing tested
- [ ] Webhook handling tested
- [ ] Edge cases covered

---

**Last Updated:** 2025-01-27  
**Status:** Planning Phase  
**Next Steps:** Begin Phase 1 - Backend Setup




