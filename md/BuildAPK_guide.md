## Build apk test

```text
cd android
./gradlew assembleRelease
```

File apk ở : `android/app/build/outputs/apk/release/app-release.apk`

Chuyển apk này sang máy android để test
(Dùng airdroid hoặc gg drive)

## Build release

```text
cd android && ./gradlew clean && cd ..
npx react-native build-android --mode=release
```