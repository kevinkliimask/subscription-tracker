import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

import { Database } from '~/types/database.types';
import { Subscription } from '~/types/subscription';
import { objectToSnakeCase } from '~/utils/case';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export async function addSubscription(subscription: Omit<Subscription, 'id'>) {
  const { data, error } = await supabase
    .from('subscriptions')
    .insert([objectToSnakeCase(subscription)])
    .select(
      'name,description,logoUrl:logo_url,category,price,currency,billingCycle:billing_cycle,startDate:start_date,endDate:end_date,isActive:is_active'
    )
    .single();

  if (error) {
    throw error;
  }

  return data as Subscription;
}
