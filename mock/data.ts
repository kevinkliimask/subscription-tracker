import { Subscription } from '~/types/subscription';

export const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    name: 'Netflix',
    logoUrl:
      'https://doqxcykrcrzdrwbkeulx.supabase.co/storage/v1/object/sign/subscription-logos/netflix.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzdWJzY3JpcHRpb24tbG9nb3MvbmV0ZmxpeC53ZWJwIiwiaWF0IjoxNzM2ODg3OTIyLCJleHAiOjE3Mzc0OTI3MjJ9.KaGL7N6t4FOz4qcJbjIDJ8CGPTLW8-pcEVnhFHXCuUU&t=2025-01-14T20%3A52%3A02.539Z',
    price: 10,
    currency: 'EUR',
    billingCycle: 'month',
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    isActive: true,
  },
  {
    id: '2',
    name: 'Spotify',
    price: 12,
    currency: 'USD',
    billingCycle: 'year',
    startDate: new Date(),
    isActive: true,
  },
];
