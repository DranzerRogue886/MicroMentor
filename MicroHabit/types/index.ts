export interface DayNotification {
  day: string; // 'M', 'T', 'W', 'T', 'F', 'S', 'S'
  times: string[]; // Array of times in "HH:MM" format, max 5
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  streak: number;
  longestStreak: number;
  history: Record<string, boolean>;
  dayNotifications: DayNotification[]; // New field for day-based notifications
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
  DayNotificationSettings: { habit: Habit; day: string };
};

export interface HabitFormData {
  name: string;
  icon: string;
} 