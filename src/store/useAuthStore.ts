import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: any | null;
  initialized: boolean;
  profileLoaded: boolean;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlyTotalsLoaded: boolean;
  setSession: (session: Session | null) => void;
  setProfile: (profile: any | null) => void;
  setInitialized: (initialized: boolean) => void;
  setMonthlyTotals: (income: number, expense: number) => void;
  addTransactionToMonthlyFlow: (amount: number, type: 'i' | 'g') => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  profile: null,
  initialized: false,
  profileLoaded: false,
  monthlyIncome: 0,
  monthlyExpense: 0,
  monthlyTotalsLoaded: false,
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
  setMonthlyTotals: (income, expense) => set({ 
    monthlyIncome: income, 
    monthlyExpense: expense, 
    monthlyTotalsLoaded: true 
  }),
  addTransactionToMonthlyFlow: (amount, type) => set((state) => ({
    monthlyIncome: type === 'i' ? state.monthlyIncome + amount : state.monthlyIncome,
    monthlyExpense: type === 'g' ? state.monthlyExpense + amount : state.monthlyExpense,
  })),
  signOut: () => set({ 
    session: null, 
    user: null, 
    profile: null, 
    profileLoaded: false,
    monthlyIncome: 0,
    monthlyExpense: 0,
    monthlyTotalsLoaded: false
  }),
}));
