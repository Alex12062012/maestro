import type { Metadata } from "next";
import { QuizRunner } from "@/components/quiz/QuizRunner";

export const metadata: Metadata = {
  title: "Test Maestro - MAESTRO",
  description:
    "12 questions pour connaître ton profil de joueur sur 4 piliers : technique, physique, mental et vision. Gratuit, sans inscription, tes réponses restent dans ton navigateur.",
};

export default function TestPage() {
  return (
    <section className="mx-auto w-full max-w-6xl flex-1 px-5 pt-6 pb-16 md:px-8 md:pt-14 md:pb-24">
      <h1 className="text-4xl leading-[0.9] font-extrabold uppercase font-stretch-75% md:text-6xl">
        Test Maestro
      </h1>
      <p className="mt-3 max-w-[62ch] leading-relaxed text-ink-2 md:mt-4 md:text-lg">
        12 questions sur ta technique, ton physique, ton mental et ta vision du jeu. Pense à tes
        derniers matchs. Tu peux t’arrêter en route, tu reprendras à la même question.
      </p>
      <div className="mt-6 border-t border-line pt-5 md:mt-10 md:pt-8">
        <QuizRunner />
      </div>
    </section>
  );
}
