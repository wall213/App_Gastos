import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import TransactionItem from './TransactionItem';

export default function RecentActivity() {
  const { transactions } = useAppStore();
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Recent Ledger Activity</Text>
      <View style={[styles.listCard, { backgroundColor: colors.cardBackground, shadowColor: colors.background }]}>
        {transactions.map((tx, index) => (
          <View key={tx.id}>
            <TransactionItem transaction={tx} />
            {index < transactions.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 100, // Make room for bottom nav
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  listCard: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  divider: {
    height: 1,
    marginLeft: 56, // Align with text
  },
});
