import { View, Text, Pressable } from 'react-native';

import { useAuth } from '~/providers/AuthProvider';

export default function SettingsScreen() {
  const { signOut } = useAuth();

  return (
    <View className="flex-1 bg-white p-4">
      <Pressable onPress={signOut} className="mt-4 rounded-xl bg-red-500 p-4 active:opacity-80">
        <Text className="text-center font-semibold text-white">Logout</Text>
      </Pressable>
    </View>
  );
}
