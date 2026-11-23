"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type Ref,
} from "react";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { QUESTIONS, SCALE } from "@/content/quiz";
import {
  FRESH_QUIZ,
  clearQuiz,
  isComplete,
  readQuiz,
  scoreQuiz,
  writeQuiz,
  type Answer,
  type QuizState,
} from "@/lib/quiz";
import { QuizResult } from "@/components/quiz/QuizResult";
import { pad2 } from "@/lib/format";
import { track } from "@/lib/track";

const TOTAL = QUESTIONS.length;

const noSubscribe = () => () => {};
const noop = () => {};

export function QuizRunner() {
  // localStorage n'existe pas au rendu serveur : le HTML statique montre la
  // question 1, puis le navigateur reprend là où le joueur s'était arrêté.
  const hydrated = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );
  return hydrated ? (
    <Quiz />
  ) : (
    <div className="scroll-mt-4">
      <QuestionStep index={0} onAnswer={noop} onBack={noop} />
    </div>
  );
}

function Quiz() {
  const [state, setState] = useState<QuizState>(readQuiz);
  const [moved, setMoved] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusAfterMove = useRef(false);

  // Après chaque changement d'écran, le focus va sur le nouveau titre : un
  // lecteur d'écran lit la question suivante ou le résultat. Si l'écran ne
  // tient pas en entier dans la fenêtre (téléphone, résultat), on le remonte
  // sous le header pour que la barre de progression reste visible.
  useEffect(() => {
    if (!focusAfterMove.current) return;
    focusAfterMove.current = false;
    headingRef.current?.focus({ preventScroll: true });

    const root = rootRef.current;
    if (!root) return;
    const { top, bottom } = root.getBoundingClientRect();
    const headerBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
    if (top < headerBottom || bottom > window.innerHeight) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      root.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
    }
  }, [state]);

  function go(next: QuizState) {
    focusAfterMove.current = true;
    setMoved(true);
    setState(next);
  }

  function answer(value: Answer) {
    const id = QUESTIONS[state.current].id;
    const next = { answers: { ...state.answers, [id]: value }, current: state.current + 1 };
    writeQuiz(next);
    // Compteur anonyme : une fois par test fini, au moment où le résultat
    // s'affiche (pas à chaque rendu, ni quand on revient voir son résultat).
    if (isComplete(next)) track("test_done");
    go(next);
  }

  function back() {
    const next = { ...state, current: state.current - 1 };
    writeQuiz(next);
    go(next);
  }

  function restart() {
    clearQuiz();
    go(FRESH_QUIZ);
  }

  return (
    <div ref={rootRef} className="scroll-mt-4">
      {isComplete(state) ? (
        <QuizResult result={scoreQuiz(state.answers)} onRestart={restart} headingRef={headingRef} />
      ) : (
        <QuestionStep
          index={state.current}
          selected={state.answers[QUESTIONS[state.current].id]}
          onAnswer={answer}
          onBack={back}
          animate={moved}
          headingRef={headingRef}
        />
      )}
    </div>
  );
}

function QuestionStep({
  index,
  selected,
  onAnswer,
  onBack,
  animate = false,
  headingRef,
}: {
  index: number;
  selected?: Answer;
  onAnswer: (value: Answer) => void;
  onBack: () => void;
  animate?: boolean;
  headingRef?: Ref<HTMLHeadingElement>;
}) {
  const question = QUESTIONS[index];

  // Un double-clic ne doit pas répondre aussi à la question suivante,
  // qui apparaît sous le curseur entre les deux clics.
  function pick(e: MouseEvent, value: Answer) {
    if (e.detail > 1) return;
    onAnswer(value);
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4">
        <p aria-hidden className="font-mono text-sm text-ink-2">
          <span className="text-ink">{pad2(index + 1)}</span>/{TOTAL}
        </p>
        <ol aria-hidden className="grid flex-1 grid-cols-12 gap-0.5">
          {QUESTIONS.map((q, i) => (
            <li key={q.id} className={`h-1 ${i <= index ? "bg-ink" : "bg-line"}`} />
          ))}
        </ol>
      </div>

      <div key={index} className={animate ? "animate-rise-in" : undefined}>
        <h2
          id="question"
          ref={headingRef}
          tabIndex={-1}
          className="mt-6 min-h-[4.2em] max-w-[28ch] text-[1.75rem] leading-[1.05] font-bold font-stretch-85% text-balance md:mt-12 md:min-h-[3.15em] md:text-5xl"
        >
          {/* Dans le titre : lu quand le focus arrive sur la question. */}
          <span className="sr-only">
            Question {index + 1} sur {TOTAL} :{" "}
          </span>
          {question.text}
        </h2>

        <div
          role="group"
          aria-labelledby="question"
          className="mt-6 grid gap-2 md:mt-10 md:grid-cols-5"
        >
          {SCALE.map((label, i) => {
            const value = (i + 1) as Answer;
            return (
              <button
                key={label}
                type="button"
                aria-pressed={selected === value}
                onClick={(e) => pick(e, value)}
                className="group flex h-12 items-center justify-between gap-3 rounded border border-line px-4 text-left font-semibold transition-transform duration-150 hover:border-ink active:scale-[0.98] aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-bg md:h-28 md:flex-col-reverse md:items-start md:py-4"
              >
                <span>{label}</span>
                <span
                  aria-hidden
                  className="font-mono text-sm font-normal text-ink-2 group-aria-pressed:text-bg/70"
                >
                  {value}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onBack}
        className={`${index === 0 ? "invisible" : ""} mt-4 -ml-3 inline-flex h-12 items-center gap-2 rounded px-3 font-semibold text-ink-2 hover:text-ink`}
      >
        <ArrowLeftIcon size={18} weight="regular" aria-hidden />
        Question précédente
      </button>
    </div>
  );
}
