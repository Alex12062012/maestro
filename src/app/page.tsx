import { CommentCaMarche } from "@/components/home/CommentCaMarche";
import { Hero } from "@/components/home/Hero";
import { Parents } from "@/components/home/Parents";
import { Piliers } from "@/components/home/Piliers";
import { Reconnais } from "@/components/home/Reconnais";

// Accueil : une section par composant, dans l'ordre de la spec.
export default function Home() {
  return (
    <>
      <Hero />
      <Reconnais />
      <Piliers />
      <CommentCaMarche />
      <Parents />
    </>
  );
}
