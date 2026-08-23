"use client";

import { motion, useReducedMotion } from "framer-motion";

/* ── The signature element ────────────────────────────────────
   Thin parallel barbs radiating from a central spine. Reads as a
   feather and as a topographic contour at the same time. Draws
   itself in on scroll via stroke-dashoffset (pathLength).
   Used between major sections. Purely decorative → aria-hidden. */

const BARBS = 34;

// Round to a fixed precision so server- and client-computed trig
// results (which can differ in the last float bit between Node's
// and the browser's Math.sin implementation) always serialize to
// the exact same string, avoiding a hydration mismatch.
const r = (n) => Math.round(n * 1000) / 1000;

function barbPaths() {
  const out = [];
  for (let i = 0; i < BARBS; i++) {
    const t = i / (BARBS - 1);
    const x = r(70 + t * 1060);
    const env = Math.sin(Math.PI * t); // long in the middle, short at the tips
    const len = 6 + env * 26;
    const sweep = 24 + env * 10;
    const sx1 = r(x + sweep * 0.3);
    const sx2 = r(x + sweep * 0.65);
    const sx3 = r(x + sweep);
    out.push({
      key: `u${i}`,
      d: `M ${x} 40 C ${sx1} ${r(40 - len * 0.3)}, ${sx2} ${r(40 - len * 0.75)}, ${sx3} ${r(
        40 - len
      )}`,
      t,
    });
    out.push({
      key: `l${i}`,
      d: `M ${x} 40 C ${sx1} ${r(40 + len * 0.3)}, ${sx2} ${r(40 + len * 0.75)}, ${sx3} ${r(
        40 + len
      )}`,
      t,
    });
  }
  return out;
}

export function FeatherDivider({ className = "" }) {
  const reduce = useReducedMotion();
  const paths = barbPaths();

  return (
    <div className={`shell ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1200 80"
        className="w-full h-[52px] md:h-[72px]"
        fill="none"
        focusable="false"
      >
        {/* spine */}
        <motion.path
          d="M 40 40 H 1160"
          stroke="var(--color-saffron)"
          strokeOpacity="0.55"
          strokeWidth="1"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={reduce ? undefined : { pathLength: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
        {paths.map(({ key, d, t }) => (
          <motion.path
            key={key}
            d={d}
            stroke="var(--color-ink-soft)"
            strokeOpacity="0.3"
            strokeWidth="0.9"
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            whileInView={reduce ? undefined : { pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 + t * 0.5 }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ── Flight-path arcs ─────────────────────────────────────────
   Faint dotted curves: a bird's path, an orbit track. Background
   only, never carries meaning. */

export function FlightArcs({ className = "" }) {
  const reduce = useReducedMotion();
  const arcs = [
    "M -80 300 C 220 120, 640 60, 1320 210",
    "M -60 420 C 300 260, 780 230, 1340 330",
  ];

  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1200 520"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {arcs.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          stroke="var(--color-nightsky)"
          strokeOpacity={0.18}
          strokeWidth="1"
          strokeDasharray="2 9"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={reduce ? undefined : { pathLength: 1 }}
          transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 + i * 0.25 }}
        />
      ))}
    </svg>
  );
}

/* ── The one ornament ─────────────────────────────────────────
   A manuscript-style header mark. One only, at the top of the
   hero, small, saffron. */

export function Flourish({ className = "" }) {
  return (
    <svg
      viewBox="0 0 120 24"
      className={`h-6 w-[120px] ${className}`}
      fill="none"
      role="img"
      aria-label="Ornamental mark"
      focusable="false"
    >
      <path
        d="M4 12h30M86 12h30"
        stroke="var(--color-saffron)"
        strokeOpacity="0.5"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M38 12c8 0 14-7 22-7s14 7 22 7c-8 0-14 7-22 7s-14-7-22-7z"
        stroke="var(--color-saffron)"
        strokeWidth="1"
      />
      <circle cx="60" cy="12" r="2.2" fill="var(--color-saffron)" />
      <circle cx="34" cy="12" r="1.2" fill="var(--color-saffron)" fillOpacity="0.6" />
      <circle cx="86" cy="12" r="1.2" fill="var(--color-saffron)" fillOpacity="0.6" />
    </svg>
  );
}

/* ── Connector arc for the five-stage flow ───────────────────── */

export function FlowArc() {
  const reduce = useReducedMotion();
  return (
    <svg
      className="pointer-events-none absolute left-0 right-0 top-[26px] hidden h-10 w-full lg:block"
      viewBox="0 0 1000 40"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <motion.path
        d="M 60 30 Q 500 2 940 30"
        stroke="var(--color-saffron)"
        strokeOpacity="0.45"
        strokeWidth="1"
        strokeDasharray="3 7"
        initial={reduce ? false : { pathLength: 0 }}
        whileInView={reduce ? undefined : { pathLength: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
    </svg>
  );
}
