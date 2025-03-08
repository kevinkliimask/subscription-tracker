import React from 'react';
import { FlatList, View, Text, ActivityIndicator } from 'react-native';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { DeleteSubscriptionAlert } from '~/components/DeleteSubscriptionAlert';
import { getNextBillingDate } from '~/utils/date';
import { getSubscriptions } from '~/utils/supabase';
import { Subscription } from '~/types/subscription';
import FloatingActionButton from '~/components/FloatingActionButton';
import SubscriptionItem from '~/components/SubscriptionItem';

export default function Home() {
  const router = useRouter();

  const [subscriptionToDelete, setSubscriptionToDelete] = useState<Subscription | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: subscriptions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: getSubscriptions,
  });

  // Sort subscriptions by next payment date, with ended subscriptions at the end
  const sortedSubscriptions = useMemo(() => {
    if (!subscriptions) return [];
    return [...subscriptions].sort((a, b) => {
      const nextDateA = getNextBillingDate(a.startDate, a.billingCycle, a.endDate ?? undefined);
      const nextDateB = getNextBillingDate(b.startDate, b.billingCycle, b.endDate ?? undefined);

      // If both are ended (null), maintain original order
      if (!nextDateA && !nextDateB) return 0;
      // If A is ended, move it to the end
      if (!nextDateA) return 1;
      // If B is ended, move it to the end
      if (!nextDateB) return -1;

      // For active subscriptions, sort by next payment date
      return new Date(nextDateA).getTime() - new Date(nextDateB).getTime();
    });
  }, [subscriptions]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#ffffff" />
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
      {isDeleting && (
        <View className="absolute inset-0 flex-1 items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="mt-4 text-white">Deleting subscription...</Text>
        </View>
      )}
      <FlatList
        data={sortedSubscriptions}
        renderItem={({ item }) => (
          <SubscriptionItem
            subscription={item}
            onDeletePress={() => setSubscriptionToDelete(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4 gap-3"
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
      {subscriptionToDelete && (
        <DeleteSubscriptionAlert
          subscription={subscriptionToDelete}
          show={!!subscriptionToDelete}
          onDismiss={() => setSubscriptionToDelete(null)}
          onSubmitStart={() => setIsDeleting(true)}
          onSubmitEnd={() => setIsDeleting(false)}
        />
      )}
    </>
  );
}
