import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";

// Terrain vu de dessus, ballon sorti en touche.
function PitchOut() {
  return (
    <svg
      viewBox="0 0 400 270"
      className="w-full max-w-md text-line"
      fill="none"
      aria-hidden
    >
      <g stroke="currentColor" strokeWidth="2">
        <rect x="10" y="10" width="380" height="230" />
        <line x1="200" y1="10" x2="200" y2="240" />
        <circle cx="200" cy="125" r="34" />
        <rect x="10" y="70" width="52" height="110" />
        <rect x="338" y="70" width="52" height="110" />
        <rect x="10" y="100" width="18" height="50" />
        <rect x="372" y="100" width="18" height="50" />
      </g>
      <path
        d="M200 125 C 250 150, 290 205, 312 256"
        stroke="var(--ink-2)"
        strokeWidth="1.5"
        strokeDasharray="4 6"
      />
      <circle cx="315" cy="258" r="7" fill="var(--ink)" />
      <circle cx="200" cy="125" r="3" fill="var(--ink-2)" />
    </svg>
  );
}

export default function NotFound() {
  return (
    <section className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-14 px-5 py-20 md:grid-cols-[1.1fr_1fr] md:px-8 md:py-28">
      <div>
        <h1 className="text-6xl leading-[0.9] font-extrabold uppercase font-stretch-75% text-balance md:text-8xl">
          Hors du terrain
        </h1>
        <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-ink-2">
          Cette page n&apos;existe pas, ou elle a changé d&apos;adresse. Code
          d&apos;erreur <span className="font-mono text-ink">404</span>.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex h-12 items-center rounded bg-ink px-6 font-semibold text-bg transition-transform duration-150 hover:bg-ink/85 active:scale-[0.98]"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/test"
            className="inline-flex h-12 items-center gap-2 rounded border border-line px-6 font-semibold text-ink transition-transform duration-150 hover:border-ink active:scale-[0.98]"
          >
            Faire le test
            <ArrowRightIcon size={18} weight="regular" aria-hidden />
          </Link>
        </div>
      </div>
      <PitchOut />
    </section>
  );
}
