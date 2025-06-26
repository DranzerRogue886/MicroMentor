import { Habit } from '../types';

// Mock notification service for now - we'll implement real notifications later
export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    // For now, return true to avoid blocking the app
    console.log('Notification permissions requested');
    return true;
  }

  static async scheduleHabitReminder(habit: Habit): Promise<string | null> {
    try {
      console.log(`Scheduling notification for habit: ${habit.name} at ${habit.reminderTime}`);
      // Mock implementation - in a real app, this would use expo-notifications
      return `notification_${habit.id}`;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  static async cancelHabitReminder(habitId: string): Promise<void> {
    try {
      console.log(`Canceling notification for habit: ${habitId}`);
      // Mock implementation
    } catch (error) {
      console.error('Error canceling notification:', error);
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