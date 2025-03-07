import { router } from 'expo-router';
import { View, Text, Pressable } from 'react-native';

import SubscriptionLogo from '~/components/SubscriptionLogo';
import { Subscription } from '~/types/subscription';
import { formatLocalDate, getNextBillingDate } from '~/utils/date';

type SubscriptionItemProps = {
  subscription: Subscription;
};

const SubscriptionItem = ({ subscription }: SubscriptionItemProps) => {
  const { id, name, price, currency, logoUrl, startDate, billingCycle } = subscription;
  const nextBillingDate = getNextBillingDate(startDate, billingCycle);

  return (
    <Pressable
      onPress={() => router.push(`/subscriptions/${id}`)}
      className="mb-3 flex-row items-center rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800">
      <SubscriptionLogo name={name} logoUrl={logoUrl} size={48} />

      <View className="ml-4 flex-1">
        <Text className="text-base font-semibold text-gray-900 dark:text-white">{name}</Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          Next payment: {formatLocalDate(new Date(nextBillingDate))}
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
