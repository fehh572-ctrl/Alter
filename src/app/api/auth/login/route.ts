import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { cookieOptions, createSession, hashSecret, normalizeKey, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }
  const b = (raw ?? {}) as Record<string, unknown>;
  const email = String(b.email ?? "").trim().toLowerCase();
  const key = normalizeKey(String(b.accessKey ?? ""));
  if (!email || !key) return NextResponse.json({ ok: false, error: "E-mail et clé d'accès requis." }, { status: 400 });

  const [customer] = await db
    .select({ id: customers.id })
    .from(customers)
    .where(and(eq(customers.email, email), eq(customers.accessKeyHash, hashSecret(key))))
    .limit(1);

  if (!customer) {
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ ok: false, error: "E-mail ou clé d'accès incorrect." }, { status: 401 });
  }

  const token = await createSession(customer.id);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, cookieOptions(req, SESSION_MAX_AGE));
  return res;
}
