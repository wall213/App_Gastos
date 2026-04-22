import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import CategoryCard from './CategoryCard';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '@/src/lib/supabase';
import { useQuery } from '@tanstack/react-query';

interface AggregatedCategory {
  id: string;
  name: string;
  type: string;
  amount: number;
  transactions: number;
  icon: string;
}

export default function CategoryTracking() {
  const colors = useThemeColors();
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: categories = [], isLoading: loading } = useQuery({
    queryKey: ['categories', 'tracking', user?.id],
    queryFn: async () => {
      const [catsRes, txsRes] = await Promise.all([
        supabase.from('Categoria').select('*').eq('idauth_supabase', user?.id),
        supabase.from('Transaccion').select('cantidad, categoria, tipo').eq('iduser_supabase', user?.id)
      ]);

      if (catsRes.error) throw catsRes.error;
      if (txsRes.error) throw txsRes.error;

      const cats = catsRes.data || [];
      const txs = txsRes.data || [];

      const aggregated: AggregatedCategory[] = cats.map(cat => {
        const catTxs = txs.filter(tx => tx.categoria === cat.nombre);
        
        let totalAmount = 0;
        catTxs.forEach(tx => {
          const amount = Number(tx.cantidad) || 0;
          if (tx.tipo === 'i') totalAmount += amount;
          else if (tx.tipo === 'g') totalAmount -= amount;
        });

        return {
          id: cat.id.toString(),
          name: cat.nombre,
          type: '', 
          amount: totalAmount,
          transactions: catTxs.length,
          icon: cat.icono || 'pricetag',
        };
      });

      return aggregated.slice(0, 3);
    },
    enabled: !!user,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Categorias Rápidas</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Acceso a tus áreas recientes</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/categories' as any)}>
          <Text style={[styles.seeAll, { color: colors.accent }]}>Ver Todo</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color={colors.accent} style={{ marginVertical: 20 }} />
      ) : (
        <View style={styles.list}>
          {categories.map(cat => (
            <TouchableOpacity 
              key={cat.id} 
              activeOpacity={0.8}
              onPress={() => router.push(`/category/${cat.id}` as any)}
            >
              <CategoryCard category={cat} />
            </TouchableOpacity>
          ))}
          {categories.length === 0 && (
             <Text style={{ textAlign: 'center', color: colors.textSecondary, marginTop: 10 }}>Ninguna categoría activa</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  seeAll: {
    fontWeight: '600',
    fontSize: 14,
  },
  list: {
    gap: 0,
  },
});
