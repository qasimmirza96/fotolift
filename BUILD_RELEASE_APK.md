# 🚀 Building Release APK for FotoLift

**App Version:** 1.1.0  
**Package:** com.qasimmirza.fotolift

---

## 📋 Prerequisites

1. **EAS CLI installed**
   ```bash
   npm install -g eas-cli
   ```

2. **Expo account logged in**
   ```bash
   eas login
   ```

3. **Project configured**
   - `eas.json` is already configured
   - `app.json` has correct package name and version

---

## 🔨 Method 1: EAS Build (Recommended - Cloud Build)

### Step 1: Login to Expo
```bash
eas login
```

### Step 2: Build Production APK
```bash
eas build --platform android --profile production
```

### Step 3: Download APK
- Build will be done in the cloud (takes 15-30 minutes)
- You'll get a download link via email or in the terminal
- Download the APK file

**APK Location:** Download from Expo dashboard or email link

---

## 🔨 Method 2: Local Build (Requires Android Studio)

### Step 1: Generate Native Code
```bash
npx expo prebuild --clean
```

### Step 2: Build Release APK
```bash
cd android
./gradlew assembleRelease
```

### Step 3: Find APK
**Location:** `android/app/build/outputs/apk/release/app-release.apk`

**Note:** On Windows, use:
```bash
cd android
gradlew.bat assembleRelease
```

---

## 🔨 Method 3: EAS Build Preview (Faster, for Testing)

```bash
eas build --platform android --profile preview
```

This builds a preview APK (faster, but not optimized for production).

---

## ⚙️ Build Configuration

### Current Settings (eas.json)

**Production Profile:**
- Build Type: APK
- Auto-increment version: Yes
- Environment: Production

**Preview Profile:**
- Build Type: APK
- Distribution: Internal

---

## 📦 APK Optimization

### Before Building:

1. **Remove console.logs** (Already done in performance fixes)
2. **Optimize images** - Compress assets
3. **Enable ProGuard** (if needed)
4. **Check bundle size**

### Build Size Optimization:

The APK size will be approximately:
- **Development:** 50-80 MB
- **Production (optimized):** 30-50 MB

---

## 🎯 Quick Build Commands

### Build for Production (Cloud)
```bash
eas build --platform android --profile production
```

### Build for Preview/Testing
```bash
eas build --platform android --profile preview
```

### Build Locally (if Android Studio installed)
```bash
npx expo prebuild --clean
cd android
./gradlew assembleRelease
```

---

## 📱 Installing the APK

### On Android Device:

1. **Enable Unknown Sources:**
   - Settings → Security → Unknown Sources (Enable)

2. **Transfer APK:**
   - Copy APK to device via USB, email, or cloud storage

3. **Install:**
   - Open APK file on device
   - Tap "Install"
   - Wait for installation to complete

---

## 🔍 Troubleshooting

### Issue: Build fails
**Solution:** Check EAS build logs in terminal or Expo dashboard

### Issue: APK too large
**Solution:** 
- Remove unused dependencies
- Optimize images
- Enable ProGuard

### Issue: App crashes on launch
**Solution:**
- Check if all native modules are properly linked
- Verify permissions in app.json
- Test in development build first

### Issue: Can't install APK
**Solution:**
- Enable "Install from Unknown Sources"
- Check if device architecture matches (arm64-v8a, armeabi-v7a, x86)

---

## 📊 Build Status

Check build status:
```bash
eas build:list
```

View build details:
```bash
eas build:view [BUILD_ID]
```

---

## ✅ Post-Build Checklist

- [ ] APK builds successfully
- [ ] APK size is reasonable (<50 MB)
- [ ] App installs on test device
- [ ] App launches without crashes
- [ ] All features work correctly
- [ ] Performance is acceptable
- [ ] No console errors in production

---

## 📝 Notes

- **EAS Build** is recommended for production releases
- **Local Build** requires Android Studio and can be complex
- **Preview Build** is good for testing before production
- APK will be signed with Expo's default certificate (for testing)
- For Play Store, you'll need to configure signing keys

---

## 🎉 Success!

Once built, your APK will be ready to share!

**APK File:** `app-release.apk` or download from EAS dashboard

**Share:** Upload to Google Drive, Dropbox, or any file sharing service

---

**Last Updated:** January 2025


