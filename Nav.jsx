"use client";

import { useState } from "react";
import { Wordmark } from "./Ui";
import { NAV, GITHUB_URL, DEMO_URL } from "@/lib/site";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 rounded-[22px] border border-[var(--color-line)] px-4 py-2.5 md:rounded-full md:px-5"
        style={{
          background: "rgba(251, 250, 247, 0.78)",
          backdropFilter: "saturate(160%) blur(14px)",
          WebkitBackdropFilter: "saturate(160%) blur(14px)",
        }}
      >
        <a href="#top" className="flex items-center rounded-lg" aria-label="Jatayu — home">
          <Wordmark />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <a className="navlink" href={item.href}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            className="btn btn-secondary btn-sm hidden sm:inline-flex"
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHub
          </a>
          <a
            className="btn btn-primary btn-sm"
            href={DEMO_URL ?? GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
          >
            {DEMO_URL ? "Try the demo" : "Run it locally"}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-line)] lg:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              {open ? (
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              ) : (
                <path d="M2 5h12M2 11h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open ? (
        <div
          id="mobile-menu"
          className="mx-auto mt-2 max-w-[1200px] rounded-[22px] border border-[var(--color-line)] bg-[var(--color-paper-raised)] p-3 lg:hidden"
        >
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  className="block rounded-xl px-3 py-2.5 text-[15px] text-[var(--color-ink-soft)] hover:bg-[rgba(22,22,29,0.04)]"
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                className="block rounded-xl px-3 py-2.5 text-[15px] text-[var(--color-ink-soft)] hover:bg-[rgba(22,22,29,0.04)]"
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer noopener"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
