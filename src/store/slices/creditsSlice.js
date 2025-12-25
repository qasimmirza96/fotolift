import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { creditsAPI } from '../../services/creditsService';

// Async thunks
export const fetchUserCredits = createAsyncThunk(
  'credits/fetchUserCredits',
  async (_, { rejectWithValue }) => {
    try {
      const response = await creditsAPI.getCredits();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deductCredits = createAsyncThunk(
  'credits/deductCredits',
  async ({ feature, credits, inputCount }, { rejectWithValue }) => {
    try {
      const response = await creditsAPI.deductCredits({ feature, credits, inputCount });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getCreditHistory = createAsyncThunk(
  'credits/getCreditHistory',
  async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await creditsAPI.getHistory({ page, limit });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const creditsSlice = createSlice({
  name: 'credits',
  initialState: {
    balance: 10, // MOCK: Start with trial credits (10)
    subscriptionStatus: 'free', // 'free', 'active', 'cancelled', 'expired'
    plan: null,
    nextRenewal: null,
    isLoading: false,
    error: null,
    history: [],
    historyPage: 1,
    hasMoreHistory: true,
  },
  reducers: {
    setCredits: (state, action) => {
      state.balance = action.payload.balance;
      state.subscriptionStatus = action.payload.subscriptionStatus;
      state.plan = action.payload.plan;
      state.nextRenewal = action.payload.nextRenewal;
    },
    updateBalance: (state, action) => {
      state.balance = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetCredits: (state) => {
      state.balance = 0;
      state.subscriptionStatus = 'free';
      state.plan = null;
      state.nextRenewal = null;
      state.history = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch credits
      .addCase(fetchUserCredits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserCredits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance = action.payload.balance;
        state.subscriptionStatus = action.payload.subscriptionStatus;
        state.plan = action.payload.plan;
        state.nextRenewal = action.payload.nextRenewal;
      })
      .addCase(fetchUserCredits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Deduct credits
      .addCase(deductCredits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deductCredits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance = action.payload.new_balance;
      })
      .addCase(deductCredits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get history
      .addCase(getCreditHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCreditHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.page === 1) {
          state.history = action.payload.transactions;
        } else {
          state.history = [...state.history, ...action.payload.transactions];
        }
        state.historyPage = action.payload.page;
        state.hasMoreHistory = action.payload.transactions.length === action.payload.limit;
      })
      .addCase(getCreditHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setCredits, updateBalance, clearError, resetCredits } = creditsSlice.actions;
export default creditsSlice.reducer;

