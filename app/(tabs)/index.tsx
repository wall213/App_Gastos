import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import Header from '@/src/components/Header';
import BalanceSection from '@/src/components/BalanceSection';
import CashFlow from '@/src/components/CashFlow';
import SmartSavings from '@/src/components/SmartSavings';
import CategoryTracking from '@/src/components/CategoryTracking';
import RecentActivity from '@/src/components/RecentActivity';

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Header />
      <BalanceSection />
      <CashFlow />
      <SmartSavings />
      <CategoryTracking />
      <RecentActivity />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
});
