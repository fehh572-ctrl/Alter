import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { customers, orders, phones } from "@/db/schema";
import { PRICE_CENTS, provisionOrder } from "@/lib/provision";
import { cookieOptions, createSession, getOrigin, SESSION_COOKIE, SESSION_MAX_AGE, WELCOME_COOKIE, WELCOME_MAX_AGE } from "@/lib/auth";
import { formatNumber } from "@/lib/phone";
import { isDemoMode, OFFER } from "@/lib/offer";

export const dynamic = "force-dynamic";

function fail(message: string, status = 400, field?: string) {
  return NextResponse.json({ ok: false, error: message, field }, { status });
}

function luhn(num: string): boolean {
  let sum = 0;
  let double = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = Number(num[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return fail("Requête invalide.");
  }
  const b = (raw ?? {}) as Record<string, unknown>;
  const name = String(b.name ?? "").trim().slice(0, 120);
  const email = String(b.email ?? "").trim().toLowerCase().slice(0, 255);

  if (name.length < 2) return fail("Indiquez votre nom complet.", 400, "name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return fail("Adresse e-mail invalide.", 400, "email");
  if (b.accept !== true) return fail("Vous devez accepter les conditions d'utilisation.", 400, "accept");

  const [existing] = await db.select({ id: customers.id }).from(customers).where(eq(customers.email, email)).limit(1);
  if (existing) {
    const owned = await db.select({ id: phones.id }).from(phones).where(eq(phones.customerId, existing.id)).limit(1);
    if (owned.length > 0) {
      return fail("Un Alter est déjà associé à cet e-mail. Connectez-vous avec votre clé d'accès.", 409, "email");
    }
  }

  // --- Paiement réel via Stripe Checkout si une clé est configurée ---
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (stripeKey) {
    const [order] = await db
      .insert(orders)
      .values({ email, name, amountCents: PRICE_CENTS, provider: "stripe" })
      .returning({ id: orders.id });
    const origin = getOrigin(req);
    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append("success_url", `${origin}/api/checkout/stripe-return?session_id={CHECKOUT_SESSION_ID}`);
    params.append("cancel_url", `${origin}/commander?annule=1`);
    params.append("customer_email", email);
    params.append("client_reference_id", order.id);
    params.append("locale", "fr");
    params.append("line_items[0][quantity]", "1");
    params.append("line_items[0][price_data][currency]", "eur");
    params.append("line_items[0][price_data][unit_amount]", String(PRICE_CENTS));
    params.append("line_items[0][price_data][product_data][name]", `${OFFER.name} — numéro de vérification, ${OFFER.durationLabel}`);
    params.append("metadata[order_id]", order.id);

    const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${stripeKey}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
    const session = (await r.json()) as { id?: string; url?: string; error?: { message?: string } };
    if (!r.ok || !session.url || !session.id) {
      await db.update(orders).set({ status: "failed" }).where(eq(orders.id, order.id));
      return fail(session.error?.message ?? "Impossible d'initialiser le paiement.", 502);
    }
    await db.update(orders).set({ providerRef: session.id }).where(eq(orders.id, order.id));
    return NextResponse.json({ ok: true, redirect: session.url, external: true });
  }

  // --- Mode démonstration : paiement simulé (aucune donnée bancaire n'est stockée) ---
  // Jamais en production : sans Stripe, on refuse plutôt que de faire saisir une vraie carte pour rien.
  if (!isDemoMode()) return fail("Le paiement n'est pas encore disponible. Revenez très vite !", 503);
  const card = (b.card ?? {}) as Record<string, unknown>;
  const cardNumber = String(card.number ?? "").replace(/\D/g, "");
  const expiry = String(card.expiry ?? "").trim();
  const cvc = String(card.cvc ?? "").replace(/\D/g, "");

  if (cardNumber.length < 13 || cardNumber.length > 19 || !luhn(cardNumber)) return fail("Numéro de carte invalide.", 400, "number");
  const m = expiry.match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!m) return fail("Date d'expiration invalide (MM/AA).", 400, "expiry");
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);
  if (month < 1 || month > 12 || endOfMonth < new Date()) return fail("Cette carte est expirée.", 400, "expiry");
  if (cvc.length < 3 || cvc.length > 4) return fail("Cryptogramme invalide.", 400, "cvc");
  if (cardNumber === "4000000000000002") return fail("Paiement refusé par la banque (carte de test refusée).", 402, "number");

  const [order] = await db
    .insert(orders)
    .values({ email, name, amountCents: PRICE_CENTS, provider: "demo", providerRef: `demo_${cardNumber.slice(-4)}` })
    .returning({ id: orders.id });

  const result = await provisionOrder(order.id);
  if (result.status !== "created") {
    await db.update(orders).set({ status: "failed" }).where(eq(orders.id, order.id));
    return fail(result.status === "error" ? result.message : "Commande déjà activée.", 409);
  }

  const token = await createSession(result.customerId);
  const res = NextResponse.json({ ok: true, number: formatNumber(result.number), redirect: "/espace" });
  res.cookies.set(SESSION_COOKIE, token, cookieOptions(req, SESSION_MAX_AGE));
  res.cookies.set(WELCOME_COOKIE, result.accessKey, cookieOptions(req, WELCOME_MAX_AGE));
  return res;
}
