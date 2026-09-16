import { useEffect, useRef, useState } from 'react';

export type ConnectionStatus = 'connecting' | 'open' | 'reconnecting' | 'closed';

const INITIAL_RECONNECT_DELAY_MS = 1000;
const MAX_RECONNECT_DELAY_MS = 30000;

interface UseWebSocketStreamOptions<T> {
  url: string;
  parse: (data: unknown) => T;
  onMessage: (message: T) => void;
}

export function useWebSocketStream<T>({
  url,
  parse,
  onMessage,
}: UseWebSocketStreamOptions<T>): ConnectionStatus {
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const parseRef = useRef(parse);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    parseRef.current = parse;
    onMessageRef.current = onMessage;
  });

  useEffect(() => {
    let stopped = false;
    let everOpened = false;
    let reconnectDelay = INITIAL_RECONNECT_DELAY_MS;
    let reconnectTimeout: ReturnType<typeof setTimeout> | undefined;
    let socket: WebSocket | undefined;

    function connect() {
      socket = new WebSocket(url);

      socket.addEventListener('open', () => {
        everOpened = true;
        reconnectDelay = INITIAL_RECONNECT_DELAY_MS;
        setStatus('open');
      });

      socket.addEventListener('message', (event) => {
        try {
          onMessageRef.current(parseRef.current(JSON.parse(event.data as string)));
        } catch (error) {
          console.error('Некорректное сообщение по WebSocket:', error);
        }
      });

      socket.addEventListener('close', () => {
        if (stopped) return;
        setStatus(everOpened ? 'reconnecting' : 'connecting');
        reconnectTimeout = setTimeout(connect, reconnectDelay);
        reconnectDelay = Math.min(reconnectDelay * 2, MAX_RECONNECT_DELAY_MS);
      });

      socket.addEventListener('error', () => socket?.close());
    }

    connect();

    return () => {
      stopped = true;
      clearTimeout(reconnectTimeout);
      socket?.close();
    };
  }, [url]);

  return status;
}
