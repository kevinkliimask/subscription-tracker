import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import SubscriptionForm from '~/components/forms/SubscriptionForm';
import { getSubscriptions } from '~/utils/supabase';

export default function EditSubscription() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: subscriptions } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: getSubscriptions,
  });

  const subscription = subscriptions?.find((sub) => sub.id === id);

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <SubscriptionForm mode="edit" subscription={subscription} />
    </View>
  );
} 