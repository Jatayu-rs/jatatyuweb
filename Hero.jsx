"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Aura from "./Aura";
import { Flourish, FlightArcs } from "./Art";
import { EASE } from "./Ui";
import { GITHUB_URL, DEMO_URL } from "@/lib/site";

const HEADLINE = "Ask the Earth a question.";

export default function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef(null);

  // Scroll: hero content drifts and fades as you leave it.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const driftY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const auraY = useTransform(scrollYProgress, [0, 1], [0, 160]);

  // Pointer: the aura leans very slightly toward the cursor.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 45, damping: 22, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 45, damping: 22, mass: 0.6 });

  function onPointerMove(e) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width - 0.5) * 34);
    py.set(((e.clientY - r.top) / r.height - 0.5) * 22);
  }

  const words = HEADLINE.split(" ");

  return (
    <section
      id="top"
      ref={ref}
      onPointerMove={onPointerMove}
      className="grain relative overflow-hidden pt-[132px] pb-20 md:pt-[176px] md:pb-28"
    >
      <motion.div
        className="absolute inset-0 -z-10"
        style={reduce ? undefined : { x: sx, y: auraY, translateY: sy }}
      >
        <Aura />
      </motion.div>

      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(1150px 640px at 50% -10%, rgba(232,135,58,0.13), rgba(232,135,58,0) 62%)",
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px]" aria-hidden="true">
        <FlightArcs />
      </div>

      <motion.div
        className="shell flex flex-col items-center text-center"
        style={reduce ? undefined : { y: driftY, opacity: fade }}
      >
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          animate={reduce ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: EASE }}
        >
          <Flourish className="mx-auto" />
        </motion.div>

        <motion.p
          className="eyebrow mt-7"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        >
          Smart India Hackathon · ISRO / Space Applications Centre
        </motion.p>

        <h1 className="display h-hero mt-5 max-w-[16ch]">
          <span className="sr-only">{HEADLINE}</span>
          <span aria-hidden="true">
            {words.map((w, i) => (
              <motion.span
                key={`${w}-${i}`}
                className="inline-block"
                initial={reduce ? false : { opacity: 0, y: "0.4em", filter: "blur(10px)" }}
                animate={reduce ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.95, ease: EASE, delay: 0.22 + i * 0.085 }}
              >
                {w}
                {i < words.length - 1 ? "\u00A0" : ""}
              </motion.span>
            ))}
          </span>
        </h1>

        <motion.p
          className="copy mx-auto mt-7 text-balance"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.62 }}
        >
          Jatayu is an agentic assistant for satellite imagery. Ask in plain language — in English
          or an Indian language — and get an answer grounded in evidence, with a full record of how
          it was reached.
        </motion.p>

        <motion.div
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.74 }}
        >
          <a className="btn btn-primary" href={DEMO_URL ?? "#see-it-run"} rel="noreferrer noopener">
            {DEMO_URL ? "Try the demo" : "See it run"}
          </a>
          <a className="btn btn-secondary" href={GITHUB_URL} target="_blank" rel="noreferrer noopener">
            View on GitHub
          </a>
        </motion.div>

        <motion.p
          className="mx-auto mt-10 max-w-[62ch] text-[14.5px] italic leading-[1.75]"
          style={{ color: "var(--color-ink-soft)" }}
          initial={reduce ? false : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.95 }}
        >
          In the Ramayana, Jatayu saw Sita&rsquo;s abduction from the air and, with his last breath,
          told Rama what happened and which way Ravana had gone. Observation, location, testimony —
          reported honestly, never guessed at.
        </motion.p>
      </motion.div>
    </section>
  );
}
