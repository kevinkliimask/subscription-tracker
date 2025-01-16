import { BottomSheetView } from '@gorhom/bottom-sheet';
import { X } from 'lucide-react-native';
import { Text, Pressable, View, TextInput } from 'react-native';

import { Sheet, useSheetRef } from '~/components/ui/Sheet';
import { cn } from '~/utils/cn';

type Option = {
  label: string;
  value: string;
};

type PickerProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  options: Option[];
  label?: string;
  placeholder?: string;
  emptyAllowed?: boolean;
};

export function Picker({
  value,
  onChange,
  options,
  label,
  placeholder,
  emptyAllowed,
}: PickerProps) {
  const bottomSheetRef = useSheetRef();

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (newValue: string) => {
    onChange(newValue);
    bottomSheetRef.current?.dismiss();
  };

  const handleClear = () => {
    onChange(null);
  };

  const handlePress = () => {
    const currentFocus = TextInput.State.currentlyFocusedInput();
    if (currentFocus) {
      TextInput.State.blurTextInput(currentFocus);
    }
    bottomSheetRef.current?.present();
  };

  return (
    <>
      <View className="relative">
        <Pressable onPress={handlePress} className="rounded-xl bg-gray-100 p-3">
          <Text className={cn('text-sm', !selectedOption?.label && 'text-gray-500')}>
            {selectedOption?.label || placeholder || 'Select an option'}
          </Text>
        </Pressable>
        {emptyAllowed && selectedOption && (
          <Pressable
            onPress={handleClear}
            className="absolute right-2 top-0 h-full justify-center px-1 active:opacity-70">
            <X size={18} color="#6b7280" />
          </Pressable>
        )}
      </View>

      <Sheet ref={bottomSheetRef}>
        <BottomSheetView className="flex-1 p-4 pb-12">
          {label && <Text className="mb-4 text-center text-base font-medium">{label}</Text>}
          <View className="flex flex-col gap-1">
            {options.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => handleSelect(option.value)}
                className={cn(
                  'rounded-lg p-3',
                  option.value === value ? 'bg-theme-blue/10' : 'active:bg-gray-100'
                )}>
                <Text
                  className={cn(
                    'text-base',
                    option.value === value ? 'text-theme-blue font-medium' : 'text-gray-900'
                  )}>
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </BottomSheetView>
      </Sheet>
    </>
  );
}
