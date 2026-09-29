import { useEffect, useState } from 'react';
import { prefersReducedMotion, useInView } from '../hooks/useInView.js';

/** Animates a number from `from` to `to` once it scrolls into view. */
export default function CountUp({ to, from = 0, duration = 1400 }) {
  const [ref, inView] = useInView({ threshold: 0.6 });
  const [value, setValue] = useState(() => (prefersReducedMotion() ? to : from));

  useEffect(() => {
    if (!inView) return undefined;
    if (prefersReducedMotion()) {
      setValue(to);
      return undefined;
    }
    let raf = 0;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, from, duration]);

  return <span ref={ref}>{value}</span>;
}
