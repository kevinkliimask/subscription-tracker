import { ImagePickerAsset } from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { supabase } from './supabase';

export type UploadResult = {
  url: string;
  bucketPath: string;
};

export async function deleteSubscriptionImage(bucketPath: string) {
  try {
    const { error } = await supabase.storage.from('subscription-logos').remove([bucketPath]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

export async function uploadSubscriptionImage(
  file: ImagePickerAsset,
  userId: string
): Promise<UploadResult> {
  if (!file) throw new Error('No file provided');

  try {
    // Get file extension from mime type
    const fileExt = file.mimeType?.split('/')[1] || 'jpeg';
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    // Read file as base64
    const base64 = await FileSystem.readAsStringAsync(file.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const { data, error } = await supabase.storage
      .from('subscription-logos')
      .upload(fileName, decode(base64), {
        contentType: file.mimeType || 'image/jpeg',
        upsert: false,
      });

    if (error) throw error;

    // Get signed URL
    const { data: signedUrl } = await supabase.storage
      .from('subscription-logos')
      .createSignedUrl(data.path, 315576000); // 10 years in seconds

    if (!signedUrl?.signedUrl) throw new Error('Failed to get signed URL');

    return {
      url: signedUrl.signedUrl,
      bucketPath: data.path,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Helper function to decode base64 to Uint8Array
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
