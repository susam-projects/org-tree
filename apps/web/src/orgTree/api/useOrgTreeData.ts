import { useCachedResource } from '@/cache';
import type { CachedResource } from '@/cache';
import { orgNodesSchema } from '@/orgTree/types/types';
import type { OrgNode } from '@/orgTree/types/types';

const orgTreeResource: CachedResource<OrgNode[]> = {
  key: ['org-tree'],
  url: '/api/org-tree',
  parse: (json) => {
    const result = orgNodesSchema.safeParse(json);
    if (!result.success) throw new Error('Некорректный формат ответа сервера');
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

  if (state.status === 'success' && state.data.length === 0) return { status: 'empty' };
  return state;
}
