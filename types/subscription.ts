export type Subscription = {
  id: number;
  name: string;
  description?: string;
  logoUrl?: string;
  category?: string;
  price: number;
  currency: string;
  billingCycle: 'week' | 'month' | 'quarter' | 'year';
  startDate: string;
  endDate?: string;
  isActive: boolean;
};
