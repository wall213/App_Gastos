import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#1e2022',
    textSecondary: '#8c92a4',
    background: '#f7f8fa',
    cardBackground: '#ffffff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#8c92a4',
    tabIconSelected: '#3d5afe',
    tabBarBg: '#ffffff',
    accent: '#3d5afe',
    accentSecondary: '#ffffff',
    positive: '#1e8e3e',
    positiveText: '#1e8e3e',
    negative: '#d93025',
    border: '#f5f6f8',
    chartBg: '#e8eaff',
    fabBg: '#3d5afe',
    growthBadgeBg: '#e6f4ea',
  },
  dark: {
    text: '#ffffff',
    textSecondary: '#8c92a4',
    background: '#0b0f19',
    cardBackground: '#161f33',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#8c92a4',
    tabIconSelected: '#5b73ff', 
    tabBarBg: '#131b2c',
    accent: '#3d5afe',
    accentSecondary: '#334155',
    positive: '#df8d4f', 
    positiveText: '#df8d4f',
    negative: '#ff5252',
    border: '#212a3d',
    chartBg: '#212a3d',
    fabBg: '#212a3d',
    growthBadgeBg: 'rgba(223, 141, 79, 0.15)', 
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
