"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import type { PhotoMeta } from "@/content/photos";

// Photo d'exercice qui ne casse pas la page si le fichier manque : à la
// première erreur de chargement, on affiche `fallback` à la place. next/image
// rejoue l'erreur après l'hydratation, elle n'est donc pas perdue.
export function ExercisePhoto({
  src,
  meta,
  sizes,
  className,
  fallback = null,
  priority = false,
  caption,
}: {
  src: string;
  meta: PhotoMeta;
  sizes: string;
  className?: string;
  fallback?: ReactNode;
  priority?: boolean;
  /** Légende : la photo est alors rendue dans un <figure>, retiré avec elle. */
  caption?: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return fallback;
  const image = (
    <Image
      src={src}
      width={meta.width}
      height={meta.height}
      alt={meta.alt}
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className={className}
    />
  );
  return caption ? (
    <figure>
      {image}
      <figcaption className="mt-2 font-mono text-xs text-ink-2">{caption}</figcaption>
    </figure>
  ) : (
    image
  );
}
