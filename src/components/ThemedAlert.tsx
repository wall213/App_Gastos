import React from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, 
  Modal, Animated, Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAlertStore } from '@/src/store/useAlertStore';
import { useThemeColors } from '@/src/hooks/useThemeColors';

const { width } = Dimensions.get('window');

export const ThemedAlert = () => {
  const colors = useThemeColors();
  const { visible, title, message, type, buttons, hideAlert } = useAlertStore();

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return { name: 'checkmark-circle', color: '#1E8E3E' };
      case 'error': return { name: 'alert-circle', color: '#FF4444' };
      case 'warning': return { name: 'warning', color: '#FBBC05' };
      default: return { name: 'information-circle', color: colors.accent };
    }
  };

  const iconInfo = getIcon();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={hideAlert}
    >
      <View style={styles.overlay}>
        <View style={[styles.alertBox, { backgroundColor: colors.cardBackground }]}>
          {/* Header Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name={iconInfo.name as any} size={50} color={iconInfo.color} />
          </View>

          {/* Text Content */}
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>

          {/* Buttons Row */}
          <View style={styles.buttonContainer}>
            {buttons.map((btn, index) => {
              const isCancel = btn.style === 'cancel';
              const isDestructive = btn.style === 'destructive';
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    { 
                      backgroundColor: isCancel ? colors.border : (isDestructive ? '#FF4444' : colors.accent),
                      flex: buttons.length > 2 ? 0 : 1 
                    }
                  ]}
                  onPress={() => {
                    hideAlert();
                    if (btn.onPress) btn.onPress();
                  }}
                >
                  <Text style={[
                    styles.buttonText, 
                    { color: isCancel ? colors.text : '#fff' }
                  ]}>
                    {btn.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  alertBox: {
    width: width * 0.85,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
