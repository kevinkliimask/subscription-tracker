import { Tabs } from 'expo-router';
import { Cog } from 'lucide-react-native';

import { Subscription } from '~/components/icons';

const TabLayout = () => {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="subscriptions"
        options={{
          title: 'Subscriptions',
          headerShown: false,
          tabBarIcon: ({ color }) => <Subscription size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Logout',
          tabBarIcon: ({ color }) => <Cog size={28} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
