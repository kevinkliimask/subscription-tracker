import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { cn } from '~/utils/cn';

interface GradientButtonProps {
  onPress: () => void | Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'destructive';
  children: React.ReactNode;
  className?: string;
}

const gradientVariants = {
  primary: {
    colors: ['#0000FF', '#090979'] as const, // theme-blue to lighter blue
    start: { x: 0, y: 0 }, // top
    end: { x: 0, y: 1.2 }, // bottom
  },
  destructive: {
    colors: ['#FF0000', '#FF4040'] as const, // theme-red to lighter red
    start: { x: 0, y: 0 }, // top
    end: { x: 0, y: 1.2 }, // bottom
  },
} as const;

export function GradientButton({
  onPress,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  children,
  className,
}: GradientButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      className={cn('overflow-hidden rounded-xl active:opacity-80 disabled:opacity-50', className)}>
      <LinearGradient
        colors={gradientVariants[variant].colors}
        start={gradientVariants[variant].start}
        end={gradientVariants[variant].end}
        style={{ padding: 16 }}>
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <View className="flex-row items-center justify-center gap-2">{children}</View>
        )}
      </LinearGradient>
    </Pressable>
  );
}
