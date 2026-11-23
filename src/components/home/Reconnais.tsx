import Link from "next/link";
import { Reveal } from "@/components/home/Reveal";

// Les quatre situations de l'ancien site, en liste typographique. Chaque
// réponse renvoie à ce que le programme propose vraiment.
const SITUATIONS = [
  {
    text: "Tu es fort à l’entraînement, moins bon en match.",
    before: "Une ",
    link: { href: "/exercices/routine-avant-match", label: "routine d’avant-match" },
    after: ", toujours la même, et un objectif précis pour chaque match, que tu peux compter.",
  },
  {
    text: "Tu stresses, tu rates, et tu y penses tout le match.",
    before: "La ",
    link: { href: "/exercices/routine-reset", label: "routine RESET" },
    after: " : quelques secondes pour laisser l’erreur derrière toi et être prêt pour l’action suivante.",
  },
  {
    text: "Ton pied faible te trahit, ta finition n’est pas régulière.",
    before: "Des séances de ",
    link: { href: "/exercices/pied-faible-mur", label: "pied faible contre le mur" },
    after: " et de frappes cadrées, et un test de finition sur 10 frappes pour voir où tu en es.",
  },
  {
    text: "Tu es remplaçant et tu veux devenir titulaire.",
    before: "Le programme ne choisit pas l’équipe. Il te donne 12 semaines de séances et des ",
    link: { href: "/suivi", label: "tests chiffrés" },
    after: " pour montrer tes progrès à ton coach.",
  },
];

export function Reconnais() {
  return (
    <section
      aria-labelledby="reconnais"
      className="mx-auto grid w-full max-w-6xl gap-10 px-5 pb-20 md:px-8 md:pb-32 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-12"
    >
      <h2
        id="reconnais"
        className="text-4xl leading-[0.95] font-extrabold uppercase font-stretch-75% text-balance md:text-5xl lg:sticky lg:top-[calc(var(--header-h)+2.5rem)] lg:self-start"
      >
        Tu te reconnais&nbsp;?
      </h2>

      <ul className="grid gap-12 md:gap-16">
        {SITUATIONS.map((s) => (
          <Reveal as="li" key={s.text} x={-16} y={0}>
            <p className="max-w-[24ch] text-3xl leading-[1.08] font-bold font-stretch-85% text-balance md:text-[2.75rem]">
              {s.text}
            </p>
            <p className="mt-4 max-w-[54ch] leading-relaxed text-ink-2 md:text-lg">
              {s.before}
              <Link
                href={s.link.href}
                className="text-ink underline decoration-line decoration-2 hover:decoration-ink"
              >
                {s.link.label}
              </Link>
              {s.after}
            </p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
