import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import CategoryCard from './CategoryCard';

export default function CategoryTracking() {
  const { categories } = useAppStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Category Tracking</Text>
          <Text style={styles.subtitle}>Quick access to frequent expense types</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
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
    color: '#1e2022',
  },
  subtitle: {
    fontSize: 12,
    color: '#8c92a4',
    marginTop: 4,
  },
  seeAll: {
    color: '#3d5afe',
    fontWeight: '600',
    fontSize: 14,
  },
  list: {
    gap: 0,
  },
});
