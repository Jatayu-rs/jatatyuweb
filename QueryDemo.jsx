"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE, Reveal, SectionHead } from "./Ui";

/* ── An illustrated walkthrough, NOT a live model run ──────────
   Pick a question, watch the five stages execute and the trace
   fill in. Everything here is scripted and labelled as such: the
   badge in the panel header says so, and so does the caption.
   When the real demo exists, point people at it instead.        */

const STAGES = ["Validate", "Interpret", "Route", "Execute", "Report"];

const SCENARIOS = [
  {
    id: "flood",
    chip: "Flood extent",
    lang: "English",
    q: "Which areas along the river flooded after last night's rain?",
    trace: [
      { d: "2 scenes · GeoTIFF · EPSG:32644 · co-registered to 0.8 px", m: "validators.geotiff@0.3", t: "0.42 s" },
      { d: "2 images · 2 dates · optical + SAR → bi-temporal fusion", m: "task-rules (deterministic)", t: "0.01 s" },
      { d: "chain: change-detect → sar-optical-fusion → summarise", m: "orchestrator@0.2", t: "0.06 s" },
      { d: "VH threshold −16.5 dB · NDVI > 0.35 · 4-class cross-tab", m: "fusion-heuristic@0.1", t: "8.31 s" },
      { d: "map + GeoJSON + PDF · confidence 0.78 (sensor agreement)", m: "report-builder@0.2", t: "1.14 s" },
    ],
    answer:
      "Open water expanded by 12.4 km² along the left bank. A further 3.1 km² reads as flooded vegetation — water under canopy that the optical scene alone does not show.",
    confidence: "0.78",
    method: "pixel-level sensor agreement",
    highlight: ["water", "flooded"],
  },
  {
    id: "growth",
    chip: "Built-up change",
    lang: "Hindi",
    q: "इस वार्ड में पिछले दो साल में कितना निर्माण हुआ?",
    trace: [
      { d: "2 scenes · same tile · 2023-11 and 2025-11 · cloud < 4%", m: "validators.geotiff@0.3", t: "0.39 s" },
      { d: "2 images · 2 dates · optical only → bi-temporal change", m: "task-rules (deterministic)", t: "0.01 s" },
      { d: "chain: translate-in → change-detect → summarise → translate-out", m: "orchestrator@0.2", t: "0.08 s" },
      { d: "change mask over 18.7 km² tile · 6 contiguous parcels", m: "change-vqa@0.1", t: "6.02 s" },
      { d: "उत्तर + GeoJSON · confidence 0.71 (mask area agreement)", m: "report-builder@0.2", t: "1.02 s" },
    ],
    answer:
      "Built-up area grew by 2.2 km², concentrated in six parcels along the northern edge. Most of it replaced bare ground rather than vegetation. The answer returns in the language it was asked in.",
    confidence: "0.71",
    method: "mask area agreement",
    highlight: ["built"],
  },
  {
    id: "refuse",
    chip: "Bad input",
    lang: "English",
    q: "Compare these two scenes and tell me what changed.",
    trace: [
      { d: "2 scenes · EPSG:32644 and EPSG:4326 · reprojection required", m: "validators.geotiff@0.3", t: "0.44 s" },
      { d: "co-registration offset 47.3 px · exceeds 2 px tolerance", m: "validators.coreg@0.3", t: "0.61 s" },
      { d: "halt · no specialist dispatched", m: "orchestrator@0.2", t: "0.01 s" },
      { d: "—", m: "—", t: "—" },
      { d: "explanation returned in place of a result", m: "report-builder@0.2", t: "0.09 s" },
    ],
    answer:
      "These two scenes are not aligned — they are offset by roughly 47 pixels, so any change map would be measuring the misalignment, not the ground. Reproject both to a common CRS and re-register, then ask again.",
    confidence: null,
    method: null,
    highlight: [],
    refusal: true,
  },
];

/* Deterministic synthetic scene — a schematic, not real imagery. */
const COLS = 16;
const ROWS = 10;

function buildScene() {
  const cells = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const river = Math.abs(y - (3 + Math.sin(x / 2.6) * 2.1)) < 1.05;
      const bank = Math.abs(y - (3 + Math.sin(x / 2.6) * 2.1)) < 2.2;
      const town = x > 9 && y > 5 && (x + y) % 3 !== 0;
      let kind = "vegetation";
      if (river) kind = "water";
      else if (bank) kind = "flooded";
      else if (town) kind = "built";
      else if ((x * 7 + y * 3) % 11 === 0) kind = "bare";
      cells.push({ x, y, kind });
    }
  }
  return cells;
}

const FILL = {
  water: "var(--color-water)",
  built: "var(--color-built)",
  vegetation: "var(--color-vegetation)",
  flooded: "var(--color-flooded)",
  bare: "var(--color-bare)",
};

function Scene({ highlight, active }) {
  const cells = useMemo(buildScene, []);
  const reduce = useReducedMotion();
  const on = highlight.length > 0;

  return (
    <svg
      viewBox={`0 0 ${COLS * 12} ${ROWS * 12}`}
      className="h-full w-full rounded-[10px]"
      role="img"
      aria-label="Schematic land-cover tile. Highlighted cells show the classes the query resolved to."
    >
      {cells.map((c) => {
        const lit = on && highlight.includes(c.kind);
        return (
          <motion.rect
            key={`${c.x}-${c.y}`}
            x={c.x * 12}
            y={c.y * 12}
            width={12}
            height={12}
            fill={FILL[c.kind]}
            initial={false}
            animate={{
              opacity: !active ? 0.34 : lit ? 1 : on ? 0.16 : 0.5,
            }}
            transition={{
              duration: reduce ? 0 : 0.5,
              ease: EASE,
              delay: reduce ? 0 : (c.x * 0.006 + c.y * 0.012),
            }}
          />
        );
      })}
    </svg>
  );
}

export default function QueryDemo() {
  const [pick, setPick] = useState(0);
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);
  const timers = useRef([]);
  const reduce = useReducedMotion();
  const scenario = SCENARIOS[pick];

  function clear() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  function run(index = pick) {
    clear();
    setPick(index);
    setDone(false);
    setStep(-1);
    if (reduce) {
      setStep(4);
      setDone(true);
      return;
    }
    STAGES.forEach((_, i) => {
      timers.current.push(setTimeout(() => setStep(i), 220 + i * 620));
    });
    timers.current.push(setTimeout(() => setDone(true), 220 + STAGES.length * 620));
  }

  useEffect(() => clear, []);

  return (
    <section id="see-it-run" className="band">
      <div className="shell">
        <SectionHead eyebrow="See it run" title="Pick a question. Watch the pipeline answer it.">
          <p className="copy">
            A walkthrough of the five stages on three representative questions — including one the
            system should refuse. The timings and parameters are the shape of a real run, not a
            recording of one.
          </p>
        </SectionHead>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap gap-2">
            {SCENARIOS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => run(i)}
                aria-pressed={i === pick}
                className="rounded-full border px-4 py-2 text-[14px] transition-colors"
                style={{
                  borderColor: i === pick ? "var(--color-ink)" : "var(--color-line)",
                  background: i === pick ? "var(--color-ink)" : "var(--color-paper-raised)",
                  color: i === pick ? "#fff" : "var(--color-ink-soft)",
                }}
              >
                {s.chip}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="card mt-5 overflow-hidden">
            {/* header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-line)] px-5 py-3.5">
              <span className="mono text-[12px]" style={{ color: "var(--color-ink-soft)" }}>
                jatayu · session walkthrough
              </span>
              <span
                className="mono rounded-full px-2.5 py-1 text-[11px]"
                style={{ background: "rgba(22,22,29,0.05)", color: "var(--color-ink-soft)" }}
              >
                illustration — not a live model run
              </span>
            </div>

            {/* query line */}
            <div className="flex flex-wrap items-start gap-3 border-b border-[var(--color-line)] px-5 py-5">
              <span
                className="mono mt-1 rounded-full px-2 py-0.5 text-[11px]"
                style={{ background: "var(--color-saffron-soft)", color: "#8A4F17" }}
              >
                {scenario.lang}
              </span>
              <p className="flex-1 text-[16px] md:text-[17px]">{scenario.q}</p>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => run(pick)}>
                {step < 0 ? "Run" : "Run again"}
              </button>
            </div>

            <div className="grid gap-0 lg:grid-cols-[1.15fr_1fr]">
              {/* stages + trace */}
              <div className="border-b border-[var(--color-line)] lg:border-b-0 lg:border-r">
                <ol className="flex flex-wrap gap-1.5 px-5 py-4">
                  {STAGES.map((label, i) => {
                    const state = step >= i ? (step === i && !done ? "active" : "done") : "idle";
                    return (
                      <li key={label}>
                        <span
                          className="mono inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] transition-colors duration-300"
                          style={{
                            background:
                              state === "idle" ? "rgba(22,22,29,0.04)" : "var(--color-saffron-soft)",
                            color: state === "idle" ? "var(--color-ink-soft)" : "#8A4F17",
                          }}
                        >
                          <motion.span
                            className="inline-block h-1.5 w-1.5 rounded-full"
                            style={{
                              background:
                                state === "idle" ? "var(--color-line)" : "var(--color-saffron)",
                            }}
                            animate={
                              state === "active" && !reduce ? { scale: [1, 1.6, 1], opacity: [1, 0.5, 1] } : {}
                            }
                            transition={{ duration: 0.7, repeat: state === "active" ? Infinity : 0 }}
                          />
                          {label}
                        </span>
                      </li>
                    );
                  })}
                </ol>

                <ol className="min-h-[268px] px-5 pb-5">
                  <AnimatePresence initial={false}>
                    {scenario.trace.slice(0, Math.max(step + 1, 0)).map((row, i) => (
                      <motion.li
                        key={`${scenario.id}-${i}`}
                        initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="flex gap-3 border-b border-[var(--color-line)] py-3 last:border-b-0"
                      >
                        <span
                          className="mono mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10.5px]"
                          style={{ background: "rgba(22,22,29,0.04)", color: "var(--color-nightsky)" }}
                          aria-hidden="true"
                        >
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-3">
                            <span className="text-[14px] font-medium">{STAGES[i]}</span>
                            <span className="mono shrink-0 text-[11.5px]" style={{ color: "var(--color-ink-soft)" }}>
                              {row.t}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[13px] leading-[1.5]" style={{ color: "var(--color-ink-soft)" }}>
                            {row.d}
                          </p>
                          <p className="mono mt-1 truncate text-[11.5px]" style={{ color: "var(--color-nightsky)" }}>
                            {row.m}
                          </p>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>

                  {step < 0 ? (
                    <li className="py-14 text-center text-[14px]" style={{ color: "var(--color-ink-soft)" }}>
                      Press Run to step through the pipeline.
                    </li>
                  ) : null}
                </ol>
              </div>

              {/* scene + answer */}
              <div className="flex flex-col p-5">
                <div
                  className="aspect-[16/10] w-full overflow-hidden rounded-[12px] border"
                  style={{ borderColor: "var(--color-line)", background: "var(--color-paper)" }}
                >
                  <Scene highlight={done ? scenario.highlight : []} active={step >= 3} />
                </div>

                <div className="mt-4 min-h-[150px]">
                  <AnimatePresence mode="wait">
                    {done ? (
                      <motion.div
                        key={scenario.id}
                        initial={reduce ? false : { opacity: 0, y: 12, filter: "blur(6px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: EASE }}
                      >
                        {scenario.refusal ? (
                          <span
                            className="mono inline-block rounded-full px-2.5 py-1 text-[11px]"
                            style={{ background: "rgba(214,96,77,0.10)", color: "#8E3323" }}
                          >
                            refused — input not usable
                          </span>
                        ) : null}
                        <p className="mt-2 text-[15.5px] leading-[1.6]">{scenario.answer}</p>
                        {scenario.confidence ? (
                          <p className="mono mt-3 text-[12px]" style={{ color: "var(--color-ink-soft)" }}>
                            confidence {scenario.confidence} · {scenario.method}
                          </p>
                        ) : null}
                      </motion.div>
                    ) : (
                      <motion.p
                        key="waiting"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-[14px]"
                        style={{ color: "var(--color-ink-soft)" }}
                      >
                        {step < 0 ? "No result yet." : "Working…"}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-4 text-[13.5px]" style={{ color: "var(--color-ink-soft)" }}>
            The tile is a schematic in the data palette, not satellite imagery. Real outputs, and the
            benchmark numbers behind them, are in the repository.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
