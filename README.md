# MicroMentor - Habit Tracking App

A React Native habit tracking app built with Expo and Supabase, designed to help users build lasting habits through daily check-ins and streak tracking.

## Features

### ✅ Implemented
- **Authentication**: Supabase authentication with email/password
- **Admin Mode**: Local admin bypass for development (Admin@Admin.com / Admins)
- **Habit Management**: Create, edit, delete habits
- **Daily Check-ins**: Track daily habit completion
- **Streak Tracking**: Monitor current and longest streaks
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Navigation**: Stack-based navigation between screens

### 🔧 Technical Stack
- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL + Real-time)
- **Authentication**: Supabase Auth
- **Navigation**: React Navigation v6
- **Language**: TypeScript

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- Supabase account (for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Mirco-Habit-Visualization
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase** (Optional for development)
   - Create a Supabase project
   - Copy your project URL and anon key
   - Update `supabase/supabaseConfig.ts` with your credentials

4. **Start the development server**
   ```bash
   npm start
   ```

### Development Mode

The app includes a local admin mode for development:
- **Email**: `Admin@Admin.com`
- **Password**: `Admins`

This bypasses Supabase authentication and provides mock data for testing.

## App Structure

```
├── App.tsx                 # Main app component with navigation
├── screens/
│   ├── LoginScreen.tsx     # Authentication screen
│   ├── HomeScreen.tsx      # Main habits dashboard
│   └── AddHabitScreen.tsx  # Habit creation/editing
├── components/
│   └── HabitCard.tsx       # Individual habit display
├── supabase/
│   ├── supabaseConfig.ts   # Supabase client configuration
│   ├── supabaseService.ts  # Database operations
│   └── schema.sql          # Database schema
└── assets/
    └── animations/         # Lottie animations
```

## Database Schema

The app uses a simple but effective schema:

### Habits Table
- `id`: Unique identifier
- `user_id`: User reference
- `name`: Habit name
- `icon`: Emoji icon
- `description`: Optional description
- `reminder_time`: Optional reminder time
- `streak`: Current streak count
- `longest_streak`: Best streak achieved
- `history`: JSON object tracking daily completion
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

## Key Features

### Habit Management
- Create habits with custom names, descriptions, and icons
- Set optional daily reminders
- Edit existing habits
- Delete habits with confirmation

### Progress Tracking
- Daily check-in system
- Visual streak indicators with emojis
- Current vs. longest streak display
- Completion status for today

### User Experience
- Clean, modern interface
- Smooth animations and transitions
- Intuitive navigation
- Responsive design

## Development Notes

### Admin Mode
The admin mode provides:
- Bypass authentication for quick testing
- Mock data for immediate functionality
- Full feature access without Supabase setup

### Supabase Integration
When using Supabase:
- Real-time habit updates
- Secure user authentication
- Scalable database backend
- Row-level security

## Future Enhancements

Potential features for future versions:
- [ ] Push notifications for reminders
- [ ] Habit categories and tags
- [ ] Progress analytics and charts
- [ ] Social features and sharing
- [ ] Achievement system
- [ ] Export/import data
- [ ] Dark mode support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## 🛠 Tech Stack

- **Frontend**: React Native with Expo SDK
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore (NoSQL)
- **Local Storage**: AsyncStorage for offline access
- **Notifications**: expo-notifications
- **Animations**: Lottie for achievement celebrations
- **Navigation**: React Navigation

## 📱 Screenshots

*Screenshots will be added after the app is running*

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Mirco-Habit-Visualization
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Get your Firebase configuration

4. **Configure Firebase**
   - Open `firebase/firebaseConfig.js`
   - Replace the placeholder config with your actual Firebase configuration:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

5. **Set up Firestore Rules**
   - In your Firebase Console, go to Firestore Database > Rules
   - Replace the rules with:
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

6. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

7. **Run on device/simulator**
   - Install Expo Go on your mobile device
   - Scan the QR code from the terminal
   - Or press 'i' for iOS simulator or 'a' for Android emulator

## 📋 Usage

### Creating Your First Habit

1. **Sign up/Login**: Create an account or sign in with existing credentials
2. **Add Habit**: Tap the "+ Add Habit" button
3. **Configure**: 
   - Enter a habit name (e.g., "Drink Water")
   - Choose an emoji icon
   - Set a daily reminder time (optional)
4. **Save**: Your habit is now ready to track!

### Daily Check-ins

- **Check In**: Tap the "Check In" button on any habit card
- **Visual Feedback**: The card will show "✓ Completed" when done
- **Streak Update**: Your streak count will increase automatically
- **Achievements**: Celebrate milestones with animated achievements

### Managing Habits

- **Edit**: Long-press any habit card and select "Edit"
- **Delete**: Long-press any habit card and select "Delete"
- **View Progress**: See your streak and recent activity on each habit card

## 🏗 Project Structure

```
/
├── App.js                 # Main app entry point
├── app.json              # Expo configuration
├── package.json          # Dependencies
├── firebase/
│   ├── firebaseConfig.js # Firebase initialization
│   ├── authService.js    # Authentication functions
│   └── firestoreService.js # Database operations
├── context/
│   └── AuthContext.js    # Authentication context
├── components/
│   ├── HabitCard.js      # Individual habit display
│   └── StreakCalendar.js # Activity calendar
├── screens/
│   ├── LoginScreen.js    # Authentication screen
│   ├── HomeScreen.js     # Main app screen
│   └── AddHabitScreen.js # Habit creation/editing
├── utils/
│   ├── notificationScheduler.js # Push notifications
│   └── streakUtils.js    # Streak calculations
└── assets/
    └── animations/       # Lottie animation files
```

## 🔧 Configuration

### Firebase Setup

1. **Authentication**: Enable Email/Password authentication in Firebase Console
2. **Firestore**: Create a Firestore database in test mode
3. **Security Rules**: Update Firestore rules to allow authenticated users to access their data

### Notifications

The app uses expo-notifications for daily reminders. Make sure to:
- Grant notification permissions when prompted
- Test notifications on a physical device (notifications don't work in simulators)

### Offline Support

The app automatically caches data locally using AsyncStorage and syncs when online. No additional configuration needed.

## 🎯 Features in Detail

### Habit Management
- **Maximum 3 habits**: Keeps focus on what matters most
- **Custom icons**: Choose from 24 emoji options
- **Flexible naming**: Any habit name you want
- **Reminder times**: Set daily notification times

### Progress Tracking
- **Daily streaks**: Count consecutive days of completion
- **Longest streaks**: Track your best performance
- **Visual calendar**: See your recent activity at a glance
- **Completion history**: Detailed record of all check-ins

### Achievement System
- **Milestone rewards**: Celebrate 3, 7, 14, 30, 60, and 100-day streaks
- **Animated celebrations**: Lottie animations for achievements
- **Motivational messages**: Encouraging feedback for progress

### Cloud Sync
- **Real-time updates**: Changes sync instantly across devices
- **Offline support**: Works without internet connection
- **Automatic backup**: Your data is safely stored in the cloud
- **Cross-device access**: Use the same account on multiple devices

## 🐛 Troubleshooting

### Common Issues

1. **Firebase connection errors**
   - Verify your Firebase configuration in `firebaseConfig.js`
   - Check that your Firebase project is properly set up
   - Ensure Firestore rules allow authenticated access

2. **Notification issues**
   - Notifications only work on physical devices
   - Grant notification permissions when prompted
   - Check device notification settings

3. **Build errors**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`
   - Reset Expo cache: `expo start -c`

### Development Tips

- Use Expo Go for quick testing and development
- Test on both iOS and Android devices
- Use Firebase Console to monitor data and authentication
- Check Expo logs for detailed error information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [React Native](https://reactnative.dev/)
- Powered by [Expo](https://expo.dev/)
- Backend by [Firebase](https://firebase.google.com/)
- Animations by [Lottie](https://lottiefiles.com/)

## 📞 Support

If you encounter any issues or have questions:
- Check the troubleshooting section above
- Review Firebase documentation
- Open an issue on GitHub

---

**Happy habit building! 🌟** 