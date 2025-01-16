import { useNavigation } from 'expo-router';
import { View } from 'react-native';

import SubscriptionForm from '~/components/forms/SubscriptionForm';

export default function AddSubscription() {
  const navigation = useNavigation();

  return (
    <View className="p-4">
      <SubscriptionForm onSubmit={() => navigation.goBack()} />
    </View>
  );
}
