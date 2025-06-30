# MicroHabit - Minimalist Habit Tracker

A beautiful, minimalist habit tracking app built with React Native, Expo, and AsyncStorage. Track up to 5 tiny daily habits, earn achievements, and build lasting routines with local notifications and motivational feedback.

## ✨ Features

- **🎯 Simple Habit Tracking**: Create and track daily habits with ease
- **📊 Visual Progress**: See your 7-day completion history at a glance
- **🔥 Streak Tracking**: Build momentum with visual streak indicators
- **🏆 Achievement System**: Celebrate milestones with animated achievements
- **💾 Offline Storage**: All data stored locally on your device
- **📱 Cross-Platform**: Works seamlessly on iOS and Android
- **🎨 Beautiful UI**: Clean, minimalist design with smooth animations
- **🔔 Local Notifications**: Get reminded when it's time for your habits
- **⚡ Fast & Lightweight**: Optimized for performance and battery life
- **🔄 Auto-Sync**: Real-time updates across all your devices

## 🛠️ Built With

- **Expo** for cross-platform development
- **React Native** for native mobile performance
- **TypeScript** for type safety
- **AsyncStorage** for local data persistence
- **React Navigation** for smooth screen transitions
- **Lottie** for celebration animations
- **expo-haptics** for tactile feedback

## 📱 Screenshots

*Screenshots will be added here*

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator (for iOS development) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DranzerRogue886/MicroMentor.git
   cd Mirco-Habit-Visualization
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## 📋 Usage

### Creating Habits

1. Tap the "+ Add Habit" button
2. Enter a habit name (e.g., "Drink Water")
3. Choose an emoji icon from the grid
4. Save your habit

### Daily Check-ins

1. On the home screen, you'll see all your habits
2. Tap "✔ I Did It!" to mark a habit as complete
3. Your streak will automatically update
4. Earn achievements for milestone streaks

### Managing Habits

- **Long press** any habit card to edit or delete
- **Edit**: Modify name or icon
- **Delete**: Remove habits with confirmation

## 🏆 Achievement System

Celebrate your progress with these milestones:

- 🌱 **Getting Started!** - Complete your first habit
- ⭐ **Building Momentum!** - 3-day streak
- 💪 **Week Warrior!** - 7-day streak
- 👑 **Consistency King!** - 14-day streak
- 🏆 **Habit Master!** - 30-day streak
- 🔥 **Century Club!** - 100-day streak

## 📊 Data Structure

Habits are stored locally with this structure:

```typescript
interface Habit {
  id: string;
  name: string;
  icon: string;
  streak: number;
  longestStreak: number;
  history: Record<string, boolean>;
  createdAt: string;
  updatedAt: string;
}
```

## 🎨 UI/UX Features

- **Minimalist Design**: Clean, uncluttered interface
- **Smooth Animations**: Button press feedback and transitions
- **Visual Progress**: 7-day history bars with completion rates
- **Streak Indicators**: Emoji-based streak visualization
- **Responsive Layout**: Works on all screen sizes
- **Accessible**: Large tap targets and clear typography
- **Modal Interfaces**: Better focus and user experience

## 🔧 Development

### Project Structure

```
Mirco-Habit-Visualization/
├── App.tsx                 # Main app component
├── screens/
│   ├── HomeScreen.tsx      # Main dashboard
│   └── AddHabitScreen.tsx  # Habit creation/editing
├── components/
│   ├── HabitCard.tsx       # Individual habit display
│   └── AchievementModal.tsx # Achievement celebrations
├── services/
│   ├── storage.ts          # AsyncStorage operations
│   ├── notifications.ts    # Notification management
│   └── achievements.ts     # Achievement system
├── utils/
│   └── habitUtils.ts       # Utility functions
└── types/
    └── index.ts           # TypeScript definitions
```

### Key Components

- **HabitCard**: Displays individual habits with check-in functionality
- **AchievementModal**: Shows achievement celebrations with animations
- **HomeScreen**: Main dashboard with progress summary
- **AddHabitScreen**: Form for creating and editing habits

### Services

- **StorageService**: Handles AsyncStorage operations
- **NotificationService**: Manages local notifications
- **AchievementService**: Tracks and celebrates milestones

## 🚀 Deployment

### Building for Production

1. **Configure app.json** with your app details
2. **Build the app**:
   ```bash
   expo build:android  # For Android
   expo build:ios      # For iOS
   ```

### Publishing to Stores

1. **Create app store accounts** (Apple App Store, Google Play)
2. **Follow Expo's deployment guide** for each platform
3. **Submit for review** with appropriate metadata

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Icons from [Emoji](https://emojipedia.org/)
- Animations with [Lottie](https://lottiefiles.com/)
- Haptic feedback with [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)

## 📝 Recent Updates

### v1.2.0 - Simplified Interface
- 🗑️ Removed timer functionality for cleaner, simpler interface
- 🎯 Focused on core habit tracking features
- 📱 Streamlined habit creation and editing process
- 🔧 Improved performance and reduced complexity

### v1.1.0 - Interactive Time Picker
- ✨ Added rotating time picker with physics and haptics
- 🎨 Transformed to modal interface for better UX
- 👁️ Made selector see-through for better visibility
- 🔧 Fixed scroll conflicts and layout issues
- 📱 Improved responsive design and accessibility

### v1.0.0 - Initial Release
- 🎯 Basic habit tracking functionality
- 🏆 Achievement system
- 📊 Progress visualization
- 🔔 Local notifications
- 💾 Offline storage support

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Happy habit building! 🌱✨** 