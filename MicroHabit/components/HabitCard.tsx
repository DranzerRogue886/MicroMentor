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

interface HabitCardProps {
  habit: Habit;
  onCheckIn: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onAchievement: (achievement: any) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onCheckIn,
  onEdit,
  onDelete,
  onAchievement,
}) => {
  const [scaleValue] = useState(new Animated.Value(1));
  const [loading, setLoading] = useState(false);
  
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

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity onLongPress={handleLongPress} style={styles.header}>
        <View style={styles.habitInfo}>
          <Text style={styles.icon}>{habit.icon}</Text>
          <View style={styles.textContainer}>
            <Text style={styles.name}>{habit.name}</Text>
            {habit.reminderTime && (
              <Text style={styles.reminderTime}>
                Reminder: {HabitUtils.formatTime(habit.reminderTime)}
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.streakContainer}>
          <Text style={styles.streakEmoji}>
            {HabitUtils.getStreakEmoji(habit.streak)}
          </Text>
          <Text style={styles.streakText}>{habit.streak}</Text>
        </View>
      </TouchableOpacity>

      {/* History Bar */}
      <View style={styles.historyContainer}>
        <Text style={styles.historyLabel}>Last 7 days</Text>
        <View style={styles.historyBar}>
          {history.map((completed, index) => (
            <View
              key={index}
              style={[
                styles.historyDot,
                completed ? styles.completedDot : styles.missedDot,
              ]}
            />
          ))}
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  reminderTime: {
    fontSize: 14,
    color: '#6b7280',
  },
  streakContainer: {
    alignItems: 'center',
  },
  streakEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  streakText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
  },
  historyContainer: {
    marginBottom: 16,
  },
  historyLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  historyBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  completedDot: {
    backgroundColor: '#10b981',
  },
  missedDot: {
    backgroundColor: '#e5e7eb',
  },
  completionRate: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  checkInButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  completedButton: {
    backgroundColor: '#10b981',
  },
  loadingButton: {
    backgroundColor: '#9ca3af',
  },
  checkInText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  completedText: {
    color: '#ffffff',
  },
  streakMessage: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default HabitCard; 