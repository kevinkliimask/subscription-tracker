import { useLocalSearchParams } from 'expo-router';
import {
  CalendarCheck2,
  CalendarClock,
  DollarSign,
  LucideIcon,
  Plus,
  RefreshCw,
} from 'lucide-react-native';
import { View, Text, ScrollView } from 'react-native';

import SubscriptionLogo from '~/components/SubscriptionLogo';
import { useColors } from '~/hooks/useColors';
import { mockSubscriptions } from '~/mock/data';

const SubscriptionDetails = () => {
  const { colors } = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const subscription = mockSubscriptions.find((sub) => sub.id === id);

  if (!subscription) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Subscription not found</Text>
      </View>
    );
  }

  const { name, description, price, currency, logoUrl, startDate, billingCycle } = subscription;

  const InfoLabel = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: LucideIcon;
    label: string;
    value: string;
  }) => (
    <View className="items-center px-4">
      <Icon size={24} color={colors.icon} className="text-gray-600 dark:text-gray-300" />
      <Text className="mt-2 text-xs text-gray-500 dark:text-gray-400">{label}</Text>
      <Text className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{value}</Text>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
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
          value={new Date(startDate).toLocaleDateString()}
        />
        <InfoLabel icon={DollarSign} label="Amount" value={`${currency}${price.toFixed(2)}`} />
      </View>

      {/* Payments Section */}
      <View className="p-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">Payments</Text>
          <View className="flex-row gap-2">
            <RefreshCw size={20} className="text-gray-600 dark:text-gray-300" />
            <Plus size={20} className="text-gray-600 dark:text-gray-300" />
          </View>
        </View>

        {/* Payments Placeholder */}
        <View className="mt-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800">
          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <SubscriptionLogo name={name} logoUrl={logoUrl} size={40} />
              <View className="ml-3">
                <Text className="font-semibold text-gray-900 dark:text-white">{name}</Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleDateString()}
                </Text>
              </View>
            </View>
            <Text className="font-semibold text-gray-900 dark:text-white">
              {currency}
              {price.toFixed(2)}
            </Text>
          </View>

          <Text className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Previous payments will appear here
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default SubscriptionDetails;
