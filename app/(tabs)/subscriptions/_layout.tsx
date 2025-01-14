import { Stack } from 'expo-router';
import { Pencil } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

import { mockSubscriptions } from '~/app/mock/data';
import { useColors } from '~/hooks/useColors';

export default function SubscriptionsLayout() {
  const { icon } = useColors();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Subscriptions' }} />
      <Stack.Screen
        name="[id]"
        options={({ route }) => ({
          title:
            mockSubscriptions.find((sub) => sub.id === (route.params as { id: string }).id)?.name ??
            'Subscription',
          headerRight: () => (
            <TouchableOpacity className="mr-4">
              <Pencil size={24} color={icon} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack>
  );
}
