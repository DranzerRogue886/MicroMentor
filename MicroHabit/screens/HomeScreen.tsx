import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Habit } from '../types';
import { StorageService } from '../services/storage';
import { NotificationService } from '../services/notifications';
import HabitCard from '../components/HabitCard';
import AchievementModal from '../components/AchievementModal';
import { HabitUtils } from '../utils/habitUtils';
import { spacing, fontSizes, borderRadius, responsiveSize } from '../utils/responsive';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<any>(null);

  useEffect(() => {
    loadHabits();
    setupNotifications();
  }, []);

  const setupNotifications = async () => {
    try {
      await NotificationService.requestPermissions();
    } catch (error) {
      console.error('Failed to setup notifications:', error);
    }
  };

  const loadHabits = async () => {
    try {
      const storedHabits = await StorageService.getHabits();
      setHabits(storedHabits);
    } catch (error) {
      console.error('Failed to load habits:', error);
      Alert.alert('Error', 'Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadHabits();
    setRefreshing(false);
  };

  const handleCheckIn = (updatedHabit: Habit) => {
    setHabits(prevHabits =>
      prevHabits.map(habit =>
        habit.id === updatedHabit.id ? updatedHabit : habit
      )
    );
  };

  const handleEdit = (habit: Habit) => {
    navigation.navigate('AddHabit', { habit });
  };

  const handleDelete = async (habitId: string) => {
    try {
      await StorageService.deleteHabit(habitId);
      await NotificationService.cancelHabitNotifications(habitId);
      setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habitId));
    } catch (error) {
      console.error('Failed to delete habit:', error);
      Alert.alert('Error', 'Failed to delete habit');
    }
  };

  const handleAchievement = (achievement: any) => {
    setCurrentAchievement(achievement);
    setShowAchievement(true);
  };

  const handleUpdateHabit = async (updatedHabit: Habit) => {
    try {
      await StorageService.updateHabit(updatedHabit);
      setHabits(prevHabits =>
        prevHabits.map(habit =>
          habit.id === updatedHabit.id ? updatedHabit : habit
        )
      );
    } catch (error) {
      console.error('Failed to update habit:', error);
      Alert.alert('Error', 'Failed to update habit');
    }
  };

  const getTotalStreak = () => {
    return habits.reduce((total, habit) => total + habit.streak, 0);
  };

  const getCompletedToday = () => {
    return habits.filter(habit => HabitUtils.isCompletedToday(habit)).length;
  };

  const getCompletionRate = () => {
    if (habits.length === 0) return 0;
    const completed = getCompletedToday();
    return Math.round((completed / habits.length) * 100);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your habits...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>MicroHabit</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddHabit')}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Stats Section */}
        {habits.length > 0 && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{getTotalStreak()}</Text>
              <Text style={styles.statLabel}>Total Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{getCompletedToday()}</Text>
              <Text style={styles.statLabel}>Today</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{getCompletionRate()}%</Text>
              <Text style={styles.statLabel}>Progress</Text>
            </View>
          </View>
        )}

        {/* Habits List */}
        <View style={styles.habitsContainer}>
          {habits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🌱</Text>
              <Text style={styles.emptyStateTitle}>No habits yet</Text>
              <Text style={styles.emptyStateText}>
                Start building your micro-habits by adding your first one!
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => navigation.navigate('AddHabit')}
              >
                <Text style={styles.emptyStateButtonText}>Add Your First Habit</Text>
              </TouchableOpacity>
            </View>
          ) : (
            habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onCheckIn={handleCheckIn}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAchievement={handleAchievement}
                onUpdateHabit={handleUpdateHabit}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Achievement Modal */}
      <AchievementModal
        visible={showAchievement}
        achievement={currentAchievement}
        onClose={() => setShowAchievement(false)}
      />
    </SafeAreaView>
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
    fontSize: fontSizes.lg,
    color: '#64748b',
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSizes.xxxl,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: -1,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    width: responsiveSize(44),
    height: responsiveSize(44),
    borderRadius: responsiveSize(22),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: responsiveSize(4),
    },
    shadowOpacity: 0.3,
    shadowRadius: responsiveSize(8),
    elevation: 6,
  },
  addButtonText: {
    fontSize: fontSizes.xxl,
    color: '#ffffff',
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: responsiveSize(2),
    },
    shadowOpacity: 0.05,
    shadowRadius: responsiveSize(4),
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  statNumber: {
    fontSize: fontSizes.xxl,
    fontWeight: '800',
    color: '#3b82f6',
    marginBottom: responsiveSize(4),
  },
  statLabel: {
    fontSize: fontSizes.sm,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  habitsContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: responsiveSize(80),
    paddingHorizontal: spacing.xl,
  },
  emptyStateIcon: {
    fontSize: responsiveSize(80),
    marginBottom: spacing.lg,
  },
  emptyStateTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: fontSizes.md,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: responsiveSize(24),
    marginBottom: spacing.xl,
  },
  emptyStateButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: spacing.xl,
    paddingVertical: responsiveSize(16),
    borderRadius: borderRadius.lg,
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: responsiveSize(4),
    },
    shadowOpacity: 0.3,
    shadowRadius: responsiveSize(8),
    elevation: 6,
  },
  emptyStateButtonText: {
    fontSize: fontSizes.lg,
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default HomeScreen; 