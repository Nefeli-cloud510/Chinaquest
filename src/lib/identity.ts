import { cookies } from "next/headers";
import { getSessionFromCookie } from "./auth";
import { newId } from "./store";

const ANON_COOKIE = "cq_anon";

export async function getOrCreateUserIdentity() {
  const session = await getSessionFromCookie();
  if (session) return { userId: session.userId, kind: "session" as const };

  const cookieStore = await cookies();
  const existing = cookieStore.get(ANON_COOKIE)?.value;
  if (existing) return { userId: existing, kind: "anon" as const };

  const userId = newId("anon");
  cookieStore.set({
    name: ANON_COOKIE,
    value: userId,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });
  return { userId, kind: "anon" as const };
}

