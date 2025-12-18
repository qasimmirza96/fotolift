# Try On Gear - Quick Start Guide

## 🚀 Getting Started

### 1. Navigation
From HomeScreen, tap the **"Try-On Gear"** service card (ID: 6) to navigate to the feature.

### 2. Two Independent Flows

#### Interactive Try-On (Manual)
1. Select a model from the horizontal slider
2. Upload at least one accessory (glasses, shoes, pants, shirt, jacket, or watch)
3. Tap "Try All Accessories"
4. Wait for processing
5. View results

#### Folder-Based Try-On (Automated)
1. Tap "View Guide" to see required folder structure
2. Select folder images using the picker
3. Tap "Process Folder" or "Process Multi-Folder"
4. Wait for processing
5. View results

---

## 📁 Files Created

```
src/
├── store/
│   └── slices/
│       └── tryOnGearSlice.js          ← Redux state management
├── screens/
│   └── TryOnGearScreen.js             ← Main UI component
└── navigation/
    └── TabNavigator.js                 ← Updated with routing
```

---

## 🔧 Redux Integration

### Import Actions
```javascript
import {
  setSelectedModel,
  setAccessoryImage,
  removeAccessoryImage,
  setFolderImages,
  setMultiFolderImages,
  processInteractiveTryOn,
  processFolderTryOn,
  processMultiFolderTryOn,
  resetTryOnGearState,
} from '../store/slices/tryOnGearSlice';
```

### Access State
```javascript
const { selectedModel, accessories, status } = useSelector(
  (state) => state.tryOnGear
);
```

---

## 🎨 UI Components Breakdown

### Model Slider
- Horizontal ScrollView with model cards
- Visual selection indicator (purple border)
- "Model X of Y" counter

### Accessory Grid
- 2-column grid layout
- Upload button per accessory type
- File name display with remove option

### Folder Upload
- Dashed border button
- Image count display
- Guide modal with structure rules

### Action Buttons
- Primary: Gradient background (interactive)
- Secondary: Outlined style (folder-based)
- Disabled state: Gray with reduced opacity

---

## 🔌 Backend Integration Points

### Step 1: Uncomment API Calls
In `tryOnGearSlice.js`, find the three async thunks:
- `processInteractiveTryOn`
- `processFolderTryOn`
- `processMultiFolderTryOn`

### Step 2: Replace Mock with Real API
```javascript
// Remove this:
return new Promise((resolve) => {
  setTimeout(() => {
    resolve({ success: true, resultUrl: 'mock_result_url' });
  }, 2000);
});

// Add this:
const formData = new FormData();
// ... (see comments in code for structure)
const response = await fetch('YOUR_API_ENDPOINT', {
  method: 'POST',
  body: formData,
});
return await response.json();
```

### Step 3: Handle Response
Update the screen to display results:
```javascript
if (status === 'success') {
  // Navigate to result screen or display inline
}
```

---

## 📋 Folder Structure Rules

### Single Folder
```
folder/
├── model.jpeg     ← Required
├── shirt.jpeg     ← Optional
├── jacket.jpeg    ← Optional
├── pants.jpeg     ← Optional
├── shoes.jpeg     ← Optional
├── glasses.jpeg   ← Optional
└── watch.jpeg     ← Optional
```

### Multi-Folder
```
parent/
├── folder1/
│   └── (same as single folder)
├── folder2/
│   └── (same as single folder)
└── folder3/
    └── (same as single folder)
```

---

## ✅ Validation Rules

### Interactive Try-On
- ✓ Model must be selected
- ✓ At least one accessory must be uploaded
- ✓ Button disabled until both conditions met

### Folder Try-On
- ✓ At least one image must be selected
- ✓ Images should follow naming convention
- ✓ Button disabled until images selected

### Multi-Folder Try-On
- ✓ Multiple image groups must be selected
- ✓ Each group should have model + accessories
- ✓ Button disabled until folders selected

---

## 🎯 Status Flow

```
idle → ready → processing → success/error
  ↑                            ↓
  └────────────────────────────┘
         (reset on new action)
```

### Status Meanings
- **idle**: No selection made
- **ready**: Valid selection, ready to process
- **processing**: API call in progress
- **success**: Processing completed
- **error**: Processing failed

---

## 🐛 Troubleshooting

### Button Not Enabling
- Check if model is selected (interactive)
- Check if at least one accessory uploaded (interactive)
- Check if images selected (folder-based)

### Images Not Uploading
- Verify expo-image-picker permissions
- Check image picker configuration
- Ensure quality setting is appropriate

### State Not Updating
- Verify Redux store includes tryOnGear reducer
- Check dispatch calls are correct
- Use Redux DevTools to inspect state

---

## 🔄 Reset State
```javascript
dispatch(resetTryOnGearState());
```
Call this when:
- User navigates away
- Starting a new try-on session
- After successful processing

---

## 📱 Testing Commands

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

---

## 🎨 Customization

### Change Colors
Edit `styles` object in TryOnGearScreen.js or use colors from `src/constants/assets.js`

### Add New Accessory Type
1. Add to `ACCESSORY_TYPES` array
2. Add to Redux state `accessories` object
3. Update API integration

### Modify Models
Update `MODELS` array with new model data:
```javascript
{ id: number, name: string, uri: string }
```

---

## 📚 Key Concepts

### Independent Flows
- Interactive and folder-based flows are **completely independent**
- No shared state between the two
- Different validation rules
- Different API endpoints

### File Handling
- Uses expo-image-picker for all file selection
- Files stored as assets with URI
- FormData used for API uploads

### State Management
- Redux Toolkit for predictable state
- Async thunks for API calls
- Automatic loading states

---

## 🚨 Important Notes

1. **API calls are commented** - Uncomment and configure before production
2. **Folder selection** - React Native doesn't support true folder selection; uses multi-image picker
3. **Image quality** - Set to 1 (highest) for best results
4. **Permissions** - Ensure image picker permissions granted

---

## 📞 Quick Reference

| Action | Code |
|--------|------|
| Select Model | `dispatch(setSelectedModel(model))` |
| Add Accessory | `dispatch(setAccessoryImage({ type, image }))` |
| Remove Accessory | `dispatch(removeAccessoryImage(type))` |
| Set Folder | `dispatch(setFolderImages(images))` |
| Process Interactive | `dispatch(processInteractiveTryOn({ model, accessories }))` |
| Process Folder | `dispatch(processFolderTryOn({ folderImages }))` |
| Reset | `dispatch(resetTryOnGearState())` |

---

**Ready to use!** 🎉 Navigate to the feature from HomeScreen and start testing.
