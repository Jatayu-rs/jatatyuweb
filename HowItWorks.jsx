"use client";

import { FlowArc } from "./Art";
import { Item, Reveal, SectionHead, Stagger } from "./Ui";

const STAGES = [
  {
    label: "Validate",
    colour: "var(--color-water)",
    body: "Formats, projections, band structure, and co-registration are checked before anything runs. Bad input gets a clear explanation, not a confident guess.",
  },
  {
    label: "Interpret",
    colour: "var(--color-nightsky)",
    body: "The task type is determined from the inputs themselves — how many images, which sensors, which dates. This step is arithmetic, not inference, so it cannot hallucinate.",
  },
  {
    label: "Route",
    colour: "var(--color-saffron)",
    body: "An agentic controller selects and sequences the appropriate specialist models, and can chain them for compound questions.",
  },
  {
    label: "Execute",
    colour: "var(--color-vegetation)",
    body: "Purpose-built remote-sensing models run — not one general model attempting everything.",
  },
  {
    label: "Report",
    colour: "var(--color-built)",
    body: "Text, visual evidence, a confidence score with its method stated, and a downloadable report.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="band">
      <div className="shell">
        <SectionHead
          eyebrow="How it works"
          title="One query. The right specialist. Every step visible."
        />

        <div className="relative mt-14">
          <FlowArc />
          <Stagger as="ol" className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {STAGES.map((stage, i) => (
              <Item key={stage.label} as="li" className="h-full">
                <div className="card lift h-full p-6">
                  <span
                    className="mono inline-flex h-8 w-8 items-center justify-center rounded-full border text-[12px]"
                    style={{ borderColor: stage.colour, color: stage.colour, background: "var(--color-paper-raised)" }}
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <h3 className="h-card mt-4">
                    <span className="sr-only">{`Stage ${i + 1}: `}</span>
                    {stage.label}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-[1.65]" style={{ color: "var(--color-ink-soft)" }}>
                    {stage.body}
                  </p>
                </div>
              </Item>
            ))}
          </Stagger>
        </div>

        <Reveal delay={0.1}>
          <aside
            className="mt-8 rounded-[16px] border p-7 md:p-9"
            style={{ background: "var(--color-saffron-soft)", borderColor: "rgba(232,135,58,0.35)" }}
          >
            <h3 className="h-card">Why not one big model?</h3>
            <p className="copy mt-3" style={{ color: "#5A452F" }}>
              A vision-language model trained on internet photographs has effectively never seen a
              nadir-view multispectral tile. Its image embeddings carry almost no information
              distinguishing coniferous from mixed forest, or a paddy field at tillering from one at
              heading — and the language model downstream will confabulate fluently from that noise.
              Jatayu adapts its vision component to remote-sensing imagery and dispatches to
              specialists per task.
            </p>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
