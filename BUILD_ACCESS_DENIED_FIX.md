# 🔧 Fix "Access is Denied" Build Error

## Error
```
ninja: fatal: CreateProcess: Access is denied.
```

This happens when Windows Defender or antivirus blocks the NDK compiler (`clang++.exe`).

---

## ✅ Solution 1: Add Antivirus Exclusions (Recommended)

### Windows Defender:
1. Open **Windows Security** → **Virus & threat protection**
2. Click **Manage settings** under "Virus & threat protection settings"
3. Scroll to **Exclusions** → Click **Add or remove exclusions**
4. Add these folders:
   - `C:\Users\User\AppData\Local\Android\Sdk\ndk\`
   - `D:\systemsphere\react-native\fotolift\android\`
   - `D:\systemsphere\react-native\fotolift\node_modules\`

### Other Antivirus:
- Add the same folders to your antivirus exclusions
- Temporarily disable real-time protection during build

---

## ✅ Solution 2: Build Only for Emulator (Quick Fix)

Since you're running on emulator, build only for x86_64:

Edit `android/gradle.properties`:
```properties
# Build only for emulator (x86_64)
reactNativeArchitectures=x86_64
```

Then rebuild:
```bash
cd android
./gradlew clean
cd ..
npx expo run:android
```

---

## ✅ Solution 3: Run as Administrator

1. Close all terminals
2. Right-click PowerShell/Command Prompt
3. Select **Run as administrator**
4. Navigate to project: `cd D:\systemsphere\react-native\fotolift`
5. Run: `npx expo run:android`

---

## ✅ Solution 4: Use EAS Build (Best for Production)

Your EAS build already works! Use it for production APKs:

```bash
eas build --platform android --profile production
```

**APK Download:** https://expo.dev/artifacts/eas/jA2YToBpXJd1XPJXB6A6Pc.apk

---

## ✅ Solution 5: Clean Build Cache

Sometimes corrupted cache causes permission issues:

```bash
# Clean everything
cd android
./gradlew clean
cd ..

# Clean node modules
rm -rf node_modules
npm install

# Clean Expo cache
npx expo start --clear

# Rebuild
npx expo prebuild --clean
npx expo run:android
```

---

## 🎯 Quick Fix Order

1. **Try Solution 2 first** (build only x86_64 for emulator) - Fastest
2. **If that fails, try Solution 1** (antivirus exclusions)
3. **For production, use Solution 4** (EAS Build)

---

## 📝 Note

The "Access is denied" error is a Windows security issue, not a code problem. Your app code is fine - the build system just can't execute the compiler due to security restrictions.



