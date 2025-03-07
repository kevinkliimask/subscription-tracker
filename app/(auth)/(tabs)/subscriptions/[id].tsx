import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { CalendarCheck2, CalendarClock, DollarSign, LucideIcon } from 'lucide-react-native';
import { View, Text, ScrollView } from 'react-native';

import {
  getNextBillingDate,
  getTimeUntilNextPayment,
  getPaymentDates,
  formatLocalDate,
} from '~/utils/date';
import { getSubscriptions } from '~/utils/supabase';
import { useColors } from '~/hooks/useColors';
import PaymentHistoryItem from '~/components/PaymentHistoryItem';
import SubscriptionLogo from '~/components/SubscriptionLogo';

const SubscriptionDetails = () => {
  const { colors } = useColors();
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

  const { name, description, price, currency, logoUrl, startDate, billingCycle } = subscription;

  const nextBillingDate = getNextBillingDate(startDate, billingCycle);
  const paymentDates = getPaymentDates(startDate, billingCycle);

  const InfoLabel = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: LucideIcon;
    label: string;
    value: string | React.ReactNode;
  }) => (
    <View className="items-center px-4">
      <Icon size={24} color={colors.icon} className="text-gray-600 dark:text-gray-300" />
      <Text className="mt-2 text-xs text-gray-500 dark:text-gray-400">{label}</Text>
      <Text className="mt-1 text-center font-semibold leading-6 text-gray-900 dark:text-white">
        {value}
      </Text>
    </View>
  );

  return (
    <ScrollView className="flex-1 dark:bg-gray-900">
      {/* Header Section */}
      <View className="items-center p-4">
        <SubscriptionLogo name={name} logoUrl={logoUrl} size={96} />
        <Text className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{name}</Text>
        {description && (
          <Text className="mt-2 text-center text-gray-500 dark:text-gray-400">{description}</Text>
        )}
      </View>

      {/* Billing Cycle Info */}
      <View className="flex-row justify-around border-y border-gray-100 bg-gray-50 py-6 dark:border-gray-800 dark:bg-gray-800/50">
        <InfoLabel icon={CalendarClock} label="Billing Cycle" value={`Every ${billingCycle}`} />
        <InfoLabel
          icon={CalendarCheck2}
          label="Next Payment"
          value={`${formatLocalDate(new Date(nextBillingDate))}\n${getTimeUntilNextPayment(nextBillingDate)}`}
        />
        <InfoLabel icon={DollarSign} label="Amount" value={`${currency} ${price.toFixed(2)}`} />
      </View>

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
          {/* <View className="flex-row gap-2">
            <RefreshCw size={20} className="text-gray-600 dark:text-gray-300" />
            <Plus size={20} className="text-gray-600 dark:text-gray-300" />
          </View> */}
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
