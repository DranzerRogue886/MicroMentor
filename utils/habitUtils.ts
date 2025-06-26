import dayjs from 'dayjs';
import { Habit } from '../types';

export class HabitUtils {
  static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  static getTodayString(): string {
    return dayjs().format('YYYY-MM-DD');
  }

  static isCompletedToday(habit: Habit): boolean {
    const today = this.getTodayString();
    return habit.history[today] || false;
  }

  static calculateStreak(habit: Habit): number {
    const today = dayjs();
    let streak = 0;
    let currentDate = today;

    while (true) {
      const dateString = currentDate.format('YYYY-MM-DD');
      if (habit.history[dateString]) {
        streak++;
        currentDate = currentDate.subtract(1, 'day');
      } else {
        break;
      }
    }

    return streak;
  }

  static checkInHabit(habit: Habit): Habit {
    const today = this.getTodayString();
    const wasCompletedToday = this.isCompletedToday(habit);
    
    if (wasCompletedToday) {
      return habit; // Already completed today
    }

    const updatedHistory = { ...habit.history, [today]: true };
    const newStreak = this.calculateStreak({ ...habit, history: updatedHistory });
    const newLongestStreak = Math.max(habit.longestStreak, newStreak);

    return {
      ...habit,
      history: updatedHistory,
      streak: newStreak,
      longestStreak: newLongestStreak,
      updatedAt: new Date().toISOString(),
    };
  }

  static getHistoryForDays(habit: Habit, days: number = 7): boolean[] {
    const history: boolean[] = [];
    const today = dayjs();

    for (let i = days - 1; i >= 0; i--) {
      const date = today.subtract(i, 'day');
      const dateString = date.format('YYYY-MM-DD');
      history.push(habit.history[dateString] || false);
    }

    return history;
  }

  static getCompletionRate(habit: Habit, days: number = 7): number {
    const history = this.getHistoryForDays(habit, days);
    const completedDays = history.filter(completed => completed).length;
    return Math.round((completedDays / days) * 100);
  }

  static formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  static validateHabitName(name: string): { isValid: boolean; error?: string } {
    if (!name.trim()) {
      return { isValid: false, error: 'Habit name is required' };
    }
    if (name.length > 50) {
      return { isValid: false, error: 'Habit name must be 50 characters or less' };
    }
    return { isValid: true };
  }

  static validateReminderTime(time: string): { isValid: boolean; error?: string } {
    if (!time) {
      return { isValid: true }; // Reminder time is optional
    }
    
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      return { isValid: false, error: 'Please use 24-hour format (HH:MM)' };
    }
    
    return { isValid: true };
  }

  static getStreakEmoji(streak: number): string {
    if (streak >= 100) return '🔥';
    if (streak >= 30) return '🏆';
    if (streak >= 14) return '👑';
    if (streak >= 7) return '💪';
    if (streak >= 3) return '⭐';
    if (streak >= 1) return '🌱';
    return '🌱';
  }

  static getStreakMessage(streak: number): string {
    if (streak === 0) return 'Start your journey today!';
    if (streak === 1) return 'Great start!';
    if (streak < 7) return 'Building momentum!';
    if (streak < 14) return 'You\'re on fire!';
    if (streak < 30) return 'Incredible consistency!';
    if (streak < 100) return 'You\'re a habit master!';
    return 'Legendary!';
  }
} 