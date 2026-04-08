import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/useAppStore';

export default function BalanceSection() {
  const { balance, growth } = useAppStore();

  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(balance);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>TOTAL AVAILABLE BALANCE</Text>
      <View style={styles.amountWrapper}>
        <Text style={styles.amount}>{formattedBalance}</Text>
        <View style={styles.growthBadge}>
          <Ionicons name="arrow-up" size={14} color="#1e8e3e" />
          <Text style={styles.growthText}>{growth}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    backgroundColor: '#f7f8fa',
  },
  label: {
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#8c92a4',
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
    color: '#1e2022',
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f4ea',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 2,
  },
  growthText: {
    fontSize: 12,
    color: '#1e8e3e',
    fontWeight: '600',
  },
});
