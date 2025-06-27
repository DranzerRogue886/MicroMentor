import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface TimePickerProps {
  value: string;
  onTimeChange: (time: string) => void;
  placeholder?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onTimeChange,
  placeholder = 'Set time',
}) => {
  // Initialize state from value prop or use empty state
  const getInitialTime = () => {
    if (value) {
      const [hour, minute] = value.split(':').map(Number);
      if (!isNaN(hour) && !isNaN(minute)) {
        return { hour, minute };
      }
    }
    return { hour: 0, minute: 0 }; // Default to 00:00 instead of 09:00
  };

  const [selectedHour, setSelectedHour] = useState(getInitialTime().hour);
  const [selectedMinute, setSelectedMinute] = useState(getInitialTime().minute);
  const [showPicker, setShowPicker] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  // Parse initial value and update state when value prop changes
  useEffect(() => {
    if (value) {
      const [hour, minute] = value.split(':').map(Number);
      if (!isNaN(hour) && !isNaN(minute)) {
        setSelectedHour(hour);
        setSelectedMinute(minute);
      }
    } else {
      // Reset to default when value is cleared
      setSelectedHour(0);
      setSelectedMinute(0);
    }
  }, [value]);

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleHourSelect = (hour: number) => {
    setSelectedHour(hour);
    triggerHaptic();
    const timeString = `${hour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    onTimeChange(timeString);
  };

  const handleMinuteSelect = (minute: number) => {
    setSelectedMinute(minute);
    triggerHaptic();
    const timeString = `${selectedHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    onTimeChange(timeString);
  };

  const handleDone = () => {
    // Save the current selected time when Done is pressed
    const timeString = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    onTimeChange(timeString);
    setShowPicker(false);
  };

  const formatDisplayTime = () => {
    if (!value) return placeholder;
    return `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setShowPicker(true)}
      >
        <Text style={[styles.timeButtonText, !value && styles.placeholderText]}>
          {formatDisplayTime()}
        </Text>
        <Text style={styles.timeButtonIcon}>⏰</Text>
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Set Reminder Time</Text>
              <TouchableOpacity
                style={styles.doneButton}
                onPress={handleDone}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pickerContent}>
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Hour</Text>
                <View style={styles.pickerWrapper}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.pickerScrollContent}
                    snapToInterval={50}
                    decelerationRate="fast"
                    bounces={false}
                    scrollEventThrottle={16}
                  >
                    {hours.map((hour) => (
                      <TouchableOpacity
                        key={hour}
                        style={[
                          styles.pickerItem,
                          selectedHour === hour && styles.selectedItem,
                        ]}
                        onPress={() => handleHourSelect(hour)}
                      >
                        <Text style={[
                          styles.pickerItemText,
                          selectedHour === hour && styles.selectedItemText,
                        ]}>
                          {hour.toString().padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <View style={styles.pickerSelection} pointerEvents="none" />
                </View>
              </View>

              <View style={styles.pickerSeparator}>
                <Text style={styles.pickerSeparatorText}>:</Text>
              </View>

              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Minute</Text>
                <View style={styles.pickerWrapper}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.pickerScrollContent}
                    snapToInterval={50}
                    decelerationRate="fast"
                    bounces={false}
                    scrollEventThrottle={16}
                  >
                    {minutes.map((minute) => (
                      <TouchableOpacity
                        key={minute}
                        style={[
                          styles.pickerItem,
                          selectedMinute === minute && styles.selectedItem,
                        ]}
                        onPress={() => handleMinuteSelect(minute)}
                      >
                        <Text style={[
                          styles.pickerItemText,
                          selectedMinute === minute && styles.selectedItemText,
                        ]}>
                          {minute.toString().padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <View style={styles.pickerSelection} pointerEvents="none" />
                </View>
              </View>
            </View>

            {/* Current Selected Time Display */}
            <View style={styles.currentTimeDisplay}>
              <Text style={styles.currentTimeLabel}>Selected Time:</Text>
              <Text style={styles.currentTimeText}>
                {selectedHour.toString().padStart(2, '0')}:{selectedMinute.toString().padStart(2, '0')}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                onTimeChange('');
                setShowPicker(false);
              }}
            >
              <Text style={styles.clearButtonText}>Clear Reminder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  timeButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeButtonText: {
    fontSize: 16,
    color: '#1f2937',
  },
  placeholderText: {
    color: '#9ca3af',
  },
  timeButtonIcon: {
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    width: screenWidth - 40,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  pickerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  doneButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  doneButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  pickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  pickerColumn: {
    alignItems: 'center',
    flex: 1,
  },
  pickerLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  pickerWrapper: {
    height: 300,
    position: 'relative',
  },
  pickerScrollContent: {
    paddingVertical: 125,
  },
  pickerItem: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedItem: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  pickerItemText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  selectedItemText: {
    color: '#3b82f6',
    fontWeight: '700',
  },
  pickerSelection: {
    position: 'absolute',
    top: 125,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  pickerSeparator: {
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  pickerSeparatorText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#3b82f6',
  },
  clearButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  clearButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
  },
  currentTimeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  currentTimeLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 8,
  },
  currentTimeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
});

export default TimePicker; 