import { useQuery } from '@tanstack/react-query';
import { fetchOvenFaultTypes } from '../actions';

export function useOvenFaultTypes() {
  return useQuery({
    queryFn: async () => fetchOvenFaultTypes(),
    queryKey: ['oven-fault-types'],
    staleTime: 1000 * 60 * 60, // 1 hour - fault types rarely change
  });
}
