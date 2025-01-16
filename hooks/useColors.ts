import { useColorScheme } from 'react-native';

export function useColors() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    colors: {
      icon: isDark ? '#9CA3AF' : '#4B5563', // gray-400 : gray-600
      text: isDark ? '#F9FAFB' : '#111827', // gray-50 : gray-900
      textMuted: isDark ? '#9CA3AF' : '#6B7280', // gray-400 : gray-500
      background: isDark ? '#111827' : '#FFFFFF', // gray-900 : white
      backgroundMuted: isDark ? '#1F2937' : '#F9FAFB', // gray-800 : gray-50
      border: isDark ? '#1f2937' : '#f3f4f6', // gray-800 : gray-100
    },
  };
}
