import { FlatList } from 'react-native';

import { mockSubscriptions } from '~/app/mock/data';
import SubscriptionItem from '~/components/SubscriptionItem';

export default function Home() {
  return (
    <FlatList
      data={mockSubscriptions}
      renderItem={({ item }) => <SubscriptionItem subscription={item} />}
      keyExtractor={(item) => item.id}
      contentContainerClassName="p-4"
    />
  );
}
