import { NextRequest, NextResponse } from "next/server";
import { logEvent } from "@/lib/events";
import { getOrCreateUserIdentity } from "@/lib/identity";
import { getAttempt } from "@/lib/quiz";
import { completePoi, getRun } from "@/lib/run";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ runId: string; poiId: string }> },
) {
  const { runId, poiId } = await ctx.params;
  const body = (await req.json().catch(() => null)) as
    | { quizAttemptId?: string }
    | null;
  const quizAttemptId = body?.quizAttemptId ?? "";
  if (!quizAttemptId) {
    return NextResponse.json({ error: "MissingAttemptId" }, { status: 400 });
  }

  const identity = await getOrCreateUserIdentity();
  const run = await getRun(runId);
  if (!run) return NextResponse.json({ error: "RunNotFound" }, { status: 404 });
  if (run.userId !== identity.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const attempt = await getAttempt(quizAttemptId);
  if (!attempt) return NextResponse.json({ error: "AttemptNotFound" }, { status: 404 });
  if (attempt.runId !== runId || attempt.poiId !== poiId) {
    return NextResponse.json({ error: "AttemptMismatch" }, { status: 400 });
  }
  if (!attempt.correct) {
    return NextResponse.json({ error: "AttemptNotCorrect" }, { status: 400 });
  }

  await completePoi({
    runId,
    poiId,
    quizAttemptId,
    correct: true,
  });

  await logEvent({
    name: "poi_complete",
    ts: new Date().toISOString(),
    userId: identity.userId,
    runId,
    routeId: run.routeId,
    poiId,
    props: { quizAttemptId },
  });

  return NextResponse.json({ ok: true });
}
