import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { supabase } from '~/utils/supabase';

export default function Index() {
  const [session, setSession] = useState<null | boolean>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(!!session);
    });
  }, []);

  if (session === null) {
    return <View />;
  }

  return <Redirect href={session ? '/subscriptions' : '/login'} />;
}
