import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { conditionalGet } from '@/cache/conditionalGet';
import type { CacheState, CachedResource } from '@/cache/types';

export function useCachedResource<T>(resource: CachedResource<T>): CacheState<T> {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: resource.key,
    queryFn: ({ signal }) =>
      conditionalGet(resource.url, resource.parse, {
        signal,
        previous: queryClient.getQueryData<T>(resource.key),
      }),
  });

  return useMemo<CacheState<T>>(() => {
    if (query.isPending) return { status: 'loading' };
    if (query.isError) return { status: 'error', message: query.error.message };
    return { status: 'success', data: query.data };
  }, [query.isPending, query.isError, query.error, query.data]);
}
