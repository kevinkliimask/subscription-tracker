import { BillingCycle } from '~/types/subscription';

// New utility function for formatting dates in device timezone
export function formatLocalDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
) {
  return date.toLocaleDateString(undefined, options);
}

export function getNextBillingDate(startDate: string, cycle: BillingCycle) {
  const startDateConverted = new Date(startDate);
  const currentDate = new Date();

  const nextPaymentDate = new Date(startDateConverted);

  // Calculate how many cycles have passed
  let timeDiff;
  switch (cycle) {
    case 'week':
      timeDiff = Math.floor(
        (currentDate.getTime() - startDateConverted.getTime()) / (7 * 24 * 60 * 60 * 1000)
      );
      nextPaymentDate.setDate(startDateConverted.getDate() + (timeDiff + 1) * 7);
      break;
    case 'month':
      timeDiff =
        (currentDate.getFullYear() - startDateConverted.getFullYear()) * 12 +
        (currentDate.getMonth() - startDateConverted.getMonth());
      nextPaymentDate.setMonth(startDateConverted.getMonth() + timeDiff + 1);
      break;
    case 'quarter':
      timeDiff = Math.floor(
        ((currentDate.getFullYear() - startDateConverted.getFullYear()) * 12 +
          (currentDate.getMonth() - startDateConverted.getMonth())) /
          3
      );
      nextPaymentDate.setMonth(startDateConverted.getMonth() + (timeDiff + 1) * 3);
      break;
    case 'year':
      timeDiff = currentDate.getFullYear() - startDateConverted.getFullYear();
      nextPaymentDate.setFullYear(startDateConverted.getFullYear() + timeDiff + 1);
      break;
  }

  // Return in ISO format with timezone
  return nextPaymentDate.toISOString();
}

export function getTimeUntilNextPayment(nextPaymentDate: string) {
  const next = new Date(nextPaymentDate);
  const now = new Date();

  // Ensure both dates are valid
  if (isNaN(next.getTime()) || isNaN(now.getTime())) {
    return 'Invalid date';
  }

  const diffTime = next.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 0) return 'Overdue';

  return `in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
}

export function getPaymentDates(startDate: string, cycle: BillingCycle) {
  const startDateObj = new Date(startDate);
  const currentDate = new Date();

  // Validate dates
  if (isNaN(startDateObj.getTime()) || isNaN(currentDate.getTime())) {
    return [];
  }

  // If start date is in the future, return empty array
  if (startDateObj > currentDate) {
    return [];
  }

  const payments: Date[] = [];
  const currentPaymentDate = new Date(startDateObj);

  while (currentPaymentDate <= currentDate) {
    payments.push(new Date(currentPaymentDate));

    switch (cycle) {
      case 'week':
        currentPaymentDate.setDate(currentPaymentDate.getDate() + 7);
        break;
      case 'month':
        currentPaymentDate.setMonth(currentPaymentDate.getMonth() + 1);
        break;
      case 'quarter':
        currentPaymentDate.setMonth(currentPaymentDate.getMonth() + 3);
        break;
      case 'year':
        currentPaymentDate.setFullYear(currentPaymentDate.getFullYear() + 1);
        break;
    }
  }

  return payments.sort((a, b) => b.getTime() - a.getTime()); // Most recent first
}
