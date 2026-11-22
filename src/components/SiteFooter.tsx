import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";

const LEGAL_LINKS = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Confidentialité" },
];

function Num({ children }: { children: string }) {
  return <span className="font-mono text-signal">{children}</span>;
}

export function SiteFooter() {
  return (
    <footer className="on-dark bg-surface-dark text-on-dark">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-14 pb-10 md:grid-cols-[1fr_auto] md:gap-16 md:px-8 md:pt-16">
        <div>
          <p>
            <Wordmark />
          </p>
          <p className="mt-6 max-w-[62ch] text-[0.9375rem] leading-relaxed text-on-dark/80">
            MAESTRO est un programme de coaching sportif et de motivation, pas
            un suivi médical ou psychologique. Si tu te sens vraiment mal,
            parle-en tout de suite à un adulte de confiance, à ton coach, à tes
            parents, ou à un professionnel de santé. En France, aide en
            urgence : <Num>3114</Num> (gratuit et confidentiel) ou <Num>15</Num>{" "}
            / <Num>112</Num>.
          </p>
        </div>

        <nav aria-label="Informations légales">
          <ul className="flex flex-col md:items-end">
            {LEGAL_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-flex h-11 items-center text-[0.9375rem] text-on-dark/80 underline decoration-on-dark/30 hover:text-on-dark hover:decoration-signal"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
