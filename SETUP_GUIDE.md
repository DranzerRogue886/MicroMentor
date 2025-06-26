# 🚀 Quick Setup Guide - MicroHabit

## Prerequisites
- Node.js (v16+) and npm
- Expo CLI (`npm install -g @expo/cli`)
- Firebase account

## 1. Install Dependencies
```bash
npm install
```

## 2. Firebase Setup

### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "microhabit" (or your preferred name)
4. Follow the setup wizard

### Enable Services
1. **Authentication**: 
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"

2. **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in test mode"

### Get Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" > "Web"
4. Copy the config object

### Update Config
Replace the placeholder in `firebase/firebaseConfig.js`:
```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## 3. Start Development Server
```bash
npm start
```

## 4. Test on Device
1. Install "Expo Go" app on your phone
2. Scan the QR code from terminal
3. The app should load on your device!

## 🎯 What You Can Do Now

### Create Your First Habit
1. Sign up with email/password
2. Tap "+ Add Habit"
3. Enter name (e.g., "Drink Water")
4. Choose emoji (💧)
5. Set reminder time (optional)
6. Save!

### Daily Check-ins
- Tap "Check In" on any habit
- Watch your streak grow
- Celebrate achievements at milestones

### Features Available
- ✅ User authentication
- ✅ Create/edit/delete habits (max 3)
- ✅ Daily check-ins with streak tracking
- ✅ Cloud sync across devices
- ✅ Daily notifications
- ✅ Achievement celebrations
- ✅ Offline support
- ✅ Beautiful, responsive UI

## 🔧 Troubleshooting

### Common Issues
- **"Firebase not configured"**: Check your `firebaseConfig.js`
- **"Permission denied"**: Update Firestore rules in Firebase Console
- **Notifications not working**: Test on physical device, not simulator
- **Build errors**: Run `npm start -c` to clear cache

### Firestore Rules
In Firebase Console > Firestore > Rules, use:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📱 Next Steps
- Customize the UI colors and styling
- Add more achievement animations
- Implement habit categories
- Add data export functionality
- Create a web version

---

**Happy habit building! 🌟** 