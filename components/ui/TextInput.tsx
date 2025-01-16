import { ComponentProps } from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { twMerge } from 'tailwind-merge';

type TextInputProps = ComponentProps<typeof RNTextInput> & {
  className?: string;
};

export function TextInput({ className, ...props }: TextInputProps) {
  return (
    <RNTextInput
      className={twMerge('rounded-xl bg-gray-100 p-3 text-sm text-gray-900', className)}
      placeholderTextColor="#6b7280"
      {...props}
    />
  );
}
