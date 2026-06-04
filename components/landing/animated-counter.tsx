"use client";

import { useEffect, useRef } from "react";
import { useInView, useSpring } from "framer-motion";

export function AnimatedCounter({ from = 0, to }: { from?: number; to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const value = useSpring(from, { stiffness: 40, damping: 20 });

  useEffect(() => {
    if (isInView) {
      value.set(to);
    }
  }, [isInView, to, value]);

  useEffect(() => {
    const unsubscribe = value.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toLocaleString();
      }
    });
    return unsubscribe;
  }, [value]);

  return <span ref={ref}>{from}</span>;
}
