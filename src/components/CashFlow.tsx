import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CashFlow() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Cash Flow</Text>
          <Text style={styles.subtitle}>Monthly performance overview</Text>
        </View>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, styles.incomeDot]} />
            <Text style={styles.legendText}>INCOME</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, styles.expenseDot]} />
            <Text style={styles.legendText}>EXPENSES</Text>
          </View>
        </View>
      </View>

      <View style={styles.chartArea}>
        {[40, 70, 20, 60, 80].map((height, i) => (
          <View key={i} style={styles.barGroup}>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { height: `${height}%` }]} />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.totalsContainer}>
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>TOTAL INCOME</Text>
          <Text style={[styles.totalAmount, styles.incomeAmount]}>$12,400.00</Text>
        </View>
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>TOTAL EXPENSES</Text>
          <Text style={styles.totalAmount}>$4,120.00</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e2022',
  },
  subtitle: {
    fontSize: 12,
    color: '#8c92a4',
    marginTop: 4,
  },
  legend: {
    flexDirection: 'row',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6f8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8c92a4',
    letterSpacing: 0.5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  incomeDot: {
    backgroundColor: '#3d5afe',
  },
  expenseDot: {
    backgroundColor: '#b3b8c6',
  },
  chartArea: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  barGroup: {
    width: 32,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barBg: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e8eaff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#3d5afe',
    position: 'absolute',
    bottom: 0,
    borderRadius: 8,
  },
  totalsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  totalBox: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    padding: 16,
    borderRadius: 12,
  },
  totalLabel: {
    fontSize: 10,
    color: '#8c92a4',
    fontWeight: '600',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e2022',
  },
  incomeAmount: {
    color: '#3d5afe',
  },
});
