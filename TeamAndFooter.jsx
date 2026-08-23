"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE, GithubIcon, Item, LinkedinIcon, Reveal, SectionHead, Stagger, Wordmark } from "./Ui";
import { TEAM, PS_ID, NAV, GITHUB_URL } from "@/lib/site";

function initials(name) {
  const clean = name.replace(/[[\]]/g, "").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (!parts.length || clean.toLowerCase() === "name") return "—";
  return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join("");
}

function Avatar({ member }) {
  if (member.photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={member.photo}
        alt={`${member.name}, ${member.role}`}
        width={60}
        height={60}
        loading="lazy"
        className="h-[60px] w-[60px] shrink-0 rounded-full object-cover"
        style={{ border: "1px solid var(--color-line)" }}
      />
    );
  }
  return (
    <span
      className="display flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full text-[19px]"
      style={{
        background: "var(--color-saffron-soft)",
        color: "#8A4F17",
        border: "1px solid var(--color-line)",
      }}
      aria-hidden="true"
    >
      {initials(member.name)}
    </span>
  );
}

function Social({ href, label, children }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border transition-colors"
      style={{ borderColor: "var(--color-line)", color: "var(--color-ink-soft)" }}
    >
      {children}
    </a>
  );
}

export function Team() {
  const reduce = useReducedMotion();

  return (
    <section className="band">
      <div className="shell">
        <SectionHead eyebrow="The team" title="Six people, one pipeline." />

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((member, i) => (
            <Item key={`${member.role}-${i}`}>
              <motion.article
                className="card h-full p-7"
                whileHover={reduce ? undefined : { y: -4 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <div className="flex items-center gap-4">
                  <Avatar member={member} />
                  <div className="min-w-0">
                    <h3 className="h-card truncate">{member.name}</h3>
                    <p className="eyebrow mt-1">{member.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-[15px] leading-[1.6]" style={{ color: "var(--color-ink-soft)" }}>
                  {member.owns}
                </p>
                <div className="mt-5 flex gap-2">
                  <Social href={member.github} label={`${member.name} on GitHub`}>
                    <GithubIcon />
                  </Social>
                  <Social href={member.linkedin} label={`${member.name} on LinkedIn`}>
                    <LinkedinIcon />
                  </Social>
                </div>
              </motion.article>
            </Item>
          ))}
        </Stagger>

        <Reveal delay={0.2}>
          <p className="mt-8 text-[14px]" style={{ color: "var(--color-ink-soft)" }}>
            Smart India Hackathon · Problem statement {PS_ID} · Issued by ISRO / Space Applications
            Centre
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--color-line)]">
      <div className="shell py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Wordmark size="lg" />
            <p className="mt-4 max-w-[36ch] text-[14.5px]" style={{ color: "var(--color-ink-soft)" }}>
              An agentic assistant for satellite imagery. Built for Smart India Hackathon.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-col gap-2">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    className="text-[14.5px] transition-colors hover:text-[var(--color-ink)]"
                    style={{ color: "var(--color-ink-soft)" }}
                    href={item.href}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:text-right">
            <a
              className="inline-flex items-center gap-2 text-[14.5px]"
              style={{ color: "var(--color-ink-soft)" }}
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer noopener"
            >
              <GithubIcon />
              GitHub
            </a>
          </div>
        </div>

        <p className="mt-12 border-t border-[var(--color-line)] pt-6 text-[13px]" style={{ color: "var(--color-ink-soft)" }}>
          Jatayu is a student project built for Smart India Hackathon. It is not affiliated with or
          endorsed by ISRO or the Space Applications Centre.
        </p>
      </div>
    </footer>
  );
}
