import { NextResponse } from "next/server";
import { and, desc, eq, gte, isNull, lte } from "drizzle-orm";
import { db } from "@/db";
import { messages, phones } from "@/db/schema";
import { getCurrentCustomer } from "@/lib/auth";
import { getApp } from "@/lib/apps";
import { generateCode, renderSms } from "@/lib/phone";
import { isDemoMode } from "@/lib/offer";

export const dynamic = "force-dynamic";

async function currentPhone() {
  const customer = await getCurrentCustomer();
  if (!customer) return null;
  const [phone] = await db.select().from(phones).where(eq(phones.customerId, customer.id)).limit(1);
  return phone ?? null;
}

export async function GET() {
  const phone = await currentPhone();
  if (!phone) return NextResponse.json({ ok: false, error: "Non connecté." }, { status: 401 });
  const rows = await db
    .select({
      id: messages.id,
      sender: messages.sender,
      body: messages.body,
      code: messages.code,
      appSlug: messages.appSlug,
      createdAt: messages.createdAt,
      readAt: messages.readAt,
    })
    .from(messages)
    .where(and(eq(messages.phoneId, phone.id), lte(messages.createdAt, new Date())))
    .orderBy(desc(messages.createdAt))
    .limit(60);
  const pending = await db
    .select({ id: messages.id })
    .from(messages)
    .where(and(eq(messages.phoneId, phone.id), gte(messages.createdAt, new Date())));
  return NextResponse.json({ ok: true, messages: rows, pending: pending.length });
}

/** Simulateur : demande un SMS de vérification pour une application (mode démo). */
export async function POST(req: Request) {
  // En production, un client ne doit jamais voir de faux SMS dans sa boîte de réception.
  if (!isDemoMode()) return NextResponse.json({ ok: false, error: "Simulateur désactivé." }, { status: 404 });
  const phone = await currentPhone();
  if (!phone) return NextResponse.json({ ok: false, error: "Non connecté." }, { status: 401 });
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    raw = {};
  }
  const slug = String((raw as Record<string, unknown>).appSlug ?? "");
  const app = getApp(slug);
  if (!app) return NextResponse.json({ ok: false, error: "Application inconnue." }, { status: 400 });

  const recent = await db
    .select({ id: messages.id })
    .from(messages)
    .where(and(eq(messages.phoneId, phone.id), gte(messages.createdAt, new Date(Date.now() - 60_000))));
  if (recent.length >= 8) {
    return NextResponse.json({ ok: false, error: "Trop de demandes. Patientez une minute." }, { status: 429 });
  }

  const code = generateCode(app.sms.digits);
  const delay = 1800 + Math.floor(Math.random() * 2600);
  await db.insert(messages).values({
    phoneId: phone.id,
    sender: app.sms.sender,
    body: renderSms(app, code),
    code,
    appSlug: app.slug,
    createdAt: new Date(Date.now() + delay),
  });
  return NextResponse.json({ ok: true, eta: delay });
}

/** Marque tous les messages comme lus. */
export async function PATCH() {
  const phone = await currentPhone();
  if (!phone) return NextResponse.json({ ok: false, error: "Non connecté." }, { status: 401 });
  await db
    .update(messages)
    .set({ readAt: new Date() })
    .where(and(eq(messages.phoneId, phone.id), isNull(messages.readAt), lte(messages.createdAt, new Date())));
  return NextResponse.json({ ok: true });
}
