# True Folder Picker Implementation

## Overview
Implemented **real folder selection** using Android Storage Access Framework (SAF) with `@react-native-documents/picker` package.

## Features
✅ **True folder picking** - Not just multiple image selection
✅ **Device storage access** - Browse internal/external storage
✅ **Google Drive support** - Access cloud storage folders
✅ **Automatic image filtering** - Reads all images from selected folder
✅ **Detailed logging** - Shows folder name, path, image count, and file list

## Package Used
- **Package**: `@react-native-documents/picker` v11.0.3
- **API**: `pickDirectory()` function
- **Platform**: Android (uses SAF), iOS (uses UIDocumentPickerViewController)

## Implementation Details

### 1. Folder Picker Utility (`src/utils/folderPicker.js`)
```javascript
import { pickDirectory, errorCodes, isErrorWithCode } from '@react-native-documents/picker';
import RNFS from 'react-native-fs';

export const pickFolder = async () => {
  try {
    // Opens native folder picker with SAF
    const result = await pickDirectory({
      requestLongTermAccess: false,
    });

    // Read all files from selected folder
    const files = await RNFS.readDir(folderUri);
    
    // Filter only image files (.jpg, .jpeg, .png, .gif, .bmp, .webp)
    const imageFiles = files.filter(/* image extensions */);

    return {
      name: folderName,
      path: folderUri,
      fileCount: imageFiles.length,
      files: imageFiles
    };
  } catch (error) {
    if (isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED) {
      return null; // User cancelled
    }
    throw error;
  }
};
```

### 2. Android Permissions (`android/app/src/main/AndroidManifest.xml`)
```xml
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE" tools:ignore="ScopedStorage"/>
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>
```

### 3. Usage in Screens
```javascript
import { pickFolder } from '../utils/folderPicker';

const handleFolderUpload = async () => {
  const folderData = await pickFolder();
  if (folderData) {
    dispatch(setFolderImages(folderData.files));
  }
};
```

## How It Works

### User Flow:
1. User taps "Upload Folder" button
2. Native Android SAF picker opens
3. User navigates to device storage or Google Drive
4. User selects a folder
5. App reads all image files from folder
6. Images are loaded into Redux state

### Technical Flow:
1. `pickDirectory()` → Opens SAF picker
2. Returns folder URI (e.g., `content://com.android.externalstorage.documents/tree/primary:DCIM`)
3. `RNFS.readDir()` → Reads all files from folder
4. Filter by image extensions
5. Return structured folder data with file list

## Supported Storage Locations
- ✅ Internal Storage (`/storage/emulated/0/`)
- ✅ External SD Card (`/storage/XXXX-XXXX/`)
- ✅ Google Drive (via SAF)
- ✅ Dropbox (via SAF)
- ✅ OneDrive (via SAF)
- ✅ Any SAF-compatible storage provider

## Error Handling
- **User cancellation**: Returns `null` (no error thrown)
- **Permission denied**: Throws error with message
- **Folder read error**: Throws error with details
- **No images found**: Returns folder with `fileCount: 0`

## Logging Output
```
📁 ===== FOLDER PICKED =====
📂 Folder name: MyPhotos
📁 Folder URI: content://...
📊 Total images found: 25
🖼️ Image files: ['photo1.jpg', 'photo2.png', ...]
================================
```

## Build & Run
```bash
# Install dependencies
npm install

# Rebuild Android app
npx react-native run-android
```

## Troubleshooting

### Issue: "Cannot read property 'isCancel' of undefined"
**Solution**: Updated to use new API:
- Old: `DocumentPicker.isCancel(error)`
- New: `isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED`

### Issue: Folder picker not showing
**Solution**: Ensure `@react-native-documents/picker` is properly linked:
```bash
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

### Issue: Cannot read files from folder
**Solution**: Check Android permissions in manifest and request at runtime if needed.

## Future Enhancements
- [ ] Add runtime permission request for MANAGE_EXTERNAL_STORAGE
- [ ] Support long-term access with bookmarks
- [ ] Add progress indicator for large folders
- [ ] Support video file filtering
- [ ] Add folder size calculation

## References
- [react-native-documents/picker GitHub](https://github.com/react-native-documents/document-picker)
- [Android SAF Documentation](https://developer.android.com/guide/topics/providers/document-provider)
- [React Native File System](https://github.com/itinance/react-native-fs)
