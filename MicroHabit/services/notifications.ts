import { Platform, Alert } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { Habit, DayNotification } from '../types';
import { StorageService } from './storage';

export class NotificationService {
  static async initialize(): Promise<void> {
    try {
      console.log('Initializing React Native notification service...');
      
      // Configure push notifications
      this.configurePushNotifications();
      
      console.log('React Native notification service initialized successfully');
    } catch (error) {
      console.error('Error initializing notification service:', error);
    }
  }

  private static configurePushNotifications(): void {
    // Configure Android push notifications
    if (Platform.OS === 'android') {
      PushNotification.configure({
        onRegister: function (token: { os: string; token: string }) {
          console.log('TOKEN:', token);
        },
        onNotification: function (notification: any) {
          console.log('NOTIFICATION:', notification);
          notification.finish();
        },
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },
        popInitialNotification: true,
        requestPermissions: true,
      });

      // Create notification channel for Android
      PushNotification.createChannel(
        {
          channelId: 'micro-remindo',
          channelName: 'Micro-remindo',
          channelDescription: 'Reminders for your micro-habits',
          playSound: true,
          soundName: 'notification-sound.wav',
          importance: 4,
          vibrate: true,
        },
        (created: boolean) => console.log(`Notification channel created: ${created}`)
      );
    }
  }

  static async requestPermissions(): Promise<boolean> {
    try {
      console.log('Requesting notification permissions...');
      
      if (Platform.OS === 'android') {
        // Android permissions are handled by the configure method
        return true;
      } else {
        // For iOS, we'll use a simple approach
        return true;
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  static async sendImmediateTestNotification(): Promise<void> {
    try {
      console.log('Sending immediate test notification...');
      
      this.showLocalNotification({
        title: '🔔 Immediate Test',
        message: 'This is an immediate test notification from Micro-remindo!',
      });
      
      console.log('Immediate test notification sent');
    } catch (error) {
      console.error('Error sending immediate test notification:', error);
    }
  }

  static async sendScheduledTestNotification(): Promise<void> {
    try {
      console.log('Sending scheduled test notification (5 seconds)...');
      
      this.scheduleLocalNotification({
        title: '⏰ Scheduled Test',
        message: 'This is a scheduled test notification from Micro-remindo!',
        date: new Date(Date.now() + 5000), // 5 seconds from now
      });
      
      console.log('Scheduled test notification sent');
    } catch (error) {
      console.error('Error sending scheduled test notification:', error);
    }
  }

  static async scheduleNotificationsForHabit(habit: Habit): Promise<void> {
    try {
      console.log(`Scheduling notifications for habit: ${habit.name}`);
      
      // Cancel existing notifications for this habit
      await this.cancelNotificationsForHabit(habit.id);
      
      let scheduledCount = 0;
      
      // Process each day's notifications
      if (habit.dayNotifications && habit.dayNotifications.length > 0) {
        for (const dayNotification of habit.dayNotifications) {
          if (dayNotification.times && dayNotification.times.length > 0) {
            console.log(`Processing notifications for day: ${dayNotification.day}`);
            
            for (const time of dayNotification.times) {
              const scheduled = await this.scheduleHabitNotification(habit, dayNotification.day, time);
              if (scheduled) {
                scheduledCount++;
              }
            }
          }
        }
      }
      
      console.log(`Scheduled ${scheduledCount} notifications for habit: ${habit.name}`);
    } catch (error) {
      console.error(`Error scheduling notifications for habit ${habit.name}:`, error);
    }
  }

  static async cancelNotificationsForHabit(habitId: string): Promise<void> {
    try {
      console.log(`Canceling notifications for habit: ${habitId}`);
      
      if (Platform.OS === 'android') {
        // Cancel all notifications for this habit
        PushNotification.cancelAllLocalNotifications();
      }
    } catch (error) {
      console.error(`Error canceling notifications for habit ${habitId}:`, error);
    }
  }

  static async getScheduledNotifications(): Promise<any[]> {
    try {
      console.log('Getting scheduled notifications...');
      // For now, return empty array as getting scheduled notifications is complex
      return [];
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  private static async scheduleHabitNotification(habit: Habit, day: string, time: string): Promise<boolean> {
    try {
      const [hours, minutes] = time.split(':').map(Number);
      const dayOfWeek = this.getDayOfWeek(day);
      
      if (dayOfWeek === null) {
        console.error(`Invalid day: ${day}`);
        return false;
      }

      console.log(`Creating notification for ${habit.name} on day ${day} (${dayOfWeek}) at ${hours}:${minutes}`);

      // Calculate next occurrence
      const nextOccurrence = this.getNextOccurrence(dayOfWeek, hours, minutes);
      
      if (nextOccurrence) {
        this.scheduleLocalNotification({
          title: `${habit.icon} Time for: ${habit.name}`,
          message: `It's time to complete your habit: ${habit.name}`,
          date: nextOccurrence,
          repeatType: 'week',
        });
        
        console.log(`Successfully scheduled notification for ${habit.name} on ${day} at ${time}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Error scheduling notification for ${habit.name} on ${day} at ${time}:`, error);
      return false;
    }
  }

  private static showLocalNotification(notification: {
    title: string;
    message: string;
  }): void {
    if (Platform.OS === 'android') {
      PushNotification.localNotification({
        channelId: 'micro-remindo',
        title: notification.title,
        message: notification.message,
        playSound: true,
        soundName: 'notification-sound.wav',
        importance: 'high',
        vibrate: true,
        vibration: 300,
      });
    } else {
      // For iOS, show an alert for now
      Alert.alert(notification.title, notification.message);
    }
  }

  private static scheduleLocalNotification(notification: {
    title: string;
    message: string;
    date: Date;
    repeatType?: 'week' | 'day' | 'hour';
  }): void {
    if (Platform.OS === 'android') {
      PushNotification.localNotificationSchedule({
        channelId: 'micro-remindo',
        title: notification.title,
        message: notification.message,
        date: notification.date,
        repeatType: notification.repeatType,
        playSound: true,
        soundName: 'notification-sound.wav',
        importance: 'high',
        vibrate: true,
        vibration: 300,
      });
    } else {
      // For iOS, schedule a simple alert for now
      const timeUntilNotification = notification.date.getTime() - Date.now();
      if (timeUntilNotification > 0) {
        setTimeout(() => {
          Alert.alert(notification.title, notification.message);
        }, timeUntilNotification);
      }
    }
  }

  private static getNextOccurrence(dayOfWeek: number, hours: number, minutes: number): Date | null {
    try {
      const now = new Date();
      const targetTime = new Date();
      targetTime.setHours(hours, minutes, 0, 0);
      
      // Calculate days until next occurrence
      const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const targetDay = dayOfWeek === 7 ? 0 : dayOfWeek; // Convert to 0-based
      
      let daysUntilTarget = targetDay - currentDay;
      if (daysUntilTarget <= 0) {
        daysUntilTarget += 7; // Next week
      }
      if (daysUntilTarget === 0 && now > targetTime) {
        daysUntilTarget = 7; // Next week if time has passed today
      }
      
      const nextOccurrence = new Date(now);
      nextOccurrence.setDate(now.getDate() + daysUntilTarget);
      nextOccurrence.setHours(hours, minutes, 0, 0);
      
      return nextOccurrence;
    } catch (error) {
      console.error('Error calculating next occurrence:', error);
      return null;
    }
  }

  private static getDayOfWeek(day: string): number | null {
    const dayMap: { [key: string]: number } = {
      'S': 1, // Sunday (1-based for consistency)
      'M': 2, // Monday
      'T': 3, // Tuesday
      'W': 4, // Wednesday
      'R': 5, // Thursday
      'F': 6, // Friday
      'A': 7, // Saturday
    };
    
    const result = dayMap[day];
    if (result === undefined) {
      console.error(`Unknown day key: ${day}`);
      return null;
    }
    return result;
  }
} 