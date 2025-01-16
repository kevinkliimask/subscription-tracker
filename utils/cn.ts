import { twMerge } from 'tailwind-merge';
import { ClassNameValue } from 'tailwind-merge/dist/types';

export function cn(...inputs: ClassNameValue[]) {
  return twMerge(inputs);
}
