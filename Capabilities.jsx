"use client";

import { Item, SectionHead, Stagger, StatusPill } from "./Ui";
import { CAPABILITIES } from "@/lib/site";

export default function Capabilities() {
  return (
    <section id="capabilities" className="band">
      <div className="shell">
        <SectionHead eyebrow="Capabilities" title="Five things, done properly.">
          <p className="copy">
            Each capability carries its real state today. Nothing here is labelled working unless it
            runs in the repository.
          </p>
        </SectionHead>

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((cap) => (
            <Item key={cap.title} className="h-full">
              <article className="card lift group flex h-full flex-col p-7">
                <span
                  className="block h-[3px] w-9 rounded-full transition-all duration-500 group-hover:w-16"
                  style={{ background: cap.accent }}
                  aria-hidden="true"
                />
                <div className="mt-5 flex items-start justify-between gap-3">
                  <h3 className="h-card">{cap.title}</h3>
                  <StatusPill status={cap.status} />
                </div>
                <p className="mt-2 text-[14px] italic" style={{ color: "var(--color-ink-soft)" }}>
                  {cap.kicker}
                </p>
                <p className="mt-3 text-[15px] leading-[1.65]" style={{ color: "var(--color-ink-soft)" }}>
                  {cap.body}
                </p>
              </article>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
