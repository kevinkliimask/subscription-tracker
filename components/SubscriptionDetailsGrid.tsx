import {
  Calendar,
  CalendarCheck2,
  CalendarClock,
  CalendarOff,
  Code2,
  DollarSign,
  Dumbbell,
  Folder,
  Gamepad2,
  LucideIcon,
  Music2,
  Newspaper,
  PlaySquare,
} from 'lucide-react-native';
import { View, Text } from 'react-native';

import { formatLocalDate, getNextBillingDate, getTimeUntilNextPayment } from '~/utils/date';
import { Subscription } from '~/types/subscription';
import { useColors } from '~/hooks/useColors';

// Map categories to icons
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Streaming: PlaySquare,
  Music: Music2,
  Gaming: Gamepad2,
  Fitness: Dumbbell,
  News: Newspaper,
  Software: Code2,
  Other: Folder,
};

type InfoLabelProps = {
  icon: LucideIcon;
  label: string;
  value: string | React.ReactNode;
};

const InfoLabel = ({ icon: Icon, label, value }: InfoLabelProps) => {
  const { colors } = useColors();
  return (
    <View className="items-center py-6">
      <Icon size={24} color={colors.icon} className="text-gray-600 dark:text-gray-300" />
      <Text className="mt-2 text-xs text-gray-500 dark:text-gray-400">{label}</Text>
      <Text className="mt-1 text-center font-semibold leading-6 text-gray-900 dark:text-white">
        {value}
      </Text>
    </View>
  );
};

type SubscriptionDetailsGridProps = {
  subscription: Subscription;
};

export default function SubscriptionDetailsGrid({ subscription }: SubscriptionDetailsGridProps) {
  const { startDate, billingCycle, category, endDate, price, currency } = subscription;

  const nextBillingDate = getNextBillingDate(startDate, billingCycle);

  return (
    <View className="bg-white dark:border-gray-800 dark:bg-gray-800/50">
      {/* First Row - Always 3 columns */}
      <View className="flex-row">
        <View className="flex-1">
          <InfoLabel icon={CalendarClock} label="Billing Cycle" value={`Every ${billingCycle}`} />
        </View>
        <View className="flex-1">
          <InfoLabel
            icon={CalendarCheck2}
            label="Next Payment"
            value={`${formatLocalDate(new Date(nextBillingDate))}\n${getTimeUntilNextPayment(nextBillingDate)}`}
          />
        </View>
        <View className="flex-1">
          <InfoLabel icon={DollarSign} label="Amount" value={`${currency} ${price.toFixed(2)}`} />
        </View>
      </View>

      {/* Second Row - Optional items */}
      {(category || startDate || endDate) && (
        <View className="dark:border-gray-800">
          <View className="flex-row justify-center">
            {category && (
              <View className="flex-1">
                <InfoLabel
                  icon={CATEGORY_ICONS[category] || Folder}
                  label="Category"
                  value={category}
                />
              </View>
            )}
            <View className="flex-1">
              <InfoLabel
                icon={Calendar}
                label="Start Date"
                value={formatLocalDate(new Date(startDate))}
              />
            </View>
            {endDate && (
              <View className="flex-1">
                <InfoLabel
                  icon={CalendarOff}
                  label="End Date"
                  value={formatLocalDate(new Date(endDate))}
                />
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
