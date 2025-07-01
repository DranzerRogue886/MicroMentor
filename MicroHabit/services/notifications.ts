import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Habit, DayNotification } from '../types';
import { StorageService } from './storage';

// Configure notification behavior for Expo Go SDK 53
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  static async initialize(): Promise<void> {
    try {
      console.log('Requesting notification permissions...');
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        console.log('Requesting permissions...');
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      console.log(`New permission status: ${finalStatus}`);
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get notification permissions!');
        return;
      }

      if (Platform.OS === 'android') {
        console.log('Setting up Android notification channel...');
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Micro-remindo',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          sound: 'notification-sound.wav',
        });
      }

      console.log('Notification permissions granted and configured');
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }

  static async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  static async sendImmediateTestNotification(): Promise<void> {
    try {
      console.log('Sending immediate test notification...');
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔔 Immediate Test',
          body: 'This is an immediate test notification from Micro-remindo!',
          data: { type: 'immediate_test' },
          sound: Platform.OS === 'ios' ? 'default' : true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          vibrate: [0, 250, 250, 250],
        },
        trigger: null, // Immediate
      });
      console.log('Immediate test notification sent');
    } catch (error) {
      console.error('Error sending immediate test notification:', error);
    }
  }

  static async sendScheduledTestNotification(): Promise<void> {
    try {
      console.log('Sending scheduled test notification (5 seconds)...');
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '⏰ Scheduled Test',
          body: 'This is a scheduled test notification from Micro-remindo!',
          data: { type: 'scheduled_test' },
          sound: Platform.OS === 'ios' ? 'default' : true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          vibrate: [0, 250, 250, 250],
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 5,
        },
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
      for (const [day, dayNotification] of Object.entries(habit.dayNotifications)) {
        if (dayNotification.times && dayNotification.times.length > 0) {
          console.log(`Processing notifications for day: ${day}`);
          
          for (const time of dayNotification.times) {
            const notificationId = await this.scheduleNotification(habit, day, time);
            if (notificationId) {
              scheduledCount++;
            }
          }
        }
      }
      
      console.log(`Scheduled ${scheduledCount} notifications for habit: ${habit.name}`);
      
      // Log current scheduled notifications for debugging
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      console.log(`Total scheduled notifications: ${scheduledNotifications.length}`);
    } catch (error) {
      console.error(`Error scheduling notifications for habit ${habit.name}:`, error);
    }
  }

  static async cancelNotificationsForHabit(habitId: string): Promise<void> {
    try {
      console.log(`Canceling notifications for habit: ${habitId}`);
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      
      for (const notification of scheduledNotifications) {
        if (notification.content.data?.habitId === habitId) {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
      }
    } catch (error) {
      console.error(`Error canceling notifications for habit ${habitId}:`, error);
    }
  }

  private static async scheduleNotification(habit: Habit, day: string, time: string): Promise<string | null> {
    try {
      const [hours, minutes] = time.split(':').map(Number);
      const dayOfWeek = this.getDayOfWeek(day);
      
      if (dayOfWeek === null) {
        console.error(`Invalid day: ${day}`);
        return null;
      }

      console.log(`Creating notification for ${habit.name} on day ${day} (${dayOfWeek}) at ${hours}:${minutes}`);

      // Use different trigger types for different platforms
      let trigger: Notifications.NotificationTriggerInput;
      
      if (Platform.OS === 'ios') {
        // iOS supports calendar triggers
        trigger = {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour: hours,
          minute: minutes,
          weekday: dayOfWeek,
          repeats: true,
        };
      } else {
        // Android workaround for Expo Go SDK 53
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
        
        const secondsUntilNext = Math.floor((nextOccurrence.getTime() - now.getTime()) / 1000);
        
        console.log(`Scheduling for Android: ${daysUntilTarget} days from now, ${secondsUntilNext} seconds`);
        
        trigger = {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: secondsUntilNext,
          repeats: false, // We'll handle repeating manually
        };
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `${habit.icon} Time for: ${habit.name}`,
          body: `It's time to complete your habit: ${habit.name}`,
          data: { habitId: habit.id, day, time, platform: Platform.OS },
          sound: Platform.OS === 'ios' ? 'default' : true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          vibrate: [0, 250, 250, 250],
        },
        trigger,
        identifier: `habit_${habit.id}_${day}_${time}`,
      });

      console.log(`Successfully scheduled notification for ${habit.name} on ${day} at ${time} (ID: ${notificationId})`);
      return notificationId;
    } catch (error) {
      console.error(`Error scheduling notification for ${habit.name} on ${day} at ${time}:`, error);
      return null;
    }
  }

  private static async rescheduleAndroidNotification(habitId: string, day: string, time: string): Promise<void> {
    try {
      // Get the habit from storage
      const habits = await StorageService.getHabits();
      const habit = habits.find((h: Habit) => h.id === habitId);
      
      if (!habit) {
        console.log(`Habit not found for rescheduling: ${habitId}`);
        return;
      }

      // Schedule for next week
      const [hours, minutes] = time.split(':').map(Number);
      const dayOfWeek = this.getDayOfWeek(day);
      
      if (dayOfWeek === null) return;

      const now = new Date();
      const nextWeek = new Date(now);
      nextWeek.setDate(now.getDate() + 7); // Next week
      nextWeek.setHours(hours, minutes, 0, 0);
      
      const secondsUntilNext = Math.floor((nextWeek.getTime() - now.getTime()) / 1000);
      
      if (secondsUntilNext > 0) {
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: `${habit.icon} Time for: ${habit.name}`,
            body: `It's time to complete your habit: ${habit.name}`,
            data: { habitId, day, time, platform: 'android' },
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
            vibrate: [0, 250, 250, 250],
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: secondsUntilNext,
            repeats: false,
          },
          identifier: `habit_${habitId}_${day}_${time}_${Date.now()}`, // Unique identifier
        });
        
        console.log(`Rescheduled Android notification for ${habit.name} on ${day} at ${time} (ID: ${notificationId})`);
      }
    } catch (error) {
      console.error('Error rescheduling Android notification:', error);
    }
  }

  private static getDayOfWeek(day: string): number | null {
    const dayMap: { [key: string]: number } = {
      'S': 1, // Sunday
      'M': 2, // Monday
      'T': 3, // Tuesday
      'W': 4, // Wednesday
      'R': 5, // Thursday
      'F': 6, // Friday
      'A': 7, // Saturday
    };
    return dayMap[day] || null;
  }
} 