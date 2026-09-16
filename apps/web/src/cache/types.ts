export type CacheState<T> =
  { status: 'loading' } | { status: 'error'; message: string } | { status: 'success'; data: T };

export interface CachedResource<T> {
  key: readonly unknown[];
  url: string;
  parse: (json: unknown) => T;
}
