import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  clothImage: null,
  modelImage: null,
  clothImages: [],
  mode: 'single', // 'single' | 'bulk'
  status: 'idle', // 'idle' | 'ready' | 'processing' | 'success' | 'error'
  error: null,
  result: null,
};

// API Integration Placeholder
// TODO: Implement actual API call when backend is ready
export const generateTryOnResult = createAsyncThunk(
  'aiModelTryOn/generateResult',
  async ({ clothImage, modelImage, clothImages, mode }, { rejectWithValue }) => {
    try {
      // API call will be implemented here
      // const formData = new FormData();
      // if (mode === 'single') {
      //   formData.append('cloth', clothImage);
      // } else {
      //   clothImages.forEach((img, index) => {
      //     formData.append(`cloth_${index}`, img);
      //   });
      // }
      // formData.append('model', modelImage);
      // formData.append('mode', mode);
      
      // const response = await fetch('API_ENDPOINT', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await response.json();
      // return data;

      // Simulate API call
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
      state.mode = 'single';
      state.clothImages = [];
      state.status = state.modelImage ? 'ready' : 'idle';
    },
    setModelImage: (state, action) => {
      state.modelImage = action.payload;
      state.status = (state.clothImage || state.clothImages.length > 0) ? 'ready' : 'idle';
    },
    setClothImages: (state, action) => {
      state.clothImages = action.payload;
      state.mode = 'bulk';
      state.clothImage = null;
      state.status = state.modelImage ? 'ready' : 'idle';
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
  setModelImage,
  setClothImages,
  setMode,
  resetTryOnState,
} = aiModelTryOnSlice.actions;

export default aiModelTryOnSlice.reducer;
