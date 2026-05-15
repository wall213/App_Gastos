import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/src/hooks/useThemeColors';

interface CategoryCardProps {
  category: any;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const colors = useThemeColors();
  const { name, type, amount, transactions, icon } = category;

  const renderIcon = () => {
    return <Ionicons name={icon as any || 'fast-food'} size={24} color='#3d5afe' />;
  };

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  return (
    <View style={[styles.card, { backgroundColor: colors.border }]}>
      <View style={[styles.iconWrapper, { backgroundColor: colors.cardBackground, shadowColor: colors.background }]}>
        {renderIcon()}
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
        {!!type && <Text style={[styles.type, { color: colors.textSecondary }]}>{type}</Text>}
        <View style={styles.bottom}>
          <Text style={[styles.amount, { color: amount < 0 ? colors.negative : colors.text }]}>{formattedAmount}</Text>
          <Text style={[styles.transactions, { color: colors.textSecondary }]}>{transactions} Movimientos</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  type: {
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  transactions: {
    fontSize: 11,
  },
});