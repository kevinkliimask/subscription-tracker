export type BillingCycle = 'week' | 'month' | 'quarter' | 'year';

export type Subscription = {
  id: string;
  name: string;
  description: string | null;
  logoUrl?: string | null;
  logoBucketPath?: string | null;
  category: string | null;
  price: number;
  currency: string;
  billingCycle: BillingCycle;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
};
