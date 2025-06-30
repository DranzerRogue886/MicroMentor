import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, NotificationSettings } from '../types';

const STORAGE_KEYS = {
  HABITS: 'microhabit_habits',
  NOTIFICATION_SETTINGS: 'microhabit_notification_settings',
};

export class StorageService {
  // Migration function to remove reminderTime from existing habits
  private static migrateHabits(habits: any[]): Habit[] {
    return habits.map(habit => {
      const { reminderTime, ...migratedHabit } = habit;
      return {
        ...migratedHabit,
        dayNotifications: migratedHabit.dayNotifications || [],
      } as Habit;
    });
  }

  // Habits
  static async getHabits(): Promise<Habit[]> {
    try {
      const habitsJson = await AsyncStorage.getItem(STORAGE_KEYS.HABITS);
      if (habitsJson) {
        const habits = JSON.parse(habitsJson);
        // Migrate existing habits to remove reminderTime
        const migratedHabits = this.migrateHabits(habits);
        // Save migrated habits back to storage
        await this.saveHabits(migratedHabits);
        return migratedHabits;
      }
      return [];
    } catch (error) {
      console.error('Error loading habits:', error);
      return [];
    }
  }

  static async saveHabits(habits: Habit[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  }

  static async addHabit(habit: Habit): Promise<void> {
    try {
      const habits = await this.getHabits();
      habits.push(habit);
      await this.saveHabits(habits);
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  }

  static async updateHabit(updatedHabit: Habit): Promise<void> {
    try {
      const habits = await this.getHabits();
      const index = habits.findIndex(habit => habit.id === updatedHabit.id);
      if (index !== -1) {
        habits[index] = updatedHabit;
        await this.saveHabits(habits);
      }
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  }

  static async deleteHabit(habitId: string): Promise<void> {
    try {
      const habits = await this.getHabits();
      const filteredHabits = habits.filter(habit => habit.id !== habitId);
      await this.saveHabits(filteredHabits);
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  }

  // Notification Settings
  static async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_SETTINGS);
      return settingsJson ? JSON.parse(settingsJson) : { enabled: true, permissionGranted: false };
    } catch (error) {
      console.error('Error loading notification settings:', error);
      return { enabled: true, permissionGranted: false };
    }
  }

  static async saveNotificationSettings(settings: NotificationSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }
} 