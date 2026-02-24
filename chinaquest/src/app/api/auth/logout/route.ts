import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("cq_session")?.value;
  if (token) await deleteSession(token);
  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set({
    name: "cq_session",
    value: "",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}

