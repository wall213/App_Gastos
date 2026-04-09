import { useAppStore } from '@/src/store/useAppStore';
import { Colors } from '@/constants/theme';

export function useThemeColors() {
  const theme = useAppStore((state) => state.theme);
  return Colors[theme];
}
