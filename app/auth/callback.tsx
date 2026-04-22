import { useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/src/lib/supabase';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import * as Linking from 'expo-linking';

/**
 * Componente que maneja la redirección después de un login con OAuth (Google, etc.)
 * URL esperada: appgastos://auth/callback#access_token=...&refresh_token=...
 */
export default function AuthCallback() {
  const router = useRouter();
  const colors = useThemeColors();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // Obtenemos la URL inicial que abrió la app
        const initialUrl = await Linking.getInitialURL();
        if (!initialUrl) {
          console.log('No initial URL found in callback');
          router.replace('/login');
          return;
        }

        // Supabase devuelve los tokens en el fragmento (#) de la URL
        // Expo Linking.parse puede no manejar el fragmento automáticamente como queryParams
        // Así que lo parseamos manualmente para mayor seguridad
        const fragment = initialUrl.split('#')[1];
        if (!fragment) {
          // Si no hay fragmento, intentamos con query params (algunos proveedores lo hacen así)
          const { queryParams } = Linking.parse(initialUrl);
          if (queryParams?.access_token && queryParams?.refresh_token) {
             await setSupabaseSession(queryParams.access_token as string, queryParams.refresh_token as string);
             return;
          }
          console.log('No tokens found in URL fragment or query');
          router.replace('/login');
          return;
        }

        // Parsear fragmento: access_token=abc&refresh_token=123...
        const params = new URLSearchParams(fragment);
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');

        if (access_token && refresh_token) {
          await setSupabaseSession(access_token, refresh_token);
        } else {
          router.replace('/login');
        }
      } catch (error) {
        console.error('Callback handle error:', error);
        router.replace('/login');
      }
    };

    const setSupabaseSession = async (access_token: string, refresh_token: string) => {
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        console.error('Error setting supabase session:', error.message);
        router.replace('/login');
      } else {
        // El layout principal detectará el cambio de sesión y redirigirá a (tabs)
        // Pero forzamos la redirección aquí para asegurar una transición rápida
        router.replace('/(tabs)');
      }
    };

    handleRedirect();
  }, [router]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.accent} />
      <Text style={[styles.text, { color: colors.text }]}>
        Finalizando inicio de sesión...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
