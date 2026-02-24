"use client";

import { useMemo, useState } from "react";
import { Button, Card, Pill } from "./ui";

type QuizChoice = { key: string; zh: string; en: string };
type Quiz = {
  id: string;
  question: { zh: string; en: string };
  choices: QuizChoice[];
  answerKey: string;
  hints: { level: 1 | 2; zh: string; en: string }[];
  explain: { zh: string; en: string };
};

export function QuizClient(props: { poiId: string; quiz: Quiz }) {
  const locale = "en" as const;
  const quiz = props.quiz;
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<null | { correct: boolean; explain: string }>(null);
  const [hintLevel, setHintLevel] = useState<0 | 1 | 2>(0);
  const [tries, setTries] = useState(0);

  const questionText = useMemo(() => {
    return locale === "en" ? quiz.question.en : quiz.question.zh;
  }, [quiz, locale]);

  const hint1 = quiz.hints.find((h) => h.level === 1);
  const hint2 = quiz.hints.find((h) => h.level === 2);
  const hintText =
    hintLevel === 2
      ? locale === "en"
        ? hint2?.en
        : hint2?.zh
      : hintLevel === 1
        ? locale === "en"
          ? hint1?.en
          : hint1?.zh
        : null;

  return (
    <div className="grid gap-6">
      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="gold">Puzzle</Pill>
          <Pill>tries {tries}</Pill>
          <Pill>Preview</Pill>
        </div>
        <div className="mt-4 text-lg font-semibold">{questionText}</div>

        <div className="mt-4 grid gap-2">
          {quiz.choices.map((c) => {
            const label = c.en;
            const active = selected === c.key;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setSelected(c.key)}
                className={[
                  "flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition",
                  "border-[color:var(--cq-border)] bg-[color:var(--cq-surface-2)]",
                  active ? "ring-2 ring-[color:var(--cq-gold)]" : "hover:bg-black/5",
                ].join(" ")}
              >
                <span className="font-medium">{label}</span>
                <span className="text-xs text-[color:var(--cq-muted)]">{c.key}</span>
              </button>
            );
          })}
        </div>

        {hintText ? (
          <div className="mt-4 rounded-2xl bg-black/5 px-4 py-3 text-sm text-[color:var(--cq-muted)]">
            {hintText}
          </div>
        ) : null}

        {result ? (
          <div
            className={[
              "mt-4 rounded-2xl px-4 py-3 text-sm",
              result.correct
                ? "bg-[color:var(--cq-gold)] text-[color:var(--cq-ink)]"
                : "bg-[color:var(--cq-red)] text-white",
            ].join(" ")}
          >
            {result.correct ? "Correct." : "Not quite—try again."}
            <div className="mt-1 opacity-90">{result.explain}</div>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            variant="ghost"
            onClick={() => {
              const next = hintLevel === 0 ? 1 : 2;
              if (next === hintLevel) return;
              setHintLevel(next as 1 | 2);
            }}
          >
            {hintLevel === 0 ? "Get a hint" : hintLevel === 1 ? "One more hint" : "No more hints"}
          </Button>

          <Button
            onClick={() => {
              if (!selected) return;
              setTries((t) => t + 1);
              const correct = selected === quiz.answerKey;
              setResult({ correct, explain: quiz.explain.en });
            }}
            variant="secondary"
            className={!selected ? "pointer-events-none opacity-60" : undefined}
          >
            Submit
          </Button>

          <Button
            href={`/poi/${props.poiId}`}
            variant="ghost"
          >
            Back to stop
          </Button>
        </div>
      </Card>
    </div>
  );
}
