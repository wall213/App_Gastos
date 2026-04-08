import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import TransactionItem from './TransactionItem';

export default function RecentActivity() {
  const { transactions } = useAppStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Ledger Activity</Text>
      <View style={styles.listCard}>
        {transactions.map((tx, index) => (
          <View key={tx.id}>
            <TransactionItem transaction={tx} />
            {index < transactions.length - 1 && <View style={styles.divider} />}
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
    color: '#1e2022',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  listCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f1f5',
    marginLeft: 56, // Align with text
  },
});
