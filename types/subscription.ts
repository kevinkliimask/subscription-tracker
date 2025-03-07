export type BillingCycle = 'week' | 'month' | 'quarter' | 'year';

export type Subscription = {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  logoBucketPath?: string;
  category?: string;
  price: number;
  currency: string;
  billingCycle: BillingCycle;
  startDate: string;
  endDate?: string;
  isActive: boolean;
};
