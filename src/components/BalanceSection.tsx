import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { supabase } from '@/src/lib/supabase';
import { useQuery } from '@tanstack/react-query';

export default function BalanceSection() {
  const { user } = useAuthStore();
  const colors = useThemeColors();

  const { data: balance = 0, isLoading: loading } = useQuery({
    queryKey: ['transactions', 'totalBalance', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Transaccion')
        .select('cantidad, tipo')
        .eq('iduser_supabase', user?.id);

      if (error) throw error;

      let total = 0;
      if (data) {
        data.forEach(tx => {
          const amount = Number(tx.cantidad) || 0;
          if (tx.tipo === 'i') total += amount;
          else total -= amount;
        });
      }
      return total;
    },
    enabled: !!user,
  });

  const isNegative = balance < 0;

  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(balance);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>BALANCE TOTAL</Text>
      <View style={styles.amountWrapper}>
        {!loading ? (
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
