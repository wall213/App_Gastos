import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import CategoryCard from '@/src/components/CategoryCard';
import IconPicker from '@/src/components/IconPicker';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/store/useAuthStore';
import { supabase } from '@/src/lib/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAlertStore } from '@/src/store/useAlertStore';

interface AggregatedCategory {
  id: string;
  name: string;
  type: string;
  amount: number;
  transactions: number;
  icon: string;
}

export default function CategoriesScreen() {
  const colors = useThemeColors();
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const { showAlert } = useAlertStore();
  const [editingCat, setEditingCat] = useState<AggregatedCategory | null>(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('pricetag');
  const [loadingAction, setLoadingAction] = useState(false);

  const { data: categories = [], isLoading: loading } = useQuery({
    queryKey: ['categories', 'stats', user?.id],
    queryFn: async () => {
      const [catsRes, txsRes] = await Promise.all([
        supabase.from('Categoria').select('*').eq('idauth_supabase', user?.id),
        supabase.from('Transaccion').select('cantidad, categoria, tipo').eq('iduser_supabase', user?.id)
      ]);

      if (catsRes.error) throw catsRes.error;
      if (txsRes.error) throw txsRes.error;

      const cats = catsRes.data || [];
      const txs = txsRes.data || [];

      return cats.map(cat => {
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
    },
    enabled: !!user,
  });

  const confirmDelete = () => {
    showAlert({
      title: 'Confirmar Eliminación',
      message: `¿Estás seguro de eliminar la categoría '${editingCat?.name}'? Esta acción no se puede deshacer.`,
      type: 'warning',
      buttons: [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: deleteCategory
        }
      ]
    });
  };

  const deleteCategory = async () => {
    if (!editingCat) return;
    setLoadingAction(true);
    try {
      const { error: txError } = await supabase
        .from('Transaccion')
        .delete()
        .eq('iduser_supabase', user?.id)
        .eq('categoria', editingCat.name);

      if (txError) throw txError;
      
      const { error } = await supabase.from('Categoria').delete().eq('id', parseInt(editingCat.id));
      if (error) throw error;
      setEditModalVisible(false);
      await Promise.all([
        queryClient.resetQueries({ queryKey: ['categories'] }),
        queryClient.resetQueries({ queryKey: ['transactions'] })
      ]);
    } catch (error: any) {
      console.error(error);
      showAlert({
        title: 'Error',
        message: error.message || "No se pudo eliminar la categoría.",
        type: 'error'
      });
    } finally {
      setLoadingAction(false);
    }
  };

  const openEditModal = (cat: AggregatedCategory) => {
    setEditingCat(cat);
    setEditName(cat.name);
    setEditIcon(cat.icon);
    setEditModalVisible(true);
  };

  const openAddModal = () => {
    setEditingCat(null);
    setEditName('');
    setEditIcon('pricetag');
    setEditModalVisible(true);
  };

  const saveCategory = async () => {
    if (!editName.trim()) return;
    setEditModalVisible(false);
    setLoadingAction(true);
    try {
      if (editingCat) {
        const { error } = await supabase.from('Categoria').update({ nombre: editName.trim(), icono: editIcon }).eq('id', parseInt(editingCat.id));
        if (error) throw error;
      } else {
        const { error } = await supabase.from('Categoria').insert({ nombre: editName.trim(), icono: editIcon, idauth_supabase: user?.id });
        if (error) throw error;
      }
      queryClient.resetQueries({ queryKey: ['categories'] });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Categorias</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Detalles de cada categoria</Text>
          </View>
          <TouchableOpacity onPress={openAddModal} style={[styles.addButton, { backgroundColor: colors.cardBackground }]}>
             <Text style={{ fontSize: 24, color: colors.text, fontWeight: '300' }}>+</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        ) : (
          <View style={styles.listSection}>
            {categories.map((cat) => (
              <TouchableOpacity 
                key={cat.id} 
                activeOpacity={0.8}
                onPress={() => router.push(`/category/${cat.id}` as any)}
                onLongPress={() => openEditModal(cat)}
              >
                <CategoryCard category={cat} />
              </TouchableOpacity>
            ))}
            {categories.length === 0 && !loading && (
               <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No tienes categorías registradas.</Text>
            )}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
               {editingCat ? "Editar Categoría" : "Nueva Categoría"}
            </Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              value={editName}
              onChangeText={setEditName}
              placeholder="Nombre"
              placeholderTextColor={colors.textSecondary}
              autoFocus
            />
            
            <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginBottom: 8 }]}>SELECCIONA UN ICONO</Text>
            <IconPicker selectedIcon={editIcon} onSelectIcon={setEditIcon} />

            <View style={styles.modalActions}>
              {editingCat ? (
                <TouchableOpacity onPress={confirmDelete} style={[styles.modalBtn, { paddingHorizontal: 0 }]}>
                  <Text style={[styles.modalBtnText, { color: colors.negative || '#ff4444' }]}>Eliminar</Text>
                </TouchableOpacity>
              ) : <View />}
              
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.modalBtn}>
                  <Text style={[styles.modalBtnText, { color: colors.textSecondary }]}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={saveCategory} style={[styles.modalBtn, { backgroundColor: colors.accent }]}>
                  <Text style={[styles.modalBtnText, { color: '#fff' }]}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  listSection: {
    marginBottom: 32,
  },
  loader: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 24,
    borderRadius: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalBtnText: {
    fontWeight: 'bold',
    fontSize: 14,
  }
});
