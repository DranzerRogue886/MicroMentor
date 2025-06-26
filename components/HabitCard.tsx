import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { Habit } from '../supabase/supabaseService';

interface HabitCardProps {
  habit: Habit;
  onCheckIn: (habitId: string) => Promise<void>;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => Promise<void>;
}

const HabitCard: React.FC<HabitCardProps> = ({ 
  habit, 
  onCheckIn, 
  onEdit, 
  onDelete 
}) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.history && habit.history[today];

  const handleCheckIn = async (): Promise<void> => {
    if (isCompletedToday) {
      Alert.alert('Already Completed', 'You\'ve already completed this habit today!');
      return;
    }

    setLoading(true);
    try {
      await onCheckIn(habit.id);
    } catch (error) {
      Alert.alert('Error', 'Failed to check in habit');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (): void => {
    setShowOptions(false);
    onEdit(habit);
  };

  const handleDelete = async (): Promise<void> => {
    setShowOptions(false);
    await onDelete(habit.id);
  };

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 7) return '🔥';
    if (streak >= 3) return '💪';
    if (streak >= 1) return '⭐';
    return '🌱';
  };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.habitInfo}>
            <Text style={styles.icon}>{habit.icon}</Text>
            <View style={styles.textContainer}>
              <Text style={styles.name}>{habit.name}</Text>
              {habit.description && (
                <Text style={styles.description}>{habit.description}</Text>
              )}
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.optionsButton}
            onPress={() => setShowOptions(true)}
          >
            <Text style={styles.optionsText}>⋯</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Current Streak</Text>
            <View style={styles.streakContainer}>
              <Text style={styles.streakEmoji}>{getStreakEmoji(habit.streak)}</Text>
              <Text style={styles.streakText}>{habit.streak} days</Text>
            </View>
          </View>
          
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Best Streak</Text>
            <Text style={styles.statValue}>{habit.longest_streak} days</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.checkInButton,
            isCompletedToday && styles.checkInButtonCompleted,
            loading && styles.checkInButtonDisabled
          ]}
          onPress={handleCheckIn}
          disabled={loading || isCompletedToday}
        >
          <Text style={[
            styles.checkInText,
            isCompletedToday && styles.checkInTextCompleted
          ]}>
            {loading ? 'Checking...' : 
             isCompletedToday ? '✓ Completed Today' : 'Check In'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showOptions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOptions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowOptions(false)}
        >
          <View style={styles.optionsModal}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleEdit}
            >
              <Text style={styles.optionText}>✏️ Edit Habit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.optionButton, styles.deleteOption]}
              onPress={handleDelete}
            >
              <Text style={styles.deleteOptionText}>🗑️ Delete Habit</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
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
    alignItems: 'flex-start',
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
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  optionsButton: {
    padding: 8,
    marginLeft: 8,
  },
  optionsText: {
    fontSize: 20,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  checkInButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  checkInButtonCompleted: {
    backgroundColor: '#10b981',
  },
  checkInButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  checkInText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  checkInTextCompleted: {
    color: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsModal: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 8,
    marginHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  optionButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
  deleteOption: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  deleteOptionText: {
    fontSize: 16,
    color: '#ef4444',
  },
});

export default HabitCard; 