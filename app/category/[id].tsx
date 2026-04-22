import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import TransactionItem from '@/src/components/TransactionItem';
import { useAuthStore } from '@/src/store/useAuthStore';
import { supabase } from '@/src/lib/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAlertStore } from '@/src/store/useAlertStore';
import { useTransactions } from '@/src/hooks/useTransactions';

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colors = useThemeColors();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { showAlert } = useAlertStore();
  const { deleteTransaction } = useTransactions();

  const { data: detailData, isLoading, isError } = useQuery({
    queryKey: ['categoryDetail', id, user?.id],
    queryFn: async () => {
      const categoryId = typeof id === 'string' ? parseInt(id) : id;
      
      if (!categoryId || isNaN(categoryId as number)) {
        throw new Error('ID no válido');
      }

      // 1. Obtener la categoría
      const { data: catData, error: catError } = await supabase
        .from('Categoria')
        .select('*')
        .eq('id', categoryId)
        .eq('idauth_supabase', user?.id)
        .single();
      
      if (catError) throw catError;

      // 2. Obtener TODAS las transacciones filtradas por el nombre de la categoría
      const { data: txsData, error: txsError } = await supabase
        .from('Transaccion')
        .select('*')
        .eq('iduser_supabase', user?.id)
        .eq('categoria', catData.nombre)
        .order('fecha', { ascending: false });

      if (txsError) throw txsError;

      let balance = 0;
      // Agrupar por mes
      const groups: { [key: string]: any[] } = {};

      (txsData || []).forEach(tx => {
        const amount = Number(tx.cantidad) || 0;
        if (tx.tipo === 'i') balance += amount;
        else balance -= amount;

        const dateObj = tx.fecha ? new Date(tx.fecha) : new Date();
        const monthYear = dateObj.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' }).toUpperCase();

        if (!groups[monthYear]) {
          groups[monthYear] = [];
        }

        groups[monthYear].push({
          id: tx.id,
          name: tx.descripcion || 'Sin descripción',
          category: tx.categoria,
          time: dateObj.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }),
          amount: amount,
          type: tx.tipo === 'i' ? 'i' : 'g',
          icon: catData.icono || 'pricetag'
        });
      });

      return {
        category: {
          name: catData.nombre,
          icon: catData.icono || 'pricetag',
          balance: balance
        },
        groupedTransactions: Object.entries(groups).map(([month, data]) => ({ month, data }))
      };
    },
    enabled: !!user && !!id,
    staleTime: 0,
  });
  const handleDeleteTransaction = (txId: number) => {
    showAlert({
      title: 'Eliminar movimiento',
      message: '¿Estás seguro de que deseas eliminar este movimiento? Esta acción no se puede deshacer.',
      type: 'warning',
      buttons: [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => deleteTransaction.mutate(txId)
        }
      ]
    });
  };


  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (isError || !detailData?.category) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
        <Text style={{ color: colors.text, marginTop: 16, fontSize: 16 }}>No se encontró la categoría</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 24 }}>
          <Text style={{ color: colors.accent, fontWeight: 'bold' }}>Volver atrás</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { category, groupedTransactions } = detailData;
    const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(category.balance);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.simpleHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
           <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => router.push({ pathname: '/(tabs)/add', params: { category: category.name } })} 
          style={styles.iconButton}
        >
          <Ionicons name="add" size={28} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroRow}>
          <View style={[styles.iconBox, { backgroundColor: colors.cardBackground }]}>
            <Ionicons name={(category.icon as any) || 'pricetag'} size={32} color={colors.accent} />
          </View>
          <View style={styles.heroText}>
            <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
            <Text style={[styles.totalAmount, { color: colors.text }]}>{formattedBalance}</Text>
          </View>
        </View>
        
        {groupedTransactions.length > 0 ? (
          groupedTransactions.map((group) => (
            <View key={group.month} style={styles.monthSection}>
              <Text style={[styles.monthHeader, { color: colors.textSecondary }]}>{group.month}</Text>
              <View style={[styles.listCard, { backgroundColor: colors.cardBackground }]}>
                {group.data.map((tx, idx) => (
                  <View key={tx.id}>
                    <TransactionItem 
                      transaction={tx} 
                      onLongPress={() => handleDeleteTransaction(tx.id)}
                    />
                    {idx < group.data.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                  </View>
                ))}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={{ color: colors.textSecondary }}>No hay movimientos en esta categoría.</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
  },
  simpleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 10,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    gap: 16,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  heroText: {
    flex: 1,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: '800',
  },
  monthSection: {
    marginBottom: 24,
  },
  monthHeader: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  listCard: {
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  divider: {
    height: 1,
    marginLeft: 56,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  }
});
