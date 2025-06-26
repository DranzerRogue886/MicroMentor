import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { signOut } from '../supabase/supabaseConfig';
import { 
  getUserHabits, 
  addHabit, 
  updateHabit, 
  deleteHabit, 
  checkInHabit,
  subscribeToHabits,
  Habit 
} from '../supabase/supabaseService';
import HabitCard from '../components/HabitCard';

interface HomeScreenProps {
  navigation: any;
  route: {
    params: {
      isAdmin: boolean;
    };
  };
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  const { isAdmin } = route.params;
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  useEffect(() => {
    if (isAdmin) {
      // For admin, use mock data
      setHabits([
        {
          id: '1',
          user_id: 'admin',
          name: 'Drink Water',
          icon: '💧',
          description: 'Stay hydrated',
          reminder_time: '09:00',
          streak: 5,
          longest_streak: 7,
          history: { '2024-01-01': true, '2024-01-02': true },
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: '2',
          user_id: 'admin',
          name: 'Exercise',
          icon: '🏃‍♂️',
          description: 'Daily workout',
          reminder_time: '18:00',
          streak: 3,
          longest_streak: 10,
          history: { '2024-01-01': true },
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        }
      ]);
      setLoading(false);
    } else {
      // For regular users, load from Supabase
      loadHabits();
    }
  }, [isAdmin]);

  const loadHabits = async (): Promise<void> => {
    try {
      // For now, use a mock user ID - in real app, get from auth
      const userHabits = await getUserHabits('mock-user-id');
      setHabits(userHabits);
    } catch (error) {
      console.error('Error loading habits:', error);
      Alert.alert('Error', 'Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHabit = async (habitData: Partial<Habit>): Promise<void> => {
    try {
      if (isAdmin) {
        // Mock habit for admin
        const newHabit: Habit = {
          id: Date.now().toString(),
          user_id: 'admin',
          name: habitData.name || '',
          icon: habitData.icon || '📝',
          description: habitData.description || '',
          reminder_time: habitData.reminder_time || '',
          streak: 0,
          longest_streak: 0,
          history: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setHabits([...habits, newHabit]);
      } else {
        // Real habit for Supabase users
        const newHabit = await addHabit({
          user_id: 'mock-user-id',
          name: habitData.name || '',
          icon: habitData.icon || '📝',
          description: habitData.description || '',
          reminder_time: habitData.reminder_time || '',
          streak: 0,
          longest_streak: 0,
          history: {},
        });
        setHabits([...habits, newHabit]);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to add habit');
    }
  };

  const handleEditHabit = async (habitData: Partial<Habit>): Promise<void> => {
    try {
      if (isAdmin) {
        // Mock update for admin
        const updatedHabits = habits.map(habit => 
          habit.id === editingHabit!.id ? { ...habit, ...habitData } : habit
        );
        setHabits(updatedHabits);
      } else {
        // Real update for Supabase users
        await updateHabit(editingHabit!.id, habitData);
        await loadHabits();
      }
      setEditingHabit(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to update habit');
    }
  };

  const handleDeleteHabit = async (habitId: string): Promise<void> => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (isAdmin) {
                // Mock delete for admin
                setHabits(habits.filter(habit => habit.id !== habitId));
              } else {
                // Real delete for Supabase users
                await deleteHabit(habitId);
                await loadHabits();
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete habit');
            }
          },
        },
      ]
    );
  };

  const handleCheckIn = async (habitId: string): Promise<void> => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      if (isAdmin) {
        // Mock check-in for admin
        const updatedHabits = habits.map(habit => {
          if (habit.id === habitId) {
            const history = { ...habit.history, [today]: true };
            const newStreak = habit.streak + 1;
            const longestStreak = Math.max(habit.longest_streak, newStreak);
            return { ...habit, history, streak: newStreak, longest_streak: longestStreak };
          }
          return habit;
        });
        setHabits(updatedHabits);
      } else {
        // Real check-in for Supabase users
        await checkInHabit(habitId, today);
        await loadHabits();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to check in habit');
    }
  };

  const handleLogout = async (): Promise<void> => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              if (isAdmin) {
                // Admin logout handled by parent component
                navigation.navigate('Login');
              } else {
                await signOut();
                navigation.navigate('Login');
              }
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading habits...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Habits</Text>
        {isAdmin && (
          <View style={styles.adminBadge}>
            <Text style={styles.adminText}>🔐 Admin</Text>
          </View>
        )}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.habitsList}>
        {habits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No habits yet</Text>
            <Text style={styles.emptySubtitle}>Start building your daily routines</Text>
          </View>
        ) : (
          habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onCheckIn={handleCheckIn}
              onEdit={() => setEditingHabit(habit)}
              onDelete={handleDeleteHabit}
            />
          ))
        )}
      </ScrollView>

      {habits.length < 3 && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddHabit', { onSave: handleAddHabit })}
        >
          <Text style={styles.addButtonText}>+ Add Habit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748b',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  adminBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  adminText: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '600',
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
  habitsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen; 