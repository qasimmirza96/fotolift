import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  clothImage: null,
  clothFolder: null,
  modelImage: null,
  mode: 'single', // 'single' | 'folder'
  status: 'idle', // 'idle' | 'ready' | 'processing' | 'success' | 'error'
  error: null,
  result: null,
};

// API Integration Placeholder
// TODO: Implement actual API call when backend is ready
export const generateTryOnResult = createAsyncThunk(
  'aiModelTryOn/generateResult',
  async ({ clothImage, clothFolder, modelImage, mode }, { rejectWithValue }) => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, resultUrl: 'mock_result_url' });
        }, 2000);
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const aiModelTryOnSlice = createSlice({
  name: 'aiModelTryOn',
  initialState,
  reducers: {
    setClothImage: (state, action) => {
      state.clothImage = action.payload;
      state.clothFolder = null;
      state.mode = 'single';
      state.status = state.modelImage ? 'ready' : 'idle';
    },
    setClothFolder: (state, action) => {
      state.clothFolder = action.payload;
      state.clothImage = null;
      state.mode = 'folder';
      state.status = state.modelImage ? 'ready' : 'idle';
    },
    setModelImage: (state, action) => {
      state.modelImage = action.payload;
      state.status = (state.clothImage || state.clothFolder) ? 'ready' : 'idle';
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    resetTryOnState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateTryOnResult.pending, (state) => {
        state.status = 'processing';
        state.error = null;
      })
      .addCase(generateTryOnResult.fulfilled, (state, action) => {
        state.status = 'success';
        state.result = action.payload;
      })
      .addCase(generateTryOnResult.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      });
  },
});

export const {
  setClothImage,
  setClothFolder,
  setModelImage,
  setMode,
  resetTryOnState,
} = aiModelTryOnSlice.actions;

export default aiModelTryOnSlice.reducer;
