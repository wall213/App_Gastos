import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useThemeColors } from '@/src/hooks/useThemeColors';

export default function TabLayout() {
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBarBg,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          height: 80,
          paddingBottom: 24,
          paddingTop: 12,
          position: 'absolute',
          bottom: 0,
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 12,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 4,
        }
      }}>
      <Tabs.Screen
        name='index'
        options={{
          title: 'DASHBOARD',
          tabBarIcon: ({ color }) => <Ionicons size={24} name='grid' color={color} />,
        }}
      />
      <Tabs.Screen
        name='add'
        options={{
          title: '',
          tabBarIcon: () => (
            <View style={styles.fabContainer}>
              <View style={[styles.fab, { backgroundColor: colors.fabBg, borderColor: colors.background, shadowColor: colors.fabBg }]}>
                <Ionicons name='add' size={32} color={colors.cardBackground} />
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name='history'
        options={{
          title: 'HISTORY',
          tabBarIcon: ({ color }) => <Ionicons size={24} name='time' color={color} />,
        }}
      />
      
      {/* Escondiendo los tabs por default si quedaron sobrando */}
      <Tabs.Screen name='explore' options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3d5afe',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 4,
  }
});
