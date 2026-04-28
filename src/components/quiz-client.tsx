"use client";

import { useEffect, useMemo, useState } from "react";
import { withBasePath } from "@/lib/base-path";
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

type Badge = {
  id: string;
  title: { zh: string; en: string };
  desc: { zh: string; en: string };
  image?: string;
};

const BADGE_STORAGE_KEY = "cq_badges_v1";
const REQUIRED_STOP_BADGES = ["badge_axis_gatekeeper", "badge_axis_timekeeper", "badge_axis_modern_weaver"];
const FINALE_BADGE_ID = "badge_axis_complete";

function readEarnedBadges(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BADGE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x) => typeof x === "string");
  } catch {
    return [];
  }
}

function writeEarnedBadges(badges: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(BADGE_STORAGE_KEY, JSON.stringify(badges));
  } catch {
    return;
  }
}

export function QuizClient(props: { poiId: string; quiz: Quiz; badge?: Badge; finale?: Badge }) {
  const locale = "en" as const;
  const quiz = props.quiz;
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<null | { correct: boolean; explain: string }>(null);
  const [hintLevel, setHintLevel] = useState<0 | 1 | 2>(0);
  const [tries, setTries] = useState(0);
  const [earned, setEarned] = useState<string[]>([]);
  const [finaleUnlockedNow, setFinaleUnlockedNow] = useState(false);

  useEffect(() => {
    setEarned(readEarnedBadges());
  }, []);

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
              if (correct && props.badge) {
                const next = Array.from(new Set([...readEarnedBadges(), props.badge.id]));
                const hasAllStops = REQUIRED_STOP_BADGES.every((id) => next.includes(id));
                const next2 = hasAllStops ? Array.from(new Set([...next, FINALE_BADGE_ID])) : next;
                writeEarnedBadges(next2);
                setEarned(next2);
                setFinaleUnlockedNow(hasAllStops && !next.includes(FINALE_BADGE_ID));
              }
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

      {result?.correct && props.badge ? (
        <Card className="overflow-hidden">
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            {props.badge.image ? (
              <div className="rounded-2xl border border-[color:var(--cq-border)] bg-[color:var(--cq-surface-2)] p-3 md:w-[220px]">
                <img
                  src={withBasePath(`/${props.badge.image}`)}
                  alt={props.badge.title.en}
                  className="h-44 w-44 object-contain md:h-[180px] md:w-[180px]"
                  loading="lazy"
                />
              </div>
            ) : null}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="gold">Badge unlocked</Pill>
                <Pill>{props.badge.id}</Pill>
              </div>
              <div className="mt-3 text-xl font-semibold">{props.badge.title.en}</div>
              <div className="mt-2 text-sm leading-6 text-[color:var(--cq-muted)]">
                {props.badge.desc.en}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button href="/badges" variant="secondary" size="sm">
                  View badges
                </Button>
                <Button href={`/poi/${props.poiId}`} variant="ghost" size="sm">
                  Back to stop
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ) : null}

      {result?.correct && props.finale && earned.includes(FINALE_BADGE_ID) && REQUIRED_STOP_BADGES.every((id) => earned.includes(id)) ? (
        <Card className="overflow-hidden">
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            {props.finale.image ? (
              <div className="rounded-2xl border border-[color:var(--cq-border)] bg-[color:var(--cq-surface-2)] p-3 md:w-[220px]">
                <img
                  src={withBasePath(`/${props.finale.image}`)}
                  alt={props.finale.title.en}
                  className="h-44 w-44 object-contain md:h-[180px] md:w-[180px]"
                  loading="lazy"
                />
              </div>
            ) : null}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="gold">{finaleUnlockedNow ? "Finale unlocked" : "Finale badge"}</Pill>
                <Pill>{props.finale.id}</Pill>
              </div>
              <div className="mt-3 text-xl font-semibold">{props.finale.title.en}</div>
              <div className="mt-2 text-sm leading-6 text-[color:var(--cq-muted)]">
                {props.finale.desc.en}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button href="/badges/" variant="secondary" size="sm">
                  View badges
                </Button>
                <Button href="/routes/" variant="ghost" size="sm">
                  Explore more
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
