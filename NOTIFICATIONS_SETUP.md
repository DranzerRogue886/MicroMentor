# Notifications Setup Guide

This guide explains how to implement real notifications in the MicroHabit app.

## Current Status

The app currently uses a mock notification service to avoid dependency issues during development. All notification functions are stubbed and log to the console.

## To Enable Real Notifications

### 1. Install Required Dependencies

```bash
npm install expo-notifications expo-device
```

### 2. Update services/notifications.ts

Replace the mock implementation with the real one:

```typescript
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { Habit } from '../types';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return true;
  }

  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  static async getScheduledNotifications(): Promise<any[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }
}
```

### 3. Update app.json

Add notification configuration to your app.json:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff",
          "sounds": ["./assets/notification-sound.wav"]
        }
      ]
    ]
  }
}
```

### 4. Test Notifications

- Notifications only work on physical devices, not simulators
- Grant notification permissions when prompted

## Features

Once notifications are implemented, the system will provide:

- **Permission Handling**: Proper request and management of notification permissions
- **Cross-platform**: Works on both iOS and Android
- **Background Support**: Notifications work even when app is closed

## Troubleshooting

- **Notifications not showing**: Check device notification settings
- **Permission denied**: Guide user to device settings to enable notifications
- **Not working on simulator**: Test on physical device

## Dependencies

The current implementation uses:
- `react-native-reanimated` - for smooth animations
- `react-native-gesture-handler` - for gesture handling

For notifications, you'll also need:
- `expo-notifications` - for notification functionality
- `expo-device` - for device-specific features 