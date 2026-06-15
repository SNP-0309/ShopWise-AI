import { useState } from 'react';
import { useDebounce } from './useDebounce';

export { useDebounce };

export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  // Already defined below, this file just re-exports
  return debouncedValue;
};
