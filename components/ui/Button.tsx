import { ActivityIndicator, Pressable, Text } from 'react-native';

import { cn } from '~/utils/cn';

interface ButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
}

export function Button({
  onPress,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  children,
  className,
}: ButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      className={cn(
        'rounded-xl p-4 active:opacity-80 disabled:opacity-50',
        isPrimary ? 'bg-theme-blue' : 'border border-gray-300',
        className
      )}>
      {isLoading ? (
        <ActivityIndicator color={isPrimary ? 'white' : 'black'} />
      ) : (
        <Text
          className={cn('text-center font-semibold', isPrimary ? 'text-white' : 'text-gray-900')}>
          {children}
        </Text>
      )}
    </Pressable>
  );
}
