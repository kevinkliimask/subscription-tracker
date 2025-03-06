import { Stack } from 'expo-router';

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="subscriptions/add"
        options={{
          title: 'Add Subscription',
          headerBackTitle: 'Cancel',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="subscriptions/edit"
        options={{
          title: 'Edit Subscription',
          headerBackTitle: 'Cancel',
          headerTitleAlign: 'center',
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
