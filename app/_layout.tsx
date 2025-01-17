import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import '../global.css';
import { AuthProvider, useAuth } from '~/providers/AuthProvider';
import { QueryProvider } from '~/providers/QueryProvider';

const InitialLayout = () => {
  const { session, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    // Check if the path/url is in the (auth) group
    const inAuthGroup = segments[0] === '(auth)';

    if (session && !inAuthGroup) {
      router.replace('/subscriptions');
    } else if (!session) {
      router.replace('/');
    }
  }, [session, initialized]);

  return <Slot />;
};

const RootLayout = () => {
  return (
    <QueryProvider>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <InitialLayout />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </AuthProvider>
    </QueryProvider>
  );
};

export default RootLayout;
