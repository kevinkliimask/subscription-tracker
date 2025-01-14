import { Link, router } from 'expo-router';
import { View, Text, Pressable } from 'react-native';

import SubscriptionLogo from '~/components/SubscriptionLogo';
import { Subscription } from '~/types/subscription';

type SubscriptionItemProps = {
  subscription: Subscription;
};

const SubscriptionItem = ({ subscription }: SubscriptionItemProps) => {
  const { id, name, price, currency, logoUrl, startDate, billingCycle } = subscription;

  const getNextBillingDate = (date: Date, cycle: string) => {
    const currentDate = new Date(date);
    switch (cycle) {
      case 'week':
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case 'month':
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      case 'quarter':
        currentDate.setMonth(currentDate.getMonth() + 3);
        break;
      case 'year':
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        break;
    }

    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    return currentDate.toLocaleDateString(undefined, options);
  };

  return (
    <Pressable
      onPress={() => router.push(`/subscriptions/${id}`)}
      className="mb-3 flex-row items-center rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800">
      <SubscriptionLogo name={name} logoUrl={logoUrl} size={48} />

      <View className="ml-4 flex-1">
        <Text className="text-base font-semibold text-gray-900 dark:text-white">{name}</Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          Next payment: {getNextBillingDate(startDate, billingCycle)}
        </Text>
      </View>

      <View className="items-end">
        <Text className="text-base font-semibold text-gray-900 dark:text-white">
          {currency} {price.toFixed(2)}
        </Text>
        <Text className="text-xs capitalize text-gray-500 dark:text-gray-400">
          per {billingCycle}
        </Text>
      </View>
    </Pressable>
  );
};

export default SubscriptionItem;
