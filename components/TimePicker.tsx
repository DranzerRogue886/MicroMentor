import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import * as Haptics from 'expo-haptics';

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
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [showPicker, setShowPicker] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  // Parse initial value
  useEffect(() => {
    if (value) {
      const [hour, minute] = value.split(':').map(Number);
      if (!isNaN(hour) && !isNaN(minute)) {
        setSelectedHour(hour);
        setSelectedMinute(minute);
      }
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

  const formatDisplayTime = () => {
    if (!value) return placeholder;
    return `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setShowPicker(!showPicker)}
      >
        <Text style={[styles.timeButtonText, !value && styles.placeholderText]}>
          {formatDisplayTime()}
        </Text>
        <Text style={styles.timeButtonIcon}>⏰</Text>
      </TouchableOpacity>

      {showPicker && (
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Set Reminder Time</Text>
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setShowPicker(false)}
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
      )}
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
  pickerContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginTop: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pickerTitle: {
    fontSize: 18,
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
    marginBottom: 20,
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
    height: 250,
    position: 'relative',
  },
  pickerScrollContent: {
    paddingVertical: 100,
  },
  pickerItem: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedItem: {
    backgroundColor: '#eff6ff',
  },
  pickerItemText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  selectedItemText: {
    color: '#3b82f6',
  },
  pickerSelection: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  pickerSeparator: {
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
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
});

export default TimePicker; 