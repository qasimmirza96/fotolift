import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/apiMethods';
import { LOCAL_IMAGES } from '../../constants';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    console.log('🔐 Login attempt:', credentials.email);
    try {
      const response = await authAPI.login(credentials);
      console.log('✅ Login successful');
      return response;
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    console.log('📝 Registration attempt:', userData.email);
    try {
      const response = await authAPI.register(userData);
      console.log('✅ Registration successful');
      return response;
    } catch (error) {
      console.error('❌ Registration failed:', error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {
      name: 'Alexandra Chen',
      email: 'alexandra.chen@fotolift.com',
      profileImage:LOCAL_IMAGES.qasim,
      coverImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=300&fit=crop',
      bio: 'Professional photographer & visual storyteller. Capturing moments that matter.',
      location: 'San Francisco, CA',
      website: 'www.alexchen.photo',
      joinDate: 'March 2023',
      verified: true,
      loginMethod: 'google',
    },
    token: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    signup: (state, action) => {
      console.log('📝 Simple signup (no API)');
      state.user = action.payload.user;
      state.token = 'mock-token';
      state.isAuthenticated = true;
      state.error = null;
    },
    login: (state, action) => {
      console.log('🔐 Simple login (no API)');
      state.user = action.payload.user;
      state.token = 'mock-token';
      state.isAuthenticated = true;
      state.error = null;
    },
    logout: (state) => {
      console.log('🚪 User logged out');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateProfile: (state, action) => {
      console.log('✏️ Profile updated', action.payload);
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      } else {
        state.user = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        console.log('⏳ Login pending...');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('✅ Login fulfilled');
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log('❌ Login rejected');
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        console.log('⏳ Registration pending...');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.log('✅ Registration fulfilled');
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        console.log('❌ Registration rejected');
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { signup, login, logout, setError, clearError, updateProfile } = authSlice.actions;
export default authSlice.reducer;