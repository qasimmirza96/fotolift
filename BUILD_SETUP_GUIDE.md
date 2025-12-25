# 📱 FotoLift - Release APK Build Setup Guide

## 📦 Build Information

**App Name:** FotoLift  
**Package:** `com.qasimmirza.fotolift`  
**Version:** 1.1.0  
**Build Type:** Release (Optimized)  
**Architecture:** arm64-v8a (64-bit ARM)

---

## 🎯 Build Location

**Release APK:**
```
android/app/build/outputs/apk/release/app-release.apk
```

**Full Path:**
```
D:\systemsphere\react-native\fotolift\android\app\build\outputs\apk\release\app-release.apk
```

---

## 🚀 How to Build Release APK

### Prerequisites

1. **Node.js** (v18 or higher)
2. **Android Studio** with Android SDK
3. **Java JDK** (17 or higher)
4. **Gradle** (included with project)

### Step-by-Step Build Process

#### 1. Navigate to Project Directory
```bash
cd D:\systemsphere\react-native\fotolift
```

#### 2. Install Dependencies (if needed)
```bash
npm install
```

#### 3. Build Release APK

**Option A: Using Gradle (Recommended)**
```bash
cd android
.\gradlew assembleRelease
```

**Option B: Using Expo CLI**
```bash
npx expo run:android --variant release
```

**Option C: Direct Command (from project root)**
```bash
cd android && .\gradlew assembleRelease --no-daemon
```

#### 4. Find Your APK

After successful build, the APK will be located at:
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## ⚙️ Build Configuration

### Optimizations Applied

The release build includes the following optimizations:

1. **Single Architecture Build**
   - Only `arm64-v8a` (most common modern Android devices)
   - Reduces APK size significantly

2. **Code Minification**
   - R8/ProGuard enabled
   - Removes unused code
   - Obfuscates code for security

3. **Resource Shrinking**
   - Removes unused resources
   - Optimizes images and assets

4. **PNG Optimization**
   - PNG crunching enabled
   - Compresses images

### Configuration Files

**`android/gradle.properties`:**
```properties
# Architecture (single for smaller size)
reactNativeArchitectures=arm64-v8a

# Resource shrinking
android.enableShrinkResourcesInReleaseBuilds=true

# Code minification
android.enableMinifyInReleaseBuilds=true

# PNG optimization
android.enablePngCrunchInReleaseBuilds=true
```

**`android/app/build.gradle`:**
- Release build type configured with:
  - `minifyEnabled: true`
  - `shrinkResources: true`
  - ProGuard rules applied

---

## 📊 Build Size Comparison

| Build Type | Size | Notes |
|------------|------|-------|
| **Debug APK** | ~107 MB | Includes debug symbols, all architectures |
| **Release APK** | ~34 MB | Optimized, single architecture |

**Size Reduction:** ~68.5% smaller than debug build

---

## 🔧 Troubleshooting

### Common Build Issues

#### 1. **CMake Errors During Clean**
```
Error: add_subdirectory given source which is not an existing directory
```
**Solution:** Skip clean and build directly:
```bash
.\gradlew assembleRelease --no-daemon
```

#### 2. **Out of Memory**
```
Error: Java heap space
```
**Solution:** Increase Gradle memory in `gradle.properties`:
```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m
```

#### 3. **Build Fails with Native Module Errors**
**Solution:** 
1. Clean node_modules: `rm -rf node_modules`
2. Reinstall: `npm install`
3. Rebuild: `cd android && .\gradlew assembleRelease`

#### 4. **Signing Errors**
**Solution:** The release build uses debug signing by default. For production:
1. Generate a keystore
2. Configure signing in `android/app/build.gradle`

---

## 📱 Installing the APK

### On Android Device

1. **Enable Unknown Sources:**
   - Go to Settings → Security
   - Enable "Install from Unknown Sources" or "Allow from this source"

2. **Transfer APK:**
   - Copy `app-release.apk` to your device
   - Or use ADB: `adb install app-release.apk`

3. **Install:**
   - Open the APK file on your device
   - Tap "Install"
   - Wait for installation

4. **Launch:**
   - Find "FotoLift" in app drawer
   - Open the app

### Using ADB (Android Debug Bridge)

```bash
# Install directly to connected device
adb install android/app/build/outputs/apk/release/app-release.apk

# Or with replacement
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

---

## 🎯 Build Commands Reference

### Quick Commands

```bash
# Build release APK
cd android && .\gradlew assembleRelease

# Build and install to device
cd android && .\gradlew assembleRelease && adb install -r app/build/outputs/apk/release/app-release.apk

# Clean build (if needed)
cd android && .\gradlew clean assembleRelease

# Check build variants
cd android && .\gradlew tasks --all | grep assemble
```

### Build Time

- **First Build:** ~10-15 minutes
- **Incremental Build:** ~5-8 minutes
- **Clean Build:** ~12-18 minutes

---

## 📋 Pre-Build Checklist

Before building, ensure:

- [ ] All code changes committed
- [ ] Dependencies installed (`npm install`)
- [ ] Android SDK and build tools updated
- [ ] No linting errors
- [ ] App version updated in `app.json`
- [ ] Tested on emulator/device
- [ ] All features working correctly

---

## 🔐 Production Signing (Future)

For production releases, you'll need to:

1. **Generate Keystore:**
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. **Configure Signing:**
   - Add keystore to `android/app/`
   - Update `android/app/build.gradle` with signing config
   - Never commit keystore to version control

3. **Build Signed APK:**
```bash
cd android && .\gradlew assembleRelease
```

---

## 📤 Sharing the Build

### Recommended Methods

1. **Google Drive / Dropbox**
   - Upload APK
   - Share link
   - Include installation instructions

2. **EAS Build (Expo Application Services)**
   ```bash
   eas build --platform android --profile production
   ```
   - Creates shareable download link
   - Professional distribution

3. **Direct Transfer**
   - USB transfer
   - Email (if under 25MB)
   - File sharing apps

---

## 🎨 App Features Included

This build includes:

✅ **7 AI-Powered Services:**
- Background Remover
- Image Enhancer
- Wrinkle Remover
- Image Centering
- AI Model Try-On
- Image to Video
- Try-On Gear (3 modes)

✅ **Advanced Features:**
- Folder batch processing
- Multi-folder upload
- ZIP download support
- Nested folder handling
- Accordion UI
- Comprehensive logging

---

## 📝 Build Logs

Build logs are saved at:
```
android/build/reports/problems/problems-report.html
```

Check this file for detailed build information and warnings.

---

## 🔄 Updating the Build

To rebuild with latest code:

1. **Make code changes**
2. **Test on emulator/device**
3. **Build release APK:**
   ```bash
   cd android && .\gradlew assembleRelease
   ```
4. **Verify APK size and functionality**
5. **Share updated build**

---

## 📞 Support

If you encounter issues:

1. Check build logs
2. Verify all prerequisites are installed
3. Try clean build: `.\gradlew clean assembleRelease`
4. Check Android SDK and build tools versions
5. Review error messages in terminal output

---

## 📅 Build History

**Latest Build:**
- **Date:** 2025-01-27
- **Version:** 1.1.0
- **Size:** ~34 MB
- **Status:** ✅ Optimized Release Build

---

## 🎯 Next Steps

1. ✅ Build completed successfully
2. 📱 Test APK on device
3. 📤 Share with stakeholders
4. 🔄 Iterate based on feedback
5. 🚀 Prepare for production release

---

**Last Updated:** 2025-01-27  
**Build System:** Gradle 8.14.3  
**Android SDK:** 36  
**Min SDK:** 24

