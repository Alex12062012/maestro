"use client";

import { usePathname } from "next/navigation";
import { Suspense, useEffect } from "react";
import { recordVisit } from "@/lib/nav-history";

// Compte les pages vues dans l'onglet, pour le bouton Retour des fiches.
// usePathname peut suspendre sur une route dynamique non prérendue : la
// limite <Suspense> garde le reste de la page rendu sans lui.
export function NavTracker() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}

function Tracker() {
  const pathname = usePathname();
  useEffect(() => {
    recordVisit(pathname);
  }, [pathname]);
  return null;
}
