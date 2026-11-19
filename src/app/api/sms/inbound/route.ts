import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { messages, phones } from "@/db/schema";
import { APPS } from "@/lib/apps";
import { extractCode } from "@/lib/phone";

export const dynamic = "force-dynamic";

function sameSecret(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/**
 * Webhook pour un vrai fournisseur SMS (Twilio, Vonage, etc.).
 * Protégé par l'en-tête `x-alter-secret` = SMS_WEBHOOK_SECRET.
 * (Le secret n'est plus accepté dans l'URL : il finirait dans les logs du serveur et du fournisseur.
 * Avec Twilio, l'idéal est de valider aussi l'en-tête X-Twilio-Signature.)
 * Accepte du JSON { to, from, body } ou du form-urlencoded (To, From, Body).
 */
export async function POST(req: Request) {
  const secret = process.env.SMS_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ ok: false, error: "Webhook non configuré." }, { status: 503 });
  const provided = req.headers.get("x-alter-secret") ?? "";
  if (!sameSecret(provided, secret)) return NextResponse.json({ ok: false, error: "Non autorisé." }, { status: 401 });

  let to = "";
  let from = "";
  let body = "";
  const type = req.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    const j = (await req.json()) as Record<string, unknown>;
    to = String(j.to ?? j.To ?? "");
    from = String(j.from ?? j.From ?? "");
    body = String(j.body ?? j.Body ?? j.text ?? "");
  } else {
    const f = await req.formData();
    to = String(f.get("To") ?? f.get("to") ?? "");
    from = String(f.get("From") ?? f.get("from") ?? "");
    body = String(f.get("Body") ?? f.get("body") ?? f.get("text") ?? "");
  }

  const normalized = `+${to.replace(/\D/g, "")}`;
  const [phone] = await db
    .select({ id: phones.id, status: phones.status, expiresAt: phones.expiresAt })
    .from(phones)
    .where(eq(phones.number, normalized))
    .limit(1);
  if (!phone) return NextResponse.json({ ok: false, error: "Numéro inconnu." }, { status: 404 });
  // Pass expiré ou numéro suspendu : on ne stocke plus rien (le fournisseur reçoit quand même un 200 pour ne pas réessayer).
  if (phone.status !== "active" || (phone.expiresAt && phone.expiresAt < new Date())) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const app = APPS.find((a) => body.toLowerCase().includes(a.sms.sender.toLowerCase()));
  await db.insert(messages).values({
    phoneId: phone.id,
    sender: (app?.sms.sender ?? from).slice(0, 60) || "Inconnu",
    body: body.slice(0, 1000),
    code: extractCode(body),
    appSlug: app?.slug ?? null,
  });
  return NextResponse.json({ ok: true });
}
