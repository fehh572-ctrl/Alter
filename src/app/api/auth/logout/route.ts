import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { cookieOptions, destroySession, SESSION_COOKIE, WELCOME_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const store = await cookies();
  await destroySession(store.get(SESSION_COOKIE)?.value);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", cookieOptions(req, 0));
  res.cookies.set(WELCOME_COOKIE, "", cookieOptions(req, 0));
  return res;
}
