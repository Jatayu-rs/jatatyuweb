"use client";

import { Reveal, SectionHead } from "./Ui";
import { DOCS, GITHUB_URL } from "@/lib/site";

const LINKS = [
  { title: "Architecture", note: "How the pipeline is put together, and where each model sits.", href: DOCS.architecture },
  { title: "Design decisions (ADRs)", note: "What we chose, what we rejected, and the trade-off in each case.", href: DOCS.adrs },
  { title: "Benchmark results", note: "Scores with dataset split, sample count, date, and commit hash.", href: DOCS.evaluation },
];

export default function OpenSource() {
  return (
    <section id="open-source" className="band">
      <div className="shell">
        <SectionHead eyebrow="Open source" title="Read the code. Check the working.">
          <p className="copy">
            Jatayu is developed in the open. The architecture, the design decisions and their
            trade-offs, the dataset provenance, and the benchmark results are all in the repository.
          </p>
        </SectionHead>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {LINKS.map((link, i) => (
            <Reveal key={link.title} delay={i * 0.06}>
              <a
                className="card lift group flex h-full flex-col justify-between p-7"
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
              >
                <div>
                  <h3 className="h-card">{link.title}</h3>
                  <p className="mt-2.5 text-[15px] leading-[1.6]" style={{ color: "var(--color-ink-soft)" }}>
                    {link.note}
                  </p>
                </div>
                <span
                  className="mono mt-6 inline-flex items-center gap-2 text-[13px]"
                  style={{ color: "var(--color-nightsky)" }}
                >
                  Open on GitHub
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" fill="none">
                    <path d="M3 9l6-6M4.2 3H9v4.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10">
            <a className="btn btn-primary" href={GITHUB_URL} target="_blank" rel="noreferrer noopener">
              View the repository
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
