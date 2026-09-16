import { useEffect, useState } from 'react';
import { fetchOrgTree } from '@/orgTree/api/fetchOrgTree';
import type { OrgNode } from '@/orgTree/types/types';

export type OrgTreeDataState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success'; data: OrgNode[] };

export function useOrgTreeData(): OrgTreeDataState {
  const [state, setState] = useState<OrgTreeDataState>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });

    fetchOrgTree(controller.signal)
      .then((data) => {
        setState(data.length === 0 ? { status: 'empty' } : { status: 'success', data });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          status: 'error',
          message: error instanceof Error ? error.message : 'Не удалось загрузить данные',
        });
      });

    return () => controller.abort();
  }, []);

  return state;
}
