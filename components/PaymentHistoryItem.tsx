import { View, Text } from 'react-native';

import { formatLocalDate } from '~/utils/date';
import SubscriptionLogo from './SubscriptionLogo';

type PaymentHistoryItemProps = {
  name: string;
  logoUrl?: string | null;
  currency: string;
  price: number;
  date: Date;
};

const PaymentHistoryItem = ({ name, logoUrl, currency, price, date }: PaymentHistoryItemProps) => {
  return (
    <View className="flex-row items-center justify-between rounded-2xl bg-white p-4 py-3 shadow-sm dark:bg-gray-800">
      <View className="flex-row items-center">
        <SubscriptionLogo name={name} logoUrl={logoUrl} size={48} />
        <View className="ml-4">
          <Text className="font-semibold text-gray-900 dark:text-white">{name}</Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">{formatLocalDate(date)}</Text>
        </View>
      </View>
      <Text className="font-semibold text-gray-900 dark:text-white">
        {currency} {price.toFixed(2)}
      </Text>
    </View>
  );
};

export default PaymentHistoryItem;
