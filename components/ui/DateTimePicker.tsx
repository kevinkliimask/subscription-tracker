import RNDateTimePicker from '@react-native-community/datetimepicker';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { Text, Pressable, View, Platform } from 'react-native';

import { cn } from '~/utils/cn';

type DateTimePickerProps = {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  emptyAllowed?: boolean;
};

export function DateTimePicker({
  value,
  onChange,
  placeholder = 'Select date',
  emptyAllowed = false,
}: DateTimePickerProps) {
  const [show, setShow] = useState(false);

  const datePicker = (
    <RNDateTimePicker
      value={value || new Date()}
      onChange={(event, date) => {
        setShow(false);
        if (date && event.type !== 'dismissed') {
          onChange(emptyAllowed && date.getTime() === new Date().getTime() ? null : date);
        }
      }}
      onTouchCancel={() => setShow(false)}
      mode="date"
    />
  );

  if (Platform.OS === 'ios') {
    return (
      <View className="justify-center">
        <View pointerEvents="none" className="absolute z-10 w-full rounded-xl bg-gray-100 p-3">
          <Text className={cn(value ? '' : 'text-gray-500', 'text-sm')}>
            {value ? value.toLocaleDateString() : placeholder}
          </Text>
        </View>
        {datePicker}
        {emptyAllowed && value && (
          <Pressable
            onPress={() => onChange(null)}
            className="absolute right-2 top-0 z-20 h-full justify-center px-1 active:opacity-70">
            <X size={18} color="#6b7280" />
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <>
      <View className="relative">
        <Pressable onPress={() => setShow(true)} className="rounded-xl bg-gray-100 p-3">
          <Text className={cn(value ? '' : 'text-gray-500', 'text-sm')}>
            {value ? value.toLocaleDateString() : placeholder}
          </Text>
        </Pressable>
        {emptyAllowed && value && (
          <Pressable
            onPress={() => onChange(null)}
            className="absolute right-2 top-0 h-full justify-center px-1 active:opacity-70">
            <X size={18} color="#6b7280" />
          </Pressable>
        )}
      </View>
      {show && datePicker}
    </>
  );
}
