import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { NotificationService } from '../services/notifications';
import { spacing, fontSizes, borderRadius, responsiveSize } from '../utils/responsive';

interface NotificationPermissionModalProps {
  visible: boolean;
  onClose: () => void;
  onPermissionGranted: () => void;
}

const NotificationPermissionModal: React.FC<NotificationPermissionModalProps> = ({
  visible,
  onClose,
  onPermissionGranted,
}) => {
  const [loading, setLoading] = useState(false);

  const handleRequestPermission = async () => {
    setLoading(true);
    try {
      const granted = await NotificationService.requestPermissions();
      if (granted) {
        Alert.alert(
          'Notifications Enabled! 🎉',
          'You\'ll now receive reminders for your habits at the times you set.',
          [
            {
              text: 'Great!',
              onPress: () => {
                onPermissionGranted();
                onClose();
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Permission Denied',
          'You can enable notifications later in your device settings to receive habit reminders.',
          [
            {
              text: 'Maybe Later',
              onPress: onClose,
            },
            {
              text: 'Open Settings',
              onPress: () => {
                // In a real app, you might want to open device settings
                onClose();
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      Alert.alert('Error', 'Failed to request notification permissions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Notifications?',
      'You can always enable notifications later in the app settings.',
      [
        {
          text: 'Enable Later',
          onPress: onClose,
        },
        {
          text: 'Enable Now',
          onPress: handleRequestPermission,
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleSkip}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🔔</Text>
          </View>
          
          <Text style={styles.title}>Stay on Track!</Text>
          <Text style={styles.subtitle}>
            Enable notifications to get gentle reminders for your habits at the perfect times.
          </Text>
          
          <View style={styles.benefitsContainer}>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>⏰</Text>
              <Text style={styles.benefitText}>Custom timing for each day</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🎯</Text>
              <Text style={styles.benefitText}>Never miss a habit again</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>📱</Text>
              <Text style={styles.benefitText}>Gentle, non-intrusive reminders</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.disabledButton]}
              onPress={handleRequestPermission}
              disabled={loading}
            >
              <Text style={[styles.primaryButtonText, loading && styles.disabledButtonText]}>
                {loading ? 'Enabling...' : 'Enable Notifications'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton} onPress={handleSkip}>
              <Text style={styles.secondaryButtonText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    width: '100%',
    maxWidth: responsiveSize(400),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: responsiveSize(8),
    },
    shadowOpacity: 0.15,
    shadowRadius: responsiveSize(20),
    elevation: 12,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: responsiveSize(60),
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: spacing.md,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: responsiveSize(24),
    marginBottom: spacing.xl,
  },
  benefitsContainer: {
    marginBottom: spacing.xxl,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  benefitIcon: {
    fontSize: responsiveSize(24),
    marginRight: spacing.md,
    width: responsiveSize(32),
  },
  benefitText: {
    fontSize: fontSizes.md,
    color: '#475569',
    flex: 1,
    fontWeight: '500',
  },
  buttonContainer: {
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    borderRadius: borderRadius.lg,
    paddingVertical: responsiveSize(16),
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
  disabledButton: {
    backgroundColor: '#9ca3af',
    shadowOpacity: 0.2,
  },
  primaryButtonText: {
    fontSize: fontSizes.lg,
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  disabledButtonText: {
    color: '#d1d5db',
  },
  secondaryButton: {
    backgroundColor: '#f8fafc',
    borderRadius: borderRadius.lg,
    paddingVertical: responsiveSize(16),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryButtonText: {
    fontSize: fontSizes.lg,
    color: '#64748b',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default NotificationPermissionModal; 