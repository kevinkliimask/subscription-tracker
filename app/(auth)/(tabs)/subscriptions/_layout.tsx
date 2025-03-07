import { Stack, useRouter } from 'expo-router';
import { Pencil, User } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

import { useColors } from '~/hooks/useColors';
import { mockSubscriptions } from '~/mock/data';

export default function SubscriptionsLayout() {
  const { colors } = useColors();
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Subscriptions',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/settings')}>
              <User size={24} color={colors.icon} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="[id]"
        options={({ route }) => ({
          title:
            mockSubscriptions.find((sub) => sub.id === (route.params as { id: string }).id)?.name ??
            'Subscription',
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                router.push(`/subscriptions/edit?id=${(route.params as { id: string }).id}`)
              }>
              <Pencil size={24} color={colors.icon} />
            </TouchableOpacity>
          ),
          headerBackTitle: 'Back',
        })}
      />
    </Stack>
  );
}
