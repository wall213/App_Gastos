import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SmartSavings() {
  return (
    <View style={styles.cardBlue}>
      <View style={styles.iconContainer}>
        <Ionicons name="trending-up" size={24} color="#ffffff" />
      </View>
      <Text style={styles.title}>Smart Savings</Text>
      <Text style={styles.desc}>
        You're on track to save 22% more than last month.
      </Text>
      <TouchableOpacity style={styles.insightsBtn}>
        <Text style={styles.insightsBtnText}>View insights</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardBlue: {
    backgroundColor: '#3d5afe',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#3d5afe',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
    lineHeight: 20,
  },
  insightsBtn: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  insightsBtnText: {
    color: '#3d5afe',
    fontWeight: '600',
    fontSize: 16,
  },
});
