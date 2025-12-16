import { configureStore, createSlice } from '@reduxjs/toolkit';

console.log('🏪 SimpleStore: Creating minimal store...');

// Simple auth slice without async thunks
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

// Simple photos slice without async thunks
const photosSlice = createSlice({
  name: 'photos',
  initialState: {
    photos: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setPhotos: (state, action) => {
      state.photos = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    photos: photosSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

console.log('✅ SimpleStore: Store created successfully');

export const authActions = authSlice.actions;
export const photosActions = photosSlice.actions;
export default store;