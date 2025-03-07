import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { FlatList, View, Text, ActivityIndicator } from 'react-native';
import React from 'react';

import FloatingActionButton from '~/components/FloatingActionButton';
import SubscriptionItem from '~/components/SubscriptionItem';
import { getSubscriptions } from '~/utils/supabase';
import { getNextBillingDate } from '~/utils/date';

export default function Home() {
  const router = useRouter();
  const {
    data: subscriptions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: getSubscriptions,
  });

  // Sort subscriptions by next payment date
  const sortedSubscriptions = React.useMemo(() => {
    if (!subscriptions) return [];
    return [...subscriptions].sort((a, b) => {
      const dateA = new Date(getNextBillingDate(a.startDate, a.billingCycle));
      const dateB = new Date(getNextBillingDate(b.startDate, b.billingCycle));
      return dateA.getTime() - dateB.getTime();
    });
  }, [subscriptions]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-gray-500">Loading subscriptions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">Failed to load subscriptions</Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={sortedSubscriptions}
        renderItem={({ item }) => <SubscriptionItem subscription={item} />}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4"
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-gray-500">No subscriptions yet</Text>
          </View>
        }
      />
      <FloatingActionButton
        onPress={() => {
          router.push('/subscriptions/add');
        }}
      />
    </>
  );
}
