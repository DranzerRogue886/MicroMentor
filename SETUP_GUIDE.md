# 🚀 Quick Setup Guide - MicroHabit

## Prerequisites
- Node.js (v16+) and npm
- Expo CLI (`npm install -g @expo/cli`)

## 1. Install Dependencies
```bash
npm install
```

## 2. Start Development Server
```bash
npm start
```

## 3. Test on Device
1. Install "Expo Go" app on your phone
2. Scan the QR code from terminal
3. The app should load on your device!

## 🎯 What You Can Do Now

### Create Your First Habit
1. Tap "+ Add Habit"
2. Enter name (e.g., "Drink Water")
3. Choose emoji from the grid (💧, 🏃‍♂️, 📚, etc.)
4. Save your habit!

### Daily Check-ins
- Tap "✔ I Did It!" on any habit
- Watch your streak grow with emoji indicators
- Celebrate achievements at milestones

### Features Available
- ✅ Create/edit/delete habits (up to 5)
- ✅ Daily check-ins with streak tracking
- ✅ Local storage (works offline)
- ✅ Achievement celebrations with animations
- ✅ Beautiful, responsive UI
- ✅ Cross-platform (iOS & Android)

## 🔧 Troubleshooting

### Common Issues
- **"Module not found"**: Run `npm install` to install dependencies
- **Build errors**: Run `npm start -c` to clear cache
- **Notifications not working**: Currently using mock service (see NOTIFICATIONS_SETUP.md)

### Dependencies
The app uses these key dependencies:
- `react-native-reanimated` - for smooth animations
- `react-native-gesture-handler` - for gesture handling
- `@react-native-async-storage/async-storage` - for local data storage

## 📱 Next Steps
- Enable real notifications (see NOTIFICATIONS_SETUP.md)
- Customize the UI colors and styling
- Add more achievement animations
- Implement habit categories
- Add data export functionality
- Create a web version

## 🏆 Achievement System

Celebrate your progress with these milestones:
- 🌱 **Getting Started!** - Complete your first habit
- ⭐ **Building Momentum!** - 3-day streak
- 💪 **Week Warrior!** - 7-day streak
- 👑 **Consistency King!** - 14-day streak
- 🏆 **Habit Master!** - 30-day streak
- 🔥 **Century Club!** - 100-day streak

---

**Happy habit building! 🌟** 