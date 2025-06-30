import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';
import { Habit } from '../types';
import { HabitUtils } from '../utils/habitUtils';
import { AchievementService } from '../services/achievements';
import DayNotificationModal from './DayNotificationModal';
import { spacing, fontSizes, borderRadius, responsiveSize } from '../utils/responsive';

interface HabitCardProps {
  habit: Habit;
  onCheckIn: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onAchievement: (achievement: any) => void;
  onUpdateHabit: (habit: Habit) => void;
}

const DAYS = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onCheckIn,
  onEdit,
  onDelete,
  onAchievement,
  onUpdateHabit,
}) => {
  const [scaleValue] = useState(new Animated.Value(1));
  const [loading, setLoading] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  
  const isCompletedToday = HabitUtils.isCompletedToday(habit);
  const history = HabitUtils.getHistoryForDays(habit, 7);
  const completionRate = HabitUtils.getCompletionRate(habit, 7);

  const handleCheckIn = async () => {
    if (isCompletedToday) {
      Alert.alert('Already Completed', 'You\'ve already completed this habit today!');
      return;
    }

    setLoading(true);
    
    // Animate the button
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Check for achievements
    const oldStreak = habit.streak;
    const updatedHabit = HabitUtils.checkInHabit(habit);
    const newAchievement = AchievementService.checkForNewAchievement(oldStreak, updatedHabit.streak);

    onCheckIn(updatedHabit);

    if (newAchievement) {
      setTimeout(() => {
        onAchievement(newAchievement);
      }, 500);
    }

    setLoading(false);
  };

  const handleDayPress = (day: string) => {
    console.log('Day button pressed:', day);
    setSelectedDay(day);
    setShowDayModal(true);
  };

  const handleSaveDayNotifications = (updatedHabit: Habit) => {
    onUpdateHabit(updatedHabit);
  };

  const handleLongPress = () => {
    Alert.alert(
      'Habit Options',
      'What would you like to do?',
      [
        { text: 'Edit', onPress: () => onEdit(habit) },
        { 
          text: 'Delete', 
          onPress: () => {
            Alert.alert(
              'Delete Habit',
              'Are you sure you want to delete this habit? This action cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => onDelete(habit.id) },
              ]
            );
          },
          style: 'destructive' 
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const getDayNotificationCount = (day: string) => {
    const dayNotification = habit.dayNotifications?.find(dn => dn.day === day);
    return dayNotification?.times.length || 0;
  };

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity onLongPress={handleLongPress} style={styles.header}>
        <View style={styles.habitInfo}>
          <Text style={styles.icon}>{habit.icon}</Text>
          <View style={styles.textContainer}>
            <Text style={styles.name}>{habit.name}</Text>
          </View>
        </View>
        
        <View style={styles.streakContainer}>
          <Text style={styles.streakEmoji}>
            {HabitUtils.getStreakEmoji(habit.streak)}
          </Text>
          <Text style={styles.streakText}>{habit.streak}</Text>
        </View>
      </TouchableOpacity>

      {/* Interactive Day Buttons */}
      <View style={styles.historyContainer}>
        <Text style={styles.historyLabel}>Weekly Schedule</Text>
        <View style={styles.dayButtonsContainer}>
          {DAYS.map((day, index) => {
            const isCompleted = history[index];
            const notificationCount = getDayNotificationCount(day);
            const hasNotifications = notificationCount > 0;
            
            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  isCompleted && styles.completedDayButton,
                  hasNotifications && styles.notificationDayButton,
                ]}
                onPress={() => handleDayPress(day)}
                onPressIn={() => console.log('Day button pressed in:', day)}
                activeOpacity={0.6}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              >
                <Text style={[
                  styles.dayButtonText,
                  isCompleted && styles.completedDayButtonText,
                  hasNotifications && styles.notificationDayButtonText,
                ]}>
                  {day}
                </Text>
                {hasNotifications && (
                  <View style={styles.notificationIndicator}>
                    <Text style={styles.notificationCount}>{notificationCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.completionRate}>{completionRate}%</Text>
      </View>

      {/* Check-in Button */}
      <TouchableOpacity
        style={[
          styles.checkInButton,
          isCompletedToday && styles.completedButton,
          loading && styles.loadingButton,
        ]}
        onPress={handleCheckIn}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.checkInText,
          isCompletedToday && styles.completedText,
        ]}>
          {loading ? 'Checking...' : 
           isCompletedToday ? '✓ Completed Today' : '✔ I Did It!'}
        </Text>
      </TouchableOpacity>

      {/* Streak Message */}
      <Text style={styles.streakMessage}>
        {HabitUtils.getStreakMessage(habit.streak)}
      </Text>

      {/* Day Notification Modal */}
      <DayNotificationModal
        visible={showDayModal}
        onClose={() => setShowDayModal(false)}
        habit={habit}
        day={selectedDay}
        onSave={handleSaveDayNotifications}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: responsiveSize(4),
    },
    shadowOpacity: 0.08,
    shadowRadius: responsiveSize(12),
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: responsiveSize(36),
    marginRight: spacing.lg,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: responsiveSize(4),
    letterSpacing: -0.5,
  },
  streakContainer: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  streakEmoji: {
    fontSize: responsiveSize(28),
    marginBottom: responsiveSize(6),
  },
  streakText: {
    fontSize: fontSizes.xxl,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: -0.5,
  },
  historyContainer: {
    marginBottom: spacing.xl,
  },
  historyLabel: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: '#475569',
    marginBottom: spacing.md,
    letterSpacing: 0.5,
  },
  dayButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: responsiveSize(4),
  },
  dayButton: {
    backgroundColor: '#f8fafc',
    borderRadius: borderRadius.md,
    paddingVertical: responsiveSize(8),
    paddingHorizontal: responsiveSize(6),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    minWidth: responsiveSize(32),
    minHeight: responsiveSize(32),
    position: 'relative',
    flex: 1,
    zIndex: 1,
  },
  completedDayButton: {
    backgroundColor: '#dcfce7',
    borderColor: '#22c55e',
  },
  notificationDayButton: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
  },
  dayButtonText: {
    fontSize: responsiveSize(12),
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  completedDayButtonText: {
    color: '#15803d',
  },
  notificationDayButtonText: {
    color: '#1d4ed8',
  },
  notificationIndicator: {
    position: 'absolute',
    top: -responsiveSize(2),
    right: -responsiveSize(2),
    backgroundColor: '#ef4444',
    borderRadius: responsiveSize(8),
    minWidth: responsiveSize(16),
    height: responsiveSize(16),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffffff',
    zIndex: 2,
    pointerEvents: 'none',
  },
  notificationCount: {
    fontSize: responsiveSize(8),
    fontWeight: '800',
    color: '#ffffff',
  },
  completionRate: {
    fontSize: fontSizes.sm,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  checkInButton: {
    backgroundColor: '#3b82f6',
    borderRadius: borderRadius.lg,
    paddingVertical: responsiveSize(18),
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: responsiveSize(4),
    },
    shadowOpacity: 0.3,
    shadowRadius: responsiveSize(8),
    elevation: 6,
  },
  completedButton: {
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
  },
  loadingButton: {
    backgroundColor: '#9ca3af',
    shadowOpacity: 0.2,
  },
  checkInText: {
    color: '#ffffff',
    fontSize: fontSizes.lg,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  completedText: {
    color: '#ffffff',
  },
  streakMessage: {
    fontSize: fontSizes.sm,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});

export default HabitCard; 