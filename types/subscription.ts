export type Subscription = {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  category?: string;
  price: number;
  currency: string;
  billingCycle: 'week' | 'month' | 'quarter' | 'year';
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
};
