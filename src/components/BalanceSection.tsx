import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeColors } from '@/src/hooks/useThemeColors';

export default function BalanceSection() {
  const { profile, profileLoaded } = useAuthStore();
  const colors = useThemeColors();

  const balance = profile?.balance ?? 0;
  const isNegative = balance < 0;

  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(balance);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>BALANCE TOTAL</Text>
      <View style={styles.amountWrapper}>
        {profileLoaded ? (
          <Text style={[styles.amount, { color: isNegative ? colors.negative : colors.text }]}>
            {formattedBalance}
          </Text>
        ) : (
          <View style={[styles.skeleton, { backgroundColor: colors.border }]} />
        )}
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
    letterSpacing: 1,
  },
  skeleton: {
    height: 36,
    width: 180,
    borderRadius: 8,
    marginTop: 4,
  },
});
