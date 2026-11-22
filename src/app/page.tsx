import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";

// Accueil provisoire : la vraie page d'accueil arrive avec sa propre tâche.
export default function Home() {
  return (
    <section className="mx-auto w-full max-w-6xl flex-1 px-5 py-20 md:px-8 md:py-32">
      <h1 className="max-w-[12ch] text-6xl leading-[0.9] font-extrabold uppercase font-stretch-75% text-balance md:text-8xl">
        Dirige ton jeu
      </h1>
      <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-ink-2">
        Un programme de foot gratuit sur 12 semaines pour les 13-14 ans. Fais
        le test, suis tes séances, mesure tes progrès.
      </p>
      <Link
        href="/test"
        className="mt-10 inline-flex h-12 items-center gap-2 rounded bg-ink px-6 font-semibold text-bg transition-transform duration-150 hover:bg-ink/85 active:scale-[0.98]"
      >
        Faire le test
        <ArrowRightIcon size={18} weight="regular" aria-hidden />
      </Link>
    </section>
  );
}
