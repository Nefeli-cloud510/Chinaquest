import { NextRequest, NextResponse } from "next/server";
import { getPoi, getQuiz } from "@/lib/content";
import { logEvent } from "@/lib/events";
import { getOrCreateUserIdentity } from "@/lib/identity";
import { createAttempt } from "@/lib/quiz";
import { getRun } from "@/lib/run";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ quizId: string }> },
) {
  const { quizId } = await ctx.params;
  const body = (await req.json().catch(() => null)) as
    | { poiId?: string; runId?: string; locale?: "zh" | "en" }
    | null;
  const poiId = body?.poiId ?? "";
  const runId = body?.runId ?? undefined;
  const locale = body?.locale === "en" ? "en" : "zh";

  const quiz = await getQuiz(quizId);
  if (!quiz) return NextResponse.json({ error: "QuizNotFound" }, { status: 404 });

  const poi = await getPoi(poiId);
  if (!poi) return NextResponse.json({ error: "PoiNotFound" }, { status: 404 });
  if (poi.quizId !== quizId) {
    return NextResponse.json({ error: "PoiQuizMismatch" }, { status: 400 });
  }

  const identity = await getOrCreateUserIdentity();
  if (runId) {
    const run = await getRun(runId);
    if (!run) return NextResponse.json({ error: "RunNotFound" }, { status: 404 });
    if (run.userId !== identity.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const attempt = await createAttempt({
    runId: runId ?? "preview",
    poiId,
    quizId,
    locale,
  });

  await logEvent({
    name: "quiz_open",
    ts: new Date().toISOString(),
    userId: identity.userId,
    runId: runId,
    poiId,
    props: { quizId, attemptId: attempt.id },
  });

  const safeQuiz = {
    id: quiz.id,
    question: quiz.question,
    choices: quiz.choices,
    hints: quiz.hints,
    explain: quiz.explain,
  };

  return NextResponse.json({
    quiz: safeQuiz,
    attempt: {
      id: attempt.id,
      hintLevelUsed: attempt.hintLevelUsed,
      tries: attempt.tries,
    },
  });
}

