import React from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/src/hooks/useThemeColors';

const ICONS_LIST = [
  'pricetag', 'fast-food', 'home', 'car', 'airplane', 'medical', 'cart', 'book', 'game-controller', 'bag-handle',
  'bag', 'cafe', 'cash', 'card', 'briefcase', 'barbell', 'beer', 'bicycle', 'boat', 'brush',
  'bulb', 'bus', 'camera', 'color-palette', 'construct', 'desktop', 'fitness', 'flash', 'gift',
  'globe', 'heart', 'leaf', 'library'
] as const;

interface IconPickerProps {
  selectedIcon: string | null;
  onSelectIcon: (icon: string) => void;
}

export default function IconPicker({ selectedIcon, onSelectIcon }: IconPickerProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {ICONS_LIST.map((iconName) => {
          const isSelected = selectedIcon === iconName;
          return (
            <TouchableOpacity
              key={iconName}
              style={[
                styles.iconBox,
                { backgroundColor: colors.background },
                isSelected && [styles.iconBoxActive, { backgroundColor: colors.accent }]
              ]}
              onPress={() => onSelectIcon(iconName)}
            >
              <Ionicons 
                name={iconName as any} 
                size={22} 
                color={isSelected ? '#ffffff' : colors.textSecondary} 
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginTop: 4,
  },
  scrollContent: {
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxActive: {
    shadowColor: '#3d5afe',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  }
});
