import { router } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import SubscriptionLogo from '~/components/SubscriptionLogo';
import { Subscription } from '~/types/subscription';
import { formatLocalDate, getNextBillingDate, getTimeUntilNextPayment } from '~/utils/date';
import { cn } from '~/utils/cn';

type PaymentBadgeProps = {
  timeUntilNext: string;
  daysUntilPayment: number;
};

const PaymentBadge = ({ timeUntilNext, daysUntilPayment }: PaymentBadgeProps) => {
  // Define badge styles based on urgency
  const getBadgeStyle = () => {
    if (daysUntilPayment <= 0) {
      // Due today or overdue - red gradient
      return {
        colors: ['#FF6B6B', '#FF8787'] as const,
        textColor: 'text-white',
        baseStyle: 'bg-red-500',
      };
    }
    if (daysUntilPayment <= 3) {
      // Due soon - orange gradient
      return {
        colors: ['#FFA07A', '#FFB88C'] as const,
        textColor: 'text-white',
        baseStyle: 'bg-orange-500',
      };
    }
    // Default - no gradient
    return {
      colors: undefined,
      textColor: 'text-gray-600 dark:text-gray-300',
      baseStyle: 'bg-gray-100 dark:bg-gray-700',
    };
  };

  const { colors, textColor, baseStyle } = getBadgeStyle();

  const BadgeContent = () => (
    <Text className={cn('text-xs font-medium', textColor)}>{timeUntilNext}</Text>
  );

  return (
    <View className="items-center justify-center overflow-hidden rounded-full">
      {colors ? (
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-2 py-1">
          <BadgeContent />
        </LinearGradient>
      ) : (
        <View className={`px-2 py-1 ${baseStyle}`}>
          <BadgeContent />
        </View>
      )}
    </View>
  );
};

type SubscriptionItemProps = {
  subscription: Subscription;
};

const SubscriptionItem = ({ subscription }: SubscriptionItemProps) => {
  const { id, name, price, currency, logoUrl, startDate, billingCycle } = subscription;
  const nextBillingDate = getNextBillingDate(startDate, billingCycle);
  const timeUntilNext = getTimeUntilNextPayment(nextBillingDate);

  // Calculate days until payment
  const daysUntilPayment = Math.ceil(
    (new Date(nextBillingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Pressable
      onPress={() => router.push(`/subscriptions/${id}`)}
      className="mb-3 flex-row items-center rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800">
      <SubscriptionLogo name={name} logoUrl={logoUrl} size={48} />

      <View className="ml-4 flex-1">
        <Text className="text-base font-semibold text-gray-900 dark:text-white">{name}</Text>
        <View className="flex-row items-center gap-2">
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            Next payment: {formatLocalDate(new Date(nextBillingDate))}
          </Text>
          <PaymentBadge timeUntilNext={timeUntilNext} daysUntilPayment={daysUntilPayment} />
        </View>
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
