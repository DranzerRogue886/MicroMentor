import { Habit, DayNotification } from '../types';

// Mock notification service for now - we'll implement real notifications later
export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    // For now, return true to avoid blocking the app
    console.log('Notification permissions requested');
    return true;
  }

  static async scheduleDayNotifications(habit: Habit): Promise<string[]> {
    try {
      const notificationIds: string[] = [];
      
      if (!habit.dayNotifications) return notificationIds;

      for (const dayNotification of habit.dayNotifications) {
        for (const time of dayNotification.times) {
          console.log(`Scheduling notification for habit: ${habit.name} on ${dayNotification.day} at ${time}`);
          
          // In a real implementation, this would schedule actual notifications
          // For now, we'll just log the notification details
          const notificationId = `notification_${habit.id}_${dayNotification.day}_${time}`;
          notificationIds.push(notificationId);
          
          // Mock notification content
          console.log(`Notification would show: ${habit.icon} Time for: ${habit.name} at ${time}`);
        }
      }
      
      return notificationIds;
    } catch (error) {
      console.error('Error scheduling day notifications:', error);
      return [];
    }
  }

  static async cancelHabitNotifications(habitId: string): Promise<void> {
    try {
      console.log(`Canceling all notifications for habit: ${habitId}`);
      // Mock implementation - would cancel all notifications for this habit
    } catch (error) {
      console.error('Error canceling habit notifications:', error);
    }
  }

  static async cancelAllNotifications(): Promise<void> {
    try {
      console.log('Canceling all notifications');
      // Mock implementation
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  static async getScheduledNotifications(): Promise<any[]> {
    try {
      console.log('Getting scheduled notifications');
      // Mock implementation
      return [];
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }
} 