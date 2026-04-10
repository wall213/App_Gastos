import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/useAppStore';
import { useThemeColors } from '@/src/hooks/useThemeColors';

export default function BalanceSection() {
  const { balance } = useAppStore();
  const colors = useThemeColors();

  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(balance);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>BALANCE TOTAL</Text>
      <View style={styles.amountWrapper}>
        <Text style={[styles.amount, { color: colors.text }]}>{formattedBalance}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 25,
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
});
