import AsyncStorage from '@react-native-async-storage/async-storage';

import { supabase } from './supabase';

export async function getSignedLogoUrl(logoUrl: string | undefined | null) {
  if (!logoUrl) return undefined;

  try {
    // Try to get from cache first
    const cachedUrl = await AsyncStorage.getItem(`logo_url_${logoUrl}`);
    if (cachedUrl) {
      return cachedUrl;
    }

    // If not in cache, fetch from Supabase
    const { data } = await supabase.storage
      .from('subscription-logos')
      .createSignedUrl(logoUrl, 31_536_000); // 1 year

    if (data?.signedUrl) {
      // Cache the URL
      await AsyncStorage.setItem(`logo_url_${logoUrl}`, data.signedUrl);
      return data.signedUrl;
    }

    return undefined;
  } catch (error) {
    console.error('Error fetching signed URL:', error);
    return undefined;
  }
}
