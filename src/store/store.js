import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import authSlice from './slices/authSlice';
import photoSlice from './slices/photoSlice';
import imageEnhancerSlice from './slices/imageEnhancerSlice';
import wrinkleRemoverSlice from './slices/wrinkleRemoverSlice';

console.log('🏪 Store: Configuring Redux Store...');

const store = configureStore({
  reducer: {
    auth: authSlice,
    photos: photoSlice,
    imageEnhancer: imageEnhancerSlice,
    wrinkleRemover: wrinkleRemoverSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(logger),
  devTools: true,
});

console.log('✅ Store: Redux Store configured successfully');
console.log('📊 Store: Store reducers:', Object.keys(store.getState()));

export default store;