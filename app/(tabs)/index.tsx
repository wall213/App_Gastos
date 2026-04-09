import React from 'react';
import { ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeColors } from '@/src/hooks/useThemeColors';
import Header from '@/src/components/Header';
import BalanceSection from '@/src/components/BalanceSection';
import CashFlow from '@/src/components/CashFlow';
import SmartSavings from '@/src/components/SmartSavings';
import CategoryTracking from '@/src/components/CategoryTracking';
import RecentActivity from '@/src/components/RecentActivity';

export default function DashboardScreen() {
  const colors = useThemeColors();
  
  return (
    <SafeAreaView style={[styles.safeAreaView, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.background === '#0b0f19' ? 'light-content' : 'dark-content'} />
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
        <Header />
        <BalanceSection />
        <CashFlow />
        <SmartSavings />
        <CategoryTracking />
        <RecentActivity />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },

  container: {
    flex: 1,
  },
});
