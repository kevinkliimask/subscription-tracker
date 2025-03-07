import { LinearGradient } from 'expo-linear-gradient';
import { MenuView } from '@react-native-menu/menu';
import { router } from 'expo-router';
import { View, Text, Pressable, Platform } from 'react-native';

import { cn } from '~/utils/cn';
import { formatLocalDate, getNextBillingDate, getTimeUntilNextPayment } from '~/utils/date';
import { Subscription } from '~/types/subscription';
import SubscriptionLogo from '~/components/SubscriptionLogo';

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
          style={{ paddingRight: 8, paddingLeft: 8, paddingTop: 4, paddingBottom: 4 }}>
          <BadgeContent />
        </LinearGradient>
      ) : (
        <View className={cn('px-2 py-1', baseStyle)}>
          <BadgeContent />
        </View>
      )}
    </View>
  );
};

type SubscriptionItemProps = {
  subscription: Subscription;
  onDeletePress?: () => void;
};

const SubscriptionItem = ({ subscription, onDeletePress }: SubscriptionItemProps) => {
  const { id, name, price, currency, logoUrl, startDate, billingCycle } = subscription;
  const nextBillingDate = getNextBillingDate(startDate, billingCycle);
  const timeUntilNext = getTimeUntilNextPayment(nextBillingDate);

  // Calculate days until payment
  const daysUntilPayment = Math.ceil(
    (new Date(nextBillingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleMenuAction = ({ nativeEvent }: { nativeEvent: { event: string } }) => {
    switch (nativeEvent.event) {
      case 'edit':
        router.push(`/subscriptions/edit?id=${id}`);
        break;
      case 'delete':
        onDeletePress?.();
        break;
    }
  };

  const menuActions = [
    {
      id: 'edit',
      title: 'Edit Subscription',
      image: Platform.select({
        ios: 'square.and.pencil',
        android: 'ic_menu_edit',
      }),
    },
    {
      id: 'delete',
      title: 'Delete Subscription',
      attributes: {
        destructive: true,
      },
      image: Platform.select({
        ios: 'trash',
        android: 'ic_menu_delete',
      }),
    },
  ];

  return (
    <MenuView onPressAction={handleMenuAction} actions={menuActions} shouldOpenOnLongPress>
      <Pressable
        onPress={() => router.push(`/subscriptions/${id}`)}
        className="flex-row items-center rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800">
        <SubscriptionLogo name={name} logoUrl={logoUrl} size={48} />

        <View className="ml-4 flex-1">
          <Text className="text-base font-semibold text-gray-900 dark:text-white">{name}</Text>
          <View className="flex-row items-center gap-4">
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Next payment:{'\n'}
              {formatLocalDate(new Date(nextBillingDate))}
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
    </MenuView>
  );
};

export default SubscriptionItem;
