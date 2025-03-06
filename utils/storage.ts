import * as FileSystem from 'expo-file-system';
import { ImagePickerAsset } from 'expo-image-picker';
import { supabase } from './supabase';

export async function uploadSubscriptionImage(file: ImagePickerAsset, userId: string) {
  if (!file) return undefined;

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

    return signedUrl?.signedUrl;
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
