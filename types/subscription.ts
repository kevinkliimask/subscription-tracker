export type Subscription = {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  signedLogoUrl?: string;
  category?: string;
  price: number;
  currency: string;
  billingCycle: 'week' | 'month' | 'quarter' | 'year';
  startDate: string;
  endDate?: string;
  isActive: boolean;
};
