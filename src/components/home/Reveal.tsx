"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

// Apparition au scroll de l'accueil, une seule fois : opacité et translation,
// rien d'autre. Sous "réduire les animations", ou sans JavaScript, le contenu
// est affiché tout de suite et ne bouge pas (règle [data-reveal] de globals.css).
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  as = "div",
  x = 0,
  y = 24,
  delay = 0,
  className,
}: {
  children: ReactNode;
  as?: "div" | "li";
  x?: number;
  y?: number;
  delay?: number;
  className?: string;
}) {
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      data-reveal
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT_EXPO }}
    >
      {children}
    </Tag>
  );
}
