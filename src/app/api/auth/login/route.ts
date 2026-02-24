import { NextRequest, NextResponse } from "next/server";
import {
  createSession,
  ensureDefaultAdmin,
  findUserByEmail,
  hashPassword,
  setSessionCookie,
} from "@/lib/auth";
import { logEvent } from "@/lib/events";

export async function POST(req: NextRequest) {
  await ensureDefaultAdmin();
  const body = (await req.json().catch(() => null)) as
    | { email?: string; password?: string }
    | null;
  const email = body?.email?.trim() ?? "";
  const password = body?.password ?? "";
  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "MissingCredentials" }, { status: 400 });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return NextResponse.json({ ok: false, error: "InvalidCredentials" }, { status: 401 });
  }
  if (user.passwordHash !== hashPassword(password)) {
    return NextResponse.json({ ok: false, error: "InvalidCredentials" }, { status: 401 });
  }

  const session = await createSession(user.id);
  await logEvent({
    name: "auth_login",
    ts: new Date().toISOString(),
    userId: user.id,
    props: { email: user.email },
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(setSessionCookie(session.token));
  return res;
}

