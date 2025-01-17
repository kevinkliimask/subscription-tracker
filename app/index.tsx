import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, Text, Alert } from 'react-native';
import { z } from 'zod';

import { Button } from '~/components/ui/Button';
import { TextInput } from '~/components/ui/TextInput';
import { supabase } from '~/utils/supabase';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoggingIn(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      router.replace('/subscriptions');
    } catch (error: any) {
      setError('root', {
        message: error.message || 'Failed to sign in',
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignUp = async (data: FormData) => {
    try {
      setIsSigningUp(true);
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      console.log(error);

      if (error) throw error;

      Alert.alert('Success', 'Check your email for the confirmation link');
    } catch (error: any) {
      setError('root', {
        message: error.message || 'Failed to sign up',
      });
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <View className="mb-8 mt-20">
        <Text className="text-center text-3xl font-bold text-gray-900">Welcome Back</Text>
        <Text className="mt-2 text-center text-gray-600">Sign in to manage your subscriptions</Text>
      </View>

      <View className="flex gap-4 rounded-2xl bg-white p-4">
        <View>
          <Text className="mb-2 font-medium text-gray-900">Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoggingIn && !isSigningUp}
                />
                {errors.email && (
                  <Text className="mt-1 text-sm text-red-500">{errors.email.message}</Text>
                )}
              </>
            )}
          />
        </View>

        <View>
          <Text className="mb-2 font-medium text-gray-900">Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange } }) => (
              <>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter your password"
                  secureTextEntry
                  editable={!isLoggingIn && !isSigningUp}
                />
                {errors.password && (
                  <Text className="mt-1 text-sm text-red-500">{errors.password.message}</Text>
                )}
              </>
            )}
          />
        </View>

        {errors.root && (
          <Text className="text-center text-sm text-red-500">{errors.root.message}</Text>
        )}

        <Button
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoggingIn}
          disabled={isLoggingIn || isSigningUp}
          variant="primary"
          className="mt-4">
          Sign In
        </Button>

        <Button
          onPress={handleSubmit(handleSignUp)}
          isLoading={isSigningUp}
          disabled={isLoggingIn || isSigningUp}
          variant="secondary"
          className="mt-2">
          Create Account
        </Button>
      </View>
    </View>
  );
}
