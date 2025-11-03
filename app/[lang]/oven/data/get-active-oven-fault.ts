import { useQuery } from '@tanstack/react-query';
import { fetchActiveOvenFault } from '../actions';

export function useActiveOvenFault(oven: string) {
  return useQuery({
    queryFn: async () => fetchActiveOvenFault(oven),
    queryKey: ['active-oven-fault', oven],
    enabled: !!oven,
    refetchInterval: 1000 * 10, // 10 seconds
  });
}

