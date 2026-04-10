import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, Animated } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAppStore } from '@/src/store/useAppStore';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useAuthStore } from '@/src/store/useAuthStore';
import { supabase } from '@/src/lib/supabase';

export default function Header() {
  const { theme, toggleTheme } = useAppStore();
  const { profile, signOut } = useAuthStore();
  const colors = useThemeColors();
  const [menuOpen, setMenuOpen] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-10));

  const toggleMenu = () => {
    if (!menuOpen) {
      setMenuOpen(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -10,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => setMenuOpen(false));
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={[styles.header, { backgroundColor: colors.background }]}>
      <TouchableOpacity 
        style={styles.profileSection} 
        onPress={toggleMenu}
        activeOpacity={0.7}
      >
        <View style={[styles.avatar, { backgroundColor: colors.border }]}>
          <Image 
            source={{ uri: profile?.foto || 'https://i.pravatar.cc/150' }} 
            style={styles.avatarImage} 
          />
        </View>
        <Text style={[styles.username, { color: colors.text }]}>
          {profile?.nombre || 'Usuario'}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={toggleTheme}>
          <Ionicons name={theme === 'dark' ? 'sunny' : 'moon'} size={22} color={colors.icon} />
        </TouchableOpacity>
      </View>

      {/* Menu Desplegable */}
      {menuOpen && (
        <Modal
          transparent={true}
          visible={menuOpen}
          onRequestClose={toggleMenu}
          animationType="none"
        >
          <TouchableWithoutFeedback onPress={toggleMenu}>
            <View style={styles.modalOverlay}>
              <View style={styles.menuContainer}>
                <Animated.View style={[
                  styles.dropdown, 
                  { 
                    backgroundColor: colors.cardBackground,
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                  }
                ]}>
                  <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="settings-outline" size={20} color={colors.textSecondary} />
                    <Text style={[styles.menuText, { color: colors.text }]}>Configuración</Text>
                  </TouchableOpacity>
                  
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  
                  <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
                    <MaterialIcons name="logout" size={20} color="#EA4335" />
                    <Text style={[styles.menuText, { color: '#EA4335' }]}>Cerrar sesión</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 30,
    zIndex: 10,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuContainer: {
    position: 'absolute',
    top: 90,
    left: 20,
  },
  dropdown: {
    width: 200,
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 4,
    marginHorizontal: 8,
  }
});
