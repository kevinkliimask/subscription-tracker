import { useRouter } from 'expo-router';
import {
  ChevronRight,
  Coins,
  MessageSquare,
  Mail,
  LogOut,
  LucideIcon,
  Book,
} from 'lucide-react-native';
import { View, Text, Pressable } from 'react-native';

import { GradientButton } from '~/components/ui/GradientButton';
import { useAuth } from '~/providers/AuthProvider';
import { useColors } from '~/hooks/useColors';

const MenuItem = ({
  icon,
  label,
  onPress,
}: {
  icon?: LucideIcon;
  label: string;
  onPress: () => void;
}) => {
  const { colors } = useColors();
  const Icon = icon;

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between border-b border-gray-100 py-4">
      <View className="flex w-full flex-row items-center justify-between px-8">
        <View className="flex-row items-center gap-4">
          {Icon && <Icon size={20} color={colors.icon} />}
          <Text className="text-base text-gray-900">{label}</Text>
        </View>
        <ChevronRight size={20} color={colors.icon} />
      </View>
    </Pressable>
  );
};

export default function ProfileScreen() {
  const { signOut, session } = useAuth();
  const router = useRouter();
  const { colors } = useColors();

  return (
    <View className="flex-1 bg-white">
      {/* Account Details Section */}
      <View className="border-b border-gray-100 p-6 text-center">
        <Text className="text-center text-2xl font-bold text-gray-900">Account</Text>
        <Text className="mt-2 text-center text-base text-gray-600">{session?.user.email}</Text>
      </View>

      {/* Menu Items */}
      <View>
        <MenuItem
          icon={Book}
          label="Categories"
          onPress={() => {
            // TODO: Navigate to Categories
          }}
        />
        <MenuItem
          icon={Coins}
          label="Currencies"
          onPress={() => {
            // TODO: Navigate to Currencies
          }}
        />
        <MenuItem
          icon={MessageSquare}
          label="Leave feedback"
          onPress={() => {
            // TODO: Navigate to Feedback
          }}
        />
        <MenuItem
          icon={Mail}
          label="Contact"
          onPress={() => {
            // TODO: Navigate to Contact
          }}
        />

        {/* Logout Button */}
        {signOut && (
          <GradientButton onPress={signOut} className="mx-8 mt-8" variant="destructive">
            <LogOut size={16} color="#fff" />
            <Text className="font-semibold text-white">Log out</Text>
          </GradientButton>
        )}
      </View>
    </View>
  );
}
