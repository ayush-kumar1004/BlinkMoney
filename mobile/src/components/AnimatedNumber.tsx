import { useEffect, useRef, useState } from 'react';
import { Text } from './Text';
import { FontVariant } from '@/theme/tokens';

interface AnimatedNumberProps {
  value: number;
  format?: (n: number) => string;
  duration?: number;
  variant?: FontVariant;
  color?: string;
  style?: any;
  /** Where the count-up starts on first mount (default 0 for a visible reveal). */
  from?: number;
}

/** Count-up from the previous value to the new value. Single value, JS-driven RAF — cheap. */
export function AnimatedNumber({
  value,
  format = (n) => String(Math.round(n)),
  duration = 900,
  variant = 'hero',
  color,
  style,
  from = 0,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(from);
  const fromRef = useRef(from);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;
    const start = Date.now();
    const tick = () => {
      const t = Math.min((Date.now() - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      fromRef.current = to;
    };
  }, [value, duration]);

  return (
    <Text variant={variant} color={color} style={style}>
      {format(display)}
    </Text>
  );
}
