import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { downloads, phones } from "@/db/schema";
import { getCurrentCustomer, getOrigin } from "@/lib/auth";
import { getApp } from "@/lib/apps";
import { buildGuideHtml } from "@/lib/guide";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const origin = getOrigin(req);
  const app = getApp(slug);
  if (!app) return NextResponse.json({ ok: false, error: "Pack introuvable." }, { status: 404 });

  const customer = await getCurrentCustomer();
  if (!customer) return NextResponse.redirect(`${origin}/connexion?next=/applications/${app.slug}`);

  const [phone] = await db.select().from(phones).where(eq(phones.customerId, customer.id)).limit(1);
  if (!phone) return NextResponse.redirect(`${origin}/commander`);

  const html = buildGuideHtml(app, phone.number, customer.name);
  await db.insert(downloads).values({ customerId: customer.id, appSlug: app.slug });

  // Le guide s'ouvre directement dans le navigateur : pas d'archive à décompresser.
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename="guide-alter-${app.slug}.html"`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
