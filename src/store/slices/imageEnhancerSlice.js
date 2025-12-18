import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for enhancing single image
// TODO: Implement actual API call when backend is ready
export const enhanceSingleImage = createAsyncThunk(
  'imageEnhancer/enhanceSingle',
  async ({ image, tileSize, tilePadding }, { rejectWithValue }) => {
    try {
      console.log('🚀 Enhancing single image...');
      console.log('Settings:', { tileSize, tilePadding });
      console.log('Image:', image.name);
      
      // TODO: Replace with actual API call
      // const formData = new FormData();
      // formData.append('image', image);
      // formData.append('tile_size', tileSize);
      // formData.append('tile_padding', tilePadding);
      // 
      // const response = await fetch('API_ENDPOINT/enhance-single', {
      //   method: 'POST',
      //   body: formData,
      // });
      // 
      // const result = await response.json();
      // return result;
      
      // Mock response for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            enhancedImage: image.uri,
            message: 'Image enhanced successfully',
          });
        }, 2000);
      });
    } catch (error) {
      console.error('❌ Enhancement failed:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for enhancing folder images
// TODO: Implement actual API call when backend is ready
export const enhanceFolderImages = createAsyncThunk(
  'imageEnhancer/enhanceFolder',
  async ({ folder, tileSize, tilePadding }, { rejectWithValue }) => {
    try {
      console.log('🚀 Enhancing folder images...');
      console.log('Settings:', { tileSize, tilePadding });
      console.log('Folder:', folder.name, 'Files:', folder.fileCount);
      
      // TODO: Replace with actual API call
      // const formData = new FormData();
      // formData.append('folder_path', folder.path);
      // formData.append('tile_size', tileSize);
      // formData.append('tile_padding', tilePadding);
      // 
      // const response = await fetch('API_ENDPOINT/enhance-folder', {
      //   method: 'POST',
      //   body: formData,
      // });
      // 
      // const result = await response.json();
      // return result;
      
      // Mock response for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            enhancedCount: folder.fileCount,
            message: `${folder.fileCount} images enhanced successfully`,
          });
        }, 3000);
      });
    } catch (error) {
      console.error('❌ Enhancement failed:', error);
      return rejectWithValue(error.message);
    }
  }
);

const imageEnhancerSlice = createSlice({
  name: 'imageEnhancer',
  initialState: {
    tileSize: 512,
    tilePadding: 32,
    singleImage: null,
    folder: null,
    mode: null, // 'single' | 'folder'
    status: 'idle', // 'idle' | 'ready' | 'processing' | 'done'
    error: null,
    result: null,
  },
  reducers: {
    setTileSize: (state, action) => {
      state.tileSize = action.payload;
      console.log('⚙️ Tile size set to:', action.payload);
    },
    setTilePadding: (state, action) => {
      state.tilePadding = action.payload;
      console.log('⚙️ Tile padding set to:', action.payload);
    },
    setSingleImage: (state, action) => {
      state.singleImage = action.payload;
      state.folder = null;
      state.mode = 'single';
      state.status = action.payload ? 'ready' : 'idle';
      console.log('📸 Single image set:', action.payload?.name);
    },
    setFolder: (state, action) => {
      state.folder = action.payload;
      state.singleImage = null;
      state.mode = 'folder';
      state.status = action.payload ? 'ready' : 'idle';
      console.log('📸 Folder set:', action.payload?.name, action.payload?.fileCount, 'files');
    },
    resetImageEnhancerState: (state) => {
      state.singleImage = null;
      state.folder = null;
      state.mode = null;
      state.status = 'idle';
      state.error = null;
      state.result = null;
      console.log('🔄 Image enhancer state reset');
    },
  },
  extraReducers: (builder) => {
    builder
      // Single image enhancement
      .addCase(enhanceSingleImage.pending, (state) => {
        state.status = 'processing';
        state.error = null;
      })
      .addCase(enhanceSingleImage.fulfilled, (state, action) => {
        state.status = 'done';
        state.result = action.payload;
      })
      .addCase(enhanceSingleImage.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      })
      // Folder images enhancement
      .addCase(enhanceFolderImages.pending, (state) => {
        state.status = 'processing';
        state.error = null;
      })
      .addCase(enhanceFolderImages.fulfilled, (state, action) => {
        state.status = 'done';
        state.result = action.payload;
      })
      .addCase(enhanceFolderImages.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      });
  },
});

export const {
  setTileSize,
  setTilePadding,
  setSingleImage,
  setFolder,
  resetImageEnhancerState,
} = imageEnhancerSlice.actions;

export default imageEnhancerSlice.reducer;