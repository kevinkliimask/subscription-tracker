import { Controller, useForm } from 'react-hook-form';
import { ImagePickerAsset } from 'expo-image-picker';
import { Trash } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { View, Text } from 'react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { addSubscription, updateSubscription } from '~/utils/supabase';
import { DateTimePicker } from '~/components/ui/DateTimePicker';
import { DeleteSubscriptionAlert } from '~/components/DeleteSubscriptionAlert';
import { FileUploader } from '~/components/ui/FileUploader';
import { GradientButton } from '~/components/ui/GradientButton';
import { Picker } from '~/components/ui/Picker';
import { Subscription } from '~/types/subscription';
import { TextInput } from '~/components/ui/TextInput';

const subscriptionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z
    .string()
    .min(1, 'Price is required')
    .regex(/^\d*\.?\d*$/, 'Invalid price format'),
  description: z.string().nullable(),
  category: z.string().nullable(),
  billingCycle: z.enum(['week', 'month', 'quarter', 'year']),
  currency: z.enum(['eur', 'usd']),
  startDate: z.date(),
  endDate: z.date().nullable(),
});

type FormData = z.infer<typeof subscriptionSchema>;

const CATEGORIES = ['Streaming', 'Music', 'Gaming', 'Fitness', 'News', 'Software', 'Other'];

const BILLING_CYCLE_OPTIONS = [
  { label: 'Weekly', value: 'week' },
  { label: 'Monthly', value: 'month' },
  { label: 'Quarterly', value: 'quarter' },
  { label: 'Yearly', value: 'year' },
];

const CURRENCY_OPTIONS = [
  { label: 'EUR (€)', value: 'eur' },
  { label: 'USD ($)', value: 'usd' },
];

const CATEGORY_OPTIONS = CATEGORIES.map((category) => ({
  label: category,
  value: category,
}));

type SubscriptionFormProps = {
  mode?: 'create' | 'edit';
  subscription?: Subscription;
};

export default function SubscriptionForm({ mode = 'create', subscription }: SubscriptionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImagePickerAsset | undefined>(undefined);
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: subscription?.name ?? '',
      price: subscription?.price.toString() ?? '',
      description: subscription?.description ?? '',
      category: subscription?.category ?? null,
      billingCycle: subscription?.billingCycle ?? 'month',
      currency: (subscription?.currency as 'eur' | 'usd') ?? 'eur',
      startDate: subscription?.startDate ? new Date(subscription.startDate) : new Date(),
      endDate: subscription?.endDate ? new Date(subscription.endDate) : null,
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const subscriptionData = {
        ...data,
        price: parseFloat(data.price),
        startDate: data.startDate.toISOString(),
        endDate: data.endDate?.toISOString() ?? null,
        isActive: true,
      };

      if (mode === 'edit' && subscription) {
        await updateSubscription(
          subscription.id,
          subscriptionData,
          selectedImage,
          isImageDeleted || !!selectedImage
        );
      } else {
        await addSubscription(subscriptionData, selectedImage);
      }

      // Invalidate and refetch subscriptions
      await queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      navigation.goBack();
    } catch (error) {
      console.error('Error saving subscription:', error);
      alert(`Failed to ${mode} subscription. ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSelect = (file: ImagePickerAsset | undefined) => {
    setSelectedImage(file);
    setIsImageDeleted(!file);
  };

  const handleDelete = () => {
    if (!subscription) return;
    setShowDeleteAlert(true);
  };

  return (
    <View className="flex gap-4 rounded-2xl bg-white p-4 shadow-lg">
      <FileUploader
        onFileSelect={handleImageSelect}
        initialImageUrl={subscription?.logoUrl ?? undefined}
      />

      <View>
        <Text className="mb-2 font-medium text-gray-900">Name</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange } }) => (
            <>
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Netflix, Spotify, etc."
              />
              {errors.name && (
                <Text className="mt-1 text-sm text-red-500">{errors.name.message}</Text>
              )}
            </>
          )}
        />
      </View>

      <View className="flex flex-row gap-4">
        <View className="flex-[3]">
          <Text className="mb-2 font-medium text-gray-900">Price</Text>
          <Controller
            control={control}
            name="price"
            render={({ field: { value, onChange } }) => (
              <>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="9.99"
                  keyboardType="decimal-pad"
                />
                {errors.price && (
                  <Text className="mt-1 text-sm text-red-500">{errors.price.message}</Text>
                )}
              </>
            )}
          />
        </View>

        <View className="flex-1">
          <Text className="mb-2 font-medium text-gray-900">Currency</Text>
          <Controller
            control={control}
            name="currency"
            render={({ field: { value, onChange } }) => (
              <>
                <Picker
                  value={value}
                  onChange={onChange}
                  options={CURRENCY_OPTIONS}
                  label="Select Currency"
                />
                {errors.currency && (
                  <Text className="mt-1 text-sm text-red-500">{errors.currency.message}</Text>
                )}
              </>
            )}
          />
        </View>
      </View>

      <View>
        <Text className="mb-2 font-medium text-gray-900">Category (optional)</Text>
        <Controller
          control={control}
          name="category"
          render={({ field: { value, onChange } }) => (
            <>
              <Picker
                value={value || null}
                onChange={onChange}
                options={CATEGORY_OPTIONS}
                label="Select Category"
                placeholder="Select a category"
                emptyAllowed
              />
              {errors.category && (
                <Text className="mt-1 text-sm text-red-500">{errors.category.message}</Text>
              )}
            </>
          )}
        />
      </View>

      <View>
        <Text className="mb-2 font-medium text-gray-900">Billing Cycle</Text>
        <Controller
          control={control}
          name="billingCycle"
          render={({ field: { value, onChange } }) => (
            <>
              <Picker
                value={value}
                onChange={onChange}
                options={BILLING_CYCLE_OPTIONS}
                label="Select Billing Cycle"
              />
              {errors.billingCycle && (
                <Text className="mt-1 text-sm text-red-500">{errors.billingCycle.message}</Text>
              )}
            </>
          )}
        />
      </View>

      <View className="flex flex-row gap-4">
        <View className="flex-1">
          <Text className="mb-2 font-medium text-gray-900">Start Date</Text>
          <Controller
            control={control}
            name="startDate"
            render={({ field: { value, onChange } }) => (
              <>
                <DateTimePicker value={value} onChange={onChange} />
                {errors.startDate && (
                  <Text className="mt-1 text-sm text-red-500">{errors.startDate.message}</Text>
                )}
              </>
            )}
          />
        </View>

        <View className="flex-1">
          <Text className="mb-2 font-medium text-gray-700">End Date (optional)</Text>
          <Controller
            control={control}
            name="endDate"
            render={({ field: { value, onChange } }) => (
              <>
                <DateTimePicker
                  value={value || null}
                  onChange={onChange}
                  placeholder="Select end date"
                  emptyAllowed
                />
                {errors.endDate && (
                  <Text className="mt-1 text-sm text-red-500">{errors.endDate.message}</Text>
                )}
              </>
            )}
          />
        </View>
      </View>

      <View>
        <Text className="mb-2 font-medium text-gray-900">Description (optional)</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange } }) => (
            <>
              <TextInput
                value={value ?? ''}
                onChangeText={onChange}
                placeholder="Family plan, yearly subscription, etc."
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              {errors.description && (
                <Text className="mt-1 text-sm text-red-500">{errors.description.message}</Text>
              )}
            </>
          )}
        />
      </View>

      <GradientButton
        onPress={handleSubmit(handleFormSubmit)}
        isLoading={isSubmitting}
        variant="primary"
        className="w-full">
        <View className="flex-row items-center justify-center gap-2">
          <Text className="text-center font-semibold text-white">
            {mode === 'edit' ? 'Update Subscription' : 'Add Subscription'}
          </Text>
        </View>
      </GradientButton>

      {mode === 'edit' && subscription && (
        <>
          <GradientButton
            onPress={handleDelete}
            isLoading={isSubmitting}
            variant="destructive"
            className="w-full">
            <Trash size={16} color="#fff" />
            <Text className="text-center font-semibold text-white">Delete Subscription</Text>
          </GradientButton>

          <DeleteSubscriptionAlert
            subscription={subscription}
            show={showDeleteAlert}
            onDismiss={() => setShowDeleteAlert(false)}
            onSubmitStart={() => setIsSubmitting(true)}
            onSubmitEnd={() => setIsSubmitting(false)}
          />
        </>
      )}
    </View>
  );
}
