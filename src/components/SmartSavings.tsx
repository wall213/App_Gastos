import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/src/store/useAppStore';
import { useThemeColors } from '@/src/hooks/useThemeColors';

export default function SmartSavings() {
  const { theme } = useAppStore();
  const colors = useThemeColors();

  const isDark = theme === 'dark';

  return (
    <View style={[styles.cardBlue, { 
      backgroundColor: isDark ? colors.cardBackground : colors.accent,
      shadowColor: isDark ? colors.background : colors.accent
    }]}>
      <View style={styles.iconContainer}>
        <Ionicons name={isDark ? 'bulb' : 'trending-up'} size={24} color={isDark ? colors.positive : '#ffffff'} />
      </View>
      <Text style={[styles.title, { color: isDark ? colors.text : '#ffffff' }]}>
        SMART SAVINGS
      </Text>
      <Text style={[styles.desc, { color: isDark ? colors.textSecondary : 'rgba(255, 255, 255, 0.9)' }]}>
        You could save <Text style={{ color: colors.positive, fontWeight: 'bold' }}>$420</Text> this month by optimizing recurring subscriptions in your <Text style={{ textDecorationLine: 'underline' }}>Personal</Text> category.
      </Text>
      <TouchableOpacity style={[styles.insightsBtn, { backgroundColor: colors.accentSecondary }]}>
        <Text style={[styles.insightsBtnText, { color: isDark ? colors.textSecondary : colors.accent }]}>
          Review Insights
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardBlue: {
    backgroundColor: '#3d5afe',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#3d5afe',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
    lineHeight: 20,
  },
  insightsBtn: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  insightsBtnText: {
    color: '#3d5afe',
    fontWeight: '600',
    fontSize: 16,
  },
});
