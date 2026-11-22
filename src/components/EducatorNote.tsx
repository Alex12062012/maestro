import { WarningCircleIcon } from "@phosphor-icons/react/ssr";

// Avertissement obligatoire sur /programme et sur chaque fiche d'exercice.
export function EducatorNote({ className }: { className?: string }) {
  return (
    <aside
      aria-label="Avertissement"
      className={`flex gap-3 border-t border-line pt-5 text-[0.9375rem] leading-relaxed text-ink-2 ${className ?? ""}`}
    >
      <WarningCircleIcon size={22} weight="regular" aria-hidden className="mt-0.5 shrink-0 text-ink" />
      <p className="max-w-[62ch]">
        <strong className="font-semibold text-ink">
          Relecture par un éducateur sportif recommandée.
        </strong>{" "}
        Ce programme n&apos;a pas été vérifié par un professionnel : montre-le à ton coach ou à un
        éducateur avant de commencer. Une douleur pendant un exercice, tu arrêtes et tu en parles à
        un adulte.
      </p>
    </aside>
  );
}
