import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";
import { Reveal } from "@/components/ui";
import { isDemoMode, OFFER } from "@/lib/offer";

export const metadata: Metadata = {
  title: "Commander mon Alter",
  description: `Un numéro français dédié à vos codes de vérification. ${OFFER.priceShort} pour ${OFFER.durationLabel}, sans reconduction automatique.`,
};

export const dynamic = "force-dynamic";

export default async function CommanderPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const notice = sp.annule ? "Paiement annulé. Vous pouvez réessayer quand vous voulez." : sp.erreur ? "Le paiement n'a pas pu être confirmé. Merci de réessayer." : null;
  const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);
  const demoEnabled = isDemoMode();

  return (
    <div className="relative overflow-hidden pb-10 pt-32">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-violet-300">Commande sécurisée</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Activez votre <span className="text-gradient">numéro Alter</span>
          </h1>
          <p className="mt-3 text-zinc-400">Moins d&apos;une minute. {OFFER.priceShort} pour {OFFER.durationLabel}, sans reconduction automatique.</p>
        </Reveal>
        <CheckoutForm stripeEnabled={stripeEnabled} demoEnabled={demoEnabled} notice={notice} />
      </div>
    </div>
  );
}
