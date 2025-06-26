# MicroHabit - Minimalist Habit Tracker

A beautiful, minimalist habit tracking app built with React Native, Expo, and AsyncStorage. Track up to 5 tiny daily habits, earn achievements, and build lasting routines with local notifications and motivational feedback.

## ✨ Features

- **Simple Habit Tracking**: Focus on up to 5 essential habits
- **Daily Check-ins**: One-tap habit completion with visual feedback
- **Streak Tracking**: Monitor your progress with streak counters and emojis
- **Achievement System**: Celebrate milestones with animated celebrations
- **Local Notifications**: Get reminded when it's time for your habits
- **Visual History**: 7-day progress bars for each habit
- **Offline Support**: Works without internet connection using AsyncStorage
- **Beautiful UI**: Clean, modern interface with smooth animations
- **Cross-platform**: Works on iOS and Android

## 🛠 Tech Stack

- **React Native** with functional components and hooks
- **Expo SDK** for faster cross-platform deployment
- **AsyncStorage** for local data persistence
- **expo-notifications** for push/local reminders
- **expo-device** for notification permissions
- **React Navigation** for screen transitions
- **Lottie** for celebration animations
- **TypeScript** for type safety

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
   git clone <repository-url>
   cd MicroHabit
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
3. Choose an emoji icon
4. Set an optional daily reminder time
5. Save your habit

### Daily Check-ins

1. On the home screen, you'll see all your habits
2. Tap "✔ I Did It!" to mark a habit as complete
3. Your streak will automatically update
4. Earn achievements for milestone streaks

### Managing Habits

- **Long press** any habit card to edit or delete
- **Edit**: Modify name, icon, or reminder time
- **Delete**: Remove habits with confirmation

### Notifications

- Grant notification permissions when prompted
- Set reminder times for daily notifications
- Notifications include your current streak for motivation

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
  reminderTime: string;
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

## 🔧 Development

### Project Structure

```
MicroHabit/
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

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Happy habit building! 🌱✨** 