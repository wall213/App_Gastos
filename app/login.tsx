import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity,  
  StatusBar, Dimensions, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from '@/src/lib/supabase';
import { useThemeColors } from '@/src/hooks/useThemeColors';

WebBrowser.maybeCompleteAuthSession();

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const colors = useThemeColors();
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const redirectUrl = Linking.createURL('auth/callback'); 
      console.log('Redirect URL:', redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: false,
        },
      });

      if (error) throw error;

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        
        if (result.type === 'success' && result.url) {
          // Parsear tokens desde la URL (puede estar en el hash # o query ?)
          const urlObj = new URL(result.url.replace('#', '?'));
          const access_token = urlObj.searchParams.get('access_token');
          const refresh_token = urlObj.searchParams.get('refresh_token');

          if (access_token && refresh_token) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (sessionError) throw sessionError;
          } else {
            // Si es flujo PKCE, podría haber un 'code'
            const code = urlObj.searchParams.get('code');
            if (code) {
              const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
              if (exchangeError) throw exchangeError;
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Error signing in with Google:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Decoro Background - Círculos abstractos */}
      <View style={[styles.circle, { backgroundColor: '#3d5afe', top: -50, left: -50, opacity: 0.2 }]} />
      <View style={[styles.circle, { backgroundColor: '#ff4081', bottom: -100, right: -50, opacity: 0.1, width: 300, height: 300 }]} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: colors.cardBackground }]}>
            <Ionicons name="wallet-outline" size={40} color="#3d5afe" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>AppGastos</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Controla tus gastos de forma inteligente y sencilla.
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.googleButton, { backgroundColor: colors.cardBackground }]}
            onPress={signInWithGoogle}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <>
                <FontAwesome name="google" size={24} color="#EA4335" style={styles.buttonIcon} />
                <Text style={[styles.buttonText, { color: colors.text }]}>Continuar con Google</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={[styles.termsText, { color: colors.textSecondary }]}>
            Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    paddingVertical: 50,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.7,
  },
  footer: {
    marginBottom: 20,
  },
  googleButton: {
    flexDirection: 'row',
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
    opacity: 0.5,
  },
  circle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
  }
});
