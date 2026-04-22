import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/src/hooks/useThemeColors';

interface TransactionItemProps {
  transaction: any;
  onLongPress?: () => void;
}

export default function TransactionItem({ transaction, onLongPress }: TransactionItemProps) {
  const colors = useThemeColors();
  const { name, category, time, amount, type, icon } = transaction;

  const isIncome = type === 'i';
  
  // Custom colors for the ledger style
  // Custom colors for the ledger style
  const amountColor = isIncome ? colors.positiveText : colors.negative;
  const formattedAmount = `${isIncome ? '+' : '-'}$${Math.abs(amount).toFixed(2)}`;

  return (
    <TouchableOpacity 
      style={styles.container} 
      onLongPress={onLongPress}
      activeOpacity={0.7}
      delayLongPress={500}
    >
      <View style={styles.left}>
        <View style={[styles.iconCircle, { backgroundColor: colors.accentSecondary }]}>
          <Ionicons name={(icon as any) || 'pricetag'} size={18} color={colors.textSecondary} />
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
          <Text style={[styles.desc, { color: colors.textSecondary }]}>{time}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: amountColor }]}>
          {formattedAmount}
        </Text>
        <Text style={[styles.categoryTag, { color: colors.textSecondary }]}>
          {category?.toUpperCase() || 'GENERAL'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20, // Circular as in "Recent Ledger Items"
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  desc: {
    fontSize: 12,
    opacity: 0.6,
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amount: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  categoryTag: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
