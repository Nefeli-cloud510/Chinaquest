import { getQuiz } from "./content";
import { newId, readJson, updateJson } from "./store";

export type QuizAttempt = {
  id: string;
  createdAt: string;
  runId: string;
  poiId: string;
  quizId: string;
  locale: "zh" | "en";
  hintLevelUsed: 0 | 1 | 2;
  tries: number;
  answer?: string;
  correct?: boolean;
  submittedAt?: string;
};

type AttemptsFile = { attempts: QuizAttempt[] };
const ATTEMPTS_FILE = "quiz_attempts.json";

export async function createAttempt(params: {
  runId: string;
  poiId: string;
  quizId: string;
  locale: "zh" | "en";
}) {
  const quiz = await getQuiz(params.quizId);
  if (!quiz) throw new Error("QuizNotFound");

  const attempt: QuizAttempt = {
    id: newId("qa"),
    createdAt: new Date().toISOString(),
    runId: params.runId,
    poiId: params.poiId,
    quizId: params.quizId,
    locale: params.locale,
    hintLevelUsed: 0,
    tries: 0,
  };

  await updateJson<AttemptsFile>(ATTEMPTS_FILE, { attempts: [] }, (current) => {
    return { attempts: [attempt, ...current.attempts].slice(0, 20000) };
  });

  return attempt;
}

export async function getAttempt(attemptId: string) {
  const data = await readJson<AttemptsFile>(ATTEMPTS_FILE, { attempts: [] });
  return data.attempts.find((a) => a.id === attemptId) ?? null;
}

export async function useHint(attemptId: string, level: 1 | 2) {
  const updated = await updateJson<AttemptsFile>(ATTEMPTS_FILE, { attempts: [] }, (current) => {
    const idx = current.attempts.findIndex((a) => a.id === attemptId);
    if (idx < 0) throw new Error("AttemptNotFound");
    const a = current.attempts[idx];
    const nextLevel = Math.max(a.hintLevelUsed, level) as 0 | 1 | 2;
    const next = { ...a, hintLevelUsed: nextLevel };
    const attempts = [...current.attempts];
    attempts[idx] = next;
    return { attempts };
  });
  const attempt = updated.attempts.find((a) => a.id === attemptId);
  if (!attempt) throw new Error("AttemptNotFound");
  return attempt;
}

export async function submitAttempt(attemptId: string, answer: string) {
  const attempt = await getAttempt(attemptId);
  if (!attempt) throw new Error("AttemptNotFound");
  const quiz = await getQuiz(attempt.quizId);
  if (!quiz) throw new Error("QuizNotFound");

  const normalized = answer.trim();
  const correct = normalized.toUpperCase() === quiz.answerKey.toUpperCase();

  const updated = await updateJson<AttemptsFile>(ATTEMPTS_FILE, { attempts: [] }, (current) => {
    const idx = current.attempts.findIndex((a) => a.id === attemptId);
    if (idx < 0) throw new Error("AttemptNotFound");
    const a = current.attempts[idx];
    const tries = (a.tries ?? 0) + 1;
    const next: QuizAttempt = {
      ...a,
      tries,
      answer: normalized,
      correct,
      submittedAt: new Date().toISOString(),
    };
    const attempts = [...current.attempts];
    attempts[idx] = next;
    return { attempts };
  });
  const nextAttempt = updated.attempts.find((a) => a.id === attemptId);
  if (!nextAttempt) throw new Error("AttemptNotFound");
  return nextAttempt;
}
