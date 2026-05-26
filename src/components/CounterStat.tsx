"use client";

import { useEffect, useRef, useState } from "react";

export default function CounterStat({
  end,
  duration = 1800,
  suffix = "",
  prefix = "",
  label,
}: {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  label: string;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const startTime = performance.now();
            const step = (now: number) => {
              const t = Math.min(1, (now - startTime) / duration);
              // ease-out cubic
              const eased = 1 - Math.pow(1 - t, 3);
              setValue(Math.round(end * eased));
              if (t < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          }
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [end, duration]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-[44px] sm:text-[56px] font-extrabold leading-none text-brand-yellow tabular-nums">
        {prefix}
        {value.toLocaleString()}
        {suffix}
      </div>
      <div className="mt-3 text-[12px] sm:text-[13px] uppercase tracking-[3px] font-bold text-white/80">
        {label}
      </div>
    </div>
  );
}
