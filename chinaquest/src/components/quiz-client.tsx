"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, Pill } from "./ui";

type QuizChoice = { key: string; zh: string; en: string };
type Quiz = {
  id: string;
  question: { zh: string; en: string };
  choices: QuizChoice[];
  hints: { level: 1 | 2; zh: string; en: string }[];
  explain: { zh: string; en: string };
};

type Attempt = { id: string; hintLevelUsed: 0 | 1 | 2; tries: number };

export function QuizClient(props: { poiId: string; quizId: string }) {
  const router = useRouter();
  const search = useSearchParams();
  const runId = search.get("runId") ?? undefined;
  const locale = "en" as const;

  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<null | { correct: boolean; explain: string }>(null);
  const [hintLevel, setHintLevel] = useState<0 | 1 | 2>(0);

  const questionText = useMemo(() => {
    if (!quiz) return "";
    return locale === "en" ? quiz.question.en : quiz.question.zh;
  }, [quiz, locale]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/quizzes/${encodeURIComponent(props.quizId)}/attempts`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ poiId: props.poiId, runId, locale }),
      });
      const json = (await res.json()) as { quiz: Quiz; attempt: Attempt };
      if (cancelled) return;
      setQuiz(json.quiz);
      setAttempt(json.attempt);
      setHintLevel(json.attempt.hintLevelUsed);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [props.poiId, props.quizId, runId, locale]);

  if (loading || !quiz || !attempt) {
    return (
      <Card>
        <div className="text-sm text-[color:var(--cq-muted)]">Loading puzzle…</div>
      </Card>
    );
  }

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
          <Pill>tries {attempt.tries}</Pill>
          {runId ? <Pill tone="red">Run</Pill> : <Pill>Preview</Pill>}
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
            onClick={async () => {
              const next = hintLevel === 0 ? 1 : 2;
              if (next === hintLevel) return;
              await fetch(`/api/quizzes/attempts/${encodeURIComponent(attempt.id)}/hint`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ level: next }),
              });
              setHintLevel(next as 1 | 2);
            }}
          >
            {hintLevel === 0 ? "Get a hint" : hintLevel === 1 ? "One more hint" : "No more hints"}
          </Button>

          <Button
            onClick={async () => {
              if (!selected) return;
              const res = await fetch(`/api/quizzes/attempts/${encodeURIComponent(attempt.id)}/submit`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ answer: selected }),
              });
              const json = (await res.json()) as { correct: boolean; explain: { zh: string; en: string } };
              setResult({ correct: json.correct, explain: json.explain.en });
              if (!json.correct) return;

              if (runId) {
                await fetch(`/api/runs/${encodeURIComponent(runId)}/poi/${encodeURIComponent(props.poiId)}/complete`, {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ quizAttemptId: attempt.id }),
                });
                router.push(`/run/${runId}`);
              } else {
                router.push(`/routes`);
              }
            }}
            variant="secondary"
            className={!selected ? "pointer-events-none opacity-60" : undefined}
          >
            Submit
          </Button>

          <Button
            href={runId ? `/poi/${props.poiId}?runId=${encodeURIComponent(runId)}` : `/poi/${props.poiId}`}
            variant="ghost"
          >
            Back to stop
          </Button>
        </div>
      </Card>
    </div>
  );
}
