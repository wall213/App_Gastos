import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import TransactionItem from './TransactionItem';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '@/src/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { useTransactions } from '../hooks/useTransactions';
import { useAlertStore } from '../store/useAlertStore';

export default function RecentActivity() {
  const colors = useThemeColors();
  const { user } = useAuthStore();
  const { deleteTransaction } = useTransactions();
  const { showAlert } = useAlertStore();

  const handleDelete = (id: number, name: string) => {
    showAlert({
      title: 'Eliminar Movimiento',
      message: `¿Estás seguro de que quieres eliminar "${name}"?`,
      type: 'warning',
      buttons: [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => deleteTransaction.mutate(id)
        }
      ]
    });
  };

  const { data: transactions = [], isLoading: loading } = useQuery({
    queryKey: ['recentActivity', user?.id],
    queryFn: async () => {
      const [txsRes, catsRes] = await Promise.all([
        supabase.from('Transaccion').select('*').eq('iduser_supabase', user?.id).order('fecha', { ascending: false }).limit(5),
        supabase.from('Categoria').select('nombre, icono').eq('idauth_supabase', user?.id)
      ]);

      if (txsRes.error) throw txsRes.error;
      if (catsRes.error) throw catsRes.error;

      const txsData = txsRes.data || [];
      const catsData = catsRes.data || [];

      return txsData.map(tx => {
        const cat = catsData.find(c => c.nombre === tx.categoria);
        const dateObj = new Date(tx.fecha);
        const timeStr = dateObj.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });

        return {
          id: tx.id,
          name: tx.descripcion || tx.categoria,
          category: tx.categoria,
          time: timeStr,
          account: '', 
          amount: Number(tx.cantidad) || 0,
          type: tx.tipo === 'i' ? 'i' : 'g',
          icon: cat?.icono || 'pricetag'
        };
      });
    },
    enabled: !!user,
  });

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Actividad Reciente</Text>
      <View style={[styles.listCard, { backgroundColor: colors.cardBackground, shadowColor: colors.background }]}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.accent} style={{ padding: 20 }} />
        ) : transactions.length > 0 ? (
          transactions.map((tx, index) => (
            <View key={tx.id?.toString()}>
              <TransactionItem 
                transaction={tx} 
                onLongPress={() => handleDelete(tx.id, tx.name)} 
              />
              {index < transactions.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
            </View>
          ))
        ) : (
          <Text style={{ textAlign: 'center', color: colors.textSecondary, paddingVertical: 16 }}>No hay transacciones por mostrar</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 100, 
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
    marginLeft: 56, 
  },
});
