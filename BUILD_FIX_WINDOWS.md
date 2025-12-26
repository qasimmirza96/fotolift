# 🔧 Fixing Windows Build Error - CMake/Ninja Issue

## Error
```
Execution failed for task ':react-native-screens:buildCMakeDebug[arm64-v8a]'
> A problem occurred starting process 'command 'C:\Users\User\AppData\Local\Android\Sdk\cmake\3.22.1\bin\ninja.exe''
```

## 🚀 Solution 1: Use EAS Build (Recommended - Avoids Windows Issues)

**Best Solution:** Use cloud build to avoid Windows-specific build issues.

```bash
# Build in the cloud (no local build issues)
eas build --platform android --profile production
```

This builds in Expo's cloud infrastructure and avoids all Windows CMake/Ninja issues.

---

## 🔧 Solution 2: Fix Local Build (If you need local build)

### Option A: Clean and Rebuild

```bash
# Clean build
cd android
./gradlew clean
cd ..

# Clean node modules
rm -rf node_modules
npm install

# Rebuild
npx expo prebuild --clean
npx expo run:android
```

### Option B: Update CMake/Ninja

1. **Check CMake installation:**
   ```bash
   # Verify CMake is installed
   cmake --version
   ```

2. **Update Android SDK:**
   - Open Android Studio
   - SDK Manager → SDK Tools
   - Install/Update CMake and NDK

3. **Set environment variables:**
   ```bash
   # Add to PATH
   ANDROID_SDK_ROOT=C:\Users\User\AppData\Local\Android\Sdk
   ANDROID_NDK_HOME=C:\Users\User\AppData\Local\Android\Sdk\ndk\27.1.12297006
   ```

### Option C: Build Only x86_64 (Skip arm64)

Edit `android/gradle.properties`:
```properties
# Build only for x86_64 (emulator)
reactNativeArchitectures=x86_64
```

Then rebuild:
```bash
npx expo run:android
```

### Option D: Disable react-native-screens CMake (Temporary)

This is not recommended but can work as a workaround:

1. Edit `android/app/build.gradle`:
   ```gradle
   android {
       packagingOptions {
           pickFirst 'lib/x86/libc++_shared.so'
           pickFirst 'lib/x86_64/libc++_shared.so'
           pickFirst 'lib/armeabi-v7a/libc++_shared.so'
           pickFirst 'lib/arm64-v8a/libc++_shared.so'
       }
   }
   ```

---

## ✅ Recommended: Use EAS Build

**Why EAS Build is better:**
- ✅ No Windows build issues
- ✅ No local environment setup needed
- ✅ Faster builds (cloud infrastructure)
- ✅ Production-ready APK
- ✅ Automatic signing

**Command:**
```bash
eas build --platform android --profile production
```

---

## 📝 Quick Fix Commands

### Try this first (Quick fix):
```bash
cd android
./gradlew clean
cd ..
npx expo prebuild --clean
npx expo run:android
```

### If that doesn't work, use EAS:
```bash
eas build --platform android --profile production
```

---

**Note:** For release APK sharing, EAS Build is the recommended approach as it avoids all local build environment issues.


