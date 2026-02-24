import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { ensureDefaultAdmin, getSessionFromCookie, getUserById } from "@/lib/auth";

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

  const filePath = path.join(process.cwd(), "data", "events.ndjson");
  let body = "";
  try {
    body = await fs.readFile(filePath, "utf-8");
  } catch {
    body = "";
  }

  return new NextResponse(body, {
    status: 200,
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "content-disposition": `attachment; filename="events.ndjson"`,
    },
  });
}

