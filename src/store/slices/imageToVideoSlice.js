import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  sourceImage: null,
  prompt: '',
  generatedVideo: null,
  status: 'idle', // 'idle' | 'ready' | 'generating' | 'success' | 'error'
  progress: 0,
  error: null,
};

// API Integration Placeholder
export const generateVideo = createAsyncThunk(
  'imageToVideo/generate',
  async ({ sourceImage, prompt }, { rejectWithValue }) => {
    try {
      console.log('🎬 Starting video generation...');
      console.log('📸 Image:', sourceImage.name);
      console.log('📝 Prompt:', prompt);

      // TODO: Implement actual API call when backend is ready
      // const formData = new FormData();
      // formData.append('image', {
      //   uri: sourceImage.uri,
      //   type: 'image/jpeg',
      //   name: sourceImage.name,
      // });
      // formData.append('prompt', prompt);
      // 
      // const response = await fetch('API_ENDPOINT/generate-video', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await response.json();
      // return data;

      // Simulate API call with progress
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // Mock video URL
            duration: 5,
          });
        }, 3000);
      });
    } catch (error) {
      console.error('❌ Video generation failed:', error);
      return rejectWithValue(error.message);
    }
  }
);

const imageToVideoSlice = createSlice({
  name: 'imageToVideo',
  initialState,
  reducers: {
    setSourceImage: (state, action) => {
      state.sourceImage = action.payload;
      state.status = state.prompt ? 'ready' : 'idle';
    },
    setPrompt: (state, action) => {
      state.prompt = action.payload;
      state.status = state.sourceImage ? 'ready' : 'idle';
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    resetImageToVideo: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateVideo.pending, (state) => {
        state.status = 'generating';
        state.progress = 0;
        state.error = null;
      })
      .addCase(generateVideo.fulfilled, (state, action) => {
        state.status = 'success';
        state.progress = 100;
        state.generatedVideo = action.payload;
      })
      .addCase(generateVideo.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
        state.progress = 0;
      });
  },
});

export const {
  setSourceImage,
  setPrompt,
  setProgress,
  resetImageToVideo,
} = imageToVideoSlice.actions;

export default imageToVideoSlice.reducer;
