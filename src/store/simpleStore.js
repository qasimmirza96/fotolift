import { configureStore, createSlice } from '@reduxjs/toolkit';
import { LOCAL_IMAGES, IMAGES } from '../constants';
import bgrReducer from './slices/bgrSlice';
import imageEnhancerReducer from './slices/imageEnhancerSlice';
import wrinkleRemoverReducer from './slices/wrinkleRemoverSlice';
import centralizedImageReducer from './slices/centralizedImageSlice';
import aiModelTryOnReducer from './slices/aiModelTryOnSlice';
import imageToVideoReducer from './slices/imageToVideoSlice';
import tryOnGearReducer from './slices/tryOnGearSlice';

console.log('🏪 SimpleStore: Creating minimal store...');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {
      name: 'Alexandra Chen',
      email: 'alexandra.chen@fotolift.com',
      profileImage: IMAGES.defaultProfile,
      coverImage: IMAGES.defaultCover,
      bio: 'Professional photographer & visual storyteller. Capturing moments that matter.',
      location: 'San Francisco, CA',
      website: 'www.alexchen.photo',
      joinDate: 'March 2023',
      verified: true,
      loginMethod: 'google',
    },
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
    updateProfile: (state, action) => {
      console.log('✏️ Profile updated', action.payload);
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      } else {
        state.user = action.payload;
      }
    },
  },
});

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
    bgr: bgrReducer,
    imageEnhancer: imageEnhancerReducer,
    wrinkleRemover: wrinkleRemoverReducer,
    centralizedImage: centralizedImageReducer,
    aiModelTryOn: aiModelTryOnReducer,
    imageToVideo: imageToVideoReducer,
    tryOnGear: tryOnGearReducer,
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
