import { useQuery } from '@tanstack/react-query';
import type { Locale } from '@/lib/config/i18n';
import { fetchActiveOvenFault } from '../actions';

export function useActiveOvenFault(oven: string, lang: Locale) {
  return useQuery({
    queryFn: async () => fetchActiveOvenFault(oven, lang),
    queryKey: ['active-oven-fault', oven, lang],
    enabled: !!oven,
    refetchInterval: 1000 * 10, // 10 seconds
  });
}

