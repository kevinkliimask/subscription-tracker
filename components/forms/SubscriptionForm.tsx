import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, Text } from 'react-native';
import { z } from 'zod';

import { Button } from '~/components/ui/Button';
import { DateTimePicker } from '~/components/ui/DateTimePicker';
import { Picker } from '~/components/ui/Picker';
import { TextInput } from '~/components/ui/TextInput';
import { addSubscription } from '~/utils/supabase';

const subscriptionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z
    .string()
    .min(1, 'Price is required')
    .regex(/^\d*\.?\d*$/, 'Invalid price format'),
  description: z.string().optional(),
  category: z.string().optional(),
  billingCycle: z.enum(['week', 'month', 'quarter', 'year']),
  currency: z.enum(['eur', 'usd']),
  startDate: z.date(),
  endDate: z.date().optional(),
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

export default function SubscriptionForm({ onSubmit }: { onSubmit: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      billingCycle: 'month',
      currency: 'eur',
      startDate: new Date(),
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await addSubscription({
        ...data,
        price: parseFloat(data.price),
        startDate: data.startDate.toISOString(),
        endDate: data.endDate?.toISOString(),
        logoUrl: 'https://placehold.co/400x400',
        isActive: true,
      });
      onSubmit();
    } catch (error) {
      console.error('Error adding subscription:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex gap-4 rounded-2xl bg-white p-4 shadow-lg">
      <View>
        <Text className="mb-2 text-sm font-medium text-gray-900">Name</Text>
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
          <Text className="mb-2 text-sm font-medium text-gray-900">Price</Text>
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
          <Text className="mb-2 text-sm font-medium text-gray-900">Currency</Text>
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
        <Text className="mb-2 text-sm font-medium text-gray-900">Category (optional)</Text>
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
        <Text className="mb-2 text-sm font-medium text-gray-900">Billing Cycle</Text>
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
          <Text className="mb-2 text-sm font-medium text-gray-900">Start Date</Text>
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
          <Text className="mb-2 text-sm font-medium text-gray-700">End Date (optional)</Text>
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
        <Text className="mb-2 text-sm font-medium text-gray-900">Description (optional)</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange } }) => (
            <>
              <TextInput
                value={value}
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

      <Button
        onPress={handleSubmit(handleFormSubmit)}
        isLoading={isSubmitting}
        className="mt-4 rounded-xl bg-theme-blue p-4 active:opacity-80">
        <Text className="text-center font-semibold text-white">Add Subscription</Text>
      </Button>
    </View>
  );
}
