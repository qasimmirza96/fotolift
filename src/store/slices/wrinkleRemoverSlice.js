import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: null, // 'single' or 'folder'
  singleImage: null, // { uri, name, size }
  folder: null, // { name, fileCount, images: [] }
  isProcessing: false,
};

const wrinkleRemoverSlice = createSlice({
  name: 'wrinkleRemover',
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    setSingleImage: (state, action) => {
      console.log('Redux: setSingleImage called with:', action.payload);
      state.singleImage = action.payload;
      state.mode = 'single';
      console.log('Redux: State updated:', { mode: state.mode, singleImage: state.singleImage });
    },
    setFolder: (state, action) => {
      state.folder = action.payload;
      state.mode = 'folder';
    },
    setProcessing: (state, action) => {
      state.isProcessing = action.payload;
    },
    resetWrinkleRemover: (state) => {
      return initialState;
    },
  },
});

export const {
  setMode,
  setSingleImage,
  setFolder,
  setProcessing,
  resetWrinkleRemover,
} = wrinkleRemoverSlice.actions;

export default wrinkleRemoverSlice.reducer;
