export interface Habit {
  id: string;
  name: string;
  icon: string;
  reminderTime: string;
  streak: number;
  longestStreak: number;
  history: Record<string, boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  message: string;
  streak: number;
  icon: string;
}

export interface NotificationSettings {
  enabled: boolean;
  permissionGranted: boolean;
}

export type RootStackParamList = {
  Home: undefined;
  AddHabit: { habit?: Habit };
  EditHabit: { habit: Habit };
  Settings: undefined;
};

export interface HabitFormData {
  name: string;
  icon: string;
  reminderTime: string;
} 