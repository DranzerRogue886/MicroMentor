# Notifications Setup Guide

This guide explains how to implement real notifications in the MicroHabit app.

## Current Status

The app currently uses a mock notification service to avoid dependency issues during development. All notification functions are stubbed and log to the console.

**✅ Time Picker is fully implemented** with an interactive rotating wheel design, haptic feedback, and modal interface.

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

  static async scheduleHabitReminder(habit: Habit): Promise<string | null> {
    try {
      const [hours, minutes] = habit.reminderTime.split(':').map(Number);
      
      const trigger = {
        hour: hours,
        minute: minutes,
        repeats: true,
      };

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `Time for: ${habit.name}`,
          body: `Don't break your ${habit.streak}-day streak! ${habit.icon}`,
          data: { habitId: habit.id },
        },
        trigger,
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  static async cancelHabitReminder(habitId: string): Promise<void> {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const notificationToCancel = scheduledNotifications.find(
        (notification: any) => notification.content.data?.habitId === habitId
      );
      
      if (notificationToCancel) {
        await Notifications.cancelScheduledNotificationAsync(notificationToCancel.identifier);
      }
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
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
- Test with different reminder times set using the TimePicker

## Current Time Picker Features

The app now includes a beautiful interactive time picker:

### ✨ **Time Picker Features**
- **Rotating wheel design** with smooth scrolling physics
- **Centered modal interface** - never cut off by screen boundaries
- **See-through selector** - clearly see selected time through transparent overlay
- **Haptic feedback** - tactile confirmation when selecting time
- **Real-time display** - shows current selection as you scroll
- **24-hour format** support with proper validation
- **Semi-transparent design** for better visual hierarchy

### 🎯 **How to Use**
1. Tap the time button in the Add/Edit Habit screen
2. Scroll through hours (0-23) and minutes (0-59)
3. Feel haptic feedback as you select
4. See the selected time in real-time
5. Tap "Done" to confirm or "Clear Reminder" to remove

## Features

Once notifications are implemented, the system will provide:

- **Daily Reminders**: Notifications at the specified time for each habit
- **Streak Motivation**: Include current streak in notification messages
- **Permission Handling**: Proper request and management of notification permissions
- **Cross-platform**: Works on both iOS and Android
- **Background Support**: Notifications work even when app is closed
- **Interactive Time Selection**: Beautiful time picker with haptic feedback

## Troubleshooting

- **Notifications not showing**: Check device notification settings
- **Permission denied**: Guide user to device settings to enable notifications
- **Wrong time**: Ensure time format is HH:MM (24-hour) - TimePicker handles this automatically
- **Not working on simulator**: Test on physical device
- **Time picker issues**: Ensure expo-haptics is properly installed

## Dependencies

The current implementation uses:
- `expo-haptics` - for tactile feedback in the time picker
- `react-native-reanimated` - for smooth animations
- `react-native-gesture-handler` - for gesture handling

For notifications, you'll also need:
- `expo-notifications` - for notification functionality
- `expo-device` - for device-specific features 