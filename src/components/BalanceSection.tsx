import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/useAppStore';
import { useThemeColors } from '@/src/hooks/useThemeColors';

export default function BalanceSection() {
  const { balance, growth } = useAppStore();
  const colors = useThemeColors();

  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(balance);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>TOTAL PORTFOLIO VALUE</Text>
      <View style={styles.amountWrapper}>
        <Text style={[styles.amount, { color: colors.text }]}>{formattedBalance}</Text>
        <View style={[styles.growthBadge, { backgroundColor: colors.growthBadgeBg }]}>
          <Ionicons name='arrow-up' size={14} color={colors.positive} />
          <Text style={[styles.growthText, { color: colors.positiveText }]}>{growth}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  label: {
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 8,
  },
  amountWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 2,
  },
  growthText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
