# TRY ON GEAR Feature Documentation

## Overview
The **TRY ON GEAR** feature allows users to virtually try accessories (glasses, shoes, shirts, etc.) on AI models using two independent approaches:
1. **Interactive Single Try-On** - Manual model and accessory selection
2. **Folder-Based Batch Processing** - Automated processing using structured folders

---

## Architecture

### Redux State Management
**Location:** `src/store/slices/tryOnGearSlice.js`

#### State Structure
```javascript
{
  // Interactive flow
  selectedModel: Model | null,
  accessories: {
    glasses: File | null,
    shoes: File | null,
    pants: File | null,
    shirt: File | null,
    jacket: File | null,
    watch: File | null
  },
  
  // Folder flow
  folderImages: File[],
  multiFolderImages: File[][],
  
  // UI & status
  mode: 'interactive' | 'folder' | 'multi-folder',
  status: 'idle' | 'ready' | 'processing' | 'success' | 'error',
  errorMessage: string | null
}
```

#### Actions
- `setSelectedModel(model)` - Set the selected model for interactive try-on
- `setAccessoryImage({ type, image })` - Add/update an accessory image
- `removeAccessoryImage(type)` - Remove an accessory image
- `setFolderImages(images)` - Set images for folder processing
- `setMultiFolderImages(folders)` - Set images for multi-folder processing
- `setMode(mode)` - Change processing mode
- `resetTryOnGearState()` - Reset to initial state

#### Async Thunks (API Integration Points)
All API calls are **commented and ready for implementation**:

1. **processInteractiveTryOn**
   - Payload: `{ model, accessories }`
   - Expected API: `POST /api/try-on/interactive`
   - FormData structure documented in code

2. **processFolderTryOn**
   - Payload: `{ folderImages }`
   - Expected API: `POST /api/try-on/folder`
   - Folder structure validation documented

3. **processMultiFolderTryOn**
   - Payload: `{ multiFolderImages }`
   - Expected API: `POST /api/try-on/multi-folder`
   - Batch processing logic documented

---

## UI Components

### Main Screen
**Location:** `src/screens/TryOnGearScreen.js`

#### Section 1: Interactive Try-On
- **Model Selection Slider**
  - Horizontal carousel with predefined models
  - Visual selection indicator
  - "Model X of Y" counter

- **Accessory Upload Grid**
  - 6 accessory types: Glasses/Cap/Hat/Bag, Shoes, Pants, Shirt, Jacket, Watch
  - Individual file pickers per accessory
  - File name display with remove option
  - Optional uploads (at least one required)

- **Action Button**
  - "Try All Accessories" button
  - Disabled until model + at least one accessory selected
  - Shows "Processing..." during API call

#### Section 2: Folder-Based Processing
- **Folder Upload**
  - Multi-image picker (simulates folder selection)
  - "View Guide" button opens modal with structure rules
  - "Process Folder" button

- **Multi-Folder Upload**
  - Multiple folder selection support
  - Separate guide modal
  - "Process Multi-Folder" button

#### Modals
- **Folder Guide Modal** - Shows required folder structure
- **Multi-Folder Guide Modal** - Shows multi-folder structure

---

## Folder Structure Rules

### Single Folder
```
your_folder/
├── model.jpeg (required)
├── shirt.jpeg (optional)
├── jacket.jpeg (optional)
├── pants.jpeg (optional)
├── shoes.jpeg (optional)
├── glasses.jpeg (optional)
└── watch.jpeg (optional)
```

### Multi-Folder
```
your_parent_folder/
├── folder1/
│   ├── model.jpeg (required)
│   ├── shirt.jpeg (optional)
│   ├── jacket.jpeg (optional)
│   ├── pants.jpeg (optional)
│   ├── shoes.jpeg (optional)
│   ├── glasses.png (optional)
│   └── watch.png (optional)
├── folder2/
│   └── same structure
└── folder3/
    └── same structure
```

---

## Navigation Flow

```
HomeScreen
  ↓ (Tap "Try-On Gear" service card)
TryOnGearScreen
  ├── Interactive Try-On Section
  │   ├── Select Model
  │   ├── Upload Accessories
  │   └── Process
  │
  └── Folder-Based Section
      ├── Single Folder Upload
      └── Multi-Folder Upload
```

### Integration Points
**File:** `src/navigation/TabNavigator.js`
- Service ID 6 triggers navigation to TryOnGearScreen
- Screen hidden from tab bar when active
- Back button returns to HomeScreen

---

## Design System

### Colors
- Primary: `#7c3aed` (Purple)
- Primary Light: `#a855f7`
- Success: `#34C759`
- Error: `#ef4444`
- Text: `#333`
- Text Light: `#666`
- Border: `#e5e7eb`

### Typography
- Section Title: 22px, Bold
- Subsection Title: 16px, Semi-Bold
- Body Text: 14px, Regular
- Helper Text: 13px, Light

### Components
- **Buttons**: Rounded (12px), gradient backgrounds
- **Cards**: Subtle borders, light backgrounds
- **Modals**: Bottom sheet style, rounded top corners
- **Icons**: Ionicons from @expo/vector-icons

---

## Status Messages

### Success
```
✓ Processing completed successfully.
```

### Loading
```
Processing try-on...
Preparing results...
```

### Error
```
⚠ Processing failed. Please try again.
```

---

## Future Backend Integration

### API Endpoints to Implement

#### 1. Interactive Try-On
```javascript
POST /api/try-on/interactive
Content-Type: multipart/form-data

FormData:
- model: File
- glasses?: File
- shoes?: File
- pants?: File
- shirt?: File
- jacket?: File
- watch?: File

Response:
{
  success: boolean,
  resultUrl: string,
  processingTime: number
}
```

#### 2. Folder Try-On
```javascript
POST /api/try-on/folder
Content-Type: multipart/form-data

FormData:
- images: File[] (with filenames: model.jpeg, shirt.jpeg, etc.)

Response:
{
  success: boolean,
  resultUrl: string,
  detectedAccessories: string[]
}
```

#### 3. Multi-Folder Try-On
```javascript
POST /api/try-on/multi-folder
Content-Type: multipart/form-data

FormData:
- folder_0: File[]
- folder_1: File[]
- folder_N: File[]

Response:
{
  success: boolean,
  results: [
    { folderId: 0, resultUrl: string },
    { folderId: 1, resultUrl: string }
  ]
}
```

---

## Testing Checklist

### Interactive Flow
- [ ] Model selection updates state
- [ ] Accessory upload works for all types
- [ ] Remove accessory functionality
- [ ] Button disabled when requirements not met
- [ ] Button enabled when model + accessory selected
- [ ] Processing state shows loading indicator
- [ ] Success message displays correctly
- [ ] Error handling works

### Folder Flow
- [ ] Folder image picker opens
- [ ] Selected images count displays
- [ ] Guide modal opens and closes
- [ ] Process button disabled when no images
- [ ] Process button enabled with images
- [ ] Processing state works
- [ ] Success/error messages display

### Multi-Folder Flow
- [ ] Multi-folder picker works
- [ ] Folder count displays correctly
- [ ] Guide modal shows correct structure
- [ ] Processing handles multiple folders
- [ ] Results display for all folders

### UI/UX
- [ ] Premium, clean design maintained
- [ ] Consistent with app theme
- [ ] Smooth animations
- [ ] Responsive layout
- [ ] Proper error states
- [ ] Loading states clear

---

## Code Quality

### Best Practices Implemented
✓ Functional components only
✓ Redux Toolkit for state management
✓ Proper separation of concerns
✓ Reusable component patterns
✓ Clear prop types and naming
✓ Comprehensive comments for API integration
✓ Production-ready folder structure
✓ Consistent styling patterns

### Performance Considerations
- Image picker optimized for quality
- State updates batched appropriately
- Modals use React Native Modal for performance
- ScrollViews properly configured

---

## Maintenance Notes

### Adding New Accessory Types
1. Add to `ACCESSORY_TYPES` array in TryOnGearScreen.js
2. Add to `accessories` object in tryOnGearSlice.js initial state
3. Update folder structure documentation
4. Update backend API to handle new type

### Modifying Model List
Update `MODELS` array in TryOnGearScreen.js with:
```javascript
{ id: number, name: string, uri: string }
```

### Customizing Styles
All styles are in StyleSheet at bottom of TryOnGearScreen.js
Follow existing color scheme from `src/constants/assets.js`

---

## Dependencies Used
- `@reduxjs/toolkit` - State management
- `react-redux` - Redux bindings
- `expo-image-picker` - Image selection
- `@expo/vector-icons` - Icons
- `expo-linear-gradient` - Button gradients
- `react-native-safe-area-context` - Safe area handling

---

## Support & Questions
For implementation questions or backend integration support, refer to:
- Redux Toolkit docs: https://redux-toolkit.js.org/
- Expo Image Picker: https://docs.expo.dev/versions/latest/sdk/imagepicker/
- React Native docs: https://reactnative.dev/

---

**Feature Status:** ✅ Frontend Complete | ⏳ Backend Integration Pending
**Last Updated:** 2025
**Version:** 1.0.0
