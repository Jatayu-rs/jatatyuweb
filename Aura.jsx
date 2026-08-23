"use client";

import { motion, useReducedMotion } from "framer-motion";

/* Slow-drifting light. Ember orange over dusk indigo — the rim-light
   of a low sun. Never carries meaning, never blocks a click. */

const BLOBS = [
  { c: "rgba(232,135,58,0.34)", size: 660, top: "-22%", left: "6%", dur: 26, x: 80, y: 44 },
  { c: "rgba(43,58,103,0.26)", size: 600, top: "-12%", left: "48%", dur: 34, x: -70, y: 56 },
  { c: "rgba(33,102,172,0.18)", size: 520, top: "16%", left: "24%", dur: 42, x: 56, y: -46 },
  { c: "rgba(244,226,178,0.30)", size: 420, top: "8%", left: "70%", dur: 30, x: -44, y: -30 },
];

export default function Aura({ className = "", intensity = 1 }) {
  const reduce = useReducedMotion();

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            opacity: intensity,
            background: `radial-gradient(circle at 50% 50%, ${b.c}, rgba(255,255,255,0) 68%)`,
            filter: "blur(64px)",
            willChange: "transform",
          }}
          animate={
            reduce
              ? undefined
              : { x: [0, b.x, 0], y: [0, b.y, 0], scale: [1, 1.09, 1] }
          }
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
