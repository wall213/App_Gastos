import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TransactionItemProps {
  transaction: any;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const { name, category, time, account, amount, type, icon } = transaction;

  const renderIcon = () => {
    // Basic mapping of string icons to Ionicons
    let iconName: any = 'bag-handle';
    let iconColor = '#3d5afe';

    if (icon === 'file-text') {
      iconName = 'document-text';
      iconColor = '#1e8e3e';
    } else if (icon === 'fastfood') {
      iconName = 'fast-food';
      iconColor = '#d32f2f';
    } else if (icon === 'shopping-bag') {
      iconName = 'bag-handle';
      iconColor = '#3d5afe';
    }

    return <Ionicons name={iconName} size={20} color={iconColor} />;
  };

  const isIncome = type === 'income';
  const formattedAmount = `${isIncome ? '+' : '-'}$${Math.abs(amount).toFixed(2)}`;

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.iconWrapper}>
          {renderIcon()}
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.desc}>{category} • {time}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, isIncome ? styles.textGreen : styles.textPrimary]}>
          {formattedAmount}
        </Text>
        <Text style={styles.account}>{account}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f5f6f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e2022',
    marginBottom: 4,
  },
  desc: {
    fontSize: 12,
    color: '#8c92a4',
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  textGreen: {
    color: '#1e8e3e',
  },
  textPrimary: {
    color: '#1e2022',
  },
  account: {
    fontSize: 10,
    color: '#8c92a4',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
