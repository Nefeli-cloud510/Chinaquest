import { NextRequest, NextResponse } from "next/server";
import { ensureDefaultAdmin, getSessionFromCookie, getUserById } from "@/lib/auth";
import { getContent, updateContent } from "@/lib/content";
import { logEvent } from "@/lib/events";

async function requireAdmin() {
  await ensureDefaultAdmin();
  const session = await getSessionFromCookie();
  if (!session) return null;
  const user = await getUserById(session.userId);
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const content = await getContent();
  return NextResponse.json({ content });
}

export async function POST(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as { content?: unknown } | null;
  if (!body?.content) return NextResponse.json({ ok: false, error: "MissingContent" }, { status: 400 });

  const next = body.content as any;
  const updated = await updateContent(() => next);

  await logEvent({
    name: "admin_content_update",
    ts: new Date().toISOString(),
    userId: user.id,
    props: { version: updated.version },
  });

  return NextResponse.json({ ok: true });
}

