import { Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Habit, DayNotification } from '../types';
import { StorageService } from './storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Set up notification response handler for recurring notifications
Notifications.addNotificationResponseReceivedListener((response) => {
  console.log('Notification response received:', response);
  
  // Handle recurring notifications
  const data = response.notification.request.content.data;
  if (data && data.habitId && data.day && data.time) {
    // Reschedule the next occurrence
    NotificationService.rescheduleRecurringNotification(
      data.habitId as string,
      data.day as string,
      data.time as string
    );
  }
});

export class NotificationService {
  private static isInitialized = false;

  static async initialize(): Promise<void> {
    try {
      if (this.isInitialized) {
        console.log('Notification service already initialized');
        return;
      }

      console.log('Initializing Expo notification service...');
      
      // Request permissions
      const { status } = await Notifications.requestPermissionsAsync();
      console.log('Notification permission status:', status);
      
      // Note: Push tokens are not available in Expo Go with SDK 53+
      // Local notifications work fine in Expo Go
      console.log('Using local notifications (compatible with Expo Go)');
      
      this.isInitialized = true;
      console.log('Expo notification service initialized successfully');
    } catch (error) {
      console.error('Error initializing notification service:', error);
      // Don't throw the error, just log it so the app can continue
    }
  }

  static async requestPermissions(): Promise<boolean> {
    try {
      console.log('Requesting notification permissions...');
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  static async sendImmediateTestNotification(): Promise<void> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log('Sending immediate test notification...');
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔔 Immediate Test',
          body: 'This is an immediate test notification from Micro-remindo!',
          sound: true,
        },
        trigger: null, // null means send immediately
      });
      
      console.log('Immediate test notification sent');
    } catch (error) {
      console.error('Error sending immediate test notification:', error);
    }
  }

  static async sendScheduledTestNotification(): Promise<void> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log('Sending scheduled test notification (5 seconds)...');
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '⏰ Scheduled Test',
          body: 'This is a scheduled test notification from Micro-remindo!',
          sound: true,
        },
        trigger: {
          seconds: 5,
        } as any,
      });
      
      console.log('Scheduled test notification sent');
    } catch (error) {
      console.error('Error sending scheduled test notification:', error);
    }
  }

  static async scheduleNotificationsForHabit(habit: Habit): Promise<void> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

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
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log(`Canceling notifications for habit: ${habitId}`);
      
      // Get all scheduled notifications
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      
      // Cancel notifications that match this habit ID
      for (const notification of scheduledNotifications) {
        if (notification.content.data?.habitId === habitId) {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
      }
    } catch (error) {
      console.error(`Error canceling notifications for habit ${habitId}:`, error);
    }
  }

  static async getScheduledNotifications(): Promise<any[]> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log('Getting scheduled notifications...');
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      return notifications;
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  private static async scheduleHabitNotification(habit: Habit, day: string, time: string): Promise<boolean> {
    try {
      const [hours, minutes] = time.split(':').map(Number);
      const dayOfWeek = this.getDayOfWeek(day);
      
      console.log(`DEBUG: Scheduling notification for habit "${habit.name}"`);
      console.log(`DEBUG: Day: "${day}", Time: "${time}"`);
      console.log(`DEBUG: Parsed hours: ${hours}, minutes: ${minutes}`);
      console.log(`DEBUG: Day of week: ${dayOfWeek}`);
      
      if (dayOfWeek === null) {
        console.error(`Invalid day: ${day}`);
        return false;
      }

      console.log(`Creating notification for ${habit.name} on day ${day} (${dayOfWeek}) at ${hours}:${minutes}`);

      // Calculate next occurrence
      const nextOccurrence = this.getNextOccurrence(dayOfWeek, hours, minutes);
      
      if (nextOccurrence) {
        // Use date-based trigger instead of calendar trigger for better Expo Go compatibility
        const now = new Date();
        const timeUntilNotification = nextOccurrence.getTime() - now.getTime();
        
        console.log(`DEBUG: Current time: ${now.toLocaleString()}`);
        console.log(`DEBUG: Next occurrence: ${nextOccurrence.toLocaleString()}`);
        console.log(`DEBUG: Time until notification: ${Math.round(timeUntilNotification / 1000 / 60)} minutes`);
        
        if (timeUntilNotification > 0) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `${habit.icon} Time for: ${habit.name}`,
              body: `It's time to complete your habit: ${habit.name}`,
              sound: true,
              data: { habitId: habit.id, day: day, time: time },
            },
            trigger: {
              date: nextOccurrence,
            } as any,
          });
          
          console.log(`Successfully scheduled notification for ${habit.name} on ${day} at ${time} (${Math.round(timeUntilNotification / 1000 / 60)} minutes from now)`);
          return true;
        } else {
          console.log(`Time has already passed for ${habit.name} on ${day} at ${time}`);
          return false;
        }
      }
      
      return false;
    } catch (error) {
      console.error(`Error scheduling notification for ${habit.name} on ${day} at ${time}:`, error);
      return false;
    }
  }

  private static getNextOccurrence(dayOfWeek: number, hours: number, minutes: number): Date | null {
    try {
      const now = new Date();
      const targetTime = new Date();
      targetTime.setHours(hours, minutes, 0, 0);
      
      // Calculate days until next occurrence
      const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const targetDay = dayOfWeek; // Already 0-based
      
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
      
      console.log(`Next occurrence calculated: ${nextOccurrence.toLocaleString()}`);
      return nextOccurrence;
    } catch (error) {
      console.error('Error calculating next occurrence:', error);
      return null;
    }
  }

  private static getDayOfWeek(day: string): number | null {
    // Use 0-based indexing for Expo notifications (0 = Sunday, 1 = Monday, etc.)
    const dayMap: { [key: string]: number } = {
      'S': 0, // Sunday (0-based)
      'M': 1, // Monday
      'T': 2, // Tuesday
      'W': 3, // Wednesday
      'R': 4, // Thursday
      'F': 5, // Friday
      'A': 6, // Saturday
    };
    
    const result = dayMap[day];
    if (result === undefined) {
      console.error(`Unknown day key: ${day}`);
      return null;
    }
    return result;
  }

  static async rescheduleRecurringNotification(habitId: string, day: string, time: string): Promise<void> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log(`Rescheduling notification for habit: ${habitId}`);
      
      // Get the habit from storage to reschedule
      const habits = await StorageService.getHabits();
      const habit = habits.find(h => h.id === habitId);
      
      if (habit) {
        // Cancel existing notifications for this habit
        await this.cancelNotificationsForHabit(habitId);
        
        // Schedule new notification
        await this.scheduleHabitNotification(habit, day, time);
      } else {
        console.error(`Habit not found for rescheduling: ${habitId}`);
      }
    } catch (error) {
      console.error(`Error rescheduling notification for habit ${habitId}:`, error);
    }
  }
} 