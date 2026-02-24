import { NextRequest, NextResponse } from "next/server";
import { getRoute } from "@/lib/content";
import { logEvent } from "@/lib/events";
import { getOrCreateUserIdentity } from "@/lib/identity";
import { createRun } from "@/lib/run";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { routeId?: string } | null;
  const routeId = body?.routeId ?? "";
  const route = await getRoute(routeId);
  if (!route) {
    return NextResponse.json({ error: "RouteNotFound" }, { status: 404 });
  }

  const identity = await getOrCreateUserIdentity();
  const run = await createRun({ userId: identity.userId, routeId, locale: "zh" });

  await logEvent({
    name: "run_start",
    ts: new Date().toISOString(),
    userId: identity.userId,
    runId: run.id,
    routeId,
  });

  return NextResponse.json({ runId: run.id });
}

