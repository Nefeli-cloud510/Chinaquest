import { createHash } from "crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { newId, newToken, readJson, updateJson } from "./store";

export type User = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
  role: "admin" | "user";
};

export type Session = {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
};

type UsersFile = { users: User[] };
type SessionsFile = { sessions: Session[] };

const USERS_FILE = "users.json";
const SESSIONS_FILE = "sessions.json";
const SESSION_COOKIE = "cq_session";

export function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

export async function ensureDefaultAdmin() {
  const fallback: UsersFile = { users: [] };
  await updateJson(USERS_FILE, fallback, (current) => {
    if (current.users.length > 0) return current;
    const admin: User = {
      id: newId("usr"),
      email: "admin@chinaquest.local",
      name: "ChinaQuest Admin",
      passwordHash: hashPassword("ChinaQuest2026!"),
      createdAt: new Date().toISOString(),
      role: "admin",
    };
    return { users: [admin] };
  });
}

export async function findUserByEmail(email: string) {
  const data = await readJson<UsersFile>(USERS_FILE, { users: [] });
  return data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function getUserById(userId: string) {
  const data = await readJson<UsersFile>(USERS_FILE, { users: [] });
  return data.users.find((u) => u.id === userId);
}

export async function createSession(userId: string) {
  const now = new Date();
  const expires = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 14);
  const session: Session = {
    token: newToken(),
    userId,
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
  };

  await updateJson<SessionsFile>(SESSIONS_FILE, { sessions: [] }, (current) => {
    const active = current.sessions.filter(
      (s) => new Date(s.expiresAt).getTime() > Date.now(),
    );
    return { sessions: [session, ...active].slice(0, 2000) };
  });

  return session;
}

export async function deleteSession(token: string) {
  await updateJson<SessionsFile>(SESSIONS_FILE, { sessions: [] }, (current) => {
    return { sessions: current.sessions.filter((s) => s.token !== token) };
  });
}

export async function getSessionFromCookie() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const data = await readJson<SessionsFile>(SESSIONS_FILE, { sessions: [] });
  const session = data.sessions.find((s) => s.token === token);
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() <= Date.now()) return null;
  return session;
}

export function setSessionCookie(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  };
}

export async function getRequestIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

