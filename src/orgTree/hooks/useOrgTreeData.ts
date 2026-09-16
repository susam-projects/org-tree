import { useEffect, useState } from 'react'
import { mockOrgNodes } from '@/orgTree/mocks/mockData'
import type { OrgNode } from '@/orgTree/types/types'

export type OrgTreeDataState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success'; data: OrgNode[] }

const FAKE_LATENCY_MS = 600

export function useOrgTreeData(): OrgTreeDataState {
  const [state, setState] = useState<OrgTreeDataState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })

    const timer = setTimeout(() => {
      if (cancelled) return
      setState(
        mockOrgNodes.length === 0
          ? { status: 'empty' }
          : { status: 'success', data: mockOrgNodes },
      )
    }, FAKE_LATENCY_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  return state
}
