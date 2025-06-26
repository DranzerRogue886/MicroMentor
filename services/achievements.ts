import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_day',
    title: 'Getting Started!',
    message: 'You completed your first habit! Keep it up!',
    streak: 1,
    icon: '🌱',
  },
  {
    id: 'three_day',
    title: 'Building Momentum!',
    message: '3-day streak! You\'re building a great habit!',
    streak: 3,
    icon: '⭐',
  },
  {
    id: 'week_streak',
    title: 'Week Warrior!',
    message: '7-day streak! You\'re unstoppable!',
    streak: 7,
    icon: '💪',
  },
  {
    id: 'two_week',
    title: 'Consistency King!',
    message: '14-day streak! You\'re making it a lifestyle!',
    streak: 14,
    icon: '👑',
  },
  {
    id: 'month_streak',
    title: 'Habit Master!',
    message: '30-day streak! You\'ve mastered this habit!',
    streak: 30,
    icon: '🏆',
  },
  {
    id: 'hundred_day',
    title: 'Century Club!',
    message: '100-day streak! You\'re legendary!',
    streak: 100,
    icon: '🔥',
  },
];

export class AchievementService {
  static getAchievementForStreak(streak: number): Achievement | null {
    // Find the highest achievement that matches the current streak
    const achievement = ACHIEVEMENTS
      .filter(a => a.streak <= streak)
      .sort((a, b) => b.streak - a.streak)[0];
    
    return achievement || null;
  }

  static getNextAchievement(streak: number): Achievement | null {
    // Find the next achievement to unlock
    const nextAchievement = ACHIEVEMENTS
      .filter(a => a.streak > streak)
      .sort((a, b) => a.streak - b.streak)[0];
    
    return nextAchievement || null;
  }

  static checkForNewAchievement(oldStreak: number, newStreak: number): Achievement | null {
    // Check if we've unlocked a new achievement
    const oldAchievement = this.getAchievementForStreak(oldStreak);
    const newAchievement = this.getAchievementForStreak(newStreak);
    
    if (newAchievement && (!oldAchievement || newAchievement.streak > oldAchievement.streak)) {
      return newAchievement;
    }
    
    return null;
  }

  static getAchievementProgress(streak: number): { current: number; next: number; percentage: number } {
    const currentAchievement = this.getAchievementForStreak(streak);
    const nextAchievement = this.getNextAchievement(streak);
    
    if (!nextAchievement) {
      return { current: streak, next: streak, percentage: 100 };
    }
    
    const current = currentAchievement ? currentAchievement.streak : 0;
    const next = nextAchievement.streak;
    const percentage = Math.min(100, ((streak - current) / (next - current)) * 100);
    
    return { current, next, percentage };
  }
} 