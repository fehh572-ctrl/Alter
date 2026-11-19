import { NextResponse } from "next/server";
import { provisionOrder } from "@/lib/provision";
import { cookieOptions, createSession, getOrigin, SESSION_COOKIE, SESSION_MAX_AGE, WELCOME_COOKIE, WELCOME_MAX_AGE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const origin = getOrigin(req);
  const sessionId = new URL(req.url).searchParams.get("session_id");
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!sessionId || !stripeKey) return NextResponse.redirect(`${origin}/commander?erreur=1`);

  const r = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    headers: { Authorization: `Bearer ${stripeKey}` },
    cache: "no-store",
  });
  if (!r.ok) return NextResponse.redirect(`${origin}/commander?erreur=1`);
  const session = (await r.json()) as { payment_status?: string; client_reference_id?: string | null };
  if (session.payment_status !== "paid" || !session.client_reference_id) {
    return NextResponse.redirect(`${origin}/commander?erreur=paiement`);
  }

  const result = await provisionOrder(session.client_reference_id, sessionId);
  if (result.status === "already") return NextResponse.redirect(`${origin}/espace`);
  if (result.status === "error") return NextResponse.redirect(`${origin}/connexion?deja=1`);

  const token = await createSession(result.customerId);
  const res = NextResponse.redirect(`${origin}/espace`);
  res.cookies.set(SESSION_COOKIE, token, cookieOptions(req, SESSION_MAX_AGE));
  res.cookies.set(WELCOME_COOKIE, result.accessKey, cookieOptions(req, WELCOME_MAX_AGE));
  return res;
}
