import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import TransactionItem from '@/src/components/TransactionItem';
import { useAuthStore } from '@/src/store/useAuthStore';
import { supabase } from '@/src/lib/supabase';
import { useQuery } from '@tanstack/react-query';

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colors = useThemeColors();
  const { user, profile } = useAuthStore();

  const { data: detailData, isLoading } = useQuery({
    queryKey: ['categoryDetail', id, user?.id],
    queryFn: async () => {
      const categoryId = typeof id === 'string' ? parseInt(id) : id;
      
      if (!categoryId || isNaN(categoryId as number)) {
        throw new Error('invalid_id');
      }

      const { data: catData, error: catError } = await supabase
        .from('Categoria')
        .select('*')
        .eq('id', categoryId)
        .single();
      
      if (catError) throw catError;

      const { data: txsData, error: txsError } = await supabase
        .from('Transaccion')
        .select('*')
        .eq('iduser_supabase', user?.id)
        .eq('categoria', catData.nombre)
        .order('fecha', { ascending: false });

      if (txsError) throw txsError;

      let balance = 0;
      const mappedTxs = (txsData || []).map(tx => {
        const amount = Number(tx.cantidad) || 0;
        if (tx.tipo === 'i') balance += amount;
        else balance -= amount;

        const dateObj = tx.fecha ? new Date(tx.fecha) : new Date();
        return {
          id: tx.id,
          name: tx.descripcion || tx.categoria,
          category: tx.categoria,
          time: isNaN(dateObj.getTime()) 
            ? 'Fecha desconocida' 
            : dateObj.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }),
          account: '', 
          amount: amount,
          type: tx.tipo === 'i' ? 'i' : 'g',
          icon: catData.icono || 'pricetag'
        };
      });

      return {
        category: {
          name: catData.nombre,
          icon: catData.icono || 'pricetag',
          balance: balance
        },
        transactions: mappedTxs
      };
    },
    enabled: !!user && !!id,
    retry: false,
  });

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!detailData?.category) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
        <Text style={{ color: colors.text, marginTop: 16, fontSize: 16 }}>Categoría no encontrada</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 24 }}>
          <Text style={{ color: colors.accent, fontWeight: 'bold' }}>Volver atrás</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { category, transactions } = detailData;

  const formattedAmount = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(category.balance);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      
      {/* Top Header Section */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
             <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.avatarMini}>
            <Image 
              source={{ uri: profile?.foto || "https://i.pravatar.cc/150" }} 
              style={styles.avatarImg}
            />
          </View>
          <Text style={[styles.topTitle, { color: colors.text }]}>{category.name}</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Category Hero Section */}
        <View style={styles.heroSection}>
          <View style={[styles.iconBox, { backgroundColor: '#1E293B' }]}>
            <Ionicons name={(category.icon as any) || 'pricetag'} size={32} color="#94A3B8" />
          </View>
          <Text style={[styles.mainCategoryName, { color: colors.text }]}>{category.name}</Text>
          <Text style={[styles.expenditureLabel, { color: colors.textSecondary }]}>MONTHLY EXPENDITURE</Text>
          <Text style={[styles.amount, { color: colors.text }]}>{formattedAmount}</Text>
        </View>

        {/* Insights Section */}
        <View style={[styles.insightsCard, { backgroundColor: '#1E293B' }]}>
            <Text style={[styles.insightsTitle, { color: '#FDBA74' }]}>Insights</Text>
            <Text style={[styles.insightsText, { color: '#E2E8F0' }]}>
              Tu frecuencia en '{category.name}' ha mostrado picos recientemente. Mantener un balance positivo aquí ayuda a tu salud financiera global.
            </Text>
            <TouchableOpacity style={[styles.partnerBtn, { backgroundColor: '#FFCF9F' }]}>
               <Text style={styles.partnerBtnText}>View Partner Deals</Text>
            </TouchableOpacity>
        </View>

        {/* Recent Ledger Section */}
        <View style={styles.recentHeader}>
           <Text style={[styles.recentTitle, { color: colors.text }]}>Recent Ledger Items</Text>
           <TouchableOpacity>
              <Text style={[styles.viewAllText, { color: colors.textSecondary }]}>View All</Text>
           </TouchableOpacity>
        </View>
        
        <View style={[styles.listCard, { backgroundColor: '#131B2D' }]}>
          {transactions.length > 0 ? (
            transactions.map((tx, idx) => (
              <View key={tx.id}>
                <TransactionItem transaction={tx} />
                {idx < transactions.length - 1 && <View style={[styles.divider, { backgroundColor: '#212A3D' }]} />}
              </View>
            ))
          ) : (
            <Text style={{ textAlign: 'center', color: colors.textSecondary, padding: 20 }}>
              No hay movimientos grabados.
            </Text>
          )}
        </View>

        {/* Premier Access Promo Card */}
        <View style={[styles.promoCard, { backgroundColor: '#1E293B' }]}>
            <View style={styles.promoBadge}>
              <Text style={styles.promoBadgeText}>PREMIER ACCESS</Text>
            </View>
            <Text style={styles.promoTitle}>The Gold Standard</Text>
            <Text style={styles.promoDescription}>
              Elevate your category tracking with AI-driven predictive modeling and exclusive merchant cash-back tiers.
            </Text>
            <TouchableOpacity style={styles.promoBtn}>
               <Text style={styles.promoBtnText}>Upgrade Account</Text>
            </TouchableOpacity>
        </View>

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
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    marginRight: 4,
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#1E293B',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  topTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 10,
  },
  heroSection: {
    marginBottom: 32,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  mainCategoryName: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  expenditureLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  amount: {
    fontSize: 48,
    fontWeight: '700',
  },
  insightsCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#FDBA74',
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  insightsText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
  partnerBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  partnerBtnText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 14,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listCard: {
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 32,
  },
  divider: {
    height: 1,
    marginLeft: 56,
  },
  promoCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  promoBadge: {
    backgroundColor: '#EA913B',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  promoBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: '#000',
  },
  promoTitle: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  promoDescription: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  promoBtn: {
    backgroundColor: '#A5B4FC',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  promoBtnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  }
});
