"use client";

import { motion, useReducedMotion } from "framer-motion";

/* Expo-out. Slower and softer than the old 400ms ease-out — this is
   most of what made the page feel mechanical. */
export const EASE = [0.16, 1, 0.3, 1];

export function Reveal({ children, delay = 0, className = "", as = "div", y = 22 }) {
  const reduce = useReducedMotion();
  const Tag = motion[as] ?? motion.div;

  if (reduce) return <Tag className={className}>{children}</Tag>;

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.75, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

/* Group container: children animate in sequence without each item
   needing its own delay maths. */
export function Stagger({ children, className = "", gap = 0.075, as = "div" }) {
  const reduce = useReducedMotion();
  const Tag = motion[as] ?? motion.div;
  if (reduce) return <Tag className={className}>{children}</Tag>;
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -80px 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: 0.05 } } }}
    >
      {children}
    </Tag>
  );
}

export function Item({ children, className = "", as = "div" }) {
  const reduce = useReducedMotion();
  const Tag = motion[as] ?? motion.div;
  if (reduce) return <Tag className={className}>{children}</Tag>;
  return (
    <Tag
      className={className}
      variants={{
        hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
        show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.75, ease: EASE } },
      }}
    >
      {children}
    </Tag>
  );
}

export function SectionHead({ eyebrow, title, children, align = "left" }) {
  return (
    <Stagger className={align === "center" ? "text-center" : ""}>
      <Item>
        <p className="eyebrow">{eyebrow}</p>
      </Item>
      <Item>
        <h2 className={`display h-section mt-4 max-w-[20ch] ${align === "center" ? "mx-auto" : ""}`}>
          {title}
        </h2>
      </Item>
      {children ? (
        <Item>
          <div className={`mt-6 ${align === "center" ? "mx-auto" : ""}`}>{children}</div>
        </Item>
      ) : null}
    </Stagger>
  );
}

const PILL_STYLE = {
  Live: { color: "#2F5A3D", dot: "var(--color-vegetation)", bg: "rgba(74,124,89,0.10)" },
  Working: { color: "#2F5A3D", dot: "var(--color-vegetation)", bg: "rgba(74,124,89,0.10)" },
  "In progress": { color: "#8A4F17", dot: "var(--color-saffron)", bg: "var(--color-saffron-soft)" },
  Planned: { color: "var(--color-ink-soft)", dot: "var(--color-ink-soft)", bg: "rgba(22,22,29,0.05)" },
};

export function StatusPill({ status }) {
  const s = PILL_STYLE[status] ?? PILL_STYLE["In progress"];
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium leading-none"
      style={{ color: s.color, background: s.bg }}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} aria-hidden="true" />
      {status}
    </span>
  );
}

export function Wordmark({ size = "md", stacked = true }) {
  const big = size === "lg";
  return (
    <span className={stacked ? "inline-flex flex-col leading-none" : "inline-flex items-baseline gap-2"}>
      <span className="display" style={{ fontSize: big ? "26px" : "21px", letterSpacing: "-0.01em" }}>
        Jatayu
      </span>
      <span className="deva" style={{ fontSize: big ? "13px" : "11px", lineHeight: 1.4, marginTop: stacked ? 2 : 0 }}>
        जटायु
      </span>
    </span>
  );
}

/* Small brand marks for team cards. */
export function GithubIcon(props) {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M3.6 5.3H.9V15h2.7V5.3ZM2.25 1A1.55 1.55 0 1 0 2.25 4.1 1.55 1.55 0 0 0 2.25 1ZM15 9.6c0-2.6-1.4-3.8-3.25-3.8-1.5 0-2.17.82-2.55 1.4V5.3H6.5V15h2.7V9.6c0-1.15.5-1.85 1.5-1.85.95 0 1.6.65 1.6 1.85V15H15V9.6Z" />
    </svg>
  );
}
