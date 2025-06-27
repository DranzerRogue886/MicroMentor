import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Habit, HabitFormData } from '../types';
import { StorageService } from '../services/storage';
import { NotificationService } from '../services/notifications';
import { HabitUtils } from '../utils/habitUtils';
import TimePicker from '../components/TimePicker';

type AddHabitScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddHabit'>;
type AddHabitScreenRouteProp = RouteProp<RootStackParamList, 'AddHabit'>;

interface AddHabitScreenProps {
  navigation: AddHabitScreenNavigationProp;
  route: AddHabitScreenRouteProp;
}

const HABIT_ICONS = [
  '💧', '🏃‍♂️', '📚', '🧘‍♀️', '🥗', '💤', '🏋️‍♂️', '🎯',
  '🌱', '📝', '🎨', '🎵', '🧠', '💪', '🌟', '🔥',
  '🧹', '🚰', '🥤', '🍎', '🚶‍♀️', '🧘‍♂️', '🎪', '🌈'
];

const AddHabitScreen: React.FC<AddHabitScreenProps> = ({ navigation, route }) => {
  const { habit } = route.params;
  const isEditing = !!habit;

  const [formData, setFormData] = useState<HabitFormData>({
    name: '',
    icon: '💧',
    reminderTime: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (habit) {
      setFormData({
        name: habit.name,
        icon: habit.icon,
        reminderTime: habit.reminderTime,
      });
    }
  }, [habit]);

  const handleSave = async () => {
    // Validate form data
    const nameValidation = HabitUtils.validateHabitName(formData.name);
    if (!nameValidation.isValid) {
      Alert.alert('Error', nameValidation.error);
      return;
    }

    const timeValidation = HabitUtils.validateReminderTime(formData.reminderTime);
    if (!timeValidation.isValid) {
      Alert.alert('Error', timeValidation.error);
      return;
    }

    setLoading(true);

    try {
      if (isEditing && habit) {
        // Update existing habit
        const updatedHabit: Habit = {
          ...habit,
          name: formData.name.trim(),
          icon: formData.icon,
          reminderTime: formData.reminderTime,
          updatedAt: new Date().toISOString(),
        };

        await StorageService.updateHabit(updatedHabit);
        
        // Update notification
        if (formData.reminderTime) {
          await NotificationService.cancelHabitReminder(habit.id);
          await NotificationService.scheduleHabitReminder(updatedHabit);
        } else {
          await NotificationService.cancelHabitReminder(habit.id);
        }

        Alert.alert('Success', 'Habit updated successfully!');
      } else {
        // Create new habit
        const newHabit: Habit = {
          id: HabitUtils.generateId(),
          name: formData.name.trim(),
          icon: formData.icon,
          reminderTime: formData.reminderTime,
          streak: 0,
          longestStreak: 0,
          history: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await StorageService.addHabit(newHabit);

        // Schedule notification if reminder time is set
        if (formData.reminderTime) {
          await NotificationService.scheduleHabitReminder(newHabit);
        }

        Alert.alert('Success', 'Habit created successfully!');
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error saving habit:', error);
      Alert.alert('Error', 'Failed to save habit');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: string): string => {
    if (!time) return 'Set reminder time';
    return HabitUtils.formatTime(time);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header - Fixed at top */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {isEditing ? 'Edit Habit' : 'Add New Habit'}
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          disabled={loading}
        >
          <Text style={styles.saveText}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Habit Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habit Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Drink Water, Exercise, Read"
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            maxLength={50}
            autoFocus={!isEditing}
          />
        </View>

        {/* Icon Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose an Icon</Text>
          <View style={styles.iconGrid}>
            {HABIT_ICONS.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconOption,
                  formData.icon === icon && styles.selectedIcon,
                ]}
                onPress={() => setFormData(prev => ({ ...prev, icon }))}
              >
                <Text style={styles.iconText}>{icon}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preview</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewIcon}>{formData.icon}</Text>
              <Text style={styles.previewName}>
                {formData.name || 'Your Habit Name'}
              </Text>
            </View>
            {formData.reminderTime && (
              <Text style={styles.previewReminder}>
                Reminder: {formatTime(formData.reminderTime)}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Time Picker - Fixed at bottom with proper spacing */}
      <View style={styles.timePickerContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Reminder (Optional)</Text>
          <TimePicker
            value={formData.reminderTime}
            onTimeChange={(time) => setFormData(prev => ({ ...prev, reminderTime: time }))}
            placeholder="Set reminder time"
          />
          <Text style={styles.hintText}>
            Use 24-hour format (HH:MM) or leave empty for no reminder
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelText: {
    color: '#6b7280',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  saveText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  selectedIcon: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  iconText: {
    fontSize: 24,
  },
  hintText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  timePickerContainer: {
    padding: 20,
    paddingTop: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  previewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  previewName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  previewReminder: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default AddHabitScreen; 