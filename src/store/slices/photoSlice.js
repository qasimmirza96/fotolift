import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { photoAPI } from '../../services/apiMethods';

// Async thunks
export const fetchPhotos = createAsyncThunk(
  'photos/fetchPhotos',
  async (params, { rejectWithValue }) => {
    console.log('📸 Fetching photos with params:', params);
    try {
      const response = await photoAPI.getPhotos(params);
      console.log('✅ Photos fetched successfully:', response.length);
      return response;
    } catch (error) {
      console.error('❌ Fetch photos failed:', error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const uploadPhoto = createAsyncThunk(
  'photos/uploadPhoto',
  async (formData, { rejectWithValue }) => {
    console.log('📤 Uploading photo...');
    try {
      const response = await photoAPI.uploadPhoto(formData);
      console.log('✅ Photo uploaded successfully');
      return response;
    } catch (error) {
      console.error('❌ Photo upload failed:', error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deletePhoto = createAsyncThunk(
  'photos/deletePhoto',
  async (photoId, { rejectWithValue }) => {
    console.log('🗑️ Deleting photo:', photoId);
    try {
      await photoAPI.deletePhoto(photoId);
      console.log('✅ Photo deleted successfully');
      return photoId;
    } catch (error) {
      console.error('❌ Photo deletion failed:', error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const photoSlice = createSlice({
  name: 'photos',
  initialState: {
    photos: [],
    isLoading: false,
    error: null,
    uploadProgress: 0,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhotos.pending, (state) => {
        console.log('⏳ Fetch photos pending...');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPhotos.fulfilled, (state, action) => {
        console.log('✅ Fetch photos fulfilled');
        state.isLoading = false;
        state.photos = action.payload;
      })
      .addCase(fetchPhotos.rejected, (state, action) => {
        console.log('❌ Fetch photos rejected');
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(uploadPhoto.pending, (state) => {
        console.log('⏳ Upload photo pending...');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadPhoto.fulfilled, (state, action) => {
        console.log('✅ Upload photo fulfilled');
        state.isLoading = false;
        state.photos.unshift(action.payload);
        state.uploadProgress = 0;
      })
      .addCase(uploadPhoto.rejected, (state, action) => {
        console.log('❌ Upload photo rejected');
        state.isLoading = false;
        state.error = action.payload;
        state.uploadProgress = 0;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        console.log('✅ Delete photo fulfilled');
        state.photos = state.photos.filter(photo => photo.id !== action.payload);
      });
  },
});

export const { clearError, setUploadProgress } = photoSlice.actions;
export default photoSlice.reducer;