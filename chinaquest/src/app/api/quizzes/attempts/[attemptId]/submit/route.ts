import { NextRequest, NextResponse } from "next/server";
import { getQuiz } from "@/lib/content";
import { logEvent } from "@/lib/events";
import { getOrCreateUserIdentity } from "@/lib/identity";
import { getAttempt, submitAttempt } from "@/lib/quiz";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ attemptId: string }> },
) {
  const { attemptId } = await ctx.params;
  const body = (await req.json().catch(() => null)) as { answer?: string } | null;
  const answer = body?.answer ?? "";
  if (!answer) return NextResponse.json({ error: "MissingAnswer" }, { status: 400 });

  const attemptBefore = await getAttempt(attemptId);
  if (!attemptBefore) return NextResponse.json({ error: "AttemptNotFound" }, { status: 404 });

  const attempt = await submitAttempt(attemptId, answer);
  const quiz = await getQuiz(attempt.quizId);
  if (!quiz) return NextResponse.json({ error: "QuizNotFound" }, { status: 404 });

  const identity = await getOrCreateUserIdentity();
  await logEvent({
    name: "quiz_submit",
    ts: new Date().toISOString(),
    userId: identity.userId,
    runId: attempt.runId === "preview" ? undefined : attempt.runId,
    poiId: attempt.poiId,
    props: {
      attemptId,
      answer,
      correct: attempt.correct,
      tries: attempt.tries,
      hintLevelUsed: attempt.hintLevelUsed,
    },
  });

  return NextResponse.json({
    correct: attempt.correct,
    explain: quiz.explain,
  });
}

