import { eq } from "drizzle-orm";
import { db } from "@/db";
import { customers, messages, orders, phones } from "@/db/schema";
import { generateAccessKey, hashSecret } from "@/lib/auth";
import { generateDemoNumber } from "@/lib/phone";
import { OFFER, passEndDate } from "@/lib/offer";

export const PRICE_CENTS = OFFER.priceCents;

export type ProvisionResult =
  | { status: "created"; customerId: string; number: string; accessKey: string }
  | { status: "already"; customerId: string | null }
  | { status: "error"; message: string };

async function pickFreeNumber(): Promise<string> {
  for (let i = 0; i < 40; i++) {
    const candidate = generateDemoNumber();
    const existing = await db.select({ id: phones.id }).from(phones).where(eq(phones.number, candidate)).limit(1);
    if (existing.length === 0) return candidate;
  }
  throw new Error("Plus aucun numéro disponible dans la plage de démonstration.");
}

/** Active une commande payée : crée le client et son numéro. Idempotent. */
export async function provisionOrder(orderId: string, providerRef?: string): Promise<ProvisionResult> {
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) return { status: "error", message: "Commande introuvable." };
  if (order.status === "paid") return { status: "already", customerId: order.customerId };

  const [existingCustomer] = await db.select().from(customers).where(eq(customers.email, order.email)).limit(1);
  if (existingCustomer) {
    const owned = await db.select({ id: phones.id }).from(phones).where(eq(phones.customerId, existingCustomer.id)).limit(1);
    if (owned.length > 0) return { status: "error", message: "Un Alter est déjà associé à cette adresse e-mail." };
  }

  const accessKey = generateAccessKey();
  const number = await pickFreeNumber();

  const customerId = await db.transaction(async (tx) => {
    let id: string;
    if (existingCustomer) {
      await tx.update(customers).set({ accessKeyHash: hashSecret(accessKey), name: order.name }).where(eq(customers.id, existingCustomer.id));
      id = existingCustomer.id;
    } else {
      const [created] = await tx
        .insert(customers)
        .values({ email: order.email, name: order.name, accessKeyHash: hashSecret(accessKey) })
        .returning({ id: customers.id });
      id = created.id;
    }

    const [phone] = await tx.insert(phones).values({ customerId: id, orderId: order.id, number, expiresAt: passEndDate() }).returning({ id: phones.id });

    const firstName = order.name.split(" ")[0];
    await tx.insert(messages).values([
      {
        phoneId: phone.id,
        sender: "Alter",
        body: `Bienvenue ${firstName} ! Votre numéro Alter est actif. Il reçoit uniquement les SMS de vérification : utilisez-le partout où vous ne voulez pas donner votre numéro personnel.`,
        createdAt: new Date(Date.now() - 1000),
      },
      {
        phoneId: phone.id,
        sender: "Alter",
        body: "Astuce : saisissez ce numéro dans l'application (inscription ou double authentification). Le code apparaîtra ici en quelques secondes.",
      },
    ]);

    await tx
      .update(orders)
      .set({ status: "paid", paidAt: new Date(), customerId: id, providerRef: providerRef ?? order.providerRef })
      .where(eq(orders.id, order.id));

    return id;
  });

  return { status: "created", customerId, number, accessKey };
}
