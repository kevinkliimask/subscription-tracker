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

export function getNextBillingDate(startDate: string, cycle: BillingCycle, endDate?: string) {
  const startDateConverted = new Date(startDate);
  const currentDate = new Date();
  const endDateObj = endDate ? new Date(endDate) : null;

  // Check if currentDate is greater than endDate
  if (endDateObj && currentDate > endDateObj) {
    return null;
  }

  // Reset hours to compare just the dates
  startDateConverted.setHours(0, 0, 0, 0);
  const compareDate = new Date(currentDate);
  compareDate.setHours(0, 0, 0, 0);

  const nextPaymentDate = new Date(startDateConverted);

  // Calculate how many cycles have passed
  let timeDiff;
  switch (cycle) {
    case 'week':
      timeDiff = Math.floor(
        (compareDate.getTime() - startDateConverted.getTime()) / (7 * 24 * 60 * 60 * 1000)
      );
      nextPaymentDate.setDate(startDateConverted.getDate() + timeDiff * 7);
      // If we haven't reached today's payment, don't add an extra cycle
      if (nextPaymentDate < compareDate) {
        nextPaymentDate.setDate(nextPaymentDate.getDate() + 7);
      }
      break;
    case 'month':
      timeDiff =
        (compareDate.getFullYear() - startDateConverted.getFullYear()) * 12 +
        (compareDate.getMonth() - startDateConverted.getMonth());
      nextPaymentDate.setMonth(startDateConverted.getMonth() + timeDiff);
      // If we haven't reached today's payment, don't add an extra month
      if (nextPaymentDate < compareDate) {
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      }
      break;
    case 'quarter':
      timeDiff = Math.floor(
        ((compareDate.getFullYear() - startDateConverted.getFullYear()) * 12 +
          (compareDate.getMonth() - startDateConverted.getMonth())) /
          3
      );
      nextPaymentDate.setMonth(startDateConverted.getMonth() + timeDiff * 3);
      // If we haven't reached today's payment, don't add an extra quarter
      if (nextPaymentDate < compareDate) {
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 3);
      }
      break;
    case 'year':
      timeDiff = compareDate.getFullYear() - startDateConverted.getFullYear();
      nextPaymentDate.setFullYear(startDateConverted.getFullYear() + timeDiff);
      // If we haven't reached today's payment, don't add an extra year
      if (nextPaymentDate < compareDate) {
        nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
      }
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

export function getPaymentDates(startDate: string, cycle: BillingCycle, endDate?: string) {
  const startDateObj = new Date(startDate);
  const currentDate = new Date();
  const endDateObj = endDate ? new Date(endDate) : null;

  // Validate dates
  if (
    isNaN(startDateObj.getTime()) ||
    isNaN(currentDate.getTime()) ||
    (endDateObj && isNaN(endDateObj.getTime()))
  ) {
    return [];
  }

  // If start date is in the future, return empty array
  if (startDateObj > currentDate) {
    return [];
  }

  const payments: Date[] = [];
  const currentPaymentDate = new Date(startDateObj);

  while (currentPaymentDate <= currentDate && (!endDateObj || currentPaymentDate <= endDateObj)) {
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
