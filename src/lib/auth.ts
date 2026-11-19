import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { customers, sessions } from "@/db/schema";

export const SESSION_COOKIE = "alter_session";
export const WELCOME_COOKIE = "alter_welcome";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
export const WELCOME_MAX_AGE = 60 * 30;

export function hashSecret(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function normalizeKey(key: string): string {
  return key.trim().toUpperCase().replace(/\s+/g, "");
}

export function generateAccessKey(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(12);
  let s = "";
  for (let i = 0; i < 12; i++) s += alphabet[bytes[i] % alphabet.length];
  return `ALT-${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8, 12)}`;
}

export async function createSession(customerId: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  await db.insert(sessions).values({
    token: hashSecret(token),
    customerId,
    expiresAt: new Date(Date.now() + SESSION_MAX_AGE * 1000),
  });
  return token;
}

export function cookieOptions(req: Request, maxAge: number) {
  const forwarded = req.headers.get("x-forwarded-proto");
  const proto = forwarded ? forwarded.split(",")[0].trim() : new URL(req.url).protocol.replace(":", "");
  return { httpOnly: true, sameSite: "lax" as const, secure: proto === "https", path: "/", maxAge };
}

export function getOrigin(req: Request): string {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const forwarded = req.headers.get("x-forwarded-proto");
  if (host) {
    const proto = forwarded ? forwarded.split(",")[0].trim() : new URL(req.url).protocol.replace(":", "");
    return `${proto}://${host}`;
  }
  return new URL(req.url).origin;
}

export type CurrentCustomer = { id: string; email: string; name: string; createdAt: Date };

async function customerFromToken(token: string | undefined): Promise<CurrentCustomer | null> {
  if (!token) return null;
  const rows = await db
    .select({ id: customers.id, email: customers.email, name: customers.name, createdAt: customers.createdAt })
    .from(sessions)
    .innerJoin(customers, eq(sessions.customerId, customers.id))
    .where(and(eq(sessions.token, hashSecret(token)), gt(sessions.expiresAt, new Date())))
    .limit(1);
  return rows[0] ?? null;
}

/** Utilisable dans les Server Components et les Route Handlers. */
export async function getCurrentCustomer(): Promise<CurrentCustomer | null> {
  const store = await cookies();
  return customerFromToken(store.get(SESSION_COOKIE)?.value);
}

export async function destroySession(token: string | undefined) {
  if (!token) return;
  await db.delete(sessions).where(eq(sessions.token, hashSecret(token)));
}
