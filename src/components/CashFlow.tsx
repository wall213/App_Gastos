import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { supabase } from '@/src/lib/supabase';
import { useAuthStore } from '../store/useAuthStore';

export default function CashFlow() {
  const colors = useThemeColors();
  const { user, monthlyIncome, monthlyExpense, monthlyTotalsLoaded, setMonthlyTotals } = useAuthStore();
  
  const [loading, setLoading] = useState(!monthlyTotalsLoaded);

  useEffect(() => {
    if (user && !monthlyTotalsLoaded) {
      fetchMonthlyFlow();
    }
  }, [user, monthlyTotalsLoaded]);

  const fetchMonthlyFlow = async () => {
    try {
      setLoading(true);
      
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
      const { data, error } = await supabase
        .from('Transaccion')
        .select('cantidad, tipo')
        .eq('iduser_supabase', user?.id)
        .gte('fecha', startOfMonth)
        .lte('fecha', endOfMonth);

      if (error) throw error;

      if (data) {
        const income = data
          .filter(item => item.tipo === 'i')
          .reduce((sum, item) => sum + (item.cantidad || 0), 0);
        const expense = data
          .filter(item => item.tipo === 'g')
          .reduce((sum, item) => sum + (item.cantidad || 0), 0);

        setMonthlyTotals(income, expense);
      }
    } catch (error) {
      console.error('Error fetching cash flow:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground, shadowColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Flujo de Dinero</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Resumen del rendimiento mensual</Text>
        </View>
        <View style={styles.legend}>
          <View style={[styles.legendItem, { backgroundColor: colors.background }]}>
            <View style={[styles.dot, styles.incomeDot, { backgroundColor: colors.accent }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>INGRESOS</Text>
          </View>
          <View style={[styles.legendItem, { backgroundColor: colors.background }]}>
            <View style={[styles.dot, styles.expenseDot, { backgroundColor: colors.textSecondary }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>GASTOS</Text>
          </View>
        </View>
      </View>

      <View style={styles.chartArea}>
        {[40, 70, 20, 60, 80].map((height, i) => (
          <View key={i} style={styles.barGroup}>
            <View style={[styles.barBg, { backgroundColor: colors.chartBg }]}>
              <View style={[styles.barFill, { height: `${height}%`, backgroundColor: colors.accent }]} />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.totalsContainer}>
        <View style={[styles.totalBox, { backgroundColor: colors.background }]}>
          <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>TOTAL INGRESOS</Text>
          {loading ? (
            <View style={[styles.skeleton, { backgroundColor: colors.border }]} />
          ) : (
            <Text style={[styles.totalAmount, styles.incomeAmount, { color: colors.accent }]}>
              {formatCurrency(monthlyIncome)}
            </Text>
          )}
        </View>
        <View style={[styles.totalBox, { backgroundColor: colors.background }]}>
          <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>TOTAL GASTOS</Text>
          {loading ? (
            <View style={[styles.skeleton, { backgroundColor: colors.border }]} />
          ) : (
            <Text style={[styles.totalAmount, { color: colors.text }]}>
              {formatCurrency(monthlyExpense)}
            </Text>
          )}
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
    marginTop: 10,
  },
  legend: {
    flexDirection: 'column',
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
  skeleton: {
    height: 20,
    width: '100%',
    borderRadius: 4,
    backgroundColor: '#e1e1e1',
  },
});
