import { Alert } from 'react-native';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { deleteSubscription } from '~/utils/supabase';
import { Subscription } from '~/types/subscription';

type DeleteSubscriptionAlertProps = {
  subscription: Subscription;
  onSubmitStart?: () => void;
  onSubmitEnd?: () => void;
  onSuccess?: () => void;
  show: boolean;
  onDismiss: () => void;
};

export function DeleteSubscriptionAlert({
  subscription,
  onSubmitStart,
  onSubmitEnd,
  onSuccess,
  show,
  onDismiss,
}: DeleteSubscriptionAlertProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      onSubmitStart?.();
      await deleteSubscription(subscription.id, subscription.logoBucketPath);
      await queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      onSuccess?.();
      router.replace('/subscriptions');
    } catch (error) {
      console.error('Error deleting subscription:', error);
      Alert.alert('Error', `Failed to delete subscription. ${error}`);
    } finally {
      onSubmitEnd?.();
    }
  };

  useEffect(() => {
    if (show) {
      Alert.alert(
        'Delete Subscription',
        'Are you sure you want to delete this subscription? This action cannot be undone.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: onDismiss,
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: handleDelete,
          },
        ]
      );
    }
  }, [show]);

  return null;
}
