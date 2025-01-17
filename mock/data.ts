import { Subscription } from '~/types/subscription';

export const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    name: 'Netflix',
    logoUrl: 'private/netflix.webp',
    price: 10,
    currency: 'EUR',
    billingCycle: 'month',
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
    isActive: true,
  },
  {
    id: '2',
    name: 'Spotify',
    price: 12,
    currency: 'USD',
    billingCycle: 'year',
    startDate: new Date().toISOString(),
    isActive: true,
  },
];
