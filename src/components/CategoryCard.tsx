import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CategoryCardProps {
  category: any;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const { name, type, amount, transactions, icon } = category;

  const renderIcon = () => {
    return <Ionicons name={icon as any || 'fast-food'} size={24} color="#3d5afe" />;
  };

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  return (
    <View style={styles.card}>
      <View style={styles.iconWrapper}>
        {renderIcon()}
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.type}>{type}</Text>
        <View style={styles.bottom}>
          <Text style={styles.amount}>{formattedAmount}</Text>
          <Text style={styles.transactions}>{transactions} Transactions</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#f5f6f8',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
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
    color: '#1e2022',
  },
  type: {
    fontSize: 10,
    color: '#8c92a4',
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
    color: '#1e2022',
  },
  transactions: {
    fontSize: 11,
    color: '#8c92a4',
  },
});
