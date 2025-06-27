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
4. **Set reminder time** using the interactive time picker:
   - Tap the time button to open the modal
   - Scroll through hours (0-23) and minutes (0-59)
   - Feel haptic feedback as you select
   - See the selected time in real-time
   - Tap "Done" to confirm
5. Save your habit!

### Daily Check-ins
- Tap "✔ I Did It!" on any habit
- Watch your streak grow with emoji indicators
- Celebrate achievements at milestones

### Features Available
- ✅ Create/edit/delete habits (up to 5)
- ✅ Daily check-ins with streak tracking
- ✅ Local storage (works offline)
- ✅ Interactive time picker with haptics
- ✅ Achievement celebrations with animations
- ✅ Beautiful, responsive UI
- ✅ Cross-platform (iOS & Android)

## ⏰ Time Picker Features

The app includes a beautiful interactive time picker:

### ✨ **Interactive Design**
- **Rotating wheel** with smooth scrolling physics
- **Centered modal** - never cut off by screen boundaries
- **See-through selector** - clearly see selected time
- **Haptic feedback** - tactile confirmation
- **Real-time display** - shows current selection
- **24-hour format** with proper validation

### 🎯 **How to Use**
1. Tap the time button in Add/Edit Habit screen
2. Scroll through hours and minutes
3. Feel haptic feedback as you select
4. See the selected time in real-time
5. Tap "Done" to confirm or "Clear Reminder" to remove

## 🔧 Troubleshooting

### Common Issues
- **"Module not found"**: Run `npm install` to install dependencies
- **Time picker not working**: Ensure `expo-haptics` is installed
- **Build errors**: Run `npm start -c` to clear cache
- **Notifications not working**: Currently using mock service (see NOTIFICATIONS_SETUP.md)

### Dependencies
The app uses these key dependencies:
- `expo-haptics` - for tactile feedback
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