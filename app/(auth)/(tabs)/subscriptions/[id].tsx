import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView } from 'react-native';

import { getSubscriptions } from '~/utils/supabase';
import PaymentHistoryItem from '~/components/PaymentHistoryItem';
import SubscriptionLogo from '~/components/SubscriptionLogo';
import SubscriptionDetailsGrid from '~/components/SubscriptionDetailsGrid';
import { getPaymentDates } from '~/utils/date';

const SubscriptionDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: subscriptions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: getSubscriptions,
  });

  const subscription = subscriptions?.find((sub) => sub.id === id);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Loading subscription details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">Failed to load subscription details</Text>
      </View>
    );
  }

  if (!subscription) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Subscription not found</Text>
      </View>
    );
  }

  const { name, description, price, currency, logoUrl, startDate } = subscription;
  const paymentDates = getPaymentDates(startDate, subscription.billingCycle);

  return (
    <ScrollView className="flex-1 dark:bg-gray-900">
      {/* Header Section */}
      <View className="items-center p-4">
        <SubscriptionLogo name={name} logoUrl={logoUrl} size={96} />
        <Text className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{name}</Text>
        {description && (
          <Text className="mt-2 text-gray-600 dark:text-gray-300">{description}</Text>
        )}
      </View>

      <SubscriptionDetailsGrid subscription={subscription} />

      {/* Payments Section */}
      <View className="p-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">Payments</Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-gray-600 dark:text-gray-300">
              Total ({paymentDates.length} payments)
            </Text>
            <Text className="font-semibold text-gray-900 dark:text-white">
              {currency} {(price * paymentDates.length).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Payments History */}
        {paymentDates.length > 0 && (
          <View className="mt-4 flex-col gap-3">
            {paymentDates.map((date) => (
              <PaymentHistoryItem
                key={date.toISOString()}
                name={name}
                logoUrl={logoUrl}
                currency={currency}
                price={price}
                date={date}
              />
            ))}
          </View>
        )}

        {paymentDates.length === 0 && (
          <Text className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Previous payments will appear here
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

export default SubscriptionDetails;
