import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { supabase } from '@/src/lib/supabase';
import { useAuthStore } from '@/src/store/useAuthStore';

export default function RootLayout() {
  const { setSession, session, initialized } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Escuchar cambios en la autenticación
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) syncUserProfile(session.user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session) {
          syncUserProfile(session.user);
        } else {
          useAuthStore.getState().setProfile(null);
        }
      }
    );

    async function syncUserProfile(user: any) {
      try {
        // Buscar el perfil en la tabla 'usuarios'
        const { data: existingUser, error: fetchError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('idauth_supabase', user.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching user profile:', fetchError.message);
          return;
        }

        if (!existingUser) {
          // Si no existe, crearlo con los metadatos de Google
          const { data: newUser, error: insertError } = await supabase
            .from('usuarios')
            .insert({
              nombre: user.user_metadata?.full_name || 'Usuario',
              foto: user.user_metadata?.avatar_url || 'https://i.pravatar.cc/150',
              idauth_supabase: user.id,
              pais: 'Mx',
              moneda: '$',
              tema: '1'
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error creating user profile:', insertError.message);
          } else {
            useAuthStore.getState().setProfile(newUser);
          }
        } else {
          // Si existe, actualizar el store
          useAuthStore.getState().setProfile(existingUser);
        }
      } catch (error: any) {
        console.error('Sync error:', error.message);
      }
    }

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Solo redirigir si el estado de auth ya fue inicializado
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(tabs)';
    
    if (!session && inAuthGroup) {
      // Si no hay sesión y el usuario intenta entrar a los tabs, redirigir a login
      router.replace('/login' as any);
    } else if (session && !inAuthGroup) {
      // Si hay sesión y el usuario está fuera de los tabs (ej. en login), redirigir a los tabs
      router.replace('/(tabs)' as any);
    }
  }, [session, segments, initialized]);

  if (!initialized) {
    // Podrías poner un componente de Splash aquí
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ animation: 'fade' }} />
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
    </Stack>
  );
}
