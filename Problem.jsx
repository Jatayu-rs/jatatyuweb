"use client";

import { Reveal, SectionHead } from "./Ui";

const TODAY = [
  "Find and download scenes manually",
  "Write cloud masking and reprojection code",
  "Know which model fits which task",
  "Interpret raw index values yourself",
  "No record of how a result was produced",
];

const WITH = [
  "Ask in plain language, in your own language",
  "Validation and preprocessing handled",
  "The right specialist model selected for you",
  "An answer, a map, and a stated confidence",
  "A full auditable trace of every step",
];

function Mark({ kind }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      className="mt-[7px] shrink-0"
      aria-hidden="true"
      focusable="false"
    >
      {kind === "today" ? (
        <path d="M4 4l8 8M12 4l-8 8" stroke="var(--color-built)" strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <path
          d="M3 8.5l3.2 3.2L13 5"
          stroke="var(--color-vegetation)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      )}
    </svg>
  );
}

function Column({ title, items, kind, tint }) {
  return (
    <div className="card lift p-7 md:p-9" style={tint ? { background: "var(--color-saffron-soft)" } : undefined}>
      <h3 className="h-card">{title}</h3>
      <ul className="mt-6 flex flex-col gap-3.5">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[16px] leading-[1.6]" style={{ color: "var(--color-ink-soft)" }}>
            <Mark kind={kind} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Problem() {
  return (
    <section id="overview" className="band">
      <div className="shell">
        <SectionHead
          eyebrow="The problem"
          title="Satellite data answers questions no one can afford to ask."
        >
          <div className="copy space-y-5">
            <p>
              Getting one answer out of satellite imagery means finding the right scenes, masking
              cloud, reprojecting, resampling, stacking bands, and writing hundreds of lines of
              code. The science is the last five lines.
            </p>
            <p>
              A researcher can do it, and loses days to plumbing. A district disaster officer cannot
              do it at all — and they are the one who needs to know which villages are underwater
              tonight.
            </p>
          </div>
        </SectionHead>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <Reveal>
            <Column title="Today" items={TODAY} kind="today" />
          </Reveal>
          <Reveal delay={0.06}>
            <Column title="With Jatayu" items={WITH} kind="with" tint />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
