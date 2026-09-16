const etags = new Map<string, string>();

interface ConditionalGetOptions<T> {
  signal?: AbortSignal;
  previous?: T;
}

export async function conditionalGet<T>(
  url: string,
  parse: (json: unknown) => T,
  options: ConditionalGetOptions<T> = {},
): Promise<T> {
  const { signal, previous } = options;
  const etag = previous === undefined ? undefined : etags.get(url);

  const response = await fetch(url, {
    signal,
    cache: 'no-store',
    headers: etag ? { 'If-None-Match': etag } : undefined,
  });

  if (response.status === 304 && previous !== undefined) return previous;
  if (!response.ok) throw new Error(`Не удалось загрузить данные: ${response.status}`);

  const data = parse(await response.json());

  const nextETag = response.headers.get('ETag');
  if (nextETag) etags.set(url, nextETag);
  else etags.delete(url);

  return data;
}
