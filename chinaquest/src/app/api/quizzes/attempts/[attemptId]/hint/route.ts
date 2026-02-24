import { NextRequest, NextResponse } from "next/server";
import { logEvent } from "@/lib/events";
import { getOrCreateUserIdentity } from "@/lib/identity";
import { getAttempt, useHint } from "@/lib/quiz";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ attemptId: string }> },
) {
  const { attemptId } = await ctx.params;
  const body = (await req.json().catch(() => null)) as { level?: 1 | 2 } | null;
  const level = body?.level === 2 ? 2 : 1;
  const attempt = await getAttempt(attemptId);
  if (!attempt) return NextResponse.json({ error: "AttemptNotFound" }, { status: 404 });

  await useHint(attemptId, level);
  const identity = await getOrCreateUserIdentity();
  await logEvent({
    name: "quiz_hint_used",
    ts: new Date().toISOString(),
    userId: identity.userId,
    runId: attempt.runId === "preview" ? undefined : attempt.runId,
    poiId: attempt.poiId,
    props: { attemptId, level },
  });

  return NextResponse.json({ ok: true });
}

