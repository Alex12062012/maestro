"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ListIcon, XIcon } from "@phosphor-icons/react";

const LINKS = [
  { href: "/test", label: "Test" },
  { href: "/programme", label: "Programme" },
  { href: "/exercices", label: "Exercices" },
  { href: "/suivi", label: "Suivi" },
];

type NavLinksProps = { current?: string; onNavigate: () => void };

function NavLinks({ current, onNavigate }: NavLinksProps) {
  return LINKS.map(({ href, label }) => {
    const active =
      current !== undefined &&
      (current === href || current.startsWith(`${href}/`));
    return (
      <li key={href} className="border-t border-line md:border-0">
        <Link
          href={href}
          onClick={onNavigate}
          aria-current={active ? "page" : undefined}
          className="flex h-14 items-center text-3xl font-bold uppercase font-stretch-75% text-ink-2 hover:text-ink aria-[current=page]:text-ink aria-[current=page]:underline aria-[current=page]:decoration-2 md:h-10 md:text-base md:font-semibold md:tracking-[0.04em]"
        >
          {label}
        </Link>
      </li>
    );
  });
}

// usePathname peut suspendre sur une route dynamique non pré-générée :
// le Suspense garde les liens visibles (sans état actif) dans ce cas.
function ActiveNavLinks({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  return <NavLinks current={pathname} onNavigate={onNavigate} />;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          onClick={close}
          className="text-[1.75rem] leading-none font-extrabold tracking-[0.02em] font-stretch-75%"
        >
          MAESTRO
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-principal"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          className="-mr-2 inline-flex size-11 items-center justify-center rounded text-ink md:hidden"
        >
          {open ? (
            <XIcon size={26} weight="regular" aria-hidden />
          ) : (
            <ListIcon size={26} weight="regular" aria-hidden />
          )}
        </button>

        <nav
          id="menu-principal"
          aria-label="Navigation principale"
          className={`${open ? "block animate-menu-in" : "hidden"} absolute inset-x-0 top-16 border-b border-line bg-bg px-5 pb-6 md:static md:block md:border-0 md:p-0`}
        >
          <ul className="flex flex-col md:flex-row md:items-center md:gap-9">
            <Suspense fallback={<NavLinks onNavigate={close} />}>
              <ActiveNavLinks onNavigate={close} />
            </Suspense>
          </ul>
        </nav>
      </div>
    </header>
  );
}
