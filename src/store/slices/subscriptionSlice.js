import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { subscriptionAPI } from '../../services/subscriptionService';

// Async thunks
export const fetchPlans = createAsyncThunk(
  'subscription/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.getPlans();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSubscription = createAsyncThunk(
  'subscription/createSubscription',
  async ({ planId, paymentMethodId }, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.createSubscription({ planId, paymentMethodId });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getCurrentSubscription = createAsyncThunk(
  'subscription/getCurrentSubscription',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.getCurrentSubscription();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  'subscription/cancelSubscription',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.cancelSubscription();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    plans: [],
    currentSubscription: null,
    isLoading: false,
    error: null,
    paymentProcessing: false,
  },
  reducers: {
    setPlans: (state, action) => {
      state.plans = action.payload;
    },
    setCurrentSubscription: (state, action) => {
      state.currentSubscription = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPaymentProcessing: (state, action) => {
      state.paymentProcessing = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch plans
      .addCase(fetchPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans = action.payload.plans;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create subscription
      .addCase(createSubscription.pending, (state) => {
        state.paymentProcessing = true;
        state.error = null;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.paymentProcessing = false;
        state.currentSubscription = action.payload;
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.paymentProcessing = false;
        state.error = action.payload;
      })
      // Get current subscription
      .addCase(getCurrentSubscription.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSubscription = action.payload;
      })
      .addCase(getCurrentSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Cancel subscription
      .addCase(cancelSubscription.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelSubscription.fulfilled, (state) => {
        state.isLoading = false;
        state.currentSubscription = null;
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setPlans, setCurrentSubscription, clearError, setPaymentProcessing } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;



