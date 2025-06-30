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
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Habit, Achievement } from '../types';
import { StorageService } from '../services/storage';
import { NotificationService } from '../services/notifications';
import { HabitUtils } from '../utils/habitUtils';
import HabitCard from '../components/HabitCard';
import AchievementModal from '../components/AchievementModal';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [achievement, setAchievement] = useState<Achievement | null>(null);
  const [showAchievement, setShowAchievement] = useState(false);

  useEffect(() => {
    loadHabits();
    setupNotifications();
  }, []);

  const loadHabits = async () => {
    try {
      const loadedHabits = await StorageService.getHabits();
      setHabits(loadedHabits);
    } catch (error) {
      console.error('Error loading habits:', error);
      Alert.alert('Error', 'Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const setupNotifications = async () => {
    try {
      const hasPermission = await NotificationService.requestPermissions();
      if (!hasPermission) {
        console.log('Notification permissions not granted');
      }
    } catch (error) {
      console.error('Error setting up notifications:', error);
    }
  };

  const handleCheckIn = async (updatedHabit: Habit) => {
    try {
      await StorageService.updateHabit(updatedHabit);
      setHabits(prevHabits =>
        prevHabits.map(habit =>
          habit.id === updatedHabit.id ? updatedHabit : habit
        )
      );
    } catch (error) {
      console.error('Error updating habit:', error);
      Alert.alert('Error', 'Failed to update habit');
    }
  };

  const handleEditHabit = (habit: Habit) => {
    navigation.navigate('AddHabit', { habit });
  };

  const handleDeleteHabit = async (habitId: string) => {
    try {
      await StorageService.deleteHabit(habitId);
      setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habitId));
    } catch (error) {
      console.error('Error deleting habit:', error);
      Alert.alert('Error', 'Failed to delete habit');
    }
  };

  const handleAchievement = (newAchievement: Achievement) => {
    setAchievement(newAchievement);
    setShowAchievement(true);
  };

  const handleCloseAchievement = () => {
    setShowAchievement(false);
    setAchievement(null);
  };

  const getTodayProgress = () => {
    const completedToday = habits.filter(habit => HabitUtils.isCompletedToday(habit)).length;
    return { completed: completedToday, total: habits.length };
  };

  const getTotalStreak = () => {
    return habits.reduce((total, habit) => total + habit.streak, 0);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading your habits...</Text>
      </View>
    );
  }

  const { completed, total } = getTodayProgress();
  const totalStreak = getTotalStreak();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.title}>MicroHabit</Text>
            <Text style={styles.subtitle}>Track your daily progress</Text>
          </View>
          <TouchableOpacity
            style={styles.addNewButton}
            onPress={() => navigation.navigate('AddHabit', {})}
          >
            <Text style={styles.addNewButtonText}>+ Add New Habit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Summary */}
      {habits.length > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressItem}>
            <Text style={styles.progressNumber}>{completed}/{total}</Text>
            <Text style={styles.progressLabel}>Today</Text>
          </View>
          <View style={styles.progressDivider} />
          <View style={styles.progressItem}>
            <Text style={styles.progressNumber}>{totalStreak}</Text>
            <Text style={styles.progressLabel}>Total Streak</Text>
          </View>
        </View>
      )}

      {/* Habits List */}
      <ScrollView style={styles.habitsList} showsVerticalScrollIndicator={false}>
        {habits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No habits yet</Text>
            <Text style={styles.emptyText}>
              Start building your daily routines by adding your first habit!
            </Text>
            <TouchableOpacity
              style={styles.addFirstButton}
              onPress={() => navigation.navigate('AddHabit', {})}
            >
              <Text style={styles.addFirstButtonText}>Add Your First Habit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onCheckIn={handleCheckIn}
              onEdit={handleEditHabit}
              onDelete={handleDeleteHabit}
              onAchievement={handleAchievement}
            />
          ))
        )}
      </ScrollView>

      {/* Achievement Modal */}
      <AchievementModal
        achievement={achievement}
        visible={showAchievement}
        onClose={handleCloseAchievement}
      />
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
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  addNewButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  addNewButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  progressItem: {
    flex: 1,
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 20,
  },
  habitsList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  addFirstButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  addFirstButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen; 