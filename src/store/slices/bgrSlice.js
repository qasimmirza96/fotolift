import { createSlice } from '@reduxjs/toolkit';

const bgrSlice = createSlice({
  name: 'bgr',
  initialState: {
    mode: null, // 'single' or 'folder'
    mainImage: null,
    backgroundImage: null,
    folder: null,
    isProcessing: false,
    processedImages: [],
    error: null,
  },
  reducers: {
    setMode: (state, action) => {
      console.log('🎯 BGR Mode set:', action.payload);
      state.mode = action.payload;
      // Clear previous data when mode changes
      state.mainImage = null;
      state.backgroundImage = null;
      state.folder = null;
      state.error = null;
    },
    setMainImage: (state, action) => {
      console.log('📸 Main image set:', action.payload);
      state.mainImage = action.payload;
    },
    setBackgroundImage: (state, action) => {
      console.log('🖼️ Background image set:', action.payload);
      state.backgroundImage = action.payload;
    },
    setFolder: (state, action) => {
      console.log('📁 Folder set:', action.payload);
      state.folder = action.payload;
    },
    setProcessing: (state, action) => {
      state.isProcessing = action.payload;
    },
    setProcessedImages: (state, action) => {
      state.processedImages = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetBgr: (state) => {
      console.log('🔄 BGR state reset');
      state.mode = null;
      state.mainImage = null;
      state.backgroundImage = null;
      state.folder = null;
      state.isProcessing = false;
      state.processedImages = [];
      state.error = null;
    },
  },
});

export const {
  setMode,
  setMainImage,
  setBackgroundImage,
  setFolder,
  setProcessing,
  setProcessedImages,
  setError,
  resetBgr,
} = bgrSlice.actions;

export default bgrSlice.reducer;