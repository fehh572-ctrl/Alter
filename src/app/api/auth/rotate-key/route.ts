import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { generateAccessKey, getCurrentCustomer, hashSecret } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const customer = await getCurrentCustomer();
  if (!customer) return NextResponse.json({ ok: false, error: "Non connecté." }, { status: 401 });
  const accessKey = generateAccessKey();
  await db.update(customers).set({ accessKeyHash: hashSecret(accessKey) }).where(eq(customers.id, customer.id));
  return NextResponse.json({ ok: true, accessKey });
}
