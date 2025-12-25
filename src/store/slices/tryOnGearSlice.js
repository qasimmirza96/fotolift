import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  // Interactive flow
  selectedModel: null,
  accessories: {
    glasses: null,
    shoes: null,
    pants: null,
    shirt: null,
    jacket: null,
    watch: null,
  },
  
  // Folder flow
  folderImages: [],
  multiFolderImages: [],
  
  // UI & status
  mode: 'idle', // 'idle' | 'interactive' | 'folder' | 'multi-folder'
  status: 'idle', // 'idle' | 'ready' | 'processing' | 'success' | 'error'
  errorMessage: null,
  resultData: null, // Store result data after processing
};

// ================================================
// API THUNKS (COMMENTED - NOT IMPLEMENTED)
// ================================================

/**
 * Process Interactive Try-On
 * 
 * Expected payload structure:
 * {
 *   model: File/URI - Selected model image
 *   accessories: {
 *     glasses?: File/URI,
 *     shoes?: File/URI,
 *     pants?: File/URI,
 *     shirt?: File/URI,
 *     jacket?: File/URI,
 *     watch?: File/URI
 *   }
 * }
 * 
 * Backend integration:
 * - Create FormData with model image
 * - Append each accessory with its type as key
 * - POST to /api/try-on/interactive
 * - Return processed image URLs
 */
export const processInteractiveTryOn = createAsyncThunk(
  'tryOnGear/processInteractive',
  async ({ model, accessories }, { rejectWithValue }) => {
    try {
      // TODO: Implement API call
      // const formData = new FormData();
      // formData.append('model', model);
      // 
      // Object.entries(accessories).forEach(([type, file]) => {
      //   if (file) {
      //     formData.append(type, file);
      //   }
      // });
      // 
      // const response = await fetch('API_ENDPOINT/try-on/interactive', {
      //   method: 'POST',
      //   body: formData,
      // });
      // 
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

/**
 * Process Folder Try-On
 * 
 * Expected folder structure:
 * - model.jpeg (required)
 * - shirt.jpeg (optional)
 * - jacket.jpeg (optional)
 * - pants.jpeg (optional)
 * - shoes.jpeg (optional)
 * - glasses.jpeg (optional)
 * - watch.jpeg (optional)
 * 
 * Backend integration:
 * - Parse folder images by filename
 * - Create FormData with categorized images
 * - POST to /api/try-on/folder
 * - Return processed image URL
 */
export const processFolderTryOn = createAsyncThunk(
  'tryOnGear/processFolder',
  async ({ folderImages }, { rejectWithValue }) => {
    try {
      // TODO: Implement API call
      // const formData = new FormData();
      // 
      // folderImages.forEach((file) => {
      //   const fileName = file.name.toLowerCase();
      //   formData.append('images', file, fileName);
      // });
      // 
      // const response = await fetch('API_ENDPOINT/try-on/folder', {
      //   method: 'POST',
      //   body: formData,
      // });
      // 
      // const data = await response.json();
      // return data;

      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, resultUrl: 'mock_folder_result' });
        }, 2000);
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Process Multi-Folder Try-On
 * 
 * Expected structure:
 * Array of folders, each containing:
 * - model.jpeg (required)
 * - accessory images (optional)
 * 
 * Backend integration:
 * - Create FormData with folder structure preserved
 * - Each folder processed independently
 * - POST to /api/try-on/multi-folder
 * - Return array of processed image URLs
 */
export const processMultiFolderTryOn = createAsyncThunk(
  'tryOnGear/processMultiFolder',
  async ({ multiFolderImages }, { rejectWithValue }) => {
    try {
      // TODO: Implement API call
      // const formData = new FormData();
      // 
      // multiFolderImages.forEach((folder, folderIndex) => {
      //   folder.forEach((file) => {
      //     formData.append(`folder_${folderIndex}`, file, file.name);
      //   });
      // });
      // 
      // const response = await fetch('API_ENDPOINT/try-on/multi-folder', {
      //   method: 'POST',
      //   body: formData,
      // });
      // 
      // const data = await response.json();
      // return data;

      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, results: ['url1', 'url2', 'url3'] });
        }, 3000);
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ================================================
// SLICE
// ================================================

const tryOnGearSlice = createSlice({
  name: 'tryOnGear',
  initialState,
  reducers: {
    setSelectedModel: (state, action) => {
      // Only allow model selection in interactive mode
      if (state.mode !== 'interactive' && state.mode !== 'idle') {
        return;
      }
      state.selectedModel = action.payload;
      state.mode = 'interactive';
      // Clear folder modes when switching to interactive
      state.folderImages = [];
      state.multiFolderImages = [];
      state.status = Object.values(state.accessories).some(a => a) ? 'ready' : 'idle';
    },
    
    setAccessoryImage: (state, action) => {
      // Only allow accessory selection in interactive mode
      if (state.mode !== 'interactive' && state.mode !== 'idle') {
        return;
      }
      const { type, image } = action.payload;
      state.accessories[type] = image;
      state.mode = 'interactive';
      // Clear folder modes when switching to interactive
      state.folderImages = [];
      state.multiFolderImages = [];
      state.status = state.selectedModel && Object.values(state.accessories).some(a => a) ? 'ready' : 'idle';
    },
    
    removeAccessoryImage: (state, action) => {
      // Only allow removal in interactive mode
      if (state.mode !== 'interactive') {
        return;
      }
      const type = action.payload;
      state.accessories[type] = null;
      state.status = state.selectedModel && Object.values(state.accessories).some(a => a) ? 'ready' : 'idle';
    },
    
    setFolderImages: (state, action) => {
      const images = action.payload;
      state.folderImages = images;
      state.mode = 'folder';
      // Clear interactive mode data when switching to folder mode
      state.selectedModel = null;
      state.accessories = {
        glasses: null,
        shoes: null,
        pants: null,
        shirt: null,
        jacket: null,
        watch: null,
      };
      // Clear multi-folder when switching to single folder
      state.multiFolderImages = [];
      state.status = images.length > 0 ? 'ready' : 'idle';
    },
    
    setMultiFolderImages: (state, action) => {
      const folders = action.payload;
      state.multiFolderImages = folders;
      state.mode = 'multi-folder';
      // Clear interactive mode data when switching to multi-folder mode
      state.selectedModel = null;
      state.accessories = {
        glasses: null,
        shoes: null,
        pants: null,
        shirt: null,
        jacket: null,
        watch: null,
      };
      // Clear single folder when switching to multi-folder
      state.folderImages = [];
      state.status = folders.length > 0 ? 'ready' : 'idle';
    },
    
    setMode: (state, action) => {
      const newMode = action.payload;
      state.mode = newMode;
      
      // Clear data when switching modes
      if (newMode === 'interactive') {
        state.folderImages = [];
        state.multiFolderImages = [];
      } else if (newMode === 'folder') {
        state.selectedModel = null;
        state.accessories = {
          glasses: null,
          shoes: null,
          pants: null,
          shirt: null,
          jacket: null,
          watch: null,
        };
        state.multiFolderImages = [];
      } else if (newMode === 'multi-folder') {
        state.selectedModel = null;
        state.accessories = {
          glasses: null,
          shoes: null,
          pants: null,
          shirt: null,
          jacket: null,
          watch: null,
        };
        state.folderImages = [];
      }
      
      // Update status based on mode
      if (newMode === 'interactive') {
        state.status = state.selectedModel && Object.values(state.accessories).some(a => a) ? 'ready' : 'idle';
      } else if (newMode === 'folder') {
        state.status = state.folderImages.length > 0 ? 'ready' : 'idle';
      } else if (newMode === 'multi-folder') {
        state.status = state.multiFolderImages.length > 0 ? 'ready' : 'idle';
      }
    },
    
    resetTryOnGearState: () => initialState,
  },
  
  extraReducers: (builder) => {
    // Interactive Try-On
    builder
      .addCase(processInteractiveTryOn.pending, (state) => {
        state.status = 'processing';
        state.errorMessage = null;
      })
      .addCase(processInteractiveTryOn.fulfilled, (state, action) => {
        state.status = 'success';
        state.resultData = action.payload;
      })
      .addCase(processInteractiveTryOn.rejected, (state, action) => {
        state.status = 'error';
        state.errorMessage = action.payload || 'Processing failed';
      });
    
    // Folder Try-On
    builder
      .addCase(processFolderTryOn.pending, (state) => {
        state.status = 'processing';
        state.errorMessage = null;
      })
      .addCase(processFolderTryOn.fulfilled, (state, action) => {
        state.status = 'success';
        state.resultData = action.payload;
      })
      .addCase(processFolderTryOn.rejected, (state, action) => {
        state.status = 'error';
        state.errorMessage = action.payload || 'Processing failed';
      });
    
    // Multi-Folder Try-On
    builder
      .addCase(processMultiFolderTryOn.pending, (state) => {
        state.status = 'processing';
        state.errorMessage = null;
      })
      .addCase(processMultiFolderTryOn.fulfilled, (state, action) => {
        state.status = 'success';
        state.resultData = action.payload;
      })
      .addCase(processMultiFolderTryOn.rejected, (state, action) => {
        state.status = 'error';
        state.errorMessage = action.payload || 'Processing failed';
      });
  },
});

export const {
  setSelectedModel,
  setAccessoryImage,
  removeAccessoryImage,
  setFolderImages,
  setMultiFolderImages,
  setMode,
  resetTryOnGearState,
} = tryOnGearSlice.actions;

export default tryOnGearSlice.reducer;
