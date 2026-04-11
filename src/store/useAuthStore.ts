import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: any | null;
  initialized: boolean;
  profileLoaded: boolean;
  setSession: (session: Session | null) => void;
  setProfile: (profile: any | null) => void;
  setInitialized: (initialized: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  profile: null,
  initialized: false,
  profileLoaded: false,
  setSession: (session) => {
    const user = session?.user ?? null;
    const metadataProfile = user ? {
      nombre: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
      foto: user.user_metadata?.avatar_url || 'https://i.pravatar.cc/150',
      idauth_supabase: user.id
    } : null;

    set({ 
      session, 
      user,
      profile: metadataProfile, // Perfil "preview" inmediato
      initialized: true,
      profileLoaded: false // Reset until DB fetch completes
    });
  },
  setProfile: (profile) => set({ profile, profileLoaded: !!profile }),
  setInitialized: (initialized) => set({ initialized }),
  signOut: () => set({ session: null, user: null, profile: null, profileLoaded: false }),
}));
