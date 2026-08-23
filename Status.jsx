"use client";

import { Reveal, SectionHead, StatusPill } from "./Ui";
import { STATUS_ROWS, DOCS } from "@/lib/site";

export default function Status() {
  return (
    <section className="band">
      <div className="shell">
        <SectionHead eyebrow="Where we are" title="Built in the open, honestly.">
          <p className="copy">
            This table is the current state of the system, not a roadmap of intentions. It changes
            as things land.
          </p>
        </SectionHead>

        <Reveal delay={0.1}>
          <div className="card mt-12 overflow-hidden">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Current implementation status of each component.</caption>
              <thead>
                <tr className="border-b border-[var(--color-line)]">
                  <th scope="col" className="eyebrow px-5 py-4 font-medium md:px-7">
                    Component
                  </th>
                  <th scope="col" className="eyebrow hidden px-5 py-4 font-medium sm:table-cell md:px-7">
                    Notes
                  </th>
                  <th scope="col" className="eyebrow px-5 py-4 text-right font-medium md:px-7">
                    State
                  </th>
                </tr>
              </thead>
              <tbody>
                {STATUS_ROWS.map((row) => (
                  <tr key={row.item} className="border-b border-[var(--color-line)] last:border-b-0">
                    <th scope="row" className="px-5 py-4 text-left text-[15px] font-normal md:px-7">
                      {row.item}
                      <span
                        className="mt-1 block text-[13.5px] sm:hidden"
                        style={{ color: "var(--color-ink-soft)" }}
                      >
                        {row.note}
                      </span>
                    </th>
                    <td
                      className="hidden px-5 py-4 text-[14.5px] sm:table-cell md:px-7"
                      style={{ color: "var(--color-ink-soft)" }}
                    >
                      {row.note}
                    </td>
                    <td className="px-5 py-4 text-right md:px-7">
                      <StatusPill status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="mt-8">
            <p className="copy">
              Benchmark scores are published in the repository as they are measured, with the
              dataset split, sample count, date, and commit hash for each. If a number isn&rsquo;t in
              that file, we don&rsquo;t claim it.
            </p>
            <a
              className="mono mt-4 inline-flex items-center gap-2 text-[14px] underline underline-offset-4"
              style={{ color: "var(--color-nightsky)" }}
              href={DOCS.evaluation}
              target="_blank"
              rel="noreferrer noopener"
            >
              docs/evaluation.md
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" fill="none">
                <path d="M3 9l6-6M4.2 3H9v4.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
