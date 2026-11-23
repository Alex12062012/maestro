import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Confidentialité - MAESTRO",
  description:
    "MAESTRO ne collecte aucune donnée personnelle et ne dépose aucun cookie. Ta progression reste dans ton navigateur.",
};

// Ce que Vercel Web Analytics enregistre et n'enregistre pas : repris de la
// page officielle ci-dessous, sans rien y ajouter. Ce que le site envoie avec
// un événement vient du script servi par Vercel et de `beforeSend`
// (src/lib/track.ts), qui remplace l'adresse de la page par l'origine.
const VERCEL_PRIVACY = "https://vercel.com/docs/analytics/privacy-policy";
// Événements personnalisés : réservés aux abonnements Pro et Enterprise.
const VERCEL_EVENTS = "https://vercel.com/docs/analytics/custom-events";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-6">
      <h2 className="text-2xl font-bold font-stretch-85%">{title}</h2>
      <div className="mt-4 space-y-3 leading-relaxed">{children}</div>
    </section>
  );
}

function List({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-1.5 pl-5 marker:text-ink-2">{children}</ul>;
}

export default function Confidentialite() {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-5 pt-8 pb-20 md:px-8 md:pt-14 md:pb-28">
      {/* Un seul mot long : plus petit sur téléphone, pour tenir dès 320 px. */}
      <h1 className="text-4xl leading-[0.9] font-extrabold uppercase font-stretch-75% text-balance sm:text-5xl md:text-7xl">
        Confidentialité
      </h1>
      <p className="mt-6 max-w-[52ch] text-lg leading-relaxed">
        MAESTRO ne te demande ni nom, ni adresse e-mail, ni compte. Aucune donnée personnelle
        n’est collectée.
      </p>
      <p className="mt-3 font-mono text-sm text-ink-2">Mise à jour le 23/11/2026</p>

      <div className="mt-12 grid max-w-[68ch] gap-12 md:mt-16">
        <Section title="Ce qui reste dans ton navigateur">
          <p>
            Le site garde quelques informations dans le stockage local de ton navigateur
            (localStorage), sur ton appareil. Elles ne sont jamais envoyées :
          </p>
          <List>
            <li>tes réponses et ton résultat au test ;</li>
            <li>les séances et les exercices cochés dans le programme ;</li>
            <li>
              tes résultats aux tests de référence, dans la page Suivi, y compris ceux que tu as
              tapés sans les enregistrer encore ;
            </li>
            <li>le thème choisi, clair ou sombre ;</li>
            <li>
              les étapes déjà envoyées à la mesure d’audience (plus bas), pour ne pas les
              envoyer deux fois.
            </li>
          </List>
          <p className="text-ink-2">
            Quelqu’un qui utilise le même navigateur peut les voir. Sur un autre appareil, tu
            repars de zéro.
          </p>
        </Section>

        <Section title="Les effacer">
          <List>
            <li>
              Le bouton Recommencer, à la fin du{" "}
              <Link href="/test" className="underline decoration-line hover:decoration-ink">
                test
              </Link>
              , efface tes réponses et ton résultat.
            </li>
            <li>
              Pour tout effacer, supprime les données de ce site dans les réglages de ton
              navigateur. Elles sont en général rangées avec les cookies et les données des sites.
            </li>
            <li>En navigation privée, tout s’efface quand tu fermes la fenêtre.</li>
          </List>
        </Section>

        <Section title="Mesure d’audience">
          <p>
            Pour savoir combien de personnes utilisent le site, MAESTRO utilise Vercel Web
            Analytics, l’outil de mesure de son hébergeur. D’après la{" "}
            <a href={VERCEL_PRIVACY} className="underline decoration-line hover:decoration-ink">
              page de Vercel sur la confidentialité de cet outil
            </a>{" "}
            (en anglais) :
          </p>
          <List>
            <li>
              aucun identifiant personnel qui permet de suivre un visiteur d’un site à
              l’autre n’est collecté ;
            </li>
            <li>
              chaque mesure (une page vue, un événement) est anonyme : elle n’est liée ni à une
              personne, ni à une adresse IP ;
            </li>
            <li>
              rien n’est gardé qui permettrait de refaire ton parcours sur d’autres sites
              ou de t’identifier ;
            </li>
            <li>
              l’outil n’utilise pas de cookies tiers. Un visiteur est reconnu par une
              empreinte calculée à partir de la requête de son navigateur, et cette session est
              effacée au bout de 24 heures.
            </li>
          </List>
          <p>
            Avec chaque mesure, page vue ou événement, Vercel peut enregistrer : la date et
            l’heure, l’adresse de la page et son modèle (par exemple /exercices/[slug]),
            la page d’où tu arrives, certains paramètres de l’adresse (filtrés), le pays,
            la région et la ville, le système et le navigateur avec leur version, le type
            d’appareil (téléphone, tablette ou ordinateur) et la version du script de mesure.
          </p>
          <p>
            Le site prévoit aussi trois événements : test terminé, programme commencé, semaine
            terminée. Il n’y met que leur nom, sans score, sans réponse et sans progression.
            Avant l’envoi, il remplace l’adresse de la page par celle du site, sans
            chemin : un événement ne dit pas quelle semaine tu viens de finir. Le reste part comme
            pour une page vue : le modèle de la page (par exemple /programme/semaine/[n]), le site
            d’où tu es arrivé s’il est extérieur, et les informations de la liste
            ci-dessus.
          </p>
          <p>
            D’après la{" "}
            <a href={VERCEL_EVENTS} className="underline decoration-line hover:decoration-ink">
              page de Vercel sur les événements
            </a>
            , ils ne sont enregistrés qu’avec un abonnement Pro ou Enterprise. MAESTRO utilise
            l’offre gratuite de Vercel : aujourd’hui, ces trois événements ne sont pas
            enregistrés, seules les pages vues sont comptées.
          </p>
          <p className="text-ink-2">
            Si un bloqueur de publicité arrête la mesure, le site marche exactement pareil.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            Le site ne dépose aucun cookie. C’est pour ça qu’il n’y a pas de bandeau
            à accepter.
          </p>
        </Section>

        <Section title="Hébergement">
          <p>
            Le site est hébergé par Vercel Inc., une société américaine. Son adresse est dans les{" "}
            <Link href="/mentions-legales" className="underline decoration-line hover:decoration-ink">
              mentions légales
            </Link>
            .
          </p>
        </Section>

        <Section title="Contact">
          <p>Une question sur cette page : [contact]</p>
          <p className="text-ink-2">
            Tu peux aussi t’adresser à la CNIL, l’autorité française de protection des
            données :{" "}
            <a href="https://www.cnil.fr" className="text-ink underline decoration-line hover:decoration-ink">
              cnil.fr
            </a>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}
