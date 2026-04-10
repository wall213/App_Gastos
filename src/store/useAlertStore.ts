import { create } from 'zustand';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertState {
  visible: boolean;
  title: string;
  message: string;
  type: AlertType;
  buttons: AlertButton[];
  showAlert: (config: {
    title: string;
    message: string;
    type?: AlertType;
    buttons?: AlertButton[];
  }) => void;
  hideAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  visible: false,
  title: '',
  message: '',
  type: 'info',
  buttons: [],
  showAlert: ({ title, message, type = 'info', buttons = [{ text: 'OK' }] }) => 
    set({ visible: true, title, message, type, buttons }),
  hideAlert: () => set({ visible: false }),
}));
