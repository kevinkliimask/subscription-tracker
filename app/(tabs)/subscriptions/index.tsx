import { useRouter } from 'expo-router';
import { FlatList } from 'react-native';

import FloatingActionButton from '~/components/FloatingActionButton';
import SubscriptionItem from '~/components/SubscriptionItem';
import { mockSubscriptions } from '~/mock/data';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <FlatList
        data={mockSubscriptions}
        renderItem={({ item }) => <SubscriptionItem subscription={item} />}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4"
      />
      <FloatingActionButton
        onPress={() => {
          router.push('/subscriptions/add');
        }}
      />
    </>
  );
}
