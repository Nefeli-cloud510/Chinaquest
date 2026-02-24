import { NextRequest, NextResponse } from "next/server";
import { logEvent } from "@/lib/events";
import { getOrCreateUserIdentity } from "@/lib/identity";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as
    | { events?: Array<{ name: string; ts?: string; runId?: string; routeId?: string; poiId?: string; page?: string; props?: Record<string, unknown> }> }
    | null;
  const events = body?.events ?? [];
  const identity = await getOrCreateUserIdentity();

  await Promise.all(
    events.slice(0, 50).map((e) =>
      logEvent({
        name: e.name,
        ts: e.ts ?? new Date().toISOString(),
        userId: identity.userId,
        runId: e.runId,
        routeId: e.routeId,
        poiId: e.poiId,
        page: e.page,
        props: e.props,
      }),
    ),
  );

  return NextResponse.json({ ok: true });
}

