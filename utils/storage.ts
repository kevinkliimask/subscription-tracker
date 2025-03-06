import { supabase } from './supabase';

export async function uploadSubscriptionImage(file: any, userId: string) {
  if (!file) return undefined;

  try {
    const fileExt = file.name.split('.').pop().toLowerCase();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('subscription-logos')
      .upload(fileName, file);

    if (error) throw error;

    const { data: urlData } = await supabase.storage
      .from('subscription-logos')
      .createSignedUrl(data.path, 315576000); // 10 years in seconds

    return urlData?.signedUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return undefined;
  }
}
