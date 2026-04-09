import { create } from 'zustand';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  name: string;
  category: string;
  time: string;
  account: string;
  amount: number;
  icon: string;
}

interface Category {
  id: string;
  name: string;
  type: string;
  amount: number;
  transactions: number;
  icon: string;
}

interface AppState {
  balance: number;
  growth: number;
  transactions: Transaction[];
  categories: Category[];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  balance: 42850.00,
  growth: 12.4,
  transactions: [
    { id: '1', type: 'expense', name: 'Apple Store Online', category: 'Subscription', time: '2 hours ago', account: 'PERSONAL', amount: -14.99, icon: 'shopping-bag' },
    { id: '2', type: 'income', name: 'Invoice #8829 Payment', category: 'Income', time: '5 hours ago', account: 'CLIENT PROJECT', amount: 1250.00, icon: 'file-text' },
    { id: '3', type: 'expense', name: 'Don Torta', category: 'Food', time: 'Yesterday', account: 'TORTAS', amount: -22.50, icon: 'fastfood' },
  ],
  categories: [
    { id: '1', name: 'Tortas', type: 'FOOD & DINING', amount: 420.50, transactions: 12, icon: 'fastfood' },
    { id: '2', name: 'Local', type: 'RENT & UTILITIES', amount: 2800.00, transactions: 2, icon: 'storefront' },
    { id: '3', name: 'Personal', type: 'LEISURE & HEALTH', amount: 890.25, transactions: 8, icon: 'person' },
  ],
  theme: 'dark', // Starting with dark based on user liking the reference
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));
