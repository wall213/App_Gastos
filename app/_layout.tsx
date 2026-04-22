import { View } from 'react-native';
import { useEffect } from 'react';
import * as SystemUI from 'expo-system-ui';
import { Stack, useRouter, useSegments } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useAppStore } from '@/src/store/useAppStore';
import { supabase } from '@/src/lib/supabase';
import { useAuthStore } from '@/src/store/useAuthStore';
import { ThemedAlert } from '@/src/components/ThemedAlert';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
    },
  },
});

import { useThemeColors } from '@/src/hooks/useThemeColors';

export default function RootLayout() {
  const { setSession, session, initialized } = useAuthStore();
  const colors = useThemeColors();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
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
      if (!user) return;
      try {
        const { data: existingUser, error: fetchError } = await supabase
          .from('Usuarios')
          .select('*')
          .eq('idauth_supabase', user.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching user profile:', fetchError.message);
          return;
        }

        if (!existingUser) {
          const { data: newUser, error: insertError } = await supabase
            .from('Usuarios')
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
          useAuthStore.getState().setProfile(existingUser);
        }
      } catch (error: any) {
        console.error('Sync error:', error.message || error);
      }
    }

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(tabs)' || segments[0] === 'category';
    
    if (!session && inAuthGroup) {
      router.replace('/login' as any);
    } else if (session && segments[0] === 'login') {
      router.replace('/(tabs)' as any);
    }
  }, [session, segments, initialized]);
  
  const theme = useAppStore((state) => state.theme);

  // Sync native root background color with theme to prevent flashes
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, [theme, colors.background]);

  const navigationTheme = theme === 'dark' ? DarkTheme : DefaultTheme;
  const customTheme = {
    ...navigationTheme,
    colors: {
      ...navigationTheme.colors,
      background: colors.background,
      card: colors.cardBackground,
      text: colors.text,
      border: colors.border,
      primary: colors.accent,
    },
  };

  if (!initialized) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={customTheme}>
        <Stack screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: colors.background } 
        }}>
          <Stack.Screen name="login" options={{ animation: 'fade' }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen name="category/[id]" options={{ animation: 'slide_from_right' }} />
        </Stack>
        <ThemedAlert />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
