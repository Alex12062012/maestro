import type { Metadata } from "next";
import { MeasureBoard } from "@/components/measure/MeasureBoard";

export const metadata: Metadata = {
  title: "Suivi des tests - MAESTRO",
  description:
    "Entre les résultats de tes 6 tests de référence aux semaines 1, 6 et 12 du programme MAESTRO et suis ta progression en courbes. Tout reste dans ton navigateur.",
};

export default function SuiviPage() {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-5 pt-8 pb-20 md:px-8 md:pt-14 md:pb-28">
      <h1 className="text-5xl leading-[0.9] font-extrabold uppercase font-stretch-75% md:text-7xl">
        Suivi
      </h1>
      <p className="mt-5 max-w-[56ch] text-lg leading-relaxed">
        6 tests de référence, mesurés trois fois : au départ, à mi-parcours et à la fin. Les courbes
        montrent d’où tu pars et ce qui a bougé.
      </p>
      <p className="mt-3 max-w-[56ch] leading-relaxed text-ink-2">
        Tes résultats restent dans ce navigateur. Rien n’est envoyé, et personne d’autre ne
        les voit.
      </p>
      <MeasureBoard />
    </div>
  );
}
