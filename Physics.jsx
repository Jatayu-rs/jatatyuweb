"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE, Item, Reveal, SectionHead, Stagger } from "./Ui";

const CELLS = {
  ww: {
    key: "ww",
    name: "Open water",
    note: "both agree",
    colour: "var(--color-water)",
    tint: "rgba(33,102,172,0.10)",
    optical: 12,
    radar: 8,
    detail:
      "A calm surface is a mirror at radar wavelengths: the pulse reflects away from the satellite and almost nothing comes back. Optical bands see low reflectance in near-infrared. Both sensors point the same way, so this class is the easy one.",
  },
  wv: {
    key: "wv",
    name: "Smooth bare ground",
    note: "sand, tarmac, or radar shadow",
    colour: "var(--color-bare)",
    tint: "rgba(244,226,178,0.35)",
    optical: 62,
    radar: 11,
    detail:
      "Radar sees a dark, smooth surface and could call it water. Optical says otherwise — bright, dry, vegetated or bare. Tarmac, dry sand, and terrain hidden in radar shadow all land here. Without the optical evidence these pixels get misread as flood.",
  },
  bw: {
    key: "bw",
    name: "Built-up",
    note: "both agree",
    colour: "var(--color-built)",
    tint: "rgba(214,96,77,0.10)",
    optical: 48,
    radar: 88,
    detail:
      "A wall meeting the ground forms a right-angled corner, and a corner sends the pulse straight back to the satellite — double-bounce. Backscatter is strong and consistent, which is why radar is the better sensor for tracking construction.",
  },
  bv: {
    key: "bv",
    name: "Flooded vegetation",
    note: "water beneath a canopy, invisible to optical alone",
    colour: "var(--color-flooded)",
    tint: "rgba(146,197,222,0.22)",
    optical: 58,
    radar: 79,
    detail:
      "The pulse passes through the canopy, bounces off the water below, hits the trunks, and returns — double-bounce again, but brighter than dry forest. Optical sees only leaves. This is the cell that cannot be reached with one sensor, and it is the one that matters during a flood.",
    star: true,
  },
};

function Bars({ optical, radar }) {
  const reduce = useReducedMotion();
  const rows = [
    ["Optical reflectance", optical, "var(--color-vegetation)"],
    ["Radar backscatter", radar, "var(--color-nightsky)"],
  ];
  return (
    <div className="mt-5 flex flex-col gap-3">
      {rows.map(([label, value, colour]) => (
        <div key={label}>
          <div className="flex items-baseline justify-between">
            <span className="eyebrow">{label}</span>
            <span className="mono text-[12px]" style={{ color: "var(--color-ink-soft)" }}>
              {value < 25 ? "low" : value < 65 ? "mid" : "high"}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full" style={{ background: "rgba(22,22,29,0.06)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: colour }}
              initial={reduce ? false : { width: 0 }}
              animate={{ width: `${value}%` }}
              transition={{ duration: 0.8, ease: EASE }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Cell({ cell, selected, onSelect }) {
  return (
    <td className="border border-[var(--color-line)] p-0 align-top" style={{ background: cell.tint }}>
      <button
        type="button"
        onClick={() => onSelect(cell.key)}
        aria-pressed={selected}
        className="h-full w-full cursor-pointer p-5 text-left transition-colors"
        style={{ background: selected ? "rgba(255,255,255,0.62)" : "transparent" }}
      >
        <span className="flex items-center gap-2">
          <span
            className="block h-3 w-3 rounded-[3px]"
            style={{ background: cell.colour, outline: "1px solid rgba(22,22,29,0.12)" }}
            aria-hidden="true"
          />
          {cell.star ? (
            <span className="mono text-[10.5px]" style={{ color: "var(--color-nightsky)" }}>
              the interesting cell
            </span>
          ) : null}
        </span>
        <span className="mt-3 block text-[15.5px] font-medium">{cell.name}</span>
        <span className="mt-1 block text-[14px] leading-[1.55]" style={{ color: "var(--color-ink-soft)" }}>
          {cell.note}
        </span>
        <span className="mono mt-3 block text-[11px]" style={{ color: "var(--color-nightsky)" }}>
          {selected ? "shown below" : "why →"}
        </span>
      </button>
    </td>
  );
}

export default function Physics() {
  const [sel, setSel] = useState("bv");
  const cell = CELLS[sel];
  const reduce = useReducedMotion();

  return (
    <section className="band" style={{ background: "linear-gradient(180deg, rgba(43,58,103,0.04), rgba(43,58,103,0))" }}>
      <div className="shell">
        <SectionHead eyebrow="Physics, not guesswork" title="When two sensors disagree, that's the finding.">
          <div className="copy space-y-5">
            <p>
              Radar doesn&rsquo;t take pictures. It fires a microwave pulse and measures the echo.
              Calm water reflects that pulse away from the satellite, so water returns almost
              nothing. A building wall meeting the ground forms a corner that bounces the pulse
              straight back, so built-up areas return strongly.
            </p>
            <p>
              Optical bands give independent evidence of the same ground. Cross-tabulate the two and
              you get four classes — and the two where the sensors disagree are the interesting
              ones. Pick a cell to see what each sensor reports.
            </p>
          </div>
        </SectionHead>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <Reveal>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse overflow-hidden rounded-[16px] bg-[var(--color-paper-raised)] text-left">
                <caption className="sr-only">
                  Cross-tabulation of radar backscatter against optical classification. Select a cell
                  for an explanation.
                </caption>
                <thead>
                  <tr>
                    <th scope="col" className="w-[130px] border border-[var(--color-line)] p-4">
                      <span className="sr-only">Sensor combination</span>
                    </th>
                    <th scope="col" className="eyebrow border border-[var(--color-line)] p-4 font-medium">
                      Optical says water
                    </th>
                    <th scope="col" className="eyebrow border border-[var(--color-line)] p-4 font-medium">
                      Optical says vegetation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row" className="eyebrow border border-[var(--color-line)] p-4 text-left font-medium">
                      Radar dark
                    </th>
                    <Cell cell={CELLS.ww} selected={sel === "ww"} onSelect={setSel} />
                    <Cell cell={CELLS.wv} selected={sel === "wv"} onSelect={setSel} />
                  </tr>
                  <tr>
                    <th scope="row" className="eyebrow border border-[var(--color-line)] p-4 text-left font-medium">
                      Radar bright
                    </th>
                    <Cell cell={CELLS.bw} selected={sel === "bw"} onSelect={setSel} />
                    <Cell cell={CELLS.bv} selected={sel === "bv"} onSelect={setSel} />
                  </tr>
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="card p-7" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={cell.key}
                  initial={reduce ? false : { opacity: 0, y: 12, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <span
                    className="block h-[3px] w-9 rounded-full"
                    style={{ background: cell.colour }}
                    aria-hidden="true"
                  />
                  <h3 className="h-card mt-5">{cell.name}</h3>
                  <p className="mt-3 text-[15px] leading-[1.65]" style={{ color: "var(--color-ink-soft)" }}>
                    {cell.detail}
                  </p>
                  <Bars optical={cell.optical} radar={cell.radar} />
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.16}>
          <p className="display mt-12 max-w-[34ch] text-[22px] leading-[1.35] md:text-[27px]">
            Flooded vegetation is water under trees. An optical image physically cannot see it. That
            single cell is the entire argument for combining sensors — and it is derived from physics
            we can explain, not from a model we would have to ask you to trust.
          </p>
        </Reveal>

        <Stagger className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-[var(--color-line)] pt-6">
          <Item>
            <p className="text-[14px]" style={{ color: "var(--color-ink-soft)" }}>
              The brand palette is the data palette — these are the false-colour conventions of
              remote sensing:
            </p>
          </Item>
          {[
            ["Water", "var(--color-water)"],
            ["Built-up", "var(--color-built)"],
            ["Vegetation", "var(--color-vegetation)"],
            ["Flooded vegetation", "var(--color-flooded)"],
            ["Bare ground", "var(--color-bare)"],
          ].map(([name, colour]) => (
            <Item key={name}>
              <span className="flex items-center gap-2 text-[13px]" style={{ color: "var(--color-ink-soft)" }}>
                <span
                  className="h-2.5 w-2.5 rounded-[2px]"
                  style={{ background: colour, outline: "1px solid rgba(22,22,29,0.12)" }}
                  aria-hidden="true"
                />
                {name}
              </span>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
