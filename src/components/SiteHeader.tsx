"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import { Wordmark } from "@/components/Wordmark";

const LINKS = [
  { href: "/test", label: "Test" },
  { href: "/programme", label: "Programme" },
  { href: "/exercices", label: "Exercices" },
  { href: "/suivi", label: "Suivi" },
];

export function SiteHeader() {
  // usePathname peut suspendre sur une route dynamique non pré-générée
  // (cacheComponents) : le fallback garde le header complet, sans état actif.
  return (
    <Suspense fallback={<HeaderBar />}>
      <HeaderWithPathname />
    </Suspense>
  );
}

function HeaderWithPathname() {
  return <HeaderBar pathname={usePathname()} />;
}

function HeaderBar({ pathname }: { pathname?: string }) {
  const here = pathname ?? "";
  // Le menu est ouvert pour une page donnée : toute navigation
  // (lien, retour, avance) le referme d'elle-même.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === here;
  const close = () => setOpenOn(null);

  const toggleRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (navRef.current?.contains(document.activeElement)) {
        toggleRef.current?.focus();
      }
      setOpenOn(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <div className="mx-auto flex h-(--header-h) max-w-6xl items-center justify-between px-5 md:px-8">
        <Link href="/" onClick={close} className="inline-flex h-11 items-center">
          <Wordmark />
        </Link>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpenOn(open ? null : here)}
          aria-expanded={open}
          aria-controls="menu-principal"
          aria-label="Menu"
          className="-mr-2 inline-flex size-11 items-center justify-center rounded text-ink md:hidden"
        >
          {open ? (
            <XIcon size={26} weight="regular" aria-hidden />
          ) : (
            <ListIcon size={26} weight="regular" aria-hidden />
          )}
        </button>

        <nav
          ref={navRef}
          id="menu-principal"
          aria-label="Navigation principale"
          className={`${open ? "block animate-menu-in" : "hidden"} absolute inset-x-0 top-(--header-h) border-b border-line bg-bg px-5 pb-6 md:static md:block md:border-0 md:p-0`}
        >
          <ul className="flex flex-col md:flex-row md:items-center md:gap-9">
            {LINKS.map(({ href, label }) => {
              const active =
                pathname !== undefined &&
                (pathname === href || pathname.startsWith(`${href}/`));
              return (
                <li key={href} className="border-t border-line md:border-0">
                  <Link
                    href={href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className="flex h-14 items-center text-3xl font-bold uppercase font-stretch-75% text-ink-2 hover:text-ink aria-[current=page]:text-ink aria-[current=page]:underline aria-[current=page]:decoration-2 md:h-11 md:text-base md:font-semibold md:tracking-[0.04em]"
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
