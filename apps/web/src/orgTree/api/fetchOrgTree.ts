import type { OrgNode } from '@/orgTree/types/types';

const ORG_TREE_URL = '/api/org-tree';

export async function fetchOrgTree(signal?: AbortSignal): Promise<OrgNode[]> {
  const response = await fetch(ORG_TREE_URL, { signal });
  if (!response.ok) throw new Error(`Не удалось загрузить данные: ${response.status}`);
  return response.json();
}
