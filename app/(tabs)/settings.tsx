import { router } from 'expo-router';
import { View, Text, Pressable } from 'react-native';

import { supabase } from '~/utils/supabase';

export default function SettingsScreen() {
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Pressable
        onPress={handleLogout}
        className="mt-4 rounded-xl bg-red-500 p-4 active:opacity-80">
        <Text className="text-center font-semibold text-white">Logout</Text>
      </Pressable>
    </View>
  );
}
