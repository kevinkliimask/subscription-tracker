import { Stack } from 'expo-router';
import { Pencil } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

import { useColors } from '~/hooks/useColors';
import { mockSubscriptions } from '~/mock/data';

export default function SubscriptionsLayout() {
  const { colors } = useColors();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Subscriptions' }} />
      <Stack.Screen
        name="[id]"
        options={({ route }) => ({
          title:
            mockSubscriptions.find((sub) => sub.id === (route.params as { id: number }).id)?.name ??
            'Subscription',
          headerRight: () => (
            <TouchableOpacity className="mr-4">
              <Pencil size={24} color={colors.icon} />
            </TouchableOpacity>
          ),
          headerBackTitle: 'Back',
        })}
      />
    </Stack>
  );
}
