import React, { useState } from 'react';
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
import { Habit } from '../supabase/supabaseService';

interface AddHabitScreenProps {
  navigation: any;
  route: {
    params: {
      onSave: (habitData: Partial<Habit>) => Promise<void>;
    };
  };
}

const AddHabitScreen: React.FC<AddHabitScreenProps> = ({ navigation, route }) => {
  const { onSave } = route.params;
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [icon, setIcon] = useState<string>('📝');
  const [reminderTime, setReminderTime] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const habitIcons = [
    '💧', '🏃‍♂️', '📚', '🧘‍♀️', '🥗', '💤', '🏋️‍♂️', '🎯',
    '🌱', '📝', '🎨', '🎵', '🧠', '💪', '🌟', '🔥'
  ];

  const handleSave = async (): Promise<void> => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        icon,
        reminder_time: reminderTime,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to save habit');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (): void => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add New Habit</Text>
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

        <View style={styles.form}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Habit Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Drink Water, Exercise, Read"
              value={name}
              onChangeText={setName}
              maxLength={50}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your habit..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              maxLength={200}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose an Icon</Text>
            <View style={styles.iconGrid}>
              {habitIcons.map((iconOption) => (
                <TouchableOpacity
                  key={iconOption}
                  style={[
                    styles.iconOption,
                    icon === iconOption && styles.iconOptionSelected
                  ]}
                  onPress={() => setIcon(iconOption)}
                >
                  <Text style={styles.iconText}>{iconOption}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reminder Time (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 09:00, 18:30"
              value={reminderTime}
              onChangeText={setReminderTime}
              keyboardType="numeric"
            />
            <Text style={styles.hintText}>
              Use 24-hour format (HH:MM)
            </Text>
          </View>
        </View>
      </ScrollView>
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
  form: {
    padding: 20,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
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
  iconOptionSelected: {
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
});

export default AddHabitScreen; 