import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { and, desc, eq, lte } from "drizzle-orm";
import { db } from "@/db";
import { downloads, messages, phones } from "@/db/schema";
import { Dashboard } from "@/components/dashboard";
import { getCurrentCustomer, WELCOME_COOKIE } from "@/lib/auth";
import { formatNumber } from "@/lib/phone";
import { isDemoMode } from "@/lib/offer";

export const metadata: Metadata = {
  title: "Mon espace",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EspacePage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/connexion");

  const [phone] = await db.select().from(phones).where(eq(phones.customerId, customer.id)).limit(1);
  if (!phone) redirect("/commander");

  const [rows, dl, store] = await Promise.all([
    db
      .select({ id: messages.id, sender: messages.sender, body: messages.body, code: messages.code, appSlug: messages.appSlug, createdAt: messages.createdAt, readAt: messages.readAt })
      .from(messages)
      .where(and(eq(messages.phoneId, phone.id), lte(messages.createdAt, new Date())))
      .orderBy(desc(messages.createdAt))
      .limit(60),
    db.selectDistinct({ appSlug: downloads.appSlug }).from(downloads).where(eq(downloads.customerId, customer.id)),
    cookies(),
  ]);

  const welcomeKey = store.get(WELCOME_COOKIE)?.value ?? null;

  return (
    <div className="relative overflow-hidden pb-10 pt-32">
      <div className="bg-grid absolute inset-x-0 top-0 h-[500px]" />
      <div className="pointer-events-none absolute -top-40 left-1/3 h-[460px] w-[760px] rounded-full bg-violet-600/20 blur-[120px]" />
      <Dashboard
        customer={{ name: customer.name, email: customer.email, createdAt: customer.createdAt.toISOString() }}
        phone={{ display: formatNumber(phone.number), model: phone.model, createdAt: phone.createdAt.toISOString(), expiresAt: phone.expiresAt ? phone.expiresAt.toISOString() : null }}
        demo={isDemoMode()}
        initialMessages={rows.map((m) => ({ ...m, createdAt: m.createdAt.toISOString(), readAt: m.readAt ? m.readAt.toISOString() : null }))}
        downloaded={dl.map((d) => d.appSlug)}
        welcomeKey={welcomeKey}
      />
    </div>
  );
}
