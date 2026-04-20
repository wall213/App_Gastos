import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { supabase } from '@/src/lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import { useQuery } from '@tanstack/react-query';

export default function CashFlow() {
  const colors = useThemeColors();
  const { user } = useAuthStore();
  
  const { data: totals, isLoading: loading } = useQuery({
    queryKey: ['cashFlow', user?.id],
    queryFn: async () => {
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

      let income = 0;
      let expense = 0;
      if (data) {
        income = data.filter(item => item.tipo === 'i').reduce((sum, item) => sum + (item.cantidad || 0), 0);
        expense = data.filter(item => item.tipo === 'g').reduce((sum, item) => sum + (item.cantidad || 0), 0);
      }
      return { income, expense };
    },
    enabled: !!user,
  });

  const monthlyIncome = totals?.income || 0;
  const monthlyExpense = totals?.expense || 0;

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
    marginTop: 2,
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
