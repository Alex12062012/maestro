"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { shouldGoBack, visitCount } from "@/lib/nav-history";

// "Retour" : revient en arrière dans l'historique quand la page précédente
// est sur ce site (une semaine du programme, la bibliothèque...), sinon suit
// le lien de repli. Sans JavaScript, c'est un simple lien vers `fallback`.
export function BackLink({ fallback, className }: { fallback: string; className?: string }) {
  const router = useRouter();

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    // Ctrl/Cmd/Maj-clic ou clic du milieu : on laisse le navigateur ouvrir le lien.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const back = shouldGoBack({
      visits: visitCount(),
      referrer: document.referrer,
      origin: window.location.origin,
      historyLength: window.history.length,
    });
    if (!back) return;
    e.preventDefault();
    router.back();
  }

  return (
    <Link href={fallback} onClick={onClick} className={className}>
      <ArrowLeftIcon size={16} weight="regular" aria-hidden />
      Retour
    </Link>
  );
}
