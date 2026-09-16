import { useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocketStream } from '@/cache';
import type { ConnectionStatus } from '@/cache';
import { orgTreeQueryKey } from '@/orgDashboard/api/useOrgTreeData';
import { orgPatchMessageSchema } from '@/orgDashboard/types/types';
import type { OrgPatchMessage } from '@/orgDashboard/types/types';

function buildLiveUpdatesUrl(): string {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/api/org-tree/live`;
}

// Разрыв в revision (пропущенные сообщения) не патчится — данные перезапрашиваются заново.
export function useLiveOrgUpdates(onPatch: (patch: OrgPatchMessage) => void): ConnectionStatus {
  const queryClient = useQueryClient();
  const expectedRevisionRef = useRef<number | null>(null);

  return useWebSocketStream<OrgPatchMessage>({
    url: buildLiveUpdatesUrl(),
    parse: (data) => {
      const result = orgPatchMessageSchema.safeParse(data);
      if (!result.success) {
        throw new Error('Некорректный формат патча', { cause: result.error });
      }
      return result.data;
    },
    onMessage: (patch) => {
      const expected = expectedRevisionRef.current;
      const isGap = expected !== null && patch.revision !== expected + 1;
      expectedRevisionRef.current = patch.revision;

      if (isGap) {
        void queryClient.refetchQueries({ queryKey: orgTreeQueryKey });
        return;
      }

      onPatch(patch);
    },
  });
}
