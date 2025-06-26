import { supabase } from './supabaseConfig';

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  description?: string;
  reminder_time?: string;
  streak: number;
  longest_streak: number;
  history: Record<string, boolean>;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  habit_id: string;
  type: string;
  title: string;
  message: string;
  achieved_at: string;
}

// Get user habits
export const getUserHabits = async (userId: string): Promise<Habit[]> => {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching habits:', error);
    throw error;
  }

  return data || [];
};

// Add a new habit
export const addHabit = async (habit: Omit<Habit, 'id' | 'created_at' | 'updated_at'>): Promise<Habit> => {
  const { data, error } = await supabase
    .from('habits')
    .insert([habit])
    .select()
    .single();

  if (error) {
    console.error('Error adding habit:', error);
    throw error;
  }

  return data;
};

// Update a habit
export const updateHabit = async (id: string, updates: Partial<Habit>): Promise<Habit> => {
  const { data, error } = await supabase
    .from('habits')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating habit:', error);
    throw error;
  }

  return data;
};

// Delete a habit
export const deleteHabit = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting habit:', error);
    throw error;
  }
};

// Check in a habit
export const checkInHabit = async (id: string, date: string): Promise<Habit> => {
  // Get current habit
  const { data: habit, error: fetchError } = await supabase
    .from('habits')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching habit:', fetchError);
    throw fetchError;
  }

  // Update history and streak
  const history = { ...habit.history, [date]: true };
  const newStreak = habit.streak + 1;
  const longestStreak = Math.max(habit.longest_streak, newStreak);

  const { data, error } = await supabase
    .from('habits')
    .update({
      history,
      streak: newStreak,
      longest_streak: longestStreak,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error checking in habit:', error);
    throw error;
  }

  return data;
};

// Get achievements
export const getUserAchievements = async (userId: string): Promise<Achievement[]> => {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', userId)
    .order('achieved_at', { ascending: false });

  if (error) {
    console.error('Error fetching achievements:', error);
    throw error;
  }

  return data || [];
};

// Add achievement
export const addAchievement = async (achievement: Omit<Achievement, 'id' | 'achieved_at'>): Promise<Achievement> => {
  const { data, error } = await supabase
    .from('achievements')
    .insert([achievement])
    .select()
    .single();

  if (error) {
    console.error('Error adding achievement:', error);
    throw error;
  }

  return data;
};

// Subscribe to real-time updates
export const subscribeToHabits = (userId: string, callback: (habits: Habit[]) => void) => {
  return supabase
    .channel('habits')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'habits',
        filter: `user_id=eq.${userId}`,
      },
      () => {
        getUserHabits(userId).then(callback);
      }
    )
    .subscribe();
}; 