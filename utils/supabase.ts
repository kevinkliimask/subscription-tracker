import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

import { Database } from '~/types/database.types';
import { Subscription } from '~/types/subscription';
import { objectToSnakeCase } from '~/utils/case';
import { uploadSubscriptionImage } from '~/utils/storage';

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

export async function addSubscription(subscription: Omit<Subscription, 'id'>, imageFile?: any) {
  // First, handle image upload if provided
  let logoUrl: string | undefined;
  if (imageFile) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not found');

    logoUrl = await uploadSubscriptionImage(imageFile, user.id);
  }

  // Create subscription with the logo URL if we have one
  const subscriptionData = {
    ...subscription,
    logoUrl,
  };

  const { data, error } = await supabase
    .from('subscriptions')
    .insert([objectToSnakeCase(subscriptionData)])
    .select(
      'id,name,description,logoUrl:logo_url,category,price,currency,billingCycle:billing_cycle,startDate:start_date,endDate:end_date,isActive:is_active'
    )
    .single();

  if (error) {
    throw error;
  }

  return data as Subscription;
}

export async function getSubscriptions() {
  const { data, error } = await supabase
    .from('subscriptions')
    .select(
      'id,name,description,logoUrl:logo_url,category,price,currency,billingCycle:billing_cycle,startDate:start_date,endDate:end_date,isActive:is_active'
    )
    .order('name');

  if (error) {
    throw error;
  }

  return data as Subscription[];
}
