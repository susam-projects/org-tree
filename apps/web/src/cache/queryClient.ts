import { QueryClient } from '@tanstack/react-query';

export const STALE_TIME_MS = 5000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME_MS,
    },
  },
});
