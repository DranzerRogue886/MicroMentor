import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { Habit, DayNotification } from '../types';
import { NotificationService } from '../services/notifications';
import { spacing, fontSizes, borderRadius, responsiveSize, responsiveWidth, responsiveHeight } from '../utils/responsive';

interface DayNotificationModalProps {
  visible: boolean;
  onClose: () => void;
  habit: Habit;
  day: string;
  onSave: (habit: Habit) => void;
}

const DAY_LABELS = {
  'M': 'Monday',
  'Tu': 'Tuesday', 
  'W': 'Wednesday',
  'Th': 'Thursday',
  'F': 'Friday',
  'Sa': 'Saturday',
  'Su': 'Sunday'
};

const { width } = Dimensions.get('window');

const DayNotificationModal: React.FC<DayNotificationModalProps> = ({
  visible,
  onClose,
  habit,
  day,
  onSave,
}) => {
  console.log('DayNotificationModal render:', { visible, day, habitName: habit.name });
  
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);

  useEffect(() => {
    if (visible && habit.dayNotifications) {
      const existingNotification = habit.dayNotifications.find(dn => dn.day === day);
      if (existingNotification) {
        setSelectedTimes([...existingNotification.times]);
      } else {
        setSelectedTimes([]);
      }
    }
  }, [visible, habit, day]);

  const handleAddTime = () => {
    if (selectedTimes.length >= 5) {
      Alert.alert('Maximum Times Reached', 'You can only set up to 5 notification times per day.');
      return;
    }

    const newTime = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;

    // Check if time already exists
    const timeExists = selectedTimes.includes(newTime);

    if (timeExists) {
      Alert.alert('Time Already Added', 'This time has already been added.');
      return;
    }

    setSelectedTimes([...selectedTimes, newTime].sort());
  };

  const handleRemoveTime = (index: number) => {
    const newTimes = selectedTimes.filter((_, i) => i !== index);
    setSelectedTimes(newTimes);
  };

  const handleSave = async () => {
    try {
      // Update habit with new day notifications
      const updatedDayNotifications = habit.dayNotifications ? [...habit.dayNotifications] : [];
      
      // Remove existing notification for this day
      const filteredNotifications = updatedDayNotifications.filter(dn => dn.day !== day);
      
      // Add new notification if times are selected
      if (selectedTimes.length > 0) {
        const newDayNotification: DayNotification = {
          day,
          times: selectedTimes,
        };
        filteredNotifications.push(newDayNotification);
      }

      const updatedHabit: Habit = {
        ...habit,
        dayNotifications: filteredNotifications,
      };

      // Schedule notifications
      await NotificationService.scheduleDayNotifications(updatedHabit);

      onSave(updatedHabit);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to save notification settings.');
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const minute = parseInt(minutes);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Notifications for {day}</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Current Times */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notification Times ({selectedTimes.length}/5)</Text>
            {selectedTimes.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No notifications set for {day}</Text>
              </View>
            ) : (
              <View style={styles.timesList}>
                {selectedTimes.map((time, index) => (
                  <View key={index} style={styles.timeItem}>
                    <Text style={styles.timeText}>
                      {formatTime(time)}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveTime(index)}
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Add New Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add New Time</Text>
            
            <View style={styles.pickerContainer}>
              {/* Hour Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Hour</Text>
                <ScrollView 
                  style={styles.picker} 
                  showsVerticalScrollIndicator={false}
                  snapToInterval={responsiveSize(50)}
                  decelerationRate="fast"
                >
                  {hours.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={[
                        styles.pickerItem,
                        selectedHour === hour && styles.selectedPickerItem,
                      ]}
                      onPress={() => setSelectedHour(hour)}
                    >
                      <Text style={[
                        styles.pickerItemText,
                        selectedHour === hour && styles.selectedPickerItemText,
                      ]}>
                        {hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Minute Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Minute</Text>
                <ScrollView 
                  style={styles.picker} 
                  showsVerticalScrollIndicator={false}
                  snapToInterval={responsiveSize(50)}
                  decelerationRate="fast"
                >
                  {minutes.map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      style={[
                        styles.pickerItem,
                        selectedMinute === minute && styles.selectedPickerItem,
                      ]}
                      onPress={() => setSelectedMinute(minute)}
                    >
                      <Text style={[
                        styles.pickerItemText,
                        selectedMinute === minute && styles.selectedPickerItemText,
                      ]}>
                        {minute.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* AM/PM Indicator */}
              <View style={styles.ampmContainer}>
                <Text style={styles.ampmText}>
                  {selectedHour >= 12 ? 'PM' : 'AM'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.addButton,
                selectedTimes.length >= 5 && styles.disabledButton,
              ]}
              onPress={handleAddTime}
              disabled={selectedTimes.length >= 5}
            >
              <Text style={[
                styles.addButtonText,
                selectedTimes.length >= 5 && styles.disabledButtonText,
              ]}>
                Add {formatTime(`${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`)}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
    paddingTop: responsiveSize(50), // Safe area
  },
  closeButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  closeButtonText: {
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
  saveButtonText: {
    fontSize: fontSizes.md,
    color: '#ffffff',
    fontWeight: '600',
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
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyStateText: {
    fontSize: fontSizes.md,
    color: '#64748b',
    fontStyle: 'italic',
  },
  timesList: {
    gap: spacing.md,
  },
  timeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
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
  timeText: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: '#1e293b',
  },
  removeButton: {
    backgroundColor: '#ef4444',
    borderRadius: responsiveSize(16),
    width: responsiveSize(32),
    height: responsiveSize(32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: fontSizes.xl,
    color: '#ffffff',
    fontWeight: '700',
  },
  pickerContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
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
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  picker: {
    height: responsiveSize(200),
    width: responsiveSize(80),
  },
  pickerItem: {
    height: responsiveSize(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    marginVertical: responsiveSize(2),
  },
  selectedPickerItem: {
    backgroundColor: '#3b82f6',
  },
  pickerItemText: {
    fontSize: fontSizes.lg,
    color: '#64748b',
    fontWeight: '500',
  },
  selectedPickerItemText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  ampmContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  ampmText: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: '#3b82f6',
    backgroundColor: '#dbeafe',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  addButton: {
    backgroundColor: '#10b981',
    borderRadius: borderRadius.lg,
    paddingVertical: responsiveSize(16),
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: {
      width: 0,
      height: responsiveSize(4),
    },
    shadowOpacity: 0.3,
    shadowRadius: responsiveSize(8),
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
    shadowOpacity: 0.2,
  },
  addButtonText: {
    fontSize: fontSizes.lg,
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  disabledButtonText: {
    color: '#d1d5db',
  },
});

export default DayNotificationModal; 