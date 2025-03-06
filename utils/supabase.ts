import { createClient } from '@supabase/supabase-js';
import { ImagePickerAsset } from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Database } from '~/types/database.types';
import {
  deleteSubscriptionImage,
  uploadSubscriptionImage,
  type UploadResult,
} from '~/utils/storage';
import { objectToSnakeCase } from '~/utils/case';
import { Subscription } from '~/types/subscription';

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

// Common type for subscription data without ID
type NonExistentSubscription = Omit<Subscription, 'id'>;

// Common select fields for subscription queries
const SUBSCRIPTION_SELECT =
  'id,name,description,logoUrl:logo_url,logoBucketPath:logo_bucket_path,category,price,currency,billingCycle:billing_cycle,startDate:start_date,endDate:end_date,isActive:is_active';

// Handle image upload and return the new URL and bucket path if successful
async function handleImageUpload(
  imageFile: ImagePickerAsset | undefined
): Promise<UploadResult | undefined> {
  if (!imageFile) return undefined;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not found');

  return await uploadSubscriptionImage(imageFile, user.id);
}

// Handle image update process including deletion of old image
async function handleImageUpdate(
  oldBucketPath: string | undefined | null,
  newImageFile: ImagePickerAsset | undefined,
  shouldDeleteOld: boolean
): Promise<UploadResult | { url: null; bucketPath: null } | undefined> {
  // If we have a new image or explicitly want to delete the old one
  if (shouldDeleteOld && oldBucketPath) {
    try {
      await deleteSubscriptionImage(oldBucketPath);
    } catch (error) {
      console.error('Failed to delete old image:', error);
      // Continue with the update even if image deletion fails
    }
  }

  // If we have a new image, upload it
  if (newImageFile) {
    return await handleImageUpload(newImageFile);
  }

  // If we're explicitly deleting the old image without uploading a new one
  if (shouldDeleteOld) {
    return { url: null, bucketPath: null };
  }

  // If no changes to the image
  return undefined;
}

export async function addSubscription(
  subscription: NonExistentSubscription,
  imageFile?: ImagePickerAsset
) {
  const imageResult = await handleImageUpload(imageFile);

  const subscriptionData = {
    ...subscription,
    logoUrl: imageResult?.url,
    logoBucketPath: imageResult?.bucketPath,
  };

  const { data, error } = await supabase
    .from('subscriptions')
    .insert([objectToSnakeCase(subscriptionData)])
    .select(SUBSCRIPTION_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data as Subscription;
}

export async function updateSubscription(
  id: string,
  subscription: Partial<Subscription>,
  imageFile?: ImagePickerAsset,
  shouldDeleteOld: boolean = false
) {
  // First get the current subscription to know about the old image
  const { data: currentSubscription } = await supabase
    .from('subscriptions')
    .select(SUBSCRIPTION_SELECT)
    .eq('id', id)
    .single();

  // Handle image update (upload new if provided, delete old if needed)
  const imageResult = await handleImageUpdate(
    currentSubscription?.logoBucketPath,
    imageFile,
    shouldDeleteOld
  );

  const subscriptionData = {
    ...subscription,
    ...(imageResult
      ? {
          logoUrl: imageResult?.url,
          logoBucketPath: imageResult?.bucketPath,
        }
      : {}),
  };

  const { data, error } = await supabase
    .from('subscriptions')
    .update(objectToSnakeCase(subscriptionData))
    .eq('id', id)
    .select(SUBSCRIPTION_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data as Subscription;
}

export async function getSubscriptions() {
  const { data, error } = await supabase
    .from('subscriptions')
    .select(SUBSCRIPTION_SELECT)
    .order('name');

  if (error) {
    throw error;
  }

  return data as Subscription[];
}
