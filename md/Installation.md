# 📱 Hướng dẫn cài đặt chi tiết

## Yêu cầu hệ thống

### Chung
- Node.js >= 20
- npm hoặc yarn
- Git

### Android
- Android Studio
- Android SDK (API Level 33+)
- Java Development Kit (JDK 17)

### iOS (chỉ trên macOS)
- Xcode 15+
- CocoaPods
- iOS 13.0+

## 🚀 Bước 1: Clone hoặc tạo project

```bash
# Nếu bạn đã có code
cd AppIOT

# Hoặc tạo mới từ đầu
npx react-native@latest init AppIOT
cd AppIOT
```

## 📦 Bước 2: Cài đặt dependencies

```bash
npm install
```

Hoặc nếu dùng yarn:

```bash
yarn install
```

### Dependencies chính:

```json
{
  "react-navigation/native": "Navigation",
  "@react-navigation/native-stack": "Stack navigation",
  "react-native-safe-area-context": "Safe area",
  "react-native-screens": "Native screens",
  "@react-native-async-storage/async-storage": "Local storage"
}
```

## 🍎 Bước 3: Cài đặt iOS (chỉ macOS)

```bash
cd ios
pod install
cd ..
```

Nếu gặp lỗi, thử:

```bash
cd ios
pod deintegrate
pod install
cd ..
```

## 🤖 Bước 4: Setup Android

### 4.1 Mở Android Studio
1. Mở Android Studio
2. SDK Manager → Android SDK
3. Đảm bảo đã cài:
    - Android SDK Platform 33
    - Android SDK Build-Tools
    - Android Emulator

### 4.2 Cấu hình biến môi trường

**Windows:**
```bash
setx ANDROID_HOME "%LOCALAPPDATA%\Android\Sdk"
setx PATH "%PATH%;%LOCALAPPDATA%\Android\Sdk\platform-tools"
```

**macOS/Linux:**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Thêm vào `~/.bashrc` hoặc `~/.zshrc` để lưu vĩnh viễn.

## ▶️ Bước 5: Chạy ứng dụng

### Metro Bundler

Mở terminal đầu tiên:

```bash
npm start
```

Hoặc:

```bash
npx react-native start
```

### Android

Mở terminal thứ hai:

```bash
npm run android
```

Hoặc:

```bash
npx react-native run-android
```

### iOS (chỉ macOS)

Mở terminal thứ hai:

```bash
npm run ios
```

Hoặc:

```bash
npx react-native run-ios
```

## 🔧 Troubleshooting

### Lỗi: Metro Bundler không khởi động

```bash
# Reset cache
npm start -- --reset-cache

# Hoặc
npx react-native start --reset-cache
```

### Lỗi: Could not connect to development server

1. Kiểm tra Metro Bundler đang chạy
2. Đảm bảo port 8081 không bị chiếm
3. Reload app: Nhấn 'R' hai lần nhanh trong app

### Lỗi: Android Build Failed

```bash
# Clean build
cd android
./gradlew clean
cd ..

# Hoặc từ root
npm run android -- --clean
```

### Lỗi: iOS Build Failed

```bash
# Clean pods
cd ios
rm -rf Pods
rm Podfile.lock
pod install
cd ..

# Clean Xcode cache
rm -rf ~/Library/Developer/Xcode/DerivedData
```

### Lỗi: Unable to resolve module

```bash
# Clear watchman
watchman watch-del-all

# Clear metro bundler
rm -rf $TMPDIR/react-*

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Lỗi: Task ':app:installDebug' failed

```bash
# Kiểm tra devices
adb devices

# Nếu không có device, start emulator từ Android Studio

# Hoặc dùng adb
emulator -avd Pixel_4_API_33
```

## 📱 Test trên thiết bị thật

### Android

1. Bật "Developer Options" trên điện thoại
2. Bật "USB Debugging"
3. Kết nối điện thoại qua USB
4. Chạy: `adb devices` để kiểm tra
5. Chạy: `npm run android`

### iOS

1. Mở Xcode
2. Chọn điện thoại trong device list
3. Chạy project từ Xcode
4. Tin tưởng developer certificate trên điện thoại

## 🔍 Debug Mode

### Mở Debug Menu

**Android:**
- Shake device
- Hoặc: `adb shell input keyevent 82`
- Hoặc: Cmd/Ctrl + M (trên emulator)

**iOS:**
- Shake device
- Hoặc: Cmd + D (trên simulator)

### Chrome DevTools

1. Mở Debug Menu
2. Chọn "Debug JS Remotely"
3. Mở Chrome → `http://localhost:8081/debugger-ui`

### React DevTools

```bash
npm install -g react-devtools
react-devtools
```

## 📊 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## 🏗 Production Build

### Android

```bash
cd android
./gradlew assembleRelease
```

APK sẽ được tạo tại:
`android/app/build/outputs/apk/release/app-release.apk`

### iOS

1. Mở Xcode
2. Product → Archive
3. Distribute App → Ad Hoc/App Store

## 🔐 Code Signing (Production)

### Android

1. Tạo keystore:
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. Thêm vào `android/gradle.properties`:
```
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=*****
MYAPP_RELEASE_KEY_PASSWORD=*****
```

3. Update `android/app/build.gradle`

### iOS

1. Setup trong Xcode:
    - Signing & Capabilities
    - Team
    - Bundle Identifier
    - Provisioning Profile

## 📚 Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/)
- [Android Developer](https://developer.android.com/)
- [iOS Developer](https://developer.apple.com/)

## 💡 Tips

1. **Performance**: Sử dụng Release build khi test performance
2. **Hot Reload**: Nhấn 'R' hai lần để reload
3. **Fast Refresh**: Tự động reload khi save file
4. **Debug**: Dùng `console.log()` để debug
5. **Network**: Check network calls trong Debug Menu → "Debug"

## ⚡ Optimization

### Giảm kích thước APK

1. Enable ProGuard trong `android/app/build.gradle`:
```gradle
def enableProguardInReleaseBuilds = true
```

2. Enable separate builds per CPU architecture:
```gradle
splits {
    abi {
        enable true
    }
}
```

### Giảm thời gian build

1. Enable Gradle daemon
2. Tăng heap size trong `android/gradle.properties`:
```
org.gradle.jvmargs=-Xmx4096m
```

## 🆘 Cần trợ giúp?

- React Native Discord: https://discord.gg/reactiflux
- Stack Overflow: https://stackoverflow.com/questions/tagged/react-native
- GitHub Issues: Check các issues có sẵn

## ✅ Checklist cài đặt

- [ ] Node.js đã cài
- [ ] Android Studio/Xcode đã cài
- [ ] Dependencies đã install
- [ ] Metro Bundler chạy được
- [ ] App chạy trên emulator/simulator
- [ ] Hot reload hoạt động
- [ ] Debug menu mở được
- [ ] Mock data hiển thị đúng