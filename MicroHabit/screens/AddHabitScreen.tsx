import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Habit } from '../types';
import { StorageService } from '../services/storage';
import { spacing, fontSizes, borderRadius, responsiveSize } from '../utils/responsive';

const EMOJIS = [
  '🏃‍♂️', '💧', '📚', '🧘‍♀️', '🥗', '💪', '😴', '🧠',
  '🎯', '🌟', '🔥', '💎', '🌱', '🌈', '⚡', '🎨',
  '🏋️‍♂️', '🚴‍♀️', '🏊‍♂️', '🎵', '✍️', '🧹', '🌿', '☀️',
  '🌙', '🍎', '🥤', '📝', '🎪', '🎭', '🎪', '🎨'
];

const AddHabitScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🏃‍♂️');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const habit = route.params?.habit;

  useEffect(() => {
    if (habit) {
      setIsEditing(true);
      setName(habit.name);
      setSelectedEmoji(habit.icon);
    }
  }, [habit]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    setLoading(true);

    try {
      if (isEditing && habit) {
        // Update existing habit
        const updatedHabit: Habit = {
          ...habit,
          name: name.trim(),
          icon: selectedEmoji,
          updatedAt: new Date().toISOString(),
        };
        await StorageService.updateHabit(updatedHabit);
        Alert.alert('Success', 'Habit updated successfully!');
      } else {
        // Create new habit
        const newHabit: Habit = {
          id: Date.now().toString(),
          name: name.trim(),
          icon: selectedEmoji,
          streak: 0,
          longestStreak: 0,
          history: {},
          dayNotifications: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await StorageService.addHabit(newHabit);
        Alert.alert('Success', 'Habit created successfully!');
      }

      navigation.goBack();
    } catch (error) {
      console.error('Failed to save habit:', error);
      Alert.alert('Error', 'Failed to save habit');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!habit) return;
    
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
              await StorageService.deleteHabit(habit.id);
              Alert.alert('Success', 'Habit deleted successfully!');
              navigation.goBack();
            } catch (error) {
              console.error('Failed to delete habit:', error);
              Alert.alert('Error', 'Failed to delete habit');
            }
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{isEditing ? 'Edit Habit' : 'New Habit'}</Text>
          <TouchableOpacity 
            onPress={handleSave} 
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            disabled={loading}
          >
            <Text style={[styles.saveButtonText, loading && styles.saveButtonTextDisabled]}>
              {loading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Habit Icon Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose an Icon</Text>
            <View style={styles.emojiGrid}>
              {EMOJIS.map((emoji, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.emojiButton,
                    selectedEmoji === emoji && styles.selectedEmojiButton,
                  ]}
                  onPress={() => setSelectedEmoji(emoji)}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Habit Name Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Habit Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Drink water, Read 10 pages, Exercise..."
              placeholderTextColor="#94a3b8"
              maxLength={50}
              autoFocus={!isEditing}
            />
            <Text style={styles.characterCount}>{name.length}/50</Text>
          </View>

          {/* Preview */}
          {name.trim() && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preview</Text>
              <View style={styles.previewCard}>
                <Text style={styles.previewIcon}>{selectedEmoji}</Text>
                <Text style={styles.previewName}>{name.trim()}</Text>
              </View>
            </View>
          )}

          {/* Delete Button (only for editing) */}
          {isEditing && (
            <View style={styles.section}>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Delete Habit</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  backButtonText: {
    fontSize: fontSizes.md,
    color: '#64748b',
    fontWeight: '600',
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  saveButtonText: {
    fontSize: fontSizes.md,
    color: '#ffffff',
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: '#d1d5db',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  section: {
    marginTop: spacing.xxl,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: spacing.lg,
    letterSpacing: 0.5,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: responsiveSize(12),
  },
  emojiButton: {
    width: responsiveSize(60),
    height: responsiveSize(60),
    borderRadius: borderRadius.lg,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: responsiveSize(2),
    },
    shadowOpacity: 0.05,
    shadowRadius: responsiveSize(4),
    elevation: 2,
  },
  selectedEmojiButton: {
    borderColor: '#3b82f6',
    backgroundColor: '#dbeafe',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.3,
    elevation: 4,
  },
  emojiText: {
    fontSize: responsiveSize(28),
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: responsiveSize(16),
    fontSize: fontSizes.lg,
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: responsiveSize(2),
    },
    shadowOpacity: 0.05,
    shadowRadius: responsiveSize(4),
    elevation: 2,
  },
  characterCount: {
    fontSize: fontSizes.sm,
    color: '#64748b',
    textAlign: 'right',
    marginTop: spacing.sm,
    fontWeight: '500',
  },
  previewCard: {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: responsiveSize(2),
    },
    shadowOpacity: 0.05,
    shadowRadius: responsiveSize(4),
    elevation: 2,
  },
  previewIcon: {
    fontSize: responsiveSize(40),
    marginRight: spacing.lg,
  },
  previewName: {
    fontSize: fontSizes.xl,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    borderRadius: borderRadius.lg,
    paddingVertical: responsiveSize(16),
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: {
      width: 0,
      height: responsiveSize(4),
    },
    shadowOpacity: 0.3,
    shadowRadius: responsiveSize(8),
    elevation: 6,
  },
  deleteButtonText: {
    fontSize: fontSizes.lg,
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default AddHabitScreen; 