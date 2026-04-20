import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/src/hooks/useThemeColors';

interface TransactionItemProps {
  transaction: any;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const colors = useThemeColors();
  const { name, category, time, account, amount, type, icon } = transaction;

  const isIncome = type === 'i';
  const iconColor = isIncome ? (colors.positiveText || '#1e8e3e') : (colors.negative || '#ff4444');

  const renderIcon = () => {
    return <Ionicons name={(icon as any) || 'pricetag'} size={20} color={iconColor} />;
  };


  const formattedAmount = `${isIncome ? '+' : '-'}$${Math.abs(amount).toFixed(2)}`;

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={[styles.iconWrapper, { backgroundColor: colors.border }]}>
          {renderIcon()}
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
          <Text style={[styles.desc, { color: colors.textSecondary }]}>{category} • {time}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: isIncome ? (colors.positiveText || '#1e8e3e') : (colors.negative || '#ff4444') }]}>
          {formattedAmount}
        </Text>
        <Text style={[styles.account, { color: colors.textSecondary }]}>{account}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  desc: {
    fontSize: 12,
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
  account: {
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
