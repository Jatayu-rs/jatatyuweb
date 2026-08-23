"use client";

import { Reveal, SectionHead } from "./Ui";

const TRACE = [
  {
    stage: "Validate",
    detail: "2 scenes · GeoTIFF · EPSG:32644 · co-registration within 0.8 px",
    model: "validators.geotiff@0.3",
    ms: "0.42 s",
    colour: "var(--color-water)",
  },
  {
    stage: "Interpret",
    detail: "2 images · 2 dates · optical + SAR → bi-temporal fusion task",
    model: "task-rules (deterministic)",
    ms: "0.01 s",
    colour: "var(--color-nightsky)",
  },
  {
    stage: "Route",
    detail: "chain: change-detect → sar-optical-fusion → summarise",
    model: "orchestrator@0.2",
    ms: "0.06 s",
    colour: "var(--color-saffron)",
  },
  {
    stage: "Execute",
    detail: "flooded-vegetation mask · VH threshold −16.5 dB · NDVI > 0.35",
    model: "fusion-heuristic@0.1",
    ms: "8.31 s",
    colour: "var(--color-vegetation)",
  },
  {
    stage: "Report",
    detail: "map + GeoJSON + PDF · confidence 0.78 (pixel-level sensor agreement)",
    model: "report-builder@0.2",
    ms: "1.14 s",
    colour: "var(--color-built)",
  },
];

const STATS = [
  ["Every parameter recorded", "thresholds, model IDs, scene identifiers"],
  ["Confidence with a stated method", "never a number we can't explain"],
  ["Refuses rather than guesses", "malformed input gets an explanation"],
];

export default function Transparency() {
  return (
    <section className="band">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHead eyebrow="Show your working" title="Every answer comes with its reasoning attached.">
              <div className="copy space-y-5">
                <p>
                  Most AI tools give you an answer and no way to check it. If a planning decision or
                  an evacuation order rests on this, that isn&rsquo;t good enough.
                </p>
                <p>
                  Every Jatayu result carries an execution trace: which models ran, in what order,
                  with which parameters, and how long each step took. Every confidence figure states
                  the method that produced it. When the system doesn&rsquo;t have enough evidence, it
                  says so instead of guessing — and that is treated as a correct answer, not a
                  failure.
                </p>
              </div>
            </SectionHead>
          </div>

          <Reveal delay={0.08}>
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--color-line)] px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--color-line)]" aria-hidden="true" />
                  <span className="h-2 w-2 rounded-full bg-[var(--color-line)]" aria-hidden="true" />
                  <span className="h-2 w-2 rounded-full bg-[var(--color-line)]" aria-hidden="true" />
                  <span className="mono ml-2 text-[12px]" style={{ color: "var(--color-ink-soft)" }}>
                    execution trace
                  </span>
                </div>
                <span className="mono text-[11px]" style={{ color: "var(--color-ink-soft)" }}>
                  example
                </span>
              </div>

              <ol>
                {TRACE.map((step, i) => (
                  <li
                    key={step.stage}
                    className="flex gap-4 border-b border-[var(--color-line)] px-5 py-4 last:border-b-0"
                  >
                    <span
                      className="mono mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px]"
                      style={{ background: "rgba(22,22,29,0.04)", color: step.colour }}
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[15px] font-medium">{step.stage}</span>
                        <span className="mono shrink-0 text-[12px]" style={{ color: "var(--color-ink-soft)" }}>
                          {step.ms}
                        </span>
                      </div>
                      <p className="mt-1 text-[13.5px] leading-[1.55]" style={{ color: "var(--color-ink-soft)" }}>
                        {step.detail}
                      </p>
                      <p className="mono mt-1.5 truncate text-[12px]" style={{ color: "var(--color-nightsky)" }}>
                        {step.model}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {STATS.map(([title, note], i) => (
            <Reveal key={title} delay={i * 0.06}>
              <div className="card lift h-full p-6">
                <p className="text-[15.5px] font-medium">{title}</p>
                <p className="mt-1.5 text-[14.5px]" style={{ color: "var(--color-ink-soft)" }}>
                  {note}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
