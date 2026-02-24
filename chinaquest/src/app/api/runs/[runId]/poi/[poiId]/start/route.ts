import { NextRequest, NextResponse } from "next/server";
import { logEvent } from "@/lib/events";
import { getOrCreateUserIdentity } from "@/lib/identity";
import { getRun, startPoi } from "@/lib/run";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ runId: string; poiId: string }> },
) {
  const { runId, poiId } = await ctx.params;
  const identity = await getOrCreateUserIdentity();
  const run = await getRun(runId);
  if (!run) return NextResponse.json({ error: "RunNotFound" }, { status: 404 });
  if (run.userId !== identity.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await startPoi(runId, poiId);
  await logEvent({
    name: "poi_start",
    ts: new Date().toISOString(),
    userId: identity.userId,
    runId,
    routeId: run.routeId,
    poiId,
  });

  return NextResponse.json({ ok: true });
}

