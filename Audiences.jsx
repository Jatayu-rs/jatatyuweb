"use client";

import { Item, Reveal, SectionHead, Stagger } from "./Ui";

const GROUPS = [
  {
    title: "Disaster & field officers",
    body: "Ask what changed. Get an answer, a map, and a confidence you can act on today. No GIS training required.",
    colour: "var(--color-built)",
  },
  {
    title: "Planners & administrators",
    body: "Ask about growth in your ward. Get GeoJSON you can open in QGIS tomorrow morning, and a PDF you can attach to a proposal.",
    colour: "var(--color-saffron)",
  },
  {
    title: "Researchers & earth scientists",
    body: "Ask your research question. Get the analysis, the numbers, every parameter, and the provenance you need to defend the result.",
    colour: "var(--color-vegetation)",
  },
];

export default function Audiences() {
  return (
    <section id="for-whom" className="band">
      <div className="shell">
        <SectionHead eyebrow="Who it's for" title="One engine. Three depths." />

        <Stagger className="mt-14 grid gap-5 md:grid-cols-3">
          {GROUPS.map((g) => (
            <Item key={g.title} className="h-full">
              <article className="card lift group h-full p-7">
                <span
                  className="block h-[3px] w-9 rounded-full transition-all duration-500 group-hover:w-16"
                  style={{ background: g.colour }}
                  aria-hidden="true"
                />
                <h3 className="h-card mt-5">{g.title}</h3>
                <p className="mt-3 text-[15.5px] leading-[1.65]" style={{ color: "var(--color-ink-soft)" }}>
                  {g.body}
                </p>
              </article>
            </Item>
          ))}
        </Stagger>

        <Reveal delay={0.2}>
          <p className="mt-7 text-[14.5px] italic" style={{ color: "var(--color-ink-soft)" }}>
            Same pipeline throughout — the difference is how much of it you choose to see.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
