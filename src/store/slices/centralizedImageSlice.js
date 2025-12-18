import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: null, // 'single' or 'folder'
  singleImage: null, // { uri, name, size }
  folder: null, // { name, fileCount, images: [] }
  isProcessing: false,
};

const centralizedImageSlice = createSlice({
  name: 'centralizedImage',
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    setSingleImage: (state, action) => {
      console.log('Redux: CI setSingleImage called with:', action.payload);
      state.singleImage = action.payload;
      state.mode = 'single';
    },
    setFolder: (state, action) => {
      state.folder = action.payload;
      state.mode = 'folder';
    },
    setProcessing: (state, action) => {
      state.isProcessing = action.payload;
    },
    resetCentralizedImage: (state) => {
      return initialState;
    },
  },
});

export const {
  setMode,
  setSingleImage,
  setFolder,
  setProcessing,
  resetCentralizedImage,
} = centralizedImageSlice.actions;

export default centralizedImageSlice.reducer;
