import { useMemo } from 'react';
import { z } from 'zod';
import { useCachedResource } from '@/cache';
import type { CachedResource } from '@/cache';
import { orgNodesSchema } from '@/orgDashboard/types/types';
import type { OrgNode } from '@/orgDashboard/types/types';

export const orgTreeQueryKey = ['org-tree'];

const orgTreeResource: CachedResource<OrgNode[]> = {
  key: orgTreeQueryKey,
  url: '/api/org-tree',
  parse: (json) => {
    const result = orgNodesSchema.safeParse(json);
    if (!result.success) {
      console.error(
        `Ответ ${orgTreeResource.url} не прошёл валидацию:\n${z.prettifyError(result.error)}`,
      );
      throw new Error('Некорректный формат ответа сервера', { cause: result.error });
    }
    return result.data;
  },
};

export type OrgTreeDataState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success'; data: OrgNode[] };

export function useOrgTreeData(): OrgTreeDataState {
  const state = useCachedResource(orgTreeResource);

  return useMemo<OrgTreeDataState>(
    () => (state.status === 'success' && state.data.length === 0 ? { status: 'empty' } : state),
    [state],
  );
}
