import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
  KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/src/lib/supabase';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { ThemedDatePicker } from '@/src/components/ThemedDatePicker';
import { useAlertStore } from '@/src/store/useAlertStore';

export default function AddTransactionScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { user } = useAuthStore();
  const { showAlert } = useAlertStore();
  
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'Expense' | 'Income'>('Expense');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  // Estados para nueva categoría
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [user]);

  const fetchCategories = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('Categoria')
        .select('*')
        .eq('idauth_supabase', user.id);
      
      if (error) throw error;
      setCategories(data || []);
      if (data && data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0].nombre);
      }
    } catch (error: any) {
      console.error('Error fetching categories:', error.message);
    } finally {
      setFetchingCategories(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      showAlert({
        title: 'Error',
        message: 'Ingresa un nombre para la categoría',
        type: 'error'
      });
      return;
    }

    setSavingCategory(true);
    try {
      const { data, error } = await supabase
        .from('Categoria')
        .insert({
          nombre: newCategoryName.trim(),
          idauth_supabase: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      // Actualizar lista y cerrar modal
      setCategories([...categories, data]);
      setSelectedCategory(data.nombre);
      setNewCategoryName('');
      setShowAddCategory(false);
    } catch (error: any) {
      showAlert({
        title: 'Error',
        message: error.message,
        type: 'error'
      });
    } finally {
      setSavingCategory(false);
    }
  };

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      showAlert({
        title: 'Error',
        message: 'Por favor ingrese una cantidad válida',
        type: 'error'
      });
      return;
    }
    if (!selectedCategory) {
      showAlert({
        title: 'Error',
        message: 'Por favor seleccione una categoría',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      // g = gasto, i = ingreso
      const dbType = type === 'Expense' ? 'g' : 'i';
      const numericAmount = parseFloat(amount);

      const { error } = await supabase
        .from('Transaccion')
        .insert({
          fecha: date.toISOString(),
          cantidad: numericAmount,
          categoria: selectedCategory,
          tipo: dbType,
          descripcion: description,
          iduser_supabase: user?.id,
        });
        
      if (error) throw error;

      const { profile, setProfile } = useAuthStore.getState();
      if (profile) {
        const currentBalance = profile.balance || 0;
        const newBalance = dbType === 'i' ? currentBalance + numericAmount : currentBalance - numericAmount;
        setProfile({ ...profile, balance: newBalance });
      }

      showAlert({
        title: 'Éxito',
        message: 'Transacción guardada correctamente',
        type: 'success',
        buttons: [
          { text: 'OK', onPress: () => router.replace('/(tabs)') }
        ]
      });
      
      // Reset form
      setAmount('');
      setDescription('');
    } catch (error: any) {
      showAlert({
        title: 'Error',
        message: error.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={32} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Monto */}
        <View style={styles.amountContainer}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>INGRESA EL MONTO</Text>
          <View style={styles.amountInputRow}>
            <Text style={[styles.currencySymbol, { color: colors.textSecondary }]}>$</Text>
            <TextInput
              style={[styles.amountInput, { color: colors.text }]}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={colors.textSecondary}
              autoFocus={true}
            />
          </View>
        </View>

        {/* Tipo Transaccion */}
        <View style={[styles.toggleContainer, { backgroundColor: colors.tabBarBg }]}>
          <TouchableOpacity 
            style={[
              styles.toggleBtn, 
              type === 'Expense' && [styles.toggleBtnActiveExpense]
            ]}
            onPress={() => setType('Expense')}
          >
            <Text style={[styles.toggleText, { color: type === 'Expense' ? '#FF4444' : colors.textSecondary }]}>Gasto</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.toggleBtn, 
              type === 'Income' && [styles.toggleBtnActiveIncome]
            ]}
            onPress={() => setType('Income')}
          >
            <Text style={[styles.toggleText, { color: type === 'Income' ? '#1E8E3E' : colors.textSecondary }]}>Ingreso</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>DETALLES</Text>
        
        {/* Fecha */}
        <TouchableOpacity 
          style={[styles.detailsRow, { backgroundColor: colors.cardBackground }]}
          onPress={() => setShowDatePicker(true)}
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.border }]}>
            <Ionicons name="calendar-outline" size={22} color={colors.text} />
          </View>
          <View style={styles.detailsTextContainer}>
            <Text style={[styles.detailsLabel, { color: colors.textSecondary }]}>FECHA</Text>
            <Text style={[styles.detailsValue, { color: colors.text }]}>
              {date.toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Reusable Themed Date Picker */}
        <ThemedDatePicker
          visible={showDatePicker}
          value={date}
          onConfirm={(selectedDate) => {
            setDate(selectedDate);
            setShowDatePicker(false);
          }}
          onCancel={() => setShowDatePicker(false)}
        />

        {/* Descripcion */}
        <View style={[styles.detailsRow, { backgroundColor: colors.cardBackground }]}>
          <View style={[styles.iconContainer, { backgroundColor: colors.border }]}>
            <Ionicons name="document-text-outline" size={22} color={colors.text} />
          </View>
          <View style={styles.detailsTextContainer}>
            <Text style={[styles.detailsLabel, { color: colors.textSecondary }]}>DESCRIPCIÓN</Text>
            <TextInput
              style={[styles.detailsInput, { color: colors.text }]}
              placeholder="¿De qué trata el movimiento?"
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>
        </View>

        <View style={styles.categoryHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>CATEGORÍA</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {fetchingCategories ? (
            <ActivityIndicator color={colors.accent} />
          ) : (
            <>
              {categories.map((cat) => (
                <TouchableOpacity 
                  key={cat.id}
                  style={[
                    styles.categoryChip, 
                    { backgroundColor: colors.cardBackground },
                    selectedCategory === cat.nombre && [styles.categoryChipActive, { backgroundColor: colors.accent }]
                  ]}
                  onPress={() => setSelectedCategory(cat.nombre)}
                >
                  <Text style={[
                    styles.categoryText, 
                    { color: selectedCategory === cat.nombre ? '#fff' : colors.text }
                  ]}>
                    {cat.nombre}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity 
                style={[styles.addCategoryBtn, { backgroundColor: colors.cardBackground }]}
                onPress={() => setShowAddCategory(true)}
              >
                <Ionicons name="add" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </>
          )}
        </ScrollView>

        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: colors.accent, opacity: loading ? 0.7 : 1 }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Guardar</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Nueva Categoría */}
      <Modal
        visible={showAddCategory}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddCategory(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Nueva Categoría</Text>
            <TextInput
              style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
              placeholder="Nombre de la categoría"
              placeholderTextColor={colors.textSecondary}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity 
                onPress={() => {
                  setShowAddCategory(false);
                  setNewCategoryName('');
                }}
                style={styles.modalBtn}
              >
                <Text style={{ color: colors.textSecondary }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleAddCategory}
                disabled={savingCategory}
                style={[styles.modalBtn, styles.modalBtnPrimary, { backgroundColor: colors.accent }]}
              >
                {savingCategory ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Agregar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 5,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '500',
    marginTop: 35,
    marginRight: 5,
  },
  amountInput: {
    fontSize: 72,
    fontWeight: '500',
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 6,
    marginBottom: 30,
  },
  toggleBtn: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  toggleBtnActiveExpense: {
    shadowColor: '#FF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: 'rgba(255, 68, 68, 0.15)'
  },
  toggleBtnActiveIncome: {
    shadowColor: '#1E8E3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: 'rgba(30, 142, 62, 0.15)'
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 15,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailsTextContainer: {
    flex: 1,
  },
  detailsLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },
  detailsValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  detailsInput: {
    fontSize: 16,
    fontWeight: '600',
    padding: 0,
    minHeight: 24,
  },
  categoryHeader: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoriesScroll: {
    marginBottom: 40,
  },
  categoryChip: {
    paddingHorizontal: 20,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  categoryChipActive: {},
  categoryText: {
    fontSize: 15,
    fontWeight: '600',
  },
  addCategoryBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#3d5afe',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    height: 55,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  modalBtnPrimary: {
    shadowColor: '#3d5afe',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  }
});
