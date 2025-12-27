# App Size Optimization Guide - FotoLift

## Current Size: 42 MB
## Target: 15-20 MB

---


## ✅ Immediate Actions (Can reduce to ~25 MB)

### 1. Enable ProGuard/R8 (Android)
**File:** `android/app/build.gradle`

```gradle
android {
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

**Expected Reduction:** 30-40% (12-16 MB)

---

### 2. Enable Hermes Engine
**File:** `android/app/build.gradle`

```gradle
project.ext.react = [
    enableHermes: true
]
```

**Expected Reduction:** 20-30% (8-12 MB)

---

### 3. Remove Unused Dependencies

#### Check Current Dependencies:
```bash
npm ls --depth=0
```

#### Remove These (Not Used):
```bash
npm uninstall react-native-fs
npm uninstall react-native-share
npm uninstall react-native-zip-archive
npm uninstall redux-logger
```

**Expected Reduction:** 2-3 MB

---

### 4. Split APK by ABI
**File:** `android/app/build.gradle`

```gradle
android {
    splits {
        abi {
            enable true
            reset()
            include "armeabi-v7a", "arm64-v8a", "x86", "x86_64"
            universalApk false
        }
    }
}
```

**Expected Reduction:** 50% per APK (each APK ~21 MB instead of 42 MB)

---

## 🎯 Advanced Optimizations (Can reduce to ~15-20 MB)

### 5. Use Expo Bare Workflow (Remove Unused Expo Modules)

**Remove unused Expo modules:**
```bash
# Check which Expo modules are actually used
npx expo-doctor

# Remove unused ones
npm uninstall expo-av
npm uninstall expo-blur
npm uninstall expo-clipboard
npm uninstall expo-sharing
```

**Expected Reduction:** 5-8 MB

---

### 6. Optimize Images (Even though you have none now)

**For future images:**
```bash
# Install image optimizer
npm install --save-dev @expo/image-utils

# Use WebP format instead of PNG/JPG
# Compress images before adding to app
```

---

### 7. Use Dynamic Imports

**Before:**
```javascript
import TryOnGearScreen from '../screens/TryOnGearScreen';
```

**After:**
```javascript
const TryOnGearScreen = React.lazy(() => import('../screens/TryOnGearScreen'));
```

**Expected Reduction:** Faster load, smaller initial bundle

---

### 8. Remove Console Logs in Production

**File:** `metro.config.js`
```javascript
module.exports = {
  transformer: {
    minifierConfig: {
      keep_classnames: true,
      keep_fnames: true,
      mangle: {
        keep_classnames: true,
        keep_fnames: true,
      },
      compress: {
        drop_console: true, // Remove console.log
      },
    },
  },
};
```

**Expected Reduction:** 1-2 MB

---

### 9. Use App Bundle (AAB) Instead of APK

```bash
# Build AAB instead of APK
cd android && ./gradlew bundleRelease
```

**Benefits:**
- Google Play optimizes per device
- Users download only what they need
- 35-50% smaller downloads

---

### 10. Analyze Bundle Size

```bash
# Install analyzer
npm install --save-dev react-native-bundle-visualizer

# Analyze
npx react-native-bundle-visualizer
```

---

## 📊 Expected Results After All Optimizations

| Optimization | Size Reduction | New Size |
|--------------|----------------|----------|
| Initial | - | 42 MB |
| ProGuard + Hermes | -40% | 25 MB |
| Remove unused deps | -3 MB | 22 MB |
| Split APK by ABI | -50% per APK | 11 MB per ABI |
| Remove unused Expo | -5 MB | 17 MB (universal) |
| Console log removal | -1 MB | 16 MB |
| **Final (AAB)** | **-60%** | **~15-18 MB** |

---

## 🚀 Quick Implementation Steps

### Step 1: Update `android/app/build.gradle`
```gradle
android {
    // Enable ProGuard
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    
    // Split by ABI
    splits {
        abi {
            enable true
            reset()
            include "armeabi-v7a", "arm64-v8a"
            universalApk false
        }
    }
}

// Enable Hermes
project.ext.react = [
    enableHermes: true
]
```

### Step 2: Remove Unused Dependencies
```bash
npm uninstall react-native-fs react-native-share react-native-zip-archive redux-logger
```

### Step 3: Create `metro.config.js`
```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.minifierConfig = {
  compress: {
    drop_console: true,
  },
};

module.exports = config;
```

### Step 4: Build Optimized APK
```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

---

## 📱 Per-Device APK Sizes (After Split)

- **arm64-v8a** (Modern phones): ~11 MB
- **armeabi-v7a** (Older phones): ~10 MB
- **x86_64** (Emulators): ~12 MB

---

## 🎯 Production Checklist

- [ ] Enable ProGuard/R8
- [ ] Enable Hermes Engine
- [ ] Remove unused dependencies
- [ ] Split APK by ABI
- [ ] Remove console logs
- [ ] Use AAB for Play Store
- [ ] Test on real device
- [ ] Verify app functionality

---

## 📈 Monitoring

**Check APK size:**
```bash
ls -lh android/app/build/outputs/apk/release/
```

**Check AAB size:**
```bash
ls -lh android/app/build/outputs/bundle/release/
```

---

## ⚠️ Important Notes

1. **Always test after optimization** - Some optimizations may break functionality
2. **Keep a backup** - Before making changes
3. **Test on real devices** - Not just emulators
4. **ProGuard may need rules** - Add rules if app crashes
5. **Hermes is stable** - Safe to use in production

---

## 🔧 Troubleshooting

### If app crashes after ProGuard:
Add to `android/app/proguard-rules.pro`:
```
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class expo.modules.** { *; }
```

### If Hermes causes issues:
Disable temporarily:
```gradle
project.ext.react = [
    enableHermes: false
]
```

---

## 📊 Size Comparison

| App Type | Size |
|----------|------|
| Debug Build | 60-80 MB |
| Release (No optimization) | 42 MB |
| Release (ProGuard + Hermes) | 25 MB |
| Release (All optimizations) | 16-18 MB |
| Release (Split APK per ABI) | 10-12 MB |
| Release (AAB on Play Store) | 8-10 MB download |

---

## ✅ Recommended Configuration

**For immediate 40% reduction:**
1. Enable ProGuard
2. Enable Hermes
3. Remove unused dependencies

**For maximum reduction:**
1. All above +
2. Split APK by ABI
3. Use AAB for distribution
4. Remove console logs

---

**Result: 42 MB → 15-18 MB (60% reduction)**
