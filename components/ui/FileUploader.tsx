import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

type FileUploaderProps = {
  onFileSelect: (file: ImagePicker.ImagePickerAsset | null) => void;
  error?: string;
};

export function FileUploader({ onFileSelect, error }: FileUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const validateFile = (fileType: string, fileSize: number) => {
    if (!ALLOWED_FILE_TYPES.includes(fileType)) {
      throw new Error(
        'Invalid file type. Please upload an image file (JPG, PNG, WebP, GIF, AVIF, or SVG).'
      );
    }
    if (fileSize > MAX_FILE_SIZE) {
      throw new Error('File size too large. Maximum allowed size is 5MB.');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        try {
          validateFile(asset.mimeType || 'image/jpeg', asset.fileSize || 0);
          setPreview(asset.uri);
          onFileSelect(asset);
        } catch (error) {
          if (error instanceof Error) {
            onFileSelect(null);
            alert(error.message);
          }
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Error picking image. Please try again.');
    }
  };

  const removeImage = () => {
    setPreview(null);
    onFileSelect(null);
  };

  return (
    <View>
      <Text className="mb-2 font-medium text-gray-900">Logo (optional)</Text>
      <View className="flex-row items-center justify-center gap-4">
        {preview ? (
          <View className="relative">
            <Image source={{ uri: preview }} className="h-16 w-16 rounded-lg" />
            <TouchableOpacity
              onPress={removeImage}
              className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1">
              <X size={12} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={pickImage}
            className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
            <ImageIcon size={32} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
    </View>
  );
}
