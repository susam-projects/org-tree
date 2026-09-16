import { useEffect, useRef, useState } from 'react';

const FADE_DURATION_MS = 1500;

export function useFadeHighlight<T>(value: T): boolean {
  const previousValue = useRef(value);
  const [highlighted, setHighlighted] = useState(false);

  useEffect(() => {
    if (previousValue.current === value) return;
    previousValue.current = value;
    setHighlighted(true);
    const timeout = setTimeout(() => setHighlighted(false), FADE_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [value]);

  return highlighted;
}
