import { NextResponse } from "next/server";
import { cookieOptions, WELCOME_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Supprime le cookie temporaire contenant la clé d'accès affichée une seule fois. */
export async function DELETE(req: Request) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(WELCOME_COOKIE, "", cookieOptions(req, 0));
  return res;
}
