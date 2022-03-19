# REALIFS React Native Android App

### Prerequisites
- Node v.14

## Setup and Launch (Dev)
1. `npm ci`
2. `npm run android`

### Build Instructions (APK)
1. `npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res`
2. Change directory to /android: `cd android`
3. `gradlew assembleDebug`
4. .apk will be available in `android\app\build\outputs\apk\debug`
