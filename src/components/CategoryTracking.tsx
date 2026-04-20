import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import CategoryCard from './CategoryCard';

export default function CategoryTracking() {
  const { categories } = useAppStore();
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Categorias</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Acceso rapido a categorias</Text>
        </View>
        <TouchableOpacity>
          <Text style={[styles.seeAll, { color: colors.accent }]}>Ver Todo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {categories.map(cat => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </View>
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
